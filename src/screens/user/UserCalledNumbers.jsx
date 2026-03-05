// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Animated,
//   Easing,
//   ActivityIndicator,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Tts from "react-native-tts";

// const { width } = Dimensions.get("window");
// // Calculate size based on 10 items per row with proper spacing
// const CELL_SIZE = Math.min((width - 40) / 10 - 4, 36); // Reduced padding and size

// const UserCalledNumbers = ({ navigation, route }) => {
//   const { calledNumbers } = route.params;
//   const [voiceType, setVoiceType] = useState('female');
//   const [speaking, setSpeaking] = useState(false);
//   const [activeNumber, setActiveNumber] = useState(null);
//   const [ttsInitialized, setTtsInitialized] = useState(false);
//   const [loading, setLoading] = useState(true);
  
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Initialize TTS
//   useEffect(() => {
//     initializeTTS();
    
//     return () => {
//       Tts.stop();
//     };
//   }, []);

//   const initializeTTS = async () => {
//     try {
//       // Initialize TTS
//       await Tts.setDefaultLanguage('en-US');
      
//       // Load voice preference
//       const savedVoice = await AsyncStorage.getItem('voiceType');
//       if (savedVoice) {
//         setVoiceType(savedVoice);
//         await updateVoiceSettings(savedVoice);
//       } else {
//         await updateVoiceSettings('female');
//       }
      
//       // Get available voices
//       const voices = await Tts.voices();
//       console.log('Available voices:', voices);
      
//       setTtsInitialized(true);
//       setLoading(false);
//     } catch (error) {
//       console.log("Error initializing TTS:", error);
//       setTtsInitialized(true); // Still set as initialized even if voice selection fails
//       setLoading(false);
//     }
//   };

//   const updateVoiceSettings = async (type) => {
//     try {
//       if (type === 'male') {
//         await Tts.setDefaultRate(0.75);
//         await Tts.setDefaultPitch(0.8);
        
//         // Get available voices and set male voice if available
//         const voices = await Tts.voices();
//         if (voices && voices.length > 0) {
//           const maleVoices = voices.filter(v => 
//             v.name.toLowerCase().includes('male') || 
//             v.name.toLowerCase().includes('man') ||
//             v.language.includes('en') && (v.name.includes('Male') || v.name.includes('male'))
//           );
//           if (maleVoices.length > 0) {
//             await Tts.setDefaultVoice(maleVoices[0].id);
//           }
//         }
//       } else {
//         await Tts.setDefaultRate(0.85);
//         await Tts.setDefaultPitch(1.1);
        
//         // Get available voices and set female voice if available
//         const voices = await Tts.voices();
//         if (voices && voices.length > 0) {
//           const femaleVoices = voices.filter(v => 
//             v.name.toLowerCase().includes('female') || 
//             v.name.toLowerCase().includes('woman') ||
//             v.language.includes('en') && (v.name.includes('Female') || v.name.includes('female'))
//           );
//           if (femaleVoices.length > 0) {
//             await Tts.setDefaultVoice(femaleVoices[0].id);
//           }
//         }
//       }
//     } catch (error) {
//       console.log("Error updating voice settings:", error);
//     }
//   };

//   const startPulseAnimation = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 300,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const stopPulseAnimation = () => {
//     pulseAnim.stopAnimation();
//     pulseAnim.setValue(1);
//   };

//   const speakText = async (text, options = {}) => {
//     if (!ttsInitialized) return;
    
//     try {
//       // Stop any ongoing speech
//       await Tts.stop();
      
//       // Add slight delay
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Speak the text
//       await Tts.speak(text, {
//         rate: voiceType === 'male' ? 0.75 : 0.85,
//         pitch: voiceType === 'male' ? 0.8 : 1.1,
//         ...options
//       });
//     } catch (error) {
//       console.log("Error speaking text:", error);
//     }
//   };

//   const speakNumber = async (number) => {
//     if (speaking) {
//       Tts.stop();
//       setSpeaking(false);
//       setActiveNumber(null);
//       stopPulseAnimation();
//       return;
//     }

//     Tts.stop();
//     setSpeaking(true);
//     setActiveNumber(number);
//     startPulseAnimation();

//     const numStr = number.toString();
    
//     if (numStr.length === 1) {
//       const digitWord = getSingleDigitWord(number);
//       const speechText = `Single digit ${digitWord}`;
      
