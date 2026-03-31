// // // // import React, { useEffect, useState, useRef } from "react";
// // // // import {
// // // //   ScrollView,
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   Image,
// // // //   Alert,
// // // //   StyleSheet,
// // // //   ActivityIndicator,
// // // //   TextInput,
// // // //   Modal,
// // // //   SafeAreaView,
// // // //   Animated,
// // // //   RefreshControl,
// // // //   Dimensions,
// // // //   FlatList,
// // // //   PermissionsAndroid,
// // // //   Platform,
// // // //   Linking,
// // // //   StatusBar,
// // // // } from "react-native";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import axios from "axios";
// // // // import {
// // // //   launchCamera,
// // // //   launchImageLibrary,
// // // // } from 'react-native-image-picker';
// // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // const { width } = Dimensions.get('window');
// // // // const BASE_URL = "https://tambolatime.co.in/public/";

// // // // // Color palette matching Game component
// // // // const COLORS = {
// // // //   background: '#F0F7FF',
// // // //   surface: '#FFFFFF',
// // // //   primary: '#2E5BFF', // Vibrant blue
// // // //   primaryLight: '#E1EBFF',
// // // //   primaryDark: '#1A3A9E',
// // // //   accent: '#3B82F6', // Medium blue for accents
// // // //   secondary: '#60A5FA', // Light blue
// // // //   tertiary: '#2563EB', // Darker blue for contrast
// // // //   text: '#1E293B',
// // // //   textSecondary: '#64748B',
// // // //   textLight: '#94A3B8',
// // // //   border: '#E2E8F0',
  
// // // //   // Card background variants
// // // //   cardBlue1: '#E8F0FE',
// // // //   cardBlue2: '#D4E4FF',
// // // //   cardBlue3: '#C2D6FF',
// // // //   cardBlue4: '#E3F2FD',
// // // //   cardBlue5: '#E6F0FA',
  
// // // //   // Accent colors
// // // //   purple: '#8B5CF6',
// // // //   purpleLight: '#EDE9FE',
// // // //   orange: '#F97316',
// // // //   orangeLight: '#FFF3E6',
// // // //   pink: '#EC4899',
// // // //   pinkLight: '#FCE8F0',
// // // //   teal: '#14B8A6',
// // // //   tealLight: '#D5F5F0',
// // // //   red: '#EF4444',
// // // //   redLight: '#FEE2E2',
// // // //   green: '#10B981',
// // // //   greenLight: '#D1FAE5',
  
// // // //   // Block colors - Blue shades
// // // //   blockLightBlue: '#E1EBFF',
// // // //   blockMediumBlue: '#C2D6FF',
// // // //   blockDarkBlue: '#A3C1FF',
// // // // };

// // // // const Profile = ({ onLogout, navigation }) => {
// // // //   const [user, setUser] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [editMode, setEditMode] = useState(false);
// // // //   const [formData, setFormData] = useState({
// // // //     name: "",
// // // //   });
// // // //   const [imageUri, setImageUri] = useState(null);
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [imageModalVisible, setImageModalVisible] = useState(false);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [notifications, setNotifications] = useState([]);
// // // //   const [notificationModalVisible, setNotificationModalVisible] = useState(false);
// // // //   const [loadingNotifications, setLoadingNotifications] = useState(false);
  
// // // //   // Animation values
// // // //   const scrollY = useRef(new Animated.Value(0)).current;
// // // //   const scaleAnim = useRef(new Animated.Value(1)).current;
// // // //   const fadeAnim = useRef(new Animated.Value(0)).current;

// // // //   // Helper function to get full image URL
// // // //   const getFullImageUrl = (imagePath) => {
// // // //     if (!imagePath) return null;
    
// // // //     if (imagePath.startsWith('http')) {
// // // //       return imagePath;
// // // //     }
    
// // // //     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
// // // //     return BASE_URL + cleanPath;
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchProfile();
// // // //     requestPermissions();
// // // //     fetchNotifications();
    
// // // //     // Start fade animation
// // // //     Animated.timing(fadeAnim, {
// // // //       toValue: 1,
// // // //       duration: 800,
// // // //       useNativeDriver: true,
// // // //     }).start();
// // // //   }, []);

// // // //   // Animated background that moves with scroll
// // // //   const AnimatedBackground = () => {
// // // //     const block1TranslateY = scrollY.interpolate({
// // // //       inputRange: [0, 300],
// // // //       outputRange: [0, -50],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     const block2TranslateY = scrollY.interpolate({
// // // //       inputRange: [0, 400],
// // // //       outputRange: [0, -30],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     const block3TranslateY = scrollY.interpolate({
// // // //       inputRange: [0, 500],
// // // //       outputRange: [0, -20],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     const opacity = scrollY.interpolate({
// // // //       inputRange: [0, 200, 400],
// // // //       outputRange: [1, 0.8, 0.6],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     return (
// // // //       <>
// // // //         <Animated.View 
// // // //           style={[
// // // //             styles.blueBlock1,
// // // //             {
// // // //               transform: [{ translateY: block1TranslateY }],
// // // //               opacity
// // // //             }
// // // //           ]} 
// // // //         />
// // // //         <Animated.View 
// // // //           style={[
// // // //             styles.blueBlock2,
// // // //             {
// // // //               transform: [{ translateY: block2TranslateY }],
// // // //               opacity: opacity.interpolate({
// // // //                 inputRange: [0.6, 1],
// // // //                 outputRange: [0.4, 0.8]
// // // //               })
// // // //             }
// // // //           ]} 
// // // //         />
// // // //         <Animated.View 
// // // //           style={[
// // // //             styles.blueBlock3,
// // // //             {
// // // //               transform: [{ translateY: block3TranslateY }],
// // // //               opacity: opacity.interpolate({
// // // //                 inputRange: [0.6, 1],
// // // //                 outputRange: [0.2, 0.5]
// // // //               })
// // // //             }
// // // //           ]} 
// // // //         />
// // // //       </>
// // // //     );
// // // //   };

// // // //   // Card Background with only circles (removed all patterns)
// // // //   const CardBackground = ({ accentColor = COLORS.primary }) => (
// // // //     <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
// // // //       {/* Decorative circles only */}
// // // //       <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
// // // //       <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
// // // //       <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
// // // //       {/* Floating particles - subtle dots */}
// // // //       <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
// // // //       <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
// // // //       <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
// // // //       <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
// // // //     </View>
// // // //   );

// // // //   // Enhanced Header with UK pattern (keeping header pattern as it's not on cards)
// // // //   const Header = () => (
// // // //     <View style={styles.headerWrapper}>
// // // //       {/* Semicircle Background */}
// // // //       <View style={styles.semicircleBackground}>
// // // //         <View style={styles.semicircle} />
// // // //       </View>
      
// // // //       {/* UK-style Rounded Lines Pattern (only in header) */}
// // // //       <View style={styles.ukPatternContainer}>
// // // //         <View style={styles.curvedLine1} />
// // // //         <View style={styles.curvedLine2} />
// // // //         <View style={styles.curvedLine3} />
        
// // // //         <View style={styles.parallelLines}>
// // // //           <View style={styles.parallelLine} />
// // // //           <View style={styles.parallelLine} />
// // // //           <View style={styles.parallelLine} />
// // // //         </View>
        
// // // //         <View style={styles.dottedCircle1}>
// // // //           {[...Array(8)].map((_, i) => (
// // // //             <View 
// // // //               key={i} 
// // // //               style={[
// // // //                 styles.dottedCircleDot,
// // // //                 {
// // // //                   transform: [
// // // //                     { rotate: `${i * 45}deg` },
// // // //                     { translateX: 30 }
// // // //                   ]
// // // //                 }
// // // //               ]} 
// // // //             />
// // // //           ))}
// // // //         </View>
        
// // // //         <View style={styles.decorativeDot1} />
// // // //         <View style={styles.decorativeDot2} />
// // // //         <View style={styles.decorativeLine1} />
// // // //         <View style={styles.decorativeLine2} />
// // // //       </View>

// // // //       {/* Header Content */}
// // // //       <View style={styles.headerContent}>
// // // //         <View style={styles.headerTopRow}>
// // // //           <TouchableOpacity
// // // //             style={styles.backButton}
// // // //             onPress={() => navigation.goBack()}
// // // //           >
// // // //             <Icon name="arrow-back" size={22} color={COLORS.primary} />
// // // //           </TouchableOpacity>
          
// // // //           <Text style={styles.headerTitle}>My Profile</Text>
          
// // // //           <TouchableOpacity
// // // //             style={styles.notificationButton}
// // // //             onPress={openNotificationModal}
// // // //           >
// // // //             <Icon name="notifications-outline" size={22} color={COLORS.primary} />
// // // //             {notifications.length > 0 && (
// // // //               <View style={styles.badge}>
// // // //                 <Text style={styles.badgeText}>
// // // //                   {notifications.length > 99 ? '99+' : notifications.length}
// // // //                 </Text>
// // // //               </View>
// // // //             )}
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //         <Text style={styles.headerSubtitle}>Manage your account settings</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const animateButton = () => {
// // // //     Animated.sequence([
// // // //       Animated.timing(scaleAnim, {
// // // //         toValue: 0.95,
// // // //         duration: 100,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //       Animated.timing(scaleAnim, {
// // // //         toValue: 1,
// // // //         duration: 100,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //     ]).start();
// // // //   };

// // // //   const requestPermissions = async () => {
// // // //     if (Platform.OS === 'android') {
// // // //       try {
// // // //         const androidVersion = Platform.Version;
        
// // // //         let permissions = [];
        
// // // //         if (androidVersion >= 33) {
// // // //           permissions = [
// // // //             PermissionsAndroid.PERMISSIONS.CAMERA,
// // // //             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
// // // //           ];
// // // //         } else {
// // // //           permissions = [
// // // //             PermissionsAndroid.PERMISSIONS.CAMERA,
// // // //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// // // //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
// // // //           ];
// // // //         }
        
// // // //         const checks = await Promise.all(
// // // //           permissions.map(permission => PermissionsAndroid.check(permission))
// // // //         );
        
// // // //         const allGranted = checks.every(check => check === true);
        
// // // //         if (allGranted) {
// // // //           return;
// // // //         }
        
// // // //         const permissionsToRequest = permissions.filter((_, index) => !checks[index]);
        
// // // //         if (permissionsToRequest.length === 0) {
// // // //           return;
// // // //         }
        
// // // //         const results = await PermissionsAndroid.requestMultiple(permissionsToRequest);
        
// // // //         const requestedGranted = Object.values(results).every(
// // // //           result => result === PermissionsAndroid.RESULTS.GRANTED
// // // //         );
        
// // // //         if (!requestedGranted) {
// // // //           const cameraRationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
// // // //             PermissionsAndroid.PERMISSIONS.CAMERA
// // // //           );
          
// // // //           if (!cameraRationale) {
// // // //             Alert.alert(
// // // //               "Permission Required",
// // // //               "This app needs camera and photo library access to update your profile picture. Please enable permissions in app settings.",
// // // //               [
// // // //                 {
// // // //                   text: "Cancel",
// // // //                   style: "cancel"
// // // //                 },
// // // //                 {
// // // //                   text: "Open Settings",
// // // //                   onPress: () => {
// // // //                     if (Platform.OS === 'android') {
// // // //                       Linking.openSettings();
// // // //                     }
// // // //                   }
// // // //                 }
// // // //               ]
// // // //             );
// // // //           }
// // // //         }
// // // //       } catch (err) {
// // // //         console.warn("Permission error:", err);
// // // //       }
// // // //     }
// // // //   };

// // // //   const onRefresh = React.useCallback(() => {
// // // //     setRefreshing(true);
// // // //     fetchProfile();
// // // //     fetchNotifications();
// // // //     setTimeout(() => setRefreshing(false), 1000);
// // // //   }, []);

// // // //   const fetchProfile = async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       const res = await axios.get(
// // // //         `${BASE_URL}api/user/profile`,
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
      
// // // //       if (res.data.user) {
// // // //         setUser(res.data.user);
// // // //         setFormData({
// // // //           name: res.data.user.name || "",
// // // //         });
        
