// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Image,
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   SafeAreaView,
//   StatusBar,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import axios from "axios";

// // Color scheme from Faqs component
// const PRIMARY_COLOR = "#005F6A";
// const SECONDARY_COLOR = "#004B54";
// const ACCENT_COLOR = "#D4AF37";
// const LIGHT_ACCENT = "#F5E6A8";
// const MUTED_GOLD = "#E6D8A2";
// const DARK_TEAL = "#00343A";
// const WHITE = "#FFFFFF";

// const Register = ({ navigation, route }) => {
//   const { mobile, otp_code, role = "user" } = route.params;
  
//   // Refs for input fields
//   const emailRef = useRef();
//   const usernameRef = useRef();
//   const addressRef = useRef();
//   const referralRef = useRef();
//   const confirmRef = useRef();
  
//   const scrollViewRef = useRef();
//   const [step, setStep] = useState(1);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [dob, setDob] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [address, setAddress] = useState("");
//   const [referral, setReferral] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const validateStep1 = () => {
//     if (!name || !email || !username) {
//       Alert.alert("Error", "Please fill all required fields");
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert("Error", "Please enter a valid email address");
//       return false;
//     }

//     return true;
//   };

//   const validateStep2 = () => {
//     if (dob) {
//       const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
//       if (!dobRegex.test(dob)) {
//         Alert.alert("Error", "Please enter date in YYYY-MM-DD format");
//         return false;
//       }
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     if (!password || !confirm) {
//       Alert.alert("Error", "Please fill all required fields");
//       return false;
//     }

//     if (password.length < 6) {
//       Alert.alert("Error", "Password must be at least 6 characters");
//       return false;
//     }

//     if (password !== confirm) {
//       Alert.alert("Error", "Passwords do not match");
//       return false;
//     }

//     return true;
//   };

//   const handleNext = () => {
//     if (step === 1 && validateStep1()) {
//       setStep(2);
//     } else if (step === 2 && validateStep2()) {
//       setStep(3);
//     }
//   };

//   const handlePrev = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   const onChangeDate = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       const year = selectedDate.getFullYear();
//       const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
//       const day = String(selectedDate.getDate()).padStart(2, "0");
//       setDob(`${year}-${month}-${day}`);
//     }
//   };

//   const focusNextField = (nextField) => {
//     if (nextField && nextField.current) {
//       nextField.current.focus();
//     }
//   };

//   const registerUser = async () => {
//     if (!validateStep3()) return;

//     setIsLoading(true);

//     try {
//       let url = "";
//       let requestData = {};

//       if (role === "user") {
//         url = "https://tambolatime.co.in/public/api/user/register";
//       } else {
//         url = "https://tambolatime.co.in/public/api/host/register";
//       }

//       requestData = {
//         mobile,
//         name,
//         email,
//         username,
//         dob,
//         address,
//         under_referral: referral,
//         otp_code,
//         password,
//         password_confirmation: confirm,
//       };

//       const res = await axios.post(url, requestData);

//       Alert.alert(
//         "Success",
//         `${role === "user" ? "Player" : "Host"} registration successful! Please login.`
//       );
//       navigation.replace("Login");
//     } catch (err) {
//       console.log(err.response?.data || err);
//       Alert.alert(
//         "Registration Failed",
//         err.response?.data?.message || "Something went wrong"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderStepIndicator = () => (
//     <View style={styles.stepContainer}>
//       <View style={styles.stepRow}>
//         <View style={[styles.stepCircle, step >= 1 && styles.activeStep]}>
//           <Text style={[styles.stepText, step >= 1 && styles.activeStepText]}>1</Text>
//         </View>
//         <View style={[styles.stepLine, step >= 2 && styles.activeStepLine]} />
//         <View style={[styles.stepCircle, step >= 2 && styles.activeStep]}>
//           <Text style={[styles.stepText, step >= 2 && styles.activeStepText]}>2</Text>
//         </View>
//         <View style={[styles.stepLine, step >= 3 && styles.activeStepLine]} />
//         <View style={[styles.stepCircle, step >= 3 && styles.activeStep]}>
//           <Text style={[styles.stepText, step >= 3 && styles.activeStepText]}>3</Text>
//         </View>
//       </View>
//       <View style={styles.stepLabels}>
//         <Text style={[styles.stepLabel, step >= 1 && styles.activeStepLabel]}>
//           Personal
//         </Text>
//         <Text style={[styles.stepLabel, step >= 2 && styles.activeStepLabel]}>
//           Additional
//         </Text>
//         <Text style={[styles.stepLabel, step >= 3 && styles.activeStepLabel]}>
//           Security
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
//       <KeyboardAvoidingView 
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.scrollView}
//             contentContainerStyle={styles.contentContainer}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={styles.content}>
//               <View style={styles.card}>
//                 <Text style={styles.title}>
//                   {role === "user" ? "Player" : "Host"} Registration
//                 </Text>
//                 <Text style={styles.subtitle}>
//                   Step {step} of 3
//                 </Text>

