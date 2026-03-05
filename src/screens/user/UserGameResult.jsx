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
//   Image,
//   Animated,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// // Color scheme matching Home component
// const PRIMARY_COLOR = "#02658D"; // Main background color
// const SECONDARY_COLOR = "#02557A"; // Darker blue
// const ACCENT_COLOR = "#f0ae13"; // Light amber/Accent color
// const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// const WHITE = "#FFFFFF";

// const SUCCESS_COLOR = "#27AE60"; // Green
// const WARNING_COLOR = "#f0ae13"; // Using accent as warning
// const DANGER_COLOR = "#E74C3C"; // Red
// const GRAY_COLOR = "#6C757D"; // Gray

// const UserGameResult = ({ route, navigation }) => {
//   const { gameId, gameName } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [gameData, setGameData] = useState(null);
//   const [myTickets, setMyTickets] = useState([]);
//   const [myWinnings, setMyWinnings] = useState([]);
//   const [allWinners, setAllWinners] = useState([]);
//   const [gameStats, setGameStats] = useState(null);
//   const [calledNumbers, setCalledNumbers] = useState([]);
//   const [selectedTab, setSelectedTab] = useState("overview");

//   // Animation values
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;

//   // Static gold coins in background
//   const goldCoins = [
//     { id: 1, top: '15%', left: '5%', size: 25 },
//     { id: 2, top: '25%', left: '85%', size: 20 },
//     { id: 3, top: '40%', left: '15%', size: 22 },
//     { id: 4, top: '55%', left: '75%', size: 18 },
//     { id: 5, top: '70%', left: '10%', size: 24 },
//     { id: 6, top: '80%', left: '80%', size: 19 },
//     { id: 7, top: '30%', left: '60%', size: 21 },
//     { id: 8, top: '65%', left: '40%', size: 23 },
//     { id: 9, top: '45%', left: '90%', size: 17 },
//     { id: 10, top: '85%', left: '30%', size: 20 },
//   ];

//   useEffect(() => {
//     startAnimations();
//     fetchGameResults();
//   }, []);

//   const startAnimations = () => {
//     // Float animation 1
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

//     // Float animation 2
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

//     // Pulse animation
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

//     // Rotate animation
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 20000,
//         useNativeDriver: true,
//       })
//     ).start();
//   };

//   const translateY1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 10]
//   });

//   const translateY2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -8]
//   });

//   const rotate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   const fetchGameResults = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.status) {
//         const data = response.data.data;
//         setGameData(data);
        
//         // Set tickets
//         if (data.my_tickets_complete_data) {
//           setMyTickets(data.my_tickets_complete_data);
//         }
        
//         // Set my winnings
//         if (data.my_participation?.winning_patterns) {
//           setMyWinnings(data.my_participation.winning_patterns);
//         }
        
//         // Set all winners
//         if (data.all_game_winners?.winners_list) {
//           setAllWinners(data.all_game_winners.winners_list);
//         }
        
//         // Set game stats
//         if (data.game_statistics) {
//           setGameStats(data.game_statistics);
//         }
        
//         // Set called numbers
//         if (data.number_calling_history?.called_numbers) {
//           setCalledNumbers(data.number_calling_history.called_numbers);
//         }
//       }
//     } catch (error) {
//       console.log("Error fetching game results:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchGameResults().finally(() => setRefreshing(false));
//   }, []);

//   const renderTicketGrid = (ticketData) => {
//     const TICKET_WIDTH = width - 64;
//     const CELL_SIZE = Math.max(24, Math.min((TICKET_WIDTH - 40) / 9, 28));
    
//     const processTicketData = (data) => {
//       if (!data || !Array.isArray(data)) return Array(3).fill(Array(9).fill(null));
      
//       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
//       data.forEach((row, rowIndex) => {
//         row.forEach((cell) => {
//           if (cell && cell.number !== null && cell.column !== undefined) {
//             processedGrid[rowIndex][cell.column] = cell;
//           }
//         });
//       });
      
//       return processedGrid;
//     };

//     const processedData = processTicketData(ticketData);

//     return (
//       <View style={[styles.ticketGridContainer, { height: CELL_SIZE * 3 + 8 }]}>
//         {processedData.map((row, rowIndex) => (
//           <View key={`row-${rowIndex}`} style={styles.ticketRow}>
//             {row.map((cell, colIndex) => {
//               const cellObj = cell;
//               const cellNumber = cellObj?.number;
//               const isMarked = cellObj?.is_marked || false;
//               const isEmpty = cellNumber === null || cellNumber === undefined;
              
//               return (
//                 <View
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   style={[
//                     styles.ticketCell,
//                     { 
//                       width: CELL_SIZE,
//                       height: CELL_SIZE,
//                     },
//                     isEmpty ? styles.ticketCellEmpty : styles.ticketCellFilled,
//                     isMarked && styles.ticketCellMarked,
//                   ]}
//                 >
//                   {!isEmpty && (
//                     <Text style={[
//                       styles.ticketCellNumber,
//                       isMarked && styles.ticketCellNumberMarked
//                     ]}>
//                       {cellNumber}
//                     </Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const renderOverviewTab = () => (
//     <View style={styles.tabContent}>
//       {/* Game Stats - 2x2 Grid */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <MaterialCommunityIcons name="chart-line" size={20} color={ACCENT_COLOR} />
//             <Text style={styles.cardTitle}>Game Statistics</Text>
//           </View>
//         </View>
        
//         {gameStats && (
//           <View style={styles.statsGrid}>
//             <View style={styles.statRow}>
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="account-group" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>{gameStats.participant_statistics?.total_participants || 0}</Text>
//                   <Text style={styles.statLabel}>Participants</Text>
//                 </View>
//               </View>
              
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>{gameStats.ticket_statistics?.allocated_tickets || 0}</Text>
//                   <Text style={styles.statLabel}>Tickets Sold</Text>
//                 </View>
//               </View>
//             </View>
            
//             <View style={styles.statRow}>
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="trophy" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>{gameStats.winner_statistics?.total_winners || 0}</Text>
//                   <Text style={styles.statLabel}>Winners</Text>
//                 </View>
//               </View>
              
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="currency-inr" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>₹{gameStats.winner_statistics?.total_winnings_distributed || 0}</Text>
//                   <Text style={styles.statLabel}>Total Winnings</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}
//       </View>

//       {/* My Performance - 2x2 Grid */}
//       {gameData?.my_participation && (
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <MaterialCommunityIcons name="medal" size={20} color={ACCENT_COLOR} />
//               <Text style={styles.cardTitle}>My Performance</Text>
//             </View>
//           </View>
          
//           <View style={styles.statsGrid}>
//             <View style={styles.statRow}>
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>{gameData.my_participation.tickets_count || 0}</Text>
//                   <Text style={styles.statLabel}>My Tickets</Text>
//                 </View>
//               </View>
              
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: '#27AE60' + '20' }]}>
//                   <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>{gameData.my_participation.claims_summary?.approved_claims || 0}</Text>
//                   <Text style={styles.statLabel}>Approved</Text>
//                 </View>
//               </View>
//             </View>
            
