// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   RefreshControl,
//   Modal,
//   Animated,
//   Easing,
//   FlatList,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import FontAwesome from "react-native-vector-icons/FontAwesome";

// const { width } = Dimensions.get("window");
// const TICKET_WIDTH = width - 60;
// const CELL_SIZE = (TICKET_WIDTH - 80) / 9;

// // Updated color scheme matching Game component - Mango Yellow theme
// const PRIMARY_COLOR = "#02658D"; // Main background color (blue)
// const SECONDARY_COLOR = "#02557A"; // Darker blue
// const ACCENT_COLOR = "#f0ae13"; // Mango yellow
// const LIGHT_ACCENT = "#FFECB3"; // Very light mango
// const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// const WHITE = "#FFFFFF";
// const SUCCESS_GREEN = "#f0ae13"; // Mango yellow for success states
// const ERROR_RED = "#E74C3C";
// const WARNING_ORANGE = "#F39C12";
// const MUTED_YELLOW = "#FFE082"; // Muted yellow for text
// const GRID_CELL_EMPTY = "#02557A"; // Dark blue for empty cells

// const UserGameWinners = ({ navigation, route }) => {
//   const { gameId, gameName, gameData, calledNumbers } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [winnersData, setWinnersData] = useState(null);
//   const [selectedPattern, setSelectedPattern] = useState(null);
//   const [showTicketModal, setShowTicketModal] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);
  
//   // Animation values
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const shineAnim = useRef(new Animated.Value(0)).current;
//   const confettiAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     fetchWinners();
//     startAnimations();
//   }, []);

//   const startAnimations = () => {
//     // Floating animation
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

//     // Second floating animation
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

//     // Pulse animation
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

//     // Shine animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(shineAnim, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(shineAnim, {
//           toValue: 0,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Confetti animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(confettiAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(confettiAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.in(Easing.ease),
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

//   const shineTranslateX = shineAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-100, width + 100]
//   });

//   const confettiOpacity = confettiAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.1, 0.3]
//   });

//   const fetchWinners = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/claims/game/${gameId}/winners`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setWinnersData(response.data.data);
//         // Select first pattern by default
//         if (response.data.data.pattern_winners && response.data.data.pattern_winners.length > 0) {
//           setSelectedPattern(response.data.data.pattern_winners[0]);
//         }
//       }
//     } catch (error) {
//       console.log("Error fetching winners:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchWinners();
//     setRefreshing(false);
//   };

//   const handleViewTicket = (winner) => {
//     setSelectedTicket(winner);
//     setShowTicketModal(true);
//   };

//   const renderTicketGrid = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) {
//       return (
//         <View style={styles.errorContainer}>
//           <MaterialIcons name="error-outline" size={24} color={ERROR_RED} />
//           <Text style={styles.errorText}>Ticket data not available</Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.ticketGridContainer}>
//         <View style={styles.columnNumbers}>
//           {Array.from({ length: 9 }).map((_, colIndex) => (
//             <View key={`col-${colIndex}`} style={styles.columnNumberCell}>
//               <Text style={styles.columnNumberText}>{colIndex + 1}</Text>
//             </View>
//           ))}
//         </View>

//         {ticketData.map((row, rowIndex) => (
//           <View key={`row-${rowIndex}`} style={styles.ticketRow}>
//             {row.map((cell, colIndex) => {
//               const cellNumber = cell?.number;
//               const isMarked = cell?.is_marked || false;
//               const isEmpty = cellNumber === null || cellNumber === undefined;
              
//               let cellBackgroundColor;
//               if (isEmpty) {
//                 cellBackgroundColor = DARK_BLUE; // Dark blue for empty cells
//               } else if (isMarked) {
//                 cellBackgroundColor = ACCENT_COLOR; // Mango yellow for marked numbers
//               } else {
//                 cellBackgroundColor = SECONDARY_COLOR; // Blue for numbers
//               }
              
