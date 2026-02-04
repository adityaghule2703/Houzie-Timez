import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Modal,
  SafeAreaView,
  Animated,
  RefreshControl,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const BASE_URL = "https://tambolatime.co.in/public/";

// Updated Color scheme matching FAQ and Home
const PRIMARY_COLOR = "#02658D"; // Main background color
const SECONDARY_COLOR = "#02557A"; // Darker blue
const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
const LIGHT_ACCENT = "#FFECB3"; // Very light amber
const TEXT_LIGHT = "#E3F2FD"; // Light blue text
const DARK_BLUE = "#014560"; // Darker blue for backgrounds
const WHITE = "#FFFFFF";

const Profile = ({ onLogout, navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return BASE_URL + cleanPath;
  };

  useEffect(() => {
    fetchProfile();
    requestPermissions();
    fetchNotifications();
    
    // Start fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

 const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      // For Android 13+ (API level 33+), we need to request different permissions
      const androidVersion = Platform.Version;
      
      let permissions = [];
      let permissionKeys = [];
      
      if (androidVersion >= 33) {
        // Android 13+ uses new permission model
        permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ];
        permissionKeys = ['camera', 'readMediaImages'];
      } else {
        // Android < 13 uses old permission model
        permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ];
        permissionKeys = ['camera', 'readExternalStorage', 'writeExternalStorage'];
      }
      
      // First, check which permissions are already granted
      const checks = await Promise.all(
        permissions.map(permission => PermissionsAndroid.check(permission))
      );
      
      const allGranted = checks.every(check => check === true);
      
      if (allGranted) {
        console.log("All permissions already granted");
        return; // All permissions are already granted, no need to request
      }
      
      // Request only the permissions that aren't granted
      const permissionsToRequest = permissions.filter((_, index) => !checks[index]);
      
      if (permissionsToRequest.length === 0) {
        return; // All permissions are granted
      }
      
      const results = await PermissionsAndroid.requestMultiple(permissionsToRequest);
      
      // Check if all requested permissions are granted
      const requestedGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );
      
      if (!requestedGranted) {
        // Check if user denied permanently (shouldShowRequestPermissionRationale returns false)
        const cameraRationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        
        // Only show alert if user denied permanently
        if (!cameraRationale) {
          Alert.alert(
            "Permission Required",
            "This app needs camera and photo library access to update your profile picture. Please enable permissions in app settings.",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === 'android') {
                    Linking.openSettings();
                  }
                }
              }
            ]
          );
        }
      }
    } catch (err) {
      console.warn("Permission error:", err);
      // Don't show alert for permission errors during initial check
    }
  }
  // iOS handles permissions differently - image picker will prompt when needed
};

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfile();
    fetchNotifications();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}api/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.user) {
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || "",
        });
        
        if (res.data.user.profile_image_url) {
          setImageUri(res.data.user.profile_image_url);
        } else if (res.data.user.profile_image) {
          setImageUri(getFullImageUrl(res.data.user.profile_image));
        }
      }
    } catch (error) {
      console.log("Fetch profile error:", error);
      Alert.alert("Error", "Failed to fetch profile information");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        `${BASE_URL}api/user/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        setNotifications(res.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const openNotificationModal = () => {
    setNotificationModalVisible(true);
  };

  const handleImagePick = async (source) => {
    setImageModalVisible(false);
    
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: false,
      selectionLimit: 1,
    };
    
    try {
      let result;
      
      if (source === "camera") {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert("Error", result.errorMessage || "Failed to pick image");
      } else if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImageUri(selectedImage.uri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const updateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required", [{ text: "OK" }]);
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formDataToSend = new FormData();

      // Only send name (email and mobile are not editable)
      formDataToSend.append("name", formData.name);

      if (imageUri && 
          !imageUri.startsWith(BASE_URL) && 
          !imageUri.startsWith('http') &&
          (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
        const localUri = imageUri;
        const filename = localUri.split('/').pop();
        
        let type = 'image/jpeg';
        if (filename) {
          const match = /\.(\w+)$/.exec(filename);
          if (match) {
            type = `image/${match[1]}`;
          }
        }

        formDataToSend.append('profile_image', {
          uri: localUri,
          name: filename || `profile_${Date.now()}.jpg`,
          type,
        });
      }

      const response = await axios.post(
        `${BASE_URL}api/user/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.user) {
        setUser(response.data.user);
        Alert.alert("Success", "Profile updated successfully!");
        setEditMode(false);
        
        if (response.data.user.profile_image_url) {
          setImageUri(response.data.user.profile_image_url);
        } else if (response.data.user.profile_image) {
          setImageUri(getFullImageUrl(response.data.user.profile_image));
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Update error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const logoutUser = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout }
      ]
    );
  };

  const performLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `${BASE_URL}api/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      Alert.alert("Success", "You have been logged out successfully.");
      onLogout();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNavigation = (screenName) => {
    if (navigation && navigation.navigate) {
      navigation.navigate(screenName);
    } else {
      console.warn(`Navigation not available. Attempted to navigate to: ${screenName}`);
      Alert.alert("Info", `${screenName} page will open here`);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        <Icon name="notifications" size={20} color={ACCENT_COLOR} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
        <Text style={styles.notificationMessage}>
          {item.message || "Check out the new features!"}
        </Text>
        <Text style={styles.notificationDate}>
          {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={ACCENT_COLOR}
              colors={[ACCENT_COLOR]}
            />
          }
        >
          {/* HEADER - Blue Background */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerTopRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Icon name="arrow-back" size={24} color={ACCENT_COLOR} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>My Profile</Text>
                
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={openNotificationModal}
                >
                  <Icon name="notifications-outline" size={24} color={ACCENT_COLOR} />
                  {notifications.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notifications.length > 99 ? '99+' : notifications.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.headerSubtitle}>Manage your account settings</Text>
            </View>
          </View>

          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.profilePattern} />
            
            <View style={styles.profileHeader}>
              <TouchableOpacity
                onPress={() => editMode && setImageModalVisible(true)}
                disabled={!editMode}
                style={styles.imageContainer}
              >
                <Image
                  source={{
                    uri: imageUri
                      ? imageUri
                      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
                  }}
                  style={[
                    styles.profileImage,
                    editMode && styles.profileImageEdit,
                  ]}
                  onError={() => setImageUri(null)}
                />
                {editMode && (
                  <View style={styles.editImageBadge}>
                    <Icon name="camera" size={16} color={WHITE} />
                  </View>
                )}
              </TouchableOpacity>

              {editMode ? (
                <View style={styles.nameInputContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Enter your name"
                    placeholderTextColor={LIGHT_ACCENT}
                  />
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
                  <Text style={styles.userRole}>Premium Member</Text>
                </View>
              )}

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[styles.editButton, editMode && styles.saveButton]}
                  onPress={() => {
                    animateButton();
                    if (editMode) {
                      updateProfile();
                    } else {
                      setEditMode(true);
                    }
                  }}
                  disabled={saving}
                >
                  <View style={styles.glassEffectOverlay} />
                  <Icon 
                    name={editMode ? "checkmark" : "pencil"} 
                    size={18} 
                    color={WHITE} 
                  />
                  <Text style={styles.editButtonText}>
                    {saving ? "Saving..." : editMode ? "Save" : "Edit Profile"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {editMode && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditMode(false);
                    setFormData({
                      name: user?.name || "",
                    });
                    if (user?.profile_image_url) {
                      setImageUri(user.profile_image_url);
                    } else if (user?.profile_image) {
                      setImageUri(getFullImageUrl(user.profile_image));
                    } else {
                      setImageUri(null);
                    }
                  }}
                >
                  <Icon name="close" size={18} color={LIGHT_ACCENT} />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ACCOUNT INFORMATION - Email and Mobile are READ ONLY */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="person-circle" size={22} color={ACCENT_COLOR} />
              <Text style={styles.sectionTitle}>Account Information</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoPattern} />
              
              {/* Email - Always Read Only */}
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon name="mail" size={16} color={ACCENT_COLOR} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
                </View>
              </View>
              
              {/* Mobile - Always Read Only */}
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon name="phone-portrait" size={16} color={ACCENT_COLOR} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mobile Number</Text>
                  <Text style={styles.infoValue}>{user?.mobile || "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* REFERRAL & STATS */}
          {!editMode && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="stats-chart" size={22} color={ACCENT_COLOR} />
                <Text style={styles.sectionTitle}>Stats & Referral</Text>
              </View>
              
              <View style={styles.statsCard}>
                <View style={styles.statsPattern} />
                
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Icon name="gift" size={20} color={ACCENT_COLOR} />
                    </View>
                    <Text style={styles.statLabel}>Referral Code</Text>
                    <Text style={styles.statValue}>{user?.referral_code || "N/A"}</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <View style={styles.statIconContainer}>
                      <Icon name="star" size={20} color={ACCENT_COLOR} />
                    </View>
                    <Text style={styles.statLabel}>Referral Points</Text>
                    <Text style={styles.statValue}>{user?.referral_points || "0"}</Text>
                  </View>
                </View>
                
                <View style={styles.additionalInfo}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Icon name="shield-checkmark" size={16} color={ACCENT_COLOR} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Account Status</Text>
                      <Text style={styles.statusValue}>Active</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Icon name="people" size={16} color={ACCENT_COLOR} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Under Referral</Text>
                      <Text style={styles.infoValue}>{user?.under_referral || "N/A"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* SETTINGS OPTIONS */}
          {!editMode && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="settings" size={22} color={ACCENT_COLOR} />
                <Text style={styles.sectionTitle}>Settings</Text>
              </View>
              
              <View style={styles.optionsCard}>
                {[
                  { 
                    icon: "ticket", 
                    title: "My Tickets", 
                    color: ACCENT_COLOR,
                    onPress: () => handleNavigation('TicketsScreen')
                  },
                  { 
                    icon: "notifications", 
                    title: "Notifications", 
                    color: ACCENT_COLOR,
                    onPress: openNotificationModal
                  },
                  { 
                    icon: "lock-closed", 
                    title: "Privacy & Security", 
                    color: ACCENT_COLOR,
                    onPress: () => Alert.alert("Coming Soon", "Privacy & Security settings will be available soon!")
                  },
                  { 
                    icon: "help-circle", 
                    title: "Help & Support", 
                    color: ACCENT_COLOR,
                    onPress: () => Alert.alert("Help & Support", "Contact support@example.com for assistance")
                  },
                ].map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.optionItem}
                    onPress={item.onPress}
                  >
                    <View style={[styles.optionIcon, { backgroundColor: `${ACCENT_COLOR}15` }]}>
                      <Icon name={item.icon} size={22} color={ACCENT_COLOR} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{item.title}</Text>
                      <Text style={styles.optionDescription}>
                        {index === 0 ? "View your game tickets" :
                         index === 1 ? "View all notifications" :
                         index === 2 ? "Security settings" : "Get help & support"}
                      </Text>
                    </View>
                    <Icon name="chevron-forward" size={20} color={ACCENT_COLOR} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* LOGOUT BUTTON */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={logoutUser}
          >
            <View style={styles.glassEffectOverlay} />
            <View style={styles.logoutIcon}>
              <Icon name="log-out" size={22} color={WHITE} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* BOTTOM SPACE */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </Animated.View>

      {/* IMAGE SELECTION MODAL */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalPattern} />
            
            <Text style={styles.modalTitle}>Update Profile Picture</Text>
            <Text style={styles.modalSubtitle}>Choose how you want to update your profile picture</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImagePick("camera")}
            >
              <View style={styles.modalOptionIcon}>
                <Icon name="camera" size={24} color={ACCENT_COLOR} />
              </View>
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionTitle}>Take Photo</Text>
                <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImagePick("gallery")}
            >
              <View style={styles.modalOptionIcon}>
                <Icon name="images" size={24} color={ACCENT_COLOR} />
              </View>
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NOTIFICATION MODAL */}
      <Modal
        visible={notificationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.notificationModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
                <Icon name="close" size={24} color={ACCENT_COLOR} />
              </TouchableOpacity>
            </View>

            {loadingNotifications ? (
              <View style={styles.loadingContainerModal}>
                <ActivityIndicator size="large" color={ACCENT_COLOR} />
                <Text style={styles.loadingTextModal}>Loading notifications...</Text>
              </View>
            ) : notifications.length > 0 ? (
              <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyNotifications}>
                    <Icon name="notifications-off" size={50} color={LIGHT_ACCENT} />
                    <Text style={styles.emptyText}>No notifications yet</Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.emptyNotifications}>
                <Icon name="notifications-off" size={50} color={LIGHT_ACCENT} />
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setNotificationModalVisible(false)}
            >
              <View style={styles.glassEffectOverlay} />
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: LIGHT_ACCENT,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  // Header
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: SECONDARY_COLOR,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_LIGHT,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: WHITE,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: SECONDARY_COLOR,
    fontSize: 10,
    fontWeight: "700",
  },
  profileCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 20,
    marginBottom: 24,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profilePattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 50,
    backgroundColor: 'rgba(255, 213, 79, 0.05)',
  },
  profileHeader: {
    alignItems: "center",
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: ACCENT_COLOR,
    backgroundColor: SECONDARY_COLOR,
  },
  profileImageEdit: {
    borderWidth: 3,
    borderColor: ACCENT_COLOR,
  },
  editImageBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: ACCENT_COLOR,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginBottom: 4,
    textAlign: "center",
  },
  userRole: {
    fontSize: 14,
    color: ACCENT_COLOR,
    fontWeight: "600",
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nameInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_LIGHT,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: ACCENT_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  glassEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#28A745",
    shadowColor: "#28A745",
  },
  editButtonText: {
    color: SECONDARY_COLOR,
    fontWeight: "700",
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 12,
  },
  cancelButtonText: {
    color: LIGHT_ACCENT,
    fontWeight: "500",
    fontSize: 13,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: ACCENT_COLOR,
  },
  infoCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  infoPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 60,
    height: 60,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 213, 79, 0.02)',
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 213, 79, 0.1)",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    marginBottom: 2,
    fontWeight: "500",
    opacity: 0.9,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_LIGHT,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    color: ACCENT_COLOR,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statsCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statsPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 20,
    backgroundColor: 'rgba(255, 213, 79, 0.03)',
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.1)",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DARK_BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.1)",
  },
  statLabel: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    marginBottom: 4,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.9,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_LIGHT,
    textAlign: "center",
  },
  additionalInfo: {
    marginTop: 8,
  },
  optionsCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 213, 79, 0.1)",
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    opacity: 0.8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC3545",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#DC3545",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomSpace: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: DARK_BLUE,
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  notificationModalContent: {
    width: "90%",
    height: "70%",
    maxWidth: "none",
  },
  modalPattern: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 213, 79, 0.05)',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: ACCENT_COLOR,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SECONDARY_COLOR,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.1)",
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DARK_BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.1)",
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  modalOptionDescription: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    opacity: 0.8,
  },
  modalCancelButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.1)",
    marginTop: 8,
  },
  modalCancelText: {
    color: LIGHT_ACCENT,
    fontWeight: "600",
    fontSize: 15,
    opacity: 0.9,
  },
  // Notification Modal Styles
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 213, 79, 0.1)",
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 13,
    color: ACCENT_COLOR,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 11,
    color: LIGHT_ACCENT,
    opacity: 0.8,
  },
  emptyNotifications: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    opacity: 0.7,
    marginTop: 10,
  },
  loadingContainerModal: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingTextModal: {
    marginTop: 10,
    fontSize: 14,
    color: LIGHT_ACCENT,
  },
  closeBtn: {
    backgroundColor: ACCENT_COLOR,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeBtnText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});