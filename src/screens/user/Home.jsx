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
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Blue color palette - Updated with better accent colors
const COLORS = {
  background: '#F0F7FF',
  surface: '#FFFFFF',
  primary: '#2E5BFF', // Vibrant blue
  primaryLight: '#E1EBFF',
  primaryDark: '#1A3A9E',
  accent: '#3B82F6', // Medium blue for accents
  secondary: '#60A5FA', // Light blue instead of yellow
  tertiary: '#2563EB', // Darker blue for contrast
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  
  // Status colors
  live: '#10B981',
  scheduled: '#F59E0B',
  completed: '#94A3B8',
  
  // Block colors - Blue shades
  blockLightBlue: '#E1EBFF',
  blockMediumBlue: '#C2D6FF',
  blockDarkBlue: '#A3C1FF',
  blockYellow: '#FFF7D6',
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
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Scroll Y position for background animation
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Pagination state for games
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const sliderRef = useRef(null);
  const scrollInterval = useRef(null);
  const flatListRef = useRef(null);

  // Filter options
  const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
  const [activeFilter, setActiveFilter] = useState('All Games');

  useEffect(() => {
    fetchInitialData();
    
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
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
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(game =>
        game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
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
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacityAnim.setValue(0);
      slideAnim.setValue(300);
    }
  }, [upcomingGamePopup]);

  const startAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    
    scrollInterval.current = setInterval(() => {
      if (sliders.length > 0) {
        let nextIndex = activeSlide + 1;
        if (nextIndex >= sliders.length) {
          nextIndex = 0;
        }
        
        setActiveSlide(nextIndex);
        if (sliderRef.current) {
          const slideWidth = width - 32;
          sliderRef.current.scrollToOffset({
            offset: nextIndex * slideWidth,
            animated: true
          });
        }
      }
    }, 3000);
  };

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
      
      if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) { // Show if less than 24 hours left
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

  const renderPatternCard = (pattern, index) => {
    const icon = getPatternIcon(pattern);
    const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
    // Different background colors for each pattern
    const bgColors = [
      '#2E5BFF', // Blue
      '#F59E0B', // Orange
      '#10B981', // Green
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#F97316', // Orange
    ];
    
    // Different patterns for variety
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
    const bgColor = bgColors[index % bgColors.length];
    
    return (
      <TouchableOpacity 
        key={pattern.id} 
        style={styles.compactPatternCard}
        onPress={() => handlePatternPress(pattern)}
        activeOpacity={0.7}
      >
        <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.compactPatternName} numberOfLines={1}>
          {patternName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSliderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <Image
        source={{ 
          uri: item.image_url || 'https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg'
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
    }
  };

  // Handle main scroll for background animation
  const handleMainScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const renderPagination = () => {
    if (sliders.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {sliders.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeSlide === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderGameCard = ({ item: game }) => {
    if (!game) return null;
    
    const ticketCost = parseFloat(game.ticket_cost || 0);
    const isLive = game.status === 'live';
    const isScheduled = game.status === 'scheduled';
    const isCompleted = game.status === 'completed';
    
    // Get status color
    let statusColor = COLORS.scheduled;
    let statusText = 'Upcoming';
    if (isLive) {
      statusColor = COLORS.live;
      statusText = 'Live Now';
    } else if (isCompleted) {
      statusColor = COLORS.completed;
      statusText = 'Completed';
    }
    
    return (
      <TouchableOpacity
        style={styles.gameCard}
        activeOpacity={0.9}
        onPress={() => handleGamePress(game)}
      >
        <View style={[styles.gameImagePlaceholder, { backgroundColor: COLORS.primaryLight }]}>
          <MaterialIcons name="sports-esports" size={32} color={COLORS.primary} />
        </View>
        
        <View style={styles.gameCardContent}>
          <View style={styles.gameCardHeader}>
            <View style={styles.gameTitleContainer}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.game_name || "Tambola Game"}
              </Text>
              <Text style={styles.gameCode}>
                #{game.game_code || "N/A"}
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: `${statusColor}20` }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusPillText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>

          <View style={styles.gameMetaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {game.game_date_formatted || game.game_date || "TBA"}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {game.game_time_formatted || game.game_start_time || "TBA"}
              </Text>
            </View>
          </View>

          <View style={styles.gameFooter}>
            <View>
              <Text style={styles.prizeLabel}>Prize Pool</Text>
              <Text style={styles.prizeValue}>
                {game.ticket_type === "paid" && game.max_tickets 
                  ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
                  : "Exciting Prizes"}
              </Text>
            </View>
            <View style={styles.arrowButton}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>
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
    const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
    const timeRemaining = getTimeRemaining(endDateTime);
    
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
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.popupIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
            </View>
            
            <Text style={styles.popupTitle}>Booking closing soon!</Text>
            <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
            <View style={styles.popupTimer}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.popupTimerText}>{timeRemaining}</Text>
            </View>
            
            <View style={styles.popupPrize}>
              <Text style={styles.popupPrizeLabel}>Prize Pool</Text>
              <Text style={styles.popupPrizeValue}>
                {upcomingGame.ticket_type === "paid" && upcomingGame.max_tickets
                  ? `₹${(ticketCost * upcomingGame.max_tickets).toLocaleString()}`
                  : "Exciting Prizes"}
              </Text>
            </View>
            
            <View style={styles.popupActions}>
              <TouchableOpacity 
                style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
                onPress={handlePopupJoinNow}
              >
                <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
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

  // Animated background that moves with scroll
  const AnimatedBackground = () => {
    // Interpolate scroll position to create parallax effect
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

  // Enhanced Header with semicircle shape and UK-style rounded lines
 // Enhanced Header with semicircle shape and UK-style rounded lines
const Header = () => (
  <View style={styles.headerWrapper}>
    {/* Semicircle Background */}
    <View style={styles.semicircleBackground}>
      <View style={styles.semicircle} />
    </View>
    
    {/* UK-style Rounded Lines Pattern */}
    <View style={styles.ukPatternContainer}>
      {/* Curved Lines - Like tube map style */}
      <View style={styles.curvedLine1} />
      <View style={styles.curvedLine2} />
      <View style={styles.curvedLine3} />
      
      {/* Parallel Lines */}
      <View style={styles.parallelLines}>
        <View style={styles.parallelLine} />
        <View style={styles.parallelLine} />
        <View style={styles.parallelLine} />
      </View>
      
      {/* Dotted Circle Pattern */}
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
      
      {/* Small decorative elements */}
      <View style={styles.decorativeDot1} />
      <View style={styles.decorativeDot2} />
      <View style={styles.decorativeLine1} />
      <View style={styles.decorativeLine2} />
    </View>

    {/* Header Content */}
    <View style={styles.headerContent}>
      <View>
        <Text style={styles.greeting}>Let's play your</Text>
        <Text style={styles.title}>
          favorite <Text style={styles.titleBold}>Tambola!</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
          {notifications.length > 0 && (
            <View style={styles.notificationBadge} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

  if (loadingGames && games.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.container}>
        {/* Animated Color Blocks - Blue Shades that move with scroll */}
        <AnimatedBackground />

        <Animated.FlatList
          ref={flatListRef}
          data={filteredGames}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
          onScroll={handleMainScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <>
              {/* Enhanced Header with Semicircle and UK Pattern */}
              <Header />

              {/* Search */}
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
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
                    <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
                )}
              </View>

              {/* Filter Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
              >
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      activeFilter === filter && styles.activeFilterChip,
                    ]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        activeFilter === filter && styles.activeFilterChipText,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Slider Section */}
              {loadingSliders ? (
                <View style={styles.sliderLoading}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : sliders.length > 0 ? (
                <View style={styles.sliderSection}>
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
                    getItemLayout={(data, index) => ({
                      length: width - 32,
                      offset: (width - 32) * index,
                      index,
                    })}
                  />
                  {renderPagination()}
                </View>
              ) : null}

              {/* Patterns Section - Redesigned */}
              {patterns.length > 0 && (
                <View style={styles.patternsSection}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={styles.sectionTitle}>Game Patterns</Text>
                      <Text style={styles.sectionSubtitle}>Popular winning combinations</Text>
                    </View>
                    <TouchableOpacity onPress={handleAllPatternsPress}>
                      <View style={styles.seeAllButton}>
                        <Text style={styles.seeAllText}>See All</Text>
                        <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                      </View>
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

              {/* Games Count */}
              <View style={styles.gamesCountContainer}>
                <Text style={styles.gamesCount}>
                  {filteredGames.length} {filteredGames.length === 1 ? 'Game' : 'Games'} Available
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyGames}>
              <Ionicons name="game-controller-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyGamesText}>
                {searchQuery ? 'No games found' : 'No games available'}
              </Text>
              {searchQuery && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                  <Text style={styles.clearSearchButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* Popup */}
        <UpcomingGamePopup />

        {/* Notifications Modal */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              {loadingNotifications ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalLoader} />
              ) : (
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                      <View style={styles.notificationIcon}>
                        <Ionicons name="notifications" size={20} color={COLORS.primary} />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
                        <Text style={styles.notificationMessage}>
                          {item.message || "Check out the new features!"}
                        </Text>
                        <Text style={styles.notificationDate}>
                          {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                        </Text>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyNotifications}>
                      <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
                      <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
                    </View>
                  }
                />
              )}
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
    paddingHorizontal: 16,
  },
  
  /* COLOR BLOCKS - Blue Shades - Now Animated */
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
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /* Enhanced Header with Semicircle and UK Pattern */
/* Enhanced Header with Semicircle and UK Pattern */
headerWrapper: {
  position: 'relative',
  marginTop: 8, // Reduced from 14
  marginBottom: 8, // Reduced from 14
  overflow: 'hidden',
 
},

/* Header Content */
headerContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  zIndex: 2,

},

greeting: {
  fontSize: 14, // Reduced from 16
  color: COLORS.textSecondary,
  marginBottom: 2, // Reduced from 4
},

title: {
  fontSize: 24, // Reduced from 26
  color: COLORS.text,
  
},

// Update searchBox margin
searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.surface,
  borderRadius: 18,
  paddingHorizontal: 14,
  paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  marginBottom: 12,
 // Added small top margin instead of large gap
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
},
  
  /* Semicircle Background */
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
  
  /* UK-style Rounded Lines Pattern */
  ukPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  /* Curved Lines - Like tube map */
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
  
  /* Parallel Lines */
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
  
  /* Dotted Circle Pattern */
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
  
  /* Decorative elements */
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    paddingVertical: 10,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    color: COLORS.text,
    lineHeight: 34,
  },
  titleBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  notificationIcon: {
    position: 'relative',
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.live,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  
  /* Rest of the existing styles */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    color: COLORS.text,
    fontSize: 14,
    padding: 0,
  },
  
  filtersContainer: {
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: COLORS.surface,
  },
  
  sliderSection: {
    marginTop: 16,
    marginBottom: 24,
    position: 'relative',
  },
  slideContainer: {
    width: width - 32,
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  sliderLoading: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  
  /* Patterns Section */
  patternsSection: {
    marginBottom: 28,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  patternsList: {
    paddingHorizontal: 4,
    gap: 12,
  },
  compactPatternCard: {
    alignItems: 'center',
    marginRight: 12,
    width: 60,
  },
  compactIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactPatternName: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  
  gamesCountContainer: {
    marginBottom: 16,
  },
  gamesCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  
  gameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    flexDirection: 'row',
  },
  gameImagePlaceholder: {
    width: 100,
    height: 140,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameCardContent: {
    flex: 1,
    padding: 14,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  gameTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  gameCode: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  gameMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  prizeLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  prizeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  arrowButton: {
    backgroundColor: COLORS.primary, // Changed from yellow to primary blue
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  emptyGames: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    marginTop: 20,
  },
  emptyGamesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
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
    color: COLORS.text,
    marginBottom: 8,
  },
  popupGameName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  popupTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  popupTimerText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  popupPrize: {
    alignItems: 'center',
    marginBottom: 24,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalLoader: {
    marginVertical: 30,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyNotificationsText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});

export default Home;























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
// import axios from "axios";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// // Orange color palette - Consistent orange theme
// const COLORS = {
//   background: '#FFF7ED', // Light orange background
//   surface: '#FFFFFF',
//   primary: '#F97316', // Vibrant orange
//   primaryLight: '#FFEDD5', // Light orange
//   primaryDark: '#C2410C', // Dark orange
//   accent: '#FB923C', // Medium orange for accents
//   secondary: '#FCD34D', // Light amber/gold
//   tertiary: '#EA580C', // Darker orange for contrast
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#FED7AA', // Light orange border
  
//   // Card background variants - Orange shades
//   cardOrange1: '#FFF7ED',
//   cardOrange2: '#FFEDD5',
//   cardOrange3: '#FED7AA',
//   cardOrange4: '#FDBA74',
//   cardOrange5: '#FB923C',
  
//   // Accent colors - Orange shades only
//   orange: '#F97316',
//   orangeLight: '#FFEDD5',
//   orangeMedium: '#FB923C',
//   orangeDark: '#C2410C',
  
//   // Status colors (keeping for clarity)
//   live: '#10B981', // Green for live (keeping for contrast)
//   scheduled: '#F97316', // Orange for scheduled
//   completed: '#94A3B8', // Gray for completed
  
//   // Block colors - Orange shades
//   blockLightOrange: '#FFEDD5',
//   blockMediumOrange: '#FED7AA',
//   blockDarkOrange: '#FDBA74',
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
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;
  
//   // Scroll Y position for background animation
//   const scrollY = useRef(new Animated.Value(0)).current;
  
//   // Pagination state for games
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
  
//   const sliderRef = useRef(null);
//   const scrollInterval = useRef(null);
//   const flatListRef = useRef(null);

//   // Filter options
//   const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
//   const [activeFilter, setActiveFilter] = useState('All Games');

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
    
//     // Apply search filter
//     if (searchQuery.trim() !== '') {
//       filtered = filtered.filter(game =>
//         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     // Apply status filter
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
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 400,
//           easing: Easing.out(Easing.back(1.2)),
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       opacityAnim.setValue(0);
//       slideAnim.setValue(300);
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
      
//       if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) { // Show if less than 24 hours left
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

//   const renderPatternCard = (pattern, index) => {
//     const icon = getPatternIcon(pattern);
//     const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
//     // Different orange shades for each pattern
//     const bgColors = [
//       '#F97316', // Vibrant orange
//       '#FB923C', // Medium orange
//       '#FDBA74', // Light orange
//       '#F59E0B', // Amber
//       '#EA580C', // Dark orange
//       '#C2410C', // Very dark orange
//       '#D97706', // Golden orange
//       '#B45309', // Brownish orange
//     ];
    
//     const patternName = displayName.length > 10 ? displayName.substring(0, 10) + '...' : displayName;
//     const bgColor = bgColors[index % bgColors.length];
    
//     return (
//       <TouchableOpacity 
//         key={pattern.id} 
//         style={styles.compactPatternCard}
//         onPress={() => handlePatternPress(pattern)}
//         activeOpacity={0.7}
//       >
//         <View style={[styles.compactIconWrapper, { backgroundColor: bgColor }]}>
//           <Ionicons name={icon} size={18} color="#FFFFFF" />
//         </View>
//         <Text style={styles.compactPatternName} numberOfLines={1}>
//           {patternName}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderSliderItem = ({ item }) => (
//     <View style={styles.slideContainer}>
//       <Image
//         source={{ 
//           uri: item.image_url || 'https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg'
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

//   // Handle main scroll for background animation
//   const handleMainScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//     { useNativeDriver: false }
//   );

//   const renderPagination = () => {
//     if (sliders.length <= 1) return null;
    
//     return (
//       <View style={styles.paginationContainer}>
//         {sliders.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.paginationDot,
//               activeSlide === index && styles.paginationDotActive,
//             ]}
//           />
//         ))}
//       </View>
//     );
//   };

//   const renderGameCard = ({ item: game }) => {
//     if (!game) return null;
    
//     const ticketCost = parseFloat(game.ticket_cost || 0);
//     const isLive = game.status === 'live';
//     const isScheduled = game.status === 'scheduled';
//     const isCompleted = game.status === 'completed';
    
//     // Get status color
//     let statusColor = COLORS.scheduled;
//     let statusText = 'Upcoming';
//     if (isLive) {
//       statusColor = COLORS.live;
//       statusText = 'Live Now';
//     } else if (isCompleted) {
//       statusColor = COLORS.completed;
//       statusText = 'Completed';
//     }
    
//     return (
//       <TouchableOpacity
//         style={styles.gameCard}
//         activeOpacity={0.9}
//         onPress={() => handleGamePress(game)}
//       >
//         <View style={[styles.gameImagePlaceholder, { backgroundColor: COLORS.primaryLight }]}>
//           <MaterialIcons name="sports-esports" size={32} color={COLORS.primary} />
//         </View>
        
//         <View style={styles.gameCardContent}>
//           <View style={styles.gameCardHeader}>
//             <View style={styles.gameTitleContainer}>
//               <Text style={styles.gameName} numberOfLines={1}>
//                 {game.game_name || "Tambola Game"}
//               </Text>
//               <Text style={styles.gameCode}>
//                 #{game.game_code || "N/A"}
//               </Text>
//             </View>
//             <View style={[styles.statusPill, { backgroundColor: `${statusColor}20` }]}>
//               <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
//               <Text style={[styles.statusPillText, { color: statusColor }]}>
//                 {statusText}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.gameMetaRow}>
//             <View style={styles.metaItem}>
//               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
//               <Text style={styles.metaText}>
//                 {game.game_date_formatted || game.game_date || "TBA"}
//               </Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
//               <Text style={styles.metaText}>
//                 {game.game_time_formatted || game.game_start_time || "TBA"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.gameFooter}>
//             <View>
//               <Text style={styles.prizeLabel}>Prize Pool</Text>
//               <Text style={styles.prizeValue}>
//                 {game.ticket_type === "paid" && game.max_tickets 
//                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
//                   : "Exciting Prizes"}
//               </Text>
//             </View>
//             <View style={styles.arrowButton}>
//               <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
//             </View>
//           </View>
//         </View>
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
//     const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
//     const timeRemaining = getTimeRemaining(endDateTime);
    
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
//                 transform: [{ translateY: slideAnim }]
//               }
//             ]}
//           >
//             <View style={[styles.popupIcon, { backgroundColor: COLORS.primaryLight }]}>
//               <Ionicons name="timer-outline" size={32} color={COLORS.primary} />
//             </View>
            
//             <Text style={styles.popupTitle}>Booking closing soon!</Text>
//             <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
//             <View style={styles.popupTimer}>
//               <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
//               <Text style={styles.popupTimerText}>{timeRemaining}</Text>
//             </View>
            
//             <View style={styles.popupPrize}>
//               <Text style={styles.popupPrizeLabel}>Prize Pool</Text>
//               <Text style={styles.popupPrizeValue}>
//                 {upcomingGame.ticket_type === "paid" && upcomingGame.max_tickets
//                   ? `₹${(ticketCost * upcomingGame.max_tickets).toLocaleString()}`
//                   : "Exciting Prizes"}
//               </Text>
//             </View>
            
//             <View style={styles.popupActions}>
//               <TouchableOpacity 
//                 style={[styles.popupPrimaryButton, { backgroundColor: COLORS.primary }]}
//                 onPress={handlePopupJoinNow}
//               >
//                 <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
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

//   // Animated background that moves with scroll
//   const AnimatedBackground = () => {
//     // Interpolate scroll position to create parallax effect
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
//             styles.orangeBlock1,
//             {
//               transform: [{ translateY: block1TranslateY }],
//               opacity
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.orangeBlock2,
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
//             styles.orangeBlock3,
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

//   // Enhanced Header with semicircle shape and UK-style rounded lines
//   const Header = () => (
//     <View style={styles.headerWrapper}>
//       {/* Semicircle Background */}
//       <View style={styles.semicircleBackground}>
//         <View style={styles.semicircle} />
//       </View>
      
//       {/* UK-style Rounded Lines Pattern */}
//       <View style={styles.ukPatternContainer}>
//         {/* Curved Lines - Like tube map style */}
//         <View style={styles.curvedLine1} />
//         <View style={styles.curvedLine2} />
//         <View style={styles.curvedLine3} />
        
//         {/* Parallel Lines */}
//         <View style={styles.parallelLines}>
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//         </View>
        
//         {/* Dotted Circle Pattern */}
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
        
//         {/* Small decorative elements */}
//         <View style={styles.decorativeDot1} />
//         <View style={styles.decorativeDot2} />
//         <View style={styles.decorativeLine1} />
//         <View style={styles.decorativeLine2} />
//       </View>

//       {/* Header Content */}
//       <View style={styles.headerContent}>
//         <View>
//           <Text style={styles.greeting}>Let's play your</Text>
//           <Text style={styles.title}>
//             favorite <Text style={styles.titleBold}>Tambola!</Text>
//           </Text>
//         </View>
//         <TouchableOpacity onPress={() => setModalVisible(true)}>
//           <View style={styles.notificationIcon}>
//             <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
//             {notifications.length > 0 && (
//               <View style={styles.notificationBadge} />
//             )}
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loadingGames && games.length === 0) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

//       <View style={styles.container}>
//         {/* Animated Color Blocks - Orange Shades that move with scroll */}
//         <AnimatedBackground />

//         <Animated.FlatList
//           ref={flatListRef}
//           data={filteredGames}
//           renderItem={renderGameCard}
//           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
//           onScroll={handleMainScroll}
//           scrollEventThrottle={16}
//           ListHeaderComponent={
//             <>
//               {/* Enhanced Header with Semicircle and UK Pattern */}
//               <Header />

//               {/* Search */}
//               <View style={styles.searchBox}>
//                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
//                 <TextInput
//                   placeholder="Search games by name or ID..."
//                   placeholderTextColor={COLORS.textLight}
//                   style={styles.searchInput}
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   returnKeyType="search"
//                 />
//                 {searchQuery.length > 0 ? (
//                   <TouchableOpacity onPress={clearSearch}>
//                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
//                   </TouchableOpacity>
//                 ) : (
//                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
//                 )}
//               </View>

//               {/* Filter Chips */}
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.filtersContainer}
//               >
//                 {filters.map((filter) => (
//                   <TouchableOpacity
//                     key={filter}
//                     style={[
//                       styles.filterChip,
//                       activeFilter === filter && styles.activeFilterChip,
//                     ]}
//                     onPress={() => setActiveFilter(filter)}
//                   >
//                     <Text
//                       style={[
//                         styles.filterChipText,
//                         activeFilter === filter && styles.activeFilterChipText,
//                       ]}
//                     >
//                       {filter}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>

//               {/* Slider Section */}
//               {loadingSliders ? (
//                 <View style={styles.sliderLoading}>
//                   <ActivityIndicator size="small" color={COLORS.primary} />
//                 </View>
//               ) : sliders.length > 0 ? (
//                 <View style={styles.sliderSection}>
//                   <FlatList
//                     ref={sliderRef}
//                     data={sliders}
//                     renderItem={renderSliderItem}
//                     keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                     horizontal
//                     pagingEnabled
//                     showsHorizontalScrollIndicator={false}
//                     onScroll={handleScroll}
//                     scrollEventThrottle={16}
//                     getItemLayout={(data, index) => ({
//                       length: width - 32,
//                       offset: (width - 32) * index,
//                       index,
//                     })}
//                   />
//                   {renderPagination()}
//                 </View>
//               ) : null}

//               {/* Patterns Section - Redesigned with orange shades */}
//               {patterns.length > 0 && (
//                 <View style={styles.patternsSection}>
//                   <View style={styles.sectionHeader}>
//                     <View>
//                       <Text style={styles.sectionTitle}>Game Patterns</Text>
//                       <Text style={styles.sectionSubtitle}>Popular winning combinations</Text>
//                     </View>
//                     <TouchableOpacity onPress={handleAllPatternsPress}>
//                       <View style={styles.seeAllButton}>
//                         <Text style={styles.seeAllText}>See All</Text>
//                         <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
//                       </View>
//                     </TouchableOpacity>
//                   </View>

//                   {loadingPatterns ? (
//                     <ActivityIndicator size="small" color={COLORS.primary} />
//                   ) : (
//                     <ScrollView 
//                       horizontal 
//                       showsHorizontalScrollIndicator={false}
//                       contentContainerStyle={styles.patternsList}
//                     >
//                       {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
//                     </ScrollView>
//                   )}
//                 </View>
//               )}

//               {/* Games Count */}
//               <View style={styles.gamesCountContainer}>
//                 <Text style={styles.gamesCount}>
//                   {filteredGames.length} {filteredGames.length === 1 ? 'Game' : 'Games'} Available
//                 </Text>
//               </View>
//             </>
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyGames}>
//               <Ionicons name="game-controller-outline" size={48} color={COLORS.textLight} />
//               <Text style={styles.emptyGamesText}>
//                 {searchQuery ? 'No games found' : 'No games available'}
//               </Text>
//               {searchQuery && (
//                 <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
//                   <Text style={styles.clearSearchButtonText}>Clear Search</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           }
//         />

//         {/* Popup */}
//         <UpcomingGamePopup />

//         {/* Notifications Modal */}
//         <Modal visible={modalVisible} transparent={true} animationType="slide">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Notifications</Text>
//                 <TouchableOpacity onPress={() => setModalVisible(false)}>
//                   <Ionicons name="close" size={24} color={COLORS.text} />
//                 </TouchableOpacity>
//               </View>

//               {loadingNotifications ? (
//                 <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalLoader} />
//               ) : (
//                 <FlatList
//                   data={notifications}
//                   keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//                   renderItem={({ item }) => (
//                     <View style={styles.notificationItem}>
//                       <View style={styles.notificationIcon}>
//                         <Ionicons name="notifications" size={20} color={COLORS.primary} />
//                       </View>
//                       <View style={styles.notificationContent}>
//                         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
//                         <Text style={styles.notificationMessage}>
//                           {item.message || "Check out the new features!"}
//                         </Text>
//                         <Text style={styles.notificationDate}>
//                           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
//                         </Text>
//                       </View>
//                     </View>
//                   )}
//                   ListEmptyComponent={
//                     <View style={styles.emptyNotifications}>
//                       <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
//                       <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
//                     </View>
//                   }
//                 />
//               )}
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
//     paddingHorizontal: 16,
//   },
  
//   /* COLOR BLOCKS - Orange Shades - Now Animated */
//   orangeBlock1: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 280,
//     backgroundColor: COLORS.blockLightOrange,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//   },
//   orangeBlock2: {
//     position: 'absolute',
//     top: 200,
//     left: 0,
//     right: 0,
//     height: 160,
//     backgroundColor: COLORS.blockMediumOrange,
//   },
//   orangeBlock3: {
//     position: 'absolute',
//     top: 300,
//     left: 0,
//     right: 0,
//     height: 100,
//     backgroundColor: COLORS.blockDarkOrange,
//     opacity: 0.3,
//   },
  
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   /* Enhanced Header with Semicircle and UK Pattern */
//   headerWrapper: {
//     position: 'relative',
//     marginTop: 8,
//     marginBottom: 8,
//     overflow: 'hidden',
//   },

//   /* Header Content */
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     position: 'relative',
//     zIndex: 2,
//     paddingVertical: 10,
//   },

//   greeting: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: 2,
//   },

//   title: {
//     fontSize: 24,
//     color: COLORS.text,
//   },
  
//   /* Search Box */
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     borderRadius: 18,
//     paddingHorizontal: 14,
//     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },
  
//   /* Semicircle Background */
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
  
//   /* UK-style Rounded Lines Pattern */
//   ukPatternContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
  
//   /* Curved Lines - Like tube map */
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
  
//   /* Parallel Lines */
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
  
//   /* Dotted Circle Pattern */
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
  
//   /* Decorative elements */
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
  
//   titleBold: {
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   notificationIcon: {
//     position: 'relative',
//     padding: 8,
//     backgroundColor: COLORS.surface,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.live,
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//   },
  
//   searchInput: {
//     flex: 1,
//     marginHorizontal: 10,
//     color: COLORS.text,
//     fontSize: 14,
//     padding: 0,
//   },
  
//   filtersContainer: {
//     paddingVertical: 12,
//     gap: 8,
//   },
//   filterChip: {
//     backgroundColor: COLORS.surface,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   activeFilterChip: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   filterChipText: {
//     color: COLORS.text,
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   activeFilterChipText: {
//     color: COLORS.surface,
//   },
  
//   sliderSection: {
//     marginTop: 16,
//     marginBottom: 24,
//     position: 'relative',
//   },
//   slideContainer: {
//     width: width - 32,
//     height: 160,
//     borderRadius: 24,
//     overflow: 'hidden',
//   },
//   sliderImage: {
//     width: '100%',
//     height: '100%',
//   },
//   sliderLoading: {
//     height: 160,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 24,
//     backgroundColor: COLORS.surface,
//     borderRadius: 24,
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 12,
//     alignSelf: 'center',
//   },
//   paginationDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 3,
//   },
//   paginationDotActive: {
//     backgroundColor: '#FFFFFF',
//     width: 16,
//   },
  
//   /* Patterns Section */
//   patternsSection: {
//     marginBottom: 28,
//     marginTop: 8,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingHorizontal: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   seeAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: COLORS.primaryLight,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   seeAllText: {
//     fontSize: 13,
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   patternsList: {
//     paddingHorizontal: 4,
//     gap: 12,
//   },
//   compactPatternCard: {
//     alignItems: 'center',
//     marginRight: 12,
//     width: 60,
//   },
//   compactIconWrapper: {
//     width: 48,
//     height: 48,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   compactPatternName: {
//     fontSize: 11,
//     fontWeight: '500',
//     color: COLORS.text,
//     textAlign: 'center',
//   },
  
//   gamesCountContainer: {
//     marginBottom: 16,
//   },
//   gamesCount: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     fontWeight: '500',
//   },
  
//   gameCard: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 24,
//     marginBottom: 16,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     flexDirection: 'row',
//   },
//   gameImagePlaceholder: {
//     width: 100,
//     height: 140,
//     backgroundColor: COLORS.primaryLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gameCardContent: {
//     flex: 1,
//     padding: 14,
//   },
//   gameCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 10,
//   },
//   gameTitleContainer: {
//     flex: 1,
//     marginRight: 8,
//   },
//   gameName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   gameCode: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   statusPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   statusPillText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   gameMetaRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//   },
//   gameFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     paddingTop: 10,
//   },
//   prizeLabel: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     marginBottom: 2,
//   },
//   prizeValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   arrowButton: {
//     backgroundColor: COLORS.primary,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
  
//   loadingMoreContainer: {
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
  
//   emptyGames: {
//     alignItems: 'center',
//     padding: 40,
//     backgroundColor: COLORS.surface,
//     borderRadius: 24,
//     marginTop: 20,
//   },
//   emptyGamesText: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     marginTop: 12,
//     marginBottom: 16,
//   },
//   clearSearchButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   clearSearchButtonText: {
//     color: COLORS.surface,
//     fontSize: 14,
//     fontWeight: '600',
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
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   popupGameName: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   popupTimer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 20,
//   },
//   popupTimerText: {
//     fontSize: 14,
//     color: COLORS.text,
//     fontWeight: '500',
//   },
//   popupPrize: {
//     alignItems: 'center',
//     marginBottom: 24,
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
  
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: COLORS.surface,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     padding: 20,
//     maxHeight: '80%',
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
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   modalLoader: {
//     marginVertical: 30,
//   },
//   notificationItem: {
//     flexDirection: 'row',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   notificationIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLORS.primaryLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 4,
//   },
//   notificationMessage: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//     marginBottom: 4,
//   },
//   notificationDate: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   emptyNotifications: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyNotificationsText: {
//     marginTop: 12,
//     fontSize: 15,
//     color: COLORS.textSecondary,
//   },
// });

// export default Home;