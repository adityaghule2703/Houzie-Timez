// // // // import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   ActivityIndicator,
// // // //   StyleSheet,
// // // //   RefreshControl,
// // // //   Dimensions,
// // // //   TextInput,
// // // //   Keyboard,
// // // //   Animated,
// // // //   Easing,
// // // //   FlatList,
// // // //   SafeAreaView,
// // // //   Alert,
// // // //   StatusBar,
// // // //   Platform,
// // // // } from "react-native";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import axios from "axios";
// // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// // // // const { width } = Dimensions.get('window');

// // // // // Enhanced color palette with more shades
// // // // const COLORS = {
// // // //   background: '#F0F7FF',
// // // //   surface: '#FFFFFF',
// // // //   primary: '#2E5BFF', // Vibrant blue
// // // //   primaryLight: '#E1EBFF',
// // // //   primaryDark: '#1A3A9E',
// // // //   accent: '#3B82F6', // Medium blue for accents
// // // //   secondary: '#60A5FA', // Light blue
// // // //   tertiary: '#2563EB', // Darker blue for contrast
// // // //   text: '#1E293B',
// // // //   textSecondary: '#64748B',
// // // //   textLight: '#94A3B8',
// // // //   border: '#E2E8F0',
  
// // // //   // New card background variants
// // // //   cardBlue1: '#E8F0FE',
// // // //   cardBlue2: '#D4E4FF',
// // // //   cardBlue3: '#C2D6FF',
// // // //   cardBlue4: '#E3F2FD',
// // // //   cardBlue5: '#E6F0FA',
  
// // // //   // Accent colors
// // // //   purple: '#8B5CF6',
// // // //   purpleLight: '#EDE9FE',
// // // //   orange: '#F97316',
// // // //   orangeLight: '#FFF3E6',
// // // //   pink: '#EC4899',
// // // //   pinkLight: '#FCE8F0',
// // // //   teal: '#14B8A6',
// // // //   tealLight: '#D5F5F0',
  
// // // //   // Status colors
// // // //   live: '#10B981',
// // // //   scheduled: '#F59E0B',
// // // //   completed: '#ed3e3e',
  
// // // //   // Block colors - Blue shades
// // // //   blockLightBlue: '#E1EBFF',
// // // //   blockMediumBlue: '#C2D6FF',
// // // //   blockDarkBlue: '#A3C1FF',
// // // // };

// // // // const Game = ({ navigation }) => {
// // // //   const [games, setGames] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [userGameData, setUserGameData] = useState({
// // // //     myTickets: [],
// // // //     myRequests: []
// // // //   });
// // // //   const [activeTab, setActiveTab] = useState('myGames');
  
// // // //   // Scroll Y position for background animation
// // // //   const scrollY = useRef(new Animated.Value(0)).current;
  
// // // //   // Cache for filtered results
// // // //   const [filteredGamesCache, setFilteredGamesCache] = useState({
// // // //     myGames: [],
// // // //     allGames: [],
// // // //     completed: []
// // // //   });

// // // //   // Filter options for tabs
// // // //   const tabs = [
// // // //     { id: 'myGames', label: 'My Games' },
// // // //     { id: 'allGames', label: 'All Games' },
// // // //     { id: 'completed', label: 'Completed' }
// // // //   ];

// // // //   useEffect(() => {
// // // //     fetchAllData();
// // // //   }, []);

// // // //   // Update cache whenever games or userGameData changes
// // // //   useEffect(() => {
// // // //     if (games.length > 0) {
// // // //       updateFilteredGamesCache();
// // // //     }
// // // //   }, [games, userGameData, searchQuery]);

// // // //   const updateFilteredGamesCache = useCallback(() => {
// // // //     let filtered = games;

// // // //     if (searchQuery.trim()) {
// // // //       filtered = filtered.filter(game =>
// // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // //       );
// // // //     }

// // // //     const myGamesFiltered = filtered.filter(game => isUserPlayingGame(game.id));
// // // //     const completedFiltered = filtered.filter(game => game.status === 'completed');
// // // //     const allGamesFiltered = filtered;

// // // //     setFilteredGamesCache({
// // // //       myGames: myGamesFiltered,
// // // //       allGames: allGamesFiltered,
// // // //       completed: completedFiltered
// // // //     });
// // // //   }, [games, searchQuery, userGameData]);

// // // //   const onRefresh = useCallback(() => {
// // // //     setRefreshing(true);
// // // //     setGames([]);
// // // //     setUserGameData({
// // // //       myTickets: [],
// // // //       myRequests: []
// // // //     });
// // // //     fetchAllData(true).finally(() => setRefreshing(false));
// // // //   }, []);

// // // //   const fetchAllData = async (reset = false) => {
// // // //     setLoading(true);
// // // //     try {
// // // //       // Fetch all pages of games
// // // //       await fetchAllGames();
      
// // // //       // Fetch user data
// // // //       await Promise.all([
// // // //         fetchMyTickets(),
// // // //         fetchMyRequests()
// // // //       ]);
      
// // // //     } catch (error) {
// // // //       console.log("Error fetching data:", error);
// // // //       Alert.alert("Error", "Failed to load games data!");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const fetchAllGames = async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       let page = 1;
// // // //       let allGames = [];
// // // //       let hasMorePages = true;
      
// // // //       while (hasMorePages) {
// // // //         const res = await axios.get(
// // // //           `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         );
        
// // // //         if (res.data.success) {
// // // //           const gamesData = res.data.games.data || [];
// // // //           allGames = [...allGames, ...gamesData];
          
// // // //           const paginationData = res.data.games;
// // // //           hasMorePages = paginationData.current_page < paginationData.last_page;
// // // //           page++;
// // // //         } else {
// // // //           hasMorePages = false;
// // // //         }
// // // //       }
      
// // // //       setGames(allGames);
// // // //     } catch (error) {
// // // //       console.log("Error fetching games:", error);
// // // //       Alert.alert("Error", "Failed to load games!");
// // // //     }
// // // //   };

