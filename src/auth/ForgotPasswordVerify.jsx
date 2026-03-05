// import React, { useState, useRef } from "react";
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   Alert, 
//   StyleSheet,
//   SafeAreaView,
//   StatusBar 
// } from "react-native";
// import axios from "axios";

// // Color scheme from Faqs component
// const PRIMARY_COLOR = "#005F6A";
// const SECONDARY_COLOR = "#004B54";
// const ACCENT_COLOR = "#D4AF37";
// const LIGHT_ACCENT = "#F5E6A8";
// const MUTED_GOLD = "#E6D8A2";
// const DARK_TEAL = "#00343A";
// const WHITE = "#FFFFFF";

// const ForgotPasswordVerify = ({ navigation, route }) => {
//   const { mobile, role = "user", type = "forgot_user" } = route.params;
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);
//   const inputRefs = useRef([]);

//   const handleOtpChange = (index, value) => {
//     if (value && !/^\d+$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     if (!value && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleKeyPress = (index, key) => {
//     if (key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const verifyOtp = async () => {
//     const otpString = otp.join("");
    
//     if (!otpString || otpString.length !== 6) {
//       return Alert.alert("Error", "Enter valid 6-digit OTP");
//     }

//     setIsLoading(true);

//     try {
//       let url = "";
      
//       if (role === "user") {
//         url = "https://tambolatime.co.in/public/api/user/verify-otp";
//       } else {
//         url = "https://tambolatime.co.in/public/api/host/verify-otp";
//       }

//       await axios.post(url, {
//         mobile,
//         code: otpString,
//         type: type,
//       });

//       Alert.alert("Success", "OTP Verified!");

//       navigation.navigate("ResetPassword", {
//         mobile,
//         otp_code: otpString,
//         role: role,
//       });
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", err.response?.data?.message || "Incorrect OTP");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearOtp = () => {
//     setOtp(["", "", "", "", "", ""]);
//     inputRefs.current[0]?.focus();
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Verify OTP</Text>
//           <Text style={styles.subtitle}>
//             {role === "user" ? "Player" : "Host"} Password Reset
//           </Text>

//           <View style={styles.mobileInfo}>
//             <Text style={styles.mobileText}>Mobile: {mobile}</Text>
//           </View>

//           <Text style={styles.instruction}>Enter the 6-digit OTP sent to your mobile</Text>

//           <View style={styles.otpWrapper}>
//             <View style={styles.otpContainer}>
//               {otp.map((digit, index) => (
//                 <TextInput
//                   key={index}
//                   ref={ref => inputRefs.current[index] = ref}
//                   style={[
//                     styles.otpBox,
//                     digit && styles.otpBoxFilled
//                   ]}
//                   keyboardType="number-pad"
//                   maxLength={1}
//                   value={digit}
//                   onChangeText={(value) => handleOtpChange(index, value)}
//                   onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
//                   placeholder="•"
//                   placeholderTextColor={MUTED_GOLD}
//                   textAlign="center"
//                   autoFocus={index === 0}
//                   selectionColor={ACCENT_COLOR}
//                 />
//               ))}
//             </View>
//           </View>