// // // //         if (res.data.user.profile_image_url) {
// // // //           setImageUri(res.data.user.profile_image_url);
// // // //         } else if (res.data.user.profile_image) {
// // // //           setImageUri(getFullImageUrl(res.data.user.profile_image));
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Fetch profile error:", error);
// // // //       Alert.alert("Error", "Failed to fetch profile information");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const fetchNotifications = async () => {
// // // //     try {
// // // //       setLoadingNotifications(true);
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       if (!token) return;
// // // //       const res = await axios.get(
// // // //         `${BASE_URL}api/user/notifications`,
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       if (res.data.status) {
// // // //         setNotifications(res.data.data || []);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching notifications:", error);
// // // //     } finally {
// // // //       setLoadingNotifications(false);
// // // //     }
// // // //   };

// // // //   const openNotificationModal = () => {
// // // //     setNotificationModalVisible(true);
// // // //   };

// // // //   const handleImagePick = async (source) => {
// // // //     setImageModalVisible(false);
    
// // // //     const options = {
// // // //       mediaType: 'photo',
// // // //       maxWidth: 500,
// // // //       maxHeight: 500,
// // // //       quality: 0.8,
// // // //       includeBase64: false,
// // // //       saveToPhotos: false,
// // // //       selectionLimit: 1,
// // // //     };
    
// // // //     try {
// // // //       let result;
      
// // // //       if (source === "camera") {
// // // //         result = await launchCamera(options);
// // // //       } else {
// // // //         result = await launchImageLibrary(options);
// // // //       }

// // // //       if (result.didCancel) {
// // // //         console.log('User cancelled image picker');
// // // //       } else if (result.errorCode) {
// // // //         console.log('ImagePicker Error: ', result.errorMessage);
// // // //         Alert.alert("Error", result.errorMessage || "Failed to pick image");
// // // //       } else if (result.assets && result.assets.length > 0) {
// // // //         const selectedImage = result.assets[0];
// // // //         setImageUri(selectedImage.uri);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Image picker error:", error);
// // // //       Alert.alert("Error", "Failed to pick image");
// // // //     }
// // // //   };

// // // //   const updateProfile = async () => {
// // // //     if (!formData.name.trim()) {
// // // //       Alert.alert("Error", "Name is required", [{ text: "OK" }]);
// // // //       return;
// // // //     }

// // // //     setSaving(true);
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       const formDataToSend = new FormData();

// // // //       formDataToSend.append("name", formData.name);

// // // //       if (imageUri && 
// // // //           !imageUri.startsWith(BASE_URL) && 
// // // //           !imageUri.startsWith('http') &&
// // // //           (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
// // // //         const localUri = imageUri;
// // // //         const filename = localUri.split('/').pop();
        
// // // //         let type = 'image/jpeg';
// // // //         if (filename) {
// // // //           const match = /\.(\w+)$/.exec(filename);
// // // //           if (match) {
// // // //             type = `image/${match[1]}`;
// // // //           }
// // // //         }

// // // //         formDataToSend.append('profile_image', {
// // // //           uri: localUri,
// // // //           name: filename || `profile_${Date.now()}.jpg`,
// // // //           type,
// // // //         });
// // // //       }

// // // //       const response = await axios.post(
// // // //         `${BASE_URL}api/user/profile`,
// // // //         formDataToSend,
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //             'Content-Type': 'multipart/form-data',
// // // //           },
// // // //         }
// // // //       );

// // // //       if (response.data.user) {
// // // //         setUser(response.data.user);
// // // //         Alert.alert("Success", "Profile updated successfully!");
// // // //         setEditMode(false);
        
// // // //         if (response.data.user.profile_image_url) {
// // // //           setImageUri(response.data.user.profile_image_url);
// // // //         } else if (response.data.user.profile_image) {
// // // //           setImageUri(getFullImageUrl(response.data.user.profile_image));
// // // //         }
// // // //       } else {
// // // //         throw new Error("Invalid response format");
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Update error:", error.response?.data || error.message);
// // // //       Alert.alert(
// // // //         "Error",
// // // //         error.response?.data?.message || "Failed to update profile"
// // // //       );
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const logoutUser = async () => {
// // // //     Alert.alert(
// // // //       "Logout",
// // // //       "Are you sure you want to logout?",
// // // //       [
// // // //         { text: "Cancel", style: "cancel" },
// // // //         { text: "Logout", style: "destructive", onPress: performLogout }
// // // //       ]
// // // //     );
// // // //   };

// // // //   const performLogout = async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");

// // // //       await axios.post(
// // // //         `${BASE_URL}api/user/logout`,
// // // //         {},
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );

// // // //       await AsyncStorage.removeItem("token");
// // // //       await AsyncStorage.removeItem("user");

// // // //       Alert.alert("Success", "You have been logged out successfully.");
// // // //       onLogout();
// // // //     } catch (error) {
// // // //       console.log(error);
// // // //       Alert.alert("Error", "Something went wrong. Please try again.");
// // // //     }
// // // //   };

// // // //   const handleInputChange = (field, value) => {
// // // //     setFormData((prev) => ({
// // // //       ...prev,
// // // //       [field]: value,
// // // //     }));
// // // //   };

// // // //   const handleNavigation = (screenName) => {
// // // //     if (navigation && navigation.navigate) {
// // // //       navigation.navigate(screenName);
// // // //     } else {
// // // //       console.warn(`Navigation not available. Attempted to navigate to: ${screenName}`);
// // // //       Alert.alert("Info", `${screenName} page will open here`);
// // // //     }
// // // //   };

// // // //   const renderNotificationItem = ({ item }) => (
// // // //     <View style={styles.notificationItem}>
// // // //       <View style={[styles.notificationIcon, { backgroundColor: `${COLORS.primary}15` }]}>
// // // //         <Icon name="notifications" size={18} color={COLORS.primary} />
// // // //       </View>
// // // //       <View style={styles.notificationContent}>
// // // //         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // // //         <Text style={styles.notificationMessage}>
// // // //           {item.message || "Check out the new features!"}
// // // //         </Text>
// // // //         <Text style={styles.notificationDate}>
// // // //           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // // //         </Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const handleScroll = Animated.event(
// // // //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // // //     { useNativeDriver: false }
// // // //   );

// // // //   if (loading) {
// // // //     return (
// // // //       <SafeAreaView style={styles.safeArea}>
// // // //         <View style={styles.loadingContainer}>
// // // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // // //           <Text style={styles.loadingText}>Loading Profile...</Text>
// // // //         </View>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
// // // //       {/* Animated Color Blocks */}
// // // //       <AnimatedBackground />

// // // //       <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
// // // //         <Animated.ScrollView
// // // //           showsVerticalScrollIndicator={false}
// // // //           onScroll={handleScroll}
// // // //           scrollEventThrottle={16}
// // // //           refreshControl={
// // // //             <RefreshControl
// // // //               refreshing={refreshing}
// // // //               onRefresh={onRefresh}
// // // //               tintColor={COLORS.primary}
// // // //               colors={[COLORS.primary]}
// // // //             />
// // // //           }
// // // //         >
// // // //           {/* Enhanced Header */}
// // // //           <Header />

// // // //           {/* PROFILE CARD */}
// // // //           <View style={styles.profileCard}>
// // // //             <CardBackground accentColor={COLORS.primary} />
            
// // // //             <View style={styles.profileHeader}>
// // // //               <TouchableOpacity
// // // //                 onPress={() => editMode && setImageModalVisible(true)}
// // // //                 disabled={!editMode}
// // // //                 style={styles.imageContainer}
// // // //               >
// // // //                 <Image
// // // //                   source={{
// // // //                     uri: imageUri
// // // //                       ? imageUri
// // // //                       : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
// // // //                   }}
// // // //                   style={[
// // // //                     styles.profileImage,
// // // //                     editMode && styles.profileImageEdit,
// // // //                   ]}
// // // //                   onError={() => setImageUri(null)}
// // // //                 />
// // // //                 {editMode && (
// // // //                   <View style={[styles.editImageBadge, { backgroundColor: COLORS.primary }]}>
// // // //                     <Icon name="camera" size={14} color="#FFFFFF" />
// // // //                   </View>
// // // //                 )}
// // // //               </TouchableOpacity>

// // // //               {editMode ? (
// // // //                 <View style={styles.nameInputContainer}>
// // // //                   <TextInput
// // // //                     style={styles.nameInput}
// // // //                     value={formData.name}
// // // //                     onChangeText={(text) => handleInputChange("name", text)}
// // // //                     placeholder="Enter your name"
// // // //                     placeholderTextColor={COLORS.textLight}
// // // //                   />
// // // //                 </View>
// // // //               ) : (
// // // //                 <View style={styles.nameContainer}>
// // // //                   <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
// // // //                   <View style={[styles.userRoleBadge, { backgroundColor: `${COLORS.primary}15` }]}>
// // // //                     <Icon name="star" size={12} color={COLORS.primary} />
// // // //                     <Text style={[styles.userRole, { color: COLORS.primary }]}>Premium Member</Text>
// // // //                   </View>
// // // //                 </View>
// // // //               )}

// // // //               <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // //                 <TouchableOpacity
// // // //                   style={[styles.editButton, editMode && { backgroundColor: COLORS.green }]}
// // // //                   onPress={() => {
// // // //                     animateButton();
// // // //                     if (editMode) {
// // // //                       updateProfile();
// // // //                     } else {
// // // //                       setEditMode(true);
// // // //                     }
// // // //                   }}
// // // //                   disabled={saving}
// // // //                 >
// // // //                   <Icon 
// // // //                     name={editMode ? "checkmark" : "pencil"} 
// // // //                     size={16} 
// // // //                     color="#FFFFFF" 
// // // //                   />
// // // //                   <Text style={styles.editButtonText}>
// // // //                     {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
// // // //                   </Text>
// // // //                 </TouchableOpacity>
// // // //               </Animated.View>

// // // //               {editMode && (
// // // //                 <TouchableOpacity
// // // //                   style={styles.cancelButton}
// // // //                   onPress={() => {
// // // //                     setEditMode(false);
// // // //                     setFormData({
// // // //                       name: user?.name || "",
// // // //                     });
// // // //                     if (user?.profile_image_url) {
// // // //                       setImageUri(user.profile_image_url);
// // // //                     } else if (user?.profile_image) {
// // // //                       setImageUri(getFullImageUrl(user.profile_image));
// // // //                     } else {
// // // //                       setImageUri(null);
// // // //                     }
// // // //                   }}
// // // //                 >
// // // //                   <Icon name="close" size={16} color={COLORS.textLight} />
// // // //                   <Text style={styles.cancelButtonText}>Cancel</Text>
// // // //                 </TouchableOpacity>
// // // //               )}
// // // //             </View>
// // // //           </View>

// // // //           {/* ACCOUNT INFORMATION */}
// // // //           <View style={styles.section}>
// // // //             <View style={styles.sectionHeader}>
// // // //               <Icon name="person-circle" size={20} color={COLORS.primary} />
// // // //               <Text style={styles.sectionTitle}>Account Information</Text>
// // // //             </View>
            
// // // //             <View style={styles.infoCard}>
// // // //               <CardBackground accentColor={COLORS.purple} />
              
// // // //               <View style={styles.infoRow}>
// // // //                 <View style={[styles.infoIcon, { backgroundColor: `${COLORS.primary}15` }]}>
// // // //                   <Icon name="mail" size={16} color={COLORS.primary} />
// // // //                 </View>
// // // //                 <View style={styles.infoContent}>
// // // //                   <Text style={styles.infoLabel}>Email Address</Text>
// // // //                   <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
// // // //                 </View>
// // // //               </View>
              
// // // //               <View style={styles.infoDivider} />
              
// // // //               <View style={styles.infoRow}>
// // // //                 <View style={[styles.infoIcon, { backgroundColor: `${COLORS.purple}15` }]}>
// // // //                   <Icon name="phone-portrait" size={16} color={COLORS.purple} />
// // // //                 </View>
// // // //                 <View style={styles.infoContent}>
// // // //                   <Text style={styles.infoLabel}>Mobile Number</Text>
// // // //                   <Text style={styles.infoValue}>{user?.mobile || "N/A"}</Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           </View>

// // // //           {/* REFERRAL & STATS */}
// // // //           {!editMode && (
// // // //             <View style={styles.section}>
// // // //               <View style={styles.sectionHeader}>
// // // //                 <Icon name="stats-chart" size={20} color={COLORS.primary} />
// // // //                 <Text style={styles.sectionTitle}>Stats & Referral</Text>
// // // //               </View>
              
// // // //               <View style={styles.statsCard}>
// // // //                 <CardBackground accentColor={COLORS.teal} />
                
// // // //                 <View style={styles.statsGrid}>
// // // //                   <View style={styles.statItem}>
// // // //                     <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
// // // //                       <Icon name="gift" size={20} color={COLORS.primary} />
// // // //                     </View>
// // // //                     <Text style={styles.statLabel}>Referral Code</Text>
// // // //                     <View style={styles.statValueContainer}>
// // // //                       <Text style={styles.statValue}>{user?.referral_code || "N/A"}</Text>
// // // //                       <TouchableOpacity style={styles.copyButton}>
// // // //                         <Icon name="copy-outline" size={14} color={COLORS.primary} />
// // // //                       </TouchableOpacity>
// // // //                     </View>
// // // //                   </View>
                  
// // // //                   <View style={styles.statItem}>
// // // //                     <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.purple}15` }]}>
// // // //                       <Icon name="star" size={20} color={COLORS.purple} />
// // // //                     </View>
// // // //                     <Text style={styles.statLabel}>Referral Points</Text>
// // // //                     <Text style={styles.statValue}>{user?.referral_points || "0"}</Text>
// // // //                   </View>
// // // //                 </View>
                
// // // //                 <View style={styles.infoDivider} />
                
// // // //                 <View style={styles.infoRow}>
// // // //                   <View style={[styles.infoIcon, { backgroundColor: `${COLORS.green}15` }]}>
// // // //                     <Icon name="shield-checkmark" size={16} color={COLORS.green} />
// // // //                   </View>
// // // //                   <View style={styles.infoContent}>
// // // //                     <Text style={styles.infoLabel}>Account Status</Text>
// // // //                     <View style={[styles.statusBadge, { backgroundColor: `${COLORS.green}15` }]}>
// // // //                       <Text style={[styles.statusText, { color: COLORS.green }]}>Active</Text>
// // // //                     </View>
// // // //                   </View>
// // // //                 </View>
                
// // // //                 <View style={styles.infoRow}>
// // // //                   <View style={[styles.infoIcon, { backgroundColor: `${COLORS.orange}15` }]}>
// // // //                     <Icon name="people" size={16} color={COLORS.orange} />
// // // //                   </View>
// // // //                   <View style={styles.infoContent}>
// // // //                     <Text style={styles.infoLabel}>Under Referral</Text>
// // // //                     <Text style={styles.infoValue}>{user?.under_referral || "N/A"}</Text>
// // // //                   </View>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           )}

// // // //           {/* SETTINGS OPTIONS */}
// // // //           {!editMode && (
// // // //             <View style={styles.section}>
// // // //               <View style={styles.sectionHeader}>
// // // //                 <Icon name="settings" size={20} color={COLORS.primary} />
// // // //                 <Text style={styles.sectionTitle}>Settings</Text>
// // // //               </View>
              
// // // //               <View style={styles.optionsCard}>
// // // //                 <CardBackground accentColor={COLORS.orange} />
                
// // // //                 {[
// // // //                   { 
// // // //                     icon: "ticket", 
// // // //                     title: "My Tickets", 
// // // //                     description: "View your game tickets",
// // // //                     color: COLORS.primary,
// // // //                     onPress: () => handleNavigation('TicketsScreen')
// // // //                   },
// // // //                   { 
// // // //                     icon: "notifications", 
// // // //                     title: "Notifications", 
// // // //                     description: "View all notifications",
// // // //                     color: COLORS.purple,
// // // //                     onPress: openNotificationModal
// // // //                   },
// // // //                   { 
// // // //                     icon: "lock-closed", 
// // // //                     title: "Privacy & Security", 
// // // //                     description: "Security settings",
// // // //                     color: COLORS.teal,
// // // //                     onPress: () => Alert.alert("Coming Soon", "Privacy & Security settings will be available soon!")
// // // //                   },
// // // //                   { 
// // // //                     icon: "help-circle", 
// // // //                     title: "Help & Support", 
// // // //                     description: "Get help & support",
// // // //                     color: COLORS.orange,
// // // //                     onPress: () => Alert.alert("Help & Support", "Contact support@example.com for assistance")
// // // //                   },
// // // //                 ].map((item, index) => (
// // // //                   <TouchableOpacity 
// // // //                     key={index} 
// // // //                     style={styles.optionItem}
// // // //                     onPress={item.onPress}
// // // //                   >
// // // //                     <View style={[styles.optionIcon, { backgroundColor: `${item.color}15` }]}>
// // // //                       <Icon name={item.icon} size={20} color={item.color} />
// // // //                     </View>
// // // //                     <View style={styles.optionContent}>
// // // //                       <Text style={styles.optionTitle}>{item.title}</Text>
// // // //                       <Text style={styles.optionDescription}>{item.description}</Text>
// // // //                     </View>
// // // //                     <Icon name="chevron-forward" size={18} color={COLORS.textLight} />
// // // //                   </TouchableOpacity>
// // // //                 ))}
// // // //               </View>
// // // //             </View>
// // // //           )}

// // // //           {/* LOGOUT BUTTON */}
// // // //           <TouchableOpacity 
// // // //             style={styles.logoutButton}
// // // //             onPress={logoutUser}
// // // //           >
// // // //             <View style={[styles.logoutIcon, { backgroundColor: `${COLORS.red}20` }]}>
// // // //               <Icon name="log-out" size={20} color={COLORS.red} />
// // // //             </View>
// // // //             <Text style={styles.logoutText}>Logout</Text>
// // // //           </TouchableOpacity>

// // // //           {/* BOTTOM SPACE */}
// // // //           <View style={styles.bottomSpace} />
// // // //         </Animated.ScrollView>
// // // //       </Animated.View>

// // // //       {/* IMAGE SELECTION MODAL */}
// // // //       <Modal
// // // //         visible={imageModalVisible}
// // // //         transparent={true}
// // // //         animationType="fade"
// // // //         onRequestClose={() => setImageModalVisible(false)}
// // // //       >
// // // //         <View style={styles.modalOverlay}>
// // // //           <View style={styles.modalContent}>
// // // //             <CardBackground accentColor={COLORS.primary} />
            
// // // //             <Text style={styles.modalTitle}>Update Profile Picture</Text>
// // // //             <Text style={styles.modalSubtitle}>Choose how you want to update your profile picture</Text>
            
// // // //             <TouchableOpacity
// // // //               style={styles.modalOption}
// // // //               onPress={() => handleImagePick("camera")}
// // // //             >
// // // //               <View style={[styles.modalOptionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
// // // //                 <Icon name="camera" size={22} color={COLORS.primary} />
// // // //               </View>
// // // //               <View style={styles.modalOptionContent}>
// // // //                 <Text style={styles.modalOptionTitle}>Take Photo</Text>
// // // //                 <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
// // // //               </View>
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity
// // // //               style={styles.modalOption}
// // // //               onPress={() => handleImagePick("gallery")}
// // // //             >
// // // //               <View style={[styles.modalOptionIcon, { backgroundColor: `${COLORS.purple}15` }]}>
// // // //                 <Icon name="images" size={22} color={COLORS.purple} />
// // // //               </View>
// // // //               <View style={styles.modalOptionContent}>
// // // //                 <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
// // // //                 <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
// // // //               </View>
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity
// // // //               style={styles.modalCancelButton}
// // // //               onPress={() => setImageModalVisible(false)}
// // // //             >
// // // //               <Text style={styles.modalCancelText}>Cancel</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>

// // // //       {/* NOTIFICATION MODAL */}
// // // //       <Modal
// // // //         visible={notificationModalVisible}
// // // //         transparent={true}
// // // //         animationType="slide"
// // // //         onRequestClose={() => setNotificationModalVisible(false)}
// // // //       >
// // // //         <View style={styles.modalOverlay}>
// // // //           <View style={[styles.modalContent, styles.notificationModalContent]}>
// // // //             <CardBackground accentColor={COLORS.primary} />
            
// // // //             <View style={styles.modalHeader}>
// // // //               <Text style={styles.modalTitle}>Notifications</Text>
// // // //               <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
// // // //                 <Icon name="close" size={22} color={COLORS.text} />
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             {loadingNotifications ? (
// // // //               <View style={styles.loadingContainerModal}>
// // // //                 <ActivityIndicator size="large" color={COLORS.primary} />
// // // //                 <Text style={styles.loadingTextModal}>Loading notifications...</Text>
// // // //               </View>
// // // //             ) : notifications.length > 0 ? (
// // // //               <FlatList
// // // //                 data={notifications}
// // // //                 renderItem={renderNotificationItem}
// // // //                 keyExtractor={(item, index) => index.toString()}
// // // //                 showsVerticalScrollIndicator={false}
// // // //                 contentContainerStyle={styles.notificationList}
// // // //               />
// // // //             ) : (
// // // //               <View style={styles.emptyNotifications}>
// // // //                 <Icon name="notifications-off" size={40} color={COLORS.textLight} />
// // // //                 <Text style={styles.emptyText}>No notifications yet</Text>
// // // //               </View>
// // // //             )}

// // // //             <TouchableOpacity
// // // //               style={[styles.closeBtn, { backgroundColor: COLORS.primary }]}
// // // //               onPress={() => setNotificationModalVisible(false)}
// // // //             >
// // // //               <Text style={styles.closeBtnText}>Close</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // export default Profile;

// // // // const styles = StyleSheet.create({
// // // //   safeArea: {
// // // //     flex: 1,
// // // //     backgroundColor: COLORS.background,
// // // //   },
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     backgroundColor: COLORS.background,
// // // //   },
// // // //   loadingText: {
// // // //     marginTop: 16,
// // // //     fontSize: 14,
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //   },
// // // //   content: {
// // // //     flex: 1,
// // // //   },
  
// // // //   /* COLOR BLOCKS - Animated */
// // // //   blueBlock1: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 280,
// // // //     backgroundColor: COLORS.blockLightBlue,
// // // //     borderBottomLeftRadius: 50,
// // // //     borderBottomRightRadius: 50,
// // // //   },
// // // //   blueBlock2: {
// // // //     position: 'absolute',
// // // //     top: 200,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 160,
// // // //     backgroundColor: COLORS.blockMediumBlue,
// // // //   },
// // // //   blueBlock3: {
// // // //     position: 'absolute',
// // // //     top: 300,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 100,
// // // //     backgroundColor: COLORS.blockDarkBlue,
// // // //     opacity: 0.3,
// // // //   },
  
// // // //   /* Card Background */
// // // //   cardBackground: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     borderRadius: 20,
// // // //   },
  
// // // //   /* Decorative circles */
// // // //   cardDecorativeCircle: {
// // // //     position: 'absolute',
// // // //     width: 100,
// // // //     height: 100,
// // // //     borderRadius: 50,
// // // //     opacity: 0.08,
// // // //   },
// // // //   circle1: {
// // // //     top: -30,
// // // //     right: -30,
// // // //     width: 150,
// // // //     height: 150,
// // // //     borderRadius: 75,
// // // //   },
// // // //   circle2: {
// // // //     bottom: -20,
// // // //     left: -20,
// // // //     width: 120,
// // // //     height: 120,
// // // //     borderRadius: 60,
// // // //     opacity: 0.06,
// // // //   },
// // // //   circle3: {
// // // //     top: '40%',
// // // //     left: '30%',
// // // //     width: 80,
// // // //     height: 80,
// // // //     borderRadius: 40,
// // // //     opacity: 0.05,
// // // //   },
  
// // // //   /* Floating particles */
// // // //   floatingParticle: {
// // // //     position: 'absolute',
// // // //     width: 4,
// // // //     height: 4,
// // // //     borderRadius: 2,
// // // //     opacity: 0.12,
// // // //   },
// // // //   particle1: {
// // // //     top: 20,
// // // //     right: 40,
// // // //     width: 6,
// // // //     height: 6,
// // // //   },
// // // //   particle2: {
// // // //     bottom: 30,
// // // //     left: 50,
// // // //     width: 5,
// // // //     height: 5,
// // // //   },
// // // //   particle3: {
// // // //     top: '60%',
// // // //     right: 60,
// // // //     width: 7,
// // // //     height: 7,
// // // //   },
// // // //   particle4: {
// // // //     bottom: '20%',
// // // //     left: 80,
// // // //     width: 4,
// // // //     height: 4,
// // // //   },
  
// // // //   /* Enhanced Header */
// // // //   headerWrapper: {
// // // //     position: 'relative',
// // // //     marginTop: 8,
// // // //     marginBottom: 16,
// // // //     overflow: 'hidden',
// // // //     paddingHorizontal: 16,
// // // //   },
  
// // // //   semicircleBackground: {
// // // //     position: 'absolute',
// // // //     top: -40,
// // // //     right: -30,
// // // //     width: 200,
// // // //     height: 200,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   semicircle: {
// // // //     position: 'absolute',
// // // //     width: 400,
// // // //     height: 200,
// // // //     backgroundColor: COLORS.primaryLight,
// // // //     borderTopLeftRadius: 200,
// // // //     borderTopRightRadius: 200,
// // // //     transform: [{ rotate: '-15deg' }],
// // // //     opacity: 0.3,
// // // //   },
  
// // // //   ukPatternContainer: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //   },
  
// // // //   curvedLine1: {
// // // //     position: 'absolute',
// // // //     top: 20,
// // // //     right: 50,
// // // //     width: 80,
// // // //     height: 40,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     borderTopWidth: 0,
// // // //     borderRightWidth: 0,
// // // //     borderRadius: 40,
// // // //     opacity: 0.15,
// // // //     transform: [{ rotate: '-10deg' }],
// // // //   },
// // // //   curvedLine2: {
// // // //     position: 'absolute',
// // // //     bottom: 10,
// // // //     left: 30,
// // // //     width: 60,
// // // //     height: 30,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     borderBottomWidth: 0,
// // // //     borderLeftWidth: 0,
// // // //     borderRadius: 30,
// // // //     opacity: 0.15,
// // // //     transform: [{ rotate: '15deg' }],
// // // //   },
// // // //   curvedLine3: {
// // // //     position: 'absolute',
// // // //     top: 40,
// // // //     left: 100,
// // // //     width: 100,
// // // //     height: 50,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     borderTopWidth: 0,
// // // //     borderLeftWidth: 0,
// // // //     borderRadius: 50,
// // // //     opacity: 0.1,
// // // //     transform: [{ rotate: '20deg' }],
// // // //   },
  
// // // //   parallelLines: {
// // // //     position: 'absolute',
// // // //     top: 30,
// // // //     left: 20,
// // // //   },
// // // //   parallelLine: {
// // // //     width: 80,
// // // //     height: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.1,
// // // //     marginVertical: 4,
// // // //     borderRadius: 1,
// // // //   },
  
// // // //   dottedCircle1: {
// // // //     position: 'absolute',
// // // //     bottom: 20,
// // // //     right: 30,
// // // //     width: 60,
// // // //     height: 60,
// // // //   },
// // // //   dottedCircleDot: {
// // // //     position: 'absolute',
// // // //     width: 4,
// // // //     height: 4,
// // // //     borderRadius: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.2,
// // // //     top: 28,
// // // //     left: 28,
// // // //   },
  
// // // //   decorativeDot1: {
// // // //     position: 'absolute',
// // // //     top: 60,
// // // //     right: 80,
// // // //     width: 6,
// // // //     height: 6,
// // // //     borderRadius: 3,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.2,
// // // //   },
// // // //   decorativeDot2: {
// // // //     position: 'absolute',
// // // //     bottom: 40,
// // // //     left: 150,
// // // //     width: 8,
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.15,
// // // //   },
// // // //   decorativeLine1: {
// // // //     position: 'absolute',
// // // //     top: 10,
// // // //     left: 150,
// // // //     width: 40,
// // // //     height: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.1,
// // // //     borderRadius: 1,
// // // //     transform: [{ rotate: '30deg' }],
// // // //   },
// // // //   decorativeLine2: {
// // // //     position: 'absolute',
// // // //     bottom: 30,
// // // //     right: 100,
// // // //     width: 50,
// // // //     height: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.1,
// // // //     borderRadius: 1,
// // // //     transform: [{ rotate: '-20deg' }],
// // // //   },
  
// // // //   headerContent: {
// // // //     position: 'relative',
// // // //     zIndex: 2,
// // // //     marginTop: 7
// // // //   },
// // // //   headerTopRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     marginBottom: 8,
// // // //   },
// // // //   backButton: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 12,
// // // //     backgroundColor: COLORS.surface,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   headerTitle: {
// // // //     fontSize: 20,
// // // //     fontWeight: "700",
// // // //     color: COLORS.text,
// // // //   },
// // // //   headerSubtitle: {
// // // //     fontSize: 13,
// // // //     color: COLORS.textSecondary,
// // // //     fontWeight: "500",
// // // //     marginLeft: 4,
// // // //   },
// // // //   notificationButton: {
// // // //     position: "relative",
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 12,
// // // //     backgroundColor: COLORS.surface,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   badge: {
// // // //     position: "absolute",
// // // //     top: -4,
// // // //     right: -4,
// // // //     backgroundColor: COLORS.red,
// // // //     borderRadius: 10,
// // // //     minWidth: 18,
// // // //     height: 18,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     borderWidth: 1.5,
// // // //     borderColor: COLORS.surface,
// // // //     paddingHorizontal: 3,
// // // //   },
// // // //   badgeText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 9,
// // // //     fontWeight: "700",
// // // //   },
  
// // // //   /* Profile Card */
// // // //   profileCard: {
// // // //     borderRadius: 20,
// // // //     marginHorizontal: 16,
// // // //     marginBottom: 24,
// // // //     padding: 20,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     elevation: 4,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.surface,
// // // //   },
// // // //   profileHeader: {
// // // //     alignItems: "center",
// // // //     zIndex: 2,
// // // //   },
// // // //   imageContainer: {
// // // //     position: 'relative',
// // // //     marginBottom: 16,
// // // //   },
// // // //   profileImage: {
// // // //     width: 110,
// // // //     height: 110,
// // // //     borderRadius: 55,
// // // //     borderWidth: 3,
// // // //     borderColor: COLORS.surface,
// // // //     backgroundColor: COLORS.background,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 8,
// // // //     elevation: 4,
// // // //   },
// // // //   profileImageEdit: {
// // // //     borderColor: COLORS.primary,
// // // //   },
// // // //   editImageBadge: {
// // // //     position: "absolute",
// // // //     bottom: 2,
// // // //     right: 2,
// // // //     width: 30,
// // // //     height: 30,
// // // //     borderRadius: 15,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.surface,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     elevation: 3,
// // // //   },
// // // //   nameContainer: {
// // // //     alignItems: "center",
// // // //     marginBottom: 16,
// // // //   },
// // // //   userName: {
// // // //     fontSize: 22,
// // // //     fontWeight: "700",
// // // //     color: COLORS.text,
// // // //     marginBottom: 6,
// // // //   },
// // // //   userRoleBadge: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 20,
// // // //     gap: 4,
// // // //   },
// // // //   userRole: {
// // // //     fontSize: 12,
// // // //     fontWeight: "600",
// // // //   },
// // // //   nameInputContainer: {
// // // //     width: '100%',
// // // //     marginBottom: 16,
// // // //   },
// // // //   nameInput: {
// // // //     fontSize: 18,
// // // //     fontWeight: "600",
// // // //     color: COLORS.text,
// // // //     textAlign: "center",
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 16,
// // // //     backgroundColor: COLORS.background,
// // // //     borderRadius: 12,
// // // //   },
// // // //   editButton: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingHorizontal: 24,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 12,
// // // //     gap: 8,
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 8,
// // // //     elevation: 3,
// // // //   },
// // // //   editButtonText: {
// // // //     color: "#FFFFFF",
// // // //     fontWeight: "600",
// // // //     fontSize: 14,
// // // //   },
// // // //   cancelButton: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 20,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //     gap: 6,
// // // //     marginTop: 12,
// // // //   },
// // // //   cancelButtonText: {
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //     fontSize: 13,
// // // //   },
  
// // // //   /* Section */
// // // //   section: {
// // // //     paddingHorizontal: 16,
// // // //     marginBottom: 24,
// // // //   },
// // // //   sectionHeader: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 8,
// // // //     marginBottom: 12,
// // // //   },
// // // //   sectionTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: "600",
// // // //     color: COLORS.text,
// // // //   },
  
// // // //   /* Info Card */
// // // //   infoCard: {
// // // //     borderRadius: 16,
// // // //     padding: 16,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     elevation: 2,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.surface,
// // // //   },
// // // //   infoRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingVertical: 8,
// // // //     zIndex: 2,
// // // //   },
// // // //   infoIcon: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 10,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     marginRight: 12,
// // // //   },
// // // //   infoContent: {
// // // //     flex: 1,
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //   },
// // // //   infoLabel: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //   },
// // // //   infoValue: {
// // // //     fontSize: 14,
// // // //     fontWeight: "600",
// // // //     color: COLORS.text,
// // // //   },
// // // //   infoDivider: {
// // // //     height: 1,
// // // //     backgroundColor: COLORS.border,
// // // //     marginVertical: 4,
// // // //   },
  
// // // //   /* Status Badge */
// // // //   statusBadge: {
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 6,
// // // //   },
// // // //   statusText: {
// // // //     fontSize: 11,
// // // //     fontWeight: "600",
// // // //   },
  
// // // //   /* Stats Card */
// // // //   statsCard: {
// // // //     borderRadius: 16,
// // // //     padding: 16,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     elevation: 2,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.surface,
// // // //   },
// // // //   statsGrid: {
// // // //     flexDirection: "row",
// // // //     gap: 12,
// // // //     marginBottom: 12,
// // // //     zIndex: 2,
// // // //   },
// // // //   statItem: {
// // // //     flex: 1,
// // // //     backgroundColor: COLORS.background,
// // // //     borderRadius: 12,
// // // //     padding: 12,
// // // //     alignItems: "center",
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //   },
// // // //   statIconContainer: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 10,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     marginBottom: 8,
// // // //   },
// // // //   statLabel: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //     marginBottom: 4,
// // // //     fontWeight: "500",
// // // //   },
// // // //   statValueContainer: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 6,
// // // //   },
// // // //   statValue: {
// // // //     fontSize: 15,
// // // //     fontWeight: "700",
// // // //     color: COLORS.text,
// // // //   },
// // // //   copyButton: {
// // // //     padding: 2,
// // // //   },
  
// // // //   /* Options Card */
// // // //   optionsCard: {
// // // //     borderRadius: 16,
// // // //     overflow: 'hidden',
// // // //     position: 'relative',
// // // //     elevation: 2,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.surface,
// // // //   },
// // // //   optionItem: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     padding: 14,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: COLORS.border,
// // // //     zIndex: 2,
// // // //     backgroundColor: COLORS.surface,
// // // //   },
// // // //   optionIcon: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 10,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     marginRight: 12,
// // // //   },
// // // //   optionContent: {
// // // //     flex: 1,
// // // //   },
// // // //   optionTitle: {
// // // //     fontSize: 14,
// // // //     fontWeight: "600",
// // // //     color: COLORS.text,
// // // //     marginBottom: 2,
// // // //   },
// // // //   optionDescription: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //   },
  
// // // //   /* Logout Button */
// // // //   logoutButton: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     backgroundColor: COLORS.surface,
// // // //     marginHorizontal: 16,
// // // //     paddingVertical: 14,
// // // //     borderRadius: 12,
// // // //     gap: 10,
// // // //     marginTop: 8,
// // // //     marginBottom: 24,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.red,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   logoutIcon: {
// // // //     width: 32,
// // // //     height: 32,
// // // //     borderRadius: 8,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   logoutText: {
// // // //     color: COLORS.red,
// // // //     fontWeight: "600",
// // // //     fontSize: 15,
// // // //   },
// // // //   bottomSpace: {
// // // //     height: 20,
// // // //   },
  
// // // //   /* Modal Styles */
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: "rgba(0,0,0,0.5)",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     padding: 16,
// // // //   },
// // // //   modalContent: {
// // // //     width: "100%",
// // // //     maxWidth: 380,
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 20,
// // // //     padding: 20,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.15,
// // // //     shadowRadius: 12,
// // // //     elevation: 5,
// // // //   },
// // // //   notificationModalContent: {
// // // //     width: "90%",
// // // //     maxHeight: "80%",
// // // //     maxWidth: "none",
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     marginBottom: 16,
// // // //     paddingBottom: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: COLORS.border,
// // // //     zIndex: 2,
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: "700",
// // // //     color: COLORS.text,
// // // //     zIndex: 2,
// // // //   },
// // // //   modalSubtitle: {
// // // //     fontSize: 13,
// // // //     color: COLORS.textLight,
// // // //     textAlign: "center",
// // // //     marginBottom: 20,
// // // //     zIndex: 2,
// // // //   },
// // // //   modalOption: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     backgroundColor: COLORS.background,
// // // //     padding: 14,
// // // //     borderRadius: 12,
// // // //     marginBottom: 10,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     zIndex: 2,
// // // //   },
// // // //   modalOptionIcon: {
// // // //     width: 44,
// // // //     height: 44,
// // // //     borderRadius: 10,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     marginRight: 12,
// // // //   },
// // // //   modalOptionContent: {
// // // //     flex: 1,
// // // //   },
// // // //   modalOptionTitle: {
// // // //     fontSize: 15,
// // // //     fontWeight: "600",
// // // //     color: COLORS.text,
// // // //     marginBottom: 2,
// // // //   },
// // // //   modalOptionDescription: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //   },
// // // //   modalCancelButton: {
// // // //     backgroundColor: "transparent",
// // // //     padding: 14,
// // // //     borderRadius: 12,
// // // //     alignItems: "center",
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     marginTop: 8,
// // // //     zIndex: 2,
// // // //   },
// // // //   modalCancelText: {
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "600",
// // // //     fontSize: 14,
// // // //   },
  
// // // //   /* Notification Modal */
// // // //   notificationItem: {
// // // //     flexDirection: "row",
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: COLORS.border,
// // // //     zIndex: 2,
// // // //   },
// // // //   notificationIcon: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 10,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //   },
// // // //   notificationContent: {
// // // //     flex: 1,
// // // //   },
// // // //   notificationTitle: {
// // // //     fontSize: 13,
// // // //     fontWeight: "600",
// // // //     color: COLORS.text,
// // // //     marginBottom: 2,
// // // //   },
// // // //   notificationMessage: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //     marginBottom: 4,
// // // //   },
// // // //   notificationDate: {
// // // //     fontSize: 9,
// // // //     color: COLORS.textLight,
// // // //   },
// // // //   notificationList: {
// // // //     paddingBottom: 8,
// // // //   },
// // // //   emptyNotifications: {
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     paddingVertical: 40,
// // // //     zIndex: 2,
// // // //   },
// // // //   emptyText: {
// // // //     fontSize: 13,
// // // //     color: COLORS.textLight,
// // // //     marginTop: 8,
// // // //   },
// // // //   loadingContainerModal: {
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     paddingVertical: 40,
// // // //     zIndex: 2,
// // // //   },
// // // //   loadingTextModal: {
// // // //     marginTop: 10,
// // // //     fontSize: 13,
// // // //     color: COLORS.textLight,
// // // //   },
// // // //   closeBtn: {
// // // //     padding: 14,
// // // //     borderRadius: 12,
// // // //     alignItems: "center",
// // // //     marginTop: 16,
// // // //     zIndex: 2,
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 4,
// // // //     elevation: 3,
// // // //   },
// // // //   closeBtnText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 14,
// // // //     fontWeight: "600",
// // // //   },
// // // // });








// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   Image,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   Modal,
// // //   ActivityIndicator,
// // //   RefreshControl,
// // //   Dimensions,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Animated,
// // //   Easing,
// // //   Platform,
// // //   TextInput,
// // //   Alert,
// // //   Linking,
// // // } from "react-native";
// // // import axios from "axios";
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { useNavigation } from '@react-navigation/native';
// // // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// // // const { width } = Dimensions.get('window');

// // // // Color scheme matching the Home component
// // // const COLORS = {
// // //   primary: "#4facfe", // Main blue color
// // //   accent: "#ff9800", // Orange accent
// // //   background: "#f5f8ff", // Light background
// // //   surface: "#FFFFFF",
// // //   textDark: "#333333",
// // //   textLight: "#777777",
// // //   border: "#EEEEEE",
  
// // //   // Status colors
// // //   live: "#4CAF50",
// // //   scheduled: "#ff9800",
// // //   completed: "#9E9E9E",
  
// // //   // Quick action colors
// // //   deposit: "#4facfe",
// // //   withdraw: "#FF6B6B",
// // //   refer: "#4ECDC4",
// // //   support: "#9B59B6",
  
// // //   // Additional colors
// // //   purple: "#9B59B6",
// // //   purpleLight: "#F3E5F5",
// // //   orange: "#FF9800",
// // //   orangeLight: "#FFF3E0",
// // //   teal: "#4ECDC4",
// // //   tealLight: "#E0F2F1",
// // //   pink: "#FF6B6B",
// // //   pinkLight: "#FFE5E5",
// // //   red: "#EF4444",
// // //   redLight: "#FEE2E2",
// // //   green: "#10B981",
// // //   greenLight: "#D1FAE5",
// // // };

// // // const BASE_URL = "https://tambolatime.co.in/public/";

// // // const Profile = ({ onLogout }) => {
// // //   const navigation = useNavigation();
// // //   const [user, setUser] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [editMode, setEditMode] = useState(false);
// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //   });
// // //   const [imageUri, setImageUri] = useState(null);
// // //   const [saving, setSaving] = useState(false);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [notifications, setNotifications] = useState([]);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [imageModalVisible, setImageModalVisible] = useState(false);
// // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
  
// // //   // Animation values
// // //   const scrollY = useRef(new Animated.Value(0)).current;
// // //   const fadeAnim = useRef(new Animated.Value(0)).current;
// // //   const scaleAnim = useRef(new Animated.Value(0.9)).current;
// // //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// // //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// // //   const pulseAnim = useRef(new Animated.Value(1)).current;

// // //   // Helper function to get full image URL
// // //   const getFullImageUrl = (imagePath) => {
// // //     if (!imagePath) return null;
// // //     if (imagePath.startsWith('http')) return imagePath;
// // //     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
// // //     return BASE_URL + cleanPath;
// // //   };

// // //   useEffect(() => {
// // //     fetchProfile();
// // //     fetchNotifications();
// // //     startAnimations();
    
// // //     // Entrance animation
// // //     Animated.parallel([
// // //       Animated.timing(fadeAnim, {
// // //         toValue: 1,
// // //         duration: 800,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.spring(scaleAnim, {
// // //         toValue: 1,
// // //         friction: 8,
// // //         tension: 40,
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start();
// // //   }, []);

// // //   const startAnimations = () => {
// // //     // Floating animations
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(floatAnim1, {
// // //           toValue: 1,
// // //           duration: 4000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(floatAnim1, {
// // //           toValue: 0,
// // //           duration: 4000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(floatAnim2, {
// // //           toValue: 1,
// // //           duration: 5000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(floatAnim2, {
// // //           toValue: 0,
// // //           duration: 5000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     // Pulse animation
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1.05,
// // //           duration: 2000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1,
// // //           duration: 2000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();
// // //   };

// // //   const fetchProfile = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         `${BASE_URL}api/user/profile`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
      
// // //       if (res.data.user) {
// // //         setUser(res.data.user);
// // //         setFormData({
// // //           name: res.data.user.name || "",
// // //         });
        
// // //         if (res.data.user.profile_image_url) {
// // //           setImageUri(res.data.user.profile_image_url);
// // //         } else if (res.data.user.profile_image) {
// // //           setImageUri(getFullImageUrl(res.data.user.profile_image));
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.log("Fetch profile error:", error);
// // //       Alert.alert("Error", "Failed to fetch profile information");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchNotifications = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
// // //       const res = await axios.get(
// // //         `${BASE_URL}api/user/notifications`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.status) {
// // //         setNotifications(res.data.data || []);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching notifications:", error);
// // //     } finally {
// // //       setLoadingNotifications(false);
// // //     }
// // //   };

// // //   const onRefresh = React.useCallback(() => {
// // //     setRefreshing(true);
// // //     Promise.all([fetchProfile(), fetchNotifications()]).finally(() => setRefreshing(false));
// // //   }, []);

// // //   const handleImagePick = async (source) => {
// // //     setImageModalVisible(false);
    
// // //     const options = {
// // //       mediaType: 'photo',
// // //       maxWidth: 500,
// // //       maxHeight: 500,
// // //       quality: 0.8,
// // //       includeBase64: false,
// // //       saveToPhotos: false,
// // //       selectionLimit: 1,
// // //     };
    
// // //     try {
// // //       let result;
      
// // //       if (source === "camera") {
// // //         result = await launchCamera(options);
// // //       } else {
// // //         result = await launchImageLibrary(options);
// // //       }

// // //       if (result.didCancel) {
// // //         console.log('User cancelled image picker');
// // //       } else if (result.errorCode) {
// // //         console.log('ImagePicker Error: ', result.errorMessage);
// // //         Alert.alert("Error", result.errorMessage || "Failed to pick image");
// // //       } else if (result.assets && result.assets.length > 0) {
// // //         const selectedImage = result.assets[0];
// // //         setImageUri(selectedImage.uri);
// // //       }
// // //     } catch (error) {
// // //       console.log("Image picker error:", error);
// // //       Alert.alert("Error", "Failed to pick image");
// // //     }
// // //   };

// // //   const updateProfile = async () => {
// // //     if (!formData.name.trim()) {
// // //       Alert.alert("Error", "Name is required");
// // //       return;
// // //     }

// // //     setSaving(true);
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const formDataToSend = new FormData();

// // //       formDataToSend.append("name", formData.name);

// // //       if (imageUri && 
// // //           !imageUri.startsWith(BASE_URL) && 
// // //           !imageUri.startsWith('http') &&
// // //           (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
// // //         const localUri = imageUri;
// // //         const filename = localUri.split('/').pop();
        
// // //         let type = 'image/jpeg';
// // //         if (filename) {
// // //           const match = /\.(\w+)$/.exec(filename);
// // //           if (match) {
// // //             type = `image/${match[1]}`;
// // //           }
// // //         }

// // //         formDataToSend.append('profile_image', {
// // //           uri: localUri,
// // //           name: filename || `profile_${Date.now()}.jpg`,
// // //           type,
// // //         });
// // //       }

// // //       const response = await axios.post(
// // //         `${BASE_URL}api/user/profile`,
// // //         formDataToSend,
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'multipart/form-data',
// // //           },
// // //         }
// // //       );

// // //       if (response.data.user) {
// // //         setUser(response.data.user);
// // //         Alert.alert("Success", "Profile updated successfully!");
// // //         setEditMode(false);
        
// // //         if (response.data.user.profile_image_url) {
// // //           setImageUri(response.data.user.profile_image_url);
// // //         } else if (response.data.user.profile_image) {
// // //           setImageUri(getFullImageUrl(response.data.user.profile_image));
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.log("Update error:", error);
// // //       Alert.alert("Error", "Failed to update profile");
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const logoutUser = async () => {
// // //     Alert.alert(
// // //       "Logout",
// // //       "Are you sure you want to logout?",
// // //       [
// // //         { text: "Cancel", style: "cancel" },
// // //         { 
// // //           text: "Logout", 
// // //           style: "destructive", 
// // //           onPress: async () => {
// // //             try {
// // //               const token = await AsyncStorage.getItem("token");
// // //               await axios.post(
// // //                 `${BASE_URL}api/user/logout`,
// // //                 {},
// // //                 { headers: { Authorization: `Bearer ${token}` } }
// // //               );
// // //               await AsyncStorage.removeItem("token");
// // //               await AsyncStorage.removeItem("user");
// // //               onLogout();
// // //             } catch (error) {
// // //               console.log(error);
// // //               Alert.alert("Error", "Something went wrong. Please try again.");
// // //             }
// // //           }
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   const Header = () => (
// // //     <View style={styles.header}>
// // //       <View>
// // //         <Text style={styles.headerTitle}>My Profile</Text>
// // //         <Text style={styles.headerSubtitle}>Manage your account settings</Text>
// // //       </View>

// // //       <TouchableOpacity 
// // //         style={styles.notification}
// // //         onPress={() => setModalVisible(true)}
// // //       >
// // //         <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// // //         {notifications.length > 0 && (
// // //           <View style={styles.badge}>
// // //             <Text style={styles.badgeText}>{notifications.length}</Text>
// // //           </View>
// // //         )}
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   const StatCard = ({ number, label, icon, color }) => {
// // //     const floatValue = floatAnim1.interpolate({
// // //       inputRange: [0, 1],
// // //       outputRange: [0, -10]
// // //     });

// // //     return (
// // //       <Animated.View 
// // //         style={[
// // //           styles.statCard,
// // //           {
// // //             transform: [{ translateY: floatValue }]
// // //           }
// // //         ]}
// // //       >
// // //         <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
// // //           <Ionicons name={icon} size={24} color={color} />
// // //         </View>
// // //         <Text style={styles.statNumber}>{number}</Text>
// // //         <Text style={styles.statLabel}>{label}</Text>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   const InfoCard = ({ icon, label, value, color }) => (
// // //     <View style={styles.infoCard}>
// // //       <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
// // //         <Ionicons name={icon} size={20} color={color} />
// // //       </View>
// // //       <View style={styles.infoContent}>
// // //         <Text style={styles.infoLabel}>{label}</Text>
// // //         <Text style={styles.infoValue}>{value || "N/A"}</Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   const SettingItem = ({ icon, title, description, color, onPress }) => (
// // //     <TouchableOpacity style={styles.settingItem} onPress={onPress}>
// // //       <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}>
// // //         <Ionicons name={icon} size={22} color={color} />
// // //       </View>
// // //       <View style={styles.settingContent}>
// // //         <Text style={styles.settingTitle}>{title}</Text>
// // //         <Text style={styles.settingDescription}>{description}</Text>
// // //       </View>
// // //       <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
// // //     </TouchableOpacity>
// // //   );

// // //   if (loading) {
// // //     return (
// // //       <SafeAreaView style={styles.safeArea}>
// // //         <View style={styles.loadingContainer}>
// // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// // //       <View style={styles.container}>
// // //         {/* Header */}
// // //         <Header />

// // //         {/* Animated Background Elements */}
// // //         <Animated.View 
// // //           style={[
// // //             styles.backgroundCircle1,
// // //             {
// // //               transform: [
// // //                 { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
// // //                 { scale: pulseAnim }
// // //               ]
// // //             }
// // //           ]} 
// // //         />
// // //         <Animated.View 
// // //           style={[
// // //             styles.backgroundCircle2,
// // //             {
// // //               transform: [
// // //                 { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
// // //               ]
// // //             }
// // //           ]} 
// // //         />
// // //         <Animated.View 
// // //           style={[
// // //             styles.backgroundCircle3,
// // //             {
// // //               transform: [
// // //                 { scale: pulseAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
// // //               ]
// // //             }
// // //           ]} 
// // //         />

// // //         <ScrollView
// // //           showsVerticalScrollIndicator={false}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={onRefresh}
// // //               tintColor={COLORS.primary}
// // //               colors={[COLORS.primary]}
// // //             />
// // //           }
// // //         >
// // //           {/* Profile Hero Section */}
// // //           <Animated.View 
// // //             style={[
// // //               styles.profileHeroSection,
// // //               {
// // //                 opacity: fadeAnim,
// // //                 transform: [{ scale: scaleAnim }]
// // //               }
// // //             ]}
// // //           >
// // //             <View style={styles.profileHeroContent}>
// // //               <TouchableOpacity
// // //                 onPress={() => editMode && setImageModalVisible(true)}
// // //                 disabled={!editMode}
// // //                 style={styles.profileImageContainer}
// // //               >
// // //                 <Image
// // //                   source={{
// // //                     uri: imageUri
// // //                       ? imageUri
// // //                       : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
// // //                   }}
// // //                   style={styles.profileImage}
// // //                 />
// // //                 {editMode && (
// // //                   <View style={[styles.editImageBadge, { backgroundColor: COLORS.primary }]}>
// // //                     <Ionicons name="camera" size={16} color={COLORS.surface} />
// // //                   </View>
// // //                 )}
// // //               </TouchableOpacity>

// // //               {editMode ? (
// // //                 <View style={styles.nameInputContainer}>
// // //                   <TextInput
// // //                     style={styles.nameInput}
// // //                     value={formData.name}
// // //                     onChangeText={(text) => setFormData({ ...formData, name: text })}
// // //                     placeholder="Enter your name"
// // //                     placeholderTextColor={COLORS.textLight}
// // //                   />
// // //                 </View>
// // //               ) : (
// // //                 <>
// // //                   <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
// // //                   <View style={styles.profileBadge}>
// // //                     <Ionicons name="star" size={14} color={COLORS.accent} />
// // //                     <Text style={styles.profileBadgeText}>Premium Member</Text>
// // //                   </View>
// // //                 </>
// // //               )}

// // //               <View style={styles.profileActions}>
// // //                 <TouchableOpacity
// // //                   style={[styles.profileActionButton, editMode && { backgroundColor: COLORS.green }]}
// // //                   onPress={() => {
// // //                     if (editMode) {
// // //                       updateProfile();
// // //                     } else {
// // //                       setEditMode(true);
// // //                     }
// // //                   }}
// // //                   disabled={saving}
// // //                 >
// // //                   <Ionicons 
// // //                     name={editMode ? "checkmark" : "pencil"} 
// // //                     size={16} 
// // //                     color={COLORS.surface} 
// // //                   />
// // //                   <Text style={styles.profileActionText}>
// // //                     {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
// // //                   </Text>
// // //                 </TouchableOpacity>

// // //                 {editMode && (
// // //                   <TouchableOpacity
// // //                     style={styles.profileCancelButton}
// // //                     onPress={() => {
// // //                       setEditMode(false);
// // //                       setFormData({ name: user?.name || "" });
// // //                       if (user?.profile_image_url) {
// // //                         setImageUri(user.profile_image_url);
// // //                       } else if (user?.profile_image) {
// // //                         setImageUri(getFullImageUrl(user.profile_image));
// // //                       } else {
// // //                         setImageUri(null);
// // //                       }
// // //                     }}
// // //                   >
// // //                     <Ionicons name="close" size={16} color={COLORS.textLight} />
// // //                     <Text style={styles.profileCancelText}>Cancel</Text>
// // //                   </TouchableOpacity>
// // //                 )}
// // //               </View>
// // //             </View>
// // //           </Animated.View>

// // //           {/* Stats Section */}
// // //           <View style={styles.statsSection}>
// // //             <StatCard number={user?.referral_points || "0"} label="Referral Points" icon="star" color={COLORS.primary} />
// // //             <StatCard number="24/7" label="Support" icon="headset" color={COLORS.purple} />
// // //             <StatCard number="10+" label="Games Played" icon="game-controller" color={COLORS.teal} />
// // //           </View>

// // //           {/* Account Information */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <Ionicons name="person-circle" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.infoGrid}>
// // //               <InfoCard 
// // //                 icon="mail" 
// // //                 label="Email Address" 
// // //                 value={user?.email} 
// // //                 color={COLORS.primary}
// // //               />
// // //               <InfoCard 
// // //                 icon="call" 
// // //                 label="Mobile Number" 
// // //                 value={user?.mobile} 
// // //                 color={COLORS.purple}
// // //               />
// // //               <InfoCard 
// // //                 icon="gift" 
// // //                 label="Referral Code" 
// // //                 value={user?.referral_code} 
// // //                 color={COLORS.teal}
// // //               />
// // //               <InfoCard 
// // //                 icon="people" 
// // //                 label="Under Referral" 
// // //                 value={user?.under_referral || "None"} 
// // //                 color={COLORS.orange}
// // //               />
// // //             </View>
// // //           </View>

// // //           {/* Account Status */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.statusCard}>
// // //               <View style={styles.statusPattern} />
// // //               <View style={styles.statusRow}>
// // //                 <View style={[styles.statusIndicator, { backgroundColor: COLORS.green }]} />
// // //                 <View>
// // //                   <Text style={styles.statusLabel}>Account Status</Text>
// // //                   <Text style={styles.statusValue}>Active</Text>
// // //                 </View>
// // //                 <View style={styles.statusBadge}>
// // //                   <Text style={styles.statusBadgeText}>Verified</Text>
// // //                 </View>
// // //               </View>

// // //               <View style={styles.statusDivider} />

// // //               <View style={styles.statusRow}>
// // //                 <View style={[styles.statusIndicator, { backgroundColor: COLORS.primary }]} />
// // //                 <View>
// // //                   <Text style={styles.statusLabel}>Member Since</Text>
// // //                   <Text style={styles.statusValue}>
// // //                     {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
// // //                   </Text>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </View>

// // //           {/* Quick Settings */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <Ionicons name="settings" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.settingsCard}>
// // //               <SettingItem 
// // //                 icon="ticket"
// // //                 title="My Tickets"
// // //                 description="View your purchased tickets"
// // //                 color={COLORS.primary}
// // //                 onPress={() => Alert.alert("Coming Soon", "My Tickets feature coming soon!")}
// // //               />
// // //               <SettingItem 
// // //                 icon="wallet"
// // //                 title="Wallet"
// // //                 description="Manage your balance"
// // //                 color={COLORS.purple}
// // //                 onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
// // //               />
// // //               <SettingItem 
// // //                 icon="lock-closed"
// // //                 title="Privacy & Security"
// // //                 description="Manage your security settings"
// // //                 color={COLORS.teal}
// // //                 onPress={() => Alert.alert("Coming Soon", "Privacy settings coming soon!")}
// // //               />
// // //               <SettingItem 
// // //                 icon="help-circle"
// // //                 title="Help & Support"
// // //                 description="Get help with your account"
// // //                 color={COLORS.orange}
// // //                 onPress={() => Linking.openURL('mailto:support@tambolatimez.com')}
// // //               />
// // //             </View>
// // //           </View>

// // //           {/* Recent Activity */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <Ionicons name="time" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.activityCard}>
// // //               <View style={styles.activityPattern} />
              
// // //               <View style={styles.activityItem}>
// // //                 <View style={[styles.activityIcon, { backgroundColor: COLORS.primary + '15' }]}>
// // //                   <Ionicons name="game-controller" size={20} color={COLORS.primary} />
// // //                 </View>
// // //                 <View style={styles.activityContent}>
// // //                   <Text style={styles.activityTitle}>Joined Game</Text>
// // //                   <Text style={styles.activitySubtitle}>Tambola Classic #123</Text>
// // //                   <Text style={styles.activityTime}>2 hours ago</Text>
// // //                 </View>
// // //               </View>

// // //               <View style={styles.activityDivider} />

// // //               <View style={styles.activityItem}>
// // //                 <View style={[styles.activityIcon, { backgroundColor: COLORS.orange + '15' }]}>
// // //                   <Ionicons name="trophy" size={20} color={COLORS.orange} />
// // //                 </View>
// // //                 <View style={styles.activityContent}>
// // //                   <Text style={styles.activityTitle}>Won Prize</Text>
// // //                   <Text style={styles.activitySubtitle}>₹500 in Speed Tambola</Text>
// // //                   <Text style={styles.activityTime}>1 day ago</Text>
// // //                 </View>
// // //               </View>

// // //               <View style={styles.activityDivider} />

// // //               <View style={styles.activityItem}>
// // //                 <View style={[styles.activityIcon, { backgroundColor: COLORS.green + '15' }]}>
// // //                   <Ionicons name="wallet" size={20} color={COLORS.green} />
// // //                 </View>
// // //                 <View style={styles.activityContent}>
// // //                   <Text style={styles.activityTitle}>Deposit</Text>
// // //                   <Text style={styles.activitySubtitle}>₹1000 added to wallet</Text>
// // //                   <Text style={styles.activityTime}>3 days ago</Text>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </View>

// // //           {/* Logout Button */}
// // //           <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
// // //             <View style={[styles.logoutIcon, { backgroundColor: COLORS.red + '20' }]}>
// // //               <Ionicons name="log-out" size={22} color={COLORS.red} />
// // //             </View>
// // //             <Text style={styles.logoutText}>Logout</Text>
// // //           </TouchableOpacity>

// // //           {/* Footer */}
// // //           <View style={styles.footer}>
// // //             <Text style={styles.footerText}>
// // //               Version 1.0.0
// // //             </Text>
// // //             <Text style={styles.footerSubtext}>
// // //               © {new Date().getFullYear()} Houzie Timez
// // //             </Text>
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </ScrollView>

// // //         {/* Image Selection Modal */}
// // //         <Modal visible={imageModalVisible} transparent={true} animationType="fade">
// // //           <View style={styles.modalOverlay}>
// // //             <View style={styles.modalContent}>
// // //               <View style={styles.modalHeader}>
// // //                 <Text style={styles.modalTitle}>Update Profile Picture</Text>
// // //                 <TouchableOpacity onPress={() => setImageModalVisible(false)}>
// // //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// // //                 </TouchableOpacity>
// // //               </View>

// // //               <TouchableOpacity
// // //                 style={styles.modalOption}
// // //                 onPress={() => handleImagePick("camera")}
// // //               >
// // //                 <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.primary + '15' }]}>
// // //                   <Ionicons name="camera" size={24} color={COLORS.primary} />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.modalOptionTitle}>Take Photo</Text>
// // //                   <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
// // //                 </View>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={styles.modalOption}
// // //                 onPress={() => handleImagePick("gallery")}
// // //               >
// // //                 <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.purple + '15' }]}>
// // //                   <Ionicons name="images" size={24} color={COLORS.purple} />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
// // //                   <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
// // //                 </View>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={styles.modalCancelButton}
// // //                 onPress={() => setImageModalVisible(false)}
// // //               >
// // //                 <Text style={styles.modalCancelText}>Cancel</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>

// // //         {/* Notifications Modal */}
// // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // //           <View style={styles.modalOverlay}>
// // //             <View style={styles.modalContent}>
// // //               <View style={styles.modalHeader}>
// // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {loadingNotifications ? (
// // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// // //               ) : (
// // //                 <FlatList
// // //                   data={notifications}
// // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // //                   renderItem={({ item }) => (
// // //                     <View style={styles.notificationItem}>
// // //                       <View style={styles.notificationIcon}>
// // //                         <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
// // //                       </View>
// // //                       <View style={styles.notificationContent}>
// // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // //                         <Text style={styles.notificationMessage}>
// // //                           {item.message || "Check out the latest updates!"}
// // //                         </Text>
// // //                         <Text style={styles.notificationDate}>
// // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // //                         </Text>
// // //                       </View>
// // //                     </View>
// // //                   )}
// // //                   ListEmptyComponent={
// // //                     <View style={styles.emptyNotifications}>
// // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // //                       <Text style={styles.emptyText}>No notifications yet</Text>
// // //                     </View>
// // //                   }
// // //                 />
// // //               )}

// // //               <TouchableOpacity
// // //                 style={styles.closeBtn}
// // //                 onPress={() => setModalVisible(false)}
// // //               >
// // //                 <Text style={styles.closeBtnText}>Close</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   header: {
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 16,
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     zIndex: 10,
// // //   },
// // //   headerTitle: {
// // //     color: COLORS.surface,
// // //     fontSize: 22,
// // //     fontWeight: "700",
// // //   },
// // //   headerSubtitle: {
// // //     color: COLORS.surface,
// // //     fontSize: 12,
// // //     opacity: 0.9,
// // //     marginTop: 2,
// // //   },
// // //   notification: {
// // //     position: "relative",
// // //   },
// // //   badge: {
// // //     position: "absolute",
// // //     top: -6,
// // //     right: -6,
// // //     backgroundColor: "red",
// // //     width: 18,
// // //     height: 18,
// // //     borderRadius: 9,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   badgeText: {
// // //     color: COLORS.surface,
// // //     fontSize: 10,
// // //     fontWeight: "700",
// // //   },
  
// // //   // Background Elements
// // //   backgroundCircle1: {
// // //     position: 'absolute',
// // //     top: 100,
// // //     right: -50,
// // //     width: 200,
// // //     height: 200,
// // //     borderRadius: 100,
// // //     backgroundColor: COLORS.primary + '10',
// // //     zIndex: 0,
// // //   },
// // //   backgroundCircle2: {
// // //     position: 'absolute',
// // //     bottom: 200,
// // //     left: -60,
// // //     width: 250,
// // //     height: 250,
// // //     borderRadius: 125,
// // //     backgroundColor: COLORS.purple + '08',
// // //     zIndex: 0,
// // //   },
// // //   backgroundCircle3: {
// // //     position: 'absolute',
// // //     top: '50%',
// // //     right: 20,
// // //     width: 150,
// // //     height: 150,
// // //     borderRadius: 75,
// // //     backgroundColor: COLORS.orange + '05',
// // //     zIndex: 0,
// // //   },

// // //   // Profile Hero Section
// // //   profileHeroSection: {
// // //     marginTop: 16,
// // //     marginHorizontal: 16,
// // //     marginBottom: 24,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 24,
// // //     padding: 20,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     zIndex: 2,
// // //   },
// // //   profileHeroContent: {
// // //     alignItems: 'center',
// // //   },
// // //   profileImageContainer: {
// // //     position: 'relative',
// // //     marginBottom: 16,
// // //   },
// // //   profileImage: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     borderWidth: 3,
// // //     borderColor: COLORS.surface,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   editImageBadge: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     right: 0,
// // //     width: 30,
// // //     height: 30,
// // //     borderRadius: 15,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: COLORS.surface,
// // //   },
// // //   profileName: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //     marginBottom: 6,
// // //   },
// // //   profileBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: COLORS.primary + '15',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 4,
// // //     borderRadius: 20,
// // //     gap: 4,
// // //     marginBottom: 16,
// // //   },
// // //   profileBadgeText: {
// // //     fontSize: 12,
// // //     color: COLORS.primary,
// // //     fontWeight: '600',
// // //   },
// // //   nameInputContainer: {
// // //     width: '100%',
// // //     marginBottom: 16,
// // //   },
// // //   nameInput: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     textAlign: 'center',
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 16,
// // //     backgroundColor: COLORS.background,
// // //     borderRadius: 12,
// // //     width: '100%',
// // //   },
// // //   profileActions: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 12,
// // //   },
// // //   profileActionButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 10,
// // //     gap: 6,
// // //   },
// // //   profileActionText: {
// // //     color: COLORS.surface,
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //   },
// // //   profileCancelButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //     gap: 4,
// // //   },
// // //   profileCancelText: {
// // //     color: COLORS.textLight,
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },

// // //   // Stats Section
// // //   statsSection: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //     gap: 8,
// // //     zIndex: 2,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //     padding: 12,
// // //     alignItems: 'center',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   statIconContainer: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 12,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   statNumber: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   statLabel: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //     textAlign: 'center',
// // //   },

// // //   // Section
// // //   section: {
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //     zIndex: 2,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   sectionTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },

// // //   // Info Grid
// // //   infoGrid: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: 8,
// // //   },
// // //   infoCard: {
// // //     width: (width - 40) / 2,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //     padding: 12,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   infoIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   infoContent: {
// // //     gap: 2,
// // //   },
// // //   infoLabel: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: '500',
// // //   },
// // //   infoValue: {
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },

// // //   // Status Card
// // //   statusCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 20,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //   },
// // //   statusPattern: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     right: 0,
// // //     width: 100,
// // //     height: 100,
// // //     backgroundColor: COLORS.primary + '05',
// // //     borderBottomLeftRadius: 50,
// // //   },
// // //   statusRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 12,
// // //   },
// // //   statusIndicator: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //   },
// // //   statusLabel: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     marginBottom: 2,
// // //   },
// // //   statusValue: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   statusBadge: {
// // //     marginLeft: 'auto',
// // //     backgroundColor: COLORS.green + '15',
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //   },
// // //   statusBadgeText: {
// // //     fontSize: 11,
// // //     color: COLORS.green,
// // //     fontWeight: '600',
// // //   },
// // //   statusDivider: {
// // //     height: 1,
// // //     backgroundColor: COLORS.border,
// // //     marginVertical: 12,
// // //   },

// // //   // Settings Card
// // //   settingsCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 20,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //   },
// // //   settingItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //   },
// // //   settingIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   settingContent: {
// // //     flex: 1,
// // //   },
// // //   settingTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   settingDescription: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },

// // //   // Activity Card
// // //   activityCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 20,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //   },
// // //   activityPattern: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     width: 100,
// // //     height: 100,
// // //     backgroundColor: COLORS.primary + '05',
// // //     borderTopRightRadius: 50,
// // //   },
// // //   activityItem: {
// // //     flexDirection: 'row',
// // //     gap: 12,
// // //   },
// // //   activityIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   activityContent: {
// // //     flex: 1,
// // //   },
// // //   activityTitle: {
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   activitySubtitle: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginBottom: 2,
// // //   },
// // //   activityTime: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //   },
// // //   activityDivider: {
// // //     height: 1,
// // //     backgroundColor: COLORS.border,
// // //     marginVertical: 12,
// // //   },

// // //   // Logout Button
// // //   logoutButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: COLORS.surface,
// // //     marginHorizontal: 16,
// // //     paddingVertical: 14,
// // //     borderRadius: 12,
// // //     gap: 10,
// // //     marginBottom: 24,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.red,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   logoutIcon: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   logoutText: {
// // //     color: COLORS.red,
// // //     fontWeight: '600',
// // //     fontSize: 15,
// // //   },

// // //   // Footer
// // //   footer: {
// // //     paddingVertical: 20,
// // //     alignItems: 'center',
// // //   },
// // //   footerText: {
// // //     fontSize: 13,
// // //     color: COLORS.textLight,
// // //     textAlign: 'center',
// // //     marginBottom: 2,
// // //   },
// // //   footerSubtext: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     textAlign: 'center',
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },

// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContent: {
// // //     width: '90%',
// // //     maxHeight: '80%',
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //   },
// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     paddingBottom: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },
// // //   modalOption: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: COLORS.background,
// // //     padding: 14,
// // //     borderRadius: 12,
// // //     marginBottom: 10,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     gap: 12,
// // //   },
// // //   modalOptionIcon: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalOptionTitle: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   modalOptionDescription: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   modalCancelButton: {
// // //     backgroundColor: 'transparent',
// // //     padding: 14,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     marginTop: 8,
// // //   },
// // //   modalCancelText: {
// // //     color: COLORS.textLight,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // //   notificationItem: {
// // //     flexDirection: 'row',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //   },
// // //   notificationIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: '#F0F8FF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   notificationContent: {
// // //     flex: 1,
// // //   },
// // //   notificationTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   notificationMessage: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginBottom: 4,
// // //   },
// // //   notificationDate: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //   },
// // //   emptyNotifications: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 40,
// // //   },
// // //   emptyText: {
// // //     marginTop: 12,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //   },
// // //   loadingIndicator: {
// // //     marginVertical: 20,
// // //   },
// // //   closeBtn: {
// // //     marginTop: 16,
// // //     backgroundColor: COLORS.primary,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //   },
// // //   closeBtnText: {
// // //     color: COLORS.surface,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // // });

// // // export default Profile;







// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   Image,
// //   ScrollView,
// //   TouchableOpacity,
// //   FlatList,
// //   Modal,
// //   ActivityIndicator,
// //   RefreshControl,
// //   Dimensions,
// //   SafeAreaView,
// //   StatusBar,
// //   Animated,
// //   Easing,
// //   Platform,
// //   TextInput,
// //   Alert,
// //   Linking,
// // } from "react-native";
// // import axios from "axios";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useNavigation } from '@react-navigation/native';
// // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// // const { width } = Dimensions.get('window');

// // // Color scheme matching the Home component
// // const COLORS = {
// //   primary: "#4facfe", // Main blue color
// //   accent: "#FDB800", // Orange accent (changed to match Home)
// //   background: "#f5f8ff", // Light background
// //   surface: "#FFFFFF",
// //   textDark: "#333333",
// //   textLight: "#777777",
// //   border: "#EEEEEE",
  
// //   // Status colors
// //   live: "#4CAF50",
// //   scheduled: "#ff9800",
// //   completed: "#ff9800",
  
// //   // Quick action colors
// //   deposit: "#4facfe",
// //   withdraw: "#FF6B6B",
// //   refer: "#4ECDC4",
// //   support: "#9B59B6",
  
// //   // Additional colors
// //   purple: "#9B59B6",
// //   purpleLight: "#F3E5F5",
// //   orange: "#FF9800",
// //   orangeLight: "#FFF3E0",
// //   teal: "#4ECDC4",
// //   tealLight: "#E0F2F1",
// //   pink: "#FF6B6B",
// //   pinkLight: "#FFE5E5",
// //   red: "#EF4444",
// //   redLight: "#FEE2E2",
// //   green: "#10B981",
// //   greenLight: "#D1FAE5",
// // };

// // const BASE_URL = "https://tambolatime.co.in/public/";

// // const Profile = ({ onLogout }) => {
// //   const navigation = useNavigation();
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [editMode, setEditMode] = useState(false);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //   });
// //   const [imageUri, setImageUri] = useState(null);
// //   const [saving, setSaving] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [notifications, setNotifications] = useState([]);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [imageModalVisible, setImageModalVisible] = useState(false);
// //   const [loadingNotifications, setLoadingNotifications] = useState(true);
  
// //   // Animation values for header letters
// //   const letterAnims = useRef([]);
  
// //   // Animation values
// //   const scrollY = useRef(new Animated.Value(0)).current;
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const scaleAnim = useRef(new Animated.Value(0.9)).current;
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;

// //   // Helper function to get full image URL
// //   const getFullImageUrl = (imagePath) => {
// //     if (!imagePath) return null;
// //     if (imagePath.startsWith('http')) return imagePath;
// //     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
// //     return BASE_URL + cleanPath;
// //   };

// //   useEffect(() => {
// //     // Initialize letter animations for header
// //     letterAnims.current = Array(18).fill().map(() => new Animated.Value(1));
    
// //     // Animate each letter with a popping effect (same as Home component)
// //     letterAnims.current.forEach((anim, index) => {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.delay(index * 80), // Staggered animation
// //           Animated.timing(anim, {
// //             toValue: 1.4,
// //             duration: 300,
// //             useNativeDriver: true,
// //             easing: Easing.bounce,
// //           }),
// //           Animated.timing(anim, {
// //             toValue: 1,
// //             duration: 200,
// //             useNativeDriver: true,
// //             easing: Easing.bounce,
// //           }),
// //           Animated.delay(1800),
// //         ])
// //       ).start();
// //     });

// //     fetchProfile();
// //     fetchNotifications();
// //     startAnimations();
    
// //     // Entrance animation
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 800,
// //         useNativeDriver: true,
// //       }),
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 8,
// //         tension: 40,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   }, []);

// //   const startAnimations = () => {
// //     // Floating animations
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim1, {
// //           toValue: 1,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim1, {
// //           toValue: 0,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim2, {
// //           toValue: 1,
// //           duration: 5000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim2, {
// //           toValue: 0,
// //           duration: 5000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Pulse animation
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.05,
// //           duration: 2000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 2000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   };

// //   const fetchProfile = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         `${BASE_URL}api/user/profile`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (res.data.user) {
// //         setUser(res.data.user);
// //         setFormData({
// //           name: res.data.user.name || "",
// //         });
        
// //         if (res.data.user.profile_image_url) {
// //           setImageUri(res.data.user.profile_image_url);
// //         } else if (res.data.user.profile_image) {
// //           setImageUri(getFullImageUrl(res.data.user.profile_image));
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Fetch profile error:", error);
// //       Alert.alert("Error", "Failed to fetch profile information");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchNotifications = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
// //       const res = await axios.get(
// //         `${BASE_URL}api/user/notifications`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.status) {
// //         setNotifications(res.data.data || []);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching notifications:", error);
// //     } finally {
// //       setLoadingNotifications(false);
// //     }
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     Promise.all([fetchProfile(), fetchNotifications()]).finally(() => setRefreshing(false));
// //   }, []);

// //   const handleImagePick = async (source) => {
// //     setImageModalVisible(false);
    
// //     const options = {
// //       mediaType: 'photo',
// //       maxWidth: 500,
// //       maxHeight: 500,
// //       quality: 0.8,
// //       includeBase64: false,
// //       saveToPhotos: false,
// //       selectionLimit: 1,
// //     };
    
// //     try {
// //       let result;
      
// //       if (source === "camera") {
// //         result = await launchCamera(options);
// //       } else {
// //         result = await launchImageLibrary(options);
// //       }

// //       if (result.didCancel) {
// //         console.log('User cancelled image picker');
// //       } else if (result.errorCode) {
// //         console.log('ImagePicker Error: ', result.errorMessage);
// //         Alert.alert("Error", result.errorMessage || "Failed to pick image");
// //       } else if (result.assets && result.assets.length > 0) {
// //         const selectedImage = result.assets[0];
// //         setImageUri(selectedImage.uri);
// //       }
// //     } catch (error) {
// //       console.log("Image picker error:", error);
// //       Alert.alert("Error", "Failed to pick image");
// //     }
// //   };

// //   const updateProfile = async () => {
// //     if (!formData.name.trim()) {
// //       Alert.alert("Error", "Name is required");
// //       return;
// //     }

// //     setSaving(true);
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const formDataToSend = new FormData();

// //       formDataToSend.append("name", formData.name);

// //       if (imageUri && 
// //           !imageUri.startsWith(BASE_URL) && 
// //           !imageUri.startsWith('http') &&
// //           (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
// //         const localUri = imageUri;
// //         const filename = localUri.split('/').pop();
        
// //         let type = 'image/jpeg';
// //         if (filename) {
// //           const match = /\.(\w+)$/.exec(filename);
// //           if (match) {
// //             type = `image/${match[1]}`;
// //           }
// //         }

// //         formDataToSend.append('profile_image', {
// //           uri: localUri,
// //           name: filename || `profile_${Date.now()}.jpg`,
// //           type,
// //         });
// //       }

// //       const response = await axios.post(
// //         `${BASE_URL}api/user/profile`,
// //         formDataToSend,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'multipart/form-data',
// //           },
// //         }
// //       );

// //       if (response.data.user) {
// //         setUser(response.data.user);
// //         Alert.alert("Success", "Profile updated successfully!");
// //         setEditMode(false);
        
// //         if (response.data.user.profile_image_url) {
// //           setImageUri(response.data.user.profile_image_url);
// //         } else if (response.data.user.profile_image) {
// //           setImageUri(getFullImageUrl(response.data.user.profile_image));
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Update error:", error);
// //       Alert.alert("Error", "Failed to update profile");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const logoutUser = async () => {
// //     Alert.alert(
// //       "Logout",
// //       "Are you sure you want to logout?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { 
// //           text: "Logout", 
// //           style: "destructive", 
// //           onPress: async () => {
// //             try {
// //               const token = await AsyncStorage.getItem("token");
// //               await axios.post(
// //                 `${BASE_URL}api/user/logout`,
// //                 {},
// //                 { headers: { Authorization: `Bearer ${token}` } }
// //               );
// //               await AsyncStorage.removeItem("token");
// //               await AsyncStorage.removeItem("user");
// //               onLogout();
// //             } catch (error) {
// //               console.log(error);
// //               Alert.alert("Error", "Something went wrong. Please try again.");
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // Cartoon-style header with popping letters in a single line (matching Home component)
// //   const Header = () => {
// //     const letters = [
     
// //       { char: 'P', index: 3 },
// //       { char: 'R', index: 4 },
// //       { char: 'O', index: 5 },
// //       { char: 'F', index: 6 },
// //       { char: 'I', index: 7 },
// //       { char: 'L', index: 8 },
// //       { char: 'E', index: 9, isSpecial: true },
     
// //     ];

// //     return (
// //       <View style={styles.header}>
// //         <View style={styles.logoContainer}>
// //           <View style={styles.cartoonTitleRow}>
// //             {letters.map((item) => (
// //               <Animated.Text
// //                 key={item.index}
// //                 style={[
// //                   styles.cartoonLetter,
// //                   item.isSpecial && styles.specialCartoonLetter,
// //                   item.isSpace && { width: item.width || 20 },
// //                   { 
// //                     transform: [{ scale: letterAnims.current[item.index] || 1 }],
// //                     marginHorizontal: item.isSpace ? 0 : 2,
// //                   }
// //                 ]}
// //               >
// //                 {item.char}
// //               </Animated.Text>
// //             ))}
// //           </View>
// //         </View>

// //         <TouchableOpacity 
// //           style={styles.notification}
// //           onPress={() => setModalVisible(true)}
// //         >
// //           <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// //           {notifications.length > 0 && (
// //             <View style={styles.badge}>
// //               <Text style={styles.badgeText}>{notifications.length}</Text>
// //             </View>
// //           )}
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   const StatCard = ({ number, label, icon, color }) => {
// //     const floatValue = floatAnim1.interpolate({
// //       inputRange: [0, 1],
// //       outputRange: [0, -10]
// //     });

// //     return (
// //       <Animated.View 
// //         style={[
// //           styles.statCard,
// //           {
// //             transform: [{ translateY: floatValue }]
// //           }
// //         ]}
// //       >
// //         <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
// //           <Ionicons name={icon} size={24} color={color} />
// //         </View>
// //         <Text style={styles.statNumber}>{number}</Text>
// //         <Text style={styles.statLabel}>{label}</Text>
// //       </Animated.View>
// //     );
// //   };

// //   const InfoCard = ({ icon, label, value, color }) => (
// //     <View style={styles.infoCard}>
// //       <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
// //         <Ionicons name={icon} size={20} color={color} />
// //       </View>
// //       <View style={styles.infoContent}>
// //         <Text style={styles.infoLabel}>{label}</Text>
// //         <Text style={styles.infoValue}>{value || "N/A"}</Text>
// //       </View>
// //     </View>
// //   );

// //   const SettingItem = ({ icon, title, description, color, onPress }) => (
// //     <TouchableOpacity style={styles.settingItem} onPress={onPress}>
// //       <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}>
// //         <Ionicons name={icon} size={22} color={color} />
// //       </View>
// //       <View style={styles.settingContent}>
// //         <Text style={styles.settingTitle}>{title}</Text>
// //         <Text style={styles.settingDescription}>{description}</Text>
// //       </View>
// //       <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
// //     </TouchableOpacity>
// //   );

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color={COLORS.primary} />
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// //       <View style={styles.container}>
// //         {/* Header with cartoon-style popping letters */}
// //         <Header />

// //         {/* Animated Background Elements */}
// //         <Animated.View 
// //           style={[
// //             styles.backgroundCircle1,
// //             {
// //               transform: [
// //                 { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
// //                 { scale: pulseAnim }
// //               ]
// //             }
// //           ]} 
// //         />
// //         <Animated.View 
// //           style={[
// //             styles.backgroundCircle2,
// //             {
// //               transform: [
// //                 { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
// //               ]
// //             }
// //           ]} 
// //         />
// //         <Animated.View 
// //           style={[
// //             styles.backgroundCircle3,
// //             {
// //               transform: [
// //                 { scale: pulseAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
// //               ]
// //             }
// //           ]} 
// //         />

// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor={COLORS.primary}
// //               colors={[COLORS.primary]}
// //             />
// //           }
// //         >
// //           {/* Profile Hero Section */}
// //           <Animated.View 
// //             style={[
// //               styles.profileHeroSection,
// //               {
// //                 opacity: fadeAnim,
// //                 transform: [{ scale: scaleAnim }]
// //               }
// //             ]}
// //           >
// //             <View style={styles.profileHeroContent}>
// //               <TouchableOpacity
// //                 onPress={() => editMode && setImageModalVisible(true)}
// //                 disabled={!editMode}
// //                 style={styles.profileImageContainer}
// //               >
// //                 <Image
// //                   source={{
// //                     uri: imageUri
// //                       ? imageUri
// //                       : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
// //                   }}
// //                   style={styles.profileImage}
// //                 />
// //                 {editMode && (
// //                   <View style={[styles.editImageBadge, { backgroundColor: COLORS.primary }]}>
// //                     <Ionicons name="camera" size={16} color={COLORS.surface} />
// //                   </View>
// //                 )}
// //               </TouchableOpacity>

// //               {editMode ? (
// //                 <View style={styles.nameInputContainer}>
// //                   <TextInput
// //                     style={styles.nameInput}
// //                     value={formData.name}
// //                     onChangeText={(text) => setFormData({ ...formData, name: text })}
// //                     placeholder="Enter your name"
// //                     placeholderTextColor={COLORS.textLight}
// //                   />
// //                 </View>
// //               ) : (
// //                 <>
// //                   <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
// //                   <View style={styles.profileBadge}>
// //                     <Ionicons name="star" size={14} color={COLORS.accent} />
// //                     <Text style={styles.profileBadgeText}>Premium Member</Text>
// //                   </View>
// //                 </>
// //               )}

// //               <View style={styles.profileActions}>
// //                 <TouchableOpacity
// //                   style={[styles.profileActionButton, editMode && { backgroundColor: COLORS.green }]}
// //                   onPress={() => {
// //                     if (editMode) {
// //                       updateProfile();
// //                     } else {
// //                       setEditMode(true);
// //                     }
// //                   }}
// //                   disabled={saving}
// //                 >
// //                   <Ionicons 
// //                     name={editMode ? "checkmark" : "pencil"} 
// //                     size={16} 
// //                     color={COLORS.surface} 
// //                   />
// //                   <Text style={styles.profileActionText}>
// //                     {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
// //                   </Text>
// //                 </TouchableOpacity>

// //                 {editMode && (
// //                   <TouchableOpacity
// //                     style={styles.profileCancelButton}
// //                     onPress={() => {
// //                       setEditMode(false);
// //                       setFormData({ name: user?.name || "" });
// //                       if (user?.profile_image_url) {
// //                         setImageUri(user.profile_image_url);
// //                       } else if (user?.profile_image) {
// //                         setImageUri(getFullImageUrl(user.profile_image));
// //                       } else {
// //                         setImageUri(null);
// //                       }
// //                     }}
// //                   >
// //                     <Ionicons name="close" size={16} color={COLORS.textLight} />
// //                     <Text style={styles.profileCancelText}>Cancel</Text>
// //                   </TouchableOpacity>
// //                 )}
// //               </View>
// //             </View>
// //           </Animated.View>

// //           {/* Stats Section */}
// //           <View style={styles.statsSection}>
// //             <StatCard number={user?.referral_points || "0"} label="Referral Points" icon="star" color={COLORS.primary} />
// //             <StatCard number="24/7" label="Support" icon="headset" color={COLORS.purple} />
// //             <StatCard number="10+" label="Games Played" icon="game-controller" color={COLORS.teal} />
// //           </View>

// //           {/* Account Information */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <Ionicons name="person-circle" size={22} color={COLORS.primary} />
// //                 <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
// //               </View>
// //             </View>

// //             <View style={styles.infoGrid}>
// //               <InfoCard 
// //                 icon="mail" 
// //                 label="Email Address" 
// //                 value={user?.email} 
// //                 color={COLORS.primary}
// //               />
// //               <InfoCard 
// //                 icon="call" 
// //                 label="Mobile Number" 
// //                 value={user?.mobile} 
// //                 color={COLORS.purple}
// //               />
// //               <InfoCard 
// //                 icon="gift" 
// //                 label="Referral Code" 
// //                 value={user?.referral_code} 
// //                 color={COLORS.teal}
// //               />
// //               <InfoCard 
// //                 icon="people" 
// //                 label="Under Referral" 
// //                 value={user?.under_referral || "None"} 
// //                 color={COLORS.orange}
// //               />
// //             </View>
// //           </View>

// //           {/* Account Status */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
// //                 <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
// //               </View>
// //             </View>

// //             <View style={styles.statusCard}>
// //               <View style={styles.statusPattern} />
// //               <View style={styles.statusRow}>
// //                 <View style={[styles.statusIndicator, { backgroundColor: COLORS.green }]} />
// //                 <View>
// //                   <Text style={styles.statusLabel}>Account Status</Text>
// //                   <Text style={styles.statusValue}>Active</Text>
// //                 </View>
// //                 <View style={styles.statusBadge}>
// //                   <Text style={styles.statusBadgeText}>Verified</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.statusDivider} />

// //               <View style={styles.statusRow}>
// //                 <View style={[styles.statusIndicator, { backgroundColor: COLORS.primary }]} />
// //                 <View>
// //                   <Text style={styles.statusLabel}>Member Since</Text>
// //                   <Text style={styles.statusValue}>
// //                     {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>

// //           {/* Quick Settings */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <Ionicons name="settings" size={22} color={COLORS.primary} />
// //                 <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
// //               </View>
// //             </View>

// //             <View style={styles.settingsCard}>
// //               <SettingItem 
// //                 icon="ticket"
// //                 title="My Tickets"
// //                 description="View your purchased tickets"
// //                 color={COLORS.primary}
// //                 onPress={() => Alert.alert("Coming Soon", "My Tickets feature coming soon!")}
// //               />
// //               <SettingItem 
// //                 icon="wallet"
// //                 title="Wallet"
// //                 description="Manage your balance"
// //                 color={COLORS.purple}
// //                 onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
// //               />
// //               <SettingItem 
// //                 icon="lock-closed"
// //                 title="Privacy & Security"
// //                 description="Manage your security settings"
// //                 color={COLORS.teal}
// //                 onPress={() => Alert.alert("Coming Soon", "Privacy settings coming soon!")}
// //               />
// //               <SettingItem 
// //                 icon="help-circle"
// //                 title="Help & Support"
// //                 description="Get help with your account"
// //                 color={COLORS.orange}
// //                 onPress={() => Linking.openURL('mailto:support@tambolatimez.com')}
// //               />
// //             </View>
// //           </View>

// //           {/* Recent Activity */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <Ionicons name="time" size={22} color={COLORS.primary} />
// //                 <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
// //               </View>
// //             </View>

// //             <View style={styles.activityCard}>
// //               <View style={styles.activityPattern} />
              
// //               <View style={styles.activityItem}>
// //                 <View style={[styles.activityIcon, { backgroundColor: COLORS.primary + '15' }]}>
// //                   <Ionicons name="game-controller" size={20} color={COLORS.primary} />
// //                 </View>
// //                 <View style={styles.activityContent}>
// //                   <Text style={styles.activityTitle}>Joined Game</Text>
// //                   <Text style={styles.activitySubtitle}>Tambola Classic #123</Text>
// //                   <Text style={styles.activityTime}>2 hours ago</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.activityDivider} />

// //               <View style={styles.activityItem}>
// //                 <View style={[styles.activityIcon, { backgroundColor: COLORS.orange + '15' }]}>
// //                   <Ionicons name="trophy" size={20} color={COLORS.orange} />
// //                 </View>
// //                 <View style={styles.activityContent}>
// //                   <Text style={styles.activityTitle}>Won Prize</Text>
// //                   <Text style={styles.activitySubtitle}>₹500 in Speed Tambola</Text>
// //                   <Text style={styles.activityTime}>1 day ago</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.activityDivider} />

// //               <View style={styles.activityItem}>
// //                 <View style={[styles.activityIcon, { backgroundColor: COLORS.green + '15' }]}>
// //                   <Ionicons name="wallet" size={20} color={COLORS.green} />
// //                 </View>
// //                 <View style={styles.activityContent}>
// //                   <Text style={styles.activityTitle}>Deposit</Text>
// //                   <Text style={styles.activitySubtitle}>₹1000 added to wallet</Text>
// //                   <Text style={styles.activityTime}>3 days ago</Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>

// //           {/* Logout Button */}
// //           <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
// //             <View style={[styles.logoutIcon, { backgroundColor: COLORS.red + '20' }]}>
// //               <Ionicons name="log-out" size={22} color={COLORS.red} />
// //             </View>
// //             <Text style={styles.logoutText}>Logout</Text>
// //           </TouchableOpacity>

// //           {/* Footer */}
// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>
// //               Version 1.0.0
// //             </Text>
// //             <Text style={styles.footerSubtext}>
// //               © {new Date().getFullYear()} Houzie Timez
// //             </Text>
// //           </View>

// //           <View style={styles.bottomSpace} />
// //         </ScrollView>

// //         {/* Image Selection Modal */}
// //         <Modal visible={imageModalVisible} transparent={true} animationType="fade">
// //           <View style={styles.modalOverlay}>
// //             <View style={styles.modalContent}>
// //               <View style={styles.modalHeader}>
// //                 <Text style={styles.modalTitle}>Update Profile Picture</Text>
// //                 <TouchableOpacity onPress={() => setImageModalVisible(false)}>
// //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// //                 </TouchableOpacity>
// //               </View>

// //               <TouchableOpacity
// //                 style={styles.modalOption}
// //                 onPress={() => handleImagePick("camera")}
// //               >
// //                 <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.primary + '15' }]}>
// //                   <Ionicons name="camera" size={24} color={COLORS.primary} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.modalOptionTitle}>Take Photo</Text>
// //                   <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.modalOption}
// //                 onPress={() => handleImagePick("gallery")}
// //               >
// //                 <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.purple + '15' }]}>
// //                   <Ionicons name="images" size={24} color={COLORS.purple} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
// //                   <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.modalCancelButton}
// //                 onPress={() => setImageModalVisible(false)}
// //               >
// //                 <Text style={styles.modalCancelText}>Cancel</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Modal>

// //         {/* Notifications Modal */}
// //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// //           <View style={styles.modalOverlay}>
// //             <View style={styles.modalContent}>
// //               <View style={styles.modalHeader}>
// //                 <Text style={styles.modalTitle}>Notifications</Text>
// //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// //                 </TouchableOpacity>
// //               </View>

// //               {loadingNotifications ? (
// //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// //               ) : (
// //                 <FlatList
// //                   data={notifications}
// //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// //                   renderItem={({ item }) => (
// //                     <View style={styles.notificationItem}>
// //                       <View style={styles.notificationIcon}>
// //                         <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
// //                       </View>
// //                       <View style={styles.notificationContent}>
// //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// //                         <Text style={styles.notificationMessage}>
// //                           {item.message || "Check out the latest updates!"}
// //                         </Text>
// //                         <Text style={styles.notificationDate}>
// //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// //                         </Text>
// //                       </View>
// //                     </View>
// //                   )}
// //                   ListEmptyComponent={
// //                     <View style={styles.emptyNotifications}>
// //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// //                       <Text style={styles.emptyText}>No notifications yet</Text>
// //                     </View>
// //                   }
// //                 />
// //               )}

// //               <TouchableOpacity
// //                 style={styles.closeBtn}
// //                 onPress={() => setModalVisible(false)}
// //               >
// //                 <Text style={styles.closeBtnText}>Close</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Modal>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   // Header styles matching Home component
// //   header: {
// //     backgroundColor: COLORS.primary,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     zIndex: 10,
// //   },
// //   logoContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   cartoonTitleRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
// //   },
// //   cartoonLetter: {
// //     fontSize: 34,
// //     fontWeight: '900',
// //     color: '#FDB800', // Gold color matching Home
// //     textTransform: 'uppercase',
// //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// //     textShadowOffset: { width: 3, height: 3 },
// //     textShadowRadius: 8,
// //     includeFontPadding: false,
// //     marginHorizontal: 2,
// //     // For Android
// //     ...Platform.select({
// //       android: {
// //         elevation: 5,
// //         textShadowColor: '#FFB300',
// //         textShadowOffset: { width: 2, height: 2 },
// //         textShadowRadius: 6,
// //       },
// //     }),
// //   },
// //   specialCartoonLetter: {
// //     fontSize: 40,
// //     color: '#FFD700',
// //     textShadowColor: '#FF8C00',
// //     textShadowOffset: { width: 4, height: 4 },
// //     textShadowRadius: 10,
// //     marginHorizontal: 2,
// //   },
// //   notification: {
// //     position: "relative",
// //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// //     padding: 10,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //     marginLeft: 8,
// //   },
// //   badge: {
// //     position: "absolute",
// //     top: -4,
// //     right: -4,
// //     backgroundColor: "red",
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   badgeText: {
// //     color: COLORS.surface,
// //     fontSize: 11,
// //     fontWeight: "700",
// //   },
  
// //   // Background Elements
// //   backgroundCircle1: {
// //     position: 'absolute',
// //     top: 100,
// //     right: -50,
// //     width: 200,
// //     height: 200,
// //     borderRadius: 100,
// //     backgroundColor: COLORS.primary + '10',
// //     zIndex: 0,
// //   },
// //   backgroundCircle2: {
// //     position: 'absolute',
// //     bottom: 200,
// //     left: -60,
// //     width: 250,
// //     height: 250,
// //     borderRadius: 125,
// //     backgroundColor: COLORS.purple + '08',
// //     zIndex: 0,
// //   },
// //   backgroundCircle3: {
// //     position: 'absolute',
// //     top: '50%',
// //     right: 20,
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: COLORS.orange + '05',
// //     zIndex: 0,
// //   },

// //   // Profile Hero Section
// //   profileHeroSection: {
// //     marginTop: 16,
// //     marginHorizontal: 16,
// //     marginBottom: 24,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 24,
// //     padding: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     zIndex: 2,
// //   },
// //   profileHeroContent: {
// //     alignItems: 'center',
// //   },
// //   profileImageContainer: {
// //     position: 'relative',
// //     marginBottom: 16,
// //   },
// //   profileImage: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     borderWidth: 3,
// //     borderColor: COLORS.surface,
// //     backgroundColor: COLORS.background,
// //   },
// //   editImageBadge: {
// //     position: 'absolute',
// //     bottom: 0,
// //     right: 0,
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   profileName: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //     marginBottom: 6,
// //   },
// //   profileBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.primary + '15',
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 20,
// //     gap: 4,
// //     marginBottom: 16,
// //   },
// //   profileBadgeText: {
// //     fontSize: 12,
// //     color: COLORS.primary,
// //     fontWeight: '600',
// //   },
// //   nameInputContainer: {
// //     width: '100%',
// //     marginBottom: 16,
// //   },
// //   nameInput: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     textAlign: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     paddingVertical: 10,
// //     paddingHorizontal: 16,
// //     backgroundColor: COLORS.background,
// //     borderRadius: 12,
// //     width: '100%',
// //   },
// //   profileActions: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   profileActionButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.primary,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     gap: 6,
// //   },
// //   profileActionText: {
// //     color: COLORS.surface,
// //     fontSize: 13,
// //     fontWeight: '600',
// //   },
// //   profileCancelButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     gap: 4,
// //   },
// //   profileCancelText: {
// //     color: COLORS.textLight,
// //     fontSize: 12,
// //     fontWeight: '500',
// //   },

// //   // Stats Section
// //   statsSection: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //     gap: 8,
// //     zIndex: 2,
// //   },
// //   statCard: {
// //     flex: 1,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 12,
// //     alignItems: 'center',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   statIconContainer: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   statNumber: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   statLabel: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //   },

// //   // Section
// //   section: {
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //     zIndex: 2,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   sectionTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },

// //   // Info Grid
// //   infoGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 8,
// //   },
// //   infoCard: {
// //     width: (width - 40) / 2,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 12,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   infoIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   infoContent: {
// //     gap: 2,
// //   },
// //   infoLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     fontWeight: '500',
// //   },
// //   infoValue: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },

// //   // Status Card
// //   statusCard: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 20,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   statusPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     width: 100,
// //     height: 100,
// //     backgroundColor: COLORS.primary + '05',
// //     borderBottomLeftRadius: 50,
// //   },
// //   statusRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   statusIndicator: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //   },
// //   statusLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     marginBottom: 2,
// //   },
// //   statusValue: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   statusBadge: {
// //     marginLeft: 'auto',
// //     backgroundColor: COLORS.green + '15',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //   },
// //   statusBadgeText: {
// //     fontSize: 11,
// //     color: COLORS.green,
// //     fontWeight: '600',
// //   },
// //   statusDivider: {
// //     height: 1,
// //     backgroundColor: COLORS.border,
// //     marginVertical: 12,
// //   },

// //   // Settings Card
// //   settingsCard: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 20,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   settingItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   settingIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   settingContent: {
// //     flex: 1,
// //   },
// //   settingTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   settingDescription: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },

// //   // Activity Card
// //   activityCard: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 20,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   activityPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 100,
// //     height: 100,
// //     backgroundColor: COLORS.primary + '05',
// //     borderTopRightRadius: 50,
// //   },
// //   activityItem: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   activityIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   activityContent: {
// //     flex: 1,
// //   },
// //   activityTitle: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   activitySubtitle: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginBottom: 2,
// //   },
// //   activityTime: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //   },
// //   activityDivider: {
// //     height: 1,
// //     backgroundColor: COLORS.border,
// //     marginVertical: 12,
// //   },

// //   // Logout Button
// //   logoutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: COLORS.surface,
// //     marginHorizontal: 16,
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     gap: 10,
// //     marginBottom: 24,
// //     borderWidth: 1,
// //     borderColor: COLORS.red,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   logoutIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   logoutText: {
// //     color: COLORS.red,
// //     fontWeight: '600',
// //     fontSize: 15,
// //   },

// //   // Footer
// //   footer: {
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     fontSize: 13,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //     marginBottom: 2,
// //   },
// //   footerSubtext: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },

// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContent: {
// //     width: '90%',
// //     maxHeight: '80%',
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 16,
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },
// //   modalOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.background,
// //     padding: 14,
// //     borderRadius: 12,
// //     marginBottom: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     gap: 12,
// //   },
// //   modalOptionIcon: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalOptionTitle: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   modalOptionDescription: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   modalCancelButton: {
// //     backgroundColor: 'transparent',
// //     padding: 14,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     marginTop: 8,
// //   },
// //   modalCancelText: {
// //     color: COLORS.textLight,
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },
// //   notificationItem: {
// //     flexDirection: 'row',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   notificationIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: '#F0F8FF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   notificationContent: {
// //     flex: 1,
// //   },
// //   notificationTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   notificationMessage: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginBottom: 4,
// //   },
// //   notificationDate: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //   },
// //   emptyNotifications: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 40,
// //   },
// //   emptyText: {
// //     marginTop: 12,
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //   },
// //   loadingIndicator: {
// //     marginVertical: 20,
// //   },
// //   closeBtn: {
// //     marginTop: 16,
// //     backgroundColor: COLORS.primary,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   closeBtnText: {
// //     color: COLORS.surface,
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },
// // });

// // export default Profile;






// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   Image,
// //   ScrollView,
// //   TouchableOpacity,
// //   FlatList,
// //   Modal,
// //   ActivityIndicator,
// //   RefreshControl,
// //   Dimensions,
// //   SafeAreaView,
// //   StatusBar,
// //   Animated,
// //   Easing,
// //   Platform,
// //   TextInput,
// //   Alert,
// //   Linking,
// // } from "react-native";
// // import LinearGradient from 'react-native-linear-gradient';
// // import axios from "axios";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useNavigation } from '@react-navigation/native';
// // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// // const { width } = Dimensions.get('window');

// // // Enhanced color scheme with gradients
// // const COLORS = {
// //   primary: "#4facfe",
// //   primaryGradient: ['#359df9', '#64d8f8'],
// //   secondary: "#FDB800",
// //   secondaryGradient: ['#FDB800', '#FF8C00'],
// //   background: "#f5f8ff",
// //   surface: "#FFFFFF",
// //   textDark: "#333333",
// //   textLight: "#777777",
// //   border: "#EEEEEE",
  
// //   // Status colors
// //   live: "#4CAF50",
// //   liveGradient: ['#4CAF50', '#45a049'],
// //   scheduled: "#ff9800",
// //   scheduledGradient: ['#ff9800', '#f57c00'],
// //   completed: "#ff9800",
// //   completedGradient: ['#ff9800', '#f57c00'],
  
// //   // Additional gradients
// //   prizeGradient: ['#4facfe20', '#00c6fb20'],
// //   winnerGradient: ['#4facfe10', '#9fcdff10'],
// //   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  
// //   // Individual colors
// //   purple: "#9B59B6",
// //   purpleGradient: ['#9B59B6', '#8E44AD'],
// //   orange: "#FF9800",
// //   orangeGradient: ['#FF9800', '#F57C00'],
// //   teal: "#4ECDC4",
// //   tealGradient: ['#4ECDC4', '#2AA7A0'],
// //   red: "#EF4444",
// //   redGradient: ['#EF4444', '#DC2626'],
// //   green: "#10B981",
// //   greenGradient: ['#10B981', '#059669'],
// // };

// // const BASE_URL = "https://tambolatime.co.in/public/";

// // const Profile = ({ onLogout }) => {
// //   const navigation = useNavigation();
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [editMode, setEditMode] = useState(false);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //   });
// //   const [imageUri, setImageUri] = useState(null);
// //   const [saving, setSaving] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [notifications, setNotifications] = useState([]);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [imageModalVisible, setImageModalVisible] = useState(false);
// //   const [loadingNotifications, setLoadingNotifications] = useState(true);
  
// //   // Animation values
// //   const letterAnims = useRef([]);
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const scaleAnim = useRef(new Animated.Value(0.9)).current;
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
  
// //   // Button animation refs
// //   const editButtonScale = useRef(new Animated.Value(1)).current;
// //   const cancelButtonScale = useRef(new Animated.Value(1)).current;
// //   const logoutButtonScale = useRef(new Animated.Value(1)).current;
// //   const settingButtonScales = useRef([1, 2, 3, 4].map(() => new Animated.Value(1)));

// //   // Helper function to get full image URL
// //   const getFullImageUrl = (imagePath) => {
// //     if (!imagePath) return null;
// //     if (imagePath.startsWith('http')) return imagePath;
// //     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
// //     return BASE_URL + cleanPath;
// //   };

// //   useEffect(() => {
// //     // Initialize letter animations for header
// //     letterAnims.current = Array(18).fill().map(() => new Animated.Value(1));
    
// //     // Animate each letter with a popping effect
// //     letterAnims.current.forEach((anim, index) => {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.delay(index * 80),
// //           Animated.timing(anim, {
// //             toValue: 1.4,
// //             duration: 300,
// //             useNativeDriver: true,
// //             easing: Easing.bounce,
// //           }),
// //           Animated.timing(anim, {
// //             toValue: 1,
// //             duration: 200,
// //             useNativeDriver: true,
// //             easing: Easing.bounce,
// //           }),
// //           Animated.delay(1800),
// //         ])
// //       ).start();
// //     });

// //     // Start button animations
// //     startPulseAnimation(editButtonScale, 800);
// //     startPulseAnimation(logoutButtonScale, 1000);
    
// //     settingButtonScales.current.forEach((anim, index) => {
// //       startPulseAnimation(anim, 800 + (index * 100));
// //     });

// //     fetchProfile();
// //     fetchNotifications();
// //     startAnimations();
    
// //     // Entrance animation
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 800,
// //         useNativeDriver: true,
// //       }),
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 8,
// //         tension: 40,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   }, []);

// //   const startPulseAnimation = (anim, duration = 800) => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(anim, {
// //           toValue: 1.08,
// //           duration: duration,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         }),
// //         Animated.timing(anim, {
// //           toValue: 1,
// //           duration: duration,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         })
// //       ])
// //     ).start();
// //   };

// //   const startAnimations = () => {
// //     // Floating animations
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim1, {
// //           toValue: 1,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim1, {
// //           toValue: 0,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim2, {
// //           toValue: 1,
// //           duration: 5000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim2, {
// //           toValue: 0,
// //           duration: 5000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   };

// //   const fetchProfile = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         `${BASE_URL}api/user/profile`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (res.data.user) {
// //         setUser(res.data.user);
// //         setFormData({
// //           name: res.data.user.name || "",
// //         });
        
// //         if (res.data.user.profile_image_url) {
// //           setImageUri(res.data.user.profile_image_url);
// //         } else if (res.data.user.profile_image) {
// //           setImageUri(getFullImageUrl(res.data.user.profile_image));
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Fetch profile error:", error);
// //       Alert.alert("Error", "Failed to fetch profile information");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchNotifications = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
// //       const res = await axios.get(
// //         `${BASE_URL}api/user/notifications`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.status) {
// //         setNotifications(res.data.data || []);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching notifications:", error);
// //     } finally {
// //       setLoadingNotifications(false);
// //     }
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     Promise.all([fetchProfile(), fetchNotifications()]).finally(() => setRefreshing(false));
// //   }, []);

// //   const handleImagePick = async (source) => {
// //     setImageModalVisible(false);
    
// //     const options = {
// //       mediaType: 'photo',
// //       maxWidth: 500,
// //       maxHeight: 500,
// //       quality: 0.8,
// //       includeBase64: false,
// //       saveToPhotos: false,
// //       selectionLimit: 1,
// //     };
    
// //     try {
// //       let result;
      
// //       if (source === "camera") {
// //         result = await launchCamera(options);
// //       } else {
// //         result = await launchImageLibrary(options);
// //       }

// //       if (result.didCancel) {
// //         console.log('User cancelled image picker');
// //       } else if (result.errorCode) {
// //         console.log('ImagePicker Error: ', result.errorMessage);
// //         Alert.alert("Error", result.errorMessage || "Failed to pick image");
// //       } else if (result.assets && result.assets.length > 0) {
// //         const selectedImage = result.assets[0];
// //         setImageUri(selectedImage.uri);
// //       }
// //     } catch (error) {
// //       console.log("Image picker error:", error);
// //       Alert.alert("Error", "Failed to pick image");
// //     }
// //   };

// //   const updateProfile = async () => {
// //     if (!formData.name.trim()) {
// //       Alert.alert("Error", "Name is required");
// //       return;
// //     }

// //     setSaving(true);
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const formDataToSend = new FormData();

// //       formDataToSend.append("name", formData.name);

// //       if (imageUri && 
// //           !imageUri.startsWith(BASE_URL) && 
// //           !imageUri.startsWith('http') &&
// //           (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
// //         const localUri = imageUri;
// //         const filename = localUri.split('/').pop();
        
// //         let type = 'image/jpeg';
// //         if (filename) {
// //           const match = /\.(\w+)$/.exec(filename);
// //           if (match) {
// //             type = `image/${match[1]}`;
// //           }
// //         }

// //         formDataToSend.append('profile_image', {
// //           uri: localUri,
// //           name: filename || `profile_${Date.now()}.jpg`,
// //           type,
// //         });
// //       }

// //       const response = await axios.post(
// //         `${BASE_URL}api/user/profile`,
// //         formDataToSend,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'multipart/form-data',
// //           },
// //         }
// //       );

// //       if (response.data.user) {
// //         setUser(response.data.user);
// //         Alert.alert("Success", "Profile updated successfully!");
// //         setEditMode(false);
        
// //         if (response.data.user.profile_image_url) {
// //           setImageUri(response.data.user.profile_image_url);
// //         } else if (response.data.user.profile_image) {
// //           setImageUri(getFullImageUrl(response.data.user.profile_image));
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Update error:", error);
// //       Alert.alert("Error", "Failed to update profile");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const logoutUser = async () => {
// //     Alert.alert(
// //       "Logout",
// //       "Are you sure you want to logout?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { 
// //           text: "Logout", 
// //           style: "destructive", 
// //           onPress: async () => {
// //             try {
// //               const token = await AsyncStorage.getItem("token");
// //               await axios.post(
// //                 `${BASE_URL}api/user/logout`,
// //                 {},
// //                 { headers: { Authorization: `Bearer ${token}` } }
// //               );
// //               await AsyncStorage.removeItem("token");
// //               await AsyncStorage.removeItem("user");
// //               onLogout();
// //             } catch (error) {
// //               console.log(error);
// //               Alert.alert("Error", "Something went wrong. Please try again.");
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // Cartoon-style header with popping letters
// //   const Header = () => {
// //     const letters = [
// //       { char: 'H', index: 0 },
// //       { char: 'O', index: 1, isSpecial: true },
// //       { char: 'U', index: 2 },
// //       { char: 'Z', index: 3 },
// //       { char: 'I', index: 4 },
// //       { char: 'E', index: 5 },
// //       { char: ' ', index: 6, isSpace: true, width: 20 },
// //       { char: 'T', index: 7 },
// //       { char: 'I', index: 8 },
// //       { char: 'M', index: 9 },
// //       { char: 'E', index: 10 },
// //       { char: 'Z', index: 11, isSpecial: true },
// //     ];

// //     return (
// //       <LinearGradient
// //         colors={COLORS.primaryGradient}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //         style={styles.header}
// //       >
// //         <View style={styles.logoContainer}>
// //           <View style={styles.cartoonTitleRow}>
// //             {letters.map((item) => (
// //               <Animated.Text
// //                 key={item.index}
// //                 style={[
// //                   styles.cartoonLetter,
// //                   item.isSpecial && styles.specialCartoonLetter,
// //                   { 
// //                     transform: [{ scale: letterAnims.current[item.index] || 1 }],
// //                   }
// //                 ]}
// //               >
// //                 {item.char}
// //               </Animated.Text>
// //             ))}
// //           </View>
// //         </View>

// //         <TouchableOpacity 
// //           style={styles.notification}
// //           onPress={() => setModalVisible(true)}
// //         >
// //           <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// //           {notifications.length > 0 && (
// //             <View style={styles.badge}>
// //               <Text style={styles.badgeText}>{notifications.length}</Text>
// //             </View>
// //           )}
// //         </TouchableOpacity>
// //       </LinearGradient>
// //     );
// //   };

// //   const StatCard = ({ number, label, icon, color }) => {
// //     const floatValue = floatAnim1.interpolate({
// //       inputRange: [0, 1],
// //       outputRange: [0, -10]
// //     });

// //     return (
// //       <Animated.View 
// //         style={[
// //           styles.statCard,
// //           {
// //             transform: [{ translateY: floatValue }]
// //           }
// //         ]}
// //       >
// //         <LinearGradient
// //           colors={[color + '20', color + '10']}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.statIconContainer}
// //         >
// //           <Ionicons name={icon} size={24} color={color} />
// //         </LinearGradient>
// //         <Text style={styles.statNumber}>{number}</Text>
// //         <Text style={styles.statLabel}>{label}</Text>
// //       </Animated.View>
// //     );
// //   };

// //   const InfoCard = ({ icon, label, value, color }) => {
// //     return (
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.infoCard}
// //       >
// //         <LinearGradient
// //           colors={[color + '20', color + '10']}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.infoIcon}
// //         >
// //           <Ionicons name={icon} size={20} color={color} />
// //         </LinearGradient>
// //         <View style={styles.infoContent}>
// //           <Text style={styles.infoLabel}>{label}</Text>
// //           <Text style={styles.infoValue}>{value || "N/A"}</Text>
// //         </View>
// //       </LinearGradient>
// //     );
// //   };

// //   const SettingItem = ({ icon, title, description, color, onPress, index }) => {
// //     const scaleAnim = settingButtonScales.current[index] || new Animated.Value(1);

// //     return (
// //       <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// //         <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.8}>
// //           <LinearGradient
// //             colors={[color + '20', color + '10']}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.settingIcon}
// //           >
// //             <Ionicons name={icon} size={22} color={color} />
// //           </LinearGradient>
// //           <View style={styles.settingContent}>
// //             <Text style={styles.settingTitle}>{title}</Text>
// //             <Text style={styles.settingDescription}>{description}</Text>
// //           </View>
// //           <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
// //         </TouchableOpacity>
// //       </Animated.View>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <LinearGradient
// //           colors={COLORS.primaryGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.loadingContainer}
// //         >
// //           <ActivityIndicator size="large" color={COLORS.surface} />
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// //       <View style={styles.container}>
// //         {/* Header with cartoon-style popping letters */}
// //         <Header />

// //         {/* Animated Background Elements */}
// //         <Animated.View 
// //           style={[
// //             styles.backgroundCircle1,
// //             {
// //               transform: [
// //                 { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) }
// //               ]
// //             }
// //           ]} 
// //         />
// //         <Animated.View 
// //           style={[
// //             styles.backgroundCircle2,
// //             {
// //               transform: [
// //                 { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
// //               ]
// //             }
// //           ]} 
// //         />

// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor={COLORS.primary}
// //               colors={[COLORS.primary]}
// //             />
// //           }
// //         >
// //           {/* Profile Hero Section */}
// //           <Animated.View 
// //             style={[
// //               styles.profileHeroSection,
// //               {
// //                 opacity: fadeAnim,
// //                 transform: [{ scale: scaleAnim }]
// //               }
// //             ]}
// //           >
// //             <LinearGradient
// //               colors={COLORS.winnerGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.profileHeroPattern}
// //             />
// //             <View style={styles.profileHeroContent}>
// //               <TouchableOpacity
// //                 onPress={() => editMode && setImageModalVisible(true)}
// //                 disabled={!editMode}
// //                 style={styles.profileImageContainer}
// //               >
// //                 <Image
// //                   source={{
// //                     uri: imageUri
// //                       ? imageUri
// //                       : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
// //                   }}
// //                   style={styles.profileImage}
// //                 />
// //                 {editMode && (
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.editImageBadge}
// //                   >
// //                     <Ionicons name="camera" size={16} color={COLORS.surface} />
// //                   </LinearGradient>
// //                 )}
// //               </TouchableOpacity>

// //               {editMode ? (
// //                 <View style={styles.nameInputContainer}>
// //                   <TextInput
// //                     style={styles.nameInput}
// //                     value={formData.name}
// //                     onChangeText={(text) => setFormData({ ...formData, name: text })}
// //                     placeholder="Enter your name"
// //                     placeholderTextColor={COLORS.textLight}
// //                   />
// //                 </View>
// //               ) : (
// //                 <>
// //                   <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
// //                   <LinearGradient
// //                     colors={COLORS.prizeGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.profileBadge}
// //                   >
// //                     <Ionicons name="star" size={14} color={COLORS.secondary} />
// //                     <Text style={styles.profileBadgeText}>Premium Member</Text>
// //                   </LinearGradient>
// //                 </>
// //               )}

// //               <View style={styles.profileActions}>
// //                 {/* Edit/Save Button with Pop Animation */}
// //                 <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
// //                   <TouchableOpacity
// //                     onPress={() => {
// //                       if (editMode) {
// //                         updateProfile();
// //                       } else {
// //                         setEditMode(true);
// //                       }
// //                     }}
// //                     disabled={saving}
// //                     activeOpacity={0.8}
// //                   >
// //                     <LinearGradient
// //                       colors={editMode ? COLORS.greenGradient : COLORS.primaryGradient}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 0 }}
// //                       style={styles.profileActionButton}
// //                     >
// //                       <LinearGradient
// //                         colors={COLORS.glassGradient}
// //                         start={{ x: 0, y: 0 }}
// //                         end={{ x: 1, y: 1 }}
// //                         style={styles.glassEffectOverlay}
// //                       />
// //                       <Ionicons 
// //                         name={editMode ? "checkmark" : "pencil"} 
// //                         size={16} 
// //                         color={COLORS.surface} 
// //                       />
// //                       <Text style={styles.profileActionText}>
// //                         {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
// //                       </Text>
// //                     </LinearGradient>
// //                   </TouchableOpacity>
// //                 </Animated.View>

// //                 {/* Cancel Button with Pop Animation (only in edit mode) */}
// //                 {editMode && (
// //                   <Animated.View style={{ transform: [{ scale: cancelButtonScale }] }}>
// //                     <TouchableOpacity
// //                       style={styles.profileCancelButton}
// //                       onPress={() => {
// //                         setEditMode(false);
// //                         setFormData({ name: user?.name || "" });
// //                         if (user?.profile_image_url) {
// //                           setImageUri(user.profile_image_url);
// //                         } else if (user?.profile_image) {
// //                           setImageUri(getFullImageUrl(user.profile_image));
// //                         } else {
// //                           setImageUri(null);
// //                         }
// //                       }}
// //                     >
// //                       <Ionicons name="close" size={16} color={COLORS.textLight} />
// //                       <Text style={styles.profileCancelText}>Cancel</Text>
// //                     </TouchableOpacity>
// //                   </Animated.View>
// //                 )}
// //               </View>
// //             </View>
// //           </Animated.View>

// //           {/* Stats Section */}
// //           <View style={styles.statsSection}>
// //             <StatCard number={user?.referral_points || "0"} label="Referral Points" icon="star" color={COLORS.primary} />
// //             <StatCard number="24/7" label="Support" icon="headset" color={COLORS.purple} />
// //             <StatCard number="10+" label="Games Played" icon="game-controller" color={COLORS.teal} />
// //           </View>

// //           {/* Account Information */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.sectionIcon}
// //                 >
// //                   <Ionicons name="person-circle" size={16} color={COLORS.surface} />
// //                 </LinearGradient>
// //                 <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
// //               </View>
// //             </View>

// //             <View style={styles.infoGrid}>
// //               <InfoCard 
// //                 icon="mail" 
// //                 label="Email Address" 
// //                 value={user?.email} 
// //                 color={COLORS.primary}
// //               />
// //               <InfoCard 
// //                 icon="call" 
// //                 label="Mobile Number" 
// //                 value={user?.mobile} 
// //                 color={COLORS.purple}
// //               />
// //               <InfoCard 
// //                 icon="gift" 
// //                 label="Referral Code" 
// //                 value={user?.referral_code} 
// //                 color={COLORS.teal}
// //               />
// //               <InfoCard 
// //                 icon="people" 
// //                 label="Under Referral" 
// //                 value={user?.under_referral || "None"} 
// //                 color={COLORS.orange}
// //               />
// //             </View>
// //           </View>

// //           {/* Account Status */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.sectionIcon}
// //                 >
// //                   <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
// //                 </LinearGradient>
// //                 <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
// //               </View>
// //             </View>

// //             <LinearGradient
// //               colors={[COLORS.surface, COLORS.surface]}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.statusCard}
// //             >
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statusPattern}
// //               />
// //               <View style={styles.statusRow}>
// //                 <LinearGradient
// //                   colors={COLORS.greenGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={[styles.statusIndicator, { width: 8, height: 8, borderRadius: 4 }]}
// //                 />
// //                 <View>
// //                   <Text style={styles.statusLabel}>Account Status</Text>
// //                   <Text style={styles.statusValue}>Active</Text>
// //                 </View>
// //                 <LinearGradient
// //                   colors={COLORS.greenGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statusBadge}
// //                 >
// //                   <Text style={styles.statusBadgeText}>Verified</Text>
// //                 </LinearGradient>
// //               </View>

// //               <View style={styles.statusDivider} />

// //               <View style={styles.statusRow}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={[styles.statusIndicator, { width: 8, height: 8, borderRadius: 4 }]}
// //                 />
// //                 <View>
// //                   <Text style={styles.statusLabel}>Member Since</Text>
// //                   <Text style={styles.statusValue}>
// //                     {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </LinearGradient>
// //           </View>

// //           {/* Quick Settings */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.sectionIcon}
// //                 >
// //                   <Ionicons name="settings" size={16} color={COLORS.surface} />
// //                 </LinearGradient>
// //                 <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
// //               </View>
// //             </View>

// //             <LinearGradient
// //               colors={[COLORS.surface, COLORS.surface]}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.settingsCard}
// //             >
// //               <SettingItem 
// //                 icon="ticket"
// //                 title="My Tickets"
// //                 description="View your purchased tickets"
// //                 color={COLORS.primary}
// //                 index={0}
// //                 onPress={() => Alert.alert("Coming Soon", "My Tickets feature coming soon!")}
// //               />
// //               <SettingItem 
// //                 icon="wallet"
// //                 title="Wallet"
// //                 description="Manage your balance"
// //                 color={COLORS.purple}
// //                 index={1}
// //                 onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
// //               />
// //               <SettingItem 
// //                 icon="lock-closed"
// //                 title="Privacy & Security"
// //                 description="Manage your security settings"
// //                 color={COLORS.teal}
// //                 index={2}
// //                 onPress={() => Alert.alert("Coming Soon", "Privacy settings coming soon!")}
// //               />
// //               <SettingItem 
// //                 icon="help-circle"
// //                 title="Help & Support"
// //                 description="Get help with your account"
// //                 color={COLORS.orange}
// //                 index={3}
// //                 onPress={() => Linking.openURL('mailto:support@tambolatimez.com')}
// //               />
// //             </LinearGradient>
// //           </View>

// //           {/* Recent Activity */}
// //           {/* <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.sectionIcon}
// //                 >
// //                   <Ionicons name="time" size={16} color={COLORS.surface} />
// //                 </LinearGradient>
// //                 <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
// //               </View>
// //             </View>

// //             <LinearGradient
// //               colors={[COLORS.surface, COLORS.surface]}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.activityCard}
// //             >
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.activityPattern}
// //               />
              
// //               <View style={styles.activityItem}>
// //                 <LinearGradient
// //                   colors={[COLORS.primary + '20', COLORS.primary + '10']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.activityIcon}
// //                 >
// //                   <Ionicons name="game-controller" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.activityContent}>
// //                   <Text style={styles.activityTitle}>Joined Game</Text>
// //                   <Text style={styles.activitySubtitle}>Tambola Classic #123</Text>
// //                   <Text style={styles.activityTime}>2 hours ago</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.activityDivider} />

// //               <View style={styles.activityItem}>
// //                 <LinearGradient
// //                   colors={[COLORS.orange + '20', COLORS.orange + '10']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.activityIcon}
// //                 >
// //                   <Ionicons name="trophy" size={20} color={COLORS.orange} />
// //                 </LinearGradient>
// //                 <View style={styles.activityContent}>
// //                   <Text style={styles.activityTitle}>Won Prize</Text>
// //                   <Text style={styles.activitySubtitle}>₹500 in Speed Tambola</Text>
// //                   <Text style={styles.activityTime}>1 day ago</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.activityDivider} />

// //               <View style={styles.activityItem}>
// //                 <LinearGradient
// //                   colors={[COLORS.green + '20', COLORS.green + '10']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.activityIcon}
// //                 >
// //                   <Ionicons name="wallet" size={20} color={COLORS.green} />
// //                 </LinearGradient>
// //                 <View style={styles.activityContent}>
// //                   <Text style={styles.activityTitle}>Deposit</Text>
// //                   <Text style={styles.activitySubtitle}>₹1000 added to wallet</Text>
// //                   <Text style={styles.activityTime}>3 days ago</Text>
// //                 </View>
// //               </View>
// //             </LinearGradient>
// //           </View> */}

// //           {/* Logout Button with Pop Animation */}
// //           <Animated.View style={{ transform: [{ scale: logoutButtonScale }] }}>
// //             <TouchableOpacity onPress={logoutUser} activeOpacity={0.8}>
// //               <LinearGradient
// //                 colors={[COLORS.surface, COLORS.surface]}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.logoutButton}
// //               >
// //                 <LinearGradient
// //                   colors={[COLORS.red + '20', COLORS.red + '10']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.logoutIcon}
// //                 >
// //                   <Ionicons name="log-out" size={22} color={COLORS.red} />
// //                 </LinearGradient>
// //                 <Text style={styles.logoutText}>Logout</Text>
// //               </LinearGradient>
// //             </TouchableOpacity>
// //           </Animated.View>

// //           {/* Footer */}
// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>
// //               Version 1.0.0
// //             </Text>
// //             <Text style={styles.footerSubtext}>
// //               © {new Date().getFullYear()} Houzie Timez
// //             </Text>
// //           </View>

// //           <View style={styles.bottomSpace} />
// //         </ScrollView>

// //         {/* Image Selection Modal */}
// //         <Modal visible={imageModalVisible} transparent={true} animationType="fade">
// //           <View style={styles.modalOverlay}>
// //             <LinearGradient
// //               colors={[COLORS.surface, COLORS.surface]}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.modalContent}
// //             >
// //               <View style={styles.modalHeader}>
// //                 <Text style={styles.modalTitle}>Update Profile Picture</Text>
// //                 <TouchableOpacity onPress={() => setImageModalVisible(false)}>
// //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// //                 </TouchableOpacity>
// //               </View>

// //               <TouchableOpacity
// //                 style={styles.modalOption}
// //                 onPress={() => handleImagePick("camera")}
// //               >
// //                 <LinearGradient
// //                   colors={[COLORS.primary + '20', COLORS.primary + '10']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.modalOptionIcon}
// //                 >
// //                   <Ionicons name="camera" size={24} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View>
// //                   <Text style={styles.modalOptionTitle}>Take Photo</Text>
// //                   <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.modalOption}
// //                 onPress={() => handleImagePick("gallery")}
// //               >
// //                 <LinearGradient
// //                   colors={[COLORS.purple + '20', COLORS.purple + '10']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.modalOptionIcon}
// //                 >
// //                   <Ionicons name="images" size={24} color={COLORS.purple} />
// //                 </LinearGradient>
// //                 <View>
// //                   <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
// //                   <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.modalCancelButton}
// //                 onPress={() => setImageModalVisible(false)}
// //               >
// //                 <Text style={styles.modalCancelText}>Cancel</Text>
// //               </TouchableOpacity>
// //             </LinearGradient>
// //           </View>
// //         </Modal>

// //         {/* Notifications Modal */}
// //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// //           <View style={styles.modalOverlay}>
// //             <LinearGradient
// //               colors={COLORS.winnerGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.modalContent}
// //             >
// //               <View style={styles.modalHeader}>
// //                 <Text style={styles.modalTitle}>Notifications</Text>
// //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// //                 </TouchableOpacity>
// //               </View>

// //               {loadingNotifications ? (
// //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// //               ) : (
// //                 <FlatList
// //                   data={notifications}
// //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// //                   renderItem={({ item }) => (
// //                     <View style={styles.notificationItem}>
// //                       <LinearGradient
// //                         colors={COLORS.primaryGradient}
// //                         start={{ x: 0, y: 0 }}
// //                         end={{ x: 1, y: 1 }}
// //                         style={styles.notificationIcon}
// //                       >
// //                         <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
// //                       </LinearGradient>
// //                       <View style={styles.notificationContent}>
// //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// //                         <Text style={styles.notificationMessage}>
// //                           {item.message || "Check out the latest updates!"}
// //                         </Text>
// //                         <Text style={styles.notificationDate}>
// //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// //                         </Text>
// //                       </View>
// //                     </View>
// //                   )}
// //                   ListEmptyComponent={
// //                     <View style={styles.emptyNotifications}>
// //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// //                       <Text style={styles.emptyText}>No notifications yet</Text>
// //                     </View>
// //                   }
// //                 />
// //               )}

// //               <TouchableOpacity
// //                 onPress={() => setModalVisible(false)}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 0 }}
// //                   style={styles.closeBtn}
// //                 >
// //                   <Text style={styles.closeBtnText}>Close</Text>
// //                 </LinearGradient>
// //               </TouchableOpacity>
// //             </LinearGradient>
// //           </View>
// //         </Modal>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   header: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     zIndex: 10,
// //   },
// //   logoContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   cartoonTitleRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
// //   },
// //   cartoonLetter: {
// //     fontSize: 34,
// //     fontWeight: '900',
// //     color: '#FDB800',
// //     textTransform: 'uppercase',
// //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// //     textShadowOffset: { width: 3, height: 3 },
// //     textShadowRadius: 8,
// //     includeFontPadding: false,
// //     marginHorizontal: 2,
// //     ...Platform.select({
// //       android: {
// //         elevation: 5,
// //         textShadowColor: '#FFB300',
// //         textShadowOffset: { width: 2, height: 2 },
// //         textShadowRadius: 6,
// //       },
// //     }),
// //   },
// //   specialCartoonLetter: {
// //     fontSize: 40,
// //     color: '#FFD700',
// //     textShadowColor: '#FF8C00',
// //     textShadowOffset: { width: 4, height: 4 },
// //     textShadowRadius: 10,
// //     marginHorizontal: 2,
// //   },
// //   notification: {
// //     position: "relative",
// //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// //     padding: 10,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //     marginLeft: 8,
// //   },
// //   badge: {
// //     position: "absolute",
// //     top: -4,
// //     right: -4,
// //     backgroundColor: "red",
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   badgeText: {
// //     color: COLORS.surface,
// //     fontSize: 11,
// //     fontWeight: "700",
// //   },
  
// //   // Background Elements
// //   backgroundCircle1: {
// //     position: 'absolute',
// //     top: 100,
// //     right: -50,
// //     width: 200,
// //     height: 200,
// //     borderRadius: 100,
// //     backgroundColor: COLORS.primary + '10',
// //     zIndex: 0,
// //   },
// //   backgroundCircle2: {
// //     position: 'absolute',
// //     bottom: 200,
// //     left: -60,
// //     width: 250,
// //     height: 250,
// //     borderRadius: 125,
// //     backgroundColor: COLORS.purple + '08',
// //     zIndex: 0,
// //   },

// //   // Glass Effect
// //   glassEffectOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// //     borderRadius: 10,
// //   },

// //   // Profile Hero Section
// //   profileHeroSection: {
// //     marginTop: 16,
// //     marginHorizontal: 16,
// //     marginBottom: 24,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 24,
// //     padding: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     zIndex: 2,
// //   },
// //   profileHeroPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     width: 150,
// //     height: 150,
// //     borderBottomLeftRadius: 75,
// //   },
// //   profileHeroContent: {
// //     alignItems: 'center',
// //   },
// //   profileImageContainer: {
// //     position: 'relative',
// //     marginBottom: 16,
// //   },
// //   profileImage: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     borderWidth: 3,
// //     borderColor: COLORS.surface,
// //     backgroundColor: COLORS.background,
// //   },
// //   editImageBadge: {
// //     position: 'absolute',
// //     bottom: 0,
// //     right: 0,
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   profileName: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //     marginBottom: 6,
// //   },
// //   profileBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 20,
// //     gap: 4,
// //     marginBottom: 16,
// //   },
// //   profileBadgeText: {
// //     fontSize: 12,
// //     color: COLORS.primary,
// //     fontWeight: '600',
// //   },
// //   nameInputContainer: {
// //     width: '100%',
// //     marginBottom: 16,
// //   },
// //   nameInput: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     textAlign: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     paddingVertical: 10,
// //     paddingHorizontal: 16,
// //     backgroundColor: COLORS.background,
// //     borderRadius: 12,
// //     width: '100%',
// //   },
// //   profileActions: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   profileActionButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     gap: 6,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   profileActionText: {
// //     color: COLORS.surface,
// //     fontSize: 13,
// //     fontWeight: '600',
// //   },
// //   profileCancelButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     gap: 4,
// //     backgroundColor: COLORS.background,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   profileCancelText: {
// //     color: COLORS.textLight,
// //     fontSize: 12,
// //     fontWeight: '500',
// //   },

// //   // Stats Section
// //   statsSection: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //     gap: 8,
// //     zIndex: 2,
// //   },
// //   statCard: {
// //     flex: 1,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 12,
// //     alignItems: 'center',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   statIconContainer: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   statNumber: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   statLabel: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //   },

// //   // Section
// //   section: {
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //     zIndex: 2,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   sectionTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   sectionIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },

// //   // Info Grid
// //   infoGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: 8,
// //   },
// //   infoCard: {
// //     width: (width - 40) / 2,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 12,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   infoIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   infoContent: {
// //     gap: 2,
// //   },
// //   infoLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     fontWeight: '500',
// //   },
// //   infoValue: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },

// //   // Status Card
// //   statusCard: {
// //     borderRadius: 20,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   statusPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     width: 100,
// //     height: 100,
// //     borderBottomLeftRadius: 50,
// //   },
// //   statusRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   statusIndicator: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //   },
// //   statusLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     marginBottom: 2,
// //   },
// //   statusValue: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   statusBadge: {
// //     marginLeft: 'auto',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //   },
// //   statusBadgeText: {
// //     fontSize: 11,
// //     color: COLORS.surface,
// //     fontWeight: '600',
// //   },
// //   statusDivider: {
// //     height: 1,
// //     backgroundColor: COLORS.border,
// //     marginVertical: 12,
// //   },

// //   // Settings Card
// //   settingsCard: {
// //     borderRadius: 20,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   settingItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   settingIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   settingContent: {
// //     flex: 1,
// //   },
// //   settingTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   settingDescription: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },

// //   // Activity Card
// //   activityCard: {
// //     borderRadius: 20,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   activityPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 100,
// //     height: 100,
// //     borderTopRightRadius: 50,
// //   },
// //   activityItem: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   activityIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   activityContent: {
// //     flex: 1,
// //   },
// //   activityTitle: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   activitySubtitle: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginBottom: 2,
// //   },
// //   activityTime: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //   },
// //   activityDivider: {
// //     height: 1,
// //     backgroundColor: COLORS.border,
// //     marginVertical: 12,
// //   },

// //   // Logout Button
// //   logoutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginHorizontal: 16,
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     gap: 10,
// //     marginBottom: 24,
// //     borderWidth: 1,
// //     borderColor: COLORS.red,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   logoutIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   logoutText: {
// //     color: COLORS.red,
// //     fontWeight: '600',
// //     fontSize: 15,
// //   },

// //   // Footer
// //   footer: {
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     fontSize: 13,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //     marginBottom: 2,
// //   },
// //   footerSubtext: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },

// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContent: {
// //     width: '90%',
// //     maxHeight: '80%',
// //     borderRadius: 16,
// //     padding: 16,
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },
// //   modalOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.background,
// //     padding: 14,
// //     borderRadius: 12,
// //     marginBottom: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     gap: 12,
// //   },
// //   modalOptionIcon: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalOptionTitle: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   modalOptionDescription: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   modalCancelButton: {
// //     backgroundColor: 'transparent',
// //     padding: 14,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     marginTop: 8,
// //   },
// //   modalCancelText: {
// //     color: COLORS.textLight,
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },
// //   notificationItem: {
// //     flexDirection: 'row',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   notificationIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   notificationContent: {
// //     flex: 1,
// //   },
// //   notificationTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   notificationMessage: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginBottom: 4,
// //   },
// //   notificationDate: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //   },
// //   emptyNotifications: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 40,
// //   },
// //   emptyText: {
// //     marginTop: 12,
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //   },
// //   loadingIndicator: {
// //     marginVertical: 20,
// //   },
// //   closeBtn: {
// //     marginTop: 16,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   closeBtnText: {
// //     color: COLORS.surface,
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },
// // });

