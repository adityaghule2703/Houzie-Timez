// import React, { useState } from "react";
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

// const ForgotPassword = ({ navigation, route }) => {
//   const { role = "user" } = route.params || {};
//   const [mobile, setMobile] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const sendOtp = async () => {
//     if (!mobile) return Alert.alert("Error", "Please enter mobile number");
//     if (mobile.length !== 10) return Alert.alert("Error", "Enter valid 10-digit mobile number");

//     setIsLoading(true);

//     try {
//       let url = "";
//       let type = "";

//       if (role === "user") {
//         url = "https://tambolatime.co.in/public/api/user/request-forgot-password-otp";
//         type = "forgot_user";
//       } else {
//         url = "https://tambolatime.co.in/public/api/host/request-forgot-password-otp";
//         type = "forgot_host";
//       }

//       const res = await axios.post(url, { mobile });

//       Alert.alert("Success", "OTP sent successfully!");

//       navigation.navigate("ForgotPasswordVerify", {
//         mobile,
//         otp_code: res.data.otp,
//         role: role,
//         type: type,
//       });
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Failed", err.response?.data?.message || "Unable to send OTP");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Forgot Password</Text>
//           <Text style={styles.subtitle}>
//             {role === "user" ? "Player" : "Host"} Account
//           </Text>

//           <TextInput
//             placeholder="Mobile Number"
//             keyboardType="number-pad"
//             style={styles.input}
//             value={mobile}
//             onChangeText={setMobile}
//             placeholderTextColor={MUTED_GOLD}
//             maxLength={10}
//           />

//           <TouchableOpacity
//             style={[styles.btn, isLoading && styles.btnDisabled]}
//             onPress={sendOtp}
//             disabled={isLoading}
//             activeOpacity={0.9}
//           >
//             <Text style={styles.btnText}>
//               {isLoading ? "Sending..." : "Send OTP"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             onPress={() => navigation.navigate("Login")}
//             style={styles.backButton}
//           >
//             <Text style={styles.backText}>← Back to Login</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ForgotPassword;

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
//     marginBottom: 30,
//     opacity: 0.9,
//   },
//   input: {
//     backgroundColor: DARK_TEAL,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//     fontSize: 15,
//     color: LIGHT_ACCENT,
//     fontWeight: '500',
//   },
//   btn: {
//     backgroundColor: ACCENT_COLOR,
//     paddingVertical: 16,
//     borderRadius: 12,
//     marginTop: 10,
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




import React, { useState } from "react";
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

const ForgotPassword = ({ navigation, route }) => {
  const { role = "user" } = route.params || {};
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async () => {
    if (!mobile) return Alert.alert("Error", "Please enter mobile number");
    if (mobile.length !== 10) return Alert.alert("Error", "Enter valid 10-digit mobile number");

    setIsLoading(true);

    try {
      let url = "";
      let type = "";

      if (role === "user") {
        url = "https://tambolatime.co.in/public/api/user/request-forgot-password-otp";
        type = "forgot_user";
      } else {
        url = "https://tambolatime.co.in/public/api/host/request-forgot-password-otp";
        type = "forgot_host";
      }

      const res = await axios.post(url, { mobile });

      Alert.alert("Success", "OTP sent successfully!");

      navigation.navigate("ForgotPasswordVerify", {
        mobile,
        otp_code: res.data.otp,
        role: role,
        type: type,
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Failed", err.response?.data?.message || "Unable to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            {role === "user" ? "Player" : "Host"} Account
          </Text>

          <TextInput
            placeholder="Mobile Number"
            keyboardType="number-pad"
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor={TEXT_LIGHT}
            maxLength={10}
          />

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={sendOtp}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={styles.btnText}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate("Login")}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
    marginBottom: 30,
  },
  input: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  btn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
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