//             <View style={styles.statRow}>
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="currency-inr" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>₹{gameData.my_participation.total_winnings || 0}</Text>
//                   <Text style={styles.statLabel}>My Winnings</Text>
//                 </View>
//               </View>
              
//               <View style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="trophy" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.statInfo}>
//                   <Text style={styles.statValue}>{gameData.my_participation.winning_patterns?.length || 0}</Text>
//                   <Text style={styles.statLabel}>Patterns Won</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
          
//           {gameData.my_participation.won_this_game && (
//             <View style={styles.winnerBadge}>
//               <MaterialCommunityIcons name="trophy" size={16} color={ACCENT_COLOR} />
//               <Text style={styles.winnerBadgeText}>YOU WON IN THIS GAME! 🎉</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Number Calling Summary */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <MaterialCommunityIcons name="numeric" size={20} color={ACCENT_COLOR} />
//             <Text style={styles.cardTitle}>Number Calling Summary</Text>
//           </View>
//         </View>
        
//         <View style={styles.numberSummary}>
//           <View style={styles.numberSummaryItem}>
//             <Text style={styles.numberSummaryValue}>{calledNumbers.length}</Text>
//             <Text style={styles.numberSummaryLabel}>Numbers Called</Text>
//           </View>
          
//           <View style={styles.numberSummaryDivider} />
          
//           <View style={styles.numberSummaryItem}>
//             <Text style={styles.numberSummaryValue}>{90 - calledNumbers.length}</Text>
//             <Text style={styles.numberSummaryLabel}>Numbers Left</Text>
//           </View>
          
//           <View style={styles.numberSummaryDivider} />
          
//           <View style={styles.numberSummaryItem}>
//             <Text style={styles.numberSummaryValue}>
//               {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : 'N/A'}
//             </Text>
//             <Text style={styles.numberSummaryLabel}>Last Number</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const renderWinnersTab = () => (
//     <View style={styles.tabContent}>
//       {/* Top Winners */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <MaterialCommunityIcons name="crown" size={20} color={ACCENT_COLOR} />
//             <Text style={styles.cardTitle}>Top Winners</Text>
//           </View>
//           <Text style={styles.winnerCount}>
//             {gameData?.all_game_winners?.total_winners || 0} Winners
//           </Text>
//         </View>
        
//         {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
//           <View style={styles.winnersList}>
//             {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
//               <View key={index} style={[
//                 styles.winnerItem,
//                 winner.is_me && styles.myWinnerItem
//               ]}>
//                 <View style={[styles.winnerRank, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <Text style={[styles.winnerRankText, { color: ACCENT_COLOR }]}>#{index + 1}</Text>
//                 </View>
                
//                 <View style={styles.winnerInfo}>
//                   <Text style={[
//                     styles.winnerName,
//                     winner.is_me && styles.myWinnerName
//                   ]}>
//                     {winner.winner_name}
//                     {winner.is_me && " (You)"}
//                   </Text>
//                   <Text style={styles.winnerPattern}>{winner.pattern_name}</Text>
//                 </View>
                
//                 <View style={styles.winnerPrize}>
//                   <Text style={styles.winnerPrizeAmount}>₹{winner.winning_amount}</Text>
//                   {index === 0 && (
//                     <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
//                   )}
//                 </View>
//               </View>
//             ))}
//           </View>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="trophy-outline" size={40} color={LIGHT_ACCENT} />
//             <Text style={styles.emptyStateText}>No winners data available</Text>
//           </View>
//         )}
//       </View>

//       {/* All Winners List */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <MaterialCommunityIcons name="format-list-bulleted" size={20} color={ACCENT_COLOR} />
//             <Text style={styles.cardTitle}>All Winners</Text>
//           </View>
//         </View>
        
//         {allWinners.length > 0 ? (
//           <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
//             {allWinners.map((winner, index) => (
//               <View key={index} style={[
//                 styles.allWinnerItem,
//                 winner.is_me && styles.myAllWinnerItem
//               ]}>
//                 <View style={styles.allWinnerLeft}>
//                   <View style={[styles.allWinnerAvatar, { backgroundColor: ACCENT_COLOR }]}>
//                     <Text style={styles.allWinnerAvatarText}>
//                       {winner.winner_name?.charAt(0).toUpperCase() || 'U'}
//                     </Text>
//                   </View>
//                   <View style={styles.allWinnerInfo}>
//                     <Text style={[
//                       styles.allWinnerName,
//                       winner.is_me && styles.myAllWinnerName
//                     ]}>
//                       {winner.winner_name}
//                       {winner.is_me && " (You)"}
//                     </Text>
//                     <Text style={styles.allWinnerPattern}>{winner.reward_name}</Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.allWinnerRight}>
//                   <Text style={styles.allWinnerAmount}>₹{winner.winning_amount}</Text>
//                   <Text style={styles.allWinnerTime}>
//                     {new Date(winner.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </ScrollView>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="account-group-outline" size={40} color={LIGHT_ACCENT} />
//             <Text style={styles.emptyStateText}>No winners found</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const renderMyTicketsTab = () => (
//     <View style={styles.tabContent}>
//       {/* My Winnings Summary */}
//       {myWinnings.length > 0 && (
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <MaterialCommunityIcons name="trophy" size={20} color={ACCENT_COLOR} />
//               <Text style={styles.cardTitle}>My Winnings</Text>
//             </View>
//             <View style={styles.winningsTotal}>
//               <Text style={styles.winningsTotalText}>
//                 ₹{gameData?.my_participation?.total_winnings || 0}
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.myWinningsList}>
//             {myWinnings.map((winning, index) => (
//               <View key={index} style={styles.winningItem}>
//                 <View style={[styles.winningIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
//                   <MaterialCommunityIcons name="trophy" size={18} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.winningInfo}>
//                   <Text style={styles.winningPattern}>{winning.reward_name}</Text>
//                   <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
//                   <Text style={styles.winningTime}>
//                     {new Date(winning.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                   </Text>
//                 </View>
//                 <View style={styles.winningAmountContainer}>
//                   <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* My Tickets */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <MaterialCommunityIcons name="ticket-confirmation" size={20} color={ACCENT_COLOR} />
//             <Text style={styles.cardTitle}>My Tickets</Text>
//           </View>
//           <Text style={styles.ticketCount}>
//             {myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}
//           </Text>
//         </View>
        