// // export default Profile;







// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   Easing,
//   Platform,
//   TextInput,
//   Alert,
//   Linking,
// } from "react-native";
// import LinearGradient from 'react-native-linear-gradient';
// import axios from "axios";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from '@react-navigation/native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// const { width } = Dimensions.get('window');

// // Enhanced color scheme with gradients
// const COLORS = {
//   primary: "#4facfe",
//   primaryGradient: ['#359df9', '#64d8f8'],
//   secondary: "#FDB800",
//   secondaryGradient: ['#FDB800', '#FF8C00'],
//   background: "#f5f8ff",
//   surface: "#FFFFFF",
//   textDark: "#333333",
//   textLight: "#777777",
//   border: "#EEEEEE",
  
//   // Status colors
//   live: "#4CAF50",
//   liveGradient: ['#4CAF50', '#45a049'],
//   scheduled: "#ff9800",
//   scheduledGradient: ['#ff9800', '#f57c00'],
//   completed: "#ff9800",
//   completedGradient: ['#ff9800', '#f57c00'],
  
//   // Additional gradients
//   prizeGradient: ['#4facfe20', '#00c6fb20'],
//   winnerGradient: ['#4facfe10', '#9fcdff10'],
//   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  
//   // Individual colors
//   purple: "#9B59B6",
//   purpleGradient: ['#9B59B6', '#8E44AD'],
//   orange: "#FF9800",
//   orangeGradient: ['#FF9800', '#F57C00'],
//   teal: "#4ECDC4",
//   tealGradient: ['#4ECDC4', '#2AA7A0'],
//   red: "#EF4444",
//   redGradient: ['#EF4444', '#DC2626'],
//   green: "#10B981",
//   greenGradient: ['#10B981', '#059669'],
// };