//               return (
//                 <View
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   style={[
//                     styles.ticketCell,
//                     { backgroundColor: cellBackgroundColor },
//                     isEmpty && styles.emptyCell,
//                     isMarked && styles.markedCell,
//                   ]}
//                 >
//                   {!isEmpty && (
//                     <View style={styles.cellContent}>
//                       <Text style={[
//                         styles.cellNumber,
//                         isMarked ? { color: DARK_BLUE } : { color: TEXT_LIGHT }
//                       ]}>
//                         {cellNumber}
//                       </Text>
//                       {isMarked && (
//                         <View style={styles.markedIndicator}>
//                           <Ionicons name="checkmark-circle" size={8} color={DARK_BLUE} />
//                         </View>
//                       )}
//                     </View>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const formatPatternName = (patternName) => {
//     return patternName
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   const formatAmount = (amount) => {
//     return `₹${parseFloat(amount).toLocaleString('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   const renderPatternTabs = () => {
//     if (!winnersData?.pattern_winners?.length) return null;

//     return (
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         style={styles.patternTabsContainer}
//         contentContainerStyle={styles.patternTabsContent}
//       >
//         {winnersData.pattern_winners.map((pattern) => (
//           <TouchableOpacity
//             key={pattern.game_pattern_id}
//             style={[
//               styles.patternTab,
//               selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternTabActive
//             ]}
//             onPress={() => setSelectedPattern(pattern)}
//           >
//             <View style={[
//               styles.patternTabIcon,
//               selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternTabIconActive
//             ]}>
//               <Ionicons 
//                 name="trophy" 
//                 size={16} 
//                 color={selectedPattern?.game_pattern_id === pattern.game_pattern_id ? DARK_BLUE : ACCENT_COLOR} 
//               />
//             </View>
//             <Text style={[
//               styles.patternTabName,
//               selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternTabNameActive
//             ]} numberOfLines={1}>
//               {formatPatternName(pattern.pattern_name)}
//             </Text>
//             <View style={[
//               styles.patternBadge,
//               selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternBadgeActive
//             ]}>
//               <Text style={[
//                 styles.patternBadgeText,
//                 selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternBadgeTextActive
//               ]}>
//                 {pattern.winner_count}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     );
//   };

//   const renderWinnersList = () => {
//     if (!winnersData?.winners || !selectedPattern) return null;

//     const filteredWinners = winnersData.winners.filter(
//       winner => winner.game_pattern_id === selectedPattern.game_pattern_id
//     );

//     if (filteredWinners.length === 0) {
//       return (
//         <View style={styles.noWinnersContainer}>
//           <View style={styles.noWinnersIcon}>
//             <Ionicons name="trophy-outline" size={50} color={MUTED_YELLOW} />
//           </View>
//           <Text style={styles.noWinnersTitle}>No Winners Yet</Text>
//           <Text style={styles.noWinnersSubtitle}>
//             No winners found for {formatPatternName(selectedPattern.pattern_name)} pattern
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <FlatList
//         data={filteredWinners}
//         renderItem={({ item: winner, index }) => (
//           <View key={winner.id} style={styles.winnerCard}>
//             <View style={styles.cardPattern} />
            
//             {/* Rank Badge */}
//             <View style={styles.rankBadge}>
//               {index === 0 && <Ionicons name="crown" size={16} color={ACCENT_COLOR} />}
//               <Text style={styles.rankText}>#{index + 1}</Text>
//             </View>
            
//             <View style={styles.winnerCardHeader}>
//               <View style={styles.winnerInfo}>
//                 <View style={styles.winnerAvatar}>
//                   <Ionicons name="person-circle" size={40} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.winnerDetails}>
//                   <Text style={styles.winnerName} numberOfLines={1}>
//                     {winner.user_name}
//                   </Text>
//                   <Text style={styles.winnerUsername}>@{winner.username}</Text>
//                   <View style={styles.ticketNumberBadge}>
//                     <MaterialIcons name="confirmation-number" size={12} color={ACCENT_COLOR} />
//                     <Text style={styles.ticketNumberText}>Ticket #{winner.ticket_number}</Text>
//                   </View>
//                 </View>
//               </View>
              
//               <View style={styles.winnerPrize}>
//                 <View style={styles.prizeAmountContainer}>
//                   <FontAwesome name="rupee" size={16} color={ACCENT_COLOR} />
//                   <Text style={styles.prizeAmount} numberOfLines={1}>
//                     {formatAmount(winner.winning_amount)}
//                   </Text>
//                 </View>
//                 <Text style={styles.prizeLabel} numberOfLines={2}>
//                   {winner.reward_name}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.winnerFooter}>
//               <View style={styles.winTimeBadge}>
//                 <Ionicons name="time" size={14} color={ACCENT_COLOR} />
//                 <Text style={styles.winTimeText}>{winner.time_since_approval}</Text>
//               </View>
              
//               <TouchableOpacity
//                 style={styles.viewTicketButton}
//                 onPress={() => handleViewTicket(winner)}
//               >
//                 <Ionicons name="eye" size={16} color={DARK_BLUE} />
//                 <Text style={styles.viewTicketButtonText}>View Ticket</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//         scrollEnabled={false}
//       />
//     );
//   };

//   const renderStats = () => {
//     if (!winnersData) return null;

//     return (
//       <View style={styles.statsContainer}>
//         <Animated.View 
//           style={[
//             styles.statCard,
//             { transform: [{ scale: pulseAnim }] }
//           ]}
//         >
//           <View style={[styles.statIcon, { backgroundColor: 'rgba(240, 174, 19, 0.1)' }]}>
//             <Ionicons name="trophy" size={24} color={ACCENT_COLOR} />
//           </View>
//           <Text style={styles.statValue}>{winnersData.total_winners}</Text>
//           <Text style={styles.statLabel}>Total Winners</Text>
//         </Animated.View>
        
//         <Animated.View 
//           style={[
//             styles.statCard,
//             { transform: [{ scale: pulseAnim }] }
//           ]}
//         >
//           <View style={[styles.statIcon, { backgroundColor: 'rgba(240, 174, 19, 0.1)' }]}>
//             <FontAwesome name="rupee" size={24} color={ACCENT_COLOR} />
//           </View>
//           <Text style={styles.statValue} numberOfLines={1}>
//             {formatAmount(winnersData.total_winnings)}
//           </Text>
//           <Text style={styles.statLabel}>Total Winnings</Text>
//         </Animated.View>
        
//         <Animated.View 
//           style={[
//             styles.statCard,
//             { transform: [{ scale: pulseAnim }] }
//           ]}
//         >
//           <View style={[styles.statIcon, { backgroundColor: 'rgba(240, 174, 19, 0.1)' }]}>
//             <Ionicons name="layers" size={24} color={ACCENT_COLOR} />
//           </View>
//           <Text style={styles.statValue}>
//             {winnersData.pattern_winners?.length || 0}
//           </Text>
//           <Text style={styles.statLabel}>Patterns Won</Text>
//         </Animated.View>
//       </View>
//     );
//   };

//   // Function to count total numbers in ticket
//   const countTotalNumbers = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return 0;
//     let count = 0;
//     for (let row of ticketData) {
//       for (let cell of row) {
//         if (cell?.number !== null && cell?.number !== undefined) {
//           count++;
//         }
//       }
//     }
//     return count;
//   };

//   // Function to count marked numbers in ticket
//   const countMarkedNumbers = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return 0;
//     let count = 0;
//     for (let row of ticketData) {
//       for (let cell of row) {
//         if (cell?.is_marked) {
//           count++;
//         }
//       }
//     }
//     return count;
//   };

//   // Function to count called numbers in ticket
//   const countCalledNumbers = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData) || !calledNumbers) return 0;
//     let count = 0;
//     for (let row of ticketData) {
//       for (let cell of row) {
//         if (cell?.number !== null && cell?.number !== undefined && calledNumbers.includes(cell.number)) {
//           count++;
//         }
//       }
//     }
//     return count;
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <View style={styles.backgroundPattern}>
//           {/* Animated poker chips */}
//           <Animated.View 
//             style={[
//               styles.pokerChip1, 
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
//               styles.pokerChip2, 
//               { 
//                 transform: [
//                   { translateY: translateY2 },
//                   { translateX: translateY1 }
//                 ] 
//               }
//             ]} 
//           />
          
//           {/* Animated shine effect */}
//           <Animated.View 
//             style={[
//               styles.shineEffect,
//               { 
//                 transform: [{ translateX: shineTranslateX }],
//                 opacity: shineAnim
//               }
//             ]} 
//           />
//         </View>
        
//         <View style={styles.loadingAnimation}>
//           <View style={styles.loadingIconWrapper}>
//             <Ionicons name="trophy" size={40} color={ACCENT_COLOR} />
//           </View>
//           <ActivityIndicator size="large" color={ACCENT_COLOR} style={styles.loadingSpinner} />
//         </View>
//         <Text style={styles.loadingText}>Loading Winners...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />

//       {/* Ticket Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showTicketModal}
//         onRequestClose={() => setShowTicketModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={styles.modalTitleContainer}>
//                 <MaterialIcons name="confirmation-number" size={24} color={ACCENT_COLOR} />
//                 <Text style={styles.modalTitle}>Winning Ticket</Text>
//               </View>
//               <TouchableOpacity
//                 onPress={() => setShowTicketModal(false)}
//                 style={styles.modalCloseButton}
//               >
//                 <Ionicons name="close" size={24} color={MUTED_YELLOW} />
//               </TouchableOpacity>
//             </View>
            
//             {selectedTicket && (
//               <>
//                 <View style={styles.modalTicketInfo}>
//                   <View style={styles.modalUserInfo}>
//                     <View style={styles.modalAvatar}>
//                       <Ionicons name="person-circle" size={50} color={ACCENT_COLOR} />
//                     </View>
//                     <View style={styles.modalUserDetails}>
//                       <Text style={styles.modalUserName} numberOfLines={1}>
//                         {selectedTicket.user_name}
//                       </Text>
//                       <Text style={styles.modalUserUsername} numberOfLines={1}>
//                         @{selectedTicket.username}
//                       </Text>
//                       <View style={styles.modalTicketNumberBadge}>
//                         <MaterialIcons name="confirmation-number" size={12} color={ACCENT_COLOR} />
//                         <Text style={styles.modalTicketNumberText}>Ticket #{selectedTicket.ticket_number}</Text>
//                       </View>
//                     </View>
//                   </View>
                  
//                   <View style={styles.modalPrizeInfo}>
//                     <View style={styles.modalPrizeAmountContainer}>
//                       <FontAwesome name="rupee" size={16} color={ACCENT_COLOR} />
//                       <Text style={styles.modalPrizeAmount} numberOfLines={1}>
//                         {formatAmount(selectedTicket.winning_amount)}
//                       </Text>
//                     </View>
//                     <Text style={styles.modalPrizeName} numberOfLines={2}>
//                       {selectedTicket.reward_name}
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.modalTicketPreview}>
//                   <View style={styles.modalTicketHeader}>
//                     <Text style={styles.modalPatternName}>
//                       {formatPatternName(selectedTicket.pattern_name)}
//                     </Text>
//                   </View>
                  
//                   {selectedTicket.ticket_data && renderTicketGrid(selectedTicket.ticket_data)}
                  
//                   <View style={styles.modalTicketStats}>
//                     <View style={styles.modalStatItem}>
//                       <Text style={styles.modalStatValue}>
//                         {countTotalNumbers(selectedTicket.ticket_data)}
//                       </Text>
//                       <Text style={styles.modalStatLabel}>Total Numbers</Text>
//                     </View>
//                     <View style={styles.modalStatItem}>
//                       <Text style={styles.modalStatValue}>
//                         {countMarkedNumbers(selectedTicket.ticket_data)}
//                       </Text>
//                       <Text style={styles.modalStatLabel}>Marked</Text>
//                     </View>
//                     <View style={styles.modalStatItem}>
//                       <Text style={styles.modalStatValue}>
//                         {countCalledNumbers(selectedTicket.ticket_data)}
//                       </Text>
//                       <Text style={styles.modalStatLabel}>Called</Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.modalFooter}>
//                   <View style={styles.modalWinTime}>
//                     <Ionicons name="time" size={14} color={MUTED_YELLOW} />
//                     <Text style={styles.modalWinTimeText}>Won {selectedTicket.time_since_approval}</Text>
//                   </View>
//                   <TouchableOpacity
//                     style={styles.closeModalButton}
//                     onPress={() => setShowTicketModal(false)}
//                   >
//                     <Text style={styles.closeModalButtonText}>Close</Text>
//                     <Ionicons name="checkmark" size={16} color={DARK_BLUE} />
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Fixed Header */}
//       <Animated.View 
//         style={[
//           styles.header,
//           { 
//             transform: [{ scale: pulseAnim }],
//             backgroundColor: SECONDARY_COLOR
//           }
//         ]}
//       >
//         <View style={styles.headerContent}>
//           <View style={styles.headerTop}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
//             </TouchableOpacity>
            
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.gameName} numberOfLines={1}>
//                 {gameName}
//               </Text>
//               <View style={styles.gameCodeContainer}>
//                 <Ionicons name="trophy" size={16} color={ACCENT_COLOR} />
//                 <Text style={styles.gameCode}>Game Winners</Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.refreshButton}
//               onPress={onRefresh}
//             >
//               <Ionicons name="refresh" size={20} color={ACCENT_COLOR} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Animated.View>