//           <TouchableOpacity onPress={clearOtp} style={styles.clearBtn}>
//             <Text style={styles.clearText}>Clear OTP</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.btn, isLoading && styles.btnDisabled]}
//             onPress={verifyOtp}
//             disabled={isLoading}
//             activeOpacity={0.9}
//           >
//             <Text style={styles.btnText}>
//               {isLoading ? "Verifying..." : "Verify OTP"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Text style={styles.backText}>← Back to Mobile Entry</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ForgotPasswordVerify;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   card: {
//     backgroundColor: SECONDARY_COLOR,
//     borderRadius: 20,
//     padding: 25,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 4 },
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   title: { 
//     fontSize: 28, 
//     fontWeight: "700", 
//     textAlign: "center",
//     color: LIGHT_ACCENT,
//     marginBottom: 5,
//     letterSpacing: -0.5,
//   },
//   subtitle: { 
//     textAlign: "center", 
//     color: MUTED_GOLD, 
//     fontSize: 14, 
//     marginBottom: 20,
//     opacity: 0.9,
//   },
//   mobileInfo: {
//     backgroundColor: DARK_TEAL,
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 25,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   mobileText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: LIGHT_ACCENT,
//   },
//   instruction: {
//     textAlign: "center",
//     color: MUTED_GOLD,
//     fontSize: 14,
//     marginBottom: 20,
//     opacity: 0.9,
//   },
//   otpWrapper: {
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   otpContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   otpBox: {
//     width: 40,
//     height: 48,
//     borderWidth: 2,
//     borderColor: MUTED_GOLD,
//     borderRadius: 8,
//     backgroundColor: DARK_TEAL,
//     fontSize: 20,
//     fontWeight: "600",
//     color: LIGHT_ACCENT,
//   },
//   otpBoxFilled: {
//     borderColor: ACCENT_COLOR,
//     backgroundColor: DARK_TEAL,
//   },
//   clearBtn: {
//     alignSelf: "center",
//     marginBottom: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     backgroundColor: DARK_TEAL,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   clearText: {
//     color: MUTED_GOLD,
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   btn: {
//     backgroundColor: ACCENT_COLOR,
//     paddingVertical: 16,
//     borderRadius: 12,
//     marginTop: 5,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   btnDisabled: {
//     opacity: 0.7,
//   },
//   btnText: { 
//     color: DARK_TEAL, 
//     textAlign: "center", 
//     fontSize: 16, 
//     fontWeight: "700",
//     letterSpacing: 0.5,
//   },
//   backButton: {
//     marginTop: 20,
//     paddingVertical: 8,
//   },
//   backText: {
//     textAlign: "center",
//     color: ACCENT_COLOR,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });
















import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  SafeAreaView,
  StatusBar 
} from "react-native";
import axios from "axios";

// Updated color scheme matching Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";

const ForgotPasswordVerify = ({ navigation, route }) => {
  const { mobile, role = "user", type = "forgot_user" } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    
    if (!otpString || otpString.length !== 6) {
      return Alert.alert("Error", "Enter valid 6-digit OTP");
    }

    setIsLoading(true);

    try {
      let url = "";
      
      if (role === "user") {
        url = "https://tambolatime.co.in/public/api/user/verify-otp";
      } else {
        url = "https://tambolatime.co.in/public/api/host/verify-otp";
      }

      await axios.post(url, {
        mobile,
        code: otpString,
        type: type,
      });

      Alert.alert("Success", "OTP Verified!");

      navigation.navigate("ResetPassword", {
        mobile,
        otp_code: otpString,
        role: role,
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.message || "Incorrect OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            {role === "user" ? "Player" : "Host"} Password Reset
          </Text>

          <View style={styles.mobileInfo}>
            <Text style={styles.mobileText}>Mobile: {mobile}</Text>
          </View>

          <Text style={styles.instruction}>Enter the 6-digit OTP sent to your mobile</Text>

          <View style={styles.otpWrapper}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  style={[
                    styles.otpBox,
                    digit && styles.otpBoxFilled
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  placeholder="•"
                  placeholderTextColor={TEXT_LIGHT}
                  textAlign="center"
                  autoFocus={index === 0}
                  selectionColor={ACCENT_COLOR}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={clearOtp} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={verifyOtp}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={styles.btnText}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back to Mobile Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordVerify;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    textAlign: "center",
    color: TEXT_DARK,
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  subtitle: { 
    textAlign: "center", 
    color: TEXT_LIGHT, 
    fontSize: 14, 
    marginBottom: 20,
  },
  mobileInfo: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  mobileText: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  instruction: {
    textAlign: "center",
    color: TEXT_LIGHT,
    fontSize: 14,
    marginBottom: 20,
  },
  otpWrapper: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpBox: {
    width: 40,
    height: 48,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    backgroundColor: BACKGROUND_COLOR,
    fontSize: 20,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  otpBoxFilled: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: WHITE,
    borderWidth: 2,
  },
  clearBtn: {
    alignSelf: "center",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  clearText: {
    color: TEXT_LIGHT,
    fontSize: 14,
    fontWeight: "500",
  },
  btn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: { 
    color: WHITE, 
    textAlign: "center", 
    fontSize: 16, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  backText: {
    textAlign: "center",
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "600",
  },
});