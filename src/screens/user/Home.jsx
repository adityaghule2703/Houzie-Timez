// // // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // // import {
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   View,
// // // // // //   Image,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   Modal,
// // // // // //   ActivityIndicator,
// // // // // //   RefreshControl,
// // // // // //   Dimensions,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   TextInput,
// // // // // //   Animated,
// // // // // //   Easing,
// // // // // //   Platform,
// // // // // // } from "react-native";
// // // // // // import axios from "axios";
// // // // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // // import { useNavigation } from '@react-navigation/native';

// // // // // // const { width } = Dimensions.get('window');

// // // // // // // Blue color palette - Updated with better accent colors
// // // // // // const COLORS = {
// // // // // //   background: '#F0F7FF',
// // // // // //   surface: '#FFFFFF',
// // // // // //   primary: '#2E5BFF', // Vibrant blue
// // // // // //   primaryLight: '#E1EBFF',
// // // // // //   primaryDark: '#1A3A9E',
// // // // // //   accent: '#3B82F6', // Medium blue for accents
// // // // // //   secondary: '#60A5FA', // Light blue instead of yellow
// // // // // //   tertiary: '#2563EB', // Darker blue for contrast
// // // // // //   text: '#1E293B',
// // // // // //   textSecondary: '#64748B',
// // // // // //   textLight: '#94A3B8',
// // // // // //   border: '#E2E8F0',
  
// // // // // //   // Status colors
// // // // // //   live: '#10B981',
// // // // // //   scheduled: '#F59E0B',
// // // // // //   completed: '#94A3B8',
  
// // // // // //   // Block colors - Blue shades
// // // // // //   blockLightBlue: '#E1EBFF',
// // // // // //   blockMediumBlue: '#C2D6FF',
// // // // // //   blockDarkBlue: '#A3C1FF',
// // // // // //   blockYellow: '#FFF7D6',
// // // // // // };

// // // // // // const Home = () => {
// // // // // //   const navigation = useNavigation();
// // // // // //   const [notifications, setNotifications] = useState([]);
// // // // // //   const [sliders, setSliders] = useState([]);
// // // // // //   const [games, setGames] = useState([]);
// // // // // //   const [filteredGames, setFilteredGames] = useState([]);
// // // // // //   const [patterns, setPatterns] = useState([]);
// // // // // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // // // // //   const [activeSlide, setActiveSlide] = useState(0);
// // // // // //   const [modalVisible, setModalVisible] = useState(false);
// // // // // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // // // // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // // // // //   const [loadingGames, setLoadingGames] = useState(true);
// // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // // // //   // Popup state
// // // // // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // // // // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // // // // //   const [popupShown, setPopupShown] = useState(false);
  
// // // // // //   // Animation for popup
// // // // // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // // // // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // // // // //   // Scroll Y position for background animation
// // // // // //   const scrollY = useRef(new Animated.Value(0)).current;
  
// // // // // //   // Pagination state for games
// // // // // //   const [currentPage, setCurrentPage] = useState(1);
// // // // // //   const [lastPage, setLastPage] = useState(1);
// // // // // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // // // // //   const sliderRef = useRef(null);
// // // // // //   const scrollInterval = useRef(null);
// // // // // //   const flatListRef = useRef(null);

// // // // // //   // Filter options
// // // // // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // // // // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // // // // //   useEffect(() => {
// // // // // //     fetchInitialData();
    
// // // // // //     return () => {
// // // // // //       if (scrollInterval.current) {
// // // // // //         clearInterval(scrollInterval.current);
// // // // // //       }
// // // // // //     };
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     if (games.length > 0 && !popupShown) {
// // // // // //       setTimeout(() => {
// // // // // //         checkUpcomingGame();
// // // // // //       }, 1500);
// // // // // //     }
// // // // // //   }, [games, popupShown]);

// // // // // //   useEffect(() => {
// // // // // //     if (sliders.length > 1) {
// // // // // //       startAutoScroll();
// // // // // //     }
// // // // // //     return () => {
// // // // // //       if (scrollInterval.current) {
// // // // // //         clearInterval(scrollInterval.current);
// // // // // //       }
// // // // // //     };
// // // // // //   }, [sliders.length]);

// // // // // //   // Filter games based on search and active filter
// // // // // //   useEffect(() => {
// // // // // //     let filtered = games;
    
// // // // // //     // Apply search filter
// // // // // //     if (searchQuery.trim() !== '') {
// // // // // //       filtered = filtered.filter(game =>
// // // // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // // // //       );
// // // // // //     }
    
// // // // // //     // Apply status filter
// // // // // //     if (activeFilter === 'Live Now') {
// // // // // //       filtered = filtered.filter(game => game.status === 'live');
// // // // // //     } else if (activeFilter === 'Upcoming') {
// // // // // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // // // // //     } else if (activeFilter === 'Completed') {
// // // // // //       filtered = filtered.filter(game => game.status === 'completed');
// // // // // //     }
    
// // // // // //     setFilteredGames(filtered);
// // // // // //   }, [searchQuery, games, activeFilter]);

// // // // // //   useEffect(() => {
// // // // // //     if (upcomingGamePopup) {
// // // // // //       Animated.parallel([
// // // // // //         Animated.timing(opacityAnim, {
// // // // // //           toValue: 1,
// // // // // //           duration: 300,
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //         Animated.timing(slideAnim, {
// // // // // //           toValue: 0,
// // // // // //           duration: 400,
// // // // // //           easing: Easing.out(Easing.back(1.2)),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //       ]).start();
// // // // // //     } else {
// // // // // //       opacityAnim.setValue(0);
// // // // // //       slideAnim.setValue(300);
// // // // // //     }
// // // // // //   }, [upcomingGamePopup]);

// // // // // //   const startAutoScroll = () => {
// // // // // //     if (scrollInterval.current) {
// // // // // //       clearInterval(scrollInterval.current);
// // // // // //     }
    
// // // // // //     scrollInterval.current = setInterval(() => {
// // // // // //       if (sliders.length > 0) {
// // // // // //         let nextIndex = activeSlide + 1;
// // // // // //         if (nextIndex >= sliders.length) {
// // // // // //           nextIndex = 0;
// // // // // //         }
        
// // // // // //         setActiveSlide(nextIndex);
// // // // // //         if (sliderRef.current) {
// // // // // //           const slideWidth = width - 32;
// // // // // //           sliderRef.current.scrollToOffset({
// // // // // //             offset: nextIndex * slideWidth,
// // // // // //             animated: true
// // // // // //           });
// // // // // //         }
// // // // // //       }
// // // // // //     }, 3000);
// // // // // //   };

// // // // // //   const fetchInitialData = async () => {
// // // // // //     try {
// // // // // //       await Promise.all([
// // // // // //         fetchNotifications(),
// // // // // //         fetchSliders(),
// // // // // //         fetchGames(1),
// // // // // //         fetchPatterns()
// // // // // //       ]);
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching initial data:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const onRefresh = React.useCallback(() => {
// // // // // //     setRefreshing(true);
// // // // // //     setCurrentPage(1);
// // // // // //     setGames([]);
// // // // // //     setFilteredGames([]);
// // // // // //     setPopupShown(false);
// // // // // //     Promise.all([
// // // // // //       fetchNotifications(),
// // // // // //       fetchSliders(),
// // // // // //       fetchGames(1),
// // // // // //       fetchPatterns()
// // // // // //     ]).finally(() => setRefreshing(false));
// // // // // //   }, []);

// // // // // //   const checkUpcomingGame = () => {
// // // // // //     try {
// // // // // //       const now = new Date();
      
// // // // // //       const scheduledGames = games.filter(game => 
// // // // // //         game.status === 'scheduled'
// // // // // //       );
      
// // // // // //       if (scheduledGames.length === 0) return;
      
// // // // // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // // // // //         let endDateTime;
        
// // // // // //         try {
// // // // // //           if (game.ticket_request_end_date) {
// // // // // //             endDateTime = new Date(game.ticket_request_end_date);
// // // // // //           } else {
// // // // // //             endDateTime = new Date(game.game_date);
// // // // // //           }
// // // // // //         } catch (e) {
// // // // // //           endDateTime = new Date();
// // // // // //         }
        
// // // // // //         return {
// // // // // //           ...game,
// // // // // //           endDateTime
// // // // // //         };
// // // // // //       });
      
// // // // // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // // // // //       const earliestEndGame = sortedGames[0];
      
// // // // // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // // // // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) { // Show if less than 24 hours left
// // // // // //         setUpcomingGame(earliestEndGame);
// // // // // //         setUpcomingGamePopup(true);
// // // // // //         setPopupShown(true);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error checking upcoming game:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const getTimeRemaining = (endDateTime) => {
// // // // // //     const now = new Date();
// // // // // //     const diff = endDateTime - now;
    
// // // // // //     if (diff <= 0) return "Ending soon";
    
// // // // // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // // // // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // // // // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // // // // //     if (days > 0) {
// // // // // //       return `${days}d ${hours}h left`;
// // // // // //     } else if (hours > 0) {
// // // // // //       return `${hours}h ${minutes}m left`;
// // // // // //     } else {
// // // // // //       return `${minutes}m left`;
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchNotifications = async () => {
// // // // // //     try {
// // // // // //       const token = await AsyncStorage.getItem("token");
// // // // // //       if (!token) return;
// // // // // //       const res = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/notifications",
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
// // // // // //       if (res.data.status) {
// // // // // //         setNotifications(res.data.data);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching notifications:", error);
// // // // // //     } finally {
// // // // // //       setLoadingNotifications(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchSliders = async () => {
// // // // // //     try {
// // // // // //       setLoadingSliders(true);
// // // // // //       const res = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/sliders"
// // // // // //       );
// // // // // //       if (res.data.success) {
// // // // // //         setSliders(res.data.data || []);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching sliders:", error);
// // // // // //       setSliders([]);
// // // // // //     } finally {
// // // // // //       setLoadingSliders(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchGames = async (page = 1) => {
// // // // // //     try {
// // // // // //       if (page === 1) {
// // // // // //         setLoadingGames(true);
// // // // // //       }
      
// // // // // //       const token = await AsyncStorage.getItem("token");
// // // // // //       if (!token) return;
      
// // // // // //       const res = await axios.get(
// // // // // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
      
// // // // // //       if (res.data.success) {
// // // // // //         const newGames = res.data.games.data || [];
// // // // // //         const pagination = res.data.games;
        
// // // // // //         if (page === 1) {
// // // // // //           setGames(newGames);
// // // // // //           setFilteredGames(newGames);
// // // // // //         } else {
// // // // // //           setGames(prev => [...prev, ...newGames]);
// // // // // //           setFilteredGames(prev => [...prev, ...newGames]);
// // // // // //         }
        
// // // // // //         setCurrentPage(pagination.current_page);
// // // // // //         setLastPage(pagination.last_page);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching games:", error);
// // // // // //     } finally {
// // // // // //       if (page === 1) {
// // // // // //         setLoadingGames(false);
// // // // // //       }
// // // // // //       setLoadingMore(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchPatterns = async () => {
// // // // // //     try {
// // // // // //       setLoadingPatterns(true);
// // // // // //       const token = await AsyncStorage.getItem("token");
      
// // // // // //       if (!token) {
// // // // // //         setLoadingPatterns(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       const response = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // // // // //         {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //             Accept: 'application/json',
// // // // // //           },
// // // // // //         }
// // // // // //       );

// // // // // //       if (response.data && response.data.status) {
// // // // // //         const patternsData = response.data.data?.patterns || [];
        
// // // // // //         const patternSequence = [
// // // // // //           'top line',
// // // // // //           'middle line', 
// // // // // //           'bottom line',
// // // // // //           'breakfast',
// // // // // //           'lunch',
// // // // // //           'dinner',
// // // // // //           'four corners',
// // // // // //           'bamboo',
// // // // // //           'early five',
// // // // // //           'non claimers',
// // // // // //           'full house'
// // // // // //         ];
        
// // // // // //         const sortedPatterns = patternsData.sort((a, b) => {
// // // // // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // // // // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // // // // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // // // // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // // // // //           if (aIndex === -1) return 1;
// // // // // //           if (bIndex === -1) return -1;
          
// // // // // //           return aIndex - bIndex;
// // // // // //         });
        
// // // // // //         setPatterns(sortedPatterns.slice(0, 8));
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log('Error fetching patterns in Home:', error);
// // // // // //     } finally {
// // // // // //       setLoadingPatterns(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const loadMoreGames = () => {
// // // // // //     if (!loadingMore && currentPage < lastPage) {
// // // // // //       setLoadingMore(true);
// // // // // //       fetchGames(currentPage + 1);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleGamePress = (game) => {
// // // // // //     navigation.navigate("GameDetails", { game });
// // // // // //   };

// // // // // //   const handleAllGamesPress = () => {
// // // // // //     navigation.navigate("Game");
// // // // // //   };

// // // // // //   const handleAllPatternsPress = () => {
// // // // // //     navigation.navigate("UserGamePatterns");
// // // // // //   };

// // // // // //   const handlePatternPress = (pattern) => {
// // // // // //     navigation.navigate("UserGamePatterns", { 
// // // // // //       selectedPatternId: pattern.id,
// // // // // //       selectedPattern: pattern 
// // // // // //     });
// // // // // //   };

// // // // // //   const handlePopupJoinNow = () => {
// // // // // //     setUpcomingGamePopup(false);
// // // // // //     if (upcomingGame) {
// // // // // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // // // // //     }
// // // // // //   };

// // // // // //   const handlePopupLater = () => {
// // // // // //     setUpcomingGamePopup(false);
// // // // // //   };

// // // // // //   const getPatternIcon = (pattern) => {
// // // // // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // // // // //     const iconMap = {
// // // // // //       'bamboo': 'leaf',
// // // // // //       'bottom line': 'arrow-down',
// // // // // //       'breakfast': 'cafe',
// // // // // //       'dinner': 'restaurant',
// // // // // //       'early five': '5',
// // // // // //       'four corners': 'apps',
// // // // // //       'full house': 'home',
// // // // // //       'lunch': 'fast-food',
// // // // // //       'middle line': 'remove',
// // // // // //       'non claimer': 'close',
// // // // // //       'top line': 'arrow-up'
// // // // // //     };
    
// // // // // //     for (const [key, icon] of Object.entries(iconMap)) {
// // // // // //       if (patternName.includes(key)) return icon;
// // // // // //     }
    
// // // // // //     return 'grid-outline';
// // // // // //   };

// // // // // //   const formatPatternName = (name) => {
// // // // // //     if (!name) return 'Unknown Pattern';
// // // // // //     return name
// // // // // //       .split('_')
// // // // // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // // // // //       .join(' ');
// // // // // //   };

// // // // // //   const renderPatternCard = (pattern, index) => {
// // // // // //     const icon = getPatternIcon(pattern);
// // // // // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // // // // //     // Different background colors for each pattern
// // // // // //     const bgColors = [
// // // // // //       '#2E5BFF', // Blue
// // // // // //       '#F59E0B', // Orange
// // // // // //       '#10B981', // Green
// // // // // //       '#EF4444', // Red
// // // // // //       '#8B5CF6', // Purple
// // // // // //       '#EC4899', // Pink
// // // // // //       '#06B6D4', // Cyan
// // // // // //       '#F97316', // Orange
// // // // // //     ];
    
// // // // // //     // Different patterns for variety
// // // // // //     const patterns = [
// // // // // //       'Top Line',
// // // // // //       'Middle',
// // // // // //       'Bottom',
// // // // // //       'Breakfast',
// // // // // //       'Lunch',
// // // // // //       'Dinner',
// // // // // //       'Corners',
// // // // // //       'Bamboo',
// // // // // //     ];
    
// // // // // //     const patternName = patterns[index % patterns.length];
// // // // // //     const bgColor = bgColors[index % bgColors.length];
    
// // // // // //     return (
// // // // // //       <TouchableOpacity 
// // // // // //         key={pattern.id} 
// // // // // //         style={styles.compactPatternCard}
// // // // // //         onPress={() => handlePatternPress(pattern)}
// // // // // //         activeOpacity={0.7}
// // // // // //       >
// // // // // //         <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
// // // // // //           <Ionicons name={icon} size={18} color="#FFFFFF" />
// // // // // //         </View>
// // // // // //         <Text style={styles.compactPatternName} numberOfLines={1}>
// // // // // //           {patternName}
// // // // // //         </Text>
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   const renderSliderItem = ({ item }) => (
// // // // // //     <View style={styles.slideContainer}>
// // // // // //       <Image
// // // // // //         source={{ 
// // // // // //           uri: item.image_url || 'https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg'
// // // // // //         }}
// // // // // //         style={styles.sliderImage}
// // // // // //         resizeMode="cover"
// // // // // //       />
// // // // // //     </View>
// // // // // //   );

// // // // // //   const handleScroll = (event) => {
// // // // // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // // // // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // // // // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // // // // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // // // // //       setActiveSlide(currentIndex);
// // // // // //     }
// // // // // //   };

// // // // // //   // Handle main scroll for background animation
// // // // // //   const handleMainScroll = Animated.event(
// // // // // //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // // // // //     { useNativeDriver: false }
// // // // // //   );

// // // // // //   const renderPagination = () => {
// // // // // //     if (sliders.length <= 1) return null;
    
// // // // // //     return (
// // // // // //       <View style={styles.paginationContainer}>
// // // // // //         {sliders.map((_, index) => (
// // // // // //           <View
// // // // // //             key={index}
// // // // // //             style={[
// // // // // //               styles.paginationDot,
// // // // // //               activeSlide === index && styles.paginationDotActive,
// // // // // //             ]}
// // // // // //           />
// // // // // //         ))}
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   const renderGameCard = ({ item: game }) => {
// // // // // //     if (!game) return null;
    
// // // // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // // // //     const isLive = game.status === 'live';
// // // // // //     const isScheduled = game.status === 'scheduled';
// // // // // //     const isCompleted = game.status === 'completed';
    
// // // // // //     // Get status color
// // // // // //     let statusColor = COLORS.scheduled;
// // // // // //     let statusText = 'Upcoming';
// // // // // //     if (isLive) {
// // // // // //       statusColor = COLORS.live;
// // // // // //       statusText = 'Live Now';
// // // // // //     } else if (isCompleted) {
// // // // // //       statusColor = COLORS.completed;
// // // // // //       statusText = 'Completed';
// // // // // //     }
    
// // // // // //     return (
// // // // // //       <TouchableOpacity
// // // // // //         style={styles.gameCard}
// // // // // //         activeOpacity={0.9}
// // // // // //         onPress={() => handleGamePress(game)}
// // // // // //       >
// // // // // //         <View style={[styles.gameImagePlaceholder, { backgroundColor: COLORS.primaryLight }]}>
// // // // // //           <MaterialIcons name="sports-esports" size={32} color={COLORS.primary} />
// // // // // //         </View>
        
// // // // // //         <View style={styles.gameCardContent}>
// // // // // //           <View style={styles.gameCardHeader}>
// // // // // //             <View style={styles.gameTitleContainer}>
// // // // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // // // //                 {game.game_name || "Tambola Game"}
// // // // // //               </Text>
// // // // // //               <Text style={styles.gameCode}>
// // // // // //                 #{game.game_code || "N/A"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //             <View style={[styles.statusPill, { backgroundColor: `${statusColor}20` }]}>
// // // // // //               <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
// // // // // //               <Text style={[styles.statusPillText, { color: statusColor }]}>
// // // // // //                 {statusText}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.gameMetaRow}>
// // // // // //             <View style={styles.metaItem}>
// // // // // //               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
// // // // // //               <Text style={styles.metaText}>
// // // // // //                 {game.game_date_formatted || game.game_date || "TBA"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //             <View style={styles.metaItem}>
// // // // // //               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
// // // // // //               <Text style={styles.metaText}>
// // // // // //                 {game.game_time_formatted || game.game_start_time || "TBA"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.gameFooter}>
// // // // // //             <View>
// // // // // //               <Text style={styles.prizeLabel}>Prize Pool</Text>
// // // // // //               <Text style={styles.prizeValue}>
// // // // // //                 {game.ticket_type === "paid" && game.max_tickets 
// // // // // //                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // // // // //                   : "Exciting Prizes"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //             <View style={styles.arrowButton}>
// // // // // //               <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   const clearSearch = () => {
// // // // // //     setSearchQuery('');
// // // // // //   };

// // // // // //   const renderFooter = () => {
// // // // // //     if (!loadingMore) return null;
// // // // // //     return (
// // // // // //       <View style={styles.loadingMoreContainer}>
// // // // // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   const UpcomingGamePopup = () => {
// // // // // //     if (!upcomingGame) return null;
    
// // // // // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // // // // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // // // // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // // // // //     return (
// // // // // //       <Modal
// // // // // //         visible={upcomingGamePopup}
// // // // // //         transparent={true}
// // // // // //         animationType="fade"
// // // // // //         onRequestClose={handlePopupLater}
// // // // // //       >
// // // // // //         <View style={styles.popupOverlay}>
// // // // // //           <Animated.View 
// // // // // //             style={[
// // // // // //               styles.popupContainer,
// // // // // //               {
// // // // // //                 opacity: opacityAnim,
// // // // // //                 transform: [{ translateY: slideAnim }]
// // // // // //               }
// // // // // //             ]}
// // // // // //           >
// // // // // //             <View style={[styles.popupIcon, { backgroundColor: COLORS.primaryLight }]}>
// // // // // //               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
// // // // // //             </View>
            
// // // // // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // // // // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // // // // //             <View style={styles.popupTimer}>
// // // // // //               <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
// // // // // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // // // // //             </View>
            
// // // // // //             <View style={styles.popupPrize}>
// // // // // //               <Text style={styles.popupPrizeLabel}>Prize Pool</Text>
// // // // // //               <Text style={styles.popupPrizeValue}>
// // // // // //                 {upcomingGame.ticket_type === "paid" && upcomingGame.max_tickets
// // // // // //                   ? `₹${(ticketCost * upcomingGame.max_tickets).toLocaleString()}`
// // // // // //                   : "Exciting Prizes"}
// // // // // //               </Text>
// // // // // //             </View>
            
// // // // // //             <View style={styles.popupActions}>
// // // // // //               <TouchableOpacity 
// // // // // //                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
// // // // // //                 onPress={handlePopupJoinNow}
// // // // // //               >
// // // // // //                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // // // // //               </TouchableOpacity>
              
// // // // // //               <TouchableOpacity 
// // // // // //                 style={styles.popupSecondaryButton}
// // // // // //                 onPress={handlePopupLater}
// // // // // //               >
// // // // // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </Animated.View>
// // // // // //         </View>
// // // // // //       </Modal>
// // // // // //     );
// // // // // //   };

// // // // // //   // Animated background that moves with scroll
// // // // // //   const AnimatedBackground = () => {
// // // // // //     // Interpolate scroll position to create parallax effect
// // // // // //     const block1TranslateY = scrollY.interpolate({
// // // // // //       inputRange: [0, 300],
// // // // // //       outputRange: [0, -50],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     const block2TranslateY = scrollY.interpolate({
// // // // // //       inputRange: [0, 400],
// // // // // //       outputRange: [0, -30],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     const block3TranslateY = scrollY.interpolate({
// // // // // //       inputRange: [0, 500],
// // // // // //       outputRange: [0, -20],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     const opacity = scrollY.interpolate({
// // // // // //       inputRange: [0, 200, 400],
// // // // // //       outputRange: [1, 0.8, 0.6],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     return (
// // // // // //       <>
// // // // // //         <Animated.View 
// // // // // //           style={[
// // // // // //             styles.blueBlock1,
// // // // // //             {
// // // // // //               transform: [{ translateY: block1TranslateY }],
// // // // // //               opacity
// // // // // //             }
// // // // // //           ]} 
// // // // // //         />
// // // // // //         <Animated.View 
// // // // // //           style={[
// // // // // //             styles.blueBlock2,
// // // // // //             {
// // // // // //               transform: [{ translateY: block2TranslateY }],
// // // // // //               opacity: opacity.interpolate({
// // // // // //                 inputRange: [0.6, 1],
// // // // // //                 outputRange: [0.4, 0.8]
// // // // // //               })
// // // // // //             }
// // // // // //           ]} 
// // // // // //         />
// // // // // //         <Animated.View 
// // // // // //           style={[
// // // // // //             styles.blueBlock3,
// // // // // //             {
// // // // // //               transform: [{ translateY: block3TranslateY }],
// // // // // //               opacity: opacity.interpolate({
// // // // // //                 inputRange: [0.6, 1],
// // // // // //                 outputRange: [0.2, 0.5]
// // // // // //               })
// // // // // //             }
// // // // // //           ]} 
// // // // // //         />
// // // // // //       </>
// // // // // //     );
// // // // // //   };

// // // // // //   // Enhanced Header with semicircle shape and UK-style rounded lines
// // // // // //  // Enhanced Header with semicircle shape and UK-style rounded lines
// // // // // // const Header = () => (
// // // // // //   <View style={styles.headerWrapper}>
// // // // // //     {/* Semicircle Background */}
// // // // // //     <View style={styles.semicircleBackground}>
// // // // // //       <View style={styles.semicircle} />
// // // // // //     </View>
    
// // // // // //     {/* UK-style Rounded Lines Pattern */}
// // // // // //     <View style={styles.ukPatternContainer}>
// // // // // //       {/* Curved Lines - Like tube map style */}
// // // // // //       <View style={styles.curvedLine1} />
// // // // // //       <View style={styles.curvedLine2} />
// // // // // //       <View style={styles.curvedLine3} />
      
// // // // // //       {/* Parallel Lines */}
// // // // // //       <View style={styles.parallelLines}>
// // // // // //         <View style={styles.parallelLine} />
// // // // // //         <View style={styles.parallelLine} />
// // // // // //         <View style={styles.parallelLine} />
// // // // // //       </View>
      
// // // // // //       {/* Dotted Circle Pattern */}
// // // // // //       <View style={styles.dottedCircle1}>
// // // // // //         {[...Array(8)].map((_, i) => (
// // // // // //           <View 
// // // // // //             key={i} 
// // // // // //             style={[
// // // // // //               styles.dottedCircleDot,
// // // // // //               {
// // // // // //                 transform: [
// // // // // //                   { rotate: `${i * 45}deg` },
// // // // // //                   { translateX: 30 }
// // // // // //                 ]
// // // // // //               }
// // // // // //             ]} 
// // // // // //           />
// // // // // //         ))}
// // // // // //       </View>
      
// // // // // //       {/* Small decorative elements */}
// // // // // //       <View style={styles.decorativeDot1} />
// // // // // //       <View style={styles.decorativeDot2} />
// // // // // //       <View style={styles.decorativeLine1} />
// // // // // //       <View style={styles.decorativeLine2} />
// // // // // //     </View>

// // // // // //     {/* Header Content */}
// // // // // //     <View style={styles.headerContent}>
// // // // // //       <View>
// // // // // //         <Text style={styles.greeting}>Let's play your</Text>
// // // // // //         <Text style={styles.title}>
// // // // // //           favorite <Text style={styles.titleBold}>Tambola!</Text>
// // // // // //         </Text>
// // // // // //       </View>
// // // // // //       <TouchableOpacity onPress={() => setModalVisible(true)}>
// // // // // //         <View style={styles.notificationIcon}>
// // // // // //           <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
// // // // // //           {notifications.length > 0 && (
// // // // // //             <View style={styles.notificationBadge} />
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </TouchableOpacity>
// // // // // //     </View>
// // // // // //   </View>
// // // // // // );

// // // // // //   if (loadingGames && games.length === 0) {
// // // // // //     return (
// // // // // //       <SafeAreaView style={styles.safeArea}>
// // // // // //         <View style={styles.loadingContainer}>
// // // // // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // // // // //         </View>
// // // // // //       </SafeAreaView>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

// // // // // //       <View style={styles.container}>
// // // // // //         {/* Animated Color Blocks - Blue Shades that move with scroll */}
// // // // // //         <AnimatedBackground />

// // // // // //         <Animated.FlatList
// // // // // //           ref={flatListRef}
// // // // // //           data={filteredGames}
// // // // // //           renderItem={renderGameCard}
// // // // // //           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //           refreshControl={
// // // // // //             <RefreshControl
// // // // // //               refreshing={refreshing}
// // // // // //               onRefresh={onRefresh}
// // // // // //               tintColor={COLORS.primary}
// // // // // //               colors={[COLORS.primary]}
// // // // // //             />
// // // // // //           }
// // // // // //           onEndReached={loadMoreGames}
// // // // // //           onEndReachedThreshold={0.5}
// // // // // //           ListFooterComponent={renderFooter}
// // // // // //           onScroll={handleMainScroll}
// // // // // //           scrollEventThrottle={16}
// // // // // //           ListHeaderComponent={
// // // // // //             <>
// // // // // //               {/* Enhanced Header with Semicircle and UK Pattern */}
// // // // // //               <Header />

// // // // // //               {/* Search */}
// // // // // //               <View style={styles.searchBox}>
// // // // // //                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
// // // // // //                 <TextInput
// // // // // //                   placeholder="Search games by name or ID..."
// // // // // //                   placeholderTextColor={COLORS.textLight}
// // // // // //                   style={styles.searchInput}
// // // // // //                   value={searchQuery}
// // // // // //                   onChangeText={setSearchQuery}
// // // // // //                   returnKeyType="search"
// // // // // //                 />
// // // // // //                 {searchQuery.length > 0 ? (
// // // // // //                   <TouchableOpacity onPress={clearSearch}>
// // // // // //                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// // // // // //                   </TouchableOpacity>
// // // // // //                 ) : (
// // // // // //                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
// // // // // //                 )}
// // // // // //               </View>

// // // // // //               {/* Filter Chips */}
// // // // // //               <ScrollView
// // // // // //                 horizontal
// // // // // //                 showsHorizontalScrollIndicator={false}
// // // // // //                 contentContainerStyle={styles.filtersContainer}
// // // // // //               >
// // // // // //                 {filters.map((filter) => (
// // // // // //                   <TouchableOpacity
// // // // // //                     key={filter}
// // // // // //                     style={[
// // // // // //                       styles.filterChip,
// // // // // //                       activeFilter === filter && styles.activeFilterChip,
// // // // // //                     ]}
// // // // // //                     onPress={() => setActiveFilter(filter)}
// // // // // //                   >
// // // // // //                     <Text
// // // // // //                       style={[
// // // // // //                         styles.filterChipText,
// // // // // //                         activeFilter === filter && styles.activeFilterChipText,
// // // // // //                       ]}
// // // // // //                     >
// // // // // //                       {filter}
// // // // // //                     </Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 ))}
// // // // // //               </ScrollView>

// // // // // //               {/* Slider Section */}
// // // // // //               {loadingSliders ? (
// // // // // //                 <View style={styles.sliderLoading}>
// // // // // //                   <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //                 </View>
// // // // // //               ) : sliders.length > 0 ? (
// // // // // //                 <View style={styles.sliderSection}>
// // // // // //                   <FlatList
// // // // // //                     ref={sliderRef}
// // // // // //                     data={sliders}
// // // // // //                     renderItem={renderSliderItem}
// // // // // //                     keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // // // // //                     horizontal
// // // // // //                     pagingEnabled
// // // // // //                     showsHorizontalScrollIndicator={false}
// // // // // //                     onScroll={handleScroll}
// // // // // //                     scrollEventThrottle={16}
// // // // // //                     getItemLayout={(data, index) => ({
// // // // // //                       length: width - 32,
// // // // // //                       offset: (width - 32) * index,
// // // // // //                       index,
// // // // // //                     })}
// // // // // //                   />
// // // // // //                   {renderPagination()}
// // // // // //                 </View>
// // // // // //               ) : null}

// // // // // //               {/* Patterns Section - Redesigned */}
// // // // // //               {patterns.length > 0 && (
// // // // // //                 <View style={styles.patternsSection}>
// // // // // //                   <View style={styles.sectionHeader}>
// // // // // //                     <View>
// // // // // //                       <Text style={styles.sectionTitle}>Game Patterns</Text>
// // // // // //                       <Text style={styles.sectionSubtitle}>Popular winning combinations</Text>
// // // // // //                     </View>
// // // // // //                     <TouchableOpacity onPress={handleAllPatternsPress}>
// // // // // //                       <View style={styles.seeAllButton}>
// // // // // //                         <Text style={styles.seeAllText}>See All</Text>
// // // // // //                         <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
// // // // // //                       </View>
// // // // // //                     </TouchableOpacity>
// // // // // //                   </View>

// // // // // //                   {loadingPatterns ? (
// // // // // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //                   ) : (
// // // // // //                     <ScrollView 
// // // // // //                       horizontal 
// // // // // //                       showsHorizontalScrollIndicator={false}
// // // // // //                       contentContainerStyle={styles.patternsList}
// // // // // //                     >
// // // // // //                       {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // // // // //                     </ScrollView>
// // // // // //                   )}
// // // // // //                 </View>
// // // // // //               )}

// // // // // //               {/* Games Count */}
// // // // // //               <View style={styles.gamesCountContainer}>
// // // // // //                 <Text style={styles.gamesCount}>
// // // // // //                   {filteredGames.length} {filteredGames.length === 1 ? 'Game' : 'Games'} Available
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </>
// // // // // //           }
// // // // // //           ListEmptyComponent={
// // // // // //             <View style={styles.emptyGames}>
// // // // // //               <Ionicons name="game-controller-outline" size={48} color={COLORS.textLight} />
// // // // // //               <Text style={styles.emptyGamesText}>
// // // // // //                 {searchQuery ? 'No games found' : 'No games available'}
// // // // // //               </Text>
// // // // // //               {searchQuery && (
// // // // // //                 <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
// // // // // //                   <Text style={styles.clearSearchButtonText}>Clear Search</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               )}
// // // // // //             </View>
// // // // // //           }
// // // // // //         />

// // // // // //         {/* Popup */}
// // // // // //         <UpcomingGamePopup />

// // // // // //         {/* Notifications Modal */}
// // // // // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // // // // //           <View style={styles.modalOverlay}>
// // // // // //             <View style={styles.modalContent}>
// // // // // //               <View style={styles.modalHeader}>
// // // // // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // // // // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // // // // //                   <Ionicons name="close" size={24} color={COLORS.text} />
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>

// // // // // //               {loadingNotifications ? (
// // // // // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalLoader} />
// // // // // //               ) : (
// // // // // //                 <FlatList
// // // // // //                   data={notifications}
// // // // // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // //                   renderItem={({ item }) => (
// // // // // //                     <View style={styles.notificationItem}>
// // // // // //                       <View style={styles.notificationIcon}>
// // // // // //                         <Ionicons name="notifications" size={20} color={COLORS.primary} />
// // // // // //                       </View>
// // // // // //                       <View style={styles.notificationContent}>
// // // // // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // // // // //                         <Text style={styles.notificationMessage}>
// // // // // //                           {item.message || "Check out the new features!"}
// // // // // //                         </Text>
// // // // // //                         <Text style={styles.notificationDate}>
// // // // // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // // // // //                         </Text>
// // // // // //                       </View>
// // // // // //                     </View>
// // // // // //                   )}
// // // // // //                   ListEmptyComponent={
// // // // // //                     <View style={styles.emptyNotifications}>
// // // // // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // // // // //                       <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
// // // // // //                     </View>
// // // // // //                   }
// // // // // //                 />
// // // // // //               )}
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </Modal>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   safeArea: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //   },
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //     paddingHorizontal: 16,
// // // // // //   },
  
// // // // // //   /* COLOR BLOCKS - Blue Shades - Now Animated */
// // // // // //   blueBlock1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 280,
// // // // // //     backgroundColor: COLORS.blockLightBlue,
// // // // // //     borderBottomLeftRadius: 50,
// // // // // //     borderBottomRightRadius: 50,
// // // // // //   },
// // // // // //   blueBlock2: {
// // // // // //     position: 'absolute',
// // // // // //     top: 200,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 160,
// // // // // //     backgroundColor: COLORS.blockMediumBlue,
// // // // // //   },
// // // // // //   blueBlock3: {
// // // // // //     position: 'absolute',
// // // // // //     top: 300,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 100,
// // // // // //     backgroundColor: COLORS.blockDarkBlue,
// // // // // //     opacity: 0.3,
// // // // // //   },
  
// // // // // //   loadingContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
  
// // // // // //   /* Enhanced Header with Semicircle and UK Pattern */
// // // // // // /* Enhanced Header with Semicircle and UK Pattern */
// // // // // // headerWrapper: {
// // // // // //   position: 'relative',
// // // // // //   marginTop: 8, // Reduced from 14
// // // // // //   marginBottom: 8, // Reduced from 14
// // // // // //   overflow: 'hidden',
 
// // // // // // },

// // // // // // /* Header Content */
// // // // // // headerContent: {
// // // // // //   flexDirection: 'row',
// // // // // //   justifyContent: 'space-between',
// // // // // //   alignItems: 'center',
// // // // // //   position: 'relative',
// // // // // //   zIndex: 2,

// // // // // // },

// // // // // // greeting: {
// // // // // //   fontSize: 14, // Reduced from 16
// // // // // //   color: COLORS.textSecondary,
// // // // // //   marginBottom: 2, // Reduced from 4
// // // // // // },

// // // // // // title: {
// // // // // //   fontSize: 24, // Reduced from 26
// // // // // //   color: COLORS.text,
  
// // // // // // },

// // // // // // // Update searchBox margin
// // // // // // searchBox: {
// // // // // //   flexDirection: 'row',
// // // // // //   alignItems: 'center',
// // // // // //   backgroundColor: COLORS.surface,
// // // // // //   borderRadius: 18,
// // // // // //   paddingHorizontal: 14,
// // // // // //   paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// // // // // //   marginBottom: 12,
// // // // // //  // Added small top margin instead of large gap
// // // // // //   elevation: 2,
// // // // // //   shadowColor: '#000',
// // // // // //   shadowOffset: { width: 0, height: 2 },
// // // // // //   shadowOpacity: 0.05,
// // // // // //   shadowRadius: 8,
// // // // // // },
  
// // // // // //   /* Semicircle Background */
// // // // // //   semicircleBackground: {
// // // // // //     position: 'absolute',
// // // // // //     top: -40,
// // // // // //     right: -30,
// // // // // //     width: 200,
// // // // // //     height: 200,
// // // // // //     overflow: 'hidden',
// // // // // //   },
// // // // // //   semicircle: {
// // // // // //     position: 'absolute',
// // // // // //     width: 400,
// // // // // //     height: 200,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     borderTopLeftRadius: 200,
// // // // // //     borderTopRightRadius: 200,
// // // // // //     transform: [{ rotate: '-15deg' }],
// // // // // //     opacity: 0.3,
// // // // // //   },
  
// // // // // //   /* UK-style Rounded Lines Pattern */
// // // // // //   ukPatternContainer: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     bottom: 0,
// // // // // //   },
  
// // // // // //   /* Curved Lines - Like tube map */
// // // // // //   curvedLine1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 20,
// // // // // //     right: 50,
// // // // // //     width: 80,
// // // // // //     height: 40,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     borderTopWidth: 0,
// // // // // //     borderRightWidth: 0,
// // // // // //     borderRadius: 40,
// // // // // //     opacity: 0.15,
// // // // // //     transform: [{ rotate: '-10deg' }],
// // // // // //   },
// // // // // //   curvedLine2: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 10,
// // // // // //     left: 30,
// // // // // //     width: 60,
// // // // // //     height: 30,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     borderBottomWidth: 0,
// // // // // //     borderLeftWidth: 0,
// // // // // //     borderRadius: 30,
// // // // // //     opacity: 0.15,
// // // // // //     transform: [{ rotate: '15deg' }],
// // // // // //   },
// // // // // //   curvedLine3: {
// // // // // //     position: 'absolute',
// // // // // //     top: 40,
// // // // // //     left: 100,
// // // // // //     width: 100,
// // // // // //     height: 50,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     borderTopWidth: 0,
// // // // // //     borderLeftWidth: 0,
// // // // // //     borderRadius: 50,
// // // // // //     opacity: 0.1,
// // // // // //     transform: [{ rotate: '20deg' }],
// // // // // //   },
  
// // // // // //   /* Parallel Lines */
// // // // // //   parallelLines: {
// // // // // //     position: 'absolute',
// // // // // //     top: 30,
// // // // // //     left: 20,
// // // // // //   },
// // // // // //   parallelLine: {
// // // // // //     width: 80,
// // // // // //     height: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.1,
// // // // // //     marginVertical: 4,
// // // // // //     borderRadius: 1,
// // // // // //   },
  
// // // // // //   /* Dotted Circle Pattern */
// // // // // //   dottedCircle1: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 20,
// // // // // //     right: 30,
// // // // // //     width: 60,
// // // // // //     height: 60,
// // // // // //   },
// // // // // //   dottedCircleDot: {
// // // // // //     position: 'absolute',
// // // // // //     width: 4,
// // // // // //     height: 4,
// // // // // //     borderRadius: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.2,
// // // // // //     top: 28,
// // // // // //     left: 28,
// // // // // //   },
  
// // // // // //   /* Decorative elements */
// // // // // //   decorativeDot1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 60,
// // // // // //     right: 80,
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 3,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.2,
// // // // // //   },
// // // // // //   decorativeDot2: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 40,
// // // // // //     left: 150,
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.15,
// // // // // //   },
// // // // // //   decorativeLine1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 10,
// // // // // //     left: 150,
// // // // // //     width: 40,
// // // // // //     height: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.1,
// // // // // //     borderRadius: 1,
// // // // // //     transform: [{ rotate: '30deg' }],
// // // // // //   },
// // // // // //   decorativeLine2: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 30,
// // // // // //     right: 100,
// // // // // //     width: 50,
// // // // // //     height: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.1,
// // // // // //     borderRadius: 1,
// // // // // //     transform: [{ rotate: '-20deg' }],
// // // // // //   },
  
// // // // // //   /* Header Content */
// // // // // //   headerContent: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     position: 'relative',
// // // // // //     zIndex: 2,
// // // // // //     paddingVertical: 10,
// // // // // //   },
// // // // // //   greeting: {
// // // // // //     fontSize: 16,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   title: {
// // // // // //     fontSize: 26,
// // // // // //     color: COLORS.text,
// // // // // //     lineHeight: 34,
// // // // // //   },
// // // // // //   titleBold: {
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.primary,
// // // // // //   },
// // // // // //   notificationIcon: {
// // // // // //     position: 'relative',
// // // // // //     padding: 8,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 12,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 8,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   notificationBadge: {
// // // // // //     position: 'absolute',
// // // // // //     top: 8,
// // // // // //     right: 8,
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: COLORS.live,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.surface,
// // // // // //   },
  
// // // // // //   /* Rest of the existing styles */
// // // // // //   searchBox: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 18,
// // // // // //     paddingHorizontal: 14,
// // // // // //     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// // // // // //     marginBottom: 12,
// // // // // //     elevation: 2,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 8,
// // // // // //   },
// // // // // //   searchInput: {
// // // // // //     flex: 1,
// // // // // //     marginHorizontal: 10,
// // // // // //     color: COLORS.text,
// // // // // //     fontSize: 14,
// // // // // //     padding: 0,
// // // // // //   },
  
// // // // // //   filtersContainer: {
// // // // // //     paddingVertical: 12,
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   filterChip: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 20,
// // // // // //     marginRight: 8,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.border,
// // // // // //   },
// // // // // //   activeFilterChip: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     borderColor: COLORS.primary,
// // // // // //   },
// // // // // //   filterChipText: {
// // // // // //     color: COLORS.text,
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   activeFilterChipText: {
// // // // // //     color: COLORS.surface,
// // // // // //   },
  
// // // // // //   sliderSection: {
// // // // // //     marginTop: 16,
// // // // // //     marginBottom: 24,
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   slideContainer: {
// // // // // //     width: width - 32,
// // // // // //     height: 160,
// // // // // //     borderRadius: 24,
// // // // // //     overflow: 'hidden',
// // // // // //   },
// // // // // //   sliderImage: {
// // // // // //     width: '100%',
// // // // // //     height: '100%',
// // // // // //   },
// // // // // //   sliderLoading: {
// // // // // //     height: 160,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginVertical: 24,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 24,
// // // // // //   },
// // // // // //   paginationContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     position: 'absolute',
// // // // // //     bottom: 12,
// // // // // //     alignSelf: 'center',
// // // // // //   },
// // // // // //   paginationDot: {
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 3,
// // // // // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // // // // //     marginHorizontal: 3,
// // // // // //   },
// // // // // //   paginationDotActive: {
// // // // // //     backgroundColor: '#FFFFFF',
// // // // // //     width: 16,
// // // // // //   },
  
// // // // // //   /* Patterns Section */
// // // // // //   patternsSection: {
// // // // // //     marginBottom: 28,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   sectionHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     paddingHorizontal: 4,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   sectionSubtitle: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   seeAllButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 4,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 20,
// // // // // //   },
// // // // // //   seeAllText: {
// // // // // //     fontSize: 13,
// // // // // //     color: COLORS.primary,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   patternsList: {
// // // // // //     paddingHorizontal: 4,
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   compactPatternCard: {
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //     width: 60,
// // // // // //   },
// // // // // //   compactIconWrapper: {
// // // // // //     width: 48,
// // // // // //     height: 48,
// // // // // //     borderRadius: 16,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 6,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   compactPatternName: {
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: '500',
// // // // // //     color: COLORS.text,
// // // // // //     textAlign: 'center',
// // // // // //   },
  
// // // // // //   gamesCountContainer: {
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   gamesCount: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     fontWeight: '500',
// // // // // //   },
  
// // // // // //   gameCard: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 24,
// // // // // //     marginBottom: 16,
// // // // // //     overflow: 'hidden',
// // // // // //     elevation: 3,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 4 },
// // // // // //     shadowOpacity: 0.08,
// // // // // //     shadowRadius: 12,
// // // // // //     flexDirection: 'row',
// // // // // //   },
// // // // // //   gameImagePlaceholder: {
// // // // // //     width: 100,
// // // // // //     height: 140,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   gameCardContent: {
// // // // // //     flex: 1,
// // // // // //     padding: 14,
// // // // // //   },
// // // // // //   gameCardHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'flex-start',
// // // // // //     marginBottom: 10,
// // // // // //   },
// // // // // //   gameTitleContainer: {
// // // // // //     flex: 1,
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   gameName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   gameCode: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   statusPill: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 4,
// // // // // //     borderRadius: 12,
// // // // // //     gap: 4,
// // // // // //   },
// // // // // //   statusDot: {
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 3,
// // // // // //   },
// // // // // //   statusPillText: {
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   gameMetaRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     gap: 12,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   metaItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 4,
// // // // // //   },
// // // // // //   metaText: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textSecondary,
// // // // // //   },
// // // // // //   gameFooter: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: COLORS.border,
// // // // // //     paddingTop: 10,
// // // // // //   },
// // // // // //   prizeLabel: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   prizeValue: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //   },
// // // // // //   arrowButton: {
// // // // // //     backgroundColor: COLORS.primary, // Changed from yellow to primary blue
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 18,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: COLORS.primary,
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.2,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 3,
// // // // // //   },
  
// // // // // //   loadingMoreContainer: {
// // // // // //     paddingVertical: 20,
// // // // // //     alignItems: 'center',
// // // // // //   },
  
// // // // // //   emptyGames: {
// // // // // //     alignItems: 'center',
// // // // // //     padding: 40,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 24,
// // // // // //     marginTop: 20,
// // // // // //   },
// // // // // //   emptyGamesText: {
// // // // // //     fontSize: 16,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginTop: 12,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   clearSearchButton: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 10,
// // // // // //     borderRadius: 20,
// // // // // //   },
// // // // // //   clearSearchButtonText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //   },
  
// // // // // //   // Popup Styles
// // // // // //   popupOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 20,
// // // // // //   },
// // // // // //   popupContainer: {
// // // // // //     width: width * 0.8,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 28,
// // // // // //     padding: 24,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupIcon: {
// // // // // //     width: 56,
// // // // // //     height: 56,
// // // // // //     borderRadius: 28,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   popupTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   popupGameName: {
// // // // // //     fontSize: 16,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginBottom: 16,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   popupTimer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 6,
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   popupTimerText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.text,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   popupPrize: {
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   popupPrizeLabel: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   popupPrizeValue: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.primary,
// // // // // //   },
// // // // // //   popupActions: {
// // // // // //     width: '100%',
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   popupPrimaryButton: {
// // // // // //     paddingVertical: 14,
// // // // // //     borderRadius: 20,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupPrimaryButtonText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   popupSecondaryButton: {
// // // // // //     paddingVertical: 10,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupSecondaryButtonText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
  
// // // // // //   // Modal Styles
// // // // // //   modalOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'flex-end',
// // // // // //   },
// // // // // //   modalContent: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderTopLeftRadius: 28,
// // // // // //     borderTopRightRadius: 28,
// // // // // //     padding: 20,
// // // // // //     maxHeight: '80%',
// // // // // //   },
// // // // // //   modalHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     paddingBottom: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: COLORS.border,
// // // // // //   },
// // // // // //   modalTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //   },
// // // // // //   modalLoader: {
// // // // // //     marginVertical: 30,
// // // // // //   },
// // // // // //   notificationItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     paddingVertical: 14,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: COLORS.border,
// // // // // //   },
// // // // // //   notificationIcon: {
// // // // // //     width: 40,
// // // // // //     height: 40,
// // // // // //     borderRadius: 20,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   notificationContent: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   notificationTitle: {
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   notificationMessage: {
// // // // // //     fontSize: 13,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   notificationDate: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   emptyNotifications: {
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 40,
// // // // // //   },
// // // // // //   emptyNotificationsText: {
// // // // // //     marginTop: 12,
// // // // // //     fontSize: 15,
// // // // // //     color: COLORS.textSecondary,
// // // // // //   },
// // // // // // });

// // // // // // export default Home;























// // // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // // import {
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   View,
// // // // // //   Image,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   Modal,
// // // // // //   ActivityIndicator,
// // // // // //   RefreshControl,
// // // // // //   Dimensions,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   TextInput,
// // // // // //   Animated,
// // // // // //   Easing,
// // // // // //   Platform,
// // // // // // } from "react-native";
// // // // // // import axios from "axios";
// // // // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // // import { useNavigation } from '@react-navigation/native';

// // // // // // const { width } = Dimensions.get('window');

// // // // // // // Orange color palette - Consistent orange theme
// // // // // // const COLORS = {
// // // // // //   background: '#FFF7ED', // Light orange background
// // // // // //   surface: '#FFFFFF',
// // // // // //   primary: '#F97316', // Vibrant orange
// // // // // //   primaryLight: '#FFEDD5', // Light orange
// // // // // //   primaryDark: '#C2410C', // Dark orange
// // // // // //   accent: '#FB923C', // Medium orange for accents
// // // // // //   secondary: '#FCD34D', // Light amber/gold
// // // // // //   tertiary: '#EA580C', // Darker orange for contrast
// // // // // //   text: '#1E293B',
// // // // // //   textSecondary: '#64748B',
// // // // // //   textLight: '#94A3B8',
// // // // // //   border: '#FED7AA', // Light orange border
  
// // // // // //   // Card background variants - Orange shades
// // // // // //   cardOrange1: '#FFF7ED',
// // // // // //   cardOrange2: '#FFEDD5',
// // // // // //   cardOrange3: '#FED7AA',
// // // // // //   cardOrange4: '#FDBA74',
// // // // // //   cardOrange5: '#FB923C',
  
// // // // // //   // Accent colors - Orange shades only
// // // // // //   orange: '#F97316',
// // // // // //   orangeLight: '#FFEDD5',
// // // // // //   orangeMedium: '#FB923C',
// // // // // //   orangeDark: '#C2410C',
  
// // // // // //   // Status colors (keeping for clarity)
// // // // // //   live: '#10B981', // Green for live (keeping for contrast)
// // // // // //   scheduled: '#F97316', // Orange for scheduled
// // // // // //   completed: '#94A3B8', // Gray for completed
  
// // // // // //   // Block colors - Orange shades
// // // // // //   blockLightOrange: '#FFEDD5',
// // // // // //   blockMediumOrange: '#FED7AA',
// // // // // //   blockDarkOrange: '#FDBA74',
// // // // // // };

// // // // // // const Home = () => {
// // // // // //   const navigation = useNavigation();
// // // // // //   const [notifications, setNotifications] = useState([]);
// // // // // //   const [sliders, setSliders] = useState([]);
// // // // // //   const [games, setGames] = useState([]);
// // // // // //   const [filteredGames, setFilteredGames] = useState([]);
// // // // // //   const [patterns, setPatterns] = useState([]);
// // // // // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // // // // //   const [activeSlide, setActiveSlide] = useState(0);
// // // // // //   const [modalVisible, setModalVisible] = useState(false);
// // // // // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // // // // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // // // // //   const [loadingGames, setLoadingGames] = useState(true);
// // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // // // //   // Popup state
// // // // // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // // // // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // // // // //   const [popupShown, setPopupShown] = useState(false);
  
// // // // // //   // Animation for popup
// // // // // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // // // // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // // // // //   // Scroll Y position for background animation
// // // // // //   const scrollY = useRef(new Animated.Value(0)).current;
  
// // // // // //   // Pagination state for games
// // // // // //   const [currentPage, setCurrentPage] = useState(1);
// // // // // //   const [lastPage, setLastPage] = useState(1);
// // // // // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // // // // //   const sliderRef = useRef(null);
// // // // // //   const scrollInterval = useRef(null);
// // // // // //   const flatListRef = useRef(null);

// // // // // //   // Filter options
// // // // // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // // // // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // // // // //   useEffect(() => {
// // // // // //     fetchInitialData();
    
// // // // // //     return () => {
// // // // // //       if (scrollInterval.current) {
// // // // // //         clearInterval(scrollInterval.current);
// // // // // //       }
// // // // // //     };
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     if (games.length > 0 && !popupShown) {
// // // // // //       setTimeout(() => {
// // // // // //         checkUpcomingGame();
// // // // // //       }, 1500);
// // // // // //     }
// // // // // //   }, [games, popupShown]);

// // // // // //   useEffect(() => {
// // // // // //     if (sliders.length > 1) {
// // // // // //       startAutoScroll();
// // // // // //     }
// // // // // //     return () => {
// // // // // //       if (scrollInterval.current) {
// // // // // //         clearInterval(scrollInterval.current);
// // // // // //       }
// // // // // //     };
// // // // // //   }, [sliders.length]);

// // // // // //   // Filter games based on search and active filter
// // // // // //   useEffect(() => {
// // // // // //     let filtered = games;
    
// // // // // //     // Apply search filter
// // // // // //     if (searchQuery.trim() !== '') {
// // // // // //       filtered = filtered.filter(game =>
// // // // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // // // //       );
// // // // // //     }
    
// // // // // //     // Apply status filter
// // // // // //     if (activeFilter === 'Live Now') {
// // // // // //       filtered = filtered.filter(game => game.status === 'live');
// // // // // //     } else if (activeFilter === 'Upcoming') {
// // // // // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // // // // //     } else if (activeFilter === 'Completed') {
// // // // // //       filtered = filtered.filter(game => game.status === 'completed');
// // // // // //     }
    
// // // // // //     setFilteredGames(filtered);
// // // // // //   }, [searchQuery, games, activeFilter]);

// // // // // //   useEffect(() => {
// // // // // //     if (upcomingGamePopup) {
// // // // // //       Animated.parallel([
// // // // // //         Animated.timing(opacityAnim, {
// // // // // //           toValue: 1,
// // // // // //           duration: 300,
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //         Animated.timing(slideAnim, {
// // // // // //           toValue: 0,
// // // // // //           duration: 400,
// // // // // //           easing: Easing.out(Easing.back(1.2)),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //       ]).start();
// // // // // //     } else {
// // // // // //       opacityAnim.setValue(0);
// // // // // //       slideAnim.setValue(300);
// // // // // //     }
// // // // // //   }, [upcomingGamePopup]);

// // // // // //   const startAutoScroll = () => {
// // // // // //     if (scrollInterval.current) {
// // // // // //       clearInterval(scrollInterval.current);
// // // // // //     }
    
// // // // // //     scrollInterval.current = setInterval(() => {
// // // // // //       if (sliders.length > 0) {
// // // // // //         let nextIndex = activeSlide + 1;
// // // // // //         if (nextIndex >= sliders.length) {
// // // // // //           nextIndex = 0;
// // // // // //         }
        
// // // // // //         setActiveSlide(nextIndex);
// // // // // //         if (sliderRef.current) {
// // // // // //           const slideWidth = width - 32;
// // // // // //           sliderRef.current.scrollToOffset({
// // // // // //             offset: nextIndex * slideWidth,
// // // // // //             animated: true
// // // // // //           });
// // // // // //         }
// // // // // //       }
// // // // // //     }, 3000);
// // // // // //   };

// // // // // //   const fetchInitialData = async () => {
// // // // // //     try {
// // // // // //       await Promise.all([
// // // // // //         fetchNotifications(),
// // // // // //         fetchSliders(),
// // // // // //         fetchGames(1),
// // // // // //         fetchPatterns()
// // // // // //       ]);
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching initial data:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const onRefresh = React.useCallback(() => {
// // // // // //     setRefreshing(true);
// // // // // //     setCurrentPage(1);
// // // // // //     setGames([]);
// // // // // //     setFilteredGames([]);
// // // // // //     setPopupShown(false);
// // // // // //     Promise.all([
// // // // // //       fetchNotifications(),
// // // // // //       fetchSliders(),
// // // // // //       fetchGames(1),
// // // // // //       fetchPatterns()
// // // // // //     ]).finally(() => setRefreshing(false));
// // // // // //   }, []);

// // // // // //   const checkUpcomingGame = () => {
// // // // // //     try {
// // // // // //       const now = new Date();
      
// // // // // //       const scheduledGames = games.filter(game => 
// // // // // //         game.status === 'scheduled'
// // // // // //       );
      
// // // // // //       if (scheduledGames.length === 0) return;
      
// // // // // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // // // // //         let endDateTime;
        
// // // // // //         try {
// // // // // //           if (game.ticket_request_end_date) {
// // // // // //             endDateTime = new Date(game.ticket_request_end_date);
// // // // // //           } else {
// // // // // //             endDateTime = new Date(game.game_date);
// // // // // //           }
// // // // // //         } catch (e) {
// // // // // //           endDateTime = new Date();
// // // // // //         }
        
// // // // // //         return {
// // // // // //           ...game,
// // // // // //           endDateTime
// // // // // //         };
// // // // // //       });
      
// // // // // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // // // // //       const earliestEndGame = sortedGames[0];
      
// // // // // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // // // // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) { // Show if less than 24 hours left
// // // // // //         setUpcomingGame(earliestEndGame);
// // // // // //         setUpcomingGamePopup(true);
// // // // // //         setPopupShown(true);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error checking upcoming game:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const getTimeRemaining = (endDateTime) => {
// // // // // //     const now = new Date();
// // // // // //     const diff = endDateTime - now;
    
// // // // // //     if (diff <= 0) return "Ending soon";
    
// // // // // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // // // // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // // // // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // // // // //     if (days > 0) {
// // // // // //       return `${days}d ${hours}h left`;
// // // // // //     } else if (hours > 0) {
// // // // // //       return `${hours}h ${minutes}m left`;
// // // // // //     } else {
// // // // // //       return `${minutes}m left`;
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchNotifications = async () => {
// // // // // //     try {
// // // // // //       const token = await AsyncStorage.getItem("token");
// // // // // //       if (!token) return;
// // // // // //       const res = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/notifications",
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
// // // // // //       if (res.data.status) {
// // // // // //         setNotifications(res.data.data);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching notifications:", error);
// // // // // //     } finally {
// // // // // //       setLoadingNotifications(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchSliders = async () => {
// // // // // //     try {
// // // // // //       setLoadingSliders(true);
// // // // // //       const res = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/sliders"
// // // // // //       );
// // // // // //       if (res.data.success) {
// // // // // //         setSliders(res.data.data || []);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching sliders:", error);
// // // // // //       setSliders([]);
// // // // // //     } finally {
// // // // // //       setLoadingSliders(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchGames = async (page = 1) => {
// // // // // //     try {
// // // // // //       if (page === 1) {
// // // // // //         setLoadingGames(true);
// // // // // //       }
      
// // // // // //       const token = await AsyncStorage.getItem("token");
// // // // // //       if (!token) return;
      
// // // // // //       const res = await axios.get(
// // // // // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
      
// // // // // //       if (res.data.success) {
// // // // // //         const newGames = res.data.games.data || [];
// // // // // //         const pagination = res.data.games;
        
// // // // // //         if (page === 1) {
// // // // // //           setGames(newGames);
// // // // // //           setFilteredGames(newGames);
// // // // // //         } else {
// // // // // //           setGames(prev => [...prev, ...newGames]);
// // // // // //           setFilteredGames(prev => [...prev, ...newGames]);
// // // // // //         }
        
// // // // // //         setCurrentPage(pagination.current_page);
// // // // // //         setLastPage(pagination.last_page);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching games:", error);
// // // // // //     } finally {
// // // // // //       if (page === 1) {
// // // // // //         setLoadingGames(false);
// // // // // //       }
// // // // // //       setLoadingMore(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchPatterns = async () => {
// // // // // //     try {
// // // // // //       setLoadingPatterns(true);
// // // // // //       const token = await AsyncStorage.getItem("token");
      
// // // // // //       if (!token) {
// // // // // //         setLoadingPatterns(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       const response = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // // // // //         {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //             Accept: 'application/json',
// // // // // //           },
// // // // // //         }
// // // // // //       );

// // // // // //       if (response.data && response.data.status) {
// // // // // //         const patternsData = response.data.data?.patterns || [];
        
// // // // // //         const patternSequence = [
// // // // // //           'top line',
// // // // // //           'middle line', 
// // // // // //           'bottom line',
// // // // // //           'breakfast',
// // // // // //           'lunch',
// // // // // //           'dinner',
// // // // // //           'four corners',
// // // // // //           'bamboo',
// // // // // //           'early five',
// // // // // //           'non claimers',
// // // // // //           'full house'
// // // // // //         ];
        
// // // // // //         const sortedPatterns = patternsData.sort((a, b) => {
// // // // // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // // // // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // // // // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // // // // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // // // // //           if (aIndex === -1) return 1;
// // // // // //           if (bIndex === -1) return -1;
          
// // // // // //           return aIndex - bIndex;
// // // // // //         });
        
// // // // // //         setPatterns(sortedPatterns.slice(0, 8));
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log('Error fetching patterns in Home:', error);
// // // // // //     } finally {
// // // // // //       setLoadingPatterns(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const loadMoreGames = () => {
// // // // // //     if (!loadingMore && currentPage < lastPage) {
// // // // // //       setLoadingMore(true);
// // // // // //       fetchGames(currentPage + 1);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleGamePress = (game) => {
// // // // // //     navigation.navigate("GameDetails", { game });
// // // // // //   };

// // // // // //   const handleAllGamesPress = () => {
// // // // // //     navigation.navigate("Game");
// // // // // //   };

// // // // // //   const handleAllPatternsPress = () => {
// // // // // //     navigation.navigate("UserGamePatterns");
// // // // // //   };

// // // // // //   const handlePatternPress = (pattern) => {
// // // // // //     navigation.navigate("UserGamePatterns", { 
// // // // // //       selectedPatternId: pattern.id,
// // // // // //       selectedPattern: pattern 
// // // // // //     });
// // // // // //   };

// // // // // //   const handlePopupJoinNow = () => {
// // // // // //     setUpcomingGamePopup(false);
// // // // // //     if (upcomingGame) {
// // // // // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // // // // //     }
// // // // // //   };

// // // // // //   const handlePopupLater = () => {
// // // // // //     setUpcomingGamePopup(false);
// // // // // //   };

// // // // // //   const getPatternIcon = (pattern) => {
// // // // // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // // // // //     const iconMap = {
// // // // // //       'bamboo': 'leaf',
// // // // // //       'bottom line': 'arrow-down',
// // // // // //       'breakfast': 'cafe',
// // // // // //       'dinner': 'restaurant',
// // // // // //       'early five': '5',
// // // // // //       'four corners': 'apps',
// // // // // //       'full house': 'home',
// // // // // //       'lunch': 'fast-food',
// // // // // //       'middle line': 'remove',
// // // // // //       'non claimer': 'close',
// // // // // //       'top line': 'arrow-up'
// // // // // //     };
    
// // // // // //     for (const [key, icon] of Object.entries(iconMap)) {
// // // // // //       if (patternName.includes(key)) return icon;
// // // // // //     }
    
// // // // // //     return 'grid-outline';
// // // // // //   };

// // // // // //   const formatPatternName = (name) => {
// // // // // //     if (!name) return 'Unknown Pattern';
// // // // // //     return name
// // // // // //       .split('_')
// // // // // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // // // // //       .join(' ');
// // // // // //   };

// // // // // //   const renderPatternCard = (pattern, index) => {
// // // // // //     const icon = getPatternIcon(pattern);
// // // // // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // // // // //     // Different orange shades for each pattern
// // // // // //     const bgColors = [
// // // // // //       '#F97316', // Vibrant orange
// // // // // //       '#FB923C', // Medium orange
// // // // // //       '#FDBA74', // Light orange
// // // // // //       '#F59E0B', // Amber
// // // // // //       '#EA580C', // Dark orange
// // // // // //       '#C2410C', // Very dark orange
// // // // // //       '#D97706', // Golden orange
// // // // // //       '#B45309', // Brownish orange
// // // // // //     ];
    
// // // // // //     const patternName = displayName.length > 10 ? displayName.substring(0, 10) + '...' : displayName;
// // // // // //     const bgColor = bgColors[index % bgColors.length];
    
// // // // // //     return (
// // // // // //       <TouchableOpacity 
// // // // // //         key={pattern.id} 
// // // // // //         style={styles.compactPatternCard}
// // // // // //         onPress={() => handlePatternPress(pattern)}
// // // // // //         activeOpacity={0.7}
// // // // // //       >
// // // // // //         <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
// // // // // //           <Ionicons name={icon} size={18} color="#FFFFFF" />
// // // // // //         </View>
// // // // // //         <Text style={styles.compactPatternName} numberOfLines={1}>
// // // // // //           {patternName}
// // // // // //         </Text>
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   const renderSliderItem = ({ item }) => (
// // // // // //     <View style={styles.slideContainer}>
// // // // // //       <Image
// // // // // //         source={{ 
// // // // // //           uri: item.image_url || 'https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg'
// // // // // //         }}
// // // // // //         style={styles.sliderImage}
// // // // // //         resizeMode="cover"
// // // // // //       />
// // // // // //     </View>
// // // // // //   );

// // // // // //   const handleScroll = (event) => {
// // // // // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // // // // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // // // // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // // // // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // // // // //       setActiveSlide(currentIndex);
// // // // // //     }
// // // // // //   };

// // // // // //   // Handle main scroll for background animation
// // // // // //   const handleMainScroll = Animated.event(
// // // // // //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // // // // //     { useNativeDriver: false }
// // // // // //   );

// // // // // //   const renderPagination = () => {
// // // // // //     if (sliders.length <= 1) return null;
    
// // // // // //     return (
// // // // // //       <View style={styles.paginationContainer}>
// // // // // //         {sliders.map((_, index) => (
// // // // // //           <View
// // // // // //             key={index}
// // // // // //             style={[
// // // // // //               styles.paginationDot,
// // // // // //               activeSlide === index && styles.paginationDotActive,
// // // // // //             ]}
// // // // // //           />
// // // // // //         ))}
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   const renderGameCard = ({ item: game }) => {
// // // // // //     if (!game) return null;
    
// // // // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // // // //     const isLive = game.status === 'live';
// // // // // //     const isScheduled = game.status === 'scheduled';
// // // // // //     const isCompleted = game.status === 'completed';
    
// // // // // //     // Get status color
// // // // // //     let statusColor = COLORS.scheduled;
// // // // // //     let statusText = 'Upcoming';
// // // // // //     if (isLive) {
// // // // // //       statusColor = COLORS.live;
// // // // // //       statusText = 'Live Now';
// // // // // //     } else if (isCompleted) {
// // // // // //       statusColor = COLORS.completed;
// // // // // //       statusText = 'Completed';
// // // // // //     }
    
// // // // // //     return (
// // // // // //       <TouchableOpacity
// // // // // //         style={styles.gameCard}
// // // // // //         activeOpacity={0.9}
// // // // // //         onPress={() => handleGamePress(game)}
// // // // // //       >
// // // // // //         <View style={[styles.gameImagePlaceholder, { backgroundColor: COLORS.primaryLight }]}>
// // // // // //           <MaterialIcons name="sports-esports" size={32} color={COLORS.primary} />
// // // // // //         </View>
        
// // // // // //         <View style={styles.gameCardContent}>
// // // // // //           <View style={styles.gameCardHeader}>
// // // // // //             <View style={styles.gameTitleContainer}>
// // // // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // // // //                 {game.game_name || "Tambola Game"}
// // // // // //               </Text>
// // // // // //               <Text style={styles.gameCode}>
// // // // // //                 #{game.game_code || "N/A"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //             <View style={[styles.statusPill, { backgroundColor: `${statusColor}20` }]}>
// // // // // //               <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
// // // // // //               <Text style={[styles.statusPillText, { color: statusColor }]}>
// // // // // //                 {statusText}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.gameMetaRow}>
// // // // // //             <View style={styles.metaItem}>
// // // // // //               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
// // // // // //               <Text style={styles.metaText}>
// // // // // //                 {game.game_date_formatted || game.game_date || "TBA"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //             <View style={styles.metaItem}>
// // // // // //               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
// // // // // //               <Text style={styles.metaText}>
// // // // // //                 {game.game_time_formatted || game.game_start_time || "TBA"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.gameFooter}>
// // // // // //             <View>
// // // // // //               <Text style={styles.prizeLabel}>Prize Pool</Text>
// // // // // //               <Text style={styles.prizeValue}>
// // // // // //                 {game.ticket_type === "paid" && game.max_tickets 
// // // // // //                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // // // // //                   : "Exciting Prizes"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //             <View style={styles.arrowButton}>
// // // // // //               <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   const clearSearch = () => {
// // // // // //     setSearchQuery('');
// // // // // //   };

// // // // // //   const renderFooter = () => {
// // // // // //     if (!loadingMore) return null;
// // // // // //     return (
// // // // // //       <View style={styles.loadingMoreContainer}>
// // // // // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   const UpcomingGamePopup = () => {
// // // // // //     if (!upcomingGame) return null;
    
// // // // // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // // // // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // // // // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // // // // //     return (
// // // // // //       <Modal
// // // // // //         visible={upcomingGamePopup}
// // // // // //         transparent={true}
// // // // // //         animationType="fade"
// // // // // //         onRequestClose={handlePopupLater}
// // // // // //       >
// // // // // //         <View style={styles.popupOverlay}>
// // // // // //           <Animated.View 
// // // // // //             style={[
// // // // // //               styles.popupContainer,
// // // // // //               {
// // // // // //                 opacity: opacityAnim,
// // // // // //                 transform: [{ translateY: slideAnim }]
// // // // // //               }
// // // // // //             ]}
// // // // // //           >
// // // // // //             <View style={[styles.popupIcon, { backgroundColor: COLORS.primaryLight }]}>
// // // // // //               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
// // // // // //             </View>
            
// // // // // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // // // // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // // // // //             <View style={styles.popupTimer}>
// // // // // //               <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
// // // // // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // // // // //             </View>
            
// // // // // //             <View style={styles.popupPrize}>
// // // // // //               <Text style={styles.popupPrizeLabel}>Prize Pool</Text>
// // // // // //               <Text style={styles.popupPrizeValue}>
// // // // // //                 {upcomingGame.ticket_type === "paid" && upcomingGame.max_tickets
// // // // // //                   ? `₹${(ticketCost * upcomingGame.max_tickets).toLocaleString()}`
// // // // // //                   : "Exciting Prizes"}
// // // // // //               </Text>
// // // // // //             </View>
            
// // // // // //             <View style={styles.popupActions}>
// // // // // //               <TouchableOpacity 
// // // // // //                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
// // // // // //                 onPress={handlePopupJoinNow}
// // // // // //               >
// // // // // //                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // // // // //               </TouchableOpacity>
              
// // // // // //               <TouchableOpacity 
// // // // // //                 style={styles.popupSecondaryButton}
// // // // // //                 onPress={handlePopupLater}
// // // // // //               >
// // // // // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </Animated.View>
// // // // // //         </View>
// // // // // //       </Modal>
// // // // // //     );
// // // // // //   };

// // // // // //   // Animated background that moves with scroll
// // // // // //   const AnimatedBackground = () => {
// // // // // //     // Interpolate scroll position to create parallax effect
// // // // // //     const block1TranslateY = scrollY.interpolate({
// // // // // //       inputRange: [0, 300],
// // // // // //       outputRange: [0, -50],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     const block2TranslateY = scrollY.interpolate({
// // // // // //       inputRange: [0, 400],
// // // // // //       outputRange: [0, -30],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     const block3TranslateY = scrollY.interpolate({
// // // // // //       inputRange: [0, 500],
// // // // // //       outputRange: [0, -20],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     const opacity = scrollY.interpolate({
// // // // // //       inputRange: [0, 200, 400],
// // // // // //       outputRange: [1, 0.8, 0.6],
// // // // // //       extrapolate: 'clamp'
// // // // // //     });

// // // // // //     return (
// // // // // //       <>
// // // // // //         <Animated.View 
// // // // // //           style={[
// // // // // //             styles.orangeBlock1,
// // // // // //             {
// // // // // //               transform: [{ translateY: block1TranslateY }],
// // // // // //               opacity
// // // // // //             }
// // // // // //           ]} 
// // // // // //         />
// // // // // //         <Animated.View 
// // // // // //           style={[
// // // // // //             styles.orangeBlock2,
// // // // // //             {
// // // // // //               transform: [{ translateY: block2TranslateY }],
// // // // // //               opacity: opacity.interpolate({
// // // // // //                 inputRange: [0.6, 1],
// // // // // //                 outputRange: [0.4, 0.8]
// // // // // //               })
// // // // // //             }
// // // // // //           ]} 
// // // // // //         />
// // // // // //         <Animated.View 
// // // // // //           style={[
// // // // // //             styles.orangeBlock3,
// // // // // //             {
// // // // // //               transform: [{ translateY: block3TranslateY }],
// // // // // //               opacity: opacity.interpolate({
// // // // // //                 inputRange: [0.6, 1],
// // // // // //                 outputRange: [0.2, 0.5]
// // // // // //               })
// // // // // //             }
// // // // // //           ]} 
// // // // // //         />
// // // // // //       </>
// // // // // //     );
// // // // // //   };

// // // // // //   // Enhanced Header with semicircle shape and UK-style rounded lines
// // // // // //   const Header = () => (
// // // // // //     <View style={styles.headerWrapper}>
// // // // // //       {/* Semicircle Background */}
// // // // // //       <View style={styles.semicircleBackground}>
// // // // // //         <View style={styles.semicircle} />
// // // // // //       </View>
      
// // // // // //       {/* UK-style Rounded Lines Pattern */}
// // // // // //       <View style={styles.ukPatternContainer}>
// // // // // //         {/* Curved Lines - Like tube map style */}
// // // // // //         <View style={styles.curvedLine1} />
// // // // // //         <View style={styles.curvedLine2} />
// // // // // //         <View style={styles.curvedLine3} />
        
// // // // // //         {/* Parallel Lines */}
// // // // // //         <View style={styles.parallelLines}>
// // // // // //           <View style={styles.parallelLine} />
// // // // // //           <View style={styles.parallelLine} />
// // // // // //           <View style={styles.parallelLine} />
// // // // // //         </View>
        
// // // // // //         {/* Dotted Circle Pattern */}
// // // // // //         <View style={styles.dottedCircle1}>
// // // // // //           {[...Array(8)].map((_, i) => (
// // // // // //             <View 
// // // // // //               key={i} 
// // // // // //               style={[
// // // // // //                 styles.dottedCircleDot,
// // // // // //                 {
// // // // // //                   transform: [
// // // // // //                     { rotate: `${i * 45}deg` },
// // // // // //                     { translateX: 30 }
// // // // // //                   ]
// // // // // //                 }
// // // // // //               ]} 
// // // // // //             />
// // // // // //           ))}
// // // // // //         </View>
        
// // // // // //         {/* Small decorative elements */}
// // // // // //         <View style={styles.decorativeDot1} />
// // // // // //         <View style={styles.decorativeDot2} />
// // // // // //         <View style={styles.decorativeLine1} />
// // // // // //         <View style={styles.decorativeLine2} />
// // // // // //       </View>

// // // // // //       {/* Header Content */}
// // // // // //       <View style={styles.headerContent}>
// // // // // //         <View>
// // // // // //           <Text style={styles.greeting}>Let's play your</Text>
// // // // // //           <Text style={styles.title}>
// // // // // //             favorite <Text style={styles.titleBold}>Tambola!</Text>
// // // // // //           </Text>
// // // // // //         </View>
// // // // // //         <TouchableOpacity onPress={() => setModalVisible(true)}>
// // // // // //           <View style={styles.notificationIcon}>
// // // // // //             <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
// // // // // //             {notifications.length > 0 && (
// // // // // //               <View style={styles.notificationBadge} />
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   if (loadingGames && games.length === 0) {
// // // // // //     return (
// // // // // //       <SafeAreaView style={styles.safeArea}>
// // // // // //         <View style={styles.loadingContainer}>
// // // // // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // // // // //         </View>
// // // // // //       </SafeAreaView>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

// // // // // //       <View style={styles.container}>
// // // // // //         {/* Animated Color Blocks - Orange Shades that move with scroll */}
// // // // // //         <AnimatedBackground />

// // // // // //         <Animated.FlatList
// // // // // //           ref={flatListRef}
// // // // // //           data={filteredGames}
// // // // // //           renderItem={renderGameCard}
// // // // // //           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //           refreshControl={
// // // // // //             <RefreshControl
// // // // // //               refreshing={refreshing}
// // // // // //               onRefresh={onRefresh}
// // // // // //               tintColor={COLORS.primary}
// // // // // //               colors={[COLORS.primary]}
// // // // // //             />
// // // // // //           }
// // // // // //           onEndReached={loadMoreGames}
// // // // // //           onEndReachedThreshold={0.5}
// // // // // //           ListFooterComponent={renderFooter}
// // // // // //           onScroll={handleMainScroll}
// // // // // //           scrollEventThrottle={16}
// // // // // //           ListHeaderComponent={
// // // // // //             <>
// // // // // //               {/* Enhanced Header with Semicircle and UK Pattern */}
// // // // // //               <Header />

// // // // // //               {/* Search */}
// // // // // //               <View style={styles.searchBox}>
// // // // // //                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
// // // // // //                 <TextInput
// // // // // //                   placeholder="Search games by name or ID..."
// // // // // //                   placeholderTextColor={COLORS.textLight}
// // // // // //                   style={styles.searchInput}
// // // // // //                   value={searchQuery}
// // // // // //                   onChangeText={setSearchQuery}
// // // // // //                   returnKeyType="search"
// // // // // //                 />
// // // // // //                 {searchQuery.length > 0 ? (
// // // // // //                   <TouchableOpacity onPress={clearSearch}>
// // // // // //                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// // // // // //                   </TouchableOpacity>
// // // // // //                 ) : (
// // // // // //                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
// // // // // //                 )}
// // // // // //               </View>

// // // // // //               {/* Filter Chips */}
// // // // // //               <ScrollView
// // // // // //                 horizontal
// // // // // //                 showsHorizontalScrollIndicator={false}
// // // // // //                 contentContainerStyle={styles.filtersContainer}
// // // // // //               >
// // // // // //                 {filters.map((filter) => (
// // // // // //                   <TouchableOpacity
// // // // // //                     key={filter}
// // // // // //                     style={[
// // // // // //                       styles.filterChip,
// // // // // //                       activeFilter === filter && styles.activeFilterChip,
// // // // // //                     ]}
// // // // // //                     onPress={() => setActiveFilter(filter)}
// // // // // //                   >
// // // // // //                     <Text
// // // // // //                       style={[
// // // // // //                         styles.filterChipText,
// // // // // //                         activeFilter === filter && styles.activeFilterChipText,
// // // // // //                       ]}
// // // // // //                     >
// // // // // //                       {filter}
// // // // // //                     </Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 ))}
// // // // // //               </ScrollView>

// // // // // //               {/* Slider Section */}
// // // // // //               {loadingSliders ? (
// // // // // //                 <View style={styles.sliderLoading}>
// // // // // //                   <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //                 </View>
// // // // // //               ) : sliders.length > 0 ? (
// // // // // //                 <View style={styles.sliderSection}>
// // // // // //                   <FlatList
// // // // // //                     ref={sliderRef}
// // // // // //                     data={sliders}
// // // // // //                     renderItem={renderSliderItem}
// // // // // //                     keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // // // // //                     horizontal
// // // // // //                     pagingEnabled
// // // // // //                     showsHorizontalScrollIndicator={false}
// // // // // //                     onScroll={handleScroll}
// // // // // //                     scrollEventThrottle={16}
// // // // // //                     getItemLayout={(data, index) => ({
// // // // // //                       length: width - 32,
// // // // // //                       offset: (width - 32) * index,
// // // // // //                       index,
// // // // // //                     })}
// // // // // //                   />
// // // // // //                   {renderPagination()}
// // // // // //                 </View>
// // // // // //               ) : null}

// // // // // //               {/* Patterns Section - Redesigned with orange shades */}
// // // // // //               {patterns.length > 0 && (
// // // // // //                 <View style={styles.patternsSection}>
// // // // // //                   <View style={styles.sectionHeader}>
// // // // // //                     <View>
// // // // // //                       <Text style={styles.sectionTitle}>Game Patterns</Text>
// // // // // //                       <Text style={styles.sectionSubtitle}>Popular winning combinations</Text>
// // // // // //                     </View>
// // // // // //                     <TouchableOpacity onPress={handleAllPatternsPress}>
// // // // // //                       <View style={styles.seeAllButton}>
// // // // // //                         <Text style={styles.seeAllText}>See All</Text>
// // // // // //                         <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
// // // // // //                       </View>
// // // // // //                     </TouchableOpacity>
// // // // // //                   </View>

// // // // // //                   {loadingPatterns ? (
// // // // // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //                   ) : (
// // // // // //                     <ScrollView 
// // // // // //                       horizontal 
// // // // // //                       showsHorizontalScrollIndicator={false}
// // // // // //                       contentContainerStyle={styles.patternsList}
// // // // // //                     >
// // // // // //                       {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // // // // //                     </ScrollView>
// // // // // //                   )}
// // // // // //                 </View>
// // // // // //               )}

// // // // // //               {/* Games Count */}
// // // // // //               <View style={styles.gamesCountContainer}>
// // // // // //                 <Text style={styles.gamesCount}>
// // // // // //                   {filteredGames.length} {filteredGames.length === 1 ? 'Game' : 'Games'} Available
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </>
// // // // // //           }
// // // // // //           ListEmptyComponent={
// // // // // //             <View style={styles.emptyGames}>
// // // // // //               <Ionicons name="game-controller-outline" size={48} color={COLORS.textLight} />
// // // // // //               <Text style={styles.emptyGamesText}>
// // // // // //                 {searchQuery ? 'No games found' : 'No games available'}
// // // // // //               </Text>
// // // // // //               {searchQuery && (
// // // // // //                 <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
// // // // // //                   <Text style={styles.clearSearchButtonText}>Clear Search</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               )}
// // // // // //             </View>
// // // // // //           }
// // // // // //         />

// // // // // //         {/* Popup */}
// // // // // //         <UpcomingGamePopup />

// // // // // //         {/* Notifications Modal */}
// // // // // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // // // // //           <View style={styles.modalOverlay}>
// // // // // //             <View style={styles.modalContent}>
// // // // // //               <View style={styles.modalHeader}>
// // // // // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // // // // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // // // // //                   <Ionicons name="close" size={24} color={COLORS.text} />
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>

// // // // // //               {loadingNotifications ? (
// // // // // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalLoader} />
// // // // // //               ) : (
// // // // // //                 <FlatList
// // // // // //                   data={notifications}
// // // // // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // //                   renderItem={({ item }) => (
// // // // // //                     <View style={styles.notificationItem}>
// // // // // //                       <View style={styles.notificationIcon}>
// // // // // //                         <Ionicons name="notifications" size={20} color={COLORS.primary} />
// // // // // //                       </View>
// // // // // //                       <View style={styles.notificationContent}>
// // // // // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // // // // //                         <Text style={styles.notificationMessage}>
// // // // // //                           {item.message || "Check out the new features!"}
// // // // // //                         </Text>
// // // // // //                         <Text style={styles.notificationDate}>
// // // // // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // // // // //                         </Text>
// // // // // //                       </View>
// // // // // //                     </View>
// // // // // //                   )}
// // // // // //                   ListEmptyComponent={
// // // // // //                     <View style={styles.emptyNotifications}>
// // // // // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // // // // //                       <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
// // // // // //                     </View>
// // // // // //                   }
// // // // // //                 />
// // // // // //               )}
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </Modal>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   safeArea: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //   },
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //     paddingHorizontal: 16,
// // // // // //   },
  
// // // // // //   /* COLOR BLOCKS - Orange Shades - Now Animated */
// // // // // //   orangeBlock1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 280,
// // // // // //     backgroundColor: COLORS.blockLightOrange,
// // // // // //     borderBottomLeftRadius: 50,
// // // // // //     borderBottomRightRadius: 50,
// // // // // //   },
// // // // // //   orangeBlock2: {
// // // // // //     position: 'absolute',
// // // // // //     top: 200,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 160,
// // // // // //     backgroundColor: COLORS.blockMediumOrange,
// // // // // //   },
// // // // // //   orangeBlock3: {
// // // // // //     position: 'absolute',
// // // // // //     top: 300,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     height: 100,
// // // // // //     backgroundColor: COLORS.blockDarkOrange,
// // // // // //     opacity: 0.3,
// // // // // //   },
  
// // // // // //   loadingContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
  
// // // // // //   /* Enhanced Header with Semicircle and UK Pattern */
// // // // // //   headerWrapper: {
// // // // // //     position: 'relative',
// // // // // //     marginTop: 8,
// // // // // //     marginBottom: 8,
// // // // // //     overflow: 'hidden',
// // // // // //   },

// // // // // //   /* Header Content */
// // // // // //   headerContent: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     position: 'relative',
// // // // // //     zIndex: 2,
// // // // // //     paddingVertical: 10,
// // // // // //   },

// // // // // //   greeting: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginBottom: 2,
// // // // // //   },

// // // // // //   title: {
// // // // // //     fontSize: 24,
// // // // // //     color: COLORS.text,
// // // // // //   },
  
// // // // // //   /* Search Box */
// // // // // //   searchBox: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 18,
// // // // // //     paddingHorizontal: 14,
// // // // // //     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// // // // // //     marginBottom: 12,
// // // // // //     elevation: 2,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 8,
// // // // // //   },
  
// // // // // //   /* Semicircle Background */
// // // // // //   semicircleBackground: {
// // // // // //     position: 'absolute',
// // // // // //     top: -40,
// // // // // //     right: -30,
// // // // // //     width: 200,
// // // // // //     height: 200,
// // // // // //     overflow: 'hidden',
// // // // // //   },
// // // // // //   semicircle: {
// // // // // //     position: 'absolute',
// // // // // //     width: 400,
// // // // // //     height: 200,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     borderTopLeftRadius: 200,
// // // // // //     borderTopRightRadius: 200,
// // // // // //     transform: [{ rotate: '-15deg' }],
// // // // // //     opacity: 0.3,
// // // // // //   },
  
// // // // // //   /* UK-style Rounded Lines Pattern */
// // // // // //   ukPatternContainer: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     bottom: 0,
// // // // // //   },
  
// // // // // //   /* Curved Lines - Like tube map */
// // // // // //   curvedLine1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 20,
// // // // // //     right: 50,
// // // // // //     width: 80,
// // // // // //     height: 40,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     borderTopWidth: 0,
// // // // // //     borderRightWidth: 0,
// // // // // //     borderRadius: 40,
// // // // // //     opacity: 0.15,
// // // // // //     transform: [{ rotate: '-10deg' }],
// // // // // //   },
// // // // // //   curvedLine2: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 10,
// // // // // //     left: 30,
// // // // // //     width: 60,
// // // // // //     height: 30,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     borderBottomWidth: 0,
// // // // // //     borderLeftWidth: 0,
// // // // // //     borderRadius: 30,
// // // // // //     opacity: 0.15,
// // // // // //     transform: [{ rotate: '15deg' }],
// // // // // //   },
// // // // // //   curvedLine3: {
// // // // // //     position: 'absolute',
// // // // // //     top: 40,
// // // // // //     left: 100,
// // // // // //     width: 100,
// // // // // //     height: 50,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     borderTopWidth: 0,
// // // // // //     borderLeftWidth: 0,
// // // // // //     borderRadius: 50,
// // // // // //     opacity: 0.1,
// // // // // //     transform: [{ rotate: '20deg' }],
// // // // // //   },
  
// // // // // //   /* Parallel Lines */
// // // // // //   parallelLines: {
// // // // // //     position: 'absolute',
// // // // // //     top: 30,
// // // // // //     left: 20,
// // // // // //   },
// // // // // //   parallelLine: {
// // // // // //     width: 80,
// // // // // //     height: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.1,
// // // // // //     marginVertical: 4,
// // // // // //     borderRadius: 1,
// // // // // //   },
  
// // // // // //   /* Dotted Circle Pattern */
// // // // // //   dottedCircle1: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 20,
// // // // // //     right: 30,
// // // // // //     width: 60,
// // // // // //     height: 60,
// // // // // //   },
// // // // // //   dottedCircleDot: {
// // // // // //     position: 'absolute',
// // // // // //     width: 4,
// // // // // //     height: 4,
// // // // // //     borderRadius: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.2,
// // // // // //     top: 28,
// // // // // //     left: 28,
// // // // // //   },
  
// // // // // //   /* Decorative elements */
// // // // // //   decorativeDot1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 60,
// // // // // //     right: 80,
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 3,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.2,
// // // // // //   },
// // // // // //   decorativeDot2: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 40,
// // // // // //     left: 150,
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.15,
// // // // // //   },
// // // // // //   decorativeLine1: {
// // // // // //     position: 'absolute',
// // // // // //     top: 10,
// // // // // //     left: 150,
// // // // // //     width: 40,
// // // // // //     height: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.1,
// // // // // //     borderRadius: 1,
// // // // // //     transform: [{ rotate: '30deg' }],
// // // // // //   },
// // // // // //   decorativeLine2: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 30,
// // // // // //     right: 100,
// // // // // //     width: 50,
// // // // // //     height: 2,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     opacity: 0.1,
// // // // // //     borderRadius: 1,
// // // // // //     transform: [{ rotate: '-20deg' }],
// // // // // //   },
  
// // // // // //   titleBold: {
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.primary,
// // // // // //   },
// // // // // //   notificationIcon: {
// // // // // //     position: 'relative',
// // // // // //     padding: 8,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 12,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 8,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   notificationBadge: {
// // // // // //     position: 'absolute',
// // // // // //     top: 8,
// // // // // //     right: 8,
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: COLORS.live,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.surface,
// // // // // //   },
  
// // // // // //   searchInput: {
// // // // // //     flex: 1,
// // // // // //     marginHorizontal: 10,
// // // // // //     color: COLORS.text,
// // // // // //     fontSize: 14,
// // // // // //     padding: 0,
// // // // // //   },
  
// // // // // //   filtersContainer: {
// // // // // //     paddingVertical: 12,
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   filterChip: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 20,
// // // // // //     marginRight: 8,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.border,
// // // // // //   },
// // // // // //   activeFilterChip: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     borderColor: COLORS.primary,
// // // // // //   },
// // // // // //   filterChipText: {
// // // // // //     color: COLORS.text,
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   activeFilterChipText: {
// // // // // //     color: COLORS.surface,
// // // // // //   },
  
// // // // // //   sliderSection: {
// // // // // //     marginTop: 16,
// // // // // //     marginBottom: 24,
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   slideContainer: {
// // // // // //     width: width - 32,
// // // // // //     height: 160,
// // // // // //     borderRadius: 24,
// // // // // //     overflow: 'hidden',
// // // // // //   },
// // // // // //   sliderImage: {
// // // // // //     width: '100%',
// // // // // //     height: '100%',
// // // // // //   },
// // // // // //   sliderLoading: {
// // // // // //     height: 160,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginVertical: 24,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 24,
// // // // // //   },
// // // // // //   paginationContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     position: 'absolute',
// // // // // //     bottom: 12,
// // // // // //     alignSelf: 'center',
// // // // // //   },
// // // // // //   paginationDot: {
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 3,
// // // // // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // // // // //     marginHorizontal: 3,
// // // // // //   },
// // // // // //   paginationDotActive: {
// // // // // //     backgroundColor: '#FFFFFF',
// // // // // //     width: 16,
// // // // // //   },
  
// // // // // //   /* Patterns Section */
// // // // // //   patternsSection: {
// // // // // //     marginBottom: 28,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   sectionHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     paddingHorizontal: 4,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   sectionSubtitle: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   seeAllButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 4,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 20,
// // // // // //   },
// // // // // //   seeAllText: {
// // // // // //     fontSize: 13,
// // // // // //     color: COLORS.primary,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   patternsList: {
// // // // // //     paddingHorizontal: 4,
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   compactPatternCard: {
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //     width: 60,
// // // // // //   },
// // // // // //   compactIconWrapper: {
// // // // // //     width: 48,
// // // // // //     height: 48,
// // // // // //     borderRadius: 16,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 6,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   compactPatternName: {
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: '500',
// // // // // //     color: COLORS.text,
// // // // // //     textAlign: 'center',
// // // // // //   },
  
// // // // // //   gamesCountContainer: {
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   gamesCount: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     fontWeight: '500',
// // // // // //   },
  
// // // // // //   gameCard: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 24,
// // // // // //     marginBottom: 16,
// // // // // //     overflow: 'hidden',
// // // // // //     elevation: 3,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 4 },
// // // // // //     shadowOpacity: 0.08,
// // // // // //     shadowRadius: 12,
// // // // // //     flexDirection: 'row',
// // // // // //   },
// // // // // //   gameImagePlaceholder: {
// // // // // //     width: 100,
// // // // // //     height: 140,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   gameCardContent: {
// // // // // //     flex: 1,
// // // // // //     padding: 14,
// // // // // //   },
// // // // // //   gameCardHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'flex-start',
// // // // // //     marginBottom: 10,
// // // // // //   },
// // // // // //   gameTitleContainer: {
// // // // // //     flex: 1,
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   gameName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   gameCode: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   statusPill: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 4,
// // // // // //     borderRadius: 12,
// // // // // //     gap: 4,
// // // // // //   },
// // // // // //   statusDot: {
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 3,
// // // // // //   },
// // // // // //   statusPillText: {
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   gameMetaRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     gap: 12,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   metaItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 4,
// // // // // //   },
// // // // // //   metaText: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textSecondary,
// // // // // //   },
// // // // // //   gameFooter: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: COLORS.border,
// // // // // //     paddingTop: 10,
// // // // // //   },
// // // // // //   prizeLabel: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   prizeValue: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //   },
// // // // // //   arrowButton: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 18,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: COLORS.primary,
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.2,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 3,
// // // // // //   },
  
// // // // // //   loadingMoreContainer: {
// // // // // //     paddingVertical: 20,
// // // // // //     alignItems: 'center',
// // // // // //   },
  
// // // // // //   emptyGames: {
// // // // // //     alignItems: 'center',
// // // // // //     padding: 40,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 24,
// // // // // //     marginTop: 20,
// // // // // //   },
// // // // // //   emptyGamesText: {
// // // // // //     fontSize: 16,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginTop: 12,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   clearSearchButton: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 10,
// // // // // //     borderRadius: 20,
// // // // // //   },
// // // // // //   clearSearchButtonText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //   },
  
// // // // // //   // Popup Styles
// // // // // //   popupOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 20,
// // // // // //   },
// // // // // //   popupContainer: {
// // // // // //     width: width * 0.8,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 28,
// // // // // //     padding: 24,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupIcon: {
// // // // // //     width: 56,
// // // // // //     height: 56,
// // // // // //     borderRadius: 28,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   popupTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   popupGameName: {
// // // // // //     fontSize: 16,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginBottom: 16,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   popupTimer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 6,
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   popupTimerText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.text,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   popupPrize: {
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   popupPrizeLabel: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   popupPrizeValue: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.primary,
// // // // // //   },
// // // // // //   popupActions: {
// // // // // //     width: '100%',
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   popupPrimaryButton: {
// // // // // //     paddingVertical: 14,
// // // // // //     borderRadius: 20,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupPrimaryButtonText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   popupSecondaryButton: {
// // // // // //     paddingVertical: 10,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupSecondaryButtonText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
  
// // // // // //   // Modal Styles
// // // // // //   modalOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'flex-end',
// // // // // //   },
// // // // // //   modalContent: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderTopLeftRadius: 28,
// // // // // //     borderTopRightRadius: 28,
// // // // // //     padding: 20,
// // // // // //     maxHeight: '80%',
// // // // // //   },
// // // // // //   modalHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     paddingBottom: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: COLORS.border,
// // // // // //   },
// // // // // //   modalTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.text,
// // // // // //   },
// // // // // //   modalLoader: {
// // // // // //     marginVertical: 30,
// // // // // //   },
// // // // // //   notificationItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     paddingVertical: 14,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: COLORS.border,
// // // // // //   },
// // // // // //   notificationIcon: {
// // // // // //     width: 40,
// // // // // //     height: 40,
// // // // // //     borderRadius: 20,
// // // // // //     backgroundColor: COLORS.primaryLight,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   notificationContent: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   notificationTitle: {
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.text,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   notificationMessage: {
// // // // // //     fontSize: 13,
// // // // // //     color: COLORS.textSecondary,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   notificationDate: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   emptyNotifications: {
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 40,
// // // // // //   },
// // // // // //   emptyNotificationsText: {
// // // // // //     marginTop: 12,
// // // // // //     fontSize: 15,
// // // // // //     color: COLORS.textSecondary,
// // // // // //   },
// // // // // // });

// // // // // // export default Home;



// // // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // // import {
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   View,
// // // // // //   Image,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   Modal,
// // // // // //   ActivityIndicator,
// // // // // //   RefreshControl,
// // // // // //   Dimensions,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   TextInput,
// // // // // //   Animated,
// // // // // //   Easing,
// // // // // //   Platform,
// // // // // // } from "react-native";
// // // // // // import axios from "axios";
// // // // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // // import { useNavigation } from '@react-navigation/native';

// // // // // // const { width } = Dimensions.get('window');

// // // // // // // Color scheme matching the reference design
// // // // // // const COLORS = {
// // // // // //   primary: "#4facfe", // Main blue color
// // // // // //   accent: "#ff9800", // Orange accent
// // // // // //   background: "#f5f8ff", // Light background
// // // // // //   surface: "#FFFFFF",
// // // // // //   textDark: "#333333",
// // // // // //   textLight: "#777777",
// // // // // //   border: "#EEEEEE",
  
// // // // // //   // Status colors
// // // // // //   live: "#4CAF50",
// // // // // //   scheduled: "#ff9800",
// // // // // //   completed: "#ff9800",
  
// // // // // //   // Quick action colors
// // // // // //   deposit: "#4facfe",
// // // // // //   withdraw: "#FF6B6B",
// // // // // //   refer: "#4ECDC4",
// // // // // //   support: "#9B59B6",
  
// // // // // //   // Pattern card colors - keeping original circle colors
// // // // // //   patternColors: [
// // // // // //     '#2E5BFF', // Blue
// // // // // //     '#F59E0B', // Orange
// // // // // //     '#10B981', // Green
// // // // // //     '#EF4444', // Red
// // // // // //     '#8B5CF6', // Purple
// // // // // //     '#EC4899', // Pink
// // // // // //     '#06B6D4', // Cyan
// // // // // //     '#F97316', // Orange
// // // // // //   ],
// // // // // // };

// // // // // // const Home = () => {
// // // // // //   const navigation = useNavigation();
// // // // // //   const [notifications, setNotifications] = useState([]);
// // // // // //   const [sliders, setSliders] = useState([]);
// // // // // //   const [games, setGames] = useState([]);
// // // // // //   const [filteredGames, setFilteredGames] = useState([]);
// // // // // //   const [patterns, setPatterns] = useState([]);
// // // // // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // // // // //   const [activeSlide, setActiveSlide] = useState(0);
// // // // // //   const [modalVisible, setModalVisible] = useState(false);
// // // // // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // // // // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // // // // //   const [loadingGames, setLoadingGames] = useState(true);
// // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // // // //   // Popup state
// // // // // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // // // // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // // // // //   const [popupShown, setPopupShown] = useState(false);
  
// // // // // //   // Animation for popup
// // // // // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // // // // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // // // // //   // Pagination state for games
// // // // // //   const [currentPage, setCurrentPage] = useState(1);
// // // // // //   const [lastPage, setLastPage] = useState(1);
// // // // // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // // // // //   const sliderRef = useRef(null);
// // // // // //   const scrollInterval = useRef(null);

// // // // // //   // Filter options
// // // // // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // // // // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // // // // //   useEffect(() => {
// // // // // //     fetchInitialData();
    
// // // // // //     return () => {
// // // // // //       if (scrollInterval.current) {
// // // // // //         clearInterval(scrollInterval.current);
// // // // // //       }
// // // // // //     };
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     if (games.length > 0 && !popupShown) {
// // // // // //       setTimeout(() => {
// // // // // //         checkUpcomingGame();
// // // // // //       }, 1500);
// // // // // //     }
// // // // // //   }, [games, popupShown]);

// // // // // //   useEffect(() => {
// // // // // //     if (sliders.length > 1) {
// // // // // //       startAutoScroll();
// // // // // //     }
// // // // // //     return () => {
// // // // // //       if (scrollInterval.current) {
// // // // // //         clearInterval(scrollInterval.current);
// // // // // //       }
// // // // // //     };
// // // // // //   }, [sliders.length]);

// // // // // //   // Filter games based on search and active filter
// // // // // //   useEffect(() => {
// // // // // //     let filtered = games;
    
// // // // // //     // Apply search filter
// // // // // //     if (searchQuery.trim() !== '') {
// // // // // //       filtered = filtered.filter(game =>
// // // // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // // // //       );
// // // // // //     }
    
// // // // // //     // Apply status filter
// // // // // //     if (activeFilter === 'Live Now') {
// // // // // //       filtered = filtered.filter(game => game.status === 'live');
// // // // // //     } else if (activeFilter === 'Upcoming') {
// // // // // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // // // // //     } else if (activeFilter === 'Completed') {
// // // // // //       filtered = filtered.filter(game => game.status === 'completed');
// // // // // //     }
    
// // // // // //     setFilteredGames(filtered);
// // // // // //   }, [searchQuery, games, activeFilter]);

// // // // // //   useEffect(() => {
// // // // // //     if (upcomingGamePopup) {
// // // // // //       Animated.parallel([
// // // // // //         Animated.timing(opacityAnim, {
// // // // // //           toValue: 1,
// // // // // //           duration: 300,
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //         Animated.timing(slideAnim, {
// // // // // //           toValue: 0,
// // // // // //           duration: 400,
// // // // // //           easing: Easing.out(Easing.back(1.2)),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //       ]).start();
// // // // // //     } else {
// // // // // //       opacityAnim.setValue(0);
// // // // // //       slideAnim.setValue(300);
// // // // // //     }
// // // // // //   }, [upcomingGamePopup]);

// // // // // //   const startAutoScroll = () => {
// // // // // //     if (scrollInterval.current) {
// // // // // //       clearInterval(scrollInterval.current);
// // // // // //     }
    
// // // // // //     scrollInterval.current = setInterval(() => {
// // // // // //       if (sliders.length > 0) {
// // // // // //         let nextIndex = activeSlide + 1;
// // // // // //         if (nextIndex >= sliders.length) {
// // // // // //           nextIndex = 0;
// // // // // //         }
        
// // // // // //         setActiveSlide(nextIndex);
// // // // // //         if (sliderRef.current) {
// // // // // //           const slideWidth = width - 32;
// // // // // //           sliderRef.current.scrollToOffset({
// // // // // //             offset: nextIndex * slideWidth,
// // // // // //             animated: true
// // // // // //           });
// // // // // //         }
// // // // // //       }
// // // // // //     }, 3000);
// // // // // //   };

// // // // // //   const fetchInitialData = async () => {
// // // // // //     try {
// // // // // //       await Promise.all([
// // // // // //         fetchNotifications(),
// // // // // //         fetchSliders(),
// // // // // //         fetchGames(1),
// // // // // //         fetchPatterns()
// // // // // //       ]);
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching initial data:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const onRefresh = React.useCallback(() => {
// // // // // //     setRefreshing(true);
// // // // // //     setCurrentPage(1);
// // // // // //     setGames([]);
// // // // // //     setFilteredGames([]);
// // // // // //     setPopupShown(false);
// // // // // //     Promise.all([
// // // // // //       fetchNotifications(),
// // // // // //       fetchSliders(),
// // // // // //       fetchGames(1),
// // // // // //       fetchPatterns()
// // // // // //     ]).finally(() => setRefreshing(false));
// // // // // //   }, []);

// // // // // //   const checkUpcomingGame = () => {
// // // // // //     try {
// // // // // //       const now = new Date();
      
// // // // // //       const scheduledGames = games.filter(game => 
// // // // // //         game.status === 'scheduled'
// // // // // //       );
      
// // // // // //       if (scheduledGames.length === 0) return;
      
// // // // // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // // // // //         let endDateTime;
        
// // // // // //         try {
// // // // // //           if (game.ticket_request_end_date) {
// // // // // //             endDateTime = new Date(game.ticket_request_end_date);
// // // // // //           } else {
// // // // // //             endDateTime = new Date(game.game_date);
// // // // // //           }
// // // // // //         } catch (e) {
// // // // // //           endDateTime = new Date();
// // // // // //         }
        
// // // // // //         return {
// // // // // //           ...game,
// // // // // //           endDateTime
// // // // // //         };
// // // // // //       });
      
// // // // // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // // // // //       const earliestEndGame = sortedGames[0];
      
// // // // // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // // // // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
// // // // // //         setUpcomingGame(earliestEndGame);
// // // // // //         setUpcomingGamePopup(true);
// // // // // //         setPopupShown(true);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error checking upcoming game:", error);
// // // // // //     }
// // // // // //   };

// // // // // //   const getTimeRemaining = (endDateTime) => {
// // // // // //     const now = new Date();
// // // // // //     const diff = endDateTime - now;
    
// // // // // //     if (diff <= 0) return "Ending soon";
    
// // // // // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // // // // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // // // // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // // // // //     if (days > 0) {
// // // // // //       return `${days}d ${hours}h left`;
// // // // // //     } else if (hours > 0) {
// // // // // //       return `${hours}h ${minutes}m left`;
// // // // // //     } else {
// // // // // //       return `${minutes}m left`;
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchNotifications = async () => {
// // // // // //     try {
// // // // // //       const token = await AsyncStorage.getItem("token");
// // // // // //       if (!token) return;
// // // // // //       const res = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/notifications",
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
// // // // // //       if (res.data.status) {
// // // // // //         setNotifications(res.data.data);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching notifications:", error);
// // // // // //     } finally {
// // // // // //       setLoadingNotifications(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchSliders = async () => {
// // // // // //     try {
// // // // // //       setLoadingSliders(true);
// // // // // //       const res = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/sliders"
// // // // // //       );
// // // // // //       if (res.data.success) {
// // // // // //         setSliders(res.data.data || []);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching sliders:", error);
// // // // // //       setSliders([]);
// // // // // //     } finally {
// // // // // //       setLoadingSliders(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchGames = async (page = 1) => {
// // // // // //     try {
// // // // // //       if (page === 1) {
// // // // // //         setLoadingGames(true);
// // // // // //       }
      
// // // // // //       const token = await AsyncStorage.getItem("token");
// // // // // //       if (!token) return;
      
// // // // // //       const res = await axios.get(
// // // // // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
      
// // // // // //       if (res.data.success) {
// // // // // //         const newGames = res.data.games.data || [];
// // // // // //         const pagination = res.data.games;
        
// // // // // //         if (page === 1) {
// // // // // //           setGames(newGames);
// // // // // //           setFilteredGames(newGames);
// // // // // //         } else {
// // // // // //           setGames(prev => [...prev, ...newGames]);
// // // // // //           setFilteredGames(prev => [...prev, ...newGames]);
// // // // // //         }
        
// // // // // //         setCurrentPage(pagination.current_page);
// // // // // //         setLastPage(pagination.last_page);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log("Error fetching games:", error);
// // // // // //     } finally {
// // // // // //       if (page === 1) {
// // // // // //         setLoadingGames(false);
// // // // // //       }
// // // // // //       setLoadingMore(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchPatterns = async () => {
// // // // // //     try {
// // // // // //       setLoadingPatterns(true);
// // // // // //       const token = await AsyncStorage.getItem("token");
      
// // // // // //       if (!token) {
// // // // // //         setLoadingPatterns(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       const response = await axios.get(
// // // // // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // // // // //         {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //             Accept: 'application/json',
// // // // // //           },
// // // // // //         }
// // // // // //       );

// // // // // //       if (response.data && response.data.status) {
// // // // // //         const patternsData = response.data.data?.patterns || [];
        
// // // // // //         const patternSequence = [
// // // // // //           'top line',
// // // // // //           'middle line', 
// // // // // //           'bottom line',
// // // // // //           'breakfast',
// // // // // //           'lunch',
// // // // // //           'dinner',
// // // // // //           'four corners',
// // // // // //           'bamboo',
// // // // // //           'early five',
// // // // // //           'non claimers',
// // // // // //           'full house'
// // // // // //         ];
        
// // // // // //         const sortedPatterns = patternsData.sort((a, b) => {
// // // // // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // // // // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // // // // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // // // // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // // // // //           if (aIndex === -1) return 1;
// // // // // //           if (bIndex === -1) return -1;
          
// // // // // //           return aIndex - bIndex;
// // // // // //         });
        
// // // // // //         setPatterns(sortedPatterns.slice(0, 8));
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.log('Error fetching patterns in Home:', error);
// // // // // //     } finally {
// // // // // //       setLoadingPatterns(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const loadMoreGames = () => {
// // // // // //     if (!loadingMore && currentPage < lastPage) {
// // // // // //       setLoadingMore(true);
// // // // // //       fetchGames(currentPage + 1);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleGamePress = (game) => {
// // // // // //     navigation.navigate("GameDetails", { game });
// // // // // //   };

// // // // // //   const handleAllGamesPress = () => {
// // // // // //     navigation.navigate("Game");
// // // // // //   };

// // // // // //   const handleAllPatternsPress = () => {
// // // // // //     navigation.navigate("UserGamePatterns");
// // // // // //   };

// // // // // //   const handleViewAllWinners = () => {
// // // // // //     navigation.navigate("Game");
// // // // // //   };

// // // // // //   const handlePatternPress = (pattern) => {
// // // // // //     navigation.navigate("UserGamePatterns", { 
// // // // // //       selectedPatternId: pattern.id,
// // // // // //       selectedPattern: pattern 
// // // // // //     });
// // // // // //   };

// // // // // //   const handlePopupJoinNow = () => {
// // // // // //     setUpcomingGamePopup(false);
// // // // // //     if (upcomingGame) {
// // // // // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // // // // //     }
// // // // // //   };

// // // // // //   const handlePopupLater = () => {
// // // // // //     setUpcomingGamePopup(false);
// // // // // //   };

// // // // // //   const getPatternIcon = (pattern) => {
// // // // // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // // // // //     const iconMap = {
// // // // // //       'bamboo': 'leaf',
// // // // // //       'bottom line': 'arrow-down',
// // // // // //       'breakfast': 'cafe',
// // // // // //       'dinner': 'restaurant',
// // // // // //       'early five': '5',
// // // // // //       'four corners': 'apps',
// // // // // //       'full house': 'home',
// // // // // //       'lunch': 'fast-food',
// // // // // //       'middle line': 'remove',
// // // // // //       'non claimer': 'close',
// // // // // //       'top line': 'arrow-up'
// // // // // //     };
    
// // // // // //     for (const [key, icon] of Object.entries(iconMap)) {
// // // // // //       if (patternName.includes(key)) return icon;
// // // // // //     }
    
// // // // // //     return 'grid-outline';
// // // // // //   };

// // // // // //   const formatPatternName = (name) => {
// // // // // //     if (!name) return 'Unknown Pattern';
// // // // // //     return name
// // // // // //       .split('_')
// // // // // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // // // // //       .join(' ');
// // // // // //   };

// // // // // //   // Original pattern card design with circles
// // // // // //   const renderPatternCard = (pattern, index) => {
// // // // // //     const icon = getPatternIcon(pattern);
// // // // // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // // // // //     // Pattern names for display
// // // // // //     const patterns = [
// // // // // //       'Top Line',
// // // // // //       'Middle',
// // // // // //       'Bottom',
// // // // // //       'Breakfast',
// // // // // //       'Lunch',
// // // // // //       'Dinner',
// // // // // //       'Corners',
// // // // // //       'Bamboo',
// // // // // //     ];
    
// // // // // //     const patternName = patterns[index % patterns.length];
// // // // // //     const bgColor = COLORS.patternColors[index % COLORS.patternColors.length];
    
// // // // // //     return (
// // // // // //       <TouchableOpacity 
// // // // // //         key={pattern.id} 
// // // // // //         style={styles.compactPatternCard}
// // // // // //         onPress={() => handlePatternPress(pattern)}
// // // // // //         activeOpacity={0.7}
// // // // // //       >
// // // // // //         <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
// // // // // //           <Ionicons name={icon} size={18} color="#FFFFFF" />
// // // // // //         </View>
// // // // // //         <Text style={styles.compactPatternName} numberOfLines={1}>
// // // // // //           {patternName}
// // // // // //         </Text>
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   const renderSliderItem = ({ item }) => (
// // // // // //     <View style={styles.slideContainer}>
// // // // // //       <Image
// // // // // //         source={{ 
// // // // // //           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
// // // // // //         }}
// // // // // //         style={styles.sliderImage}
// // // // // //         resizeMode="cover"
// // // // // //       />
// // // // // //     </View>
// // // // // //   );

// // // // // //   const handleScroll = (event) => {
// // // // // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // // // // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // // // // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // // // // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // // // // //       setActiveSlide(currentIndex);
// // // // // //     }
// // // // // //   };

// // // // // //   const renderPagination = () => {
// // // // // //     if (sliders.length <= 1) return null;
    
// // // // // //     return (
// // // // // //       <View style={styles.paginationContainer}>
// // // // // //         {sliders.map((_, index) => (
// // // // // //           <View
// // // // // //             key={index}
// // // // // //             style={[
// // // // // //               styles.paginationDot,
// // // // // //               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
// // // // // //             ]}
// // // // // //           />
// // // // // //         ))}
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   const renderGameCard = ({ item: game }) => {
// // // // // //     if (!game) return null;
    
// // // // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // // // //     const isPaid = game.ticket_type === "paid";
// // // // // //     const isLive = game.status === 'live';
// // // // // //     const isScheduled = game.status === 'scheduled';
// // // // // //     const isCompleted = game.status === 'completed';
    
// // // // // //     return (
// // // // // //       <TouchableOpacity
// // // // // //         style={styles.gameCard}
// // // // // //         activeOpacity={0.9}
// // // // // //         onPress={() => handleGamePress(game)}
// // // // // //       >
// // // // // //         {/* Background Pattern */}
// // // // // //         <View style={styles.gameCardPattern} />
        
// // // // // //         {/* Status badge */}
// // // // // //         <View style={[
// // // // // //           styles.statusBadge,
// // // // // //           isLive ? styles.liveBadge :
// // // // // //           isScheduled ? styles.scheduledBadge :
// // // // // //           isCompleted ? styles.completedBadge :
// // // // // //           styles.defaultBadge
// // // // // //         ]}>
// // // // // //           <Ionicons 
// // // // // //             name={
// // // // // //               isLive ? 'radio-button-on' : 
// // // // // //               isCompleted ? 'checkmark-circle' :
// // // // // //               'time'
// // // // // //             } 
// // // // // //             size={10} 
// // // // // //             color={COLORS.surface} 
// // // // // //           />
// // // // // //           <Text style={styles.statusText}>
// // // // // //             {isLive ? 'LIVE' : 
// // // // // //              isCompleted ? 'COMPLETED' : 
// // // // // //              'SOON'}
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         <View style={styles.cardHeader}>
// // // // // //           <View style={styles.gameIconContainer}>
// // // // // //             <View style={styles.gameIconWrapper}>
// // // // // //               <MaterialIcons name="confirmation-number" size={32} color={COLORS.accent} />
// // // // // //             </View>
// // // // // //             <View style={styles.gameInfo}>
// // // // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // // // //                 {game.game_name || "Tambola Game"}
// // // // // //               </Text>
// // // // // //               <Text style={styles.gameId}>
// // // // // //                 ID: {game.game_code || "N/A"}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>
          
// // // // // //           <View style={[
// // // // // //             styles.gameTypeBadge,
// // // // // //             isPaid ? styles.paidBadge : styles.freeBadge,
// // // // // //           ]}>
// // // // // //             {isPaid ? (
// // // // // //               <>
// // // // // //                 <MaterialIcons name="diamond" size={14} color={COLORS.accent} />
// // // // // //                 <Text style={styles.gameTypeText}>
// // // // // //                   ₹{ticketCost}
// // // // // //                 </Text>
// // // // // //               </>
// // // // // //             ) : (
// // // // // //               <>
// // // // // //                 <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
// // // // // //                 <Text style={styles.gameTypeText}>
// // // // // //                   FREE
// // // // // //                 </Text>
// // // // // //               </>
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <View style={styles.gameDetails}>
// // // // // //           <View style={styles.detailRow}>
// // // // // //             <View style={styles.detailItem}>
// // // // // //               <View style={styles.detailIcon}>
// // // // // //                 <Ionicons name="calendar" size={14} color={COLORS.accent} />
// // // // // //               </View>
// // // // // //               <View>
// // // // // //                 <Text style={styles.detailLabel}>Date</Text>
// // // // // //                 <Text style={styles.detailText}>
// // // // // //                   {game.game_date_formatted || game.game_date || "Date TBA"}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>
            
// // // // // //             <View style={styles.detailItem}>
// // // // // //               <View style={styles.detailIcon}>
// // // // // //                 <Ionicons name="time" size={14} color={COLORS.accent} />
// // // // // //               </View>
// // // // // //               <View>
// // // // // //                 <Text style={styles.detailLabel}>Time</Text>
// // // // // //                 <Text style={styles.detailText}>
// // // // // //                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           </View>
          
// // // // // //           <View style={styles.detailRow}>
// // // // // //             <View style={styles.detailItem}>
// // // // // //               <View style={styles.detailIcon}>
// // // // // //                 <Ionicons name="person" size={14} color={COLORS.accent} />
// // // // // //               </View>
// // // // // //               <View>
// // // // // //                 <Text style={styles.detailLabel}>Host</Text>
// // // // // //                 <Text style={styles.detailText}>
// // // // // //                   {game.user ? game.user.name : 'Tambola Timez'}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>
            
// // // // // //             {game.available_tickets !== undefined && !isCompleted && (
// // // // // //               <View style={styles.detailItem}>
// // // // // //                 <View style={styles.detailIcon}>
// // // // // //                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.accent} />
// // // // // //                 </View>
// // // // // //                 <View>
// // // // // //                   <Text style={styles.detailLabel}>Tickets</Text>
// // // // // //                   <Text style={styles.detailText}>
// // // // // //                     {game.available_tickets} Left
// // // // // //                   </Text>
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             )}
// // // // // //             {isCompleted && (
// // // // // //               <View style={styles.detailItem}>
// // // // // //                 <View style={styles.detailIcon}>
// // // // // //                   <Ionicons name="trophy" size={14} color={COLORS.accent} />
// // // // // //                 </View>
// // // // // //                 <View>
// // // // // //                   <Text style={styles.detailLabel}>Status</Text>
// // // // // //                   <Text style={styles.detailText}>Completed</Text>
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <View style={styles.prizeContainer}>
// // // // // //           <View style={styles.prizeIcon}>
// // // // // //             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.accent} />
// // // // // //           </View>
// // // // // //           <View style={styles.prizeInfo}>
// // // // // //             <Text style={styles.prizeLabel}>
// // // // // //               {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
// // // // // //             </Text>
// // // // // //             <Text style={styles.prizeText}>
// // // // // //               {isPaid && game.max_tickets 
// // // // // //                 ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // // // // //                 : "Exciting Prizes"}
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <TouchableOpacity 
// // // // // //           style={[
// // // // // //             styles.joinButton,
// // // // // //             isCompleted && styles.completedJoinButton
// // // // // //           ]}
// // // // // //           onPress={() => handleGamePress(game)}
// // // // // //         >
// // // // // //           <View style={styles.glassEffectOverlay} />
// // // // // //           <Text style={styles.joinButtonText}>
// // // // // //             {isCompleted 
// // // // // //               ? 'VIEW RESULTS' 
// // // // // //               : isLive
// // // // // //                 ? 'JOIN GAME' 
// // // // // //                 : 'VIEW DETAILS'}
// // // // // //           </Text>
// // // // // //           <Ionicons 
// // // // // //             name={isCompleted ? "trophy" : "arrow-forward"} 
// // // // // //             size={16} 
// // // // // //             color={COLORS.surface} 
// // // // // //           />
// // // // // //         </TouchableOpacity>
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   const clearSearch = () => {
// // // // // //     setSearchQuery('');
// // // // // //   };

// // // // // //   const renderFooter = () => {
// // // // // //     if (!loadingMore) return null;
// // // // // //     return (
// // // // // //       <View style={styles.loadingMoreContainer}>
// // // // // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   const UpcomingGamePopup = () => {
// // // // // //     if (!upcomingGame) return null;
    
// // // // // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // // // // //     const isPaid = upcomingGame.ticket_type === "paid";
// // // // // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // // // // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // // // // //     return (
// // // // // //       <Modal
// // // // // //         visible={upcomingGamePopup}
// // // // // //         transparent={true}
// // // // // //         animationType="fade"
// // // // // //         onRequestClose={handlePopupLater}
// // // // // //       >
// // // // // //         <View style={styles.popupOverlay}>
// // // // // //           <Animated.View 
// // // // // //             style={[
// // // // // //               styles.popupContainer,
// // // // // //               {
// // // // // //                 opacity: opacityAnim,
// // // // // //                 transform: [{ translateY: slideAnim }]
// // // // // //               }
// // // // // //             ]}
// // // // // //           >
// // // // // //             <View style={[styles.popupIcon, { backgroundColor: COLORS.primary + '20' }]}>
// // // // // //               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
// // // // // //             </View>
            
// // // // // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // // // // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // // // // //             <View style={styles.popupTimer}>
// // // // // //               <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
// // // // // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // // // // //             </View>
            
// // // // // //             <View style={styles.popupPrize}>
// // // // // //               <Text style={styles.popupPrizeLabel}>Prize Pool</Text>
// // // // // //               <Text style={styles.popupPrizeValue}>
// // // // // //                 {isPaid && upcomingGame.max_tickets
// // // // // //                   ? `₹${(ticketCost * upcomingGame.max_tickets).toLocaleString()}`
// // // // // //                   : "Exciting Prizes"}
// // // // // //               </Text>
// // // // // //             </View>
            
// // // // // //             <View style={styles.popupActions}>
// // // // // //               <TouchableOpacity 
// // // // // //                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
// // // // // //                 onPress={handlePopupJoinNow}
// // // // // //               >
// // // // // //                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // // // // //               </TouchableOpacity>
              
// // // // // //               <TouchableOpacity 
// // // // // //                 style={styles.popupSecondaryButton}
// // // // // //                 onPress={handlePopupLater}
// // // // // //               >
// // // // // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </Animated.View>
// // // // // //         </View>
// // // // // //       </Modal>
// // // // // //     );
// // // // // //   };

// // // // // //   const Header = () => (
// // // // // //     <View style={styles.header}>
// // // // // //       <Text style={styles.headerTitle}>Houzie Timez</Text>

// // // // // //       <TouchableOpacity 
// // // // // //         style={styles.notification}
// // // // // //         onPress={() => setModalVisible(true)}
// // // // // //       >
// // // // // //         <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// // // // // //         {notifications.length > 0 && (
// // // // // //           <View style={styles.badge}>
// // // // // //             <Text style={styles.badgeText}>{notifications.length}</Text>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </TouchableOpacity>
// // // // // //     </View>
// // // // // //   );

// // // // // //   if (loadingGames && games.length === 0) {
// // // // // //     return (
// // // // // //       <SafeAreaView style={styles.safeArea}>
// // // // // //         <View style={styles.loadingContainer}>
// // // // // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // // // // //         </View>
// // // // // //       </SafeAreaView>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// // // // // //       <View style={styles.container}>
// // // // // //         {/* Header */}
// // // // // //         <Header />

// // // // // //         {/* Search Bar */}
// // // // // //         <View style={styles.searchWrapper}>
// // // // // //           <View style={styles.searchBox}>
// // // // // //             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
// // // // // //             <TextInput
// // // // // //               placeholder="Search games by name or ID..."
// // // // // //               placeholderTextColor={COLORS.textLight}
// // // // // //               style={styles.searchInput}
// // // // // //               value={searchQuery}
// // // // // //               onChangeText={setSearchQuery}
// // // // // //               returnKeyType="search"
// // // // // //             />
// // // // // //             {searchQuery.length > 0 ? (
// // // // // //               <TouchableOpacity onPress={clearSearch}>
// // // // // //                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
// // // // // //               </TouchableOpacity>
// // // // // //             ) : (
// // // // // //               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <ScrollView
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //           refreshControl={
// // // // // //             <RefreshControl
// // // // // //               refreshing={refreshing}
// // // // // //               onRefresh={onRefresh}
// // // // // //               tintColor={COLORS.primary}
// // // // // //               colors={[COLORS.primary]}
// // // // // //             />
// // // // // //           }
// // // // // //         >
// // // // // //           {/* Slider Section */}
// // // // // //           {loadingSliders ? (
// // // // // //             <View style={styles.sliderLoadingContainer}>
// // // // // //               <ActivityIndicator size="large" color={COLORS.primary} />
// // // // // //               <Text style={styles.loadingText}>Loading offers...</Text>
// // // // // //             </View>
// // // // // //           ) : sliders.length > 0 ? (
// // // // // //             <View style={styles.sliderSection}>
// // // // // //               <View style={styles.sliderWrapper}>
// // // // // //                 <FlatList
// // // // // //                   ref={sliderRef}
// // // // // //                   data={sliders}
// // // // // //                   renderItem={renderSliderItem}
// // // // // //                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // // // // //                   horizontal
// // // // // //                   pagingEnabled
// // // // // //                   showsHorizontalScrollIndicator={false}
// // // // // //                   onScroll={handleScroll}
// // // // // //                   scrollEventThrottle={16}
// // // // // //                 />
                
// // // // // //                 {/* Pagination Dots */}
// // // // // //                 {renderPagination()}
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           ) : null}

// // // // // //           {/* Filter Chips */}
// // // // // //           {/* <ScrollView
// // // // // //             horizontal
// // // // // //             showsHorizontalScrollIndicator={false}
// // // // // //             contentContainerStyle={styles.filtersContainer}
// // // // // //           >
// // // // // //             {filters.map((filter) => (
// // // // // //               <TouchableOpacity
// // // // // //                 key={filter}
// // // // // //                 style={[
// // // // // //                   styles.filterChip,
// // // // // //                   activeFilter === filter && styles.activeFilterChip,
// // // // // //                 ]}
// // // // // //                 onPress={() => setActiveFilter(filter)}
// // // // // //               >
// // // // // //                 <Text
// // // // // //                   style={[
// // // // // //                     styles.filterChipText,
// // // // // //                     activeFilter === filter && styles.activeFilterChipText,
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   {filter}
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>
// // // // // //             ))}
// // // // // //           </ScrollView> */}

// // // // // //           {/* Quick Actions */}
// // // // // //           {/* <View style={styles.quickActions}>
// // // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.deposit }]}>
// // // // // //                 <FontAwesome name="money" size={20} color={COLORS.surface} />
// // // // // //               </View>
// // // // // //               <Text style={styles.quickActionText}>Deposit</Text>
// // // // // //             </TouchableOpacity>
// // // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.withdraw }]}>
// // // // // //                 <FontAwesome name="bank" size={20} color={COLORS.surface} />
// // // // // //               </View>
// // // // // //               <Text style={styles.quickActionText}>Withdraw</Text>
// // // // // //             </TouchableOpacity>
// // // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.refer }]}>
// // // // // //                 <FontAwesome name="users" size={20} color={COLORS.surface} />
// // // // // //               </View>
// // // // // //               <Text style={styles.quickActionText}>Refer</Text>
// // // // // //             </TouchableOpacity>
// // // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.support }]}>
// // // // // //                 <Ionicons name="headset" size={20} color={COLORS.surface} />
// // // // // //               </View>
// // // // // //               <Text style={styles.quickActionText}>Support</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View> */}

// // // // // //           {/* Patterns Section - Keeping original circular design */}
// // // // // //           {patterns.length > 0 && (
// // // // // //             <View style={styles.patternsSection}>
// // // // // //               <View style={styles.sectionHeader}>
// // // // // //                 <View style={styles.sectionTitleContainer}>
// // // // // //                   <Ionicons name="grid-outline" size={22} color={COLORS.primary} />
// // // // // //                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
// // // // // //                 </View>
// // // // // //                 <TouchableOpacity onPress={handleAllPatternsPress}>
// // // // // //                   <View style={styles.seeAllButton}>
// // // // // //                     <Text style={styles.seeAllText}>See All</Text>
// // // // // //                     <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
// // // // // //                   </View>
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>

// // // // // //               {loadingPatterns ? (
// // // // // //                 <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //               ) : (
// // // // // //                 <ScrollView 
// // // // // //                   horizontal 
// // // // // //                   showsHorizontalScrollIndicator={false}
// // // // // //                   contentContainerStyle={styles.patternsList}
// // // // // //                 >
// // // // // //                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // // // // //                 </ScrollView>
// // // // // //               )}
// // // // // //             </View>
// // // // // //           )}

// // // // // //           {/* Games Section */}
// // // // // //           <View style={styles.section}>
// // // // // //             <View style={styles.sectionHeader}>
// // // // // //               <View style={styles.sectionTitleContainer}>
// // // // // //                 <Ionicons name="game-controller-outline" size={22} color={COLORS.primary} />
// // // // // //                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
// // // // // //               </View>
// // // // // //               <TouchableOpacity onPress={handleAllGamesPress}>
// // // // // //                 <Text style={styles.seeAll}>See All</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             {loadingGames ? (
// // // // // //               <View style={styles.gamesLoadingContainer}>
// // // // // //                 <ActivityIndicator size="large" color={COLORS.primary} />
// // // // // //                 <Text style={styles.loadingText}>Loading games...</Text>
// // // // // //               </View>
// // // // // //             ) : filteredGames.length > 0 ? (
// // // // // //               <View style={styles.gamesContainer}>
// // // // // //                 {filteredGames.map((game, index) => (
// // // // // //                   <View key={game.id || index}>
// // // // // //                     {renderGameCard({ item: game })}
// // // // // //                   </View>
// // // // // //                 ))}
// // // // // //                 {loadingMore && (
// // // // // //                   <View style={styles.loadingMoreContainer}>
// // // // // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // // // // //                   </View>
// // // // // //                 )}
// // // // // //               </View>
// // // // // //             ) : (
// // // // // //               <View style={styles.noGamesContainer}>
// // // // // //                 <Ionicons name="game-controller-outline" size={50} color={COLORS.textLight} />
// // // // // //                 <Text style={styles.noGamesText}>
// // // // // //                   {searchQuery ? 'No games found' : 'No games available at the moment'}
// // // // // //                 </Text>
// // // // // //                 {searchQuery && (
// // // // // //                   <TouchableOpacity 
// // // // // //                     style={styles.refreshGamesBtn}
// // // // // //                     onPress={clearSearch}
// // // // // //                   >
// // // // // //                     <Text style={styles.refreshGamesText}>Clear Search</Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 )}
// // // // // //               </View>
// // // // // //             )}
// // // // // //           </View>

// // // // // //           {/* Recent Winners Section */}
// // // // // //           <View style={styles.section}>
// // // // // //             <View style={styles.sectionHeader}>
// // // // // //               <View style={styles.sectionTitleContainer}>
// // // // // //                 <FontAwesome name="trophy" size={22} color={COLORS.primary} />
// // // // // //                 <Text style={styles.sectionTitle}>RECENT WINNERS</Text>
// // // // // //               </View>
// // // // // //               <TouchableOpacity onPress={handleViewAllWinners}>
// // // // // //                 <Text style={styles.seeAll}>See All</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <View style={styles.winnersContainer}>
// // // // // //               {[
// // // // // //                 { id: 1, name: "Amit Sharma", prize: "Won Full House 🏆", time: "2 min ago" },
// // // // // //                 { id: 2, name: "Neha Gupta", prize: "Won Early 5 🎉", time: "5 min ago" },
// // // // // //                 { id: 3, name: "Rahul Verma", prize: "Won Corners ✨", time: "10 min ago" },
// // // // // //               ].map((winner) => (
// // // // // //                 <View key={winner.id} style={styles.winnerCard}>
// // // // // //                   <View style={styles.winnerInfo}>
// // // // // //                     <View style={styles.winnerAvatar}>
// // // // // //                       <Text style={styles.winnerInitial}>{winner.name.charAt(0)}</Text>
// // // // // //                     </View>
// // // // // //                     <View>
// // // // // //                       <Text style={styles.winnerName}>{winner.name}</Text>
// // // // // //                       <Text style={styles.winnerPrize}>{winner.prize}</Text>
// // // // // //                     </View>
// // // // // //                   </View>
// // // // // //                   <Text style={styles.winnerTime}>{winner.time}</Text>
// // // // // //                 </View>
// // // // // //               ))}
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           {/* Why Play With Us Section */}
// // // // // //           <View style={styles.section}>
// // // // // //             <View style={styles.sectionHeader}>
// // // // // //               <View style={styles.sectionTitleContainer}>
// // // // // //                 <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
// // // // // //                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
// // // // // //               </View>
// // // // // //             </View>
            
// // // // // //             <View style={styles.infoCard}>
// // // // // //               <View style={styles.infoList}>
// // // // // //                 <View style={styles.infoItem}>
// // // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // // //                   <Text style={styles.infoText}>Fast & Fair Games</Text>
// // // // // //                 </View>
// // // // // //                 <View style={styles.infoItem}>
// // // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // // //                   <Text style={styles.infoText}>Real Players</Text>
// // // // // //                 </View>
// // // // // //                 <View style={styles.infoItem}>
// // // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // // //                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
// // // // // //                 </View>
// // // // // //                 <View style={styles.infoItem}>
// // // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // // //                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.bottomSpace} />
// // // // // //         </ScrollView>

// // // // // //         {/* Popup */}
// // // // // //         <UpcomingGamePopup />

// // // // // //         {/* Notifications Modal */}
// // // // // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // // // // //           <View style={styles.modalOverlay}>
// // // // // //             <View style={styles.modalContent}>
// // // // // //               <View style={styles.modalHeader}>
// // // // // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // // // // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // // // // //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>

// // // // // //               {loadingNotifications ? (
// // // // // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// // // // // //               ) : (
// // // // // //                 <FlatList
// // // // // //                   data={notifications}
// // // // // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // //                   renderItem={({ item }) => (
// // // // // //                     <View style={styles.notificationItem}>
// // // // // //                       <View style={styles.notificationIcon}>
// // // // // //                         <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
// // // // // //                       </View>
// // // // // //                       <View style={styles.notificationContent}>
// // // // // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // // // // //                         <Text style={styles.notificationMessage}>
// // // // // //                           {item.message || "Check out the new features!"}
// // // // // //                         </Text>
// // // // // //                         <Text style={styles.notificationDate}>
// // // // // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // // // // //                         </Text>
// // // // // //                       </View>
// // // // // //                     </View>
// // // // // //                   )}
// // // // // //                   ListEmptyComponent={
// // // // // //                     <View style={styles.emptyNotifications}>
// // // // // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // // // // //                       <Text style={styles.emptyText}>No notifications yet</Text>
// // // // // //                     </View>
// // // // // //                   }
// // // // // //                 />
// // // // // //               )}

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.closeBtn}
// // // // // //                 onPress={() => setModalVisible(false)}
// // // // // //               >
// // // // // //                 <Text style={styles.closeBtnText}>Close</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </Modal>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   safeArea: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //   },
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //   },
// // // // // //   loadingContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   header: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 16,
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 22,
// // // // // //     fontWeight: "700",
// // // // // //   },
// // // // // //   notification: {
// // // // // //     position: "relative",
// // // // // //   },
// // // // // //   badge: {
// // // // // //     position: "absolute",
// // // // // //     top: -6,
// // // // // //     right: -6,
// // // // // //     backgroundColor: "red",
// // // // // //     width: 18,
// // // // // //     height: 18,
// // // // // //     borderRadius: 9,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },
// // // // // //   badgeText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: "700",
// // // // // //   },
// // // // // //   searchWrapper: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //   },
// // // // // //   searchBox: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 14,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 10,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   searchInput: {
// // // // // //     flex: 1,
// // // // // //     marginHorizontal: 10,
// // // // // //     fontSize: 15,
// // // // // //     color: COLORS.textDark,
// // // // // //     padding: 0,
// // // // // //   },
// // // // // //   sliderSection: {
// // // // // //     marginTop: 16,
// // // // // //     marginBottom: 8,
// // // // // //     paddingHorizontal: 16,
// // // // // //   },
// // // // // //   sliderWrapper: {
// // // // // //     height: 150,
// // // // // //     position: 'relative',
// // // // // //     borderRadius: 16,
// // // // // //     overflow: 'hidden',
// // // // // //   },
// // // // // //   sliderLoadingContainer: {
// // // // // //     height: 150,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 16,
// // // // // //     marginBottom: 8,
// // // // // //     marginHorizontal: 16,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 16,
// // // // // //   },
// // // // // //   slideContainer: {
// // // // // //     width: width - 32,
// // // // // //     height: 150,
// // // // // //   },
// // // // // //   sliderImage: {
// // // // // //     width: '100%',
// // // // // //     height: '100%',
// // // // // //     borderRadius: 16,
// // // // // //   },
// // // // // //   paginationContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     position: 'absolute',
// // // // // //     bottom: 10,
// // // // // //     alignSelf: 'center',
// // // // // //   },
// // // // // //   paginationDot: {
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     marginHorizontal: 4,
// // // // // //   },
// // // // // //   paginationDotActive: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     width: 20,
// // // // // //   },
// // // // // //   paginationDotInactive: {
// // // // // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // // // // //   },
// // // // // //   loadingText: {
// // // // // //     marginTop: 10,
// // // // // //     color: COLORS.textLight,
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // //   filtersContainer: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   filterChip: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 20,
// // // // // //     marginRight: 8,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.border,
// // // // // //   },
// // // // // //   activeFilterChip: {
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     borderColor: COLORS.primary,
// // // // // //   },
// // // // // //   filterChipText: {
// // // // // //     color: COLORS.textDark,
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   activeFilterChipText: {
// // // // // //     color: COLORS.surface,
// // // // // //   },
// // // // // //   quickActions: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     marginBottom: 24,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   quickAction: {
// // // // // //     alignItems: 'center',
// // // // // //     width: (width - 60) / 4,
// // // // // //   },
// // // // // //   quickActionIcon: {
// // // // // //     width: 45,
// // // // // //     height: 45,
// // // // // //     borderRadius: 22.5,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 6,
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 3,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   quickActionText: {
// // // // // //     color: COLORS.textDark,
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '600',
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   // Patterns Section - Keeping original circular design
// // // // // //   patternsSection: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   sectionHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   sectionTitleContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.textDark,
// // // // // //   },
// // // // // //   seeAll: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.primary,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   seeAllButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 4,
// // // // // //     backgroundColor: COLORS.primary + '20',
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 20,
// // // // // //   },
// // // // // //   seeAllText: {
// // // // // //     fontSize: 13,
// // // // // //     color: COLORS.primary,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   patternsList: {
// // // // // //     paddingHorizontal: 4,
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   compactPatternCard: {
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //     width: 60,
// // // // // //   },
// // // // // //   compactIconWrapper: {
// // // // // //     width: 48,
// // // // // //     height: 48,
// // // // // //     borderRadius: 24,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 6,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   compactPatternName: {
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: '500',
// // // // // //     color: COLORS.textDark,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   // Games Section
// // // // // //   section: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   gamesLoadingContainer: {
// // // // // //     padding: 30,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 12,
// // // // // //   },
// // // // // //   noGamesContainer: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     padding: 30,
// // // // // //     borderRadius: 12,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 2,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   noGamesText: {
// // // // // //     marginTop: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     fontSize: 14,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   refreshGamesBtn: {
// // // // // //     marginTop: 16,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 10,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   refreshGamesText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontWeight: '600',
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // //   gamesContainer: {
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   gameCard: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 16,
// // // // // //     padding: 16,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.border,
// // // // // //     position: 'relative',
// // // // // //     overflow: 'hidden',
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 2,
// // // // // //     elevation: 2,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   gameCardPattern: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 0,
// // // // // //     left: 0,
// // // // // //     width: 50,
// // // // // //     height: 50,
// // // // // //     borderBottomLeftRadius: 16,
// // // // // //     borderTopRightRadius: 25,
// // // // // //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// // // // // //   },
// // // // // //   statusBadge: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 10,
// // // // // //     paddingVertical: 4,
// // // // // //     borderBottomRightRadius: 12,
// // // // // //     borderTopLeftRadius: 14,
// // // // // //     gap: 4,
// // // // // //     zIndex: 2,
// // // // // //   },
// // // // // //   liveBadge: {
// // // // // //     backgroundColor: '#4CAF50',
// // // // // //   },
// // // // // //   scheduledBadge: {
// // // // // //     backgroundColor: COLORS.scheduled,
// // // // // //   },
// // // // // //   completedBadge: {
// // // // // //     backgroundColor: COLORS.completed,
// // // // // //   },
// // // // // //   defaultBadge: {
// // // // // //     backgroundColor: COLORS.scheduled,
// // // // // //   },
// // // // // //   statusText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: '700',
// // // // // //   },
// // // // // //   cardHeader: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "flex-start",
// // // // // //     marginTop: 8,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   gameIconContainer: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     flex: 1,
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   gameIconWrapper: {
// // // // // //     width: 48,
// // // // // //     height: 48,
// // // // // //     borderRadius: 10,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: COLORS.primary,
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 2,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   gameInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   gameName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "700",
// // // // // //     color: COLORS.textDark,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   gameId: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     fontWeight: "500",
// // // // // //   },
// // // // // //   gameTypeBadge: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 4,
// // // // // //     borderRadius: 10,
// // // // // //     gap: 4,
// // // // // //     marginLeft: 8,
// // // // // //     borderWidth: 1,
// // // // // //   },
// // // // // //   paidBadge: {
// // // // // //     backgroundColor: "rgba(255, 152, 0, 0.1)",
// // // // // //     borderColor: COLORS.accent,
// // // // // //   },
// // // // // //   freeBadge: {
// // // // // //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// // // // // //     borderColor: "#4CAF50",
// // // // // //   },
// // // // // //   gameTypeText: {
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: "700",
// // // // // //     color: COLORS.textDark,
// // // // // //   },
// // // // // //   gameDetails: {
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   detailRow: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   detailItem: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "flex-start",
// // // // // //     gap: 8,
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   detailIcon: {
// // // // // //     width: 28,
// // // // // //     height: 28,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: COLORS.background,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.primary,
// // // // // //   },
// // // // // //   detailLabel: {
// // // // // //     fontSize: 10,
// // // // // //     color: COLORS.textLight,
// // // // // //     fontWeight: "500",
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   detailText: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textDark,
// // // // // //     fontWeight: "600",
// // // // // //   },
// // // // // //   prizeContainer: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     backgroundColor: COLORS.background,
// // // // // //     padding: 12,
// // // // // //     borderRadius: 10,
// // // // // //     marginBottom: 16,
// // // // // //     gap: 10,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.border,
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 2,
// // // // // //     elevation: 1,
// // // // // //   },
// // // // // //   prizeIcon: {
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: COLORS.primary,
// // // // // //   },
// // // // // //   prizeInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   prizeLabel: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //     fontWeight: "500",
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   prizeText: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "700",
// // // // // //     color: COLORS.textDark,
// // // // // //   },
// // // // // //   joinButton: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 10,
// // // // // //     gap: 6,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //     overflow: 'hidden',
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   glassEffectOverlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     bottom: 0,
// // // // // //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// // // // // //     borderRadius: 10,
// // // // // //   },
// // // // // //   completedJoinButton: {
// // // // // //     backgroundColor: COLORS.completed,
// // // // // //   },
// // // // // //   joinButtonText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: "700",
// // // // // //   },
// // // // // //   winnersContainer: {
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   winnerCard: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 10,
// // // // // //     padding: 12,
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 1,
// // // // // //     elevation: 1,
// // // // // //   },
// // // // // //   winnerInfo: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 10,
// // // // // //   },
// // // // // //   winnerAvatar: {
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 18,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   winnerInitial: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '700',
// // // // // //   },
// // // // // //   winnerName: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.textDark,
// // // // // //   },
// // // // // //   winnerPrize: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   winnerTime: {
// // // // // //     fontSize: 11,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   infoCard: {
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     shadowColor: "#000",
// // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 2,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   infoList: {
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   infoItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 10,
// // // // // //   },
// // // // // //   infoText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textDark,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   bottomSpace: {
// // // // // //     height: 20,
// // // // // //   },
// // // // // //   loadingMoreContainer: {
// // // // // //     paddingVertical: 20,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   // Popup Styles
// // // // // //   popupOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 20,
// // // // // //   },
// // // // // //   popupContainer: {
// // // // // //     width: width * 0.8,
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 28,
// // // // // //     padding: 24,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupIcon: {
// // // // // //     width: 56,
// // // // // //     height: 56,
// // // // // //     borderRadius: 28,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   popupTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.textDark,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   popupGameName: {
// // // // // //     fontSize: 16,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 16,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   popupTimer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 6,
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   popupTimerText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textDark,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   popupPrize: {
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   popupPrizeLabel: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   popupPrizeValue: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.primary,
// // // // // //   },
// // // // // //   popupActions: {
// // // // // //     width: '100%',
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   popupPrimaryButton: {
// // // // // //     paddingVertical: 14,
// // // // // //     borderRadius: 20,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupPrimaryButtonText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   popupSecondaryButton: {
// // // // // //     paddingVertical: 10,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   popupSecondaryButtonText: {
// // // // // //     fontSize: 14,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   // Modal Styles
// // // // // //   modalOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   modalContent: {
// // // // // //     width: '90%',
// // // // // //     maxHeight: '80%',
// // // // // //     backgroundColor: COLORS.surface,
// // // // // //     borderRadius: 16,
// // // // // //     padding: 16,
// // // // // //   },
// // // // // //   modalHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     paddingBottom: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: COLORS.border,
// // // // // //   },
// // // // // //   modalTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: COLORS.textDark,
// // // // // //   },
// // // // // //   notificationItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     paddingVertical: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: COLORS.border,
// // // // // //   },
// // // // // //   notificationIcon: {
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 18,
// // // // // //     backgroundColor: '#F0F8FF',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   notificationContent: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   notificationTitle: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     color: COLORS.textDark,
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   notificationMessage: {
// // // // // //     fontSize: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   notificationDate: {
// // // // // //     fontSize: 10,
// // // // // //     color: COLORS.textLight,
// // // // // //   },
// // // // // //   emptyNotifications: {
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     paddingVertical: 40,
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     marginTop: 12,
// // // // // //     color: COLORS.textLight,
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // //   loadingIndicator: {
// // // // // //     marginVertical: 20,
// // // // // //   },
// // // // // //   closeBtn: {
// // // // // //     marginTop: 16,
// // // // // //     backgroundColor: COLORS.primary,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 8,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   closeBtnText: {
// // // // // //     color: COLORS.surface,
// // // // // //     fontWeight: '600',
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // // });

// // // // // // export default Home;




// // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // import {
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   View,
// // // // //   Image,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   FlatList,
// // // // //   Modal,
// // // // //   ActivityIndicator,
// // // // //   RefreshControl,
// // // // //   Dimensions,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   TextInput,
// // // // //   Animated,
// // // // //   Easing,
// // // // //   Platform,
// // // // // } from "react-native";
// // // // // import axios from "axios";
// // // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // import { useNavigation } from '@react-navigation/native';

// // // // // const { width } = Dimensions.get('window');

// // // // // // Color scheme matching the reference design
// // // // // const COLORS = {
// // // // //   primary: "#4facfe", // Main blue color
// // // // //   accent: "#ff9800", // Orange accent
// // // // //   background: "#f5f8ff", // Light background
// // // // //   surface: "#FFFFFF",
// // // // //   textDark: "#333333",
// // // // //   textLight: "#777777",
// // // // //   border: "#EEEEEE",
  
// // // // //   // Status colors
// // // // //   live: "#4CAF50",
// // // // //   scheduled: "#ff9800",
// // // // //   completed: "#ff9800",
  
// // // // //   // Quick action colors
// // // // //   deposit: "#4facfe",
// // // // //   withdraw: "#FF6B6B",
// // // // //   refer: "#4ECDC4",
// // // // //   support: "#9B59B6",
  
// // // // //   // Pattern card colors - keeping original circle colors
// // // // //   patternColors: [
// // // // //     '#2E5BFF', // Blue
// // // // //     '#F59E0B', // Orange
// // // // //     '#10B981', // Green
// // // // //     '#EF4444', // Red
// // // // //     '#8B5CF6', // Purple
// // // // //     '#EC4899', // Pink
// // // // //     '#06B6D4', // Cyan
// // // // //     '#F97316', // Orange
// // // // //   ],
// // // // // };

// // // // // const Home = () => {
// // // // //   const navigation = useNavigation();
// // // // //   const [notifications, setNotifications] = useState([]);
// // // // //   const [sliders, setSliders] = useState([]);
// // // // //   const [games, setGames] = useState([]);
// // // // //   const [filteredGames, setFilteredGames] = useState([]);
// // // // //   const [patterns, setPatterns] = useState([]);
// // // // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // // // //   const [activeSlide, setActiveSlide] = useState(0);
// // // // //   const [modalVisible, setModalVisible] = useState(false);
// // // // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // // // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // // // //   const [loadingGames, setLoadingGames] = useState(true);
// // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // // //   // Popup state
// // // // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // // // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // // // //   const [popupShown, setPopupShown] = useState(false);
  
// // // // //   // Animation for popup
// // // // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // // // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // // // //   // Pagination state for games
// // // // //   const [currentPage, setCurrentPage] = useState(1);
// // // // //   const [lastPage, setLastPage] = useState(1);
// // // // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // // // //   const sliderRef = useRef(null);
// // // // //   const scrollInterval = useRef(null);

// // // // //   // Filter options
// // // // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // // // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // // // //   // Function to calculate prize pool from pattern rewards
// // // // //   const calculatePrizePool = (game) => {
// // // // //     if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
// // // // //       return null;
// // // // //     }
    
// // // // //     const total = game.pattern_rewards.reduce((sum, reward) => {
// // // // //       const amount = parseFloat(reward.amount) || 0;
// // // // //       const count = parseInt(reward.reward_count) || 1;
// // // // //       return sum + (amount * count);
// // // // //     }, 0);
    
// // // // //     return total;
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchInitialData();
    
// // // // //     return () => {
// // // // //       if (scrollInterval.current) {
// // // // //         clearInterval(scrollInterval.current);
// // // // //       }
// // // // //     };
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (games.length > 0 && !popupShown) {
// // // // //       setTimeout(() => {
// // // // //         checkUpcomingGame();
// // // // //       }, 1500);
// // // // //     }
// // // // //   }, [games, popupShown]);

// // // // //   useEffect(() => {
// // // // //     if (sliders.length > 1) {
// // // // //       startAutoScroll();
// // // // //     }
// // // // //     return () => {
// // // // //       if (scrollInterval.current) {
// // // // //         clearInterval(scrollInterval.current);
// // // // //       }
// // // // //     };
// // // // //   }, [sliders.length]);

// // // // //   // Filter games based on search and active filter
// // // // //   useEffect(() => {
// // // // //     let filtered = games;
    
// // // // //     // Apply search filter
// // // // //     if (searchQuery.trim() !== '') {
// // // // //       filtered = filtered.filter(game =>
// // // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // // //       );
// // // // //     }
    
// // // // //     // Apply status filter
// // // // //     if (activeFilter === 'Live Now') {
// // // // //       filtered = filtered.filter(game => game.status === 'live');
// // // // //     } else if (activeFilter === 'Upcoming') {
// // // // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // // // //     } else if (activeFilter === 'Completed') {
// // // // //       filtered = filtered.filter(game => game.status === 'completed');
// // // // //     }
    
// // // // //     setFilteredGames(filtered);
// // // // //   }, [searchQuery, games, activeFilter]);

// // // // //   useEffect(() => {
// // // // //     if (upcomingGamePopup) {
// // // // //       Animated.parallel([
// // // // //         Animated.timing(opacityAnim, {
// // // // //           toValue: 1,
// // // // //           duration: 300,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(slideAnim, {
// // // // //           toValue: 0,
// // // // //           duration: 400,
// // // // //           easing: Easing.out(Easing.back(1.2)),
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ]).start();
// // // // //     } else {
// // // // //       opacityAnim.setValue(0);
// // // // //       slideAnim.setValue(300);
// // // // //     }
// // // // //   }, [upcomingGamePopup]);

// // // // //   const startAutoScroll = () => {
// // // // //     if (scrollInterval.current) {
// // // // //       clearInterval(scrollInterval.current);
// // // // //     }
    
// // // // //     scrollInterval.current = setInterval(() => {
// // // // //       if (sliders.length > 0) {
// // // // //         let nextIndex = activeSlide + 1;
// // // // //         if (nextIndex >= sliders.length) {
// // // // //           nextIndex = 0;
// // // // //         }
        
// // // // //         setActiveSlide(nextIndex);
// // // // //         if (sliderRef.current) {
// // // // //           const slideWidth = width - 32;
// // // // //           sliderRef.current.scrollToOffset({
// // // // //             offset: nextIndex * slideWidth,
// // // // //             animated: true
// // // // //           });
// // // // //         }
// // // // //       }
// // // // //     }, 3000);
// // // // //   };

// // // // //   const fetchInitialData = async () => {
// // // // //     try {
// // // // //       await Promise.all([
// // // // //         fetchNotifications(),
// // // // //         fetchSliders(),
// // // // //         fetchGames(1),
// // // // //         fetchPatterns()
// // // // //       ]);
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching initial data:", error);
// // // // //     }
// // // // //   };

// // // // //   const onRefresh = React.useCallback(() => {
// // // // //     setRefreshing(true);
// // // // //     setCurrentPage(1);
// // // // //     setGames([]);
// // // // //     setFilteredGames([]);
// // // // //     setPopupShown(false);
// // // // //     Promise.all([
// // // // //       fetchNotifications(),
// // // // //       fetchSliders(),
// // // // //       fetchGames(1),
// // // // //       fetchPatterns()
// // // // //     ]).finally(() => setRefreshing(false));
// // // // //   }, []);

// // // // //   const checkUpcomingGame = () => {
// // // // //     try {
// // // // //       const now = new Date();
      
// // // // //       const scheduledGames = games.filter(game => 
// // // // //         game.status === 'scheduled'
// // // // //       );
      
// // // // //       if (scheduledGames.length === 0) return;
      
// // // // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // // // //         let endDateTime;
        
// // // // //         try {
// // // // //           if (game.ticket_request_end_date) {
// // // // //             endDateTime = new Date(game.ticket_request_end_date);
// // // // //           } else {
// // // // //             endDateTime = new Date(game.game_date);
// // // // //           }
// // // // //         } catch (e) {
// // // // //           endDateTime = new Date();
// // // // //         }
        
// // // // //         return {
// // // // //           ...game,
// // // // //           endDateTime
// // // // //         };
// // // // //       });
      
// // // // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // // // //       const earliestEndGame = sortedGames[0];
      
// // // // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // // // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
// // // // //         setUpcomingGame(earliestEndGame);
// // // // //         setUpcomingGamePopup(true);
// // // // //         setPopupShown(true);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error checking upcoming game:", error);
// // // // //     }
// // // // //   };

// // // // //   const getTimeRemaining = (endDateTime) => {
// // // // //     const now = new Date();
// // // // //     const diff = endDateTime - now;
    
// // // // //     if (diff <= 0) return "Ending soon";
    
// // // // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // // // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // // // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // // // //     if (days > 0) {
// // // // //       return `${days}d ${hours}h left`;
// // // // //     } else if (hours > 0) {
// // // // //       return `${hours}h ${minutes}m left`;
// // // // //     } else {
// // // // //       return `${minutes}m left`;
// // // // //     }
// // // // //   };

// // // // //   const fetchNotifications = async () => {
// // // // //     try {
// // // // //       const token = await AsyncStorage.getItem("token");
// // // // //       if (!token) return;
// // // // //       const res = await axios.get(
// // // // //         "https://tambolatime.co.in/public/api/user/notifications",
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
// // // // //       if (res.data.status) {
// // // // //         setNotifications(res.data.data);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching notifications:", error);
// // // // //     } finally {
// // // // //       setLoadingNotifications(false);
// // // // //     }
// // // // //   };

// // // // //   const fetchSliders = async () => {
// // // // //     try {
// // // // //       setLoadingSliders(true);
// // // // //       const res = await axios.get(
// // // // //         "https://tambolatime.co.in/public/api/user/sliders"
// // // // //       );
// // // // //       if (res.data.success) {
// // // // //         setSliders(res.data.data || []);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching sliders:", error);
// // // // //       setSliders([]);
// // // // //     } finally {
// // // // //       setLoadingSliders(false);
// // // // //     }
// // // // //   };

// // // // //   const fetchGames = async (page = 1) => {
// // // // //     try {
// // // // //       if (page === 1) {
// // // // //         setLoadingGames(true);
// // // // //       }
      
// // // // //       const token = await AsyncStorage.getItem("token");
// // // // //       if (!token) return;
      
// // // // //       const res = await axios.get(
// // // // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
      
// // // // //       if (res.data.success) {
// // // // //         const newGames = res.data.games.data || [];
// // // // //         const pagination = res.data.games;
        
// // // // //         if (page === 1) {
// // // // //           setGames(newGames);
// // // // //           setFilteredGames(newGames);
// // // // //         } else {
// // // // //           setGames(prev => [...prev, ...newGames]);
// // // // //           setFilteredGames(prev => [...prev, ...newGames]);
// // // // //         }
        
// // // // //         setCurrentPage(pagination.current_page);
// // // // //         setLastPage(pagination.last_page);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching games:", error);
// // // // //     } finally {
// // // // //       if (page === 1) {
// // // // //         setLoadingGames(false);
// // // // //       }
// // // // //       setLoadingMore(false);
// // // // //     }
// // // // //   };

// // // // //   const fetchPatterns = async () => {
// // // // //     try {
// // // // //       setLoadingPatterns(true);
// // // // //       const token = await AsyncStorage.getItem("token");
      
// // // // //       if (!token) {
// // // // //         setLoadingPatterns(false);
// // // // //         return;
// // // // //       }

// // // // //       const response = await axios.get(
// // // // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // // // //         {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${token}`,
// // // // //             Accept: 'application/json',
// // // // //           },
// // // // //         }
// // // // //       );

// // // // //       if (response.data && response.data.status) {
// // // // //         const patternsData = response.data.data?.patterns || [];
        
// // // // //         const patternSequence = [
// // // // //           'top line',
// // // // //           'middle line', 
// // // // //           'bottom line',
// // // // //           'breakfast',
// // // // //           'lunch',
// // // // //           'dinner',
// // // // //           'four corners',
// // // // //           'bamboo',
// // // // //           'early five',
// // // // //           'non claimers',
// // // // //           'full house'
// // // // //         ];
        
// // // // //         const sortedPatterns = patternsData.sort((a, b) => {
// // // // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // // // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // // // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // // // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // // // //           if (aIndex === -1) return 1;
// // // // //           if (bIndex === -1) return -1;
          
// // // // //           return aIndex - bIndex;
// // // // //         });
        
// // // // //         setPatterns(sortedPatterns.slice(0, 8));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log('Error fetching patterns in Home:', error);
// // // // //     } finally {
// // // // //       setLoadingPatterns(false);
// // // // //     }
// // // // //   };

// // // // //   const loadMoreGames = () => {
// // // // //     if (!loadingMore && currentPage < lastPage) {
// // // // //       setLoadingMore(true);
// // // // //       fetchGames(currentPage + 1);
// // // // //     }
// // // // //   };

// // // // //   const handleGamePress = (game) => {
// // // // //     navigation.navigate("GameDetails", { game });
// // // // //   };

// // // // //   const handleAllGamesPress = () => {
// // // // //     navigation.navigate("Game");
// // // // //   };

// // // // //   const handleAllPatternsPress = () => {
// // // // //     navigation.navigate("UserGamePatterns");
// // // // //   };

// // // // //   const handleViewAllWinners = () => {
// // // // //     navigation.navigate("Game");
// // // // //   };

// // // // //   const handlePatternPress = (pattern) => {
// // // // //     navigation.navigate("UserGamePatterns", { 
// // // // //       selectedPatternId: pattern.id,
// // // // //       selectedPattern: pattern 
// // // // //     });
// // // // //   };

// // // // //   const handlePopupJoinNow = () => {
// // // // //     setUpcomingGamePopup(false);
// // // // //     if (upcomingGame) {
// // // // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // // // //     }
// // // // //   };

// // // // //   const handlePopupLater = () => {
// // // // //     setUpcomingGamePopup(false);
// // // // //   };

// // // // //   const getPatternIcon = (pattern) => {
// // // // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // // // //     const iconMap = {
// // // // //       'bamboo': 'leaf',
// // // // //       'bottom line': 'arrow-down',
// // // // //       'breakfast': 'cafe',
// // // // //       'dinner': 'restaurant',
// // // // //       'early five': '5',
// // // // //       'four corners': 'apps',
// // // // //       'full house': 'home',
// // // // //       'lunch': 'fast-food',
// // // // //       'middle line': 'remove',
// // // // //       'non claimer': 'close',
// // // // //       'top line': 'arrow-up'
// // // // //     };
    
// // // // //     for (const [key, icon] of Object.entries(iconMap)) {
// // // // //       if (patternName.includes(key)) return icon;
// // // // //     }
    
// // // // //     return 'grid-outline';
// // // // //   };

// // // // //   const formatPatternName = (name) => {
// // // // //     if (!name) return 'Unknown Pattern';
// // // // //     return name
// // // // //       .split('_')
// // // // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // // // //       .join(' ');
// // // // //   };

// // // // //   // Original pattern card design with circles
// // // // //   const renderPatternCard = (pattern, index) => {
// // // // //     const icon = getPatternIcon(pattern);
// // // // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // // // //     // Pattern names for display
// // // // //     const patterns = [
// // // // //       'Top Line',
// // // // //       'Middle',
// // // // //       'Bottom',
// // // // //       'Breakfast',
// // // // //       'Lunch',
// // // // //       'Dinner',
// // // // //       'Corners',
// // // // //       'Bamboo',
// // // // //     ];
    
// // // // //     const patternName = patterns[index % patterns.length];
// // // // //     const bgColor = COLORS.patternColors[index % COLORS.patternColors.length];
    
// // // // //     return (
// // // // //       <TouchableOpacity 
// // // // //         key={pattern.id} 
// // // // //         style={styles.compactPatternCard}
// // // // //         onPress={() => handlePatternPress(pattern)}
// // // // //         activeOpacity={0.7}
// // // // //       >
// // // // //         <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
// // // // //           <Ionicons name={icon} size={18} color="#FFFFFF" />
// // // // //         </View>
// // // // //         <Text style={styles.compactPatternName} numberOfLines={1}>
// // // // //           {patternName}
// // // // //         </Text>
// // // // //       </TouchableOpacity>
// // // // //     );
// // // // //   };

// // // // //   const renderSliderItem = ({ item }) => (
// // // // //     <View style={styles.slideContainer}>
// // // // //       <Image
// // // // //         source={{ 
// // // // //           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
// // // // //         }}
// // // // //         style={styles.sliderImage}
// // // // //         resizeMode="cover"
// // // // //       />
// // // // //     </View>
// // // // //   );

// // // // //   const handleScroll = (event) => {
// // // // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // // // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // // // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // // // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // // // //       setActiveSlide(currentIndex);
// // // // //     }
// // // // //   };

// // // // //   const renderPagination = () => {
// // // // //     if (sliders.length <= 1) return null;
    
// // // // //     return (
// // // // //       <View style={styles.paginationContainer}>
// // // // //         {sliders.map((_, index) => (
// // // // //           <View
// // // // //             key={index}
// // // // //             style={[
// // // // //               styles.paginationDot,
// // // // //               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
// // // // //             ]}
// // // // //           />
// // // // //         ))}
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   const renderGameCard = ({ item: game }) => {
// // // // //     if (!game) return null;
    
// // // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // // //     const isPaid = game.ticket_type === "paid";
// // // // //     const isLive = game.status === 'live';
// // // // //     const isScheduled = game.status === 'scheduled';
// // // // //     const isCompleted = game.status === 'completed';
    
// // // // //     // Calculate prize pool from pattern rewards
// // // // //     const prizePool = calculatePrizePool(game);
    
// // // // //     return (
// // // // //       <TouchableOpacity
// // // // //         style={styles.gameCard}
// // // // //         activeOpacity={0.9}
// // // // //         onPress={() => handleGamePress(game)}
// // // // //       >
// // // // //         {/* Background Pattern */}
// // // // //         <View style={styles.gameCardPattern} />
        
// // // // //         {/* Status badge */}
// // // // //         <View style={[
// // // // //           styles.statusBadge,
// // // // //           isLive ? styles.liveBadge :
// // // // //           isScheduled ? styles.scheduledBadge :
// // // // //           isCompleted ? styles.completedBadge :
// // // // //           styles.defaultBadge
// // // // //         ]}>
// // // // //           <Ionicons 
// // // // //             name={
// // // // //               isLive ? 'radio-button-on' : 
// // // // //               isCompleted ? 'checkmark-circle' :
// // // // //               'time'
// // // // //             } 
// // // // //             size={10} 
// // // // //             color={COLORS.surface} 
// // // // //           />
// // // // //           <Text style={styles.statusText}>
// // // // //             {isLive ? 'LIVE' : 
// // // // //              isCompleted ? 'COMPLETED' : 
// // // // //              'SOON'}
// // // // //           </Text>
// // // // //         </View>

// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.gameIconContainer}>
// // // // //             <View style={styles.gameIconWrapper}>
// // // // //               <MaterialIcons name="confirmation-number" size={32} color={COLORS.accent} />
// // // // //             </View>
// // // // //             <View style={styles.gameInfo}>
// // // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // // //                 {game.game_name || "Tambola Game"}
// // // // //               </Text>
// // // // //               <Text style={styles.gameId}>
// // // // //                 ID: {game.game_code || "N/A"}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>
          
// // // // //           <View style={[
// // // // //             styles.gameTypeBadge,
// // // // //             isPaid ? styles.paidBadge : styles.freeBadge,
// // // // //           ]}>
// // // // //             {isPaid ? (
// // // // //               <>
// // // // //                 <MaterialIcons name="diamond" size={14} color={COLORS.accent} />
// // // // //                 <Text style={styles.gameTypeText}>
// // // // //                   ₹{ticketCost}
// // // // //                 </Text>
// // // // //               </>
// // // // //             ) : (
// // // // //               <>
// // // // //                 <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
// // // // //                 <Text style={styles.gameTypeText}>
// // // // //                   FREE
// // // // //                 </Text>
// // // // //               </>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.gameDetails}>
// // // // //           <View style={styles.detailRow}>
// // // // //             <View style={styles.detailItem}>
// // // // //               <View style={styles.detailIcon}>
// // // // //                 <Ionicons name="calendar" size={14} color={COLORS.accent} />
// // // // //               </View>
// // // // //               <View>
// // // // //                 <Text style={styles.detailLabel}>Date</Text>
// // // // //                 <Text style={styles.detailText}>
// // // // //                   {game.game_date_formatted || game.game_date || "Date TBA"}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
            
// // // // //             <View style={styles.detailItem}>
// // // // //               <View style={styles.detailIcon}>
// // // // //                 <Ionicons name="time" size={14} color={COLORS.accent} />
// // // // //               </View>
// // // // //               <View>
// // // // //                 <Text style={styles.detailLabel}>Time</Text>
// // // // //                 <Text style={styles.detailText}>
// // // // //                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
// // // // //           </View>
          
// // // // //           <View style={styles.detailRow}>
// // // // //             <View style={styles.detailItem}>
// // // // //               <View style={styles.detailIcon}>
// // // // //                 <Ionicons name="person" size={14} color={COLORS.accent} />
// // // // //               </View>
// // // // //               <View>
// // // // //                 <Text style={styles.detailLabel}>Host</Text>
// // // // //                 <Text style={styles.detailText}>
// // // // //                   {game.user ? game.user.name : 'Tambola Timez'}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
            
// // // // //             {game.available_tickets !== undefined && !isCompleted && (
// // // // //               <View style={styles.detailItem}>
// // // // //                 <View style={styles.detailIcon}>
// // // // //                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.accent} />
// // // // //                 </View>
// // // // //                 <View>
// // // // //                   <Text style={styles.detailLabel}>Tickets</Text>
// // // // //                   <Text style={styles.detailText}>
// // // // //                     {game.available_tickets} Left
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             )}
// // // // //             {isCompleted && (
// // // // //               <View style={styles.detailItem}>
// // // // //                 <View style={styles.detailIcon}>
// // // // //                   <Ionicons name="trophy" size={14} color={COLORS.accent} />
// // // // //                 </View>
// // // // //                 <View>
// // // // //                   <Text style={styles.detailLabel}>Status</Text>
// // // // //                   <Text style={styles.detailText}>Completed</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.prizeContainer}>
// // // // //           <View style={styles.prizeIcon}>
// // // // //             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.accent} />
// // // // //           </View>
// // // // //           <View style={styles.prizeInfo}>
// // // // //             <Text style={styles.prizeLabel}>
// // // // //               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
// // // // //             </Text>
// // // // //             <Text style={styles.prizeText}>
// // // // //               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // // // //             </Text>
// // // // //             {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// // // // //               <Text style={styles.prizeSubtext}>
// // // // //                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
// // // // //               </Text>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>

// // // // //         <TouchableOpacity 
// // // // //           style={[
// // // // //             styles.joinButton,
// // // // //             isCompleted && styles.completedJoinButton
// // // // //           ]}
// // // // //           onPress={() => handleGamePress(game)}
// // // // //         >
// // // // //           <View style={styles.glassEffectOverlay} />
// // // // //           <Text style={styles.joinButtonText}>
// // // // //             {isCompleted 
// // // // //               ? 'VIEW RESULTS' 
// // // // //               : isLive
// // // // //                 ? 'JOIN GAME' 
// // // // //                 : 'VIEW DETAILS'}
// // // // //           </Text>
// // // // //           <Ionicons 
// // // // //             name={isCompleted ? "trophy" : "arrow-forward"} 
// // // // //             size={16} 
// // // // //             color={COLORS.surface} 
// // // // //           />
// // // // //         </TouchableOpacity>
// // // // //       </TouchableOpacity>
// // // // //     );
// // // // //   };

// // // // //   const clearSearch = () => {
// // // // //     setSearchQuery('');
// // // // //   };

// // // // //   const renderFooter = () => {
// // // // //     if (!loadingMore) return null;
// // // // //     return (
// // // // //       <View style={styles.loadingMoreContainer}>
// // // // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   const UpcomingGamePopup = () => {
// // // // //     if (!upcomingGame) return null;
    
// // // // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // // // //     const isPaid = upcomingGame.ticket_type === "paid";
// // // // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // // // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // // // //     // Calculate prize pool for popup
// // // // //     const prizePool = calculatePrizePool(upcomingGame);
    
// // // // //     return (
// // // // //       <Modal
// // // // //         visible={upcomingGamePopup}
// // // // //         transparent={true}
// // // // //         animationType="fade"
// // // // //         onRequestClose={handlePopupLater}
// // // // //       >
// // // // //         <View style={styles.popupOverlay}>
// // // // //           <Animated.View 
// // // // //             style={[
// // // // //               styles.popupContainer,
// // // // //               {
// // // // //                 opacity: opacityAnim,
// // // // //                 transform: [{ translateY: slideAnim }]
// // // // //               }
// // // // //             ]}
// // // // //           >
// // // // //             <View style={[styles.popupIcon, { backgroundColor: COLORS.primary + '20' }]}>
// // // // //               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
// // // // //             </View>
            
// // // // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // // // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // // // //             <View style={styles.popupTimer}>
// // // // //               <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
// // // // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // // // //             </View>
            
// // // // //             <View style={styles.popupPrize}>
// // // // //               <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
// // // // //               <Text style={styles.popupPrizeValue}>
// // // // //                 {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // // // //               </Text>
// // // // //               {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
// // // // //                 <Text style={styles.popupPrizeSubtext}>
// // // // //                   {upcomingGame.pattern_rewards.length} Patterns
// // // // //                 </Text>
// // // // //               )}
// // // // //             </View>
            
// // // // //             <View style={styles.popupActions}>
// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
// // // // //                 onPress={handlePopupJoinNow}
// // // // //               >
// // // // //                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // // // //               </TouchableOpacity>
              
// // // // //               <TouchableOpacity 
// // // // //                 style={styles.popupSecondaryButton}
// // // // //                 onPress={handlePopupLater}
// // // // //               >
// // // // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </Animated.View>
// // // // //         </View>
// // // // //       </Modal>
// // // // //     );
// // // // //   };

// // // // //   const Header = () => (
// // // // //     <View style={styles.header}>
// // // // //       <Text style={styles.headerTitle}>Houzie Timez</Text>

// // // // //       <TouchableOpacity 
// // // // //         style={styles.notification}
// // // // //         onPress={() => setModalVisible(true)}
// // // // //       >
// // // // //         <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// // // // //         {notifications.length > 0 && (
// // // // //           <View style={styles.badge}>
// // // // //             <Text style={styles.badgeText}>{notifications.length}</Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </TouchableOpacity>
// // // // //     </View>
// // // // //   );

// // // // //   if (loadingGames && games.length === 0) {
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
// // // // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// // // // //       <View style={styles.container}>
// // // // //         {/* Header */}
// // // // //         <Header />

// // // // //         {/* Search Bar */}
// // // // //         <View style={styles.searchWrapper}>
// // // // //           <View style={styles.searchBox}>
// // // // //             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
// // // // //             <TextInput
// // // // //               placeholder="Search games by name or ID..."
// // // // //               placeholderTextColor={COLORS.textLight}
// // // // //               style={styles.searchInput}
// // // // //               value={searchQuery}
// // // // //               onChangeText={setSearchQuery}
// // // // //               returnKeyType="search"
// // // // //             />
// // // // //             {searchQuery.length > 0 ? (
// // // // //               <TouchableOpacity onPress={clearSearch}>
// // // // //                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
// // // // //               </TouchableOpacity>
// // // // //             ) : (
// // // // //               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
// // // // //             )}
// // // // //           </View>
// // // // //         </View>

// // // // //         <ScrollView
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           refreshControl={
// // // // //             <RefreshControl
// // // // //               refreshing={refreshing}
// // // // //               onRefresh={onRefresh}
// // // // //               tintColor={COLORS.primary}
// // // // //               colors={[COLORS.primary]}
// // // // //             />
// // // // //           }
// // // // //         >
// // // // //           {/* Slider Section */}
// // // // //           {loadingSliders ? (
// // // // //             <View style={styles.sliderLoadingContainer}>
// // // // //               <ActivityIndicator size="large" color={COLORS.primary} />
// // // // //               <Text style={styles.loadingText}>Loading offers...</Text>
// // // // //             </View>
// // // // //           ) : sliders.length > 0 ? (
// // // // //             <View style={styles.sliderSection}>
// // // // //               <View style={styles.sliderWrapper}>
// // // // //                 <FlatList
// // // // //                   ref={sliderRef}
// // // // //                   data={sliders}
// // // // //                   renderItem={renderSliderItem}
// // // // //                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // // // //                   horizontal
// // // // //                   pagingEnabled
// // // // //                   showsHorizontalScrollIndicator={false}
// // // // //                   onScroll={handleScroll}
// // // // //                   scrollEventThrottle={16}
// // // // //                 />
                
// // // // //                 {/* Pagination Dots */}
// // // // //                 {renderPagination()}
// // // // //               </View>
// // // // //             </View>
// // // // //           ) : null}

// // // // //           {/* Filter Chips - Commented out as in original */}
// // // // //           {/* <ScrollView
// // // // //             horizontal
// // // // //             showsHorizontalScrollIndicator={false}
// // // // //             contentContainerStyle={styles.filtersContainer}
// // // // //           >
// // // // //             {filters.map((filter) => (
// // // // //               <TouchableOpacity
// // // // //                 key={filter}
// // // // //                 style={[
// // // // //                   styles.filterChip,
// // // // //                   activeFilter === filter && styles.activeFilterChip,
// // // // //                 ]}
// // // // //                 onPress={() => setActiveFilter(filter)}
// // // // //               >
// // // // //                 <Text
// // // // //                   style={[
// // // // //                     styles.filterChipText,
// // // // //                     activeFilter === filter && styles.activeFilterChipText,
// // // // //                   ]}
// // // // //                 >
// // // // //                   {filter}
// // // // //                 </Text>
// // // // //               </TouchableOpacity>
// // // // //             ))}
// // // // //           </ScrollView> */}

// // // // //           {/* Quick Actions - Commented out as in original */}
// // // // //           {/* <View style={styles.quickActions}>
// // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.deposit }]}>
// // // // //                 <FontAwesome name="money" size={20} color={COLORS.surface} />
// // // // //               </View>
// // // // //               <Text style={styles.quickActionText}>Deposit</Text>
// // // // //             </TouchableOpacity>
// // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.withdraw }]}>
// // // // //                 <FontAwesome name="bank" size={20} color={COLORS.surface} />
// // // // //               </View>
// // // // //               <Text style={styles.quickActionText}>Withdraw</Text>
// // // // //             </TouchableOpacity>
// // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.refer }]}>
// // // // //                 <FontAwesome name="users" size={20} color={COLORS.surface} />
// // // // //               </View>
// // // // //               <Text style={styles.quickActionText}>Refer</Text>
// // // // //             </TouchableOpacity>
// // // // //             <TouchableOpacity style={styles.quickAction}>
// // // // //               <View style={[styles.quickActionIcon, { backgroundColor: COLORS.support }]}>
// // // // //                 <Ionicons name="headset" size={20} color={COLORS.surface} />
// // // // //               </View>
// // // // //               <Text style={styles.quickActionText}>Support</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View> */}

// // // // //           {/* Patterns Section - Keeping original circular design */}
// // // // //           {patterns.length > 0 && (
// // // // //             <View style={styles.patternsSection}>
// // // // //               <View style={styles.sectionHeader}>
// // // // //                 <View style={styles.sectionTitleContainer}>
// // // // //                   <Ionicons name="grid-outline" size={22} color={COLORS.primary} />
// // // // //                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
// // // // //                 </View>
// // // // //                 <TouchableOpacity onPress={handleAllPatternsPress}>
// // // // //                   <View style={styles.seeAllButton}>
// // // // //                     <Text style={styles.seeAllText}>See All</Text>
// // // // //                     <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
// // // // //                   </View>
// // // // //                 </TouchableOpacity>
// // // // //               </View>

// // // // //               {loadingPatterns ? (
// // // // //                 <ActivityIndicator size="small" color={COLORS.primary} />
// // // // //               ) : (
// // // // //                 <ScrollView 
// // // // //                   horizontal 
// // // // //                   showsHorizontalScrollIndicator={false}
// // // // //                   contentContainerStyle={styles.patternsList}
// // // // //                 >
// // // // //                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // // // //                 </ScrollView>
// // // // //               )}
// // // // //             </View>
// // // // //           )}

// // // // //           {/* Games Section */}
// // // // //           <View style={styles.section}>
// // // // //             <View style={styles.sectionHeader}>
// // // // //               <View style={styles.sectionTitleContainer}>
// // // // //                 <Ionicons name="game-controller-outline" size={22} color={COLORS.primary} />
// // // // //                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
// // // // //               </View>
// // // // //               <TouchableOpacity onPress={handleAllGamesPress}>
// // // // //                 <Text style={styles.seeAll}>See All</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             {loadingGames ? (
// // // // //               <View style={styles.gamesLoadingContainer}>
// // // // //                 <ActivityIndicator size="large" color={COLORS.primary} />
// // // // //                 <Text style={styles.loadingText}>Loading games...</Text>
// // // // //               </View>
// // // // //             ) : filteredGames.length > 0 ? (
// // // // //               <View style={styles.gamesContainer}>
// // // // //                 {filteredGames.map((game, index) => (
// // // // //                   <View key={game.id || index}>
// // // // //                     {renderGameCard({ item: game })}
// // // // //                   </View>
// // // // //                 ))}
// // // // //                 {loadingMore && (
// // // // //                   <View style={styles.loadingMoreContainer}>
// // // // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // // // //                   </View>
// // // // //                 )}
// // // // //               </View>
// // // // //             ) : (
// // // // //               <View style={styles.noGamesContainer}>
// // // // //                 <Ionicons name="game-controller-outline" size={50} color={COLORS.textLight} />
// // // // //                 <Text style={styles.noGamesText}>
// // // // //                   {searchQuery ? 'No games found' : 'No games available at the moment'}
// // // // //                 </Text>
// // // // //                 {searchQuery && (
// // // // //                   <TouchableOpacity 
// // // // //                     style={styles.refreshGamesBtn}
// // // // //                     onPress={clearSearch}
// // // // //                   >
// // // // //                     <Text style={styles.refreshGamesText}>Clear Search</Text>
// // // // //                   </TouchableOpacity>
// // // // //                 )}
// // // // //               </View>
// // // // //             )}
// // // // //           </View>

// // // // //           {/* Recent Winners Section */}
// // // // //           <View style={styles.section}>
// // // // //             <View style={styles.sectionHeader}>
// // // // //               <View style={styles.sectionTitleContainer}>
// // // // //                 <FontAwesome name="trophy" size={22} color={COLORS.primary} />
// // // // //                 <Text style={styles.sectionTitle}>RECENT WINNERS</Text>
// // // // //               </View>
// // // // //               <TouchableOpacity onPress={handleViewAllWinners}>
// // // // //                 <Text style={styles.seeAll}>See All</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.winnersContainer}>
// // // // //               {[
// // // // //                 { id: 1, name: "Amit Sharma", prize: "Won Full House 🏆", time: "2 min ago" },
// // // // //                 { id: 2, name: "Neha Gupta", prize: "Won Early 5 🎉", time: "5 min ago" },
// // // // //                 { id: 3, name: "Rahul Verma", prize: "Won Corners ✨", time: "10 min ago" },
// // // // //               ].map((winner) => (
// // // // //                 <View key={winner.id} style={styles.winnerCard}>
// // // // //                   <View style={styles.winnerInfo}>
// // // // //                     <View style={styles.winnerAvatar}>
// // // // //                       <Text style={styles.winnerInitial}>{winner.name.charAt(0)}</Text>
// // // // //                     </View>
// // // // //                     <View>
// // // // //                       <Text style={styles.winnerName}>{winner.name}</Text>
// // // // //                       <Text style={styles.winnerPrize}>{winner.prize}</Text>
// // // // //                     </View>
// // // // //                   </View>
// // // // //                   <Text style={styles.winnerTime}>{winner.time}</Text>
// // // // //                 </View>
// // // // //               ))}
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* Why Play With Us Section */}
// // // // //           <View style={styles.section}>
// // // // //             <View style={styles.sectionHeader}>
// // // // //               <View style={styles.sectionTitleContainer}>
// // // // //                 <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
// // // // //                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
// // // // //               </View>
// // // // //             </View>
            
// // // // //             <View style={styles.infoCard}>
// // // // //               <View style={styles.infoList}>
// // // // //                 <View style={styles.infoItem}>
// // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // //                   <Text style={styles.infoText}>Fast & Fair Games</Text>
// // // // //                 </View>
// // // // //                 <View style={styles.infoItem}>
// // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // //                   <Text style={styles.infoText}>Real Players</Text>
// // // // //                 </View>
// // // // //                 <View style={styles.infoItem}>
// // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // //                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
// // // // //                 </View>
// // // // //                 <View style={styles.infoItem}>
// // // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // // //                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={styles.bottomSpace} />
// // // // //         </ScrollView>

// // // // //         {/* Popup */}
// // // // //         <UpcomingGamePopup />

// // // // //         {/* Notifications Modal */}
// // // // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // // // //           <View style={styles.modalOverlay}>
// // // // //             <View style={styles.modalContent}>
// // // // //               <View style={styles.modalHeader}>
// // // // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // // // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // // // //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// // // // //                 </TouchableOpacity>
// // // // //               </View>

// // // // //               {loadingNotifications ? (
// // // // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// // // // //               ) : (
// // // // //                 <FlatList
// // // // //                   data={notifications}
// // // // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // //                   renderItem={({ item }) => (
// // // // //                     <View style={styles.notificationItem}>
// // // // //                       <View style={styles.notificationIcon}>
// // // // //                         <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
// // // // //                       </View>
// // // // //                       <View style={styles.notificationContent}>
// // // // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // // // //                         <Text style={styles.notificationMessage}>
// // // // //                           {item.message || "Check out the new features!"}
// // // // //                         </Text>
// // // // //                         <Text style={styles.notificationDate}>
// // // // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // // // //                         </Text>
// // // // //                       </View>
// // // // //                     </View>
// // // // //                   )}
// // // // //                   ListEmptyComponent={
// // // // //                     <View style={styles.emptyNotifications}>
// // // // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // // // //                       <Text style={styles.emptyText}>No notifications yet</Text>
// // // // //                     </View>
// // // // //                   }
// // // // //                 />
// // // // //               )}

// // // // //               <TouchableOpacity
// // // // //                 style={styles.closeBtn}
// // // // //                 onPress={() => setModalVisible(false)}
// // // // //               >
// // // // //                 <Text style={styles.closeBtnText}>Close</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </Modal>
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
// // // // //   },
// // // // //   loadingContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   header: {
// // // // //     backgroundColor: COLORS.primary,
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 16,
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   headerTitle: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 22,
// // // // //     fontWeight: "700",
// // // // //   },
// // // // //   notification: {
// // // // //     position: "relative",
// // // // //   },
// // // // //   badge: {
// // // // //     position: "absolute",
// // // // //     top: -6,
// // // // //     right: -6,
// // // // //     backgroundColor: "red",
// // // // //     width: 18,
// // // // //     height: 18,
// // // // //     borderRadius: 9,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },
// // // // //   badgeText: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 10,
// // // // //     fontWeight: "700",
// // // // //   },
// // // // //   searchWrapper: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     backgroundColor: COLORS.primary,
// // // // //   },
// // // // //   searchBox: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 14,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 10,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   searchInput: {
// // // // //     flex: 1,
// // // // //     marginHorizontal: 10,
// // // // //     fontSize: 15,
// // // // //     color: COLORS.textDark,
// // // // //     padding: 0,
// // // // //   },
// // // // //   sliderSection: {
// // // // //     marginTop: 16,
// // // // //     marginBottom: 8,
// // // // //     paddingHorizontal: 16,
// // // // //   },
// // // // //   sliderWrapper: {
// // // // //     height: 150,
// // // // //     position: 'relative',
// // // // //     borderRadius: 16,
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   sliderLoadingContainer: {
// // // // //     height: 150,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 16,
// // // // //     marginBottom: 8,
// // // // //     marginHorizontal: 16,
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 16,
// // // // //   },
// // // // //   slideContainer: {
// // // // //     width: width - 32,
// // // // //     height: 150,
// // // // //   },
// // // // //   sliderImage: {
// // // // //     width: '100%',
// // // // //     height: '100%',
// // // // //     borderRadius: 16,
// // // // //   },
// // // // //   paginationContainer: {
// // // // //     flexDirection: 'row',
// // // // //     position: 'absolute',
// // // // //     bottom: 10,
// // // // //     alignSelf: 'center',
// // // // //   },
// // // // //   paginationDot: {
// // // // //     width: 8,
// // // // //     height: 8,
// // // // //     borderRadius: 4,
// // // // //     marginHorizontal: 4,
// // // // //   },
// // // // //   paginationDotActive: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     width: 20,
// // // // //   },
// // // // //   paginationDotInactive: {
// // // // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // // // //   },
// // // // //   loadingText: {
// // // // //     marginTop: 10,
// // // // //     color: COLORS.textLight,
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   filtersContainer: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     gap: 8,
// // // // //   },
// // // // //   filterChip: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 20,
// // // // //     marginRight: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: COLORS.border,
// // // // //   },
// // // // //   activeFilterChip: {
// // // // //     backgroundColor: COLORS.primary,
// // // // //     borderColor: COLORS.primary,
// // // // //   },
// // // // //   filterChipText: {
// // // // //     color: COLORS.textDark,
// // // // //     fontSize: 13,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   activeFilterChipText: {
// // // // //     color: COLORS.surface,
// // // // //   },
// // // // //   quickActions: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     marginBottom: 24,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   quickAction: {
// // // // //     alignItems: 'center',
// // // // //     width: (width - 60) / 4,
// // // // //   },
// // // // //   quickActionIcon: {
// // // // //     width: 45,
// // // // //     height: 45,
// // // // //     borderRadius: 22.5,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 6,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 3,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   quickActionText: {
// // // // //     color: COLORS.textDark,
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   // Patterns Section - Keeping original circular design
// // // // //   patternsSection: {
// // // // //     paddingHorizontal: 16,
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   sectionHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   sectionTitleContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 8,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.textDark,
// // // // //   },
// // // // //   seeAll: {
// // // // //     fontSize: 14,
// // // // //     color: COLORS.primary,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   seeAllButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //     backgroundColor: COLORS.primary + '20',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 20,
// // // // //   },
// // // // //   seeAllText: {
// // // // //     fontSize: 13,
// // // // //     color: COLORS.primary,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   patternsList: {
// // // // //     paddingHorizontal: 4,
// // // // //     gap: 12,
// // // // //   },
// // // // //   compactPatternCard: {
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //     width: 60,
// // // // //   },
// // // // //   compactIconWrapper: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 6,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   compactPatternName: {
// // // // //     fontSize: 11,
// // // // //     fontWeight: '500',
// // // // //     color: COLORS.textDark,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   // Games Section
// // // // //   section: {
// // // // //     paddingHorizontal: 16,
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   gamesLoadingContainer: {
// // // // //     padding: 30,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 12,
// // // // //   },
// // // // //   noGamesContainer: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     padding: 30,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 2,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   noGamesText: {
// // // // //     marginTop: 12,
// // // // //     color: COLORS.textLight,
// // // // //     fontSize: 14,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   refreshGamesBtn: {
// // // // //     marginTop: 16,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   refreshGamesText: {
// // // // //     color: COLORS.surface,
// // // // //     fontWeight: '600',
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   gamesContainer: {
// // // // //     gap: 12,
// // // // //   },
// // // // //   gameCard: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 16,
// // // // //     padding: 16,
// // // // //     borderWidth: 1,
// // // // //     borderColor: COLORS.border,
// // // // //     position: 'relative',
// // // // //     overflow: 'hidden',
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 2,
// // // // //     elevation: 2,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   gameCardPattern: {
// // // // //     position: 'absolute',
// // // // //     bottom: 0,
// // // // //     left: 0,
// // // // //     width: 50,
// // // // //     height: 50,
// // // // //     borderBottomLeftRadius: 16,
// // // // //     borderTopRightRadius: 25,
// // // // //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// // // // //   },
// // // // //   statusBadge: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 4,
// // // // //     borderBottomRightRadius: 12,
// // // // //     borderTopLeftRadius: 14,
// // // // //     gap: 4,
// // // // //     zIndex: 2,
// // // // //   },
// // // // //   liveBadge: {
// // // // //     backgroundColor: '#4CAF50',
// // // // //   },
// // // // //   scheduledBadge: {
// // // // //     backgroundColor: COLORS.scheduled,
// // // // //   },
// // // // //   completedBadge: {
// // // // //     backgroundColor: COLORS.completed,
// // // // //   },
// // // // //   defaultBadge: {
// // // // //     backgroundColor: COLORS.scheduled,
// // // // //   },
// // // // //   statusText: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 10,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   cardHeader: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "flex-start",
// // // // //     marginTop: 8,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   gameIconContainer: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     flex: 1,
// // // // //     gap: 12,
// // // // //   },
// // // // //   gameIconWrapper: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 10,
// // // // //     backgroundColor: COLORS.background,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     borderWidth: 2,
// // // // //     borderColor: COLORS.primary,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 2,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   gameInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   gameName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: "700",
// // // // //     color: COLORS.textDark,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   gameId: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textLight,
// // // // //     fontWeight: "500",
// // // // //   },
// // // // //   gameTypeBadge: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 4,
// // // // //     borderRadius: 10,
// // // // //     gap: 4,
// // // // //     marginLeft: 8,
// // // // //     borderWidth: 1,
// // // // //   },
// // // // //   paidBadge: {
// // // // //     backgroundColor: "rgba(255, 152, 0, 0.1)",
// // // // //     borderColor: COLORS.accent,
// // // // //   },
// // // // //   freeBadge: {
// // // // //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// // // // //     borderColor: "#4CAF50",
// // // // //   },
// // // // //   gameTypeText: {
// // // // //     fontSize: 11,
// // // // //     fontWeight: "700",
// // // // //     color: COLORS.textDark,
// // // // //   },
// // // // //   gameDetails: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   detailRow: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   detailItem: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "flex-start",
// // // // //     gap: 8,
// // // // //     flex: 1,
// // // // //   },
// // // // //   detailIcon: {
// // // // //     width: 28,
// // // // //     height: 28,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: COLORS.background,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     borderWidth: 1,
// // // // //     borderColor: COLORS.primary,
// // // // //   },
// // // // //   detailLabel: {
// // // // //     fontSize: 10,
// // // // //     color: COLORS.textLight,
// // // // //     fontWeight: "500",
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   detailText: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textDark,
// // // // //     fontWeight: "600",
// // // // //   },
// // // // //   prizeContainer: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     backgroundColor: COLORS.background,
// // // // //     padding: 12,
// // // // //     borderRadius: 10,
// // // // //     marginBottom: 16,
// // // // //     gap: 10,
// // // // //     borderWidth: 1,
// // // // //     borderColor: COLORS.border,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 2,
// // // // //     elevation: 1,
// // // // //   },
// // // // //   prizeIcon: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     borderWidth: 1,
// // // // //     borderColor: COLORS.primary,
// // // // //   },
// // // // //   prizeInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   prizeLabel: {
// // // // //     fontSize: 11,
// // // // //     color: COLORS.textLight,
// // // // //     fontWeight: "500",
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   prizeText: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: "700",
// // // // //     color: COLORS.textDark,
// // // // //   },
// // // // //   prizeSubtext: {
// // // // //     fontSize: 11,
// // // // //     color: COLORS.textLight,
// // // // //     fontWeight: "500",
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   joinButton: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 10,
// // // // //     gap: 6,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //     overflow: 'hidden',
// // // // //     position: 'relative',
// // // // //   },
// // // // //   glassEffectOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// // // // //     borderRadius: 10,
// // // // //   },
// // // // //   completedJoinButton: {
// // // // //     backgroundColor: COLORS.completed,
// // // // //   },
// // // // //   joinButtonText: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 14,
// // // // //     fontWeight: "700",
// // // // //   },
// // // // //   winnersContainer: {
// // // // //     gap: 8,
// // // // //   },
// // // // //   winnerCard: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 10,
// // // // //     padding: 12,
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 1,
// // // // //     elevation: 1,
// // // // //   },
// // // // //   winnerInfo: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 10,
// // // // //   },
// // // // //   winnerAvatar: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   winnerInitial: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 14,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   winnerName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: COLORS.textDark,
// // // // //   },
// // // // //   winnerPrize: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   winnerTime: {
// // // // //     fontSize: 11,
// // // // //     color: COLORS.textLight,
// // // // //   },
// // // // //   infoCard: {
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 1 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 2,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   infoList: {
// // // // //     gap: 12,
// // // // //   },
// // // // //   infoItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 10,
// // // // //   },
// // // // //   infoText: {
// // // // //     fontSize: 14,
// // // // //     color: COLORS.textDark,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   bottomSpace: {
// // // // //     height: 20,
// // // // //   },
// // // // //   loadingMoreContainer: {
// // // // //     paddingVertical: 20,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   // Popup Styles
// // // // //   popupOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 20,
// // // // //   },
// // // // //   popupContainer: {
// // // // //     width: width * 0.8,
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 28,
// // // // //     padding: 24,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   popupIcon: {
// // // // //     width: 56,
// // // // //     height: 56,
// // // // //     borderRadius: 28,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   popupTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: COLORS.textDark,
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   popupGameName: {
// // // // //     fontSize: 16,
// // // // //     color: COLORS.textLight,
// // // // //     marginBottom: 16,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   popupTimer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 6,
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   popupTimerText: {
// // // // //     fontSize: 14,
// // // // //     color: COLORS.textDark,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   popupPrize: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   popupPrizeLabel: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textLight,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   popupPrizeValue: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.primary,
// // // // //   },
// // // // //   popupPrizeSubtext: {
// // // // //     fontSize: 11,
// // // // //     color: COLORS.textLight,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   popupActions: {
// // // // //     width: '100%',
// // // // //     gap: 12,
// // // // //   },
// // // // //   popupPrimaryButton: {
// // // // //     paddingVertical: 14,
// // // // //     borderRadius: 20,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   popupPrimaryButtonText: {
// // // // //     color: COLORS.surface,
// // // // //     fontSize: 15,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   popupSecondaryButton: {
// // // // //     paddingVertical: 10,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   popupSecondaryButtonText: {
// // // // //     fontSize: 14,
// // // // //     color: COLORS.textLight,
// // // // //   },
// // // // //   // Modal Styles
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   modalContent: {
// // // // //     width: '90%',
// // // // //     maxHeight: '80%',
// // // // //     backgroundColor: COLORS.surface,
// // // // //     borderRadius: 16,
// // // // //     padding: 16,
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 16,
// // // // //     paddingBottom: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: COLORS.border,
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     color: COLORS.textDark,
// // // // //   },
// // // // //   notificationItem: {
// // // // //     flexDirection: 'row',
// // // // //     paddingVertical: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: COLORS.border,
// // // // //   },
// // // // //   notificationIcon: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: '#F0F8FF',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   notificationContent: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   notificationTitle: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: COLORS.textDark,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   notificationMessage: {
// // // // //     fontSize: 12,
// // // // //     color: COLORS.textLight,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   notificationDate: {
// // // // //     fontSize: 10,
// // // // //     color: COLORS.textLight,
// // // // //   },
// // // // //   emptyNotifications: {
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingVertical: 40,
// // // // //   },
// // // // //   emptyText: {
// // // // //     marginTop: 12,
// // // // //     color: COLORS.textLight,
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   loadingIndicator: {
// // // // //     marginVertical: 20,
// // // // //   },
// // // // //   closeBtn: {
// // // // //     marginTop: 16,
// // // // //     backgroundColor: COLORS.primary,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   closeBtnText: {
// // // // //     color: COLORS.surface,
// // // // //     fontWeight: '600',
// // // // //     fontSize: 14,
// // // // //   },
// // // // // });

// // // // // export default Home;







// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import {
// // // //   StyleSheet,
// // // //   Text,
// // // //   View,
// // // //   Image,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   FlatList,
// // // //   Modal,
// // // //   ActivityIndicator,
// // // //   RefreshControl,
// // // //   Dimensions,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   TextInput,
// // // //   Animated,
// // // //   Easing,
// // // //   Platform,
// // // // } from "react-native";
// // // // import axios from "axios";
// // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import { useNavigation } from '@react-navigation/native';

// // // // const { width } = Dimensions.get('window');

// // // // // Color scheme matching the reference design
// // // // const COLORS = {
// // // //   primary: "#061D71", // Main blue color
// // // //   accent: "#ff9800", // Orange accent
// // // //   background: "#f5f8ff", // Light background
// // // //   surface: "#FFFFFF",
// // // //   textDark: "#333333",
// // // //   textLight: "#777777",
// // // //   border: "#EEEEEE",
  
// // // //   // Status colors
// // // //   live: "#4CAF50",
// // // //   scheduled: "#ff9800",
// // // //   completed: "#ff9800",
  
// // // //   // Quick action colors
// // // //   deposit: "#4facfe",
// // // //   withdraw: "#FF6B6B",
// // // //   refer: "#4ECDC4",
// // // //   support: "#9B59B6",
  
// // // //   // Pattern card colors - keeping original circle colors
// // // //   patternColors: [
// // // //     '#0282E9', // Blue
// // // //     '#F59E0B', // Orange
// // // //     '#10B981', // Green
// // // //     '#EF4444', // Red
// // // //     '#8B5CF6', // Purple
// // // //     '#EC4899', // Pink
// // // //     '#06B6D4', // Cyan
// // // //     '#F97316', // Orange
// // // //   ],
// // // // };

// // // // const Home = () => {
// // // //   const navigation = useNavigation();
// // // //   const [notifications, setNotifications] = useState([]);
// // // //   const [sliders, setSliders] = useState([]);
// // // //   const [games, setGames] = useState([]);
// // // //   const [filteredGames, setFilteredGames] = useState([]);
// // // //   const [patterns, setPatterns] = useState([]);
// // // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // // //   const [activeSlide, setActiveSlide] = useState(0);
// // // //   const [modalVisible, setModalVisible] = useState(false);
// // // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // // //   const [loadingGames, setLoadingGames] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // //   // Popup state
// // // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // // //   const [popupShown, setPopupShown] = useState(false);
  
// // // //   // Animation for popup
// // // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // // //   // Animation values for buttons and patterns
// // // //   const buttonScaleAnims = useRef([]);
// // // //   const patternScaleAnims = useRef([]);
// // // //   const glowAnims = useRef([]);
  
// // // //   // Pagination state for games
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const [lastPage, setLastPage] = useState(1);
// // // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // // //   const sliderRef = useRef(null);
// // // //   const scrollInterval = useRef(null);

// // // //   // Filter options
// // // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // // //   // Initialize animations
// // // //   useEffect(() => {
// // // //     // Initialize button animations for join buttons (will be created dynamically)
// // // //     buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
// // // //     // Start animations for buttons
// // // //     buttonScaleAnims.current.forEach((anim, index) => {
// // // //       startPulseAnimation(anim);
// // // //     });
// // // //   }, [games.length]);

// // // //   // Initialize pattern animations when patterns load
// // // //   useEffect(() => {
// // // //     if (patterns.length > 0) {
// // // //       patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
// // // //       glowAnims.current = patterns.map(() => new Animated.Value(0));
      
// // // //       // Start animations for patterns
// // // //       patternScaleAnims.current.forEach((anim, index) => {
// // // //         startPulseAnimation(anim, 1000 + (index * 200)); // Staggered animation
// // // //       });
      
// // // //       glowAnims.current.forEach((anim, index) => {
// // // //         startGlowAnimation(anim, 1500 + (index * 300));
// // // //       });
// // // //     }
// // // //   }, [patterns.length]);

// // // //   // Pulse animation function
// // // //   const startPulseAnimation = (anim, duration = 800) => {
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(anim, {
// // // //           toValue: 1.08,
// // // //           duration: duration,
// // // //           useNativeDriver: true,
// // // //           easing: Easing.inOut(Easing.ease)
// // // //         }),
// // // //         Animated.timing(anim, {
// // // //           toValue: 1,
// // // //           duration: duration,
// // // //           useNativeDriver: true,
// // // //           easing: Easing.inOut(Easing.ease)
// // // //         })
// // // //       ])
// // // //     ).start();
// // // //   };

// // // //   // Glow animation function
// // // //   const startGlowAnimation = (anim, duration = 1500) => {
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(anim, {
// // // //           toValue: 1,
// // // //           duration: duration / 2,
// // // //           useNativeDriver: true,
// // // //           easing: Easing.inOut(Easing.ease)
// // // //         }),
// // // //         Animated.timing(anim, {
// // // //           toValue: 0,
// // // //           duration: duration / 2,
// // // //           useNativeDriver: true,
// // // //           easing: Easing.inOut(Easing.ease)
// // // //         })
// // // //       ])
// // // //     ).start();
// // // //   };

// // // //   // Function to calculate prize pool from pattern rewards
// // // //   const calculatePrizePool = (game) => {
// // // //     if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
// // // //       return null;
// // // //     }
    
// // // //     const total = game.pattern_rewards.reduce((sum, reward) => {
// // // //       const amount = parseFloat(reward.amount) || 0;
// // // //       const count = parseInt(reward.reward_count) || 1;
// // // //       return sum + (amount * count);
// // // //     }, 0);
    
// // // //     return total;
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchInitialData();
    
// // // //     return () => {
// // // //       if (scrollInterval.current) {
// // // //         clearInterval(scrollInterval.current);
// // // //       }
// // // //     };
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     if (games.length > 0 && !popupShown) {
// // // //       setTimeout(() => {
// // // //         checkUpcomingGame();
// // // //       }, 1500);
// // // //     }
// // // //   }, [games, popupShown]);

// // // //   useEffect(() => {
// // // //     if (sliders.length > 1) {
// // // //       startAutoScroll();
// // // //     }
// // // //     return () => {
// // // //       if (scrollInterval.current) {
// // // //         clearInterval(scrollInterval.current);
// // // //       }
// // // //     };
// // // //   }, [sliders.length]);

// // // //   // Filter games based on search and active filter
// // // //   useEffect(() => {
// // // //     let filtered = games;
    
// // // //     // Apply search filter
// // // //     if (searchQuery.trim() !== '') {
// // // //       filtered = filtered.filter(game =>
// // // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // // //       );
// // // //     }
    
// // // //     // Apply status filter
// // // //     if (activeFilter === 'Live Now') {
// // // //       filtered = filtered.filter(game => game.status === 'live');
// // // //     } else if (activeFilter === 'Upcoming') {
// // // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // // //     } else if (activeFilter === 'Completed') {
// // // //       filtered = filtered.filter(game => game.status === 'completed');
// // // //     }
    
// // // //     setFilteredGames(filtered);
// // // //   }, [searchQuery, games, activeFilter]);

// // // //   useEffect(() => {
// // // //     if (upcomingGamePopup) {
// // // //       Animated.parallel([
// // // //         Animated.timing(opacityAnim, {
// // // //           toValue: 1,
// // // //           duration: 300,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.timing(slideAnim, {
// // // //           toValue: 0,
// // // //           duration: 400,
// // // //           easing: Easing.out(Easing.back(1.2)),
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ]).start();
// // // //     } else {
// // // //       opacityAnim.setValue(0);
// // // //       slideAnim.setValue(300);
// // // //     }
// // // //   }, [upcomingGamePopup]);

// // // //   const startAutoScroll = () => {
// // // //     if (scrollInterval.current) {
// // // //       clearInterval(scrollInterval.current);
// // // //     }
    
// // // //     scrollInterval.current = setInterval(() => {
// // // //       if (sliders.length > 0) {
// // // //         let nextIndex = activeSlide + 1;
// // // //         if (nextIndex >= sliders.length) {
// // // //           nextIndex = 0;
// // // //         }
        
// // // //         setActiveSlide(nextIndex);
// // // //         if (sliderRef.current) {
// // // //           const slideWidth = width - 32;
// // // //           sliderRef.current.scrollToOffset({
// // // //             offset: nextIndex * slideWidth,
// // // //             animated: true
// // // //           });
// // // //         }
// // // //       }
// // // //     }, 3000);
// // // //   };

// // // //   const fetchInitialData = async () => {
// // // //     try {
// // // //       await Promise.all([
// // // //         fetchNotifications(),
// // // //         fetchSliders(),
// // // //         fetchGames(1),
// // // //         fetchPatterns()
// // // //       ]);
// // // //     } catch (error) {
// // // //       console.log("Error fetching initial data:", error);
// // // //     }
// // // //   };

// // // //   const onRefresh = React.useCallback(() => {
// // // //     setRefreshing(true);
// // // //     setCurrentPage(1);
// // // //     setGames([]);
// // // //     setFilteredGames([]);
// // // //     setPopupShown(false);
// // // //     Promise.all([
// // // //       fetchNotifications(),
// // // //       fetchSliders(),
// // // //       fetchGames(1),
// // // //       fetchPatterns()
// // // //     ]).finally(() => setRefreshing(false));
// // // //   }, []);

// // // //   const checkUpcomingGame = () => {
// // // //     try {
// // // //       const now = new Date();
      
// // // //       const scheduledGames = games.filter(game => 
// // // //         game.status === 'scheduled'
// // // //       );
      
// // // //       if (scheduledGames.length === 0) return;
      
// // // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // // //         let endDateTime;
        
// // // //         try {
// // // //           if (game.ticket_request_end_date) {
// // // //             endDateTime = new Date(game.ticket_request_end_date);
// // // //           } else {
// // // //             endDateTime = new Date(game.game_date);
// // // //           }
// // // //         } catch (e) {
// // // //           endDateTime = new Date();
// // // //         }
        
// // // //         return {
// // // //           ...game,
// // // //           endDateTime
// // // //         };
// // // //       });
      
// // // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // // //       const earliestEndGame = sortedGames[0];
      
// // // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
// // // //         setUpcomingGame(earliestEndGame);
// // // //         setUpcomingGamePopup(true);
// // // //         setPopupShown(true);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error checking upcoming game:", error);
// // // //     }
// // // //   };

// // // //   const getTimeRemaining = (endDateTime) => {
// // // //     const now = new Date();
// // // //     const diff = endDateTime - now;
    
// // // //     if (diff <= 0) return "Ending soon";
    
// // // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // // //     if (days > 0) {
// // // //       return `${days}d ${hours}h left`;
// // // //     } else if (hours > 0) {
// // // //       return `${hours}h ${minutes}m left`;
// // // //     } else {
// // // //       return `${minutes}m left`;
// // // //     }
// // // //   };

// // // //   const fetchNotifications = async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       if (!token) return;
// // // //       const res = await axios.get(
// // // //         "https://tambolatime.co.in/public/api/user/notifications",
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       if (res.data.status) {
// // // //         setNotifications(res.data.data);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching notifications:", error);
// // // //     } finally {
// // // //       setLoadingNotifications(false);
// // // //     }
// // // //   };

// // // //   const fetchSliders = async () => {
// // // //     try {
// // // //       setLoadingSliders(true);
// // // //       const res = await axios.get(
// // // //         "https://tambolatime.co.in/public/api/user/sliders"
// // // //       );
// // // //       if (res.data.success) {
// // // //         setSliders(res.data.data || []);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching sliders:", error);
// // // //       setSliders([]);
// // // //     } finally {
// // // //       setLoadingSliders(false);
// // // //     }
// // // //   };

// // // //   const fetchGames = async (page = 1) => {
// // // //     try {
// // // //       if (page === 1) {
// // // //         setLoadingGames(true);
// // // //       }
      
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       if (!token) return;
      
// // // //       const res = await axios.get(
// // // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
      
// // // //       if (res.data.success) {
// // // //         const newGames = res.data.games.data || [];
// // // //         const pagination = res.data.games;
        
// // // //         if (page === 1) {
// // // //           setGames(newGames);
// // // //           setFilteredGames(newGames);
// // // //         } else {
// // // //           setGames(prev => [...prev, ...newGames]);
// // // //           setFilteredGames(prev => [...prev, ...newGames]);
// // // //         }
        
// // // //         setCurrentPage(pagination.current_page);
// // // //         setLastPage(pagination.last_page);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching games:", error);
// // // //     } finally {
// // // //       if (page === 1) {
// // // //         setLoadingGames(false);
// // // //       }
// // // //       setLoadingMore(false);
// // // //     }
// // // //   };

// // // //   const fetchPatterns = async () => {
// // // //     try {
// // // //       setLoadingPatterns(true);
// // // //       const token = await AsyncStorage.getItem("token");
      
// // // //       if (!token) {
// // // //         setLoadingPatterns(false);
// // // //         return;
// // // //       }

// // // //       const response = await axios.get(
// // // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //             Accept: 'application/json',
// // // //           },
// // // //         }
// // // //       );

// // // //       if (response.data && response.data.status) {
// // // //         const patternsData = response.data.data?.patterns || [];
        
// // // //         const patternSequence = [
// // // //           'top line',
// // // //           'middle line', 
// // // //           'bottom line',
// // // //           'breakfast',
// // // //           'lunch',
// // // //           'dinner',
// // // //           'four corners',
// // // //           'bamboo',
// // // //           'early five',
// // // //           'non claimers',
// // // //           'full house'
// // // //         ];
        
// // // //         const sortedPatterns = patternsData.sort((a, b) => {
// // // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // // //           if (aIndex === -1) return 1;
// // // //           if (bIndex === -1) return -1;
          
// // // //           return aIndex - bIndex;
// // // //         });
        
// // // //         setPatterns(sortedPatterns.slice(0, 8));
// // // //       }
// // // //     } catch (error) {
// // // //       console.log('Error fetching patterns in Home:', error);
// // // //     } finally {
// // // //       setLoadingPatterns(false);
// // // //     }
// // // //   };

// // // //   const loadMoreGames = () => {
// // // //     if (!loadingMore && currentPage < lastPage) {
// // // //       setLoadingMore(true);
// // // //       fetchGames(currentPage + 1);
// // // //     }
// // // //   };

// // // //   const handleGamePress = (game) => {
// // // //     navigation.navigate("GameDetails", { game });
// // // //   };

// // // //   const handleAllGamesPress = () => {
// // // //     navigation.navigate("Game");
// // // //   };

// // // //   const handleAllPatternsPress = () => {
// // // //     navigation.navigate("UserGamePatterns");
// // // //   };

// // // //   const handleViewAllWinners = () => {
// // // //     navigation.navigate("Game");
// // // //   };

// // // //   const handlePatternPress = (pattern) => {
// // // //     navigation.navigate("UserGamePatterns", { 
// // // //       selectedPatternId: pattern.id,
// // // //       selectedPattern: pattern 
// // // //     });
// // // //   };

// // // //   const handlePopupJoinNow = () => {
// // // //     setUpcomingGamePopup(false);
// // // //     if (upcomingGame) {
// // // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // // //     }
// // // //   };

// // // //   const handlePopupLater = () => {
// // // //     setUpcomingGamePopup(false);
// // // //   };

// // // //   const getPatternIcon = (pattern) => {
// // // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // // //     const iconMap = {
// // // //       'bamboo': 'leaf',
// // // //       'bottom line': 'arrow-down',
// // // //       'breakfast': 'cafe',
// // // //       'dinner': 'restaurant',
// // // //       'early five': '5',
// // // //       'four corners': 'apps',
// // // //       'full house': 'home',
// // // //       'lunch': 'fast-food',
// // // //       'middle line': 'remove',
// // // //       'non claimer': 'close',
// // // //       'top line': 'arrow-up'
// // // //     };
    
// // // //     for (const [key, icon] of Object.entries(iconMap)) {
// // // //       if (patternName.includes(key)) return icon;
// // // //     }
    
// // // //     return 'grid-outline';
// // // //   };

// // // //   const formatPatternName = (name) => {
// // // //     if (!name) return 'Unknown Pattern';
// // // //     return name
// // // //       .split('_')
// // // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // // //       .join(' ');
// // // //   };

// // // //   // Animated pattern card with glow and pulse
// // // //   const renderPatternCard = (pattern, index) => {
// // // //     const icon = getPatternIcon(pattern);
// // // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // // //     // Pattern names for display
// // // //     const patterns = [
// // // //       'Top Line',
// // // //       'Middle',
// // // //       'Bottom',
// // // //       'Breakfast',
// // // //       'Lunch',
// // // //       'Dinner',
// // // //       'Corners',
// // // //       'Bamboo',
// // // //     ];
    
// // // //     const patternName = patterns[index % patterns.length];
// // // //     const bgColor = COLORS.patternColors[index % COLORS.patternColors.length];
    
// // // //     const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
// // // //     const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
// // // //     const glowOpacity = glowAnim.interpolate({
// // // //       inputRange: [0, 1],
// // // //       outputRange: [0, 0.7]
// // // //     });
    
// // // //     return (
// // // //       <Animated.View
// // // //         key={pattern.id}
// // // //         style={[
// // // //           styles.patternCardContainer,
// // // //           {
// // // //             transform: [{ scale: scaleAnim }]
// // // //           }
// // // //         ]}
// // // //       >
// // // //         <TouchableOpacity 
// // // //           style={styles.compactPatternCard}
// // // //           onPress={() => handlePatternPress(pattern)}
// // // //           activeOpacity={0.7}
// // // //         >
// // // //           <Animated.View style={[
// // // //             styles.glowEffect,
// // // //             {
// // // //               backgroundColor: bgColor,
// // // //               opacity: glowOpacity,
// // // //               transform: [{ scale: 1.2 }]
// // // //             }
// // // //           ]} />
// // // //           <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
// // // //             <Ionicons name={icon} size={18} color="#FFFFFF" />
// // // //           </View>
// // // //           <Text style={styles.compactPatternName} numberOfLines={1}>
// // // //             {patternName}
// // // //           </Text>
// // // //         </TouchableOpacity>
// // // //       </Animated.View>
// // // //     );
// // // //   };

// // // //   const renderSliderItem = ({ item }) => (
// // // //     <View style={styles.slideContainer}>
// // // //       <Image
// // // //         source={{ 
// // // //           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
// // // //         }}
// // // //         style={styles.sliderImage}
// // // //         resizeMode="cover"
// // // //       />
// // // //     </View>
// // // //   );

// // // //   const handleScroll = (event) => {
// // // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // // //       setActiveSlide(currentIndex);
// // // //     }
// // // //   };

// // // //   const renderPagination = () => {
// // // //     if (sliders.length <= 1) return null;
    
// // // //     return (
// // // //       <View style={styles.paginationContainer}>
// // // //         {sliders.map((_, index) => (
// // // //           <View
// // // //             key={index}
// // // //             style={[
// // // //               styles.paginationDot,
// // // //               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
// // // //             ]}
// // // //           />
// // // //         ))}
// // // //       </View>
// // // //     );
// // // //   };

// // // //   const renderGameCard = ({ item: game, index }) => {
// // // //     if (!game) return null;
    
// // // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // // //     const isPaid = game.ticket_type === "paid";
// // // //     const isLive = game.status === 'live';
// // // //     const isScheduled = game.status === 'scheduled';
// // // //     const isCompleted = game.status === 'completed';
    
// // // //     // Calculate prize pool from pattern rewards
// // // //     const prizePool = calculatePrizePool(game);
    
// // // //     // Get or create animation for this button
// // // //     if (!buttonScaleAnims.current[index]) {
// // // //       buttonScaleAnims.current[index] = new Animated.Value(1);
// // // //       startPulseAnimation(buttonScaleAnims.current[index]);
// // // //     }
    
// // // //     const buttonScale = buttonScaleAnims.current[index];
    
// // // //     return (
// // // //       <TouchableOpacity
// // // //         style={styles.gameCard}
// // // //         activeOpacity={0.9}
// // // //         onPress={() => handleGamePress(game)}
// // // //       >
// // // //         {/* Background Pattern */}
// // // //         <View style={styles.gameCardPattern} />
        
// // // //         {/* Status badge */}
// // // //         <View style={[
// // // //           styles.statusBadge,
// // // //           isLive ? styles.liveBadge :
// // // //           isScheduled ? styles.scheduledBadge :
// // // //           isCompleted ? styles.completedBadge :
// // // //           styles.defaultBadge
// // // //         ]}>
// // // //           <Ionicons 
// // // //             name={
// // // //               isLive ? 'radio-button-on' : 
// // // //               isCompleted ? 'checkmark-circle' :
// // // //               'time'
// // // //             } 
// // // //             size={10} 
// // // //             color={COLORS.surface} 
// // // //           />
// // // //           <Text style={styles.statusText}>
// // // //             {isLive ? 'LIVE' : 
// // // //              isCompleted ? 'COMPLETED' : 
// // // //              'SOON'}
// // // //           </Text>
// // // //         </View>

// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.gameIconContainer}>
// // // //             <View style={styles.gameIconWrapper}>
// // // //               <MaterialIcons name="confirmation-number" size={32} color={COLORS.accent} />
// // // //             </View>
// // // //             <View style={styles.gameInfo}>
// // // //               <Text style={styles.gameName} numberOfLines={1}>
// // // //                 {game.game_name || "Tambola Game"}
// // // //               </Text>
// // // //               <Text style={styles.gameId}>
// // // //                 ID: {game.game_code || "N/A"}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
          
// // // //           <View style={[
// // // //             styles.gameTypeBadge,
// // // //             isPaid ? styles.paidBadge : styles.freeBadge,
// // // //           ]}>
// // // //             {isPaid ? (
// // // //               <>
// // // //                 <MaterialIcons name="diamond" size={14} color={COLORS.accent} />
// // // //                 <Text style={styles.gameTypeText}>
// // // //                   ₹{ticketCost}
// // // //                 </Text>
// // // //               </>
// // // //             ) : (
// // // //               <>
// // // //                 <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
// // // //                 <Text style={styles.gameTypeText}>
// // // //                   FREE
// // // //                 </Text>
// // // //               </>
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         <View style={styles.gameDetails}>
// // // //           <View style={styles.detailRow}>
// // // //             <View style={styles.detailItem}>
// // // //               <View style={styles.detailIcon}>
// // // //                 <Ionicons name="calendar" size={14} color={COLORS.accent} />
// // // //               </View>
// // // //               <View>
// // // //                 <Text style={styles.detailLabel}>Date</Text>
// // // //                 <Text style={styles.detailText}>
// // // //                   {game.game_date_formatted || game.game_date || "Date TBA"}
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
            
// // // //             <View style={styles.detailItem}>
// // // //               <View style={styles.detailIcon}>
// // // //                 <Ionicons name="time" size={14} color={COLORS.accent} />
// // // //               </View>
// // // //               <View>
// // // //                 <Text style={styles.detailLabel}>Time</Text>
// // // //                 <Text style={styles.detailText}>
// // // //                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
// // // //           </View>
          
// // // //           <View style={styles.detailRow}>
// // // //             <View style={styles.detailItem}>
// // // //               <View style={styles.detailIcon}>
// // // //                 <Ionicons name="person" size={14} color={COLORS.accent} />
// // // //               </View>
// // // //               <View>
// // // //                 <Text style={styles.detailLabel}>Host</Text>
// // // //                 <Text style={styles.detailText}>
// // // //                   {game.user ? game.user.name : 'Tambola Timez'}
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
            
// // // //             {game.available_tickets !== undefined && !isCompleted && (
// // // //               <View style={styles.detailItem}>
// // // //                 <View style={styles.detailIcon}>
// // // //                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.accent} />
// // // //                 </View>
// // // //                 <View>
// // // //                   <Text style={styles.detailLabel}>Tickets</Text>
// // // //                   <Text style={styles.detailText}>
// // // //                     {game.available_tickets} Left
// // // //                   </Text>
// // // //                 </View>
// // // //               </View>
// // // //             )}
// // // //             {isCompleted && (
// // // //               <View style={styles.detailItem}>
// // // //                 <View style={styles.detailIcon}>
// // // //                   <Ionicons name="trophy" size={14} color={COLORS.accent} />
// // // //                 </View>
// // // //                 <View>
// // // //                   <Text style={styles.detailLabel}>Status</Text>
// // // //                   <Text style={styles.detailText}>Completed</Text>
// // // //                 </View>
// // // //               </View>
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         <View style={styles.prizeContainer}>
// // // //           <View style={styles.prizeIcon}>
// // // //             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.accent} />
// // // //           </View>
// // // //           <View style={styles.prizeInfo}>
// // // //             <Text style={styles.prizeLabel}>
// // // //               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
// // // //             </Text>
// // // //             <Text style={styles.prizeText}>
// // // //               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // // //             </Text>
// // // //             {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// // // //               <Text style={styles.prizeSubtext}>
// // // //                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
// // // //               </Text>
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
// // // //           <TouchableOpacity 
// // // //             style={[
// // // //               styles.joinButton,
// // // //               isCompleted && styles.completedJoinButton
// // // //             ]}
// // // //             onPress={() => handleGamePress(game)}
// // // //             activeOpacity={0.9}
// // // //           >
// // // //             <View style={styles.glassEffectOverlay} />
// // // //             <Text style={styles.joinButtonText}>
// // // //               {isCompleted 
// // // //                 ? 'VIEW RESULTS' 
// // // //                 : isLive
// // // //                   ? 'JOIN GAME' 
// // // //                   : 'VIEW DETAILS'}
// // // //             </Text>
// // // //             <Ionicons 
// // // //               name={isCompleted ? "trophy" : "arrow-forward"} 
// // // //               size={16} 
// // // //               color={COLORS.surface} 
// // // //             />
// // // //           </TouchableOpacity>
// // // //         </Animated.View>
// // // //       </TouchableOpacity>
// // // //     );
// // // //   };

// // // //   const clearSearch = () => {
// // // //     setSearchQuery('');
// // // //   };

// // // //   const renderFooter = () => {
// // // //     if (!loadingMore) return null;
// // // //     return (
// // // //       <View style={styles.loadingMoreContainer}>
// // // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // // //       </View>
// // // //     );
// // // //   };

// // // //   const UpcomingGamePopup = () => {
// // // //     if (!upcomingGame) return null;
    
// // // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // // //     const isPaid = upcomingGame.ticket_type === "paid";
// // // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // // //     // Calculate prize pool for popup
// // // //     const prizePool = calculatePrizePool(upcomingGame);
    
// // // //     return (
// // // //       <Modal
// // // //         visible={upcomingGamePopup}
// // // //         transparent={true}
// // // //         animationType="fade"
// // // //         onRequestClose={handlePopupLater}
// // // //       >
// // // //         <View style={styles.popupOverlay}>
// // // //           <Animated.View 
// // // //             style={[
// // // //               styles.popupContainer,
// // // //               {
// // // //                 opacity: opacityAnim,
// // // //                 transform: [{ translateY: slideAnim }]
// // // //               }
// // // //             ]}
// // // //           >
// // // //             <View style={[styles.popupIcon, { backgroundColor: COLORS.primary + '20' }]}>
// // // //               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
// // // //             </View>
            
// // // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // // //             <View style={styles.popupTimer}>
// // // //               <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
// // // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // // //             </View>
            
// // // //             <View style={styles.popupPrize}>
// // // //               <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
// // // //               <Text style={styles.popupPrizeValue}>
// // // //                 {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // // //               </Text>
// // // //               {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
// // // //                 <Text style={styles.popupPrizeSubtext}>
// // // //                   {upcomingGame.pattern_rewards.length} Patterns
// // // //                 </Text>
// // // //               )}
// // // //             </View>
            
// // // //             <View style={styles.popupActions}>
// // // //               <TouchableOpacity 
// // // //                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
// // // //                 onPress={handlePopupJoinNow}
// // // //               >
// // // //                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // // //               </TouchableOpacity>
              
// // // //               <TouchableOpacity 
// // // //                 style={styles.popupSecondaryButton}
// // // //                 onPress={handlePopupLater}
// // // //               >
// // // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </Animated.View>
// // // //         </View>
// // // //       </Modal>
// // // //     );
// // // //   };

// // // //   const Header = () => (
// // // //     <View style={styles.header}>
// // // //       <Text style={styles.headerTitle}>Houzie Timez</Text>

// // // //       <TouchableOpacity 
// // // //         style={styles.notification}
// // // //         onPress={() => setModalVisible(true)}
// // // //       >
// // // //         <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// // // //         {notifications.length > 0 && (
// // // //           <View style={styles.badge}>
// // // //             <Text style={styles.badgeText}>{notifications.length}</Text>
// // // //           </View>
// // // //         )}
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );

// // // //   if (loadingGames && games.length === 0) {
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
// // // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// // // //       <View style={styles.container}>
// // // //         {/* Header */}
// // // //         <Header />

// // // //         {/* Search Bar */}
// // // //         <View style={styles.searchWrapper}>
// // // //           <View style={styles.searchBox}>
// // // //             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
// // // //             <TextInput
// // // //               placeholder="Search games by name or ID..."
// // // //               placeholderTextColor={COLORS.textLight}
// // // //               style={styles.searchInput}
// // // //               value={searchQuery}
// // // //               onChangeText={setSearchQuery}
// // // //               returnKeyType="search"
// // // //             />
// // // //             {searchQuery.length > 0 ? (
// // // //               <TouchableOpacity onPress={clearSearch}>
// // // //                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
// // // //               </TouchableOpacity>
// // // //             ) : (
// // // //               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         <ScrollView
// // // //           showsVerticalScrollIndicator={false}
// // // //           refreshControl={
// // // //             <RefreshControl
// // // //               refreshing={refreshing}
// // // //               onRefresh={onRefresh}
// // // //               tintColor={COLORS.primary}
// // // //               colors={[COLORS.primary]}
// // // //             />
// // // //           }
// // // //         >
// // // //           {/* Slider Section */}
// // // //           {loadingSliders ? (
// // // //             <View style={styles.sliderLoadingContainer}>
// // // //               <ActivityIndicator size="large" color={COLORS.primary} />
// // // //               <Text style={styles.loadingText}>Loading offers...</Text>
// // // //             </View>
// // // //           ) : sliders.length > 0 ? (
// // // //             <View style={styles.sliderSection}>
// // // //               <View style={styles.sliderWrapper}>
// // // //                 <FlatList
// // // //                   ref={sliderRef}
// // // //                   data={sliders}
// // // //                   renderItem={renderSliderItem}
// // // //                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // // //                   horizontal
// // // //                   pagingEnabled
// // // //                   showsHorizontalScrollIndicator={false}
// // // //                   onScroll={handleScroll}
// // // //                   scrollEventThrottle={16}
// // // //                 />
                
// // // //                 {/* Pagination Dots */}
// // // //                 {renderPagination()}
// // // //               </View>
// // // //             </View>
// // // //           ) : null}

// // // //           {/* Patterns Section - Now with glow and pulse animations */}
// // // //           {patterns.length > 0 && (
// // // //             <View style={styles.patternsSection}>
// // // //               <View style={styles.sectionHeader}>
// // // //                 <View style={styles.sectionTitleContainer}>
// // // //                   <Ionicons name="grid-outline" size={22} color={COLORS.primary} />
// // // //                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
// // // //                 </View>
// // // //                 <TouchableOpacity onPress={handleAllPatternsPress}>
// // // //                   <View style={styles.seeAllButton}>
// // // //                     <Text style={styles.seeAllText}>See All</Text>
// // // //                     <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
// // // //                   </View>
// // // //                 </TouchableOpacity>
// // // //               </View>

// // // //               {loadingPatterns ? (
// // // //                 <ActivityIndicator size="small" color={COLORS.primary} />
// // // //               ) : (
// // // //                 <ScrollView 
// // // //                   horizontal 
// // // //                   showsHorizontalScrollIndicator={false}
// // // //                   contentContainerStyle={styles.patternsList}
// // // //                 >
// // // //                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // // //                 </ScrollView>
// // // //               )}
// // // //             </View>
// // // //           )}

// // // //           {/* Games Section */}
// // // //           <View style={styles.section}>
// // // //             <View style={styles.sectionHeader}>
// // // //               <View style={styles.sectionTitleContainer}>
// // // //                 <Ionicons name="game-controller-outline" size={22} color={COLORS.primary} />
// // // //                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
// // // //               </View>
// // // //               <TouchableOpacity onPress={handleAllGamesPress}>
// // // //                 <Text style={styles.seeAll}>See All</Text>
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             {loadingGames ? (
// // // //               <View style={styles.gamesLoadingContainer}>
// // // //                 <ActivityIndicator size="large" color={COLORS.primary} />
// // // //                 <Text style={styles.loadingText}>Loading games...</Text>
// // // //               </View>
// // // //             ) : filteredGames.length > 0 ? (
// // // //               <View style={styles.gamesContainer}>
// // // //                 {filteredGames.map((game, index) => (
// // // //                   <View key={game.id || index}>
// // // //                     {renderGameCard({ item: game, index })}
// // // //                   </View>
// // // //                 ))}
// // // //                 {loadingMore && (
// // // //                   <View style={styles.loadingMoreContainer}>
// // // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // // //                   </View>
// // // //                 )}
// // // //               </View>
// // // //             ) : (
// // // //               <View style={styles.noGamesContainer}>
// // // //                 <Ionicons name="game-controller-outline" size={50} color={COLORS.textLight} />
// // // //                 <Text style={styles.noGamesText}>
// // // //                   {searchQuery ? 'No games found' : 'No games available at the moment'}
// // // //                 </Text>
// // // //                 {searchQuery && (
// // // //                   <TouchableOpacity 
// // // //                     style={styles.refreshGamesBtn}
// // // //                     onPress={clearSearch}
// // // //                   >
// // // //                     <Text style={styles.refreshGamesText}>Clear Search</Text>
// // // //                   </TouchableOpacity>
// // // //                 )}
// // // //               </View>
// // // //             )}
// // // //           </View>

// // // //           {/* Recent Winners Section */}
// // // //           <View style={styles.section}>
// // // //             <View style={styles.sectionHeader}>
// // // //               <View style={styles.sectionTitleContainer}>
// // // //                 <FontAwesome name="trophy" size={22} color={COLORS.primary} />
// // // //                 <Text style={styles.sectionTitle}>RECENT WINNERS</Text>
// // // //               </View>
// // // //               <TouchableOpacity onPress={handleViewAllWinners}>
// // // //                 <Text style={styles.seeAll}>See All</Text>
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <View style={styles.winnersContainer}>
// // // //               {[
// // // //                 { id: 1, name: "Amit Sharma", prize: "Won Full House 🏆", time: "2 min ago" },
// // // //                 { id: 2, name: "Neha Gupta", prize: "Won Early 5 🎉", time: "5 min ago" },
// // // //                 { id: 3, name: "Rahul Verma", prize: "Won Corners ✨", time: "10 min ago" },
// // // //               ].map((winner) => (
// // // //                 <View key={winner.id} style={styles.winnerCard}>
// // // //                   <View style={styles.winnerInfo}>
// // // //                     <View style={styles.winnerAvatar}>
// // // //                       <Text style={styles.winnerInitial}>{winner.name.charAt(0)}</Text>
// // // //                     </View>
// // // //                     <View>
// // // //                       <Text style={styles.winnerName}>{winner.name}</Text>
// // // //                       <Text style={styles.winnerPrize}>{winner.prize}</Text>
// // // //                     </View>
// // // //                   </View>
// // // //                   <Text style={styles.winnerTime}>{winner.time}</Text>
// // // //                 </View>
// // // //               ))}
// // // //             </View>
// // // //           </View>

// // // //           {/* Why Play With Us Section */}
// // // //           <View style={styles.section}>
// // // //             <View style={styles.sectionHeader}>
// // // //               <View style={styles.sectionTitleContainer}>
// // // //                 <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
// // // //                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
// // // //               </View>
// // // //             </View>
            
// // // //             <View style={styles.infoCard}>
// // // //               <View style={styles.infoList}>
// // // //                 <View style={styles.infoItem}>
// // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // //                   <Text style={styles.infoText}>Fast & Fair Games</Text>
// // // //                 </View>
// // // //                 <View style={styles.infoItem}>
// // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // //                   <Text style={styles.infoText}>Real Players</Text>
// // // //                 </View>
// // // //                 <View style={styles.infoItem}>
// // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // //                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
// // // //                 </View>
// // // //                 <View style={styles.infoItem}>
// // // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // // //                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           </View>

// // // //           <View style={styles.bottomSpace} />
// // // //         </ScrollView>

// // // //         {/* Popup */}
// // // //         <UpcomingGamePopup />

// // // //         {/* Notifications Modal */}
// // // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // // //           <View style={styles.modalOverlay}>
// // // //             <View style={styles.modalContent}>
// // // //               <View style={styles.modalHeader}>
// // // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // // //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// // // //                 </TouchableOpacity>
// // // //               </View>

// // // //               {loadingNotifications ? (
// // // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// // // //               ) : (
// // // //                 <FlatList
// // // //                   data={notifications}
// // // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // //                   renderItem={({ item }) => (
// // // //                     <View style={styles.notificationItem}>
// // // //                       <View style={styles.notificationIcon}>
// // // //                         <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
// // // //                       </View>
// // // //                       <View style={styles.notificationContent}>
// // // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // // //                         <Text style={styles.notificationMessage}>
// // // //                           {item.message || "Check out the new features!"}
// // // //                         </Text>
// // // //                         <Text style={styles.notificationDate}>
// // // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // // //                         </Text>
// // // //                       </View>
// // // //                     </View>
// // // //                   )}
// // // //                   ListEmptyComponent={
// // // //                     <View style={styles.emptyNotifications}>
// // // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // // //                       <Text style={styles.emptyText}>No notifications yet</Text>
// // // //                     </View>
// // // //                   }
// // // //                 />
// // // //               )}

// // // //               <TouchableOpacity
// // // //                 style={styles.closeBtn}
// // // //                 onPress={() => setModalVisible(false)}
// // // //               >
// // // //                 <Text style={styles.closeBtnText}>Close</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </Modal>
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
// // // //   },
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   header: {
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 16,
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //   },
// // // //   headerTitle: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 22,
// // // //     fontWeight: "700",
// // // //   },
// // // //   notification: {
// // // //     position: "relative",
// // // //   },
// // // //   badge: {
// // // //     position: "absolute",
// // // //     top: -6,
// // // //     right: -6,
// // // //     backgroundColor: "red",
// // // //     width: 18,
// // // //     height: 18,
// // // //     borderRadius: 9,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },
// // // //   badgeText: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 10,
// // // //     fontWeight: "700",
// // // //   },
// // // //   searchWrapper: {
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     backgroundColor: COLORS.primary,
// // // //   },
// // // //   searchBox: {
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 14,
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 10,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     marginHorizontal: 10,
// // // //     fontSize: 15,
// // // //     color: COLORS.textDark,
// // // //     padding: 0,
// // // //   },
// // // //   sliderSection: {
// // // //     marginTop: 16,
// // // //     marginBottom: 8,
// // // //     paddingHorizontal: 16,
// // // //   },
// // // //   sliderWrapper: {
// // // //     height: 150,
// // // //     position: 'relative',
// // // //     borderRadius: 16,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   sliderLoadingContainer: {
// // // //     height: 150,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginTop: 16,
// // // //     marginBottom: 8,
// // // //     marginHorizontal: 16,
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 16,
// // // //   },
// // // //   slideContainer: {
// // // //     width: width - 32,
// // // //     height: 150,
// // // //   },
// // // //   sliderImage: {
// // // //     width: '100%',
// // // //     height: '100%',
// // // //     borderRadius: 16,
// // // //   },
// // // //   paginationContainer: {
// // // //     flexDirection: 'row',
// // // //     position: 'absolute',
// // // //     bottom: 10,
// // // //     alignSelf: 'center',
// // // //   },
// // // //   paginationDot: {
// // // //     width: 8,
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     marginHorizontal: 4,
// // // //   },
// // // //   paginationDotActive: {
// // // //     backgroundColor: COLORS.surface,
// // // //     width: 20,
// // // //   },
// // // //   paginationDotInactive: {
// // // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // // //   },
// // // //   loadingText: {
// // // //     marginTop: 10,
// // // //     color: COLORS.textLight,
// // // //     fontSize: 14,
// // // //   },
// // // //   filtersContainer: {
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     gap: 8,
// // // //   },
// // // //   filterChip: {
// // // //     backgroundColor: COLORS.surface,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 20,
// // // //     marginRight: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //   },
// // // //   activeFilterChip: {
// // // //     backgroundColor: COLORS.primary,
// // // //     borderColor: COLORS.primary,
// // // //   },
// // // //   filterChipText: {
// // // //     color: COLORS.textDark,
// // // //     fontSize: 13,
// // // //     fontWeight: '500',
// // // //   },
// // // //   activeFilterChipText: {
// // // //     color: COLORS.surface,
// // // //   },
// // // //   quickActions: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     marginBottom: 24,
// // // //     marginTop: 8,
// // // //   },
// // // //   quickAction: {
// // // //     alignItems: 'center',
// // // //     width: (width - 60) / 4,
// // // //   },
// // // //   quickActionIcon: {
// // // //     width: 45,
// // // //     height: 45,
// // // //     borderRadius: 22.5,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 6,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 3,
// // // //     elevation: 2,
// // // //   },
// // // //   quickActionText: {
// // // //     color: COLORS.textDark,
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //     textAlign: 'center',
// // // //   },
// // // //   // Patterns Section - Now with glow and pulse animations
// // // //   patternsSection: {
// // // //     paddingHorizontal: 16,
// // // //     marginBottom: 24,
// // // //   },
// // // //   sectionHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // //   sectionTitleContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 8,
// // // //   },
// // // //   sectionTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //     color: COLORS.textDark,
// // // //   },
// // // //   seeAll: {
// // // //     fontSize: 14,
// // // //     color: COLORS.primary,
// // // //     fontWeight: '600',
// // // //   },
// // // //   seeAllButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //     backgroundColor: COLORS.primary + '20',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 20,
// // // //   },
// // // //   seeAllText: {
// // // //     fontSize: 13,
// // // //     color: COLORS.primary,
// // // //     fontWeight: '600',
// // // //   },
// // // //  patternsList: {
// // // //   paddingHorizontal: 4,
// // // //   paddingVertical: 8, // Add vertical padding to prevent cutting off
// // // //   gap: 12,
// // // // },
// // // //   patternCardContainer: {
// // // //   position: 'relative',
// // // //   marginRight: 12,
// // // //   marginTop: 8, // Add top margin to give space for glow effect
// // // //   paddingTop: 4, // Add padding top for extra space
// // // // },
// // // //   compactPatternCard: {
// // // //     alignItems: 'center',
// // // //     width: 60,
// // // //     position: 'relative',
// // // //   },
// // // //   glowEffect: {
// // // //   position: 'absolute',
// // // //   width: 52, // Slightly larger than icon
// // // //   height: 52, // Slightly larger than icon
// // // //   borderRadius: 26,
// // // //   top: -2, // Adjusted position to center behind icon
// // // //   left: 4, // Adjusted for better centering
// // // //   zIndex: 0,
// // // // },
// // // //  compactIconWrapper: {
// // // //   width: 48,
// // // //   height: 48,
// // // //   borderRadius: 24,
// // // //   justifyContent: 'center',
// // // //   alignItems: 'center',
// // // //   marginBottom: 6,
// // // //   zIndex: 1,
// // // //   // Enhanced shadow for glow effect
// // // //   shadowColor: '#FFD700',
// // // //   shadowOpacity: 0.9,
// // // //   shadowRadius: 12,
// // // //   elevation: 8, // Increased elevation for Android
// // // // },
// // // //   compactPatternName: {
// // // //     fontSize: 11,
// // // //     fontWeight: '500',
// // // //     color: COLORS.textDark,
// // // //     textAlign: 'center',
// // // //     zIndex: 1,
// // // //   },
// // // //   // Games Section
// // // //   section: {
// // // //     paddingHorizontal: 16,
// // // //     marginBottom: 24,
// // // //   },
// // // //   gamesLoadingContainer: {
// // // //     padding: 30,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 12,
// // // //   },
// // // //   noGamesContainer: {
// // // //     backgroundColor: COLORS.surface,
// // // //     padding: 30,
// // // //     borderRadius: 12,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //   },
// // // //   noGamesText: {
// // // //     marginTop: 12,
// // // //     color: COLORS.textLight,
// // // //     fontSize: 14,
// // // //     textAlign: 'center',
// // // //   },
// // // //   refreshGamesBtn: {
// // // //     marginTop: 16,
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingHorizontal: 20,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 8,
// // // //   },
// // // //   refreshGamesText: {
// // // //     color: COLORS.surface,
// // // //     fontWeight: '600',
// // // //     fontSize: 14,
// // // //   },
// // // //   gamesContainer: {
// // // //     gap: 12,
// // // //   },
// // // //   gameCard: {
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 16,
// // // //     padding: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //     marginBottom: 12,
// // // //   },
// // // //   gameCardPattern: {
// // // //     position: 'absolute',
// // // //     bottom: 0,
// // // //     left: 0,
// // // //     width: 50,
// // // //     height: 50,
// // // //     borderBottomLeftRadius: 16,
// // // //     borderTopRightRadius: 25,
// // // //     backgroundColor: 'rgba(79, 172, 254, 0.05)',
// // // //   },
// // // //   statusBadge: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 4,
// // // //     borderBottomRightRadius: 12,
// // // //     borderTopLeftRadius: 14,
// // // //     gap: 4,
// // // //     zIndex: 2,
// // // //   },
// // // //   liveBadge: {
// // // //     backgroundColor: '#4CAF50',
// // // //   },
// // // //   scheduledBadge: {
// // // //     backgroundColor: COLORS.scheduled,
// // // //   },
// // // //   completedBadge: {
// // // //     backgroundColor: COLORS.completed,
// // // //   },
// // // //   defaultBadge: {
// // // //     backgroundColor: COLORS.scheduled,
// // // //   },
// // // //   statusText: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 10,
// // // //     fontWeight: '700',
// // // //   },
// // // //   cardHeader: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "flex-start",
// // // //     marginTop: 8,
// // // //     marginBottom: 16,
// // // //   },
// // // //   gameIconContainer: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     flex: 1,
// // // //     gap: 12,
// // // //   },
// // // //   gameIconWrapper: {
// // // //     width: 48,
// // // //     height: 48,
// // // //     borderRadius: 10,
// // // //     backgroundColor: COLORS.background,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     borderWidth: 2,
// // // //     borderColor: COLORS.primary,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //   },
// // // //   gameInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   gameName: {
// // // //     fontSize: 16,
// // // //     fontWeight: "700",
// // // //     color: COLORS.textDark,
// // // //     marginBottom: 2,
// // // //   },
// // // //   gameId: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //   },
// // // //   gameTypeBadge: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 10,
// // // //     gap: 4,
// // // //     marginLeft: 8,
// // // //     borderWidth: 1,
// // // //   },
// // // //   paidBadge: {
// // // //     backgroundColor: "rgba(255, 152, 0, 0.1)",
// // // //     borderColor: COLORS.accent,
// // // //   },
// // // //   freeBadge: {
// // // //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// // // //     borderColor: "#4CAF50",
// // // //   },
// // // //   gameTypeText: {
// // // //     fontSize: 11,
// // // //     fontWeight: "700",
// // // //     color: COLORS.textDark,
// // // //   },
// // // //   gameDetails: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   detailRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 12,
// // // //   },
// // // //   detailItem: {
// // // //     flexDirection: "row",
// // // //     alignItems: "flex-start",
// // // //     gap: 8,
// // // //     flex: 1,
// // // //   },
// // // //   detailIcon: {
// // // //     width: 28,
// // // //     height: 28,
// // // //     borderRadius: 8,
// // // //     backgroundColor: COLORS.background,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.primary,
// // // //   },
// // // //   detailLabel: {
// // // //     fontSize: 10,
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //     marginBottom: 2,
// // // //   },
// // // //   detailText: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textDark,
// // // //     fontWeight: "600",
// // // //   },
// // // //   prizeContainer: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     backgroundColor: COLORS.background,
// // // //     padding: 12,
// // // //     borderRadius: 10,
// // // //     marginBottom: 16,
// // // //     gap: 10,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 1,
// // // //   },
// // // //   prizeIcon: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 8,
// // // //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.primary,
// // // //   },
// // // //   prizeInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   prizeLabel: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //     marginBottom: 2,
// // // //   },
// // // //   prizeText: {
// // // //     fontSize: 16,
// // // //     fontWeight: "700",
// // // //     color: COLORS.textDark,
// // // //   },
// // // //   prizeSubtext: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //     fontWeight: "500",
// // // //     marginTop: 2,
// // // //   },
// // // //   joinButton: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     paddingVertical: 12,
// // // //     borderRadius: 10,
// // // //     gap: 6,
// // // //     backgroundColor: COLORS.primary,
// // // //     shadowColor: "#FFD700",
// // // //     shadowOffset: { width: 0, height: 0 },
// // // //     shadowOpacity: 0.9,
// // // //     shadowRadius: 12,
// // // //     elevation: 8,
// // // //     overflow: 'hidden',
// // // //     position: 'relative',
// // // //   },
// // // //   glassEffectOverlay: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// // // //     borderRadius: 10,
// // // //   },
// // // //   completedJoinButton: {
// // // //     backgroundColor: COLORS.completed,
// // // //   },
// // // //   joinButtonText: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 14,
// // // //     fontWeight: "700",
// // // //   },
// // // //   winnersContainer: {
// // // //     gap: 8,
// // // //   },
// // // //   winnerCard: {
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 10,
// // // //     padding: 12,
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 1,
// // // //     elevation: 1,
// // // //   },
// // // //   winnerInfo: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 10,
// // // //   },
// // // //   winnerAvatar: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     backgroundColor: COLORS.primary,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   winnerInitial: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 14,
// // // //     fontWeight: '700',
// // // //   },
// // // //   winnerName: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: COLORS.textDark,
// // // //   },
// // // //   winnerPrize: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //     marginTop: 2,
// // // //   },
// // // //   winnerTime: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //   },
// // // //   infoCard: {
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //   },
// // // //   infoList: {
// // // //     gap: 12,
// // // //   },
// // // //   infoItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 10,
// // // //   },
// // // //   infoText: {
// // // //     fontSize: 14,
// // // //     color: COLORS.textDark,
// // // //     fontWeight: '500',
// // // //   },
// // // //   bottomSpace: {
// // // //     height: 20,
// // // //   },
// // // //   loadingMoreContainer: {
// // // //     paddingVertical: 20,
// // // //     alignItems: 'center',
// // // //   },
// // // //   // Popup Styles
// // // //   popupOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 20,
// // // //   },
// // // //   popupContainer: {
// // // //     width: width * 0.8,
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 28,
// // // //     padding: 24,
// // // //     alignItems: 'center',
// // // //   },
// // // //   popupIcon: {
// // // //     width: 56,
// // // //     height: 56,
// // // //     borderRadius: 28,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //   },
// // // //   popupTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: COLORS.textDark,
// // // //     marginBottom: 8,
// // // //   },
// // // //   popupGameName: {
// // // //     fontSize: 16,
// // // //     color: COLORS.textLight,
// // // //     marginBottom: 16,
// // // //     textAlign: 'center',
// // // //   },
// // // //   popupTimer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 6,
// // // //     marginBottom: 20,
// // // //   },
// // // //   popupTimerText: {
// // // //     fontSize: 14,
// // // //     color: COLORS.textDark,
// // // //     fontWeight: '500',
// // // //   },
// // // //   popupPrize: {
// // // //     alignItems: 'center',
// // // //     marginBottom: 24,
// // // //   },
// // // //   popupPrizeLabel: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //     marginBottom: 4,
// // // //   },
// // // //   popupPrizeValue: {
// // // //     fontSize: 20,
// // // //     fontWeight: '700',
// // // //     color: COLORS.primary,
// // // //   },
// // // //   popupPrizeSubtext: {
// // // //     fontSize: 11,
// // // //     color: COLORS.textLight,
// // // //     marginTop: 4,
// // // //   },
// // // //   popupActions: {
// // // //     width: '100%',
// // // //     gap: 12,
// // // //   },
// // // //   popupPrimaryButton: {
// // // //     paddingVertical: 14,
// // // //     borderRadius: 20,
// // // //     alignItems: 'center',
// // // //   },
// // // //   popupPrimaryButtonText: {
// // // //     color: COLORS.surface,
// // // //     fontSize: 15,
// // // //     fontWeight: '600',
// // // //   },
// // // //   popupSecondaryButton: {
// // // //     paddingVertical: 10,
// // // //     alignItems: 'center',
// // // //   },
// // // //   popupSecondaryButtonText: {
// // // //     fontSize: 14,
// // // //     color: COLORS.textLight,
// // // //   },
// // // //   // Modal Styles
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   modalContent: {
// // // //     width: '90%',
// // // //     maxHeight: '80%',
// // // //     backgroundColor: COLORS.surface,
// // // //     borderRadius: 16,
// // // //     padding: 16,
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //     paddingBottom: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: COLORS.border,
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     color: COLORS.textDark,
// // // //   },
// // // //   notificationItem: {
// // // //     flexDirection: 'row',
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: COLORS.border,
// // // //   },
// // // //   notificationIcon: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     backgroundColor: '#F0F8FF',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //   },
// // // //   notificationContent: {
// // // //     flex: 1,
// // // //   },
// // // //   notificationTitle: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: COLORS.textDark,
// // // //     marginBottom: 2,
// // // //   },
// // // //   notificationMessage: {
// // // //     fontSize: 12,
// // // //     color: COLORS.textLight,
// // // //     marginBottom: 4,
// // // //   },
// // // //   notificationDate: {
// // // //     fontSize: 10,
// // // //     color: COLORS.textLight,
// // // //   },
// // // //   emptyNotifications: {
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingVertical: 40,
// // // //   },
// // // //   emptyText: {
// // // //     marginTop: 12,
// // // //     color: COLORS.textLight,
// // // //     fontSize: 14,
// // // //   },
// // // //   loadingIndicator: {
// // // //     marginVertical: 20,
// // // //   },
// // // //   closeBtn: {
// // // //     marginTop: 16,
// // // //     backgroundColor: COLORS.primary,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 8,
// // // //     alignItems: 'center',
// // // //   },
// // // //   closeBtnText: {
// // // //     color: COLORS.surface,
// // // //     fontWeight: '600',
// // // //     fontSize: 14,
// // // //   },
// // // // });

// // // // export default Home;








// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   Image,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   Modal,
// // //   ActivityIndicator,
// // //   RefreshControl,
// // //   Dimensions,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   TextInput,
// // //   Animated,
// // //   Easing,
// // //   Platform,
// // // } from "react-native";
// // // import axios from "axios";
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { useNavigation } from '@react-navigation/native';

// // // const { width } = Dimensions.get('window');

// // // // Color scheme matching the reference design
// // // const COLORS = {
// // //   primary: "#4facfe", // Main blue color
// // //   accent: "#FDB800", // Orange accent
// // //   background: "#f5f8ff", // Light background
// // //   surface: "#FFFFFF",
// // //   textDark: "#333333",
// // //   textLight: "#777777",
// // //   border: "#EEEEEE",
  
// // //   // Status colors
// // //   live: "#4CAF50",
// // //   scheduled: "#ff9800",
// // //   completed: "#ff9800",
  
// // //   // Quick action colors
// // //   deposit: "#4facfe",
// // //   withdraw: "#FF6B6B",
// // //   refer: "#4ECDC4",
// // //   support: "#9B59B6",
  
// // //   // Pattern card colors - keeping original circle colors
// // //   patternColors: [
// // //     '#0282E9', // Blue
// // //     '#F59E0B', // Orange
// // //     '#10B981', // Green
// // //     '#EF4444', // Red
// // //     '#8B5CF6', // Purple
// // //     '#EC4899', // Pink
// // //     '#06B6D4', // Cyan
// // //     '#F97316', // Orange
// // //   ],
// // // };

// // // const Home = () => {
// // //   const navigation = useNavigation();
// // //   const [notifications, setNotifications] = useState([]);
// // //   const [sliders, setSliders] = useState([]);
// // //   const [games, setGames] = useState([]);
// // //   const [filteredGames, setFilteredGames] = useState([]);
// // //   const [patterns, setPatterns] = useState([]);
// // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // //   const [activeSlide, setActiveSlide] = useState(0);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // //   const [loadingGames, setLoadingGames] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState('');
  
// // //   // Popup state
// // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // //   const [popupShown, setPopupShown] = useState(false);
  
// // //   // Animation for popup
// // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // //   // Animation values for buttons and patterns
// // //   const buttonScaleAnims = useRef([]);
// // //   const patternScaleAnims = useRef([]);
// // //   const glowAnims = useRef([]);
// // //   const letterAnims = useRef([]);
  
// // //   // Pagination state for games
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [lastPage, setLastPage] = useState(1);
// // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // //   const sliderRef = useRef(null);
// // //   const scrollInterval = useRef(null);

// // //   // Filter options
// // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // //   // Initialize animations
// // //   useEffect(() => {
// // //     // Initialize button animations for join buttons (will be created dynamically)
// // //     buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
// // //     // Start animations for buttons
// // //     buttonScaleAnims.current.forEach((anim, index) => {
// // //       startPulseAnimation(anim);
// // //     });
// // //   }, [games.length]);

// // //   // Initialize letter animations for header
// // //   useEffect(() => {
// // //     letterAnims.current = Array(12).fill().map(() => new Animated.Value(1));
    
// // //     // Animate each letter with a popping effect
// // //     letterAnims.current.forEach((anim, index) => {
// // //       Animated.loop(
// // //         Animated.sequence([
// // //           Animated.delay(index * 80), // Staggered animation
// // //           Animated.timing(anim, {
// // //             toValue: 1.4,
// // //             duration: 300,
// // //             useNativeDriver: true,
// // //             easing: Easing.bounce,
// // //           }),
// // //           Animated.timing(anim, {
// // //             toValue: 1,
// // //             duration: 200,
// // //             useNativeDriver: true,
// // //             easing: Easing.bounce,
// // //           }),
// // //           Animated.delay(1800),
// // //         ])
// // //       ).start();
// // //     });
// // //   }, []);

// // //   // Initialize pattern animations when patterns load
// // //   useEffect(() => {
// // //     if (patterns.length > 0) {
// // //       patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
// // //       glowAnims.current = patterns.map(() => new Animated.Value(0));
      
// // //       // Start animations for patterns
// // //       patternScaleAnims.current.forEach((anim, index) => {
// // //         startPulseAnimation(anim, 1000 + (index * 200)); // Staggered animation
// // //       });
      
// // //       glowAnims.current.forEach((anim, index) => {
// // //         startGlowAnimation(anim, 1500 + (index * 300));
// // //       });
// // //     }
// // //   }, [patterns.length]);

// // //   // Pulse animation function
// // //   const startPulseAnimation = (anim, duration = 800) => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(anim, {
// // //           toValue: 1.08,
// // //           duration: duration,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         }),
// // //         Animated.timing(anim, {
// // //           toValue: 1,
// // //           duration: duration,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         })
// // //       ])
// // //     ).start();
// // //   };

// // //   // Glow animation function
// // //   const startGlowAnimation = (anim, duration = 1500) => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(anim, {
// // //           toValue: 1,
// // //           duration: duration / 2,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         }),
// // //         Animated.timing(anim, {
// // //           toValue: 0,
// // //           duration: duration / 2,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         })
// // //       ])
// // //     ).start();
// // //   };

// // //   // Function to calculate prize pool from pattern rewards
// // //   const calculatePrizePool = (game) => {
// // //     if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
// // //       return null;
// // //     }
    
// // //     const total = game.pattern_rewards.reduce((sum, reward) => {
// // //       const amount = parseFloat(reward.amount) || 0;
// // //       const count = parseInt(reward.reward_count) || 1;
// // //       return sum + (amount * count);
// // //     }, 0);
    
// // //     return total;
// // //   };

// // //   useEffect(() => {
// // //     fetchInitialData();
    
// // //     return () => {
// // //       if (scrollInterval.current) {
// // //         clearInterval(scrollInterval.current);
// // //       }
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (games.length > 0 && !popupShown) {
// // //       setTimeout(() => {
// // //         checkUpcomingGame();
// // //       }, 1500);
// // //     }
// // //   }, [games, popupShown]);

// // //   useEffect(() => {
// // //     if (sliders.length > 1) {
// // //       startAutoScroll();
// // //     }
// // //     return () => {
// // //       if (scrollInterval.current) {
// // //         clearInterval(scrollInterval.current);
// // //       }
// // //     };
// // //   }, [sliders.length]);

// // //   // Filter games based on search and active filter
// // //   useEffect(() => {
// // //     let filtered = games;
    
// // //     // Apply search filter
// // //     if (searchQuery.trim() !== '') {
// // //       filtered = filtered.filter(game =>
// // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // //       );
// // //     }
    
// // //     // Apply status filter
// // //     if (activeFilter === 'Live Now') {
// // //       filtered = filtered.filter(game => game.status === 'live');
// // //     } else if (activeFilter === 'Upcoming') {
// // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // //     } else if (activeFilter === 'Completed') {
// // //       filtered = filtered.filter(game => game.status === 'completed');
// // //     }
    
// // //     setFilteredGames(filtered);
// // //   }, [searchQuery, games, activeFilter]);

// // //   useEffect(() => {
// // //     if (upcomingGamePopup) {
// // //       Animated.parallel([
// // //         Animated.timing(opacityAnim, {
// // //           toValue: 1,
// // //           duration: 300,
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(slideAnim, {
// // //           toValue: 0,
// // //           duration: 400,
// // //           easing: Easing.out(Easing.back(1.2)),
// // //           useNativeDriver: true,
// // //         }),
// // //       ]).start();
// // //     } else {
// // //       opacityAnim.setValue(0);
// // //       slideAnim.setValue(300);
// // //     }
// // //   }, [upcomingGamePopup]);

// // //   const startAutoScroll = () => {
// // //     if (scrollInterval.current) {
// // //       clearInterval(scrollInterval.current);
// // //     }
    
// // //     scrollInterval.current = setInterval(() => {
// // //       if (sliders.length > 0) {
// // //         let nextIndex = activeSlide + 1;
// // //         if (nextIndex >= sliders.length) {
// // //           nextIndex = 0;
// // //         }
        
// // //         setActiveSlide(nextIndex);
// // //         if (sliderRef.current) {
// // //           const slideWidth = width - 32;
// // //           sliderRef.current.scrollToOffset({
// // //             offset: nextIndex * slideWidth,
// // //             animated: true
// // //           });
// // //         }
// // //       }
// // //     }, 3000);
// // //   };

// // //   const fetchInitialData = async () => {
// // //     try {
// // //       await Promise.all([
// // //         fetchNotifications(),
// // //         fetchSliders(),
// // //         fetchGames(1),
// // //         fetchPatterns()
// // //       ]);
// // //     } catch (error) {
// // //       console.log("Error fetching initial data:", error);
// // //     }
// // //   };

// // //   const onRefresh = React.useCallback(() => {
// // //     setRefreshing(true);
// // //     setCurrentPage(1);
// // //     setGames([]);
// // //     setFilteredGames([]);
// // //     setPopupShown(false);
// // //     Promise.all([
// // //       fetchNotifications(),
// // //       fetchSliders(),
// // //       fetchGames(1),
// // //       fetchPatterns()
// // //     ]).finally(() => setRefreshing(false));
// // //   }, []);

// // //   const checkUpcomingGame = () => {
// // //     try {
// // //       const now = new Date();
      
// // //       const scheduledGames = games.filter(game => 
// // //         game.status === 'scheduled'
// // //       );
      
// // //       if (scheduledGames.length === 0) return;
      
// // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // //         let endDateTime;
        
// // //         try {
// // //           if (game.ticket_request_end_date) {
// // //             endDateTime = new Date(game.ticket_request_end_date);
// // //           } else {
// // //             endDateTime = new Date(game.game_date);
// // //           }
// // //         } catch (e) {
// // //           endDateTime = new Date();
// // //         }
        
// // //         return {
// // //           ...game,
// // //           endDateTime
// // //         };
// // //       });
      
// // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // //       const earliestEndGame = sortedGames[0];
      
// // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
// // //         setUpcomingGame(earliestEndGame);
// // //         setUpcomingGamePopup(true);
// // //         setPopupShown(true);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error checking upcoming game:", error);
// // //     }
// // //   };

// // //   const getTimeRemaining = (endDateTime) => {
// // //     const now = new Date();
// // //     const diff = endDateTime - now;
    
// // //     if (diff <= 0) return "Ending soon";
    
// // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // //     if (days > 0) {
// // //       return `${days}d ${hours}h left`;
// // //     } else if (hours > 0) {
// // //       return `${hours}h ${minutes}m left`;
// // //     } else {
// // //       return `${minutes}m left`;
// // //     }
// // //   };

// // //   const fetchNotifications = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/notifications",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.status) {
// // //         setNotifications(res.data.data);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching notifications:", error);
// // //     } finally {
// // //       setLoadingNotifications(false);
// // //     }
// // //   };

// // //   const fetchSliders = async () => {
// // //     try {
// // //       setLoadingSliders(true);
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/sliders"
// // //       );
// // //       if (res.data.success) {
// // //         setSliders(res.data.data || []);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching sliders:", error);
// // //       setSliders([]);
// // //     } finally {
// // //       setLoadingSliders(false);
// // //     }
// // //   };

// // //   const fetchGames = async (page = 1) => {
// // //     try {
// // //       if (page === 1) {
// // //         setLoadingGames(true);
// // //       }
      
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
      
// // //       const res = await axios.get(
// // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
      
// // //       if (res.data.success) {
// // //         const newGames = res.data.games.data || [];
// // //         const pagination = res.data.games;
        
// // //         if (page === 1) {
// // //           setGames(newGames);
// // //           setFilteredGames(newGames);
// // //         } else {
// // //           setGames(prev => [...prev, ...newGames]);
// // //           setFilteredGames(prev => [...prev, ...newGames]);
// // //         }
        
// // //         setCurrentPage(pagination.current_page);
// // //         setLastPage(pagination.last_page);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching games:", error);
// // //     } finally {
// // //       if (page === 1) {
// // //         setLoadingGames(false);
// // //       }
// // //       setLoadingMore(false);
// // //     }
// // //   };

// // //   const fetchPatterns = async () => {
// // //     try {
// // //       setLoadingPatterns(true);
// // //       const token = await AsyncStorage.getItem("token");
      
// // //       if (!token) {
// // //         setLoadingPatterns(false);
// // //         return;
// // //       }

// // //       const response = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             Accept: 'application/json',
// // //           },
// // //         }
// // //       );

// // //       if (response.data && response.data.status) {
// // //         const patternsData = response.data.data?.patterns || [];
        
// // //         const patternSequence = [
// // //           'top line',
// // //           'middle line', 
// // //           'bottom line',
// // //           'breakfast',
// // //           'lunch',
// // //           'dinner',
// // //           'four corners',
// // //           'bamboo',
// // //           'early five',
// // //           'non claimers',
// // //           'full house'
// // //         ];
        
// // //         const sortedPatterns = patternsData.sort((a, b) => {
// // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // //           if (aIndex === -1) return 1;
// // //           if (bIndex === -1) return -1;
          
// // //           return aIndex - bIndex;
// // //         });
        
// // //         setPatterns(sortedPatterns.slice(0, 8));
// // //       }
// // //     } catch (error) {
// // //       console.log('Error fetching patterns in Home:', error);
// // //     } finally {
// // //       setLoadingPatterns(false);
// // //     }
// // //   };

// // //   const loadMoreGames = () => {
// // //     if (!loadingMore && currentPage < lastPage) {
// // //       setLoadingMore(true);
// // //       fetchGames(currentPage + 1);
// // //     }
// // //   };

// // //   const handleGamePress = (game) => {
// // //     navigation.navigate("GameDetails", { game });
// // //   };

// // //   const handleAllGamesPress = () => {
// // //     navigation.navigate("Game");
// // //   };

// // //   const handleAllPatternsPress = () => {
// // //     navigation.navigate("UserGamePatterns");
// // //   };

// // //   const handleViewAllWinners = () => {
// // //     navigation.navigate("Game");
// // //   };

// // //   const handlePatternPress = (pattern) => {
// // //     navigation.navigate("UserGamePatterns", { 
// // //       selectedPatternId: pattern.id,
// // //       selectedPattern: pattern 
// // //     });
// // //   };

// // //   const handlePopupJoinNow = () => {
// // //     setUpcomingGamePopup(false);
// // //     if (upcomingGame) {
// // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // //     }
// // //   };

// // //   const handlePopupLater = () => {
// // //     setUpcomingGamePopup(false);
// // //   };

// // //   const getPatternIcon = (pattern) => {
// // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // //     const iconMap = {
// // //       'bamboo': 'leaf',
// // //       'bottom line': 'arrow-down',
// // //       'breakfast': 'cafe',
// // //       'dinner': 'restaurant',
// // //       'early five': '5',
// // //       'four corners': 'apps',
// // //       'full house': 'home',
// // //       'lunch': 'fast-food',
// // //       'middle line': 'remove',
// // //       'non claimer': 'close',
// // //       'top line': 'arrow-up'
// // //     };
    
// // //     for (const [key, icon] of Object.entries(iconMap)) {
// // //       if (patternName.includes(key)) return icon;
// // //     }
    
// // //     return 'grid-outline';
// // //   };

// // //   const formatPatternName = (name) => {
// // //     if (!name) return 'Unknown Pattern';
// // //     return name
// // //       .split('_')
// // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // //       .join(' ');
// // //   };

// // //   // Cartoon-style header with popping letters in a single line and proper spacing
// // //   const Header = () => {
// // //     const letters = [
// // //       { char: 'H', index: 0 },
// // //       { char: 'O', index: 1, isSpecial: true },
// // //       { char: 'U', index: 2 },
// // //       { char: 'Z', index: 3 },
// // //       { char: 'I', index: 4 },
// // //       { char: 'E', index: 5 },
// // //       { char: ' ', index: 6, isSpace: true, width: 20 }, // Wider space between words
// // //       { char: 'T', index: 7 },
// // //       { char: 'I', index: 8 },
// // //       { char: 'M', index: 9 },
// // //       { char: 'E', index: 10 },
// // //       { char: 'Z', index: 11, isSpecial: true },
// // //     ];

// // //     return (
// // //       <View style={styles.header}>
// // //         <View style={styles.logoContainer}>
// // //           <View style={styles.cartoonTitleRow}>
// // //             {letters.map((item) => (
// // //               <Animated.Text
// // //                 key={item.index}
// // //                 style={[
// // //                   styles.cartoonLetter,
// // //                   item.isSpecial && styles.specialCartoonLetter,
// // //                   item.isSpace && { width: item.width || 20 }, // Dynamic width for space
// // //                   { 
// // //                     transform: [{ scale: letterAnims.current[item.index] || 1 }],
// // //                     marginHorizontal: item.isSpace ? 0 : 2, // Small gap between non-space letters
// // //                   }
// // //                 ]}
// // //               >
// // //                 {item.char}
// // //               </Animated.Text>
// // //             ))}
// // //           </View>
// // //         </View>

// // //         <TouchableOpacity 
// // //           style={styles.notification}
// // //           onPress={() => setModalVisible(true)}
// // //         >
// // //           <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// // //           {notifications.length > 0 && (
// // //             <View style={styles.badge}>
// // //               <Text style={styles.badgeText}>{notifications.length}</Text>
// // //             </View>
// // //           )}
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   };

// // //   // Animated pattern card with glow and pulse
// // //   const renderPatternCard = (pattern, index) => {
// // //     const icon = getPatternIcon(pattern);
// // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // //     // Pattern names for display
// // //     const patterns = [
// // //       'Top Line',
// // //       'Middle',
// // //       'Bottom',
// // //       'Breakfast',
// // //       'Lunch',
// // //       'Dinner',
// // //       'Corners',
// // //       'Bamboo',
// // //     ];
    
// // //     const patternName = patterns[index % patterns.length];
// // //     const bgColor = COLORS.patternColors[index % COLORS.patternColors.length];
    
// // //     const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
// // //     const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
// // //     const glowOpacity = glowAnim.interpolate({
// // //       inputRange: [0, 1],
// // //       outputRange: [0, 0.7]
// // //     });
    
// // //     return (
// // //       <Animated.View
// // //         key={pattern.id}
// // //         style={[
// // //           styles.patternCardContainer,
// // //           {
// // //             transform: [{ scale: scaleAnim }]
// // //           }
// // //         ]}
// // //       >
// // //         <TouchableOpacity 
// // //           style={styles.compactPatternCard}
// // //           onPress={() => handlePatternPress(pattern)}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Animated.View style={[
// // //             styles.glowEffect,
// // //             {
// // //               backgroundColor: bgColor,
// // //               opacity: glowOpacity,
// // //               transform: [{ scale: 1.2 }]
// // //             }
// // //           ]} />
// // //           <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
// // //             <Ionicons name={icon} size={18} color="#FFFFFF" />
// // //           </View>
// // //           <Text style={styles.compactPatternName} numberOfLines={1}>
// // //             {patternName}
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   const renderSliderItem = ({ item }) => (
// // //     <View style={styles.slideContainer}>
// // //       <Image
// // //         source={{ 
// // //           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
// // //         }}
// // //         style={styles.sliderImage}
// // //         resizeMode="cover"
// // //       />
// // //     </View>
// // //   );

// // //   const handleScroll = (event) => {
// // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // //       setActiveSlide(currentIndex);
// // //     }
// // //   };

// // //   const renderPagination = () => {
// // //     if (sliders.length <= 1) return null;
    
// // //     return (
// // //       <View style={styles.paginationContainer}>
// // //         {sliders.map((_, index) => (
// // //           <View
// // //             key={index}
// // //             style={[
// // //               styles.paginationDot,
// // //               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
// // //             ]}
// // //           />
// // //         ))}
// // //       </View>
// // //     );
// // //   };

// // //   const renderGameCard = ({ item: game, index }) => {
// // //     if (!game) return null;
    
// // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // //     const isPaid = game.ticket_type === "paid";
// // //     const isLive = game.status === 'live';
// // //     const isScheduled = game.status === 'scheduled';
// // //     const isCompleted = game.status === 'completed';
    
// // //     // Calculate prize pool from pattern rewards
// // //     const prizePool = calculatePrizePool(game);
    
// // //     // Get or create animation for this button
// // //     if (!buttonScaleAnims.current[index]) {
// // //       buttonScaleAnims.current[index] = new Animated.Value(1);
// // //       startPulseAnimation(buttonScaleAnims.current[index]);
// // //     }
    
// // //     const buttonScale = buttonScaleAnims.current[index];
    
// // //     return (
// // //       <TouchableOpacity
// // //         style={styles.gameCard}
// // //         activeOpacity={0.9}
// // //         onPress={() => handleGamePress(game)}
// // //       >
// // //         {/* Background Pattern */}
// // //         <View style={styles.gameCardPattern} />
        
// // //         {/* Status badge */}
// // //         <View style={[
// // //           styles.statusBadge,
// // //           isLive ? styles.liveBadge :
// // //           isScheduled ? styles.scheduledBadge :
// // //           isCompleted ? styles.completedBadge :
// // //           styles.defaultBadge
// // //         ]}>
// // //           <Ionicons 
// // //             name={
// // //               isLive ? 'radio-button-on' : 
// // //               isCompleted ? 'checkmark-circle' :
// // //               'time'
// // //             } 
// // //             size={10} 
// // //             color={COLORS.surface} 
// // //           />
// // //           <Text style={styles.statusText}>
// // //             {isLive ? 'LIVE' : 
// // //              isCompleted ? 'COMPLETED' : 
// // //              'SOON'}
// // //           </Text>
// // //         </View>

// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.gameIconContainer}>
// // //             <View style={styles.gameIconWrapper}>
// // //               <MaterialIcons name="confirmation-number" size={32} color={COLORS.accent} />
// // //             </View>
// // //             <View style={styles.gameInfo}>
// // //               <Text style={styles.gameName} numberOfLines={1}>
// // //                 {game.game_name || "Tambola Game"}
// // //               </Text>
// // //               <Text style={styles.gameId}>
// // //                 ID: {game.game_code || "N/A"}
// // //               </Text>
// // //             </View>
// // //           </View>
          
// // //           <View style={[
// // //             styles.gameTypeBadge,
// // //             isPaid ? styles.paidBadge : styles.freeBadge,
// // //           ]}>
// // //             {isPaid ? (
// // //               <>
// // //                 <MaterialIcons name="diamond" size={14} color={COLORS.accent} />
// // //                 <Text style={styles.gameTypeText}>
// // //                   ₹{ticketCost}
// // //                 </Text>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
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
// // //               <View style={styles.detailIcon}>
// // //                 <Ionicons name="calendar" size={14} color={COLORS.accent} />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Date</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.game_date_formatted || game.game_date || "Date TBA"}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             <View style={styles.detailItem}>
// // //               <View style={styles.detailIcon}>
// // //                 <Ionicons name="time" size={14} color={COLORS.accent} />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Time</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
          
// // //           <View style={styles.detailRow}>
// // //             <View style={styles.detailItem}>
// // //               <View style={styles.detailIcon}>
// // //                 <Ionicons name="person" size={14} color={COLORS.accent} />
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
// // //                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.accent} />
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
// // //                 <View style={styles.detailIcon}>
// // //                   <Ionicons name="trophy" size={14} color={COLORS.accent} />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.detailLabel}>Status</Text>
// // //                   <Text style={styles.detailText}>Completed</Text>
// // //                 </View>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <View style={styles.prizeContainer}>
// // //           <View style={styles.prizeIcon}>
// // //             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.accent} />
// // //           </View>
// // //           <View style={styles.prizeInfo}>
// // //             <Text style={styles.prizeLabel}>
// // //               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
// // //             </Text>
// // //             <Text style={styles.prizeText}>
// // //               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // //             </Text>
// // //             {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// // //               <Text style={styles.prizeSubtext}>
// // //                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
// // //               </Text>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
// // //           <TouchableOpacity 
// // //             style={[
// // //               styles.joinButton,
// // //               isCompleted && styles.completedJoinButton
// // //             ]}
// // //             onPress={() => handleGamePress(game)}
// // //             activeOpacity={0.9}
// // //           >
// // //             <View style={styles.glassEffectOverlay} />
// // //             <Text style={styles.joinButtonText}>
// // //               {isCompleted 
// // //                 ? 'VIEW RESULTS' 
// // //                 : isLive
// // //                   ? 'JOIN GAME' 
// // //                   : 'VIEW DETAILS'}
// // //             </Text>
// // //             <Ionicons 
// // //               name={isCompleted ? "trophy" : "arrow-forward"} 
// // //               size={16} 
// // //               color={COLORS.surface} 
// // //             />
// // //           </TouchableOpacity>
// // //         </Animated.View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const clearSearch = () => {
// // //     setSearchQuery('');
// // //   };

// // //   const renderFooter = () => {
// // //     if (!loadingMore) return null;
// // //     return (
// // //       <View style={styles.loadingMoreContainer}>
// // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // //       </View>
// // //     );
// // //   };

// // //   const UpcomingGamePopup = () => {
// // //     if (!upcomingGame) return null;
    
// // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // //     const isPaid = upcomingGame.ticket_type === "paid";
// // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // //     // Calculate prize pool for popup
// // //     const prizePool = calculatePrizePool(upcomingGame);
    
// // //     return (
// // //       <Modal
// // //         visible={upcomingGamePopup}
// // //         transparent={true}
// // //         animationType="fade"
// // //         onRequestClose={handlePopupLater}
// // //       >
// // //         <View style={styles.popupOverlay}>
// // //           <Animated.View 
// // //             style={[
// // //               styles.popupContainer,
// // //               {
// // //                 opacity: opacityAnim,
// // //                 transform: [{ translateY: slideAnim }]
// // //               }
// // //             ]}
// // //           >
// // //             <View style={[styles.popupIcon, { backgroundColor: COLORS.primary + '20' }]}>
// // //               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
// // //             </View>
            
// // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // //             <View style={styles.popupTimer}>
// // //               <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
// // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // //             </View>
            
// // //             <View style={styles.popupPrize}>
// // //               <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
// // //               <Text style={styles.popupPrizeValue}>
// // //                 {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // //               </Text>
// // //               {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
// // //                 <Text style={styles.popupPrizeSubtext}>
// // //                   {upcomingGame.pattern_rewards.length} Patterns
// // //                 </Text>
// // //               )}
// // //             </View>
            
// // //             <View style={styles.popupActions}>
// // //               <TouchableOpacity 
// // //                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
// // //                 onPress={handlePopupJoinNow}
// // //               >
// // //                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // //               </TouchableOpacity>
              
// // //               <TouchableOpacity 
// // //                 style={styles.popupSecondaryButton}
// // //                 onPress={handlePopupLater}
// // //               >
// // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </Animated.View>
// // //         </View>
// // //       </Modal>
// // //     );
// // //   };

// // //   if (loadingGames && games.length === 0) {
// // //     return (
// // //       <SafeAreaView style={styles.safeArea}>
// // //         <View style={styles.loadingContainer}>
// // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// // //       <View style={styles.container}>
// // //         {/* Header with cartoon-style popping letters in a single line */}
// // //         <Header />

// // //         {/* Search Bar */}
// // //         <View style={styles.searchWrapper}>
// // //           <View style={styles.searchBox}>
// // //             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
// // //             <TextInput
// // //               placeholder="Search games by name or ID..."
// // //               placeholderTextColor={COLORS.textLight}
// // //               style={styles.searchInput}
// // //               value={searchQuery}
// // //               onChangeText={setSearchQuery}
// // //               returnKeyType="search"
// // //             />
// // //             {searchQuery.length > 0 ? (
// // //               <TouchableOpacity onPress={clearSearch}>
// // //                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
// // //               </TouchableOpacity>
// // //             ) : (
// // //               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
// // //             )}
// // //           </View>
// // //         </View>

// // //         <ScrollView
// // //           showsVerticalScrollIndicator={false}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={onRefresh}
// // //               tintColor={COLORS.primary}
// // //               colors={[COLORS.primary]}
// // //             />
// // //           }
// // //         >
// // //           {/* Slider Section */}
// // //           {loadingSliders ? (
// // //             <View style={styles.sliderLoadingContainer}>
// // //               <ActivityIndicator size="large" color={COLORS.primary} />
// // //               <Text style={styles.loadingText}>Loading offers...</Text>
// // //             </View>
// // //           ) : sliders.length > 0 ? (
// // //             <View style={styles.sliderSection}>
// // //               <View style={styles.sliderWrapper}>
// // //                 <FlatList
// // //                   ref={sliderRef}
// // //                   data={sliders}
// // //                   renderItem={renderSliderItem}
// // //                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // //                   horizontal
// // //                   pagingEnabled
// // //                   showsHorizontalScrollIndicator={false}
// // //                   onScroll={handleScroll}
// // //                   scrollEventThrottle={16}
// // //                 />
                
// // //                 {/* Pagination Dots */}
// // //                 {renderPagination()}
// // //               </View>
// // //             </View>
// // //           ) : null}

// // //           {/* Patterns Section - Now with glow and pulse animations */}
// // //           {patterns.length > 0 && (
// // //             <View style={styles.patternsSection}>
// // //               <View style={styles.sectionHeader}>
// // //                 <View style={styles.sectionTitleContainer}>
// // //                   <Ionicons name="grid-outline" size={22} color={COLORS.primary} />
// // //                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
// // //                 </View>
// // //                 <TouchableOpacity onPress={handleAllPatternsPress}>
// // //                   <View style={styles.seeAllButton}>
// // //                     <Text style={styles.seeAllText}>See All</Text>
// // //                     <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
// // //                   </View>
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {loadingPatterns ? (
// // //                 <ActivityIndicator size="small" color={COLORS.primary} />
// // //               ) : (
// // //                 <ScrollView 
// // //                   horizontal 
// // //                   showsHorizontalScrollIndicator={false}
// // //                   contentContainerStyle={styles.patternsList}
// // //                 >
// // //                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // //                 </ScrollView>
// // //               )}
// // //             </View>
// // //           )}

// // //           {/* Games Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <Ionicons name="game-controller-outline" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
// // //               </View>
// // //               <TouchableOpacity onPress={handleAllGamesPress}>
// // //                 <Text style={styles.seeAll}>See All</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             {loadingGames ? (
// // //               <View style={styles.gamesLoadingContainer}>
// // //                 <ActivityIndicator size="large" color={COLORS.primary} />
// // //                 <Text style={styles.loadingText}>Loading games...</Text>
// // //               </View>
// // //             ) : filteredGames.length > 0 ? (
// // //               <View style={styles.gamesContainer}>
// // //                 {filteredGames.map((game, index) => (
// // //                   <View key={game.id || index}>
// // //                     {renderGameCard({ item: game, index })}
// // //                   </View>
// // //                 ))}
// // //                 {loadingMore && (
// // //                   <View style={styles.loadingMoreContainer}>
// // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // //                   </View>
// // //                 )}
// // //               </View>
// // //             ) : (
// // //               <View style={styles.noGamesContainer}>
// // //                 <Ionicons name="game-controller-outline" size={50} color={COLORS.textLight} />
// // //                 <Text style={styles.noGamesText}>
// // //                   {searchQuery ? 'No games found' : 'No games available at the moment'}
// // //                 </Text>
// // //                 {searchQuery && (
// // //                   <TouchableOpacity 
// // //                     style={styles.refreshGamesBtn}
// // //                     onPress={clearSearch}
// // //                   >
// // //                     <Text style={styles.refreshGamesText}>Clear Search</Text>
// // //                   </TouchableOpacity>
// // //                 )}
// // //               </View>
// // //             )}
// // //           </View>

// // //           {/* Recent Winners Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <FontAwesome name="trophy" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>RECENT WINNERS</Text>
// // //               </View>
// // //               <TouchableOpacity onPress={handleViewAllWinners}>
// // //                 <Text style={styles.seeAll}>See All</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             <View style={styles.winnersContainer}>
// // //               {[
// // //                 { id: 1, name: "Amit Sharma", prize: "Won Full House 🏆", time: "2 min ago" },
// // //                 { id: 2, name: "Neha Gupta", prize: "Won Early 5 🎉", time: "5 min ago" },
// // //                 { id: 3, name: "Rahul Verma", prize: "Won Corners ✨", time: "10 min ago" },
// // //               ].map((winner) => (
// // //                 <View key={winner.id} style={styles.winnerCard}>
// // //                   <View style={styles.winnerInfo}>
// // //                     <View style={styles.winnerAvatar}>
// // //                       <Text style={styles.winnerInitial}>{winner.name.charAt(0)}</Text>
// // //                     </View>
// // //                     <View>
// // //                       <Text style={styles.winnerName}>{winner.name}</Text>
// // //                       <Text style={styles.winnerPrize}>{winner.prize}</Text>
// // //                     </View>
// // //                   </View>
// // //                   <Text style={styles.winnerTime}>{winner.time}</Text>
// // //                 </View>
// // //               ))}
// // //             </View>
// // //           </View>

// // //           {/* Why Play With Us Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
// // //                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
// // //               </View>
// // //             </View>
            
// // //             <View style={styles.infoCard}>
// // //               <View style={styles.infoList}>
// // //                 <View style={styles.infoItem}>
// // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // //                   <Text style={styles.infoText}>Fast & Fair Games</Text>
// // //                 </View>
// // //                 <View style={styles.infoItem}>
// // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // //                   <Text style={styles.infoText}>Real Players</Text>
// // //                 </View>
// // //                 <View style={styles.infoItem}>
// // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // //                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
// // //                 </View>
// // //                 <View style={styles.infoItem}>
// // //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// // //                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </ScrollView>

// // //         {/* Popup */}
// // //         <UpcomingGamePopup />

// // //         {/* Notifications Modal */}
// // //         <Modal visible={modalVisible} transparent={true} animationType="slide">
// // //           <View style={styles.modalOverlay}>
// // //             <View style={styles.modalContent}>
// // //               <View style={styles.modalHeader}>
// // //                 <Text style={styles.modalTitle}>Notifications</Text>
// // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // //                   <Ionicons name="close" size={24} color={COLORS.textDark} />
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {loadingNotifications ? (
// // //                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
// // //               ) : (
// // //                 <FlatList
// // //                   data={notifications}
// // //                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // //                   renderItem={({ item }) => (
// // //                     <View style={styles.notificationItem}>
// // //                       <View style={styles.notificationIcon}>
// // //                         <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
// // //                       </View>
// // //                       <View style={styles.notificationContent}>
// // //                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
// // //                         <Text style={styles.notificationMessage}>
// // //                           {item.message || "Check out the new features!"}
// // //                         </Text>
// // //                         <Text style={styles.notificationDate}>
// // //                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // //                         </Text>
// // //                       </View>
// // //                     </View>
// // //                   )}
// // //                   ListEmptyComponent={
// // //                     <View style={styles.emptyNotifications}>
// // //                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
// // //                       <Text style={styles.emptyText}>No notifications yet</Text>
// // //                     </View>
// // //                   }
// // //                 />
// // //               )}

// // //               <TouchableOpacity
// // //                 style={styles.closeBtn}
// // //                 onPress={() => setModalVisible(false)}
// // //               >
// // //                 <Text style={styles.closeBtnText}>Close</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   header: {
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //   },
// // //   logoContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   cartoonTitleRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flexWrap: 'wrap',
// // //   },
// // //   cartoonLetter: {
// // //     fontSize: 34,
// // //     fontWeight: '900',
// // //     color: '#FBC10B',
// // //     textTransform: 'uppercase',
// // //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// // //     textShadowOffset: { width: 3, height: 3 },
// // //     textShadowRadius: 8,
// // //     includeFontPadding: false,
// // //     marginHorizontal: 2, // Increased from -2 to 2 for spacing between letters
// // //     // For Android
// // //     ...Platform.select({
// // //       android: {
// // //         elevation: 5,
// // //         textShadowColor: '#FFB300',
// // //         textShadowOffset: { width: 2, height: 2 },
// // //         textShadowRadius: 6,
// // //       },
// // //     }),
// // //   },
// // //   specialCartoonLetter: {
// // //     fontSize: 40,
// // //     color: '#FFD700',
// // //     textShadowColor: '#FF8C00',
// // //     textShadowOffset: { width: 4, height: 4 },
// // //     textShadowRadius: 10,
// // //     marginHorizontal: 2, // Increased from -3 to 2 for spacing
// // //   },
// // //   spaceLetter: {
// // //     width: 20, // Increased from 8 to 20 for more space between words
// // //     marginHorizontal: 0,
// // //   },
// // //   notification: {
// // //     position: "relative",
// // //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// // //     padding: 10,
// // //     borderRadius: 24,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //     marginLeft: 8,
// // //   },
// // //   badge: {
// // //     position: "absolute",
// // //     top: -4,
// // //     right: -4,
// // //     backgroundColor: "red",
// // //     width: 20,
// // //     height: 20,
// // //     borderRadius: 10,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: COLORS.surface,
// // //   },
// // //   badgeText: {
// // //     color: COLORS.surface,
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //   },
// // //   searchWrapper: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     backgroundColor: COLORS.primary,
// // //   },
// // //   searchBox: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 14,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 10,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     marginHorizontal: 10,
// // //     fontSize: 15,
// // //     color: COLORS.textDark,
// // //     padding: 0,
// // //   },
// // //   sliderSection: {
// // //     marginTop: 16,
// // //     marginBottom: 8,
// // //     paddingHorizontal: 16,
// // //   },
// // //   sliderWrapper: {
// // //     height: 150,
// // //     position: 'relative',
// // //     borderRadius: 16,
// // //     overflow: 'hidden',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   sliderLoadingContainer: {
// // //     height: 150,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginTop: 16,
// // //     marginBottom: 8,
// // //     marginHorizontal: 16,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //   },
// // //   slideContainer: {
// // //     width: width - 32,
// // //     height: 150,
// // //   },
// // //   sliderImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 16,
// // //   },
// // //   paginationContainer: {
// // //     flexDirection: 'row',
// // //     position: 'absolute',
// // //     bottom: 10,
// // //     alignSelf: 'center',
// // //   },
// // //   paginationDot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     marginHorizontal: 4,
// // //   },
// // //   paginationDotActive: {
// // //     backgroundColor: COLORS.surface,
// // //     width: 20,
// // //   },
// // //   paginationDotInactive: {
// // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // //   },
// // //   loadingText: {
// // //     marginTop: 10,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //   },
// // //   patternsSection: {
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   sectionTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },
// // //   seeAll: {
// // //     fontSize: 14,
// // //     color: COLORS.primary,
// // //     fontWeight: '600',
// // //   },
// // //   seeAllButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     backgroundColor: COLORS.primary + '20',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //   },
// // //   seeAllText: {
// // //     fontSize: 13,
// // //     color: COLORS.primary,
// // //     fontWeight: '600',
// // //   },
// // //  patternsList: {
// // //   paddingHorizontal: 4,
// // //   paddingVertical: 8, // Add vertical padding to prevent cutting off
// // //   gap: 12,
// // // },
// // //   patternCardContainer: {
// // //   position: 'relative',
// // //   marginRight: 12,
// // //   marginTop: 8, // Add top margin to give space for glow effect
// // //   paddingTop: 4, // Add padding top for extra space
// // // },
// // //   compactPatternCard: {
// // //     alignItems: 'center',
// // //     width: 60,
// // //     position: 'relative',
// // //   },
// // //   glowEffect: {
// // //   position: 'absolute',
// // //   width: 52, // Slightly larger than icon
// // //   height: 52, // Slightly larger than icon
// // //   borderRadius: 26,
// // //   top: -2, // Adjusted position to center behind icon
// // //   left: 4, // Adjusted for better centering
// // //   zIndex: 0,
// // // },
// // //  compactIconWrapper: {
// // //   width: 48,
// // //   height: 48,
// // //   borderRadius: 24,
// // //   justifyContent: 'center',
// // //   alignItems: 'center',
// // //   marginBottom: 6,
// // //   zIndex: 1,
// // //   // Enhanced shadow for glow effect
// // //   shadowColor: '#FFD700',
// // //   shadowOpacity: 0.9,
// // //   shadowRadius: 12,
// // //   elevation: 8, // Increased elevation for Android
// // // },
// // //   compactPatternName: {
// // //     fontSize: 11,
// // //     fontWeight: '500',
// // //     color: COLORS.textDark,
// // //     textAlign: 'center',
// // //     zIndex: 1,
// // //   },
// // //   // Games Section
// // //   section: {
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //   },
// // //   gamesLoadingContainer: {
// // //     padding: 30,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 12,
// // //   },
// // //   noGamesContainer: {
// // //     backgroundColor: COLORS.surface,
// // //     padding: 30,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   noGamesText: {
// // //     marginTop: 12,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //     textAlign: 'center',
// // //   },
// // //   refreshGamesBtn: {
// // //     marginTop: 16,
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //   },
// // //   refreshGamesText: {
// // //     color: COLORS.surface,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // //   gamesContainer: {
// // //     gap: 12,
// // //   },
// // //   gameCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //     marginBottom: 12,
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
// // //     backgroundColor: COLORS.scheduled,
// // //   },
// // //   completedBadge: {
// // //     backgroundColor: COLORS.completed,
// // //   },
// // //   defaultBadge: {
// // //     backgroundColor: COLORS.scheduled,
// // //   },
// // //   statusText: {
// // //     color: COLORS.surface,
// // //     fontSize: 10,
// // //     fontWeight: '700',
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
// // //     backgroundColor: COLORS.background,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 2,
// // //     borderColor: COLORS.primary,
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
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   gameId: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
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
// // //     borderColor: COLORS.accent,
// // //   },
// // //   freeBadge: {
// // //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// // //     borderColor: "#4CAF50",
// // //   },
// // //   gameTypeText: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //     color: COLORS.textDark,
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
// // //     backgroundColor: COLORS.background,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   detailLabel: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //   },
// // //   detailText: {
// // //     fontSize: 12,
// // //     color: COLORS.textDark,
// // //     fontWeight: "600",
// // //   },
// // //   prizeContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: COLORS.background,
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 16,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
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
// // //     borderColor: COLORS.primary,
// // //   },
// // //   prizeInfo: {
// // //     flex: 1,
// // //   },
// // //   prizeLabel: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //   },
// // //   prizeText: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: COLORS.textDark,
// // //   },
// // //   prizeSubtext: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //     marginTop: 2,
// // //   },
// // //   joinButton: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 6,
// // //     backgroundColor: COLORS.primary,
// // //     shadowColor: "#FFD700",
// // //     shadowOffset: { width: 0, height: 0 },
// // //     shadowOpacity: 0.9,
// // //     shadowRadius: 12,
// // //     elevation: 8,
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
// // //   completedJoinButton: {
// // //     backgroundColor: COLORS.completed,
// // //   },
// // //   joinButtonText: {
// // //     color: COLORS.surface,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   winnersContainer: {
// // //     gap: 8,
// // //   },
// // //   winnerCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 10,
// // //     padding: 12,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 1,
// // //     elevation: 1,
// // //   },
// // //   winnerInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //   },
// // //   winnerAvatar: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: COLORS.primary,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   winnerInitial: {
// // //     color: COLORS.surface,
// // //     fontSize: 14,
// // //     fontWeight: '700',
// // //   },
// // //   winnerName: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   winnerPrize: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginTop: 2,
// // //   },
// // //   winnerTime: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   infoCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   infoList: {
// // //     gap: 12,
// // //   },
// // //   infoItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //   },
// // //   infoText: {
// // //     fontSize: 14,
// // //     color: COLORS.textDark,
// // //     fontWeight: '500',
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // //   loadingMoreContainer: {
// // //     paddingVertical: 20,
// // //     alignItems: 'center',
// // //   },
// // //   // Popup Styles
// // //   popupOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   popupContainer: {
// // //     width: width * 0.8,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 28,
// // //     padding: 24,
// // //     alignItems: 'center',
// // //   },
// // //   popupIcon: {
// // //     width: 56,
// // //     height: 56,
// // //     borderRadius: 28,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   popupTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 8,
// // //   },
// // //   popupGameName: {
// // //     fontSize: 16,
// // //     color: COLORS.textLight,
// // //     marginBottom: 16,
// // //     textAlign: 'center',
// // //   },
// // //   popupTimer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //     marginBottom: 20,
// // //   },
// // //   popupTimerText: {
// // //     fontSize: 14,
// // //     color: COLORS.textDark,
// // //     fontWeight: '500',
// // //   },
// // //   popupPrize: {
// // //     alignItems: 'center',
// // //     marginBottom: 24,
// // //   },
// // //   popupPrizeLabel: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginBottom: 4,
// // //   },
// // //   popupPrizeValue: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: COLORS.primary,
// // //   },
// // //   popupPrizeSubtext: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     marginTop: 4,
// // //   },
// // //   popupActions: {
// // //     width: '100%',
// // //     gap: 12,
// // //   },
// // //   popupPrimaryButton: {
// // //     paddingVertical: 14,
// // //     borderRadius: 20,
// // //     alignItems: 'center',
// // //   },
// // //   popupPrimaryButtonText: {
// // //     color: COLORS.surface,
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //   },
// // //   popupSecondaryButton: {
// // //     paddingVertical: 10,
// // //     alignItems: 'center',
// // //   },
// // //   popupSecondaryButtonText: {
// // //     fontSize: 14,
// // //     color: COLORS.textLight,
// // //   },
// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContent: {
// // //     width: '90%',
// // //     maxHeight: '80%',
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //   },
// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     paddingBottom: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },
// // //   notificationItem: {
// // //     flexDirection: 'row',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //   },
// // //   notificationIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: '#F0F8FF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   notificationContent: {
// // //     flex: 1,
// // //   },
// // //   notificationTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   notificationMessage: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginBottom: 4,
// // //   },
// // //   notificationDate: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //   },
// // //   emptyNotifications: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 40,
// // //   },
// // //   emptyText: {
// // //     marginTop: 12,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //   },
// // //   loadingIndicator: {
// // //     marginVertical: 20,
// // //   },
// // //   closeBtn: {
// // //     marginTop: 16,
// // //     backgroundColor: COLORS.primary,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //   },
// // //   closeBtnText: {
// // //     color: COLORS.surface,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // // });

// // // export default Home;






// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   Image,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   Modal,
// // //   ActivityIndicator,
// // //   RefreshControl,
// // //   Dimensions,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   TextInput,
// // //   Animated,
// // //   Easing,
// // //   Platform,
// // // } from "react-native";
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import axios from "axios";
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { useNavigation } from '@react-navigation/native';

// // // const { width } = Dimensions.get('window');

// // // // Enhanced color scheme with gradients
// // // const COLORS = {
// // //   primary: "#4facfe", // Main blue color
// // //   primaryLight: "#9fcdff",
// // //   primaryGradient: ['#359df9', '#64d8f8'],
// // //   secondary: "#FDB800", // Orange accent
// // //   secondaryGradient: ['#FDB800', '#FF8C00'],
// // //   background: "#f5f8ff", // Light background
// // //   surface: "#FFFFFF",
// // //   textDark: "#333333",
// // //   textLight: "#777777",
// // //   border: "#EEEEEE",
  
// // //   // Status colors with gradients
// // //   live: "#4CAF50",
// // //   liveGradient: ['#4CAF50', '#45a049'],
// // //   scheduled: "#ff9800",
// // //   scheduledGradient: ['#ff9800', '#f57c00'],
// // //   completed: "#ff9800",
// // //   completedGradient: ['#ff9800', '#f57c00'],
  
// // //   // Quick action colors
// // //   deposit: "#4facfe",
// // //   withdraw: "#FF6B6B",
// // //   refer: "#4ECDC4",
// // //   support: "#9B59B6",
  
// // //   // Pattern card colors - enhanced gradients
// // //   patternGradients: [
// // //     ['#0282E9', '#0056b3'], // Blue
// // //     ['#F59E0B', '#d97706'], // Orange
// // //     ['#10B981', '#059669'], // Green
// // //     ['#EF4444', '#dc2626'], // Red
// // //     ['#8B5CF6', '#6d28d9'], // Purple
// // //     ['#EC4899', '#db2777'], // Pink
// // //     ['#06B6D4', '#0891b2'], // Cyan
// // //     ['#F97316', '#ea580c'], // Orange
// // //   ],
  
// // //   // Additional gradients
// // //   prizeGradient: ['#4facfe20', '#00c6fb20'],
// // //   winnerGradient: ['#4facfe10', '#9fcdff10'],
// // //   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
// // //   darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
// // // };

// // // const Home = () => {
// // //   const navigation = useNavigation();
// // //   const [notifications, setNotifications] = useState([]);
// // //   const [sliders, setSliders] = useState([]);
// // //   const [games, setGames] = useState([]);
// // //   const [filteredGames, setFilteredGames] = useState([]);
// // //   const [patterns, setPatterns] = useState([]);
// // //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// // //   const [activeSlide, setActiveSlide] = useState(0);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// // //   const [loadingSliders, setLoadingSliders] = useState(true);
// // //   const [loadingGames, setLoadingGames] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState('');
  
// // //   // Popup state
// // //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// // //   const [upcomingGame, setUpcomingGame] = useState(null);
// // //   const [popupShown, setPopupShown] = useState(false);
  
// // //   // Animation for popup
// // //   const slideAnim = useRef(new Animated.Value(300)).current;
// // //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// // //   // Animation values for buttons and patterns
// // //   const buttonScaleAnims = useRef([]);
// // //   const patternScaleAnims = useRef([]);
// // //   const glowAnims = useRef([]);
// // //   const letterAnims = useRef([]);
  
// // //   // Pagination state for games
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [lastPage, setLastPage] = useState(1);
// // //   const [loadingMore, setLoadingMore] = useState(false);
  
// // //   const sliderRef = useRef(null);
// // //   const scrollInterval = useRef(null);

// // //   // Filter options
// // //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// // //   const [activeFilter, setActiveFilter] = useState('All Games');

// // //   // Initialize animations
// // //   useEffect(() => {
// // //     buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
// // //     buttonScaleAnims.current.forEach((anim, index) => {
// // //       startPulseAnimation(anim);
// // //     });
// // //   }, [games.length]);

// // // // Initialize letter animations for header
// // // useEffect(() => {
// // //   // Create new animations array
// // //   const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
// // //   letterAnims.current = newLetterAnims;
  
// // //   // Stop any existing animations
// // //   letterAnims.current.forEach(anim => {
// // //     anim.stopAnimation();
// // //     anim.setValue(1);
// // //   });
  
// // //   let currentIndex = 0;
// // //   let isAnimating = true;
  
// // //   const animateNextLetter = () => {
// // //     if (!isAnimating) return;
    
// // //     // Reset all letters to normal size
// // //     letterAnims.current.forEach(anim => {
// // //       anim.setValue(1);
// // //     });
    
// // //     // Animate current letter
// // //     Animated.sequence([
// // //       Animated.timing(letterAnims.current[currentIndex], {
// // //         toValue: 1.5,
// // //         duration: 200,
// // //         useNativeDriver: true,
// // //         easing: Easing.bounce,
// // //       }),
// // //       Animated.timing(letterAnims.current[currentIndex], {
// // //         toValue: 1,
// // //         duration: 150,
// // //         useNativeDriver: true,
// // //         easing: Easing.bounce,
// // //       }),
// // //       Animated.delay(200), // Pause before next letter
// // //     ]).start(({ finished }) => {
// // //       if (finished && isAnimating) {
// // //         // Move to next letter
// // //         currentIndex = (currentIndex + 1) % letterAnims.current.length;
// // //         animateNextLetter();
// // //       }
// // //     });
// // //   };
  
// // //   // Start the animation
// // //   animateNextLetter();
  
// // //   // Cleanup function
// // //   return () => {
// // //     isAnimating = false;
// // //     if (letterAnims.current) {
// // //       letterAnims.current.forEach(anim => {
// // //         anim.stopAnimation();
// // //       });
// // //     }
// // //   };
// // // }, []);

// // //   // Initialize pattern animations when patterns load
// // //   useEffect(() => {
// // //     if (patterns.length > 0) {
// // //       patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
// // //       glowAnims.current = patterns.map(() => new Animated.Value(0));
      
// // //       patternScaleAnims.current.forEach((anim, index) => {
// // //         startPulseAnimation(anim, 1000 + (index * 200));
// // //       });
      
// // //       glowAnims.current.forEach((anim, index) => {
// // //         startGlowAnimation(anim, 1500 + (index * 300));
// // //       });
// // //     }
// // //   }, [patterns.length]);

// // //   // Pulse animation function
// // //   const startPulseAnimation = (anim, duration = 800) => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(anim, {
// // //           toValue: 1.08,
// // //           duration: duration,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         }),
// // //         Animated.timing(anim, {
// // //           toValue: 1,
// // //           duration: duration,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         })
// // //       ])
// // //     ).start();
// // //   };

// // //   // Glow animation function
// // //   const startGlowAnimation = (anim, duration = 1500) => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(anim, {
// // //           toValue: 1,
// // //           duration: duration / 2,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         }),
// // //         Animated.timing(anim, {
// // //           toValue: 0,
// // //           duration: duration / 2,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         })
// // //       ])
// // //     ).start();
// // //   };

// // //   // Function to calculate prize pool from pattern rewards
// // //   const calculatePrizePool = (game) => {
// // //     if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
// // //       return null;
// // //     }
    
// // //     const total = game.pattern_rewards.reduce((sum, reward) => {
// // //       const amount = parseFloat(reward.amount) || 0;
// // //       const count = parseInt(reward.reward_count) || 1;
// // //       return sum + (amount * count);
// // //     }, 0);
    
// // //     return total;
// // //   };

// // //   useEffect(() => {
// // //     fetchInitialData();
    
// // //     return () => {
// // //       if (scrollInterval.current) {
// // //         clearInterval(scrollInterval.current);
// // //       }
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (games.length > 0 && !popupShown) {
// // //       setTimeout(() => {
// // //         checkUpcomingGame();
// // //       }, 1500);
// // //     }
// // //   }, [games, popupShown]);

// // //   useEffect(() => {
// // //     if (sliders.length > 1) {
// // //       startAutoScroll();
// // //     }
// // //     return () => {
// // //       if (scrollInterval.current) {
// // //         clearInterval(scrollInterval.current);
// // //       }
// // //     };
// // //   }, [sliders.length]);

// // //   // Filter games based on search and active filter
// // //   useEffect(() => {
// // //     let filtered = games;
    
// // //     if (searchQuery.trim() !== '') {
// // //       filtered = filtered.filter(game =>
// // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // //       );
// // //     }
    
// // //     if (activeFilter === 'Live Now') {
// // //       filtered = filtered.filter(game => game.status === 'live');
// // //     } else if (activeFilter === 'Upcoming') {
// // //       filtered = filtered.filter(game => game.status === 'scheduled');
// // //     } else if (activeFilter === 'Completed') {
// // //       filtered = filtered.filter(game => game.status === 'completed');
// // //     }
    
// // //     setFilteredGames(filtered);
// // //   }, [searchQuery, games, activeFilter]);

// // //   useEffect(() => {
// // //     if (upcomingGamePopup) {
// // //       Animated.parallel([
// // //         Animated.timing(opacityAnim, {
// // //           toValue: 1,
// // //           duration: 300,
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(slideAnim, {
// // //           toValue: 0,
// // //           duration: 400,
// // //           easing: Easing.out(Easing.back(1.2)),
// // //           useNativeDriver: true,
// // //         }),
// // //       ]).start();
// // //     } else {
// // //       opacityAnim.setValue(0);
// // //       slideAnim.setValue(300);
// // //     }
// // //   }, [upcomingGamePopup]);

// // //   const startAutoScroll = () => {
// // //     if (scrollInterval.current) {
// // //       clearInterval(scrollInterval.current);
// // //     }
    
// // //     scrollInterval.current = setInterval(() => {
// // //       if (sliders.length > 0) {
// // //         let nextIndex = activeSlide + 1;
// // //         if (nextIndex >= sliders.length) {
// // //           nextIndex = 0;
// // //         }
        
// // //         setActiveSlide(nextIndex);
// // //         if (sliderRef.current) {
// // //           const slideWidth = width - 32;
// // //           sliderRef.current.scrollToOffset({
// // //             offset: nextIndex * slideWidth,
// // //             animated: true
// // //           });
// // //         }
// // //       }
// // //     }, 3000);
// // //   };

// // //   const fetchInitialData = async () => {
// // //     try {
// // //       await Promise.all([
// // //         fetchNotifications(),
// // //         fetchSliders(),
// // //         fetchGames(1),
// // //         fetchPatterns()
// // //       ]);
// // //     } catch (error) {
// // //       console.log("Error fetching initial data:", error);
// // //     }
// // //   };

// // //   const onRefresh = React.useCallback(() => {
// // //     setRefreshing(true);
// // //     setCurrentPage(1);
// // //     setGames([]);
// // //     setFilteredGames([]);
// // //     setPopupShown(false);
// // //     Promise.all([
// // //       fetchNotifications(),
// // //       fetchSliders(),
// // //       fetchGames(1),
// // //       fetchPatterns()
// // //     ]).finally(() => setRefreshing(false));
// // //   }, []);

// // //   const checkUpcomingGame = () => {
// // //     try {
// // //       const now = new Date();
      
// // //       const scheduledGames = games.filter(game => 
// // //         game.status === 'scheduled'
// // //       );
      
// // //       if (scheduledGames.length === 0) return;
      
// // //       const gamesWithEndDateTime = scheduledGames.map(game => {
// // //         let endDateTime;
        
// // //         try {
// // //           if (game.ticket_request_end_date) {
// // //             endDateTime = new Date(game.ticket_request_end_date);
// // //           } else {
// // //             endDateTime = new Date(game.game_date);
// // //           }
// // //         } catch (e) {
// // //           endDateTime = new Date();
// // //         }
        
// // //         return {
// // //           ...game,
// // //           endDateTime
// // //         };
// // //       });
      
// // //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// // //       const earliestEndGame = sortedGames[0];
      
// // //       const timeDiff = earliestEndGame.endDateTime - now;
      
// // //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
// // //         setUpcomingGame(earliestEndGame);
// // //         setUpcomingGamePopup(true);
// // //         setPopupShown(true);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error checking upcoming game:", error);
// // //     }
// // //   };

// // //   const getTimeRemaining = (endDateTime) => {
// // //     const now = new Date();
// // //     const diff = endDateTime - now;
    
// // //     if (diff <= 0) return "Ending soon";
    
// // //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// // //     if (days > 0) {
// // //       return `${days}d ${hours}h left`;
// // //     } else if (hours > 0) {
// // //       return `${hours}h ${minutes}m left`;
// // //     } else {
// // //       return `${minutes}m left`;
// // //     }
// // //   };

// // //   const fetchNotifications = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/notifications",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.status) {
// // //         setNotifications(res.data.data);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching notifications:", error);
// // //     } finally {
// // //       setLoadingNotifications(false);
// // //     }
// // //   };

// // //   const fetchSliders = async () => {
// // //     try {
// // //       setLoadingSliders(true);
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/sliders"
// // //       );
// // //       if (res.data.success) {
// // //         setSliders(res.data.data || []);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching sliders:", error);
// // //       setSliders([]);
// // //     } finally {
// // //       setLoadingSliders(false);
// // //     }
// // //   };

// // //   const fetchGames = async (page = 1) => {
// // //     try {
// // //       if (page === 1) {
// // //         setLoadingGames(true);
// // //       }
      
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
      
// // //       const res = await axios.get(
// // //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
      
// // //       if (res.data.success) {
// // //         const newGames = res.data.games.data || [];
// // //         const pagination = res.data.games;
        
// // //         if (page === 1) {
// // //           setGames(newGames);
// // //           setFilteredGames(newGames);
// // //         } else {
// // //           setGames(prev => [...prev, ...newGames]);
// // //           setFilteredGames(prev => [...prev, ...newGames]);
// // //         }
        
// // //         setCurrentPage(pagination.current_page);
// // //         setLastPage(pagination.last_page);
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching games:", error);
// // //     } finally {
// // //       if (page === 1) {
// // //         setLoadingGames(false);
// // //       }
// // //       setLoadingMore(false);
// // //     }
// // //   };

// // //   const fetchPatterns = async () => {
// // //     try {
// // //       setLoadingPatterns(true);
// // //       const token = await AsyncStorage.getItem("token");
      
// // //       if (!token) {
// // //         setLoadingPatterns(false);
// // //         return;
// // //       }

// // //       const response = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/patterns/available",
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             Accept: 'application/json',
// // //           },
// // //         }
// // //       );

// // //       if (response.data && response.data.status) {
// // //         const patternsData = response.data.data?.patterns || [];
        
// // //         const patternSequence = [
// // //           'top line',
// // //           'middle line', 
// // //           'bottom line',
// // //           'breakfast',
// // //           'lunch',
// // //           'dinner',
// // //           'four corners',
// // //           'bamboo',
// // //           'early five',
// // //           'non claimers',
// // //           'full house'
// // //         ];
        
// // //         const sortedPatterns = patternsData.sort((a, b) => {
// // //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// // //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// // //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// // //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// // //           if (aIndex === -1) return 1;
// // //           if (bIndex === -1) return -1;
          
// // //           return aIndex - bIndex;
// // //         });
        
// // //         setPatterns(sortedPatterns.slice(0, 8));
// // //       }
// // //     } catch (error) {
// // //       console.log('Error fetching patterns in Home:', error);
// // //     } finally {
// // //       setLoadingPatterns(false);
// // //     }
// // //   };

// // //   const loadMoreGames = () => {
// // //     if (!loadingMore && currentPage < lastPage) {
// // //       setLoadingMore(true);
// // //       fetchGames(currentPage + 1);
// // //     }
// // //   };

// // //   const handleGamePress = (game) => {
// // //     navigation.navigate("GameDetails", { game });
// // //   };

// // //   const handleAllGamesPress = () => {
// // //     navigation.navigate("Game");
// // //   };

// // //   const handleAllPatternsPress = () => {
// // //     navigation.navigate("UserGamePatterns");
// // //   };

// // //   const handleViewAllWinners = () => {
// // //     navigation.navigate("Game");
// // //   };

// // //   const handlePatternPress = (pattern) => {
// // //     navigation.navigate("UserGamePatterns", { 
// // //       selectedPatternId: pattern.id,
// // //       selectedPattern: pattern 
// // //     });
// // //   };

// // //   const handlePopupJoinNow = () => {
// // //     setUpcomingGamePopup(false);
// // //     if (upcomingGame) {
// // //       navigation.navigate("GameDetails", { game: upcomingGame });
// // //     }
// // //   };

// // //   const handlePopupLater = () => {
// // //     setUpcomingGamePopup(false);
// // //   };

// // //   const getPatternIcon = (pattern) => {
// // //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// // //     const iconMap = {
// // //       'bamboo': 'leaf',
// // //       'bottom line': 'arrow-down',
// // //       'breakfast': 'cafe',
// // //       'dinner': 'restaurant',
// // //       'early five': '5',
// // //       'four corners': 'apps',
// // //       'full house': 'home',
// // //       'lunch': 'fast-food',
// // //       'middle line': 'remove',
// // //       'non claimer': 'close',
// // //       'top line': 'arrow-up'
// // //     };
    
// // //     for (const [key, icon] of Object.entries(iconMap)) {
// // //       if (patternName.includes(key)) return icon;
// // //     }
    
// // //     return 'grid-outline';
// // //   };

// // //   const formatPatternName = (name) => {
// // //     if (!name) return 'Unknown Pattern';
// // //     return name
// // //       .split('_')
// // //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// // //       .join(' ');
// // //   };

// // // const Header = () => {
// // //   const letters = [
// // //     { char: 'H', index: 0 },
// // //     { char: 'O', index: 1, isSpecial: true },
// // //     { char: 'U', index: 2 },
// // //     { char: 'Z', index: 3 },
// // //     { char: 'I', index: 4 },
// // //     { char: 'E', index: 5 },
// // //     { char: ' ', index: 6, isSpace: true, width: 20 },
// // //     { char: 'T', index: 7 },
// // //     { char: 'I', index: 8 },
// // //     { char: 'M', index: 9 },
// // //     { char: 'E', index: 10 },
// // //     { char: 'Z', index: 11, isSpecial: true },
// // //   ];

// // //   return (
// // //     <LinearGradient
// // //       colors={COLORS.primaryGradient}
// // //       start={{ x: 0, y: 0 }}
// // //       end={{ x: 1, y: 0 }}
// // //       style={styles.header}
// // //     >
// // //       <View style={styles.logoContainer}>
// // //         <View style={styles.cartoonTitleRow}>
// // //           {letters.map((item) => {
// // //             const animValue = letterAnims.current && letterAnims.current[item.index] 
// // //               ? letterAnims.current[item.index] 
// // //               : new Animated.Value(1);
            
// // //             return (
// // //               <Animated.Text
// // //                 key={`letter-${item.index}`}
// // //                 style={[
// // //                   styles.cartoonLetter,
// // //                   item.isSpecial && styles.specialCartoonLetter,
// // //                   item.isSpace && { width: item.width || 20 },
// // //                   { 
// // //                     transform: [{ scale: animValue }],
// // //                     marginHorizontal: item.isSpace ? 0 : 2,
// // //                   }
// // //                 ]}
// // //               >
// // //                 {item.char}
// // //               </Animated.Text>
// // //             );
// // //           })}
// // //         </View>
// // //       </View>

// // //       <TouchableOpacity 
// // //         style={styles.notification}
// // //         onPress={() => setModalVisible(true)}
// // //       >
// // //         <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// // //         {notifications.length > 0 && (
// // //           <View style={styles.badge}>
// // //             <Text style={styles.badgeText}>{notifications.length}</Text>
// // //           </View>
// // //         )}
// // //       </TouchableOpacity>
// // //     </LinearGradient>
// // //   );
// // // };

// // //   // Animated pattern card with gradient and glow
// // //   const renderPatternCard = (pattern, index) => {
// // //     const icon = getPatternIcon(pattern);
// // //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// // //     const patterns = [
// // //       'Top Line',
// // //       'Middle',
// // //       'Bottom',
// // //       'Breakfast',
// // //       'Lunch',
// // //       'Dinner',
// // //       'Corners',
// // //       'Bamboo',
// // //     ];
    
// // //     const patternName = patterns[index % patterns.length];
// // //     const gradientColors = COLORS.patternGradients[index % COLORS.patternGradients.length];
    
// // //     const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
// // //     const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
// // //     const glowOpacity = glowAnim.interpolate({
// // //       inputRange: [0, 1],
// // //       outputRange: [0, 0.7]
// // //     });
    
// // //     return (
// // //       <Animated.View
// // //         key={pattern.id}
// // //         style={[
// // //           styles.patternCardContainer,
// // //           {
// // //             transform: [{ scale: scaleAnim }]
// // //           }
// // //         ]}
// // //       >
// // //         <TouchableOpacity 
// // //           style={styles.compactPatternCard}
// // //           onPress={() => handlePatternPress(pattern)}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Animated.View style={[
// // //             styles.glowEffect,
// // //             {
// // //               backgroundColor: gradientColors[0],
// // //               opacity: glowOpacity,
// // //               transform: [{ scale: 1.2 }]
// // //             }
// // //           ]} />
// // //           <LinearGradient
// // //             colors={gradientColors}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 1 }}
// // //             style={styles.compactIconWrapper}
// // //           >
// // //             <Ionicons name={icon} size={18} color="#FFFFFF" />
// // //           </LinearGradient>
// // //           <Text style={styles.compactPatternName} numberOfLines={1}>
// // //             {patternName}
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   const renderSliderItem = ({ item }) => (
// // //     <View style={styles.slideContainer}>
// // //       <Image
// // //         source={{ 
// // //           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
// // //         }}
// // //         style={styles.sliderImage}
// // //         resizeMode="cover"
// // //       />
// // //     </View>
// // //   );

// // //   const handleScroll = (event) => {
// // //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// // //     const contentOffset = event.nativeEvent.contentOffset.x;
// // //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// // //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// // //       setActiveSlide(currentIndex);
// // //     }
// // //   };

// // //   const renderPagination = () => {
// // //     if (sliders.length <= 1) return null;
    
// // //     return (
// // //       <View style={styles.paginationContainer}>
// // //         {sliders.map((_, index) => (
// // //           <View
// // //             key={index}
// // //             style={[
// // //               styles.paginationDot,
// // //               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
// // //             ]}
// // //           />
// // //         ))}
// // //       </View>
// // //     );
// // //   };

// // //   const renderGameCard = ({ item: game, index }) => {
// // //     if (!game) return null;
    
// // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // //     const isPaid = game.ticket_type === "paid";
// // //     const isLive = game.status === 'live';
// // //     const isScheduled = game.status === 'scheduled';
// // //     const isCompleted = game.status === 'completed';
    
// // //     const prizePool = calculatePrizePool(game);
    
// // //     if (!buttonScaleAnims.current[index]) {
// // //       buttonScaleAnims.current[index] = new Animated.Value(1);
// // //       startPulseAnimation(buttonScaleAnims.current[index]);
// // //     }
    
// // //     const buttonScale = buttonScaleAnims.current[index];
    
// // //     return (
// // //       <TouchableOpacity
// // //         style={styles.gameCard}
// // //         activeOpacity={0.9}
// // //         onPress={() => handleGamePress(game)}
// // //       >
// // //         {/* Background Pattern with Gradient */}
// // //         <LinearGradient
// // //           colors={COLORS.prizeGradient}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.gameCardPattern}
// // //         />
        
// // //         {/* Status badge with gradient */}
// // //         <LinearGradient
// // //           colors={isLive ? COLORS.liveGradient : 
// // //                   isCompleted ? COLORS.completedGradient : 
// // //                   COLORS.scheduledGradient}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 0 }}
// // //           style={[
// // //             styles.statusBadge,
// // //           ]}
// // //         >
// // //           <Ionicons 
// // //             name={
// // //               isLive ? 'radio-button-on' : 
// // //               isCompleted ? 'checkmark-circle' :
// // //               'time'
// // //             } 
// // //             size={10} 
// // //             color={COLORS.surface} 
// // //           />
// // //           <Text style={styles.statusText}>
// // //             {isLive ? 'LIVE' : 
// // //              isCompleted ? 'COMPLETED' : 
// // //              'SOON'}
// // //           </Text>
// // //         </LinearGradient>

// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.gameIconContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.gameIconWrapper}
// // //             >
// // //               <MaterialIcons name="confirmation-number" size={32} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <View style={styles.gameInfo}>
// // //               <Text style={styles.gameName} numberOfLines={1}>
// // //                 {game.game_name || "Tambola Game"}
// // //               </Text>
// // //               <Text style={styles.gameId}>
// // //                 ID: {game.game_code || "N/A"}
// // //               </Text>
// // //             </View>
// // //           </View>
          
// // //           <LinearGradient
// // //             colors={isPaid ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 0 }}
// // //             style={[
// // //               styles.gameTypeBadge,
// // //             ]}
// // //           >
// // //             {isPaid ? (
// // //               <>
// // //                 <MaterialIcons name="diamond" size={14} color={COLORS.surface} />
// // //                 <Text style={styles.gameTypeText}>
// // //                   ₹{ticketCost}
// // //                 </Text>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Ionicons name="checkmark-circle" size={14} color={COLORS.surface} />
// // //                 <Text style={styles.gameTypeText}>
// // //                   FREE
// // //                 </Text>
// // //               </>
// // //             )}
// // //           </LinearGradient>
// // //         </View>

// // //         <View style={styles.gameDetails}>
// // //           <View style={styles.detailRow}>
// // //             <View style={styles.detailItem}>
// // //               <LinearGradient
// // //                 colors={COLORS.prizeGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.detailIcon}
// // //               >
// // //                 <Ionicons name="calendar" size={14} color={COLORS.primary} />
// // //               </LinearGradient>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Date</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.game_date_formatted || game.game_date || "Date TBA"}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             <View style={styles.detailItem}>
// // //               <LinearGradient
// // //                 colors={COLORS.prizeGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.detailIcon}
// // //               >
// // //                 <Ionicons name="time" size={14} color={COLORS.primary} />
// // //               </LinearGradient>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Time</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
          
// // //           <View style={styles.detailRow}>
// // //             <View style={styles.detailItem}>
// // //               <LinearGradient
// // //                 colors={COLORS.prizeGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.detailIcon}
// // //               >
// // //                 <Ionicons name="person" size={14} color={COLORS.primary} />
// // //               </LinearGradient>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Host</Text>
// // //                 <Text style={styles.detailText}>
// // //                   {game.user ? game.user.name : 'Houzie Timez'}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             {game.available_tickets !== undefined && !isCompleted && (
// // //               <View style={styles.detailItem}>
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.detailIcon}
// // //                 >
// // //                   <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
// // //                 </LinearGradient>
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
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.detailIcon}
// // //                 >
// // //                   <Ionicons name="trophy" size={14} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View>
// // //                   <Text style={styles.detailLabel}>Status</Text>
// // //                   <Text style={styles.detailText}>Completed</Text>
// // //                 </View>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <LinearGradient
// // //           colors={COLORS.prizeGradient}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.prizeContainer}
// // //         >
// // //           <LinearGradient
// // //             colors={COLORS.primaryGradient}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 1 }}
// // //             style={styles.prizeIcon}
// // //           >
// // //             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.surface} />
// // //           </LinearGradient>
// // //           <View style={styles.prizeInfo}>
// // //             <Text style={styles.prizeLabel}>
// // //               {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
// // //             </Text>
// // //             <Text style={styles.prizeText}>
// // //               {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // //             </Text>
// // //             {game.pattern_rewards && game.pattern_rewards.length > 0 && (
// // //               <Text style={styles.prizeSubtext}>
// // //                 {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
// // //               </Text>
// // //             )}
// // //           </View>
// // //         </LinearGradient>

// // //         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
// // //           <TouchableOpacity 
// // //             style={[
// // //               styles.joinButton,
// // //               isCompleted && styles.completedJoinButton
// // //             ]}
// // //             onPress={() => handleGamePress(game)}
// // //             activeOpacity={0.9}
// // //           >
// // //             <LinearGradient
// // //               colors={isCompleted ? COLORS.completedGradient : COLORS.primaryGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 0 }}
// // //               style={styles.joinButtonGradient}
// // //             >
// // //               <LinearGradient
// // //                 colors={COLORS.glassGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.glassEffectOverlay}
// // //               />
// // //               <Text style={styles.joinButtonText}>
// // //                 {isCompleted 
// // //                   ? 'VIEW RESULTS' 
// // //                   : isLive
// // //                     ? 'JOIN GAME' 
// // //                     : 'VIEW DETAILS'}
// // //               </Text>
// // //               <Ionicons 
// // //                 name={isCompleted ? "trophy" : "arrow-forward"} 
// // //                 size={16} 
// // //                 color={COLORS.surface} 
// // //               />
// // //             </LinearGradient>
// // //           </TouchableOpacity>
// // //         </Animated.View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const clearSearch = () => {
// // //     setSearchQuery('');
// // //   };

// // //   const renderFooter = () => {
// // //     if (!loadingMore) return null;
// // //     return (
// // //       <View style={styles.loadingMoreContainer}>
// // //         <ActivityIndicator size="small" color={COLORS.primary} />
// // //       </View>
// // //     );
// // //   };

// // //   const UpcomingGamePopup = () => {
// // //     if (!upcomingGame) return null;
    
// // //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// // //     const isPaid = upcomingGame.ticket_type === "paid";
// // //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// // //     const timeRemaining = getTimeRemaining(endDateTime);
    
// // //     const prizePool = calculatePrizePool(upcomingGame);
    
// // //     return (
// // //       <Modal
// // //         visible={upcomingGamePopup}
// // //         transparent={true}
// // //         animationType="fade"
// // //         onRequestClose={handlePopupLater}
// // //       >
// // //         <View style={styles.popupOverlay}>
// // //           <Animated.View 
// // //             style={[
// // //               styles.popupContainer,
// // //               {
// // //                 opacity: opacityAnim,
// // //                 transform: [{ translateY: slideAnim }]
// // //               }
// // //             ]}
// // //           >
// // //             <LinearGradient
// // //               colors={COLORS.primaryGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.popupIcon}
// // //             >
// // //               <Ionicons name="timer-outline" size={32} color={COLORS.surface} />
// // //             </LinearGradient>
            
// // //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// // //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// // //             <LinearGradient
// // //               colors={COLORS.winnerGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.popupTimer}
// // //             >
// // //               <Ionicons name="time-outline" size={16} color={COLORS.primary} />
// // //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// // //             </LinearGradient>
            
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.popupPrize}
// // //             >
// // //               <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
// // //               <Text style={styles.popupPrizeValue}>
// // //                 {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// // //               </Text>
// // //               {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
// // //                 <Text style={styles.popupPrizeSubtext}>
// // //                   {upcomingGame.pattern_rewards.length} Patterns
// // //                 </Text>
// // //               )}
// // //             </LinearGradient>
            
// // //             <View style={styles.popupActions}>
// // //               <TouchableOpacity 
// // //                 onPress={handlePopupJoinNow}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.primaryGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 0 }}
// // //                   style={styles.popupPrimaryButton}
// // //                 >
// // //                   <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// // //                 </LinearGradient>
// // //               </TouchableOpacity>
              
// // //               <TouchableOpacity 
// // //                 style={styles.popupSecondaryButton}
// // //                 onPress={handlePopupLater}
// // //               >
// // //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </Animated.View>
// // //         </View>
// // //       </Modal>
// // //     );
// // //   };

// // //   if (loadingGames && games.length === 0) {
// // //     return (
// // //       <SafeAreaView style={styles.safeArea}>
// // //         <LinearGradient
// // //           colors={COLORS.primaryGradient}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.loadingContainer}
// // //         >
// // //           <ActivityIndicator size="large" color={COLORS.surface} />
// // //         </LinearGradient>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// // //       <View style={styles.container}>
// // //         {/* Header with gradient */}
// // //         <Header />

// // //         {/* Search Bar with gradient */}
// // //         <LinearGradient
// // //           colors={COLORS.primaryGradient}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 0 }}
// // //           style={styles.searchWrapper}
// // //         >
// // //           <View style={styles.searchBox}>
// // //             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
// // //             <TextInput
// // //               placeholder="Search games by name or ID..."
// // //               placeholderTextColor={COLORS.textLight}
// // //               style={styles.searchInput}
// // //               value={searchQuery}
// // //               onChangeText={setSearchQuery}
// // //               returnKeyType="search"
// // //             />
// // //             {searchQuery.length > 0 ? (
// // //               <TouchableOpacity onPress={clearSearch}>
// // //                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
// // //               </TouchableOpacity>
// // //             ) : (
// // //               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
// // //             )}
// // //           </View>
// // //         </LinearGradient>

// // //         <ScrollView
// // //           showsVerticalScrollIndicator={false}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={onRefresh}
// // //               tintColor={COLORS.primary}
// // //               colors={[COLORS.primary]}
// // //             />
// // //           }
// // //         >
// // //           {/* Slider Section */}
// // //           {loadingSliders ? (
// // //             <LinearGradient
// // //               colors={COLORS.winnerGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.sliderLoadingContainer}
// // //             >
// // //               <ActivityIndicator size="large" color={COLORS.primary} />
// // //               <Text style={styles.loadingText}>Loading offers...</Text>
// // //             </LinearGradient>
// // //           ) : sliders.length > 0 ? (
// // //             <View style={styles.sliderSection}>
// // //               <View style={styles.sliderWrapper}>
// // //                 <FlatList
// // //                   ref={sliderRef}
// // //                   data={sliders}
// // //                   renderItem={renderSliderItem}
// // //                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// // //                   horizontal
// // //                   pagingEnabled
// // //                   showsHorizontalScrollIndicator={false}
// // //                   onScroll={handleScroll}
// // //                   scrollEventThrottle={16}
// // //                 />
                
// // //                 {/* Pagination Dots */}
// // //                 {renderPagination()}
// // //               </View>
// // //             </View>
// // //           ) : null}

// // //           {/* Patterns Section - Now with gradient */}
// // //           {patterns.length > 0 && (
// // //             <View style={styles.patternsSection}>
// // //               <View style={styles.sectionHeader}>
// // //                 <View style={styles.sectionTitleContainer}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 1 }}
// // //                     style={styles.sectionIcon}
// // //                   >
// // //                     <Ionicons name="grid-outline" size={16} color={COLORS.surface} />
// // //                   </LinearGradient>
// // //                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
// // //                 </View>
// // //                 <TouchableOpacity onPress={handleAllPatternsPress}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={styles.seeAllButton}
// // //                   >
// // //                     <Text style={styles.seeAllText}>See All</Text>
// // //                     <Ionicons name="arrow-forward" size={14} color={COLORS.surface} />
// // //                   </LinearGradient>
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {loadingPatterns ? (
// // //                 <ActivityIndicator size="small" color={COLORS.primary} />
// // //               ) : (
// // //                 <ScrollView 
// // //                   horizontal 
// // //                   showsHorizontalScrollIndicator={false}
// // //                   contentContainerStyle={styles.patternsList}
// // //                 >
// // //                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// // //                 </ScrollView>
// // //               )}
// // //             </View>
// // //           )}

// // //           {/* Games Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <LinearGradient
// // //                   colors={COLORS.primaryGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.sectionIcon}
// // //                 >
// // //                   <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
// // //                 </LinearGradient>
// // //                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
// // //               </View>
// // //               <TouchableOpacity onPress={handleAllGamesPress}>
// // //                 <Text style={styles.seeAll}>See All</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             {loadingGames ? (
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.gamesLoadingContainer}
// // //               >
// // //                 <ActivityIndicator size="large" color={COLORS.primary} />
// // //                 <Text style={styles.loadingText}>Loading games...</Text>
// // //               </LinearGradient>
// // //             ) : filteredGames.length > 0 ? (
// // //               <View style={styles.gamesContainer}>
// // //                 {filteredGames.map((game, index) => (
// // //                   <View key={game.id || index}>
// // //                     {renderGameCard({ item: game, index })}
// // //                   </View>
// // //                 ))}
// // //                 {loadingMore && (
// // //                   <View style={styles.loadingMoreContainer}>
// // //                     <ActivityIndicator size="small" color={COLORS.primary} />
// // //                   </View>
// // //                 )}
// // //               </View>
// // //             ) : (
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.noGamesContainer}
// // //               >
// // //                 <Ionicons name="game-controller-outline" size={50} color={COLORS.primary} />
// // //                 <Text style={styles.noGamesText}>
// // //                   {searchQuery ? 'No games found' : 'No games available at the moment'}
// // //                 </Text>
// // //                 {searchQuery && (
// // //                   <TouchableOpacity 
// // //                     style={styles.refreshGamesBtn}
// // //                     onPress={clearSearch}
// // //                   >
// // //                     <LinearGradient
// // //                       colors={COLORS.primaryGradient}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 1 }}
// // //                       style={styles.refreshGamesGradient}
// // //                     >
// // //                       <Text style={styles.refreshGamesText}>Clear Search</Text>
// // //                     </LinearGradient>
// // //                   </TouchableOpacity>
// // //                 )}
// // //               </LinearGradient>
// // //             )}
// // //           </View>

// // //           {/* Recent Winners Section with gradient */}
// // //           {/* <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <LinearGradient
// // //                   colors={COLORS.primaryGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.sectionIcon}
// // //                 >
// // //                   <FontAwesome name="trophy" size={16} color={COLORS.surface} />
// // //                 </LinearGradient>
// // //                 <Text style={styles.sectionTitle}>RECENT WINNERS</Text>
// // //               </View>
// // //               <TouchableOpacity onPress={handleViewAllWinners}>
// // //                 <Text style={styles.seeAll}>See All</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             <View style={styles.winnersContainer}>
// // //               {[
// // //                 { id: 1, name: "Amit Sharma", prize: "Won Full House 🏆", time: "2 min ago" },
// // //                 { id: 2, name: "Neha Gupta", prize: "Won Early 5 🎉", time: "5 min ago" },
// // //                 { id: 3, name: "Rahul Verma", prize: "Won Corners ✨", time: "10 min ago" },
// // //               ].map((winner) => (
// // //                 <LinearGradient
// // //                   key={winner.id}
// // //                   colors={COLORS.winnerGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.winnerCard}
// // //                 >
// // //                   <View style={styles.winnerInfo}>
// // //                     <LinearGradient
// // //                       colors={COLORS.primaryGradient}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 1 }}
// // //                       style={styles.winnerAvatar}
// // //                     >
// // //                       <Text style={styles.winnerInitial}>{winner.name.charAt(0)}</Text>
// // //                     </LinearGradient>
// // //                     <View>
// // //                       <Text style={styles.winnerName}>{winner.name}</Text>
// // //                       <Text style={styles.winnerPrize}>{winner.prize}</Text>
// // //                     </View>
// // //                   </View>
// // //                   <Text style={styles.winnerTime}>{winner.time}</Text>
// // //                 </LinearGradient>
// // //               ))}
// // //             </View>
// // //           </View> */}

// // //           {/* Why Play With Us Section with gradient */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <View style={styles.sectionTitleContainer}>
// // //                 <LinearGradient
// // //                   colors={COLORS.primaryGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.sectionIcon}
// // //                 >
// // //                   <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
// // //                 </LinearGradient>
// // //                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
// // //               </View>
// // //             </View>
            
// // //             <LinearGradient
// // //               colors={COLORS.winnerGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.infoCard}
// // //             >
// // //               <View style={styles.infoList}>
// // //                 <View style={styles.infoItem}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 1 }}
// // //                     style={styles.infoIcon}
// // //                   >
// // //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// // //                   </LinearGradient>
// // //                   <Text style={styles.infoText}>Fast & Fair Games</Text>
// // //                 </View>
// // //                 <View style={styles.infoItem}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 1 }}
// // //                     style={styles.infoIcon}
// // //                   >
// // //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// // //                   </LinearGradient>
// // //                   <Text style={styles.infoText}>Real Players</Text>
// // //                 </View>
// // //                 <View style={styles.infoItem}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 1 }}
// // //                     style={styles.infoIcon}
// // //                   >
// // //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// // //                   </LinearGradient>
// // //                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
// // //                 </View>
// // //                 <View style={styles.infoItem}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 1 }}
// // //                     style={styles.infoIcon}
// // //                   >
// // //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// // //                   </LinearGradient>
// // //                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
// // //                 </View>
// // //               </View>
// // //             </LinearGradient>
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </ScrollView>

// // //         {/* Popup */}
// // //         <UpcomingGamePopup />

// // //         {/* Notifications Modal - FIXED */}
// // //         <Modal 
// // //           visible={modalVisible} 
// // //           transparent={true} 
// // //           animationType="slide"
// // //           onRequestClose={() => setModalVisible(false)}
// // //         >
// // //           <View style={styles.modalOverlay}>
// // //             <View style={styles.modalContainer}>
// // //               <LinearGradient
// // //                 colors={['#ffffff', '#f8f9ff']}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.modalContent}
// // //               >
// // //                 <View style={styles.modalHeader}>
// // //                   <View style={styles.modalTitleContainer}>
// // //                     <LinearGradient
// // //                       colors={COLORS.primaryGradient}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 1 }}
// // //                       style={styles.modalIcon}
// // //                     >
// // //                       <Ionicons name="notifications" size={20} color={COLORS.surface} />
// // //                     </LinearGradient>
// // //                     <Text style={styles.modalTitle}>Notifications</Text>
// // //                   </View>
// // //                   <TouchableOpacity 
// // //                     onPress={() => setModalVisible(false)}
// // //                     style={styles.modalCloseButton}
// // //                   >
// // //                     <Ionicons name="close" size={24} color={COLORS.textDark} />
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 {loadingNotifications ? (
// // //                   <View style={styles.modalLoadingContainer}>
// // //                     <ActivityIndicator size="large" color={COLORS.primary} />
// // //                     <Text style={styles.modalLoadingText}>Loading notifications...</Text>
// // //                   </View>
// // //                 ) : (
// // //                   <FlatList
// // //                     data={notifications}
// // //                     keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // //                     showsVerticalScrollIndicator={false}
// // //                     contentContainerStyle={styles.notificationsList}
// // //                     renderItem={({ item }) => (
// // //                       <View style={styles.modalNotificationItem}>
// // //                         <LinearGradient
// // //                           colors={COLORS.primaryGradient}
// // //                           start={{ x: 0, y: 0 }}
// // //                           end={{ x: 1, y: 1 }}
// // //                           style={styles.modalNotificationIcon}
// // //                         >
// // //                           <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
// // //                         </LinearGradient>
// // //                         <View style={styles.modalNotificationContent}>
// // //                           <Text style={styles.modalNotificationTitle}>
// // //                             {item.title || "New Update"}
// // //                           </Text>
// // //                           <Text style={styles.modalNotificationMessage}>
// // //                             {item.message || "Check out the new features!"}
// // //                           </Text>
// // //                           <Text style={styles.modalNotificationDate}>
// // //                             {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// // //                           </Text>
// // //                         </View>
// // //                       </View>
// // //                     )}
// // //                     ListEmptyComponent={
// // //                       <View style={styles.modalEmptyContainer}>
// // //                         <Ionicons name="notifications-off-outline" size={60} color={COLORS.textLight} />
// // //                         <Text style={styles.modalEmptyText}>No notifications yet</Text>
// // //                         <Text style={styles.modalEmptySubtext}>
// // //                           We'll notify you when something new arrives
// // //                         </Text>
// // //                       </View>
// // //                     }
// // //                   />
// // //                 )}

// // //                 <TouchableOpacity
// // //                   onPress={() => setModalVisible(false)}
// // //                   style={styles.modalFooter}
// // //                 >
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={styles.modalCloseBtn}
// // //                   >
// // //                     <Text style={styles.modalCloseBtnText}>Close</Text>
// // //                   </LinearGradient>
// // //                 </TouchableOpacity>
// // //               </LinearGradient>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   header: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //   },
// // //   logoContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   cartoonTitleRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flexWrap: 'wrap',
// // //   },
// // //   cartoonLetter: {
// // //     fontSize: 34,
// // //     fontWeight: '900',
// // //     color: '#FBC10B',
// // //     textTransform: 'uppercase',
// // //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// // //     textShadowOffset: { width: 3, height: 3 },
// // //     textShadowRadius: 8,
// // //     includeFontPadding: false,
// // //     marginHorizontal: 2,
// // //     ...Platform.select({
// // //       android: {
// // //         elevation: 5,
// // //         textShadowColor: '#FFB300',
// // //         textShadowOffset: { width: 2, height: 2 },
// // //         textShadowRadius: 6,
// // //       },
// // //     }),
// // //   },
// // //   specialCartoonLetter: {
// // //     fontSize: 40,
// // //     color: '#FFD700',
// // //     textShadowColor: '#FF8C00',
// // //     textShadowOffset: { width: 4, height: 4 },
// // //     textShadowRadius: 10,
// // //     marginHorizontal: 2,
// // //   },
// // //   spaceLetter: {
// // //     width: 20,
// // //     marginHorizontal: 0,
// // //   },
// // //   notification: {
// // //     position: "relative",
// // //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// // //     padding: 10,
// // //     borderRadius: 24,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //     marginLeft: 8,
// // //   },
// // //   badge: {
// // //     position: "absolute",
// // //     top: -4,
// // //     right: -4,
// // //     backgroundColor: "red",
// // //     width: 20,
// // //     height: 20,
// // //     borderRadius: 10,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: COLORS.surface,
// // //   },
// // //   badgeText: {
// // //     color: COLORS.surface,
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //   },
// // //   searchWrapper: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //   },
// // //   searchBox: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 14,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 10,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     marginHorizontal: 10,
// // //     fontSize: 15,
// // //     color: COLORS.textDark,
// // //     padding: 0,
// // //   },
// // //   sliderSection: {
// // //     marginTop: 16,
// // //     marginBottom: 8,
// // //     paddingHorizontal: 16,
// // //   },
// // //   sliderWrapper: {
// // //     height: 150,
// // //     position: 'relative',
// // //     borderRadius: 16,
// // //     overflow: 'hidden',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   sliderLoadingContainer: {
// // //     height: 150,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginTop: 16,
// // //     marginBottom: 8,
// // //     marginHorizontal: 16,
// // //     borderRadius: 16,
// // //   },
// // //   slideContainer: {
// // //     width: width - 32,
// // //     height: 150,
// // //   },
// // //   sliderImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //     borderRadius: 16,
// // //   },
// // //   paginationContainer: {
// // //     flexDirection: 'row',
// // //     position: 'absolute',
// // //     bottom: 10,
// // //     alignSelf: 'center',
// // //   },
// // //   paginationDot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     marginHorizontal: 4,
// // //   },
// // //   paginationDotActive: {
// // //     backgroundColor: COLORS.surface,
// // //     width: 20,
// // //   },
// // //   paginationDotInactive: {
// // //     backgroundColor: 'rgba(255,255,255,0.5)',
// // //   },
// // //   loadingText: {
// // //     marginTop: 10,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //   },
// // //   patternsSection: {
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   sectionTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   sectionIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },
// // //   seeAll: {
// // //     fontSize: 14,
// // //     color: COLORS.primary,
// // //     fontWeight: '600',
// // //   },
// // //   seeAllButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //   },
// // //   seeAllText: {
// // //     fontSize: 13,
// // //     color: COLORS.surface,
// // //     fontWeight: '600',
// // //   },
// // //   patternsList: {
// // //     paddingHorizontal: 4,
// // //     paddingVertical: 8,
// // //     gap: 12,
// // //   },
// // //   patternCardContainer: {
// // //     position: 'relative',
// // //     marginRight: 12,
// // //     marginTop: 8,
// // //     paddingTop: 4,
// // //   },
// // //   compactPatternCard: {
// // //     alignItems: 'center',
// // //     width: 60,
// // //     position: 'relative',
// // //   },
// // //   glowEffect: {
// // //     position: 'absolute',
// // //     width: 52,
// // //     height: 52,
// // //     borderRadius: 26,
// // //     top: -2,
// // //     left: 4,
// // //     zIndex: 0,
// // //   },
// // //   compactIconWrapper: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 24,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 6,
// // //     zIndex: 1,
// // //     shadowColor: '#FFD700',
// // //     shadowOpacity: 0.9,
// // //     shadowRadius: 12,
// // //     elevation: 8,
// // //   },
// // //   compactPatternName: {
// // //     fontSize: 11,
// // //     fontWeight: '500',
// // //     color: COLORS.textDark,
// // //     textAlign: 'center',
// // //     zIndex: 1,
// // //   },
// // //   // Games Section
// // //   section: {
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //   },
// // //   gamesLoadingContainer: {
// // //     padding: 30,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     borderRadius: 12,
// // //   },
// // //   noGamesContainer: {
// // //     padding: 30,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   noGamesText: {
// // //     marginTop: 12,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //     textAlign: 'center',
// // //   },
// // //   refreshGamesBtn: {
// // //     marginTop: 16,
// // //     borderRadius: 8,
// // //     overflow: 'hidden',
// // //   },
// // //   refreshGamesGradient: {
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     alignItems: 'center',
// // //   },
// // //   refreshGamesText: {
// // //     color: COLORS.surface,
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //   },
// // //   gamesContainer: {
// // //     gap: 12,
// // //   },
// // //   gameCard: {
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //     marginBottom: 12,
// // //   },
// // //   gameCardPattern: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     width: 50,
// // //     height: 50,
// // //     borderBottomLeftRadius: 16,
// // //     borderTopRightRadius: 25,
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
// // //   statusText: {
// // //     color: COLORS.surface,
// // //     fontSize: 10,
// // //     fontWeight: '700',
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
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 2,
// // //     borderColor: COLORS.primary,
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
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   gameId: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //   },
// // //   gameTypeBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 10,
// // //     gap: 4,
// // //     marginLeft: 8,
// // //   },
// // //   gameTypeText: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //     color: COLORS.surface,
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
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   detailLabel: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //   },
// // //   detailText: {
// // //     fontSize: 12,
// // //     color: COLORS.textDark,
// // //     fontWeight: "600",
// // //   },
// // //   prizeContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 16,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
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
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   prizeInfo: {
// // //     flex: 1,
// // //   },
// // //   prizeLabel: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //   },
// // //   prizeText: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: COLORS.textDark,
// // //   },
// // //   prizeSubtext: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: "500",
// // //     marginTop: 2,
// // //   },
// // //   joinButton: {
// // //     borderRadius: 10,
// // //     overflow: 'hidden',
// // //   },
// // //   joinButtonGradient: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //     gap: 6,
// // //     position: 'relative',
// // //   },
// // //   glassEffectOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     borderTopWidth: 1,
// // //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// // //   },
// // //   completedJoinButton: {
// // //     backgroundColor: COLORS.completed,
// // //   },
// // //   joinButtonText: {
// // //     color: COLORS.surface,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   winnersContainer: {
// // //     gap: 8,
// // //   },
// // //   winnerCard: {
// // //     borderRadius: 10,
// // //     padding: 12,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 1,
// // //     elevation: 1,
// // //   },
// // //   winnerInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //   },
// // //   winnerAvatar: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   winnerInitial: {
// // //     color: COLORS.surface,
// // //     fontSize: 14,
// // //     fontWeight: '700',
// // //   },
// // //   winnerName: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   winnerPrize: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginTop: 2,
// // //   },
// // //   winnerTime: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   infoCard: {
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   infoList: {
// // //     gap: 12,
// // //   },
// // //   infoItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //   },
// // //   infoIcon: {
// // //     width: 24,
// // //     height: 24,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   infoText: {
// // //     fontSize: 14,
// // //     color: COLORS.textDark,
// // //     fontWeight: '500',
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // //   loadingMoreContainer: {
// // //     paddingVertical: 20,
// // //     alignItems: 'center',
// // //   },
// // //   // Popup Styles
// // //   popupOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   popupContainer: {
// // //     width: width * 0.8,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 28,
// // //     padding: 24,
// // //     alignItems: 'center',
// // //   },
// // //   popupIcon: {
// // //     width: 56,
// // //     height: 56,
// // //     borderRadius: 28,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   popupTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 8,
// // //   },
// // //   popupGameName: {
// // //     fontSize: 16,
// // //     color: COLORS.textLight,
// // //     marginBottom: 16,
// // //     textAlign: 'center',
// // //   },
// // //   popupTimer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     marginBottom: 20,
// // //   },
// // //   popupTimerText: {
// // //     fontSize: 14,
// // //     color: COLORS.textDark,
// // //     fontWeight: '500',
// // //   },
// // //   popupPrize: {
// // //     alignItems: 'center',
// // //     padding: 12,
// // //     borderRadius: 16,
// // //     marginBottom: 24,
// // //     width: '100%',
// // //   },
// // //   popupPrizeLabel: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginBottom: 4,
// // //   },
// // //   popupPrizeValue: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: COLORS.primary,
// // //   },
// // //   popupPrizeSubtext: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     marginTop: 4,
// // //   },
// // //   popupActions: {
// // //     width: '100%',
// // //     gap: 12,
// // //   },
// // //   popupPrimaryButton: {
// // //     paddingVertical: 14,
// // //     borderRadius: 20,
// // //     alignItems: 'center',
// // //   },
// // //   popupPrimaryButtonText: {
// // //     color: COLORS.surface,
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //   },
// // //   popupSecondaryButton: {
// // //     paddingVertical: 10,
// // //     alignItems: 'center',
// // //   },
// // //   popupSecondaryButtonText: {
// // //     fontSize: 14,
// // //     color: COLORS.textLight,
// // //   },
// // //   // Modal Styles - FIXED
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.6)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalContainer: {
// // //     width: '90%',
// // //     maxHeight: '80%',
// // //     borderRadius: 24,
// // //     overflow: 'hidden',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 10,
// // //   },
// // //   modalContent: {
// // //     borderRadius: 24,
// // //     padding: 20,
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     paddingBottom: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //   },
// // //   modalTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //   },
// // //   modalIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },
// // //   modalCloseButton: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: '#f0f0f0',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalLoadingContainer: {
// // //     padding: 40,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   modalLoadingText: {
// // //     marginTop: 12,
// // //     color: COLORS.textLight,
// // //     fontSize: 14,
// // //   },
// // //   notificationsList: {
// // //     paddingVertical: 8,
// // //   },
// // //   modalNotificationItem: {
// // //     flexDirection: 'row',
// // //     padding: 16,
// // //     backgroundColor: '#f8f9ff',
// // //     borderRadius: 16,
// // //     marginBottom: 10,
// // //     borderWidth: 1,
// // //     borderColor: '#eef2f6',
// // //   },
// // //   modalNotificationIcon: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 12,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 14,
// // //   },
// // //   modalNotificationContent: {
// // //     flex: 1,
// // //   },
// // //   modalNotificationTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 4,
// // //   },
// // //   modalNotificationMessage: {
// // //     fontSize: 14,
// // //     color: COLORS.textLight,
// // //     marginBottom: 6,
// // //     lineHeight: 20,
// // //   },
// // //   modalNotificationDate: {
// // //     fontSize: 11,
// // //     color: '#999',
// // //     fontWeight: '500',
// // //   },
// // //   modalEmptyContainer: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 50,
// // //     paddingHorizontal: 20,
// // //   },
// // //   modalEmptyText: {
// // //     marginTop: 16,
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   modalEmptySubtext: {
// // //     marginTop: 8,
// // //     fontSize: 14,
// // //     color: COLORS.textLight,
// // //     textAlign: 'center',
// // //   },
// // //   modalFooter: {
// // //     marginTop: 16,
// // //     paddingTop: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: COLORS.border,
// // //   },
// // //   modalCloseBtn: {
// // //     paddingVertical: 14,
// // //     borderRadius: 14,
// // //     alignItems: 'center',
// // //   },
// // //   modalCloseBtnText: {
// // //     color: COLORS.surface,
// // //     fontWeight: '600',
// // //     fontSize: 16,
// // //   },
// // // });

// // // export default Home;





// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   Image,
// //   ScrollView,
// //   TouchableOpacity,
// //   FlatList,
// //   Modal,
// //   ActivityIndicator,
// //   RefreshControl,
// //   Dimensions,
// //   SafeAreaView,
// //   StatusBar,
// //   TextInput,
// //   Animated,
// //   Easing,
// //   Platform,
// // } from "react-native";
// // import LinearGradient from 'react-native-linear-gradient';
// // import axios from "axios";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useNavigation } from '@react-navigation/native';

// // const { width } = Dimensions.get('window');

// // // Enhanced color scheme with gradients
// // const COLORS = {
// //   primary: "#4facfe",
// //   primaryLight: "#9fcdff",
// //   primaryGradient: ['#359df9', '#64d8f8'],
// //   secondary: "#FDB800",
// //   secondaryGradient: ['#FDB800', '#FF8C00'],
// //   background: "#f5f8ff",
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
// //     ['#0282E9', '#0056b3'],
// //     ['#F59E0B', '#d97706'],
// //     ['#10B981', '#059669'],
// //     ['#EF4444', '#dc2626'],
// //     ['#8B5CF6', '#6d28d9'],
// //     ['#EC4899', '#db2777'],
// //     ['#06B6D4', '#0891b2'],
// //     ['#F97316', '#ea580c'],
// //   ],
  
// //   // Additional gradients
// //   prizeGradient: ['#4facfe20', '#00c6fb20'],
// //   winnerGradient: ['#4facfe10', '#9fcdff10'],
// //   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
// //   darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
// // };

// // // Custom Loader Component with Animation
// // const CustomLoader = () => {
// //   const [currentPhrase, setCurrentPhrase] = useState(0);
// //   const spinValue = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const bounceAnim = useRef(new Animated.Value(0)).current;
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const floatAnim3 = useRef(new Animated.Value(0)).current;
  
// //   const phrases = [
// //     "Loading Magic...",
// //     "Almost There...",
// //     "Getting Ready...",
// //     "Just a Moment..."
// //   ];

// //   useEffect(() => {
// //     // Rotating animation for the center element
// //     Animated.loop(
// //       Animated.timing(spinValue, {
// //         toValue: 1,
// //         duration: 8000,
// //         easing: Easing.linear,
// //         useNativeDriver: true,
// //       })
// //     ).start();

// //     // Pulsing animation for the outer ring
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.2,
// //           duration: 1500,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 1500,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Bouncing animation for the main container
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(bounceAnim, {
// //           toValue: 1,
// //           duration: 2000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(bounceAnim, {
// //           toValue: 0,
// //           duration: 2000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Floating animations for decorative elements
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim1, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim1, {
// //           toValue: 0,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim2, {
// //           toValue: 1,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim2, {
// //           toValue: 0,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim3, {
// //           toValue: 1,
// //           duration: 3500,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim3, {
// //           toValue: 0,
// //           duration: 3500,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Change phrase every 3 seconds
// //     const phraseInterval = setInterval(() => {
// //       setCurrentPhrase((prev) => (prev + 1) % phrases.length);
// //     }, 3000);

// //     return () => clearInterval(phraseInterval);
// //   }, []);

// //   const spin = spinValue.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['0deg', '360deg']
// //   });

// //   const bounce = bounceAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, -15]
// //   });

// //   const float1 = floatAnim1.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, 20]
// //   });

// //   const float2 = floatAnim2.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, -20]
// //   });

// //   const float3 = floatAnim3.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, 15]
// //   });

// //   return (
// //     <LinearGradient
// //       colors={['#4facfe', '#00f2fe']}
// //       start={{ x: 0, y: 0 }}
// //       end={{ x: 1, y: 1 }}
// //       style={styles.loaderContainer}
// //     >
// //       {/* Decorative floating elements */}
// //       <Animated.View 
// //         style={[
// //           styles.loaderCircle1,
// //           {
// //             transform: [
// //               { translateY: float1 },
// //               { translateX: float2 }
// //             ]
// //           }
// //         ]} 
// //       />
// //       <Animated.View 
// //         style={[
// //           styles.loaderCircle2,
// //           {
// //             transform: [
// //               { translateY: float2 },
// //               { translateX: float3 }
// //             ]
// //           }
// //         ]} 
// //       />
// //       <Animated.View 
// //         style={[
// //           styles.loaderCircle3,
// //           {
// //             transform: [
// //               { translateY: float3 },
// //               { translateX: float1 }
// //             ]
// //           }
// //         ]} 
// //       />

// //       <Animated.View 
// //         style={[
// //           styles.loaderContent,
// //           {
// //             transform: [{ translateY: bounce }]
// //           }
// //         ]}
// //       >
// //         {/* Animated Rings */}
// //         <View style={styles.loaderRingsContainer}>
// //           <Animated.View 
// //             style={[
// //               styles.loaderRing,
// //               {
// //                 transform: [{ scale: pulseAnim }]
// //               }
// //             ]} 
// //           />
// //           <Animated.View 
// //             style={[
// //               styles.loaderRing2,
// //               {
// //                 transform: [{ rotate: spin }]
// //               }
// //             ]} 
// //           />
          
// //           {/* Center Logo */}
// //           <LinearGradient
// //             colors={['#FDB800', '#FF8C00']}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.loaderCenter}
// //           >
// //             <Text style={styles.loaderCenterText}>HZ</Text>
// //           </LinearGradient>
// //         </View>

// //         {/* Animated Text */}
// //         <View style={styles.loaderTextContainer}>
// //           <Text style={styles.loaderTitle}>Houzie Timez</Text>
// //           <View style={styles.loaderPhraseContainer}>
// //             <Text style={styles.loaderPhrase}>{phrases[currentPhrase]}</Text>
// //             <View style={styles.loaderDots}>
// //               <Animated.View style={[styles.loaderDot, { opacity: floatAnim1 }]} />
// //               <Animated.View style={[styles.loaderDot, { opacity: floatAnim2 }]} />
// //               <Animated.View style={[styles.loaderDot, { opacity: floatAnim3 }]} />
// //             </View>
// //           </View>
// //         </View>

// //         {/* Progress Bar */}
// //         <View style={styles.loaderProgressContainer}>
// //           <LinearGradient
// //             colors={['#FDB800', '#FF8C00']}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 0 }}
// //             style={styles.loaderProgressBar}
// //           >
// //             <Animated.View 
// //               style={[
// //                 styles.loaderProgressGlow,
// //                 {
// //                   transform: [
// //                     { translateX: spinValue.interpolate({
// //                       inputRange: [0, 1],
// //                       outputRange: [-100, 200]
// //                     }) }
// //                   ]
// //                 }
// //               ]} 
// //             />
// //           </LinearGradient>
// //         </View>

// //         {/* Decorative SVG-like elements */}
// //         <View style={styles.loaderDecorations}>
// //           <Animated.View style={[styles.loaderStar, { transform: [{ scale: pulseAnim }] }]}>
// //             <Text style={styles.loaderStarText}>✦</Text>
// //           </Animated.View>
// //           <Animated.View style={[styles.loaderStar2, { transform: [{ rotate: spin }] }]}>
// //             <Text style={styles.loaderStarText}>✧</Text>
// //           </Animated.View>
// //           <Animated.View style={[styles.loaderStar3, { transform: [{ scale: floatAnim2 }] }]}>
// //             <Text style={styles.loaderStarText}>✪</Text>
// //           </Animated.View>
// //         </View>
// //       </Animated.View>
// //     </LinearGradient>
// //   );
// // };

// // const Home = () => {
// //   const navigation = useNavigation();
// //   const [notifications, setNotifications] = useState([]);
// //   const [sliders, setSliders] = useState([]);
// //   const [games, setGames] = useState([]);
// //   const [filteredGames, setFilteredGames] = useState([]);
// //   const [patterns, setPatterns] = useState([]);
// //   const [loadingPatterns, setLoadingPatterns] = useState(true);
// //   const [activeSlide, setActiveSlide] = useState(0);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [loadingNotifications, setLoadingNotifications] = useState(true);
// //   const [loadingSliders, setLoadingSliders] = useState(true);
// //   const [loadingGames, setLoadingGames] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');
  
// //   // Popup state
// //   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
// //   const [upcomingGame, setUpcomingGame] = useState(null);
// //   const [popupShown, setPopupShown] = useState(false);
  
// //   // Animation for popup
// //   const slideAnim = useRef(new Animated.Value(300)).current;
// //   const opacityAnim = useRef(new Animated.Value(0)).current;
  
// //   // Animation values for buttons and patterns
// //   const buttonScaleAnims = useRef([]);
// //   const patternScaleAnims = useRef([]);
// //   const glowAnims = useRef([]);
// //   const letterAnims = useRef([]);
  
// //   // Pagination state for games
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [lastPage, setLastPage] = useState(1);
// //   const [loadingMore, setLoadingMore] = useState(false);
  
// //   const sliderRef = useRef(null);
// //   const scrollInterval = useRef(null);

// //   // Filter options
// //   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
// //   const [activeFilter, setActiveFilter] = useState('All Games');

// //   // Initialize animations
// //   useEffect(() => {
// //     buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
// //     buttonScaleAnims.current.forEach((anim, index) => {
// //       startPulseAnimation(anim);
// //     });
// //   }, [games.length]);

// //   // Initialize letter animations for header
// //   useEffect(() => {
// //     // Create new animations array
// //     const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
// //     letterAnims.current = newLetterAnims;
    
// //     // Stop any existing animations
// //     letterAnims.current.forEach(anim => {
// //       anim.stopAnimation();
// //       anim.setValue(1);
// //     });
    
// //     let currentIndex = 0;
// //     let isAnimating = true;
    
// //     const animateNextLetter = () => {
// //       if (!isAnimating) return;
      
// //       // Reset all letters to normal size
// //       letterAnims.current.forEach(anim => {
// //         anim.setValue(1);
// //       });
      
// //       // Animate current letter
// //       Animated.sequence([
// //         Animated.timing(letterAnims.current[currentIndex], {
// //           toValue: 1.5,
// //           duration: 200,
// //           useNativeDriver: true,
// //           easing: Easing.bounce,
// //         }),
// //         Animated.timing(letterAnims.current[currentIndex], {
// //           toValue: 1,
// //           duration: 150,
// //           useNativeDriver: true,
// //           easing: Easing.bounce,
// //         }),
// //         Animated.delay(200),
// //       ]).start(({ finished }) => {
// //         if (finished && isAnimating) {
// //           currentIndex = (currentIndex + 1) % letterAnims.current.length;
// //           animateNextLetter();
// //         }
// //       });
// //     };
    
// //     // Start the animation
// //     animateNextLetter();
    
// //     // Cleanup function
// //     return () => {
// //       isAnimating = false;
// //       if (letterAnims.current) {
// //         letterAnims.current.forEach(anim => {
// //           anim.stopAnimation();
// //         });
// //       }
// //     };
// //   }, []);

// //   // Initialize pattern animations when patterns load
// //   useEffect(() => {
// //     if (patterns.length > 0) {
// //       patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
// //       glowAnims.current = patterns.map(() => new Animated.Value(0));
      
// //       patternScaleAnims.current.forEach((anim, index) => {
// //         startPulseAnimation(anim, 1000 + (index * 200));
// //       });
      
// //       glowAnims.current.forEach((anim, index) => {
// //         startGlowAnimation(anim, 1500 + (index * 300));
// //       });
// //     }
// //   }, [patterns.length]);

// //   // Pulse animation function
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

// //   // Glow animation function
// //   const startGlowAnimation = (anim, duration = 1500) => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(anim, {
// //           toValue: 1,
// //           duration: duration / 2,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         }),
// //         Animated.timing(anim, {
// //           toValue: 0,
// //           duration: duration / 2,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         })
// //       ])
// //     ).start();
// //   };

// //   // Function to calculate prize pool from pattern rewards
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

// //   useEffect(() => {
// //     fetchInitialData();
    
// //     return () => {
// //       if (scrollInterval.current) {
// //         clearInterval(scrollInterval.current);
// //       }
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (games.length > 0 && !popupShown) {
// //       setTimeout(() => {
// //         checkUpcomingGame();
// //       }, 1500);
// //     }
// //   }, [games, popupShown]);

// //   useEffect(() => {
// //     if (sliders.length > 1) {
// //       startAutoScroll();
// //     }
// //     return () => {
// //       if (scrollInterval.current) {
// //         clearInterval(scrollInterval.current);
// //       }
// //     };
// //   }, [sliders.length]);

// //   // Filter games based on search and active filter
// //   useEffect(() => {
// //     let filtered = games;
    
// //     if (searchQuery.trim() !== '') {
// //       filtered = filtered.filter(game =>
// //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //     }
    
// //     if (activeFilter === 'Live Now') {
// //       filtered = filtered.filter(game => game.status === 'live');
// //     } else if (activeFilter === 'Upcoming') {
// //       filtered = filtered.filter(game => game.status === 'scheduled');
// //     } else if (activeFilter === 'Completed') {
// //       filtered = filtered.filter(game => game.status === 'completed');
// //     }
    
// //     setFilteredGames(filtered);
// //   }, [searchQuery, games, activeFilter]);

// //   useEffect(() => {
// //     if (upcomingGamePopup) {
// //       Animated.parallel([
// //         Animated.timing(opacityAnim, {
// //           toValue: 1,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(slideAnim, {
// //           toValue: 0,
// //           duration: 400,
// //           easing: Easing.out(Easing.back(1.2)),
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     } else {
// //       opacityAnim.setValue(0);
// //       slideAnim.setValue(300);
// //     }
// //   }, [upcomingGamePopup]);

// //   const startAutoScroll = () => {
// //     if (scrollInterval.current) {
// //       clearInterval(scrollInterval.current);
// //     }
    
// //     scrollInterval.current = setInterval(() => {
// //       if (sliders.length > 0) {
// //         let nextIndex = activeSlide + 1;
// //         if (nextIndex >= sliders.length) {
// //           nextIndex = 0;
// //         }
        
// //         setActiveSlide(nextIndex);
// //         if (sliderRef.current) {
// //           const slideWidth = width - 32;
// //           sliderRef.current.scrollToOffset({
// //             offset: nextIndex * slideWidth,
// //             animated: true
// //           });
// //         }
// //       }
// //     }, 3000);
// //   };

// //   const fetchInitialData = async () => {
// //     try {
// //       await Promise.all([
// //         fetchNotifications(),
// //         fetchSliders(),
// //         fetchGames(1),
// //         fetchPatterns()
// //       ]);
// //     } catch (error) {
// //       console.log("Error fetching initial data:", error);
// //     }
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     setCurrentPage(1);
// //     setGames([]);
// //     setFilteredGames([]);
// //     setPopupShown(false);
// //     Promise.all([
// //       fetchNotifications(),
// //       fetchSliders(),
// //       fetchGames(1),
// //       fetchPatterns()
// //     ]).finally(() => setRefreshing(false));
// //   }, []);

// //   const checkUpcomingGame = () => {
// //     try {
// //       const now = new Date();
      
// //       const scheduledGames = games.filter(game => 
// //         game.status === 'scheduled'
// //       );
      
// //       if (scheduledGames.length === 0) return;
      
// //       const gamesWithEndDateTime = scheduledGames.map(game => {
// //         let endDateTime;
        
// //         try {
// //           if (game.ticket_request_end_date) {
// //             endDateTime = new Date(game.ticket_request_end_date);
// //           } else {
// //             endDateTime = new Date(game.game_date);
// //           }
// //         } catch (e) {
// //           endDateTime = new Date();
// //         }
        
// //         return {
// //           ...game,
// //           endDateTime
// //         };
// //       });
      
// //       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
// //       const earliestEndGame = sortedGames[0];
      
// //       const timeDiff = earliestEndGame.endDateTime - now;
      
// //       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
// //         setUpcomingGame(earliestEndGame);
// //         setUpcomingGamePopup(true);
// //         setPopupShown(true);
// //       }
// //     } catch (error) {
// //       console.log("Error checking upcoming game:", error);
// //     }
// //   };

// //   const getTimeRemaining = (endDateTime) => {
// //     const now = new Date();
// //     const diff = endDateTime - now;
    
// //     if (diff <= 0) return "Ending soon";
    
// //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
// //     if (days > 0) {
// //       return `${days}d ${hours}h left`;
// //     } else if (hours > 0) {
// //       return `${hours}h ${minutes}m left`;
// //     } else {
// //       return `${minutes}m left`;
// //     }
// //   };

// //   const fetchNotifications = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/notifications",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.status) {
// //         setNotifications(res.data.data);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching notifications:", error);
// //     } finally {
// //       setLoadingNotifications(false);
// //     }
// //   };

// //   const fetchSliders = async () => {
// //     try {
// //       setLoadingSliders(true);
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/sliders"
// //       );
// //       if (res.data.success) {
// //         setSliders(res.data.data || []);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching sliders:", error);
// //       setSliders([]);
// //     } finally {
// //       setLoadingSliders(false);
// //     }
// //   };

// //   const fetchGames = async (page = 1) => {
// //     try {
// //       if (page === 1) {
// //         setLoadingGames(true);
// //       }
      
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
      
// //       const res = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
      
// //       if (res.data.success) {
// //         const newGames = res.data.games.data || [];
// //         const pagination = res.data.games;
        
// //         if (page === 1) {
// //           setGames(newGames);
// //           setFilteredGames(newGames);
// //         } else {
// //           setGames(prev => [...prev, ...newGames]);
// //           setFilteredGames(prev => [...prev, ...newGames]);
// //         }
        
// //         setCurrentPage(pagination.current_page);
// //         setLastPage(pagination.last_page);
// //       }
// //     } catch (error) {
// //       console.log("Error fetching games:", error);
// //     } finally {
// //       if (page === 1) {
// //         setLoadingGames(false);
// //       }
// //       setLoadingMore(false);
// //     }
// //   };

// //   const fetchPatterns = async () => {
// //     try {
// //       setLoadingPatterns(true);
// //       const token = await AsyncStorage.getItem("token");
      
// //       if (!token) {
// //         setLoadingPatterns(false);
// //         return;
// //       }

// //       const response = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/patterns/available",
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             Accept: 'application/json',
// //           },
// //         }
// //       );

// //       if (response.data && response.data.status) {
// //         const patternsData = response.data.data?.patterns || [];
        
// //         const patternSequence = [
// //           'top line',
// //           'middle line', 
// //           'bottom line',
// //           'breakfast',
// //           'lunch',
// //           'dinner',
// //           'four corners',
// //           'bamboo',
// //           'early five',
// //           'non claimers',
// //           'full house'
// //         ];
        
// //         const sortedPatterns = patternsData.sort((a, b) => {
// //           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
// //           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
// //           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
// //           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
// //           if (aIndex === -1) return 1;
// //           if (bIndex === -1) return -1;
          
// //           return aIndex - bIndex;
// //         });
        
// //         setPatterns(sortedPatterns.slice(0, 8));
// //       }
// //     } catch (error) {
// //       console.log('Error fetching patterns in Home:', error);
// //     } finally {
// //       setLoadingPatterns(false);
// //     }
// //   };

// //   const loadMoreGames = () => {
// //     if (!loadingMore && currentPage < lastPage) {
// //       setLoadingMore(true);
// //       fetchGames(currentPage + 1);
// //     }
// //   };

// //   const handleGamePress = (game) => {
// //     navigation.navigate("GameDetails", { game });
// //   };

// //   const handleAllGamesPress = () => {
// //     navigation.navigate("Game");
// //   };

// //   const handleAllPatternsPress = () => {
// //     navigation.navigate("UserGamePatterns");
// //   };

// //   const handleViewAllWinners = () => {
// //     navigation.navigate("Game");
// //   };

// //   const handlePatternPress = (pattern) => {
// //     navigation.navigate("UserGamePatterns", { 
// //       selectedPatternId: pattern.id,
// //       selectedPattern: pattern 
// //     });
// //   };

// //   const handlePopupJoinNow = () => {
// //     setUpcomingGamePopup(false);
// //     if (upcomingGame) {
// //       navigation.navigate("GameDetails", { game: upcomingGame });
// //     }
// //   };

// //   const handlePopupLater = () => {
// //     setUpcomingGamePopup(false);
// //   };

// //   const getPatternIcon = (pattern) => {
// //     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
// //     const iconMap = {
// //       'bamboo': 'leaf',
// //       'bottom line': 'arrow-down',
// //       'breakfast': 'cafe',
// //       'dinner': 'restaurant',
// //       'early five': '5',
// //       'four corners': 'apps',
// //       'full house': 'home',
// //       'lunch': 'fast-food',
// //       'middle line': 'remove',
// //       'non claimer': 'close',
// //       'top line': 'arrow-up'
// //     };
    
// //     for (const [key, icon] of Object.entries(iconMap)) {
// //       if (patternName.includes(key)) return icon;
// //     }
    
// //     return 'grid-outline';
// //   };

// //   const formatPatternName = (name) => {
// //     if (!name) return 'Unknown Pattern';
// //     return name
// //       .split('_')
// //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //       .join(' ');
// //   };

// //   const Header = () => {
// //     const letters = [
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
// //         <View style={styles.logoContainer}>
// //           <View style={styles.cartoonTitleRow}>
// //             {letters.map((item) => {
// //               const animValue = letterAnims.current && letterAnims.current[item.index] 
// //                 ? letterAnims.current[item.index] 
// //                 : new Animated.Value(1);
              
// //               return (
// //                 <Animated.Text
// //                   key={`letter-${item.index}`}
// //                   style={[
// //                     styles.cartoonLetter,
// //                     item.isSpecial && styles.specialCartoonLetter,
// //                     item.isSpace && { width: item.width || 20 },
// //                     { 
// //                       transform: [{ scale: animValue }],
// //                       marginHorizontal: item.isSpace ? 0 : 2,
// //                     }
// //                   ]}
// //                 >
// //                   {item.char}
// //                 </Animated.Text>
// //               );
// //             })}
// //           </View>
// //         </View>

// //         <TouchableOpacity 
// //           style={styles.notification}
// //           onPress={() => setModalVisible(true)}
// //         >
// //           <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
// //           {notifications.length > 0 && (
// //             <View style={styles.badge}>
// //               <Text style={styles.badgeText}>{notifications.length}</Text>
// //             </View>
// //           )}
// //         </TouchableOpacity>
// //       </LinearGradient>
// //     );
// //   };

// //   // Animated pattern card with gradient and glow
// //   const renderPatternCard = (pattern, index) => {
// //     const icon = getPatternIcon(pattern);
// //     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
// //     const patterns = [
// //       'Top Line',
// //       'Middle',
// //       'Bottom',
// //       'Breakfast',
// //       'Lunch',
// //       'Dinner',
// //       'Corners',
// //       'Bamboo',
// //     ];
    
// //     const patternName = patterns[index % patterns.length];
// //     const gradientColors = COLORS.patternGradients[index % COLORS.patternGradients.length];
    
// //     const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
// //     const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
// //     const glowOpacity = glowAnim.interpolate({
// //       inputRange: [0, 1],
// //       outputRange: [0, 0.7]
// //     });
    
// //     return (
// //       <Animated.View
// //         key={pattern.id}
// //         style={[
// //           styles.patternCardContainer,
// //           {
// //             transform: [{ scale: scaleAnim }]
// //           }
// //         ]}
// //       >
// //         <TouchableOpacity 
// //           style={styles.compactPatternCard}
// //           onPress={() => handlePatternPress(pattern)}
// //           activeOpacity={0.7}
// //         >
// //           <Animated.View style={[
// //             styles.glowEffect,
// //             {
// //               backgroundColor: gradientColors[0],
// //               opacity: glowOpacity,
// //               transform: [{ scale: 1.2 }]
// //             }
// //           ]} />
// //           <LinearGradient
// //             colors={gradientColors}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.compactIconWrapper}
// //           >
// //             <Ionicons name={icon} size={18} color="#FFFFFF" />
// //           </LinearGradient>
// //           <Text style={styles.compactPatternName} numberOfLines={1}>
// //             {patternName}
// //           </Text>
// //         </TouchableOpacity>
// //       </Animated.View>
// //     );
// //   };

// //   const renderSliderItem = ({ item }) => (
// //     <View style={styles.slideContainer}>
// //       <Image
// //         source={{ 
// //           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
// //         }}
// //         style={styles.sliderImage}
// //         resizeMode="cover"
// //       />
// //     </View>
// //   );

// //   const handleScroll = (event) => {
// //     const slideSize = event.nativeEvent.layoutMeasurement.width;
// //     const contentOffset = event.nativeEvent.contentOffset.x;
// //     const currentIndex = Math.floor(contentOffset / slideSize);
    
// //     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
// //       setActiveSlide(currentIndex);
// //     }
// //   };

// //   const renderPagination = () => {
// //     if (sliders.length <= 1) return null;
    
// //     return (
// //       <View style={styles.paginationContainer}>
// //         {sliders.map((_, index) => (
// //           <View
// //             key={index}
// //             style={[
// //               styles.paginationDot,
// //               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
// //             ]}
// //           />
// //         ))}
// //       </View>
// //     );
// //   };

// //   const renderGameCard = ({ item: game, index }) => {
// //     if (!game) return null;
    
// //     const ticketCost = parseFloat(game.ticket_cost || 0);
// //     const isPaid = game.ticket_type === "paid";
// //     const isLive = game.status === 'live';
// //     const isScheduled = game.status === 'scheduled';
// //     const isCompleted = game.status === 'completed';
    
// //     const prizePool = calculatePrizePool(game);
    
// //     if (!buttonScaleAnims.current[index]) {
// //       buttonScaleAnims.current[index] = new Animated.Value(1);
// //       startPulseAnimation(buttonScaleAnims.current[index]);
// //     }
    
// //     const buttonScale = buttonScaleAnims.current[index];
    
// //     return (
// //       <TouchableOpacity
// //         style={styles.gameCard}
// //         activeOpacity={0.9}
// //         onPress={() => handleGamePress(game)}
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
// //           style={[
// //             styles.statusBadge,
// //           ]}
// //         >
// //           <Ionicons 
// //             name={
// //               isLive ? 'radio-button-on' : 
// //               isCompleted ? 'checkmark-circle' :
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

// //         <View style={styles.cardHeader}>
// //           <View style={styles.gameIconContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.gameIconWrapper}
// //             >
// //               <MaterialIcons name="confirmation-number" size={32} color={COLORS.primary} />
// //             </LinearGradient>
// //             <View style={styles.gameInfo}>
// //               <Text style={styles.gameName} numberOfLines={1}>
// //                 {game.game_name || "Tambola Game"}
// //               </Text>
// //               <Text style={styles.gameId}>
// //                 ID: {game.game_code || "N/A"}
// //               </Text>
// //             </View>
// //           </View>
          
// //           <LinearGradient
// //             colors={isPaid ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 0 }}
// //             style={[
// //               styles.gameTypeBadge,
// //             ]}
// //           >
// //             {isPaid ? (
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
// //                   {game.game_date_formatted || game.game_date || "Date TBA"}
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
// //                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
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
// //             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.surface} />
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
// //             style={[
// //               styles.joinButton,
// //               isCompleted && styles.completedJoinButton
// //             ]}
// //             onPress={() => handleGamePress(game)}
// //             activeOpacity={0.9}
// //           >
// //             <LinearGradient
// //               colors={isCompleted ? COLORS.completedGradient : COLORS.primaryGradient}
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
// //                   : isLive
// //                     ? 'JOIN GAME' 
// //                     : 'VIEW DETAILS'}
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

// //   const clearSearch = () => {
// //     setSearchQuery('');
// //   };

// //   const renderFooter = () => {
// //     if (!loadingMore) return null;
// //     return (
// //       <View style={styles.loadingMoreContainer}>
// //         <ActivityIndicator size="small" color={COLORS.primary} />
// //       </View>
// //     );
// //   };

// //   const UpcomingGamePopup = () => {
// //     if (!upcomingGame) return null;
    
// //     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
// //     const isPaid = upcomingGame.ticket_type === "paid";
// //     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
// //     const timeRemaining = getTimeRemaining(endDateTime);
    
// //     const prizePool = calculatePrizePool(upcomingGame);
    
// //     return (
// //       <Modal
// //         visible={upcomingGamePopup}
// //         transparent={true}
// //         animationType="fade"
// //         onRequestClose={handlePopupLater}
// //       >
// //         <View style={styles.popupOverlay}>
// //           <Animated.View 
// //             style={[
// //               styles.popupContainer,
// //               {
// //                 opacity: opacityAnim,
// //                 transform: [{ translateY: slideAnim }]
// //               }
// //             ]}
// //           >
// //             <LinearGradient
// //               colors={COLORS.primaryGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.popupIcon}
// //             >
// //               <Ionicons name="timer-outline" size={32} color={COLORS.surface} />
// //             </LinearGradient>
            
// //             <Text style={styles.popupTitle}>Booking closing soon!</Text>
// //             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
// //             <LinearGradient
// //               colors={COLORS.winnerGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.popupTimer}
// //             >
// //               <Ionicons name="time-outline" size={16} color={COLORS.primary} />
// //               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
// //             </LinearGradient>
            
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.popupPrize}
// //             >
// //               <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
// //               <Text style={styles.popupPrizeValue}>
// //                 {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
// //               </Text>
// //               {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
// //                 <Text style={styles.popupPrizeSubtext}>
// //                   {upcomingGame.pattern_rewards.length} Patterns
// //                 </Text>
// //               )}
// //             </LinearGradient>
            
// //             <View style={styles.popupActions}>
// //               <TouchableOpacity 
// //                 onPress={handlePopupJoinNow}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 0 }}
// //                   style={styles.popupPrimaryButton}
// //                 >
// //                   <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
// //                 </LinearGradient>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity 
// //                 style={styles.popupSecondaryButton}
// //                 onPress={handlePopupLater}
// //               >
// //                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </Animated.View>
// //         </View>
// //       </Modal>
// //     );
// //   };

// //   if (loadingGames && games.length === 0) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <CustomLoader />
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

// //       <View style={styles.container}>
// //         {/* Header with gradient */}
// //         <Header />

// //         {/* Search Bar with gradient */}
// //         <LinearGradient
// //           colors={COLORS.primaryGradient}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 0 }}
// //           style={styles.searchWrapper}
// //         >
// //           <View style={styles.searchBox}>
// //             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
// //             <TextInput
// //               placeholder="Search games by name or ID..."
// //               placeholderTextColor={COLORS.textLight}
// //               style={styles.searchInput}
// //               value={searchQuery}
// //               onChangeText={setSearchQuery}
// //               returnKeyType="search"
// //             />
// //             {searchQuery.length > 0 ? (
// //               <TouchableOpacity onPress={clearSearch}>
// //                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
// //               </TouchableOpacity>
// //             ) : (
// //               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
// //             )}
// //           </View>
// //         </LinearGradient>

// //         <ScrollView
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor={COLORS.primary}
// //               colors={[COLORS.primary]}
// //             />
// //           }
// //         >
// //           {/* Slider Section */}
// //           {loadingSliders ? (
// //             <LinearGradient
// //               colors={COLORS.winnerGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.sliderLoadingContainer}
// //             >
// //               <ActivityIndicator size="large" color={COLORS.primary} />
// //               <Text style={styles.loadingText}>Loading offers...</Text>
// //             </LinearGradient>
// //           ) : sliders.length > 0 ? (
// //             <View style={styles.sliderSection}>
// //               <View style={styles.sliderWrapper}>
// //                 <FlatList
// //                   ref={sliderRef}
// //                   data={sliders}
// //                   renderItem={renderSliderItem}
// //                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
// //                   horizontal
// //                   pagingEnabled
// //                   showsHorizontalScrollIndicator={false}
// //                   onScroll={handleScroll}
// //                   scrollEventThrottle={16}
// //                 />
                
// //                 {/* Pagination Dots */}
// //                 {renderPagination()}
// //               </View>
// //             </View>
// //           ) : null}

// //           {/* Patterns Section - Now with gradient */}
// //           {patterns.length > 0 && (
// //             <View style={styles.patternsSection}>
// //               <View style={styles.sectionHeader}>
// //                 <View style={styles.sectionTitleContainer}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.sectionIcon}
// //                   >
// //                     <Ionicons name="grid-outline" size={16} color={COLORS.surface} />
// //                   </LinearGradient>
// //                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
// //                 </View>
// //                 <TouchableOpacity onPress={handleAllPatternsPress}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={styles.seeAllButton}
// //                   >
// //                     <Text style={styles.seeAllText}>See All</Text>
// //                     <Ionicons name="arrow-forward" size={14} color={COLORS.surface} />
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </View>

// //               {loadingPatterns ? (
// //                 <ActivityIndicator size="small" color={COLORS.primary} />
// //               ) : (
// //                 <ScrollView 
// //                   horizontal 
// //                   showsHorizontalScrollIndicator={false}
// //                   contentContainerStyle={styles.patternsList}
// //                 >
// //                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
// //                 </ScrollView>
// //               )}
// //             </View>
// //           )}

// //           {/* Games Section */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.sectionIcon}
// //                 >
// //                   <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
// //                 </LinearGradient>
// //                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
// //               </View>
// //               <TouchableOpacity onPress={handleAllGamesPress}>
// //                 <Text style={styles.seeAll}>See All</Text>
// //               </TouchableOpacity>
// //             </View>

// //             {loadingGames ? (
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.gamesLoadingContainer}
// //               >
// //                 <ActivityIndicator size="large" color={COLORS.primary} />
// //                 <Text style={styles.loadingText}>Loading games...</Text>
// //               </LinearGradient>
// //             ) : filteredGames.length > 0 ? (
// //               <View style={styles.gamesContainer}>
// //                 {filteredGames.map((game, index) => (
// //                   <View key={game.id || index}>
// //                     {renderGameCard({ item: game, index })}
// //                   </View>
// //                 ))}
// //                 {loadingMore && (
// //                   <View style={styles.loadingMoreContainer}>
// //                     <ActivityIndicator size="small" color={COLORS.primary} />
// //                   </View>
// //                 )}
// //               </View>
// //             ) : (
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.noGamesContainer}
// //               >
// //                 <Ionicons name="game-controller-outline" size={50} color={COLORS.primary} />
// //                 <Text style={styles.noGamesText}>
// //                   {searchQuery ? 'No games found' : 'No games available at the moment'}
// //                 </Text>
// //                 {searchQuery && (
// //                   <TouchableOpacity 
// //                     style={styles.refreshGamesBtn}
// //                     onPress={clearSearch}
// //                   >
// //                     <LinearGradient
// //                       colors={COLORS.primaryGradient}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 1 }}
// //                       style={styles.refreshGamesGradient}
// //                     >
// //                       <Text style={styles.refreshGamesText}>Clear Search</Text>
// //                     </LinearGradient>
// //                   </TouchableOpacity>
// //                 )}
// //               </LinearGradient>
// //             )}
// //           </View>

// //           {/* Why Play With Us Section with gradient */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <View style={styles.sectionTitleContainer}>
// //                 <LinearGradient
// //                   colors={COLORS.primaryGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.sectionIcon}
// //                 >
// //                   <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
// //                 </LinearGradient>
// //                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
// //               </View>
// //             </View>
            
// //             <LinearGradient
// //               colors={COLORS.winnerGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.infoCard}
// //             >
// //               <View style={styles.infoList}>
// //                 <View style={styles.infoItem}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.infoIcon}
// //                   >
// //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// //                   </LinearGradient>
// //                   <Text style={styles.infoText}>Fast & Fair Games</Text>
// //                 </View>
// //                 <View style={styles.infoItem}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.infoIcon}
// //                   >
// //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// //                   </LinearGradient>
// //                   <Text style={styles.infoText}>Real Players</Text>
// //                 </View>
// //                 <View style={styles.infoItem}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.infoIcon}
// //                   >
// //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// //                   </LinearGradient>
// //                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
// //                 </View>
// //                 <View style={styles.infoItem}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.infoIcon}
// //                   >
// //                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
// //                   </LinearGradient>
// //                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
// //                 </View>
// //               </View>
// //             </LinearGradient>
// //           </View>

// //           <View style={styles.bottomSpace} />
// //         </ScrollView>

// //         {/* Popup */}
// //         <UpcomingGamePopup />

// //         {/* Notifications Modal - FIXED */}
// //         <Modal 
// //           visible={modalVisible} 
// //           transparent={true} 
// //           animationType="slide"
// //           onRequestClose={() => setModalVisible(false)}
// //         >
// //           <View style={styles.modalOverlay}>
// //             <View style={styles.modalContainer}>
// //               <LinearGradient
// //                 colors={['#ffffff', '#f8f9ff']}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.modalContent}
// //               >
// //                 <View style={styles.modalHeader}>
// //                   <View style={styles.modalTitleContainer}>
// //                     <LinearGradient
// //                       colors={COLORS.primaryGradient}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 1 }}
// //                       style={styles.modalIcon}
// //                     >
// //                       <Ionicons name="notifications" size={20} color={COLORS.surface} />
// //                     </LinearGradient>
// //                     <Text style={styles.modalTitle}>Notifications</Text>
// //                   </View>
// //                   <TouchableOpacity 
// //                     onPress={() => setModalVisible(false)}
// //                     style={styles.modalCloseButton}
// //                   >
// //                     <Ionicons name="close" size={24} color={COLORS.textDark} />
// //                   </TouchableOpacity>
// //                 </View>

// //                 {loadingNotifications ? (
// //                   <View style={styles.modalLoadingContainer}>
// //                     <ActivityIndicator size="large" color={COLORS.primary} />
// //                     <Text style={styles.modalLoadingText}>Loading notifications...</Text>
// //                   </View>
// //                 ) : (
// //                   <FlatList
// //                     data={notifications}
// //                     keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// //                     showsVerticalScrollIndicator={false}
// //                     contentContainerStyle={styles.notificationsList}
// //                     renderItem={({ item }) => (
// //                       <View style={styles.modalNotificationItem}>
// //                         <LinearGradient
// //                           colors={COLORS.primaryGradient}
// //                           start={{ x: 0, y: 0 }}
// //                           end={{ x: 1, y: 1 }}
// //                           style={styles.modalNotificationIcon}
// //                         >
// //                           <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
// //                         </LinearGradient>
// //                         <View style={styles.modalNotificationContent}>
// //                           <Text style={styles.modalNotificationTitle}>
// //                             {item.title || "New Update"}
// //                           </Text>
// //                           <Text style={styles.modalNotificationMessage}>
// //                             {item.message || "Check out the new features!"}
// //                           </Text>
// //                           <Text style={styles.modalNotificationDate}>
// //                             {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
// //                           </Text>
// //                         </View>
// //                       </View>
// //                     )}
// //                     ListEmptyComponent={
// //                       <View style={styles.modalEmptyContainer}>
// //                         <Ionicons name="notifications-off-outline" size={60} color={COLORS.textLight} />
// //                         <Text style={styles.modalEmptyText}>No notifications yet</Text>
// //                         <Text style={styles.modalEmptySubtext}>
// //                           We'll notify you when something new arrives
// //                         </Text>
// //                       </View>
// //                     }
// //                   />
// //                 )}

// //                 <TouchableOpacity
// //                   onPress={() => setModalVisible(false)}
// //                   style={styles.modalFooter}
// //                 >
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={styles.modalCloseBtn}
// //                   >
// //                     <Text style={styles.modalCloseBtnText}>Close</Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </LinearGradient>
// //             </View>
// //           </View>
// //         </Modal>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
  
// //   // Loader Styles
// //   loaderContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loaderContent: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     width: width * 0.8,
// //   },
// //   loaderRingsContainer: {
// //     width: 120,
// //     height: 120,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   loaderRing: {
// //     position: 'absolute',
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     borderWidth: 3,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //   },
// //   loaderRing2: {
// //     position: 'absolute',
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     borderWidth: 3,
// //     borderColor: '#FDB800',
// //     borderTopColor: 'transparent',
// //     borderRightColor: 'transparent',
// //   },
// //   loaderCenter: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 5,
// //     elevation: 8,
// //   },
// //   loaderCenterText: {
// //     fontSize: 24,
// //     fontWeight: '900',
// //     color: '#FFFFFF',
// //     textShadowColor: 'rgba(0, 0, 0, 0.2)',
// //     textShadowOffset: { width: 2, height: 2 },
// //     textShadowRadius: 4,
// //   },
// //   loaderTextContainer: {
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   loaderTitle: {
// //     fontSize: 32,
// //     fontWeight: '900',
// //     color: '#FFFFFF',
// //     textShadowColor: 'rgba(0, 0, 0, 0.2)',
// //     textShadowOffset: { width: 2, height: 2 },
// //     textShadowRadius: 4,
// //     marginBottom: 10,
// //   },
// //   loaderPhraseContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   loaderPhrase: {
// //     fontSize: 16,
// //     color: '#FFFFFF',
// //     opacity: 0.9,
// //     marginRight: 5,
// //   },
// //   loaderDots: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   loaderDot: {
// //     width: 4,
// //     height: 4,
// //     borderRadius: 2,
// //     backgroundColor: '#FFFFFF',
// //     marginHorizontal: 2,
// //   },
// //   loaderProgressContainer: {
// //     width: '100%',
// //     height: 4,
// //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //     borderRadius: 2,
// //     overflow: 'hidden',
// //     marginBottom: 20,
// //   },
// //   loaderProgressBar: {
// //     width: '100%',
// //     height: '100%',
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   loaderProgressGlow: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 50,
// //     height: '100%',
// //     backgroundColor: 'rgba(255, 255, 255, 0.5)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   loaderDecorations: {
// //     position: 'relative',
// //     width: '100%',
// //     height: 50,
// //   },
// //   loaderStar: {
// //     position: 'absolute',
// //     left: 20,
// //     top: 0,
// //   },
// //   loaderStar2: {
// //     position: 'absolute',
// //     right: 20,
// //     top: 0,
// //   },
// //   loaderStar3: {
// //     position: 'absolute',
// //     left: '50%',
// //     top: 0,
// //   },
// //   loaderStarText: {
// //     fontSize: 24,
// //     color: '#FDB800',
// //   },
// //   loaderCircle1: {
// //     position: 'absolute',
// //     top: '20%',
// //     left: '10%',
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //   },
// //   loaderCircle2: {
// //     position: 'absolute',
// //     bottom: '20%',
// //     right: '10%',
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //   },
// //   loaderCircle3: {
// //     position: 'absolute',
// //     top: '30%',
// //     right: '20%',
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //   },

// //   // Rest of your existing styles remain the same
// //   header: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   logoContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   cartoonTitleRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
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
// //   spaceLetter: {
// //     width: 20,
// //     marginHorizontal: 0,
// //   },
// //   notification: {
// //     position: "relative",
// //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// //     padding: 10,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //     marginLeft: 8,
// //   },
// //   badge: {
// //     position: "absolute",
// //     top: -4,
// //     right: -4,
// //     backgroundColor: "red",
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   badgeText: {
// //     color: COLORS.surface,
// //     fontSize: 11,
// //     fontWeight: "700",
// //   },
// //   searchWrapper: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //   },
// //   searchBox: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 14,
// //     paddingHorizontal: 12,
// //     paddingVertical: 10,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     marginHorizontal: 10,
// //     fontSize: 15,
// //     color: COLORS.textDark,
// //     padding: 0,
// //   },
// //   sliderSection: {
// //     marginTop: 16,
// //     marginBottom: 8,
// //     paddingHorizontal: 16,
// //   },
// //   sliderWrapper: {
// //     height: 150,
// //     position: 'relative',
// //     borderRadius: 16,
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   sliderLoadingContainer: {
// //     height: 150,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginTop: 16,
// //     marginBottom: 8,
// //     marginHorizontal: 16,
// //     borderRadius: 16,
// //   },
// //   slideContainer: {
// //     width: width - 32,
// //     height: 150,
// //   },
// //   sliderImage: {
// //     width: '100%',
// //     height: '100%',
// //     borderRadius: 16,
// //   },
// //   paginationContainer: {
// //     flexDirection: 'row',
// //     position: 'absolute',
// //     bottom: 10,
// //     alignSelf: 'center',
// //   },
// //   paginationDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     marginHorizontal: 4,
// //   },
// //   paginationDotActive: {
// //     backgroundColor: COLORS.surface,
// //     width: 20,
// //   },
// //   paginationDotInactive: {
// //     backgroundColor: 'rgba(255,255,255,0.5)',
// //   },
// //   loadingText: {
// //     marginTop: 10,
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //   },
// //   patternsSection: {
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
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
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },
// //   seeAll: {
// //     fontSize: 14,
// //     color: COLORS.primary,
// //     fontWeight: '600',
// //   },
// //   seeAllButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //   },
// //   seeAllText: {
// //     fontSize: 13,
// //     color: COLORS.surface,
// //     fontWeight: '600',
// //   },
// //   patternsList: {
// //     paddingHorizontal: 4,
// //     paddingVertical: 8,
// //     gap: 12,
// //   },
// //   patternCardContainer: {
// //     position: 'relative',
// //     marginRight: 12,
// //     marginTop: 8,
// //     paddingTop: 4,
// //   },
// //   compactPatternCard: {
// //     alignItems: 'center',
// //     width: 60,
// //     position: 'relative',
// //   },
// //   glowEffect: {
// //     position: 'absolute',
// //     width: 52,
// //     height: 52,
// //     borderRadius: 26,
// //     top: -2,
// //     left: 4,
// //     zIndex: 0,
// //   },
// //   compactIconWrapper: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 6,
// //     zIndex: 1,
// //     shadowColor: '#FFD700',
// //     shadowOpacity: 0.9,
// //     shadowRadius: 12,
// //     elevation: 8,
// //   },
// //   compactPatternName: {
// //     fontSize: 11,
// //     fontWeight: '500',
// //     color: COLORS.textDark,
// //     textAlign: 'center',
// //     zIndex: 1,
// //   },
// //   // Games Section
// //   section: {
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //   },
// //   gamesLoadingContainer: {
// //     padding: 30,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderRadius: 12,
// //   },
// //   noGamesContainer: {
// //     padding: 30,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   noGamesText: {
// //     marginTop: 12,
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //     textAlign: 'center',
// //   },
// //   refreshGamesBtn: {
// //     marginTop: 16,
// //     borderRadius: 8,
// //     overflow: 'hidden',
// //   },
// //   refreshGamesGradient: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     alignItems: 'center',
// //   },
// //   refreshGamesText: {
// //     color: COLORS.surface,
// //     fontWeight: '600',
// //     fontSize: 14,
// //   },
// //   gamesContainer: {
// //     gap: 12,
// //   },
// //   gameCard: {
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 16,
// //     padding: 16,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //     marginBottom: 12,
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
// //   completedJoinButton: {
// //     backgroundColor: COLORS.completed,
// //   },
// //   joinButtonText: {
// //     color: COLORS.surface,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   winnersContainer: {
// //     gap: 8,
// //   },
// //   winnerCard: {
// //     borderRadius: 10,
// //     padding: 12,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 1,
// //     elevation: 1,
// //   },
// //   winnerInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //   },
// //   winnerAvatar: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   winnerInitial: {
// //     color: COLORS.surface,
// //     fontSize: 14,
// //     fontWeight: '700',
// //   },
// //   winnerName: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   winnerPrize: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginTop: 2,
// //   },
// //   winnerTime: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   infoCard: {
// //     borderRadius: 12,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   infoList: {
// //     gap: 12,
// //   },
// //   infoItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //   },
// //   infoIcon: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   infoText: {
// //     fontSize: 14,
// //     color: COLORS.textDark,
// //     fontWeight: '500',
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },
// //   loadingMoreContainer: {
// //     paddingVertical: 20,
// //     alignItems: 'center',
// //   },
// //   // Popup Styles
// //   popupOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   popupContainer: {
// //     width: width * 0.8,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 28,
// //     padding: 24,
// //     alignItems: 'center',
// //   },
// //   popupIcon: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   popupTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 8,
// //   },
// //   popupGameName: {
// //     fontSize: 16,
// //     color: COLORS.textLight,
// //     marginBottom: 16,
// //     textAlign: 'center',
// //   },
// //   popupTimer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     marginBottom: 20,
// //   },
// //   popupTimerText: {
// //     fontSize: 14,
// //     color: COLORS.textDark,
// //     fontWeight: '500',
// //   },
// //   popupPrize: {
// //     alignItems: 'center',
// //     padding: 12,
// //     borderRadius: 16,
// //     marginBottom: 24,
// //     width: '100%',
// //   },
// //   popupPrizeLabel: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginBottom: 4,
// //   },
// //   popupPrizeValue: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: COLORS.primary,
// //   },
// //   popupPrizeSubtext: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     marginTop: 4,
// //   },
// //   popupActions: {
// //     width: '100%',
// //     gap: 12,
// //   },
// //   popupPrimaryButton: {
// //     paddingVertical: 14,
// //     borderRadius: 20,
// //     alignItems: 'center',
// //   },
// //   popupPrimaryButtonText: {
// //     color: COLORS.surface,
// //     fontSize: 15,
// //     fontWeight: '600',
// //   },
// //   popupSecondaryButton: {
// //     paddingVertical: 10,
// //     alignItems: 'center',
// //   },
// //   popupSecondaryButtonText: {
// //     fontSize: 14,
// //     color: COLORS.textLight,
// //   },
// //   // Modal Styles - FIXED
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0, 0, 0, 0.6)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContainer: {
// //     width: '90%',
// //     maxHeight: '80%',
// //     borderRadius: 24,
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 10,
// //   },
// //   modalContent: {
// //     borderRadius: 24,
// //     padding: 20,
// //     backgroundColor: '#ffffff',
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //   },
// //   modalTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //   },
// //   modalIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },
// //   modalCloseButton: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: '#f0f0f0',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalLoadingContainer: {
// //     padding: 40,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   modalLoadingText: {
// //     marginTop: 12,
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //   },
// //   notificationsList: {
// //     paddingVertical: 8,
// //   },
// //   modalNotificationItem: {
// //     flexDirection: 'row',
// //     padding: 16,
// //     backgroundColor: '#f8f9ff',
// //     borderRadius: 16,
// //     marginBottom: 10,
// //     borderWidth: 1,
// //     borderColor: '#eef2f6',
// //   },
// //   modalNotificationIcon: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 14,
// //   },
// //   modalNotificationContent: {
// //     flex: 1,
// //   },
// //   modalNotificationTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 4,
// //   },
// //   modalNotificationMessage: {
// //     fontSize: 14,
// //     color: COLORS.textLight,
// //     marginBottom: 6,
// //     lineHeight: 20,
// //   },
// //   modalNotificationDate: {
// //     fontSize: 11,
// //     color: '#999',
// //     fontWeight: '500',
// //   },
// //   modalEmptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 50,
// //     paddingHorizontal: 20,
// //   },
// //   modalEmptyText: {
// //     marginTop: 16,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   modalEmptySubtext: {
// //     marginTop: 8,
// //     fontSize: 14,
// //     color: COLORS.textLight,
// //     textAlign: 'center',
// //   },
// //   modalFooter: {
// //     marginTop: 16,
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: COLORS.border,
// //   },
// //   modalCloseBtn: {
// //     paddingVertical: 14,
// //     borderRadius: 14,
// //     alignItems: 'center',
// //   },
// //   modalCloseBtnText: {
// //     color: COLORS.surface,
// //     fontWeight: '600',
// //     fontSize: 16,
// //   },
// // });

// // export default Home;








// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
//   SafeAreaView,
//   StatusBar,
//   TextInput,
//   Animated,
//   Easing,
//   Platform,
// } from "react-native";
// import LinearGradient from 'react-native-linear-gradient';
// import axios from "axios";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from '@react-navigation/native';

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

// // Custom Loader Component with fixed animations
// const CustomLoader = () => {
//   // Animations
//   const bounceAnim = useRef(new Animated.Value(0)).current;
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;
//   const floatAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(-width)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;

//   // Dynamic messages
//   const messages = [
//     "Setting up your game...",
//     "Shuffling Tambola tickets 🎟️",
//     "Picking lucky numbers 🎲",
//     "Joining the game room...",
//     "Almost ready to play 🔥",
//     "Still loading... your luck is being calculated 😄"
//   ];

//   const [currentText, setCurrentText] = useState(0);
//   const [animationLoop, setAnimationLoop] = useState(true);

//   useEffect(() => {
//     // Create animation loops with proper cleanup
//     const animations = [];
    
//     // Title bounce animation
//     const bounceAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, {
//           toValue: -8,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//         Animated.timing(bounceAnim, {
//           toValue: 0,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     animations.push(bounceAnimation);
//     bounceAnimation.start();

//     // Dots animation
//     const animateDot = (dot, delay) => {
//       return Animated.loop(
//         Animated.sequence([
//           Animated.timing(dot, {
//             toValue: -10,
//             duration: 300,
//             delay,
//             useNativeDriver: true,
//           }),
//           Animated.timing(dot, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: true,
//           }),
//         ])
//       );
//     };

//     const dot1Animation = animateDot(dot1, 0);
//     const dot2Animation = animateDot(dot2, 150);
//     const dot3Animation = animateDot(dot3, 300);
    
//     animations.push(dot1Animation, dot2Animation, dot3Animation);
//     dot1Animation.start();
//     dot2Animation.start();
//     dot3Animation.start();

//     // Floating numbers animation
//     const floatAnimation = Animated.loop(
//       Animated.timing(floatAnim, {
//         toValue: 1,
//         duration: 4000,
//         useNativeDriver: true,
//       })
//     );
//     animations.push(floatAnimation);
//     floatAnimation.start();

//     // Ticket slide animation
//     const slideAnimation = Animated.loop(
//       Animated.timing(slideAnim, {
//         toValue: width,
//         duration: 4000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     );
//     animations.push(slideAnimation);
//     slideAnimation.start();

//     // Dynamic text change interval
//     const textInterval = setInterval(() => {
//       if (animationLoop) {
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }).start(() => {
//           setCurrentText((prev) => (prev + 1) % messages.length);
//           Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 300,
//             useNativeDriver: true,
//           }).start();
//         });
//       }
//     }, 2500);

//     // Cleanup function to stop all animations when component unmounts
//     return () => {
//       setAnimationLoop(false);
//       clearInterval(textInterval);
//       // Stop all animations
//       animations.forEach(animation => {
//         if (animation && typeof animation.stop === 'function') {
//           animation.stop();
//         }
//       });
//       // Reset all animated values
//       bounceAnim.stopAnimation();
//       dot1.stopAnimation();
//       dot2.stopAnimation();
//       dot3.stopAnimation();
//       floatAnim.stopAnimation();
//       slideAnim.stopAnimation();
//       fadeAnim.stopAnimation();
//     };
//   }, []); // Empty dependency array ensures animations run once and continue

//   const floatUp = floatAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -120],
//   });

//   // Reset slide animation when it reaches the end
//   useEffect(() => {
//     const listener = slideAnim.addListener(({ value }) => {
//       if (value >= width) {
//         slideAnim.setValue(-width);
//       }
//     });
    
//     return () => {
//       slideAnim.removeListener(listener);
//     };
//   }, [slideAnim, width]);

//   return (
//     <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
//       {/* Floating Numbers */}
//       <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>
//         17
//       </Animated.Text>

//       <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>
//         42
//       </Animated.Text>

//       {/* App Name */}
//       <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>
//         Houzie Timez
//       </Animated.Text>

//       {/* Loader Dots */}
//       <View style={styles.loaderContainerDots}>
//         <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
//         <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
//         <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
//       </View>

//       {/* Dynamic Subtitle */}
//       <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
//         {messages[currentText]}
//       </Animated.Text>

//       {/* Sliding Ticket */}
//       <Animated.View
//         style={[
//           styles.ticketStrip,
//           { transform: [{ translateX: slideAnim }] },
//         ]}
//       >
//         <Text style={styles.ticketText}>🎟️ 12 34 56 78 90</Text>
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const Home = () => {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState([]);
//   const [sliders, setSliders] = useState([]);
//   const [games, setGames] = useState([]);
//   const [filteredGames, setFilteredGames] = useState([]);
//   const [patterns, setPatterns] = useState([]);
//   const [loadingPatterns, setLoadingPatterns] = useState(true);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loadingNotifications, setLoadingNotifications] = useState(true);
//   const [loadingSliders, setLoadingSliders] = useState(true);
//   const [loadingGames, setLoadingGames] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Popup state
//   const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
//   const [upcomingGame, setUpcomingGame] = useState(null);
//   const [popupShown, setPopupShown] = useState(false);
  
//   // Animation for popup
//   const slideAnimPopup = useRef(new Animated.Value(300)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;
  
//   // Animation values for buttons and patterns
//   const buttonScaleAnims = useRef([]);
//   const patternScaleAnims = useRef([]);
//   const glowAnims = useRef([]);
//   const letterAnims = useRef([]);
  
//   // Pagination state for games
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
  
//   const sliderRef = useRef(null);
//   const scrollInterval = useRef(null);

//   // Filter options
//   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
//   const [activeFilter, setActiveFilter] = useState('All Games');

//   // Initialize animations
//   useEffect(() => {
//     buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
//     buttonScaleAnims.current.forEach((anim, index) => {
//       startPulseAnimation(anim);
//     });
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
//         Animated.delay(200),
//       ]).start(({ finished }) => {
//         if (finished && isAnimating) {
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

//   // Initialize pattern animations when patterns load
//   useEffect(() => {
//     if (patterns.length > 0) {
//       patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
//       glowAnims.current = patterns.map(() => new Animated.Value(0));
      
//       patternScaleAnims.current.forEach((anim, index) => {
//         startPulseAnimation(anim, 1000 + (index * 200));
//       });
      
//       glowAnims.current.forEach((anim, index) => {
//         startGlowAnimation(anim, 1500 + (index * 300));
//       });
//     }
//   }, [patterns.length]);

//   // Pulse animation function
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

//   // Glow animation function
//   const startGlowAnimation = (anim, duration = 1500) => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(anim, {
//           toValue: 1,
//           duration: duration / 2,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease)
//         }),
//         Animated.timing(anim, {
//           toValue: 0,
//           duration: duration / 2,
//           useNativeDriver: true,
//           easing: Easing.inOut(Easing.ease)
//         })
//       ])
//     ).start();
//   };

//   // Function to calculate prize pool from pattern rewards
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

//   useEffect(() => {
//     fetchInitialData();
    
//     return () => {
//       if (scrollInterval.current) {
//         clearInterval(scrollInterval.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (games.length > 0 && !popupShown) {
//       setTimeout(() => {
//         checkUpcomingGame();
//       }, 1500);
//     }
//   }, [games, popupShown]);

//   useEffect(() => {
//     if (sliders.length > 1) {
//       startAutoScroll();
//     }
//     return () => {
//       if (scrollInterval.current) {
//         clearInterval(scrollInterval.current);
//       }
//     };
//   }, [sliders.length]);

//   // Filter games based on search and active filter
//   useEffect(() => {
//     let filtered = games;
    
//     if (searchQuery.trim() !== '') {
//       filtered = filtered.filter(game =>
//         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     if (activeFilter === 'Live Now') {
//       filtered = filtered.filter(game => game.status === 'live');
//     } else if (activeFilter === 'Upcoming') {
//       filtered = filtered.filter(game => game.status === 'scheduled');
//     } else if (activeFilter === 'Completed') {
//       filtered = filtered.filter(game => game.status === 'completed');
//     }
    
//     setFilteredGames(filtered);
//   }, [searchQuery, games, activeFilter]);

//   useEffect(() => {
//     if (upcomingGamePopup) {
//       Animated.parallel([
//         Animated.timing(opacityAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnimPopup, {
//           toValue: 0,
//           duration: 400,
//           easing: Easing.out(Easing.back(1.2)),
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       opacityAnim.setValue(0);
//       slideAnimPopup.setValue(300);
//     }
//   }, [upcomingGamePopup]);

//   const startAutoScroll = () => {
//     if (scrollInterval.current) {
//       clearInterval(scrollInterval.current);
//     }
    
//     scrollInterval.current = setInterval(() => {
//       if (sliders.length > 0) {
//         let nextIndex = activeSlide + 1;
//         if (nextIndex >= sliders.length) {
//           nextIndex = 0;
//         }
        
//         setActiveSlide(nextIndex);
//         if (sliderRef.current) {
//           const slideWidth = width - 32;
//           sliderRef.current.scrollToOffset({
//             offset: nextIndex * slideWidth,
//             animated: true
//           });
//         }
//       }
//     }, 3000);
//   };

//   const fetchInitialData = async () => {
//     try {
//       await Promise.all([
//         fetchNotifications(),
//         fetchSliders(),
//         fetchGames(1),
//         fetchPatterns()
//       ]);
//     } catch (error) {
//       console.log("Error fetching initial data:", error);
//     }
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     setGames([]);
//     setFilteredGames([]);
//     setPopupShown(false);
//     Promise.all([
//       fetchNotifications(),
//       fetchSliders(),
//       fetchGames(1),
//       fetchPatterns()
//     ]).finally(() => setRefreshing(false));
//   }, []);

//   const checkUpcomingGame = () => {
//     try {
//       const now = new Date();
      
//       const scheduledGames = games.filter(game => 
//         game.status === 'scheduled'
//       );
      
//       if (scheduledGames.length === 0) return;
      
//       const gamesWithEndDateTime = scheduledGames.map(game => {
//         let endDateTime;
        
//         try {
//           if (game.ticket_request_end_date) {
//             endDateTime = new Date(game.ticket_request_end_date);
//           } else {
//             endDateTime = new Date(game.game_date);
//           }
//         } catch (e) {
//           endDateTime = new Date();
//         }
        
//         return {
//           ...game,
//           endDateTime
//         };
//       });
      
//       const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
//       const earliestEndGame = sortedGames[0];
      
//       const timeDiff = earliestEndGame.endDateTime - now;
      
//       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
//         setUpcomingGame(earliestEndGame);
//         setUpcomingGamePopup(true);
//         setPopupShown(true);
//       }
//     } catch (error) {
//       console.log("Error checking upcoming game:", error);
//     }
//   };

//   const getTimeRemaining = (endDateTime) => {
//     const now = new Date();
//     const diff = endDateTime - now;
    
//     if (diff <= 0) return "Ending soon";
    
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
//     if (days > 0) {
//       return `${days}d ${hours}h left`;
//     } else if (hours > 0) {
//       return `${hours}h ${minutes}m left`;
//     } else {
//       return `${minutes}m left`;
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/notifications",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.status) {
//         setNotifications(res.data.data);
//       }
//     } catch (error) {
//       console.log("Error fetching notifications:", error);
//     } finally {
//       setLoadingNotifications(false);
//     }
//   };

//   const fetchSliders = async () => {
//     try {
//       setLoadingSliders(true);
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/sliders"
//       );
//       if (res.data.success) {
//         setSliders(res.data.data || []);
//       }
//     } catch (error) {
//       console.log("Error fetching sliders:", error);
//       setSliders([]);
//     } finally {
//       setLoadingSliders(false);
//     }
//   };

//   const fetchGames = async (page = 1) => {
//     try {
//       if (page === 1) {
//         setLoadingGames(true);
//       }
      
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
      
//       const res = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data.success) {
//         const newGames = res.data.games.data || [];
//         const pagination = res.data.games;
        
//         if (page === 1) {
//           setGames(newGames);
//           setFilteredGames(newGames);
//         } else {
//           setGames(prev => [...prev, ...newGames]);
//           setFilteredGames(prev => [...prev, ...newGames]);
//         }
        
//         setCurrentPage(pagination.current_page);
//         setLastPage(pagination.last_page);
//       }
//     } catch (error) {
//       console.log("Error fetching games:", error);
//     } finally {
//       if (page === 1) {
//         setLoadingGames(false);
//       }
//       setLoadingMore(false);
//     }
//   };

//   const fetchPatterns = async () => {
//     try {
//       setLoadingPatterns(true);
//       const token = await AsyncStorage.getItem("token");
      
//       if (!token) {
//         setLoadingPatterns(false);
//         return;
//       }

//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/patterns/available",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         }
//       );

//       if (response.data && response.data.status) {
//         const patternsData = response.data.data?.patterns || [];
        
//         const patternSequence = [
//           'top line',
//           'middle line', 
//           'bottom line',
//           'breakfast',
//           'lunch',
//           'dinner',
//           'four corners',
//           'bamboo',
//           'early five',
//           'non claimers',
//           'full house'
//         ];
        
//         const sortedPatterns = patternsData.sort((a, b) => {
//           const aName = (a.display_name || a.pattern_name || '').toLowerCase();
//           const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
//           const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
//           const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
//           if (aIndex === -1) return 1;
//           if (bIndex === -1) return -1;
          
//           return aIndex - bIndex;
//         });
        
//         setPatterns(sortedPatterns.slice(0, 8));
//       }
//     } catch (error) {
//       console.log('Error fetching patterns in Home:', error);
//     } finally {
//       setLoadingPatterns(false);
//     }
//   };

//   const loadMoreGames = () => {
//     if (!loadingMore && currentPage < lastPage) {
//       setLoadingMore(true);
//       fetchGames(currentPage + 1);
//     }
//   };

//   const handleGamePress = (game) => {
//     navigation.navigate("GameDetails", { game });
//   };

//   const handleAllGamesPress = () => {
//     navigation.navigate("Game");
//   };

//   const handleAllPatternsPress = () => {
//     navigation.navigate("UserGamePatterns");
//   };

//   const handleViewAllWinners = () => {
//     navigation.navigate("Game");
//   };

//   const handlePatternPress = (pattern) => {
//     navigation.navigate("UserGamePatterns", { 
//       selectedPatternId: pattern.id,
//       selectedPattern: pattern 
//     });
//   };

//   const handlePopupJoinNow = () => {
//     setUpcomingGamePopup(false);
//     if (upcomingGame) {
//       navigation.navigate("GameDetails", { game: upcomingGame });
//     }
//   };

//   const handlePopupLater = () => {
//     setUpcomingGamePopup(false);
//   };

//   const getPatternIcon = (pattern) => {
//     const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
//     const iconMap = {
//       'bamboo': 'leaf',
//       'bottom line': 'arrow-down',
//       'breakfast': 'cafe',
//       'dinner': 'restaurant',
//       'early five': '5',
//       'four corners': 'apps',
//       'full house': 'home',
//       'lunch': 'fast-food',
//       'middle line': 'remove',
//       'non claimer': 'close',
//       'top line': 'arrow-up'
//     };
    
//     for (const [key, icon] of Object.entries(iconMap)) {
//       if (patternName.includes(key)) return icon;
//     }
    
//     return 'grid-outline';
//   };

//   const formatPatternName = (name) => {
//     if (!name) return 'Unknown Pattern';
//     return name
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

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
//         <View style={styles.logoContainer}>
//           <View style={styles.cartoonTitleRow}>
//             {letters.map((item) => {
//               const animValue = letterAnims.current && letterAnims.current[item.index] 
//                 ? letterAnims.current[item.index] 
//                 : new Animated.Value(1);
              
//               return (
//                 <Animated.Text
//                   key={`letter-${item.index}`}
//                   style={[
//                     styles.cartoonLetter,
//                     item.isSpecial && styles.specialCartoonLetter,
//                     item.isSpace && { width: item.width || 20 },
//                     { 
//                       transform: [{ scale: animValue }],
//                       marginHorizontal: item.isSpace ? 0 : 2,
//                     }
//                   ]}
//                 >
//                   {item.char}
//                 </Animated.Text>
//               );
//             })}
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={styles.notification}
//           onPress={() => setModalVisible(true)}
//         >
//           <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
//           {notifications.length > 0 && (
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{notifications.length}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </LinearGradient>
//     );
//   };

//   // Animated pattern card with gradient and glow
//   const renderPatternCard = (pattern, index) => {
//     const icon = getPatternIcon(pattern);
//     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
//     const patterns = [
//       'Top Line',
//       'Middle',
//       'Bottom',
//       'Breakfast',
//       'Lunch',
//       'Dinner',
//       'Corners',
//       'Bamboo',
//     ];
    
//     const patternName = patterns[index % patterns.length];
//     const gradientColors = COLORS.patternGradients[index % COLORS.patternGradients.length];
    
//     const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
//     const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
//     const glowOpacity = glowAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [0, 0.7]
//     });
    
//     return (
//       <Animated.View
//         key={pattern.id}
//         style={[
//           styles.patternCardContainer,
//           {
//             transform: [{ scale: scaleAnim }]
//           }
//         ]}
//       >
//         <TouchableOpacity 
//           style={styles.compactPatternCard}
//           onPress={() => handlePatternPress(pattern)}
//           activeOpacity={0.7}
//         >
//           <Animated.View style={[
//             styles.glowEffect,
//             {
//               backgroundColor: gradientColors[0],
//               opacity: glowOpacity,
//               transform: [{ scale: 1.2 }]
//             }
//           ]} />
//           <LinearGradient
//             colors={gradientColors}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.compactIconWrapper}
//           >
//             <Ionicons name={icon} size={18} color="#FFFFFF" />
//           </LinearGradient>
//           <Text style={styles.compactPatternName} numberOfLines={1}>
//             {patternName}
//           </Text>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   const renderSliderItem = ({ item }) => (
//     <View style={styles.slideContainer}>
//       <Image
//         source={{ 
//           uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
//         }}
//         style={styles.sliderImage}
//         resizeMode="cover"
//       />
//     </View>
//   );

//   const handleScroll = (event) => {
//     const slideSize = event.nativeEvent.layoutMeasurement.width;
//     const contentOffset = event.nativeEvent.contentOffset.x;
//     const currentIndex = Math.floor(contentOffset / slideSize);
    
//     if (currentIndex !== activeSlide && currentIndex < sliders.length) {
//       setActiveSlide(currentIndex);
//     }
//   };

//   const renderPagination = () => {
//     if (sliders.length <= 1) return null;
    
//     return (
//       <View style={styles.paginationContainer}>
//         {sliders.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.paginationDot,
//               activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
//             ]}
//           />
//         ))}
//       </View>
//     );
//   };

//   const renderGameCard = ({ item: game, index }) => {
//     if (!game) return null;
    
//     const ticketCost = parseFloat(game.ticket_cost || 0);
//     const isPaid = game.ticket_type === "paid";
//     const isLive = game.status === 'live';
//     const isScheduled = game.status === 'scheduled';
//     const isCompleted = game.status === 'completed';
    
//     const prizePool = calculatePrizePool(game);
    
//     if (!buttonScaleAnims.current[index]) {
//       buttonScaleAnims.current[index] = new Animated.Value(1);
//       startPulseAnimation(buttonScaleAnims.current[index]);
//     }
    
//     const buttonScale = buttonScaleAnims.current[index];
    
//     return (
//       <TouchableOpacity
//         style={styles.gameCard}
//         activeOpacity={0.9}
//         onPress={() => handleGamePress(game)}
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
//           style={[
//             styles.statusBadge,
//           ]}
//         >
//           <Ionicons 
//             name={
//               isLive ? 'radio-button-on' : 
//               isCompleted ? 'checkmark-circle' :
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

//         <View style={styles.cardHeader}>
//           <View style={styles.gameIconContainer}>
//             <LinearGradient
//               colors={COLORS.prizeGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gameIconWrapper}
//             >
//               <MaterialIcons name="confirmation-number" size={32} color={COLORS.primary} />
//             </LinearGradient>
//             <View style={styles.gameInfo}>
//               <Text style={styles.gameName} numberOfLines={1}>
//                 {game.game_name || "Tambola Game"}
//               </Text>
//               <Text style={styles.gameId}>
//                 ID: {game.game_code || "N/A"}
//               </Text>
//             </View>
//           </View>
          
//           <LinearGradient
//             colors={isPaid ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={[
//               styles.gameTypeBadge,
//             ]}
//           >
//             {isPaid ? (
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
//                   {game.game_date_formatted || game.game_date || "Date TBA"}
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
//                   {game.game_time_formatted || game.game_start_time || "Time TBA"}
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
//             <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.surface} />
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
//             style={[
//               styles.joinButton,
//               isCompleted && styles.completedJoinButton
//             ]}
//             onPress={() => handleGamePress(game)}
//             activeOpacity={0.9}
//           >
//             <LinearGradient
//               colors={isCompleted ? COLORS.completedGradient : COLORS.primaryGradient}
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
//                   : isLive
//                     ? 'JOIN GAME' 
//                     : 'VIEW DETAILS'}
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

//   const clearSearch = () => {
//     setSearchQuery('');
//   };

//   const renderFooter = () => {
//     if (!loadingMore) return null;
//     return (
//       <View style={styles.loadingMoreContainer}>
//         <ActivityIndicator size="small" color={COLORS.primary} />
//       </View>
//     );
//   };

//   const UpcomingGamePopup = () => {
//     if (!upcomingGame) return null;
    
//     const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
//     const isPaid = upcomingGame.ticket_type === "paid";
//     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
//     const timeRemaining = getTimeRemaining(endDateTime);
    
//     const prizePool = calculatePrizePool(upcomingGame);
    
//     return (
//       <Modal
//         visible={upcomingGamePopup}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={handlePopupLater}
//       >
//         <View style={styles.popupOverlay}>
//           <Animated.View 
//             style={[
//               styles.popupContainer,
//               {
//                 opacity: opacityAnim,
//                 transform: [{ translateY: slideAnimPopup }]
//               }
//             ]}
//           >
//             <LinearGradient
//               colors={COLORS.primaryGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.popupIcon}
//             >
//               <Ionicons name="timer-outline" size={32} color={COLORS.surface} />
//             </LinearGradient>
            
//             <Text style={styles.popupTitle}>Booking closing soon!</Text>
//             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
//             <LinearGradient
//               colors={COLORS.winnerGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.popupTimer}
//             >
//               <Ionicons name="time-outline" size={16} color={COLORS.primary} />
//               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
//             </LinearGradient>
            
//             <LinearGradient
//               colors={COLORS.prizeGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.popupPrize}
//             >
//               <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
//               <Text style={styles.popupPrizeValue}>
//                 {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
//               </Text>
//               {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
//                 <Text style={styles.popupPrizeSubtext}>
//                   {upcomingGame.pattern_rewards.length} Patterns
//                 </Text>
//               )}
//             </LinearGradient>
            
//             <View style={styles.popupActions}>
//               <TouchableOpacity 
//                 onPress={handlePopupJoinNow}
//               >
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.popupPrimaryButton}
//                 >
//                   <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.popupSecondaryButton}
//                 onPress={handlePopupLater}
//               >
//                 <Text style={styles.popupSecondaryButtonText}>Later</Text>
//               </TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>
//     );
//   };

//   if (loadingGames && games.length === 0) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <CustomLoader />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

//       <View style={styles.container}>
//         {/* Header with gradient */}
//         <Header />

//         {/* Search Bar with gradient */}
//         <LinearGradient
//           colors={COLORS.primaryGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.searchWrapper}
//         >
//           <View style={styles.searchBox}>
//             <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
//             <TextInput
//               placeholder="Search games by name or ID..."
//               placeholderTextColor={COLORS.textLight}
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               returnKeyType="search"
//             />
//             {searchQuery.length > 0 ? (
//               <TouchableOpacity onPress={clearSearch}>
//                 <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
//               </TouchableOpacity>
//             ) : (
//               <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
//             )}
//           </View>
//         </LinearGradient>

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={COLORS.primary}
//               colors={[COLORS.primary]}
//             />
//           }
//         >
//           {/* Slider Section */}
//           {loadingSliders ? (
//             <LinearGradient
//               colors={COLORS.winnerGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.sliderLoadingContainer}
//             >
//               <ActivityIndicator size="large" color={COLORS.primary} />
//               <Text style={styles.loadingText}>Loading offers...</Text>
//             </LinearGradient>
//           ) : sliders.length > 0 ? (
//             <View style={styles.sliderSection}>
//               <View style={styles.sliderWrapper}>
//                 <FlatList
//                   ref={sliderRef}
//                   data={sliders}
//                   renderItem={renderSliderItem}
//                   keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                   horizontal
//                   pagingEnabled
//                   showsHorizontalScrollIndicator={false}
//                   onScroll={handleScroll}
//                   scrollEventThrottle={16}
//                 />
                
//                 {/* Pagination Dots */}
//                 {renderPagination()}
//               </View>
//             </View>
//           ) : null}

//           {/* Patterns Section - Now with gradient */}
//           {patterns.length > 0 && (
//             <View style={styles.patternsSection}>
//               <View style={styles.sectionHeader}>
//                 <View style={styles.sectionTitleContainer}>
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.sectionIcon}
//                   >
//                     <Ionicons name="grid-outline" size={16} color={COLORS.surface} />
//                   </LinearGradient>
//                   <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
//                 </View>
//                 <TouchableOpacity onPress={handleAllPatternsPress}>
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.seeAllButton}
//                   >
//                     <Text style={styles.seeAllText}>See All</Text>
//                     <Ionicons name="arrow-forward" size={14} color={COLORS.surface} />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>

//               {loadingPatterns ? (
//                 <ActivityIndicator size="small" color={COLORS.primary} />
//               ) : (
//                 <ScrollView 
//                   horizontal 
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.patternsList}
//                 >
//                   {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
//                 </ScrollView>
//               )}
//             </View>
//           )}

//           {/* Games Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionTitleContainer}>
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.sectionIcon}
//                 >
//                   <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
//                 </LinearGradient>
//                 <Text style={styles.sectionTitle}>ALL GAMES</Text>
//               </View>
//               <TouchableOpacity onPress={handleAllGamesPress}>
//                 <Text style={styles.seeAll}>See All</Text>
//               </TouchableOpacity>
//             </View>

//             {loadingGames ? (
//               <LinearGradient
//                 colors={COLORS.winnerGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.gamesLoadingContainer}
//               >
//                 <ActivityIndicator size="large" color={COLORS.primary} />
//                 <Text style={styles.loadingText}>Loading games...</Text>
//               </LinearGradient>
//             ) : filteredGames.length > 0 ? (
//               <View style={styles.gamesContainer}>
//                 {filteredGames.map((game, index) => (
//                   <View key={game.id || index}>
//                     {renderGameCard({ item: game, index })}
//                   </View>
//                 ))}
//                 {loadingMore && (
//                   <View style={styles.loadingMoreContainer}>
//                     <ActivityIndicator size="small" color={COLORS.primary} />
//                   </View>
//                 )}
//               </View>
//             ) : (
//               <LinearGradient
//                 colors={COLORS.winnerGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.noGamesContainer}
//               >
//                 <Ionicons name="game-controller-outline" size={50} color={COLORS.primary} />
//                 <Text style={styles.noGamesText}>
//                   {searchQuery ? 'No games found' : 'No games available at the moment'}
//                 </Text>
//                 {searchQuery && (
//                   <TouchableOpacity 
//                     style={styles.refreshGamesBtn}
//                     onPress={clearSearch}
//                   >
//                     <LinearGradient
//                       colors={COLORS.primaryGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 1 }}
//                       style={styles.refreshGamesGradient}
//                     >
//                       <Text style={styles.refreshGamesText}>Clear Search</Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 )}
//               </LinearGradient>
//             )}
//           </View>

//           {/* Why Play With Us Section with gradient */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={styles.sectionTitleContainer}>
//                 <LinearGradient
//                   colors={COLORS.primaryGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.sectionIcon}
//                 >
//                   <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
//                 </LinearGradient>
//                 <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
//               </View>
//             </View>
            
//             <LinearGradient
//               colors={COLORS.winnerGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.infoCard}
//             >
//               <View style={styles.infoList}>
//                 <View style={styles.infoItem}>
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.infoIcon}
//                   >
//                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
//                   </LinearGradient>
//                   <Text style={styles.infoText}>Fast & Fair Games</Text>
//                 </View>
//                 <View style={styles.infoItem}>
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.infoIcon}
//                   >
//                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
//                   </LinearGradient>
//                   <Text style={styles.infoText}>Real Players</Text>
//                 </View>
//                 <View style={styles.infoItem}>
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.infoIcon}
//                   >
//                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
//                   </LinearGradient>
//                   <Text style={styles.infoText}>24x7 Rooms Available</Text>
//                 </View>
//                 <View style={styles.infoItem}>
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.infoIcon}
//                   >
//                     <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
//                   </LinearGradient>
//                   <Text style={styles.infoText}>Safe & Fun Experience</Text>
//                 </View>
//               </View>
//             </LinearGradient>
//           </View>

//           <View style={styles.bottomSpace} />
//         </ScrollView>

//         {/* Popup */}
//         <UpcomingGamePopup />

//         {/* Notifications Modal - FIXED */}
//         <Modal 
//           visible={modalVisible} 
//           transparent={true} 
//           animationType="slide"
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <LinearGradient
//                 colors={['#ffffff', '#f8f9ff']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.modalContent}
//               >
//                 <View style={styles.modalHeader}>
//                   <View style={styles.modalTitleContainer}>
//                     <LinearGradient
//                       colors={COLORS.primaryGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 1 }}
//                       style={styles.modalIcon}
//                     >
//                       <Ionicons name="notifications" size={20} color={COLORS.surface} />
//                     </LinearGradient>
//                     <Text style={styles.modalTitle}>Notifications</Text>
//                   </View>
//                   <TouchableOpacity 
//                     onPress={() => setModalVisible(false)}
//                     style={styles.modalCloseButton}
//                   >
//                     <Ionicons name="close" size={24} color={COLORS.textDark} />
//                   </TouchableOpacity>
//                 </View>

//                 {loadingNotifications ? (
//                   <View style={styles.modalLoadingContainer}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.modalLoadingText}>Loading notifications...</Text>
//                   </View>
//                 ) : (
//                   <FlatList
//                     data={notifications}
//                     keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={styles.notificationsList}
//                     renderItem={({ item }) => (
//                       <View style={styles.modalNotificationItem}>
//                         <LinearGradient
//                           colors={COLORS.primaryGradient}
//                           start={{ x: 0, y: 0 }}
//                           end={{ x: 1, y: 1 }}
//                           style={styles.modalNotificationIcon}
//                         >
//                           <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
//                         </LinearGradient>
//                         <View style={styles.modalNotificationContent}>
//                           <Text style={styles.modalNotificationTitle}>
//                             {item.title || "New Update"}
//                           </Text>
//                           <Text style={styles.modalNotificationMessage}>
//                             {item.message || "Check out the new features!"}
//                           </Text>
//                           <Text style={styles.modalNotificationDate}>
//                             {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
//                           </Text>
//                         </View>
//                       </View>
//                     )}
//                     ListEmptyComponent={
//                       <View style={styles.modalEmptyContainer}>
//                         <Ionicons name="notifications-off-outline" size={60} color={COLORS.textLight} />
//                         <Text style={styles.modalEmptyText}>No notifications yet</Text>
//                         <Text style={styles.modalEmptySubtext}>
//                           We'll notify you when something new arrives
//                         </Text>
//                       </View>
//                     }
//                   />
//                 )}

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={styles.modalFooter}
//                 >
//                   <LinearGradient
//                     colors={COLORS.primaryGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.modalCloseBtn}
//                   >
//                     <Text style={styles.modalCloseBtnText}>Close</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>
//         </Modal>
//       </View>
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
//     backgroundColor: COLORS.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Loader Styles
//   loaderContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   title: {
//     fontSize: 36,
//     fontWeight: '900',
//     color: '#fff',
//     letterSpacing: 2,
//     marginBottom: 20,
//   },

//   loaderContainerDots: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },

//   dot: {
//     width: 12,
//     height: 12,
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     marginHorizontal: 5,
//   },

//   subtitle: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginTop: 5,
//   },

//   number: {
//     position: 'absolute',
//     left: 30,
//     bottom: 0,
//     fontSize: 28,
//     color: '#fff',
//     opacity: 0.5,
//     fontWeight: 'bold',
//   },

//   number2: {
//     position: 'absolute',
//     right: 30,
//     bottom: 0,
//     fontSize: 28,
//     color: '#fff',
//     opacity: 0.5,
//     fontWeight: 'bold',
//   },

//   ticketStrip: {
//     position: 'absolute',
//     bottom: 60,
//     backgroundColor: '#ffffff90',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },

//   ticketText: {
//     fontWeight: 'bold',
//     color: '#333',
//   },

//   // Rest of your existing styles remain the same
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   cartoonTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
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
//   spaceLetter: {
//     width: 20,
//     marginHorizontal: 0,
//   },
//   notification: {
//     position: "relative",
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     padding: 10,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//     marginLeft: 8,
//   },
//   badge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     backgroundColor: "red",
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//   },
//   badgeText: {
//     color: COLORS.surface,
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   searchWrapper: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   searchBox: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   searchInput: {
//     flex: 1,
//     marginHorizontal: 10,
//     fontSize: 15,
//     color: COLORS.textDark,
//     padding: 0,
//   },
//   sliderSection: {
//     marginTop: 16,
//     marginBottom: 8,
//     paddingHorizontal: 16,
//   },
//   sliderWrapper: {
//     height: 150,
//     position: 'relative',
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sliderLoadingContainer: {
//     height: 150,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 16,
//     marginBottom: 8,
//     marginHorizontal: 16,
//     borderRadius: 16,
//   },
//   slideContainer: {
//     width: width - 32,
//     height: 150,
//   },
//   sliderImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 16,
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 10,
//     alignSelf: 'center',
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   paginationDotActive: {
//     backgroundColor: COLORS.surface,
//     width: 20,
//   },
//   paginationDotInactive: {
//     backgroundColor: 'rgba(255,255,255,0.5)',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: COLORS.textLight,
//     fontSize: 14,
//   },
//   patternsSection: {
//     paddingHorizontal: 16,
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
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
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.textDark,
//   },
//   seeAll: {
//     fontSize: 14,
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   seeAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   seeAllText: {
//     fontSize: 13,
//     color: COLORS.surface,
//     fontWeight: '600',
//   },
//   patternsList: {
//     paddingHorizontal: 4,
//     paddingVertical: 8,
//     gap: 12,
//   },
//   patternCardContainer: {
//     position: 'relative',
//     marginRight: 12,
//     marginTop: 8,
//     paddingTop: 4,
//   },
//   compactPatternCard: {
//     alignItems: 'center',
//     width: 60,
//     position: 'relative',
//   },
//   glowEffect: {
//     position: 'absolute',
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     top: -2,
//     left: 4,
//     zIndex: 0,
//   },
//   compactIconWrapper: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//     zIndex: 1,
//     shadowColor: '#FFD700',
//     shadowOpacity: 0.9,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   compactPatternName: {
//     fontSize: 11,
//     fontWeight: '500',
//     color: COLORS.textDark,
//     textAlign: 'center',
//     zIndex: 1,
//   },
//   // Games Section
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 24,
//   },
//   gamesLoadingContainer: {
//     padding: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 12,
//   },
//   noGamesContainer: {
//     padding: 30,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   noGamesText: {
//     marginTop: 12,
//     color: COLORS.textLight,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   refreshGamesBtn: {
//     marginTop: 16,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   refreshGamesGradient: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   refreshGamesText: {
//     color: COLORS.surface,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   gamesContainer: {
//     gap: 12,
//   },
//   gameCard: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     position: 'relative',
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//     marginBottom: 12,
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
//   completedJoinButton: {
//     backgroundColor: COLORS.completed,
//   },
//   joinButtonText: {
//     color: COLORS.surface,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   winnersContainer: {
//     gap: 8,
//   },
//   winnerCard: {
//     borderRadius: 10,
//     padding: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 1,
//     elevation: 1,
//   },
//   winnerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   winnerAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   winnerInitial: {
//     color: COLORS.surface,
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   winnerName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },
//   winnerPrize: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     marginTop: 2,
//   },
//   winnerTime: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   infoCard: {
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   infoList: {
//     gap: 12,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   infoIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   infoText: {
//     fontSize: 14,
//     color: COLORS.textDark,
//     fontWeight: '500',
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   loadingMoreContainer: {
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
//   // Popup Styles
//   popupOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   popupContainer: {
//     width: width * 0.8,
//     backgroundColor: COLORS.surface,
//     borderRadius: 28,
//     padding: 24,
//     alignItems: 'center',
//   },
//   popupIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   popupTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 8,
//   },
//   popupGameName: {
//     fontSize: 16,
//     color: COLORS.textLight,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   popupTimer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   popupTimerText: {
//     fontSize: 14,
//     color: COLORS.textDark,
//     fontWeight: '500',
//   },
//   popupPrize: {
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 24,
//     width: '100%',
//   },
//   popupPrizeLabel: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     marginBottom: 4,
//   },
//   popupPrizeValue: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   popupPrizeSubtext: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     marginTop: 4,
//   },
//   popupActions: {
//     width: '100%',
//     gap: 12,
//   },
//   popupPrimaryButton: {
//     paddingVertical: 14,
//     borderRadius: 20,
//     alignItems: 'center',
//   },
//   popupPrimaryButtonText: {
//     color: COLORS.surface,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   popupSecondaryButton: {
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   popupSecondaryButtonText: {
//     fontSize: 14,
//     color: COLORS.textLight,
//   },
//   // Modal Styles - FIXED
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '90%',
//     maxHeight: '80%',
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   modalContent: {
//     borderRadius: 24,
//     padding: 20,
//     backgroundColor: '#ffffff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   modalTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   modalIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.textDark,
//   },
//   modalCloseButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalLoadingContainer: {
//     padding: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalLoadingText: {
//     marginTop: 12,
//     color: COLORS.textLight,
//     fontSize: 14,
//   },
//   notificationsList: {
//     paddingVertical: 8,
//   },
//   modalNotificationItem: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: '#f8f9ff',
//     borderRadius: 16,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#eef2f6',
//   },
//   modalNotificationIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   modalNotificationContent: {
//     flex: 1,
//   },
//   modalNotificationTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 4,
//   },
//   modalNotificationMessage: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginBottom: 6,
//     lineHeight: 20,
//   },
//   modalNotificationDate: {
//     fontSize: 11,
//     color: '#999',
//     fontWeight: '500',
//   },
//   modalEmptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 50,
//     paddingHorizontal: 20,
//   },
//   modalEmptyText: {
//     marginTop: 16,
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },
//   modalEmptySubtext: {
//     marginTop: 8,
//     fontSize: 14,
//     color: COLORS.textLight,
//     textAlign: 'center',
//   },
//   modalFooter: {
//     marginTop: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//   },
//   modalCloseBtn: {
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: 'center',
//   },
//   modalCloseBtnText: {
//     color: COLORS.surface,
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default Home;








import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
  Easing,
  Platform,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

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

// Custom Loader Component with fixed animations
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
    "Setting up your game...",
    "Shuffling Tambola tickets 🎟️",
    "Picking lucky numbers 🎲",
    "Joining the game room...",
    "Almost ready to play 🔥",
    "Still loading... your luck is being calculated 😄"
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
  }, []);

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
        <Text style={styles.ticketText}>🎟️ 12 34 56 78 90</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loadingPatterns, setLoadingPatterns] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingSliders, setLoadingSliders] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Popup state
  const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
  const [upcomingGame, setUpcomingGame] = useState(null);
  const [popupShown, setPopupShown] = useState(false);
  
  // Animation for popup
  const slideAnimPopup = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Animation values for buttons and patterns
  const buttonScaleAnims = useRef([]);
  const patternScaleAnims = useRef([]);
  const glowAnims = useRef([]);
  const letterAnims = useRef([]);
  
  // Pagination state for games
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const sliderRef = useRef(null);
  const scrollInterval = useRef(null);
  const scrollTimeout = useRef(null);

  // Filter options
  const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
  const [activeFilter, setActiveFilter] = useState('All Games');

  // Initialize animations
  useEffect(() => {
    buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
    buttonScaleAnims.current.forEach((anim, index) => {
      startPulseAnimation(anim);
    });
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
        Animated.delay(200),
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
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

  // Initialize pattern animations when patterns load
  useEffect(() => {
    if (patterns.length > 0) {
      patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
      glowAnims.current = patterns.map(() => new Animated.Value(0));
      
      patternScaleAnims.current.forEach((anim, index) => {
        startPulseAnimation(anim, 1000 + (index * 200));
      });
      
      glowAnims.current.forEach((anim, index) => {
        startGlowAnimation(anim, 1500 + (index * 300));
      });
    }
  }, [patterns.length]);

  // Pulse animation function
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

  // Glow animation function
  const startGlowAnimation = (anim, duration = 1500) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
  };

  // Function to calculate prize pool from pattern rewards
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

  // Auto-scroll functions
  const startAutoScroll = () => {
    // Clear any existing interval
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    
    // Only start auto-scroll if there are sliders
    if (sliders.length <= 1) return;
    
    scrollInterval.current = setInterval(() => {
      // Get the current active slide using functional update
      setActiveSlide((prevActiveSlide) => {
        // Calculate next index
        let nextIndex = prevActiveSlide + 1;
        if (nextIndex >= sliders.length) {
          nextIndex = 0;
        }
        
        // Scroll to the next slide
        if (sliderRef.current) {
          const slideWidth = width - 32;
          sliderRef.current.scrollToOffset({
            offset: nextIndex * slideWidth,
            animated: true
          });
        }
        
        return nextIndex;
      });
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const resetAutoScroll = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  useEffect(() => {
    fetchInitialData();
    
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (games.length > 0 && !popupShown) {
      setTimeout(() => {
        checkUpcomingGame();
      }, 1500);
    }
  }, [games, popupShown]);

  useEffect(() => {
    if (sliders.length > 1) {
      startAutoScroll();
    }
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [sliders.length]);

  // Filter games based on search and active filter
  useEffect(() => {
    let filtered = games;
    
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(game =>
        game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter === 'Live Now') {
      filtered = filtered.filter(game => game.status === 'live');
    } else if (activeFilter === 'Upcoming') {
      filtered = filtered.filter(game => game.status === 'scheduled');
    } else if (activeFilter === 'Completed') {
      filtered = filtered.filter(game => game.status === 'completed');
    }
    
    setFilteredGames(filtered);
  }, [searchQuery, games, activeFilter]);

  useEffect(() => {
    if (upcomingGamePopup) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimPopup, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacityAnim.setValue(0);
      slideAnimPopup.setValue(300);
    }
  }, [upcomingGamePopup]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchNotifications(),
        fetchSliders(),
        fetchGames(1),
        fetchPatterns()
      ]);
    } catch (error) {
      console.log("Error fetching initial data:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setGames([]);
    setFilteredGames([]);
    setPopupShown(false);
    Promise.all([
      fetchNotifications(),
      fetchSliders(),
      fetchGames(1),
      fetchPatterns()
    ]).finally(() => setRefreshing(false));
  }, []);

  const checkUpcomingGame = () => {
    try {
      const now = new Date();
      
      const scheduledGames = games.filter(game => 
        game.status === 'scheduled'
      );
      
      if (scheduledGames.length === 0) return;
      
      const gamesWithEndDateTime = scheduledGames.map(game => {
        let endDateTime;
        
        try {
          if (game.ticket_request_end_date) {
            endDateTime = new Date(game.ticket_request_end_date);
          } else {
            endDateTime = new Date(game.game_date);
          }
        } catch (e) {
          endDateTime = new Date();
        }
        
        return {
          ...game,
          endDateTime
        };
      });
      
      const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
      const earliestEndGame = sortedGames[0];
      
      const timeDiff = earliestEndGame.endDateTime - now;
      
      if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
        setUpcomingGame(earliestEndGame);
        setUpcomingGamePopup(true);
        setPopupShown(true);
      }
    } catch (error) {
      console.log("Error checking upcoming game:", error);
    }
  };

  const getTimeRemaining = (endDateTime) => {
    const now = new Date();
    const diff = endDateTime - now;
    
    if (diff <= 0) return "Ending soon";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchSliders = async () => {
    try {
      setLoadingSliders(true);
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/sliders"
      );
      if (res.data.success) {
        setSliders(res.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching sliders:", error);
      setSliders([]);
    } finally {
      setLoadingSliders(false);
    }
  };

  const fetchGames = async (page = 1) => {
    try {
      if (page === 1) {
        setLoadingGames(true);
      }
      
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      
      const res = await axios.get(
        `https://tambolatime.co.in/public/api/user/games?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const newGames = res.data.games.data || [];
        const pagination = res.data.games;
        
        if (page === 1) {
          setGames(newGames);
          setFilteredGames(newGames);
        } else {
          setGames(prev => [...prev, ...newGames]);
          setFilteredGames(prev => [...prev, ...newGames]);
        }
        
        setCurrentPage(pagination.current_page);
        setLastPage(pagination.last_page);
      }
    } catch (error) {
      console.log("Error fetching games:", error);
    } finally {
      if (page === 1) {
        setLoadingGames(false);
      }
      setLoadingMore(false);
    }
  };

  const fetchPatterns = async () => {
    try {
      setLoadingPatterns(true);
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        setLoadingPatterns(false);
        return;
      }

      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/patterns/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data && response.data.status) {
        const patternsData = response.data.data?.patterns || [];
        
        const patternSequence = [
          'top line',
          'middle line', 
          'bottom line',
          'breakfast',
          'lunch',
          'dinner',
          'four corners',
          'bamboo',
          'early five',
          'non claimers',
          'full house'
        ];
        
        const sortedPatterns = patternsData.sort((a, b) => {
          const aName = (a.display_name || a.pattern_name || '').toLowerCase();
          const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
          const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
          const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          
          return aIndex - bIndex;
        });
        
        setPatterns(sortedPatterns.slice(0, 8));
      }
    } catch (error) {
      console.log('Error fetching patterns in Home:', error);
    } finally {
      setLoadingPatterns(false);
    }
  };

  const loadMoreGames = () => {
    if (!loadingMore && currentPage < lastPage) {
      setLoadingMore(true);
      fetchGames(currentPage + 1);
    }
  };

  const handleGamePress = (game) => {
    navigation.navigate("GameDetails", { game });
  };

  const handleAllGamesPress = () => {
    navigation.navigate("Game");
  };

  const handleAllPatternsPress = () => {
    navigation.navigate("UserGamePatterns");
  };

  const handleViewAllWinners = () => {
    navigation.navigate("Game");
  };

  const handlePatternPress = (pattern) => {
    navigation.navigate("UserGamePatterns", { 
      selectedPatternId: pattern.id,
      selectedPattern: pattern 
    });
  };

  const handlePopupJoinNow = () => {
    setUpcomingGamePopup(false);
    if (upcomingGame) {
      navigation.navigate("GameDetails", { game: upcomingGame });
    }
  };

  const handlePopupLater = () => {
    setUpcomingGamePopup(false);
  };

  const getPatternIcon = (pattern) => {
    const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
    const iconMap = {
      'bamboo': 'leaf',
      'bottom line': 'arrow-down',
      'breakfast': 'cafe',
      'dinner': 'restaurant',
      'early five': '5',
      'four corners': 'apps',
      'full house': 'home',
      'lunch': 'fast-food',
      'middle line': 'remove',
      'non claimer': 'close',
      'top line': 'arrow-up'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (patternName.includes(key)) return icon;
    }
    
    return 'grid-outline';
  };

  const formatPatternName = (name) => {
    if (!name) return 'Unknown Pattern';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        <View style={styles.logoContainer}>
          <View style={styles.cartoonTitleRow}>
            {letters.map((item) => {
              const animValue = letterAnims.current && letterAnims.current[item.index] 
                ? letterAnims.current[item.index] 
                : new Animated.Value(1);
              
              return (
                <Animated.Text
                  key={`letter-${item.index}`}
                  style={[
                    styles.cartoonLetter,
                    item.isSpecial && styles.specialCartoonLetter,
                    item.isSpace && { width: item.width || 20 },
                    { 
                      transform: [{ scale: animValue }],
                      marginHorizontal: item.isSpace ? 0 : 2,
                    }
                  ]}
                >
                  {item.char}
                </Animated.Text>
              );
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.notification}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  // Animated pattern card with gradient and glow
  const renderPatternCard = (pattern, index) => {
    const icon = getPatternIcon(pattern);
    const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
    const patterns = [
      'Top Line',
      'Middle',
      'Bottom',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Corners',
      'Bamboo',
    ];
    
    const patternName = patterns[index % patterns.length];
    const gradientColors = COLORS.patternGradients[index % COLORS.patternGradients.length];
    
    const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
    const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7]
    });
    
    return (
      <Animated.View
        key={pattern.id}
        style={[
          styles.patternCardContainer,
          {
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.compactPatternCard}
          onPress={() => handlePatternPress(pattern)}
          activeOpacity={0.7}
        >
          <Animated.View style={[
            styles.glowEffect,
            {
              backgroundColor: gradientColors[0],
              opacity: glowOpacity,
              transform: [{ scale: 1.2 }]
            }
          ]} />
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.compactIconWrapper}
          >
            <Ionicons name={icon} size={18} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.compactPatternName} numberOfLines={1}>
            {patternName}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSliderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <Image
        source={{ 
          uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
        }}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    </View>
  );

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffset / slideSize);
    
    if (currentIndex !== activeSlide && currentIndex < sliders.length) {
      setActiveSlide(currentIndex);
      // Reset auto-scroll timer when user manually scrolls
      stopAutoScroll();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        startAutoScroll();
      }, 5000);
    }
  };

  const renderPagination = () => {
    if (sliders.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {sliders.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderGameCard = ({ item: game, index }) => {
    if (!game) return null;
    
    const ticketCost = parseFloat(game.ticket_cost || 0);
    const isPaid = game.ticket_type === "paid";
    const isLive = game.status === 'live';
    const isScheduled = game.status === 'scheduled';
    const isCompleted = game.status === 'completed';
    
    const prizePool = calculatePrizePool(game);
    
    if (!buttonScaleAnims.current[index]) {
      buttonScaleAnims.current[index] = new Animated.Value(1);
      startPulseAnimation(buttonScaleAnims.current[index]);
    }
    
    const buttonScale = buttonScaleAnims.current[index];
    
    return (
      <TouchableOpacity
        style={styles.gameCard}
        activeOpacity={0.9}
        onPress={() => handleGamePress(game)}
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
          style={[
            styles.statusBadge,
          ]}
        >
          <Ionicons 
            name={
              isLive ? 'radio-button-on' : 
              isCompleted ? 'checkmark-circle' :
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

        <View style={styles.cardHeader}>
          <View style={styles.gameIconContainer}>
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameIconWrapper}
            >
              <MaterialIcons name="confirmation-number" size={32} color={COLORS.primary} />
            </LinearGradient>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.game_name || "Tambola Game"}
              </Text>
              <Text style={styles.gameId}>
                ID: {game.game_code || "N/A"}
              </Text>
            </View>
          </View>
          
          <LinearGradient
            colors={isPaid ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gameTypeBadge,
            ]}
          >
            {isPaid ? (
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
                  {game.game_date_formatted || game.game_date || "Date TBA"}
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
                  {game.game_time_formatted || game.game_start_time || "Time TBA"}
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
            <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.surface} />
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
            style={[
              styles.joinButton,
              isCompleted && styles.completedJoinButton
            ]}
            onPress={() => handleGamePress(game)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isCompleted ? COLORS.completedGradient : COLORS.primaryGradient}
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

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const UpcomingGamePopup = () => {
    if (!upcomingGame) return null;
    
    const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
    const isPaid = upcomingGame.ticket_type === "paid";
    const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
    const timeRemaining = getTimeRemaining(endDateTime);
    
    const prizePool = calculatePrizePool(upcomingGame);
    
    return (
      <Modal
        visible={upcomingGamePopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePopupLater}
      >
        <View style={styles.popupOverlay}>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnimPopup }]
              }
            ]}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupIcon}
            >
              <Ionicons name="timer-outline" size={32} color={COLORS.surface} />
            </LinearGradient>
            
            <Text style={styles.popupTitle}>Booking closing soon!</Text>
            <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupTimer}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.popupTimerText}>{timeRemaining}</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupPrize}
            >
              <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
              <Text style={styles.popupPrizeValue}>
                {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
              </Text>
              {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
                <Text style={styles.popupPrizeSubtext}>
                  {upcomingGame.pattern_rewards.length} Patterns
                </Text>
              )}
            </LinearGradient>
            
            <View style={styles.popupActions}>
              <TouchableOpacity 
                onPress={handlePopupJoinNow}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.popupPrimaryButton}
                >
                  <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.popupSecondaryButton}
                onPress={handlePopupLater}
              >
                <Text style={styles.popupSecondaryButtonText}>Later</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  if (loadingGames && games.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.container}>
        {/* Header with gradient */}
        <Header />

        {/* Search Bar with gradient */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchWrapper}
        >
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
            <TextInput
              placeholder="Search games by name or ID..."
              placeholderTextColor={COLORS.textLight}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
            )}
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {/* Slider Section */}
          {loadingSliders ? (
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sliderLoadingContainer}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading offers...</Text>
            </LinearGradient>
          ) : sliders.length > 0 ? (
            <View style={styles.sliderSection}>
              <View style={styles.sliderWrapper}>
                <FlatList
                  ref={sliderRef}
                  data={sliders}
                  renderItem={renderSliderItem}
                  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
                
                {/* Pagination Dots */}
                {renderPagination()}
              </View>
            </View>
          ) : null}

          {/* Patterns Section - Now with gradient */}
          {patterns.length > 0 && (
            <View style={styles.patternsSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sectionIcon}
                  >
                    <Ionicons name="grid-outline" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
                </View>
                <TouchableOpacity onPress={handleAllPatternsPress}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.seeAllButton}
                  >
                    <Text style={styles.seeAllText}>See All</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.surface} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {loadingPatterns ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.patternsList}
                >
                  {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Games Section */}
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
                <Text style={styles.sectionTitle}>ALL GAMES</Text>
              </View>
              <TouchableOpacity onPress={handleAllGamesPress}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {loadingGames ? (
              <LinearGradient
                colors={COLORS.winnerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gamesLoadingContainer}
              >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading games...</Text>
              </LinearGradient>
            ) : filteredGames.length > 0 ? (
              <View style={styles.gamesContainer}>
                {filteredGames.map((game, index) => (
                  <View key={game.id || index}>
                    {renderGameCard({ item: game, index })}
                  </View>
                ))}
                {loadingMore && (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                )}
              </View>
            ) : (
              <LinearGradient
                colors={COLORS.winnerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.noGamesContainer}
              >
                <Ionicons name="game-controller-outline" size={50} color={COLORS.primary} />
                <Text style={styles.noGamesText}>
                  {searchQuery ? 'No games found' : 'No games available at the moment'}
                </Text>
                {searchQuery && (
                  <TouchableOpacity 
                    style={styles.refreshGamesBtn}
                    onPress={clearSearch}
                  >
                    <LinearGradient
                      colors={COLORS.primaryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.refreshGamesGradient}
                    >
                      <Text style={styles.refreshGamesText}>Clear Search</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            )}
          </View>

          {/* Why Play With Us Section with gradient */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
              </View>
            </View>
            
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoCard}
            >
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>Fast & Fair Games</Text>
                </View>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>Real Players</Text>
                </View>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>24x7 Rooms Available</Text>
                </View>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>Safe & Fun Experience</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Popup */}
        <UpcomingGamePopup />

        {/* Notifications Modal */}
        <Modal 
          visible={modalVisible} 
          transparent={true} 
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['#ffffff', '#f8f9ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <LinearGradient
                      colors={COLORS.primaryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.modalIcon}
                    >
                      <Ionicons name="notifications" size={20} color={COLORS.surface} />
                    </LinearGradient>
                    <Text style={styles.modalTitle}>Notifications</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name="close" size={24} color={COLORS.textDark} />
                  </TouchableOpacity>
                </View>

                {loadingNotifications ? (
                  <View style={styles.modalLoadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.modalLoadingText}>Loading notifications...</Text>
                  </View>
                ) : (
                  <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notificationsList}
                    renderItem={({ item }) => (
                      <View style={styles.modalNotificationItem}>
                        <LinearGradient
                          colors={COLORS.primaryGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.modalNotificationIcon}
                        >
                          <Ionicons name="notifications-outline" size={20} color={COLORS.surface} />
                        </LinearGradient>
                        <View style={styles.modalNotificationContent}>
                          <Text style={styles.modalNotificationTitle}>
                            {item.title || "New Update"}
                          </Text>
                          <Text style={styles.modalNotificationMessage}>
                            {item.message || "Check out the new features!"}
                          </Text>
                          <Text style={styles.modalNotificationDate}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                          </Text>
                        </View>
                      </View>
                    )}
                    ListEmptyComponent={
                      <View style={styles.modalEmptyContainer}>
                        <Ionicons name="notifications-off-outline" size={60} color={COLORS.textLight} />
                        <Text style={styles.modalEmptyText}>No notifications yet</Text>
                        <Text style={styles.modalEmptySubtext}>
                          We'll notify you when something new arrives
                        </Text>
                      </View>
                    }
                  />
                )}

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalFooter}
                >
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalCloseBtn}
                  >
                    <Text style={styles.modalCloseBtnText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </View>
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
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  spaceLetter: {
    width: 20,
    marginHorizontal: 0,
  },
  notification: {
    position: "relative",
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: 8,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: COLORS.textDark,
    padding: 0,
  },
  sliderSection: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sliderWrapper: {
    height: 150,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLoadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  slideContainer: {
    width: width - 32,
    height: 150,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.surface,
    width: 20,
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textLight,
    fontSize: 14,
  },
  patternsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.surface,
    fontWeight: '600',
  },
  patternsList: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    gap: 12,
  },
  patternCardContainer: {
    position: 'relative',
    marginRight: 12,
    marginTop: 8,
    paddingTop: 4,
  },
  compactPatternCard: {
    alignItems: 'center',
    width: 60,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    top: -2,
    left: 4,
    zIndex: 0,
  },
  compactIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    zIndex: 1,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  compactPatternName: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textDark,
    textAlign: 'center',
    zIndex: 1,
  },
  // Games Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  gamesLoadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  noGamesContainer: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noGamesText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
    textAlign: 'center',
  },
  refreshGamesBtn: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  refreshGamesGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  refreshGamesText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  gamesContainer: {
    gap: 12,
  },
  gameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
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
  completedJoinButton: {
    backgroundColor: COLORS.completed,
  },
  joinButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  winnersContainer: {
    gap: 8,
  },
  winnerCard: {
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  winnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerInitial: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  winnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  winnerPrize: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  winnerTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 20,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  // Popup Styles
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupContainer: {
    width: width * 0.8,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  popupIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  popupGameName: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  popupTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  popupTimerText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  popupPrize: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
  },
  popupPrizeLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  popupPrizeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  popupPrizeSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  popupActions: {
    width: '100%',
    gap: 12,
  },
  popupPrimaryButton: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  popupPrimaryButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  popupSecondaryButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  popupSecondaryButtonText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalContent: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoadingText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  notificationsList: {
    paddingVertical: 8,
  },
  modalNotificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  modalNotificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modalNotificationContent: {
    flex: 1,
  },
  modalNotificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  modalNotificationMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 6,
    lineHeight: 20,
  },
  modalNotificationDate: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  modalEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  modalEmptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  modalEmptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  modalFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalCloseBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Home;