// const BASE_URL = "https://tambolatime.co.in/public/";

// // Custom Loader Component with Animation
// const CustomLoader = () => {
//   const [currentPhrase, setCurrentPhrase] = useState(0);
//   const spinValue = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const bounceAnim = useRef(new Animated.Value(0)).current;
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const floatAnim3 = useRef(new Animated.Value(0)).current;
  
//   const phrases = [
//     "Loading Magic...",
//     "Almost There...",
//     "Getting Ready...",
//     "Just a Moment..."
//   ];

//   useEffect(() => {
//     // Rotating animation for the center element
//     Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 8000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // Pulsing animation for the outer ring
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.2,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Bouncing animation for the main container
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Floating animations for decorative elements
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim1, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim1, {
//           toValue: 0,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim2, {
//           toValue: 1,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim2, {
//           toValue: 0,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim3, {
//           toValue: 1,
//           duration: 3500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim3, {
//           toValue: 0,
//           duration: 3500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Change phrase every 3 seconds
//     const phraseInterval = setInterval(() => {
//       setCurrentPhrase((prev) => (prev + 1) % phrases.length);
//     }, 3000);

//     return () => clearInterval(phraseInterval);
//   }, []);

//   const spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   const bounce = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -15]
//   });

//   const float1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 20]
//   });

//   const float2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -20]
//   });

//   const float3 = floatAnim3.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15]
//   });

//   return (
//     <LinearGradient
//       colors={['#4facfe', '#00f2fe']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.loaderContainer}
//     >
//       {/* Decorative floating elements */}
//       <Animated.View 
//         style={[
//           styles.loaderCircle1,
//           {
//             transform: [
//               { translateY: float1 },
//               { translateX: float2 }
//             ]
//           }
//         ]} 
//       />
//       <Animated.View 
//         style={[
//           styles.loaderCircle2,
//           {
//             transform: [
//               { translateY: float2 },
//               { translateX: float3 }
//             ]
//           }
//         ]} 
//       />
//       <Animated.View 
//         style={[
//           styles.loaderCircle3,
//           {
//             transform: [
//               { translateY: float3 },
//               { translateX: float1 }
//             ]
//           }
//         ]} 
//       />

//       <Animated.View 
//         style={[
//           styles.loaderContent,
//           {
//             transform: [{ translateY: bounce }]
//           }
//         ]}
//       >
//         {/* Animated Rings */}
//         <View style={styles.loaderRingsContainer}>
//           <Animated.View 
//             style={[
//               styles.loaderRing,
//               {
//                 transform: [{ scale: pulseAnim }]
//               }
//             ]} 
//           />
//           <Animated.View 
//             style={[
//               styles.loaderRing2,
//               {
//                 transform: [{ rotate: spin }]
//               }
//             ]} 
//           />
          
//           {/* Center Logo */}
//           <LinearGradient
//             colors={['#FDB800', '#FF8C00']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.loaderCenter}
//           >
//             <Text style={styles.loaderCenterText}>HZ</Text>
//           </LinearGradient>
//         </View>

//         {/* Animated Text */}
//         <View style={styles.loaderTextContainer}>
//           <Text style={styles.loaderTitle}>Houzie Timez</Text>
//           <View style={styles.loaderPhraseContainer}>
//             <Text style={styles.loaderPhrase}>{phrases[currentPhrase]}</Text>
//             <View style={styles.loaderDots}>
//               <Animated.View style={[styles.loaderDot, { opacity: floatAnim1 }]} />
//               <Animated.View style={[styles.loaderDot, { opacity: floatAnim2 }]} />
//               <Animated.View style={[styles.loaderDot, { opacity: floatAnim3 }]} />
//             </View>
//           </View>
//         </View>

//         {/* Progress Bar */}
//         <View style={styles.loaderProgressContainer}>
//           <LinearGradient
//             colors={['#FDB800', '#FF8C00']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.loaderProgressBar}
//           >
//             <Animated.View 
//               style={[
//                 styles.loaderProgressGlow,
//                 {
//                   transform: [
//                     { translateX: spinValue.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [-100, 200]
//                     }) }
//                   ]
//                 }
//               ]} 
//             />
//           </LinearGradient>
//         </View>

//         {/* Decorative SVG-like elements */}
//         <View style={styles.loaderDecorations}>
//           <Animated.View style={[styles.loaderStar, { transform: [{ scale: pulseAnim }] }]}>
//             <Text style={styles.loaderStarText}>✦</Text>
//           </Animated.View>
//           <Animated.View style={[styles.loaderStar2, { transform: [{ rotate: spin }] }]}>
//             <Text style={styles.loaderStarText}>✧</Text>
//           </Animated.View>
//           <Animated.View style={[styles.loaderStar3, { transform: [{ scale: floatAnim2 }] }]}>
//             <Text style={styles.loaderStarText}>✪</Text>
//           </Animated.View>
//         </View>
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const Profile = ({ onLogout }) => {
//   const navigation = useNavigation();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//   });
//   const [imageUri, setImageUri] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [loadingNotifications, setLoadingNotifications] = useState(true);
  
//   // Animation values
//   const letterAnims = useRef([]);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
  
//   // Button animation refs
//   const editButtonScale = useRef(new Animated.Value(1)).current;
//   const cancelButtonScale = useRef(new Animated.Value(1)).current;
//   const logoutButtonScale = useRef(new Animated.Value(1)).current;
//   const settingButtonScales = useRef([1, 2, 3, 4].map(() => new Animated.Value(1)));

//   // Helper function to get full image URL
//   const getFullImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//     return BASE_URL + cleanPath;
//   };

//   useEffect(() => {
//     // Initialize letter animations for header (12 letters for "HOUIE TIMEZ" - 11 letters + 1 space)
//     const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
//     letterAnims.current = newLetterAnims;
    
//     // Stop any existing animations and reset to 1
//     letterAnims.current.forEach(anim => {
//       anim.stopAnimation();
//       anim.setValue(1);
//     });
    
//     let currentIndex = 0;
//     let isAnimating = true;
    
//     const animateNextLetter = () => {
//       if (!isAnimating) return;
      
//       // Skip the space character (index 6) - it shouldn't animate
//       // If currentIndex is the space, move to next letter
//       if (currentIndex === 6) {
//         currentIndex = 7;
//       }
      
//       // Reset all letters to normal size
//       letterAnims.current.forEach(anim => {
//         anim.setValue(1);
//       });
      
//       // Animate current letter
//       Animated.sequence([
//         Animated.timing(letterAnims.current[currentIndex], {
//           toValue: 1.5,
//           duration: 200,
//           useNativeDriver: true,
//           easing: Easing.bounce,
//         }),
//         Animated.timing(letterAnims.current[currentIndex], {
//           toValue: 1,
//           duration: 150,
//           useNativeDriver: true,
//           easing: Easing.bounce,
//         }),
//         Animated.delay(200), // Pause before next letter
//       ]).start(({ finished }) => {
//         if (finished && isAnimating) {
//           // Move to next letter
//           currentIndex = (currentIndex + 1) % letterAnims.current.length;
          
//           // If next index is space, skip it
//           if (currentIndex === 6) {
//             currentIndex = 7;
//           }
          
//           animateNextLetter();
//         }
//       });
//     };
    
//     // Start the animation
//     animateNextLetter();

//     // Start button animations
//     startPulseAnimation(editButtonScale, 800);
//     startPulseAnimation(logoutButtonScale, 1000);
    
//     settingButtonScales.current.forEach((anim, index) => {
//       startPulseAnimation(anim, 800 + (index * 100));
//     });

//     fetchProfile();
//     fetchNotifications();
//     startAnimations();
    
//     // Entrance animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     return () => {
//       isAnimating = false;
//       if (letterAnims.current) {
//         letterAnims.current.forEach(anim => {
//           anim.stopAnimation();
//         });
//       }
//     };
//   }, []);

//   const startPulseAnimation = (anim, duration = 800) => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(anim, {
//           toValue: 1.08,
//           duration: duration,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease)
//         }),
//         Animated.timing(anim, {
//           toValue: 1,
//           duration: duration,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease)
//         })
//       ])
//     ).start();
//   };

//   const startAnimations = () => {
//     // Floating animations
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim1, {
//           toValue: 1,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim1, {
//           toValue: 0,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim2, {
//           toValue: 1,
//           duration: 5000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim2, {
//           toValue: 0,
//           duration: 5000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         `${BASE_URL}api/user/profile`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data.user) {
//         setUser(res.data.user);
//         setFormData({
//           name: res.data.user.name || "",
//         });
        
//         if (res.data.user.profile_image_url) {
//           setImageUri(res.data.user.profile_image_url);
//         } else if (res.data.user.profile_image) {
//           setImageUri(getFullImageUrl(res.data.user.profile_image));
//         }
//       }
//     } catch (error) {
//       console.log("Fetch profile error:", error);
//       Alert.alert("Error", "Failed to fetch profile information");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(
//         `${BASE_URL}api/user/notifications`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.status) {
//         setNotifications(res.data.data || []);
//       }
//     } catch (error) {
//       console.log("Error fetching notifications:", error);
//     } finally {
//       setLoadingNotifications(false);
//     }
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     Promise.all([fetchProfile(), fetchNotifications()]).finally(() => setRefreshing(false));
//   }, []);

//   const handleImagePick = async (source) => {
//     setImageModalVisible(false);
    
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 500,
//       maxHeight: 500,
//       quality: 0.8,
//       includeBase64: false,
//       saveToPhotos: false,
//       selectionLimit: 1,
//     };
    
//     try {
//       let result;
      
//       if (source === "camera") {
//         result = await launchCamera(options);
//       } else {
//         result = await launchImageLibrary(options);
//       }

//       if (result.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (result.errorCode) {
//         console.log('ImagePicker Error: ', result.errorMessage);
//         Alert.alert("Error", result.errorMessage || "Failed to pick image");
//       } else if (result.assets && result.assets.length > 0) {
//         const selectedImage = result.assets[0];
//         setImageUri(selectedImage.uri);
//       }
//     } catch (error) {
//       console.log("Image picker error:", error);
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };

//   const updateProfile = async () => {
//     if (!formData.name.trim()) {
//       Alert.alert("Error", "Name is required");
//       return;
//     }

//     setSaving(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const formDataToSend = new FormData();

//       formDataToSend.append("name", formData.name);

//       if (imageUri && 
//           !imageUri.startsWith(BASE_URL) && 
//           !imageUri.startsWith('http') &&
//           (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
//         const localUri = imageUri;
//         const filename = localUri.split('/').pop();
        
//         let type = 'image/jpeg';
//         if (filename) {
//           const match = /\.(\w+)$/.exec(filename);
//           if (match) {
//             type = `image/${match[1]}`;
//           }
//         }

//         formDataToSend.append('profile_image', {
//           uri: localUri,
//           name: filename || `profile_${Date.now()}.jpg`,
//           type,
//         });
//       }

//       const response = await axios.post(
//         `${BASE_URL}api/user/profile`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.user) {
//         setUser(response.data.user);
//         Alert.alert("Success", "Profile updated successfully!");
//         setEditMode(false);
        
//         if (response.data.user.profile_image_url) {
//           setImageUri(response.data.user.profile_image_url);
//         } else if (response.data.user.profile_image) {
//           setImageUri(getFullImageUrl(response.data.user.profile_image));
//         }
//       }
//     } catch (error) {
//       console.log("Update error:", error);
//       Alert.alert("Error", "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const logoutUser = async () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Logout", 
//           style: "destructive", 
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem("token");
//               await axios.post(
//                 `${BASE_URL}api/user/logout`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//               await AsyncStorage.removeItem("token");
//               await AsyncStorage.removeItem("user");
//               onLogout();
//             } catch (error) {
//               console.log(error);
//               Alert.alert("Error", "Something went wrong. Please try again.");
//             }
//           }
//         }
//       ]
//     );
//   };

//   // Cartoon-style header with popping letters
//   const Header = () => {
//     const letters = [
//       { char: 'H', index: 0 },
//       { char: 'O', index: 1, isSpecial: true },
//       { char: 'U', index: 2 },
//       { char: 'Z', index: 3 },
//       { char: 'I', index: 4 },
//       { char: 'E', index: 5 },
//       { char: ' ', index: 6, isSpace: true, width: 20 },
//       { char: 'T', index: 7 },
//       { char: 'I', index: 8 },
//       { char: 'M', index: 9 },
//       { char: 'E', index: 10 },
//       { char: 'Z', index: 11, isSpecial: true },
//     ];

//     return (
//       <LinearGradient
//         colors={COLORS.primaryGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}
//       >
//         <View style={styles.logoContainer}>
//           <View style={styles.cartoonTitleRow}>
//             {letters.map((item) => {
//               const animValue = letterAnims.current && letterAnims.current[item.index] 
//                 ? letterAnims.current[item.index] 
//                 : new Animated.Value(1);
              
//               return (
//                 <Animated.Text
//                   key={`letter-${item.index}`}
//                   style={[
//                     styles.cartoonLetter,
//                     item.isSpecial && styles.specialCartoonLetter,
//                     item.isSpace && { width: item.width || 20 },
//                     { 
//                       transform: [{ scale: animValue }],
//                     }
//                   ]}
//                 >
//                   {item.char}
//                 </Animated.Text>
//               );
//             })}
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={styles.notification}
//           onPress={() => setModalVisible(true)}
//         >
//           <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
//           {notifications.length > 0 && (
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{notifications.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </LinearGradient>
//     );
//   };

//   const StatCard = ({ number, label, icon, color }) => {
//     const floatValue = floatAnim1.interpolate({
//       inputRange: [0, 1],
//       outputRange: [0, -10]
//     });

//     return (
//       <Animated.View 
//         style={[
//           styles.statCard,
//           {
//             transform: [{ translateY: floatValue }]
//           }
//         ]}
//       >
//         <LinearGradient
//           colors={[color + '20', color + '10']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.statIconContainer}
//         >
//           <Ionicons name={icon} size={24} color={color} />
//         </LinearGradient>
//         <Text style={styles.statNumber}>{number}</Text>
//         <Text style={styles.statLabel}>{label}</Text>
//       </Animated.View>
//     );
//   };

//   const InfoCard = ({ icon, label, value, color }) => {
//     return (
//       <LinearGradient
//         colors={[COLORS.surface, COLORS.surface]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.infoCard}
//       >
//         <LinearGradient
//           colors={[color + '20', color + '10']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.infoIcon}
//         >
//           <Ionicons name={icon} size={20} color={color} />
//         </LinearGradient>
//         <View style={styles.infoContent}>
//           <Text style={styles.infoLabel}>{label}</Text>
//           <Text style={styles.infoValue}>{value || "N/A"}</Text>
//         </View>
//       </LinearGradient>
//     );
//   };

//   const SettingItem = ({ icon, title, description, color, onPress, index }) => {
//     const scaleAnim = settingButtonScales.current[index] || new Animated.Value(1);

//     return (
//       <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//         <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.8}>
//           <LinearGradient
//             colors={[color + '20', color + '10']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.settingIcon}
//           >
//             <Ionicons name={icon} size={22} color={color} />
//           </LinearGradient>
//           <View style={styles.settingContent}>
//             <Text style={styles.settingTitle}>{title}</Text>
//             <Text style={styles.settingDescription}>{description}</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <CustomLoader />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

//       <View style={styles.container}>
//         {/* Header with cartoon-style popping letters */}
//         <Header />

//         {/* Animated Background Elements */}
//         <Animated.View 
//           style={[
//             styles.backgroundCircle1,
//             {
//               transform: [
//                 { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) }
//               ]
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.backgroundCircle2,
//             {
//               transform: [
//                 { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
//               ]
//             }
//           ]} 
//         />

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={COLORS.primary}
//               colors={[COLORS.primary]}
//             />
//           }
//         >
//           {/* Profile Hero Section */}
//           <Animated.View 
//             style={[
//               styles.profileHeroSection,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ scale: scaleAnim }]
//               }
//             ]}
//           >
//             <LinearGradient
//               colors={COLORS.winnerGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.profileHeroPattern}
//             />
//             <View style={styles.profileHeroContent}>
//               <TouchableOpacity
//                 onPress={() => editMode && setImageModalVisible(true)}
//                 disabled={!editMode}
//                 style={styles.profileImageContainer}
//               >
//                 <Image
//                   source={{
//                     uri: imageUri
//                       ? imageUri
//                       : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
//                   }}
//                   style={styles.profileImage}
//                 />
//                 {editMode && (
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.editImageBadge}
//                   >
//                     <Ionicons name="camera" size={16} color={COLORS.surface} />
//                   </LinearGradient>
//                 )}
//               </TouchableOpacity>

//               {editMode ? (
//                 <View style={styles.nameInputContainer}>
//                   <TextInput
//                     style={styles.nameInput}
//                     value={formData.name}
//                     onChangeText={(text) => setFormData({ ...formData, name: text })}
//                     placeholder="Enter your name"
//                     placeholderTextColor={COLORS.textLight}
//                   />
//                 </View>
//               ) : (
//                 <>
//                   <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
//                   <LinearGradient
//                     colors={COLORS.prizeGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.profileBadge}
//                   >
//                     <Ionicons name="star" size={14} color={COLORS.secondary} />
//                     <Text style={styles.profileBadgeText}>Premium Member</Text>
//                   </LinearGradient>
//                 </>
//               )}

//               <View style={styles.profileActions}>
//                 {/* Edit/Save Button with Pop Animation */}
//                 <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (editMode) {
//                         updateProfile();
//                       } else {
//                         setEditMode(true);
//                       }
//                     }}
//                     disabled={saving}
//                     activeOpacity={0.8}
//                   >
//                     <LinearGradient
//                       colors={editMode ? COLORS.greenGradient : COLORS.primaryGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 0 }}
//                       style={styles.profileActionButton}
//                     >
//                       <LinearGradient
//                         colors={COLORS.glassGradient}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={styles.glassEffectOverlay}
//                       />
//                       <Ionicons 
//                         name={editMode ? "checkmark" : "pencil"} 
//                         size={16} 
//                         color={COLORS.surface} 
//                       />
//                       <Text style={styles.profileActionText}>
//                         {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
//                       </Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 </Animated.View>

//                 {/* Cancel Button with Pop Animation (only in edit mode) */}
//                 {editMode && (
//                   <Animated.View style={{ transform: [{ scale: cancelButtonScale }] }}>
//                     <TouchableOpacity
//                       style={styles.profileCancelButton}
//                       onPress={() => {
//                         setEditMode(false);
//                         setFormData({ name: user?.name || "" });
//                         if (user?.profile_image_url) {
//                           setImageUri(user.profile_image_url);
//                         } else if (user?.profile_image) {
//                           setImageUri(getFullImageUrl(user.profile_image));
//                         } else {
//                           setImageUri(null);
//                         }
//                       }}
//                     >
//                       <Ionicons name="close" size={16} color={COLORS.textLight} />
//                       <Text style={styles.profileCancelText}>Cancel</Text>
//                     </TouchableOpacity>
//                   </Animated.View>
//                 )}
//               </View>
//             </View>
//           </Animated.View>

//           {/* Stats Section */}
//           <View style={styles.statsSection}>
//             <StatCard number={user?.referral_points || "0"} label="Referral Points" icon="star" color={COLORS.primary} />
//             <StatCard number="24/7" label="Support" icon="headset" color={COLORS.purple} />
//             <StatCard number="10+" label="Games Played" icon="game-controller" color={COLORS.teal} />
//           </View>

//           {/* Account Information */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionTitleContainer}>
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.sectionIcon}
//                 >
//                   <Ionicons name="person-circle" size={16} color={COLORS.surface} />
//                 </LinearGradient>
//                 <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
//               </View>
//             </View>

//             <View style={styles.infoGrid}>
//               <InfoCard 
//                 icon="mail" 
//                 label="Email Address" 
//                 value={user?.email} 
//                 color={COLORS.primary}
//               />
//               <InfoCard 
//                 icon="call" 
//                 label="Mobile Number" 
//                 value={user?.mobile} 
//                 color={COLORS.purple}
//               />
//               <InfoCard 
//                 icon="gift" 
//                 label="Referral Code" 
//                 value={user?.referral_code} 
//                 color={COLORS.teal}
//               />
//               <InfoCard 
//                 icon="people" 
//                 label="Under Referral" 
//                 value={user?.under_referral || "None"} 
//                 color={COLORS.orange}
//               />
//             </View>
//           </View>

//           {/* Account Status */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionTitleContainer}>
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.sectionIcon}
//                 >
//                   <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
//                 </LinearGradient>
//                 <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
//               </View>
//             </View>