//       {/* Background Patterns */}
//       <View style={styles.backgroundPattern}>
//         <Animated.View 
//           style={[
//             styles.pokerChip1, 
//             { 
//               transform: [
//                 { translateY: translateY1 },
//                 { translateX: translateY2 }
//               ] 
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.pokerChip2, 
//             { 
//               transform: [
//                 { translateY: translateY2 },
//                 { translateX: translateY1 }
//               ] 
//             }
//           ]} 
//         />
        
//         {/* Animated shine effect */}
//         <Animated.View 
//           style={[
//             styles.shineEffect,
//             { 
//               transform: [{ translateX: shineTranslateX }],
//               opacity: shineAnim
//             }
//           ]} 
//         />
        
//         {/* Animated confetti */}
//         <Animated.View 
//           style={[
//             styles.confettiContainer,
//             { opacity: confettiOpacity }
//           ]}
//         >
//           <Ionicons name="sparkles" size={200} color={ACCENT_COLOR} />
//         </Animated.View>
        
//         {/* Yellow gradient overlay */}
//         <View style={styles.yellowGradient} />
//       </View>

//       <ScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={ACCENT_COLOR}
//             colors={[ACCENT_COLOR]}
//           />
//         }
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Content */}
//         <View style={styles.content}>
//           {/* Game Winners Banner */}
//           <Animated.View 
//             style={[
//               styles.winnersBanner,
//               { transform: [{ scale: pulseAnim }] }
//             ]}
//           >
//             <View style={styles.bannerContent}>
              
//               <View style={styles.bannerTextContainer}>
//                 <Text style={styles.bannerTitle}>Game Winners</Text>
//                 <Text style={styles.bannerSubtitle}>
//                   Celebrating our champions and their winning tickets
//                 </Text>
//               </View>
//             </View>
//           </Animated.View>

//           {/* Stats */}
//           {renderStats()}

//           {/* Pattern Tabs */}
//           {renderPatternTabs()}

//           {/* Winners List */}
//           <View style={styles.winnersSection}>
//             <View style={styles.sectionHeader}>
//               <Ionicons name="people" size={20} color={ACCENT_COLOR} />
//               <Text style={styles.sectionTitle}>Winners List</Text>
//               {selectedPattern && (
//                 <View style={styles.patternInfoBadge}>
//                   <Ionicons name="ribbon" size={12} color={ACCENT_COLOR} />
//                   <Text style={styles.patternInfoText} numberOfLines={1}>
//                     {formatPatternName(selectedPattern.pattern_name)} • {formatAmount(selectedPattern.total_amount)}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             {renderWinnersList()}
//           </View>