//                 {renderStepIndicator()}

//                 {/* Step 1 Content */}
//                 {step === 1 && (
//                   <>
//                     <Text style={styles.stepTitle}>Personal Information</Text>
                    
//                     <View style={styles.infoBox}>
//                       <Text style={styles.infoText}>Mobile: {mobile}</Text>
//                     </View>

//                     <TextInput
//                       placeholder="Full Name *"
//                       style={styles.input}
//                       value={name}
//                       onChangeText={setName}
//                       placeholderTextColor={MUTED_GOLD}
//                       returnKeyType="next"
//                       onSubmitEditing={() => focusNextField(emailRef)}
//                     />

//                     <TextInput
//                       ref={emailRef}
//                       placeholder="Email *"
//                       style={styles.input}
//                       value={email}
//                       onChangeText={setEmail}
//                       placeholderTextColor={MUTED_GOLD}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       returnKeyType="next"
//                       onSubmitEditing={() => focusNextField(usernameRef)}
//                     />

//                     <TextInput
//                       ref={usernameRef}
//                       placeholder="Username *"
//                       style={styles.input}
//                       value={username}
//                       onChangeText={setUsername}
//                       placeholderTextColor={MUTED_GOLD}
//                       autoCapitalize="none"
//                       returnKeyType="done"
//                       onSubmitEditing={Keyboard.dismiss}
//                     />
//                   </>
//                 )}

//                 {/* Step 2 Content */}
//                 {step === 2 && (
//                   <>
//                     <Text style={styles.stepTitle}>Additional Information</Text>

//                     <TouchableOpacity
//                       style={styles.input}
//                       onPress={() => {
//                         Keyboard.dismiss();
//                         setShowDatePicker(true);
//                       }}
//                     >
//                       <Text style={dob ? styles.inputText : styles.placeholderText}>
//                         {dob || "Date of Birth (Tap to select)"}
//                       </Text>
//                     </TouchableOpacity>

//                     {showDatePicker && (
//                       <DateTimePicker
//                         value={dob ? new Date(dob) : new Date(2000, 0, 1)}
//                         mode="date"
//                         display={Platform.OS === "ios" ? "spinner" : "default"}
//                         onChange={onChangeDate}
//                         maximumDate={new Date()}
//                       />
//                     )}

//                     <TextInput
//                       ref={addressRef}
//                       placeholder="Address"
//                       style={styles.input}
//                       value={address}
//                       onChangeText={setAddress}
//                       placeholderTextColor={MUTED_GOLD}
//                       multiline
//                       numberOfLines={2}
//                       returnKeyType="next"
//                       onSubmitEditing={() => focusNextField(referralRef)}
//                     />

//                     <TextInput
//                       ref={referralRef}
//                       placeholder="Referral Code (Optional)"
//                       style={styles.input}
//                       value={referral}
//                       onChangeText={setReferral}
//                       placeholderTextColor={MUTED_GOLD}
//                       returnKeyType="done"
//                       onSubmitEditing={Keyboard.dismiss}
//                     />
//                   </>
//                 )}

//                 {/* Step 3 Content */}
//                 {step === 3 && (
//                   <>
//                     <Text style={styles.stepTitle}>Security Settings</Text>
                    
//                     <TextInput
//                       placeholder="Password * (min 6 characters)"
//                       secureTextEntry
//                       style={styles.input}
//                       value={password}
//                       onChangeText={setPassword}
//                       placeholderTextColor={MUTED_GOLD}
//                       returnKeyType="next"
//                       onSubmitEditing={() => focusNextField(confirmRef)}
//                     />