//             <LinearGradient
//               colors={[COLORS.surface, COLORS.surface]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.statusCard}
//             >
//               <LinearGradient
//                 colors={COLORS.prizeGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.statusPattern}
//               />
//               <View style={styles.statusRow}>
//                 <LinearGradient
//                   colors={COLORS.greenGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={[styles.statusIndicator, { width: 8, height: 8, borderRadius: 4 }]}
//                 />
//                 <View>
//                   <Text style={styles.statusLabel}>Account Status</Text>
//                   <Text style={styles.statusValue}>Active</Text>
//                 </View>
//                 <LinearGradient
//                   colors={COLORS.greenGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.statusBadge}
//                 >
//                   <Text style={styles.statusBadgeText}>Verified</Text>
//                 </LinearGradient>
//               </View>

//               <View style={styles.statusDivider} />

//               <View style={styles.statusRow}>
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={[styles.statusIndicator, { width: 8, height: 8, borderRadius: 4 }]}
//                 />
//                 <View>
//                   <Text style={styles.statusLabel}>Member Since</Text>
//                   <Text style={styles.statusValue}>
//                     {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
//                   </Text>
//                 </View>
//               </View>
//             </LinearGradient>
//           </View>

//           {/* Quick Settings */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionTitleContainer}>
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.sectionIcon}
//                 >
//                   <Ionicons name="settings" size={16} color={COLORS.surface} />
//                 </LinearGradient>
//                 <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
//               </View>
//             </View>

