import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Color scheme from Faqs component
const PRIMARY_COLOR = "#005F6A";
const SECONDARY_COLOR = "#004B54";
const ACCENT_COLOR = "#D4AF37";
const LIGHT_ACCENT = "#F5E6A8";
const MUTED_GOLD = "#E6D8A2";
const DARK_TEAL = "#00343A";
const WHITE = "#FFFFFF";

const MobileVerify = ({ navigation, route }) => {
  const { role = "user" } = route.params || {};
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation references
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Start background animations
    startBackgroundAnimations();
  }, []);

  const startBackgroundAnimations = () => {
    // First floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Second floating animation (different timing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for subtle effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slow rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  };

  // Interpolations for animations
  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15]
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const sendOtp = async () => {
    if (!mobile) return Alert.alert("Required", "Please enter mobile number");
    if (mobile.length !== 10) return Alert.alert("Invalid", "Enter valid 10-digit mobile number");

    setIsLoading(true);

    try {
      let url = "";
      let type = "";

      if (role === "user") {
        url = "https://tambolatime.co.in/public/api/user/request-registration-otp";
        type = "user";
      } else {
        url = "https://tambolatime.co.in/public/api/host/request-registration-otp";
        type = "host";
      }

      const res = await axios.post(url, { mobile });

      Alert.alert("Success", "OTP sent successfully!");

      navigation.navigate("MobileVerifyOtp", {
        mobile,
        otp_code: res.data.otp,
        role: role,
        type: type,
      });
    } catch (err) {
      console.log(err.response?.data || err);
      Alert.alert("Failed", err.response?.data?.message || "Unable to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <View style={styles.container}>
        {/* Background with Animations */}
        <View style={styles.background}>
          {/* Animated floating elements */}
          <Animated.View 
            style={[
              styles.floatingElement1, 
              { 
                transform: [
                  { translateY: translateY1 },
                  { translateX: translateY2 }
                ] 
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.floatingElement2, 
              { 
                transform: [
                  { translateY: translateY2 },
                  { translateX: translateY1 }
                ] 
              }
            ]} 
          />
          
          {/* Center accent element */}
          <Animated.View 
            style={[
              styles.centerElement,
              { 
                transform: [{ rotate: rotate }],
                opacity: pulseAnim
              }
            ]} 
          />
          
          {/* Background gradient overlay */}
          <View style={styles.backgroundGradient} />
        </View>

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>Tambola Timez</Text>
            <Text style={styles.tagline}>Mobile Verification</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Role Badge */}
            <View style={[
              styles.roleBadge,
              role === "user" ? styles.userBadge : styles.hostBadge
            ]}>
              <Ionicons 
                name={role === "user" ? "person" : "mic"} 
                size={18} 
                color={ACCENT_COLOR} 
              />
              <Text style={styles.roleBadgeText}>
                {role === "user" ? "Player Account" : "Host Account"}
              </Text>
            </View>

            {/* Instruction */}
            <Text style={styles.instruction}>
              Enter your mobile number to receive a verification OTP
            </Text>

            {/* Mobile Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={22} color={ACCENT_COLOR} style={styles.inputIcon} />
              <TextInput
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor={MUTED_GOLD}
                keyboardType="number-pad"
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                maxLength={10}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={sendOtp}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <Ionicons name="reload-circle" size={24} color={DARK_TEAL} style={styles.loadingIcon} />
              ) : (
                <>
                  <Ionicons name="send-outline" size={20} color={DARK_TEAL} />
                  <Text style={styles.btnText}>Send OTP</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Text */}
            <Text style={styles.infoText}>
              A 6-digit verification code will be sent to your mobile number
            </Text>

            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={18} color={ACCENT_COLOR} />
              <Text style={styles.backText}>Back to Role Selection</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
            <Text style={styles.versionText}>Tambola Timez v1.0</Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default MobileVerify;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  // Floating elements with teal/gold colors
  floatingElement1: {
    position: 'absolute',
    top: 60,
    left: SCREEN_WIDTH * 0.1,
    width: 100,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 75, 84, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  floatingElement2: {
    position: 'absolute',
    top: 100,
    right: SCREEN_WIDTH * 0.15,
    width: 80,
    height: 30,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  // Center element
  centerElement: {
    position: 'absolute',
    top: 50,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  // Background gradient
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'rgba(0, 95, 106, 0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  tagline: {
    fontSize: 18,
    color: MUTED_GOLD,
    fontWeight: '500',
    opacity: 0.9,
  },
  card: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  userBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  hostBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  roleBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    color: LIGHT_ACCENT,
  },
  instruction: {
    fontSize: 15,
    color: MUTED_GOLD,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_TEAL,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
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
  btn: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
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
    marginBottom: 16,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  btnText: {
    color: DARK_TEAL,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 13,
    color: MUTED_GOLD,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    opacity: 0.8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: DARK_TEAL,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  backText: {
    color: ACCENT_COLOR,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomInfo: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomInfoText: {
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