//         {myTickets.length > 0 ? (
//           <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
//             {myTickets.map((ticket, index) => (
//               <View key={index} style={styles.ticketItem}>
//                 <View style={styles.ticketHeader}>
//                   <View style={styles.ticketNumberContainer}>
//                     <MaterialCommunityIcons name="ticket-confirmation" size={16} color={ACCENT_COLOR} />
//                     <Text style={styles.ticketNumber}>Ticket #{ticket.ticket_number}</Text>
//                   </View>
//                   <View style={[
//                     styles.ticketStatus,
//                     ticket.is_completed ? styles.ticketCompleted : styles.ticketIncomplete
//                   ]}>
//                     <Text style={[
//                       styles.ticketStatusText,
//                       ticket.is_completed ? { color: SUCCESS_COLOR } : { color: ACCENT_COLOR }
//                     ]}>
//                       {ticket.is_completed ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}
//                     </Text>
//                   </View>
//                 </View>
                
//                 {/* Ticket Grid */}
//                 {renderTicketGrid(ticket.ticket_data)}
                
//                 <View style={styles.ticketStats}>
//                   <View style={styles.ticketStat}>
//                     <MaterialCommunityIcons name="check-circle" size={12} color={SUCCESS_COLOR} />
//                     <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
//                   </View>
//                   <View style={styles.ticketStat}>
//                     <MaterialCommunityIcons name="close-circle" size={12} color={DANGER_COLOR} />
//                     <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
//                   </View>
//                   {ticket.marked_numbers_count === 15 && (
//                     <View style={styles.fullHouseBadge}>
//                       <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
//                       <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             ))}
//           </ScrollView>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="ticket-outline" size={40} color={LIGHT_ACCENT} />
//             <Text style={styles.emptyStateText}>No tickets found</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const renderCalledNumbersTab = () => (
//     <View style={styles.tabContent}>
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <MaterialCommunityIcons name="grid" size={20} color={ACCENT_COLOR} />
//             <Text style={styles.cardTitle}>Called Numbers</Text>
//           </View>
//           <Text style={styles.calledCount}>
//             {calledNumbers.length}/90 Numbers
//           </Text>
//         </View>
        
//         {calledNumbers.length > 0 ? (
//           <View style={styles.numbersGridContainer}>
//             {Array.from({ length: 9 }, (_, row) => (
//               <View key={row} style={styles.numberRow}>
//                 {Array.from({ length: 10 }, (_, col) => {
//                   const number = row * 10 + col + 1;
//                   const isCalled = calledNumbers.includes(number);
//                   const isLatest = calledNumbers.length > 0 && 
//                     number === calledNumbers[calledNumbers.length - 1];
                  
//                   return (
//                     <View
//                       key={number}
//                       style={[
//                         styles.numberCell,
//                         isCalled && styles.calledNumberCell,
//                         isLatest && styles.latestNumberCell,
//                       ]}
//                     >
//                       <Text style={[
//                         styles.numberCellText,
//                         isCalled && styles.calledNumberText,
//                         isLatest && styles.latestNumberText,
//                       ]}>
//                         {number}
//                       </Text>
//                       {isLatest && (
//                         <View style={styles.latestIndicator}>
//                           <MaterialCommunityIcons name="star" size={6} color={WHITE} />
//                         </View>
//                       )}
//                     </View>
//                   );
//                 })}
//               </View>
//             ))}
//           </View>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="numeric-off" size={40} color={LIGHT_ACCENT} />
//             <Text style={styles.emptyStateText}>No numbers called</Text>
//           </View>
//         )}
        
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendNormal]} />
//             <Text style={styles.legendText}>Not Called</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendCalled]} />
//             <Text style={styles.legendText}>Called</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendLatest]} />
//             <Text style={styles.legendText}>Latest</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={ACCENT_COLOR} />
//         <Text style={styles.loadingText}>Loading Game Results...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
//       {/* Static Gold Coins Background */}
//       <View style={styles.goldCoinsContainer}>
//         {goldCoins.map((coin) => (
//           <View
//             key={coin.id}
//             style={[
//               styles.goldCoin,
//               {
//                 top: coin.top,
//                 left: coin.left,
//                 width: coin.size,
//                 height: coin.size,
//                 borderRadius: coin.size / 2,
//               }
//             ]}
//           >
//             <View style={styles.coinInner} />
//             <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
//           </View>
//         ))}
//       </View>

//       {/* Header */}
//       <Animated.View 
//         style={[
//           styles.header,
//           { 
//             transform: [{ scale: pulseAnim }],
//           }
//         ]}
//       >
//         <View style={styles.headerPattern}>
//           <View style={styles.headerCloud1} />
//           <View style={styles.headerCloud2} />
//         </View>
        
//         <View style={styles.headerContent}>
//           <View style={styles.headerTop}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="arrow-back" size={24} color={WHITE} />
//             </TouchableOpacity>
            
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.pageTitle}>Game Results</Text>
//               <View style={styles.gameInfoContainer}>
//                 <Ionicons name="game-controller" size={14} color={LIGHT_ACCENT} />
//                 <Text style={styles.gameName} numberOfLines={1}>
//                   {gameName || "Tambola Game"}
//                 </Text>
//               </View>
//             </View>
            
//             <TouchableOpacity
//               style={styles.refreshButton}
//               onPress={fetchGameResults}
//             >
//               <Ionicons name="refresh" size={18} color={WHITE} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Animated.View>