//             <LinearGradient
//               colors={[COLORS.surface, COLORS.surface]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.settingsCard}
//             >
//               <SettingItem 
//                 icon="ticket"
//                 title="My Tickets"
//                 description="View your purchased tickets"
//                 color={COLORS.primary}
//                 index={0}
//                 onPress={() => Alert.alert("Coming Soon", "My Tickets feature coming soon!")}
//               />
//               <SettingItem 
//                 icon="wallet"
//                 title="Wallet"
//                 description="Manage your balance"
//                 color={COLORS.purple}
//                 index={1}
//                 onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
//               />
//               <SettingItem 
//                 icon="lock-closed"
//                 title="Privacy & Security"
//                 description="Manage your security settings"
//                 color={COLORS.teal}
//                 index={2}
//                 onPress={() => Alert.alert("Coming Soon", "Privacy settings coming soon!")}
//               />
//               <SettingItem 
//                 icon="help-circle"
//                 title="Help & Support"
//                 description="Get help with your account"
//                 color={COLORS.orange}
//                 index={3}
//                 onPress={() => Linking.openURL('mailto:support@tambolatimez.com')}
//               />
//             </LinearGradient>
//           </View>

//           {/* Logout Button with Pop Animation */}
//           <Animated.View style={{ transform: [{ scale: logoutButtonScale }] }}>
//             <TouchableOpacity onPress={logoutUser} activeOpacity={0.8}>
//               <LinearGradient
//                 colors={[COLORS.surface, COLORS.surface]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.logoutButton}
//               >
//                 <LinearGradient
//                   colors={[COLORS.red + '20', COLORS.red + '10']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.logoutIcon}
//                 >
//                   <Ionicons name="log-out" size={22} color={COLORS.red} />
//                 </LinearGradient>
//                 <Text style={styles.logoutText}>Logout</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               Version 1.0.0
//             </Text>
//             <Text style={styles.footerSubtext}>
//               © {new Date().getFullYear()} Houzie Timez
//             </Text>
//           </View>

