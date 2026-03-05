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
  Alert,
  Animated,
  RefreshControl,
  Modal,
  Platform,
} from "react-native";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

// Custom Snackbar Component
const CustomSnackbar = ({ visible, message, onDismiss, action }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.snackbarOverlay}>
        <Animated.View
          style={[
            styles.snackbarContainer,
            { transform: [{ translateY }] },
          ]}
        >
          <Text style={styles.snackbarText}>{message}</Text>
          {action && (
            <TouchableOpacity onPress={action.onPress}>
              <Text style={styles.snackbarActionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

// Custom Slider Component
const CustomSlider = ({ 
  value, 
  onValueChange, 
  min = 5, 
  max = 30, 
  step = 1,
  disabled = false 
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const handleLayout = (event) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const calculateValue = (x) => {
    if (sliderWidth === 0 || disabled) return value;
    
    let percentage = (x / sliderWidth) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    const range = max - min;
    const rawValue = min + (percentage / 100) * range;
    
    let newValue = Math.round(rawValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));
    
    return newValue;
  };

  const handleTouchStart = (event) => {
    if (disabled) return;
    setIsSliding(true);
    const x = event.nativeEvent.locationX;
    const newValue = calculateValue(x);
    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  const handleTouchMove = (event) => {
    if (disabled || !isSliding) return;
    const x = event.nativeEvent.locationX;
    const newValue = calculateValue(x);
    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  const handleTouchEnd = () => {
    setIsSliding(false);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <View style={[styles.sliderContainer, disabled && styles.sliderDisabled]}>
      <View 
        style={styles.sliderTrackWrapper}
        onLayout={handleLayout}
      >
        <View style={styles.sliderTrack}>
          <View 
            style={[
              styles.sliderFill,
              { width: `${percentage}%` }
            ]} 
          />
        </View>
        
        <View
          style={styles.sliderTouchArea}
          onStartShouldSetResponder={() => !disabled}
          onMoveShouldSetResponder={() => !disabled}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        />
        
        <View 
          style={[
            styles.sliderThumb,
            { left: `${percentage}%`, marginLeft: -12 },
            isSliding && styles.sliderThumbActive,
            disabled && styles.sliderThumbDisabled
          ]}
        />
      </View>
      
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>{min}s</Text>
        <Text style={styles.sliderValueLabel}>{value}s</Text>
        <Text style={styles.sliderLabel}>{max}s</Text>
      </View>
    </View>
  );
};

const HostGameRoom = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [numberCallingStatus, setNumberCallingStatus] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [startingAutoMode, setStartingAutoMode] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [callingManual, setCallingManual] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(10);
  const [updatingInterval, setUpdatingInterval] = useState(false);
  const [endingGame, setEndingGame] = useState(false);
  
  // Live Chat States
  const [participantCount, setParticipantCount] = useState(0);
  const [isChatJoined, setIsChatJoined] = useState(false);
  
  // Pending Claims States
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [claims, setClaims] = useState([]);
  
  // Snackbar States
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Pusher Refs - Make them specific to this component instance
  const pusherRef = useRef(null);
  const gameChannelRef = useRef(null);
  const adminChannelRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Reconnection Refs
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5; // Reduced from 10 to prevent infinite loops

  // Refs for latest values to avoid stale closures
  const calledNumbersRef = useRef([]);
  const numberCallingStatusRef = useRef(null);
  const fetchGameStatusTimeoutRef = useRef(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const manualButtonAnim = useRef(new Animated.Value(1)).current;
  const autoModeWasRunningRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    calledNumbersRef.current = calledNumbers;
  }, [calledNumbers]);

  useEffect(() => {
    numberCallingStatusRef.current = numberCallingStatus;
  }, [numberCallingStatus]);

  // Debug logging for numberCallingStatus changes
  useEffect(() => {
    if (isMountedRef.current) {
      console.log(`🔄 [Game ${gameId}] numberCallingStatus updated:`, {
        auto_mode: numberCallingStatus?.auto_mode,
        is_running: numberCallingStatus?.is_running,
        is_paused: numberCallingStatus?.is_paused,
        interval_seconds: numberCallingStatus?.interval_seconds,
      });
    }
  }, [numberCallingStatus, gameId]);

  // Set mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => { 
    const initializeApp = async () => {
      try {
        await initializePusher();
        await fetchInitialData();
        startPulseAnimation();
        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        console.log(`[Game ${gameId}] Error initializing app:`, error);
        if (isMountedRef.current) {
          showSnackbar("Failed to initialize. Please check your connection.");
          setLoading(false);
        }
      }
    };
    
    initializeApp();
    
    return () => {
      console.log(`[Game ${gameId}] Cleaning up...`);
      cleanupPusher();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
    };
  }, [gameId]);

  // Initialize Pusher with correct channels and auto-reconnection
  const initializePusher = async () => {
    try {
      console.log(`[Game ${gameId}] Initializing Pusher...`);
      
      // Create a new Pusher instance for this game
      const pusher = Pusher.getInstance();
      
      await pusher.init({
        apiKey: '9c1d16690beded57332a',
        cluster: 'ap2',
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        onConnectionStateChange: (currentState, previousState) => {
          console.log(`[Game ${gameId}] Connection state changed from ${previousState} to ${currentState}`);
          
          if (currentState === 'CONNECTED') {
            console.log(`[Game ${gameId}] Connected successfully`);
            reconnectAttemptsRef.current = 0;
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          }
          
          if (currentState === 'DISCONNECTED' && isMountedRef.current) {
            console.log(`[Game ${gameId}] Disconnected, will attempt to reconnect...`);
            scheduleReconnection();
          }
        },
        onError: (message, code, error) => {
          console.log(`[Game ${gameId}] Pusher error: ${message}`, error);
          if (isMountedRef.current) {
            scheduleReconnection();
          }
        }
      });
      
      await pusher.connect();
      console.log(`[Game ${gameId}] Pusher connected successfully`);
      
      // Subscribe to game channel with game-specific event handler
      const gameChannel = await pusher.subscribe({
        channelName: `game.${gameId}`,
        onEvent: (event) => {
          // Only process events for this game
          if (isMountedRef.current) {
            handleGameEvent(event);
          }
        }
      });
      gameChannelRef.current = gameChannel;
      
      // Subscribe to admin channel with game-specific event handler
      const adminChannel = await pusher.subscribe({
        channelName: `admin.game.${gameId}`,
        onEvent: (event) => {
          // Only process events for this game
          if (isMountedRef.current) {
            handleAdminEvent(event);
          }
        }
      });
      adminChannelRef.current = adminChannel;
      
      pusherRef.current = pusher;
      
      console.log(`[Game ${gameId}] Pusher initialized successfully with all subscriptions`);
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error initializing Pusher:`, error);
      if (isMountedRef.current) {
        scheduleReconnection();
      }
      throw error;
    }
  };

  // Handle game channel events
  const handleGameEvent = (event) => {
    console.log(`[Game ${gameId}] Game channel event: ${event.eventName}`);
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      // Verify this event is for our game
      if (data.game_id && data.game_id !== parseInt(gameId)) {
        console.log(`[Game ${gameId}] Ignoring event for game ${data.game_id}`);
        return;
      }
      
      switch (event.eventName) {
        case 'number.called':
          handleNumberCalled(data);
          break;
        case 'calling.status.updated':
          handleStatusUpdated(data);
          break;
        case 'game.completed':
          handleGameCompleted(data);
          break;
        default:
          console.log(`[Game ${gameId}] Unhandled game event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling game event:`, error);
    }
  };

  // Handle admin channel events
  const handleAdminEvent = (event) => {
    console.log(`[Game ${gameId}] Admin channel event: ${event.eventName}`);
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      // Verify this event is for our game
      if (data.game_id && data.game_id !== parseInt(gameId)) {
        console.log(`[Game ${gameId}] Ignoring admin event for game ${data.game_id}`);
        return;
      }
      
      switch (event.eventName) {
        case 'number.called':
          handleNumberCalled(data);
          break;
        case 'calling.status.updated':
          handleStatusUpdated(data);
          break;
        case 'game.completed':
          handleGameCompleted(data);
          break;
        default:
          console.log(`[Game ${gameId}] Unhandled admin event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling admin event:`, error);
    }
  };

  // Schedule reconnection with exponential backoff
  const scheduleReconnection = () => {
    if (!isMountedRef.current) return;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log(`[Game ${gameId}] Max reconnection attempts reached`);
      showSnackbar('Unable to maintain real-time connection. Please refresh the page.');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    
    console.log(`[Game ${gameId}] Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        reconnectPusher();
      }
    }, delay);
  };

  // Reconnect function
  const reconnectPusher = async () => {
    try {
      console.log(`[Game ${gameId}] Attempting to reconnect Pusher...`);
      
      reconnectAttemptsRef.current += 1;
      
      await cleanupPusher();
      
      if (isMountedRef.current) {
        await initializePusher();
        reconnectAttemptsRef.current = 0;
        showSnackbar('Reconnected successfully');
      }
      
    } catch (error) {
      console.log(`[Game ${gameId}] Reconnection failed:`, error);
      if (isMountedRef.current) {
        scheduleReconnection();
      }
    }
  };

  // Handle number called event
  const handleNumberCalled = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] Processing number called event:`, data);
    
    try {
      const number = data.number;
      const totalCalled = data.total_called;
      const sorted = data.sorted_numbers || [];
      
      console.log(`[Game ${gameId}] 📞 New number: ${number}, Total called: ${totalCalled}`);
      
      setCalledNumbers(prev => {
        if (!prev.includes(number)) {
          const updated = [...prev, number];
          console.log(`[Game ${gameId}] Updated called numbers: ${prev.length} → ${updated.length}`);
          return updated;
        }
        return prev;
      });
      
      setSortedNumbers(sorted);
      
      showSnackbar(`🔔 Number ${number} called!`);
      
      // Debounce fetchGameStatus to avoid too many calls
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchGameStatus();
        }
      }, 500);
      
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling number called event:`, error);
    }
  };

  // Handle status updated event
  const handleStatusUpdated = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] Processing status updated event:`, data);
    
    try {
      setNumberCallingStatus({
        auto_mode: data.auto_mode || false,
        is_running: data.is_running || false,
        is_paused: data.is_paused || false,
        interval_seconds: data.interval_seconds || data.interval || 10,
        total_calls: data.total_calls || 0,
        next_call_in: data.next_call_in,
        next_call_at: data.next_call_at,
        status: data.status,
        started_at: data.started_at,
        paused_at: data.paused_at,
        resumed_at: data.resumed_at,
        stopped_at: data.stopped_at,
      });
      
      if (data.message) {
        showSnackbar(data.message);
      }
      
      // Debounce fetchGameStatus
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchGameStatus();
        }
      }, 500);
      
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling status updated event:`, error);
    }
  };

  // Handle game completed event
  const handleGameCompleted = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] Processing game completed event:`, data);
    
    Alert.alert(
      "🎉 Game Completed",
      `${data.game_name} has been completed!\nTotal Numbers: ${data.total_numbers}`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          }
        }
      ]
    );
  };

  // Cleanup Pusher connections
  const cleanupPusher = async () => {
    console.log(`[Game ${gameId}] Cleaning up Pusher...`);
    
    try {
      const pusher = Pusher.getInstance();
      
      if (gameChannelRef.current) {
        await pusher.unsubscribe({ channelName: `game.${gameId}` });
        gameChannelRef.current = null;
      }
      if (adminChannelRef.current) {
        await pusher.unsubscribe({ channelName: `admin.game.${gameId}` });
        adminChannelRef.current = null;
      }
      
      // Only disconnect if this is the last instance using Pusher
      // Since Pusher is shared, we shouldn't disconnect here
      console.log(`[Game ${gameId}] Pusher cleaned up`);
    } catch (error) {
      console.log(`[Game ${gameId}] Error cleaning up Pusher:`, error);
    }
  };

  // Custom Snackbar functions
  const showSnackbar = (message) => {
    if (!isMountedRef.current) return;
    
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setSnackbarVisible(false);
      }
    }, 3000);
  };

  const fetchInitialData = async () => {
    await Promise.all([
      fetchGameStatus(),
      checkChatStatus(),
      fetchPendingClaimsCount(),
    ]);
  };

  const pauseNumberCallingAutomatically = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        fetchGameStatus();
        showSnackbar("⏸️ Auto calling paused automatically due to new claims");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error automatically pausing number calling:`, error);
    }
  };

  const checkChatStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        setParticipantCount(response.data.total_participants || 0);
        const tokenData = await AsyncStorage.getItem("host");
        if (tokenData) {
          const host = JSON.parse(tokenData);
          const participants = response.data.data || [];
          const isParticipant = Array.isArray(participants) ? participants.some(p => p.id === host.id) : false;
          setIsChatJoined(isParticipant);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error checking chat status:`, error);
    }
  };

  const fetchPendingClaimsCount = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/claims/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        const previousCount = pendingClaimsCount;
        const newCount = response.data.data?.summary?.total_pending || 0;
        
        setPendingClaimsCount(newCount);
        setClaims(response.data.data?.claims || []);
        
        if (newCount > previousCount) {
          const message = `📝 ${newCount - previousCount} new claim${newCount - previousCount > 1 ? 's' : ''} submitted!`;
          showSnackbar(message);
          
          if (numberCallingStatusRef.current?.is_running && !numberCallingStatusRef.current?.is_paused) {
            autoModeWasRunningRef.current = true;
            pauseNumberCallingAutomatically();
          }
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pending claims count:`, error);
      if (isMountedRef.current) {
        setPendingClaimsCount(0);
        setClaims([]);
      }
    }
  };

  const endGame = async () => {
    Alert.alert(
      "End Game",
      "Are you sure you want to end this game? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Game",
          style: "destructive",
          onPress: async () => {
            try {
              setEndingGame(true);
              const token = await AsyncStorage.getItem("hostToken");
              
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/host/game/${gameId}/complete`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.data.success && isMountedRef.current) {
                Alert.alert(
                  "Success",
                  "Game ended successfully!",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.goBack();
                        if (navigation.getParent()) {
                          navigation.getParent().navigate('HostDashboard');
                        }
                      }
                    }
                  ]
                );
              } else {
                throw new Error(response.data.message || "Failed to end game");
              }
            } catch (error) {
              console.log(`[Game ${gameId}] Error ending game:`, error);
              if (isMountedRef.current) {
                Alert.alert(
                  "Error",
                  error.response?.data?.message || error.message || "Failed to end game"
                );
              }
            } finally {
              if (isMountedRef.current) {
                setEndingGame(false);
              }
            }
          },
        },
      ]
    );
  };

  const joinChat = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        setIsChatJoined(true);
        setParticipantCount(response.data.participant_count || 1);
        navigation.navigate('HostLiveChat', {
          gameId,
          gameName,
          participantCount: response.data.participant_count || 1
        });
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error joining chat:`, error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGameStatus();
    await checkChatStatus();
    await fetchPendingClaimsCount();
    if (isMountedRef.current) {
      setRefreshing(false);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startManualButtonAnimation = () => {
    Animated.sequence([
      Animated.timing(manualButtonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(manualButtonAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(manualButtonAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchGameStatus = async () => {
    if (!isMountedRef.current) return;
    
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      console.log(`[Game ${gameId}] 🔍 Fetching game status...`);
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        const data = response.data.data;
        
        setGameStatus(data.game);
        
        const callingStatus = {
          auto_mode: data.calling?.auto_mode || false,
          is_running: data.calling?.is_running || false,
          is_paused: data.calling?.is_paused || false,
          interval_seconds: data.calling?.interval_seconds || 10,
          total_calls: data.calling?.total_calls || 0,
          next_call_in: data.calling?.next_call_in_seconds || data.calling?.next_call_in,
          next_call_at: data.calling?.next_call_at,
          status: data.calling?.status,
          started_at: data.calling?.started_at,
          paused_at: data.calling?.paused_at,
          resumed_at: data.calling?.resumed_at,
          stopped_at: data.calling?.stopped_at,
        };
        
        setNumberCallingStatus(callingStatus);
        
        // Only update called numbers if they're different to avoid unnecessary re-renders
        const newCalledNumbers = data.numbers?.called_numbers || [];
        if (JSON.stringify(calledNumbersRef.current) !== JSON.stringify(newCalledNumbers)) {
          setCalledNumbers(newCalledNumbers);
        }
        
        setSortedNumbers(data.numbers?.sorted_numbers || []);
        
        if (data.calling?.interval_seconds) {
          setIntervalSeconds(data.calling.interval_seconds);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error fetching game status:`, error);
    }
  };

  const callNextNumberManually = async () => {
    try {
      setCallingManual(true);
      startManualButtonAnimation();
      
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/call-next`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        const calledNumber = response.data.data.number;
        showSnackbar(`Called number: ${calledNumber}`);
        await fetchGameStatus();
      } else {
        throw new Error("Failed to call next number");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error calling next number:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to call next number"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setCallingManual(false);
      }
    }
  };

  const initializeNumberCalling = async () => {
    try {
      setInitializing(true);
      console.log(`[Game ${gameId}] 🚀 Initializing number calling...`);
      
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/initialize`,
        { interval_seconds: 10 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        setIntervalSeconds(10);
        
        setNumberCallingStatus(prev => ({
          ...prev,
          auto_mode: true,
          interval_seconds: 10
        }));
        
        await fetchGameStatus();
        
        showSnackbar("✅ Number calling system initialized");
        
        console.log(`[Game ${gameId}] ✅ Number calling initialized successfully`);
      } else {
        throw new Error("Failed to initialize number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error initializing number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to initialize number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setInitializing(false);
      }
    }
  };

  const updateIntervalSeconds = async () => {
    try {
      setUpdatingInterval(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.put(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/interval`,
        { interval_seconds: intervalSeconds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        showSnackbar(`Interval updated to ${intervalSeconds} seconds`);
        await fetchGameStatus();
      } else {
        throw new Error("Failed to update interval");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error updating interval:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to update interval"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setUpdatingInterval(false);
      }
    }
  };

  const startAutoNumberCalling = async () => {
    try {
      setStartingAutoMode(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/start-auto`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        await fetchGameStatus();
        showSnackbar("Auto number calling started");
      } else {
        throw new Error("Failed to start auto number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error starting auto number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to start auto number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setStartingAutoMode(false);
      }
    }
  };

  const pauseNumberCalling = async () => {
    try {
      setPausing(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        await fetchGameStatus();
        showSnackbar("Number calling paused");
      } else {
        throw new Error("Failed to pause number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error pausing number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to pause number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setPausing(false);
      }
    }
  };

  const resumeNumberCalling = async () => {
    try {
      setResuming(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/resume`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        await fetchGameStatus();
        showSnackbar("Number calling resumed");
      } else {
        throw new Error("Failed to resume number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error resuming number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to resume number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setResuming(false);
      }
    }
  };

  const navigateToCalledNumbers = () => {
    navigation.navigate("HostCalledNumbers", {
      gameId: gameId,
      gameName: gameName,
      calledNumbers: calledNumbers,
      sortedNumbers: sortedNumbers,
    });
  };

  const navigateToClaimRequests = () => {
    navigation.navigate("HostClaimRequests", {
      gameId: gameId,
      gameName: gameName,
    });
  };

  const hasPendingClaims = pendingClaimsCount > 0;

  const renderNumberGrid = () => {
    const numbers = [];
    for (let i = 1; i <= 90; i++) {
      const isCalled = calledNumbers.includes(i);
      
      numbers.push(
        <View
          key={i}
          style={[
            styles.numberCell,
            isCalled && styles.calledNumberCell,
          ]}
        >
          <Text style={[
            styles.numberText,
            isCalled && styles.calledNumberText
          ]}>
            {i}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.numberGrid}>
        {numbers}
      </View>
    );
  };

  const renderLastCalledSection = () => {
    if (calledNumbers.length === 0) return null;
    
    const lastFive = [...calledNumbers].slice(-5).reverse();
    
    return (
      <View style={styles.lastCalledCard}>
        <View style={styles.lastCalledHeader}>
          <Ionicons name="megaphone-outline" size={24} color="#9C27B0" />
          <Text style={styles.lastCalledTitle}>Last Called Number</Text>
        </View>
        
        <View style={styles.lastNumberContainer}>
          <Text style={styles.lastNumber}>
            {calledNumbers[calledNumbers.length - 1]}
          </Text>
        </View>
        
        <View style={styles.calledSequence}>
          <Text style={styles.calledSequenceTitle}>Recently Called:</Text>
          <View style={styles.calledSequenceNumbers}>
            {lastFive.map((num, index) => (
              <View
                key={`${num}-${index}`}
                style={styles.sequenceNumber}
              >
                <Text style={styles.sequenceNumberText}>{num}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={navigateToCalledNumbers}
          >
            <Text style={styles.loadMoreText}>View All Called Numbers</Text>
            <Ionicons name="chevron-forward" size={16} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderIntervalSlider = () => (
    <View style={styles.intervalContainer}>
      <View style={styles.intervalHeader}>
        <Ionicons name="time-outline" size={20} color="#3498db" />
        <Text style={styles.intervalTitle}>Calling Interval</Text>
        <View style={styles.intervalBadge}>
          <Text style={styles.intervalBadgeText}>{intervalSeconds}s</Text>
        </View>
      </View>
      
      <CustomSlider
        value={intervalSeconds}
        onValueChange={setIntervalSeconds}
        min={5}
        max={30}
        step={1}
        disabled={updatingInterval || hasPendingClaims}
      />
      
      <View style={styles.sliderSpeedLabels}>
        <Text style={styles.sliderSpeedLabel}>Fast</Text>
        <Text style={styles.sliderSpeedLabel}>Slow</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.updateIntervalButton,
          (updatingInterval || hasPendingClaims) && styles.updateIntervalButtonDisabled
        ]}
        onPress={hasPendingClaims ? () => {
          Alert.alert(
            "Pending Claims",
            `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before updating interval.`,
            [
              { text: "View Claims", onPress: navigateToClaimRequests },
              { text: "OK", style: "default" }
            ]
          );
        } : updateIntervalSeconds}
        disabled={updatingInterval || hasPendingClaims}
      >
        {updatingInterval ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            <Ionicons name="sync" size={18} color="#FFF" />
            <Text style={styles.updateIntervalButtonText}>
              {hasPendingClaims ? "Claims Pending" : "Update Interval"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading Game Room...</Text>
      </View>
    );
  }

  const isInitialized = numberCallingStatus?.auto_mode || false;
  const isRunning = numberCallingStatus?.is_running || false;
  const isPaused = numberCallingStatus?.is_paused || false;

  console.log(`[Game ${gameId}] 🎨 Rendering with state:`, {
    isInitialized,
    isRunning,
    isPaused,
    hasPendingClaims,
    calledNumbersCount: calledNumbers.length
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#3498db" barStyle="light-content" />

      <CustomSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'VIEW',
          onPress: navigateToClaimRequests,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{gameName}</Text>
          <Text style={styles.headerSubtitle}>Game Room</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerActionButton, styles.endGameButton]}
            onPress={endGame}
            disabled={endingGame}
          >
            {endingGame ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="flag-outline" size={18} color="#FFF" />
                <Text style={styles.endGameButtonText}>End</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerActionButton, styles.claimRequestsButton]}
            onPress={navigateToClaimRequests}
          >
            <Ionicons name="checkmark-done-outline" size={18} color="#FFF" />
            {pendingClaimsCount > 0 && (
              <View style={styles.claimBadge}>
                <Text style={styles.claimBadgeText}>
                  {pendingClaimsCount > 99 ? '99+' : pendingClaimsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3498db"
            colors={["#3498db"]}
            progressViewOffset={20}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons name="broadcast" size={24} color="#2196F3" />
            <Text style={styles.statusTitle}>Game Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: gameStatus?.status === 'live' ? '#4CAF5015' : '#FF980015' }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: gameStatus?.status === 'live' ? '#4CAF50' : '#FF9800' }
              ]}>
                {gameStatus?.status?.toUpperCase() || 'LOADING'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="ticket-outline" size={20} color="#9C27B0" />
              <Text style={styles.statValue}>{calledNumbers.length}</Text>
              <Text style={styles.statLabel}>Called</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="grid-outline" size={20} color="#2196F3" />
              <Text style={styles.statValue}>{90 - calledNumbers.length}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#25D366" />
              <Text style={styles.statValue}>{participantCount}</Text>
              <Text style={styles.statLabel}>In Chat</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="checkmark-done-outline" size={20} color={hasPendingClaims ? "#FF5722" : "#4CAF50"} />
              <Text style={styles.statValue}>{pendingClaimsCount}</Text>
              <Text style={styles.statLabel}>Pending Claims</Text>
            </View>
          </View>
          
          {hasPendingClaims && (
            <View style={styles.pendingClaimsWarning}>
              <Ionicons name="warning-outline" size={18} color="#FF5722" />
              <Text style={styles.pendingClaimsWarningText}>
                {pendingClaimsCount} pending claim{pendingClaimsCount !== 1 ? 's' : ''}. Number calling is disabled until resolved.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.winnersButtonContainer}>
          <TouchableOpacity
            style={styles.winnersButton}
            onPress={() => navigation.navigate("HostGameWinners", {
              gameId: gameId,
              gameName: gameName,
            })}
          >
            <Ionicons name="trophy-outline" size={24} color="#FFF" />
            <Text style={styles.winnersButtonText}>Show Winners</Text>
          </TouchableOpacity>
        </View>

        {/* Manual call card - only shown when initialized */}
        {isInitialized && (
          <Animated.View style={[
            styles.manualCallCard,
            { transform: [{ scale: manualButtonAnim }] },
            hasPendingClaims && styles.disabledCard
          ]}>
            <View style={styles.manualCallHeader}>
              <Ionicons name="hand-right" size={24} color={hasPendingClaims ? "#999" : "#FF4081"} />
              <Text style={[styles.manualCallTitle, hasPendingClaims && styles.disabledText]}>
                Manual Number Calling
              </Text>
            </View>
            
            <Text style={[styles.manualCallDescription, hasPendingClaims && styles.disabledText]}>
              Call the next number manually. This will call a random uncalled number.
            </Text>
            
            <View style={styles.manualCallInfo}>
              <View style={styles.manualCallInfoItem}>
                <Ionicons name="information-circle" size={16} color={hasPendingClaims ? "#999" : "#2196F3"} />
                <Text style={[styles.manualCallInfoText, hasPendingClaims && styles.disabledText]}>
                  Available: {90 - calledNumbers.length} numbers
                </Text>
              </View>
              <View style={styles.manualCallInfoItem}>
                <Ionicons name="power" size={16} color={hasPendingClaims ? "#999" : (isRunning && !isPaused ? "#4CAF50" : "#FF9800")} />
                <Text style={[styles.manualCallInfoText, hasPendingClaims && styles.disabledText]}>
                  Auto Mode: {isRunning && !isPaused ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.manualCallButton,
                (callingManual || hasPendingClaims) && styles.manualCallButtonDisabled,
                (isRunning && !isPaused) && styles.manualCallButtonActive
              ]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before calling more numbers.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : callNextNumberManually}
              disabled={callingManual || hasPendingClaims}
            >
              {callingManual ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="megaphone" size={22} color="#FFF" />
                  <Text style={styles.manualCallButtonText}>
                    {hasPendingClaims ? "Pending Claims (Disabled)" : "Call Next Number Now"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.manualCallHint, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Number calling is disabled due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : (isRunning && !isPaused 
                  ? "Manual calls will override the auto timer temporarily."
                  : "Use this to call numbers when auto calling is paused.")}
            </Text>
          </Animated.View>
        )}

        {/* Auto mode controls */}
        {!isInitialized ? (
          <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
            <View style={styles.controlHeader}>
              <Ionicons name="play-circle-outline" size={24} color={hasPendingClaims ? "#999" : "#666"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Initialize Number Calling
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              Initialize the number calling system to start calling numbers automatically.
            </Text>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (initializing || hasPendingClaims) && styles.controlButtonDisabled
              ]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before initializing number calling.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : initializeNumberCalling}
              disabled={initializing || hasPendingClaims}
            >
              {initializing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="rocket-outline" size={18} color="#FFF" />
                  <Text style={styles.controlButtonText}>
                    {hasPendingClaims ? "Pending Claims" : "Initialize System"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : isRunning && !isPaused ? (
          <Animated.View style={[
            styles.controlCard,
            { transform: [{ scale: pulseAnim }] },
            hasPendingClaims && styles.disabledCard
          ]}>
            <View style={styles.controlHeader}>
              <Ionicons name="radio" size={24} color={hasPendingClaims ? "#999" : "#4CAF50"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Auto Number Calling Active
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Auto number calling is paused due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : "Auto number calling is running. Numbers are being called automatically."}
            </Text>
            
            {renderIntervalSlider()}
            
            <TouchableOpacity
              style={[styles.controlButton, styles.pauseButton, (pausing || hasPendingClaims) && styles.controlButtonDisabled]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before pausing.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : pauseNumberCalling}
              disabled={pausing || hasPendingClaims}
            >
              {pausing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="pause-circle" size={18} color="#FFF" />
                  <Text style={styles.controlButtonText}>
                    {hasPendingClaims ? "Claims Pending" : "Pause Auto Calling"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        ) : isPaused ? (
          <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
            <View style={styles.controlHeader}>
              <Ionicons name="pause-circle" size={24} color={hasPendingClaims ? "#999" : "#FF9800"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Auto Number Calling Paused
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Auto number calling is paused due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : "Auto number calling is currently paused. Tap resume to continue."}
            </Text>
            
            {renderIntervalSlider()}
            
            <TouchableOpacity
              style={[styles.controlButton, styles.resumeButton, (resuming || hasPendingClaims) && styles.controlButtonDisabled]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before resuming.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : resumeNumberCalling}
              disabled={resuming || hasPendingClaims}
            >
              {resuming ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="play-circle" size={18} color="#FFF" />
                  <Text style={styles.controlButtonText}>
                    {hasPendingClaims ? "Claims Pending" : "Resume Auto Calling"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
            <View style={styles.controlHeader}>
              <Ionicons name="play-circle" size={24} color={hasPendingClaims ? "#999" : "#4CAF50"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Start Auto Number Calling
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Auto number calling is disabled due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : "Start automatic number calling with configured intervals."}
            </Text>
            
            {renderIntervalSlider()}
            
            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.startButton,
                (startingAutoMode || hasPendingClaims) && styles.controlButtonDisabled
              ]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before starting.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : startAutoNumberCalling}
              disabled={startingAutoMode || hasPendingClaims}
            >
              {startingAutoMode ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="play" size={18} color="#FFF" />
                  <Text style={styles.controlButtonText}>
                    {hasPendingClaims ? "Claims Pending" : "Start Auto Calling"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {renderLastCalledSection()}

        <View style={styles.numbersSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="grid" size={24} color="#333" />
            <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>
                {calledNumbers.length}/90 called
              </Text>
            </View>
          </View>
          
          {renderNumberGrid()}
          
          <Text style={styles.numbersHint}>
            Called numbers are highlighted in green.
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("HostTicketRequests", {
              gameId: gameId,
              gameName: gameName,
            })}
          >
            <Ionicons name="ticket-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Ticket Requests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => navigation.navigate("HostGameUsers", {
              gameId: gameId,
              gameName: gameName,
            })}
          >
            <Ionicons name="people-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Players List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.tertiaryAction]}
            onPress={navigateToCalledNumbers}
          >
            <Ionicons name="list-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Called Numbers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.refreshHint}>
          <Ionicons name="arrow-down" size={14} color="#9CA3AF" />
          <Text style={styles.refreshHintText}>Pull down to refresh</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={joinChat}
        activeOpacity={0.8}
      >
        <View style={styles.chatButtonContent}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
          {participantCount > 0 && (
            <View style={styles.chatBadge}>
              <Text style={styles.chatBadgeText}>
                {participantCount > 99 ? '99+' : participantCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.chatButtonText}>
          {isChatJoined ? 'Live Chat' : 'Join Chat'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  endGameButton: {
    backgroundColor: "#FF5722",
  },
  endGameButtonText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: 'bold',
  },
  claimRequestsButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  claimBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  claimBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  snackbarOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingBottom: 80,
  },
  snackbarContainer: {
    backgroundColor: '#FF9800',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  snackbarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  snackbarActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  statusCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  statItem: {
    alignItems: "center",
    width: "25%",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  pendingClaimsWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
    marginTop: 10,
    gap: 10,
  },
  pendingClaimsWarningText: {
    fontSize: 13,
    color: "#D32F2F",
    fontWeight: "500",
    flex: 1,
  },
  winnersButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  winnersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  winnersButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  manualCallCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#FF4081",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  disabledCard: {
    borderColor: "#E0E0E0",
    shadowColor: "#9E9E9E",
    opacity: 0.8,
  },
  manualCallHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  manualCallTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  disabledText: {
    color: "#999",
  },
  manualCallDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  manualCallInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  manualCallInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  manualCallInfoText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  manualCallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4081",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  manualCallButtonActive: {
    backgroundColor: "#E91E63",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  manualCallButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.7,
  },
  manualCallButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  manualCallHint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  controlCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  controlDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FF5722",
  },
  resumeButton: {
    backgroundColor: "#4CAF50",
  },
  controlButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.7,
  },
  controlButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sliderDisabled: {
    opacity: 0.5,
  },
  sliderTrackWrapper: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    height: 6,
    backgroundColor: '#3498db',
    borderRadius: 3,
  },
  sliderTouchArea: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    bottom: -20,
    backgroundColor: 'transparent',
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    borderWidth: 3,
    borderColor: '#FFF',
    top: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderThumbActive: {
    transform: [{ scale: 1.1 }],
    backgroundColor: '#1E6AB1',
  },
  sliderThumbDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sliderValueLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
  },
  intervalContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  intervalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  intervalTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  intervalBadge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  intervalBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3498db",
  },
  sliderSpeedLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sliderSpeedLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  updateIntervalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  updateIntervalButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.7,
  },
  updateIntervalButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  lastCalledCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  lastCalledHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  lastCalledTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  lastNumberContainer: {
    alignItems: "center",
    backgroundColor: "#F3F0FF",
    padding: 30,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#7E57C2",
  },
  lastNumber: {
    fontSize: 72,
    fontWeight: "900",
    color: "#7E57C2",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  calledSequence: {
    marginTop: 8,
  },
  calledSequenceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  calledSequenceNumbers: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  sequenceNumber: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  sequenceNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498db",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E6F0FF",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498db",
  },
  numbersSection: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3498db",
  },
  numberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  numberCell: {
    width: (width - 80) / 10,
    height: (width - 80) / 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  calledNumberCell: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  numberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  calledNumberText: {
    color: "#FFF",
    fontWeight: "700",
  },
  numbersHint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  actionsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryAction: {
    backgroundColor: "#FF9800",
  },
  tertiaryAction: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  refreshHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 6,
  },
  refreshHintText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#075E54',
    borderRadius: 50,
    width: 140,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatButtonContent: {
    position: 'relative',
    marginRight: 8,
  },
  chatBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default HostGameRoom;