//       await speakText(speechText);
      
//       // Reset speaking state when done
//       setTimeout(() => {
//         setSpeaking(false);
//         setActiveNumber(null);
//         stopPulseAnimation();
//       }, 1000);
      
//       return;
//     }
    
//     const singleDigits = numStr.split('').map(digit => {
//       switch(digit) {
//         case '0': return 'zero';
//         case '1': return 'one';
//         case '2': return 'two';
//         case '3': return 'three';
//         case '4': return 'four';
//         case '5': return 'five';
//         case '6': return 'six';
//         case '7': return 'seven';
//         case '8': return 'eight';
//         case '9': return 'nine';
//         default: return digit;
//       }
//     }).join(' ');
    
//     const fullNumberName = getNumberName(number);
    
//     const digitsSpeechText = `Number ${singleDigits}`;
    
//     try {
//       await speakText(digitsSpeechText);
      
//       // Wait a moment before speaking the full name
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Speak the full number name
//       await speakText(fullNumberName, {
//         pitch: voiceType === 'male' ? 0.9 : 1.1,
//         rate: 0.9,
//       });
      
//     } catch (error) {
//       console.log("Error speaking number:", error);
//     } finally {
//       setSpeaking(false);
//       setActiveNumber(null);
//       stopPulseAnimation();
//     }
//   };

//   const getSingleDigitWord = (num) => {
//     switch(num) {
//       case 1: return 'one';
//       case 2: return 'two';
//       case 3: return 'three';
//       case 4: return 'four';
//       case 5: return 'five';
//       case 6: return 'six';
//       case 7: return 'seven';
//       case 8: return 'eight';
//       case 9: return 'nine';
//       default: return 'zero';
//     }
//   };

//   const getNumberName = (num) => {
//     const numberNames = {
//       1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
//       6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
//       11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
//       16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
//       21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
//       26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
//       31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
//       36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
//       41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
//       46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
//       51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
//       56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
//       61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
//       66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
//       71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
//       76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
//       81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
//       86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety'
//     };
    
//     return numberNames[num] || num.toString();
//   };

//   const renderNumberGrid = () => {
//     const rows = [];
    
//     // Create rows of 10 numbers each
//     for (let row = 0; row < 9; row++) {
//       const rowNumbers = [];
//       for (let col = 1; col <= 10; col++) {
//         const number = row * 10 + col;
//         const isCalled = calledNumbers.includes(number);
//         const isActive = activeNumber === number;
        
//         rowNumbers.push(
//           <TouchableOpacity
//             key={number}
//             style={[
//               styles.numberCell,
//               isCalled && styles.calledNumberCell,
//               isActive && styles.activeNumberCell,
//             ]}
//             onPress={() => speakNumber(number)}
//             disabled={!isCalled && !isActive}
//             activeOpacity={isCalled ? 0.7 : 1}
//           >
//             <Text style={[
//               styles.numberText,
//               isCalled && styles.calledNumberText,
//               isActive && styles.activeNumberText,
//             ]}>
//               {number}
//             </Text>
//             {isActive && (
//               <Animated.View 
//                 style={[
//                   styles.pulseRing,
//                   {
//                     transform: [{ scale: pulseAnim }],
//                     opacity: pulseAnim.interpolate({
//                       inputRange: [1, 1.1],
//                       outputRange: [0.3, 0]
//                     })
//                   }
//                 ]} 
//               />
//             )}
//           </TouchableOpacity>
//         );
//       }
      
//       rows.push(
//         <View key={row} style={styles.numberRow}>
//           {rowNumbers}
//         </View>
//       );
//     }

//     return (
//       <View style={styles.numberGrid}>
//         {rows}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#40E0D0" />
//         <Text style={styles.loadingText}>Initializing TTS...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={24} color="#40E0D0" />
//           </TouchableOpacity>
          
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.gameName}>Called Numbers</Text>
//             <Text style={styles.gameCode}>
//               {calledNumbers.length}/90 Numbers Called
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.container}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* All Numbers Grid Section */}
//           <View style={styles.numbersSection}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
//               <View style={styles.sectionBadge}>
//                 <Text style={styles.sectionBadgeText}>
//                   {calledNumbers.length}/90
//                 </Text>
//               </View>
//             </View>
            