//                     <TextInput
//                       ref={confirmRef}
//                       placeholder="Confirm Password *"
//                       secureTextEntry
//                       style={styles.input}
//                       value={confirm}
//                       onChangeText={setConfirm}
//                       placeholderTextColor={MUTED_GOLD}
//                       returnKeyType="done"
//                       onSubmitEditing={Keyboard.dismiss}
//                     />

//                     <View style={styles.passwordRules}>
//                       <Text style={styles.ruleText}>• At least 6 characters</Text>
//                       <Text style={styles.ruleText}>• Must match confirmation</Text>
//                     </View>
//                   </>
//                 )}

//                 <View style={styles.buttonContainer}>
//                   {step > 1 && (
//                     <TouchableOpacity
//                       style={[styles.btn, styles.btnSecondary]}
//                       onPress={handlePrev}
//                       disabled={isLoading}
//                       activeOpacity={0.7}
//                     >
//                       <Text style={styles.btnSecondaryText}>← Back</Text>
//                     </TouchableOpacity>
//                   )}

//                   {step < 3 ? (
//                     <TouchableOpacity
//                       style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
//                       onPress={handleNext}
//                       disabled={isLoading}
//                       activeOpacity={0.9}
//                     >
//                       <Text style={styles.btnText}>Next →</Text>
//                     </TouchableOpacity>
//                   ) : (
//                     <TouchableOpacity
//                       style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
//                       onPress={registerUser}
//                       disabled={isLoading}
//                       activeOpacity={0.9}
//                     >
//                       <Text style={styles.btnText}>
//                         {isLoading ? "Registering..." : "Register Now"}
//                       </Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>

//                 <View style={styles.navigationLinks}>
//                   <TouchableOpacity 
//                     onPress={() => navigation.navigate("Login")}
//                     style={styles.linkButton}
//                   >
//                     <Text style={styles.link}>
//                       Already have an account? <Text style={styles.loginText}>Login</Text>
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity 
//                     onPress={() => navigation.goBack()}
//                     style={styles.backButton}
//                   >
//                     <Text style={styles.backText}>← Back to OTP</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
              
