import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import messaging from "@react-native-firebase/messaging";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Color scheme from Faqs component
const PRIMARY_COLOR = "#005F6A";
const SECONDARY_COLOR = "#004B54";
const ACCENT_COLOR = "#D4AF37";
const LIGHT_ACCENT = "#F5E6A8";
const MUTED_GOLD = "#E6D8A2";
const DARK_TEAL = "#00343A";
const WHITE = "#FFFFFF";

const Login = ({ navigation, onLoginSuccess }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  
  // Animation references
  const fadeIn = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Request notification permission and get FCM token
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        
        console.log("Notification permission result:", result);
        
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          await getFCMToken();
        } else {
          Alert.alert(
            "Notification Permission",
            "You may not receive notifications for games and updates.",
            [{ text: "OK" }]
          );
          await getFCMToken();
        }
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          
        if (enabled) {
          await getFCMToken();
        }
      }
    } catch (error) {
      console.log("Notification permission error:", error);
    }
  };

  // Get FCM token
  const getFCMToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      
      if (token) {
        setFcmToken(token);
        
        messaging().onTokenRefresh(async (refreshedToken) => {
          setFcmToken(refreshedToken);
          
          try {
            const userRole = await AsyncStorage.getItem("userRole");
            const storedToken = await AsyncStorage.getItem("token");
            
            if (storedToken && userRole) {
              console.log("Token refreshed, should update on server");
            }
          } catch (error) {
            console.log("Error handling token refresh:", error);
          }
        });
      }
    } catch (error) {
      console.log("Error getting FCM token:", error);
    }
  };

  // Check if app was opened from a quit state via notification
  const checkInitialNotification = async () => {
    try {
      const initialNotification = await messaging().getInitialNotification();
      
      if (initialNotification) {
        console.log('Notification caused app to open from quit state:', initialNotification);
      }
    } catch (error) {
      console.log("Error checking initial notification:", error);
    }
  };

  useEffect(() => {
    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Request notification permissions and get FCM token
    requestNotificationPermission();
    
    // Check for initial notification
    checkInitialNotification();

    // Set up foreground notification handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have a new notification',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    });

    // Set up background/quit state notification handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
    });

    // Handle notification when app is in background
    const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);
    });

    return () => {
      unsubscribeForeground();
      if (unsubscribeBackground) {
        unsubscribeBackground();
      }
    };
  }, []);

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Required", "Please enter mobile number and password");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Button press animation
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();

    try {
      let loginUrl = "";
      let tokenKey = "";
      let userKey = "";

      if (selectedRole === "user") {
        loginUrl = "https://tambolatime.co.in/public/api/user/login";
        tokenKey = "userToken";
        userKey = "user";
      } else {
        loginUrl = "https://tambolatime.co.in/public/api/host/login";
        tokenKey = "hostToken";
        userKey = "host";
      }

      // Prepare request body with FCM token
      const requestBody = {
        mobile,
        password,
        fcm_token: fcmToken || ""
      };

      const res = await axios.post(loginUrl, requestBody);
      const token = res.data.token;
      const userData = res.data.user || res.data.host || res.data.data || {};

      if (!token) {
        throw new Error("Invalid credentials");
      }

      // Clear previous storage
      await AsyncStorage.multiRemove(["userToken", "hostToken", "user", "host", "token", "userData", "userRole"]);

      // Store data
      await AsyncStorage.setItem("userRole", selectedRole);
      await AsyncStorage.setItem(tokenKey, token);
      await AsyncStorage.setItem(userKey, JSON.stringify(userData));
      await AsyncStorage.setItem("userData", JSON.stringify({ ...userData, role: selectedRole }));
      await AsyncStorage.setItem("token", token);
      
      // Also store FCM token locally for reference
      if (fcmToken) {
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }

      // Success animation
      setTimeout(() => {
        onLoginSuccess();
      }, 400);

    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      
      // Error shake animation
      const shake = new Animated.Value(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();

      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid mobile number or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually request notification permission (optional UI button)
  const handleRequestNotificationPermission = async () => {
    try {
      await requestNotificationPermission();
      Alert.alert(
        "Success",
        "Notification permission requested. You can now receive game updates and notifications.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to request notification permission. Please check app settings.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View
                style={[
                  styles.mainContent,
                  {
                    opacity: fadeIn,
                    transform: [{ translateY: cardSlide }]
                  }
                ]}
              >
                {/* Simple Welcome Header */}
                <View style={styles.header}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.appName}>Tambola Timez</Text>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                  </View>
                  
                  {/* Optional: Show FCM token status */}
                  {fcmToken ? (
                    <View style={styles.fcmStatusContainer}>
                      <Ionicons name="notifications" size={16} color={ACCENT_COLOR} />
                      <Text style={styles.fcmStatusText}>Notifications Enabled</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.enableNotificationsButton}
                      onPress={handleRequestNotificationPermission}
                    >
                      <Ionicons name="notifications-off" size={16} color={ACCENT_COLOR} />
                      <Text style={styles.enableNotificationsText}>Enable Notifications</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                  {/* Role Selection */}
                  <View style={styles.roleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "user" && styles.roleButtonActive,
                      ]}
                      onPress={() => setSelectedRole("user")}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        styles.roleButtonContent,
                        selectedRole === "user" && styles.roleButtonContentActive
                      ]}>
                        <Ionicons 
                          name="person" 
                          size={20} 
                          color={selectedRole === "user" ? DARK_TEAL : LIGHT_ACCENT} 
                        />
                        <Text style={[
                          styles.roleButtonText,
                          selectedRole === "user" && styles.roleButtonTextActive
                        ]}>
                          Player
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "host" && styles.roleButtonActive,
                      ]}
                      onPress={() => setSelectedRole("host")}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        styles.roleButtonContent,
                        selectedRole === "host" && styles.roleButtonContentActive
                      ]}>
                        <Ionicons 
                          name="mic" 
                          size={20} 
                          color={selectedRole === "host" ? DARK_TEAL : LIGHT_ACCENT} 
                        />
                        <Text style={[
                          styles.roleButtonText,
                          selectedRole === "host" && styles.roleButtonTextActive
                        ]}>
                          Host
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Form */}
                  <View style={styles.form}>
                    <View style={styles.inputContainer}>
                      <Ionicons name="call-outline" size={20} color={ACCENT_COLOR} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Mobile Number"
                        placeholderTextColor={MUTED_GOLD}
                        style={styles.input}
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color={ACCENT_COLOR} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Password"
                        placeholderTextColor={MUTED_GOLD}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onSubmitEditing={handleLogin}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color={ACCENT_COLOR} 
                        />
                      </TouchableOpacity>
                    </View>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                      <TouchableOpacity
                        style={[
                          styles.loginButton,
                          isLoading && styles.loginButtonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.9}
                      >
                        {isLoading ? (
                          <Ionicons name="reload-circle" size={24} color={DARK_TEAL} style={styles.loadingIcon} />
                        ) : (
                          <>
                            <Text style={styles.loginButtonText}>SIGN IN</Text>
                            <Ionicons name="arrow-forward" size={20} color={DARK_TEAL} />
                          </>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  </View>

                  {/* Quick Links */}
                  <View style={styles.linksRow}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword", { role: selectedRole })}
                      style={styles.linkButton}
                    >
                      <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity 
                      onPress={() => navigation.navigate("ChooseRole")}
                      style={styles.linkButton}
                    >
                      <Text style={styles.linkText}>Create Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Bottom Quick Info */}
                <View style={styles.bottomInfo}>
                  <Text style={styles.infoText}>
                    By signing in, you agree to our Terms & Privacy
                  </Text>
                  <Text style={styles.infoText}>
                    Enable notifications for game updates and alerts
                  </Text>
                  <Text style={styles.versionText}>Tambola Timez v1.0</Text>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.3,
    backgroundColor: 'rgba(0, 95, 106, 0.2)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: LIGHT_ACCENT,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeText: {
    fontSize: 18,
    color: MUTED_GOLD,
    fontWeight: '500',
    opacity: 0.9,
  },
  fcmStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  fcmStatusText: {
    fontSize: 12,
    color: ACCENT_COLOR,
    fontWeight: '600',
    marginLeft: 6,
  },
  enableNotificationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  enableNotificationsText: {
    fontSize: 12,
    color: ACCENT_COLOR,
    fontWeight: '600',
    marginLeft: 6,
  },
  card: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 25,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: DARK_TEAL,
    borderRadius: 15,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  roleButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  roleButtonContentActive: {
    backgroundColor: ACCENT_COLOR,
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: LIGHT_ACCENT,
  },
  roleButtonTextActive: {
    color: DARK_TEAL,
    fontWeight: '700',
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_TEAL,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: LIGHT_ACCENT,
    height: '100%',
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 6,
  },
  loginButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 15,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  loginButtonText: {
    color: DARK_TEAL,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: ACCENT_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.5)',
  },
  bottomInfo: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    color: MUTED_GOLD,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
    opacity: 0.8,
  },
  versionText: {
    color: MUTED_GOLD,
    fontSize: 11,
    opacity: 0.6,
  },
});