//           <View style={styles.bottomSpace} />
//         </ScrollView>

//         {/* Image Selection Modal */}
//         <Modal visible={imageModalVisible} transparent={true} animationType="fade">
//           <View style={styles.modalOverlay}>
//             <LinearGradient
//               colors={[COLORS.surface, COLORS.surface]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.modalContent}
//             >
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Update Profile Picture</Text>
//                 <TouchableOpacity onPress={() => setImageModalVisible(false)}>
//                   <Ionicons name="close" size={24} color={COLORS.textDark} />
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleImagePick("camera")}
//               >
//                 <LinearGradient
//                   colors={[COLORS.primary + '20', COLORS.primary + '10']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.modalOptionIcon}
//                 >
//                   <Ionicons name="camera" size={24} color={COLORS.primary} />
//                 </LinearGradient>
//                 <View>
//                   <Text style={styles.modalOptionTitle}>Take Photo</Text>
//                   <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={() => handleImagePick("gallery")}
//               >
//                 <LinearGradient
//                   colors={[COLORS.purple + '20', COLORS.purple + '10']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.modalOptionIcon}
//                 >
//                   <Ionicons name="images" size={24} color={COLORS.purple} />
//                 </LinearGradient>
//                 <View>
//                   <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
//                   <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setImageModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </Modal>

//         {/* Notifications Modal */}
//         <Modal visible={modalVisible} transparent={true} animationType="slide">
//           <View style={styles.modalOverlay}>
//             <LinearGradient
//               colors={COLORS.winnerGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.modalContent}
//             >
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Notifications</Text>
//                 <TouchableOpacity onPress={() => setModalVisible(false)}>
//                   <Ionicons name="close" size={24} color={COLORS.textDark} />
//                 </TouchableOpacity>
//               </View>

//               {loadingNotifications ? (
//                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
//               ) : (
//                 <FlatList
//                   data={notifications}
//                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//                   renderItem={({ item }) => (
//                     <View style={styles.notificationItem}>
//                       <LinearGradient
//                         colors={COLORS.primaryGradient}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={styles.notificationIcon}
//                       >
//                         <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
//                       </LinearGradient>
//                       <View style={styles.notificationContent}>
//                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
//                         <Text style={styles.notificationMessage}>
//                           {item.message || "Check out the latest updates!"}
//                         </Text>
//                         <Text style={styles.notificationDate}>
//                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
//                         </Text>
//                       </View>
//                     </View>
//                   )}
//                   ListEmptyComponent={
//                     <View style={styles.emptyNotifications}>
//                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
//                       <Text style={styles.emptyText}>No notifications yet</Text>
//                     </View>
//                   }
//                 />
//               )}