//               {/* Extra padding for keyboard */}
//               <View style={{ height: Platform.OS === 'ios' ? 50 : 100 }} />
//             </View>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default Register;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     flexGrow: 1,
//   },
//   content: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   card: {
//     backgroundColor: SECONDARY_COLOR,
//     padding: 20,
//     borderRadius: 16,
//     marginTop: 20,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 4 },
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 4,
//     color: LIGHT_ACCENT,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     textAlign: "center",
//     color: MUTED_GOLD,
//     fontSize: 13,
//     marginBottom: 16,
//     opacity: 0.9,
//   },
//   stepContainer: {
//     marginBottom: 20,
//   },
//   stepRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 6,
//   },
//   stepCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: DARK_TEAL,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   activeStep: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: ACCENT_COLOR,
//   },
//   stepText: {
//     color: MUTED_GOLD,
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   activeStepText: {
//     color: DARK_TEAL,
//   },
//   stepLine: {
//     width: 50,
//     height: 2,
//     backgroundColor: DARK_TEAL,
//   },
//   activeStepLine: {
//     backgroundColor: ACCENT_COLOR,
//   },
//   stepLabels: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 5,
//   },
//   stepLabel: {
//     fontSize: 11,
//     color: MUTED_GOLD,
//     textAlign: "center",
//     width: 60,
//     opacity: 0.8,
//   },
//   activeStepLabel: {
//     color: ACCENT_COLOR,
//     fontWeight: "600",
//     opacity: 1,
//   },
//   stepTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: LIGHT_ACCENT,
//     marginBottom: 16,
//   },
//   infoBox: {
//     backgroundColor: DARK_TEAL,
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   infoText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: LIGHT_ACCENT,
//   },
//   input: {
//     backgroundColor: DARK_TEAL,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 12,
//     fontSize: 14,
//     minHeight: 48,
//     color: LIGHT_ACCENT,
//     fontWeight: '500',
//   },
//   inputText: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: MUTED_GOLD,
//     opacity: 0.8,
//   },
//   passwordRules: {
//     backgroundColor: DARK_TEAL,
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   ruleText: {
//     color: MUTED_GOLD,
//     fontSize: 12,
//     marginBottom: 4,
//     opacity: 0.8,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   btn: {
//     paddingVertical: 14,
//     borderRadius: 10,
//     minHeight: 48,
//     justifyContent: 'center',
//   },
//   btnPrimary: {
//     backgroundColor: ACCENT_COLOR,
//   },
//   btnSecondary: {
//     backgroundColor: DARK_TEAL,
//     minWidth: 70,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   btnDisabled: {
//     opacity: 0.7,
//   },
//   btnText: {
//     color: DARK_TEAL,
//     textAlign: "center",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   btnSecondaryText: {
//     color: ACCENT_COLOR,
//     textAlign: "center",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   navigationLinks: {
//     marginTop: 16,
//     alignItems: "center",
//   },
//   linkButton: {
//     marginBottom: 8,
//   },
//   link: {
//     textAlign: "center",
//     fontSize: 13,
//     color: MUTED_GOLD,
//   },
//   loginText: {
//     color: ACCENT_COLOR,
//     fontWeight: "600",
//   },
//   backButton: {
//     marginTop: 8,
//   },
//   backText: {
//     textAlign: "center",
//     color: ACCENT_COLOR,
//     fontSize: 13,
//     fontWeight: "500",
//   },
// });




import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const Register = ({ navigation, route }) => {
  const { mobile, otp_code, role = "user" } = route.params;
  
  // Refs for input fields
  const emailRef = useRef();
  const usernameRef = useRef();
  const addressRef = useRef();
  const referralRef = useRef();
  const confirmRef = useRef();
  
  const scrollViewRef = useRef();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [referral, setReferral] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = () => {
    if (!name || !email || !username) {
      Alert.alert("Error", "Please fill all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (dob) {
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobRegex.test(dob)) {
        Alert.alert("Error", "Please enter date in YYYY-MM-DD format");
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    if (!password || !confirm) {
      Alert.alert("Error", "Please fill all required fields");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setDob(`${year}-${month}-${day}`);
    }
  };

  const focusNextField = (nextField) => {
    if (nextField && nextField.current) {
      nextField.current.focus();
    }
  };

  const registerUser = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      let url = "";
      let requestData = {};

      if (role === "user") {
        url = "https://tambolatime.co.in/public/api/user/register";
      } else {
        url = "https://tambolatime.co.in/public/api/host/register";
      }

      requestData = {
        mobile,
        name,
        email,
        username,
        dob,
        address,
        under_referral: referral,
        otp_code,
        password,
        password_confirmation: confirm,
      };

      const res = await axios.post(url, requestData);

      Alert.alert(
        "Success",
        `${role === "user" ? "Player" : "Host"} registration successful! Please login.`
      );
      navigation.replace("Login");
    } catch (err) {
      console.log(err.response?.data || err);
      Alert.alert(
        "Registration Failed",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepRow}>
        <View style={[styles.stepCircle, step >= 1 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 1 && styles.activeStepText]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.activeStepLine]} />
        <View style={[styles.stepCircle, step >= 2 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 2 && styles.activeStepText]}>2</Text>
        </View>
        <View style={[styles.stepLine, step >= 3 && styles.activeStepLine]} />
        <View style={[styles.stepCircle, step >= 3 && styles.activeStep]}>
          <Text style={[styles.stepText, step >= 3 && styles.activeStepText]}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabels}>
        <Text style={[styles.stepLabel, step >= 1 && styles.activeStepLabel]}>
          Personal
        </Text>
        <Text style={[styles.stepLabel, step >= 2 && styles.activeStepLabel]}>
          Additional
        </Text>
        <Text style={[styles.stepLabel, step >= 3 && styles.activeStepLabel]}>
          Security
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.card}>
                <Text style={styles.title}>
                  {role === "user" ? "Player" : "Host"} Registration
                </Text>
                <Text style={styles.subtitle}>
                  Step {step} of 3
                </Text>

                {renderStepIndicator()}

                {/* Step 1 Content */}
                {step === 1 && (
                  <>
                    <Text style={styles.stepTitle}>Personal Information</Text>
                    
                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>Mobile: {mobile}</Text>
                    </View>

                    <TextInput
                      placeholder="Full Name *"
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholderTextColor={TEXT_LIGHT}
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(emailRef)}
                    />

                    <TextInput
                      ref={emailRef}
                      placeholder="Email *"
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholderTextColor={TEXT_LIGHT}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(usernameRef)}
                    />

                    <TextInput
                      ref={usernameRef}
                      placeholder="Username *"
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholderTextColor={TEXT_LIGHT}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </>
                )}

                {/* Step 2 Content */}
                {step === 2 && (
                  <>
                    <Text style={styles.stepTitle}>Additional Information</Text>

                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => {
                        Keyboard.dismiss();
                        setShowDatePicker(true);
                      }}
                    >
                      <Text style={dob ? styles.inputText : styles.placeholderText}>
                        {dob || "Date of Birth (Tap to select)"}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={dob ? new Date(dob) : new Date(2000, 0, 1)}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                      />
                    )}

                    <TextInput
                      ref={addressRef}
                      placeholder="Address"
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholderTextColor={TEXT_LIGHT}
                      multiline
                      numberOfLines={2}
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(referralRef)}
                    />

                    <TextInput
                      ref={referralRef}
                      placeholder="Referral Code (Optional)"
                      style={styles.input}
                      value={referral}
                      onChangeText={setReferral}
                      placeholderTextColor={TEXT_LIGHT}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </>
                )}

                {/* Step 3 Content */}
                {step === 3 && (
                  <>
                    <Text style={styles.stepTitle}>Security Settings</Text>
                    
                    <TextInput
                      placeholder="Password * (min 6 characters)"
                      secureTextEntry
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholderTextColor={TEXT_LIGHT}
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(confirmRef)}
                    />

                    <TextInput
                      ref={confirmRef}
                      placeholder="Confirm Password *"
                      secureTextEntry
                      style={styles.input}
                      value={confirm}
                      onChangeText={setConfirm}
                      placeholderTextColor={TEXT_LIGHT}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />

                    <View style={styles.passwordRules}>
                      <Text style={styles.ruleText}>• At least 6 characters</Text>
                      <Text style={styles.ruleText}>• Must match confirmation</Text>
                    </View>
                  </>
                )}

                <View style={styles.buttonContainer}>
                  {step > 1 && (
                    <TouchableOpacity
                      style={[styles.btn, styles.btnSecondary]}
                      onPress={handlePrev}
                      disabled={isLoading}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnSecondaryText}>← Back</Text>
                    </TouchableOpacity>
                  )}

                  {step < 3 ? (
                    <TouchableOpacity
                      style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
                      onPress={handleNext}
                      disabled={isLoading}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.btnText}>Next →</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
                      onPress={registerUser}
                      disabled={isLoading}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.btnText}>
                        {isLoading ? "Registering..." : "Register Now"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.navigationLinks}>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate("Login")}
                    style={styles.linkButton}
                  >
                    <Text style={styles.link}>
                      Already have an account? <Text style={styles.loginText}>Login</Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                  >
                    <Text style={styles.backText}>← Back to OTP</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Extra padding for keyboard */}
              <View style={{ height: Platform.OS === 'ios' ? 50 : 100 }} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: WHITE,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: TEXT_DARK,
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: "center",
    color: TEXT_LIGHT,
    fontSize: 13,
    marginBottom: 16,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  activeStep: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  stepText: {
    color: TEXT_LIGHT,
    fontWeight: "600",
    fontSize: 14,
  },
  activeStepText: {
    color: WHITE,
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: BORDER_COLOR,
  },
  activeStepLine: {
    backgroundColor: PRIMARY_COLOR,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  stepLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    textAlign: "center",
    width: 60,
  },
  activeStepLabel: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_DARK,
  },
  input: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
    minHeight: 48,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  inputText: {
    fontSize: 14,
    color: TEXT_DARK,
  },
  placeholderText: {
    fontSize: 14,
    color: TEXT_LIGHT,
  },
  passwordRules: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  ruleText: {
    color: TEXT_LIGHT,
    fontSize: 12,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: PRIMARY_COLOR,
  },
  btnSecondary: {
    backgroundColor: BACKGROUND_COLOR,
    minWidth: 70,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: WHITE,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  btnSecondaryText: {
    color: PRIMARY_COLOR,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  navigationLinks: {
    marginTop: 16,
    alignItems: "center",
  },
  linkButton: {
    marginBottom: 8,
  },
  link: {
    textAlign: "center",
    fontSize: 13,
    color: TEXT_LIGHT,
  },
  loginText: {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 8,
  },
  backText: {
    textAlign: "center",
    color: PRIMARY_COLOR,
    fontSize: 13,
    fontWeight: "500",
  },
});