// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   Modal,
// //   ActivityIndicator,
// //   Alert,
// //   TextInput,
// //   RefreshControl,
// //   SafeAreaView,
// //   Dimensions,
// //   AppState,
// //   Linking,
// //   Platform,
// //   Animated,
// //   Easing,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";

// // // For React Native CLI, use react-native-vector-icons
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// // import Feather from "react-native-vector-icons/Feather";

// // const { width } = Dimensions.get("window");

// // // Updated color scheme matching Game component - Mango Yellow theme
// // const PRIMARY_COLOR = "#02658D"; // Main background color (blue)
// // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // const ACCENT_COLOR = "#f0ae13"; // Mango yellow (replaces gold)
// // const LIGHT_ACCENT = "#FFECB3"; // Very light mango
// // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// // const WHITE = "#FFFFFF";
// // const SUCCESS_COLOR = "#f0ae13"; // Yellow for success states
// // const ERROR_COLOR = "#E74C3C"; // Red for errors

// // const GameDetails = ({ route, navigation }) => {
// //   const { game } = route.params;
// //   const [loading, setLoading] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [ticketModalVisible, setTicketModalVisible] = useState(false);
// //   const [ticketQuantity, setTicketQuantity] = useState(1);
// //   const [ticketMessage, setTicketMessage] = useState("");
// //   const [requestLoading, setRequestLoading] = useState(false);
// //   const [myTicketCount, setMyTicketCount] = useState(0);
// //   const [myRequestCount, setMyRequestCount] = useState(0);
// //   const [gameStatus, setGameStatus] = useState(null);
// //   const [callingStatus, setCallingStatus] = useState(null);
// //   const [calledNumbers, setCalledNumbers] = useState([]);
// //   const [timer, setTimer] = useState(0);
// //   const [joiningRoom, setJoiningRoom] = useState(false);
// //   const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
// //   const [totalTicketsInGame, setTotalTicketsInGame] = useState(0);
  
// //   // Polling state
// //   const [isPolling, setIsPolling] = useState(true);
// //   const pollingIntervalRef = useRef(null);
// //   const appState = useRef(AppState.currentState);

// //   // Animation values
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const rotateAnim = useRef(new Animated.Value(0)).current;
// //   const shineAnim = useRef(new Animated.Value(0)).current;

// //   // Toast state
// //   const [toast, setToast] = useState({ visible: false, message: "", type: "" });

// //   const MAX_TICKETS_PER_USER = 4;
  
// //   // Polling configuration
// //   const POLLING_INTERVAL = 4000;
// //   const POLLING_INTERVAL_BACKGROUND = 30000;
// //   const MAX_POLLING_DURATION = 300000;

// //   const getWhatsAppNumber = () => {
// //     if (game.host_mobile) {
// //       return game.host_mobile;
// //     }
// //     if (game.user?.mobile) {
// //       return game.user.mobile;
// //     }
// //     return "8007395749";
// //   };

// //   const createWhatsAppMessage = () => {
// //     const gameDate = new Date(game.game_date).toLocaleDateString("en-US", {
// //       weekday: "short",
// //       month: "short",
// //       day: "numeric",
// //     });
    
// //     const gameType = game.ticket_type === "paid" ? "Paid Game" : "Free Game";
// //     const ticketCost = game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE";
// //     const totalAmount = game.ticket_type === "paid" ? `₹${game.ticket_cost * ticketQuantity}` : "FREE";
// //     const hostName = game.user?.name || "Game Host";
    
// //     return `🎯 *TAMBOOLA TICKET REQUEST* 🎯

// // 🎮 *Game Details:*
// // • Game Name: ${game.game_name}
// // • Game ID: ${game.game_code}
// // • Date: ${gameDate} ${game.game_start_time}
// // • Type: ${gameType} ${ticketCost !== "FREE" ? `(${ticketCost} per ticket)` : ""}
// // • Host: ${hostName}

// // 🎫 *Ticket Request:*
// // • Quantity: ${ticketQuantity} ticket${ticketQuantity > 1 ? "s" : ""}
// // • Total Amount: ${totalAmount}

// // 📝 *Additional Message:*
// // ${ticketMessage || "Please approve my ticket request. Looking forward to the game!"}

// // 💰 *Payment Information:*
// // • UPI ID: ${getWhatsAppNumber()}@ybl
// // • PhonePe/Paytm: ${getWhatsAppNumber()}
// // • Please send payment screenshot with your name

// // ✅ *Confirmation Required:*
// // Please confirm my ticket allocation and share payment details if needed.

// // Thank you! 🙏
// // Looking forward to playing Tambola! 🎲🎉`;
// //   };

// //   const redirectToWhatsApp = () => {
// //     const whatsappNumber = getWhatsAppNumber();
// //     const message = createWhatsAppMessage();
// //     const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
// //     Linking.canOpenURL(whatsappUrl)
// //       .then((supported) => {
// //         if (supported) {
// //           return Linking.openURL(whatsappUrl);
// //         } else {
// //           const webWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
// //           return Linking.openURL(webWhatsappUrl);
// //         }
// //       })
// //       .catch((error) => {
// //         console.log("Error opening WhatsApp:", error);
// //         Alert.alert(
// //           "Error",
// //           "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
// //           [{ text: "OK" }]
// //         );
// //       });
// //   };

// //   useEffect(() => {
// //     startAnimations();
// //     fetchAllData();
// //     startPolling();
    
// //     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
// //     const autoStopTimer = setTimeout(() => {
// //       if (isPolling) {
// //         stopPolling();
// //       }
// //     }, MAX_POLLING_DURATION);

// //     const unsubscribe = navigation.addListener('focus', () => {
// //       fetchAllData();
// //       setJoiningRoom(false);
// //       setHasJoinedRoom(false);
// //     });

// //     return () => {
// //       stopPolling();
// //       subscription.remove();
// //       clearTimeout(autoStopTimer);
// //       unsubscribe();
// //     };
// //   }, []);

// //   const startAnimations = () => {
// //     // First floating animation
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

// //     // Second floating animation
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
// //           toValue: 1.02,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Slow rotation animation
// //     Animated.loop(
// //       Animated.timing(rotateAnim, {
// //         toValue: 1,
// //         duration: 20000,
// //         easing: Easing.linear,
// //         useNativeDriver: true,
// //       })
// //     ).start();