//           {/* Current User Status */}
//           {winnersData?.current_user && (
//             <View style={styles.userStatusCard}>
//               <View style={styles.userStatusHeader}>
//                 <Ionicons 
//                   name={winnersData.current_user.is_winner ? "checkmark-circle" : "information-circle"} 
//                   size={24} 
//                   color={winnersData.current_user.is_winner ? ACCENT_COLOR : ACCENT_COLOR} 
//                 />
//                 <Text style={[
//                   styles.userStatusTitle,
//                   { color: winnersData.current_user.is_winner ? ACCENT_COLOR : ACCENT_COLOR }
//                 ]}>
//                   {winnersData.current_user.is_winner ? "Congratulations! You're a Winner!" : "Your Status"}
//                 </Text>
//               </View>
              
//               {winnersData.current_user.is_winner ? (
//                 <View style={styles.userWinsList}>
//                   {winnersData.current_user.user_wins.map((win, index) => (
//                     <View key={index} style={styles.userWinItem}>
//                       <Ionicons name="trophy" size={16} color={ACCENT_COLOR} />
//                       <Text style={styles.userWinText}>
//                         Won {formatAmount(win.winning_amount)} for {win.pattern_name}
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               ) : (
//                 <Text style={styles.userStatusText}>
//                   You didn't win this game. Better luck next time!
//                 </Text>
//               )}
//             </View>
//           )}

//           {/* Game Info */}
//           <View style={styles.gameInfoCard}>
//             <View style={styles.sectionHeader}>
//               <Ionicons name="information-circle" size={20} color={ACCENT_COLOR} />
//               <Text style={styles.sectionTitle}>Game Information</Text>
//             </View>
            
//             <View style={styles.gameInfoGrid}>
//               <View style={styles.gameInfoItem}>
//                 <Ionicons name="game-controller" size={16} color={MUTED_YELLOW} />
//                 <Text style={styles.gameInfoLabel}>Game Status</Text>
//                 <Text style={styles.gameInfoValue}>Completed</Text>
//               </View>
//               <View style={styles.gameInfoItem}>
//                 <Ionicons name="numbers" size={16} color={MUTED_YELLOW} />
//                 <Text style={styles.gameInfoLabel}>Numbers Called</Text>
//                 <Text style={styles.gameInfoValue}>{calledNumbers?.length || 0}/90</Text>
//               </View>
//               <View style={styles.gameInfoItem}>
//                 <Ionicons name="calendar" size={16} color={MUTED_YELLOW} />
//                 <Text style={styles.gameInfoLabel}>Ended</Text>
//                 <Text style={styles.gameInfoValue}>
//                   {new Date().toLocaleDateString()}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.backToGameButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={16} color={DARK_BLUE} />
//             <Text style={styles.backToGameButtonText}>Back to Game Room</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Bottom Space */}
//         <View style={styles.bottomSpace} />
//       </ScrollView>
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
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   backgroundPattern: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     zIndex: 0,
//   },
//   // Animated poker chips
//   pokerChip1: {
//     position: 'absolute',
//     top: 50,
//     left: width * 0.1,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   pokerChip2: {
//     position: 'absolute',
//     top: 120,
//     right: width * 0.15,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   // Shine effect
//   shineEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 100,
//     height: '100%',
//     backgroundColor: 'rgba(240, 174, 19, 0.1)',
//     transform: [{ skewX: '-20deg' }],
//   },
//   // Confetti
//   confettiContainer: {
//     position: 'absolute',
//     top: 150,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   yellowGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 300,
//     backgroundColor: 'rgba(240, 174, 19, 0.05)',
//   },
//   // Header Styles
//   header: {
//     paddingTop: 10,
//     paddingBottom: 15,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     zIndex: 1,
//     borderBottomWidth: 2,
//     borderBottomColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   headerContent: {
//     paddingHorizontal: 20,
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: DARK_BLUE,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   gameName: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: TEXT_LIGHT,
//     letterSpacing: -0.5,
//   },
//   gameCodeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 2,
//   },
//   gameCode: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//   },
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: DARK_BLUE,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   content: {
//     padding: 20,
//     zIndex: 1,
//     marginTop: 0,
//   },
//   // Winners Banner
//   winnersBanner: {
//     backgroundColor: ACCENT_COLOR,
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: LIGHT_ACCENT,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   bannerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   bannerTrophy: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: DARK_BLUE,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: LIGHT_ACCENT,
//   },
//   bannerTextContainer: {
//     flex: 1,
//   },
//   bannerTitle: {
//     fontSize: 22,
//     fontWeight: '900',
//     color: DARK_BLUE,
//     marginBottom: 4,
//     textShadowColor: 'rgba(0, 0, 0, 0.1)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   bannerSubtitle: {
//     fontSize: 14,
//     color: DARK_BLUE,
//     lineHeight: 20,
//     opacity: 0.95,
//   },
//   // Stats Container
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     gap: 10,
//   },
//   statCard: {
//     alignItems: "center",
//     flex: 1,
//     backgroundColor: DARK_BLUE,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   statIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   statValue: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: TEXT_LIGHT,
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     fontWeight: "600",
//     textAlign: 'center',
//   },
//   // Pattern Tabs
//   patternTabsContainer: {
//     marginBottom: 20,
//   },
//   patternTabsContent: {
//     paddingRight: 20,
//   },
//   patternTab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: DARK_BLUE,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 25,
//     marginRight: 10,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     minWidth: 140,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   patternTabActive: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: LIGHT_ACCENT,
//   },
//   patternTabIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: 'rgba(240, 174, 19, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   patternTabIconActive: {
//     backgroundColor: DARK_BLUE,
//     borderColor: DARK_BLUE,
//   },
//   patternTabName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: LIGHT_ACCENT,
//     flex: 1,
//   },
//   patternTabNameActive: {
//     color: DARK_BLUE,
//   },
//   patternBadge: {
//     backgroundColor: 'rgba(240, 174, 19, 0.2)',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//     marginLeft: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   patternBadgeActive: {
//     backgroundColor: DARK_BLUE,
//     borderColor: DARK_BLUE,
//   },
//   patternBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//   },
//   patternBadgeTextActive: {
//     color: ACCENT_COLOR,
//   },
//   // Winners Section
//   winnersSection: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
//     flex: 1,
//   },
//   patternInfoBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(240, 174, 19, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     flexShrink: 1,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   patternInfoText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: ACCENT_COLOR,
//   },
//   // Winner Card
//   winnerCard: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     position: 'relative',
//     overflow: 'hidden',
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   rankBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: SECONDARY_COLOR,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   rankText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//   },
//   cardPattern: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 60,
//     height: 60,
//     borderBottomLeftRadius: 60,
//     borderTopRightRadius: 16,
//     backgroundColor: 'rgba(240, 174, 19, 0.03)',
//   },
//   winnerCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   winnerInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     flex: 1,
//     gap: 12,
//     marginRight: 8,
//   },
//   winnerAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: DARK_BLUE,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   winnerDetails: {
//     flex: 1,
//   },
//   winnerName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   winnerUsername: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     marginBottom: 6,
//   },
//   ticketNumberBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: DARK_BLUE,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   ticketNumberText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: ACCENT_COLOR,
//   },
//   winnerPrize: {
//     alignItems: 'flex-end',
//     flexShrink: 1,
//     maxWidth: '45%',
//     minWidth: 120,
//   },
//   prizeAmountContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 4,
//     flexWrap: 'wrap',
//     justifyContent: 'flex-end',
//   },
//   prizeAmount: {
//     fontSize: 16,
//     fontWeight: '900',
//     color: ACCENT_COLOR,
//     flexShrink: 1,
//   },
//   prizeLabel: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     textAlign: 'right',
//     lineHeight: 14,
//   },
//   winnerFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: SECONDARY_COLOR,
//   },
//   winTimeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: SECONDARY_COLOR,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   winTimeText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: ACCENT_COLOR,
//   },
//   viewTicketButton: {
//     backgroundColor: ACCENT_COLOR,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     gap: 6,
//     borderWidth: 2,
//     borderColor: LIGHT_ACCENT,
//   },
//   viewTicketButtonText: {
//     color: DARK_BLUE,
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   // No Winners
//   noWinnersContainer: {
//     alignItems: "center",
//     paddingVertical: 40,
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   noWinnersIcon: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: SECONDARY_COLOR,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   noWinnersTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
//     marginBottom: 8,
//   },
//   noWinnersSubtitle: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     textAlign: "center",
//     paddingHorizontal: 20,
//     opacity: 0.8,
//   },
//   // User Status Card
//   userStatusCard: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   userStatusHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   userStatusTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     flex: 1,
//   },
//   userWinsList: {
//     gap: 8,
//   },
//   userWinItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: SECONDARY_COLOR,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   userWinText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//     flex: 1,
//   },
//   userStatusText: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     lineHeight: 20,
//     fontStyle: 'italic',
//     opacity: 0.8,
//   },
//   // Game Info Card
//   gameInfoCard: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   gameInfoGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   gameInfoItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   gameInfoLabel: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     marginTop: 4,
//     marginBottom: 2,
//     opacity: 0.7,
//   },
//   gameInfoValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//   },
//   // Back Button
//   backToGameButton: {
//     backgroundColor: ACCENT_COLOR,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     gap: 8,
//     marginTop: 8,
//     borderWidth: 2,
//     borderColor: LIGHT_ACCENT,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   backToGameButtonText: {
//     color: DARK_BLUE,
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   // Ticket Grid Styles
//   ticketGridContainer: {
//     alignItems: "center",
//   },
//   columnNumbers: {
//     flexDirection: "row",
//     marginBottom: 2,
//   },
//   columnNumberCell: {
//     width: CELL_SIZE,
//     height: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   columnNumberText: {
//     fontSize: 10,
//     color: LIGHT_ACCENT,
//     fontWeight: "600",
//   },
//   ticketRow: {
//     flexDirection: "row",
//     marginBottom: 1,
//   },
//   ticketCell: {
//     width: CELL_SIZE,
//     height: CELL_SIZE,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 0.5,
//     borderColor: SECONDARY_COLOR,
//     position: 'relative',
//   },
//   emptyCell: {
//     backgroundColor: DARK_BLUE,
//   },
//   markedCell: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: LIGHT_ACCENT,
//   },
//   cellContent: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: '100%',
//     height: '100%',
//   },
//   cellNumber: {
//     fontSize: 14,
//     fontWeight: "800",
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1,
//   },
//   markedIndicator: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 24,
//     padding: 20,
//     width: '100%',
//     maxWidth: 500,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: SECONDARY_COLOR,
//   },
//   modalTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flex: 1,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//     flex: 1,
//   },
//   modalCloseButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   modalTicketInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: SECONDARY_COLOR,
//   },
//   modalUserInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 12,
//     flex: 1,
//     marginRight: 16,
//   },
//   modalAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   modalUserDetails: {
//     flex: 1,
//   },
//   modalUserName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   modalUserUsername: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     marginBottom: 6,
//   },
//   modalTicketNumberBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: SECONDARY_COLOR,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   modalTicketNumberText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: ACCENT_COLOR,
//   },
//   modalPrizeInfo: {
//     alignItems: 'flex-end',
//     flexShrink: 1,
//     maxWidth: '50%',
//   },
//   modalPrizeAmountContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 4,
//   },
//   modalPrizeAmount: {
//     fontSize: 18,
//     fontWeight: '900',
//     color: ACCENT_COLOR,
//     textAlign: 'right',
//   },
//   modalPrizeName: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     textAlign: 'right',
//     lineHeight: 16,
//   },
//   modalTicketPreview: {
//     backgroundColor: SECONDARY_COLOR,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   modalTicketHeader: {
//     marginBottom: 16,
//   },
//   modalPatternName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: ACCENT_COLOR,
//     backgroundColor: DARK_BLUE,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   modalTicketStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: DARK_BLUE,
//   },
//   modalStatItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   modalStatValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   modalStatLabel: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     opacity: 0.7,
//   },
//   modalFooter: {
//     alignItems: 'center',
//   },
//   modalWinTime: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginBottom: 16,
//   },
//   modalWinTimeText: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     fontStyle: 'italic',
//   },
//   closeModalButton: {
//     backgroundColor: ACCENT_COLOR,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 8,
//     width: '100%',
//     gap: 8,
//     borderWidth: 2,
//     borderColor: LIGHT_ACCENT,
//   },
//   closeModalButtonText: {
//     color: DARK_BLUE,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   // Loading
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: PRIMARY_COLOR,
//     position: 'relative',
//   },
//   loadingAnimation: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   loadingIconWrapper: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(240, 174, 19, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   loadingSpinner: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   // Error container
//   errorContainer: {
//     padding: 20,
//     alignItems: 'center',
//     gap: 8,
//   },
//   errorText: {
//     color: ERROR_RED,
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default UserGameWinners;








import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  Modal,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const TICKET_WIDTH = width - 60;
const CELL_SIZE = (TICKET_WIDTH - 80) / 9;

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
const WARNING_ORANGE = "#ff9800"; // Orange accent for warnings
const GRID_CELL_EMPTY = "#f0f0f0"; // Light gray for empty cells

const UserGameWinners = ({ navigation, route }) => {
  const { gameId, gameName, gameData, calledNumbers } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [winnersData, setWinnersData] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchWinners();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Floating animation
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

    // Second floating animation
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

    // Pulse animation
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

    // Shine animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Confetti animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.in(Easing.ease),
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

  const shineTranslateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100]
  });

  const confettiOpacity = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3]
  });

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/claims/game/${gameId}/winners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setWinnersData(response.data.data);
        // Select first pattern by default
        if (response.data.data.pattern_winners && response.data.data.pattern_winners.length > 0) {
          setSelectedPattern(response.data.data.pattern_winners[0]);
        }
      }
    } catch (error) {
      console.log("Error fetching winners:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWinners();
    setRefreshing(false);
  };

  const handleViewTicket = (winner) => {
    setSelectedTicket(winner);
    setShowTicketModal(true);
  };

  const renderTicketGrid = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color={ERROR_COLOR} />
          <Text style={styles.errorText}>Ticket data not available</Text>
        </View>
      );
    }

    return (
      <View style={styles.ticketGridContainer}>
        <View style={styles.columnNumbers}>
          {Array.from({ length: 9 }).map((_, colIndex) => (
            <View key={`col-${colIndex}`} style={styles.columnNumberCell}>
              <Text style={styles.columnNumberText}>{colIndex + 1}</Text>
            </View>
          ))}
        </View>

        {ticketData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.ticketRow}>
            {row.map((cell, colIndex) => {
              const cellNumber = cell?.number;
              const isMarked = cell?.is_marked || false;
              const isEmpty = cellNumber === null || cellNumber === undefined;
              
              let cellBackgroundColor;
              if (isEmpty) {
                cellBackgroundColor = "#f0f0f0"; // Light gray for empty cells
              } else if (isMarked) {
                cellBackgroundColor = ACCENT_COLOR; // Orange for marked numbers
              } else {
                cellBackgroundColor = PRIMARY_COLOR; // Blue for numbers
              }
              
              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.ticketCell,
                    { backgroundColor: cellBackgroundColor },
                    isEmpty && styles.emptyCell,
                    isMarked && styles.markedCell,
                  ]}
                >
                  {!isEmpty && (
                    <View style={styles.cellContent}>
                      <Text style={[
                        styles.cellNumber,
                        isMarked ? { color: WHITE } : { color: WHITE }
                      ]}>
                        {cellNumber}
                      </Text>
                      {isMarked && (
                        <View style={styles.markedIndicator}>
                          <Ionicons name="checkmark-circle" size={8} color={WHITE} />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const formatPatternName = (patternName) => {
    return patternName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const renderPatternTabs = () => {
    if (!winnersData?.pattern_winners?.length) return null;

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.patternTabsContainer}
        contentContainerStyle={styles.patternTabsContent}
      >
        {winnersData.pattern_winners.map((pattern) => (
          <TouchableOpacity
            key={pattern.game_pattern_id}
            style={[
              styles.patternTab,
              selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternTabActive
            ]}
            onPress={() => setSelectedPattern(pattern)}
          >
            <View style={[
              styles.patternTabIcon,
              selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternTabIconActive
            ]}>
              <Ionicons 
                name="trophy" 
                size={16} 
                color={selectedPattern?.game_pattern_id === pattern.game_pattern_id ? WHITE : ACCENT_COLOR} 
              />
            </View>
            <Text style={[
              styles.patternTabName,
              selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternTabNameActive
            ]} numberOfLines={1}>
              {formatPatternName(pattern.pattern_name)}
            </Text>
            <View style={[
              styles.patternBadge,
              selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternBadgeActive
            ]}>
              <Text style={[
                styles.patternBadgeText,
                selectedPattern?.game_pattern_id === pattern.game_pattern_id && styles.patternBadgeTextActive
              ]}>
                {pattern.winner_count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderWinnersList = () => {
    if (!winnersData?.winners || !selectedPattern) return null;

    const filteredWinners = winnersData.winners.filter(
      winner => winner.game_pattern_id === selectedPattern.game_pattern_id
    );

    if (filteredWinners.length === 0) {
      return (
        <View style={styles.noWinnersContainer}>
          <View style={styles.noWinnersIcon}>
            <Ionicons name="trophy-outline" size={50} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.noWinnersTitle}>No Winners Yet</Text>
          <Text style={styles.noWinnersSubtitle}>
            No winners found for {formatPatternName(selectedPattern.pattern_name)} pattern
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredWinners}
        renderItem={({ item: winner, index }) => (
          <View key={winner.id} style={styles.winnerCard}>
            <View style={styles.cardPattern} />
            
            {/* Rank Badge */}
            <View style={styles.rankBadge}>
              {index === 0 && <Ionicons name="crown" size={16} color={ACCENT_COLOR} />}
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            
            <View style={styles.winnerCardHeader}>
              <View style={styles.winnerInfo}>
                <View style={styles.winnerAvatar}>
                  <Ionicons name="person-circle" size={40} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.winnerDetails}>
                  <Text style={styles.winnerName} numberOfLines={1}>
                    {winner.user_name}
                  </Text>
                  <Text style={styles.winnerUsername}>@{winner.username}</Text>
                  <View style={styles.ticketNumberBadge}>
                    <MaterialIcons name="confirmation-number" size={12} color={PRIMARY_COLOR} />
                    <Text style={styles.ticketNumberText}>Ticket #{winner.ticket_number}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.winnerPrize}>
                <View style={styles.prizeAmountContainer}>
                  <FontAwesome name="rupee" size={16} color={ACCENT_COLOR} />
                  <Text style={styles.prizeAmount} numberOfLines={1}>
                    {formatAmount(winner.winning_amount)}
                  </Text>
                </View>
                <Text style={styles.prizeLabel} numberOfLines={2}>
                  {winner.reward_name}
                </Text>
              </View>
            </View>

            <View style={styles.winnerFooter}>
              <View style={styles.winTimeBadge}>
                <Ionicons name="time" size={14} color={TEXT_LIGHT} />
                <Text style={styles.winTimeText}>{winner.time_since_approval}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.viewTicketButton}
                onPress={() => handleViewTicket(winner)}
              >
                <Ionicons name="eye" size={16} color={WHITE} />
                <Text style={styles.viewTicketButtonText}>View Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    );
  };

  const renderStats = () => {
    if (!winnersData) return null;

    return (
      <View style={styles.statsContainer}>
        <Animated.View 
          style={[
            styles.statCard,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
            <Ionicons name="trophy" size={24} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.statValue}>{winnersData.total_winners}</Text>
          <Text style={styles.statLabel}>Total Winners</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.statCard,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
            <FontAwesome name="rupee" size={24} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.statValue} numberOfLines={1}>
            {formatAmount(winnersData.total_winnings)}
          </Text>
          <Text style={styles.statLabel}>Total Winnings</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.statCard,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
            <Ionicons name="layers" size={24} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.statValue}>
            {winnersData.pattern_winners?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Patterns Won</Text>
        </Animated.View>
      </View>
    );
  };

  // Function to count total numbers in ticket
  const countTotalNumbers = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return 0;
    let count = 0;
    for (let row of ticketData) {
      for (let cell of row) {
        if (cell?.number !== null && cell?.number !== undefined) {
          count++;
        }
      }
    }
    return count;
  };

  // Function to count marked numbers in ticket
  const countMarkedNumbers = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return 0;
    let count = 0;
    for (let row of ticketData) {
      for (let cell of row) {
        if (cell?.is_marked) {
          count++;
        }
      }
    }
    return count;
  };

  // Function to count called numbers in ticket
  const countCalledNumbers = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData) || !calledNumbers) return 0;
    let count = 0;
    for (let row of ticketData) {
      for (let cell of row) {
        if (cell?.number !== null && cell?.number !== undefined && calledNumbers.includes(cell.number)) {
          count++;
        }
      }
    }
    return count;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.backgroundPattern}>
          {/* Animated poker chips */}
          <Animated.View 
            style={[
              styles.pokerChip1, 
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
              styles.pokerChip2, 
              { 
                transform: [
                  { translateY: translateY2 },
                  { translateX: translateY1 }
                ] 
              }
            ]} 
          />
          
          {/* Animated shine effect */}
          <Animated.View 
            style={[
              styles.shineEffect,
              { 
                transform: [{ translateX: shineTranslateX }],
                opacity: shineAnim
              }
            ]} 
          />
        </View>
        
        <View style={styles.loadingAnimation}>
          <View style={styles.loadingIconWrapper}>
            <Ionicons name="trophy" size={40} color={PRIMARY_COLOR} />
          </View>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
        </View>
        <Text style={styles.loadingText}>Loading Winners...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      {/* Ticket Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTicketModal}
        onRequestClose={() => setShowTicketModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <MaterialIcons name="confirmation-number" size={24} color={PRIMARY_COLOR} />
                <Text style={styles.modalTitle}>Winning Ticket</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowTicketModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={TEXT_LIGHT} />
              </TouchableOpacity>
            </View>
            
            {selectedTicket && (
              <>
                <View style={styles.modalTicketInfo}>
                  <View style={styles.modalUserInfo}>
                    <View style={styles.modalAvatar}>
                      <Ionicons name="person-circle" size={50} color={PRIMARY_COLOR} />
                    </View>
                    <View style={styles.modalUserDetails}>
                      <Text style={styles.modalUserName} numberOfLines={1}>
                        {selectedTicket.user_name}
                      </Text>
                      <Text style={styles.modalUserUsername} numberOfLines={1}>
                        @{selectedTicket.username}
                      </Text>
                      <View style={styles.modalTicketNumberBadge}>
                        <MaterialIcons name="confirmation-number" size={12} color={PRIMARY_COLOR} />
                        <Text style={styles.modalTicketNumberText}>Ticket #{selectedTicket.ticket_number}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.modalPrizeInfo}>
                    <View style={styles.modalPrizeAmountContainer}>
                      <FontAwesome name="rupee" size={16} color={ACCENT_COLOR} />
                      <Text style={styles.modalPrizeAmount} numberOfLines={1}>
                        {formatAmount(selectedTicket.winning_amount)}
                      </Text>
                    </View>
                    <Text style={styles.modalPrizeName} numberOfLines={2}>
                      {selectedTicket.reward_name}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalTicketPreview}>
                  <View style={styles.modalTicketHeader}>
                    <Text style={styles.modalPatternName}>
                      {formatPatternName(selectedTicket.pattern_name)}
                    </Text>
                  </View>
                  
                  {selectedTicket.ticket_data && renderTicketGrid(selectedTicket.ticket_data)}
                  
                  <View style={styles.modalTicketStats}>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {countTotalNumbers(selectedTicket.ticket_data)}
                      </Text>
                      <Text style={styles.modalStatLabel}>Total Numbers</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {countMarkedNumbers(selectedTicket.ticket_data)}
                      </Text>
                      <Text style={styles.modalStatLabel}>Marked</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatValue}>
                        {countCalledNumbers(selectedTicket.ticket_data)}
                      </Text>
                      <Text style={styles.modalStatLabel}>Called</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <View style={styles.modalWinTime}>
                    <Ionicons name="time" size={14} color={TEXT_LIGHT} />
                    <Text style={styles.modalWinTimeText}>Won {selectedTicket.time_since_approval}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setShowTicketModal(false)}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                    <Ionicons name="checkmark" size={16} color={WHITE} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Fixed Header */}
      <Animated.View 
        style={[
          styles.header,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={WHITE} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.gameName} numberOfLines={1}>
                {gameName}
              </Text>
              <View style={styles.gameCodeContainer}>
                <Ionicons name="trophy" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.gameCode}>Game Winners</Text>
              </View>
            </View>

            {/* <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <Ionicons name="refresh" size={20} color={WHITE} />
            </TouchableOpacity> */}
          </View>
        </View>
      </Animated.View>

      {/* Background Patterns */}
      <View style={styles.backgroundPattern}>
        <Animated.View 
          style={[
            styles.pokerChip1, 
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
            styles.pokerChip2, 
            { 
              transform: [
                { translateY: translateY2 },
                { translateX: translateY1 }
              ] 
            }
          ]} 
        />
        
        {/* Animated shine effect */}
        <Animated.View 
          style={[
            styles.shineEffect,
            { 
              transform: [{ translateX: shineTranslateX }],
              opacity: shineAnim
            }
          ]} 
        />
        
        {/* Animated confetti */}
        <Animated.View 
          style={[
            styles.confettiContainer,
            { opacity: confettiOpacity }
          ]}
        >
          <Ionicons name="sparkles" size={200} color={ACCENT_COLOR} />
        </Animated.View>
        
        {/* Yellow gradient overlay */}
        <View style={styles.yellowGradient} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Game Winners Banner */}
          <Animated.View 
            style={[
              styles.winnersBanner,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={styles.bannerContent}>
              
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Game Winners</Text>
                <Text style={styles.bannerSubtitle}>
                  Celebrating our champions and their winning tickets
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats */}
          {renderStats()}

          {/* Pattern Tabs */}
          {renderPatternTabs()}

          {/* Winners List */}
          <View style={styles.winnersSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.sectionTitle}>Winners List</Text>
              {selectedPattern && (
                <View style={styles.patternInfoBadge}>
                  <Ionicons name="ribbon" size={12} color={ACCENT_COLOR} />
                  <Text style={styles.patternInfoText} numberOfLines={1}>
                    {formatPatternName(selectedPattern.pattern_name)} • {formatAmount(selectedPattern.total_amount)}
                  </Text>
                </View>
              )}
            </View>

            {renderWinnersList()}
          </View>

          {/* Current User Status */}
          {winnersData?.current_user && (
            <View style={styles.userStatusCard}>
              <View style={styles.userStatusHeader}>
                <Ionicons 
                  name={winnersData.current_user.is_winner ? "checkmark-circle" : "information-circle"} 
                  size={24} 
                  color={winnersData.current_user.is_winner ? SUCCESS_COLOR : PRIMARY_COLOR} 
                />
                <Text style={[
                  styles.userStatusTitle,
                  { color: winnersData.current_user.is_winner ? SUCCESS_COLOR : TEXT_DARK }
                ]}>
                  {winnersData.current_user.is_winner ? "Congratulations! You're a Winner!" : "Your Status"}
                </Text>
              </View>
              
              {winnersData.current_user.is_winner ? (
                <View style={styles.userWinsList}>
                  {winnersData.current_user.user_wins.map((win, index) => (
                    <View key={index} style={styles.userWinItem}>
                      <Ionicons name="trophy" size={16} color={ACCENT_COLOR} />
                      <Text style={styles.userWinText}>
                        Won {formatAmount(win.winning_amount)} for {win.pattern_name}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.userStatusText}>
                  You didn't win this game. Better luck next time!
                </Text>
              )}
            </View>
          )}

          {/* Game Info */}
          <View style={styles.gameInfoCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.sectionTitle}>Game Information</Text>
            </View>
            
            <View style={styles.gameInfoGrid}>
              <View style={styles.gameInfoItem}>
                <Ionicons name="game-controller" size={16} color={TEXT_LIGHT} />
                <Text style={styles.gameInfoLabel}>Game Status</Text>
                <Text style={styles.gameInfoValue}>Completed</Text>
              </View>
              <View style={styles.gameInfoItem}>
                <Ionicons name="numbers" size={16} color={TEXT_LIGHT} />
                <Text style={styles.gameInfoLabel}>Numbers Called</Text>
                <Text style={styles.gameInfoValue}>{calledNumbers?.length || 0}/90</Text>
              </View>
              <View style={styles.gameInfoItem}>
                <Ionicons name="calendar" size={16} color={TEXT_LIGHT} />
                <Text style={styles.gameInfoLabel}>Ended</Text>
                <Text style={styles.gameInfoValue}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backToGameButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={16} color={WHITE} />
            <Text style={styles.backToGameButtonText}>Back to Game Room</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Space */}
        <View style={styles.bottomSpace} />
      </ScrollView>
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
  },
  scrollContent: {
    paddingBottom: 40,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  // Animated poker chips
  pokerChip1: {
    position: 'absolute',
    top: 50,
    left: width * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pokerChip2: {
    position: 'absolute',
    top: 120,
    right: width * 0.15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  // Shine effect
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  // Confetti
  confettiContainer: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  yellowGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  // Header Styles
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  gameName: {
    fontSize: 22,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.5,
  },
  gameCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  gameCode: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    zIndex: 1,
    marginTop: 0,
  },
  // Winners Banner
  winnersBanner: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bannerTrophy: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: TEXT_LIGHT,
    lineHeight: 20,
  },
  // Stats Container
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT_DARK,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "600",
    textAlign: 'center',
  },
  // Pattern Tabs
  patternTabsContainer: {
    marginBottom: 20,
  },
  patternTabsContent: {
    paddingRight: 20,
  },
  patternTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  patternTabActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  patternTabIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  patternTabIconActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: WHITE,
  },
  patternTabName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    flex: 1,
  },
  patternTabNameActive: {
    color: WHITE,
  },
  patternBadge: {
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  patternBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: WHITE,
  },
  patternBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  patternBadgeTextActive: {
    color: WHITE,
  },
  // Winners Section
  winnersSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    flex: 1,
  },
  patternInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexShrink: 1,
    gap: 4,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  patternInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  // Winner Card
  winnerCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomLeftRadius: 60,
    borderTopRightRadius: 16,
    backgroundColor: "rgba(79, 172, 254, 0.03)",
  },
  winnerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
    marginRight: 8,
  },
  winnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  winnerDetails: {
    flex: 1,
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  winnerUsername: {
    fontSize: 12,
    color: TEXT_LIGHT,
    marginBottom: 6,
  },
  ticketNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  ticketNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  winnerPrize: {
    alignItems: 'flex-end',
    flexShrink: 1,
    maxWidth: '45%',
    minWidth: 120,
  },
  prizeAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  prizeAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: ACCENT_COLOR,
    flexShrink: 1,
  },
  prizeLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: 'right',
    lineHeight: 14,
  },
  winnerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  winTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  winTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_LIGHT,
  },
  viewTicketButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  viewTicketButtonText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
  },
  // No Winners
  noWinnersContainer: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  noWinnersIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  noWinnersTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  noWinnersSubtitle: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // User Status Card
  userStatusCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  userStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  userStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  userWinsList: {
    gap: 8,
  },
  userWinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  userWinText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    flex: 1,
  },
  userStatusText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Game Info Card
  gameInfoCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  gameInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  gameInfoLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    marginTop: 4,
    marginBottom: 2,
  },
  gameInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  // Back Button
  backToGameButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backToGameButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpace: {
    height: 20,
  },
  // Ticket Grid Styles
  ticketGridContainer: {
    alignItems: "center",
  },
  columnNumbers: {
    flexDirection: "row",
    marginBottom: 2,
  },
  columnNumberCell: {
    width: CELL_SIZE,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  columnNumberText: {
    fontSize: 10,
    color: TEXT_LIGHT,
    fontWeight: "600",
  },
  ticketRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  ticketCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
    position: 'relative',
  },
  emptyCell: {
    backgroundColor: "#f0f0f0",
  },
  markedCell: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  cellContent: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
  },
  cellNumber: {
    fontSize: 14,
    fontWeight: "800",
  },
  markedIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
  modalTicketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  modalUserInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    marginRight: 16,
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  modalUserDetails: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  modalUserUsername: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginBottom: 6,
  },
  modalTicketNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  modalTicketNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  modalPrizeInfo: {
    alignItems: 'flex-end',
    flexShrink: 1,
    maxWidth: '50%',
  },
  modalPrizeAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  modalPrizeAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: ACCENT_COLOR,
    textAlign: 'right',
  },
  modalPrizeName: {
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: 'right',
    lineHeight: 16,
  },
  modalTicketPreview: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  modalTicketHeader: {
    marginBottom: 16,
  },
  modalPatternName: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  modalTicketStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  modalStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  modalStatLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  modalFooter: {
    alignItems: 'center',
  },
  modalWinTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  modalWinTimeText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontStyle: 'italic',
  },
  closeModalButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeModalButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    position: 'relative',
  },
  loadingAnimation: {
    position: 'relative',
    marginBottom: 20,
  },
  loadingIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "rgba(79, 172, 254, 0.2)",
  },
  loadingSpinner: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  // Error container
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserGameWinners;