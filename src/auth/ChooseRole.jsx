// import React, { useRef, useEffect } from "react";
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Animated, 
//   Dimensions,
//   SafeAreaView,
//   StatusBar
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// // Color scheme from Faqs component
// const PRIMARY_COLOR = "#005F6A";
// const SECONDARY_COLOR = "#004B54";
// const ACCENT_COLOR = "#D4AF37";
// const LIGHT_ACCENT = "#F5E6A8";
// const MUTED_GOLD = "#E6D8A2";
// const DARK_TEAL = "#00343A";
// const WHITE = "#FFFFFF";

// const ChooseRole = ({ navigation }) => {
//   // Animation references
//   const fadeIn = useRef(new Animated.Value(0)).current;
//   const slideUp = useRef(new Animated.Value(30)).current;
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Initial entrance animations
//     Animated.parallel([
//       Animated.timing(fadeIn, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideUp, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Start background animations
//     startBackgroundAnimations();
//   }, []);

//   const startBackgroundAnimations = () => {
//     // First floating animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim1, {
//           toValue: 1,
//           duration: 4000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim1, {
//           toValue: 0,
//           duration: 4000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Second floating animation (different timing)
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim2, {
//           toValue: 1,
//           duration: 5000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim2, {
//           toValue: 0,
//           duration: 5000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Pulse animation for subtle effect
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.02,
//           duration: 3000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 3000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Slow rotation animation
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 20000,
//         useNativeDriver: true,
//       })
//     ).start();
//   };

//   // Interpolations for animations
//   const translateY1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15]
//   });

//   const translateY2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -10]
//   });

//   const rotate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
//       <View style={styles.container}>
//         {/* Background with Animations */}
//         <View style={styles.background}>
//           {/* Animated floating elements */}
//           <Animated.View 
//             style={[
//               styles.floatingElement1, 
//               { 
//                 transform: [
//                   { translateY: translateY1 },
//                   { translateX: translateY2 }
//                 ] 
//               }
//             ]} 
//           />
//           <Animated.View 
//             style={[
//               styles.floatingElement2, 
//               { 
//                 transform: [
//                   { translateY: translateY2 },
//                   { translateX: translateY1 }
//                 ] 
//             }
//             ]} 
//           />
          
//           {/* Center accent element */}
//           <Animated.View 
//             style={[
//               styles.centerElement,
//               { 
//                 transform: [{ rotate: rotate }],
//                 opacity: pulseAnim
//               }
//             ]} 
//           />
          
//           {/* Background gradient overlay */}
//           <View style={styles.backgroundGradient} />
//         </View>

//         <Animated.View 
//           style={[
//             styles.content,
//             {
//               opacity: fadeIn,
//               transform: [{ translateY: slideUp }]
//             }
//           ]}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.appName}>Tambola Timez</Text>
//             <Text style={styles.tagline}>Choose Your Role</Text>
//           </View>

//           {/* Card */}
//           <View style={styles.card}>
//             <Text style={styles.title}>Select Account Type</Text>
            
//             {/* Player Option */}
//             <TouchableOpacity
//               style={styles.option}
//               onPress={() => navigation.navigate("MobileVerify", { role: "user" })}
//               activeOpacity={0.8}
//             >
//               <View style={styles.optionIconContainer}>
//                 <Ionicons name="person" size={28} color={ACCENT_COLOR} />
//               </View>
//               <View style={styles.optionText}>
//                 <Text style={styles.optionTitle}>Player</Text>
//                 <Text style={styles.optionSub}>Play games & win prizes</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={24} color={ACCENT_COLOR} />
//             </TouchableOpacity>

//             {/* Divider */}
//             <View style={styles.divider} />

//             {/* Host Option */}
//             <TouchableOpacity
//               style={styles.option}
//               onPress={() => navigation.navigate("MobileVerify", { role: "host" })}
//               activeOpacity={0.8}
//             >
//               <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
//                 <Ionicons name="mic" size={28} color={ACCENT_COLOR} />
//               </View>
//               <View style={styles.optionText}>
//                 <Text style={styles.optionTitle}>Host</Text>
//                 <Text style={styles.optionSub}>Create & manage games</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={24} color={ACCENT_COLOR} />
//             </TouchableOpacity>
//           </View>

//           {/* Login Link */}
//           <TouchableOpacity 
//             style={styles.loginBtn}
//             onPress={() => navigation.navigate("Login")}
//             activeOpacity={0.7}
//           >
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <Text style={styles.loginLink}>Sign In</Text>
//           </TouchableOpacity>

//           {/* Bottom Info */}
//           <View style={styles.bottomInfo}>
//             <Text style={styles.infoText}>
//               Choose Player to participate in games, or Host to create and manage your own games
//             </Text>
//             <Text style={styles.versionText}>Tambola Timez v1.0</Text>
//           </View>
//         </Animated.View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChooseRole;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   background: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//     overflow: 'hidden',
//   },
//   // Floating elements with teal/gold colors
//   floatingElement1: {
//     position: 'absolute',
//     top: 60,
//     left: SCREEN_WIDTH * 0.1,
//     width: 100,
//     height: 40,
//     borderRadius: 50,
//     backgroundColor: 'rgba(0, 75, 84, 0.3)',
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.2)',
//   },
//   floatingElement2: {
//     position: 'absolute',
//     top: 100,
//     right: SCREEN_WIDTH * 0.15,
//     width: 80,
//     height: 30,
//     borderRadius: 40,
//     backgroundColor: 'rgba(212, 175, 55, 0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   // Center element
//   centerElement: {
//     position: 'absolute',
//     top: 50,
//     right: 40,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//   },
//   // Background gradient
//   backgroundGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: SCREEN_HEIGHT * 0.4,
//     backgroundColor: 'rgba(0, 95, 106, 0.2)',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//     justifyContent: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   appName: {
//     fontSize: 34,
//     fontWeight: '800',
//     color: LIGHT_ACCENT,
//     marginBottom: 8,
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   tagline: {
//     fontSize: 18,
//     color: MUTED_GOLD,
//     fontWeight: '500',
//     opacity: 0.9,
//   },
//   card: {
//     backgroundColor: SECONDARY_COLOR,
//     borderRadius: 20,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 10,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: LIGHT_ACCENT,
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     backgroundColor: DARK_TEAL,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.3)',
//     marginBottom: 12,
//   },
//   optionIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     backgroundColor: 'rgba(212, 175, 55, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.2)',
//   },
//   optionText: {
//     flex: 1,
//   },
//   optionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: LIGHT_ACCENT,
//     marginBottom: 4,
//   },
//   optionSub: {
//     fontSize: 14,
//     color: MUTED_GOLD,
//     opacity: 0.9,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: 'rgba(212, 175, 55, 0.3)',
//     marginVertical: 16,
//     marginHorizontal: 12,
//   },
//   loginBtn: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     marginTop: 24,
//   },
//   loginText: {
//     color: MUTED_GOLD,
//     fontSize: 15,
//   },
//   loginLink: {
//     color: ACCENT_COLOR,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   bottomInfo: {
//     marginTop: 30,
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   infoText: {
//     color: MUTED_GOLD,
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 12,
//     opacity: 0.8,
//   },
//   versionText: {
//     color: MUTED_GOLD,
//     fontSize: 12,
//     opacity: 0.6,
//   },
// });




import React, { useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Updated color scheme matching Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";

const ChooseRole = ({ navigation }) => {
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
            <Text style={styles.tagline}>Choose Your Role</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Select Account Type</Text>
            
            {/* Player Option */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate("MobileVerify", { role: "user" })}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="person" size={28} color={ACCENT_COLOR} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Player</Text>
                <Text style={styles.optionSub}>Play games & win prizes</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Host Option */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate("MobileVerify", { role: "host" })}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                <Ionicons name="mic" size={28} color={ACCENT_COLOR} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Host</Text>
                <Text style={styles.optionSub}>Create & manage games</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>Already have an account? </Text>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <Text style={styles.infoText}>
              Choose Player to participate in games, or Host to create and manage your own games
            </Text>
            <Text style={styles.versionText}>Tambola Timez v1.0</Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ChooseRole;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
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
  // Floating elements with blue/orange colors
  floatingElement1: {
    position: 'absolute',
    top: 60,
    left: SCREEN_WIDTH * 0.1,
    width: 100,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  floatingElement2: {
    position: 'absolute',
    top: 100,
    right: SCREEN_WIDTH * 0.15,
    width: 80,
    height: 30,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
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
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  // Background gradient
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
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
    marginBottom: 40,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: PRIMARY_COLOR,
    marginBottom: 8,
    textShadowColor: 'rgba(79, 172, 254, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: TEXT_LIGHT,
    fontWeight: '500',
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginBottom: 12,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  optionSub: {
    fontSize: 14,
    color: TEXT_LIGHT,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 16,
    marginHorizontal: 12,
  },
  loginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 24,
  },
  loginText: {
    color: TEXT_LIGHT,
    fontSize: 15,
  },
  loginLink: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: '600',
  },
  bottomInfo: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    color: TEXT_LIGHT,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    color: TEXT_LIGHT,
    fontSize: 12,
    opacity: 0.6,
  },
});