//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={ACCENT_COLOR}
//             colors={[ACCENT_COLOR]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.content}>
//           {/* Game Completion Banner */}
//           <View style={styles.completionBanner}>
//             <View style={styles.completionBannerContent}>
//               <MaterialCommunityIcons name="party-popper" size={32} color={ACCENT_COLOR} />
//               <View style={styles.completionTextContainer}>
//                 <Text style={styles.completionTitle}>Game Completed!</Text>
//                 <Text style={styles.completionSubtitle}>
//                   All {calledNumbers.length} numbers have been called
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabsContainer}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
//               <TouchableOpacity
//                 style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
//                 onPress={() => setSelectedTab("overview")}
//               >
//                 <Ionicons 
//                   name="stats-chart" 
//                   size={14} 
//                   color={selectedTab === "overview" ? WHITE : ACCENT_COLOR} 
//                 />
//                 <Text style={[styles.tabText, selectedTab === "overview" && styles.activeTabText]}>
//                   Overview
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.tab, selectedTab === "winners" && styles.activeTab]}
//                 onPress={() => setSelectedTab("winners")}
//               >
//                 <Ionicons 
//                   name="trophy" 
//                   size={14} 
//                   color={selectedTab === "winners" ? WHITE : ACCENT_COLOR} 
//                 />
//                 <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>
//                   Winners
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]}
//                 onPress={() => setSelectedTab("mytickets")}
//               >
//                 <Ionicons 
//                   name="ticket" 
//                   size={14} 
//                   color={selectedTab === "mytickets" ? WHITE : ACCENT_COLOR} 
//                 />
//                 <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>
//                   My Tickets
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.tab, selectedTab === "numbers" && styles.activeTab]}
//                 onPress={() => setSelectedTab("numbers")}
//               >
//                 <Ionicons 
//                   name="grid" 
//                   size={14} 
//                   color={selectedTab === "numbers" ? WHITE : ACCENT_COLOR} 
//                 />
//                 <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>
//                   Numbers
//                 </Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>

//           {/* Tab Content */}
//           {selectedTab === "overview" && renderOverviewTab()}
//           {selectedTab === "winners" && renderWinnersTab()}
//           {selectedTab === "mytickets" && renderMyTicketsTab()}
//           {selectedTab === "numbers" && renderCalledNumbersTab()}