// // // //   const fetchMyTickets = async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       const res = await axios.get(
// // // //         "https://tambolatime.co.in/public/api/user/my-tickets",
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       if (res.data.success) {
// // // //         setUserGameData(prev => ({
// // // //           ...prev,
// // // //           myTickets: res.data.tickets.data || []
// // // //         }));
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching tickets:", error);
// // // //     }
// // // //   };

// // // //   const fetchMyRequests = async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       const res = await axios.get(
// // // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       if (res.data.success) {
// // // //         setUserGameData(prev => ({
// // // //           ...prev,
// // // //           myRequests: res.data.ticket_requests.data || []
// // // //         }));
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching requests:", error);
// // // //     }
// // // //   };

// // // //   const isUserPlayingGame = useCallback((gameId) => {
// // // //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// // // //     const hasPendingRequests = userGameData.myRequests.some(request => 
// // // //       request.game_id == gameId && request.status === 'pending'
// // // //     );
    
// // // //     return hasTickets || hasPendingRequests;
// // // //   }, [userGameData]);

// // // //   const getUserTicketCount = useCallback((gameId) => {
// // // //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// // // //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// // // //       request.game_id == gameId && request.status === 'pending'
// // // //     ).length;
    
// // // //     return {
// // // //       tickets: ticketsCount,
// // // //       pendingRequests: pendingRequestsCount,
// // // //       total: ticketsCount + pendingRequestsCount
// // // //     };
// // // //   }, [userGameData]);

// // // //   const handleTabChange = useCallback((tab) => {
// // // //     setActiveTab(tab);
    
// // // //     if (tab === 'myGames') {
// // // //       fetchMyTickets();
// // // //       fetchMyRequests();
// // // //     }
// // // //   }, []);

// // // //   const getCurrentTabData = useCallback(() => {
// // // //     switch (activeTab) {
// // // //       case 'myGames':
// // // //         return filteredGamesCache.myGames;
// // // //       case 'completed':
// // // //         return filteredGamesCache.completed;
// // // //       case 'allGames':
// // // //       default:
// // // //         return filteredGamesCache.allGames;
// // // //     }
// // // //   }, [activeTab, filteredGamesCache]);

// // // //   const getTabCount = useCallback((tab) => {
// // // //     switch (tab) {
// // // //       case 'myGames':
// // // //         return filteredGamesCache.myGames.length;
// // // //       case 'completed':
// // // //         return filteredGamesCache.completed.length;
// // // //       case 'allGames':
// // // //       default:
// // // //         return filteredGamesCache.allGames.length;
// // // //     }
// // // //   }, [filteredGamesCache]);

// // // //   const clearSearch = () => {
// // // //     setSearchQuery('');
// // // //   };

// // // //   // Animated background that moves with scroll
// // // //   const AnimatedBackground = () => {
// // // //     const block1TranslateY = scrollY.interpolate({
// // // //       inputRange: [0, 300],
// // // //       outputRange: [0, -50],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     const block2TranslateY = scrollY.interpolate({
// // // //       inputRange: [0, 400],
// // // //       outputRange: [0, -30],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     const block3TranslateY = scrollY.interpolate({
// // // //       inputRange: [0, 500],
// // // //       outputRange: [0, -20],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     const opacity = scrollY.interpolate({
// // // //       inputRange: [0, 200, 400],
// // // //       outputRange: [1, 0.8, 0.6],
// // // //       extrapolate: 'clamp'
// // // //     });

// // // //     return (
// // // //       <>
// // // //         <Animated.View 
// // // //           style={[
// // // //             styles.blueBlock1,
// // // //             {
// // // //               transform: [{ translateY: block1TranslateY }],
// // // //               opacity
// // // //             }
// // // //           ]} 
// // // //         />
// // // //         <Animated.View 
// // // //           style={[
// // // //             styles.blueBlock2,
// // // //             {
// // // //               transform: [{ translateY: block2TranslateY }],
// // // //               opacity: opacity.interpolate({
// // // //                 inputRange: [0.6, 1],
// // // //                 outputRange: [0.4, 0.8]
// // // //               })
// // // //             }
// // // //           ]} 
// // // //         />
// // // //         <Animated.View 
// // // //           style={[
// // // //             styles.blueBlock3,
// // // //             {
// // // //               transform: [{ translateY: block3TranslateY }],
// // // //               opacity: opacity.interpolate({
// // // //                 inputRange: [0.6, 1],
// // // //                 outputRange: [0.2, 0.5]
// // // //               })
// // // //             }
// // // //           ]} 
// // // //         />
// // // //       </>
// // // //     );
// // // //   };

// // // //   // Enhanced Card Background with only circles (removed all patterns)
// // // //   const CardBackground = ({ game, accentColor }) => {
// // // //     const isPlaying = isUserPlayingGame(game.id);
// // // //     const isCompleted = game.status === 'completed';
// // // //     const isLive = game.status === 'live';
    
// // // //     // Choose background color based on game status
// // // //     let backgroundColor;
// // // //     if (isPlaying) {
// // // //       backgroundColor = COLORS.cardBlue1;
// // // //     } else if (isLive) {
// // // //       backgroundColor = COLORS.cardBlue2;
// // // //     } else if (isCompleted) {
// // // //       backgroundColor = '#F8FAFC';
// // // //     } else {
// // // //       backgroundColor = COLORS.cardBlue4;
// // // //     }
    
// // // //     return (
// // // //       <View style={[styles.cardBackground, { backgroundColor }]}>
// // // //         {/* Decorative circles with different colors */}
// // // //         <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
// // // //         <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
// // // //         <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
        
// // // //         {/* Small floating particles */}
// // // //         <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
// // // //         <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
// // // //         <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
// // // //         <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
// // // //       </View>
// // // //     );
// // // //   };

// // // //   // Enhanced Header with semicircle shape and UK-style rounded lines
// // // //   const Header = () => (
// // // //     <View style={styles.headerWrapper}>
// // // //       {/* Semicircle Background */}
// // // //       <View style={styles.semicircleBackground}>
// // // //         <View style={styles.semicircle} />
// // // //       </View>
      
// // // //       {/* UK-style Rounded Lines Pattern */}
// // // //       <View style={styles.ukPatternContainer}>
// // // //         <View style={styles.curvedLine1} />
// // // //         <View style={styles.curvedLine2} />
// // // //         <View style={styles.curvedLine3} />
        
// // // //         <View style={styles.parallelLines}>
// // // //           <View style={styles.parallelLine} />
// // // //           <View style={styles.parallelLine} />
// // // //           <View style={styles.parallelLine} />
// // // //         </View>
        
// // // //         <View style={styles.dottedCircle1}>
// // // //           {[...Array(8)].map((_, i) => (
// // // //             <View 
// // // //               key={i} 
// // // //               style={[
// // // //                 styles.dottedCircleDot,
// // // //                 {
// // // //                   transform: [
// // // //                     { rotate: `${i * 45}deg` },
// // // //                     { translateX: 30 }
// // // //                   ]
// // // //                 }
// // // //               ]} 
// // // //             />
// // // //           ))}
// // // //         </View>
        
// // // //         <View style={styles.decorativeDot1} />
// // // //         <View style={styles.decorativeDot2} />
// // // //         <View style={styles.decorativeLine1} />
// // // //         <View style={styles.decorativeLine2} />
// // // //       </View>

// // // //       {/* Header Content */}
// // // //       <View style={styles.headerContent}>
// // // //         <View>
// // // //           <Text style={styles.greeting}>Welcome back to</Text>
// // // //           <Text style={styles.title}>
// // // //             Tambola <Text style={styles.titleBold}>Games</Text>
// // // //           </Text>
// // // //         </View>
// // // //         <View style={styles.headerRight}>
// // // //           {filteredGamesCache.myGames.length > 0 && (
// // // //             <View style={styles.playingCountBadge}>
// // // //               <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
// // // //               <Text style={styles.playingCountText}>{filteredGamesCache.myGames.length}</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const renderGameCard = useCallback(({ item: game, index }) => {
// // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // //     const ticketInfo = getUserTicketCount(game.id);
// // // //     const isPlaying = isUserPlayingGame(game.id);
// // // //     const isCompleted = game.status === 'completed';
// // // //     const isLive = game.status === 'live';
// // // //     const isScheduled = game.status === 'scheduled';
    
// // // //     // Get status color and text
// // // //     let statusColor = COLORS.scheduled;
// // // //     let statusText = 'Upcoming';
// // // //     let statusIcon = 'time-outline';
// // // //     if (isLive) {
// // // //       statusColor = COLORS.live;
// // // //       statusText = 'Live Now';
// // // //       statusIcon = 'radio-button-on';
// // // //     } else if (isCompleted) {
// // // //       statusColor = COLORS.completed;
// // // //       statusText = 'Completed';
// // // //       statusIcon = 'checkmark-circle';
// // // //     }
    
// // // //     // Different accent colors for each card
// // // //     const accentColors = [COLORS.primary, COLORS.purple, COLORS.orange, COLORS.pink, COLORS.teal];
// // // //     const accentColor = accentColors[index % accentColors.length];
// // // //     const accentLight = accentColors.map(c => c + '20')[index % accentColors.length];
    
// // // //     return (
// // // //       <TouchableOpacity
// // // //         style={[
// // // //           styles.gameCard,
// // // //           isPlaying && styles.playingGameCard,
// // // //         ]}
// // // //         activeOpacity={0.95}
// // // //         onPress={() => navigation.navigate("GameDetails", { game })}
// // // //       >
// // // //         {/* Layered Background with colors and only circles */}
// // // //         <CardBackground game={game} accentColor={accentColor} />

// // // //         {/* Status badge - TOP LEFT corner */}
// // // //         <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
// // // //           <Ionicons name={statusIcon} size={12} color="#FFFFFF" />
// // // //           <Text style={styles.statusBadgeText}>{statusText}</Text>
// // // //         </View>

// // // //         {/* Playing indicator - TOP RIGHT corner */}
// // // //         {isPlaying && (
// // // //           <View style={[styles.playingBadge, { backgroundColor: COLORS.primary }]}>
// // // //             <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
// // // //             <Text style={styles.playingBadgeText}>You're Playing</Text>
// // // //           </View>
// // // //         )}

// // // //         <View style={styles.gameCardHeader}>
// // // //           {/* Icon/Logo at top left */}
// // // //           <View style={styles.gameIconContainer}>
// // // //             <View style={[
// // // //               styles.gameIconWrapper, 
// // // //               { backgroundColor: accentLight || COLORS.primaryLight }
// // // //             ]}>
// // // //               <MaterialIcons name="sports-esports" size={24} color={accentColor || COLORS.primary} />
// // // //             </View>
            
// // // //             <View style={styles.gameTitleContainer}>
// // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // //                 {game.game_name || "Tambola Game"}
// // // //               </Text>
// // // //               <Text style={styles.gameCode}>
// // // //                 #{game.game_code || "N/A"}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         <View style={styles.gameCardContent}>
// // // //           {/* Game Meta Information */}
// // // //           <View style={styles.gameMetaRow}>
// // // //             <View style={styles.metaItem}>
// // // //               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
// // // //               <Text style={styles.metaText}>
// // // //                 {game.game_date_formatted || game.game_date || "TBA"}
// // // //               </Text>
// // // //             </View>
// // // //             <View style={styles.metaItem}>
// // // //               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
// // // //               <Text style={styles.metaText}>
// // // //                 {game.game_time_formatted || game.game_start_time || "TBA"}
// // // //               </Text>
// // // //             </View>
// // // //           </View>

// // // //           <View style={styles.gameMetaRow}>
// // // //             <View style={styles.metaItem}>
// // // //               <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
// // // //               <Text style={styles.metaText} numberOfLines={1}>
// // // //                 {game.user ? game.user.name : 'Tambola Timez'}
// // // //               </Text>
// // // //             </View>
// // // //             {game.available_tickets !== undefined && !isCompleted && (
// // // //               <View style={styles.metaItem}>
// // // //                 <MaterialIcons name="confirmation-number" size={14} color={COLORS.textSecondary} />
// // // //                 <Text style={styles.metaText}>
// // // //                   {game.available_tickets} Left
// // // //                 </Text>
// // // //               </View>
// // // //             )}
// // // //           </View>

// // // //           {/* Ticket info if user is playing */}
// // // //           {isPlaying && (
// // // //             <View style={[styles.ticketInfoContainer, { backgroundColor: accentLight }]}>
// // // //               <Text style={[styles.ticketInfoText, { color: accentColor }]}>
// // // //                 {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// // // //                 {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' • ' : ''}
// // // //                 {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// // // //               </Text>
// // // //             </View>
// // // //           )}

// // // //           {/* Prize Pool Section with Ticket Price */}
// // // //           <View style={styles.prizeContainer}>
// // // //             <View style={styles.prizeLeftSection}>
// // // //               <Text style={styles.prizeLabel}>
// // // //                 {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
// // // //               </Text>
// // // //               <Text style={styles.prizeValue}>
// // // //                 {game.ticket_type === "paid" && game.max_tickets 
// // // //                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // // //                   : "Exciting Prizes"}
// // // //               </Text>
// // // //             </View>

// // // //             {/* Ticket Price Badge - Next to prize pool */}
// // // //             {game.ticket_type === "paid" && (
// // // //               <View style={[styles.ticketPriceBadge, { backgroundColor: accentLight }]}>
// // // //                 <MaterialIcons name="diamond" size={14} color={accentColor} />
// // // //                 <Text style={[styles.ticketPriceText, { color: accentColor }]}>₹{ticketCost}</Text>
// // // //               </View>
// // // //             )}
            
// // // //             {/* Action Button */}
// // // //             <TouchableOpacity 
// // // //               style={[styles.actionButton, 
// // // //                 isPlaying && { backgroundColor: accentColor },
// // // //                 isCompleted && { backgroundColor: COLORS.completed }
// // // //               ]}
// // // //               onPress={() => navigation.navigate("GameDetails", { game })}
// // // //             >
// // // //               <Text style={styles.actionButtonText}>
// // // //                 {isCompleted ? 'Results' : isPlaying ? 'View' : isLive ? 'Join' : 'Details'}
// // // //               </Text>
// // // //               <Ionicons 
// // // //                 name={isCompleted ? "trophy" : "arrow-forward"} 
// // // //                 size={14} 
// // // //                 color="#FFFFFF" 
// // // //               />
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>
// // // //       </TouchableOpacity>
// // // //     );
// // // //   }, [isUserPlayingGame, getUserTicketCount, navigation]);

// // // //   const renderTabBar = () => (
// // // //     <View style={styles.tabsContainer}>
// // // //       {tabs.map((tab) => {
// // // //         const isActive = activeTab === tab.id;
// // // //         const tabKey = tab.id;
        
// // // //         return (
// // // //           <TouchableOpacity
// // // //             key={tab.id}
// // // //             style={[
// // // //               styles.tabButton,
// // // //               isActive && styles.tabButtonActive,
// // // //             ]}
// // // //             onPress={() => handleTabChange(tab.id)}
// // // //           >
// // // //             <Text style={[
// // // //               styles.tabButtonText,
// // // //               isActive && styles.tabButtonTextActive
// // // //             ]}>
// // // //               {tab.label}
// // // //             </Text>
// // // //             <View style={[
// // // //               styles.tabCount,
// // // //               isActive && styles.tabCountActive
// // // //             ]}>
// // // //               <Text style={[
// // // //                 styles.tabCountText,
// // // //                 isActive && styles.tabCountTextActive
// // // //               ]}>
// // // //                 {getTabCount(tabKey)}
// // // //               </Text>
// // // //             </View>
// // // //           </TouchableOpacity>
// // // //         );
// // // //       })}
// // // //     </View>
// // // //   );

// // // //   const renderEmptyList = useCallback(() => (
// // // //     <View style={styles.emptyGames}>
// // // //       <Ionicons 
// // // //         name={
// // // //           activeTab === 'myGames' ? "person-outline" : 
// // // //           activeTab === 'completed' ? "trophy-outline" : 
// // // //           "game-controller-outline"
// // // //         } 
// // // //         size={48} 
// // // //         color={COLORS.textLight} 
// // // //       />
// // // //       <Text style={styles.emptyGamesText}>
// // // //         {activeTab === 'myGames' 
// // // //           ? "You haven't joined any games yet"
// // // //           : activeTab === 'completed'
// // // //           ? 'No completed games available'
// // // //           : searchQuery ? 'No games found' : 'No games available'}
// // // //       </Text>
// // // //       {searchQuery && (
// // // //         <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
// // // //           <Text style={styles.clearSearchButtonText}>Clear Search</Text>
// // // //         </TouchableOpacity>
// // // //       )}
// // // //       {activeTab === 'myGames' && !searchQuery && (
// // // //         <TouchableOpacity 
// // // //           style={styles.clearSearchButton}
// // // //           onPress={() => handleTabChange('allGames')}
// // // //         >
// // // //           <Text style={styles.clearSearchButtonText}>Browse All Games</Text>
// // // //         </TouchableOpacity>
// // // //       )}
// // // //     </View>
// // // //   ), [activeTab, searchQuery]);

// // // //   // Handle main scroll for background animation
// // // //   const handleMainScroll = Animated.event(
// // // //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // // //     { useNativeDriver: false }
// // // //   );

// // // //   if (loading && games.length === 0) {
// // // //     return (
// // // //       <SafeAreaView style={styles.safeArea}>
// // // //         <View style={styles.loadingContainer}>
// // // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // // //         </View>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

// // // //       <View style={styles.container}>
// // // //         {/* Animated Color Blocks */}
// // // //         <AnimatedBackground />

// // // //         <Animated.FlatList
// // // //           data={getCurrentTabData()}
// // // //           renderItem={renderGameCard}
// // // //           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // //           showsVerticalScrollIndicator={false}
// // // //           refreshControl={
// // // //             <RefreshControl
// // // //               refreshing={refreshing}
// // // //               onRefresh={onRefresh}
// // // //               tintColor={COLORS.primary}
// // // //               colors={[COLORS.primary]}
// // // //             />
// // // //           }
// // // //           onScroll={handleMainScroll}
// // // //           scrollEventThrottle={16}
// // // //           ListHeaderComponent={
// // // //             <>
// // // //               {/* Enhanced Header */}
// // // //               <Header />

// // // //               {/* Search */}
// // // //               <View style={styles.searchBox}>
// // // //                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
// // // //                 <TextInput
// // // //                   placeholder="Search games by name or ID..."
// // // //                   placeholderTextColor={COLORS.textLight}
// // // //                   style={styles.searchInput}
// // // //                   value={searchQuery}
// // // //                   onChangeText={setSearchQuery}
// // // //                   returnKeyType="search"
// // // //                   onSubmitEditing={Keyboard.dismiss}
// // // //                 />
// // // //                 {searchQuery.length > 0 ? (
// // // //                   <TouchableOpacity onPress={clearSearch}>
// // // //                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// // // //                   </TouchableOpacity>
// // // //                 ) : (
// // // //                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
// // // //                 )}
// // // //               </View>

// // // //               {/* Tabs */}
// // // //               {renderTabBar()}

// // // //               {/* Games Count */}
// // // //               <View style={styles.gamesCountContainer}>
// // // //                 <Text style={styles.gamesCount}>
// // // //                   {getCurrentTabData().length} {getCurrentTabData().length === 1 ? 'Game' : 'Games'} Available
// // // //                 </Text>
// // // //               </View>
// // // //             </>
// // // //           }
// // // //           ListEmptyComponent={renderEmptyList}
// // // //           contentContainerStyle={styles.flatListContent}
// // // //         />
// // // //       </View>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   safeArea: {
// // // //     flex: 1,
// // // //     backgroundColor: COLORS.background,
// // // //   },
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: COLORS.background,
// // // //     paddingHorizontal: 16,
// // // //   },
  
// // // //   /* COLOR BLOCKS - Blue Shades - Animated */
// // // //   blueBlock1: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 280,
// // // //     backgroundColor: COLORS.blockLightBlue,
// // // //     borderBottomLeftRadius: 50,
// // // //     borderBottomRightRadius: 50,
// // // //   },
// // // //   blueBlock2: {
// // // //     position: 'absolute',
// // // //     top: 200,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 160,
// // // //     backgroundColor: COLORS.blockMediumBlue,
// // // //   },
// // // //   blueBlock3: {
// // // //     position: 'absolute',
// // // //     top: 300,
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 100,
// // // //     backgroundColor: COLORS.blockDarkBlue,
// // // //     opacity: 0.3,
// // // //   },
  
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
  
// // // //   /* Enhanced Header with Semicircle and UK Pattern */
// // // //   headerWrapper: {
// // // //     position: 'relative',
// // // //     marginTop: 8,
// // // //     marginBottom: 16,
// // // //     overflow: 'hidden',
// // // //   },
  
// // // //   /* Semicircle Background */
// // // //   semicircleBackground: {
// // // //     position: 'absolute',
// // // //     top: -40,
// // // //     right: -30,
// // // //     width: 200,
// // // //     height: 200,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   semicircle: {
// // // //     position: 'absolute',
// // // //     width: 400,
// // // //     height: 200,
// // // //     backgroundColor: COLORS.primaryLight,
// // // //     borderTopLeftRadius: 200,
// // // //     borderTopRightRadius: 200,
// // // //     transform: [{ rotate: '-15deg' }],
// // // //     opacity: 0.3,
// // // //   },
  
// // // //   /* UK-style Rounded Lines Pattern */
// // // //   ukPatternContainer: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //   },
  
// // // //   curvedLine1: {
// // // //     position: 'absolute',
// // // //     top: 20,
// // // //     right: 50,
// // // //     width: 80,
// // // //     height: 40,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     borderTopWidth: 0,
// // // //     borderRightWidth: 0,
// // // //     borderRadius: 40,
// // // //     opacity: 0.15,
// // // //     transform: [{ rotate: '-10deg' }],
// // // //   },
// // // //   curvedLine2: {
// // // //     position: 'absolute',
// // // //     bottom: 10,
// // // //     left: 30,
// // // //     width: 60,
// // // //     height: 30,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     borderBottomWidth: 0,
// // // //     borderLeftWidth: 0,
// // // //     borderRadius: 30,
// // // //     opacity: 0.15,
// // // //     transform: [{ rotate: '15deg' }],
// // // //   },
// // // //   curvedLine3: {
// // // //     position: 'absolute',
// // // //     top: 40,
// // // //     left: 100,
// // // //     width: 100,
// // // //     height: 50,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     borderTopWidth: 0,
// // // //     borderLeftWidth: 0,
// // // //     borderRadius: 50,
// // // //     opacity: 0.1,
// // // //     transform: [{ rotate: '20deg' }],
// // // //   },
  
// // // //   parallelLines: {
// // // //     position: 'absolute',
// // // //     top: 30,
// // // //     left: 20,
// // // //   },
// // // //   parallelLine: {
// // // //     width: 80,
// // // //     height: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.1,
// // // //     marginVertical: 4,
// // // //     borderRadius: 1,
// // // //   },
  
// // // //   dottedCircle1: {
// // // //     position: 'absolute',
// // // //     bottom: 20,
// // // //     right: 30,
// // // //     width: 60,
// // // //     height: 60,
// // // //   },
// // // //   dottedCircleDot: {
// // // //     position: 'absolute',
// // // //     width: 4,
// // // //     height: 4,
// // // //     borderRadius: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.2,
// // // //     top: 28,
// // // //     left: 28,
// // // //   },
  
// // // //   decorativeDot1: {
// // // //     position: 'absolute',
// // // //     top: 60,
// // // //     right: 80,
// // // //     width: 6,
// // // //     height: 6,
// // // //     borderRadius: 3,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.2,
// // // //   },
// // // //   decorativeDot2: {
// // // //     position: 'absolute',
// // // //     bottom: 40,
// // // //     left: 150,
// // // //     width: 8,
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.15,
// // // //   },
// // // //   decorativeLine1: {
// // // //     position: 'absolute',
// // // //     top: 10,
// // // //     left: 150,
// // // //     width: 40,
// // // //     height: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.1,
// // // //     borderRadius: 1,
// // // //     transform: [{ rotate: '30deg' }],
// // // //   },
// // // //   decorativeLine2: {
// // // //     position: 'absolute',
// // // //     bottom: 30,
// // // //     right: 100,
// // // //     width: 50,
// // // //     height: 2,
// // // //     backgroundColor: COLORS.primary,
// // // //     opacity: 0.1,
// // // //     borderRadius: 1,
// // // //     transform: [{ rotate: '-20deg' }],
// // // //   },
  
// // // //   /* Header Content */
// // // //   headerContent: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     position: 'relative',
// // // //     zIndex: 2,
// // // //     paddingVertical: 10,
// // // //   },
// // // //   greeting: {
// // // //     fontSize: 14,
// // // //     color: COLORS.textSecondary,
// // // //     marginBottom: 2,
// // // //   },
// // // //   title: {
// // // //     fontSize: 24,
// // // //     color: COLORS.text,
// // // //     lineHeight: 32,
// // // //   },
// // // //   titleBold: {
// // // //     fontWeight: '700',
// // // //     color: COLORS.primary,
// // // //   },
// // // //   headerRight: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   playingCountBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 20,
// // // //     gap: 4,
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 4,
// // // //     elevation: 3,
// // // //   },
// // // //   playingCountText: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 12,
// // // //     fontWeight: '700',
// // // //   },
  
// // // //   /* Search Box */
// // // //   searchBox: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 18,
// // // //     paddingHorizontal: 14,
// // // //     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// // // //     marginBottom: 16,
// // // //     elevation: 2,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 8,
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     marginHorizontal: 10,
// // // //     color: COLORS.text,
// // // //     fontSize: 14,
// // // //     padding: 0,
// // // //   },
  
// // // //   /* Tabs - Without Icons */
// // // //   tabsContainer: {
// // // //     flexDirection: 'row',
// // // //     marginBottom: 16,
// // // //     gap: 8,
// // // //   },
// // // //   tabButton: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     backgroundColor: COLORS.surface,
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 8,
// // // //     borderRadius: 20,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     gap: 4,
// // // //   },
// // // //   tabButtonActive: {
// // // //     backgroundColor: COLORS.primary,
// // // //     borderColor: COLORS.primary,
// // // //   },
// // // //   tabButtonText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //     color: COLORS.textSecondary,
// // // //   },
// // // //   tabButtonTextActive: {
// // // //     color: COLORS.surface,
// // // //   },
// // // //   tabCount: {
// // // //     backgroundColor: COLORS.background,
// // // //     borderRadius: 12,
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 2,
// // // //     marginLeft: 2,
// // // //   },
// // // //   tabCountActive: {
// // // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // // //   },
// // // //   tabCountText: {
// // // //     fontSize: 10,
// // // //     fontWeight: '700',
// // // //     color: COLORS.textSecondary,
// // // //   },
// // // //   tabCountTextActive: {
// // // //     color: COLORS.surface,
// // // //   },
  
// // // //   /* Games Count */
// // // //   gamesCountContainer: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   gamesCount: {
// // // //     fontSize: 14,
// // // //     color: COLORS.textSecondary,
// // // //     fontWeight: '500',
// // // //   },
  
// // // //   /* Card Background - New enhanced styles */
// // // //   cardBackground: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     borderRadius: 24,
// // // //   },
  
// // // //   /* Decorative circles */
// // // //   cardDecorativeCircle: {
// // // //     position: 'absolute',
// // // //     width: 100,
// // // //     height: 100,
// // // //     borderRadius: 50,
// // // //     opacity: 0.08,
// // // //   },
// // // //   circle1: {
// // // //     top: -30,
// // // //     right: -30,
// // // //     width: 150,
// // // //     height: 150,
// // // //     borderRadius: 75,
// // // //   },
// // // //   circle2: {
// // // //     bottom: -20,
// // // //     left: -20,
// // // //     width: 120,
// // // //     height: 120,
// // // //     borderRadius: 60,
// // // //     opacity: 0.06,
// // // //   },
// // // //   circle3: {
// // // //     top: '40%',
// // // //     left: '30%',
// // // //     width: 80,
// // // //     height: 80,
// // // //     borderRadius: 40,
// // // //     opacity: 0.05,
// // // //   },
  
// // // //   /* Floating particles */
// // // //   floatingParticle: {
// // // //     position: 'absolute',
// // // //     width: 4,
// // // //     height: 4,
// // // //     borderRadius: 2,
// // // //     opacity: 0.12,
// // // //   },
// // // //   particle1: {
// // // //     top: 20,
// // // //     right: 40,
// // // //     width: 6,
// // // //     height: 6,
// // // //   },
// // // //   particle2: {
// // // //     bottom: 30,
// // // //     left: 50,
// // // //     width: 5,
// // // //     height: 5,
// // // //   },
// // // //   particle3: {
// // // //     top: '60%',
// // // //     right: 60,
// // // //     width: 7,
// // // //     height: 7,
// // // //   },
// // // //   particle4: {
// // // //     bottom: '20%',
// // // //     left: 80,
// // // //     width: 4,
// // // //     height: 4,
// // // //   },
  
// // // //   /* Game Cards */
// // // //   gameCard: {
// // // //     borderRadius: 24,
// // // //     marginBottom: 16,
// // // //     padding: 16,
// // // //     paddingTop: 40, // Space for badges
// // // //     elevation: 4,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 12,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     borderWidth: 1,
// // // //     borderColor: 'rgba(255,255,255,0.5)',
// // // //   },
// // // //   playingGameCard: {
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOpacity: 0.15,
// // // //   },

// // // //   /* Status Badge - TOP LEFT corner */
// // // //   statusBadge: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderBottomRightRadius: 20,
// // // //     borderTopLeftRadius: 24,
// // // //     gap: 4,
// // // //     zIndex: 10,
// // // //     elevation: 5,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.surface,
// // // //   },
// // // //   statusBadgeText: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 11,
// // // //     fontWeight: '700',
// // // //   },

// // // //   /* Playing Badge - TOP RIGHT corner */
// // // //   playingBadge: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     right: 0,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderBottomLeftRadius: 20,
// // // //     borderTopRightRadius: 24,
// // // //     gap: 4,
// // // //     zIndex: 10,
// // // //     elevation: 5,
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 4,
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.surface,
// // // //   },
// // // //   playingBadgeText: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 11,
// // // //     fontWeight: '700',
// // // //   },

// // // //   /* Game Card Header with Icon */
// // // //   gameCardHeader: {
// // // //     marginBottom: 16,
// // // //     marginTop: 1, // Space between badges and content
// // // //     zIndex: 2,
// // // //   },
// // // //   gameIconContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 12,
// // // //   },
// // // //   gameIconWrapper: {
// // // //     width: 48,
// // // //     height: 48,
// // // //     borderRadius: 16,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   gameTitleContainer: {
// // // //     flex: 1,
// // // //   },
// // // //   gameName: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     color: COLORS.text,
// // // //     marginBottom: 4,
// // // //   },
// // // //   gameCode: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //   },

// // // //   /* Game Content */
// // // //   gameCardContent: {
// // // //     gap: 12,
// // // //     zIndex: 2,
// // // //   },
// // // //   gameMetaRow: {
// // // //     flexDirection: 'row',
// // // //     gap: 16,
// // // //   },
// // // //   metaItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 6,
// // // //     flex: 1,
// // // //   },
// // // //   metaText: {
// // // //     fontSize: 13,
// // // //     color: COLORS.textSecondary,
// // // //     flex: 1,
// // // //   },

// // // //   /* Ticket Info */
// // // //   ticketInfoContainer: {
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 20,
// // // //     alignSelf: 'flex-start',
// // // //   },
// // // //   ticketInfoText: {
// // // //     fontSize: 11,
// // // //     fontWeight: '600',
// // // //   },

// // // //   /* Prize and Action */
// // // //   prizeContainer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginTop: 8,
// // // //     paddingTop: 12,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: 'rgba(0,0,0,0.05)',
// // // //   },
// // // //   prizeLeftSection: {
// // // //     flex: 1,
// // // //   },
// // // //   prizeLabel: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //     marginBottom: 2,
// // // //   },
// // // //   prizeValue: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     color: COLORS.text,
// // // //   },
// // // //   ticketPriceBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 20,
// // // //     gap: 4,
// // // //     marginRight: 8,
// // // //   },
// // // //   ticketPriceText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '700',
// // // //   },
// // // //   actionButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 30,
// // // //     gap: 6,
// // // //     shadowColor: COLORS.primary,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 4,
// // // //     elevation: 3,
// // // //   },
// // // //   actionButtonText: {
// // // //     color: '#FFFFFF',
// // // //     fontSize: 13,
// // // //     fontWeight: '600',
// // // //   },

// // // //   /* Empty State */
// // // //   emptyGames: {
// // // //     alignItems: 'center',
// // // //     padding: 40,
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 24,
// // // //     marginTop: 20,
// // // //   },
// // // //   emptyGamesText: {
// // // //     fontSize: 16,
// // // //     color: COLORS.textSecondary,
// // // //     marginTop: 12,
// // // //     marginBottom: 16,
// // // //     textAlign: 'center',
// // // //   },
// // // //   clearSearchButton: {
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingHorizontal: 20,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 20,
// // // //   },
// // // //   clearSearchButtonText: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //   },
  
// // // //   flatListContent: {
// // // //     paddingBottom: 20,
// // // //   },
// // // // });

// // // // export default Game;
















// // // // // import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   ActivityIndicator,
// // // // //   StyleSheet,
// // // // //   RefreshControl,
// // // // //   Dimensions,
// // // // //   TextInput,
// // // // //   Keyboard,
// // // // //   Animated,
// // // // //   Easing,
// // // // //   FlatList,
// // // // //   SafeAreaView,
// // // // //   Alert,
// // // // //   StatusBar,
// // // // //   Platform,
// // // // // } from "react-native";
// // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // import axios from "axios";
// // // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// // // // // const { width } = Dimensions.get('window');

// // // // // // Color palette with orange shade as primary (SINGLE CONSISTENT COLOR)
// // // // // const COLORS = {
// // // // //   background: '#F0F7FF',
// // // // //   surface: '#FFFFFF',
// // // // //   primary: '#F97316', // Vibrant orange (main color)
// // // // //   primaryLight: '#FFEDD5', // Light orange
// // // // //   primaryDark: '#C2410C', // Dark orange
// // // // //   accent: '#FB923C', // Medium orange for accents
// // // // //   secondary: '#FCD34D', // Light amber/gold
// // // // //   tertiary: '#EA580C', // Darker orange for contrast
// // // // //   text: '#1E293B',
// // // // //   textSecondary: '#64748B',
// // // // //   textLight: '#94A3B8',
// // // // //   border: '#E2E8F0',
  
// // // // //   // Card background variants - all orange-tinted (SAME FOR ALL CARDS)
// // // // //   cardOrange: '#FFF7ED', // Single consistent card background
  
// // // // //   // Status colors (only these remain different for clarity)
// // // // //   live: '#10B981', // Green for live (keeping for contrast)
// // // // //   scheduled: '#F97316', // Orange for scheduled
// // // // //   completed: '#e24c2e', // Gray for completed
  
// // // // //   // Block colors - Orange shades for background
// // // // //   blockLightOrange: '#FFEDD5',
// // // // //   blockMediumOrange: '#FED7AA',
// // // // //   blockDarkOrange: '#FDBA74',
// // // // // };

// // // // // const Game = ({ navigation }) => {
// // // // //   const [games, setGames] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // //   const [searchQuery, setSearchQuery] = useState('');
// // // // //   const [userGameData, setUserGameData] = useState({
// // // // //     myTickets: [],
// // // // //     myRequests: []
// // // // //   });
// // // // //   const [activeTab, setActiveTab] = useState('myGames');
  
// // // // //   // Scroll Y position for background animation
// // // // //   const scrollY = useRef(new Animated.Value(0)).current;
  
// // // // //   // Cache for filtered results
// // // // //   const [filteredGamesCache, setFilteredGamesCache] = useState({
// // // // //     myGames: [],
// // // // //     allGames: [],
// // // // //     completed: []
// // // // //   });

// // // // //   // Filter options for tabs
// // // // //   const tabs = [
// // // // //     { id: 'myGames', label: 'My Games' },
// // // // //     { id: 'allGames', label: 'All Games' },
// // // // //     { id: 'completed', label: 'Completed' }
// // // // //   ];

// // // // //   useEffect(() => {
// // // // //     fetchAllData();
// // // // //   }, []);

// // // // //   // Update cache whenever games or userGameData changes
// // // // //   useEffect(() => {
// // // // //     if (games.length > 0) {
// // // // //       updateFilteredGamesCache();
// // // // //     }
// // // // //   }, [games, userGameData, searchQuery]);

// // // // //   const updateFilteredGamesCache = useCallback(() => {
// // // // //     let filtered = games;

// // // // //     if (searchQuery.trim()) {
// // // // //       filtered = filtered.filter(game =>
// // // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // // //       );
// // // // //     }

// // // // //     const myGamesFiltered = filtered.filter(game => isUserPlayingGame(game.id));
// // // // //     const completedFiltered = filtered.filter(game => game.status === 'completed');
// // // // //     const allGamesFiltered = filtered;

// // // // //     setFilteredGamesCache({
// // // // //       myGames: myGamesFiltered,
// // // // //       allGames: allGamesFiltered,
// // // // //       completed: completedFiltered
// // // // //     });
// // // // //   }, [games, searchQuery, userGameData]);

// // // // //   const onRefresh = useCallback(() => {
// // // // //     setRefreshing(true);
// // // // //     setGames([]);
// // // // //     setUserGameData({
// // // // //       myTickets: [],
// // // // //       myRequests: []
// // // // //     });
// // // // //     fetchAllData(true).finally(() => setRefreshing(false));
// // // // //   }, []);

// // // // //   const fetchAllData = async (reset = false) => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       // Fetch all pages of games
// // // // //       await fetchAllGames();
      
// // // // //       // Fetch user data
// // // // //       await Promise.all([
// // // // //         fetchMyTickets(),
// // // // //         fetchMyRequests()
// // // // //       ]);
      
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching data:", error);
// // // // //       Alert.alert("Error", "Failed to load games data!");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const fetchAllGames = async () => {
// // // // //     try {
// // // // //       const token = await AsyncStorage.getItem("token");
// // // // //       let page = 1;
// // // // //       let allGames = [];
// // // // //       let hasMorePages = true;
      
// // // // //       while (hasMorePages) {
// // // // //         const res = await axios.get(
// // // // //           `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // // //         );
        
// // // // //         if (res.data.success) {
// // // // //           const gamesData = res.data.games.data || [];
// // // // //           allGames = [...allGames, ...gamesData];
          
// // // // //           const paginationData = res.data.games;
// // // // //           hasMorePages = paginationData.current_page < paginationData.last_page;
// // // // //           page++;
// // // // //         } else {
// // // // //           hasMorePages = false;
// // // // //         }
// // // // //       }
      
// // // // //       setGames(allGames);
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching games:", error);
// // // // //       Alert.alert("Error", "Failed to load games!");
// // // // //     }
// // // // //   };

// // // // //   const fetchMyTickets = async () => {
// // // // //     try {
// // // // //       const token = await AsyncStorage.getItem("token");
// // // // //       const res = await axios.get(
// // // // //         "https://tambolatime.co.in/public/api/user/my-tickets",
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
// // // // //       if (res.data.success) {
// // // // //         setUserGameData(prev => ({
// // // // //           ...prev,
// // // // //           myTickets: res.data.tickets.data || []
// // // // //         }));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching tickets:", error);
// // // // //     }
// // // // //   };

// // // // //   const fetchMyRequests = async () => {
// // // // //     try {
// // // // //       const token = await AsyncStorage.getItem("token");
// // // // //       const res = await axios.get(
// // // // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
// // // // //       if (res.data.success) {
// // // // //         setUserGameData(prev => ({
// // // // //           ...prev,
// // // // //           myRequests: res.data.ticket_requests.data || []
// // // // //         }));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching requests:", error);
// // // // //     }
// // // // //   };

// // // // //   const isUserPlayingGame = useCallback((gameId) => {
// // // // //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// // // // //     const hasPendingRequests = userGameData.myRequests.some(request => 
// // // // //       request.game_id == gameId && request.status === 'pending'
// // // // //     );
    
// // // // //     return hasTickets || hasPendingRequests;
// // // // //   }, [userGameData]);

// // // // //   const getUserTicketCount = useCallback((gameId) => {
// // // // //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// // // // //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// // // // //       request.game_id == gameId && request.status === 'pending'
// // // // //     ).length;
    
// // // // //     return {
// // // // //       tickets: ticketsCount,
// // // // //       pendingRequests: pendingRequestsCount,
// // // // //       total: ticketsCount + pendingRequestsCount
// // // // //     };
// // // // //   }, [userGameData]);

// // // // //   const handleTabChange = useCallback((tab) => {
// // // // //     setActiveTab(tab);
    
// // // // //     if (tab === 'myGames') {
// // // // //       fetchMyTickets();
// // // // //       fetchMyRequests();
// // // // //     }
// // // // //   }, []);

// // // // //   const getCurrentTabData = useCallback(() => {
// // // // //     switch (activeTab) {
// // // // //       case 'myGames':
// // // // //         return filteredGamesCache.myGames;
// // // // //       case 'completed':
// // // // //         return filteredGamesCache.completed;
// // // // //       case 'allGames':
// // // // //       default:
// // // // //         return filteredGamesCache.allGames;
// // // // //     }
// // // // //   }, [activeTab, filteredGamesCache]);

// // // // //   const getTabCount = useCallback((tab) => {
// // // // //     switch (tab) {
// // // // //       case 'myGames':
// // // // //         return filteredGamesCache.myGames.length;
// // // // //       case 'completed':
// // // // //         return filteredGamesCache.completed.length;
// // // // //       case 'allGames':
// // // // //       default:
// // // // //         return filteredGamesCache.allGames.length;
// // // // //     }
// // // // //   }, [filteredGamesCache]);

// // // // //   const clearSearch = () => {
// // // // //     setSearchQuery('');
// // // // //   };

// // // // //   // Animated background that moves with scroll
// // // // //   const AnimatedBackground = () => {
// // // // //     const block1TranslateY = scrollY.interpolate({
// // // // //       inputRange: [0, 300],
// // // // //       outputRange: [0, -50],
// // // // //       extrapolate: 'clamp'
// // // // //     });

// // // // //     const block2TranslateY = scrollY.interpolate({
// // // // //       inputRange: [0, 400],
// // // // //       outputRange: [0, -30],
// // // // //       extrapolate: 'clamp'
// // // // //     });

// // // // //     const block3TranslateY = scrollY.interpolate({
// // // // //       inputRange: [0, 500],
// // // // //       outputRange: [0, -20],
// // // // //       extrapolate: 'clamp'
// // // // //     });

// // // // //     const opacity = scrollY.interpolate({
// // // // //       inputRange: [0, 200, 400],
// // // // //       outputRange: [1, 0.8, 0.6],
// // // // //       extrapolate: 'clamp'
// // // // //     });

// // // // //     return (
// // // // //       <>
// // // // //         <Animated.View 
// // // // //           style={[
// // // // //             styles.orangeBlock1,
// // // // //             {
// // // // //               transform: [{ translateY: block1TranslateY }],
// // // // //               opacity
// // // // //             }
// // // // //           ]} 
// // // // //         />
// // // // //         <Animated.View 
// // // // //           style={[
// // // // //             styles.orangeBlock2,
// // // // //             {
// // // // //               transform: [{ translateY: block2TranslateY }],
// // // // //               opacity: opacity.interpolate({
// // // // //                 inputRange: [0.6, 1],
// // // // //                 outputRange: [0.4, 0.8]
// // // // //               })
// // // // //             }
// // // // //           ]} 
// // // // //         />
// // // // //         <Animated.View 
// // // // //           style={[
// // // // //             styles.orangeBlock3,
// // // // //             {
// // // // //               transform: [{ translateY: block3TranslateY }],
// // // // //               opacity: opacity.interpolate({
// // // // //                 inputRange: [0.6, 1],
// // // // //                 outputRange: [0.2, 0.5]
// // // // //               })
// // // // //             }
// // // // //           ]} 
// // // // //         />
// // // // //       </>
// // // // //     );
// // // // //   };

// // // // //   // Card Background with only circles - SAME ORANGE FOR ALL CARDS
// // // // //   const CardBackground = ({ game }) => {
// // // // //     const isPlaying = isUserPlayingGame(game.id);
// // // // //     const isCompleted = game.status === 'completed';
// // // // //     const isLive = game.status === 'live';
    
// // // // //     // ALL CARDS USE THE SAME BACKGROUND COLOR - ORANGE
// // // // //     // No more different colors based on status
// // // // //     const backgroundColor = COLORS.cardOrange; // Single consistent color
    
// // // // //     return (
// // // // //       <View style={[styles.cardBackground, { backgroundColor }]}>
// // // // //         {/* Decorative circles - all using the same orange shades */}
// // // // //         <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: COLORS.primary }]} />
// // // // //         <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
// // // // //         <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
        
// // // // //         {/* Small floating particles - all orange shades */}
// // // // //         <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: COLORS.primary }]} />
// // // // //         <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primaryDark }]} />
// // // // //         <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.primaryLight }]} />
// // // // //         <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.secondary }]} />
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   // Enhanced Header with semicircle shape and UK-style rounded lines
// // // // //   const Header = () => (
// // // // //     <View style={styles.headerWrapper}>
// // // // //       {/* Semicircle Background */}
// // // // //       <View style={styles.semicircleBackground}>
// // // // //         <View style={styles.semicircle} />
// // // // //       </View>
      
// // // // //       {/* UK-style Rounded Lines Pattern */}
// // // // //       <View style={styles.ukPatternContainer}>
// // // // //         <View style={styles.curvedLine1} />
// // // // //         <View style={styles.curvedLine2} />
// // // // //         <View style={styles.curvedLine3} />
        
// // // // //         <View style={styles.parallelLines}>
// // // // //           <View style={styles.parallelLine} />
// // // // //           <View style={styles.parallelLine} />
// // // // //           <View style={styles.parallelLine} />
// // // // //         </View>
        
// // // // //         <View style={styles.dottedCircle1}>
// // // // //           {[...Array(8)].map((_, i) => (
// // // // //             <View 
// // // // //               key={i} 
// // // // //               style={[
// // // // //                 styles.dottedCircleDot,
// // // // //                 {
// // // // //                   transform: [
// // // // //                     { rotate: `${i * 45}deg` },
// // // // //                     { translateX: 30 }
// // // // //                   ]
// // // // //                 }
// // // // //               ]} 
// // // // //             />
// // // // //           ))}
// // // // //         </View>
        
// // // // //         <View style={styles.decorativeDot1} />
// // // // //         <View style={styles.decorativeDot2} />
// // // // //         <View style={styles.decorativeLine1} />
// // // // //         <View style={styles.decorativeLine2} />
// // // // //       </View>

// // // // //       {/* Header Content */}
// // // // //       <View style={styles.headerContent}>
// // // // //         <View>
// // // // //           <Text style={styles.greeting}>Welcome back to</Text>
// // // // //           <Text style={styles.title}>
// // // // //             Tambola <Text style={styles.titleBold}>Games</Text>
// // // // //           </Text>
// // // // //         </View>
// // // // //         <View style={styles.headerRight}>
// // // // //           {filteredGamesCache.myGames.length > 0 && (
// // // // //             <View style={styles.playingCountBadge}>
// // // // //               <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
// // // // //               <Text style={styles.playingCountText}>{filteredGamesCache.myGames.length}</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const renderGameCard = useCallback(({ item: game }) => {
// // // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // // //     const ticketInfo = getUserTicketCount(game.id);
// // // // //     const isPlaying = isUserPlayingGame(game.id);
// // // // //     const isCompleted = game.status === 'completed';
// // // // //     const isLive = game.status === 'live';
    
// // // // //     // Get status color and text (only these remain different)
// // // // //     let statusColor = COLORS.scheduled;
// // // // //     let statusText = 'Upcoming';
// // // // //     let statusIcon = 'time-outline';
// // // // //     if (isLive) {
// // // // //       statusColor = COLORS.live;
// // // // //       statusText = 'Live Now';
// // // // //       statusIcon = 'radio-button-on';
// // // // //     } else if (isCompleted) {
// // // // //       statusColor = COLORS.completed;
// // // // //       statusText = 'Completed';
// // // // //       statusIcon = 'checkmark-circle';
// // // // //     }
    
// // // // //     // ALL CARDS USE THE SAME ORANGE ACCENT
// // // // //     const accentColor = COLORS.primary;
// // // // //     const accentLight = COLORS.primaryLight;
    
// // // // //     return (
// // // // //       <TouchableOpacity
// // // // //         style={[
// // // // //           styles.gameCard,
// // // // //           isPlaying && styles.playingGameCard,
// // // // //         ]}
// // // // //         activeOpacity={0.95}
// // // // //         onPress={() => navigation.navigate("GameDetails", { game })}
// // // // //       >
// // // // //         {/* Layered Background with colors and only circles - SAME FOR ALL */}
// // // // //         <CardBackground game={game} />

// // // // //         {/* Status badge - TOP LEFT corner (these vary by status for clarity) */}
// // // // //         <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
// // // // //           <Ionicons name={statusIcon} size={12} color="#FFFFFF" />
// // // // //           <Text style={styles.statusBadgeText}>{statusText}</Text>
// // // // //         </View>

// // // // //         {/* Playing indicator - TOP RIGHT corner */}
// // // // //         {isPlaying && (
// // // // //           <View style={[styles.playingBadge, { backgroundColor: COLORS.primary }]}>
// // // // //             <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
// // // // //             <Text style={styles.playingBadgeText}>You're Playing</Text>
// // // // //           </View>
// // // // //         )}

// // // // //         <View style={styles.gameCardHeader}>
// // // // //           {/* Icon/Logo at top left */}
// // // // //           <View style={styles.gameIconContainer}>
// // // // //             <View style={[
// // // // //               styles.gameIconWrapper, 
// // // // //               { backgroundColor: accentLight }
// // // // //             ]}>
// // // // //               <MaterialIcons name="sports-esports" size={24} color={accentColor} />
// // // // //             </View>
            
// // // // //             <View style={styles.gameTitleContainer}>
// // // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // // //                 {game.game_name || "Tambola Game"}
// // // // //               </Text>
// // // // //               <Text style={styles.gameCode}>
// // // // //                 #{game.game_code || "N/A"}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.gameCardContent}>
// // // // //           {/* Game Meta Information */}
// // // // //           <View style={styles.gameMetaRow}>
// // // // //             <View style={styles.metaItem}>
// // // // //               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
// // // // //               <Text style={styles.metaText}>
// // // // //                 {game.game_date_formatted || game.game_date || "TBA"}
// // // // //               </Text>
// // // // //             </View>
// // // // //             <View style={styles.metaItem}>
// // // // //               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
// // // // //               <Text style={styles.metaText}>
// // // // //                 {game.game_time_formatted || game.game_start_time || "TBA"}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={styles.gameMetaRow}>
// // // // //             <View style={styles.metaItem}>
// // // // //               <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
// // // // //               <Text style={styles.metaText} numberOfLines={1}>
// // // // //                 {game.user ? game.user.name : 'Tambola Timez'}
// // // // //               </Text>
// // // // //             </View>
// // // // //             {game.available_tickets !== undefined && !isCompleted && (
// // // // //               <View style={styles.metaItem}>
// // // // //                 <MaterialIcons name="confirmation-number" size={14} color={COLORS.textSecondary} />
// // // // //                 <Text style={styles.metaText}>
// // // // //                   {game.available_tickets} Left
// // // // //                 </Text>
// // // // //               </View>
// // // // //             )}
// // // // //           </View>

// // // // //           {/* Ticket info if user is playing */}
// // // // //           {isPlaying && (
// // // // //             <View style={[styles.ticketInfoContainer, { backgroundColor: accentLight }]}>
// // // // //               <Text style={[styles.ticketInfoText, { color: accentColor }]}>
// // // // //                 {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// // // // //                 {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' • ' : ''}
// // // // //                 {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// // // // //               </Text>
// // // // //             </View>
// // // // //           )}

// // // // //           {/* Prize Pool Section with Ticket Price */}
// // // // //           <View style={styles.prizeContainer}>
// // // // //             <View style={styles.prizeLeftSection}>
// // // // //               <Text style={styles.prizeLabel}>
// // // // //                 {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
// // // // //               </Text>
// // // // //               <Text style={styles.prizeValue}>
// // // // //                 {game.ticket_type === "paid" && game.max_tickets 
// // // // //                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // // // //                   : "Exciting Prizes"}
// // // // //               </Text>
// // // // //             </View>

// // // // //             {/* Ticket Price Badge - Next to prize pool */}
// // // // //             {game.ticket_type === "paid" && (
// // // // //               <View style={[styles.ticketPriceBadge, { backgroundColor: accentLight }]}>
// // // // //                 <MaterialIcons name="diamond" size={14} color={accentColor} />
// // // // //                 <Text style={[styles.ticketPriceText, { color: accentColor }]}>₹{ticketCost}</Text>
// // // // //               </View>
// // // // //             )}
            
// // // // //             {/* Action Button */}
// // // // //             <TouchableOpacity 
// // // // //               style={[styles.actionButton, 
// // // // //                 isPlaying && { backgroundColor: accentColor },
// // // // //                 isCompleted && { backgroundColor: COLORS.completed }
// // // // //               ]}
// // // // //               onPress={() => navigation.navigate("GameDetails", { game })}
// // // // //             >
// // // // //               <Text style={styles.actionButtonText}>
// // // // //                 {isCompleted ? 'Results' : isPlaying ? 'View' : isLive ? 'Join' : 'Details'}
// // // // //               </Text>
// // // // //               <Ionicons 
// // // // //                 name={isCompleted ? "trophy" : "arrow-forward"} 
// // // // //                 size={14} 
// // // // //                 color="#FFFFFF" 
// // // // //               />
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </TouchableOpacity>
// // // // //     );
// // // // //   }, [isUserPlayingGame, getUserTicketCount, navigation]);

// // // // //   const renderTabBar = () => (
// // // // //     <View style={styles.tabsContainer}>
// // // // //       {tabs.map((tab) => {
// // // // //         const isActive = activeTab === tab.id;
// // // // //         const tabKey = tab.id;
        
// // // // //         return (
// // // // //           <TouchableOpacity
// // // // //             key={tab.id}
// // // // //             style={[
// // // // //               styles.tabButton,
// // // // //               isActive && styles.tabButtonActive,
// // // // //             ]}
// // // // //             onPress={() => handleTabChange(tab.id)}
// // // // //           >
// // // // //             <Text style={[
// // // // //               styles.tabButtonText,
// // // // //               isActive && styles.tabButtonTextActive
// // // // //             ]}>
// // // // //               {tab.label}
// // // // //             </Text>
// // // // //             <View style={[
// // // // //               styles.tabCount,
// // // // //               isActive && styles.tabCountActive
// // // // //             ]}>
// // // // //               <Text style={[
// // // // //                 styles.tabCountText,
// // // // //                 isActive && styles.tabCountTextActive
// // // // //               ]}>
// // // // //                 {getTabCount(tabKey)}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </TouchableOpacity>
// // // // //         );
// // // // //       })}
// // // // //     </View>
// // // // //   );

// // // // //   const renderEmptyList = useCallback(() => (
// // // // //     <View style={styles.emptyGames}>
// // // // //       <Ionicons 
// // // // //         name={
// // // // //           activeTab === 'myGames' ? "person-outline" : 
// // // // //           activeTab === 'completed' ? "trophy-outline" : 
// // // // //           "game-controller-outline"
// // // // //         } 
// // // // //         size={48} 
// // // // //         color={COLORS.textLight} 
// // // // //       />
// // // // //       <Text style={styles.emptyGamesText}>
// // // // //         {activeTab === 'myGames' 
// // // // //           ? "You haven't joined any games yet"
// // // // //           : activeTab === 'completed'
// // // // //           ? 'No completed games available'
// // // // //           : searchQuery ? 'No games found' : 'No games available'}
// // // // //       </Text>
// // // // //       {searchQuery && (
// // // // //         <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
// // // // //           <Text style={styles.clearSearchButtonText}>Clear Search</Text>
// // // // //         </TouchableOpacity>
// // // // //       )}
// // // // //       {activeTab === 'myGames' && !searchQuery && (
// // // // //         <TouchableOpacity 
// // // // //           style={styles.clearSearchButton}
// // // // //           onPress={() => handleTabChange('allGames')}
// // // // //         >
// // // // //           <Text style={styles.clearSearchButtonText}>Browse All Games</Text>
// // // // //         </TouchableOpacity>
// // // // //       )}
// // // // //     </View>
// // // // //   ), [activeTab, searchQuery]);

// // // // //   // Handle main scroll for background animation
// // // // //   const handleMainScroll = Animated.event(
// // // // //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // // // //     { useNativeDriver: false }
// // // // //   );

// // // // //   if (loading && games.length === 0) {
// // // // //     return (
// // // // //       <SafeAreaView style={styles.safeArea}>
// // // // //         <View style={styles.loadingContainer}>
// // // // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // // // //         </View>
// // // // //       </SafeAreaView>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safeArea}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

// // // // //       <View style={styles.container}>
// // // // //         {/* Animated Color Blocks */}
// // // // //         <AnimatedBackground />

// // // // //         <Animated.FlatList
// // // // //           data={getCurrentTabData()}
// // // // //           renderItem={renderGameCard}
// // // // //           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           refreshControl={
// // // // //             <RefreshControl
// // // // //               refreshing={refreshing}
// // // // //               onRefresh={onRefresh}
// // // // //               tintColor={COLORS.primary}
// // // // //               colors={[COLORS.primary]}
// // // // //             />
// // // // //           }
// // // // //           onScroll={handleMainScroll}
// // // // //           scrollEventThrottle={16}
// // // // //           ListHeaderComponent={
// // // // //             <>
// // // // //               {/* Enhanced Header */}
// // // // //               <Header />

// // // // //               {/* Search */}
// // // // //               <View style={styles.searchBox}>
// // // // //                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
// // // // //                 <TextInput
// // // // //                   placeholder="Search games by name or ID..."
// // // // //                   placeholderTextColor={COLORS.textLight}
// // // // //                   style={styles.searchInput}
// // // // //                   value={searchQuery}
// // // // //                   onChangeText={setSearchQuery}
// // // // //                   returnKeyType="search"
// // // // //                   onSubmitEditing={Keyboard.dismiss}
// // // // //                 />
// // // // //                 {searchQuery.length > 0 ? (
// // // // //                   <TouchableOpacity onPress={clearSearch}>
// // // // //                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// // // // //                   </TouchableOpacity>
// // // // //                 ) : (
// // // // //                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
// // // // //                 )}
// // // // //               </View>

// // // // //               {/* Tabs */}
// // // // //               {renderTabBar()}

// // // // //               {/* Games Count */}
// // // // //               <View style={styles.gamesCountContainer}>
// // // // //                 <Text style={styles.gamesCount}>
// // // // //                   {getCurrentTabData().length} {getCurrentTabData().length === 1 ? 'Game' : 'Games'} Available
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </>
// // // // //           }
// // // // //           ListEmptyComponent={renderEmptyList}
// // // // //           contentContainerStyle={styles.flatListContent}
// // // // //         />
// // // // //       </View>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   safeArea: {
// // // // //     flex: 1,
// // // // //     backgroundColor: COLORS.background,
// // // // //   },
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: COLORS.background,
// // // // //     paddingHorizontal: 16,
// // // // //   },
  
// // // // //   /* COLOR BLOCKS - Orange Shades - Animated */
// // // // //   orangeBlock1: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     height: 280,
// // // // //     backgroundColor: COLORS.blockLightOrange,
// // // // //     borderBottomLeftRadius: 50,
// // // // //     borderBottomRightRadius: 50,
// // // // //   },
// // // // //   orangeBlock2: {
// // // // //     position: 'absolute',
// // // // //     top: 200,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     height: 160,
// // // // //     backgroundColor: COLORS.blockMediumOrange,
// // // // //   },
// // // // //   orangeBlock3: {
// // // // //     position: 'absolute',
// // // // //     top: 300,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     height: 100,
// // // // //     backgroundColor: COLORS.blockDarkOrange,
// // // // //     opacity: 0.3,
// // // // //   },
  
// // // // //   loadingContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
  
// // // // //   /* Enhanced Header with Semicircle and UK Pattern */
// // // // //   headerWrapper: {
// // // // //     position: 'relative',
// // // // //     marginTop: 8,
// // // // //     marginBottom: 16,
// // // // //     overflow: 'hidden',
// // // // //   },
  
// // // // //   /* Semicircle Background */
// // // // //   semicircleBackground: {
// // // // //     position: 'absolute',
// // // // //     top: -40,
// // // // //     right: -30,
// // // // //     width: 200,
// // // // //     height: 200,
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   semicircle: {
// // // // //     position: 'absolute',
// // // // //     width: 400,
// // // // //     height: 200,
// // // // //     backgroundColor: COLORS.primaryLight,
// // // // //     borderTopLeftRadius: 200,
// // // // //     borderTopRightRadius: 200,
// // // // //     transform: [{ rotate: '-15deg' }],
// // // // //     opacity: 0.3,
// // // // //   },
  
// // // // //   /* UK-style Rounded Lines Pattern */
// // // // //   ukPatternContainer: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //   },
  
// // // // //   curvedLine1: {
// // // // //     position: 'absolute',
// // // // //     top: 20,
// // // // //     right: 50,
// // // // //     width: 80,
// // // // //     height: 40,
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.primary,
// // // // //     borderTopWidth: 0,
// // // // //     borderRightWidth: 0,
// // // // //     borderRadius: 40,
// // // // //     opacity: 0.15,
// // // // //     transform: [{ rotate: '-10deg' }],
// // // // //   },
// // // // //   curvedLine2: {
// // // // //     position: 'absolute',
// // // // //     bottom: 10,
// // // // //     left: 30,
// // // // //     width: 60,
// // // // //     height: 30,
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.primary,
// // // // //     borderBottomWidth: 0,
// // // // //     borderLeftWidth: 0,
// // // // //     borderRadius: 30,
// // // // //     opacity: 0.15,
// // // // //     transform: [{ rotate: '15deg' }],
// // // // //   },
// // // // //   curvedLine3: {
// // // // //     position: 'absolute',
// // // // //     top: 40,
// // // // //     left: 100,
// // // // //     width: 100,
// // // // //     height: 50,
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.primary,
// // // // //     borderTopWidth: 0,
// // // // //     borderLeftWidth: 0,
// // // // //     borderRadius: 50,
// // // // //     opacity: 0.1,
// // // // //     transform: [{ rotate: '20deg' }],
// // // // //   },
  
// // // // //   parallelLines: {
// // // // //     position: 'absolute',
// // // // //     top: 30,
// // // // //     left: 20,
// // // // //   },
// // // // //   parallelLine: {
// // // // //     width: 80,
// // // // //     height: 2,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     opacity: 0.1,
// // // // //     marginVertical: 4,
// // // // //     borderRadius: 1,
// // // // //   },
  
// // // // //   dottedCircle1: {
// // // // //     position: 'absolute',
// // // // //     bottom: 20,
// // // // //     right: 30,
// // // // //     width: 60,
// // // // //     height: 60,
// // // // //   },
// // // // //   dottedCircleDot: {
// // // // //     position: 'absolute',
// // // // //     width: 4,
// // // // //     height: 4,
// // // // //     borderRadius: 2,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     opacity: 0.2,
// // // // //     top: 28,
// // // // //     left: 28,
// // // // //   },
  
// // // // //   decorativeDot1: {
// // // // //     position: 'absolute',
// // // // //     top: 60,
// // // // //     right: 80,
// // // // //     width: 6,
// // // // //     height: 6,
// // // // //     borderRadius: 3,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     opacity: 0.2,
// // // // //   },
// // // // //   decorativeDot2: {
// // // // //     position: 'absolute',
// // // // //     bottom: 40,
// // // // //     left: 150,
// // // // //     width: 8,
// // // // //     height: 8,
// // // // //     borderRadius: 4,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     opacity: 0.15,
// // // // //   },
// // // // //   decorativeLine1: {
// // // // //     position: 'absolute',
// // // // //     top: 10,
// // // // //     left: 150,
// // // // //     width: 40,
// // // // //     height: 2,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     opacity: 0.1,
// // // // //     borderRadius: 1,
// // // // //     transform: [{ rotate: '30deg' }],
// // // // //   },
// // // // //   decorativeLine2: {
// // // // //     position: 'absolute',
// // // // //     bottom: 30,
// // // // //     right: 100,
// // // // //     width: 50,
// // // // //     height: 2,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     opacity: 0.1,
// // // // //     borderRadius: 1,
// // // // //     transform: [{ rotate: '-20deg' }],
// // // // //   },
  
// // // // //   /* Header Content */
// // // // //   headerContent: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     position: 'relative',
// // // // //     zIndex: 2,
// // // // //     paddingVertical: 10,
// // // // //   },
// // // // //   greeting: {
// // // // //     fontSize: 14,
// // // // //     color: COLORS.textSecondary,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   title: {
// // // // //     fontSize: 24,
// // // // //     color: COLORS.text,
// // // // //     lineHeight: 32,
// // // // //   },
// // // // //   titleBold: {
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.primary,
// // // // //   },
// // // // //   headerRight: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   playingCountBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: COLORS.primary,
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 20,
// // // // //     gap: 4,
// // // // //     shadowColor: COLORS.primary,
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   playingCountText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '700',
// // // // //   },
  
// // // // //   /* Search Box */
// // // // //   searchBox: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 18,
// // // // //     paddingHorizontal: 14,
// // // // //     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// // // // //     marginBottom: 16,
// // // // //     elevation: 2,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 8,
// // // // //   },
// // // // //   searchInput: {
// // // // //     flex: 1,
// // // // //     marginHorizontal: 10,
// // // // //     color: COLORS.text,
// // // // //     fontSize: 14,
// // // // //     padding: 0,
// // // // //   },
  
// // // // //   /* Tabs - Without Icons */
// // // // //   tabsContainer: {
// // // // //     flexDirection: 'row',
// // // // //     marginBottom: 16,
// // // // //     gap: 8,
// // // // //   },
// // // // //   tabButton: {
// // // // //     flex: 1,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: COLORS.surface,
// // // // //     paddingVertical: 10,
// // // // //     paddingHorizontal: 8,
// // // // //     borderRadius: 20,
// // // // //     borderWidth: 1,
// // // // //     borderColor: COLORS.border,
// // // // //     gap: 4,
// // // // //   },
// // // // //   tabButtonActive: {
// // // // //     backgroundColor: COLORS.primary,
// // // // //     borderColor: COLORS.primary,
// // // // //   },
// // // // //   tabButtonText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //     color: COLORS.textSecondary,
// // // // //   },
// // // // //   tabButtonTextActive: {
// // // // //     color: COLORS.surface,
// // // // //   },
// // // // //   tabCount: {
// // // // //     backgroundColor: COLORS.background,
// // // // //     borderRadius: 12,
// // // // //     paddingHorizontal: 6,
// // // // //     paddingVertical: 2,
// // // // //     marginLeft: 2,
// // // // //   },
// // // // //   tabCountActive: {
// // // // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // // // //   },
// // // // //   tabCountText: {
// // // // //     fontSize: 10,
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.textSecondary,
// // // // //   },
// // // // //   tabCountTextActive: {
// // // // //     color: COLORS.surface,
// // // // //   },
  
// // // // //   /* Games Count */
// // // // //   gamesCountContainer: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   gamesCount: {
// // // // //     fontSize: 14,
// // // // //     color: COLORS.textSecondary,
// // // // //     fontWeight: '500',
// // // // //   },
  
// // // // //   /* Card Background - New enhanced styles */
// // // // //   cardBackground: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     borderRadius: 24,
// // // // //   },
  
// // // // //   /* Decorative circles */
// // // // //   cardDecorativeCircle: {
// // // // //     position: 'absolute',
// // // // //     width: 100,
// // // // //     height: 100,
// // // // //     borderRadius: 50,
// // // // //     opacity: 0.08,
// // // // //   },
// // // // //   circle1: {
// // // // //     top: -30,
// // // // //     right: -30,
// // // // //     width: 150,
// // // // //     height: 150,
// // // // //     borderRadius: 75,
// // // // //   },
// // // // //   circle2: {
// // // // //     bottom: -20,
// // // // //     left: -20,
// // // // //     width: 120,
// // // // //     height: 120,
// // // // //     borderRadius: 60,
// // // // //     opacity: 0.06,
// // // // //   },
// // // // //   circle3: {
// // // // //     top: '40%',
// // // // //     left: '30%',
// // // // //     width: 80,
// // // // //     height: 80,
// // // // //     borderRadius: 40,
// // // // //     opacity: 0.05,
// // // // //   },
  
// // // // //   /* Floating particles */
// // // // //   floatingParticle: {
// // // // //     position: 'absolute',
// // // // //     width: 4,
// // // // //     height: 4,
// // // // //     borderRadius: 2,
// // // // //     opacity: 0.12,
// // // // //   },
// // // // //   particle1: {
// // // // //     top: 20,
// // // // //     right: 40,
// // // // //     width: 6,
// // // // //     height: 6,
// // // // //   },
// // // // //   particle2: {
// // // // //     bottom: 30,
// // // // //     left: 50,
// // // // //     width: 5,
// // // // //     height: 5,
// // // // //   },
// // // // //   particle3: {
// // // // //     top: '60%',
// // // // //     right: 60,
// // // // //     width: 7,
// // // // //     height: 7,
// // // // //   },
// // // // //   particle4: {
// // // // //     bottom: '20%',
// // // // //     left: 80,
// // // // //     width: 4,
// // // // //     height: 4,
// // // // //   },
  
// // // // //   /* Game Cards */
// // // // //   gameCard: {
// // // // //     borderRadius: 24,
// // // // //     marginBottom: 16,
// // // // //     padding: 16,
// // // // //     paddingTop: 40, // Space for badges
// // // // //     elevation: 4,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 4 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 12,
// // // // //     position: 'relative',
// // // // //     overflow: 'hidden',
// // // // //     borderWidth: 1,
// // // // //     borderColor: 'rgba(255,255,255,0.5)',
// // // // //   },
// // // // //   playingGameCard: {
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.primary,
// // // // //     shadowColor: COLORS.primary,
// // // // //     shadowOpacity: 0.15,
// // // // //   },

// // // // //   /* Status Badge - TOP LEFT corner */
// // // // //   statusBadge: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderBottomRightRadius: 20,
// // // // //     borderTopLeftRadius: 24,
// // // // //     gap: 4,
// // // // //     zIndex: 10,
// // // // //     elevation: 5,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.surface,
// // // // //   },
// // // // //   statusBadgeText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 11,
// // // // //     fontWeight: '700',
// // // // //   },

// // // // //   /* Playing Badge - TOP RIGHT corner */
// // // // //   playingBadge: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     right: 0,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderBottomLeftRadius: 20,
// // // // //     borderTopRightRadius: 24,
// // // // //     gap: 4,
// // // // //     zIndex: 10,
// // // // //     elevation: 5,
// // // // //     shadowColor: COLORS.primary,
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 4,
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.surface,
// // // // //   },
// // // // //   playingBadgeText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 11,
// // // // //     fontWeight: '700',
// // // // //   },

// // // // //   /* Game Card Header with Icon */
// // // // //   gameCardHeader: {
// // // // //     marginBottom: 16,
// // // // //     marginTop: 1, // Space between badges and content
// // // // //     zIndex: 2,
// // // // //   },
// // // // //   gameIconContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 12,
// // // // //   },
// // // // //   gameIconWrapper: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 16,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     shadowColor: COLORS.primary,
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   gameTitleContainer: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   gameName: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.text,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   gameCode: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textLight,
// // // // //   },

// // // // //   /* Game Content */
// // // // //   gameCardContent: {
// // // // //     gap: 12,
// // // // //     zIndex: 2,
// // // // //   },
// // // // //   gameMetaRow: {
// // // // //     flexDirection: 'row',
// // // // //     gap: 16,
// // // // //   },
// // // // //   metaItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 6,
// // // // //     flex: 1,
// // // // //   },
// // // // //   metaText: {
// // // // //     fontSize: 13,
// // // // //     color: COLORS.textSecondary,
// // // // //     flex: 1,
// // // // //   },

// // // // //   /* Ticket Info */
// // // // //   ticketInfoContainer: {
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 20,
// // // // //     alignSelf: 'flex-start',
// // // // //   },
// // // // //   ticketInfoText: {
// // // // //     fontSize: 11,
// // // // //     fontWeight: '600',
// // // // //   },

// // // // //   /* Prize and Action */
// // // // //   prizeContainer: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //     paddingTop: 12,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: 'rgba(0,0,0,0.05)',
// // // // //   },
// // // // //   prizeLeftSection: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   prizeLabel: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textLight,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   prizeValue: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.text,
// // // // //   },
// // // // //   ticketPriceBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 20,
// // // // //     gap: 4,
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   ticketPriceText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   actionButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: COLORS.primary,
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 30,
// // // // //     gap: 6,
// // // // //     shadowColor: COLORS.primary,
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   actionButtonText: {
// // // // //     color: '#FFFFFF',
// // // // //     fontSize: 13,
// // // // //     fontWeight: '600',
// // // // //   },

// // // // //   /* Empty State */
// // // // //   emptyGames: {
// // // // //     alignItems: 'center',
// // // // //     padding: 40,
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 24,
// // // // //     marginTop: 20,
// // // // //   },
// // // // //   emptyGamesText: {
// // // // //     fontSize: 16,
// // // // //     color: COLORS.textSecondary,
// // // // //     marginTop: 12,
// // // // //     marginBottom: 16,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   clearSearchButton: {
// // // // //     backgroundColor: COLORS.primary,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 20,
// // // // //   },
// // // // //   clearSearchButtonText: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //   },
  
// // // // //   flatListContent: {
// // // // //     paddingBottom: 20,
// // // // //   },
// // // // // });

// // // // // export default Game;









// // // import React, { useEffect, useState, useRef } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   StyleSheet,
// // //   RefreshControl,
// // //   Dimensions,
// // //   TextInput,
// // //   Keyboard,
// // //   Animated,
// // //   Easing,
// // //   FlatList,
// // //   SafeAreaView,
// // //   Alert,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import Feather from "react-native-vector-icons/Feather";

// // // const { width } = Dimensions.get('window');

// // // // NEW Color scheme matching the Home component
// // // const PRIMARY_COLOR = "#4facfe"; // Main blue color
// // // const ACCENT_COLOR = "#ff9800"; // Orange accent
// // // const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// // // const WHITE = "#FFFFFF";
// // // const TEXT_DARK = "#333333";
// // // const TEXT_LIGHT = "#777777";
// // // const BORDER_COLOR = "#EEEEEE";
// // // const CARD_BACKGROUND = "#FFFFFF";

// // // // Additional colors for completed games - replaced gray with teal
// // // const COMPLETED_COLOR = "#ff9800"; // Teal color instead of gray
// // // const COMPLETED_LIGHT = "#f5eee2"; // Light teal background

// // // const Game = ({ navigation }) => {
// // //   const [games, setGames] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [userGameData, setUserGameData] = useState({
// // //     myTickets: [],
// // //     myRequests: []
// // //   });
// // //   const [activeTab, setActiveTab] = useState('myGames');
  
// // //   // Pagination states
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [lastPage, setLastPage] = useState(1);
// // //   const [loadingMore, setLoadingMore] = useState(false);
// // //   const [hasMore, setHasMore] = useState(true);
  
// // //   // Animation values
// // //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// // //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// // //   const pulseAnim = useRef(new Animated.Value(1)).current;
// // //   const fadeAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     fetchAllData();
// // //     startAnimations();
    
// // //     // Start fade animation
// // //     Animated.timing(fadeAnim, {
// // //       toValue: 1,
// // //       duration: 800,
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, []);

// // //   const startAnimations = () => {
// // //     // First floating animation
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(floatAnim1, {
// // //           toValue: 1,
// // //           duration: 4000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(floatAnim1, {
// // //           toValue: 0,
// // //           duration: 4000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     // Second floating animation
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(floatAnim2, {
// // //           toValue: 1,
// // //           duration: 5000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(floatAnim2, {
// // //           toValue: 0,
// // //           duration: 5000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     // Pulse animation
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1.02,
// // //           duration: 3000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1,
// // //           duration: 3000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();
// // //   };

// // //   // Interpolations for animations
// // //   const translateY1 = floatAnim1.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, 15]
// // //   });

// // //   const translateY2 = floatAnim2.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, -10]
// // //   });

// // //   const onRefresh = React.useCallback(() => {
// // //     setRefreshing(true);
// // //     setCurrentPage(1);
// // //     setHasMore(true);
// // //     fetchAllData(true).finally(() => setRefreshing(false));
// // //   }, []);

// // //   const fetchAllData = async (reset = false) => {
// // //     if (reset) {
// // //       setGames([]);
// // //     }
// // //     setLoading(true);
// // //     try {
// // //       await Promise.all([
// // //         fetchGames(1, reset),
// // //         fetchMyTickets(),
// // //         fetchMyRequests()
// // //       ]);
// // //     } catch (error) {
// // //       console.log("Error fetching data:", error);
// // //       Alert.alert("Error", "Failed to load games data!");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchGames = async (page = 1, reset = false) => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
      
// // //       if (res.data.success) {
// // //         const gamesData = res.data.games.data || [];
// // //         const paginationData = res.data.games;
        
// // //         if (reset) {
// // //           setGames(gamesData);
// // //         } else {
// // //           setGames(prev => [...prev, ...gamesData]);
// // //         }
        
// // //         setCurrentPage(paginationData.current_page);
// // //         setLastPage(paginationData.last_page);
// // //         setHasMore(paginationData.current_page < paginationData.last_page);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching games:", error);
// // //       Alert.alert("Error", "Failed to load games!");
// // //     }
// // //   };

// // //   const fetchMyTickets = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-tickets",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.success) {
// // //         setUserGameData(prev => ({
// // //           ...prev,
// // //           myTickets: res.data.tickets.data || []
// // //         }));
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching tickets:", error);
// // //     }
// // //   };

// // //   const fetchMyRequests = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.success) {
// // //         setUserGameData(prev => ({
// // //           ...prev,
// // //           myRequests: res.data.ticket_requests.data || []
// // //         }));
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching requests:", error);
// // //     }
// // //   };

// // //   const loadMoreGames = () => {
// // //     if (!loadingMore && hasMore) {
// // //       setLoadingMore(true);
// // //       const nextPage = currentPage + 1;
// // //       fetchGames(nextPage).finally(() => setLoadingMore(false));
// // //     }
// // //   };

// // //   const isUserPlayingGame = (gameId) => {
// // //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// // //     const hasPendingRequests = userGameData.myRequests.some(request => 
// // //       request.game_id == gameId && request.status === 'pending'
// // //     );
    
// // //     return hasTickets || hasPendingRequests;
// // //   };

// // //   const getUserTicketCount = (gameId) => {
// // //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// // //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// // //       request.game_id == gameId && request.status === 'pending'
// // //     ).length;
    
// // //     return {
// // //       tickets: ticketsCount,
// // //       pendingRequests: pendingRequestsCount,
// // //       total: ticketsCount + pendingRequestsCount
// // //     };
// // //   };

// // //   const getFilteredGames = () => {
// // //     let filtered = games;

// // //     if (searchQuery.trim()) {
// // //       filtered = filtered.filter(game =>
// // //         game.game_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //         game.game_code.toLowerCase().includes(searchQuery.toLowerCase())
// // //       );
// // //     }

// // //     if (activeTab === 'myGames') {
// // //       filtered = filtered.filter(game => isUserPlayingGame(game.id));
// // //     } else if (activeTab === 'completed') {
// // //       filtered = filtered.filter(game => game.status === 'completed');
// // //     }

// // //     return filtered;
// // //   };

// // //   const renderPlayingBadge = (game) => {
// // //     const ticketInfo = getUserTicketCount(game.id);
    
// // //     if (ticketInfo.total === 0) return null;
    
// // //     return (
// // //       <View style={styles.playingBadge}>
// // //         <View style={styles.playingBadgeIcon}>
// // //           <Ionicons name="person-circle" size={12} color={WHITE} />
// // //         </View>
// // //         <Text style={styles.playingBadgeText}>
// // //           {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// // //           {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
// // //           {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// // //         </Text>
// // //       </View>
// // //     );
// // //   };

// // //   const renderGameCard = ({ item: game }) => {
// // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // //     const ticketInfo = getUserTicketCount(game.id);
// // //     const isPlaying = isUserPlayingGame(game.id);
// // //     const isCompleted = game.status === 'completed';
// // //     const isLive = game.status === 'live';
// // //     const isScheduled = game.status === 'scheduled';
    
// // //     return (
// // //       <TouchableOpacity
// // //         key={game.id}
// // //         style={[
// // //           styles.gameCard,
// // //           isPlaying && styles.playingGameCard,
// // //           isCompleted && styles.completedGameCard,
// // //         ]}
// // //         activeOpacity={0.9}
// // //         onPress={() => navigation.navigate("GameDetails", { game })}
// // //       >
// // //         {/* Background Pattern */}
// // //         <View style={styles.gameCardPattern} />
        
// // //         {/* Status badge on left top corner */}
// // //         <View style={[
// // //           styles.statusBadge,
// // //           isLive ? styles.liveBadge :
// // //           isScheduled ? styles.scheduledBadge :
// // //           isCompleted ? styles.completedBadgeNew :
// // //           styles.defaultBadge
// // //         ]}>
// // //           <Ionicons 
// // //             name={
// // //               isLive ? 'radio-button-on' : 
// // //               isCompleted ? 'trophy' :
// // //               'time'
// // //             } 
// // //             size={10} 
// // //             color={WHITE} 
// // //           />
// // //           <Text style={styles.statusText}>
// // //             {isLive ? 'LIVE' : 
// // //              isCompleted ? 'COMPLETED' : 
// // //              'SOON'}
// // //           </Text>
// // //         </View>

// // //         {/* Playing indicator */}
// // //         {isPlaying && (
// // //           <View style={styles.playingCardOverlay}>
// // //             <View style={styles.playingCardLabel}>
// // //               <Ionicons name="checkmark-circle" size={12} color={WHITE} />
// // //               <Text style={styles.playingCardLabelText}>You're Playing</Text>
// // //             </View>
// // //           </View>
// // //         )}

// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.gameIconContainer}>
// // //             <View style={[
// // //               styles.gameIconWrapper,
// // //               isCompleted && { borderColor: COMPLETED_COLOR }
// // //             ]}>
// // //               <MaterialIcons 
// // //                 name={isCompleted ? "trophy" : "confirmation-number"} 
// // //                 size={32} 
// // //                 color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// // //               />
// // //             </View>
// // //             <View style={styles.gameInfo}>
// // //               <Text style={styles.gameName} numberOfLines={1}>
// // //                 {game.game_name}
// // //               </Text>
// // //               <Text style={styles.gameId}>
// // //                 ID: {game.game_code}
// // //               </Text>
// // //               {isPlaying && renderPlayingBadge(game)}
// // //             </View>
// // //           </View>
          
// // //           <View style={[
// // //             styles.gameTypeBadge,
// // //             game.ticket_type === "paid" ? styles.paidBadge : styles.freeBadge,
// // //             isCompleted && { borderColor: COMPLETED_COLOR }
// // //           ]}>
// // //             {game.ticket_type === "paid" ? (
// // //               <>
// // //                 <MaterialIcons name="diamond" size={14} color={ACCENT_COLOR} />
// // //                 <Text style={styles.gameTypeText}>
// // //                   ₹{ticketCost}
// // //                 </Text>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Ionicons name="checkmark-circle" size={14} color={ACCENT_COLOR} />
// // //                 <Text style={styles.gameTypeText}>
// // //                   FREE
// // //                 </Text>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <View style={styles.gameDetails}>
// // //           <View style={styles.detailRow}>
// // //             <View style={styles.detailItem}>
// // //               <View style={[
// // //                 styles.detailIcon,
// // //                 isCompleted && { borderColor: COMPLETED_COLOR }
// // //               ]}>
// // //                 <Ionicons 
// // //                   name="calendar" 
// // //                   size={14} 
// // //                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// // //                 />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Date</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.game_date_formatted || game.game_date}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             <View style={styles.detailItem}>
// // //               <View style={[
// // //                 styles.detailIcon,
// // //                 isCompleted && { borderColor: COMPLETED_COLOR }
// // //               ]}>
// // //                 <Ionicons 
// // //                   name="time" 
// // //                   size={14} 
// // //                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// // //                 />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Time</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.game_time_formatted || game.game_start_time}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
          
// // //           <View style={styles.detailRow}>
// // //             <View style={styles.detailItem}>
// // //               <View style={[
// // //                 styles.detailIcon,
// // //                 isCompleted && { borderColor: COMPLETED_COLOR }
// // //               ]}>
// // //                 <Ionicons 
// // //                   name="person" 
// // //                   size={14} 
// // //                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// // //                 />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Host</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.user ? game.user.name : 'Tambola Timez'}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             {game.available_tickets !== undefined && !isCompleted && (
// // //               <View style={styles.detailItem}>
// // //                 <View style={styles.detailIcon}>
// // //                   <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.detailLabel}>Tickets</Text>
// // //                   <Text style={styles.detailText}>
// // //                     {game.available_tickets} Left
// // //                   </Text>
// // //                 </View>
// // //               </View>
// // //             )}
// // //             {isCompleted && (
// // //               <View style={styles.detailItem}>
// // //                 <View style={[styles.detailIcon, { borderColor: COMPLETED_COLOR }]}>
// // //                   <Ionicons name="trophy" size={14} color={COMPLETED_COLOR} />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.detailLabel}>Status</Text>
// // //                   <Text style={styles.detailText}>Completed</Text>
// // //                 </View>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <View style={[
// // //           styles.prizeContainer,
// // //           isCompleted && { backgroundColor: COMPLETED_LIGHT }
// // //         ]}>
// // //           <View style={[
// // //             styles.prizeIcon,
// // //             isCompleted && { borderColor: COMPLETED_COLOR }
// // //           ]}>
// // //             <MaterialIcons 
// // //               name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
// // //               size={18} 
// // //               color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// // //             />
// // //           </View>
// // //           <View style={styles.prizeInfo}>
// // //             <Text style={styles.prizeLabel}>
// // //               {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
// // //             </Text>
// // //             <Text style={styles.prizeText}>
// // //               {game.ticket_type === "paid" && game.max_tickets 
// // //                 ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // //                 : "Exciting Prizes"}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         <TouchableOpacity 
// // //           style={[
// // //             styles.joinButton,
// // //             isPlaying && styles.playingJoinButton,
// // //             isCompleted && styles.completedJoinButtonNew
// // //           ]}
// // //           onPress={() => navigation.navigate("GameDetails", { game })}
// // //         >
// // //           <View style={styles.glassEffectOverlay} />
// // //           <Text style={styles.joinButtonText}>
// // //             {isCompleted 
// // //               ? 'VIEW RESULTS' 
// // //               : isPlaying 
// // //                 ? 'VIEW MY GAME' 
// // //                 : isLive
// // //                   ? 'JOIN GAME' 
// // //                   : 'VIEW DETAILS'}
// // //           </Text>
// // //           <Ionicons 
// // //             name={isCompleted ? "trophy" : "arrow-forward"} 
// // //             size={16} 
// // //             color={WHITE} 
// // //           />
// // //         </TouchableOpacity>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const TabButton = ({ title, count, isActive, onPress }) => (
// // //     <TouchableOpacity
// // //       style={[styles.tabButton, isActive && styles.tabButtonActive]}
// // //       onPress={onPress}
// // //     >
// // //       <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
// // //         {title}
// // //       </Text>
// // //       {count > 0 && (
// // //         <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
// // //           <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
// // //             {count}
// // //           </Text>
// // //         </View>
// // //       )}
// // //     </TouchableOpacity>
// // //   );

// // //   const renderFooter = () => {
// // //     if (!loadingMore) return null;
    
// // //     return (
// // //       <View style={styles.loadingMoreContainer}>
// // //         <ActivityIndicator size="small" color={PRIMARY_COLOR} />
// // //         <Text style={styles.loadingMoreText}>Loading more games...</Text>
// // //       </View>
// // //     );
// // //   };

// // //   const renderEmptyList = () => (
// // //     <View style={styles.emptyState}>
// // //       <View style={styles.emptyIconWrapper}>
// // //         <Ionicons 
// // //           name={
// // //             activeTab === 'myGames' ? "game-controller-outline" : 
// // //             activeTab === 'completed' ? "trophy-outline" : 
// // //             "search-outline"
// // //           } 
// // //           size={50} 
// // //           color={PRIMARY_COLOR} 
// // //         />
// // //       </View>
// // //       <Text style={styles.emptyTitle}>
// // //         {activeTab === 'myGames' 
// // //           ? 'No Games Found' 
// // //           : activeTab === 'completed'
// // //           ? 'No Completed Games'
// // //           : 'No Games Available'}
// // //       </Text>
// // //       <Text style={styles.emptySubtitle}>
// // //         {searchQuery 
// // //           ? `No games found for "${searchQuery}"`
// // //           : activeTab === 'myGames'
// // //           ? "You haven't joined any games yet. Browse all games to get started!"
// // //           : activeTab === 'completed'
// // //           ? "No completed games available yet. Check back later!"
// // //           : "Check back later for new exciting games!"}
// // //       </Text>
// // //       {searchQuery && (
// // //         <TouchableOpacity 
// // //           style={styles.clearFiltersButton}
// // //           onPress={() => setSearchQuery('')}
// // //         >
// // //           <View style={styles.glassEffectOverlay} />
// // //           <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
// // //         </TouchableOpacity>
// // //       )}
// // //       {activeTab === 'myGames' && !searchQuery && (
// // //         <TouchableOpacity 
// // //           style={styles.browseGamesButton}
// // //           onPress={() => setActiveTab('allGames')}
// // //         >
// // //           <View style={styles.glassEffectOverlay} />
// // //           <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
// // //         </TouchableOpacity>
// // //       )}
// // //     </View>
// // //   );

// // //   const renderHeader = () => (
// // //     <View style={styles.section}>
// // //       <View style={styles.sectionHeader}>
// // //         <Text style={styles.sectionTitle}>
// // //           {activeTab === 'myGames' ? 'My Games' : 
// // //            activeTab === 'completed' ? 'Completed Games' : 
// // //            'All Games'}
// // //         </Text>
// // //         <Text style={styles.gameCount}>
// // //           {getFilteredGames().length} Game{getFilteredGames().length !== 1 ? 's' : ''}
// // //         </Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   if (loading && games.length === 0) {
// // //     return (
// // //       <SafeAreaView style={styles.safeArea}>
// // //         <View style={styles.loadingContainer}>
// // //           <View style={styles.backgroundPattern}>
// // //             <Animated.View 
// // //               style={[
// // //                 styles.pokerChip1, 
// // //                 { transform: [{ translateY: translateY1 }] }
// // //               ]} 
// // //             />
// // //             <Animated.View 
// // //               style={[
// // //                 styles.pokerChip2, 
// // //                 { transform: [{ translateY: translateY2 }] }
// // //               ]} 
// // //             />
// // //           </View>
          
// // //           <View style={styles.loadingAnimation}>
// // //             <View style={styles.loadingIconWrapper}>
// // //               <Ionicons name="game-controller" size={40} color={PRIMARY_COLOR} />
// // //             </View>
// // //             <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
// // //           </View>
// // //           <Text style={styles.loadingText}>Loading games...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
// // //   const completedGamesCount = games.filter(game => game.status === 'completed').length;
// // //   const allGamesCount = games.length;

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
// // //         <View style={styles.backgroundPattern}>
// // //           <Animated.View 
// // //             style={[
// // //               styles.pokerChip1, 
// // //               { transform: [{ translateY: translateY1 }] }
// // //             ]} 
// // //           />
// // //           <Animated.View 
// // //             style={[
// // //               styles.pokerChip2, 
// // //               { transform: [{ translateY: translateY2 }] }
// // //             ]} 
// // //           />
// // //         </View>

// // //         {/* Fixed Header */}
// // //         <Animated.View 
// // //           style={[
// // //             styles.header,
// // //             { transform: [{ scale: pulseAnim }] }
// // //           ]}
// // //         >
// // //           <View style={styles.headerContent}>
// // //             <View style={styles.headerTop}>
// // //               <View>
// // //                 <Text style={styles.appName}>Tambola Games</Text>
// // //                 <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
// // //               </View>
// // //               {myGamesCount > 0 && (
// // //                 <View style={styles.playingCountBadge}>
// // //                   <Ionicons name="checkmark-circle" size={14} color={WHITE} />
// // //                   <Text style={styles.playingCountText}>{myGamesCount}</Text>
// // //                 </View>
// // //               )}
// // //             </View>

// // //             <View style={styles.searchContainer}>
// // //               <View style={styles.searchIcon}>
// // //                 <Feather name="search" size={20} color={TEXT_LIGHT} />
// // //               </View>
// // //               <TextInput
// // //                 style={styles.searchInput}
// // //                 placeholder="Search games by name or ID..."
// // //                 placeholderTextColor={TEXT_LIGHT}
// // //                 value={searchQuery}
// // //                 onChangeText={setSearchQuery}
// // //                 returnKeyType="search"
// // //                 onSubmitEditing={Keyboard.dismiss}
// // //               />
// // //               {searchQuery.length > 0 && (
// // //                 <TouchableOpacity 
// // //                   style={styles.clearButton}
// // //                   onPress={() => setSearchQuery('')}
// // //                 >
// // //                   <Ionicons name="close-circle" size={20} color={TEXT_LIGHT} />
// // //                 </TouchableOpacity>
// // //               )}
// // //             </View>
// // //           </View>
// // //         </Animated.View>

// // //         {/* Fixed Tabs */}
// // //         <View style={styles.tabsContainer}>
// // //           <TabButton
// // //             title="My Games"
// // //             count={myGamesCount}
// // //             isActive={activeTab === 'myGames'}
// // //             onPress={() => setActiveTab('myGames')}
// // //           />
// // //           <TabButton
// // //             title="All Games"
// // //             count={allGamesCount}
// // //             isActive={activeTab === 'allGames'}
// // //             onPress={() => setActiveTab('allGames')}
// // //           />
// // //           <TabButton
// // //             title="Completed"
// // //             count={completedGamesCount}
// // //             isActive={activeTab === 'completed'}
// // //             onPress={() => setActiveTab('completed')}
// // //           />
// // //         </View>

// // //         {/* Scrollable content */}
// // //         <FlatList
// // //           data={getFilteredGames()}
// // //           renderItem={renderGameCard}
// // //           keyExtractor={(item) => item.id.toString()}
// // //           style={styles.flatList}
// // //           contentContainerStyle={styles.flatListContent}
// // //           showsVerticalScrollIndicator={false}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={onRefresh}
// // //               tintColor={PRIMARY_COLOR}
// // //               colors={[PRIMARY_COLOR]}
// // //             />
// // //           }
// // //           onEndReached={loadMoreGames}
// // //           onEndReachedThreshold={0.5}
// // //           ListFooterComponent={renderFooter}
// // //           ListEmptyComponent={renderEmptyList}
// // //           ListHeaderComponent={renderHeader}
// // //         />
// // //       </Animated.View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default Game;

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: BACKGROUND_COLOR,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: BACKGROUND_COLOR,
// // //   },
// // //   flatList: {
// // //     flex: 1,
// // //   },
// // //   flatListContent: {
// // //     paddingBottom: 20,
// // //   },
// // //   loadingMoreContainer: {
// // //     paddingVertical: 20,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     flexDirection: 'row',
// // //     gap: 10,
// // //   },
// // //   loadingMoreText: {
// // //     fontSize: 14,
// // //     color: TEXT_LIGHT,
// // //     marginLeft: 10,
// // //   },
// // //   backgroundPattern: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     zIndex: -1,
// // //     overflow: 'hidden',
// // //   },
// // //   pokerChip1: {
// // //     position: 'absolute',
// // //     top: 80,
// // //     left: width * 0.1,
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: PRIMARY_COLOR,
// // //     shadowColor: PRIMARY_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   pokerChip2: {
// // //     position: 'absolute',
// // //     top: 120,
// // //     right: width * 0.15,
// // //     width: 30,
// // //     height: 30,
// // //     borderRadius: 15,
// // //     backgroundColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 3 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 6,
// // //     elevation: 5,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: BACKGROUND_COLOR,
// // //     position: 'relative',
// // //   },
// // //   loadingAnimation: {
// // //     position: 'relative',
// // //     marginBottom: 20,
// // //   },
// // //   loadingIconWrapper: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: 'rgba(79, 172, 254, 0.2)',
// // //   },
// // //   loadingSpinner: {
// // //     position: 'absolute',
// // //     top: 10,
// // //     left: 10,
// // //   },
// // //   loadingText: {
// // //     fontSize: 16,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //   },
// // //   header: {
// // //     backgroundColor: PRIMARY_COLOR,
// // //     paddingTop: 20,
// // //     paddingBottom: 15,
// // //     borderBottomLeftRadius: 25,
// // //     borderBottomRightRadius: 25,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   headerContent: {
// // //     paddingHorizontal: 20,
// // //   },
// // //   headerTop: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 15,
// // //   },
// // //   appName: {
// // //     fontSize: 24,
// // //     fontWeight: "700",
// // //     color: WHITE,
// // //     letterSpacing: -0.5,
// // //   },
// // //   appTagline: {
// // //     fontSize: 13,
// // //     color: 'rgba(255,255,255,0.8)',
// // //     marginTop: 2,
// // //     fontWeight: "500",
// // //   },
// // //   playingCountBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //     gap: 4,
// // //   },
// // //   playingCountText: {
// // //     color: WHITE,
// // //     fontSize: 12,
// // //     fontWeight: '700',
// // //   },
// // //   searchContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: WHITE,
// // //     borderRadius: 12,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 8,
// // //     borderWidth: 1,
// // //     borderColor: BORDER_COLOR,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   searchIcon: {
// // //     marginRight: 8,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     fontSize: 14,
// // //     color: TEXT_DARK,
// // //     paddingVertical: 4,
// // //   },
// // //   clearButton: {
// // //     padding: 4,
// // //   },
// // //   tabsContainer: {
// // //     flexDirection: 'row',
// // //     backgroundColor: WHITE,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: BORDER_COLOR,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   tabButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //     marginRight: 10,
// // //     backgroundColor: BACKGROUND_COLOR,
// // //     borderWidth: 1,
// // //     borderColor: BORDER_COLOR,
// // //   },
// // //   tabButtonActive: {
// // //     backgroundColor: PRIMARY_COLOR,
// // //     borderColor: PRIMARY_COLOR,
// // //   },
// // //   tabButtonText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: TEXT_LIGHT,
// // //   },
// // //   tabButtonTextActive: {
// // //     color: WHITE,
// // //   },
// // //   tabCount: {
// // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // //     borderRadius: 10,
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 2,
// // //     marginLeft: 6,
// // //   },
// // //   tabCountActive: {
// // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   tabCountText: {
// // //     color: PRIMARY_COLOR,
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //   },
// // //   tabCountTextActive: {
// // //     color: WHITE,
// // //   },
// // //   section: {
// // //     paddingHorizontal: 20,
// // //     paddingTop: 15,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 15,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: TEXT_DARK,
// // //   },
// // //   gameCount: {
// // //     fontSize: 14,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //   },
// // //   gameCard: {
// // //     backgroundColor: WHITE,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     marginHorizontal: 20,
// // //     marginBottom: 12,
// // //     borderWidth: 1,
// // //     borderColor: BORDER_COLOR,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   playingGameCard: {
// // //     borderColor: PRIMARY_COLOR,
// // //     borderWidth: 2,
// // //   },
// // //   completedGameCard: {
// // //     borderColor: COMPLETED_COLOR,
// // //     borderWidth: 1,
// // //     backgroundColor: COMPLETED_LIGHT,
// // //   },
// // //   playingCardOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     right: 0,
// // //     zIndex: 2,
// // //   },
// // //   playingCardLabel: {
// // //     backgroundColor: PRIMARY_COLOR,
// // //     borderBottomLeftRadius: 12,
// // //     borderTopRightRadius: 14,
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //   },
// // //   playingCardLabelText: {
// // //     color: WHITE,
// // //     fontSize: 10,
// // //     fontWeight: "700",
// // //   },
// // //   statusBadge: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderBottomRightRadius: 12,
// // //     borderTopLeftRadius: 14,
// // //     gap: 4,
// // //     zIndex: 2,
// // //   },
// // //   liveBadge: {
// // //     backgroundColor: '#4CAF50',
// // //   },
// // //   scheduledBadge: {
// // //     backgroundColor: ACCENT_COLOR,
// // //   },
// // //   completedBadgeNew: {
// // //     backgroundColor: COMPLETED_COLOR,
// // //   },
// // //   defaultBadge: {
// // //     backgroundColor: ACCENT_COLOR,
// // //   },
// // //   statusText: {
// // //     color: WHITE,
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //   },
// // //   gameCardPattern: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     width: 50,
// // //     height: 50,
// // //     borderBottomLeftRadius: 16,
// // //     borderTopRightRadius: 25,
// // //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// // //   },
// // //   cardHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "flex-start",
// // //     marginTop: 8,
// // //     marginBottom: 16,
// // //   },
// // //   gameIconContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     flex: 1,
// // //     gap: 12,
// // //   },
// // //   gameIconWrapper: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 10,
// // //     backgroundColor: BACKGROUND_COLOR,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 2,
// // //     borderColor: PRIMARY_COLOR,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   gameInfo: {
// // //     flex: 1,
// // //   },
// // //   gameName: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: TEXT_DARK,
// // //     marginBottom: 2,
// // //   },
// // //   gameId: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //   },
// // //   playingBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 3,
// // //     borderRadius: 6,
// // //     alignSelf: 'flex-start',
// // //     marginTop: 4,
// // //     gap: 4,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(79, 172, 254, 0.2)',
// // //   },
// // //   playingBadgeIcon: {
// // //     width: 16,
// // //     height: 16,
// // //     borderRadius: 8,
// // //     backgroundColor: PRIMARY_COLOR,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   playingBadgeText: {
// // //     fontSize: 10,
// // //     color: PRIMARY_COLOR,
// // //     fontWeight: "600",
// // //   },
// // //   gameTypeBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 10,
// // //     gap: 4,
// // //     marginLeft: 8,
// // //     borderWidth: 1,
// // //   },
// // //   paidBadge: {
// // //     backgroundColor: "rgba(255, 152, 0, 0.1)",
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   freeBadge: {
// // //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// // //     borderColor: "#4CAF50",
// // //   },
// // //   gameTypeText: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //     color: TEXT_DARK,
// // //   },
// // //   gameDetails: {
// // //     marginBottom: 16,
// // //   },
// // //   detailRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 12,
// // //   },
// // //   detailItem: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     gap: 8,
// // //     flex: 1,
// // //   },
// // //   detailIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: BACKGROUND_COLOR,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: PRIMARY_COLOR,
// // //   },
// // //   detailLabel: {
// // //     fontSize: 10,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //   },
// // //   detailText: {
// // //     fontSize: 12,
// // //     color: TEXT_DARK,
// // //     fontWeight: "600",
// // //   },
// // //   prizeContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: BACKGROUND_COLOR,
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 16,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: BORDER_COLOR,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 1,
// // //   },
// // //   prizeIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 8,
// // //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: PRIMARY_COLOR,
// // //   },
// // //   prizeInfo: {
// // //     flex: 1,
// // //   },
// // //   prizeLabel: {
// // //     fontSize: 11,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //   },
// // //   prizeText: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: TEXT_DARK,
// // //   },
// // //   joinButton: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 6,
// // //     backgroundColor: PRIMARY_COLOR,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //   },
// // //   glassEffectOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // //     borderTopWidth: 1,
// // //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// // //     borderRadius: 10,
// // //   },
// // //   playingJoinButton: {
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   completedJoinButtonNew: {
// // //     backgroundColor: COMPLETED_COLOR,
// // //   },
// // //   joinButtonText: {
// // //     color: WHITE,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   emptyState: {
// // //     backgroundColor: WHITE,
// // //     borderRadius: 16,
// // //     padding: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 1,
// // //     borderColor: BORDER_COLOR,
// // //     overflow: 'hidden',
// // //     marginTop: 20,
// // //     marginHorizontal: 20,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   emptyIconWrapper: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     borderWidth: 2,
// // //     borderColor: 'rgba(79, 172, 254, 0.2)',
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: TEXT_DARK,
// // //     marginBottom: 8,
// // //     textAlign: "center",
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: TEXT_LIGHT,
// // //     textAlign: "center",
// // //     lineHeight: 20,
// // //     marginBottom: 20,
// // //   },
// // //   clearFiltersButton: {
// // //     backgroundColor: PRIMARY_COLOR,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 10,
// // //     marginBottom: 10,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //   },
// // //   clearFiltersButtonText: {
// // //     color: WHITE,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   browseGamesButton: {
// // //     backgroundColor: WHITE,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 10,
// // //     borderWidth: 2,
// // //     borderColor: PRIMARY_COLOR,
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //   },
// // //   browseGamesButtonText: {
// // //     color: PRIMARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // // });





// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   StyleSheet,
// //   RefreshControl,
// //   Dimensions,
// //   TextInput,
// //   Keyboard,
// //   Animated,
// //   Easing,
// //   FlatList,
// //   SafeAreaView,
// //   Alert,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import Feather from "react-native-vector-icons/Feather";

// // const { width } = Dimensions.get('window');

// // // NEW Color scheme matching the Home component
// // const PRIMARY_COLOR = "#4facfe"; // Main blue color
// // const ACCENT_COLOR = "#ff9800"; // Orange accent
// // const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// // const WHITE = "#FFFFFF";
// // const TEXT_DARK = "#333333";
// // const TEXT_LIGHT = "#777777";
// // const BORDER_COLOR = "#EEEEEE";
// // const CARD_BACKGROUND = "#FFFFFF";

// // // Additional colors for completed games - replaced gray with teal
// // const COMPLETED_COLOR = "#ff9800"; // Teal color instead of gray
// // const COMPLETED_LIGHT = "#f5eee2"; // Light teal background

// // const Game = ({ navigation }) => {
// //   const [games, setGames] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [userGameData, setUserGameData] = useState({
// //     myTickets: [],
// //     myRequests: []
// //   });
// //   const [activeTab, setActiveTab] = useState('myGames');
  
// //   // Pagination states
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [lastPage, setLastPage] = useState(1);
// //   const [loadingMore, setLoadingMore] = useState(false);
// //   const [hasMore, setHasMore] = useState(true);
  
// //   // Animation values
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const fadeAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     fetchAllData();
// //     startAnimations();
    
// //     // Start fade animation
// //     Animated.timing(fadeAnim, {
// //       toValue: 1,
// //       duration: 800,
// //       useNativeDriver: true,
// //     }).start();
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

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     setCurrentPage(1);
// //     setHasMore(true);
// //     fetchAllData(true).finally(() => setRefreshing(false));
// //   }, []);

// //   const fetchAllData = async (reset = false) => {
// //     if (reset) {
// //       setGames([]);
// //     }
// //     setLoading(true);
// //     try {
// //       await Promise.all([
// //         fetchGames(1, reset),
// //         fetchMyTickets(),
// //         fetchMyRequests()
// //       ]);
// //     } catch (error) {
// //       console.log("Error fetching data:", error);
// //       Alert.alert("Error", "Failed to load games data!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchGames = async (page = 1, reset = false) => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (res.data.success) {
// //         const gamesData = res.data.games.data || [];
// //         const paginationData = res.data.games;
        
// //         if (reset) {
// //           setGames(gamesData);
// //         } else {
// //           setGames(prev => [...prev, ...gamesData]);
// //         }
        
// //         setCurrentPage(paginationData.current_page);
// //         setLastPage(paginationData.last_page);
// //         setHasMore(paginationData.current_page < paginationData.last_page);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching games:", error);
// //       Alert.alert("Error", "Failed to load games!");
// //     }
// //   };

// //   const fetchMyTickets = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setUserGameData(prev => ({
// //           ...prev,
// //           myTickets: res.data.tickets.data || []
// //         }));
// //       }
// //     } catch (error) {
// //       console.log("Error fetching tickets:", error);
// //     }
// //   };

// //   const fetchMyRequests = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setUserGameData(prev => ({
// //           ...prev,
// //           myRequests: res.data.ticket_requests.data || []
// //         }));
// //       }
// //     } catch (error) {
// //       console.log("Error fetching requests:", error);
// //     }
// //   };

// //   const loadMoreGames = () => {
// //     if (!loadingMore && hasMore) {
// //       setLoadingMore(true);
// //       const nextPage = currentPage + 1;
// //       fetchGames(nextPage).finally(() => setLoadingMore(false));
// //     }
// //   };

// //   const isUserPlayingGame = (gameId) => {
// //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// //     const hasPendingRequests = userGameData.myRequests.some(request => 
// //       request.game_id == gameId && request.status === 'pending'
// //     );
    
// //     return hasTickets || hasPendingRequests;
// //   };

// //   const getUserTicketCount = (gameId) => {
// //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// //       request.game_id == gameId && request.status === 'pending'
// //     ).length;
    
// //     return {
// //       tickets: ticketsCount,
// //       pendingRequests: pendingRequestsCount,
// //       total: ticketsCount + pendingRequestsCount
// //     };
// //   };

// //   const getFilteredGames = () => {
// //     let filtered = games;

// //     if (searchQuery.trim()) {
// //       filtered = filtered.filter(game =>
// //         game.game_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         game.game_code.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //     }

// //     if (activeTab === 'myGames') {
// //       filtered = filtered.filter(game => isUserPlayingGame(game.id));
// //     } else if (activeTab === 'completed') {
// //       filtered = filtered.filter(game => game.status === 'completed');
// //     }

// //     return filtered;
// //   };

// //   const renderPlayingBadge = (game) => {
// //     const ticketInfo = getUserTicketCount(game.id);
    
// //     if (ticketInfo.total === 0) return null;
    
// //     return (
// //       <View style={styles.playingBadge}>
// //         <View style={styles.playingBadgeIcon}>
// //           <Ionicons name="person-circle" size={12} color={WHITE} />
// //         </View>
// //         <Text style={styles.playingBadgeText}>
// //           {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// //           {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
// //           {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   const renderGameCard = ({ item: game }) => {
// //     const ticketCost = parseFloat(game.ticket_cost || 0);
// //     const ticketInfo = getUserTicketCount(game.id);
// //     const isPlaying = isUserPlayingGame(game.id);
// //     const isCompleted = game.status === 'completed';
// //     const isLive = game.status === 'live';
// //     const isScheduled = game.status === 'scheduled';
    
// //     // Calculate total prize pool from pattern rewards
// //     const calculatePrizePool = () => {
// //       if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
// //         return null;
// //       }
      
// //       const total = game.pattern_rewards.reduce((sum, reward) => {
// //         const amount = parseFloat(reward.amount) || 0;
// //         const count = parseInt(reward.reward_count) || 1;
// //         return sum + (amount * count);
// //       }, 0);
      
// //       return total;
// //     };
    
// //     const prizePool = calculatePrizePool();
    
// //     return (
// //       <TouchableOpacity
// //         key={game.id}
// //         style={[
// //           styles.gameCard,
// //           isPlaying && styles.playingGameCard,
// //           isCompleted && styles.completedGameCard,
// //         ]}
// //         activeOpacity={0.9}
// //         onPress={() => navigation.navigate("GameDetails", { game })}
// //       >
// //         {/* Background Pattern */}
// //         <View style={styles.gameCardPattern} />
        
// //         {/* Status badge on left top corner */}
// //         <View style={[
// //           styles.statusBadge,
// //           isLive ? styles.liveBadge :
// //           isScheduled ? styles.scheduledBadge :
// //           isCompleted ? styles.completedBadgeNew :
// //           styles.defaultBadge
// //         ]}>
// //           <Ionicons 
// //             name={
// //               isLive ? 'radio-button-on' : 
// //               isCompleted ? 'trophy' :
// //               'time'
// //             } 
// //             size={10} 
// //             color={WHITE} 
// //           />
// //           <Text style={styles.statusText}>
// //             {isLive ? 'LIVE' : 
// //              isCompleted ? 'COMPLETED' : 
// //              'SOON'}
// //           </Text>
// //         </View>

// //         {/* Playing indicator */}
// //         {isPlaying && (
// //           <View style={styles.playingCardOverlay}>
// //             <View style={styles.playingCardLabel}>
// //               <Ionicons name="checkmark-circle" size={12} color={WHITE} />
// //               <Text style={styles.playingCardLabelText}>You're Playing</Text>
// //             </View>
// //           </View>
// //         )}

// //         <View style={styles.cardHeader}>
// //           <View style={styles.gameIconContainer}>
// //             <View style={[
// //               styles.gameIconWrapper,
// //               isCompleted && { borderColor: COMPLETED_COLOR }
// //             ]}>
// //               <MaterialIcons 
// //                 name={isCompleted ? "trophy" : "confirmation-number"} 
// //                 size={32} 
// //                 color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// //               />
// //             </View>
// //             <View style={styles.gameInfo}>
// //               <Text style={styles.gameName} numberOfLines={1}>
// //                 {game.game_name}
// //               </Text>
// //               <Text style={styles.gameId}>
// //                 ID: {game.game_code}
// //               </Text>
// //               {isPlaying && renderPlayingBadge(game)}
// //             </View>
// //           </View>
          
// //           <View style={[
// //             styles.gameTypeBadge,
// //             game.ticket_type === "paid" ? styles.paidBadge : styles.freeBadge,
// //             isCompleted && { borderColor: COMPLETED_COLOR }
// //           ]}>
// //             {game.ticket_type === "paid" ? (
// //               <>
// //                 <MaterialIcons name="diamond" size={14} color={ACCENT_COLOR} />
// //                 <Text style={styles.gameTypeText}>
// //                   ₹{ticketCost}
// //                 </Text>
// //               </>
// //             ) : (
// //               <>
// //                 <Ionicons name="checkmark-circle" size={14} color={ACCENT_COLOR} />
// //                 <Text style={styles.gameTypeText}>
// //                   FREE
// //                 </Text>
// //               </>
// //             )}
// //           </View>
// //         </View>

// //         <View style={styles.gameDetails}>
// //           <View style={styles.detailRow}>
// //             <View style={styles.detailItem}>
// //               <View style={[
// //                 styles.detailIcon,
// //                 isCompleted && { borderColor: COMPLETED_COLOR }
// //               ]}>
// //                 <Ionicons 
// //                   name="calendar" 
// //                   size={14} 
// //                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// //                 />
// //               </View>
// //               <View>
// //                 <Text style={styles.detailLabel}>Date</Text>
// //                 <Text style={styles.detailText}>
// //                   {game.game_date_formatted || game.game_date}
// //                 </Text>
// //               </View>
// //             </View>
            
// //             <View style={styles.detailItem}>
// //               <View style={[
// //                 styles.detailIcon,
// //                 isCompleted && { borderColor: COMPLETED_COLOR }
// //               ]}>
// //                 <Ionicons 
// //                   name="time" 
// //                   size={14} 
// //                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// //                 />
// //               </View>
// //               <View>
// //                 <Text style={styles.detailLabel}>Time</Text>
// //                 <Text style={styles.detailText}>
// //                   {game.game_time_formatted || game.game_start_time}
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>
          
// //           <View style={styles.detailRow}>
// //             <View style={styles.detailItem}>
// //               <View style={[
// //                 styles.detailIcon,
// //                 isCompleted && { borderColor: COMPLETED_COLOR }
// //               ]}>
// //                 <Ionicons 
// //                   name="person" 
// //                   size={14} 
// //                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// //                 />
// //               </View>
// //               <View>
// //                 <Text style={styles.detailLabel}>Host</Text>
// //                 <Text style={styles.detailText}>
// //                   {game.user ? game.user.name : 'Tambola Timez'}
// //                 </Text>
// //               </View>
// //             </View>
            
// //             {game.available_tickets !== undefined && !isCompleted && (
// //               <View style={styles.detailItem}>
// //                 <View style={styles.detailIcon}>
// //                   <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Tickets</Text>
// //                   <Text style={styles.detailText}>
// //                     {game.available_tickets} Left
// //                   </Text>
// //                 </View>
// //               </View>
// //             )}
// //             {isCompleted && (
// //               <View style={styles.detailItem}>
// //                 <View style={[styles.detailIcon, { borderColor: COMPLETED_COLOR }]}>
// //                   <Ionicons name="trophy" size={14} color={COMPLETED_COLOR} />
// //                 </View>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Status</Text>
// //                   <Text style={styles.detailText}>Completed</Text>
// //                 </View>
// //               </View>
// //             )}
// //           </View>
// //         </View>

// //         <View style={[
// //           styles.prizeContainer,
// //           isCompleted && { backgroundColor: COMPLETED_LIGHT }
// //         ]}>
// //           <View style={[
// //             styles.prizeIcon,
// //             isCompleted && { borderColor: COMPLETED_COLOR }
// //           ]}>
// //             <MaterialIcons 
// //               name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
// //               size={18} 
// //               color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
// //             />
// //           </View>
// //           <View style={styles.prizeInfo}>
// //             <Text style={styles.prizeLabel}>
// //               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
// //             </Text>
// //             <Text style={styles.prizeText}>
// //               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// //             </Text>
// //             {/* {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// //               <Text style={styles.prizeSubtext}>
// //                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
// //               </Text>
// //             )} */}
// //           </View>
// //         </View>

// //         <TouchableOpacity 
// //           style={[
// //             styles.joinButton,
// //             isPlaying && styles.playingJoinButton,
// //             isCompleted && styles.completedJoinButtonNew
// //           ]}
// //           onPress={() => navigation.navigate("GameDetails", { game })}
// //         >
// //           <View style={styles.glassEffectOverlay} />
// //           <Text style={styles.joinButtonText}>
// //             {isCompleted 
// //               ? 'VIEW RESULTS' 
// //               : isPlaying 
// //                 ? 'VIEW MY GAME' 
// //                 : isLive
// //                   ? 'JOIN GAME' 
// //                   : 'VIEW DETAILS'}
// //           </Text>
// //           <Ionicons 
// //             name={isCompleted ? "trophy" : "arrow-forward"} 
// //             size={16} 
// //             color={WHITE} 
// //           />
// //         </TouchableOpacity>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const TabButton = ({ title, count, isActive, onPress }) => (
// //     <TouchableOpacity
// //       style={[styles.tabButton, isActive && styles.tabButtonActive]}
// //       onPress={onPress}
// //     >
// //       <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
// //         {title}
// //       </Text>
// //       {count > 0 && (
// //         <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
// //           <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
// //             {count}
// //           </Text>
// //         </View>
// //       )}
// //     </TouchableOpacity>
// //   );

// //   const renderFooter = () => {
// //     if (!loadingMore) return null;
    
// //     return (
// //       <View style={styles.loadingMoreContainer}>
// //         <ActivityIndicator size="small" color={PRIMARY_COLOR} />
// //         <Text style={styles.loadingMoreText}>Loading more games...</Text>
// //       </View>
// //     );
// //   };

// //   const renderEmptyList = () => (
// //     <View style={styles.emptyState}>
// //       <View style={styles.emptyIconWrapper}>
// //         <Ionicons 
// //           name={
// //             activeTab === 'myGames' ? "game-controller-outline" : 
// //             activeTab === 'completed' ? "trophy-outline" : 
// //             "search-outline"
// //           } 
// //           size={50} 
// //           color={PRIMARY_COLOR} 
// //         />
// //       </View>
// //       <Text style={styles.emptyTitle}>
// //         {activeTab === 'myGames' 
// //           ? 'No Games Found' 
// //           : activeTab === 'completed'
// //           ? 'No Completed Games'
// //           : 'No Games Available'}
// //       </Text>
// //       <Text style={styles.emptySubtitle}>
// //         {searchQuery 
// //           ? `No games found for "${searchQuery}"`
// //           : activeTab === 'myGames'
// //           ? "You haven't joined any games yet. Browse all games to get started!"
// //           : activeTab === 'completed'
// //           ? "No completed games available yet. Check back later!"
// //           : "Check back later for new exciting games!"}
// //       </Text>
// //       {searchQuery && (
// //         <TouchableOpacity 
// //           style={styles.clearFiltersButton}
// //           onPress={() => setSearchQuery('')}
// //         >
// //           <View style={styles.glassEffectOverlay} />
// //           <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
// //         </TouchableOpacity>
// //       )}
// //       {activeTab === 'myGames' && !searchQuery && (
// //         <TouchableOpacity 
// //           style={styles.browseGamesButton}
// //           onPress={() => setActiveTab('allGames')}
// //         >
// //           <View style={styles.glassEffectOverlay} />
// //           <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
// //         </TouchableOpacity>
// //       )}
// //     </View>
// //   );

// //   const renderHeader = () => (
// //     <View style={styles.section}>
// //       <View style={styles.sectionHeader}>
// //         <Text style={styles.sectionTitle}>
// //           {activeTab === 'myGames' ? 'My Games' : 
// //            activeTab === 'completed' ? 'Completed Games' : 
// //            'All Games'}
// //         </Text>
// //         <Text style={styles.gameCount}>
// //           {getFilteredGames().length} Game{getFilteredGames().length !== 1 ? 's' : ''}
// //         </Text>
// //       </View>
// //     </View>
// //   );

// //   if (loading && games.length === 0) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <View style={styles.loadingContainer}>
// //           <View style={styles.backgroundPattern}>
// //             <Animated.View 
// //               style={[
// //                 styles.pokerChip1, 
// //                 { transform: [{ translateY: translateY1 }] }
// //               ]} 
// //             />
// //             <Animated.View 
// //               style={[
// //                 styles.pokerChip2, 
// //                 { transform: [{ translateY: translateY2 }] }
// //               ]} 
// //             />
// //           </View>
          
// //           <View style={styles.loadingAnimation}>
// //             <View style={styles.loadingIconWrapper}>
// //               <Ionicons name="game-controller" size={40} color={PRIMARY_COLOR} />
// //             </View>
// //             <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
// //           </View>
// //           <Text style={styles.loadingText}>Loading games...</Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
// //   const completedGamesCount = games.filter(game => game.status === 'completed').length;
// //   const allGamesCount = games.length;

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
// //         <View style={styles.backgroundPattern}>
// //           <Animated.View 
// //             style={[
// //               styles.pokerChip1, 
// //               { transform: [{ translateY: translateY1 }] }
// //             ]} 
// //           />
// //           <Animated.View 
// //             style={[
// //               styles.pokerChip2, 
// //               { transform: [{ translateY: translateY2 }] }
// //             ]} 
// //           />
// //         </View>

// //         {/* Fixed Header */}
// //         <Animated.View 
// //           style={[
// //             styles.header,
// //             { transform: [{ scale: pulseAnim }] }
// //           ]}
// //         >
// //           <View style={styles.headerContent}>
// //             <View style={styles.headerTop}>
// //               <View>
// //                 <Text style={styles.appName}>Tambola Games</Text>
// //                 <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
// //               </View>
// //               {myGamesCount > 0 && (
// //                 <View style={styles.playingCountBadge}>
// //                   <Ionicons name="checkmark-circle" size={14} color={WHITE} />
// //                   <Text style={styles.playingCountText}>{myGamesCount}</Text>
// //                 </View>
// //               )}
// //             </View>

// //             <View style={styles.searchContainer}>
// //               <View style={styles.searchIcon}>
// //                 <Feather name="search" size={20} color={TEXT_LIGHT} />
// //               </View>
// //               <TextInput
// //                 style={styles.searchInput}
// //                 placeholder="Search games by name or ID..."
// //                 placeholderTextColor={TEXT_LIGHT}
// //                 value={searchQuery}
// //                 onChangeText={setSearchQuery}
// //                 returnKeyType="search"
// //                 onSubmitEditing={Keyboard.dismiss}
// //               />
// //               {searchQuery.length > 0 && (
// //                 <TouchableOpacity 
// //                   style={styles.clearButton}
// //                   onPress={() => setSearchQuery('')}
// //                 >
// //                   <Ionicons name="close-circle" size={20} color={TEXT_LIGHT} />
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           </View>
// //         </Animated.View>

// //         {/* Fixed Tabs */}
// //         <View style={styles.tabsContainer}>
// //           <TabButton
// //             title="My Games"
// //             count={myGamesCount}
// //             isActive={activeTab === 'myGames'}
// //             onPress={() => setActiveTab('myGames')}
// //           />
// //           <TabButton
// //             title="All Games"
// //             count={allGamesCount}
// //             isActive={activeTab === 'allGames'}
// //             onPress={() => setActiveTab('allGames')}
// //           />
// //           <TabButton
// //             title="Completed"
// //             count={completedGamesCount}
// //             isActive={activeTab === 'completed'}
// //             onPress={() => setActiveTab('completed')}
// //           />
// //         </View>

// //         {/* Scrollable content */}
// //         <FlatList
// //           data={getFilteredGames()}
// //           renderItem={renderGameCard}
// //           keyExtractor={(item) => item.id.toString()}
// //           style={styles.flatList}
// //           contentContainerStyle={styles.flatListContent}
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor={PRIMARY_COLOR}
// //               colors={[PRIMARY_COLOR]}
// //             />
// //           }
// //           onEndReached={loadMoreGames}
// //           onEndReachedThreshold={0.5}
// //           ListFooterComponent={renderFooter}
// //           ListEmptyComponent={renderEmptyList}
// //           ListHeaderComponent={renderHeader}
// //         />
// //       </Animated.View>
// //     </SafeAreaView>
// //   );
// // };

// // export default Game;

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   flatList: {
// //     flex: 1,
// //   },
// //   flatListContent: {
// //     paddingBottom: 20,
// //   },
// //   loadingMoreContainer: {
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     flexDirection: 'row',
// //     gap: 10,
// //   },
// //   loadingMoreText: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     marginLeft: 10,
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
// //     top: 80,
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
// //     top: 120,
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
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //     position: 'relative',
// //   },
// //   loadingAnimation: {
// //     position: 'relative',
// //     marginBottom: 20,
// //   },
// //   loadingIconWrapper: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: 'rgba(79, 172, 254, 0.2)',
// //   },
// //   loadingSpinner: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 10,
// //   },
// //   loadingText: {
// //     fontSize: 16,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   header: {
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingTop: 20,
// //     paddingBottom: 15,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   headerContent: {
// //     paddingHorizontal: 20,
// //   },
// //   headerTop: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 15,
// //   },
// //   appName: {
// //     fontSize: 24,
// //     fontWeight: "700",
// //     color: WHITE,
// //     letterSpacing: -0.5,
// //   },
// //   appTagline: {
// //     fontSize: 13,
// //     color: 'rgba(255,255,255,0.8)',
// //     marginTop: 2,
// //     fontWeight: "500",
// //   },
// //   playingCountBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: ACCENT_COLOR,
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     gap: 4,
// //   },
// //   playingCountText: {
// //     color: WHITE,
// //     fontSize: 12,
// //     fontWeight: '700',
// //   },
// //   searchContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: WHITE,
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: TEXT_DARK,
// //     paddingVertical: 4,
// //   },
// //   clearButton: {
// //     padding: 4,
// //   },
// //   tabsContainer: {
// //     flexDirection: 'row',
// //     backgroundColor: WHITE,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //     marginRight: 10,
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   tabButtonActive: {
// //     backgroundColor: PRIMARY_COLOR,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   tabButtonText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: TEXT_LIGHT,
// //   },
// //   tabButtonTextActive: {
// //     color: WHITE,
// //   },
// //   tabCount: {
// //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// //     borderRadius: 10,
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     marginLeft: 6,
// //   },
// //   tabCountActive: {
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //   },
// //   tabCountText: {
// //     color: PRIMARY_COLOR,
// //     fontSize: 10,
// //     fontWeight: '700',
// //   },
// //   tabCountTextActive: {
// //     color: WHITE,
// //   },
// //   section: {
// //     paddingHorizontal: 20,
// //     paddingTop: 15,
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 15,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   gameCount: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   gameCard: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 16,
// //     marginHorizontal: 20,
// //     marginBottom: 12,
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
// //   playingGameCard: {
// //     borderColor: PRIMARY_COLOR,
// //     borderWidth: 2,
// //   },
// //   completedGameCard: {
// //     borderColor: COMPLETED_COLOR,
// //     borderWidth: 1,
// //     backgroundColor: COMPLETED_LIGHT,
// //   },
// //   playingCardOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     zIndex: 2,
// //   },
// //   playingCardLabel: {
// //     backgroundColor: PRIMARY_COLOR,
// //     borderBottomLeftRadius: 12,
// //     borderTopRightRadius: 14,
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //   },
// //   playingCardLabelText: {
// //     color: WHITE,
// //     fontSize: 10,
// //     fontWeight: "700",
// //   },
// //   statusBadge: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderBottomRightRadius: 12,
// //     borderTopLeftRadius: 14,
// //     gap: 4,
// //     zIndex: 2,
// //   },
// //   liveBadge: {
// //     backgroundColor: '#4CAF50',
// //   },
// //   scheduledBadge: {
// //     backgroundColor: ACCENT_COLOR,
// //   },
// //   completedBadgeNew: {
// //     backgroundColor: COMPLETED_COLOR,
// //   },
// //   defaultBadge: {
// //     backgroundColor: ACCENT_COLOR,
// //   },
// //   statusText: {
// //     color: WHITE,
// //     fontSize: 10,
// //     fontWeight: '700',
// //   },
// //   gameCardPattern: {
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
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "flex-start",
// //     marginTop: 8,
// //     marginBottom: 16,
// //   },
// //   gameIconContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     flex: 1,
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
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   gameInfo: {
// //     flex: 1,
// //   },
// //   gameName: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 2,
// //   },
// //   gameId: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   playingBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// //     paddingHorizontal: 8,
// //     paddingVertical: 3,
// //     borderRadius: 6,
// //     alignSelf: 'flex-start',
// //     marginTop: 4,
// //     gap: 4,
// //     borderWidth: 1,
// //     borderColor: 'rgba(79, 172, 254, 0.2)',
// //   },
// //   playingBadgeIcon: {
// //     width: 16,
// //     height: 16,
// //     borderRadius: 8,
// //     backgroundColor: PRIMARY_COLOR,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   playingBadgeText: {
// //     fontSize: 10,
// //     color: PRIMARY_COLOR,
// //     fontWeight: "600",
// //   },
// //   gameTypeBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 10,
// //     gap: 4,
// //     marginLeft: 8,
// //     borderWidth: 1,
// //   },
// //   paidBadge: {
// //     backgroundColor: "rgba(255, 152, 0, 0.1)",
// //     borderColor: ACCENT_COLOR,
// //   },
// //   freeBadge: {
// //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// //     borderColor: "#4CAF50",
// //   },
// //   gameTypeText: {
// //     fontSize: 11,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   gameDetails: {
// //     marginBottom: 16,
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
// //   prizeContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     gap: 10,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 1,
// //   },
// //   prizeIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   prizeInfo: {
// //     flex: 1,
// //   },
// //   prizeLabel: {
// //     fontSize: 11,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //   },
// //   prizeText: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   joinButton: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     gap: 6,
// //     backgroundColor: PRIMARY_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //     overflow: 'hidden',
// //     position: 'relative',
// //   },
// //   glassEffectOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// //     borderRadius: 10,
// //   },
// //   playingJoinButton: {
// //     backgroundColor: PRIMARY_COLOR,
// //   },
// //   completedJoinButtonNew: {
// //     backgroundColor: COMPLETED_COLOR,
// //   },
// //   joinButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   prizeSubtext: {
// //   fontSize: 11,
// //   color: TEXT_LIGHT,
// //   fontWeight: "500",
// //   marginTop: 2,
// // },
// //   emptyState: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 32,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     overflow: 'hidden',
// //     marginTop: 20,
// //     marginHorizontal: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   emptyIconWrapper: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     borderWidth: 2,
// //     borderColor: 'rgba(79, 172, 254, 0.2)',
// //   },
// //   emptyTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   emptySubtitle: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     textAlign: "center",
// //     lineHeight: 20,
// //     marginBottom: 20,
// //   },
// //   clearFiltersButton: {
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     marginBottom: 10,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //     overflow: 'hidden',
// //     position: 'relative',
// //   },
// //   clearFiltersButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   browseGamesButton: {
// //     backgroundColor: WHITE,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: PRIMARY_COLOR,
// //     overflow: 'hidden',
// //     position: 'relative',
// //   },
// //   browseGamesButtonText: {
// //     color: PRIMARY_COLOR,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// // });







// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   StyleSheet,
// //   RefreshControl,
// //   Dimensions,
// //   TextInput,
// //   Keyboard,
// //   Animated,
// //   Easing,
// //   FlatList,
// //   SafeAreaView,
// //   Alert,
// //   Platform,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import Feather from "react-native-vector-icons/Feather";
// // import LinearGradient from 'react-native-linear-gradient';

// // const { width } = Dimensions.get('window');

// // // Enhanced color scheme with gradients (matching Home component)
// // const COLORS = {
// //   primary: "#4facfe", // Main blue color
// //   primaryLight: "#9fcdff",
// //   primaryGradient: ['#359df9', '#64d8f8'],
// //   secondary: "#FDB800", // Orange accent
// //   secondaryGradient: ['#FDB800', '#FF8C00'],
// //   background: "#f5f8ff", // Light background
// //   surface: "#FFFFFF",
// //   textDark: "#333333",
// //   textLight: "#777777",
// //   border: "#EEEEEE",
  
// //   // Status colors with gradients
// //   live: "#4CAF50",
// //   liveGradient: ['#4CAF50', '#45a049'],
// //   scheduled: "#ff9800",
// //   scheduledGradient: ['#ff9800', '#f57c00'],
// //   completed: "#ff9800",
// //   completedGradient: ['#ff9800', '#f57c00'],
  
// //   // Quick action colors
// //   deposit: "#4facfe",
// //   withdraw: "#FF6B6B",
// //   refer: "#4ECDC4",
// //   support: "#9B59B6",
  
// //   // Pattern card colors - enhanced gradients
// //   patternGradients: [
// //     ['#0282E9', '#0056b3'], // Blue
// //     ['#F59E0B', '#d97706'], // Orange
// //     ['#10B981', '#059669'], // Green
// //     ['#EF4444', '#dc2626'], // Red
// //     ['#8B5CF6', '#6d28d9'], // Purple
// //     ['#EC4899', '#db2777'], // Pink
// //     ['#06B6D4', '#0891b2'], // Cyan
// //     ['#F97316', '#ea580c'], // Orange
// //   ],
  
// //   // Additional gradients - FIXED: These are now arrays, not strings
// //   prizeGradient: ['#4facfe20', '#00c6fb20'],
// //   winnerGradient: ['#4facfe10', '#9fcdff10'],
// //   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
// //   darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
// // };

// // const Game = ({ navigation }) => {
// //   const [games, setGames] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [userGameData, setUserGameData] = useState({
// //     myTickets: [],
// //     myRequests: []
// //   });
// //   const [activeTab, setActiveTab] = useState('myGames');
  
// //   // Pagination states
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [lastPage, setLastPage] = useState(1);
// //   const [loadingMore, setLoadingMore] = useState(false);
// //   const [hasMore, setHasMore] = useState(true);
  
// //   // Animation values
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
  
// //   // Button animation refs
// //   const buttonScaleAnims = useRef([]);
// //   const letterAnims = useRef([]);

// //   useEffect(() => {
// //     fetchAllData();
// //     startAnimations();
    
// //     // Start fade animation
// //     Animated.timing(fadeAnim, {
// //       toValue: 1,
// //       duration: 800,
// //       useNativeDriver: true,
// //     }).start();
// //   }, []);

// //   // Initialize button animations when games load
// //   useEffect(() => {
// //     if (games.length > 0) {
// //       buttonScaleAnims.current = games.map(() => new Animated.Value(1));
      
// //       buttonScaleAnims.current.forEach((anim) => {
// //         startPulseAnimation(anim);
// //       });
// //     }
// //   }, [games.length]);

// //   // Initialize letter animations for header
// // useEffect(() => {
// //   // Create new animations array
// //   const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
// //   letterAnims.current = newLetterAnims;
  
// //   // Stop any existing animations
// //   letterAnims.current.forEach(anim => {
// //     anim.stopAnimation();
// //     anim.setValue(1);
// //   });
  
// //   let currentIndex = 0;
// //   let isAnimating = true;
  
// //   const animateNextLetter = () => {
// //     if (!isAnimating) return;
    
// //     // Reset all letters to normal size
// //     letterAnims.current.forEach(anim => {
// //       anim.setValue(1);
// //     });
    
// //     // Animate current letter
// //     Animated.sequence([
// //       Animated.timing(letterAnims.current[currentIndex], {
// //         toValue: 1.5,
// //         duration: 200,
// //         useNativeDriver: true,
// //         easing: Easing.bounce,
// //       }),
// //       Animated.timing(letterAnims.current[currentIndex], {
// //         toValue: 1,
// //         duration: 150,
// //         useNativeDriver: true,
// //         easing: Easing.bounce,
// //       }),
// //       Animated.delay(200), // Pause before next letter
// //     ]).start(({ finished }) => {
// //       if (finished && isAnimating) {
// //         // Move to next letter
// //         currentIndex = (currentIndex + 1) % letterAnims.current.length;
// //         animateNextLetter();
// //       }
// //     });
// //   };
  
// //   // Start the animation
// //   animateNextLetter();
  
// //   // Cleanup function
// //   return () => {
// //     isAnimating = false;
// //     if (letterAnims.current) {
// //       letterAnims.current.forEach(anim => {
// //         anim.stopAnimation();
// //       });
// //     }
// //   };
// // }, []);

// //   const startPulseAnimation = (anim, duration = 800) => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(anim, {
// //           toValue: 1.08,
// //           duration: duration,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         }),
// //         Animated.timing(anim, {
// //           toValue: 1,
// //           duration: duration,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         })
// //       ])
// //     ).start();
// //   };

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

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     setCurrentPage(1);
// //     setHasMore(true);
// //     fetchAllData(true).finally(() => setRefreshing(false));
// //   }, []);

// //   const fetchAllData = async (reset = false) => {
// //     if (reset) {
// //       setGames([]);
// //     }
// //     setLoading(true);
// //     try {
// //       await Promise.all([
// //         fetchGames(1, reset),
// //         fetchMyTickets(),
// //         fetchMyRequests()
// //       ]);
// //     } catch (error) {
// //       console.log("Error fetching data:", error);
// //       Alert.alert("Error", "Failed to load games data!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchGames = async (page = 1, reset = false) => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (res.data.success) {
// //         const gamesData = res.data.games.data || [];
// //         const paginationData = res.data.games;
        
// //         if (reset) {
// //           setGames(gamesData);
// //         } else {
// //           setGames(prev => [...prev, ...gamesData]);
// //         }
        
// //         setCurrentPage(paginationData.current_page);
// //         setLastPage(paginationData.last_page);
// //         setHasMore(paginationData.current_page < paginationData.last_page);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching games:", error);
// //       Alert.alert("Error", "Failed to load games!");
// //     }
// //   };

// //   const fetchMyTickets = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setUserGameData(prev => ({
// //           ...prev,
// //           myTickets: res.data.tickets.data || []
// //         }));
// //       }
// //     } catch (error) {
// //       console.log("Error fetching tickets:", error);
// //     }
// //   };

// //   const fetchMyRequests = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setUserGameData(prev => ({
// //           ...prev,
// //           myRequests: res.data.ticket_requests.data || []
// //         }));
// //       }
// //     } catch (error) {
// //       console.log("Error fetching requests:", error);
// //     }
// //   };

// //   const loadMoreGames = () => {
// //     if (!loadingMore && hasMore) {
// //       setLoadingMore(true);
// //       const nextPage = currentPage + 1;
// //       fetchGames(nextPage).finally(() => setLoadingMore(false));
// //     }
// //   };

// //   const isUserPlayingGame = (gameId) => {
// //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// //     const hasPendingRequests = userGameData.myRequests.some(request => 
// //       request.game_id == gameId && request.status === 'pending'
// //     );
    
// //     return hasTickets || hasPendingRequests;
// //   };

// //   const getUserTicketCount = (gameId) => {
// //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// //       request.game_id == gameId && request.status === 'pending'
// //     ).length;
    
// //     return {
// //       tickets: ticketsCount,
// //       pendingRequests: pendingRequestsCount,
// //       total: ticketsCount + pendingRequestsCount
// //     };
// //   };

// //   const getFilteredGames = () => {
// //     let filtered = games;

// //     if (searchQuery.trim()) {
// //       filtered = filtered.filter(game =>
// //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //     }

// //     if (activeTab === 'myGames') {
// //       filtered = filtered.filter(game => isUserPlayingGame(game.id));
// //     } else if (activeTab === 'completed') {
// //       filtered = filtered.filter(game => game.status === 'completed');
// //     }

// //     return filtered;
// //   };

// //   const renderPlayingBadge = (game) => {
// //     const ticketInfo = getUserTicketCount(game.id);
    
// //     if (ticketInfo.total === 0) return null;
    
// //     return (
// //       <LinearGradient
// //         colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 198, 251, 0.1)']}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.playingBadge}
// //       >
// //         <View style={styles.playingBadgeIcon}>
// //           <Ionicons name="person-circle" size={12} color={COLORS.surface} />
// //         </View>
// //         <Text style={styles.playingBadgeText}>
// //           {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// //           {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
// //           {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// //         </Text>
// //       </LinearGradient>
// //     );
// //   };

// //   const calculatePrizePool = (game) => {
// //     if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
// //       return null;
// //     }
    
// //     const total = game.pattern_rewards.reduce((sum, reward) => {
// //       const amount = parseFloat(reward.amount) || 0;
// //       const count = parseInt(reward.reward_count) || 1;
// //       return sum + (amount * count);
// //     }, 0);
    
// //     return total;
// //   };

// //   // Cartoon-style header with gradient
// //   const Header = () => {
// //    const letters = [
// //       { char: 'H', index: 0 },
// //       { char: 'O', index: 1, isSpecial: true },
// //       { char: 'U', index: 2 },
// //       { char: 'Z', index: 3 },
// //       { char: 'I', index: 4 },
// //       { char: 'E', index: 5 },
// //       { char: ' ', index: 6, isSpace: true, width: 20 },
// //       { char: 'T', index: 7 },
// //       { char: 'I', index: 8 },
// //       { char: 'M', index: 9 },
// //       { char: 'E', index: 10 },
// //       { char: 'Z', index: 11, isSpecial: true },
// //     ];

// //     return (
// //       <LinearGradient
// //         colors={COLORS.primaryGradient}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //         style={styles.header}
// //       >
// //         <View style={styles.headerContent}>
// //           <View style={styles.cartoonTitleRow}>
// //             {letters.map((item) => (
// //               <Animated.Text
// //                 key={item.index}
// //                 style={[
// //                   styles.cartoonLetter,
// //                   item.isSpecial && styles.specialCartoonLetter,
// //                   item.isSpace && { width: item.width || 20 },
// //                   { 
// //                     transform: [{ scale: letterAnims.current[item.index] || 1 }],
// //                     marginHorizontal: item.isSpace ? 0 : 2,
// //                   }
// //                 ]}
// //               >
// //                 {item.char}
// //               </Animated.Text>
// //             ))}
// //           </View>
// //           <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
// //         </View>
// //       </LinearGradient>
// //     );
// //   };

// //   const renderGameCard = ({ item: game, index }) => {
// //     const ticketCost = parseFloat(game.ticket_cost || 0);
// //     const ticketInfo = getUserTicketCount(game.id);
// //     const isPlaying = isUserPlayingGame(game.id);
// //     const isCompleted = game.status === 'completed';
// //     const isLive = game.status === 'live';
// //     const isScheduled = game.status === 'scheduled';
    
// //     const prizePool = calculatePrizePool(game);
    
// //     const buttonScale = buttonScaleAnims.current[index] || new Animated.Value(1);
    
// //     return (
// //       <TouchableOpacity
// //         key={game.id}
// //         style={styles.gameCard}
// //         activeOpacity={0.9}
// //         onPress={() => navigation.navigate("GameDetails", { game })}
// //       >
// //         {/* Background Pattern with Gradient */}
// //         <LinearGradient
// //           colors={COLORS.prizeGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.gameCardPattern}
// //         />
        
// //         {/* Status badge with gradient */}
// //         <LinearGradient
// //           colors={isLive ? COLORS.liveGradient : 
// //                   isCompleted ? COLORS.completedGradient : 
// //                   COLORS.scheduledGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 0 }}
// //           style={styles.statusBadge}
// //         >
// //           <Ionicons 
// //             name={
// //               isLive ? 'radio-button-on' : 
// //               isCompleted ? 'trophy' :
// //               'time'
// //             } 
// //             size={10} 
// //             color={COLORS.surface} 
// //           />
// //           <Text style={styles.statusText}>
// //             {isLive ? 'LIVE' : 
// //              isCompleted ? 'COMPLETED' : 
// //              'SOON'}
// //           </Text>
// //         </LinearGradient>

// //         {/* Playing indicator with gradient */}
// //         {isPlaying && (
// //           <View style={styles.playingCardOverlay}>
// //             <LinearGradient
// //               colors={COLORS.primaryGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 0 }}
// //               style={styles.playingCardLabel}
// //             >
// //               <Ionicons name="checkmark-circle" size={12} color={COLORS.surface} />
// //               <Text style={styles.playingCardLabelText}>You're Playing</Text>
// //             </LinearGradient>
// //           </View>
// //         )}

// //         <View style={styles.cardHeader}>
// //           <View style={styles.gameIconContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.gameIconWrapper}
// //             >
// //               <MaterialIcons 
// //                 name={isCompleted ? "trophy" : "confirmation-number"} 
// //                 size={32} 
// //                 color={COLORS.secondary} 
// //               />
// //             </LinearGradient>
// //             <View style={styles.gameInfo}>
// //               <Text style={styles.gameName} numberOfLines={1}>
// //                 {game.game_name}
// //               </Text>
// //               <Text style={styles.gameId}>
// //                 ID: {game.game_code}
// //               </Text>
// //               {isPlaying && renderPlayingBadge(game)}
// //             </View>
// //           </View>
          
// //           <LinearGradient
// //             colors={game.ticket_type === "paid" ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 0 }}
// //             style={styles.gameTypeBadge}
// //           >
// //             {game.ticket_type === "paid" ? (
// //               <>
// //                 <MaterialIcons name="diamond" size={14} color={COLORS.surface} />
// //                 <Text style={styles.gameTypeText}>
// //                   ₹{ticketCost}
// //                 </Text>
// //               </>
// //             ) : (
// //               <>
// //                 <Ionicons name="checkmark-circle" size={14} color={COLORS.surface} />
// //                 <Text style={styles.gameTypeText}>
// //                   FREE
// //                 </Text>
// //               </>
// //             )}
// //           </LinearGradient>
// //         </View>

// //         <View style={styles.gameDetails}>
// //           <View style={styles.detailRow}>
// //             <View style={styles.detailItem}>
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.detailIcon}
// //               >
// //                 <Ionicons name="calendar" size={14} color={COLORS.primary} />
// //               </LinearGradient>
// //               <View>
// //                 <Text style={styles.detailLabel}>Date</Text>
// //                 <Text style={styles.detailText}>
// //                   {game.game_date_formatted || game.game_date}
// //                 </Text>
// //               </View>
// //             </View>
            
// //             <View style={styles.detailItem}>
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.detailIcon}
// //               >
// //                 <Ionicons name="time" size={14} color={COLORS.primary} />
// //               </LinearGradient>
// //               <View>
// //                 <Text style={styles.detailLabel}>Time</Text>
// //                 <Text style={styles.detailText}>
// //                   {game.game_time_formatted || game.game_start_time}
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>
          
// //           <View style={styles.detailRow}>
// //             <View style={styles.detailItem}>
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.detailIcon}
// //               >
// //                 <Ionicons name="person" size={14} color={COLORS.primary} />
// //               </LinearGradient>
// //               <View>
// //                 <Text style={styles.detailLabel}>Host</Text>
// //                 <Text style={styles.detailText}>
// //                   {game.user ? game.user.name : 'Houzie Timez'}
// //                 </Text>
// //               </View>
// //             </View>
            
// //             {game.available_tickets !== undefined && !isCompleted && (
// //               <View style={styles.detailItem}>
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.detailIcon}
// //                 >
// //                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Tickets</Text>
// //                   <Text style={styles.detailText}>
// //                     {game.available_tickets} Left
// //                   </Text>
// //                 </View>
// //               </View>
// //             )}
// //             {isCompleted && (
// //               <View style={styles.detailItem}>
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.detailIcon}
// //                 >
// //                   <Ionicons name="trophy" size={14} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View>
// //                   <Text style={styles.detailLabel}>Status</Text>
// //                   <Text style={styles.detailText}>Completed</Text>
// //                 </View>
// //               </View>
// //             )}
// //           </View>
// //         </View>

// //         <LinearGradient
// //           colors={COLORS.prizeGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.prizeContainer}
// //         >
// //           <LinearGradient
// //             colors={COLORS.primaryGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.prizeIcon}
// //           >
// //             <MaterialIcons 
// //               name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
// //               size={18} 
// //               color={COLORS.surface} 
// //             />
// //           </LinearGradient>
// //           <View style={styles.prizeInfo}>
// //             <Text style={styles.prizeLabel}>
// //               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
// //             </Text>
// //             <Text style={styles.prizeText}>
// //               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// //             </Text>
// //             {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// //               <Text style={styles.prizeSubtext}>
// //                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
// //               </Text>
// //             )}
// //           </View>
// //         </LinearGradient>

// //         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
// //           <TouchableOpacity 
// //             style={styles.joinButton}
// //             onPress={() => navigation.navigate("GameDetails", { game })}
// //             activeOpacity={0.9}
// //           >
// //             <LinearGradient
// //               colors={isCompleted ? COLORS.completedGradient : 
// //                      isPlaying ? COLORS.primaryGradient : 
// //                      COLORS.primaryGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 0 }}
// //               style={styles.joinButtonGradient}
// //             >
// //               <LinearGradient
// //                 colors={COLORS.glassGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.glassEffectOverlay}
// //               />
// //               <Text style={styles.joinButtonText}>
// //                 {isCompleted 
// //                   ? 'VIEW RESULTS' 
// //                   : isPlaying 
// //                     ? 'VIEW MY GAME' 
// //                     : isLive
// //                       ? 'JOIN GAME' 
// //                       : 'VIEW DETAILS'}
// //               </Text>
// //               <Ionicons 
// //                 name={isCompleted ? "trophy" : "arrow-forward"} 
// //                 size={16} 
// //                 color={COLORS.surface} 
// //               />
// //             </LinearGradient>
// //           </TouchableOpacity>
// //         </Animated.View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const TabButton = ({ title, count, isActive, onPress }) => (
// //     <TouchableOpacity
// //       style={[styles.tabButton, isActive && styles.tabButtonActive]}
// //       onPress={onPress}
// //       activeOpacity={0.8}
// //     >
// //       <LinearGradient
// //         colors={isActive ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //         style={styles.tabButtonGradient}
// //       >
// //         <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
// //           {title}
// //         </Text>
// //         {count > 0 && (
// //           <LinearGradient
// //             colors={isActive ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] : COLORS.prizeGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={[styles.tabCount, isActive && styles.tabCountActive]}
// //           >
// //             <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
// //               {count}
// //             </Text>
// //           </LinearGradient>
// //         )}
// //       </LinearGradient>
// //     </TouchableOpacity>
// //   );

// //   const renderFooter = () => {
// //     if (!loadingMore) return null;
    
// //     return (
// //       <View style={styles.loadingMoreContainer}>
// //         <ActivityIndicator size="small" color={COLORS.primary} />
// //         <Text style={styles.loadingMoreText}>Loading more games...</Text>
// //       </View>
// //     );
// //   };

// //   const renderEmptyList = () => (
// //     <LinearGradient
// //       colors={COLORS.winnerGradient}  // Now this is an array, not a string
// //       start={{ x: 0, y: 0 }}
// //       end={{ x: 1, y: 1 }}
// //       style={styles.emptyState}
// //     >
// //       <LinearGradient
// //         colors={COLORS.primaryGradient}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.emptyIconWrapper}
// //       >
// //         <Ionicons 
// //           name={
// //             activeTab === 'myGames' ? "game-controller-outline" : 
// //             activeTab === 'completed' ? "trophy-outline" : 
// //             "search-outline"
// //           } 
// //           size={30} 
// //           color={COLORS.surface} 
// //         />
// //       </LinearGradient>
// //       <Text style={styles.emptyTitle}>
// //         {activeTab === 'myGames' 
// //           ? 'No Games Found' 
// //           : activeTab === 'completed'
// //           ? 'No Completed Games'
// //           : 'No Games Available'}
// //       </Text>
// //       <Text style={styles.emptySubtitle}>
// //         {searchQuery 
// //           ? `No games found for "${searchQuery}"`
// //           : activeTab === 'myGames'
// //           ? "You haven't joined any games yet. Browse all games to get started!"
// //           : activeTab === 'completed'
// //           ? "No completed games available yet. Check back later!"
// //           : "Check back later for new exciting games!"}
// //       </Text>
// //       {searchQuery && (
// //         <TouchableOpacity 
// //           style={styles.clearFiltersButton}
// //           onPress={() => setSearchQuery('')}
// //         >
// //           <LinearGradient
// //             colors={COLORS.primaryGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 0 }}
// //             style={styles.clearFiltersGradient}
// //           >
// //             <LinearGradient
// //               colors={COLORS.glassGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.glassEffectOverlay}
// //             />
// //             <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
// //           </LinearGradient>
// //         </TouchableOpacity>
// //       )}
// //       {activeTab === 'myGames' && !searchQuery && (
// //         <TouchableOpacity 
// //           style={styles.browseGamesButton}
// //           onPress={() => setActiveTab('allGames')}
// //         >
// //           <LinearGradient
// //             colors={[COLORS.surface, COLORS.surface]}  // Fixed: Now an array
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 0 }}
// //             style={styles.browseGamesGradient}
// //           >
// //             <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
// //           </LinearGradient>
// //         </TouchableOpacity>
// //       )}
// //     </LinearGradient>
// //   );

// //   const renderHeader = () => (
// //     <View style={styles.section}>
// //       <View style={styles.sectionHeader}>
// //         <View style={styles.sectionTitleContainer}>
// //           <LinearGradient
// //             colors={COLORS.primaryGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.sectionIcon}
// //           >
// //             <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
// //           </LinearGradient>
// //           <Text style={styles.sectionTitle}>
// //             {activeTab === 'myGames' ? 'MY GAMES' : 
// //              activeTab === 'completed' ? 'COMPLETED GAMES' : 
// //              'ALL GAMES'}
// //           </Text>
// //         </View>
// //         <LinearGradient
// //           colors={COLORS.prizeGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.gameCountBadge}
// //         >
// //           <Text style={styles.gameCount}>
// //             {getFilteredGames().length}
// //           </Text>
// //         </LinearGradient>
// //       </View>
// //     </View>
// //   );

// //   if (loading && games.length === 0) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <LinearGradient
// //           colors={COLORS.primaryGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.loadingContainer}
// //         >
// //           <View style={styles.backgroundPattern}>
// //             <Animated.View 
// //               style={[
// //                 styles.pokerChip1, 
// //                 { transform: [{ translateY: translateY1 }] }
// //               ]} 
// //             />
// //             <Animated.View 
// //               style={[
// //                 styles.pokerChip2, 
// //                 { transform: [{ translateY: translateY2 }] }
// //               ]} 
// //             />
// //           </View>
          
// //           <View style={styles.loadingAnimation}>
// //             <LinearGradient
// //               colors={COLORS.glassGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.loadingIconWrapper}
// //             >
// //               <Ionicons name="game-controller" size={40} color={COLORS.surface} />
// //             </LinearGradient>
// //             <ActivityIndicator size="large" color={COLORS.surface} style={styles.loadingSpinner} />
// //           </View>
// //           <Text style={styles.loadingText}>Loading games...</Text>
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
// //   const completedGamesCount = games.filter(game => game.status === 'completed').length;
// //   const allGamesCount = games.length;

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
// //         <View style={styles.backgroundPattern}>
// //           <Animated.View 
// //             style={[
// //               styles.pokerChip1, 
// //               { transform: [{ translateY: translateY1 }] }
// //             ]} 
// //           />
// //           <Animated.View 
// //             style={[
// //               styles.pokerChip2, 
// //               { transform: [{ translateY: translateY2 }] }
// //             ]} 
// //           />
// //         </View>

// //         {/* Fixed Header with gradient */}
// //         <Header />

// //         {/* Search Bar with gradient */}
// //         <LinearGradient
// //           colors={COLORS.primaryGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 0 }}
// //           style={styles.searchWrapper}
// //         >
// //           <View style={styles.searchContainer}>
// //             <Feather name="search" size={20} color={COLORS.textLight} />
// //             <TextInput
// //               style={styles.searchInput}
// //               placeholder="Search games by name or ID..."
// //               placeholderTextColor={COLORS.textLight}
// //               value={searchQuery}
// //               onChangeText={setSearchQuery}
// //               returnKeyType="search"
// //               onSubmitEditing={Keyboard.dismiss}
// //             />
// //             {searchQuery.length > 0 && (
// //               <TouchableOpacity 
// //                 style={styles.clearButton}
// //                 onPress={() => setSearchQuery('')}
// //               >
// //                 <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </LinearGradient>

// //         {/* Fixed Tabs */}
// //         <View style={styles.tabsContainer}>
// //           <TabButton
// //             title="My Games"
// //             count={myGamesCount}
// //             isActive={activeTab === 'myGames'}
// //             onPress={() => setActiveTab('myGames')}
// //           />
// //           <TabButton
// //             title="All Games"
// //             count={allGamesCount}
// //             isActive={activeTab === 'allGames'}
// //             onPress={() => setActiveTab('allGames')}
// //           />
// //           <TabButton
// //             title="Completed"
// //             count={completedGamesCount}
// //             isActive={activeTab === 'completed'}
// //             onPress={() => setActiveTab('completed')}
// //           />
// //         </View>

// //         {/* Scrollable content */}
// //         <FlatList
// //           data={getFilteredGames()}
// //           renderItem={renderGameCard}
// //           keyExtractor={(item) => item.id.toString()}
// //           style={styles.flatList}
// //           contentContainerStyle={styles.flatListContent}
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor={COLORS.primary}
// //               colors={[COLORS.primary]}
// //             />
// //           }
// //           onEndReached={loadMoreGames}
// //           onEndReachedThreshold={0.5}
// //           ListFooterComponent={renderFooter}
// //           ListEmptyComponent={renderEmptyList}
// //           ListHeaderComponent={renderHeader}
// //         />
// //       </Animated.View>
// //     </SafeAreaView>
// //   );
// // };

// // export default Game;

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   flatList: {
// //     flex: 1,
// //   },
// //   flatListContent: {
// //     paddingBottom: 20,
// //   },
// //   loadingMoreContainer: {
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     flexDirection: 'row',
// //     gap: 10,
// //   },
// //   loadingMoreText: {
// //     fontSize: 14,
// //     color: COLORS.textLight,
// //     marginLeft: 10,
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
// //     top: 80,
// //     left: width * 0.1,
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: COLORS.primary,
// //     shadowColor: COLORS.primary,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   pokerChip2: {
// //     position: 'absolute',
// //     top: 120,
// //     right: width * 0.15,
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: COLORS.secondary,
// //     shadowColor: COLORS.secondary,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //     elevation: 5,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     position: 'relative',
// //   },
// //   loadingAnimation: {
// //     position: 'relative',
// //     marginBottom: 20,
// //   },
// //   loadingIconWrapper: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: 'rgba(255,255,255,0.2)',
// //   },
// //   loadingSpinner: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 10,
// //   },
// //   loadingText: {
// //     fontSize: 16,
// //     color: COLORS.surface,
// //     fontWeight: "500",
// //   },
// //   header: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //   },
// //   headerContent: {
// //     paddingHorizontal: 4,
// //   },
// //   cartoonTitleRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
// //     marginBottom: 4,
// //   },
// //   cartoonLetter: {
// //     fontSize: 34,
// //     fontWeight: '900',
// //     color: '#FBC10B',
// //     textTransform: 'uppercase',
// //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// //     textShadowOffset: { width: 3, height: 3 },
// //     textShadowRadius: 8,
// //     includeFontPadding: false,
// //     marginHorizontal: 2,
// //     ...Platform.select({
// //       android: {
// //         elevation: 5,
// //         textShadowColor: '#FFB300',
// //         textShadowOffset: { width: 2, height: 2 },
// //         textShadowRadius: 6,
// //       },
// //     }),
// //   },
// //   specialCartoonLetter: {
// //     fontSize: 40,
// //     color: '#FFD700',
// //     textShadowColor: '#FF8C00',
// //     textShadowOffset: { width: 4, height: 4 },
// //     textShadowRadius: 10,
// //     marginHorizontal: 2,
// //   },
// //   appTagline: {
// //     fontSize: 13,
// //     color: 'rgba(255,255,255,0.9)',
// //     fontWeight: "500",
// //     marginTop: 4,
// //     marginLeft: 4,
// //   },
// //   searchWrapper: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //   },
// //   searchContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 14,
// //     paddingHorizontal: 12,
// //     paddingVertical: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: COLORS.textDark,
// //     paddingVertical: 4,
// //     marginLeft: 8,
// //   },
// //   clearButton: {
// //     padding: 4,
// //   },
// //   tabsContainer: {
// //     flexDirection: 'row',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     backgroundColor: COLORS.surface,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     marginRight: 10,
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   tabButtonGradient: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 10,
// //   },
// //   tabButtonActive: {
// //     borderColor: COLORS.primary,
// //   },
// //   tabButtonText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textLight,
// //   },
// //   tabButtonTextActive: {
// //     color: COLORS.surface,
// //   },
// //   tabCount: {
// //     borderRadius: 10,
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     marginLeft: 6,
// //   },
// //   tabCountActive: {
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //   },
// //   tabCountText: {
// //     color: COLORS.primary,
// //     fontSize: 10,
// //     fontWeight: '700',
// //   },
// //   tabCountTextActive: {
// //     color: COLORS.surface,
// //   },
// //   section: {
// //     paddingHorizontal: 16,
// //     paddingTop: 16,
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   sectionTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   sectionIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: COLORS.textDark,
// //   },
// //   gameCountBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 16,
// //   },
// //   gameCount: {
// //     fontSize: 14,
// //     color: COLORS.textDark,
// //     fontWeight: "600",
// //   },
// //   gameCard: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 16,
// //     marginHorizontal: 16,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   gameCardPattern: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     width: 50,
// //     height: 50,
// //     borderBottomLeftRadius: 16,
// //     borderTopRightRadius: 25,
// //   },
// //   statusBadge: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderBottomRightRadius: 12,
// //     borderTopLeftRadius: 14,
// //     gap: 4,
// //     zIndex: 2,
// //   },
// //   statusText: {
// //     color: COLORS.surface,
// //     fontSize: 10,
// //     fontWeight: '700',
// //   },
// //   playingCardOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     zIndex: 2,
// //   },
// //   playingCardLabel: {
// //     borderBottomLeftRadius: 12,
// //     borderTopRightRadius: 14,
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //   },
// //   playingCardLabelText: {
// //     color: COLORS.surface,
// //     fontSize: 10,
// //     fontWeight: "700",
// //   },
// //   cardHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "flex-start",
// //     marginTop: 8,
// //     marginBottom: 16,
// //   },
// //   gameIconContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     flex: 1,
// //     gap: 12,
// //   },
// //   gameIconWrapper: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 10,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: COLORS.primary,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   gameInfo: {
// //     flex: 1,
// //   },
// //   gameName: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   gameId: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     fontWeight: "500",
// //   },
// //   playingBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 8,
// //     paddingVertical: 3,
// //     borderRadius: 6,
// //     alignSelf: 'flex-start',
// //     marginTop: 4,
// //     gap: 4,
// //     borderWidth: 1,
// //     borderColor: 'rgba(79, 172, 254, 0.2)',
// //   },
// //   playingBadgeIcon: {
// //     width: 16,
// //     height: 16,
// //     borderRadius: 8,
// //     backgroundColor: COLORS.primary,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   playingBadgeText: {
// //     fontSize: 10,
// //     color: COLORS.primary,
// //     fontWeight: "600",
// //   },
// //   gameTypeBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 10,
// //     gap: 4,
// //     marginLeft: 8,
// //   },
// //   gameTypeText: {
// //     fontSize: 11,
// //     fontWeight: "700",
// //     color: COLORS.surface,
// //   },
// //   gameDetails: {
// //     marginBottom: 16,
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
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: COLORS.primary,
// //   },
// //   detailLabel: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //   },
// //   detailText: {
// //     fontSize: 12,
// //     color: COLORS.textDark,
// //     fontWeight: "600",
// //   },
// //   prizeContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     gap: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 1,
// //   },
// //   prizeIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 8,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   prizeInfo: {
// //     flex: 1,
// //   },
// //   prizeLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //   },
// //   prizeText: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: COLORS.textDark,
// //   },
// //   prizeSubtext: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     fontWeight: "500",
// //     marginTop: 2,
// //   },
// //   joinButton: {
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //   },
// //   joinButtonGradient: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     gap: 6,
// //     position: 'relative',
// //   },
// //   glassEffectOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// //   },
// //   joinButtonText: {
// //     color: COLORS.surface,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   emptyState: {
// //     borderRadius: 16,
// //     padding: 32,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     overflow: 'hidden',
// //     marginTop: 20,
// //     marginHorizontal: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   emptyIconWrapper: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   emptyTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: COLORS.textDark,
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   emptySubtitle: {
// //     fontSize: 14,
// //     color: COLORS.textLight,
// //     textAlign: "center",
// //     lineHeight: 20,
// //     marginBottom: 20,
// //   },
// //   clearFiltersButton: {
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //     marginBottom: 10,
// //   },
// //   clearFiltersGradient: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     alignItems: 'center',
// //     position: 'relative',
// //   },
// //   clearFiltersButtonText: {
// //     color: COLORS.surface,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   browseGamesButton: {
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //     borderWidth: 2,
// //     borderColor: COLORS.primary,
// //   },
// //   browseGamesGradient: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     alignItems: 'center',
// //   },
// //   browseGamesButtonText: {
// //     color: COLORS.primary,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// // });



// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   RefreshControl,
//   Dimensions,
//   TextInput,
//   Keyboard,
//   Animated,
//   Easing,
//   FlatList,
//   SafeAreaView,
//   Alert,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";
// import LinearGradient from 'react-native-linear-gradient';

// const { width } = Dimensions.get('window');

// // Enhanced color scheme with gradients
// const COLORS = {
//   primary: "#4facfe",
//   primaryLight: "#9fcdff",
//   primaryGradient: ['#359df9', '#64d8f8'],
//   secondary: "#FDB800",
//   secondaryGradient: ['#FDB800', '#FF8C00'],
//   background: "#f5f8ff",
//   surface: "#FFFFFF",
//   textDark: "#333333",
//   textLight: "#777777",
//   border: "#EEEEEE",
  
//   // Status colors with gradients
//   live: "#4CAF50",
//   liveGradient: ['#4CAF50', '#45a049'],
//   scheduled: "#ff9800",
//   scheduledGradient: ['#ff9800', '#f57c00'],
//   completed: "#ff9800",
//   completedGradient: ['#ff9800', '#f57c00'],
  
//   // Quick action colors
//   deposit: "#4facfe",
//   withdraw: "#FF6B6B",
//   refer: "#4ECDC4",
//   support: "#9B59B6",
  
//   // Pattern card colors - enhanced gradients
//   patternGradients: [
//     ['#0282E9', '#0056b3'],
//     ['#F59E0B', '#d97706'],
//     ['#10B981', '#059669'],
//     ['#EF4444', '#dc2626'],
//     ['#8B5CF6', '#6d28d9'],
//     ['#EC4899', '#db2777'],
//     ['#06B6D4', '#0891b2'],
//     ['#F97316', '#ea580c'],
//   ],
  
//   // Additional gradients
//   prizeGradient: ['#4facfe20', '#00c6fb20'],
//   winnerGradient: ['#4facfe10', '#9fcdff10'],
//   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
//   darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
// };

// // Custom Loader Component with Animation (copied from Profile)
// const CustomLoader = () => {
//   const [currentPhrase, setCurrentPhrase] = useState(0);
//   const spinValue = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const bounceAnim = useRef(new Animated.Value(0)).current;
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const floatAnim3 = useRef(new Animated.Value(0)).current;
  
//   const phrases = [
//     "Loading Magic...",
//     "Almost There...",
//     "Getting Ready...",
//     "Just a Moment..."
//   ];

//   useEffect(() => {
//     // Rotating animation for the center element
//     Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 8000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // Pulsing animation for the outer ring
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.2,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Bouncing animation for the main container
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Floating animations for decorative elements
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim1, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim1, {
//           toValue: 0,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim2, {
//           toValue: 1,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim2, {
//           toValue: 0,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim3, {
//           toValue: 1,
//           duration: 3500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim3, {
//           toValue: 0,
//           duration: 3500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Change phrase every 3 seconds
//     const phraseInterval = setInterval(() => {
//       setCurrentPhrase((prev) => (prev + 1) % phrases.length);
//     }, 3000);

//     return () => clearInterval(phraseInterval);
//   }, []);

//   const spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   const bounce = bounceAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -15]
//   });

//   const float1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 20]
//   });

//   const float2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -20]
//   });

//   const float3 = floatAnim3.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15]
//   });

//   return (
//     <LinearGradient
//       colors={['#4facfe', '#00f2fe']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.loaderContainer}
//     >
//       {/* Decorative floating elements */}
//       <Animated.View 
//         style={[
//           styles.loaderCircle1,
//           {
//             transform: [
//               { translateY: float1 },
//               { translateX: float2 }
//             ]
//           }
//         ]} 
//       />
//       <Animated.View 
//         style={[
//           styles.loaderCircle2,
//           {
//             transform: [
//               { translateY: float2 },
//               { translateX: float3 }
//             ]
//           }
//         ]} 
//       />
//       <Animated.View 
//         style={[
//           styles.loaderCircle3,
//           {
//             transform: [
//               { translateY: float3 },
//               { translateX: float1 }
//             ]
//           }
//         ]} 
//       />

//       <Animated.View 
//         style={[
//           styles.loaderContent,
//           {
//             transform: [{ translateY: bounce }]
//           }
//         ]}
//       >
//         {/* Animated Rings */}
//         <View style={styles.loaderRingsContainer}>
//           <Animated.View 
//             style={[
//               styles.loaderRing,
//               {
//                 transform: [{ scale: pulseAnim }]
//               }
//             ]} 
//           />
//           <Animated.View 
//             style={[
//               styles.loaderRing2,
//               {
//                 transform: [{ rotate: spin }]
//               }
//             ]} 
//           />
          
//           {/* Center Logo */}
//           <LinearGradient
//             colors={['#FDB800', '#FF8C00']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.loaderCenter}
//           >
//             <Text style={styles.loaderCenterText}>HZ</Text>
//           </LinearGradient>
//         </View>

//         {/* Animated Text */}
//         <View style={styles.loaderTextContainer}>
//           <Text style={styles.loaderTitle}>Houzie Timez</Text>
//           <View style={styles.loaderPhraseContainer}>
//             <Text style={styles.loaderPhrase}>{phrases[currentPhrase]}</Text>
//             <View style={styles.loaderDots}>
//               <Animated.View style={[styles.loaderDot, { opacity: floatAnim1 }]} />
//               <Animated.View style={[styles.loaderDot, { opacity: floatAnim2 }]} />
//               <Animated.View style={[styles.loaderDot, { opacity: floatAnim3 }]} />
//             </View>
//           </View>
//         </View>

//         {/* Progress Bar */}
//         <View style={styles.loaderProgressContainer}>
//           <LinearGradient
//             colors={['#FDB800', '#FF8C00']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.loaderProgressBar}
//           >
//             <Animated.View 
//               style={[
//                 styles.loaderProgressGlow,
//                 {
//                   transform: [
//                     { translateX: spinValue.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [-100, 200]
//                     }) }
//                   ]
//                 }
//               ]} 
//             />
//           </LinearGradient>
//         </View>

//         {/* Decorative SVG-like elements */}
//         <View style={styles.loaderDecorations}>
//           <Animated.View style={[styles.loaderStar, { transform: [{ scale: pulseAnim }] }]}>
//             <Text style={styles.loaderStarText}>✦</Text>
//           </Animated.View>
//           <Animated.View style={[styles.loaderStar2, { transform: [{ rotate: spin }] }]}>
//             <Text style={styles.loaderStarText}>✧</Text>
//           </Animated.View>
//           <Animated.View style={[styles.loaderStar3, { transform: [{ scale: floatAnim2 }] }]}>
//             <Text style={styles.loaderStarText}>✪</Text>
//           </Animated.View>
//         </View>
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const Game = ({ navigation }) => {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userGameData, setUserGameData] = useState({
//     myTickets: [],
//     myRequests: []
//   });
//   const [activeTab, setActiveTab] = useState('myGames');
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
  
//   // Animation values
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
  
//   // Button animation refs
//   const buttonScaleAnims = useRef([]);
//   const letterAnims = useRef([]);

//   useEffect(() => {
//     fetchAllData();
//     startAnimations();
    
//     // Start fade animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   // Initialize button animations when games load
//   useEffect(() => {
//     if (games.length > 0) {
//       buttonScaleAnims.current = games.map(() => new Animated.Value(1));
      
//       buttonScaleAnims.current.forEach((anim) => {
//         startPulseAnimation(anim);
//       });
//     }
//   }, [games.length]);

//   // Initialize letter animations for header
//   useEffect(() => {
//     // Create new animations array
//     const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
//     letterAnims.current = newLetterAnims;
    
//     // Stop any existing animations
//     letterAnims.current.forEach(anim => {
//       anim.stopAnimation();
//       anim.setValue(1);
//     });
    
//     let currentIndex = 0;
//     let isAnimating = true;
    
//     const animateNextLetter = () => {
//       if (!isAnimating) return;
      
//       // Reset all letters to normal size
//       letterAnims.current.forEach(anim => {
//         anim.setValue(1);
//       });
      
//       // Animate current letter
//       Animated.sequence([
//         Animated.timing(letterAnims.current[currentIndex], {
//           toValue: 1.5,
//           duration: 200,
//           useNativeDriver: true,
//           easing: Easing.bounce,
//         }),
//         Animated.timing(letterAnims.current[currentIndex], {
//           toValue: 1,
//           duration: 150,
//           useNativeDriver: true,
//           easing: Easing.bounce,
//         }),
//         Animated.delay(200), // Pause before next letter
//       ]).start(({ finished }) => {
//         if (finished && isAnimating) {
//           // Move to next letter
//           currentIndex = (currentIndex + 1) % letterAnims.current.length;
//           animateNextLetter();
//         }
//       });
//     };
    
//     // Start the animation
//     animateNextLetter();
    
//     // Cleanup function
//     return () => {
//       isAnimating = false;
//       if (letterAnims.current) {
//         letterAnims.current.forEach(anim => {
//           anim.stopAnimation();
//         });
//       }
//     };
//   }, []);

//   const startPulseAnimation = (anim, duration = 800) => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(anim, {
//           toValue: 1.08,
//           duration: duration,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease)
//         }),
//         Animated.timing(anim, {
//           toValue: 1,
//           duration: duration,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease)
//         })
//       ])
//     ).start();
//   };

//   const startAnimations = () => {
//     // First floating animation
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

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     setHasMore(true);
//     fetchAllData(true).finally(() => setRefreshing(false));
//   }, []);

//   const fetchAllData = async (reset = false) => {
//     if (reset) {
//       setGames([]);
//     }
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchGames(1, reset),
//         fetchMyTickets(),
//         fetchMyRequests()
//       ]);
//     } catch (error) {
//       console.log("Error fetching data:", error);
//       Alert.alert("Error", "Failed to load games data!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchGames = async (page = 1, reset = false) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data.success) {
//         const gamesData = res.data.games.data || [];
//         const paginationData = res.data.games;
        
//         if (reset) {
//           setGames(gamesData);
//         } else {
//           setGames(prev => [...prev, ...gamesData]);
//         }
        
//         setCurrentPage(paginationData.current_page);
//         setLastPage(paginationData.last_page);
//         setHasMore(paginationData.current_page < paginationData.last_page);
//       }
//     } catch (error) {
//       console.log("Error fetching games:", error);
//       Alert.alert("Error", "Failed to load games!");
//     }
//   };

//   const fetchMyTickets = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         setUserGameData(prev => ({
//           ...prev,
//           myTickets: res.data.tickets.data || []
//         }));
//       }
//     } catch (error) {
//       console.log("Error fetching tickets:", error);
//     }
//   };

//   const fetchMyRequests = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         setUserGameData(prev => ({
//           ...prev,
//           myRequests: res.data.ticket_requests.data || []
//         }));
//       }
//     } catch (error) {
//       console.log("Error fetching requests:", error);
//     }
//   };

//   const loadMoreGames = () => {
//     if (!loadingMore && hasMore) {
//       setLoadingMore(true);
//       const nextPage = currentPage + 1;
//       fetchGames(nextPage).finally(() => setLoadingMore(false));
//     }
//   };

//   const isUserPlayingGame = (gameId) => {
//     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
//     const hasPendingRequests = userGameData.myRequests.some(request => 
//       request.game_id == gameId && request.status === 'pending'
//     );
    
//     return hasTickets || hasPendingRequests;
//   };

//   const getUserTicketCount = (gameId) => {
//     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
//     const pendingRequestsCount = userGameData.myRequests.filter(request => 
//       request.game_id == gameId && request.status === 'pending'
//     ).length;
    
//     return {
//       tickets: ticketsCount,
//       pendingRequests: pendingRequestsCount,
//       total: ticketsCount + pendingRequestsCount
//     };
//   };

//   const getFilteredGames = () => {
//     let filtered = games;

//     if (searchQuery.trim()) {
//       filtered = filtered.filter(game =>
//         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (activeTab === 'myGames') {
//       filtered = filtered.filter(game => isUserPlayingGame(game.id));
//     } else if (activeTab === 'completed') {
//       filtered = filtered.filter(game => game.status === 'completed');
//     }

//     return filtered;
//   };

//   const renderPlayingBadge = (game) => {
//     const ticketInfo = getUserTicketCount(game.id);
    
//     if (ticketInfo.total === 0) return null;
    
//     return (
//       <LinearGradient
//         colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 198, 251, 0.1)']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.playingBadge}
//       >
//         <View style={styles.playingBadgeIcon}>
//           <Ionicons name="person-circle" size={12} color={COLORS.surface} />
//         </View>
//         <Text style={styles.playingBadgeText}>
//           {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
//           {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
//           {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
//         </Text>
//       </LinearGradient>
//     );
//   };

//   const calculatePrizePool = (game) => {
//     if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
//       return null;
//     }
    
//     const total = game.pattern_rewards.reduce((sum, reward) => {
//       const amount = parseFloat(reward.amount) || 0;
//       const count = parseInt(reward.reward_count) || 1;
//       return sum + (amount * count);
//     }, 0);
    
//     return total;
//   };

//   // Cartoon-style header with gradient
//   const Header = () => {
//     const letters = [
//       { char: 'H', index: 0 },
//       { char: 'O', index: 1, isSpecial: true },
//       { char: 'U', index: 2 },
//       { char: 'Z', index: 3 },
//       { char: 'I', index: 4 },
//       { char: 'E', index: 5 },
//       { char: ' ', index: 6, isSpace: true, width: 20 },
//       { char: 'T', index: 7 },
//       { char: 'I', index: 8 },
//       { char: 'M', index: 9 },
//       { char: 'E', index: 10 },
//       { char: 'Z', index: 11, isSpecial: true },
//     ];

//     return (
//       <LinearGradient
//         colors={COLORS.primaryGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}
//       >
//         <View style={styles.headerContent}>
//           <View style={styles.cartoonTitleRow}>
//             {letters.map((item) => (
//               <Animated.Text
//                 key={item.index}
//                 style={[
//                   styles.cartoonLetter,
//                   item.isSpecial && styles.specialCartoonLetter,
//                   item.isSpace && { width: item.width || 20 },
//                   { 
//                     transform: [{ scale: letterAnims.current[item.index] || 1 }],
//                     marginHorizontal: item.isSpace ? 0 : 2,
//                   }
//                 ]}
//               >
//                 {item.char}
//               </Animated.Text>
//             ))}
//           </View>
//           <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
//         </View>
//       </LinearGradient>
//     );
//   };

//   const renderGameCard = ({ item: game, index }) => {
//     const ticketCost = parseFloat(game.ticket_cost || 0);
//     const ticketInfo = getUserTicketCount(game.id);
//     const isPlaying = isUserPlayingGame(game.id);
//     const isCompleted = game.status === 'completed';
//     const isLive = game.status === 'live';
//     const isScheduled = game.status === 'scheduled';
    
//     const prizePool = calculatePrizePool(game);
    
//     const buttonScale = buttonScaleAnims.current[index] || new Animated.Value(1);
    
//     return (
//       <TouchableOpacity
//         key={game.id}
//         style={styles.gameCard}
//         activeOpacity={0.9}
//         onPress={() => navigation.navigate("GameDetails", { game })}
//       >
//         {/* Background Pattern with Gradient */}
//         <LinearGradient
//           colors={COLORS.prizeGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gameCardPattern}
//         />
        
//         {/* Status badge with gradient */}
//         <LinearGradient
//           colors={isLive ? COLORS.liveGradient : 
//                   isCompleted ? COLORS.completedGradient : 
//                   COLORS.scheduledGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.statusBadge}
//         >
//           <Ionicons 
//             name={
//               isLive ? 'radio-button-on' : 
//               isCompleted ? 'trophy' :
//               'time'
//             } 
//             size={10} 
//             color={COLORS.surface} 
//           />
//           <Text style={styles.statusText}>
//             {isLive ? 'LIVE' : 
//              isCompleted ? 'COMPLETED' : 
//              'SOON'}
//           </Text>
//         </LinearGradient>

//         {/* Playing indicator with gradient */}
//         {isPlaying && (
//           <View style={styles.playingCardOverlay}>
//             <LinearGradient
//               colors={COLORS.primaryGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.playingCardLabel}
//             >
//               <Ionicons name="checkmark-circle" size={12} color={COLORS.surface} />
//               <Text style={styles.playingCardLabelText}>You're Playing</Text>
//             </LinearGradient>
//           </View>
//         )}

//         <View style={styles.cardHeader}>
//           <View style={styles.gameIconContainer}>
//             <LinearGradient
//               colors={COLORS.prizeGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gameIconWrapper}
//             >
//               <MaterialIcons 
//                 name={isCompleted ? "trophy" : "confirmation-number"} 
//                 size={32} 
//                 color={COLORS.secondary} 
//               />
//             </LinearGradient>
//             <View style={styles.gameInfo}>
//               <Text style={styles.gameName} numberOfLines={1}>
//                 {game.game_name}
//               </Text>
//               <Text style={styles.gameId}>
//                 ID: {game.game_code}
//               </Text>
//               {isPlaying && renderPlayingBadge(game)}
//             </View>
//           </View>
          
//           <LinearGradient
//             colors={game.ticket_type === "paid" ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.gameTypeBadge}
//           >
//             {game.ticket_type === "paid" ? (
//               <>
//                 <MaterialIcons name="diamond" size={14} color={COLORS.surface} />
//                 <Text style={styles.gameTypeText}>
//                   ₹{ticketCost}
//                 </Text>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="checkmark-circle" size={14} color={COLORS.surface} />
//                 <Text style={styles.gameTypeText}>
//                   FREE
//                 </Text>
//               </>
//             )}
//           </LinearGradient>
//         </View>

//         <View style={styles.gameDetails}>
//           <View style={styles.detailRow}>
//             <View style={styles.detailItem}>
//               <LinearGradient
//                 colors={COLORS.prizeGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.detailIcon}
//               >
//                 <Ionicons name="calendar" size={14} color={COLORS.primary} />
//               </LinearGradient>
//               <View>
//                 <Text style={styles.detailLabel}>Date</Text>
//                 <Text style={styles.detailText}>
//                   {game.game_date_formatted || game.game_date}
//                 </Text>
//               </View>
//             </View>
            
//             <View style={styles.detailItem}>
//               <LinearGradient
//                 colors={COLORS.prizeGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.detailIcon}
//               >
//                 <Ionicons name="time" size={14} color={COLORS.primary} />
//               </LinearGradient>
//               <View>
//                 <Text style={styles.detailLabel}>Time</Text>
//                 <Text style={styles.detailText}>
//                   {game.game_time_formatted || game.game_start_time}
//                 </Text>
//               </View>
//             </View>
//           </View>
          
//           <View style={styles.detailRow}>
//             <View style={styles.detailItem}>
//               <LinearGradient
//                 colors={COLORS.prizeGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.detailIcon}
//               >
//                 <Ionicons name="person" size={14} color={COLORS.primary} />
//               </LinearGradient>
//               <View>
//                 <Text style={styles.detailLabel}>Host</Text>
//                 <Text style={styles.detailText}>
//                   {game.user ? game.user.name : 'Houzie Timez'}
//                 </Text>
//               </View>
//             </View>
            
//             {game.available_tickets !== undefined && !isCompleted && (
//               <View style={styles.detailItem}>
//                 <LinearGradient
//                   colors={COLORS.prizeGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.detailIcon}
//                 >
//                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
//                 </LinearGradient>
//                 <View>
//                   <Text style={styles.detailLabel}>Tickets</Text>
//                   <Text style={styles.detailText}>
//                     {game.available_tickets} Left
//                   </Text>
//                 </View>
//               </View>
//             )}
//             {isCompleted && (
//               <View style={styles.detailItem}>
//                 <LinearGradient
//                   colors={COLORS.prizeGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.detailIcon}
//                 >
//                   <Ionicons name="trophy" size={14} color={COLORS.primary} />
//                 </LinearGradient>
//                 <View>
//                   <Text style={styles.detailLabel}>Status</Text>
//                   <Text style={styles.detailText}>Completed</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>

//         <LinearGradient
//           colors={COLORS.prizeGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.prizeContainer}
//         >
//           <LinearGradient
//             colors={COLORS.primaryGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.prizeIcon}
//           >
//             <MaterialIcons 
//               name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
//               size={18} 
//               color={COLORS.surface} 
//             />
//           </LinearGradient>
//           <View style={styles.prizeInfo}>
//             <Text style={styles.prizeLabel}>
//               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
//             </Text>
//             <Text style={styles.prizeText}>
//               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
//             </Text>
//             {game.pattern_rewards && game.pattern_rewards.length > 0 && (
//               <Text style={styles.prizeSubtext}>
//                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
//               </Text>
//             )}
//           </View>
//         </LinearGradient>

//         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//           <TouchableOpacity 
//             style={styles.joinButton}
//             onPress={() => navigation.navigate("GameDetails", { game })}
//             activeOpacity={0.9}
//           >
//             <LinearGradient
//               colors={isCompleted ? COLORS.completedGradient : 
//                      isPlaying ? COLORS.primaryGradient : 
//                      COLORS.primaryGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.joinButtonGradient}
//             >
//               <LinearGradient
//                 colors={COLORS.glassGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.glassEffectOverlay}
//               />
//               <Text style={styles.joinButtonText}>
//                 {isCompleted 
//                   ? 'VIEW RESULTS' 
//                   : isPlaying 
//                     ? 'VIEW MY GAME' 
//                     : isLive
//                       ? 'JOIN GAME' 
//                       : 'VIEW DETAILS'}
//               </Text>
//               <Ionicons 
//                 name={isCompleted ? "trophy" : "arrow-forward"} 
//                 size={16} 
//                 color={COLORS.surface} 
//               />
//             </LinearGradient>
//           </TouchableOpacity>
//         </Animated.View>
//       </TouchableOpacity>
//     );
//   };

//   const TabButton = ({ title, count, isActive, onPress }) => (
//     <TouchableOpacity
//       style={[styles.tabButton, isActive && styles.tabButtonActive]}
//       onPress={onPress}
//       activeOpacity={0.8}
//     >
//       <LinearGradient
//         colors={isActive ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.tabButtonGradient}
//       >
//         <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
//           {title}
//         </Text>
//         {count > 0 && (
//           <LinearGradient
//             colors={isActive ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] : COLORS.prizeGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={[styles.tabCount, isActive && styles.tabCountActive]}
//           >
//             <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
//               {count}
//             </Text>
//           </LinearGradient>
//         )}
//       </LinearGradient>
//     </TouchableOpacity>
//   );

//   const renderFooter = () => {
//     if (!loadingMore) return null;
    
//     return (
//       <View style={styles.loadingMoreContainer}>
//         <ActivityIndicator size="small" color={COLORS.primary} />
//         <Text style={styles.loadingMoreText}>Loading more games...</Text>
//       </View>
//     );
//   };

//   const renderEmptyList = () => (
//     <LinearGradient
//       colors={COLORS.winnerGradient}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.emptyState}
//     >
//       <LinearGradient
//         colors={COLORS.primaryGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.emptyIconWrapper}
//       >
//         <Ionicons 
//           name={
//             activeTab === 'myGames' ? "game-controller-outline" : 
//             activeTab === 'completed' ? "trophy-outline" : 
//             "search-outline"
//           } 
//           size={30} 
//           color={COLORS.surface} 
//         />
//       </LinearGradient>
//       <Text style={styles.emptyTitle}>
//         {activeTab === 'myGames' 
//           ? 'No Games Found' 
//           : activeTab === 'completed'
//           ? 'No Completed Games'
//           : 'No Games Available'}
//       </Text>
//       <Text style={styles.emptySubtitle}>
//         {searchQuery 
//           ? `No games found for "${searchQuery}"`
//           : activeTab === 'myGames'
//           ? "You haven't joined any games yet. Browse all games to get started!"
//           : activeTab === 'completed'
//           ? "No completed games available yet. Check back later!"
//           : "Check back later for new exciting games!"}
//       </Text>
//       {searchQuery && (
//         <TouchableOpacity 
//           style={styles.clearFiltersButton}
//           onPress={() => setSearchQuery('')}
//         >
//           <LinearGradient
//             colors={COLORS.primaryGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.clearFiltersGradient}
//           >
//             <LinearGradient
//               colors={COLORS.glassGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.glassEffectOverlay}
//             />
//             <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       )}
//       {activeTab === 'myGames' && !searchQuery && (
//         <TouchableOpacity 
//           style={styles.browseGamesButton}
//           onPress={() => setActiveTab('allGames')}
//         >
//           <LinearGradient
//             colors={[COLORS.surface, COLORS.surface]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.browseGamesGradient}
//           >
//             <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       )}
//     </LinearGradient>
//   );

//   const renderHeader = () => (
//     <View style={styles.section}>
//       <View style={styles.sectionHeader}>
//         <View style={styles.sectionTitleContainer}>
//           <LinearGradient
//             colors={COLORS.primaryGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.sectionIcon}
//           >
//             <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
//           </LinearGradient>
//           <Text style={styles.sectionTitle}>
//             {activeTab === 'myGames' ? 'MY GAMES' : 
//              activeTab === 'completed' ? 'COMPLETED GAMES' : 
//              'ALL GAMES'}
//           </Text>
//         </View>
//         <LinearGradient
//           colors={COLORS.prizeGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.gameCountBadge}
//         >
//           <Text style={styles.gameCount}>
//             {getFilteredGames().length}
//           </Text>
//         </LinearGradient>
//       </View>
//     </View>
//   );

//   if (loading && games.length === 0) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <CustomLoader />
//       </SafeAreaView>
//     );
//   }

//   const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
//   const completedGamesCount = games.filter(game => game.status === 'completed').length;
//   const allGamesCount = games.length;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//         <View style={styles.backgroundPattern}>
//           <Animated.View 
//             style={[
//               styles.pokerChip1, 
//               { transform: [{ translateY: translateY1 }] }
//             ]} 
//           />
//           <Animated.View 
//             style={[
//               styles.pokerChip2, 
//               { transform: [{ translateY: translateY2 }] }
//             ]} 
//           />
//         </View>

//         {/* Fixed Header with gradient */}
//         <Header />

//         {/* Search Bar with gradient */}
//         <LinearGradient
//           colors={COLORS.primaryGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.searchWrapper}
//         >
//           <View style={styles.searchContainer}>
//             <Feather name="search" size={20} color={COLORS.textLight} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search games by name or ID..."
//               placeholderTextColor={COLORS.textLight}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               returnKeyType="search"
//               onSubmitEditing={Keyboard.dismiss}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity 
//                 style={styles.clearButton}
//                 onPress={() => setSearchQuery('')}
//               >
//                 <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </LinearGradient>

//         {/* Fixed Tabs */}
//         <View style={styles.tabsContainer}>
//           <TabButton
//             title="My Games"
//             count={myGamesCount}
//             isActive={activeTab === 'myGames'}
//             onPress={() => setActiveTab('myGames')}
//           />
//           <TabButton
//             title="All Games"
//             count={allGamesCount}
//             isActive={activeTab === 'allGames'}
//             onPress={() => setActiveTab('allGames')}
//           />
//           <TabButton
//             title="Completed"
//             count={completedGamesCount}
//             isActive={activeTab === 'completed'}
//             onPress={() => setActiveTab('completed')}
//           />
//         </View>

//         {/* Scrollable content */}
//         <FlatList
//           data={getFilteredGames()}
//           renderItem={renderGameCard}
//           keyExtractor={(item) => item.id.toString()}
//           style={styles.flatList}
//           contentContainerStyle={styles.flatListContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={COLORS.primary}
//               colors={[COLORS.primary]}
//             />
//           }
//           onEndReached={loadMoreGames}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={renderFooter}
//           ListEmptyComponent={renderEmptyList}
//           ListHeaderComponent={renderHeader}
//         />
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// export default Game;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
  
//   // Loader Styles (copied from Profile)
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderContent: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: width * 0.8,
//   },
//   loaderRingsContainer: {
//     width: 120,
//     height: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   loaderRing: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   loaderRing2: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#FDB800',
//     borderTopColor: 'transparent',
//     borderRightColor: 'transparent',
//   },
//   loaderCenter: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//   },
//   loaderCenterText: {
//     fontSize: 24,
//     fontWeight: '900',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   loaderTextContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   loaderTitle: {
//     fontSize: 32,
//     fontWeight: '900',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//     marginBottom: 10,
//   },
//   loaderPhraseContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   loaderPhrase: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     opacity: 0.9,
//     marginRight: 5,
//   },
//   loaderDots: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   loaderDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 2,
//   },
//   loaderProgressContainer: {
//     width: '100%',
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 2,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   loaderProgressBar: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   loaderProgressGlow: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 50,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     transform: [{ skewX: '-20deg' }],
//   },
//   loaderDecorations: {
//     position: 'relative',
//     width: '100%',
//     height: 50,
//   },
//   loaderStar: {
//     position: 'absolute',
//     left: 20,
//     top: 0,
//   },
//   loaderStar2: {
//     position: 'absolute',
//     right: 20,
//     top: 0,
//   },
//   loaderStar3: {
//     position: 'absolute',
//     left: '50%',
//     top: 0,
//   },
//   loaderStarText: {
//     fontSize: 24,
//     color: '#FDB800',
//   },
//   loaderCircle1: {
//     position: 'absolute',
//     top: '20%',
//     left: '10%',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   loaderCircle2: {
//     position: 'absolute',
//     bottom: '20%',
//     right: '10%',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   loaderCircle3: {
//     position: 'absolute',
//     top: '30%',
//     right: '20%',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },

//   // Existing styles from your Game component
//   flatList: {
//     flex: 1,
//   },
//   flatListContent: {
//     paddingBottom: 20,
//   },
//   loadingMoreContainer: {
//     paddingVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 10,
//   },
//   loadingMoreText: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginLeft: 10,
//   },
//   backgroundPattern: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//     overflow: 'hidden',
//   },
//   pokerChip1: {
//     position: 'absolute',
//     top: 80,
//     left: width * 0.1,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLORS.primary,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
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
//     backgroundColor: COLORS.secondary,
//     shadowColor: COLORS.secondary,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//   },
//   headerContent: {
//     paddingHorizontal: 4,
//   },
//   cartoonTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: 4,
//   },
//   cartoonLetter: {
//     fontSize: 34,
//     fontWeight: '900',
//     color: '#FBC10B',
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(255, 193, 7, 0.5)',
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 8,
//     includeFontPadding: false,
//     marginHorizontal: 2,
//     ...Platform.select({
//       android: {
//         elevation: 5,
//         textShadowColor: '#FFB300',
//         textShadowOffset: { width: 2, height: 2 },
//         textShadowRadius: 6,
//       },
//     }),
//   },
//   specialCartoonLetter: {
//     fontSize: 40,
//     color: '#FFD700',
//     textShadowColor: '#FF8C00',
//     textShadowOffset: { width: 4, height: 4 },
//     textShadowRadius: 10,
//     marginHorizontal: 2,
//   },
//   appTagline: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.9)',
//     fontWeight: "500",
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   searchWrapper: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.surface,
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.textDark,
//     paddingVertical: 4,
//     marginLeft: 8,
//   },
//   clearButton: {
//     padding: 4,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.surface,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   tabButton: {
//     flex: 1,
//     marginRight: 10,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   tabButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//   },
//   tabButtonActive: {
//     borderColor: COLORS.primary,
//   },
//   tabButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textLight,
//   },
//   tabButtonTextActive: {
//     color: COLORS.surface,
//   },
//   tabCount: {
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginLeft: 6,
//   },
//   tabCountActive: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   tabCountText: {
//     color: COLORS.primary,
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   tabCountTextActive: {
//     color: COLORS.surface,
//   },
//   section: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   sectionIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.textDark,
//   },
//   gameCountBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 16,
//   },
//   gameCount: {
//     fontSize: 14,
//     color: COLORS.textDark,
//     fontWeight: "600",
//   },
//   gameCard: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     position: 'relative',
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   gameCardPattern: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 50,
//     height: 50,
//     borderBottomLeftRadius: 16,
//     borderTopRightRadius: 25,
//   },
//   statusBadge: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderBottomRightRadius: 12,
//     borderTopLeftRadius: 14,
//     gap: 4,
//     zIndex: 2,
//   },
//   statusText: {
//     color: COLORS.surface,
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   playingCardOverlay: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     zIndex: 2,
//   },
//   playingCardLabel: {
//     borderBottomLeftRadius: 12,
//     borderTopRightRadius: 14,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   playingCardLabelText: {
//     color: COLORS.surface,
//     fontSize: 10,
//     fontWeight: "700",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   gameIconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     gap: 12,
//   },
//   gameIconWrapper: {
//     width: 48,
//     height: 48,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   gameInfo: {
//     flex: 1,
//   },
//   gameName: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   gameId: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
//   playingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(79, 172, 254, 0.2)',
//   },
//   playingBadgeIcon: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playingBadgeText: {
//     fontSize: 10,
//     color: COLORS.primary,
//     fontWeight: "600",
//   },
//   gameTypeBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     gap: 4,
//     marginLeft: 8,
//   },
//   gameTypeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: COLORS.surface,
//   },
//   gameDetails: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   detailItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 8,
//     flex: 1,
//   },
//   detailIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   detailLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   detailText: {
//     fontSize: 12,
//     color: COLORS.textDark,
//     fontWeight: "600",
//   },
//   prizeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   prizeIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   prizeInfo: {
//     flex: 1,
//   },
//   prizeLabel: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   prizeText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.textDark,
//   },
//   prizeSubtext: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   joinButton: {
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   joinButtonGradient: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     gap: 6,
//     position: 'relative',
//   },
//   glassEffectOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.3)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   joinButtonText: {
//     color: COLORS.surface,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   emptyState: {
//     borderRadius: 16,
//     padding: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     overflow: 'hidden',
//     marginTop: 20,
//     marginHorizontal: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   emptyIconWrapper: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.textDark,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   clearFiltersButton: {
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   clearFiltersGradient: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   clearFiltersButtonText: {
//     color: COLORS.surface,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   browseGamesButton: {
//     borderRadius: 10,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//   },
//   browseGamesGradient: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   browseGamesButtonText: {
//     color: COLORS.primary,
//     fontSize: 14,
//     fontWeight: "700",
//   },
// });








import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TextInput,
  Keyboard,
  Animated,
  Easing,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Enhanced color scheme with gradients
const COLORS = {
  primary: "#4facfe",
  primaryLight: "#9fcdff",
  primaryGradient: ['#359df9', '#64d8f8'],
  secondary: "#FDB800",
  secondaryGradient: ['#FDB800', '#FF8C00'],
  background: "#f5f8ff",
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  
  // Status colors with gradients
  live: "#4CAF50",
  liveGradient: ['#4CAF50', '#45a049'],
  scheduled: "#ff9800",
  scheduledGradient: ['#ff9800', '#f57c00'],
  completed: "#ff9800",
  completedGradient: ['#ff9800', '#f57c00'],
  
  // Quick action colors
  deposit: "#4facfe",
  withdraw: "#FF6B6B",
  refer: "#4ECDC4",
  support: "#9B59B6",
  
  // Pattern card colors - enhanced gradients
  patternGradients: [
    ['#0282E9', '#0056b3'],
    ['#F59E0B', '#d97706'],
    ['#10B981', '#059669'],
    ['#EF4444', '#dc2626'],
    ['#8B5CF6', '#6d28d9'],
    ['#EC4899', '#db2777'],
    ['#06B6D4', '#0891b2'],
    ['#F97316', '#ea580c'],
  ],
  
  // Additional gradients
  prizeGradient: ['#4facfe20', '#00c6fb20'],
  winnerGradient: ['#4facfe10', '#9fcdff10'],
  glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
};

// Custom Loader Component with Fixed Animations
const CustomLoader = () => {
  // Animations
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Dynamic messages
  const messages = [
    "Loading games...",
    "Fetching latest games 🎮",
    "Getting your tickets 🎟️",
    "Almost ready...",
    "Exciting games await! 🔥",
    "Setting up game lobby..."
  ];

  const [currentText, setCurrentText] = useState(0);
  const [animationLoop, setAnimationLoop] = useState(true);

  useEffect(() => {
    // Create animation loops with proper cleanup
    const animations = [];
    
    // Title bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animations.push(bounceAnimation);
    bounceAnimation.start();

    // Dots animation
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dot1Animation = animateDot(dot1, 0);
    const dot2Animation = animateDot(dot2, 150);
    const dot3Animation = animateDot(dot3, 300);
    
    animations.push(dot1Animation, dot2Animation, dot3Animation);
    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    // Floating numbers animation
    const floatAnimation = Animated.loop(
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );
    animations.push(floatAnimation);
    floatAnimation.start();

    // Ticket slide animation
    const slideAnimation = Animated.loop(
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animations.push(slideAnimation);
    slideAnimation.start();

    // Dynamic text change interval
    const textInterval = setInterval(() => {
      if (animationLoop) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentText((prev) => (prev + 1) % messages.length);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }
    }, 2500);

    // Cleanup function to stop all animations when component unmounts
    return () => {
      setAnimationLoop(false);
      clearInterval(textInterval);
      // Stop all animations
      animations.forEach(animation => {
        if (animation && typeof animation.stop === 'function') {
          animation.stop();
        }
      });
      // Reset all animated values
      bounceAnim.stopAnimation();
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
      floatAnim.stopAnimation();
      slideAnim.stopAnimation();
      fadeAnim.stopAnimation();
    };
  }, []); // Empty dependency array ensures animations run once and continue

  const floatUp = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  // Reset slide animation when it reaches the end
  useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      if (value >= width) {
        slideAnim.setValue(-width);
      }
    });
    
    return () => {
      slideAnim.removeListener(listener);
    };
  }, [slideAnim, width]);

  return (
    <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
      {/* Floating Numbers */}
      <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>
        17
      </Animated.Text>

      <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>
        42
      </Animated.Text>

      {/* App Name */}
      <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>
        Houzie Timez
      </Animated.Text>

      {/* Loader Dots */}
      <View style={styles.loaderContainerDots}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>

      {/* Dynamic Subtitle */}
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        {messages[currentText]}
      </Animated.Text>

      {/* Sliding Ticket */}
      <Animated.View
        style={[
          styles.ticketStrip,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.ticketText}>🎮 Games Loading...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const Game = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userGameData, setUserGameData] = useState({
    myTickets: [],
    myRequests: []
  });
  const [activeTab, setActiveTab] = useState('myGames');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Button animation refs
  const buttonScaleAnims = useRef([]);
  const letterAnims = useRef([]);

  useEffect(() => {
    fetchAllData();
    startAnimations();
    
    // Start fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Initialize button animations when games load
  useEffect(() => {
    if (games.length > 0) {
      buttonScaleAnims.current = games.map(() => new Animated.Value(1));
      
      buttonScaleAnims.current.forEach((anim) => {
        startPulseAnimation(anim);
      });
    }
  }, [games.length]);

  // Initialize letter animations for header
  useEffect(() => {
    // Create new animations array
    const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
    letterAnims.current = newLetterAnims;
    
    // Stop any existing animations
    letterAnims.current.forEach(anim => {
      anim.stopAnimation();
      anim.setValue(1);
    });
    
    let currentIndex = 0;
    let isAnimating = true;
    
    const animateNextLetter = () => {
      if (!isAnimating) return;
      
      // Reset all letters to normal size
      letterAnims.current.forEach(anim => {
        anim.setValue(1);
      });
      
      // Animate current letter
      Animated.sequence([
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.delay(200), // Pause before next letter
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
          // Move to next letter
          currentIndex = (currentIndex + 1) % letterAnims.current.length;
          animateNextLetter();
        }
      });
    };
    
    // Start the animation
    animateNextLetter();
    
    // Cleanup function
    return () => {
      isAnimating = false;
      if (letterAnims.current) {
        letterAnims.current.forEach(anim => {
          anim.stopAnimation();
        });
      }
    };
  }, []);

  const startPulseAnimation = (anim, duration = 800) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.08,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
  };

  const startAnimations = () => {
    // First floating animation
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchAllData(true).finally(() => setRefreshing(false));
  }, []);

  const fetchAllData = async (reset = false) => {
    if (reset) {
      setGames([]);
    }
    setLoading(true);
    try {
      await Promise.all([
        fetchGames(1, reset),
        fetchMyTickets(),
        fetchMyRequests()
      ]);
    } catch (error) {
      console.log("Error fetching data:", error);
      Alert.alert("Error", "Failed to load games data!");
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async (page = 1, reset = false) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `https://tambolatime.co.in/public/api/user/games?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const gamesData = res.data.games.data || [];
        const paginationData = res.data.games;
        
        if (reset) {
          setGames(gamesData);
        } else {
          setGames(prev => [...prev, ...gamesData]);
        }
        
        setCurrentPage(paginationData.current_page);
        setLastPage(paginationData.last_page);
        setHasMore(paginationData.current_page < paginationData.last_page);
      }
    } catch (error) {
      console.log("Error fetching games:", error);
      Alert.alert("Error", "Failed to load games!");
    }
  };

  const fetchMyTickets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUserGameData(prev => ({
          ...prev,
          myTickets: res.data.tickets.data || []
        }));
      }
    } catch (error) {
      console.log("Error fetching tickets:", error);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUserGameData(prev => ({
          ...prev,
          myRequests: res.data.ticket_requests.data || []
        }));
      }
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
  };

  const loadMoreGames = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      fetchGames(nextPage).finally(() => setLoadingMore(false));
    }
  };

  const isUserPlayingGame = (gameId) => {
    const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
    const hasPendingRequests = userGameData.myRequests.some(request => 
      request.game_id == gameId && request.status === 'pending'
    );
    
    return hasTickets || hasPendingRequests;
  };

  const getUserTicketCount = (gameId) => {
    const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
    const pendingRequestsCount = userGameData.myRequests.filter(request => 
      request.game_id == gameId && request.status === 'pending'
    ).length;
    
    return {
      tickets: ticketsCount,
      pendingRequests: pendingRequestsCount,
      total: ticketsCount + pendingRequestsCount
    };
  };

  const getFilteredGames = () => {
    let filtered = games;

    if (searchQuery.trim()) {
      filtered = filtered.filter(game =>
        game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === 'myGames') {
      filtered = filtered.filter(game => isUserPlayingGame(game.id));
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(game => game.status === 'completed');
    }

    return filtered;
  };

  const renderPlayingBadge = (game) => {
    const ticketInfo = getUserTicketCount(game.id);
    
    if (ticketInfo.total === 0) return null;
    
    return (
      <LinearGradient
        colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 198, 251, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.playingBadge}
      >
        <View style={styles.playingBadgeIcon}>
          <Ionicons name="person-circle" size={12} color={COLORS.surface} />
        </View>
        <Text style={styles.playingBadgeText}>
          {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
          {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
          {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
        </Text>
      </LinearGradient>
    );
  };

  const calculatePrizePool = (game) => {
    if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
      return null;
    }
    
    const total = game.pattern_rewards.reduce((sum, reward) => {
      const amount = parseFloat(reward.amount) || 0;
      const count = parseInt(reward.reward_count) || 1;
      return sum + (amount * count);
    }, 0);
    
    return total;
  };

  // Cartoon-style header with gradient
  const Header = () => {
    const letters = [
      { char: 'H', index: 0 },
      { char: 'O', index: 1, isSpecial: true },
      { char: 'U', index: 2 },
      { char: 'Z', index: 3 },
      { char: 'I', index: 4 },
      { char: 'E', index: 5 },
      { char: ' ', index: 6, isSpace: true, width: 20 },
      { char: 'T', index: 7 },
      { char: 'I', index: 8 },
      { char: 'M', index: 9 },
      { char: 'E', index: 10 },
      { char: 'Z', index: 11, isSpecial: true },
    ];

    return (
      <LinearGradient
        colors={COLORS.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.cartoonTitleRow}>
            {letters.map((item) => (
              <Animated.Text
                key={item.index}
                style={[
                  styles.cartoonLetter,
                  item.isSpecial && styles.specialCartoonLetter,
                  item.isSpace && { width: item.width || 20 },
                  { 
                    transform: [{ scale: letterAnims.current[item.index] || 1 }],
                    marginHorizontal: item.isSpace ? 0 : 2,
                  }
                ]}
              >
                {item.char}
              </Animated.Text>
            ))}
          </View>
          <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderGameCard = ({ item: game, index }) => {
    const ticketCost = parseFloat(game.ticket_cost || 0);
    const ticketInfo = getUserTicketCount(game.id);
    const isPlaying = isUserPlayingGame(game.id);
    const isCompleted = game.status === 'completed';
    const isLive = game.status === 'live';
    const isScheduled = game.status === 'scheduled';
    
    const prizePool = calculatePrizePool(game);
    
    const buttonScale = buttonScaleAnims.current[index] || new Animated.Value(1);
    
    return (
      <TouchableOpacity
        key={game.id}
        style={styles.gameCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("GameDetails", { game })}
      >
        {/* Background Pattern with Gradient */}
        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gameCardPattern}
        />
        
        {/* Status badge with gradient */}
        <LinearGradient
          colors={isLive ? COLORS.liveGradient : 
                  isCompleted ? COLORS.completedGradient : 
                  COLORS.scheduledGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusBadge}
        >
          <Ionicons 
            name={
              isLive ? 'radio-button-on' : 
              isCompleted ? 'trophy' :
              'time'
            } 
            size={10} 
            color={COLORS.surface} 
          />
          <Text style={styles.statusText}>
            {isLive ? 'LIVE' : 
             isCompleted ? 'COMPLETED' : 
             'SOON'}
          </Text>
        </LinearGradient>

        {/* Playing indicator with gradient */}
        {isPlaying && (
          <View style={styles.playingCardOverlay}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playingCardLabel}
            >
              <Ionicons name="checkmark-circle" size={12} color={COLORS.surface} />
              <Text style={styles.playingCardLabelText}>You're Playing</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.gameIconContainer}>
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameIconWrapper}
            >
              <MaterialIcons 
                name={isCompleted ? "trophy" : "confirmation-number"} 
                size={32} 
                color={COLORS.secondary} 
              />
            </LinearGradient>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.game_name}
              </Text>
              <Text style={styles.gameId}>
                ID: {game.game_code}
              </Text>
              {isPlaying && renderPlayingBadge(game)}
            </View>
          </View>
          
          <LinearGradient
            colors={game.ticket_type === "paid" ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gameTypeBadge}
          >
            {game.ticket_type === "paid" ? (
              <>
                <MaterialIcons name="diamond" size={14} color={COLORS.surface} />
                <Text style={styles.gameTypeText}>
                  ₹{ticketCost}
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.surface} />
                <Text style={styles.gameTypeText}>
                  FREE
                </Text>
              </>
            )}
          </LinearGradient>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailIcon}
              >
                <Ionicons name="calendar" size={14} color={COLORS.primary} />
              </LinearGradient>
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailText}>
                  {game.game_date_formatted || game.game_date}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailIcon}
              >
                <Ionicons name="time" size={14} color={COLORS.primary} />
              </LinearGradient>
              <View>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailText}>
                  {game.game_time_formatted || game.game_start_time}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailIcon}
              >
                <Ionicons name="person" size={14} color={COLORS.primary} />
              </LinearGradient>
              <View>
                <Text style={styles.detailLabel}>Host</Text>
                <Text style={styles.detailText}>
                  {game.user ? game.user.name : 'Houzie Timez'}
                </Text>
              </View>
            </View>
            
            {game.available_tickets !== undefined && !isCompleted && (
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Tickets</Text>
                  <Text style={styles.detailText}>
                    {game.available_tickets} Left
                  </Text>
                </View>
              </View>
            )}
            {isCompleted && (
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <Ionicons name="trophy" size={14} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailText}>Completed</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.prizeContainer}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.prizeIcon}
          >
            <MaterialIcons 
              name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
              size={18} 
              color={COLORS.surface} 
            />
          </LinearGradient>
          <View style={styles.prizeInfo}>
            <Text style={styles.prizeLabel}>
              {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
            </Text>
            <Text style={styles.prizeText}>
              {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
            </Text>
            {game.pattern_rewards && game.pattern_rewards.length > 0 && (
              <Text style={styles.prizeSubtext}>
                {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </LinearGradient>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => navigation.navigate("GameDetails", { game })}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isCompleted ? COLORS.completedGradient : 
                     isPlaying ? COLORS.primaryGradient : 
                     COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.joinButtonGradient}
            >
              <LinearGradient
                colors={COLORS.glassGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassEffectOverlay}
              />
              <Text style={styles.joinButtonText}>
                {isCompleted 
                  ? 'VIEW RESULTS' 
                  : isPlaying 
                    ? 'VIEW MY GAME' 
                    : isLive
                      ? 'JOIN GAME' 
                      : 'VIEW DETAILS'}
              </Text>
              <Ionicons 
                name={isCompleted ? "trophy" : "arrow-forward"} 
                size={16} 
                color={COLORS.surface} 
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const TabButton = ({ title, count, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isActive ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabButtonGradient}
      >
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
          {title}
        </Text>
        {count > 0 && (
          <LinearGradient
            colors={isActive ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] : COLORS.prizeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.tabCount, isActive && styles.tabCountActive]}
          >
            <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
              {count}
            </Text>
          </LinearGradient>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingMoreText}>Loading more games...</Text>
      </View>
    );
  };

  const renderEmptyList = () => (
    <LinearGradient
      colors={COLORS.winnerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.emptyState}
    >
      <LinearGradient
        colors={COLORS.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyIconWrapper}
      >
        <Ionicons 
          name={
            activeTab === 'myGames' ? "game-controller-outline" : 
            activeTab === 'completed' ? "trophy-outline" : 
            "search-outline"
          } 
          size={30} 
          color={COLORS.surface} 
        />
      </LinearGradient>
      <Text style={styles.emptyTitle}>
        {activeTab === 'myGames' 
          ? 'No Games Found' 
          : activeTab === 'completed'
          ? 'No Completed Games'
          : 'No Games Available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? `No games found for "${searchQuery}"`
          : activeTab === 'myGames'
          ? "You haven't joined any games yet. Browse all games to get started!"
          : activeTab === 'completed'
          ? "No completed games available yet. Check back later!"
          : "Check back later for new exciting games!"}
      </Text>
      {searchQuery && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={() => setSearchQuery('')}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.clearFiltersGradient}
          >
            <LinearGradient
              colors={COLORS.glassGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassEffectOverlay}
            />
            <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      {activeTab === 'myGames' && !searchQuery && (
        <TouchableOpacity 
          style={styles.browseGamesButton}
          onPress={() => setActiveTab('allGames')}
        >
          <LinearGradient
            colors={[COLORS.surface, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.browseGamesGradient}
          >
            <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );

  const renderHeader = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionIcon}
          >
            <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>
            {activeTab === 'myGames' ? 'MY GAMES' : 
             activeTab === 'completed' ? 'COMPLETED GAMES' : 
             'ALL GAMES'}
          </Text>
        </View>
        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gameCountBadge}
        >
          <Text style={styles.gameCount}>
            {getFilteredGames().length}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );

  if (loading && games.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
  const completedGamesCount = games.filter(game => game.status === 'completed').length;
  const allGamesCount = games.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.backgroundPattern}>
          <Animated.View 
            style={[
              styles.pokerChip1, 
              { transform: [{ translateY: translateY1 }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.pokerChip2, 
              { transform: [{ translateY: translateY2 }] }
            ]} 
          />
        </View>

        {/* Fixed Header with gradient */}
        <Header />

        {/* Search Bar with gradient */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchWrapper}
        >
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search games by name or ID..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Fixed Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton
            title="My Games"
            count={myGamesCount}
            isActive={activeTab === 'myGames'}
            onPress={() => setActiveTab('myGames')}
          />
          <TabButton
            title="All Games"
            count={allGamesCount}
            isActive={activeTab === 'allGames'}
            onPress={() => setActiveTab('allGames')}
          />
          <TabButton
            title="Completed"
            count={completedGamesCount}
            isActive={activeTab === 'completed'}
            onPress={() => setActiveTab('completed')}
          />
        </View>

        {/* Scrollable content */}
        <FlatList
          data={getFilteredGames()}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          onEndReached={loadMoreGames}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          ListHeaderComponent={renderHeader}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Game;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Loader Styles
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 20,
  },

  loaderContainerDots: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginHorizontal: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 5,
  },

  number: {
    position: 'absolute',
    left: 30,
    bottom: 0,
    fontSize: 28,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },

  number2: {
    position: 'absolute',
    right: 30,
    bottom: 0,
    fontSize: 28,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },

  ticketStrip: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#ffffff90',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  ticketText: {
    fontWeight: 'bold',
    color: '#333',
  },

  // Rest of your existing styles remain the same
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  loadingMoreText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 10,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  pokerChip1: {
    position: 'absolute',
    top: 80,
    left: width * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
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
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    paddingHorizontal: 4,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  cartoonLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FBC10B',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    includeFontPadding: false,
    marginHorizontal: 2,
    ...Platform.select({
      android: {
        elevation: 5,
        textShadowColor: '#FFB300',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
      },
    }),
  },
  specialCartoonLetter: {
    fontSize: 40,
    color: '#FFD700',
    textShadowColor: '#FF8C00',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    marginHorizontal: 2,
  },
  appTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: "500",
    marginTop: 4,
    marginLeft: 4,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    paddingVertical: 4,
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabButtonActive: {
    borderColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  tabButtonTextActive: {
    color: COLORS.surface,
  },
  tabCount: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  tabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabCountText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  tabCountTextActive: {
    color: COLORS.surface,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  gameCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  gameCount: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  gameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameCardPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 25,
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 14,
    gap: 4,
    zIndex: 2,
  },
  statusText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  playingCardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  playingCardLabel: {
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playingCardLabelText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  gameIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  gameIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  gameId: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  playingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  playingBadgeIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
  gameTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    marginLeft: 8,
  },
  gameTypeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.surface,
  },
  gameDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  prizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prizeIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  prizeInfo: {
    flex: 1,
  },
  prizeLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  prizeText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  prizeSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    marginTop: 2,
  },
  joinButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
    position: 'relative',
  },
  glassEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  joinButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginTop: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  clearFiltersButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  clearFiltersGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  clearFiltersButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  browseGamesButton: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  browseGamesGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  browseGamesButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});