// //     // Shine animation
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(shineAnim, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(shineAnim, {
// //           toValue: 0,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   };

// //   // Interpolations for animations
// //   const translateY1 = floatAnim1.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, 15]
// //   });

// //   const translateY2 = floatAnim2.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, -10]
// //   });

// //   const rotate = rotateAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['0deg', '360deg']
// //   });

// //   const shineTranslateX = shineAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [-100, width + 100]
// //   });

// //   const fetchAllData = async () => {
// //     try {
// //       setLoading(true);
// //       await Promise.all([
// //         fetchGameStatus(),
// //         fetchMyTicketCount(),
// //         fetchMyRequestCount(),
// //         fetchTotalTicketsInGame()
// //       ]);
// //     } catch (error) {
// //       console.log("Error fetching all data:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAppStateChange = (nextAppState) => {
// //     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
// //       adjustPollingForBackground();
// //     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
// //       adjustPollingForForeground();
// //     }
// //     appState.current = nextAppState;
// //   };

// //   const startPolling = () => {
// //     if (pollingIntervalRef.current) {
// //       clearInterval(pollingIntervalRef.current);
// //     }
// //     setIsPolling(true);
// //     pollingIntervalRef.current = setInterval(() => {
// //       fetchGameStatusSilently();
// //     }, POLLING_INTERVAL);
// //   };

// //   const stopPolling = () => {
// //     setIsPolling(false);
// //     if (pollingIntervalRef.current) {
// //       clearInterval(pollingIntervalRef.current);
// //       pollingIntervalRef.current = null;
// //     }
// //   };

// //   const adjustPollingForBackground = () => {
// //     if (!pollingIntervalRef.current) return;
// //     clearInterval(pollingIntervalRef.current);
// //     pollingIntervalRef.current = setInterval(() => {
// //       fetchGameStatusSilently();
// //     }, POLLING_INTERVAL_BACKGROUND);
// //   };

// //   const adjustPollingForForeground = () => {
// //     if (!pollingIntervalRef.current) return;
// //     clearInterval(pollingIntervalRef.current);
// //     pollingIntervalRef.current = setInterval(() => {
// //       fetchGameStatusSilently();
// //     }, POLLING_INTERVAL);
// //   };

// //   const showToast = (message, type = "success") => {
// //     setToast({ visible: true, message, type });
// //   };

// //   const hideToast = () => {
// //     setToast({ ...toast, visible: false });
// //   };

// //   const Toast = () => {
// //     if (!toast.visible) return null;
    
// //     const backgroundColor = toast.type === "success" ? ACCENT_COLOR : ERROR_COLOR;
    
// //     useEffect(() => {
// //       const timer = setTimeout(() => {
// //         hideToast();
// //       }, 3000);
// //       return () => clearTimeout(timer);
// //     }, []);

// //     return (
// //       <View style={[styles.toast, { backgroundColor }]}>
// //         <Ionicons 
// //           name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
// //           size={20} 
// //           color={SECONDARY_COLOR} 
// //         />
// //         <Text style={styles.toastText}>{toast.message}</Text>
// //       </View>
// //     );
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     Promise.all([
// //       fetchGameStatus(), 
// //       fetchMyTicketCount(), 
// //       fetchMyRequestCount(),
// //       fetchTotalTicketsInGame()
// //     ]).finally(() =>
// //       setRefreshing(false)
// //     );
// //   }, []);

// //   const fetchGameStatus = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const response = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling/status`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         const data = response.data.data;
// //         setGameStatus(data.game);
// //         setCallingStatus(data.calling);
// //         setCalledNumbers(data.numbers?.called_numbers || []);
        
// //         if (data.calling?.is_running && !data.calling?.is_paused) {
// //           setTimer(data.calling?.interval_seconds || 60);
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Error fetching game status:", error);
// //     }
// //   };

// //   const fetchGameStatusSilently = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
      
// //       const response = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling/status`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         const data = response.data.data;
        
// //         const hasGameChanged = JSON.stringify(gameStatus) !== JSON.stringify(data.game);
// //         const hasCallingChanged = JSON.stringify(callingStatus) !== JSON.stringify(data.calling);
// //         const hasNumbersChanged = JSON.stringify(calledNumbers) !== JSON.stringify(data.numbers?.called_numbers || []);
        
// //         if (hasGameChanged || hasCallingChanged || hasNumbersChanged) {
// //           setGameStatus(data.game);
// //           setCallingStatus(data.calling);
// //           setCalledNumbers(data.numbers?.called_numbers || []);
          
// //           if (data.calling?.is_running && !data.calling?.is_paused) {
// //             setTimer(data.calling?.interval_seconds || 60);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Silent fetch error:", error.message);
// //     }
// //   };

// //   const fetchMyTicketCount = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         const gameTickets = res.data.tickets.data.filter(
// //           (ticket) => ticket.game_id == game.id
// //         );
// //         setMyTicketCount(gameTickets.length);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching ticket count:", error);
// //     }
// //   };

// //   const fetchMyRequestCount = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         const gameRequests = res.data.ticket_requests.data.filter(
// //           (request) => request.game_id === game.id
// //         );
// //         setMyRequestCount(gameRequests.length);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching request count:", error);
// //     }
// //   };

// //   const fetchTotalTicketsInGame = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
      
// //       const ticketsRes = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       const requestsRes = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (ticketsRes.data.success && requestsRes.data.success) {
// //         const allocatedTickets = ticketsRes.data.tickets.data.filter(
// //           (ticket) => ticket.game_id == game.id
// //         ).length;
        
// //         const pendingRequests = requestsRes.data.ticket_requests.data.filter(
// //           (request) => 
// //             request.game_id == game.id && 
// //             request.status === 'pending'
// //         ).length;
        
// //         const total = allocatedTickets + pendingRequests;
// //         setTotalTicketsInGame(total);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching total tickets:", error);
// //     }
// //   };

// //   const updateGameRoomStatus = async () => {
// //     try {
// //       setJoiningRoom(true);
// //       const token = await AsyncStorage.getItem("token");
      
// //       const response = await axios.post(
// //         `https://tambolatime.co.in/public/api/user/game-room/${game.id}/update-status`,
// //         {
// //           is_active: true
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         setHasJoinedRoom(true);
// //         showToast("Joined game room successfully!", "success");
// //         navigation.navigate("UserGameRoom", { 
// //           gameId: game.id,
// //           gameName: game.game_name,
// //           gameStatus: gameStatus?.status
// //         });
// //         setJoiningRoom(false);
// //       } else {
// //         showToast(response.data.message || "Failed to join game room", "error");
// //         setJoiningRoom(false);
// //       }
// //     } catch (error) {
// //       console.log("Error updating game room status:", error.response?.data || error.message);
// //       showToast(
// //         error.response?.data?.message || "Failed to join game room. Please try again.",
// //         "error"
// //       );
// //       setJoiningRoom(false);
// //     }
// //   };

// //   const handleRequestTickets = async () => {
// //     if (hasReachedTicketLimit()) {
// //       showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
// //       return;
// //     }

// //     const remaining = getRemainingTickets();
// //     if (ticketQuantity > remaining) {
// //       showToast(`You can only request up to ${remaining} more ticket(s)`, "error");
// //       return;
// //     }

// //     if (ticketQuantity < 1 || ticketQuantity > 4) {
// //       showToast("Ticket quantity must be between 1 and 4", "error");
// //       return;
// //     }

// //     setRequestLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const response = await axios.post(
// //         "https://tambolatime.co.in/public/api/user/ticket-requests/send",
// //         {
// //           game_id: game.id,
// //           ticket_quantity: ticketQuantity,
// //           message:
// //             ticketMessage || `Request for ${ticketQuantity} ticket(s)`,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       const isSuccess = 
// //         response.data.success === true || 
// //         response.data.status === true || 
// //         response.data.message?.toLowerCase().includes("success");

// //       if (isSuccess) {
// //         const whatsappNumber = getWhatsAppNumber();
// //         showToast(`Ticket request submitted! Opening WhatsApp to ${whatsappNumber}...`, "success");
        
// //         setTicketModalVisible(false);
// //         setTicketQuantity(1);
// //         setTicketMessage("");
        
// //         fetchMyRequestCount();
// //         fetchMyTicketCount();
// //         fetchTotalTicketsInGame();
        
// //         setTimeout(() => {
// //           redirectToWhatsApp();
// //         }, 1000);
        
// //         setTimeout(() => {
// //           navigation.navigate("TicketRequestsScreen", { 
// //             gameId: game.id,
// //             gameName: game.game_name 
// //           });
// //         }, 4000);
// //       } else {
// //         const errorMessage = response.data.message || 
// //                             response.data.error || 
// //                             "Failed to submit request";
// //         showToast(errorMessage, "error");
// //       }
// //     } catch (error) {
// //       console.log("Request error:", error.response?.data || error.message);
      
// //       let errorMessage = "Failed to submit ticket request. Please try again.";
      
// //       if (error.response) {
// //         errorMessage = error.response.data?.message || 
// //                       error.response.data?.error || 
// //                       `Server error: ${error.response.status}`;
// //       } else if (error.request) {
// //         errorMessage = "No response from server. Please check your connection.";
// //       }
      
// //       showToast(errorMessage, "error");
// //     } finally {
// //       setRequestLoading(false);
// //     }
// //   };

// //   const navigateToTickets = () => {
// //     navigation.navigate("TicketsScreen", { game });
// //   };

// //   const navigateToMyRequests = () => {
// //     navigation.navigate("TicketRequestsScreen", { 
// //       gameId: game.id,
// //       gameName: game.game_name 
// //     });
// //   };

// //   const handleJoinGameRoom = () => {
// //     if (gameStatus?.status === 'scheduled') {
// //       showToast("Game has not started yet!", "info");
// //       return;
// //     }
    
// //     if (hasJoinedRoom) {
// //       navigation.navigate("UserGameRoom", { 
// //         gameId: game.id,
// //         gameName: game.game_name,
// //         gameStatus: gameStatus?.status
// //       });
// //     } else {
// //       updateGameRoomStatus();
// //     }
// //   };

// //   const renderTicketLimitInfo = () => {
// //     const remaining = getRemainingTickets();
// //     const hasLimit = hasReachedTicketLimit();
    
// //     return (
// //       <View style={[
// //         styles.ticketLimitContainer,
// //         hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
// //       ]}>
// //         <View style={styles.ticketLimitIcon}>
// //           <Ionicons 
// //             name={hasLimit ? "alert-circle" : "ticket"} 
// //             size={16} 
// //             color={hasLimit ? ERROR_COLOR : ACCENT_COLOR} 
// //           />
// //         </View>
// //         <View style={styles.ticketLimitInfo}>
// //           <Text style={[
// //             styles.ticketLimitTitle,
// //             hasLimit && styles.ticketLimitTitleReached
// //           ]}>
// //             {hasLimit ? "Ticket Limit Reached" : "Ticket Limit"}
// //           </Text>
// //           <Text style={styles.ticketLimitText}>
// //             {hasLimit 
// //               ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
// //               : `You have ${myTicketCount} allocated + ${myRequestCount} pending = ${totalTicketsInGame}/4 tickets`
// //             }
// //           </Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   const getRemainingTickets = () => {
// //     return MAX_TICKETS_PER_USER - totalTicketsInGame;
// //   };

// //   const hasReachedTicketLimit = () => {
// //     return totalTicketsInGame >= MAX_TICKETS_PER_USER;
// //   };

// //   const canRequestTickets = () => {
// //     const remaining = getRemainingTickets();
// //     return ticketQuantity <= remaining && remaining > 0;
// //   };

// //   const renderBackgroundPatterns = () => (
// //     <View style={styles.backgroundPattern}>
// //       {/* Poker chip animations */}
// //       <Animated.View 
// //         style={[
// //           styles.pokerChip1, 
// //           { 
// //             transform: [
// //               { translateY: translateY1 },
// //               { translateX: translateY2 }
// //             ] 
// //           }
// //         ]} 
// //       />
// //       <Animated.View 
// //         style={[
// //           styles.pokerChip2, 
// //           { 
// //             transform: [
// //               { translateY: translateY2 },
// //               { translateX: translateY1 }
// //             ] 
// //           }
// //         ]} 
// //       />
      
// //       {/* Animated shine effect */}
// //       <Animated.View 
// //         style={[
// //           styles.shineEffect,
// //           { 
// //             transform: [{ translateX: shineTranslateX }],
// //             opacity: shineAnim
// //           }
// //         ]} 
// //       />
      
// //       {/* Yellow gradient overlay */}
// //       <View style={styles.yellowGradient} />
      
// //       {/* Blue gradient overlay */}
// //       <View style={styles.blueGradient} />
// //     </View>
// //   );

// //   const renderHeaderPatterns = () => (
// //     <View style={styles.headerPattern}>
// //       <Animated.View 
// //         style={[
// //           styles.headerShine,
// //           { transform: [{ translateX: shineTranslateX }] }
// //         ]} 
// //       />
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <Toast />
// //       {renderBackgroundPatterns()}
      
// //       <ScrollView
// //         style={styles.container}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             tintColor={ACCENT_COLOR}
// //             colors={[ACCENT_COLOR]}
// //           />
// //         }
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* HEADER */}
// //         <Animated.View 
// //           style={[
// //             styles.header,
// //             { 
// //               transform: [{ scale: pulseAnim }],
// //               backgroundColor: SECONDARY_COLOR
// //             }
// //           ]}
// //         >
// //           {renderHeaderPatterns()}
          
// //           <View style={styles.headerContent}>
// //             <View style={styles.headerTop}>
// //               <TouchableOpacity
// //                 style={styles.backButton}
// //                 onPress={() => navigation.goBack()}
// //               >
// //                 <Ionicons name="arrow-back" size={24} color={TEXT_LIGHT} />
// //               </TouchableOpacity>
              
// //               <View style={styles.headerTextContainer}>
// //                 <Text style={styles.gameName} numberOfLines={2} ellipsizeMode="tail">
// //                   {game.game_name}
// //                 </Text>
// //                 <View style={styles.gameCodeContainer}>
// //                   <MaterialIcons
// //                     name="fingerprint"
// //                     size={14}
// //                     color={LIGHT_ACCENT}
// //                   />
// //                   <Text style={styles.gameCode}>{game.game_code}</Text>
// //                 </View>
// //               </View>
              
// //               <TouchableOpacity
// //                 style={styles.refreshButton}
// //                 onPress={fetchAllData}
// //               >
// //                 <Feather name="refresh-ccw" size={18} color={SECONDARY_COLOR} />
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Animated.View>

// //         <View style={styles.content}>
// //           {/* STATUS CARD */}
// //           <View style={styles.card}>
// //             <View style={styles.cardPattern} />
            
// //             <View style={styles.cardHeader}>
// //               <View style={styles.gameIconContainer}>
// //                 <View style={styles.gameIconWrapper}>
// //                   <MaterialIcons name="confirmation-number" size={32} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View style={styles.cardTitleContainer}>
// //                   <Text style={styles.cardTitle}>
// //                     {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
// //                       ? 'Game Status' 
// //                       : 'Game Schedule'
// //                     }
// //                   </Text>
// //                   <View style={[
// //                     styles.statusBadge,
// //                     { 
// //                       backgroundColor: gameStatus?.status === 'live' 
// //                         ? SUCCESS_COLOR 
// //                         : gameStatus?.status === 'completed'
// //                         ? '#6C757D'
// //                         : ACCENT_COLOR
// //                     }
// //                   ]}>
// //                     <Ionicons 
// //                       name={
// //                         gameStatus?.status === 'live' 
// //                           ? 'radio-button-on' 
// //                           : gameStatus?.status === 'completed'
// //                           ? 'trophy'
// //                           : 'time'
// //                       } 
// //                       size={12} 
// //                       color={SECONDARY_COLOR} 
// //                     />
// //                     <Text style={styles.statusBadgeText}>
// //                       {gameStatus?.status?.toUpperCase() || 'LOADING'}
// //                     </Text>
// //                   </View>
// //                 </View>
// //               </View>
// //             </View>
            
// //             {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
// //               <View>
// //                 <Text style={styles.cardDescription}>
// //                   {gameStatus?.status === 'live'
// //                     ? "The game is now live! Number calling has started."
// //                     : "Game has been completed. You can still view the game room."
// //                   }
// //                 </Text>
// //                 {callingStatus?.is_running ? (
// //                   <View style={styles.statsContainer}>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="megaphone" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {calledNumbers.length}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Called</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="time" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {timer}s
// //                       </Text>
// //                       <Text style={styles.statLabel}>Next Call</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="grid" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {90 - calledNumbers.length}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Remaining</Text>
// //                     </View>
// //                   </View>
// //                 ) : gameStatus?.status === 'completed' ? (
// //                   <View style={styles.statsContainer}>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="checkmark-done" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {calledNumbers.length}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Total Called</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="trophy" size={20} color={LIGHT_ACCENT} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         Completed
// //                       </Text>
// //                       <Text style={styles.statLabel}>Status</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="time" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {game.game_start_time}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Started At</Text>
// //                     </View>
// //                   </View>
// //                 ) : (
// //                   <Text style={styles.waitingText}>
// //                     Number calling will start soon...
// //                   </Text>
// //                 )}
                
// //                 {gameStatus?.status === 'completed' ? (
// //                   <View>
// //                     {/* View Game Room Button */}
// //                     <TouchableOpacity
// //                       style={[styles.primaryButton, styles.viewRoomButton, joiningRoom && styles.buttonDisabled]}
// //                       onPress={handleJoinGameRoom}
// //                       disabled={joiningRoom}
// //                     >
// //                       {joiningRoom ? (
// //                         <ActivityIndicator size="small" color={SECONDARY_COLOR} />
// //                       ) : (
// //                         <>
// //                           <Ionicons name="eye" size={20} color={SECONDARY_COLOR} />
// //                           <Text style={styles.primaryButtonText}>
// //                             {hasJoinedRoom ? "View Game Room" : "View Completed Game"}
// //                           </Text>
// //                         </>
// //                       )}
// //                     </TouchableOpacity>
                    
// //                     {/* Game Results Button - Below View Game Room */}
// //                     <TouchableOpacity
// //                       style={[styles.secondaryButton, styles.resultsButton]}
// //                       onPress={() => navigation.navigate("UserGameResult", { 
// //                         gameId: game.id,
// //                         gameName: game.game_name 
// //                       })}
// //                     >
// //                       <Ionicons name="stats-chart" size={20} color={ACCENT_COLOR} />
// //                       <Text style={styles.secondaryButtonText}>Game Results</Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 ) : (
// //                   <TouchableOpacity
// //                     style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
// //                     onPress={handleJoinGameRoom}
// //                     disabled={joiningRoom}
// //                   >
// //                     {joiningRoom ? (
// //                       <ActivityIndicator size="small" color={SECONDARY_COLOR} />
// //                     ) : (
// //                       <>
// //                         <Ionicons 
// //                           name={hasJoinedRoom ? "enter" : "enter"} 
// //                           size={20} 
// //                           color={SECONDARY_COLOR} 
// //                         />
// //                         <Text style={styles.primaryButtonText}>
// //                           {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
// //                         </Text>
// //                       </>
// //                     )}
// //                   </TouchableOpacity>
// //                 )}
// //               </View>
// //             ) : (
// //               <View>
// //                 <Text style={styles.cardDescription}>
// //                   Game is scheduled to start on {new Date(game.game_date).toLocaleDateString("en-US", {
// //                     weekday: "long",
// //                     month: "long",
// //                     day: "numeric",
// //                     year: "numeric"
// //                   })} at {game.game_start_time}
// //                 </Text>
// //                 <View style={styles.scheduledBadgeContainer}>
// //                   <Ionicons name="calendar" size={20} color={ACCENT_COLOR} />
// //                   <Text style={styles.scheduledBadgeText}>
// //                     Game is Scheduled
// //                   </Text>
// //                 </View>
// //               </View>
// //             )}
// //           </View>

// //           {/* GAME DETAILS CARD */}
// //           <View style={styles.card}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>Game Details</Text>
// //               <Ionicons name="game-controller" size={24} color={ACCENT_COLOR} />
// //             </View>

// //             <View style={styles.detailRow}>
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="calendar" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Date</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {new Date(game.game_date).toLocaleDateString("en-US", {
// //                       weekday: "short",
// //                       month: "short",
// //                       day: "numeric",
// //                     })}
// //                   </Text>
// //                 </View>
// //               </View>
              
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="time" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Time</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {game.game_start_time}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>

// //             <View style={styles.detailRow}>
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <MaterialIcons name="account-balance-wallet" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Prize Pool</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {game.ticket_type === "paid"
// //                       ? `₹${(game.ticket_cost * game.max_players).toLocaleString()}`
// //                       : "Exciting Prizes"}
// //                   </Text>
// //                 </View>
// //               </View>
              
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="person" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Host</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {game.user?.name || 'Tambola Timez'}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>

// //             <View style={styles.detailRow}>
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="call" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Host Contact</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {getWhatsAppNumber()}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>

// //             {renderTicketLimitInfo()}

// //             <View style={styles.myCountContainer}>
// //               <TouchableOpacity
// //                 style={[
// //                   styles.countButton,
// //                   myTicketCount > 0 ? styles.hasCountButton : styles.noCountButton,
// //                 ]}
// //                 onPress={navigateToTickets}
// //               >
// //                 <View style={styles.countIcon}>
// //                   <Ionicons name="ticket" size={20} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View style={styles.countInfo}>
// //                   <Text style={styles.countLabel}>My Tickets</Text>
// //                   <Text style={[
// //                     styles.countValue,
// //                     myTicketCount > 0 ? styles.hasCountValue : styles.noCountValue,
// //                   ]}>
// //                     {myTicketCount > 0
// //                       ? `${myTicketCount} Ticket${myTicketCount > 1 ? "s" : ""}`
// //                       : "No Tickets"}
// //                   </Text>
// //                 </View>
// //                 {myTicketCount > 0 && (
// //                   <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
// //                 )}
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.countButton,
// //                   myRequestCount > 0 ? styles.hasCountButton : styles.noCountButton,
// //                 ]}
// //                 onPress={navigateToMyRequests}
// //               >
// //                 <View style={styles.countIcon}>
// //                   <Ionicons name="list-circle" size={20} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View style={styles.countInfo}>
// //                   <Text style={styles.countLabel}>My Requests</Text>
// //                   <Text style={[
// //                     styles.countValue,
// //                     myRequestCount > 0 ? styles.hasCountValue : styles.noCountValue,
// //                   ]}>
// //                     {myRequestCount > 0
// //                       ? `${myRequestCount} Request${myRequestCount > 1 ? "s" : ""}`
// //                       : "No Requests"}
// //                   </Text>
// //                 </View>
// //                 {myRequestCount > 0 && (
// //                   <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
// //                 )}
// //               </TouchableOpacity>
// //             </View>

// //             {game.message && (
// //               <View style={styles.messageCard}>
// //                 <View style={styles.messageHeader}>
// //                   <MaterialIcons name="message" size={18} color={ACCENT_COLOR} />
// //                   <Text style={styles.messageTitle}>Host Message</Text>
// //                 </View>
// //                 <Text style={styles.messageContent}>{game.message}</Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* ACTIONS CARD */}
// //           <View style={styles.card}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>Actions</Text>
// //               <Ionicons name="flash" size={24} color={ACCENT_COLOR} />
// //             </View>

// //             <View style={styles.actionsContainer}>
// //               <TouchableOpacity
// //                 style={[
// //                   styles.actionButton,
// //                   styles.primaryActionButton,
// //                   (hasReachedTicketLimit() || loading) && styles.disabledButton,
// //                 ]}
// //                 onPress={() => {
// //                   if (!hasReachedTicketLimit()) {
// //                     setTicketModalVisible(true);
// //                   } else {
// //                     showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
// //                   }
// //                 }}
// //                 disabled={hasReachedTicketLimit() || loading}
// //               >
// //                 <View style={styles.actionButtonIcon}>
// //                   <Ionicons name="add-circle" size={24} color={SECONDARY_COLOR} />
// //                 </View>
// //                 <Text style={styles.actionButtonText}>
// //                   {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.actionButton,
// //                   styles.secondaryActionButton,
// //                   myTicketCount === 0 && styles.disabledButton,
// //                 ]}
// //                 onPress={navigateToTickets}
// //                 disabled={myTicketCount === 0}
// //               >
// //                 <View style={styles.actionButtonIcon}>
// //                   <Ionicons name="ticket" size={24} color={ACCENT_COLOR} />
// //                 </View>
// //                 <Text style={styles.secondaryActionButtonText}>
// //                   My Tickets
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.actionButton,
// //                   styles.secondaryActionButton,
// //                   myRequestCount === 0 && styles.disabledButton,
// //                 ]}
// //                 onPress={navigateToMyRequests}
// //                 disabled={myRequestCount === 0}
// //               >
// //                 <View style={styles.actionButtonIcon}>
// //                   <Ionicons name="list-circle" size={24} color={ACCENT_COLOR} />
// //                 </View>
// //                 <Text style={styles.secondaryActionButtonText}>
// //                   My Requests
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           {/* REWARDS CARD */}
// //           {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// //             <View style={styles.card}>
// //               <View style={styles.sectionHeader}>
// //                 <Text style={styles.sectionTitle}>Game Rewards</Text>
// //                 <Ionicons name="trophy" size={24} color={ACCENT_COLOR} />
// //               </View>
              
// //               {game.pattern_rewards.map((reward, index) => (
// //                 <View key={reward.pattern_id} style={styles.rewardCard}>
// //                   <View style={styles.rewardPattern} />
                  
// //                   <View style={styles.rewardHeader}>
// //                     <View style={styles.rewardIcon}>
// //                       <MaterialIcons name="emoji-events" size={24} color={ACCENT_COLOR} />
// //                     </View>
// //                     <View style={styles.rewardInfo}>
// //                       <Text style={styles.rewardName} numberOfLines={1}>
// //                         {reward.reward_name}
// //                       </Text>
// //                       <Text style={styles.rewardDescription} numberOfLines={2}>
// //                         {reward.description}
// //                       </Text>
// //                     </View>
// //                     <View style={styles.rewardAmountContainer}>
// //                       <Text style={styles.rewardAmount} numberOfLines={1}>
// //                         ₹{reward.amount}
// //                       </Text>
// //                     </View>
// //                   </View>
                  
// //                   <View style={styles.rewardFooter}>
// //                     <View style={styles.rewardDetail}>
// //                       <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
// //                       <Text style={styles.rewardDetailText} numberOfLines={1}>
// //                         Count: {reward.reward_count}
// //                       </Text>
// //                     </View>
// //                     <View style={styles.patternBadge}>
// //                       <Text style={styles.patternBadgeText} numberOfLines={1}>
// //                         Pattern {reward.pattern_id}
// //                       </Text>
// //                     </View>
// //                   </View>
// //                 </View>
// //               ))}
// //             </View>
// //           )}
// //         </View>

// //         <View style={styles.bottomSpace} />
// //       </ScrollView>

// //       {/* TICKET MODAL */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={ticketModalVisible}
// //         onRequestClose={() => setTicketModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContainer}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Request Tickets</Text>
// //               <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
// //                 <Ionicons name="close" size={24} color={ACCENT_COLOR} />
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.modalGameInfo}>
// //               <Text style={styles.modalGameName} numberOfLines={2}>
// //                 {game.game_name}
// //               </Text>
// //               <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
// //               <View style={styles.modalTicketCost}>
// //                 <Text style={[
// //                   styles.modalTicketCostText,
// //                   { color: game.ticket_type === "paid" ? ACCENT_COLOR : ACCENT_COLOR }
// //                 ]}>
// //                   Ticket Price: {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
// //                 </Text>
// //               </View>
// //               <View style={styles.modalHostInfo}>
// //                 <Text style={styles.modalHostText}>
// //                   Host: {game.user?.name || "Game Host"} ({getWhatsAppNumber()})
// //                 </Text>
// //               </View>
// //             </View>

// //             <View style={[
// //               styles.modalLimitInfo,
// //               hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
// //             ]}>
// //               <Ionicons 
// //                 name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
// //                 size={18} 
// //                 color={hasReachedTicketLimit() ? ERROR_COLOR : ACCENT_COLOR} 
// //               />
// //               <Text style={styles.modalLimitText}>
// //                 {hasReachedTicketLimit() 
// //                   ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
// //                   : `You can request up to ${getRemainingTickets()} more ticket(s)`
// //                 }
// //               </Text>
// //             </View>

// //             <View style={styles.quantitySection}>
// //               <Text style={styles.quantityLabel}>Select Quantity (1-4)</Text>
// //               <View style={styles.quantitySelector}>
// //                 {[1, 2, 3, 4].map((num) => {
// //                   const canSelect = num <= getRemainingTickets() && !hasReachedTicketLimit();
// //                   return (
// //                     <TouchableOpacity
// //                       key={num}
// //                       style={[
// //                         styles.quantityButton,
// //                         ticketQuantity === num && styles.quantityButtonActive,
// //                         !canSelect && styles.quantityButtonDisabled,
// //                       ]}
// //                       onPress={() => canSelect && setTicketQuantity(num)}
// //                       disabled={!canSelect}
// //                     >
// //                       <Text
// //                         style={[
// //                           styles.quantityButtonText,
// //                           ticketQuantity === num && styles.quantityButtonTextActive,
// //                           !canSelect && styles.quantityButtonTextDisabled,
// //                         ]}
// //                       >
// //                         {num}
// //                       </Text>
// //                       {!canSelect && (
// //                         <Ionicons 
// //                           name="close-circle" 
// //                           size={12} 
// //                           color={ERROR_COLOR} 
// //                           style={styles.quantityDisabledIcon}
// //                         />
// //                       )}
// //                     </TouchableOpacity>
// //                   );
// //                 })}
// //               </View>
// //             </View>

// //             {game.ticket_type === "paid" && (
// //               <View style={styles.totalSection}>
// //                 <View style={styles.totalLabelContainer}>
// //                   <Ionicons name="wallet" size={20} color={ACCENT_COLOR} />
// //                   <Text style={styles.totalLabel}>Total Amount:</Text>
// //                 </View>
// //                 <Text style={styles.totalAmount} numberOfLines={1}>
// //                   ₹{game.ticket_cost * ticketQuantity}
// //                 </Text>
// //               </View>
// //             )}

// //             <View style={styles.messageSection}>
// //               <Text style={styles.messageLabel}>Message (Optional)</Text>
// //               <TextInput
// //                 style={styles.messageInput}
// //                 value={ticketMessage}
// //                 onChangeText={setTicketMessage}
// //                 placeholder="Add a message for the host..."
// //                 multiline
// //                 numberOfLines={3}
// //                 maxLength={200}
// //                 placeholderTextColor={LIGHT_ACCENT}
// //               />
// //               <Text style={styles.charCount}>
// //                 {ticketMessage.length}/200 characters
// //               </Text>
// //             </View>

// //             <View style={styles.modalActions}>
// //               <TouchableOpacity
// //                 style={styles.cancelButton}
// //                 onPress={() => setTicketModalVisible(false)}
// //               >
// //                 <Text style={styles.cancelButtonText}>Cancel</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.submitButton,
// //                   (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.submitButtonDisabled,
// //                 ]}
// //                 onPress={handleRequestTickets}
// //                 disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
// //               >
// //                 {requestLoading ? (
// //                   <ActivityIndicator size="small" color={SECONDARY_COLOR} />
// //                 ) : (
// //                   <>
// //                     <Ionicons name="send" size={18} color={SECONDARY_COLOR} />
// //                     <Text style={styles.submitButtonText}>
// //                       {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
// //                     </Text>
// //                   </>
// //                 )}
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: PRIMARY_COLOR,
// //   },
// //   container: {
// //     flex: 1,
// //   },
// //   backgroundPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: -1,
// //     overflow: 'hidden',
// //   },
// //   pokerChip1: {
// //     position: 'absolute',
// //     top: 40,
// //     left: width * 0.1,
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: ACCENT_COLOR,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.5,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   pokerChip2: {
// //     position: 'absolute',
// //     top: 80,
// //     right: width * 0.15,
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: ACCENT_COLOR,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.4,
// //     shadowRadius: 6,
// //     elevation: 5,
// //   },
// //   shineEffect: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 100,
// //     height: '100%',
// //     backgroundColor: 'rgba(240, 174, 19, 0.1)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   yellowGradient: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: 300,
// //     backgroundColor: 'rgba(240, 174, 19, 0.05)',
// //   },
// //   blueGradient: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     height: 200,
// //     backgroundColor: 'rgba(1, 69, 96, 0.3)',
// //   },
// //   toast: {
// //     position: 'absolute',
// //     top: 60,
// //     left: 20,
// //     right: 20,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 16,
// //     borderRadius: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 5,
// //     zIndex: 999,
// //   },
// //   toastText: {
// //     color: SECONDARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 10,
// //     flex: 1,
// //   },
// //   header: {
// //     paddingTop: 20,
// //     paddingBottom: 20,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     borderBottomWidth: 2,
// //     borderBottomColor: ACCENT_COLOR,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   headerPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     overflow: 'hidden',
// //   },
// //   headerShine: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 100,
// //     height: '100%',
// //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   headerContent: {
// //     paddingHorizontal: 20,
// //   },
// //   headerTop: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: DARK_BLUE,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //   },
// //   gameName: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //     letterSpacing: -0.5,
// //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// //     textShadowOffset: { width: 1, height: 1 },
// //     textShadowRadius: 2,
// //   },
// //   gameCodeContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     marginTop: 2,
// //   },
// //   gameCode: {
// //     fontSize: 14,
// //     color: LIGHT_ACCENT,
// //     fontWeight: "500",
// //     opacity: 0.9,
// //   },
// //   refreshButton: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: ACCENT_COLOR,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginLeft: 10,
// //   },
// //   content: {
// //     padding: 20,
// //     zIndex: 1,
// //     marginTop: 0,
// //   },
// //   card: {
// //     backgroundColor: DARK_BLUE,
// //     borderRadius: 16,
// //     padding: 16,
// //     marginBottom: 16,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //     elevation: 4,
// //   },
// //   cardPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 50,
// //     height: 50,
// //     borderBottomLeftRadius: 16,
// //     borderTopRightRadius: 25,
// //     backgroundColor: 'rgba(240, 174, 19, 0.05)',
// //   },
// //   cardHeader: {
// //     marginBottom: 16,
// //   },
// //   gameIconContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   gameIconWrapper: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 10,
// //     backgroundColor: SECONDARY_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //     padding: 8,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   cardTitleContainer: {
// //     flex: 1,
// //   },
// //   cardTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //     marginBottom: 4,
// //   },
// //   statusBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     gap: 4,
// //     alignSelf: 'flex-start',
// //   },
// //   statusBadgeText: {
// //     fontSize: 10,
// //     fontWeight: "700",
// //     color: SECONDARY_COLOR,
// //   },
// //   cardDescription: {
// //     fontSize: 14,
// //     color: LIGHT_ACCENT,
// //     lineHeight: 20,
// //     marginBottom: 16,
// //   },
// //   statsContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 16,
// //   },
// //   statCard: {
// //     alignItems: "center",
// //     flex: 1,
// //   },
// //   statIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 10,
// //     backgroundColor: SECONDARY_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginBottom: 6,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   statValue: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //     marginBottom: 2,
// //   },
// //   statLabel: {
// //     fontSize: 11,
// //     color: LIGHT_ACCENT,
// //     fontWeight: "500",
// //     opacity: 0.7,
// //   },
// //   waitingText: {
// //     fontSize: 14,
// //     color: ACCENT_COLOR,
// //     fontStyle: "italic",
// //     marginBottom: 16,
// //     textAlign: "center",
// //   },
// //   primaryButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: ACCENT_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   buttonDisabled: {
// //     opacity: 0.7,
// //   },
// //   primaryButtonText: {
// //     color: SECONDARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   scheduledBadgeContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: SECONDARY_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   scheduledBadgeText: {
// //     color: ACCENT_COLOR,
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },
// //   viewRoomButton: {
// //     marginBottom: 8,
// //   },
// //   secondaryButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: SECONDARY_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   resultsButton: {
// //     marginTop: 0,
// //   },
// //   secondaryButtonText: {
// //     color: ACCENT_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: ACCENT_COLOR,
// //   },
// //   ticketLimitContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     borderWidth: 2,
// //     gap: 12,
// //   },
// //   ticketLimitReached: {
// //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// //     borderColor: "rgba(231, 76, 60, 0.2)",
// //   },
// //   ticketLimitAvailable: {
// //     backgroundColor: "rgba(240, 174, 19, 0.05)",
// //     borderColor: "rgba(240, 174, 19, 0.2)",
// //   },
// //   ticketLimitIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 8,
// //     backgroundColor: SECONDARY_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   ticketLimitInfo: {
// //     flex: 1,
// //   },
// //   ticketLimitTitle: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: ACCENT_COLOR,
// //     marginBottom: 2,
// //   },
// //   ticketLimitTitleReached: {
// //     color: ERROR_COLOR,
// //   },
// //   ticketLimitText: {
// //     fontSize: 12,
// //     color: LIGHT_ACCENT,
// //     lineHeight: 16,
// //     opacity: 0.7,
// //   },
// //   detailRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 12,
// //   },
// //   detailItem: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 8,
// //     flex: 1,
// //   },
// //   detailIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     backgroundColor: SECONDARY_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   detailLabel: {
// //     fontSize: 10,
// //     color: LIGHT_ACCENT,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //     opacity: 0.7,
// //   },
// //   detailText: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     fontWeight: "600",
// //   },
// //   myCountContainer: {
// //     gap: 8,
// //     marginBottom: 16,
// //   },
// //   countButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     gap: 12,
// //   },
// //   hasCountButton: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   noCountButton: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderColor: ACCENT_COLOR,
// //     opacity: 0.7,
// //   },
// //   countIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(240, 174, 19, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   countInfo: {
// //     flex: 1,
// //   },
// //   countLabel: {
// //     fontSize: 11,
// //     color: LIGHT_ACCENT,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //     opacity: 0.7,
// //   },
// //   countValue: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },
// //   hasCountValue: {
// //     color: ACCENT_COLOR,
// //   },
// //   noCountValue: {
// //     color: LIGHT_ACCENT,
// //     opacity: 0.7,
// //   },
// //   messageCard: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderRadius: 10,
// //     padding: 12,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   messageHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   messageTitle: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: ACCENT_COLOR,
// //   },
// //   messageContent: {
// //     fontSize: 13,
// //     color: LIGHT_ACCENT,
// //     lineHeight: 18,
// //     opacity: 0.7,
// //   },
// //   actionsContainer: {
// //     gap: 12,
// //   },
// //   actionButton: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //   },
// //   actionButtonIcon: {
// //     width: 24,
// //     height: 24,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   primaryActionButton: {
// //     backgroundColor: ACCENT_COLOR,
// //   },
// //   actionButtonText: {
// //     color: SECONDARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   secondaryActionButton: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   secondaryActionButtonText: {
// //     color: ACCENT_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   disabledButton: {
// //     opacity: 0.5,
// //   },
// //   rewardCard: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderRadius: 10,
// //     padding: 12,
// //     marginBottom: 8,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   rewardPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 40,
// //     height: 40,
// //     borderBottomLeftRadius: 10,
// //     borderTopRightRadius: 15,
// //     backgroundColor: 'rgba(240, 174, 19, 0.05)',
// //   },
// //   rewardHeader: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 12,
// //     marginBottom: 8,
// //   },
// //   rewardIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(240, 174, 19, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   rewardInfo: {
// //     flex: 1,
// //   },
// //   rewardName: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //     marginBottom: 2,
// //   },
// //   rewardDescription: {
// //     fontSize: 12,
// //     color: LIGHT_ACCENT,
// //     lineHeight: 16,
// //     opacity: 0.7,
// //   },
// //   rewardAmountContainer: {
// //     minWidth: 60,
// //   },
// //   rewardAmount: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: ACCENT_COLOR,
// //     textAlign: 'right',
// //   },
// //   rewardFooter: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   rewardDetail: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //   },
// //   rewardDetailText: {
// //     fontSize: 11,
// //     color: LIGHT_ACCENT,
// //     opacity: 0.7,
// //   },
// //   patternBadge: {
// //     backgroundColor: "rgba(240, 174, 19, 0.1)",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //     borderWidth: 1,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   patternBadgeText: {
// //     fontSize: 10,
// //     color: ACCENT_COLOR,
// //     fontWeight: "600",
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //   },
// //   modalContainer: {
// //     backgroundColor: DARK_BLUE,
// //     borderRadius: 16,
// //     padding: 20,
// //     width: "100%",
// //     maxWidth: 400,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 20,
// //   },
// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //   },
// //   modalGameInfo: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderRadius: 10,
// //     padding: 15,
// //     marginBottom: 15,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   modalGameName: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //     marginBottom: 4,
// //   },
// //   modalGameId: {
// //     fontSize: 13,
// //     color: LIGHT_ACCENT,
// //     marginBottom: 8,
// //     opacity: 0.7,
// //   },
// //   modalTicketCost: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   modalTicketCostText: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: ACCENT_COLOR,
// //   },
// //   modalHostInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   modalHostText: {
// //     fontSize: 12,
// //     color: LIGHT_ACCENT,
// //     opacity: 0.7,
// //   },
// //   modalLimitInfo: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 15,
// //     gap: 10,
// //     borderWidth: 2,
// //   },
// //   modalLimitReached: {
// //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// //     borderColor: "rgba(231, 76, 60, 0.2)",
// //   },
// //   modalLimitAvailable: {
// //     backgroundColor: "rgba(240, 174, 19, 0.05)",
// //     borderColor: "rgba(240, 174, 19, 0.2)",
// //   },
// //   modalLimitText: {
// //     flex: 1,
// //     fontSize: 13,
// //     color: LIGHT_ACCENT,
// //     lineHeight: 18,
// //     opacity: 0.7,
// //   },
// //   quantitySection: {
// //     marginBottom: 20,
// //   },
// //   quantityLabel: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: TEXT_LIGHT,
// //     marginBottom: 12,
// //   },
// //   quantitySelector: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //   },
// //   quantityButton: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 12,
// //     backgroundColor: SECONDARY_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //     position: 'relative',
// //   },
// //   quantityButtonActive: {
// //     backgroundColor: ACCENT_COLOR,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   quantityButtonDisabled: {
// //     backgroundColor: SECONDARY_COLOR,
// //     opacity: 0.5,
// //   },
// //   quantityButtonText: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: TEXT_LIGHT,
// //   },
// //   quantityButtonTextActive: {
// //     color: SECONDARY_COLOR,
// //   },
// //   quantityButtonTextDisabled: {
// //     color: LIGHT_ACCENT,
// //     textDecorationLine: 'line-through',
// //   },
// //   quantityDisabledIcon: {
// //     position: 'absolute',
// //     top: -4,
// //     right: -4,
// //     backgroundColor: DARK_BLUE,
// //     borderRadius: 6,
// //   },
// //   totalSection: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     backgroundColor: SECONDARY_COLOR,
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 20,
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   totalLabelContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //   },
// //   totalLabel: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     color: TEXT_LIGHT,
// //   },
// //   totalAmount: {
// //     fontSize: 22,
// //     fontWeight: "800",
// //     color: ACCENT_COLOR,
// //   },
// //   messageSection: {
// //     marginBottom: 20,
// //   },
// //   messageLabel: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: TEXT_LIGHT,
// //     marginBottom: 8,
// //   },
// //   messageInput: {
// //     backgroundColor: SECONDARY_COLOR,
// //     borderRadius: 10,
// //     padding: 15,
// //     fontSize: 14,
// //     minHeight: 80,
// //     textAlignVertical: "top",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //     color: TEXT_LIGHT,
// //   },
// //   charCount: {
// //     fontSize: 12,
// //     color: LIGHT_ACCENT,
// //     textAlign: "right",
// //     marginTop: 4,
// //     opacity: 0.7,
// //   },
// //   modalActions: {
// //     flexDirection: "row",
// //     gap: 12,
// //   },
// //   cancelButton: {
// //     flex: 1,
// //     backgroundColor: SECONDARY_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: ACCENT_COLOR,
// //   },
// //   cancelButtonText: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: LIGHT_ACCENT,
// //     opacity: 0.7,
// //   },
// //   submitButton: {
// //     flex: 2,
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     backgroundColor: ACCENT_COLOR,
// //   },
// //   submitButtonDisabled: {
// //     opacity: 0.5,
// //   },
// //   submitButtonText: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: SECONDARY_COLOR,
// //   },
// // });

// // export default GameDetails;





// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   Modal,
// //   ActivityIndicator,
// //   Alert,
// //   TextInput,
// //   RefreshControl,
// //   SafeAreaView,
// //   Dimensions,
// //   AppState,
// //   Linking,
// //   Platform,
// //   Animated,
// //   Easing,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";

// // // For React Native CLI, use react-native-vector-icons
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// // import Feather from "react-native-vector-icons/Feather";

// // const { width } = Dimensions.get("window");

// // // Updated color scheme matching Home component
// // const PRIMARY_COLOR = "#4facfe"; // Main blue color
// // const ACCENT_COLOR = "#ff9800"; // Orange accent
// // const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// // const WHITE = "#FFFFFF";
// // const TEXT_DARK = "#333333";
// // const TEXT_LIGHT = "#777777";
// // const BORDER_COLOR = "#EEEEEE";
// // const CARD_BACKGROUND = "#FFFFFF";
// // const SUCCESS_COLOR = "#4CAF50"; // Green for success states
// // const ERROR_COLOR = "#E74C3C"; // Red for errors

// // const GameDetails = ({ route, navigation }) => {
// //   const { game } = route.params;
// //   const [loading, setLoading] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [ticketModalVisible, setTicketModalVisible] = useState(false);
// //   const [ticketQuantity, setTicketQuantity] = useState(1);
// //   const [ticketMessage, setTicketMessage] = useState("");
// //   const [requestLoading, setRequestLoading] = useState(false);
// //   const [myTicketCount, setMyTicketCount] = useState(0);
// //   const [myRequestCount, setMyRequestCount] = useState(0);
// //   const [gameStatus, setGameStatus] = useState(null);
// //   const [callingStatus, setCallingStatus] = useState(null);
// //   const [calledNumbers, setCalledNumbers] = useState([]);
// //   const [timer, setTimer] = useState(0);
// //   const [joiningRoom, setJoiningRoom] = useState(false);
// //   const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
// //   const [totalTicketsInGame, setTotalTicketsInGame] = useState(0);
  
// //   // Polling state
// //   const [isPolling, setIsPolling] = useState(true);
// //   const pollingIntervalRef = useRef(null);
// //   const appState = useRef(AppState.currentState);

// //   // Animation values
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const rotateAnim = useRef(new Animated.Value(0)).current;
// //   const shineAnim = useRef(new Animated.Value(0)).current;

// //   // Toast state
// //   const [toast, setToast] = useState({ visible: false, message: "", type: "" });

// //   const MAX_TICKETS_PER_USER = 4;
  
// //   // Polling configuration
// //   const POLLING_INTERVAL = 4000;
// //   const POLLING_INTERVAL_BACKGROUND = 30000;
// //   const MAX_POLLING_DURATION = 300000;

// //   const getWhatsAppNumber = () => {
// //     if (game.host_mobile) {
// //       return game.host_mobile;
// //     }
// //     if (game.user?.mobile) {
// //       return game.user.mobile;
// //     }
// //     return "8007395749";
// //   };

// //   const createWhatsAppMessage = () => {
// //     const gameDate = new Date(game.game_date).toLocaleDateString("en-US", {
// //       weekday: "short",
// //       month: "short",
// //       day: "numeric",
// //     });
    
// //     const gameType = game.ticket_type === "paid" ? "Paid Game" : "Free Game";
// //     const ticketCost = game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE";
// //     const totalAmount = game.ticket_type === "paid" ? `₹${game.ticket_cost * ticketQuantity}` : "FREE";
// //     const hostName = game.user?.name || "Game Host";
    
// //     return `🎯 *TAMBOOLA TICKET REQUEST* 🎯

// // 🎮 *Game Details:*
// // • Game Name: ${game.game_name}
// // • Game ID: ${game.game_code}
// // • Date: ${gameDate} ${game.game_start_time}
// // • Type: ${gameType} ${ticketCost !== "FREE" ? `(${ticketCost} per ticket)` : ""}
// // • Host: ${hostName}

// // 🎫 *Ticket Request:*
// // • Quantity: ${ticketQuantity} ticket${ticketQuantity > 1 ? "s" : ""}
// // • Total Amount: ${totalAmount}

// // 📝 *Additional Message:*
// // ${ticketMessage || "Please approve my ticket request. Looking forward to the game!"}

// // 💰 *Payment Information:*
// // • UPI ID: ${getWhatsAppNumber()}@ybl
// // • PhonePe/Paytm: ${getWhatsAppNumber()}
// // • Please send payment screenshot with your name

// // ✅ *Confirmation Required:*
// // Please confirm my ticket allocation and share payment details if needed.

// // Thank you! 🙏
// // Looking forward to playing Tambola! 🎲🎉`;
// //   };

// //   const redirectToWhatsApp = () => {
// //     const whatsappNumber = getWhatsAppNumber();
// //     const message = createWhatsAppMessage();
// //     const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
// //     Linking.canOpenURL(whatsappUrl)
// //       .then((supported) => {
// //         if (supported) {
// //           return Linking.openURL(whatsappUrl);
// //         } else {
// //           const webWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
// //           return Linking.openURL(webWhatsappUrl);
// //         }
// //       })
// //       .catch((error) => {
// //         console.log("Error opening WhatsApp:", error);
// //         Alert.alert(
// //           "Error",
// //           "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
// //           [{ text: "OK" }]
// //         );
// //       });
// //   };

// //   useEffect(() => {
// //     startAnimations();
// //     fetchAllData();
// //     startPolling();
    
// //     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
// //     const autoStopTimer = setTimeout(() => {
// //       if (isPolling) {
// //         stopPolling();
// //       }
// //     }, MAX_POLLING_DURATION);

// //     const unsubscribe = navigation.addListener('focus', () => {
// //       fetchAllData();
// //       setJoiningRoom(false);
// //       setHasJoinedRoom(false);
// //     });

// //     return () => {
// //       stopPolling();
// //       subscription.remove();
// //       clearTimeout(autoStopTimer);
// //       unsubscribe();
// //     };
// //   }, []);

// //   const startAnimations = () => {
// //     // First floating animation
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

// //     // Second floating animation
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
// //           toValue: 1.02,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Slow rotation animation
// //     Animated.loop(
// //       Animated.timing(rotateAnim, {
// //         toValue: 1,
// //         duration: 20000,
// //         easing: Easing.linear,
// //         useNativeDriver: true,
// //       })
// //     ).start();

// //     // Shine animation
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(shineAnim, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(shineAnim, {
// //           toValue: 0,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   };

// //   // Interpolations for animations
// //   const translateY1 = floatAnim1.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, 15]
// //   });

// //   const translateY2 = floatAnim2.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, -10]
// //   });

// //   const rotate = rotateAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['0deg', '360deg']
// //   });

// //   const shineTranslateX = shineAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [-100, width + 100]
// //   });

// //   const fetchAllData = async () => {
// //     try {
// //       setLoading(true);
// //       await Promise.all([
// //         fetchGameStatus(),
// //         fetchMyTicketCount(),
// //         fetchMyRequestCount(),
// //         fetchTotalTicketsInGame()
// //       ]);
// //     } catch (error) {
// //       console.log("Error fetching all data:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAppStateChange = (nextAppState) => {
// //     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
// //       adjustPollingForBackground();
// //     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
// //       adjustPollingForForeground();
// //     }
// //     appState.current = nextAppState;
// //   };

// //   const startPolling = () => {
// //     if (pollingIntervalRef.current) {
// //       clearInterval(pollingIntervalRef.current);
// //     }
// //     setIsPolling(true);
// //     pollingIntervalRef.current = setInterval(() => {
// //       fetchGameStatusSilently();
// //     }, POLLING_INTERVAL);
// //   };

// //   const stopPolling = () => {
// //     setIsPolling(false);
// //     if (pollingIntervalRef.current) {
// //       clearInterval(pollingIntervalRef.current);
// //       pollingIntervalRef.current = null;
// //     }
// //   };

// //   const adjustPollingForBackground = () => {
// //     if (!pollingIntervalRef.current) return;
// //     clearInterval(pollingIntervalRef.current);
// //     pollingIntervalRef.current = setInterval(() => {
// //       fetchGameStatusSilently();
// //     }, POLLING_INTERVAL_BACKGROUND);
// //   };

// //   const adjustPollingForForeground = () => {
// //     if (!pollingIntervalRef.current) return;
// //     clearInterval(pollingIntervalRef.current);
// //     pollingIntervalRef.current = setInterval(() => {
// //       fetchGameStatusSilently();
// //     }, POLLING_INTERVAL);
// //   };

// //   const showToast = (message, type = "success") => {
// //     setToast({ visible: true, message, type });
// //   };

// //   const hideToast = () => {
// //     setToast({ ...toast, visible: false });
// //   };

// //   const Toast = () => {
// //     if (!toast.visible) return null;
    
// //     const backgroundColor = toast.type === "success" ? SUCCESS_COLOR : ERROR_COLOR;
    
// //     useEffect(() => {
// //       const timer = setTimeout(() => {
// //         hideToast();
// //       }, 3000);
// //       return () => clearTimeout(timer);
// //     }, []);

// //     return (
// //       <View style={[styles.toast, { backgroundColor }]}>
// //         <Ionicons 
// //           name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
// //           size={20} 
// //           color={WHITE} 
// //         />
// //         <Text style={styles.toastText}>{toast.message}</Text>
// //       </View>
// //     );
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     Promise.all([
// //       fetchGameStatus(), 
// //       fetchMyTicketCount(), 
// //       fetchMyRequestCount(),
// //       fetchTotalTicketsInGame()
// //     ]).finally(() =>
// //       setRefreshing(false)
// //     );
// //   }, []);

// //   const fetchGameStatus = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const response = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         const data = response.data.data;
// //         setGameStatus(data.game);
// //         setCallingStatus(data.calling);
// //         setCalledNumbers(data.numbers?.called_numbers || []);
        
// //         if (data.calling?.is_running && !data.calling?.is_paused) {
// //           setTimer(data.calling?.interval_seconds || 60);
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Error fetching game status:", error);
// //     }
// //   };

// //   const fetchGameStatusSilently = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
      
// //       const response = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         const data = response.data.data;
        
// //         const hasGameChanged = JSON.stringify(gameStatus) !== JSON.stringify(data.game);
// //         const hasCallingChanged = JSON.stringify(callingStatus) !== JSON.stringify(data.calling);
// //         const hasNumbersChanged = JSON.stringify(calledNumbers) !== JSON.stringify(data.numbers?.called_numbers || []);
        
// //         if (hasGameChanged || hasCallingChanged || hasNumbersChanged) {
// //           setGameStatus(data.game);
// //           setCallingStatus(data.calling);
// //           setCalledNumbers(data.numbers?.called_numbers || []);
          
// //           if (data.calling?.is_running && !data.calling?.is_paused) {
// //             setTimer(data.calling?.interval_seconds || 60);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Silent fetch error:", error.message);
// //     }
// //   };

// //   const fetchMyTicketCount = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         const gameTickets = res.data.tickets.data.filter(
// //           (ticket) => ticket.game_id == game.id
// //         );
// //         setMyTicketCount(gameTickets.length);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching ticket count:", error);
// //     }
// //   };

// //   const fetchMyRequestCount = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         const gameRequests = res.data.ticket_requests.data.filter(
// //           (request) => request.game_id === game.id
// //         );
// //         setMyRequestCount(gameRequests.length);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching request count:", error);
// //     }
// //   };

// //   const fetchTotalTicketsInGame = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
      
// //       const ticketsRes = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       const requestsRes = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (ticketsRes.data.success && requestsRes.data.success) {
// //         const allocatedTickets = ticketsRes.data.tickets.data.filter(
// //           (ticket) => ticket.game_id == game.id
// //         ).length;
        
// //         const pendingRequests = requestsRes.data.ticket_requests.data.filter(
// //           (request) => 
// //             request.game_id == game.id && 
// //             request.status === 'pending'
// //         ).length;
        
// //         const total = allocatedTickets + pendingRequests;
// //         setTotalTicketsInGame(total);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching total tickets:", error);
// //     }
// //   };

// //   const updateGameRoomStatus = async () => {
// //     try {
// //       setJoiningRoom(true);
// //       const token = await AsyncStorage.getItem("token");
      
// //       const response = await axios.post(
// //         `https://tambolatime.co.in/public/api/user/game-room/${game.id}/update-status`,
// //         {
// //           is_active: true
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         setHasJoinedRoom(true);
// //         showToast("Joined game room successfully!", "success");
// //         navigation.navigate("UserGameRoom", { 
// //           gameId: game.id,
// //           gameName: game.game_name,
// //           gameStatus: gameStatus?.status
// //         });
// //         setJoiningRoom(false);
// //       } else {
// //         showToast(response.data.message || "Failed to join game room", "error");
// //         setJoiningRoom(false);
// //       }
// //     } catch (error) {
// //       console.log("Error updating game room status:", error.response?.data || error.message);
// //       showToast(
// //         error.response?.data?.message || "Failed to join game room. Please try again.",
// //         "error"
// //       );
// //       setJoiningRoom(false);
// //     }
// //   };

// //   const handleRequestTickets = async () => {
// //     if (hasReachedTicketLimit()) {
// //       showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
// //       return;
// //     }

// //     const remaining = getRemainingTickets();
// //     if (ticketQuantity > remaining) {
// //       showToast(`You can only request up to ${remaining} more ticket(s)`, "error");
// //       return;
// //     }

// //     if (ticketQuantity < 1 || ticketQuantity > 4) {
// //       showToast("Ticket quantity must be between 1 and 4", "error");
// //       return;
// //     }

// //     setRequestLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const response = await axios.post(
// //         "https://tambolatime.co.in/public/api/user/ticket-requests/send",
// //         {
// //           game_id: game.id,
// //           ticket_quantity: ticketQuantity,
// //           message:
// //             ticketMessage || `Request for ${ticketQuantity} ticket(s)`,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       const isSuccess = 
// //         response.data.success === true || 
// //         response.data.status === true || 
// //         response.data.message?.toLowerCase().includes("success");

// //       if (isSuccess) {
// //         const whatsappNumber = getWhatsAppNumber();
// //         showToast(`Ticket request submitted! Opening WhatsApp to ${whatsappNumber}...`, "success");
        
// //         setTicketModalVisible(false);
// //         setTicketQuantity(1);
// //         setTicketMessage("");
        
// //         fetchMyRequestCount();
// //         fetchMyTicketCount();
// //         fetchTotalTicketsInGame();
        
// //         setTimeout(() => {
// //           redirectToWhatsApp();
// //         }, 1000);
        
// //         setTimeout(() => {
// //           navigation.navigate("TicketRequestsScreen", { 
// //             gameId: game.id,
// //             gameName: game.game_name 
// //           });
// //         }, 4000);
// //       } else {
// //         const errorMessage = response.data.message || 
// //                             response.data.error || 
// //                             "Failed to submit request";
// //         showToast(errorMessage, "error");
// //       }
// //     } catch (error) {
// //       console.log("Request error:", error.response?.data || error.message);
      
// //       let errorMessage = "Failed to submit ticket request. Please try again.";
      
// //       if (error.response) {
// //         errorMessage = error.response.data?.message || 
// //                       error.response.data?.error || 
// //                       `Server error: ${error.response.status}`;
// //       } else if (error.request) {
// //         errorMessage = "No response from server. Please check your connection.";
// //       }
      
// //       showToast(errorMessage, "error");
// //     } finally {
// //       setRequestLoading(false);
// //     }
// //   };

// //   const navigateToTickets = () => {
// //     navigation.navigate("TicketsScreen", { game });
// //   };

// //   const navigateToMyRequests = () => {
// //     navigation.navigate("TicketRequestsScreen", { 
// //       gameId: game.id,
// //       gameName: game.game_name 
// //     });
// //   };

// //   const handleJoinGameRoom = () => {
// //     if (gameStatus?.status === 'scheduled') {
// //       showToast("Game has not started yet!", "info");
// //       return;
// //     }
    
// //     if (hasJoinedRoom) {
// //       navigation.navigate("UserGameRoom", { 
// //         gameId: game.id,
// //         gameName: game.game_name,
// //         gameStatus: gameStatus?.status
// //       });
// //     } else {
// //       updateGameRoomStatus();
// //     }
// //   };

// //   const renderTicketLimitInfo = () => {
// //     const remaining = getRemainingTickets();
// //     const hasLimit = hasReachedTicketLimit();
    
// //     return (
// //       <View style={[
// //         styles.ticketLimitContainer,
// //         hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
// //       ]}>
// //         <View style={styles.ticketLimitIcon}>
// //           <Ionicons 
// //             name={hasLimit ? "alert-circle" : "ticket"} 
// //             size={16} 
// //             color={hasLimit ? ERROR_COLOR : ACCENT_COLOR} 
// //           />
// //         </View>
// //         <View style={styles.ticketLimitInfo}>
// //           <Text style={[
// //             styles.ticketLimitTitle,
// //             hasLimit && styles.ticketLimitTitleReached
// //           ]}>
// //             {hasLimit ? "Ticket Limit Reached" : "Ticket Limit"}
// //           </Text>
// //           <Text style={styles.ticketLimitText}>
// //             {hasLimit 
// //               ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
// //               : `You have ${myTicketCount} allocated + ${myRequestCount} pending = ${totalTicketsInGame}/4 tickets`
// //             }
// //           </Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   const getRemainingTickets = () => {
// //     return MAX_TICKETS_PER_USER - totalTicketsInGame;
// //   };

// //   const hasReachedTicketLimit = () => {
// //     return totalTicketsInGame >= MAX_TICKETS_PER_USER;
// //   };

// //   const canRequestTickets = () => {
// //     const remaining = getRemainingTickets();
// //     return ticketQuantity <= remaining && remaining > 0;
// //   };

// //   const renderBackgroundPatterns = () => (
// //     <View style={styles.backgroundPattern}>
// //       {/* Poker chip animations */}
// //       <Animated.View 
// //         style={[
// //           styles.pokerChip1, 
// //           { 
// //             transform: [
// //               { translateY: translateY1 },
// //               { translateX: translateY2 }
// //             ] 
// //           }
// //         ]} 
// //       />
// //       <Animated.View 
// //         style={[
// //           styles.pokerChip2, 
// //           { 
// //             transform: [
// //               { translateY: translateY2 },
// //               { translateX: translateY1 }
// //             ] 
// //           }
// //         ]} 
// //       />
      
// //       {/* Animated shine effect */}
// //       <Animated.View 
// //         style={[
// //           styles.shineEffect,
// //           { 
// //             transform: [{ translateX: shineTranslateX }],
// //             opacity: shineAnim
// //           }
// //         ]} 
// //       />
      
// //       {/* Yellow gradient overlay */}
// //       <View style={styles.yellowGradient} />
      
// //       {/* Blue gradient overlay */}
// //       <View style={styles.blueGradient} />
// //     </View>
// //   );

// //   const renderHeaderPatterns = () => (
// //     <View style={styles.headerPattern}>
// //       <Animated.View 
// //         style={[
// //           styles.headerShine,
// //           { transform: [{ translateX: shineTranslateX }] }
// //         ]} 
// //       />
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <Toast />
// //       {renderBackgroundPatterns()}
      
// //       <ScrollView
// //         style={styles.container}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             tintColor={PRIMARY_COLOR}
// //             colors={[PRIMARY_COLOR]}
// //           />
// //         }
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* HEADER - FIXED WITH WHITE TEXT */}
// //         <Animated.View 
// //           style={[
// //             styles.header,
// //             { transform: [{ scale: pulseAnim }] }
// //           ]}
// //         >
// //           {renderHeaderPatterns()}
          
// //           <View style={styles.headerContent}>
// //             <View style={styles.headerTop}>
// //               <TouchableOpacity
// //                 style={styles.backButton}
// //                 onPress={() => navigation.goBack()}
// //               >
// //                 <Ionicons name="arrow-back" size={24} color={WHITE} />
// //               </TouchableOpacity>
              
// //               <View style={styles.headerTextContainer}>
// //                 <Text style={styles.gameName} numberOfLines={2} ellipsizeMode="tail">
// //                   {game.game_name}
// //                 </Text>
// //                 <View style={styles.gameCodeContainer}>
// //                   <MaterialIcons
// //                     name="fingerprint"
// //                     size={14}
// //                     color={WHITE}
// //                   />
// //                   <Text style={styles.gameCode}>{game.game_code}</Text>
// //                 </View>
// //               </View>
              
// //               {/* <TouchableOpacity
// //                 style={styles.refreshButton}
// //                 onPress={fetchAllData}
// //               >
// //                 <Feather name="refresh-ccw" size={18} color={WHITE} />
// //               </TouchableOpacity> */}
// //             </View>
// //           </View>
// //         </Animated.View>

// //         <View style={styles.content}>
// //           {/* STATUS CARD */}
// //           <View style={styles.card}>
// //             <View style={styles.cardPattern} />
            
// //             <View style={styles.cardHeader}>
// //               <View style={styles.gameIconContainer}>
// //                 <View style={styles.gameIconWrapper}>
// //                   <MaterialIcons name="confirmation-number" size={32} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View style={styles.cardTitleContainer}>
// //                   <Text style={styles.cardTitle}>
// //                     {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
// //                       ? 'Game Status' 
// //                       : 'Game Schedule'
// //                     }
// //                   </Text>
// //                   <View style={[
// //                     styles.statusBadge,
// //                     { 
// //                       backgroundColor: gameStatus?.status === 'live' 
// //                         ? SUCCESS_COLOR 
// //                         : gameStatus?.status === 'completed'
// //                         ? '#9E9E9E'
// //                         : ACCENT_COLOR
// //                     }
// //                   ]}>
// //                     <Ionicons 
// //                       name={
// //                         gameStatus?.status === 'live' 
// //                           ? 'radio-button-on' 
// //                           : gameStatus?.status === 'completed'
// //                           ? 'trophy'
// //                           : 'time'
// //                       } 
// //                       size={12} 
// //                       color={WHITE} 
// //                     />
// //                     <Text style={styles.statusBadgeText}>
// //                       {gameStatus?.status?.toUpperCase() || 'LOADING'}
// //                     </Text>
// //                   </View>
// //                 </View>
// //               </View>
// //             </View>
            
// //             {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
// //               <View>
// //                 <Text style={styles.cardDescription}>
// //                   {gameStatus?.status === 'live'
// //                     ? "The game is now live! Number calling has started."
// //                     : "Game has been completed. You can still view the game room."
// //                   }
// //                 </Text>
// //                 {callingStatus?.is_running ? (
// //                   <View style={styles.statsContainer}>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="megaphone" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {calledNumbers.length}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Called</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="time" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {timer}s
// //                       </Text>
// //                       <Text style={styles.statLabel}>Next Call</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="grid" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {90 - calledNumbers.length}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Remaining</Text>
// //                     </View>
// //                   </View>
// //                 ) : gameStatus?.status === 'completed' ? (
// //                   <View style={styles.statsContainer}>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="checkmark-done" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {calledNumbers.length}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Total Called</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="trophy" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         Completed
// //                       </Text>
// //                       <Text style={styles.statLabel}>Status</Text>
// //                     </View>
// //                     <View style={styles.statCard}>
// //                       <View style={styles.statIcon}>
// //                         <Ionicons name="time" size={20} color={ACCENT_COLOR} />
// //                       </View>
// //                       <Text style={styles.statValue}>
// //                         {game.game_start_time}
// //                       </Text>
// //                       <Text style={styles.statLabel}>Started At</Text>
// //                     </View>
// //                   </View>
// //                 ) : (
// //                   <Text style={styles.waitingText}>
// //                     Number calling will start soon...
// //                   </Text>
// //                 )}
                
// //                 {gameStatus?.status === 'completed' ? (
// //                   <View>
// //                     {/* View Game Room Button */}
// //                     <TouchableOpacity
// //                       style={[styles.primaryButton, styles.viewRoomButton, joiningRoom && styles.buttonDisabled]}
// //                       onPress={handleJoinGameRoom}
// //                       disabled={joiningRoom}
// //                     >
// //                       {joiningRoom ? (
// //                         <ActivityIndicator size="small" color={WHITE} />
// //                       ) : (
// //                         <>
// //                           <Ionicons name="eye" size={20} color={WHITE} />
// //                           <Text style={styles.primaryButtonText}>
// //                             {hasJoinedRoom ? "View Game Room" : "View Completed Game"}
// //                           </Text>
// //                         </>
// //                       )}
// //                     </TouchableOpacity>
                    
// //                     {/* Game Results Button - Below View Game Room */}
// //                     <TouchableOpacity
// //                       style={[styles.secondaryButton, styles.resultsButton]}
// //                       onPress={() => navigation.navigate("UserGameResult", { 
// //                         gameId: game.id,
// //                         gameName: game.game_name 
// //                       })}
// //                     >
// //                       <Ionicons name="stats-chart" size={20} color={PRIMARY_COLOR} />
// //                       <Text style={styles.secondaryButtonText}>Game Results</Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 ) : (
// //                   <TouchableOpacity
// //                     style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
// //                     onPress={handleJoinGameRoom}
// //                     disabled={joiningRoom}
// //                   >
// //                     {joiningRoom ? (
// //                       <ActivityIndicator size="small" color={WHITE} />
// //                     ) : (
// //                       <>
// //                         <Ionicons 
// //                           name={hasJoinedRoom ? "enter" : "enter"} 
// //                           size={20} 
// //                           color={WHITE} 
// //                         />
// //                         <Text style={styles.primaryButtonText}>
// //                           {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
// //                         </Text>
// //                       </>
// //                     )}
// //                   </TouchableOpacity>
// //                 )}
// //               </View>
// //             ) : (
// //               <View>
// //                 <Text style={styles.cardDescription}>
// //                   Game is scheduled to start on {new Date(game.game_date).toLocaleDateString("en-US", {
// //                     weekday: "long",
// //                     month: "long",
// //                     day: "numeric",
// //                     year: "numeric"
// //                   })} at {game.game_start_time}
// //                 </Text>
// //                 <View style={styles.scheduledBadgeContainer}>
// //                   <Ionicons name="calendar" size={20} color={ACCENT_COLOR} />
// //                   <Text style={styles.scheduledBadgeText}>
// //                     Game is Scheduled
// //                   </Text>
// //                 </View>
// //               </View>
// //             )}
// //           </View>

// //           {/* GAME DETAILS CARD */}
// //           <View style={styles.card}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>Game Details</Text>
// //               <Ionicons name="game-controller" size={24} color={ACCENT_COLOR} />
// //             </View>

// //             <View style={styles.detailRow}>
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="calendar" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Date</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {new Date(game.game_date).toLocaleDateString("en-US", {
// //                       weekday: "short",
// //                       month: "short",
// //                       day: "numeric",
// //                     })}
// //                   </Text>
// //                 </View>
// //               </View>
              
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="time" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Time</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {game.game_start_time}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>

// //             <View style={styles.detailRow}>
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <MaterialIcons name="account-balance-wallet" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Prize Pool</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {game.ticket_type === "paid"
// //                       ? `₹${(game.ticket_cost * game.max_players).toLocaleString()}`
// //                       : "Exciting Prizes"}
// //                   </Text>
// //                 </View>
// //               </View>
              
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="person" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Host</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {game.user?.name || 'Tambola Timez'}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>

// //             <View style={styles.detailRow}>
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <Ionicons name="call" size={16} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Host Contact</Text>
// //                   <Text style={styles.detailText} numberOfLines={1}>
// //                     {getWhatsAppNumber()}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>

// //             {renderTicketLimitInfo()}

// //             <View style={styles.myCountContainer}>
// //               <TouchableOpacity
// //                 style={[
// //                   styles.countButton,
// //                   myTicketCount > 0 ? styles.hasCountButton : styles.noCountButton,
// //                 ]}
// //                 onPress={navigateToTickets}
// //               >
// //                 <View style={styles.countIcon}>
// //                   <Ionicons name="ticket" size={20} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View style={styles.countInfo}>
// //                   <Text style={styles.countLabel}>My Tickets</Text>
// //                   <Text style={[
// //                     styles.countValue,
// //                     myTicketCount > 0 ? styles.hasCountValue : styles.noCountValue,
// //                   ]}>
// //                     {myTicketCount > 0
// //                       ? `${myTicketCount} Ticket${myTicketCount > 1 ? "s" : ""}`
// //                       : "No Tickets"}
// //                   </Text>
// //                 </View>
// //                 {myTicketCount > 0 && (
// //                   <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
// //                 )}
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.countButton,
// //                   myRequestCount > 0 ? styles.hasCountButton : styles.noCountButton,
// //                 ]}
// //                 onPress={navigateToMyRequests}
// //               >
// //                 <View style={styles.countIcon}>
// //                   <Ionicons name="list-circle" size={20} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View style={styles.countInfo}>
// //                   <Text style={styles.countLabel}>My Requests</Text>
// //                   <Text style={[
// //                     styles.countValue,
// //                     myRequestCount > 0 ? styles.hasCountValue : styles.noCountValue,
// //                   ]}>
// //                     {myRequestCount > 0
// //                       ? `${myRequestCount} Request${myRequestCount > 1 ? "s" : ""}`
// //                       : "No Requests"}
// //                   </Text>
// //                 </View>
// //                 {myRequestCount > 0 && (
// //                   <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
// //                 )}
// //               </TouchableOpacity>
// //             </View>

// //             {game.message && (
// //               <View style={styles.messageCard}>
// //                 <View style={styles.messageHeader}>
// //                   <MaterialIcons name="message" size={18} color={ACCENT_COLOR} />
// //                   <Text style={styles.messageTitle}>Host Message</Text>
// //                 </View>
// //                 <Text style={styles.messageContent}>{game.message}</Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* ACTIONS CARD */}
// //           <View style={styles.card}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>Actions</Text>
// //               <Ionicons name="flash" size={24} color={ACCENT_COLOR} />
// //             </View>

// //             <View style={styles.actionsContainer}>
// //               <TouchableOpacity
// //                 style={[
// //                   styles.actionButton,
// //                   styles.primaryActionButton,
// //                   (hasReachedTicketLimit() || loading) && styles.disabledButton,
// //                 ]}
// //                 onPress={() => {
// //                   if (!hasReachedTicketLimit()) {
// //                     setTicketModalVisible(true);
// //                   } else {
// //                     showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
// //                   }
// //                 }}
// //                 disabled={hasReachedTicketLimit() || loading}
// //               >
// //                 <View style={styles.actionButtonIcon}>
// //                   <Ionicons name="add-circle" size={24} color={WHITE} />
// //                 </View>
// //                 <Text style={styles.actionButtonText}>
// //                   {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.actionButton,
// //                   styles.secondaryActionButton,
// //                   myTicketCount === 0 && styles.disabledButton,
// //                 ]}
// //                 onPress={navigateToTickets}
// //                 disabled={myTicketCount === 0}
// //               >
// //                 <View style={styles.actionButtonIcon}>
// //                   <Ionicons name="ticket" size={24} color={PRIMARY_COLOR} />
// //                 </View>
// //                 <Text style={styles.secondaryActionButtonText}>
// //                   My Tickets
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.actionButton,
// //                   styles.secondaryActionButton,
// //                   myRequestCount === 0 && styles.disabledButton,
// //                 ]}
// //                 onPress={navigateToMyRequests}
// //                 disabled={myRequestCount === 0}
// //               >
// //                 <View style={styles.actionButtonIcon}>
// //                   <Ionicons name="list-circle" size={24} color={PRIMARY_COLOR} />
// //                 </View>
// //                 <Text style={styles.secondaryActionButtonText}>
// //                   My Requests
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           {/* REWARDS CARD */}
// //           {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// //             <View style={styles.card}>
// //               <View style={styles.sectionHeader}>
// //                 <Text style={styles.sectionTitle}>Game Rewards</Text>
// //                 <Ionicons name="trophy" size={24} color={ACCENT_COLOR} />
// //               </View>
              
// //               {game.pattern_rewards.map((reward, index) => (
// //                 <View key={reward.pattern_id} style={styles.rewardCard}>
// //                   <View style={styles.rewardPattern} />
                  
// //                   <View style={styles.rewardHeader}>
// //                     <View style={styles.rewardIcon}>
// //                       <MaterialIcons name="emoji-events" size={24} color={ACCENT_COLOR} />
// //                     </View>
// //                     <View style={styles.rewardInfo}>
// //                       <Text style={styles.rewardName} numberOfLines={1}>
// //                         {reward.reward_name}
// //                       </Text>
// //                       <Text style={styles.rewardDescription} numberOfLines={2}>
// //                         {reward.description}
// //                       </Text>
// //                     </View>
// //                     <View style={styles.rewardAmountContainer}>
// //                       <Text style={styles.rewardAmount} numberOfLines={1}>
// //                         ₹{reward.amount}
// //                       </Text>
// //                     </View>
// //                   </View>
                  
// //                   <View style={styles.rewardFooter}>
// //                     <View style={styles.rewardDetail}>
// //                       <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
// //                       <Text style={styles.rewardDetailText} numberOfLines={1}>
// //                         Count: {reward.reward_count}
// //                       </Text>
// //                     </View>
// //                     <View style={styles.patternBadge}>
// //                       <Text style={styles.patternBadgeText} numberOfLines={1}>
// //                         Pattern {reward.pattern_id}
// //                       </Text>
// //                     </View>
// //                   </View>
// //                 </View>
// //               ))}
// //             </View>
// //           )}
// //         </View>

// //         <View style={styles.bottomSpace} />
// //       </ScrollView>

// //       {/* TICKET MODAL */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={ticketModalVisible}
// //         onRequestClose={() => setTicketModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContainer}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Request Tickets</Text>
// //               <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
// //                 <Ionicons name="close" size={24} color={PRIMARY_COLOR} />
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.modalGameInfo}>
// //               <Text style={styles.modalGameName} numberOfLines={2}>
// //                 {game.game_name}
// //               </Text>
// //               <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
// //               <View style={styles.modalTicketCost}>
// //                 <Text style={[
// //                   styles.modalTicketCostText,
// //                   { color: game.ticket_type === "paid" ? ACCENT_COLOR : ACCENT_COLOR }
// //                 ]}>
// //                   Ticket Price: {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
// //                 </Text>
// //               </View>
// //               <View style={styles.modalHostInfo}>
// //                 <Text style={styles.modalHostText}>
// //                   Host: {game.user?.name || "Game Host"} ({getWhatsAppNumber()})
// //                 </Text>
// //               </View>
// //             </View>

// //             <View style={[
// //               styles.modalLimitInfo,
// //               hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
// //             ]}>
// //               <Ionicons 
// //                 name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
// //                 size={18} 
// //                 color={hasReachedTicketLimit() ? ERROR_COLOR : ACCENT_COLOR} 
// //               />
// //               <Text style={styles.modalLimitText}>
// //                 {hasReachedTicketLimit() 
// //                   ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
// //                   : `You can request up to ${getRemainingTickets()} more ticket(s)`
// //                 }
// //               </Text>
// //             </View>

// //             <View style={styles.quantitySection}>
// //               <Text style={styles.quantityLabel}>Select Quantity (1-4)</Text>
// //               <View style={styles.quantitySelector}>
// //                 {[1, 2, 3, 4].map((num) => {
// //                   const canSelect = num <= getRemainingTickets() && !hasReachedTicketLimit();
// //                   return (
// //                     <TouchableOpacity
// //                       key={num}
// //                       style={[
// //                         styles.quantityButton,
// //                         ticketQuantity === num && styles.quantityButtonActive,
// //                         !canSelect && styles.quantityButtonDisabled,
// //                       ]}
// //                       onPress={() => canSelect && setTicketQuantity(num)}
// //                       disabled={!canSelect}
// //                     >
// //                       <Text
// //                         style={[
// //                           styles.quantityButtonText,
// //                           ticketQuantity === num && styles.quantityButtonTextActive,
// //                           !canSelect && styles.quantityButtonTextDisabled,
// //                         ]}
// //                       >
// //                         {num}
// //                       </Text>
// //                       {!canSelect && (
// //                         <Ionicons 
// //                           name="close-circle" 
// //                           size={12} 
// //                           color={ERROR_COLOR} 
// //                           style={styles.quantityDisabledIcon}
// //                         />
// //                       )}
// //                     </TouchableOpacity>
// //                   );
// //                 })}
// //               </View>
// //             </View>

// //             {game.ticket_type === "paid" && (
// //               <View style={styles.totalSection}>
// //                 <View style={styles.totalLabelContainer}>
// //                   <Ionicons name="wallet" size={20} color={ACCENT_COLOR} />
// //                   <Text style={styles.totalLabel}>Total Amount:</Text>
// //                 </View>
// //                 <Text style={styles.totalAmount} numberOfLines={1}>
// //                   ₹{game.ticket_cost * ticketQuantity}
// //                 </Text>
// //               </View>
// //             )}

// //             <View style={styles.messageSection}>
// //               <Text style={styles.messageLabel}>Message (Optional)</Text>
// //               <TextInput
// //                 style={styles.messageInput}
// //                 value={ticketMessage}
// //                 onChangeText={setTicketMessage}
// //                 placeholder="Add a message for the host..."
// //                 multiline
// //                 numberOfLines={3}
// //                 maxLength={200}
// //                 placeholderTextColor={TEXT_LIGHT}
// //               />
// //               <Text style={styles.charCount}>
// //                 {ticketMessage.length}/200 characters
// //               </Text>
// //             </View>

// //             <View style={styles.modalActions}>
// //               <TouchableOpacity
// //                 style={styles.cancelButton}
// //                 onPress={() => setTicketModalVisible(false)}
// //               >
// //                 <Text style={styles.cancelButtonText}>Cancel</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.submitButton,
// //                   (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.submitButtonDisabled,
// //                 ]}
// //                 onPress={handleRequestTickets}
// //                 disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
// //               >
// //                 {requestLoading ? (
// //                   <ActivityIndicator size="small" color={WHITE} />
// //                 ) : (
// //                   <>
// //                     <Ionicons name="send" size={18} color={WHITE} />
// //                     <Text style={styles.submitButtonText}>
// //                       {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
// //                     </Text>
// //                   </>
// //                 )}
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   backgroundPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: -1,
// //     overflow: 'hidden',
// //   },
// //   pokerChip1: {
// //     position: 'absolute',
// //     top: 40,
// //     left: width * 0.1,
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: PRIMARY_COLOR,
// //     shadowColor: PRIMARY_COLOR,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   pokerChip2: {
// //     position: 'absolute',
// //     top: 80,
// //     right: width * 0.15,
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: ACCENT_COLOR,
// //     shadowColor: ACCENT_COLOR,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //     elevation: 5,
// //   },
// //   shineEffect: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 100,
// //     height: '100%',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   yellowGradient: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: 300,
// //     backgroundColor: 'rgba(255, 152, 0, 0.05)',
// //   },
// //   blueGradient: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     height: 200,
// //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// //   },
// //   toast: {
// //     position: 'absolute',
// //     top: 60,
// //     left: 20,
// //     right: 20,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 16,
// //     borderRadius: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 5,
// //     zIndex: 999,
// //   },
// //   toastText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 10,
// //     flex: 1,
// //   },
// //   header: {
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingTop: 20,
// //     paddingBottom: 20,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   headerPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     overflow: 'hidden',
// //   },
// //   headerShine: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 100,
// //     height: '100%',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   headerContent: {
// //     paddingHorizontal: 20,
// //   },
// //   headerTop: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //   },
// //   gameName: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: WHITE, // Changed to pure white
// //     letterSpacing: -0.5,
// //   },
// //   gameCodeContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     marginTop: 2,
// //   },
// //   gameCode: {
// //     fontSize: 14,
// //     color: WHITE, // Changed to pure white
// //     fontWeight: "600",
// //   },
// //   refreshButton: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginLeft: 10,
// //   },
// //   content: {
// //     padding: 20,
// //     zIndex: 1,
// //     marginTop: 0,
// //   },
// //   card: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   cardPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 50,
// //     height: 50,
// //     borderBottomLeftRadius: 16,
// //     borderTopRightRadius: 25,
// //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// //   },
// //   cardHeader: {
// //     marginBottom: 16,
// //   },
// //   gameIconContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   gameIconWrapper: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 10,
// //     backgroundColor: BACKGROUND_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: PRIMARY_COLOR,
// //     padding: 8,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   cardTitleContainer: {
// //     flex: 1,
// //   },
// //   cardTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 4,
// //   },
// //   statusBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     gap: 4,
// //     alignSelf: 'flex-start',
// //   },
// //   statusBadgeText: {
// //     fontSize: 10,
// //     fontWeight: "700",
// //     color: WHITE,
// //   },
// //   cardDescription: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     lineHeight: 20,
// //     marginBottom: 16,
// //   },
// //   statsContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 16,
// //   },
// //   statCard: {
// //     alignItems: "center",
// //     flex: 1,
// //   },
// //   statIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 10,
// //     backgroundColor: BACKGROUND_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginBottom: 6,
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   statValue: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 2,
// //   },
// //   statLabel: {
// //     fontSize: 11,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   waitingText: {
// //     fontSize: 14,
// //     color: ACCENT_COLOR,
// //     fontStyle: "italic",
// //     marginBottom: 16,
// //     textAlign: "center",
// //   },
// //   primaryButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   buttonDisabled: {
// //     opacity: 0.7,
// //   },
// //   primaryButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   scheduledBadgeContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   scheduledBadgeText: {
// //     color: PRIMARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },
// //   viewRoomButton: {
// //     marginBottom: 8,
// //   },
// //   secondaryButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   resultsButton: {
// //     marginTop: 0,
// //   },
// //   secondaryButtonText: {
// //     color: PRIMARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   ticketLimitContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     gap: 12,
// //   },
// //   ticketLimitReached: {
// //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// //     borderColor: "rgba(231, 76, 60, 0.2)",
// //   },
// //   ticketLimitAvailable: {
// //     backgroundColor: "rgba(79, 172, 254, 0.05)",
// //     borderColor: "rgba(79, 172, 254, 0.2)",
// //   },
// //   ticketLimitIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 8,
// //     backgroundColor: BACKGROUND_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   ticketLimitInfo: {
// //     flex: 1,
// //   },
// //   ticketLimitTitle: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 2,
// //   },
// //   ticketLimitTitleReached: {
// //     color: ERROR_COLOR,
// //   },
// //   ticketLimitText: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     lineHeight: 16,
// //   },
// //   detailRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 12,
// //   },
// //   detailItem: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 8,
// //     flex: 1,
// //   },
// //   detailIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     backgroundColor: BACKGROUND_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   detailLabel: {
// //     fontSize: 10,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //   },
// //   detailText: {
// //     fontSize: 12,
// //     color: TEXT_DARK,
// //     fontWeight: "600",
// //   },
// //   myCountContainer: {
// //     gap: 8,
// //     marginBottom: 16,
// //   },
// //   countButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     gap: 12,
// //   },
// //   hasCountButton: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   noCountButton: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderColor: BORDER_COLOR,
// //     opacity: 0.7,
// //   },
// //   countIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   countInfo: {
// //     flex: 1,
// //   },
// //   countLabel: {
// //     fontSize: 11,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //   },
// //   countValue: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },
// //   hasCountValue: {
// //     color: TEXT_DARK,
// //   },
// //   noCountValue: {
// //     color: TEXT_LIGHT,
// //   },
// //   messageCard: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderRadius: 10,
// //     padding: 12,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   messageHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   messageTitle: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   messageContent: {
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     lineHeight: 18,
// //   },
// //   actionsContainer: {
// //     gap: 12,
// //   },
// //   actionButton: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //   },
// //   actionButtonIcon: {
// //     width: 24,
// //     height: 24,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   primaryActionButton: {
// //     backgroundColor: PRIMARY_COLOR,
// //   },
// //   actionButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   secondaryActionButton: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   secondaryActionButtonText: {
// //     color: PRIMARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   disabledButton: {
// //     opacity: 0.5,
// //   },
// //   rewardCard: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderRadius: 10,
// //     padding: 12,
// //     marginBottom: 8,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   rewardPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 40,
// //     height: 40,
// //     borderBottomLeftRadius: 10,
// //     borderTopRightRadius: 15,
// //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// //   },
// //   rewardHeader: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 12,
// //     marginBottom: 8,
// //   },
// //   rewardIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   rewardInfo: {
// //     flex: 1,
// //   },
// //   rewardName: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 2,
// //   },
// //   rewardDescription: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     lineHeight: 16,
// //   },
// //   rewardAmountContainer: {
// //     minWidth: 60,
// //   },
// //   rewardAmount: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: ACCENT_COLOR,
// //     textAlign: 'right',
// //   },
// //   rewardFooter: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   rewardDetail: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //   },
// //   rewardDetailText: {
// //     fontSize: 11,
// //     color: TEXT_LIGHT,
// //   },
// //   patternBadge: {
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   patternBadgeText: {
// //     fontSize: 10,
// //     color: PRIMARY_COLOR,
// //     fontWeight: "600",
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //   },
// //   modalContainer: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 20,
// //     width: "100%",
// //     maxWidth: 400,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 20,
// //   },
// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   modalGameInfo: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderRadius: 10,
// //     padding: 15,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   modalGameName: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 4,
// //   },
// //   modalGameId: {
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     marginBottom: 8,
// //   },
// //   modalTicketCost: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   modalTicketCostText: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: ACCENT_COLOR,
// //   },
// //   modalHostInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   modalHostText: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //   },
// //   modalLimitInfo: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 15,
// //     gap: 10,
// //     borderWidth: 1,
// //   },
// //   modalLimitReached: {
// //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// //     borderColor: "rgba(231, 76, 60, 0.2)",
// //   },
// //   modalLimitAvailable: {
// //     backgroundColor: "rgba(79, 172, 254, 0.05)",
// //     borderColor: "rgba(79, 172, 254, 0.2)",
// //   },
// //   modalLimitText: {
// //     flex: 1,
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     lineHeight: 18,
// //   },
// //   quantitySection: {
// //     marginBottom: 20,
// //   },
// //   quantityLabel: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: TEXT_DARK,
// //     marginBottom: 12,
// //   },
// //   quantitySelector: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //   },
// //   quantityButton: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 12,
// //     backgroundColor: BACKGROUND_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     position: 'relative',
// //   },
// //   quantityButtonActive: {
// //     backgroundColor: PRIMARY_COLOR,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   quantityButtonDisabled: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     opacity: 0.5,
// //   },
// //   quantityButtonText: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   quantityButtonTextActive: {
// //     color: WHITE,
// //   },
// //   quantityButtonTextDisabled: {
// //     color: TEXT_LIGHT,
// //     textDecorationLine: 'line-through',
// //   },
// //   quantityDisabledIcon: {
// //     position: 'absolute',
// //     top: -4,
// //     right: -4,
// //     backgroundColor: WHITE,
// //     borderRadius: 6,
// //   },
// //   totalSection: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   totalLabelContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //   },
// //   totalLabel: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     color: TEXT_DARK,
// //   },
// //   totalAmount: {
// //     fontSize: 22,
// //     fontWeight: "800",
// //     color: ACCENT_COLOR,
// //   },
// //   messageSection: {
// //     marginBottom: 20,
// //   },
// //   messageLabel: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: TEXT_DARK,
// //     marginBottom: 8,
// //   },
// //   messageInput: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderRadius: 10,
// //     padding: 15,
// //     fontSize: 14,
// //     minHeight: 80,
// //     textAlignVertical: "top",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     color: TEXT_DARK,
// //   },
// //   charCount: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     textAlign: "right",
// //     marginTop: 4,
// //   },
// //   modalActions: {
// //     flexDirection: "row",
// //     gap: 12,
// //   },
// //   cancelButton: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   cancelButtonText: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: TEXT_LIGHT,
// //   },
// //   submitButton: {
// //     flex: 2,
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //     backgroundColor: PRIMARY_COLOR,
// //   },
// //   submitButtonDisabled: {
// //     opacity: 0.5,
// //   },
// //   submitButtonText: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: WHITE,
// //   },
// // });

// // export default GameDetails;



// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   RefreshControl,
//   SafeAreaView,
//   Dimensions,
//   AppState,
//   Linking,
//   Platform,
//   Animated,
//   Easing,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import Feather from "react-native-vector-icons/Feather";

// const { width } = Dimensions.get("window");

// // Color palette matching Game component
// const COLORS = {
//   background: '#F0F7FF',
//   surface: '#FFFFFF',
//   primary: '#2E5BFF', // Vibrant blue
//   primaryLight: '#E1EBFF',
//   primaryDark: '#1A3A9E',
//   accent: '#3B82F6', // Medium blue for accents
//   secondary: '#60A5FA', // Light blue
//   tertiary: '#2563EB', // Darker blue for contrast
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
  
//   // Card background variants
//   cardBlue1: '#E8F0FE',
//   cardBlue2: '#D4E4FF',
//   cardBlue3: '#C2D6FF',
//   cardBlue4: '#E3F2FD',
//   cardBlue5: '#E6F0FA',
  
//   // Accent colors
//   purple: '#8B5CF6',
//   purpleLight: '#EDE9FE',
//   orange: '#F97316',
//   orangeLight: '#FFF3E6',
//   pink: '#EC4899',
//   pinkLight: '#FCE8F0',
//   teal: '#14B8A6',
//   tealLight: '#D5F5F0',
//   green: '#10B981',
//   greenLight: '#D1FAE5',
//   red: '#EF4444',
//   redLight: '#FEE2E2',
  
//   // Block colors - Blue shades
//   blockLightBlue: '#E1EBFF',
//   blockMediumBlue: '#C2D6FF',
//   blockDarkBlue: '#A3C1FF',
// };

// const GameDetails = ({ route, navigation }) => {
//   const { game } = route.params;
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [ticketModalVisible, setTicketModalVisible] = useState(false);
//   const [ticketQuantity, setTicketQuantity] = useState(1);
//   const [ticketMessage, setTicketMessage] = useState("");
//   const [requestLoading, setRequestLoading] = useState(false);
//   const [myTicketCount, setMyTicketCount] = useState(0);
//   const [myRequestCount, setMyRequestCount] = useState(0);
//   const [gameStatus, setGameStatus] = useState(null);
//   const [callingStatus, setCallingStatus] = useState(null);
//   const [calledNumbers, setCalledNumbers] = useState([]);
//   const [timer, setTimer] = useState(0);
//   const [joiningRoom, setJoiningRoom] = useState(false);
//   const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
//   const [totalTicketsInGame, setTotalTicketsInGame] = useState(0);
  
//   // Polling state
//   const [isPolling, setIsPolling] = useState(true);
//   const pollingIntervalRef = useRef(null);
//   const appState = useRef(AppState.currentState);

//   // Animation values
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Toast state
//   const [toast, setToast] = useState({ visible: false, message: "", type: "" });

//   const MAX_TICKETS_PER_USER = 4;
  
//   // Polling configuration
//   const POLLING_INTERVAL = 4000;
//   const POLLING_INTERVAL_BACKGROUND = 30000;
//   const MAX_POLLING_DURATION = 300000;

//   // Different accent colors for cards
//   const accentColors = [COLORS.primary, COLORS.purple, COLORS.orange, COLORS.teal, COLORS.pink];

//   useEffect(() => {
//     startAnimations();
//     fetchAllData();
//     startPolling();
    
//     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
//     const autoStopTimer = setTimeout(() => {
//       if (isPolling) {
//         stopPolling();
//       }
//     }, MAX_POLLING_DURATION);

//     const unsubscribe = navigation.addListener('focus', () => {
//       fetchAllData();
//       setJoiningRoom(false);
//       setHasJoinedRoom(false);
//     });

//     return () => {
//       stopPolling();
//       subscription.remove();
//       clearTimeout(autoStopTimer);
//       unsubscribe();
//     };
//   }, []);

//   // Animated background that moves with scroll
//   const AnimatedBackground = () => {
//     const block1TranslateY = scrollY.interpolate({
//       inputRange: [0, 300],
//       outputRange: [0, -50],
//       extrapolate: 'clamp'
//     });

//     const block2TranslateY = scrollY.interpolate({
//       inputRange: [0, 400],
//       outputRange: [0, -30],
//       extrapolate: 'clamp'
//     });

//     const block3TranslateY = scrollY.interpolate({
//       inputRange: [0, 500],
//       outputRange: [0, -20],
//       extrapolate: 'clamp'
//     });

//     const opacity = scrollY.interpolate({
//       inputRange: [0, 200, 400],
//       outputRange: [1, 0.8, 0.6],
//       extrapolate: 'clamp'
//     });

//     return (
//       <>
//         <Animated.View 
//           style={[
//             styles.blueBlock1,
//             {
//               transform: [{ translateY: block1TranslateY }],
//               opacity
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.blueBlock2,
//             {
//               transform: [{ translateY: block2TranslateY }],
//               opacity: opacity.interpolate({
//                 inputRange: [0.6, 1],
//                 outputRange: [0.4, 0.8]
//               })
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.blueBlock3,
//             {
//               transform: [{ translateY: block3TranslateY }],
//               opacity: opacity.interpolate({
//                 inputRange: [0.6, 1],
//                 outputRange: [0.2, 0.5]
//               })
//             }
//           ]} 
//         />
//       </>
//     );
//   };

//   // Card Background with only circles
//   const CardBackground = ({ accentColor = COLORS.primary }) => (
//     <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
//       {/* Decorative circles */}
//       <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
//       {/* Floating particles */}
//       <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
//       <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
//       <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
//     </View>
//   );

//   // Enhanced Header with UK pattern
//   const Header = () => (
//     <View style={styles.headerWrapper}>
//       {/* Semicircle Background */}
//       <View style={styles.semicircleBackground}>
//         <View style={styles.semicircle} />
//       </View>
      
//       {/* UK-style Rounded Lines Pattern */}
//       <View style={styles.ukPatternContainer}>
//         <View style={styles.curvedLine1} />
//         <View style={styles.curvedLine2} />
//         <View style={styles.curvedLine3} />
        
//         <View style={styles.parallelLines}>
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//         </View>
        
//         <View style={styles.dottedCircle1}>
//           {[...Array(8)].map((_, i) => (
//             <View 
//               key={i} 
//               style={[
//                 styles.dottedCircleDot,
//                 {
//                   transform: [
//                     { rotate: `${i * 45}deg` },
//                     { translateX: 30 }
//                   ]
//                 }
//               ]} 
//             />
//           ))}
//         </View>
        
//         <View style={styles.decorativeDot1} />
//         <View style={styles.decorativeDot2} />
//         <View style={styles.decorativeLine1} />
//         <View style={styles.decorativeLine2} />
//       </View>

//       {/* Header Content */}
//       <View style={styles.headerContent}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
//           </TouchableOpacity>
          
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerGameName} numberOfLines={1}>
//               {game.game_name}
//             </Text>
//             <View style={styles.headerGameCode}>
//               <MaterialIcons name="fingerprint" size={12} color={COLORS.textLight} />
//               <Text style={styles.headerGameCodeText}>{game.game_code}</Text>
//             </View>
//           </View>
          
//           <View style={[styles.statusBadge, { 
//             backgroundColor: gameStatus?.status === 'live' 
//               ? COLORS.green 
//               : gameStatus?.status === 'completed'
//               ? COLORS.red
//               : COLORS.orange
//           }]}>
//             <Text style={styles.statusBadgeText}>
//               {gameStatus?.status?.toUpperCase() || 'LOADING'}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const startAnimations = () => {
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

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.02,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
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

//   const getWhatsAppNumber = () => {
//     if (game.host_mobile) {
//       return game.host_mobile;
//     }
//     if (game.user?.mobile) {
//       return game.user.mobile;
//     }
//     return "8007395749";
//   };

//   const createWhatsAppMessage = () => {
//     const gameDate = new Date(game.game_date).toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
    
//     const gameType = game.ticket_type === "paid" ? "Paid Game" : "Free Game";
//     const ticketCost = game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE";
//     const totalAmount = game.ticket_type === "paid" ? `₹${game.ticket_cost * ticketQuantity}` : "FREE";
//     const hostName = game.user?.name || "Game Host";
    
//     return `🎯 *TAMBOOLA TICKET REQUEST* 🎯

// 🎮 *Game Details:*
// • Game Name: ${game.game_name}
// • Game ID: ${game.game_code}
// • Date: ${gameDate} ${game.game_start_time}
// • Type: ${gameType} ${ticketCost !== "FREE" ? `(${ticketCost} per ticket)` : ""}
// • Host: ${hostName}

// 🎫 *Ticket Request:*
// • Quantity: ${ticketQuantity} ticket${ticketQuantity > 1 ? "s" : ""}
// • Total Amount: ${totalAmount}

// 📝 *Additional Message:*
// ${ticketMessage || "Please approve my ticket request. Looking forward to the game!"}

// 💰 *Payment Information:*
// • UPI ID: ${getWhatsAppNumber()}@ybl
// • PhonePe/Paytm: ${getWhatsAppNumber()}
// • Please send payment screenshot with your name

// ✅ *Confirmation Required:*
// Please confirm my ticket allocation and share payment details if needed.

// Thank you! 🙏
// Looking forward to playing Tambola! 🎲🎉`;
//   };

//   const redirectToWhatsApp = () => {
//     const whatsappNumber = getWhatsAppNumber();
//     const message = createWhatsAppMessage();
//     const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
//     Linking.canOpenURL(whatsappUrl)
//       .then((supported) => {
//         if (supported) {
//           return Linking.openURL(whatsappUrl);
//         } else {
//           const webWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
//           return Linking.openURL(webWhatsappUrl);
//         }
//       })
//       .catch((error) => {
//         console.log("Error opening WhatsApp:", error);
//         Alert.alert(
//           "Error",
//           "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
//           [{ text: "OK" }]
//         );
//       });
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         fetchGameStatus(),
//         fetchMyTicketCount(),
//         fetchMyRequestCount(),
//         fetchTotalTicketsInGame()
//       ]);
//     } catch (error) {
//       console.log("Error fetching all data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAppStateChange = (nextAppState) => {
//     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
//       adjustPollingForBackground();
//     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
//       adjustPollingForForeground();
//     }
//     appState.current = nextAppState;
//   };

//   const startPolling = () => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
//     setIsPolling(true);
//     pollingIntervalRef.current = setInterval(() => {
//       fetchGameStatusSilently();
//     }, POLLING_INTERVAL);
//   };

//   const stopPolling = () => {
//     setIsPolling(false);
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   };

//   const adjustPollingForBackground = () => {
//     if (!pollingIntervalRef.current) return;
//     clearInterval(pollingIntervalRef.current);
//     pollingIntervalRef.current = setInterval(() => {
//       fetchGameStatusSilently();
//     }, POLLING_INTERVAL_BACKGROUND);
//   };

//   const adjustPollingForForeground = () => {
//     if (!pollingIntervalRef.current) return;
//     clearInterval(pollingIntervalRef.current);
//     pollingIntervalRef.current = setInterval(() => {
//       fetchGameStatusSilently();
//     }, POLLING_INTERVAL);
//   };

//   const showToast = (message, type = "success") => {
//     setToast({ visible: true, message, type });
//   };

//   const hideToast = () => {
//     setToast({ ...toast, visible: false });
//   };

//   const Toast = () => {
//     if (!toast.visible) return null;
    
//     const backgroundColor = toast.type === "success" ? COLORS.green : COLORS.red;
    
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         hideToast();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }, []);

//     return (
//       <View style={[styles.toast, { backgroundColor }]}>
//         <Ionicons 
//           name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
//           size={20} 
//           color="#FFFFFF" 
//         />
//         <Text style={styles.toastText}>{toast.message}</Text>
//       </View>
//     );
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     Promise.all([
//       fetchGameStatus(), 
//       fetchMyTicketCount(), 
//       fetchMyRequestCount(),
//       fetchTotalTicketsInGame()
//     ]).finally(() =>
//       setRefreshing(false)
//     );
//   }, []);

//   const fetchGameStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const data = response.data.data;
//         setGameStatus(data.game);
//         setCallingStatus(data.calling);
//         setCalledNumbers(data.numbers?.called_numbers || []);
        
//         if (data.calling?.is_running && !data.calling?.is_paused) {
//           setTimer(data.calling?.interval_seconds || 60);
//         }
//       }
//     } catch (error) {
//       console.log("Error fetching game status:", error);
//     }
//   };

//   const fetchGameStatusSilently = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const data = response.data.data;
        
//         const hasGameChanged = JSON.stringify(gameStatus) !== JSON.stringify(data.game);
//         const hasCallingChanged = JSON.stringify(callingStatus) !== JSON.stringify(data.calling);
//         const hasNumbersChanged = JSON.stringify(calledNumbers) !== JSON.stringify(data.numbers?.called_numbers || []);
        
//         if (hasGameChanged || hasCallingChanged || hasNumbersChanged) {
//           setGameStatus(data.game);
//           setCallingStatus(data.calling);
//           setCalledNumbers(data.numbers?.called_numbers || []);
          
//           if (data.calling?.is_running && !data.calling?.is_paused) {
//             setTimer(data.calling?.interval_seconds || 60);
//           }
//         }
//       }
//     } catch (error) {
//       console.log("Silent fetch error:", error.message);
//     }
//   };

//   const fetchMyTicketCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         const gameTickets = res.data.tickets.data.filter(
//           (ticket) => ticket.game_id == game.id
//         );
//         setMyTicketCount(gameTickets.length);
//       }
//     } catch (error) {
//       console.log("Error fetching ticket count:", error);
//     }
//   };

//   const fetchMyRequestCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         const gameRequests = res.data.ticket_requests.data.filter(
//           (request) => request.game_id === game.id
//         );
//         setMyRequestCount(gameRequests.length);
//       }
//     } catch (error) {
//       console.log("Error fetching request count:", error);
//     }
//   };

//   const fetchTotalTicketsInGame = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const ticketsRes = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       const requestsRes = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (ticketsRes.data.success && requestsRes.data.success) {
//         const allocatedTickets = ticketsRes.data.tickets.data.filter(
//           (ticket) => ticket.game_id == game.id
//         ).length;
        
//         const pendingRequests = requestsRes.data.ticket_requests.data.filter(
//           (request) => 
//             request.game_id == game.id && 
//             request.status === 'pending'
//         ).length;
        
//         const total = allocatedTickets + pendingRequests;
//         setTotalTicketsInGame(total);
//       }
//     } catch (error) {
//       console.log("Error fetching total tickets:", error);
//     }
//   };

//   const updateGameRoomStatus = async () => {
//     try {
//       setJoiningRoom(true);
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/user/game-room/${game.id}/update-status`,
//         {
//           is_active: true
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setHasJoinedRoom(true);
//         showToast("Joined game room successfully!", "success");
//         navigation.navigate("UserGameRoom", { 
//           gameId: game.id,
//           gameName: game.game_name,
//           gameStatus: gameStatus?.status
//         });
//         setJoiningRoom(false);
//       } else {
//         showToast(response.data.message || "Failed to join game room", "error");
//         setJoiningRoom(false);
//       }
//     } catch (error) {
//       console.log("Error updating game room status:", error.response?.data || error.message);
//       showToast(
//         error.response?.data?.message || "Failed to join game room. Please try again.",
//         "error"
//       );
//       setJoiningRoom(false);
//     }
//   };

//   const handleRequestTickets = async () => {
//     if (hasReachedTicketLimit()) {
//       showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
//       return;
//     }

//     const remaining = getRemainingTickets();
//     if (ticketQuantity > remaining) {
//       showToast(`You can only request up to ${remaining} more ticket(s)`, "error");
//       return;
//     }

//     if (ticketQuantity < 1 || ticketQuantity > 4) {
//       showToast("Ticket quantity must be between 1 and 4", "error");
//       return;
//     }

//     setRequestLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.post(
//         "https://tambolatime.co.in/public/api/user/ticket-requests/send",
//         {
//           game_id: game.id,
//           ticket_quantity: ticketQuantity,
//           message:
//             ticketMessage || `Request for ${ticketQuantity} ticket(s)`,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const isSuccess = 
//         response.data.success === true || 
//         response.data.status === true || 
//         response.data.message?.toLowerCase().includes("success");

//       if (isSuccess) {
//         const whatsappNumber = getWhatsAppNumber();
//         showToast(`Ticket request submitted! Opening WhatsApp to ${whatsappNumber}...`, "success");
        
//         setTicketModalVisible(false);
//         setTicketQuantity(1);
//         setTicketMessage("");
        
//         fetchMyRequestCount();
//         fetchMyTicketCount();
//         fetchTotalTicketsInGame();
        
//         setTimeout(() => {
//           redirectToWhatsApp();
//         }, 1000);
        
//         setTimeout(() => {
//           navigation.navigate("TicketRequestsScreen", { 
//             gameId: game.id,
//             gameName: game.game_name 
//           });
//         }, 4000);
//       } else {
//         const errorMessage = response.data.message || 
//                             response.data.error || 
//                             "Failed to submit request";
//         showToast(errorMessage, "error");
//       }
//     } catch (error) {
//       console.log("Request error:", error.response?.data || error.message);
      
//       let errorMessage = "Failed to submit ticket request. Please try again.";
      
//       if (error.response) {
//         errorMessage = error.response.data?.message || 
//                       error.response.data?.error || 
//                       `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = "No response from server. Please check your connection.";
//       }
      
//       showToast(errorMessage, "error");
//     } finally {
//       setRequestLoading(false);
//     }
//   };

//   const navigateToTickets = () => {
//     navigation.navigate("TicketsScreen", { game });
//   };

//   const navigateToMyRequests = () => {
//     navigation.navigate("TicketRequestsScreen", { 
//       gameId: game.id,
//       gameName: game.game_name 
//     });
//   };

//   const handleJoinGameRoom = () => {
//     if (gameStatus?.status === 'scheduled') {
//       showToast("Game has not started yet!", "info");
//       return;
//     }
    
//     if (hasJoinedRoom) {
//       navigation.navigate("UserGameRoom", { 
//         gameId: game.id,
//         gameName: game.game_name,
//         gameStatus: gameStatus?.status
//       });
//     } else {
//       updateGameRoomStatus();
//     }
//   };

//   const renderTicketLimitInfo = () => {
//     const remaining = getRemainingTickets();
//     const hasLimit = hasReachedTicketLimit();
    
//     return (
//       <View style={[
//         styles.ticketLimitContainer,
//         hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
//       ]}>
//         <View style={[styles.ticketLimitIcon, { backgroundColor: `${hasLimit ? COLORS.red : COLORS.primary}15` }]}>
//           <Ionicons 
//             name={hasLimit ? "alert-circle" : "ticket"} 
//             size={16} 
//             color={hasLimit ? COLORS.red : COLORS.primary} 
//           />
//         </View>
//         <View style={styles.ticketLimitInfo}>
//           <Text style={[
//             styles.ticketLimitTitle,
//             hasLimit && { color: COLORS.red }
//           ]}>
//             {hasLimit ? "Ticket Limit Reached" : "Ticket Limit"}
//           </Text>
//           <Text style={styles.ticketLimitText}>
//             {hasLimit 
//               ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
//               : `You have ${myTicketCount} allocated + ${myRequestCount} pending = ${totalTicketsInGame}/4 tickets`
//             }
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const getRemainingTickets = () => {
//     return MAX_TICKETS_PER_USER - totalTicketsInGame;
//   };

//   const hasReachedTicketLimit = () => {
//     return totalTicketsInGame >= MAX_TICKETS_PER_USER;
//   };

//   const canRequestTickets = () => {
//     const remaining = getRemainingTickets();
//     return ticketQuantity <= remaining && remaining > 0;
//   };

//   const handleScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//     { useNativeDriver: false }
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       <Toast />
      
//       {/* Animated Color Blocks */}
//       <AnimatedBackground />
      
//       <Animated.ScrollView
//         style={styles.container}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={COLORS.primary}
//             colors={[COLORS.primary]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Enhanced Header */}
//         <Header />

//         <View style={styles.content}>
//           {/* STATUS CARD */}
//           <View style={styles.card}>
//             <CardBackground accentColor={gameStatus?.status === 'live' ? COLORS.green : gameStatus?.status === 'completed' ? COLORS.red : COLORS.orange} />
            
//             <View style={styles.cardHeader}>
//               <View style={styles.gameIconContainer}>
//                 <View style={[styles.gameIconWrapper, { backgroundColor: `${COLORS.primary}15` }]}>
//                   <MaterialIcons name="confirmation-number" size={28} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.cardTitleContainer}>
//                   <Text style={styles.cardTitle}>
//                     {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
//                       ? 'Game Status' 
//                       : 'Game Schedule'
//                     }
//                   </Text>
//                 </View>
//               </View>
//             </View>
            
//             {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
//               <View>
//                 <Text style={styles.cardDescription}>
//                   {gameStatus?.status === 'live'
//                     ? "The game is now live! Number calling has started."
//                     : "Game has been completed. You can still view the game room."
//                   }
//                 </Text>
//                 {callingStatus?.is_running ? (
//                   <View style={styles.statsContainer}>
//                     <View style={styles.statItem}>
//                       <View style={[styles.statIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                         <Ionicons name="megaphone" size={18} color={COLORS.primary} />
//                       </View>
//                       <Text style={styles.statValue}>{calledNumbers.length}</Text>
//                       <Text style={styles.statLabel}>Called</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                       <View style={[styles.statIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                         <Ionicons name="time" size={18} color={COLORS.orange} />
//                       </View>
//                       <Text style={styles.statValue}>{timer}s</Text>
//                       <Text style={styles.statLabel}>Next Call</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                       <View style={[styles.statIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                         <Ionicons name="grid" size={18} color={COLORS.purple} />
//                       </View>
//                       <Text style={styles.statValue}>{90 - calledNumbers.length}</Text>
//                       <Text style={styles.statLabel}>Remaining</Text>
//                     </View>
//                   </View>
//                 ) : gameStatus?.status === 'completed' ? (
//                   <View style={styles.statsContainer}>
//                     <View style={styles.statItem}>
//                       <View style={[styles.statIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                         <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
//                       </View>
//                       <Text style={styles.statValue}>{calledNumbers.length}</Text>
//                       <Text style={styles.statLabel}>Total Called</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                       <View style={[styles.statIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                         <Ionicons name="trophy" size={18} color={COLORS.orange} />
//                       </View>
//                       <Text style={styles.statValue}>Completed</Text>
//                       <Text style={styles.statLabel}>Status</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                       <View style={[styles.statIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                         <Ionicons name="time" size={18} color={COLORS.purple} />
//                       </View>
//                       <Text style={styles.statValue}>{game.game_start_time}</Text>
//                       <Text style={styles.statLabel}>Started At</Text>
//                     </View>
//                   </View>
//                 ) : (
//                   <Text style={styles.waitingText}>
//                     Number calling will start soon...
//                   </Text>
//                 )}
                
//                 {gameStatus?.status === 'completed' ? (
//                   <View>
//                     {/* View Game Room Button */}
//                     <TouchableOpacity
//                       style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
//                       onPress={handleJoinGameRoom}
//                       disabled={joiningRoom}
//                     >
//                       {joiningRoom ? (
//                         <ActivityIndicator size="small" color="#FFFFFF" />
//                       ) : (
//                         <>
//                           <Ionicons name="eye" size={18} color="#FFFFFF" />
//                           <Text style={styles.primaryButtonText}>
//                             {hasJoinedRoom ? "View Game Room" : "View Completed Game"}
//                           </Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
                    
//                     {/* Game Results Button */}
//                     <TouchableOpacity
//                       style={styles.secondaryButton}
//                       onPress={() => navigation.navigate("UserGameResult", { 
//                         gameId: game.id,
//                         gameName: game.game_name 
//                       })}
//                     >
//                       <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
//                       <Text style={styles.secondaryButtonText}>Game Results</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <TouchableOpacity
//                     style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
//                     onPress={handleJoinGameRoom}
//                     disabled={joiningRoom}
//                   >
//                     {joiningRoom ? (
//                       <ActivityIndicator size="small" color="#FFFFFF" />
//                     ) : (
//                       <>
//                         <Ionicons name="enter" size={18} color="#FFFFFF" />
//                         <Text style={styles.primaryButtonText}>
//                           {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
//                         </Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 )}
//               </View>
//             ) : (
//               <View>
//                 <Text style={styles.cardDescription}>
//                   Game is scheduled to start on {new Date(game.game_date).toLocaleDateString("en-US", {
//                     weekday: "long",
//                     month: "long",
//                     day: "numeric",
//                     year: "numeric"
//                   })} at {game.game_start_time}
//                 </Text>
//                 <View style={styles.scheduledBadgeContainer}>
//                   <Ionicons name="calendar" size={18} color={COLORS.primary} />
//                   <Text style={styles.scheduledBadgeText}>
//                     Game is Scheduled
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* GAME DETAILS CARD */}
//           <View style={styles.card}>
//             <CardBackground accentColor={COLORS.purple} />
            
//             <View style={styles.sectionHeader}>
//               <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                 <Ionicons name="game-controller" size={20} color={COLORS.purple} />
//               </View>
//               <Text style={styles.sectionTitle}>Game Details</Text>
//             </View>

//             <View style={styles.detailGrid}>
//               <View style={styles.detailItem}>
//                 <View style={[styles.detailIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                   <Ionicons name="calendar" size={14} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.detailContent}>
//                   <Text style={styles.detailLabel}>Date</Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {new Date(game.game_date).toLocaleDateString("en-US", {
//                       weekday: "short",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.detailItem}>
//                 <View style={[styles.detailIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                   <Ionicons name="time" size={14} color={COLORS.orange} />
//                 </View>
//                 <View style={styles.detailContent}>
//                   <Text style={styles.detailLabel}>Time</Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {game.game_start_time}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.detailGrid}>
//               <View style={styles.detailItem}>
//                 <View style={[styles.detailIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                   <MaterialIcons name="account-balance-wallet" size={14} color={COLORS.purple} />
//                 </View>
//                 <View style={styles.detailContent}>
//                   <Text style={styles.detailLabel}>Prize Pool</Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {game.ticket_type === "paid"
//                       ? `₹${(game.ticket_cost * game.max_players).toLocaleString()}`
//                       : "Exciting Prizes"}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.detailItem}>
//                 <View style={[styles.detailIcon, { backgroundColor: `${COLORS.teal}15` }]}>
//                   <Ionicons name="person" size={14} color={COLORS.teal} />
//                 </View>
//                 <View style={styles.detailContent}>
//                   <Text style={styles.detailLabel}>Host</Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {game.user?.name || 'Tambola Timez'}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.detailItem}>
//               <View style={[styles.detailIcon, { backgroundColor: `${COLORS.green}15` }]}>
//                 <Ionicons name="call" size={14} color={COLORS.green} />
//               </View>
//               <View style={styles.detailContent}>
//                 <Text style={styles.detailLabel}>Host Contact</Text>
//                 <Text style={styles.detailValue} numberOfLines={1}>
//                   {getWhatsAppNumber()}
//                 </Text>
//               </View>
//             </View>

//             {renderTicketLimitInfo()}

//             <View style={styles.myCountContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.countButton,
//                   myTicketCount > 0 && styles.countButtonActive,
//                 ]}
//                 onPress={navigateToTickets}
//               >
//                 <View style={[styles.countIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                   <Ionicons name="ticket" size={18} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.countInfo}>
//                   <Text style={styles.countLabel}>My Tickets</Text>
//                   <Text style={[
//                     styles.countValue,
//                     myTicketCount > 0 ? styles.countValueActive : styles.countValueInactive,
//                   ]}>
//                     {myTicketCount > 0
//                       ? `${myTicketCount} Ticket${myTicketCount > 1 ? "s" : ""}`
//                       : "No Tickets"}
//                   </Text>
//                 </View>
//                 {myTicketCount > 0 && (
//                   <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.countButton,
//                   myRequestCount > 0 && styles.countButtonActive,
//                 ]}
//                 onPress={navigateToMyRequests}
//               >
//                 <View style={[styles.countIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                   <Ionicons name="list-circle" size={18} color={COLORS.orange} />
//                 </View>
//                 <View style={styles.countInfo}>
//                   <Text style={styles.countLabel}>My Requests</Text>
//                   <Text style={[
//                     styles.countValue,
//                     myRequestCount > 0 ? styles.countValueActive : styles.countValueInactive,
//                   ]}>
//                     {myRequestCount > 0
//                       ? `${myRequestCount} Request${myRequestCount > 1 ? "s" : ""}`
//                       : "No Requests"}
//                   </Text>
//                 </View>
//                 {myRequestCount > 0 && (
//                   <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
//                 )}
//               </TouchableOpacity>
//             </View>

//             {game.message && (
//               <View style={styles.messageCard}>
//                 <View style={[styles.messageIcon, { backgroundColor: `${COLORS.primary}10` }]}>
//                   <MaterialIcons name="message" size={16} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.messageContent}>
//                   <Text style={styles.messageTitle}>Host Message</Text>
//                   <Text style={styles.messageText}>{game.message}</Text>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* ACTIONS CARD */}
//           <View style={styles.card}>
//             <CardBackground accentColor={COLORS.orange} />
            
//             <View style={styles.sectionHeader}>
//               <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                 <Ionicons name="flash" size={20} color={COLORS.orange} />
//               </View>
//               <Text style={styles.sectionTitle}>Actions</Text>
//             </View>

//             <View style={styles.actionsContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   styles.primaryActionButton,
//                   (hasReachedTicketLimit() || loading) && styles.buttonDisabled,
//                 ]}
//                 onPress={() => {
//                   if (!hasReachedTicketLimit()) {
//                     setTicketModalVisible(true);
//                   } else {
//                     showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
//                   }
//                 }}
//                 disabled={hasReachedTicketLimit() || loading}
//               >
//                 <Ionicons name="add-circle" size={20} color="#FFFFFF" />
//                 <Text style={styles.actionButtonText}>
//                   {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
//                 </Text>
//               </TouchableOpacity>

//               <View style={styles.actionRow}>
//                 <TouchableOpacity
//                   style={[
//                     styles.actionSecondary,
//                     myTicketCount === 0 && styles.buttonDisabled,
//                   ]}
//                   onPress={navigateToTickets}
//                   disabled={myTicketCount === 0}
//                 >
//                   <View style={[styles.actionSecondaryIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                     <Ionicons name="ticket" size={18} color={COLORS.primary} />
//                   </View>
//                   <Text style={styles.actionSecondaryText}>My Tickets</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.actionSecondary,
//                     myRequestCount === 0 && styles.buttonDisabled,
//                   ]}
//                   onPress={navigateToMyRequests}
//                   disabled={myRequestCount === 0}
//                 >
//                   <View style={[styles.actionSecondaryIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                     <Ionicons name="list-circle" size={18} color={COLORS.orange} />
//                   </View>
//                   <Text style={styles.actionSecondaryText}>My Requests</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           {/* REWARDS CARD */}
//           {game.pattern_rewards && game.pattern_rewards.length > 0 && (
//             <View style={styles.card}>
//               <CardBackground accentColor={COLORS.teal} />
              
//               <View style={styles.sectionHeader}>
//                 <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.teal}15` }]}>
//                   <Ionicons name="trophy" size={20} color={COLORS.teal} />
//                 </View>
//                 <Text style={styles.sectionTitle}>Game Rewards</Text>
//               </View>
              
//               {game.pattern_rewards.map((reward, index) => (
//                 <View key={reward.pattern_id} style={styles.rewardCard}>
//                   <View style={styles.rewardHeader}>
//                     <View style={[styles.rewardIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                       <MaterialIcons name="emoji-events" size={20} color={COLORS.primary} />
//                     </View>
//                     <View style={styles.rewardInfo}>
//                       <Text style={styles.rewardName} numberOfLines={1}>
//                         {reward.reward_name}
//                       </Text>
//                       <Text style={styles.rewardDescription} numberOfLines={2}>
//                         {reward.description}
//                       </Text>
//                     </View>
//                     <View style={styles.rewardAmount}>
//                       <Text style={styles.rewardAmountText}>₹{reward.amount}</Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.rewardFooter}>
//                     <View style={styles.rewardDetail}>
//                       <MaterialIcons name="confirmation-number" size={12} color={COLORS.textLight} />
//                       <Text style={styles.rewardDetailText}>
//                         Count: {reward.reward_count}
//                       </Text>
//                     </View>
//                     <View style={[styles.patternBadge, { backgroundColor: `${COLORS.primary}10` }]}>
//                       <Text style={[styles.patternBadgeText, { color: COLORS.primary }]}>
//                         Pattern {reward.pattern_id}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>

//         <View style={styles.bottomSpace} />
//       </Animated.ScrollView>

//       {/* TICKET MODAL */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={ticketModalVisible}
//         onRequestClose={() => setTicketModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <CardBackground accentColor={COLORS.primary} />
            
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Request Tickets</Text>
//               <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
//                 <Ionicons name="close" size={22} color={COLORS.text} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalGameInfo}>
//               <Text style={styles.modalGameName} numberOfLines={2}>
//                 {game.game_name}
//               </Text>
//               <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
//               <View style={styles.modalTicketCost}>
//                 <Text style={styles.modalTicketCostText}>
//                   Ticket Price: {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
//                 </Text>
//               </View>
//               <View style={styles.modalHostInfo}>
//                 <Text style={styles.modalHostText}>
//                   Host: {game.user?.name || "Game Host"} ({getWhatsAppNumber()})
//                 </Text>
//               </View>
//             </View>

//             <View style={[
//               styles.modalLimitInfo,
//               hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
//             ]}>
//               <Ionicons 
//                 name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
//                 size={16} 
//                 color={hasReachedTicketLimit() ? COLORS.red : COLORS.primary} 
//               />
//               <Text style={styles.modalLimitText}>
//                 {hasReachedTicketLimit() 
//                   ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
//                   : `You can request up to ${getRemainingTickets()} more ticket(s)`
//                 }
//               </Text>
//             </View>

//             <View style={styles.quantitySection}>
//               <Text style={styles.quantityLabel}>Select Quantity (1-4)</Text>
//               <View style={styles.quantitySelector}>
//                 {[1, 2, 3, 4].map((num) => {
//                   const canSelect = num <= getRemainingTickets() && !hasReachedTicketLimit();
//                   return (
//                     <TouchableOpacity
//                       key={num}
//                       style={[
//                         styles.quantityButton,
//                         ticketQuantity === num && styles.quantityButtonActive,
//                         !canSelect && styles.quantityButtonDisabled,
//                       ]}
//                       onPress={() => canSelect && setTicketQuantity(num)}
//                       disabled={!canSelect}
//                     >
//                       <Text
//                         style={[
//                           styles.quantityButtonText,
//                           ticketQuantity === num && styles.quantityButtonTextActive,
//                           !canSelect && styles.quantityButtonTextDisabled,
//                         ]}
//                       >
//                         {num}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>

//             {game.ticket_type === "paid" && (
//               <View style={styles.totalSection}>
//                 <View style={styles.totalLabelContainer}>
//                   <Ionicons name="wallet" size={18} color={COLORS.primary} />
//                   <Text style={styles.totalLabel}>Total Amount:</Text>
//                 </View>
//                 <Text style={styles.totalAmount} numberOfLines={1}>
//                   ₹{game.ticket_cost * ticketQuantity}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.messageSection}>
//               <Text style={styles.messageLabel}>Message (Optional)</Text>
//               <TextInput
//                 style={styles.messageInput}
//                 value={ticketMessage}
//                 onChangeText={setTicketMessage}
//                 placeholder="Add a message for the host..."
//                 multiline
//                 numberOfLines={3}
//                 maxLength={200}
//                 placeholderTextColor={COLORS.textLight}
//               />
//               <Text style={styles.charCount}>
//                 {ticketMessage.length}/200 characters
//               </Text>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setTicketModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.buttonDisabled,
//                 ]}
//                 onPress={handleRequestTickets}
//                 disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
//               >
//                 {requestLoading ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <>
//                     <Ionicons name="send" size={16} color="#FFFFFF" />
//                     <Text style={styles.submitButtonText}>
//                       {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
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
//   },
  
//   /* COLOR BLOCKS - Animated */
//   blueBlock1: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 280,
//     backgroundColor: COLORS.blockLightBlue,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//   },
//   blueBlock2: {
//     position: 'absolute',
//     top: 200,
//     left: 0,
//     right: 0,
//     height: 160,
//     backgroundColor: COLORS.blockMediumBlue,
//   },
//   blueBlock3: {
//     position: 'absolute',
//     top: 300,
//     left: 0,
//     right: 0,
//     height: 100,
//     backgroundColor: COLORS.blockDarkBlue,
//     opacity: 0.3,
//   },
  
//   /* Card Background */
//   cardBackground: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: 20,
//   },
  
//   /* Decorative circles */
//   cardDecorativeCircle: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     opacity: 0.08,
//   },
//   circle1: {
//     top: -30,
//     right: -30,
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   circle2: {
//     bottom: -20,
//     left: -20,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     opacity: 0.06,
//   },
//   circle3: {
//     top: '40%',
//     left: '30%',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     opacity: 0.05,
//   },
  
//   /* Floating particles */
//   floatingParticle: {
//     position: 'absolute',
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     opacity: 0.12,
//   },
//   particle1: {
//     top: 20,
//     right: 40,
//     width: 6,
//     height: 6,
//   },
//   particle2: {
//     bottom: 30,
//     left: 50,
//     width: 5,
//     height: 5,
//   },
//   particle3: {
//     top: '60%',
//     right: 60,
//     width: 7,
//     height: 7,
//   },
//   particle4: {
//     bottom: '20%',
//     left: 80,
//     width: 4,
//     height: 4,
//   },
  
//   /* Toast */
//   toast: {
//     position: 'absolute',
//     top: 60,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     zIndex: 999,
//   },
//   toastText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//     marginLeft: 10,
//     flex: 1,
//   },
  
//   /* Enhanced Header */
//   headerWrapper: {
//     position: 'relative',
//     marginTop: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//     paddingHorizontal: 16,
//   },
  
//   semicircleBackground: {
//     position: 'absolute',
//     top: -40,
//     right: -30,
//     width: 200,
//     height: 200,
//     overflow: 'hidden',
//   },
//   semicircle: {
//     position: 'absolute',
//     width: 400,
//     height: 200,
//     backgroundColor: COLORS.primaryLight,
//     borderTopLeftRadius: 200,
//     borderTopRightRadius: 200,
//     transform: [{ rotate: '-15deg' }],
//     opacity: 0.3,
//   },
  
//   ukPatternContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
  
//   curvedLine1: {
//     position: 'absolute',
//     top: 20,
//     right: 50,
//     width: 80,
//     height: 40,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderTopWidth: 0,
//     borderRightWidth: 0,
//     borderRadius: 40,
//     opacity: 0.15,
//     transform: [{ rotate: '-10deg' }],
//   },
//   curvedLine2: {
//     position: 'absolute',
//     bottom: 10,
//     left: 30,
//     width: 60,
//     height: 30,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderBottomWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 30,
//     opacity: 0.15,
//     transform: [{ rotate: '15deg' }],
//   },
//   curvedLine3: {
//     position: 'absolute',
//     top: 40,
//     left: 100,
//     width: 100,
//     height: 50,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderTopWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 50,
//     opacity: 0.1,
//     transform: [{ rotate: '20deg' }],
//   },
  
//   parallelLines: {
//     position: 'absolute',
//     top: 30,
//     left: 20,
//   },
//   parallelLine: {
//     width: 80,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     marginVertical: 4,
//     borderRadius: 1,
//   },
  
//   dottedCircle1: {
//     position: 'absolute',
//     bottom: 20,
//     right: 30,
//     width: 60,
//     height: 60,
//   },
//   dottedCircleDot: {
//     position: 'absolute',
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.2,
//     top: 28,
//     left: 28,
//   },
  
//   decorativeDot1: {
//     position: 'absolute',
//     top: 60,
//     right: 80,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.primary,
//     opacity: 0.2,
//   },
//   decorativeDot2: {
//     position: 'absolute',
//     bottom: 40,
//     left: 150,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//     opacity: 0.15,
//   },
//   decorativeLine1: {
//     position: 'absolute',
//     top: 10,
//     left: 150,
//     width: 40,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     borderRadius: 1,
//     transform: [{ rotate: '30deg' }],
//   },
//   decorativeLine2: {
//     position: 'absolute',
//     bottom: 30,
//     right: 100,
//     width: 50,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     borderRadius: 1,
//     transform: [{ rotate: '-20deg' }],
//   },
  
//   /* Header Content */
//   headerContent: {
//     position: 'relative',
//     zIndex: 2,
//     marginTop:7
//   },
//   headerTopRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerGameName: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   headerGameCode: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   headerGameCodeText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   statusBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 11,
//     fontWeight: '600',
//   },
  
//   /* Content */
//   content: {
//     paddingHorizontal: 16,
//   },
  
//   /* Cards */
//   card: {
//     borderRadius: 20,
//     padding: 16,
//     marginBottom: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
  
//   /* Card Header */
//   cardHeader: {
//     marginBottom: 12,
//   },
//   gameIconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   gameIconWrapper: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardTitleContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.text,
//   },
//   cardDescription: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     lineHeight: 18,
//     marginBottom: 12,
//   },
  
//   /* Stats */
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     gap: 8,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 10,
//   },
//   statIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   statValue: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
  
//   /* Buttons */
//   primaryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     marginBottom: 8,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   secondaryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.background,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   secondaryButtonText: {
//     color: COLORS.primary,
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
  
//   /* Scheduled Badge */
//   scheduledBadgeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.background,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   scheduledBadgeText: {
//     color: COLORS.primary,
//     fontSize: 14,
//     fontWeight: "600",
//   },
  
//   /* Section Header */
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.text,
//   },
  
//   /* Details */
//   detailGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//     gap: 8,
//   },
//   detailItem: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 8,
//   },
//   detailIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   detailContent: {
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 12,
//     color: COLORS.text,
//     fontWeight: "600",
//   },
  
//   /* Ticket Limit */
//   ticketLimitContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 12,
//     borderWidth: 1,
//     gap: 10,
//   },
//   ticketLimitReached: {
//     backgroundColor: COLORS.redLight,
//     borderColor: COLORS.red,
//   },
//   ticketLimitAvailable: {
//     backgroundColor: COLORS.primaryLight,
//     borderColor: COLORS.primary,
//   },
//   ticketLimitIcon: {
//     width: 30,
//     height: 30,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   ticketLimitInfo: {
//     flex: 1,
//   },
//   ticketLimitTitle: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   ticketLimitText: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     lineHeight: 14,
//   },
  
//   /* Count Buttons */
//   myCountContainer: {
//     gap: 8,
//     marginBottom: 12,
//   },
//   countButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.background,
//     gap: 10,
//   },
//   countButtonActive: {
//     borderColor: COLORS.primary,
//     backgroundColor: COLORS.surface,
//   },
//   countIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   countInfo: {
//     flex: 1,
//   },
//   countLabel: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   countValue: {
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   countValueActive: {
//     color: COLORS.text,
//   },
//   countValueInactive: {
//     color: COLORS.textLight,
//   },
  
//   /* Message Card */
//   messageCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: COLORS.background,
//     borderRadius: 10,
//     padding: 12,
//     gap: 10,
//   },
//   messageIcon: {
//     width: 30,
//     height: 30,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   messageContent: {
//     flex: 1,
//   },
//   messageTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 4,
//   },
//   messageText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     lineHeight: 16,
//   },
  
//   /* Actions */
//   actionsContainer: {
//     gap: 10,
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//   },
//   primaryActionButton: {
//     backgroundColor: COLORS.primary,
//   },
//   actionButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   actionRow: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   actionSecondary: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.background,
//     paddingVertical: 10,
//     borderRadius: 10,
//     gap: 6,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   actionSecondaryIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionSecondaryText: {
//     color: COLORS.text,
//     fontSize: 12,
//     fontWeight: "600",
//   },
  
//   /* Reward Card */
//   rewardCard: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   rewardHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//     marginBottom: 8,
//   },
//   rewardIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   rewardInfo: {
//     flex: 1,
//   },
//   rewardName: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   rewardDescription: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     lineHeight: 14,
//   },
//   rewardAmount: {
//     minWidth: 50,
//   },
//   rewardAmountText: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.primary,
//     textAlign: 'right',
//   },
//   rewardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   rewardDetail: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   rewardDetailText: {
//     fontSize: 10,
//     color: COLORS.textLight,
//   },
//   patternBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   patternBadgeText: {
//     fontSize: 9,
//     fontWeight: "600",
//   },
  
//   /* Waiting Text */
//   waitingText: {
//     fontSize: 13,
//     color: COLORS.primary,
//     fontStyle: "italic",
//     marginBottom: 16,
//     textAlign: "center",
//   },
  
//   /* Modal */
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//   },
//   modalContainer: {
//     width: "100%",
//     maxWidth: 380,
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     padding: 20,
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     zIndex: 2,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.text,
//   },
//   modalGameInfo: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     zIndex: 2,
//   },
//   modalGameName: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 4,
//   },
//   modalGameId: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     marginBottom: 6,
//   },
//   modalTicketCost: {
//     marginBottom: 4,
//   },
//   modalTicketCostText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.primary,
//   },
//   modalHostInfo: {
//     marginTop: 2,
//   },
//   modalHostText: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   modalLimitInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//     gap: 8,
//     borderWidth: 1,
//     zIndex: 2,
//   },
//   modalLimitReached: {
//     backgroundColor: COLORS.redLight,
//     borderColor: COLORS.red,
//   },
//   modalLimitAvailable: {
//     backgroundColor: COLORS.primaryLight,
//     borderColor: COLORS.primary,
//   },
//   modalLimitText: {
//     flex: 1,
//     fontSize: 12,
//     color: COLORS.textLight,
//     lineHeight: 16,
//   },
  
//   /* Quantity Selector */
//   quantitySection: {
//     marginBottom: 16,
//     zIndex: 2,
//   },
//   quantityLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 10,
//   },
//   quantitySelector: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   quantityButton: {
//     width: 58,
//     height: 58,
//     borderRadius: 12,
//     backgroundColor: COLORS.background,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   quantityButtonActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   quantityButtonDisabled: {
//     backgroundColor: COLORS.background,
//     opacity: 0.5,
//   },
//   quantityButtonText: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.text,
//   },
//   quantityButtonTextActive: {
//     color: "#FFFFFF",
//   },
//   quantityButtonTextDisabled: {
//     color: COLORS.textLight,
//     textDecorationLine: 'line-through',
//   },
  
//   /* Total Section */
//   totalSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     zIndex: 2,
//   },
//   totalLabelContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   totalLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   totalAmount: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: COLORS.primary,
//   },
  
//   /* Message Section */
//   messageSection: {
//     marginBottom: 20,
//     zIndex: 2,
//   },
//   messageLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   messageInput: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 13,
//     minHeight: 80,
//     textAlignVertical: "top",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     color: COLORS.text,
//   },
//   charCount: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     textAlign: "right",
//     marginTop: 4,
//   },
  
//   /* Modal Actions */
//   modalActions: {
//     flexDirection: "row",
//     gap: 10,
//     zIndex: 2,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   cancelButtonText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.textLight,
//   },
//   submitButton: {
//     flex: 2,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//     backgroundColor: COLORS.primary,
//   },
//   submitButtonText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
  
//   /* Bottom Space */
//   bottomSpace: {
//     height: 20,
//   },
// });

// export default GameDetails;








import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Linking,
  Platform,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// For React Native CLI, use react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

// Color palette matching Game component
const COLORS = {
  background: '#F0F7FF',
  surface: '#FFFFFF',
  primary: '#2E5BFF', // Vibrant blue
  primaryLight: '#E1EBFF',
  primaryDark: '#1A3A9E',
  accent: '#3B82F6', // Medium blue for accents
  secondary: '#60A5FA', // Light blue
  tertiary: '#2563EB', // Darker blue for contrast
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  
  // Card background variants
  cardBlue1: '#E8F0FE',
  cardBlue2: '#D4E4FF',
  cardBlue3: '#C2D6FF',
  cardBlue4: '#E3F2FD',
  cardBlue5: '#E6F0FA',
  
  // Accent colors
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  orange: '#F97316',
  orangeLight: '#FFF3E6',
  pink: '#EC4899',
  pinkLight: '#FCE8F0',
  teal: '#14B8A6',
  tealLight: '#D5F5F0',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  
  // Block colors - Blue shades
  blockLightBlue: '#E1EBFF',
  blockMediumBlue: '#C2D6FF',
  blockDarkBlue: '#A3C1FF',
};

const GameDetails = ({ route, navigation }) => {
  const { game } = route.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketMessage, setTicketMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [myTicketCount, setMyTicketCount] = useState(0);
  const [myRequestCount, setMyRequestCount] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [callingStatus, setCallingStatus] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [totalTicketsInGame, setTotalTicketsInGame] = useState(0);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const MAX_TICKETS_PER_USER = 4;

  // Different accent colors for cards
  const accentColors = [COLORS.primary, COLORS.purple, COLORS.orange, COLORS.teal, COLORS.pink];

  useEffect(() => {
    startAnimations();
    fetchAllData();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllData();
      setJoiningRoom(false);
      setHasJoinedRoom(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Animated background that moves with scroll
  const AnimatedBackground = () => {
    const block1TranslateY = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [0, -50],
      extrapolate: 'clamp'
    });

    const block2TranslateY = scrollY.interpolate({
      inputRange: [0, 400],
      outputRange: [0, -30],
      extrapolate: 'clamp'
    });

    const block3TranslateY = scrollY.interpolate({
      inputRange: [0, 500],
      outputRange: [0, -20],
      extrapolate: 'clamp'
    });

    const opacity = scrollY.interpolate({
      inputRange: [0, 200, 400],
      outputRange: [1, 0.8, 0.6],
      extrapolate: 'clamp'
    });

    return (
      <>
        <Animated.View 
          style={[
            styles.blueBlock1,
            {
              transform: [{ translateY: block1TranslateY }],
              opacity
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.blueBlock2,
            {
              transform: [{ translateY: block2TranslateY }],
              opacity: opacity.interpolate({
                inputRange: [0.6, 1],
                outputRange: [0.4, 0.8]
              })
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.blueBlock3,
            {
              transform: [{ translateY: block3TranslateY }],
              opacity: opacity.interpolate({
                inputRange: [0.6, 1],
                outputRange: [0.2, 0.5]
              })
            }
          ]} 
        />
      </>
    );
  };

  // Card Background with only circles
  const CardBackground = ({ accentColor = COLORS.primary }) => (
    <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
      {/* Decorative circles */}
      <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
      <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
      <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
      {/* Floating particles */}
      <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
      <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
      <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
      <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
    </View>
  );

  // Enhanced Header with UK pattern
  const Header = () => (
    <View style={styles.headerWrapper}>
      {/* Semicircle Background */}
      <View style={styles.semicircleBackground}>
        <View style={styles.semicircle} />
      </View>
      
      {/* UK-style Rounded Lines Pattern */}
      <View style={styles.ukPatternContainer}>
        <View style={styles.curvedLine1} />
        <View style={styles.curvedLine2} />
        <View style={styles.curvedLine3} />
        
        <View style={styles.parallelLines}>
          <View style={styles.parallelLine} />
          <View style={styles.parallelLine} />
          <View style={styles.parallelLine} />
        </View>
        
        <View style={styles.dottedCircle1}>
          {[...Array(8)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dottedCircleDot,
                {
                  transform: [
                    { rotate: `${i * 45}deg` },
                    { translateX: 30 }
                  ]
                }
              ]} 
            />
          ))}
        </View>
        
        <View style={styles.decorativeDot1} />
        <View style={styles.decorativeDot2} />
        <View style={styles.decorativeLine1} />
        <View style={styles.decorativeLine2} />
      </View>

      {/* Header Content */}
      <View style={styles.headerContent}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerGameName} numberOfLines={1}>
              {game.game_name}
            </Text>
            <View style={styles.headerGameCode}>
              <MaterialIcons name="fingerprint" size={12} color={COLORS.textLight} />
              <Text style={styles.headerGameCodeText}>{game.game_code}</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { 
            backgroundColor: gameStatus?.status === 'live' 
              ? COLORS.green 
              : gameStatus?.status === 'completed'
              ? COLORS.red
              : COLORS.orange
          }]}>
            <Text style={styles.statusBadgeText}>
              {gameStatus?.status?.toUpperCase() || 'LOADING'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const startAnimations = () => {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
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

  const getWhatsAppNumber = () => {
    if (game.host_mobile) {
      return game.host_mobile;
    }
    if (game.user?.mobile) {
      return game.user.mobile;
    }
    return "8007395749";
  };

  const createWhatsAppMessage = () => {
    const gameDate = new Date(game.game_date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    
    const gameType = game.ticket_type === "paid" ? "Paid Game" : "Free Game";
    const ticketCost = game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE";
    const totalAmount = game.ticket_type === "paid" ? `₹${game.ticket_cost * ticketQuantity}` : "FREE";
    const hostName = game.user?.name || "Game Host";
    
    return `🎯 *TAMBOOLA TICKET REQUEST* 🎯

🎮 *Game Details:*
• Game Name: ${game.game_name}
• Game ID: ${game.game_code}
• Date: ${gameDate} ${game.game_start_time}
• Type: ${gameType} ${ticketCost !== "FREE" ? `(${ticketCost} per ticket)` : ""}
• Host: ${hostName}

🎫 *Ticket Request:*
• Quantity: ${ticketQuantity} ticket${ticketQuantity > 1 ? "s" : ""}
• Total Amount: ${totalAmount}

📝 *Additional Message:*
${ticketMessage || "Please approve my ticket request. Looking forward to the game!"}

💰 *Payment Information:*
• UPI ID: ${getWhatsAppNumber()}@ybl
• PhonePe/Paytm: ${getWhatsAppNumber()}
• Please send payment screenshot with your name

✅ *Confirmation Required:*
Please confirm my ticket allocation and share payment details if needed.

Thank you! 🙏
Looking forward to playing Tambola! 🎲🎉`;
  };

  const redirectToWhatsApp = () => {
    const whatsappNumber = getWhatsAppNumber();
    const message = createWhatsAppMessage();
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          const webWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((error) => {
        console.log("Error opening WhatsApp:", error);
        Alert.alert(
          "Error",
          "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
          [{ text: "OK" }]
        );
      });
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchGameStatus(),
        fetchMyTicketCount(),
        fetchMyRequestCount(),
        fetchTotalTicketsInGame()
      ]);
    } catch (error) {
      console.log("Error fetching all data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const Toast = () => {
    if (!toast.visible) return null;
    
    const backgroundColor = toast.type === "success" ? COLORS.green : COLORS.red;
    
    useEffect(() => {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <View style={[styles.toast, { backgroundColor }]}>
        <Ionicons 
          name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
          size={20} 
          color="#FFFFFF" 
        />
        <Text style={styles.toastText}>{toast.message}</Text>
      </View>
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchGameStatus(), 
      fetchMyTicketCount(), 
      fetchMyRequestCount(),
      fetchTotalTicketsInGame()
    ]).finally(() =>
      setRefreshing(false)
    );
  }, []);

  const fetchGameStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setGameStatus(data.game);
        setCallingStatus(data.calling);
        setCalledNumbers(data.numbers?.called_numbers || []);
        
        if (data.calling?.is_running && !data.calling?.is_paused) {
          setTimer(data.calling?.interval_seconds || 60);
        }
      }
    } catch (error) {
      console.log("Error fetching game status:", error);
    }
  };

  const fetchMyTicketCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const gameTickets = res.data.tickets.data.filter(
          (ticket) => ticket.game_id == game.id
        );
        setMyTicketCount(gameTickets.length);
      }
    } catch (error) {
      console.log("Error fetching ticket count:", error);
    }
  };

  const fetchMyRequestCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const gameRequests = res.data.ticket_requests.data.filter(
          (request) => request.game_id === game.id
        );
        setMyRequestCount(gameRequests.length);
      }
    } catch (error) {
      console.log("Error fetching request count:", error);
    }
  };

  const fetchTotalTicketsInGame = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const ticketsRes = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const requestsRes = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (ticketsRes.data.success && requestsRes.data.success) {
        const allocatedTickets = ticketsRes.data.tickets.data.filter(
          (ticket) => ticket.game_id == game.id
        ).length;
        
        const pendingRequests = requestsRes.data.ticket_requests.data.filter(
          (request) => 
            request.game_id == game.id && 
            request.status === 'pending'
        ).length;
        
        const total = allocatedTickets + pendingRequests;
        setTotalTicketsInGame(total);
      }
    } catch (error) {
      console.log("Error fetching total tickets:", error);
    }
  };

  const updateGameRoomStatus = async () => {
    try {
      setJoiningRoom(true);
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/user/game-room/${game.id}/update-status`,
        {
          is_active: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setHasJoinedRoom(true);
        showToast("Joined game room successfully!", "success");
        navigation.navigate("UserGameRoom", { 
          gameId: game.id,
          gameName: game.game_name,
          gameStatus: gameStatus?.status
        });
        setJoiningRoom(false);
      } else {
        showToast(response.data.message || "Failed to join game room", "error");
        setJoiningRoom(false);
      }
    } catch (error) {
      console.log("Error updating game room status:", error.response?.data || error.message);
      showToast(
        error.response?.data?.message || "Failed to join game room. Please try again.",
        "error"
      );
      setJoiningRoom(false);
    }
  };

  const handleRequestTickets = async () => {
    if (hasReachedTicketLimit()) {
      showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
      return;
    }

    const remaining = getRemainingTickets();
    if (ticketQuantity > remaining) {
      showToast(`You can only request up to ${remaining} more ticket(s)`, "error");
      return;
    }

    if (ticketQuantity < 1 || ticketQuantity > 4) {
      showToast("Ticket quantity must be between 1 and 4", "error");
      return;
    }

    setRequestLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://tambolatime.co.in/public/api/user/ticket-requests/send",
        {
          game_id: game.id,
          ticket_quantity: ticketQuantity,
          message:
            ticketMessage || `Request for ${ticketQuantity} ticket(s)`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const isSuccess = 
        response.data.success === true || 
        response.data.status === true || 
        response.data.message?.toLowerCase().includes("success");

      if (isSuccess) {
        const whatsappNumber = getWhatsAppNumber();
        showToast(`Ticket request submitted! Opening WhatsApp to ${whatsappNumber}...`, "success");
        
        setTicketModalVisible(false);
        setTicketQuantity(1);
        setTicketMessage("");
        
        fetchMyRequestCount();
        fetchMyTicketCount();
        fetchTotalTicketsInGame();
        
        setTimeout(() => {
          redirectToWhatsApp();
        }, 1000);
        
        setTimeout(() => {
          navigation.navigate("TicketRequestsScreen", { 
            gameId: game.id,
            gameName: game.game_name 
          });
        }, 4000);
      } else {
        const errorMessage = response.data.message || 
                            response.data.error || 
                            "Failed to submit request";
        showToast(errorMessage, "error");
      }
    } catch (error) {
      console.log("Request error:", error.response?.data || error.message);
      
      let errorMessage = "Failed to submit ticket request. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      showToast(errorMessage, "error");
    } finally {
      setRequestLoading(false);
    }
  };

  const navigateToTickets = () => {
    navigation.navigate("TicketsScreen", { game });
  };

  const navigateToMyRequests = () => {
    navigation.navigate("TicketRequestsScreen", { 
      gameId: game.id,
      gameName: game.game_name 
    });
  };

  const handleJoinGameRoom = () => {
    if (gameStatus?.status === 'scheduled') {
      showToast("Game has not started yet!", "info");
      return;
    }
    
    if (hasJoinedRoom) {
      navigation.navigate("UserGameRoom", { 
        gameId: game.id,
        gameName: game.game_name,
        gameStatus: gameStatus?.status
      });
    } else {
      updateGameRoomStatus();
    }
  };

  const renderTicketLimitInfo = () => {
    const remaining = getRemainingTickets();
    const hasLimit = hasReachedTicketLimit();
    
    return (
      <View style={[
        styles.ticketLimitContainer,
        hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
      ]}>
        <View style={[styles.ticketLimitIcon, { backgroundColor: `${hasLimit ? COLORS.red : COLORS.primary}15` }]}>
          <Ionicons 
            name={hasLimit ? "alert-circle" : "ticket"} 
            size={16} 
            color={hasLimit ? COLORS.red : COLORS.primary} 
          />
        </View>
        <View style={styles.ticketLimitInfo}>
          <Text style={[
            styles.ticketLimitTitle,
            hasLimit && { color: COLORS.red }
          ]}>
            {hasLimit ? "Ticket Limit Reached" : "Ticket Limit"}
          </Text>
          <Text style={styles.ticketLimitText}>
            {hasLimit 
              ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
              : `You have ${myTicketCount} allocated + ${myRequestCount} pending = ${totalTicketsInGame}/4 tickets`
            }
          </Text>
        </View>
      </View>
    );
  };

  const getRemainingTickets = () => {
    return MAX_TICKETS_PER_USER - totalTicketsInGame;
  };

  const hasReachedTicketLimit = () => {
    return totalTicketsInGame >= MAX_TICKETS_PER_USER;
  };

  const canRequestTickets = () => {
    const remaining = getRemainingTickets();
    return ticketQuantity <= remaining && remaining > 0;
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <Toast />
      
      {/* Animated Color Blocks */}
      <AnimatedBackground />
      
      <Animated.ScrollView
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        <Header />

        <View style={styles.content}>
          {/* STATUS CARD */}
          <View style={styles.card}>
            <CardBackground accentColor={gameStatus?.status === 'live' ? COLORS.green : gameStatus?.status === 'completed' ? COLORS.red : COLORS.orange} />
            
            <View style={styles.cardHeader}>
              <View style={styles.gameIconContainer}>
                <View style={[styles.gameIconWrapper, { backgroundColor: `${COLORS.primary}15` }]}>
                  <MaterialIcons name="confirmation-number" size={28} color={COLORS.primary} />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>
                    {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
                      ? 'Game Status' 
                      : 'Game Schedule'
                    }
                  </Text>
                </View>
              </View>
            </View>
            
            {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
              <View>
                <Text style={styles.cardDescription}>
                  {gameStatus?.status === 'live'
                    ? "The game is now live! Number calling has started."
                    : "Game has been completed. You can still view the game room."
                  }
                </Text>
                {callingStatus?.is_running ? (
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                        <Ionicons name="megaphone" size={18} color={COLORS.primary} />
                      </View>
                      <Text style={styles.statValue}>{calledNumbers.length}</Text>
                      <Text style={styles.statLabel}>Called</Text>
                    </View>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                        <Ionicons name="time" size={18} color={COLORS.orange} />
                      </View>
                      <Text style={styles.statValue}>{timer}s</Text>
                      <Text style={styles.statLabel}>Next Call</Text>
                    </View>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: `${COLORS.purple}15` }]}>
                        <Ionicons name="grid" size={18} color={COLORS.purple} />
                      </View>
                      <Text style={styles.statValue}>{90 - calledNumbers.length}</Text>
                      <Text style={styles.statLabel}>Remaining</Text>
                    </View>
                  </View>
                ) : gameStatus?.status === 'completed' ? (
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                        <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
                      </View>
                      <Text style={styles.statValue}>{calledNumbers.length}</Text>
                      <Text style={styles.statLabel}>Total Called</Text>
                    </View>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                        <Ionicons name="trophy" size={18} color={COLORS.orange} />
                      </View>
                      <Text style={styles.statValue}>Completed</Text>
                      <Text style={styles.statLabel}>Status</Text>
                    </View>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: `${COLORS.purple}15` }]}>
                        <Ionicons name="time" size={18} color={COLORS.purple} />
                      </View>
                      <Text style={styles.statValue}>{game.game_start_time}</Text>
                      <Text style={styles.statLabel}>Started At</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.waitingText}>
                    Number calling will start soon...
                  </Text>
                )}
                
                {gameStatus?.status === 'completed' ? (
                  <View>
                    {/* View Game Room Button */}
                    <TouchableOpacity
                      style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
                      onPress={handleJoinGameRoom}
                      disabled={joiningRoom}
                    >
                      {joiningRoom ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons name="eye" size={18} color="#FFFFFF" />
                          <Text style={styles.primaryButtonText}>
                            {hasJoinedRoom ? "View Game Room" : "View Completed Game"}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    {/* Game Results Button */}
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => navigation.navigate("UserGameResult", { 
                        gameId: game.id,
                        gameName: game.game_name 
                      })}
                    >
                      <Ionicons name="stats-chart" size={18} color={COLORS.primary} />
                      <Text style={styles.secondaryButtonText}>Game Results</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
                    onPress={handleJoinGameRoom}
                    disabled={joiningRoom}
                  >
                    {joiningRoom ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="enter" size={18} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>
                          {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
                <Text style={styles.cardDescription}>
                  Game is scheduled to start on {new Date(game.game_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })} at {game.game_start_time}
                </Text>
                <View style={styles.scheduledBadgeContainer}>
                  <Ionicons name="calendar" size={18} color={COLORS.primary} />
                  <Text style={styles.scheduledBadgeText}>
                    Game is Scheduled
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* GAME DETAILS CARD */}
          <View style={styles.card}>
            <CardBackground accentColor={COLORS.purple} />
            
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.purple}15` }]}>
                <Ionicons name="game-controller" size={20} color={COLORS.purple} />
              </View>
              <Text style={styles.sectionTitle}>Game Details</Text>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                  <Ionicons name="calendar" size={14} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {new Date(game.game_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                  <Ionicons name="time" size={14} color={COLORS.orange} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {game.game_start_time}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: `${COLORS.purple}15` }]}>
                  <MaterialIcons name="account-balance-wallet" size={14} color={COLORS.purple} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Prize Pool</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {game.ticket_type === "paid"
                      ? `₹${(game.ticket_cost * game.max_players).toLocaleString()}`
                      : "Exciting Prizes"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: `${COLORS.teal}15` }]}>
                  <Ionicons name="person" size={14} color={COLORS.teal} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Host</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {game.user?.name || 'Tambola Timez'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: `${COLORS.green}15` }]}>
                <Ionicons name="call" size={14} color={COLORS.green} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Host Contact</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {getWhatsAppNumber()}
                </Text>
              </View>
            </View>

            {renderTicketLimitInfo()}

            <View style={styles.myCountContainer}>
              <TouchableOpacity
                style={[
                  styles.countButton,
                  myTicketCount > 0 && styles.countButtonActive,
                ]}
                onPress={navigateToTickets}
              >
                <View style={[styles.countIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                  <Ionicons name="ticket" size={18} color={COLORS.primary} />
                </View>
                <View style={styles.countInfo}>
                  <Text style={styles.countLabel}>My Tickets</Text>
                  <Text style={[
                    styles.countValue,
                    myTicketCount > 0 ? styles.countValueActive : styles.countValueInactive,
                  ]}>
                    {myTicketCount > 0
                      ? `${myTicketCount} Ticket${myTicketCount > 1 ? "s" : ""}`
                      : "No Tickets"}
                  </Text>
                </View>
                {myTicketCount > 0 && (
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.countButton,
                  myRequestCount > 0 && styles.countButtonActive,
                ]}
                onPress={navigateToMyRequests}
              >
                <View style={[styles.countIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                  <Ionicons name="list-circle" size={18} color={COLORS.orange} />
                </View>
                <View style={styles.countInfo}>
                  <Text style={styles.countLabel}>My Requests</Text>
                  <Text style={[
                    styles.countValue,
                    myRequestCount > 0 ? styles.countValueActive : styles.countValueInactive,
                  ]}>
                    {myRequestCount > 0
                      ? `${myRequestCount} Request${myRequestCount > 1 ? "s" : ""}`
                      : "No Requests"}
                  </Text>
                </View>
                {myRequestCount > 0 && (
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                )}
              </TouchableOpacity>
            </View>

            {game.message && (
              <View style={styles.messageCard}>
                <View style={[styles.messageIcon, { backgroundColor: `${COLORS.primary}10` }]}>
                  <MaterialIcons name="message" size={16} color={COLORS.primary} />
                </View>
                <View style={styles.messageContent}>
                  <Text style={styles.messageTitle}>Host Message</Text>
                  <Text style={styles.messageText}>{game.message}</Text>
                </View>
              </View>
            )}
          </View>

          {/* ACTIONS CARD */}
          <View style={styles.card}>
            <CardBackground accentColor={COLORS.orange} />
            
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                <Ionicons name="flash" size={20} color={COLORS.orange} />
              </View>
              <Text style={styles.sectionTitle}>Actions</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.primaryActionButton,
                  (hasReachedTicketLimit() || loading) && styles.buttonDisabled,
                ]}
                onPress={() => {
                  if (!hasReachedTicketLimit()) {
                    setTicketModalVisible(true);
                  } else {
                    showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
                  }
                }}
                disabled={hasReachedTicketLimit() || loading}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>
                  {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.actionSecondary,
                    myTicketCount === 0 && styles.buttonDisabled,
                  ]}
                  onPress={navigateToTickets}
                  disabled={myTicketCount === 0}
                >
                  <View style={[styles.actionSecondaryIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                    <Ionicons name="ticket" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.actionSecondaryText}>My Tickets</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionSecondary,
                    myRequestCount === 0 && styles.buttonDisabled,
                  ]}
                  onPress={navigateToMyRequests}
                  disabled={myRequestCount === 0}
                >
                  <View style={[styles.actionSecondaryIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                    <Ionicons name="list-circle" size={18} color={COLORS.orange} />
                  </View>
                  <Text style={styles.actionSecondaryText}>My Requests</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* REWARDS CARD */}
          {game.pattern_rewards && game.pattern_rewards.length > 0 && (
            <View style={styles.card}>
              <CardBackground accentColor={COLORS.teal} />
              
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.teal}15` }]}>
                  <Ionicons name="trophy" size={20} color={COLORS.teal} />
                </View>
                <Text style={styles.sectionTitle}>Game Rewards</Text>
              </View>
              
              {game.pattern_rewards.map((reward, index) => (
                <View key={reward.pattern_id} style={styles.rewardCard}>
                  <View style={styles.rewardHeader}>
                    <View style={[styles.rewardIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                      <MaterialIcons name="emoji-events" size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardName} numberOfLines={1}>
                        {reward.reward_name}
                      </Text>
                      <Text style={styles.rewardDescription} numberOfLines={2}>
                        {reward.description}
                      </Text>
                    </View>
                    <View style={styles.rewardAmount}>
                      <Text style={styles.rewardAmountText}>₹{reward.amount}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.rewardFooter}>
                    <View style={styles.rewardDetail}>
                      <MaterialIcons name="confirmation-number" size={12} color={COLORS.textLight} />
                      <Text style={styles.rewardDetailText}>
                        Count: {reward.reward_count}
                      </Text>
                    </View>
                    <View style={[styles.patternBadge, { backgroundColor: `${COLORS.primary}10` }]}>
                      <Text style={[styles.patternBadgeText, { color: COLORS.primary }]}>
                        Pattern {reward.pattern_id}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </Animated.ScrollView>

      {/* TICKET MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ticketModalVisible}
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <CardBackground accentColor={COLORS.primary} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Tickets</Text>
              <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalGameInfo}>
              <Text style={styles.modalGameName} numberOfLines={2}>
                {game.game_name}
              </Text>
              <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
              <View style={styles.modalTicketCost}>
                <Text style={styles.modalTicketCostText}>
                  Ticket Price: {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
                </Text>
              </View>
              <View style={styles.modalHostInfo}>
                <Text style={styles.modalHostText}>
                  Host: {game.user?.name || "Game Host"} ({getWhatsAppNumber()})
                </Text>
              </View>
            </View>

            <View style={[
              styles.modalLimitInfo,
              hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
            ]}>
              <Ionicons 
                name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
                size={16} 
                color={hasReachedTicketLimit() ? COLORS.red : COLORS.primary} 
              />
              <Text style={styles.modalLimitText}>
                {hasReachedTicketLimit() 
                  ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
                  : `You can request up to ${getRemainingTickets()} more ticket(s)`
                }
              </Text>
            </View>

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Select Quantity (1-4)</Text>
              <View style={styles.quantitySelector}>
                {[1, 2, 3, 4].map((num) => {
                  const canSelect = num <= getRemainingTickets() && !hasReachedTicketLimit();
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.quantityButton,
                        ticketQuantity === num && styles.quantityButtonActive,
                        !canSelect && styles.quantityButtonDisabled,
                      ]}
                      onPress={() => canSelect && setTicketQuantity(num)}
                      disabled={!canSelect}
                    >
                      <Text
                        style={[
                          styles.quantityButtonText,
                          ticketQuantity === num && styles.quantityButtonTextActive,
                          !canSelect && styles.quantityButtonTextDisabled,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {game.ticket_type === "paid" && (
              <View style={styles.totalSection}>
                <View style={styles.totalLabelContainer}>
                  <Ionicons name="wallet" size={18} color={COLORS.primary} />
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                </View>
                <Text style={styles.totalAmount} numberOfLines={1}>
                  ₹{game.ticket_cost * ticketQuantity}
                </Text>
              </View>
            )}

            <View style={styles.messageSection}>
              <Text style={styles.messageLabel}>Message (Optional)</Text>
              <TextInput
                style={styles.messageInput}
                value={ticketMessage}
                onChangeText={setTicketMessage}
                placeholder="Add a message for the host..."
                multiline
                numberOfLines={3}
                maxLength={200}
                placeholderTextColor={COLORS.textLight}
              />
              <Text style={styles.charCount}>
                {ticketMessage.length}/200 characters
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setTicketModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.buttonDisabled,
                ]}
                onPress={handleRequestTickets}
                disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
              >
                {requestLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>
                      {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  
  /* COLOR BLOCKS - Animated */
  blueBlock1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: COLORS.blockLightBlue,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  blueBlock2: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: COLORS.blockMediumBlue,
  },
  blueBlock3: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: COLORS.blockDarkBlue,
    opacity: 0.3,
  },
  
  /* Card Background */
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  
  /* Decorative circles */
  cardDecorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.08,
  },
  circle1: {
    top: -30,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  circle2: {
    bottom: -20,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.06,
  },
  circle3: {
    top: '40%',
    left: '30%',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.05,
  },
  
  /* Floating particles */
  floatingParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.12,
  },
  particle1: {
    top: 20,
    right: 40,
    width: 6,
    height: 6,
  },
  particle2: {
    bottom: 30,
    left: 50,
    width: 5,
    height: 5,
  },
  particle3: {
    top: '60%',
    right: 60,
    width: 7,
    height: 7,
  },
  particle4: {
    bottom: '20%',
    left: 80,
    width: 4,
    height: 4,
  },
  
  /* Toast */
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  
  /* Enhanced Header */
  headerWrapper: {
    position: 'relative',
    marginTop: 8,
    marginBottom: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  
  semicircleBackground: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  semicircle: {
    position: 'absolute',
    width: 400,
    height: 200,
    backgroundColor: COLORS.primaryLight,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    transform: [{ rotate: '-15deg' }],
    opacity: 0.3,
  },
  
  ukPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  curvedLine1: {
    position: 'absolute',
    top: 20,
    right: 50,
    width: 80,
    height: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 40,
    opacity: 0.15,
    transform: [{ rotate: '-10deg' }],
  },
  curvedLine2: {
    position: 'absolute',
    bottom: 10,
    left: 30,
    width: 60,
    height: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 30,
    opacity: 0.15,
    transform: [{ rotate: '15deg' }],
  },
  curvedLine3: {
    position: 'absolute',
    top: 40,
    left: 100,
    width: 100,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 50,
    opacity: 0.1,
    transform: [{ rotate: '20deg' }],
  },
  
  parallelLines: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  parallelLine: {
    width: 80,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
    marginVertical: 4,
    borderRadius: 1,
  },
  
  dottedCircle1: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    width: 60,
    height: 60,
  },
  dottedCircleDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    top: 28,
    left: 28,
  },
  
  decorativeDot1: {
    position: 'absolute',
    top: 60,
    right: 80,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
  },
  decorativeDot2: {
    position: 'absolute',
    bottom: 40,
    left: 150,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
  },
  decorativeLine1: {
    position: 'absolute',
    top: 10,
    left: 150,
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
    borderRadius: 1,
    transform: [{ rotate: '30deg' }],
  },
  decorativeLine2: {
    position: 'absolute',
    bottom: 30,
    right: 100,
    width: 50,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
    borderRadius: 1,
    transform: [{ rotate: '-20deg' }],
  },
  
  /* Header Content */
  headerContent: {
    position: 'relative',
    zIndex: 2,
    marginTop:7
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerGameName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  headerGameCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerGameCodeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  
  /* Content */
  content: {
    paddingHorizontal: 16,
  },
  
  /* Cards */
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  
  /* Card Header */
  cardHeader: {
    marginBottom: 12,
  },
  gameIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  gameIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 12,
  },
  
  /* Stats */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  
  /* Buttons */
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  
  /* Scheduled Badge */
  scheduledBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  scheduledBadgeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  
  /* Section Header */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  
  /* Details */
  detailGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },
  
  /* Ticket Limit */
  ticketLimitContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    gap: 10,
  },
  ticketLimitReached: {
    backgroundColor: COLORS.redLight,
    borderColor: COLORS.red,
  },
  ticketLimitAvailable: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  ticketLimitIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketLimitInfo: {
    flex: 1,
  },
  ticketLimitTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  ticketLimitText: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 14,
  },
  
  /* Count Buttons */
  myCountContainer: {
    gap: 8,
    marginBottom: 12,
  },
  countButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: 10,
  },
  countButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  countIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  countInfo: {
    flex: 1,
  },
  countLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  countValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  countValueActive: {
    color: COLORS.text,
  },
  countValueInactive: {
    color: COLORS.textLight,
  },
  
  /* Message Card */
  messageCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  messageIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  
  /* Actions */
  actionsContainer: {
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryActionButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionSecondaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSecondaryText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  
  /* Reward Card */
  rewardCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  rewardIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 14,
  },
  rewardAmount: {
    minWidth: 50,
  },
  rewardAmountText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: 'right',
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rewardDetailText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  patternBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  patternBadgeText: {
    fontSize: 9,
    fontWeight: "600",
  },
  
  /* Waiting Text */
  waitingText: {
    fontSize: 13,
    color: COLORS.primary,
    fontStyle: "italic",
    marginBottom: 16,
    textAlign: "center",
  },
  
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  modalGameInfo: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 2,
  },
  modalGameName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  modalGameId: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  modalTicketCost: {
    marginBottom: 4,
  },
  modalTicketCostText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  modalHostInfo: {
    marginTop: 2,
  },
  modalHostText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  modalLimitInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    zIndex: 2,
  },
  modalLimitReached: {
    backgroundColor: COLORS.redLight,
    borderColor: COLORS.red,
  },
  modalLimitAvailable: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  modalLimitText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  
  /* Quantity Selector */
  quantitySection: {
    marginBottom: 16,
    zIndex: 2,
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  quantitySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantityButton: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quantityButtonDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  quantityButtonTextActive: {
    color: "#FFFFFF",
  },
  quantityButtonTextDisabled: {
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  
  /* Total Section */
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 2,
  },
  totalLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  
  /* Message Section */
  messageSection: {
    marginBottom: 20,
    zIndex: 2,
  },
  messageLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  charCount: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 4,
  },
  
  /* Modal Actions */
  modalActions: {
    flexDirection: "row",
    gap: 10,
    zIndex: 2,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    backgroundColor: COLORS.primary,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  /* Bottom Space */
  bottomSpace: {
    height: 20,
  },
});

export default GameDetails;