//           <View style={styles.bottomSpace} />
//         </View>
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
//   // Gold Coins Background
//   goldCoinsContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 0,
//   },
//   goldCoin: {
//     position: 'absolute',
//     backgroundColor: ACCENT_COLOR,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: LIGHT_ACCENT,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.4,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   coinInner: {
//     position: 'absolute',
//     width: '70%',
//     height: '70%',
//     borderRadius: 50,
//     backgroundColor: 'rgba(255, 213, 79, 0.3)',
//     borderWidth: 1,
//     borderColor: 'rgba(184, 134, 11, 0.3)',
//   },
//   coinSymbol: {
//     color: SECONDARY_COLOR,
//     fontWeight: 'bold',
//     textShadowColor: 'rgba(255, 255, 255, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1,
//   },
//   // Header
//   header: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingTop: 15,
//     paddingBottom: 15,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     position: 'relative',
//     overflow: 'hidden',
//     zIndex: 1,
//   },
//   headerPattern: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   headerCloud1: {
//     position: 'absolute',
//     top: 15,
//     left: 20,
//     width: 45,
//     height: 15,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   headerCloud2: {
//     position: 'absolute',
//     top: 35,
//     right: 30,
//     width: 30,
//     height: 12,
//     borderRadius: 15,
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   headerContent: {
//     paddingHorizontal: 16,
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.3)",
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   pageTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: WHITE,
//     letterSpacing: -0.3,
//     marginBottom: 2,
//   },
//   gameInfoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   gameName: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     flex: 1,
//   },
//   refreshButton: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.3)",
//   },
//   content: {
//     padding: 16,
//   },
//   // Completion Banner
//   completionBanner: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   completionBannerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   completionTextContainer: {
//     flex: 1,
//   },
//   completionTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: TEXT_LIGHT,
//     marginBottom: 4,
//   },
//   completionSubtitle: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//   },
//   // Tabs
//   tabsContainer: {
//     marginBottom: 16,
//   },
//   tabsScroll: {
//     flexGrow: 0,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: DARK_BLUE,
//     marginRight: 8,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//     gap: 6,
//   },
//   activeTab: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: ACCENT_COLOR,
//   },
//   tabText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//   },
//   activeTabText: {
//     color: SECONDARY_COLOR,
//   },
//   // Cards
//   card: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   cardTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//   },
//   tabContent: {
//     marginBottom: 16,
//   },
//   // Stats Grid
//   statsGrid: {
//     gap: 12,
//   },
//   statRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(1, 69, 96, 0.5)',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//     gap: 12,
//   },
//   statIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   statInfo: {
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//     fontWeight: '500',
//   },
//   // Number Summary
//   numberSummary: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   numberSummaryItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   numberSummaryValue: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: ACCENT_COLOR,
//     marginBottom: 4,
//   },
//   numberSummaryLabel: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   numberSummaryDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   // Winner Badge
//   winnerBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 16,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     gap: 8,
//   },
//   winnerBadgeText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//   },
//   // Winners List
//   winnerCount: {
//     fontSize: 13,
//     color: ACCENT_COLOR,
//     fontWeight: '600',
//   },
//   winnersList: {
//     gap: 10,
//   },
//   winnerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(1, 69, 96, 0.5)',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   myWinnerItem: {
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     borderColor: ACCENT_COLOR,
//   },
//   winnerRank: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   winnerRankText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   winnerInfo: {
//     flex: 1,
//   },
//   winnerName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   myWinnerName: {
//     color: ACCENT_COLOR,
//   },
//   winnerPattern: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//   },
//   winnerPrize: {
//     alignItems: 'center',
//   },
//   winnerPrizeAmount: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//     marginBottom: 2,
//   },
//   // All Winners List
//   allWinnersList: {
//     maxHeight: 300,
//   },
//   allWinnerItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   myAllWinnerItem: {
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     marginHorizontal: -8,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//   },
//   allWinnerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   allWinnerAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   allWinnerAvatarText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: SECONDARY_COLOR,
//   },
//   allWinnerInfo: {
//     flex: 1,
//   },
//   allWinnerName: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   myAllWinnerName: {
//     color: ACCENT_COLOR,
//   },
//   allWinnerPattern: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//   },
//   allWinnerRight: {
//     alignItems: 'flex-end',
//   },
//   allWinnerAmount: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//     marginBottom: 2,
//   },
//   allWinnerTime: {
//     fontSize: 10,
//     color: LIGHT_ACCENT,
//   },
//   // My Winnings
//   winningsTotal: {
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   winningsTotalText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//   },
//   myWinningsList: {
//     gap: 10,
//   },
//   winningItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(1, 69, 96, 0.5)',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   winningIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   winningInfo: {
//     flex: 1,
//   },
//   winningPattern: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//     marginBottom: 2,
//   },
//   winningTicket: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//     marginBottom: 2,
//   },
//   winningTime: {
//     fontSize: 10,
//     color: LIGHT_ACCENT,
//   },
//   winningAmountContainer: {
//     alignItems: 'center',
//   },
//   winningAmount: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: ACCENT_COLOR,
//   },
//   // My Tickets
//   ticketCount: {
//     fontSize: 13,
//     color: ACCENT_COLOR,
//     fontWeight: '600',
//   },
//   myTicketsList: {
//     maxHeight: 500,
//   },
//   ticketItem: {
//     backgroundColor: 'rgba(1, 69, 96, 0.5)',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   ticketHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   ticketNumberContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   ticketNumber: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//   },
//   ticketStatus: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     backgroundColor: 'rgba(1, 69, 96, 0.8)',
//     borderWidth: 1,
//     borderColor: 'rgba(240, 174, 19, 0.3)',
//   },
//   ticketCompleted: {
//     backgroundColor: 'rgba(39, 174, 96, 0.15)',
//     borderColor: SUCCESS_COLOR,
//   },
//   ticketIncomplete: {
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     borderColor: ACCENT_COLOR,
//   },
//   ticketStatusText: {
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   // Ticket Grid
//   ticketGridContainer: {
//     marginBottom: 10,
//   },
//   ticketRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   ticketCell: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 6,
//     marginHorizontal: 2,
//     borderWidth: 1,
//   },
//   ticketCellEmpty: {
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   ticketCellFilled: {
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     borderColor: ACCENT_COLOR,
//   },
//   ticketCellMarked: {
//     backgroundColor: DANGER_COLOR,
//     borderColor: '#C0392B',
//   },
//   ticketCellNumber: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//   },
//   ticketCellNumberMarked: {
//     color: WHITE,
//     fontWeight: '700',
//   },
//   ticketStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   ticketStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ticketStatText: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//   },
//   fullHouseBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(240, 174, 19, 0.15)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//     gap: 4,
//   },
//   fullHouseBadgeText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//   },
//   // Called Numbers
//   calledCount: {
//     fontSize: 13,
//     color: ACCENT_COLOR,
//     fontWeight: '600',
//   },
//   numbersGridContainer: {
//     marginBottom: 16,
//   },
//   numberRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   numberCell: {
//     width: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//     backgroundColor: 'rgba(1, 69, 96, 0.5)',
//     marginHorizontal: 1,
//     position: 'relative',
//   },
//   calledNumberCell: {
//     backgroundColor: SUCCESS_COLOR,
//     borderColor: SUCCESS_COLOR,
//   },
//   latestNumberCell: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: ACCENT_COLOR,
//   },
//   numberCellText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: LIGHT_ACCENT,
//   },
//   calledNumberText: {
//     color: WHITE,
//     fontWeight: '700',
//   },
//   latestNumberText: {
//     color: SECONDARY_COLOR,
//     fontWeight: '800',
//   },
//   latestIndicator: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: WHITE,
//     borderRadius: 4,
//     padding: 1,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 3,
//     borderWidth: 1,
//     borderColor: 'rgba(240, 174, 19, 0.2)',
//   },
//   legendNormal: {
//     backgroundColor: 'rgba(1, 69, 96, 0.5)',
//   },
//   legendCalled: {
//     backgroundColor: SUCCESS_COLOR,
//   },
//   legendLatest: {
//     backgroundColor: ACCENT_COLOR,
//   },
//   legendText: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//   },
//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     padding: 24,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     marginTop: 8,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   // Loading
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: PRIMARY_COLOR,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: ACCENT_COLOR,
//     marginTop: 12,
//     fontWeight: '500',
//   },
//   bottomSpace: {
//     height: 20,
//   },
// });

// export default UserGameResult;



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
  Image,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
const WARNING_COLOR = "#ff9800"; // Orange accent for warnings

const UserGameResult = ({ route, navigation }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [myWinnings, setMyWinnings] = useState([]);
  const [allWinners, setAllWinners] = useState([]);
  const [gameStats, setGameStats] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Static coins in background
  const goldCoins = [
    { id: 1, top: '15%', left: '5%', size: 25 },
    { id: 2, top: '25%', left: '85%', size: 20 },
    { id: 3, top: '40%', left: '15%', size: 22 },
    { id: 4, top: '55%', left: '75%', size: 18 },
    { id: 5, top: '70%', left: '10%', size: 24 },
    { id: 6, top: '80%', left: '80%', size: 19 },
    { id: 7, top: '30%', left: '60%', size: 21 },
    { id: 8, top: '65%', left: '40%', size: 23 },
    { id: 9, top: '45%', left: '90%', size: 17 },
    { id: 10, top: '85%', left: '30%', size: 20 },
  ];

  useEffect(() => {
    startAnimations();
    fetchGameResults();
  }, []);

  const startAnimations = () => {
    // Float animation 1
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

    // Float animation 2
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

    // Pulse animation
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

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  };

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10]
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8]
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const fetchGameResults = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status) {
        const data = response.data.data;
        setGameData(data);
        
        // Set tickets
        if (data.my_tickets_complete_data) {
          setMyTickets(data.my_tickets_complete_data);
        }
        
        // Set my winnings
        if (data.my_participation?.winning_patterns) {
          setMyWinnings(data.my_participation.winning_patterns);
        }
        
        // Set all winners
        if (data.all_game_winners?.winners_list) {
          setAllWinners(data.all_game_winners.winners_list);
        }
        
        // Set game stats
        if (data.game_statistics) {
          setGameStats(data.game_statistics);
        }
        
        // Set called numbers
        if (data.number_calling_history?.called_numbers) {
          setCalledNumbers(data.number_calling_history.called_numbers);
        }
      }
    } catch (error) {
      console.log("Error fetching game results:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGameResults().finally(() => setRefreshing(false));
  }, []);

  const renderTicketGrid = (ticketData) => {
    const TICKET_WIDTH = width - 64;
    const CELL_SIZE = Math.max(24, Math.min((TICKET_WIDTH - 40) / 9, 28));
    
    const processTicketData = (data) => {
      if (!data || !Array.isArray(data)) return Array(3).fill(Array(9).fill(null));
      
      const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
      data.forEach((row, rowIndex) => {
        row.forEach((cell) => {
          if (cell && cell.number !== null && cell.column !== undefined) {
            processedGrid[rowIndex][cell.column] = cell;
          }
        });
      });
      
      return processedGrid;
    };

    const processedData = processTicketData(ticketData);

    return (
      <View style={[styles.ticketGridContainer, { height: CELL_SIZE * 3 + 8 }]}>
        {processedData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.ticketRow}>
            {row.map((cell, colIndex) => {
              const cellObj = cell;
              const cellNumber = cellObj?.number;
              const isMarked = cellObj?.is_marked || false;
              const isEmpty = cellNumber === null || cellNumber === undefined;
              
              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.ticketCell,
                    { 
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    },
                    isEmpty ? styles.ticketCellEmpty : styles.ticketCellFilled,
                    isMarked && styles.ticketCellMarked,
                  ]}
                >
                  {!isEmpty && (
                    <Text style={[
                      styles.ticketCellNumber,
                      isMarked && styles.ticketCellNumberMarked
                    ]}>
                      {cellNumber}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Game Stats - 2x2 Grid */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="chart-line" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>Game Statistics</Text>
          </View>
        </View>
        
        {gameStats && (
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="account-group" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{gameStats.participant_statistics?.total_participants || 0}</Text>
                  <Text style={styles.statLabel}>Participants</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="ticket-confirmation" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{gameStats.ticket_statistics?.allocated_tickets || 0}</Text>
                  <Text style={styles.statLabel}>Tickets Sold</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="trophy" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{gameStats.winner_statistics?.total_winners || 0}</Text>
                  <Text style={styles.statLabel}>Winners</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="currency-inr" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>₹{gameStats.winner_statistics?.total_winnings_distributed || 0}</Text>
                  <Text style={styles.statLabel}>Total Winnings</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* My Performance - 2x2 Grid */}
      {gameData?.my_participation && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="medal" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.cardTitle}>My Performance</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="ticket-confirmation" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{gameData.my_participation.tickets_count || 0}</Text>
                  <Text style={styles.statLabel}>My Tickets</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={SUCCESS_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{gameData.my_participation.claims_summary?.approved_claims || 0}</Text>
                  <Text style={styles.statLabel}>Approved</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="currency-inr" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>₹{gameData.my_participation.total_winnings || 0}</Text>
                  <Text style={styles.statLabel}>My Winnings</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="trophy" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{gameData.my_participation.winning_patterns?.length || 0}</Text>
                  <Text style={styles.statLabel}>Patterns Won</Text>
                </View>
              </View>
            </View>
          </View>
          
          {gameData.my_participation.won_this_game && (
            <View style={styles.winnerBadge}>
              <MaterialCommunityIcons name="trophy" size={16} color={ACCENT_COLOR} />
              <Text style={styles.winnerBadgeText}>YOU WON IN THIS GAME! 🎉</Text>
            </View>
          )}
        </View>
      )}

      {/* Number Calling Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="numeric" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>Number Calling Summary</Text>
          </View>
        </View>
        
        <View style={styles.numberSummary}>
          <View style={styles.numberSummaryItem}>
            <Text style={styles.numberSummaryValue}>{calledNumbers.length}</Text>
            <Text style={styles.numberSummaryLabel}>Numbers Called</Text>
          </View>
          
          <View style={styles.numberSummaryDivider} />
          
          <View style={styles.numberSummaryItem}>
            <Text style={styles.numberSummaryValue}>{90 - calledNumbers.length}</Text>
            <Text style={styles.numberSummaryLabel}>Numbers Left</Text>
          </View>
          
          <View style={styles.numberSummaryDivider} />
          
          <View style={styles.numberSummaryItem}>
            <Text style={styles.numberSummaryValue}>
              {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : 'N/A'}
            </Text>
            <Text style={styles.numberSummaryLabel}>Last Number</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderWinnersTab = () => (
    <View style={styles.tabContent}>
      {/* Top Winners */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="crown" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>Top Winners</Text>
          </View>
          <Text style={styles.winnerCount}>
            {gameData?.all_game_winners?.total_winners || 0} Winners
          </Text>
        </View>
        
        {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
          <View style={styles.winnersList}>
            {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
              <View key={index} style={[
                styles.winnerItem,
                winner.is_me && styles.myWinnerItem
              ]}>
                <View style={[styles.winnerRank, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <Text style={[styles.winnerRankText, { color: PRIMARY_COLOR }]}>#{index + 1}</Text>
                </View>
                
                <View style={styles.winnerInfo}>
                  <Text style={[
                    styles.winnerName,
                    winner.is_me && styles.myWinnerName
                  ]}>
                    {winner.winner_name}
                    {winner.is_me && " (You)"}
                  </Text>
                  <Text style={styles.winnerPattern}>{winner.pattern_name}</Text>
                </View>
                
                <View style={styles.winnerPrize}>
                  <Text style={styles.winnerPrizeAmount}>₹{winner.winning_amount}</Text>
                  {index === 0 && (
                    <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="trophy-outline" size={40} color={TEXT_LIGHT} />
            <Text style={styles.emptyStateText}>No winners data available</Text>
          </View>
        )}
      </View>

      {/* All Winners List */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>All Winners</Text>
          </View>
        </View>
        
        {allWinners.length > 0 ? (
          <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
            {allWinners.map((winner, index) => (
              <View key={index} style={[
                styles.allWinnerItem,
                winner.is_me && styles.myAllWinnerItem
              ]}>
                <View style={styles.allWinnerLeft}>
                  <View style={[styles.allWinnerAvatar, { backgroundColor: PRIMARY_COLOR }]}>
                    <Text style={styles.allWinnerAvatarText}>
                      {winner.winner_name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.allWinnerInfo}>
                    <Text style={[
                      styles.allWinnerName,
                      winner.is_me && styles.myAllWinnerName
                    ]}>
                      {winner.winner_name}
                      {winner.is_me && " (You)"}
                    </Text>
                    <Text style={styles.allWinnerPattern}>{winner.reward_name}</Text>
                  </View>
                </View>
                
                <View style={styles.allWinnerRight}>
                  <Text style={styles.allWinnerAmount}>₹{winner.winning_amount}</Text>
                  <Text style={styles.allWinnerTime}>
                    {new Date(winner.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={40} color={TEXT_LIGHT} />
            <Text style={styles.emptyStateText}>No winners found</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderMyTicketsTab = () => (
    <View style={styles.tabContent}>
      {/* My Winnings Summary */}
      {myWinnings.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="trophy" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.cardTitle}>My Winnings</Text>
            </View>
            <View style={styles.winningsTotal}>
              <Text style={styles.winningsTotalText}>
                ₹{gameData?.my_participation?.total_winnings || 0}
              </Text>
            </View>
          </View>
          
          <View style={styles.myWinningsList}>
            {myWinnings.map((winning, index) => (
              <View key={index} style={styles.winningItem}>
                <View style={[styles.winningIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <MaterialCommunityIcons name="trophy" size={18} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.winningInfo}>
                  <Text style={styles.winningPattern}>{winning.reward_name}</Text>
                  <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
                  <Text style={styles.winningTime}>
                    {new Date(winning.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
                <View style={styles.winningAmountContainer}>
                  <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* My Tickets */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="ticket-confirmation" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>My Tickets</Text>
          </View>
          <Text style={styles.ticketCount}>
            {myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {myTickets.length > 0 ? (
          <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
            {myTickets.map((ticket, index) => (
              <View key={index} style={styles.ticketItem}>
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketNumberContainer}>
                    <MaterialCommunityIcons name="ticket-confirmation" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.ticketNumber}>Ticket #{ticket.ticket_number}</Text>
                  </View>
                  <View style={[
                    styles.ticketStatus,
                    ticket.is_completed ? styles.ticketCompleted : styles.ticketIncomplete
                  ]}>
                    <Text style={[
                      styles.ticketStatusText,
                      ticket.is_completed ? { color: SUCCESS_COLOR } : { color: PRIMARY_COLOR }
                    ]}>
                      {ticket.is_completed ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}
                    </Text>
                  </View>
                </View>
                
                {/* Ticket Grid */}
                {renderTicketGrid(ticket.ticket_data)}
                
                <View style={styles.ticketStats}>
                  <View style={styles.ticketStat}>
                    <MaterialCommunityIcons name="check-circle" size={12} color={SUCCESS_COLOR} />
                    <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
                  </View>
                  <View style={styles.ticketStat}>
                    <MaterialCommunityIcons name="close-circle" size={12} color={ERROR_COLOR} />
                    <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
                  </View>
                  {ticket.marked_numbers_count === 15 && (
                    <View style={styles.fullHouseBadge}>
                      <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
                      <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="ticket-outline" size={40} color={TEXT_LIGHT} />
            <Text style={styles.emptyStateText}>No tickets found</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCalledNumbersTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="grid" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.cardTitle}>Called Numbers</Text>
          </View>
          <Text style={styles.calledCount}>
            {calledNumbers.length}/90 Numbers
          </Text>
        </View>
        
        {calledNumbers.length > 0 ? (
          <View style={styles.numbersGridContainer}>
            {Array.from({ length: 9 }, (_, row) => (
              <View key={row} style={styles.numberRow}>
                {Array.from({ length: 10 }, (_, col) => {
                  const number = row * 10 + col + 1;
                  const isCalled = calledNumbers.includes(number);
                  const isLatest = calledNumbers.length > 0 && 
                    number === calledNumbers[calledNumbers.length - 1];
                  
                  return (
                    <View
                      key={number}
                      style={[
                        styles.numberCell,
                        isCalled && styles.calledNumberCell,
                        isLatest && styles.latestNumberCell,
                      ]}
                    >
                      <Text style={[
                        styles.numberCellText,
                        isCalled && styles.calledNumberText,
                        isLatest && styles.latestNumberText,
                      ]}>
                        {number}
                      </Text>
                      {isLatest && (
                        <View style={styles.latestIndicator}>
                          <MaterialCommunityIcons name="star" size={6} color={WHITE} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="numeric-off" size={40} color={TEXT_LIGHT} />
            <Text style={styles.emptyStateText}>No numbers called</Text>
          </View>
        )}
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendNormal]} />
            <Text style={styles.legendText}>Not Called</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendCalled]} />
            <Text style={styles.legendText}>Called</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendLatest]} />
            <Text style={styles.legendText}>Latest</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading Game Results...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
      {/* Static Coins Background */}
      <View style={styles.goldCoinsContainer}>
        {goldCoins.map((coin) => (
          <View
            key={coin.id}
            style={[
              styles.goldCoin,
              {
                top: coin.top,
                left: coin.left,
                width: coin.size,
                height: coin.size,
                borderRadius: coin.size / 2,
              }
            ]}
          >
            <View style={styles.coinInner} />
            <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
          </View>
        ))}
      </View>

      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <View style={styles.headerPattern}>
          <View style={styles.headerCloud1} />
          <View style={styles.headerCloud2} />
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={WHITE} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.pageTitle}>Game Results</Text>
              <View style={styles.gameInfoContainer}>
                <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.gameName} numberOfLines={1}>
                  {gameName || "Tambola Game"}
                </Text>
              </View>
            </View>
            
            {/* <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchGameResults}
            >
              <Ionicons name="refresh" size={18} color={WHITE} />
            </TouchableOpacity> */}
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Game Completion Banner */}
          <View style={styles.completionBanner}>
            <View style={styles.completionBannerContent}>
              <MaterialCommunityIcons name="party-popper" size={32} color={ACCENT_COLOR} />
              <View style={styles.completionTextContainer}>
                <Text style={styles.completionTitle}>Game Completed!</Text>
                <Text style={styles.completionSubtitle}>
                  All {calledNumbers.length} numbers have been called
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
                onPress={() => setSelectedTab("overview")}
              >
                <Ionicons 
                  name="stats-chart" 
                  size={14} 
                  color={selectedTab === "overview" ? WHITE : PRIMARY_COLOR} 
                />
                <Text style={[styles.tabText, selectedTab === "overview" && styles.activeTabText]}>
                  Overview
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, selectedTab === "winners" && styles.activeTab]}
                onPress={() => setSelectedTab("winners")}
              >
                <Ionicons 
                  name="trophy" 
                  size={14} 
                  color={selectedTab === "winners" ? WHITE : PRIMARY_COLOR} 
                />
                <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>
                  Winners
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]}
                onPress={() => setSelectedTab("mytickets")}
              >
                <Ionicons 
                  name="ticket" 
                  size={14} 
                  color={selectedTab === "mytickets" ? WHITE : PRIMARY_COLOR} 
                />
                <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>
                  My Tickets
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, selectedTab === "numbers" && styles.activeTab]}
                onPress={() => setSelectedTab("numbers")}
              >
                <Ionicons 
                  name="grid" 
                  size={14} 
                  color={selectedTab === "numbers" ? WHITE : PRIMARY_COLOR} 
                />
                <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>
                  Numbers
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Tab Content */}
          {selectedTab === "overview" && renderOverviewTab()}
          {selectedTab === "winners" && renderWinnersTab()}
          {selectedTab === "mytickets" && renderMyTicketsTab()}
          {selectedTab === "numbers" && renderCalledNumbersTab()}

          <View style={styles.bottomSpace} />
        </View>
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
  // Coins Background
  goldCoinsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  goldCoin: {
    position: 'absolute',
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  coinInner: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  coinSymbol: {
    color: WHITE,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Header
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerCloud1: {
    position: 'absolute',
    top: 15,
    left: 20,
    width: 45,
    height: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCloud2: {
    position: 'absolute',
    top: 35,
    right: 30,
    width: 30,
    height: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  gameInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  gameName: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    flex: 1,
  },
  refreshButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  content: {
    padding: 16,
  },
  // Completion Banner
  completionBanner: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completionBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionTextContainer: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  completionSubtitle: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  // Tabs
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: WHITE,
    marginRight: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  activeTabText: {
    color: WHITE,
  },
  // Cards
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  tabContent: {
    marginBottom: 16,
  },
  // Stats Grid
  statsGrid: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: '500',
  },
  // Number Summary
  numberSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  numberSummaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: ACCENT_COLOR,
    marginBottom: 4,
  },
  numberSummaryLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: '500',
    textAlign: 'center',
  },
  numberSummaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: BORDER_COLOR,
  },
  // Winner Badge
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    gap: 8,
  },
  winnerBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  // Winners List
  winnerCount: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  winnersList: {
    gap: 10,
  },
  winnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  myWinnerItem: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: ACCENT_COLOR,
  },
  winnerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  winnerRankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  myWinnerName: {
    color: ACCENT_COLOR,
  },
  winnerPattern: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  winnerPrize: {
    alignItems: 'center',
  },
  winnerPrizeAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: ACCENT_COLOR,
    marginBottom: 2,
  },
  // All Winners List
  allWinnersList: {
    maxHeight: 300,
  },
  allWinnerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  myAllWinnerItem: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    marginHorizontal: -8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  allWinnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  allWinnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  allWinnerAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },
  allWinnerInfo: {
    flex: 1,
  },
  allWinnerName: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  myAllWinnerName: {
    color: ACCENT_COLOR,
  },
  allWinnerPattern: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  allWinnerRight: {
    alignItems: 'flex-end',
  },
  allWinnerAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: ACCENT_COLOR,
    marginBottom: 2,
  },
  allWinnerTime: {
    fontSize: 10,
    color: TEXT_LIGHT,
  },
  // My Winnings
  winningsTotal: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  winningsTotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  myWinningsList: {
    gap: 10,
  },
  winningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  winningIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  winningInfo: {
    flex: 1,
  },
  winningPattern: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  winningTicket: {
    fontSize: 11,
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  winningTime: {
    fontSize: 10,
    color: TEXT_LIGHT,
  },
  winningAmountContainer: {
    alignItems: 'center',
  },
  winningAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: ACCENT_COLOR,
  },
  // My Tickets
  ticketCount: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  myTicketsList: {
    maxHeight: 500,
  },
  ticketItem: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  ticketStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  ticketCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: SUCCESS_COLOR,
  },
  ticketIncomplete: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderColor: PRIMARY_COLOR,
  },
  ticketStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  // Ticket Grid
  ticketGridContainer: {
    marginBottom: 10,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  ticketCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
    borderWidth: 1,
  },
  ticketCellEmpty: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderColor: BORDER_COLOR,
  },
  ticketCellFilled: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderColor: PRIMARY_COLOR,
  },
  ticketCellMarked: {
    backgroundColor: ERROR_COLOR,
    borderColor: '#C0392B',
  },
  ticketCellNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  ticketCellNumberMarked: {
    color: WHITE,
    fontWeight: '700',
  },
  ticketStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ticketStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketStatText: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  fullHouseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    gap: 4,
  },
  fullHouseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  // Called Numbers
  calledCount: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  numbersGridContainer: {
    marginBottom: 16,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  numberCell: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: WHITE,
    marginHorizontal: 1,
    position: 'relative',
  },
  calledNumberCell: {
    backgroundColor: SUCCESS_COLOR,
    borderColor: SUCCESS_COLOR,
  },
  latestNumberCell: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  numberCellText: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  calledNumberText: {
    color: WHITE,
    fontWeight: '700',
  },
  latestNumberText: {
    color: WHITE,
    fontWeight: '800',
  },
  latestIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: WHITE,
    borderRadius: 4,
    padding: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  legendNormal: {
    backgroundColor: WHITE,
  },
  legendCalled: {
    backgroundColor: SUCCESS_COLOR,
  },
  legendLatest: {
    backgroundColor: ACCENT_COLOR,
  },
  legendText: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    marginTop: 12,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 20,
  },
});

export default UserGameResult;