//             {renderNumberGrid()}
//           </View>

//           {/* Bottom Space */}
//           <View style={styles.bottomSpace} />
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 10,
//   },
//   // Header Styles
//   header: {
//     backgroundColor: "#FFFFFF",
//     paddingTop: 20,
//     paddingHorizontal: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E9ECEF",
//   },
//   headerTop: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   backButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#F8F9FA",
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "#E9ECEF",
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   gameName: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#212529",
//     letterSpacing: -0.5,
//   },
//   gameCode: {
//     fontSize: 13,
//     color: "#6C757D",
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   // Numbers Section
//   numbersSection: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E9ECEF",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#212529",
//   },
//   sectionBadge: {
//     backgroundColor: "#40E0D0",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//   },
//   sectionBadgeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#FFF",
//   },
//   // Number Grid
//   numberGrid: {
//     gap: 4,
//   },
//   numberRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 4,
//     marginBottom: 4,
//   },
//   numberCell: {
//     width: CELL_SIZE,
//     height: CELL_SIZE,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8F9FA",
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#E9ECEF",
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   calledNumberCell: {
//     backgroundColor: "#4CAF50",
//     borderColor: "#388E3C",
//   },
//   activeNumberCell: {
//     backgroundColor: "#FF6B35",
//     borderColor: "#FF6B35",
//     zIndex: 10,
//   },
//   numberText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#6C757D",
//   },
//   calledNumberText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
//   activeNumberText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//   },
//   pulseRing: {
//     position: 'absolute',
//     width: CELL_SIZE,
//     height: CELL_SIZE,
//     borderRadius: 6,
//     backgroundColor: '#FF6B35',
//     zIndex: 9,
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8F9FA",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#6C757D",
//   },
// });

// export default UserCalledNumbers;






// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Animated,
//   Easing,
//   ActivityIndicator,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Tts from "react-native-tts";

// const { width } = Dimensions.get("window");
// // Calculate size based on 10 items per row with proper spacing
// const CELL_SIZE = Math.min((width - 40) / 10 - 4, 36); // Reduced padding and size

// // Updated color scheme matching Game component - Mango Yellow theme
// const PRIMARY_COLOR = "#02658D"; // Main background color (blue)
// const SECONDARY_COLOR = "#02557A"; // Darker blue
// const ACCENT_COLOR = "#f0ae13"; // Mango yellow
// const LIGHT_ACCENT = "#FFECB3"; // Very light mango
// const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// const WHITE = "#FFFFFF";
// const SUCCESS_GREEN = "#f0ae13"; // Mango yellow for success states
// const ACTIVE_ORANGE = "#F39C12"; // Orange for active state
// const GRAY_BG = "#F8F9FA";
// const BORDER_GRAY = "#E9ECEF";
// const TEXT_DARK = "#212529";
// const TEXT_GRAY = "#6C757D";

// const UserCalledNumbers = ({ navigation, route }) => {
//   const { calledNumbers } = route.params;
//   const [voiceType, setVoiceType] = useState('female');
//   const [speaking, setSpeaking] = useState(false);
//   const [activeNumber, setActiveNumber] = useState(null);
//   const [ttsInitialized, setTtsInitialized] = useState(false);
//   const [loading, setLoading] = useState(true);
  
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Initialize TTS
//   useEffect(() => {
//     initializeTTS();
    
//     return () => {
//       Tts.stop();
//     };
//   }, []);

//   const initializeTTS = async () => {
//     try {
//       // Initialize TTS
//       await Tts.setDefaultLanguage('en-US');
      
//       // Load voice preference
//       const savedVoice = await AsyncStorage.getItem('voiceType');
//       if (savedVoice) {
//         setVoiceType(savedVoice);
//         await updateVoiceSettings(savedVoice);
//       } else {
//         await updateVoiceSettings('female');
//       }
      
//       // Get available voices
//       const voices = await Tts.voices();
//       console.log('Available voices:', voices);
      
//       setTtsInitialized(true);
//       setLoading(false);
//     } catch (error) {
//       console.log("Error initializing TTS:", error);
//       setTtsInitialized(true); // Still set as initialized even if voice selection fails
//       setLoading(false);
//     }
//   };

//   const updateVoiceSettings = async (type) => {
//     try {
//       if (type === 'male') {
//         await Tts.setDefaultRate(0.75);
//         await Tts.setDefaultPitch(0.8);
        
//         // Get available voices and set male voice if available
//         const voices = await Tts.voices();
//         if (voices && voices.length > 0) {
//           const maleVoices = voices.filter(v => 
//             v.name.toLowerCase().includes('male') || 
//             v.name.toLowerCase().includes('man') ||
//             v.language.includes('en') && (v.name.includes('Male') || v.name.includes('male'))
//           );
//           if (maleVoices.length > 0) {
//             await Tts.setDefaultVoice(maleVoices[0].id);
//           }
//         }
//       } else {
//         await Tts.setDefaultRate(0.85);
//         await Tts.setDefaultPitch(1.1);
        
//         // Get available voices and set female voice if available
//         const voices = await Tts.voices();
//         if (voices && voices.length > 0) {
//           const femaleVoices = voices.filter(v => 
//             v.name.toLowerCase().includes('female') || 
//             v.name.toLowerCase().includes('woman') ||
//             v.language.includes('en') && (v.name.includes('Female') || v.name.includes('female'))
//           );
//           if (femaleVoices.length > 0) {
//             await Tts.setDefaultVoice(femaleVoices[0].id);
//           }
//         }
//       }
//     } catch (error) {
//       console.log("Error updating voice settings:", error);
//     }
//   };

//   const startPulseAnimation = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 300,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const stopPulseAnimation = () => {
//     pulseAnim.stopAnimation();
//     pulseAnim.setValue(1);
//   };

//   const speakText = async (text, options = {}) => {
//     if (!ttsInitialized) return;
    
//     try {
//       // Stop any ongoing speech
//       await Tts.stop();
      
//       // Add slight delay
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Speak the text
//       await Tts.speak(text, {
//         rate: voiceType === 'male' ? 0.75 : 0.85,
//         pitch: voiceType === 'male' ? 0.8 : 1.1,
//         ...options
//       });
//     } catch (error) {
//       console.log("Error speaking text:", error);
//     }
//   };

//   const speakNumber = async (number) => {
//     if (speaking) {
//       Tts.stop();
//       setSpeaking(false);
//       setActiveNumber(null);
//       stopPulseAnimation();
//       return;
//     }

//     Tts.stop();
//     setSpeaking(true);
//     setActiveNumber(number);
//     startPulseAnimation();

//     const numStr = number.toString();
    
//     if (numStr.length === 1) {
//       const digitWord = getSingleDigitWord(number);
//       const speechText = `Single digit ${digitWord}`;
      
//       await speakText(speechText);
      
//       // Reset speaking state when done
//       setTimeout(() => {
//         setSpeaking(false);
//         setActiveNumber(null);
//         stopPulseAnimation();
//       }, 1000);
      
//       return;
//     }
    
//     const singleDigits = numStr.split('').map(digit => {
//       switch(digit) {
//         case '0': return 'zero';
//         case '1': return 'one';
//         case '2': return 'two';
//         case '3': return 'three';
//         case '4': return 'four';
//         case '5': return 'five';
//         case '6': return 'six';
//         case '7': return 'seven';
//         case '8': return 'eight';
//         case '9': return 'nine';
//         default: return digit;
//       }
//     }).join(' ');
    
//     const fullNumberName = getNumberName(number);
    
//     const digitsSpeechText = `Number ${singleDigits}`;
    
//     try {
//       await speakText(digitsSpeechText);
      
//       // Wait a moment before speaking the full name
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Speak the full number name
//       await speakText(fullNumberName, {
//         pitch: voiceType === 'male' ? 0.9 : 1.1,
//         rate: 0.9,
//       });
      
//     } catch (error) {
//       console.log("Error speaking number:", error);
//     } finally {
//       setSpeaking(false);
//       setActiveNumber(null);
//       stopPulseAnimation();
//     }
//   };

//   const getSingleDigitWord = (num) => {
//     switch(num) {
//       case 1: return 'one';
//       case 2: return 'two';
//       case 3: return 'three';
//       case 4: return 'four';
//       case 5: return 'five';
//       case 6: return 'six';
//       case 7: return 'seven';
//       case 8: return 'eight';
//       case 9: return 'nine';
//       default: return 'zero';
//     }
//   };

//   const getNumberName = (num) => {
//     const numberNames = {
//       1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
//       6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
//       11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
//       16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
//       21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
//       26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
//       31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
//       36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
//       41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
//       46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
//       51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
//       56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
//       61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
//       66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
//       71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
//       76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
//       81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
//       86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety'
//     };
    
//     return numberNames[num] || num.toString();
//   };

//   const renderNumberGrid = () => {
//     const rows = [];
    
//     // Create rows of 10 numbers each
//     for (let row = 0; row < 9; row++) {
//       const rowNumbers = [];
//       for (let col = 1; col <= 10; col++) {
//         const number = row * 10 + col;
//         const isCalled = calledNumbers.includes(number);
//         const isActive = activeNumber === number;
        
//         rowNumbers.push(
//           <TouchableOpacity
//             key={number}
//             style={[
//               styles.numberCell,
//               isCalled && styles.calledNumberCell,
//               isActive && styles.activeNumberCell,
//             ]}
//             onPress={() => speakNumber(number)}
//             disabled={!isCalled && !isActive}
//             activeOpacity={isCalled ? 0.7 : 1}
//           >
//             <Text style={[
//               styles.numberText,
//               isCalled && styles.calledNumberText,
//               isActive && styles.activeNumberText,
//             ]}>
//               {number}
//             </Text>
//             {isActive && (
//               <Animated.View 
//                 style={[
//                   styles.pulseRing,
//                   {
//                     transform: [{ scale: pulseAnim }],
//                     opacity: pulseAnim.interpolate({
//                       inputRange: [1, 1.1],
//                       outputRange: [0.3, 0]
//                     })
//                   }
//                 ]} 
//               />
//             )}
//           </TouchableOpacity>
//         );
//       }
      
//       rows.push(
//         <View key={row} style={styles.numberRow}>
//           {rowNumbers}
//         </View>
//       );
//     }

//     return (
//       <View style={styles.numberGrid}>
//         {rows}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={ACCENT_COLOR} />
//         <Text style={styles.loadingText}>Initializing TTS...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <View style={styles.headerTop}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
//             </TouchableOpacity>
            
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.headerTitle}>Called Numbers</Text>
//               <Text style={styles.gameCode}>
//                 {calledNumbers.length}/90 Numbers Called
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={styles.container}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* All Numbers Grid Section */}
//           <View style={styles.numbersSection}>
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionTitleContainer}>
//                 <Ionicons name="grid" size={18} color={ACCENT_COLOR} />
//                 <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
//               </View>
//               <View style={styles.sectionBadge}>
//                 <Text style={styles.sectionBadgeText}>
//                   {calledNumbers.length}/90
//                 </Text>
//               </View>
//             </View>
            