//               <TouchableOpacity
//                 onPress={() => setModalVisible(false)}
//               >
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.closeBtn}
//                 >
//                   <Text style={styles.closeBtnText}>Close</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
  
//   // Loader Styles
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderContent: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: width * 0.8,
//   },
//   loaderRingsContainer: {
//     width: 120,
//     height: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   loaderRing: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   loaderRing2: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#FDB800',
//     borderTopColor: 'transparent',
//     borderRightColor: 'transparent',
//   },
//   loaderCenter: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//   },
//   loaderCenterText: {
//     fontSize: 24,
//     fontWeight: '900',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   loaderTextContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   loaderTitle: {
//     fontSize: 32,
//     fontWeight: '900',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//     marginBottom: 10,
//   },
//   loaderPhraseContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   loaderPhrase: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     opacity: 0.9,
//     marginRight: 5,
//   },
//   loaderDots: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   loaderDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 2,
//   },
//   loaderProgressContainer: {
//     width: '100%',
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 2,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   loaderProgressBar: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   loaderProgressGlow: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 50,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     transform: [{ skewX: '-20deg' }],
//   },
//   loaderDecorations: {
//     position: 'relative',
//     width: '100%',
//     height: 50,
//   },
//   loaderStar: {
//     position: 'absolute',
//     left: 20,
//     top: 0,
//   },
//   loaderStar2: {
//     position: 'absolute',
//     right: 20,
//     top: 0,
//   },
//   loaderStar3: {
//     position: 'absolute',
//     left: '50%',
//     top: 0,
//   },
//   loaderStarText: {
//     fontSize: 24,
//     color: '#FDB800',
//   },
//   loaderCircle1: {
//     position: 'absolute',
//     top: '20%',
//     left: '10%',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   loaderCircle2: {
//     position: 'absolute',
//     bottom: '20%',
//     right: '10%',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   loaderCircle3: {
//     position: 'absolute',
//     top: '30%',
//     right: '20%',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },

//   // Rest of your existing styles remain the same
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     zIndex: 10,
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   cartoonTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   cartoonLetter: {
//     fontSize: 34,
//     fontWeight: '900',
//     color: '#FDB800',
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(255, 193, 7, 0.5)',
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 8,
//     includeFontPadding: false,
//     marginHorizontal: 2,
//     ...Platform.select({
//       android: {
//         elevation: 5,
//         textShadowColor: '#FFB300',
//         textShadowOffset: { width: 2, height: 2 },
//         textShadowRadius: 6,
//       },
//     }),
//   },
//   specialCartoonLetter: {
//     fontSize: 40,
//     color: '#FFD700',
//     textShadowColor: '#FF8C00',
//     textShadowOffset: { width: 4, height: 4 },
//     textShadowRadius: 10,
//     marginHorizontal: 2,
//   },
//   notification: {
//     position: "relative",
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     padding: 10,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//     marginLeft: 8,
//   },
//   badge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     backgroundColor: "red",
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//   },
//   badgeText: {
//     color: COLORS.surface,
//     fontSize: 11,
//     fontWeight: "700",
//   },
  
//   // Background Elements
//   backgroundCircle1: {
//     position: 'absolute',
//     top: 100,
//     right: -50,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: COLORS.primary + '10',
//     zIndex: 0,
//   },
//   backgroundCircle2: {
//     position: 'absolute',
//     bottom: 200,
//     left: -60,
//     width: 250,
//     height: 250,
//     borderRadius: 125,
//     backgroundColor: COLORS.purple + '08',
//     zIndex: 0,
//   },

//   // Glass Effect
//   glassEffectOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.3)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
//     borderRadius: 10,
//   },

//   // Profile Hero Section
//   profileHeroSection: {
//     marginTop: 16,
//     marginHorizontal: 16,
//     marginBottom: 24,
//     backgroundColor: COLORS.surface,
//     borderRadius: 24,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     position: 'relative',
//     overflow: 'hidden',
//     zIndex: 2,
//   },
//   profileHeroPattern: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 150,
//     height: 150,
//     borderBottomLeftRadius: 75,
//   },
//   profileHeroContent: {
//     alignItems: 'center',
//   },
//   profileImageContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: COLORS.surface,
//     backgroundColor: COLORS.background,
//   },
//   editImageBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//   },
//   profileName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     marginBottom: 6,
//   },
//   profileBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//     gap: 4,
//     marginBottom: 16,
//   },
//   profileBadgeText: {
//     fontSize: 12,
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   nameInputContainer: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   nameInput: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     textAlign: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     width: '100%',
//   },
//   profileActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   profileActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//     gap: 6,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   profileActionText: {
//     color: COLORS.surface,
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   profileCancelButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 4,
//     backgroundColor: COLORS.background,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   profileCancelText: {
//     color: COLORS.textLight,
//     fontSize: 12,
//     fontWeight: '500',
//   },

//   // Stats Section
//   statsSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginBottom: 24,
//     gap: 8,
//     zIndex: 2,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     padding: 12,
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statNumber: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     textAlign: 'center',
//   },

//   // Section
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 24,
//     zIndex: 2,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   sectionIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.textDark,
//   },

//   // Info Grid
//   infoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   infoCard: {
//     width: (width - 40) / 2,
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     padding: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   infoIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   infoContent: {
//     gap: 2,
//   },
//   infoLabel: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },

//   // Status Card
//   statusCard: {
//     borderRadius: 20,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   statusPattern: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 100,
//     height: 100,
//     borderBottomLeftRadius: 50,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   statusIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   statusLabel: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     marginBottom: 2,
//   },
//   statusValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },
//   statusBadge: {
//     marginLeft: 'auto',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   statusBadgeText: {
//     fontSize: 11,
//     color: COLORS.surface,
//     fontWeight: '600',
//   },
//   statusDivider: {
//     height: 1,
//     backgroundColor: COLORS.border,
//     marginVertical: 12,
//   },

//   // Settings Card
//   settingsCard: {
//     borderRadius: 20,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   settingIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   settingContent: {
//     flex: 1,
//   },
//   settingTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   settingDescription: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },

//   // Logout Button
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 10,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: COLORS.red,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   logoutIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: COLORS.red,
//     fontWeight: '600',
//     fontSize: 15,
//   },

//   // Footer
//   footer: {
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     textAlign: 'center',
//     marginBottom: 2,
//   },
//   footerSubtext: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     textAlign: 'center',
//   },
//   bottomSpace: {
//     height: 20,
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     maxHeight: '80%',
//     borderRadius: 16,
//     padding: 16,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.textDark,
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.background,
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     gap: 12,
//   },
//   modalOptionIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOptionTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   modalOptionDescription: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   modalCancelButton: {
//     backgroundColor: 'transparent',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginTop: 8,
//   },
//   modalCancelText: {
//     color: COLORS.textLight,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   notificationItem: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   notificationIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   notificationMessage: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     marginBottom: 4,
//   },
//   notificationDate: {
//     fontSize: 10,
//     color: COLORS.textLight,
//   },
//   emptyNotifications: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     marginTop: 12,
//     color: COLORS.textLight,
//     fontSize: 14,
//   },
//   loadingIndicator: {
//     marginVertical: 20,
//   },
//   closeBtn: {
//     marginTop: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeBtnText: {
//     color: COLORS.surface,
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

// export default Profile;







import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Platform,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

// Enhanced color scheme with gradients
const COLORS = {
  primary: "#4facfe",
  primaryGradient: ['#359df9', '#64d8f8'],
  secondary: "#FDB800",
  secondaryGradient: ['#FDB800', '#FF8C00'],
  background: "#f5f8ff",
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  
  // Status colors
  live: "#4CAF50",
  liveGradient: ['#4CAF50', '#45a049'],
  scheduled: "#ff9800",
  scheduledGradient: ['#ff9800', '#f57c00'],
  completed: "#ff9800",
  completedGradient: ['#ff9800', '#f57c00'],
  
  // Additional gradients
  prizeGradient: ['#4facfe20', '#00c6fb20'],
  winnerGradient: ['#4facfe10', '#9fcdff10'],
  glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  
  // Individual colors
  purple: "#9B59B6",
  purpleGradient: ['#9B59B6', '#8E44AD'],
  orange: "#FF9800",
  orangeGradient: ['#FF9800', '#F57C00'],
  teal: "#4ECDC4",
  tealGradient: ['#4ECDC4', '#2AA7A0'],
  red: "#EF4444",
  redGradient: ['#EF4444', '#DC2626'],
  green: "#10B981",
  greenGradient: ['#10B981', '#059669'],
};

const BASE_URL = "https://tambolatime.co.in/public/";

// Custom Loader Component with Fixed Animations
const CustomLoader = () => {
  // Animations
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Dynamic messages
  const messages = [
    "Loading your profile...",
    "Fetching account details 📱",
    "Getting your stats 📊",
    "Almost ready...",
    "Welcome back! 🎉",
    "Setting up your dashboard..."
  ];

  const [currentText, setCurrentText] = useState(0);
  const [animationLoop, setAnimationLoop] = useState(true);

  useEffect(() => {
    // Create animation loops with proper cleanup
    const animations = [];
    
    // Title bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animations.push(bounceAnimation);
    bounceAnimation.start();

    // Dots animation
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dot1Animation = animateDot(dot1, 0);
    const dot2Animation = animateDot(dot2, 150);
    const dot3Animation = animateDot(dot3, 300);
    
    animations.push(dot1Animation, dot2Animation, dot3Animation);
    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    // Floating numbers animation
    const floatAnimation = Animated.loop(
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );
    animations.push(floatAnimation);
    floatAnimation.start();

    // Ticket slide animation
    const slideAnimation = Animated.loop(
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animations.push(slideAnimation);
    slideAnimation.start();

    // Dynamic text change interval
    const textInterval = setInterval(() => {
      if (animationLoop) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentText((prev) => (prev + 1) % messages.length);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }
    }, 2500);

    // Cleanup function to stop all animations when component unmounts
    return () => {
      setAnimationLoop(false);
      clearInterval(textInterval);
      // Stop all animations
      animations.forEach(animation => {
        if (animation && typeof animation.stop === 'function') {
          animation.stop();
        }
      });
      // Reset all animated values
      bounceAnim.stopAnimation();
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
      floatAnim.stopAnimation();
      slideAnim.stopAnimation();
      fadeAnim.stopAnimation();
    };
  }, []); // Empty dependency array ensures animations run once and continue

  const floatUp = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  // Reset slide animation when it reaches the end
  useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      if (value >= width) {
        slideAnim.setValue(-width);
      }
    });
    
    return () => {
      slideAnim.removeListener(listener);
    };
  }, [slideAnim, width]);

  return (
    <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
      {/* Floating Numbers */}
      <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>
        17
      </Animated.Text>

      <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>
        42
      </Animated.Text>

      {/* App Name */}
      <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>
        Houzie Timez
      </Animated.Text>

      {/* Loader Dots */}
      <View style={styles.loaderContainerDots}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>

      {/* Dynamic Subtitle */}
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        {messages[currentText]}
      </Animated.Text>

      {/* Sliding Ticket */}
      <Animated.View
        style={[
          styles.ticketStrip,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.ticketText}>🎟️ Profile Loading...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const Profile = ({ onLogout }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  // Animation values
  const letterAnims = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  
  // Button animation refs
  const editButtonScale = useRef(new Animated.Value(1)).current;
  const cancelButtonScale = useRef(new Animated.Value(1)).current;
  const logoutButtonScale = useRef(new Animated.Value(1)).current;
  const settingButtonScales = useRef([1, 2, 3, 4].map(() => new Animated.Value(1)));

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return BASE_URL + cleanPath;
  };

  useEffect(() => {
    // Initialize letter animations for header (12 letters for "HOUIE TIMEZ" - 11 letters + 1 space)
    const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
    letterAnims.current = newLetterAnims;
    
    // Stop any existing animations and reset to 1
    letterAnims.current.forEach(anim => {
      anim.stopAnimation();
      anim.setValue(1);
    });
    
    let currentIndex = 0;
    let isAnimating = true;
    
    const animateNextLetter = () => {
      if (!isAnimating) return;
      
      // Skip the space character (index 6) - it shouldn't animate
      // If currentIndex is the space, move to next letter
      if (currentIndex === 6) {
        currentIndex = 7;
      }
      
      // Reset all letters to normal size
      letterAnims.current.forEach(anim => {
        anim.setValue(1);
      });
      
      // Animate current letter
      Animated.sequence([
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.delay(200), // Pause before next letter
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
          // Move to next letter
          currentIndex = (currentIndex + 1) % letterAnims.current.length;
          
          // If next index is space, skip it
          if (currentIndex === 6) {
            currentIndex = 7;
          }
          
          animateNextLetter();
        }
      });
    };
    
    // Start the animation
    animateNextLetter();

    // Start button animations
    startPulseAnimation(editButtonScale, 800);
    startPulseAnimation(logoutButtonScale, 1000);
    
    settingButtonScales.current.forEach((anim, index) => {
      startPulseAnimation(anim, 800 + (index * 100));
    });

    fetchProfile();
    fetchNotifications();
    startAnimations();
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      isAnimating = false;
      if (letterAnims.current) {
        letterAnims.current.forEach(anim => {
          anim.stopAnimation();
        });
      }
    };
  }, []);

  const startPulseAnimation = (anim, duration = 800) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.08,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
  };

  const startAnimations = () => {
    // Floating animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchProfile(), fetchNotifications()]).finally(() => setRefreshing(false));
  }, []);

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
      Alert.alert("Error", "Name is required");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formDataToSend = new FormData();

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
      }
    } catch (error) {
      console.log("Update error:", error);
      Alert.alert("Error", "Failed to update profile");
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
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.post(
                `${BASE_URL}api/user/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              onLogout();
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Cartoon-style header with popping letters
  const Header = () => {
    const letters = [
      { char: 'H', index: 0 },
      { char: 'O', index: 1, isSpecial: true },
      { char: 'U', index: 2 },
      { char: 'Z', index: 3 },
      { char: 'I', index: 4 },
      { char: 'E', index: 5 },
      { char: ' ', index: 6, isSpace: true, width: 20 },
      { char: 'T', index: 7 },
      { char: 'I', index: 8 },
      { char: 'M', index: 9 },
      { char: 'E', index: 10 },
      { char: 'Z', index: 11, isSpecial: true },
    ];

    return (
      <LinearGradient
        colors={COLORS.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <View style={styles.cartoonTitleRow}>
            {letters.map((item) => {
              const animValue = letterAnims.current && letterAnims.current[item.index] 
                ? letterAnims.current[item.index] 
                : new Animated.Value(1);
              
              return (
                <Animated.Text
                  key={`letter-${item.index}`}
                  style={[
                    styles.cartoonLetter,
                    item.isSpecial && styles.specialCartoonLetter,
                    item.isSpace && { width: item.width || 20 },
                    { 
                      transform: [{ scale: animValue }],
                    }
                  ]}
                >
                  {item.char}
                </Animated.Text>
              );
            })}
          </View>
        </View>

        {/* <TouchableOpacity 
          style={styles.notification}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity> */}
      </LinearGradient>
    );
  };

  const StatCard = ({ number, label, icon, color }) => {
    const floatValue = floatAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10]
    });

    return (
      <Animated.View 
        style={[
          styles.statCard,
          {
            transform: [{ translateY: floatValue }]
          }
        ]}
      >
        <LinearGradient
          colors={[color + '20', color + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statIconContainer}
        >
          <Ionicons name={icon} size={24} color={color} />
        </LinearGradient>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    );
  };

  const InfoCard = ({ icon, label, value, color }) => {
    return (
      <LinearGradient
        colors={[COLORS.surface, COLORS.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoCard}
      >
        <LinearGradient
          colors={[color + '20', color + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoIcon}
        >
          <Ionicons name={icon} size={20} color={color} />
        </LinearGradient>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || "N/A"}</Text>
        </View>
      </LinearGradient>
    );
  };

  const SettingItem = ({ icon, title, description, color, onPress, index }) => {
    const scaleAnim = settingButtonScales.current[index] || new Animated.Value(1);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.8}>
          <LinearGradient
            colors={[color + '20', color + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.settingIcon}
          >
            <Ionicons name={icon} size={22} color={color} />
          </LinearGradient>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{title}</Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.container}>
        {/* Header with cartoon-style popping letters */}
        <Header />

        {/* Animated Background Elements */}
        <Animated.View 
          style={[
            styles.backgroundCircle1,
            {
              transform: [
                { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle2,
            {
              transform: [
                { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
              ]
            }
          ]} 
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {/* Profile Hero Section */}
          <Animated.View 
            style={[
              styles.profileHeroSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileHeroPattern}
            />
            <View style={styles.profileHeroContent}>
              <TouchableOpacity
                onPress={() => editMode && setImageModalVisible(true)}
                disabled={!editMode}
                style={styles.profileImageContainer}
              >
                <Image
                  source={{
                    uri: imageUri
                      ? imageUri
                      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
                  }}
                  style={styles.profileImage}
                />
                {editMode && (
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.editImageBadge}
                  >
                    <Ionicons name="camera" size={16} color={COLORS.surface} />
                  </LinearGradient>
                )}
              </TouchableOpacity>

              {editMode ? (
                <View style={styles.nameInputContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
                  <LinearGradient
                    colors={COLORS.prizeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileBadge}
                  >
                    <Ionicons name="star" size={14} color={COLORS.secondary} />
                    <Text style={styles.profileBadgeText}>Premium Member</Text>
                  </LinearGradient>
                </>
              )}

              <View style={styles.profileActions}>
                {/* Edit/Save Button with Pop Animation */}
                <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (editMode) {
                        updateProfile();
                      } else {
                        setEditMode(true);
                      }
                    }}
                    disabled={saving}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={editMode ? COLORS.greenGradient : COLORS.primaryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.profileActionButton}
                    >
                      <LinearGradient
                        colors={COLORS.glassGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.glassEffectOverlay}
                      />
                      <Ionicons 
                        name={editMode ? "checkmark" : "pencil"} 
                        size={16} 
                        color={COLORS.surface} 
                      />
                      <Text style={styles.profileActionText}>
                        {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Cancel Button with Pop Animation (only in edit mode) */}
                {editMode && (
                  <Animated.View style={{ transform: [{ scale: cancelButtonScale }] }}>
                    <TouchableOpacity
                      style={styles.profileCancelButton}
                      onPress={() => {
                        setEditMode(false);
                        setFormData({ name: user?.name || "" });
                        if (user?.profile_image_url) {
                          setImageUri(user.profile_image_url);
                        } else if (user?.profile_image) {
                          setImageUri(getFullImageUrl(user.profile_image));
                        } else {
                          setImageUri(null);
                        }
                      }}
                    >
                      <Ionicons name="close" size={16} color={COLORS.textLight} />
                      <Text style={styles.profileCancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <StatCard number={user?.referral_points || "0"} label="Referral Points" icon="star" color={COLORS.primary} />
            <StatCard number="24/7" label="Support" icon="headset" color={COLORS.purple} />
            <StatCard number="10+" label="Games Played" icon="game-controller" color={COLORS.teal} />
          </View>

          {/* Account Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="person-circle" size={16} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <InfoCard 
                icon="mail" 
                label="Email Address" 
                value={user?.email} 
                color={COLORS.primary}
              />
              <InfoCard 
                icon="call" 
                label="Mobile Number" 
                value={user?.mobile} 
                color={COLORS.purple}
              />
              <InfoCard 
                icon="gift" 
                label="Referral Code" 
                value={user?.referral_code} 
                color={COLORS.teal}
              />
              <InfoCard 
                icon="people" 
                label="Under Referral" 
                value={user?.under_referral || "None"} 
                color={COLORS.orange}
              />
            </View>
          </View>

          {/* Account Status */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
              </View>
            </View>

            <LinearGradient
              colors={[COLORS.surface, COLORS.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statusCard}
            >
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statusPattern}
              />
              <View style={styles.statusRow}>
                <LinearGradient
                  colors={COLORS.greenGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.statusIndicator, { width: 8, height: 8, borderRadius: 4 }]}
                />
                <View>
                  <Text style={styles.statusLabel}>Account Status</Text>
                  <Text style={styles.statusValue}>Active</Text>
                </View>
                <LinearGradient
                  colors={COLORS.greenGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statusBadge}
                >
                  <Text style={styles.statusBadgeText}>Verified</Text>
                </LinearGradient>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.statusRow}>
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.statusIndicator, { width: 8, height: 8, borderRadius: 4 }]}
                />
                <View>
                  <Text style={styles.statusLabel}>Member Since</Text>
                  <Text style={styles.statusValue}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Quick Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="settings" size={16} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
              </View>
            </View>

            <LinearGradient
              colors={[COLORS.surface, COLORS.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.settingsCard}
            >
              {/* <SettingItem 
                icon="ticket"
                title="My Tickets"
                description="View your purchased tickets"
                color={COLORS.primary}
                index={0}
                onPress={() => Alert.alert("Coming Soon", "My Tickets feature coming soon!")}
              /> */}
              {/* <SettingItem 
                icon="wallet"
                title="Wallet"
                description="Manage your balance"
                color={COLORS.purple}
                index={1}
                onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
              /> */}
              <SettingItem 
                icon="lock-closed"
                title="Privacy & Security"
                description="Manage your security settings"
                color={COLORS.teal}
                index={2}
                onPress={() => Alert.alert("Coming Soon", "Privacy settings coming soon!")}
              />
              <SettingItem 
                icon="help-circle"
                title="Help & Support"
                description="Get help with your account"
                color={COLORS.orange}
                index={3}
                onPress={() => Linking.openURL('mailto:support@tambolatimez.com')}
              />
            </LinearGradient>
          </View>

          {/* Logout Button with Pop Animation */}
          <Animated.View style={{ transform: [{ scale: logoutButtonScale }] }}>
            <TouchableOpacity onPress={logoutUser} activeOpacity={0.8}>
              <LinearGradient
                colors={[COLORS.surface, COLORS.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoutButton}
              >
                <LinearGradient
                  colors={[COLORS.red + '20', COLORS.red + '10']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoutIcon}
                >
                  <Ionicons name="log-out" size={22} color={COLORS.red} />
                </LinearGradient>
                <Text style={styles.logoutText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Version 1.0.0
            </Text>
            <Text style={styles.footerSubtext}>
              © {new Date().getFullYear()} Houzie Timez
            </Text>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Image Selection Modal */}
        <Modal visible={imageModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={[COLORS.surface, COLORS.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Profile Picture</Text>
                <TouchableOpacity onPress={() => setImageModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick("camera")}
              >
                <LinearGradient
                  colors={[COLORS.primary + '20', COLORS.primary + '10']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalOptionIcon}
                >
                  <Ionicons name="camera" size={24} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick("gallery")}
              >
                <LinearGradient
                  colors={[COLORS.purple + '20', COLORS.purple + '10']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalOptionIcon}
                >
                  <Ionicons name="images" size={24} color={COLORS.purple} />
                </LinearGradient>
                <View>
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
            </LinearGradient>
          </View>
        </Modal>

        {/* Notifications Modal */}
        {/* <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              {loadingNotifications ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
              ) : (
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                      <LinearGradient
                        colors={COLORS.primaryGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.notificationIcon}
                      >
                        <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
                      </LinearGradient>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
                        <Text style={styles.notificationMessage}>
                          {item.message || "Check out the latest updates!"}
                        </Text>
                        <Text style={styles.notificationDate}>
                          {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                        </Text>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyNotifications}>
                      <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
                      <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                  }
                />
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Loader Styles
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 20,
  },

  loaderContainerDots: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginHorizontal: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 5,
  },

  number: {
    position: 'absolute',
    left: 30,
    bottom: 0,
    fontSize: 28,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },

  number2: {
    position: 'absolute',
    right: 30,
    bottom: 0,
    fontSize: 28,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },

  ticketStrip: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#ffffff90',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  ticketText: {
    fontWeight: 'bold',
    color: '#333',
  },

  // Rest of your existing styles remain the same
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cartoonLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FDB800',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    includeFontPadding: false,
    marginHorizontal: 2,
    ...Platform.select({
      android: {
        elevation: 5,
        textShadowColor: '#FFB300',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
      },
    }),
  },
  specialCartoonLetter: {
    fontSize: 40,
    color: '#FFD700',
    textShadowColor: '#FF8C00',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    marginHorizontal: 2,
  },
  notification: {
    position: "relative",
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: 8,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  
  // Background Elements
  backgroundCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary + '10',
    zIndex: 0,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: 200,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.purple + '08',
    zIndex: 0,
  },

  // Glass Effect
  glassEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },

  // Profile Hero Section
  profileHeroSection: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },
  profileHeroPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    borderBottomLeftRadius: 75,
  },
  profileHeroContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    marginBottom: 16,
  },
  profileBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  nameInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    width: '100%',
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  profileActionText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '600',
  },
  profileCancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileCancelText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '500',
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
    zIndex: 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    zIndex: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoCard: {
    width: (width - 40) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContent: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // Status Card
  statusCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  statusPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderBottomLeftRadius: 50,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  statusBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    color: COLORS.surface,
    fontWeight: '600',
  },
  statusDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  // Settings Card
  settingsCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.red,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: '600',
    fontSize: 15,
  },

  // Footer
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  modalOptionDescription: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  modalCancelText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Profile;