//             {renderNumberGrid()}
//           </View>

//           {/* Bottom Space */}
//           <View style={styles.bottomSpace} />
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   scrollContent: {
//     padding: 10,
//   },
//   // Header Styles
//   header: {
//     backgroundColor: SECONDARY_COLOR,
//     paddingTop: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     borderBottomWidth: 2,
//     borderBottomColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   headerContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 10,
//   },
//   headerTop: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   backButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: DARK_BLUE,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: TEXT_LIGHT,
//     letterSpacing: -0.5,
//   },
//   gameCode: {
//     fontSize: 13,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   // Numbers Section
//   numbersSection: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//     marginTop: 5,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionTitleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
//   },
//   sectionBadge: {
//     backgroundColor: ACCENT_COLOR,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//   },
//   sectionBadgeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: DARK_BLUE,
//   },
//   // Number Grid
//   numberGrid: {
//     gap: 4,
//   },
//   numberRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 4,
//     marginBottom: 4,
//   },
//   numberCell: {
//     width: CELL_SIZE,
//     height: CELL_SIZE,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: DARK_BLUE,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   calledNumberCell: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: ACCENT_COLOR,
//   },
//   activeNumberCell: {
//     backgroundColor: ACTIVE_ORANGE,
//     borderColor: ACTIVE_ORANGE,
//     zIndex: 10,
//   },
//   numberText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: TEXT_LIGHT,
//   },
//   calledNumberText: {
//     color: DARK_BLUE,
//     fontWeight: "700",
//   },
//   activeNumberText: {
//     color: WHITE,
//     fontWeight: "800",
//   },
//   pulseRing: {
//     position: 'absolute',
//     width: CELL_SIZE,
//     height: CELL_SIZE,
//     borderRadius: 6,
//     backgroundColor: ACTIVE_ORANGE,
//     zIndex: 9,
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: PRIMARY_COLOR,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: TEXT_LIGHT,
//   },
// });

// export default UserCalledNumbers;




import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tts from "react-native-tts";

const { width } = Dimensions.get("window");
// Calculate size based on 10 items per row with proper spacing
const CELL_SIZE = Math.min((width - 40) / 10 - 4, 36); // Reduced padding and size

// Updated color scheme matching Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";
const SUCCESS_COLOR = "#4CAF50"; // Green for success states
const ERROR_COLOR = "#E74C3C"; // Red for errors
const ACTIVE_ORANGE = "#ff9800"; // Orange for active state

const UserCalledNumbers = ({ navigation, route }) => {
  const { calledNumbers } = route.params;
  const [voiceType, setVoiceType] = useState('female');
  const [speaking, setSpeaking] = useState(false);
  const [activeNumber, setActiveNumber] = useState(null);
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Initialize TTS
  useEffect(() => {
    initializeTTS();
    
    return () => {
      Tts.stop();
    };
  }, []);

  const initializeTTS = async () => {
    try {
      // Initialize TTS
      await Tts.setDefaultLanguage('en-US');
      
      // Load voice preference
      const savedVoice = await AsyncStorage.getItem('voiceType');
      if (savedVoice) {
        setVoiceType(savedVoice);
        await updateVoiceSettings(savedVoice);
      } else {
        await updateVoiceSettings('female');
      }
      
      // Get available voices
      const voices = await Tts.voices();
      console.log('Available voices:', voices);
      
      setTtsInitialized(true);
      setLoading(false);
    } catch (error) {
      console.log("Error initializing TTS:", error);
      setTtsInitialized(true); // Still set as initialized even if voice selection fails
      setLoading(false);
    }
  };

  const updateVoiceSettings = async (type) => {
    try {
      if (type === 'male') {
        await Tts.setDefaultRate(0.75);
        await Tts.setDefaultPitch(0.8);
        
        // Get available voices and set male voice if available
        const voices = await Tts.voices();
        if (voices && voices.length > 0) {
          const maleVoices = voices.filter(v => 
            v.name.toLowerCase().includes('male') || 
            v.name.toLowerCase().includes('man') ||
            v.language.includes('en') && (v.name.includes('Male') || v.name.includes('male'))
          );
          if (maleVoices.length > 0) {
            await Tts.setDefaultVoice(maleVoices[0].id);
          }
        }
      } else {
        await Tts.setDefaultRate(0.85);
        await Tts.setDefaultPitch(1.1);
        
        // Get available voices and set female voice if available
        const voices = await Tts.voices();
        if (voices && voices.length > 0) {
          const femaleVoices = voices.filter(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('woman') ||
            v.language.includes('en') && (v.name.includes('Female') || v.name.includes('female'))
          );
          if (femaleVoices.length > 0) {
            await Tts.setDefaultVoice(femaleVoices[0].id);
          }
        }
      }
    } catch (error) {
      console.log("Error updating voice settings:", error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const speakText = async (text, options = {}) => {
    if (!ttsInitialized) return;
    
    try {
      // Stop any ongoing speech
      await Tts.stop();
      
      // Add slight delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Speak the text
      await Tts.speak(text, {
        rate: voiceType === 'male' ? 0.75 : 0.85,
        pitch: voiceType === 'male' ? 0.8 : 1.1,
        ...options
      });
    } catch (error) {
      console.log("Error speaking text:", error);
    }
  };

  const speakNumber = async (number) => {
    if (speaking) {
      Tts.stop();
      setSpeaking(false);
      setActiveNumber(null);
      stopPulseAnimation();
      return;
    }

    Tts.stop();
    setSpeaking(true);
    setActiveNumber(number);
    startPulseAnimation();

    const numStr = number.toString();
    
    if (numStr.length === 1) {
      const digitWord = getSingleDigitWord(number);
      const speechText = `Single digit ${digitWord}`;
      
      await speakText(speechText);
      
      // Reset speaking state when done
      setTimeout(() => {
        setSpeaking(false);
        setActiveNumber(null);
        stopPulseAnimation();
      }, 1000);
      
      return;
    }
    
    const singleDigits = numStr.split('').map(digit => {
      switch(digit) {
        case '0': return 'zero';
        case '1': return 'one';
        case '2': return 'two';
        case '3': return 'three';
        case '4': return 'four';
        case '5': return 'five';
        case '6': return 'six';
        case '7': return 'seven';
        case '8': return 'eight';
        case '9': return 'nine';
        default: return digit;
      }
    }).join(' ');
    
    const fullNumberName = getNumberName(number);
    
    const digitsSpeechText = `Number ${singleDigits}`;
    
    try {
      await speakText(digitsSpeechText);
      
      // Wait a moment before speaking the full name
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Speak the full number name
      await speakText(fullNumberName, {
        pitch: voiceType === 'male' ? 0.9 : 1.1,
        rate: 0.9,
      });
      
    } catch (error) {
      console.log("Error speaking number:", error);
    } finally {
      setSpeaking(false);
      setActiveNumber(null);
      stopPulseAnimation();
    }
  };

  const getSingleDigitWord = (num) => {
    switch(num) {
      case 1: return 'one';
      case 2: return 'two';
      case 3: return 'three';
      case 4: return 'four';
      case 5: return 'five';
      case 6: return 'six';
      case 7: return 'seven';
      case 8: return 'eight';
      case 9: return 'nine';
      default: return 'zero';
    }
  };

  const getNumberName = (num) => {
    const numberNames = {
      1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
      6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
      11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
      16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
      21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
      26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
      31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
      36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
      41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
      46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
      51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
      56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
      61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
      66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
      71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
      76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
      81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
      86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety'
    };
    
    return numberNames[num] || num.toString();
  };

  const renderNumberGrid = () => {
    const rows = [];
    
    // Create rows of 10 numbers each
    for (let row = 0; row < 9; row++) {
      const rowNumbers = [];
      for (let col = 1; col <= 10; col++) {
        const number = row * 10 + col;
        const isCalled = calledNumbers.includes(number);
        const isActive = activeNumber === number;
        
        rowNumbers.push(
          <TouchableOpacity
            key={number}
            style={[
              styles.numberCell,
              isCalled && styles.calledNumberCell,
              isActive && styles.activeNumberCell,
            ]}
            onPress={() => speakNumber(number)}
            disabled={!isCalled && !isActive}
            activeOpacity={isCalled ? 0.7 : 1}
          >
            <Text style={[
              styles.numberText,
              isCalled && styles.calledNumberText,
              isActive && styles.activeNumberText,
            ]}>
              {number}
            </Text>
            {isActive && (
              <Animated.View 
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.3, 0]
                    })
                  }
                ]} 
              />
            )}
          </TouchableOpacity>
        );
      }
      
      rows.push(
        <View key={row} style={styles.numberRow}>
          {rowNumbers}
        </View>
      );
    }

    return (
      <View style={styles.numberGrid}>
        {rows}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Initializing TTS...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={WHITE} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Called Numbers</Text>
              <Text style={styles.gameCode}>
                {calledNumbers.length}/90 Numbers Called
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* All Numbers Grid Section */}
          <View style={styles.numbersSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="grid" size={18} color={ACCENT_COLOR} />
                <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>
                  {calledNumbers.length}/90
                </Text>
              </View>
            </View>
            
            {renderNumberGrid()}
          </View>

          {/* Bottom Space */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContent: {
    padding: 10,
  },
  // Header Styles
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.5,
  },
  gameCode: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
  },
  // Numbers Section
  numbersSection: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  sectionBadge: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: WHITE,
  },
  // Number Grid
  numberGrid: {
    gap: 4,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 4,
  },
  numberCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
    overflow: 'hidden',
  },
  calledNumberCell: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  activeNumberCell: {
    backgroundColor: ACTIVE_ORANGE,
    borderColor: ACTIVE_ORANGE,
    zIndex: 10,
  },
  numberText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  calledNumberText: {
    color: WHITE,
    fontWeight: "700",
  },
  activeNumberText: {
    color: WHITE,
    fontWeight: "800",
  },
  pulseRing: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    backgroundColor: ACTIVE_ORANGE,
    zIndex: 9,
  },
  bottomSpace: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: TEXT_LIGHT,
  },
});

export default UserCalledNumbers;