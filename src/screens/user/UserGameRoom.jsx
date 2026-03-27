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
  Platform,
  useWindowDimensions,
  AppState,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Sound from "react-native-sound";
import Tts from "react-native-tts";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Parameters from TicketsScreen
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 8;
const HORIZONTAL_MARGIN = 10;

// Calculation from TicketsScreen
const CELL_WIDTH = 
  (SCREEN_WIDTH - 
   HORIZONTAL_MARGIN * 2 - 
   TICKET_PADDING * 2 - 
   CELL_MARGIN * 2 * NUM_COLUMNS) / 
  NUM_COLUMNS;

// Enhanced color scheme with gradients
const COLORS = {
  primary: "#4facfe",
  primaryGradient: ['#359df9', '#64d8f8'],
  secondary: "#FDB800",
  secondaryGradient: ['#FDB800', '#FF8C00'],
  ticketBorder: "#fcca26",
  ticketBorderGradient: ['#fcca26', '#ff9800'],
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
  
  // Additional gradients
  prizeGradient: ['#4facfe20', '#00c6fb20'],
  winnerGradient: ['#4facfe10', '#9fcdff10'],
  glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
  
  // Individual colors with gradients
  purple: "#9B59B6",
  purpleGradient: ['#9B59B6', '#8E44AD'],
  orange: "#FF9800",
  orangeGradient: ['#FF9800', '#F57C00'],
  teal: "#4ECDC4",
  tealGradient: ['#4ECDC4', '#2AA7A0'],
  red: "#EF4444",
  redGradient: ['#EF4444', '#DC2626'],
  green: "#10B981",
  greenGradient: ['#10B981', '#059669'],
  warning: "#ff9800",
  warningGradient: ['#ff9800', '#f57c00'],
};

// Row colors for ticket grid
const ROW_COLOR_1 = "#f0f8ff";
const ROW_COLOR_2 = "#e6f3ff";
const FILLED_CELL_BG = "#62cff4";
const CELL_BORDER_COLOR = COLORS.primary;
const NUMBER_COLOR = COLORS.surface;
const EMPTY_CELL_BG = "transparent";
const MARKED_CELL_BG = COLORS.red;
const MARKED_CELL_BORDER = "#C0392B";

// Pattern sequence for sorting
const PATTERN_SEQUENCE = [
  { keywords: ['top line', 'topline', 'top-line'] },
  { keywords: ['middle line', 'middleline', 'middle-line'] },
  { keywords: ['bottom line', 'bottomline', 'bottom-line'] },
  { keywords: ['breakfast'] },
  { keywords: ['lunch'] },
  { keywords: ['dinner'] },
  { keywords: ['four corners', '4 corners', 'fourcorners'] },
  { keywords: ['bamboo'] },
  { keywords: ['early five', 'early 5', 'earlyfive'] },
  { keywords: ['non claimers', 'nonclaimers', 'non-claimers'] },
  { keywords: ['full house', 'fullhouse'] }
];

const sortPatternsBySequence = (patterns) => {
  if (!patterns || patterns.length === 0) return patterns;
  
  const getPatternIndex = (pattern) => {
    const patternName = (pattern.display_name || pattern.pattern_name || pattern.reward_name || '').toLowerCase();
    
    for (let i = 0; i < PATTERN_SEQUENCE.length; i++) {
      if (PATTERN_SEQUENCE[i].keywords.some(keyword => patternName.includes(keyword))) {
        return i;
      }
    }
    return PATTERN_SEQUENCE.length;
  };

  return [...patterns].sort((a, b) => {
    const aIndex = getPatternIndex(a);
    const bIndex = getPatternIndex(b);
    return aIndex - bIndex;
  });
};

const CustomSnackbar = ({ visible, message, type = 'info', onDismiss }) => {
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

  const getGradient = () => {
    switch(type) {
      case 'success': return COLORS.greenGradient;
      case 'error': return COLORS.redGradient;
      case 'warning': return COLORS.warningGradient;
      default: return COLORS.primaryGradient;
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'success': return "checkmark-circle";
      case 'error': return "close-circle";
      case 'warning': return "warning";
      default: return "information-circle";
    }
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={styles.snackbarAbsoluteContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.snackbarContainer,
          { transform: [{ translateY }] }
        ]}
      >
        <LinearGradient
          colors={getGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.snackbarGradient}
        >
          <Ionicons name={getIcon()} size={20} color={COLORS.surface} style={styles.snackbarIcon} />
          <Text style={styles.snackbarText}>{message}</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const UserGameRoom = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [callingStatus, setCallingStatus] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [isChatJoined, setIsChatJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [markingLoading, setMarkingLoading] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [claims, setClaims] = useState([]);
  const [initialClaimsFetched, setInitialClaimsFetched] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [patternRewards, setPatternRewards] = useState([]);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [showWinningCelebration, setShowWinningCelebration] = useState(false);
  const [winningMessage, setWinningMessage] = useState('');
  const [winningUser, setWinningUser] = useState('');
  const [winningAmount, setWinningAmount] = useState(0);
  const [winningPattern, setWinningPattern] = useState('');
  
  const [patternsByTicket, setPatternsByTicket] = useState({});
  const [totalPatternCounts, setTotalPatternCounts] = useState({});
  const [processingCells, setProcessingCells] = useState(new Set());
  
  const [showPatternsModal, setShowPatternsModal] = useState(false);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [menuPatterns, setMenuPatterns] = useState([]);
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [selectedPatternForView, setSelectedPatternForView] = useState(null);
  
  const [blinkingPattern, setBlinkingPattern] = useState(null);
  const [blinkingCells, setBlinkingCells] = useState({});
  const [blinkingAnimations, setBlinkingAnimations] = useState({});
  
  const [clickSound, setClickSound] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'info'
  });
  
  const [appState, setAppState] = useState(AppState.currentState);
  
  // State for optimistic updates with persistence
  const [pendingMarkings, setPendingMarkings] = useState({});
  const [failedMarkings, setFailedMarkings] = useState({});
  const pendingMarkingsRef = useRef({});
  const failedMarkingsRef = useRef({});
  const markingQueueRef = useRef([]);
  const isProcessingQueueRef = useRef(false);
  const retryTimeoutsRef = useRef({});
  
  // Pusher Refs
  const pusherRef = useRef(null);
  const gameChannelRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Reconnection Refs
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 10;
  
  // Queue for missed events
  const missedEventsQueueRef = useRef([]);
  const processingQueueRef = useRef(false);
  const isPusherConnectedRef = useRef(false);
  
  // Refs for latest values
  const calledNumbersRef = useRef([]);
  const claimsRef = useRef([]);
  
  // Track spoken numbers in AsyncStorage
  const spokenInSessionRef = useRef(new Set());
  
  // TTS Queue System with comprehensive logging
  const ttsQueueRef = useRef([]);
  const isTtsProcessingRef = useRef(false);
  const ttsInitializedRef = useRef(false);
  const ttsRetryCountRef = useRef(0);
  const ttsProcessingTimeoutRef = useRef(null);
  const ttsCurrentTextRef = useRef(null);
  const pendingNumbersRef = useRef(new Set());
  const numbersBeingSpokenRef = useRef(new Set());
  
  // Other refs
  const lastCalledRef = useRef(null);
  const confettiAnimation = useRef(new Animated.Value(0)).current;
  const menuRefs = useRef([]);
  const lastApprovedClaimRef = useRef(null);
  const audioEnabled = useRef(true);
  const blinkingIntervals = useRef({});
  const blinkingTimeouts = useRef({});
  const gameEndShownRef = useRef(false);
  const announcedClaimIds = useRef(new Set());
  const isSubmittingClaimRef = useRef(false);
  const snackbarTimeout = useRef(null);
  const fetchGameStatusTimeoutRef = useRef(null);
  const menuScrollViewRef = useRef(null);
  
  // Animation refs
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0.5)).current;
  const celebrationTranslateY = useRef(new Animated.Value(50)).current;
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const confettiTranslateY = useRef([]);

  // Animation values for background
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  
  // Button animation refs
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const chatButtonScale = useRef(new Animated.Value(1)).current;
  const claimButtonScales = useRef([]);
  const patternsButtonScales = useRef([]);
  
  // Header letter animations
  const letterAnims = useRef([]);

  // Load pending and failed markings from AsyncStorage
  const loadPendingMarkings = async () => {
    try {
      const pending = await AsyncStorage.getItem(`pending_markings_${gameId}`);
      if (pending) {
        const parsed = JSON.parse(pending);
        pendingMarkingsRef.current = parsed;
        setPendingMarkings(parsed);
        
        // Apply pending markings to tickets
        applyPendingMarkingsToTickets(parsed);
        
        console.log(`[Game ${gameId}] ✅ Loaded ${Object.keys(parsed).length} pending markings`);
        
        // Process any pending markings in the queue
        Object.keys(parsed).forEach(ticketId => {
          const markings = parsed[ticketId];
          Object.keys(markings).forEach(number => {
            if (markings[number] === true) {
              addToMarkingQueue(parseInt(ticketId), parseInt(number), false, null);
            }
          });
        });
      }
      
      const failed = await AsyncStorage.getItem(`failed_markings_${gameId}`);
      if (failed) {
        const parsed = JSON.parse(failed);
        failedMarkingsRef.current = parsed;
        setFailedMarkings(parsed);
        console.log(`[Game ${gameId}] ⚠️ Loaded ${Object.keys(parsed).length} failed markings`);
        
        // Retry failed markings
        Object.keys(parsed).forEach(ticketId => {
          const markings = parsed[ticketId];
          Object.keys(markings).forEach(number => {
            if (markings[number] === true) {
              addToMarkingQueue(parseInt(ticketId), parseInt(number), false, null);
            }
          });
        });
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error loading pending markings:`, error);
    }
  };

  // Save pending markings to AsyncStorage
  const savePendingMarkings = async () => {
    try {
      await AsyncStorage.setItem(
        `pending_markings_${gameId}`,
        JSON.stringify(pendingMarkingsRef.current)
      );
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error saving pending markings:`, error);
    }
  };

  // Save failed markings to AsyncStorage
  const saveFailedMarkings = async () => {
    try {
      await AsyncStorage.setItem(
        `failed_markings_${gameId}`,
        JSON.stringify(failedMarkingsRef.current)
      );
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error saving failed markings:`, error);
    }
  };

  // Apply pending markings to tickets
  const applyPendingMarkingsToTickets = (pendingMarkings) => {
    setMyTickets(prevTickets => 
      prevTickets.map(ticket => {
        const ticketPendingMarkings = pendingMarkings[ticket.id];
        if (!ticketPendingMarkings) return ticket;
        
        const updatedTicketData = ticket.ticket_data.map(row =>
          row.map(cell => {
            if (cell && cell.number !== null && ticketPendingMarkings[cell.number] === true) {
              return { ...cell, is_marked: true };
            }
            return cell;
          })
        );
        return { ...ticket, ticket_data: updatedTicketData };
      })
    );
  };

  // Add marking to queue
  const addToMarkingQueue = (ticketId, cellNumber, isCurrentlyMarked, cellKey) => {
    const marking = { ticketId, cellNumber, isCurrentlyMarked, cellKey, timestamp: Date.now() };
    markingQueueRef.current.push(marking);
    processMarkingQueue();
  };

  // Process marking queue with retry logic
  const processMarkingQueue = async () => {
    if (isProcessingQueueRef.current || markingQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    while (markingQueueRef.current.length > 0) {
      const marking = markingQueueRef.current[0];
      const { ticketId, cellNumber, isCurrentlyMarked, cellKey } = marking;
      
      try {
        const token = await AsyncStorage.getItem("token");
        
        // Remove from failed markings if exists
        if (failedMarkingsRef.current[ticketId]?.[cellNumber]) {
          delete failedMarkingsRef.current[ticketId][cellNumber];
          if (Object.keys(failedMarkingsRef.current[ticketId]).length === 0) {
            delete failedMarkingsRef.current[ticketId];
          }
          setFailedMarkings({ ...failedMarkingsRef.current });
          await saveFailedMarkings();
        }
        
        if (isCurrentlyMarked) {
          // Unmark
          await axios.post(
            `https://tambolatime.co.in/public/api/user/tickets/${ticketId}/unmark`,
            { number: cellNumber },
            { headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" } }
          );
          
          // Remove from pending markings
          if (pendingMarkingsRef.current[ticketId]?.[cellNumber]) {
            delete pendingMarkingsRef.current[ticketId][cellNumber];
            if (Object.keys(pendingMarkingsRef.current[ticketId]).length === 0) {
              delete pendingMarkingsRef.current[ticketId];
            }
            setPendingMarkings({ ...pendingMarkingsRef.current });
            await savePendingMarkings();
          }
          
          console.log(`[Game ${gameId}] ✅ Successfully unmarked number ${cellNumber} on ticket ${ticketId}`);
        } else {
          // Mark
          await axios.post(
            "https://tambolatime.co.in/public/api/user/tickets/mark-multiple",
            { ticket_marks: [{ ticket_id: ticketId, numbers: [cellNumber] }] },
            { headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" } }
          );
          
          // Remove from pending markings
          if (pendingMarkingsRef.current[ticketId]?.[cellNumber]) {
            delete pendingMarkingsRef.current[ticketId][cellNumber];
            if (Object.keys(pendingMarkingsRef.current[ticketId]).length === 0) {
              delete pendingMarkingsRef.current[ticketId];
            }
            setPendingMarkings({ ...pendingMarkingsRef.current });
            await savePendingMarkings();
          }
          
          console.log(`[Game ${gameId}] ✅ Successfully marked number ${cellNumber} on ticket ${ticketId}`);
        }
        
        // Remove from queue
        markingQueueRef.current.shift();
        
        // Clear any retry timeout for this marking
        const retryKey = `${ticketId}-${cellNumber}`;
        if (retryTimeoutsRef.current[retryKey]) {
          clearTimeout(retryTimeoutsRef.current[retryKey]);
          delete retryTimeoutsRef.current[retryKey];
        }
        
      } catch (error) {
        console.log(`[Game ${gameId}] ❌ Error processing marking:`, error);
        
        // Add to failed markings
        if (!failedMarkingsRef.current[ticketId]) {
          failedMarkingsRef.current[ticketId] = {};
        }
        failedMarkingsRef.current[ticketId][cellNumber] = true;
        setFailedMarkings({ ...failedMarkingsRef.current });
        await saveFailedMarkings();
        
        // Schedule retry
        const retryKey = `${ticketId}-${cellNumber}`;
        if (retryTimeoutsRef.current[retryKey]) {
          clearTimeout(retryTimeoutsRef.current[retryKey]);
        }
        
        retryTimeoutsRef.current[retryKey] = setTimeout(() => {
          // Remove from queue and add back for retry
          markingQueueRef.current.shift();
          addToMarkingQueue(ticketId, cellNumber, isCurrentlyMarked, cellKey);
          delete retryTimeoutsRef.current[retryKey];
        }, 5000);
        
        // Don't remove from queue, wait for retry
        break;
      }
    }
    
    isProcessingQueueRef.current = false;
  };

  // Load spoken numbers from AsyncStorage
  const loadSpokenNumbers = async () => {
    try {
      const spoken = await AsyncStorage.getItem(`spoken_numbers_${gameId}`);
      if (spoken) {
        const numbers = JSON.parse(spoken);
        spokenInSessionRef.current = new Set(numbers);
        console.log(`[Game ${gameId}] ✅ Loaded ${numbers.length} previously spoken numbers:`, numbers);
      } else {
        console.log(`[Game ${gameId}] 📝 No previously spoken numbers found for this game`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error loading spoken numbers:`, error);
    }
  };

  // Save spoken numbers to AsyncStorage
  const saveSpokenNumbers = async () => {
    try {
      const numbers = Array.from(spokenInSessionRef.current);
      await AsyncStorage.setItem(`spoken_numbers_${gameId}`, JSON.stringify(numbers));
      console.log(`[Game ${gameId}] 💾 Saved ${numbers.length} spoken numbers to storage`);
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error saving spoken numbers:`, error);
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

  const getNumberSpeechText = (number) => {
    const numStr = number.toString();
    let speechText = '';
    
    if (numStr.length === 1) {
      const digitWord = getSingleDigitWord(number);
      speechText = `Single digit ${digitWord}`;
    } else {
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
      speechText = `Number ${singleDigits}. ${fullNumberName}`;
    }
    
    return speechText;
  };

  const addToTtsQueue = (text, number = null) => {
    if (!audioEnabled.current || !text) {
      console.log(`[Game ${gameId}] ❌ addToTtsQueue skipped - audioEnabled: ${audioEnabled.current}, text: "${text}"`);
      return;
    }
    
    console.log(`[Game ${gameId}] 📥 ADD_TO_QUEUE - Text: "${text}", Number: ${number}, Queue size before: ${ttsQueueRef.current.length}`);
    
    if (number !== null) {
      pendingNumbersRef.current.add(number);
      console.log(`[Game ${gameId}] 📌 Marked number ${number} as PENDING`);
    }
    
    const queueItem = { text, number, timestamp: Date.now() };
    ttsQueueRef.current.push(queueItem);
    
    console.log(`[Game ${gameId}] ✅ QUEUED - Item added, Queue size now: ${ttsQueueRef.current.length}`);
    
    processTtsQueue();
  };

  const processTtsQueue = async () => {
    if (isTtsProcessingRef.current) {
      console.log(`[Game ${gameId}] ⏸️ TTS ALREADY PROCESSING - Queue size: ${ttsQueueRef.current.length}, will wait`);
      return;
    }

    if (ttsQueueRef.current.length === 0) {
      console.log(`[Game ${gameId}] 📭 QUEUE EMPTY - No items to process`);
      return;
    }

    const queueItem = ttsQueueRef.current[0];
    const text = queueItem.text;
    const number = queueItem.number;
    
    console.log(`[Game ${gameId}] 🎤 STARTING TTS - Processing item: "${text}" (Number: ${number})`);
    
    isTtsProcessingRef.current = true;
    ttsCurrentTextRef.current = text;
    
    if (number !== null) {
      numbersBeingSpokenRef.current.add(number);
      pendingNumbersRef.current.delete(number);
      console.log(`[Game ${gameId}] 📌 Marked number ${number} as BEING_SPOKEN`);
    }
    
    const processedItem = ttsQueueRef.current.shift();
    console.log(`[Game ${gameId}] 🗑️ Removed item from queue, Queue size NOW: ${ttsQueueRef.current.length}`);
    
    try {
      if (ttsProcessingTimeoutRef.current) {
        clearTimeout(ttsProcessingTimeoutRef.current);
      }
      
      console.log(`[Game ${gameId}] 🔊 Stopping any ongoing TTS...`);
      await Tts.stop();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`[Game ${gameId}] 🔊 Speaking: "${text}"`);
      await Tts.speak(text);
      
      ttsProcessingTimeoutRef.current = setTimeout(() => {
        console.log(`[Game ${gameId}] ⚠️ SAFETY TIMEOUT - TTS hung for 8 seconds for: "${text}" (Number: ${number})`);
        isTtsProcessingRef.current = false;
        if (number !== null) {
          numbersBeingSpokenRef.current.delete(number);
        }
        ttsProcessingTimeoutRef.current = null;
        ttsCurrentTextRef.current = null;
        processTtsQueue();
      }, 8000);
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ ERROR SPEAKING - "${text}" (Number: ${number}) - Error:`, error);
      
      isTtsProcessingRef.current = false;
      if (number !== null) {
        numbersBeingSpokenRef.current.delete(number);
      }
      if (ttsProcessingTimeoutRef.current) {
        clearTimeout(ttsProcessingTimeoutRef.current);
        ttsProcessingTimeoutRef.current = null;
      }
      ttsCurrentTextRef.current = null;
      
      if (number !== null && ttsRetryCountRef.current < 3) {
        ttsRetryCountRef.current++;
        console.log(`[Game ${gameId}] 🔄 RETRYING - Number ${number} (attempt ${ttsRetryCountRef.current}/3)`);
        ttsQueueRef.current.unshift(processedItem);
        setTimeout(() => processTtsQueue(), 500);
      } else {
        console.log(`[Game ${gameId}] ❌ GIVING UP - Number ${number} after ${ttsRetryCountRef.current} retries`);
        ttsRetryCountRef.current = 0;
        setTimeout(() => processTtsQueue(), 100);
      }
    }
  };

  const clearTtsQueue = async () => {
    console.log(`[Game ${gameId}] 🧹 Clearing TTS queue`);
    ttsQueueRef.current = [];
    pendingNumbersRef.current.clear();
    numbersBeingSpokenRef.current.clear();
    ttsRetryCountRef.current = 0;
    
    if (ttsProcessingTimeoutRef.current) {
      clearTimeout(ttsProcessingTimeoutRef.current);
      ttsProcessingTimeoutRef.current = null;
    }
    
    try {
      await Tts.stop();
    } catch (error) {
      console.log(`[Game ${gameId}] Error stopping TTS:`, error);
    }
    
    isTtsProcessingRef.current = false;
    ttsCurrentTextRef.current = null;
  };

  const speakNumber = async (number) => {
    console.log(`[Game ${gameId}] 🎯 SPEAK_NUMBER CALLED for: ${number}`);
    
    if (!audioEnabled.current) {
      console.log(`[Game ${gameId}] ⚠️ AUDIO DISABLED - skipping number ${number}`);
      return;
    }
    
    if (!ttsInitializedRef.current) {
      console.log(`[Game ${gameId}] ⏳ TTS NOT INITIALIZED - queueing number: ${number}`);
      const queueForLater = () => {
        if (ttsInitializedRef.current) {
          console.log(`[Game ${gameId}] 🔄 TTS now initialized, retrying number: ${number}`);
          speakNumber(number);
        } else {
          console.log(`[Game ${gameId}] ⏳ Still waiting for TTS init, will retry ${number}`);
          setTimeout(queueForLater, 100);
        }
      };
      setTimeout(queueForLater, 100);
      return;
    }
    
    // Check if already spoken in this session (from storage)
    if (spokenInSessionRef.current.has(number)) {
      console.log(`[Game ${gameId}] ⚠️ Number ${number} already spoken in this session, skipping`);
      return;
    }
    
    // Check if already in queue (pending or being spoken)
    const isPending = pendingNumbersRef.current.has(number);
    const isBeingSpoken = numbersBeingSpokenRef.current.has(number);
    
    if (isPending || isBeingSpoken) {
      console.log(`[Game ${gameId}] ⚠️ Number ${number} already in queue or being spoken, SKIPPING duplicate`);
      return;
    }
    
    const speechText = getNumberSpeechText(number);
    console.log(`[Game ${gameId}] 📝 Generated speech text for ${number}: "${speechText}"`);
    
    addToTtsQueue(speechText, number);
    
    // Mark as spoken in session and save immediately
    spokenInSessionRef.current.add(number);
    await saveSpokenNumbers();
    console.log(`[Game ${gameId}] ✅ Marked number ${number} as spoken and saved to storage`);
  };

  const initializeTTS = async () => {
    try {
      await Tts.getInitStatus();
      
      Tts.addEventListener('tts-start', () => {
        console.log(`[Game ${gameId}] 🎤 TTS STARTED SPEAKING: "${ttsCurrentTextRef.current}"`);
      });

      Tts.addEventListener('tts-finish', () => {
        let currentNumber = null;
        for (const num of numbersBeingSpokenRef.current) {
          currentNumber = num;
          break;
        }
        
        console.log(`[Game ${gameId}] ✅ TTS FINISHED SPEAKING: "${ttsCurrentTextRef.current}" (Number: ${currentNumber})`);
        
        if (ttsProcessingTimeoutRef.current) {
          clearTimeout(ttsProcessingTimeoutRef.current);
          ttsProcessingTimeoutRef.current = null;
        }
        
        isTtsProcessingRef.current = false;
        if (currentNumber !== null) {
          numbersBeingSpokenRef.current.delete(currentNumber);
          console.log(`[Game ${gameId}] 📌 Removed number ${currentNumber} from BEING_SPOKEN`);
        }
        ttsCurrentTextRef.current = null;
        ttsRetryCountRef.current = 0;
        
        setTimeout(() => processTtsQueue(), 100);
      });

      Tts.addEventListener('tts-cancel', () => {
        let currentNumber = null;
        for (const num of numbersBeingSpokenRef.current) {
          currentNumber = num;
          break;
        }
        
        console.log(`[Game ${gameId}] ⏸️ TTS CANCELLED: "${ttsCurrentTextRef.current}" (Number: ${currentNumber})`);
        
        if (ttsProcessingTimeoutRef.current) {
          clearTimeout(ttsProcessingTimeoutRef.current);
          ttsProcessingTimeoutRef.current = null;
        }
        
        isTtsProcessingRef.current = false;
        if (currentNumber !== null) {
          numbersBeingSpokenRef.current.delete(currentNumber);
        }
        ttsCurrentTextRef.current = null;
        ttsRetryCountRef.current = 0;
        
        setTimeout(() => processTtsQueue(), 100);
      });

      Tts.addEventListener('tts-error', (error) => {
        let currentNumber = null;
        for (const num of numbersBeingSpokenRef.current) {
          currentNumber = num;
          break;
        }
        
        console.log(`[Game ${gameId}] ❌ TTS ERROR: "${ttsCurrentTextRef.current}" (Number: ${currentNumber}) - Error:`, error);
        
        if (ttsProcessingTimeoutRef.current) {
          clearTimeout(ttsProcessingTimeoutRef.current);
          ttsProcessingTimeoutRef.current = null;
        }
        
        isTtsProcessingRef.current = false;
        if (currentNumber !== null) {
          numbersBeingSpokenRef.current.delete(currentNumber);
        }
        ttsCurrentTextRef.current = null;
        
        setTimeout(() => processTtsQueue(), 500);
      });
      
      const availableVoices = await Tts.voices();
      const englishVoices = availableVoices.filter(v => v.language.startsWith('en'));

      // Always use male voice (prefer male voice, fallback to first English voice)
      const maleVoice = englishVoices.find(v => 
        v.name?.toLowerCase().includes('male') || 
        v.id.toLowerCase().includes('male') ||
        v.id.toLowerCase().includes('daniel')
      );

      const voiceId = maleVoice ? maleVoice.id : (englishVoices[0]?.id || null);
      
      if (voiceId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await Tts.setDefaultVoice(voiceId);
        console.log(`[Game ${gameId}] Voice set to male voice: ${voiceId}`);
      } else {
        console.log(`[Game ${gameId}] No suitable voice found, using default`);
      }
      
      Tts.setDefaultRate(0.5);
      
    } catch (error) {
      console.log(`[Game ${gameId}] Error initializing TTS:`, error);
    }
    
    ttsInitializedRef.current = true;
    console.log(`[Game ${gameId}] ✅ TTS Initialized successfully`);
  };

  // Handle number called with session tracking
  const handleNumberCalled = (data) => {
    console.log(`[Game ${gameId}] 🔔 NUMBER_CALLED EVENT RECEIVED`);
    
    try {
      const number = data.number;
      console.log(`[Game ${gameId}] 🎲 New number called: ${number}`);
      
      const currentNumbers = [...calledNumbersRef.current];
      
      if (!currentNumbers.includes(number)) {
        const newCalledNumbers = [...currentNumbers, number];
        
        console.log(`[Game ${gameId}] ✅ Adding ${number} to called numbers list`);
        
        setCalledNumbers(newCalledNumbers);
        calledNumbersRef.current = newCalledNumbers;
        
        // Check if already spoken in this session
        if (!spokenInSessionRef.current.has(number) && audioEnabled.current) {
          console.log(`[Game ${gameId}] 🔊 Calling speakNumber for ${number}`);
          speakNumber(number);
        } else {
          console.log(`[Game ${gameId}] ⚠️ Number ${number} already spoken or audio disabled, skipping speech`);
        }
        
        setUpdateTrigger(prev => prev + 1);
      } else {
        console.log(`[Game ${gameId}] ⚠️ Number ${number} already exists in called numbers, skipping`);
      }
      
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchGameStatus();
          fetchCalledNumbers();
        }
      }, 1000);
      
      if (calledNumbersRef.current.length >= 90) {
        checkGameCompletion();
      }
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error in handleNumberCalled:`, error);
    }
  };

  // Fetch called numbers and speak any new ones
  const fetchCalledNumbers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/${gameId}/called-numbers`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        const data = response.data.data;
        const newCalledNumbers = data.called_numbers || [];
        const currentCalledNumbers = calledNumbersRef.current;
        
        // Find numbers we haven't seen before
        const newNumbers = newCalledNumbers.filter(num => !currentCalledNumbers.includes(num));
        
        console.log(`[Game ${gameId}] 📥 Fetched called numbers: ${newCalledNumbers.length} total`);
        console.log(`[Game ${gameId}] 📊 Found ${newNumbers.length} new numbers to check for speaking:`, newNumbers);
        
        // Check which new numbers haven't been spoken yet
        const numbersToSpeak = newNumbers.filter(num => !spokenInSessionRef.current.has(num));
        
        console.log(`[Game ${gameId}] 📊 ${numbersToSpeak.length} numbers need to be spoken:`, numbersToSpeak);
        
        // Speak each number that hasn't been spoken yet
        for (const number of numbersToSpeak) {
          console.log(`[Game ${gameId}] 🔊 Speaking newly fetched number: ${number}`);
          speakNumber(number);
          // Small delay to prevent overwhelming TTS
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        setCalledNumbers(newCalledNumbers);
        if (newCalledNumbers.length > 0) {
          lastCalledRef.current = newCalledNumbers[newCalledNumbers.length - 1];
        }
        setUpdateTrigger(prev => prev + 1);
        return data;
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching called numbers:`, error);
      return null;
    }
  };

  const fetchGameStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/${gameId}/calling/status`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        const data = response.data.data;
        const previousGameStatus = gameStatus?.status;
        const newGameStatus = data.game?.status;
        setGameStatus(data.game);
        setCallingStatus(data.calling);
        if (previousGameStatus !== 'completed' && newGameStatus === 'completed') checkGameCompletion();
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching game status:`, error);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(`[Game ${gameId}] Fetching tickets`);
      try {
        const response = await axios.get(
          `https://tambolatime.co.in/public/api/user/games/${gameId}/my-tickets`,
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
        );
        if (response.data.success) {
          const tickets = response.data.tickets || response.data.data || [];
          console.log(`[Game ${gameId}] Found tickets:`, tickets.length);
          setMyTickets(tickets);
          // Apply pending markings after loading tickets
          applyPendingMarkingsToTickets(pendingMarkingsRef.current);
          return;
        }
      } catch (specificError) {
        console.log(`[Game ${gameId}] Specific endpoint failed:`, specificError.message);
      }
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (res.data.success) {
        let tickets = [];
        if (res.data.tickets && res.data.tickets.data) tickets = res.data.tickets.data;
        else if (res.data.data && Array.isArray(res.data.data)) tickets = res.data.data;
        else if (res.data.tickets && Array.isArray(res.data.tickets)) tickets = res.data.tickets;
        const gameTickets = tickets.filter((ticket) => {
          const ticketGameId = ticket.game_id || ticket.game?.id;
          return parseInt(ticketGameId) === parseInt(gameId);
        });
        console.log(`[Game ${gameId}] Filtered tickets:`, gameTickets.length);
        setMyTickets(gameTickets);
        // Apply pending markings after loading tickets
        applyPendingMarkingsToTickets(pendingMarkingsRef.current);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching tickets:`, error);
      showSnackbar("Failed to load tickets", 'error');
    }
  };

  const checkChatStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/participants`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        setParticipantCount(response.data.total_participants || 0);
        const tokenData = await AsyncStorage.getItem("user");
        if (tokenData) {
          const user = JSON.parse(tokenData);
          const participants = response.data.data;
          const isParticipant = participants && Array.isArray(participants) && participants.some(p => p.id === user.id);
          setIsChatJoined(isParticipant);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error checking chat status:`, error);
    }
  };

  const joinChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/join`,
        {},
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        setIsChatJoined(true);
        setParticipantCount(response.data.participant_count || 1);
        navigation.navigate('UserLiveChat', { gameId, gameName, participantCount: response.data.participant_count || 1 });
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error joining chat:`, error);
    }
  };

  const showSnackbar = (message, type = 'info') => {
    if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    setSnackbar({ visible: false, message: '', type: 'info' });
    setTimeout(() => {
      setSnackbar({ visible: true, message, type });
      snackbarTimeout.current = setTimeout(() => {
        setSnackbar({ visible: false, message: '', type: 'info' });
      }, 3000);
    }, 100);
  };

  const loadSounds = async () => {
    try {
      Sound.setCategory('Playback');
      const sound = new Sound(
        'https://www.orangefreesounds.com/wp-content/uploads/2017/01/Button-click-sound.mp3',
        null,
        (error) => {
          if (error) {
            console.log(`[Game ${gameId}] Error loading sound:`, error);
            return;
          }
          setClickSound(sound);
        }
      );
    } catch (error) {
      console.log(`[Game ${gameId}] Error in loadSounds:`, error);
    }
  };

  const playClickSound = async () => {
    try {
      if (clickSound) clickSound.play((success) => { if (!success) console.log(`[Game ${gameId}] Sound playback failed`); });
    } catch (error) {
      console.log(`[Game ${gameId}] Error playing sound:`, error);
    }
  };

  const handleStatusUpdated = (data) => {
    console.log(`[Game ${gameId}] ⏸️ Processing status updated event:`, data);
    try {
      setCallingStatus(data);
      setGameStatus(data.game);
      const statusMessage = data.is_paused ? "Game paused by host" : "Game resumed by host";
      showSnackbar(statusMessage, data.is_paused ? 'warning' : 'info');
      if (fetchGameStatusTimeoutRef.current) clearTimeout(fetchGameStatusTimeoutRef.current);
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) fetchGameStatus();
      }, 500);
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error handling status updated:`, error);
    }
  };

  const handleGameCompleted = (data) => {
    console.log(`[Game ${gameId}] 🏁 Processing game completed event:`, data);
    setGameCompleted(true);
    setShowGameEndModal(true);
    startConfettiAnimation();
    showSnackbar("Game has been completed!", 'success');
    if (audioEnabled.current) {
      setTimeout(() => {
        addToTtsQueue(`Game completed! Thank you for playing ${gameName}!`);
      }, 1000);
    }
  };

  const handleClaimSubmitted = (data) => {
    console.log(`[Game ${gameId}] 📝 Processing claim submitted event:`, data);
    fetchClaimDetails(data.id).then(completeClaim => {
      if (completeClaim && isMountedRef.current) {
        showSnackbar(`${completeClaim.user_name} submitted a ${completeClaim.reward_name} claim!`, 'info');
        if (audioEnabled.current) {
          addToTtsQueue(`${completeClaim.user_name} has submitted a ${completeClaim.reward_name} claim!`);
        }
      } else {
        const userName = data.user_name || data.user?.name;
        const patternName = data.reward_name || data.pattern_name;
        if (userName && patternName) {
          showSnackbar(`${userName} submitted a ${patternName} claim!`, 'info');
          if (audioEnabled.current) {
            addToTtsQueue(`${userName} has submitted a ${patternName} claim!`);
          }
        }
      }
    });
    fetchClaims();
  };

  const handleClaimApproved = (data) => {
    console.log(`[Game ${gameId}] 🏆 Processing claim approved event:`, data);
    fetchClaimDetails(data.id).then(completeClaim => {
      if (completeClaim && isMountedRef.current) {
        const notification = {
          type: 'claim_approved',
          claim: completeClaim,
          message: `🏆 ${completeClaim.user_name} WON ₹${completeClaim.winning_amount} for ${completeClaim.reward_name}! CONGRATULATIONS! 🎊`
        };
        if (!announcedClaimIds.current.has(completeClaim.id)) {
          announcedClaimIds.current.add(completeClaim.id);
          showNotification(notification);
        }
      } else {
        const userName = data.user_name || data.user?.name;
        const patternName = data.reward_name || data.pattern_name;
        const winningAmount = data.winning_amount || data.amount;
        if (userName && patternName) {
          const notification = {
            type: 'claim_approved',
            claim: { ...data, user_name: userName, reward_name: patternName, winning_amount: winningAmount },
            message: `🏆 ${userName} WON ₹${winningAmount} for ${patternName}! CONGRATULATIONS! 🎊`
          };
          if (!announcedClaimIds.current.has(data.id)) {
            announcedClaimIds.current.add(data.id);
            showNotification(notification);
          }
        }
      }
    });
    fetchClaims();
  };

  const handleClaimRejected = (data) => {
    console.log(`[Game ${gameId}] ❌ Processing claim rejected event:`, data);
    const notification = {
      type: 'claim_rejected',
      claim: data,
      message: `❌ ${data.user_name}'s ${data.reward_name} claim was rejected`
    };
    showNotification(notification);
    fetchClaims();
  };

  const fetchClaimDetails = async (claimId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/claims/${claimId}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        const claimData = response.data.data;
        return {
          user_name: claimData.user_name || claimData.user?.name,
          reward_name: claimData.reward_name || claimData.pattern_name,
          winning_amount: claimData.winning_amount || claimData.amount,
          id: claimData.id
        };
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching claim details:`, error);
    }
    return null;
  };

  const showNotification = (notification) => {
    const { type, claim, message } = notification;
    if (announcedClaimIds.current.has(claim.id)) return;
    announcedClaimIds.current.add(claim.id);
    setTimeout(() => announcedClaimIds.current.delete(claim.id), 10000);
    
    if (type === 'claim_approved') {
      showSnackbar(message, 'success');
      startWinnerCelebration(claim);
    } else if (type === 'claim_rejected') {
      showSnackbar(message, 'error');
    } else {
      showSnackbar(message, 'info');
    }
    
    if (audioEnabled.current) {
      const userName = claim.user_name;
      const patternName = claim.reward_name;
      
      if (!userName || !patternName || userName === 'Someone' || patternName === 'pattern') {
        fetchClaimDetails(claim.id).then(completeClaim => {
          if (completeClaim) {
            if (type === 'claim_approved') {
              addToTtsQueue(`Congratulations! ${completeClaim.user_name} has won for completing the ${completeClaim.reward_name} pattern! Housie!`);
            } else if (type === 'new_claim') {
              addToTtsQueue(`${completeClaim.user_name} has submitted a ${completeClaim.reward_name} claim!`);
            } else if (type === 'claim_rejected') {
              addToTtsQueue(`${completeClaim.user_name}'s ${completeClaim.reward_name} claim was rejected`);
            }
          }
        });
      } else {
        if (type === 'claim_approved') {
          addToTtsQueue(`Congratulations! ${userName} has won for completing the ${patternName} pattern! Housie!`);
        } else if (type === 'new_claim') {
          addToTtsQueue(`${userName} has submitted a ${patternName} claim!`);
        } else if (type === 'claim_rejected') {
          addToTtsQueue(`${userName}'s ${patternName} claim was rejected`);
        }
      }
    }
  };

  const startWinnerCelebration = (claim) => {
    setWinningMessage(`🏆 WINNER! 🏆`);
    setWinningUser(claim.user_name);
    setWinningAmount(claim.winning_amount);
    setWinningPattern(claim.reward_name);
    
    celebrationOpacity.setValue(0);
    celebrationScale.setValue(0.5);
    celebrationTranslateY.setValue(50);
    setShowWinningCelebration(true);

    Animated.parallel([
      Animated.timing(celebrationOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(celebrationScale, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(celebrationTranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();

    startConfettiAnimationCelebration();
    setTimeout(() => stopWinningCelebration(), 5000);
  };

  const startConfettiAnimationCelebration = () => {
    confettiTranslateY.current.forEach((anim, index) => {
      anim.setValue(-50);
      Animated.timing(anim, {
        toValue: Dimensions.get("window").height + 50,
        duration: 1500 + Math.random() * 1000,
        delay: index * 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
  };

  const stopWinningCelebration = () => {
    Animated.parallel([
      Animated.timing(celebrationOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(celebrationScale, { toValue: 0.5, duration: 300, useNativeDriver: true }),
      Animated.timing(celebrationTranslateY, { toValue: 50, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowWinningCelebration(false));
  };

  const stopAllBlinking = () => {
    Object.values(blinkingIntervals.current).forEach(item => {
      if (item && item.animation && item.animation.stop) item.animation.stop();
    });
    Object.values(blinkingTimeouts.current).forEach(timeout => { if (timeout) clearTimeout(timeout); });
    blinkingIntervals.current = {};
    blinkingTimeouts.current = {};
    setBlinkingCells({});
    setBlinkingAnimations({});
    setSelectedPatternForView(null);
    setBlinkingPattern(null);
  };

  const startBlinkingForAllTickets = (pattern, duration = 5000) => {
    console.log("Starting blinking for pattern:", pattern);
    stopAllBlinking();
    const newBlinkingCells = {};
    const newAnimations = {};
    myTickets.forEach(ticket => {
      const patternCells = getPatternCells(ticket, pattern);
      if (patternCells.length > 0) {
        newBlinkingCells[ticket.id] = patternCells;
        const animValue = new Animated.Value(0);
        newAnimations[ticket.id] = animValue;
      }
    });
    setBlinkingCells(newBlinkingCells);
    setBlinkingAnimations(newAnimations);
    setBlinkingPattern(pattern);
    setUpdateTrigger(prev => prev + 1);
    setTimeout(() => {
      Object.keys(newAnimations).forEach(ticketId => {
        const animValue = newAnimations[ticketId];
        const animationLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.ease }),
            Animated.timing(animValue, { toValue: 0, duration: 500, useNativeDriver: true, easing: Easing.ease }),
          ]),
          { iterations: -1 }
        );
        blinkingIntervals.current[ticketId] = animationLoop;
        animationLoop.start();
      });
    }, 100);
    if (blinkingTimeouts.current.global) clearTimeout(blinkingTimeouts.current.global);
    blinkingTimeouts.current.global = setTimeout(() => stopAllBlinking(), duration);
  };

  const getPatternCells = (ticket, pattern) => {
    const processedData = processTicketData(ticket.ticket_data);
    const cells = [];
    const patternName = pattern.pattern_name.replace('_prize', '');
    switch(patternName) {
      case 'bamboo':
        for (let row = 0; row < 3; row++) {
          const nonEmptyCells = [];
          for (let col = 0; col < 9; col++) {
            const cell = processedData[row][col];
            if (cell && cell.number !== null) nonEmptyCells.push({ row, col, cell });
          }
          if (nonEmptyCells.length >= 3) cells.push({ row: nonEmptyCells[2].row, col: nonEmptyCells[2].col });
        }
        break;
      case 'bottom_line':
        for (let col = 0; col < 9; col++) {
          const cell = processedData[2][col];
          if (cell && cell.number !== null) cells.push({ row: 2, col });
        }
        break;
      case 'breakfast':
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = processedData[row][col];
            if (cell && cell.number !== null && cell.number >= 1 && cell.number <= 30) cells.push({ row, col });
          }
        }
        break;
      case 'dinner':
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = processedData[row][col];
            if (cell && cell.number !== null && cell.number >= 61 && cell.number <= 90) cells.push({ row, col });
          }
        }
        break;
      case 'early_five':
        const ticketNumberPositions = {};
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = processedData[row][col];
            if (cell && cell.number !== null) ticketNumberPositions[cell.number] = { row, col };
          }
        }
        let foundCount = 0;
        for (const calledNumber of calledNumbers) {
          if (ticketNumberPositions[calledNumber] && foundCount < 5) {
            const position = ticketNumberPositions[calledNumber];
            cells.push({ row: position.row, col: position.col });
            foundCount++;
          }
          if (foundCount >= 5) break;
        }
        break;
      case 'four_corners':
        const firstRowCells = [];
        for (let col = 0; col < 9; col++) {
          const cell = processedData[0][col];
          if (cell && cell.number !== null) firstRowCells.push({ row: 0, col, cell });
        }
        if (firstRowCells.length > 0) {
          cells.push({ row: 0, col: firstRowCells[0].col });
          cells.push({ row: 0, col: firstRowCells[firstRowCells.length - 1].col });
        }
        const lastRowCells = [];
        for (let col = 0; col < 9; col++) {
          const cell = processedData[2][col];
          if (cell && cell.number !== null) lastRowCells.push({ row: 2, col, cell });
        }
        if (lastRowCells.length > 0) {
          cells.push({ row: 2, col: lastRowCells[0].col });
          cells.push({ row: 2, col: lastRowCells[lastRowCells.length - 1].col });
        }
        break;
      case 'full_house':
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = processedData[row][col];
            if (cell && cell.number !== null) cells.push({ row, col });
          }
        }
        break;
      case 'lunch':
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = processedData[row][col];
            if (cell && cell.number !== null && cell.number >= 31 && cell.number <= 60) cells.push({ row, col });
          }
        }
        break;
      case 'middle_line':
        for (let col = 0; col < 9; col++) {
          const cell = processedData[1][col];
          if (cell && cell.number !== null) cells.push({ row: 1, col });
        }
        break;
      case 'top_line':
        for (let col = 0; col < 9; col++) {
          const cell = processedData[0][col];
          if (cell && cell.number !== null) cells.push({ row: 0, col });
        }
        break;
      default: break;
    }
    return cells;
  };

  const getPatternDescription = (patternName) => {
    const baseName = patternName.replace('_prize', '');
    const descriptions = {
      'full_house': 'Mark all numbers on your ticket',
      'early_five': 'First 5 numbers called on your ticket',
      'top_line': 'All numbers in the top row',
      'middle_line': 'All numbers in the middle row',
      'bottom_line': 'All numbers in the bottom row',
      'four_corners': 'Four corner numbers of your ticket',
      'bamboo': 'Third number in each row',
      'breakfast': 'Numbers 1-30',
      'lunch': 'Numbers 31-60',
      'dinner': 'Numbers 61-90',
    };
    return descriptions[baseName] || 'Complete this pattern to win prize';
  };

  const fetchPatternRewardCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/game/${gameId}/reward-counts`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.status) return response.data.data.patterns || [];
      return [];
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pattern reward counts:`, error);
      return [];
    }
  };

  const checkGameCompletion = () => {
    const isNumbersCompleted = calledNumbers.length >= 90;
    const isGameStatusCompleted = gameStatus?.status === 'completed';
    if ((isNumbersCompleted || isGameStatusCompleted) && !gameEndShownRef.current) {
      gameEndShownRef.current = true;
      setGameCompleted(true);
      setShowGameEndModal(true);
      startConfettiAnimation();
      if (audioEnabled.current) {
        setTimeout(() => {
          addToTtsQueue(`Game completed! All 90 numbers have been called. Thank you for playing ${gameName}!`);
        }, 1000);
      }
    }
  };

  const fetchGamePatternsForViewing = async () => {
    try {
      setLoadingPatterns(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/games",
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        const games = response.data.games.data;
        const currentGame = games.find((game) => game.id === parseInt(gameId));
        if (currentGame && currentGame.pattern_rewards) {
          const gamePatterns = currentGame.pattern_rewards.map(pattern => ({
            ...pattern,
            id: pattern.pattern_id,
            pattern_id: pattern.pattern_id,
            pattern_name: pattern.reward_name.toLowerCase().replace(/ /g, '_'),
            display_name: pattern.reward_name,
            amount: pattern.amount,
          }));
          const sortedPatterns = sortPatternsBySequence(gamePatterns);
          setAvailablePatterns(sortedPatterns);
        } else {
          setAvailablePatterns([]);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching game patterns:`, error);
      showSnackbar("Failed to load patterns", 'error');
      setAvailablePatterns([]);
    } finally {
      setLoadingPatterns(false);
    }
  };

  const handleViewPatterns = (ticketId, index) => {
    playClickSound();
    setSelectedTicket(ticketId);
    setShowPatternsModal(true);
    fetchGamePatternsForViewing();
  };

  const handlePatternSelect = (pattern) => {
    const patternToUse = { ...pattern, pattern_name: pattern.pattern_name || pattern.id?.toString() };
    setSelectedPatternForView(patternToUse);
    setBlinkingPattern(patternToUse);
    setShowPatternsModal(false);
    showSnackbar(`Showing ${pattern.display_name} pattern on all tickets`, 'info');
    setTimeout(() => startBlinkingForAllTickets(patternToUse, 5000), 300);
  };

  const updatePatternCounts = (claimsData) => {
    const ticketPatterns = {};
    const patternCounts = {};
    patternRewards.forEach(pattern => {
      patternCounts[pattern.pattern_id] = { claimed: 0, total: pattern.limit_count || 0, patternName: pattern.reward_name };
    });
    claimsData.forEach(claim => {
      const ticketId = claim.ticket_id;
      const patternId = claim.game_pattern_id;
      if (!ticketId || !patternId) return;
      if (!ticketPatterns[ticketId]) ticketPatterns[ticketId] = {};
      if (claim.claim_status === 'approved' || claim.claim_status === 'pending') {
        ticketPatterns[ticketId][patternId] = { count: (ticketPatterns[ticketId][patternId]?.count || 0) + 1, status: claim.claim_status };
        if (claim.claim_status === 'approved' && patternCounts[patternId]) patternCounts[patternId].claimed += 1;
      }
    });
    setPatternsByTicket(ticketPatterns);
    setTotalPatternCounts(patternCounts);
  };

  const fetchPatternRewards = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/games",
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        const games = response.data.games.data;
        const currentGame = games.find((game) => game.id === parseInt(gameId));
        if (currentGame && currentGame.pattern_rewards) {
          setPatternRewards(currentGame.pattern_rewards);
          const initialCounts = {};
          currentGame.pattern_rewards.forEach(pattern => {
            initialCounts[pattern.pattern_id] = { claimed: 0, total: pattern.limit_count || 0, patternName: pattern.reward_name };
          });
          setTotalPatternCounts(initialCounts);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pattern rewards:`, error);
    }
  };

  const fetchClaims = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/claims/game/${gameId}/claims`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (response.data.success) {
        const newClaims = response.data.data.claims || [];
        const previousClaims = claimsRef.current;
        updatePatternCounts(newClaims);
        if (!initialClaimsFetched) announcedClaimIds.current.clear();
        const notifications = [];
        newClaims.forEach(newClaim => {
          const oldClaim = previousClaims.find(old => old.id === newClaim.id);
          if (!oldClaim) {
            if (newClaim.claim_status === 'pending') {
              notifications.push({ type: 'new_claim', claim: newClaim, message: `🎉 ${newClaim.user_name} submitted a ${newClaim.reward_name} claim!` });
            }
          } else {
            if (oldClaim.claim_status === 'pending' && newClaim.claim_status === 'approved') {
              notifications.push({ type: 'claim_approved', claim: newClaim, message: `🏆 ${newClaim.user_name} WON ₹${newClaim.winning_amount} for ${newClaim.reward_name}! CONGRATULATIONS! 🎊` });
            } else if (oldClaim.claim_status === 'pending' && newClaim.claim_status === 'rejected') {
              notifications.push({ type: 'claim_rejected', claim: newClaim, message: `❌ ${newClaim.user_name}'s ${newClaim.reward_name} claim was rejected` });
            }
          }
        });
        if (notifications.length > 0) {
          notifications.forEach((notification, index) => setTimeout(() => showNotification(notification), index * 2000));
        }
        setClaims(newClaims);
        if (!initialClaimsFetched) setInitialClaimsFetched(true);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching claims:`, error);
    }
  };

  const initializePusher = async () => {
    try {
      console.log(`[Game ${gameId}] 📱 Initializing Pusher for user game`);
      const pusher = Pusher.getInstance();
      await pusher.init({
        apiKey: '9c1d16690beded57332a',
        cluster: 'ap2',
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        onConnectionStateChange: (currentState, previousState) => {
          console.log(`[Game ${gameId}] 🔌 Connection state: ${previousState} → ${currentState}`);
          if (currentState === 'CONNECTED') {
            console.log(`[Game ${gameId}] ✅ Connected to Pusher`);
            isPusherConnectedRef.current = true;
            reconnectAttemptsRef.current = 0;
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            processMissedEventsQueue();
          }
          if (currentState === 'DISCONNECTED' && isMountedRef.current) {
            console.log(`[Game ${gameId}] ❌ Disconnected, scheduling reconnection...`);
            isPusherConnectedRef.current = false;
            scheduleReconnection();
          }
        },
        onError: (message, code, error) => {
          console.log(`[Game ${gameId}] ❌ Pusher error: ${message}`, error);
          isPusherConnectedRef.current = false;
          scheduleReconnection();
        },
      });
      await pusher.connect();
      console.log(`[Game ${gameId}] 🚀 Pusher connected`);
      const gameChannel = await pusher.subscribe({
        channelName: `game.${gameId}`,
        onEvent: (event) => { if (isMountedRef.current) handlePusherEvent(event); }
      });
      gameChannelRef.current = gameChannel;
      pusherRef.current = pusher;
      isPusherConnectedRef.current = true;
      console.log(`[Game ${gameId}] ✅ Pusher initialized successfully`);
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error initializing Pusher:`, error);
      isPusherConnectedRef.current = false;
      scheduleReconnection();
      throw error;
    }
  };

  const processMissedEventsQueue = async () => {
    if (processingQueueRef.current || missedEventsQueueRef.current.length === 0) return;
    processingQueueRef.current = true;
    console.log(`[Game ${gameId}] 📦 Processing ${missedEventsQueueRef.current.length} missed events`);
    const events = [...missedEventsQueueRef.current].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    missedEventsQueueRef.current = [];
    for (const event of events) {
      if (!isMountedRef.current) break;
      try {
        if (event.type === 'number.called') await handleNumberCalled(event.data);
        else if (event.type === 'calling.status.updated') await handleStatusUpdated(event.data);
        else if (event.type === 'game.completed') await handleGameCompleted(event.data);
        else if (event.type === 'claim.submitted') await handleClaimSubmitted(event.data);
        else if (event.type === 'claim.approved') await handleClaimApproved(event.data);
        else if (event.type === 'claim.rejected') await handleClaimRejected(event.data);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`[Game ${gameId}] Error processing missed event:`, error);
      }
    }
    processingQueueRef.current = false;
    if (isMountedRef.current) {
      await fetchGameStatus();
      await fetchCalledNumbers();
      await fetchClaims();
    }
  };

  const scheduleReconnection = () => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log(`[Game ${gameId}] ⚠️ Max reconnection attempts reached`);
      showSnackbar("Connection issues. Please pull down to refresh.", 'warning');
      return;
    }
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(`[Game ${gameId}] 🔄 Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    reconnectTimeoutRef.current = setTimeout(() => reconnectPusher(), delay);
  };

  const reconnectPusher = async () => {
    try {
      console.log(`[Game ${gameId}] 🔄 Attempting to reconnect Pusher...`);
      reconnectAttemptsRef.current += 1;
      await cleanupPusher();
      await initializePusher();
      reconnectAttemptsRef.current = 0;
      console.log(`[Game ${gameId}] ✅ Reconnected successfully`);
      await fetchInitialData();
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Reconnection failed:`, error);
      scheduleReconnection();
    }
  };

  const cleanupPusher = async () => {
    if (pusherRef.current) {
      try {
        const pusher = Pusher.getInstance();
        if (gameChannelRef.current) {
          await pusher.unsubscribe({ channelName: `game.${gameId}` });
          gameChannelRef.current = null;
          console.log(`[Game ${gameId}] 📤 Unsubscribed from game channel`);
        }
        await pusher.disconnect();
        console.log(`[Game ${gameId}] 🔌 Pusher disconnected`);
      } catch (error) {
        console.log(`[Game ${gameId}] ❌ Error cleaning up Pusher:`, error);
      }
    }
  };

  const handlePusherEvent = (event) => {
    console.log(`[Game ${gameId}] 🔄 Processing event: ${event.eventName}`);
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (!isPusherConnectedRef.current) {
        console.log(`[Game ${gameId}] Pusher disconnected, queueing event: ${event.eventName}`);
        missedEventsQueueRef.current.push({ type: event.eventName, data: data, timestamp: Date.now() });
        return;
      }
      switch (event.eventName) {
        case 'number.called': handleNumberCalled(data); break;
        case 'calling.status.updated': handleStatusUpdated(data); break;
        case 'game.completed': handleGameCompleted(data); break;
        case 'claim.submitted': handleClaimSubmitted(data); break;
        case 'claim.approved': handleClaimApproved(data); break;
        case 'claim.rejected': handleClaimRejected(data); break;
        default: console.log(`[Game ${gameId}] 📭 Unhandled event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error handling Pusher event:`, error);
    }
  };

  const fetchInitialData = async () => {
    await Promise.all([
      fetchGameStatus(),
      fetchCalledNumbers(),
      fetchMyTickets(),
      checkChatStatus(),
      fetchClaims(),
      fetchPatternRewards(),
      fetchGamePatternsForViewing(),
    ]);
  };

  const openMenu = async (ticketId, index) => {
    playClickSound();
    setSelectedTicket(ticketId);
    try {
      setLoadingPatterns(true);
      const rewardCountsData = await fetchPatternRewardCounts();
      if (rewardCountsData.length > 0) {
        const patternsWithCounts = rewardCountsData.map(pattern => ({
          id: pattern.game_pattern_id,
          pattern_id: pattern.game_pattern_id,
          pattern_name: pattern.pattern_name,
          display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          amount: pattern.amount,
          total_reward_count: pattern.total_reward_count,
          approved_claims_count: pattern.approved_claims_count,
          pending_claims_count: pattern.pending_claims_count,
          available_reward_count: pattern.available_reward_count,
          is_reward_available: pattern.is_reward_available,
          reward_name: pattern.reward_name,
          game_pattern_id: pattern.game_pattern_id
        }));
        const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
        setMenuPatterns(sortedPatterns);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pattern counts:`, error);
    } finally {
      setLoadingPatterns(false);
      setMenuVisible(true);
    }
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedTicket(null);
  };

  const submitClaim = async (ticketId, pattern) => {
    if (isSubmittingClaimRef.current) {
      showSnackbar("Please wait, processing previous claim...", 'warning');
      return;
    }
    if (submittingClaim) return;
    try {
      isSubmittingClaimRef.current = true;
      setSubmittingClaim(true);
      const token = await AsyncStorage.getItem("token");
      const ticket = myTickets.find(t => t.id === ticketId);
      if (!ticket) {
        showSnackbar("Ticket not found", 'error');
        isSubmittingClaimRef.current = false;
        return;
      }
      const ticketPatterns = patternsByTicket[ticketId] || {};
      const patternOnTicket = ticketPatterns[pattern.pattern_id];
      if (patternOnTicket && patternOnTicket.status !== 'rejected') {
        showSnackbar(`You have already claimed ${pattern.reward_name || pattern.display_name} on this ticket`, 'error');
        isSubmittingClaimRef.current = false;
        return;
      }
      if (pattern.available_reward_count !== undefined && pattern.available_reward_count <= 0) {
        showSnackbar(`${pattern.reward_name || pattern.display_name} claims are no longer available`, 'error');
        isSubmittingClaimRef.current = false;
        return;
      }
      if (pattern.is_reward_available === false) {
        showSnackbar(`${pattern.reward_name || pattern.display_name} is not available for claims`, 'error');
        isSubmittingClaimRef.current = false;
        return;
      }
      const response = await axios.post(
        "https://tambolatime.co.in/public/api/user/claims/submit",
        {
          game_id: parseInt(gameId),
          ticket_id: parseInt(ticketId),
          reward_name: pattern.reward_name || pattern.display_name,
          claim_evidence: `Pattern ${pattern.game_pattern_id || pattern.pattern_id} completed on ticket ${ticket.ticket_number}`,
          game_pattern_id: pattern.game_pattern_id || pattern.pattern_id,
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        showSnackbar(`Claim submitted for ${pattern.reward_name || pattern.display_name}! Waiting for approval.`, 'info');
        const updatedTicketPatterns = { ...patternsByTicket };
        if (!updatedTicketPatterns[ticketId]) updatedTicketPatterns[ticketId] = {};
        updatedTicketPatterns[ticketId][pattern.pattern_id] = { count: 1, status: 'pending' };
        setPatternsByTicket(updatedTicketPatterns);
        Promise.all([
          fetchClaims(),
          fetchPatternRewardCounts().then(rewardCountsData => {
            if (rewardCountsData.length > 0) {
              const patternsWithCounts = rewardCountsData.map(pattern => ({
                id: pattern.game_pattern_id,
                pattern_id: pattern.game_pattern_id,
                pattern_name: pattern.pattern_name,
                display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                amount: pattern.amount,
                total_reward_count: pattern.total_reward_count,
                approved_claims_count: pattern.approved_claims_count,
                pending_claims_count: pattern.pending_claims_count,
                available_reward_count: pattern.available_reward_count,
                is_reward_available: pattern.is_reward_available,
                reward_name: pattern.reward_name,
                game_pattern_id: pattern.game_pattern_id
              }));
              const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
              setMenuPatterns(sortedPatterns);
            }
          }),
        ]);
      } else {
        showSnackbar(response.data.message || "Failed to submit claim", 'error');
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error submitting claim:`, error);
      let errorMessage = "Failed to submit claim. Please try again.";
      if (error.response) {
        if (error.response.data && error.response.data.message) errorMessage = error.response.data.message;
        else if (error.response.data && error.response.data.errors) errorMessage = Object.values(error.response.data.errors).flat().join("\n");
      }
      showSnackbar(errorMessage, 'error');
    } finally {
      isSubmittingClaimRef.current = false;
      setSubmittingClaim(false);
      setMenuVisible(false);
      setSelectedTicket(null);
    }
  };

  const startConfettiAnimation = () => {
    confettiAnimation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnimation, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(confettiAnimation, { toValue: 0, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    ).start();
  };

  const stopConfettiAnimation = () => {
    confettiAnimation.stopAnimation();
    confettiAnimation.setValue(0);
  };

  const handleCloseGameEndModal = () => {
    stopConfettiAnimation();
    setShowGameEndModal(false);
    navigation.goBack();
  };

  const handleViewWinners = () => {
    stopConfettiAnimation();
    setShowGameEndModal(false);
    navigation.navigate('UserGameWinners', { gameId, gameName, gameData: gameStatus, calledNumbers });
  };

  const handleViewAllCalledNumbers = () => {
    navigation.navigate('UserCalledNumbers', { gameId, gameName, calledNumbers, gameData: gameStatus });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchGameStatus(),
      fetchCalledNumbers(),
      fetchMyTickets(),
      checkChatStatus(),
      fetchClaims(),
      fetchPatternRewards(),
      fetchGamePatternsForViewing(),
    ]);
    if (!isPusherConnectedRef.current) await reconnectPusher();
    setRefreshing(false);
  };

  // Updated handleNumberClick with optimistic update - shows red immediately
  const handleNumberClick = async (ticketId, cellNumber, isCurrentlyMarked) => {
    if (cellNumber === null || markingLoading) return;
    playClickSound();
    
    const cellKey = `${ticketId}-${cellNumber}`;
    setProcessingCells(prev => new Set(prev).add(cellKey));
    
    // Optimistic update: Update UI immediately to RED
    updateTicketState(ticketId, cellNumber, !isCurrentlyMarked);
    
    // Add to pending markings for tracking (but won't affect UI color)
    if (!pendingMarkingsRef.current[ticketId]) {
      pendingMarkingsRef.current[ticketId] = {};
    }
    pendingMarkingsRef.current[ticketId][cellNumber] = true;
    setPendingMarkings({ ...pendingMarkingsRef.current });
    await savePendingMarkings();
    
    // Add to queue for processing
    addToMarkingQueue(ticketId, cellNumber, isCurrentlyMarked, cellKey);
  };

  // Updated updateTicketState - no pending flag
  const updateTicketState = (ticketId, number, isMarked) => {
    setMyTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const updatedTicketData = ticket.ticket_data.map(row =>
            row.map(cell => {
              if (cell && cell.number === number) {
                // Just update is_marked, no is_pending flag
                return { ...cell, is_marked: isMarked };
              }
              return cell;
            })
          );
          return { ...ticket, ticket_data: updatedTicketData };
        }
        return ticket;
      })
    );
  };

  const processTicketData = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
      const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      ticketData.forEach((row, rowIndex) => {
        row.forEach((cell) => {
          if (cell && cell.number !== null && cell.column !== undefined) processedGrid[rowIndex][cell.column] = cell;
        });
      });
      return processedGrid;
    } else if (ticketData[0] && Array.isArray(ticketData[0])) {
      return ticketData.map(row => row.map(cell => cell));
    }
    return Array(3).fill(Array(9).fill(null));
  };

  const getTicketsPerRow = () => isLandscape ? 2 : 1;

  const renderTicketsGrid = () => {
    const ticketsPerRow = getTicketsPerRow();
    const rows = [];
    for (let i = 0; i < myTickets.length; i += ticketsPerRow) {
      const rowTickets = myTickets.slice(i, i + ticketsPerRow);
      rows.push(rowTickets);
    }
    return rows.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.ticketRow}>
        {row.map((ticket, index) => (
          <View key={ticket.id} style={[styles.ticketGridItem, { width: isLandscape ? '48%' : '100%' }]}>
            {renderTicketItem({ item: ticket, index: rowIndex * ticketsPerRow + index })}
          </View>
        ))}
      </View>
    ));
  };

  const renderAllCalledNumbersSection = () => {
    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    const numberRows = [];
    for (let i = 0; i < 9; i++) numberRows.push(allNumbers.slice(i * 10, (i + 1) * 10));
    const currentCalledNumbers = calledNumbers;
    return (
      <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.allNumbersCard} key={`all-numbers-${updateTrigger}`}>
        <View style={styles.allNumbersHeader}>
          <View style={styles.allNumbersTitleContainer}>
            <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionIcon}>
              <MaterialIcons name="format-list-numbered" size={16} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.allNumbersTitle}>All Numbers (1-90)</Text>
            <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.calledCountBadge}>
              <Text style={styles.calledCountText}>{currentCalledNumbers.length}/90</Text>
            </LinearGradient>
          </View>
          <TouchableOpacity style={styles.viewAllGridButton} onPress={handleViewAllCalledNumbers}>
            <Text style={styles.viewAllGridButtonText}>View All</Text>
            <Ionicons name="expand" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.numbersGridCompact}>
          {numberRows.map((row, idx) => (
            <View key={`row-${idx}-${updateTrigger}`} style={styles.numberRow}>
              {row.map((number) => {
                const isCalled = currentCalledNumbers.includes(number);
                const isLatest = currentCalledNumbers.length > 0 && number === currentCalledNumbers[currentCalledNumbers.length - 1];
                return (
                  <View
                    key={`${number}-${updateTrigger}`}
                    style={[styles.numberItemCompact, isCalled && styles.calledNumberItem, isLatest && styles.latestNumberItem]}
                  >
                    <Text style={[styles.numberItemTextCompact, isCalled && styles.calledNumberText, isLatest && styles.latestNumberText]}>{number}</Text>
                    {isLatest && <View style={styles.latestIndicatorCompact}><Ionicons name="star" size={8} color={COLORS.surface} /></View>}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}><View style={[styles.legendColor, styles.legendNormal]} /><Text style={styles.legendText}>Not Called</Text></View>
          <View style={styles.legendItem}><LinearGradient colors={COLORS.greenGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.legendColor, styles.legendCalled]} /><Text style={styles.legendText}>Called</Text></View>
          <View style={styles.legendItem}><LinearGradient colors={COLORS.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.legendColor, styles.legendLatest]} /><Text style={styles.legendText}>Latest</Text></View>
        </View>
      </LinearGradient>
    );
  };

  const renderTicketGrid = (ticketData, ticketId) => {
    const processedData = processTicketData(ticketData);
    const blinkingAnim = blinkingAnimations[ticketId];
    const currentBlinkingCells = blinkingCells[ticketId] || [];
    const blinkingCellMap = {};
    currentBlinkingCells.forEach(cell => { blinkingCellMap[`${cell.row}-${cell.col}`] = true; });
    return (
      <View style={styles.ticket}>
        <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketPattern} />
        {processedData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={[styles.row, { backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2 }]}>
            {row.map((cell, colIndex) => {
              const cellObj = cell;
              const cellNumber = cellObj?.number;
              const isMarked = cellObj?.is_marked || false;
              const isEmpty = cellNumber === null || cellNumber === undefined;
              const shouldBlink = blinkingCellMap[`${rowIndex}-${colIndex}`];
              let cellBackgroundColor, cellBorderColor, textColor;
              if (isEmpty) { 
                cellBackgroundColor = EMPTY_CELL_BG; 
                cellBorderColor = CELL_BORDER_COLOR; 
                textColor = "transparent"; 
              }
              else if (isMarked) { 
                // Always show red for marked numbers
                cellBackgroundColor = MARKED_CELL_BG; 
                cellBorderColor = MARKED_CELL_BORDER; 
                textColor = COLORS.surface; 
              }
              else { 
                cellBackgroundColor = FILLED_CELL_BG; 
                cellBorderColor = CELL_BORDER_COLOR; 
                textColor = COLORS.surface; 
              }
              return (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[styles.cell, { width: CELL_WIDTH, height: CELL_WIDTH, margin: CELL_MARGIN, backgroundColor: cellBackgroundColor, borderColor: cellBorderColor }, shouldBlink && styles.blinkingCellBorder]}
                  onPress={() => cellNumber && handleNumberClick(ticketId, cellNumber, isMarked)}
                  onLongPress={() => cellNumber && speakNumber(cellNumber)}
                  disabled={isEmpty || markingLoading}
                >
                  {!isEmpty && (
                    shouldBlink && blinkingAnim ? (
                      <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: COLORS.warning, opacity: blinkingAnim, transform: [{ scale: blinkingAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }] }}>
                        <Text style={[styles.number, { color: textColor, fontWeight: 'bold' }]}>{cellNumber}</Text>
                      </Animated.View>
                    ) : (
                      <Text style={[styles.number, { color: textColor }]}>{cellNumber}</Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderTicketItem = ({ item, index }) => {
    const claimScale = claimButtonScales.current[index] || new Animated.Value(1);
    const patternsScale = patternsButtonScales.current[index] || new Animated.Value(1);
    return (
      <View style={styles.ticketItemContainer}>
        <View style={styles.ticketHeader}>
          <View style={styles.ticketNumberContainer}>
            <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketIcon}>
              <MaterialIcons name="confirmation-number" size={16} color={COLORS.surface} />
            </LinearGradient>
            <View style={styles.ticketInfo}><Text style={styles.ticketLabel}>Ticket #{item.ticket_number}</Text></View>
          </View>
          <View style={styles.ticketActions}>
            <Animated.View style={{ transform: [{ scale: patternsScale }] }}>
              <TouchableOpacity style={styles.viewPatternsButton} onPress={() => handleViewPatterns(item.id, index)}>
                <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.viewPatternsButtonGradient}>
                  <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.viewPatternsButtonText}>Patterns</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: claimScale }] }}>
              <TouchableOpacity style={styles.claimButton} onPress={() => openMenu(item.id, index)} ref={el => menuRefs.current[index] = el}>
                <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.claimButtonGradient}>
                  <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassEffectOverlay} />
                  <Ionicons name="trophy" size={14} color={COLORS.surface} />
                  <Text style={styles.claimButtonText}>Claim</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketCard}>
          <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketCardPattern} />
          {renderTicketGrid(item.ticket_data, item.id)}
        </LinearGradient>
      </View>
    );
  };

  const renderPatternMenu = () => {
    if (!selectedTicket) return null;
    const ticketPatterns = patternsByTicket[selectedTicket] || {};
    const patternsForClaim = menuPatterns.map(pattern => {
      const patternOnTicket = ticketPatterns[pattern.pattern_id];
      const hasAvailableRewards = pattern.available_reward_count !== undefined && pattern.available_reward_count > 0;
      const isRewardAvailable = pattern.is_reward_available !== false;
      const isClaimed = patternOnTicket && patternOnTicket.status !== 'rejected';
      const isDisabled = isClaimed || !hasAvailableRewards || !isRewardAvailable;
      return { ...pattern, isDisabled, isClaimed, hasAvailableRewards, isRewardAvailable, patternOnTicket };
    });
    const handleRefreshPatterns = async () => {
      try {
        setLoadingPatterns(true);
        const rewardCountsData = await fetchPatternRewardCounts();
        if (rewardCountsData.length > 0) {
          const patternsWithCounts = rewardCountsData.map(pattern => ({
            id: pattern.game_pattern_id,
            pattern_id: pattern.game_pattern_id,
            pattern_name: pattern.pattern_name,
            display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            amount: pattern.amount,
            total_reward_count: pattern.total_reward_count,
            approved_claims_count: pattern.approved_claims_count,
            pending_claims_count: pattern.pending_claims_count,
            available_reward_count: pattern.available_reward_count,
            is_reward_available: pattern.is_reward_available,
            reward_name: pattern.reward_name,
            game_pattern_id: pattern.game_pattern_id
          }));
          const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
          setMenuPatterns(sortedPatterns);
          showSnackbar("Patterns refreshed successfully", 'info');
        }
      } catch (error) {
        showSnackbar("Failed to refresh patterns", 'error');
      } finally {
        setLoadingPatterns(false);
      }
    };
    return (
      <Modal transparent={true} visible={menuVisible} animationType="fade" onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
          <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.menuContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Submit Claim</Text>
              <View style={styles.menuHeaderActions}>
                <TouchableOpacity style={styles.refreshMenuButton} onPress={handleRefreshPatterns} disabled={loadingPatterns}>
                  {loadingPatterns ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="refresh" size={20} color={COLORS.primary} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={closeMenu}><Ionicons name="close" size={24} color={COLORS.textLight} /></TouchableOpacity>
              </View>
            </View>
            <ScrollView ref={menuScrollViewRef} style={styles.patternsMenuScroll} showsVerticalScrollIndicator={true} nestedScrollEnabled={true} bounces={true}>
              {loadingPatterns ? (
                <View style={styles.patternsLoadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.patternsLoadingText}>Loading patterns...</Text></View>
              ) : patternsForClaim.length === 0 ? (
                <View style={styles.noPatternsContainer}>
                  <Ionicons name="alert-circle-outline" size={40} color={COLORS.warning} />
                  <Text style={styles.noPatternsText}>No patterns available for this game</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={handleRefreshPatterns}><Ionicons name="refresh" size={16} color={COLORS.primary} /><Text style={styles.retryButtonText}>Refresh Patterns</Text></TouchableOpacity>
                </View>
              ) : (
                patternsForClaim.map((pattern, index) => {
                  const isDisabled = pattern.isDisabled;
                  const isClaimed = pattern.isClaimed;
                  const isLimitReached = !pattern.hasAvailableRewards || !pattern.isRewardAvailable;
                  return (
                    <TouchableOpacity key={index} style={[styles.patternMenuItem, isDisabled && styles.disabledPatternItem]} onPress={() => !isDisabled && submitClaim(selectedTicket, pattern)} disabled={submittingClaim || isDisabled} activeOpacity={0.7}>
                      <LinearGradient colors={isClaimed ? COLORS.greenGradient : (isLimitReached ? COLORS.redGradient : [COLORS.surface, COLORS.surface])} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.patternMenuItemGradient}>
                        <View style={styles.patternMenuItemContent}>
                          <Ionicons name={isClaimed ? "checkmark-circle" : (isLimitReached ? "lock-closed" : "trophy-outline")} size={20} color={isClaimed ? COLORS.surface : (isLimitReached ? COLORS.surface : COLORS.primary)} />
                          <View style={styles.patternMenuItemInfo}>
                            <Text style={[styles.patternMenuItemName, isDisabled && styles.disabledPatternName, isClaimed && { color: COLORS.surface }]}>
                              {pattern.reward_name || pattern.display_name}
                              {isClaimed && <Text style={styles.claimedBadge}> ✓ Claimed</Text>}
                              {!isClaimed && isLimitReached && <Text style={styles.limitReachedBadge}> ✗ Not Available</Text>}
                            </Text>
                            <Text style={[styles.patternMenuItemDesc, isDisabled && styles.disabledPatternDesc, isClaimed && { color: COLORS.surface }]} numberOfLines={2}>
                              Prize: ₹{pattern.amount}
                              {pattern.available_reward_count !== undefined && <Text style={[styles.patternLimitText, isLimitReached && styles.limitReachedText, isClaimed && { color: COLORS.surface }]}> • Available: {pattern.available_reward_count}/{pattern.total_reward_count}</Text>}
                            </Text>
                          </View>
                          {submittingClaim && pattern.patternOnTicket ? <ActivityIndicator size="small" color={COLORS.primary} /> : <View style={styles.patternStatusContainer}>{isDisabled && !isClaimed && <Ionicons name="lock-closed" size={16} color={COLORS.surface} />}</View>}
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </LinearGradient>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderPatternsModal = () => {
    if (!selectedTicket) return null;
    return (
      <Modal transparent={true} visible={showPatternsModal} animationType="slide" onRequestClose={() => { setShowPatternsModal(false); stopAllBlinking(); }}>
        <TouchableOpacity style={styles.patternsModalOverlay} activeOpacity={1} onPress={() => { setShowPatternsModal(false); stopAllBlinking(); }}>
          <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.patternsModalContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.patternsModalHeader}>
              <Text style={styles.patternsModalTitle}>Available Patterns</Text>
              <View style={styles.patternsModalHeaderActions}>
                <TouchableOpacity onPress={() => fetchGamePatternsForViewing()} style={styles.refreshPatternsButton} disabled={loadingPatterns}>
                  {loadingPatterns ? <ActivityIndicator size="small" color={COLORS.textLight} /> : <Ionicons name="refresh" size={20} color={COLORS.textLight} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowPatternsModal(false); stopAllBlinking(); }} style={styles.patternsModalCloseButton}><Ionicons name="close" size={24} color={COLORS.textLight} /></TouchableOpacity>
              </View>
            </View>
            <Text style={styles.patternsModalSubtitle}>Tap on a pattern to see it highlighted on ALL your tickets for 5 seconds</Text>
            {blinkingPattern && (
              <LinearGradient colors={[COLORS.warning + '20', COLORS.warning + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.currentBlinkingPatternContainer}>
                <Ionicons name="star" size={18} color={COLORS.warning} />
                <Text style={styles.currentBlinkingPatternText}>Showing: <Text style={styles.currentBlinkingPatternName}>{blinkingPattern.display_name}</Text></Text>
                <TouchableOpacity style={styles.stopBlinkingButton} onPress={stopAllBlinking}><Ionicons name="stop-circle" size={16} color={COLORS.red} /><Text style={styles.stopBlinkingText}>Stop</Text></TouchableOpacity>
              </LinearGradient>
            )}
            <LinearGradient colors={[COLORS.primary + '10', COLORS.primary + '05']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.earlyFiveNoteContainer}>
              <Ionicons name="information-circle" size={18} color={COLORS.primary} />
              <Text style={styles.earlyFiveNoteText}><Text style={styles.earlyFiveNoteBold}>Early Five pattern:</Text> Shows the first 5 called numbers on each ticket</Text>
            </LinearGradient>
            {loadingPatterns ? (
              <View style={styles.patternsLoadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.patternsLoadingText}>Loading patterns...</Text></View>
            ) : (
              <ScrollView style={styles.patternsList} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
                {availablePatterns.length === 0 ? (
                  <View style={styles.noAvailablePatternsContainer}><Ionicons name="alert-circle-outline" size={40} color={COLORS.warning} /><Text style={styles.noAvailablePatternsText}>No patterns available for this game</Text></View>
                ) : (
                  availablePatterns.map((pattern, index) => {
                    const isSelected = selectedPatternForView?.id === pattern.id;
                    return (
                      <TouchableOpacity key={index} style={[styles.patternListItem, isSelected && styles.selectedPatternListItem]} onPress={() => handlePatternSelect(pattern)} activeOpacity={0.7}>
                        <LinearGradient colors={isSelected ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.patternListItemGradient}>
                          <View style={styles.patternListItemContent}>
                            <Ionicons name="star" size={18} color={isSelected ? COLORS.surface : COLORS.primary} />
                            <View style={styles.patternListItemInfo}>
                              <Text style={[styles.patternListItemName, isSelected && { color: COLORS.surface }]}>{pattern.display_name}{isSelected && <Text style={styles.selectedBadge}> • Selected</Text>}</Text>
                              <Text style={[styles.patternListItemDesc, isSelected && { color: COLORS.surface }]} numberOfLines={2}>{getPatternDescription(pattern.pattern_name)}{pattern.amount && <Text style={styles.patternAmountText}> • Prize: ₹{pattern.amount}</Text>}</Text>
                            </View>
                            <View style={styles.patternActionContainer}>{isSelected ? <Ionicons name="checkmark-circle" size={22} color={COLORS.surface} /> : <Ionicons name="eye" size={18} color={COLORS.primary} />}</View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            )}
            <View style={styles.patternsModalFooter}>
              <TouchableOpacity style={styles.clearSelectionButton} onPress={() => { setSelectedPatternForView(null); stopAllBlinking(); }}><Ionicons name="refresh" size={16} color={COLORS.textLight} /><Text style={styles.clearSelectionButtonText}>Clear Selection</Text></TouchableOpacity>
              <TouchableOpacity style={styles.closePatternsButton} onPress={() => { setShowPatternsModal(false); setSelectedPatternForView(null); stopAllBlinking(); }}>
                <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.closePatternsGradient}><Text style={styles.closePatternsButtonText}>Close</Text></LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderWinningCelebration = () => {
    if (!showWinningCelebration) return null;
    return (
      <Modal transparent={true} visible={showWinningCelebration} animationType="fade" onRequestClose={stopWinningCelebration}>
        <View style={styles.winningOverlay}>
          {confettiTranslateY.current.map((anim, index) => (
            <Animated.View key={`confetti-${index}`} style={[styles.confettiParticle, { left: `${(index * 5) % 100}%`, transform: [{ translateY: anim }], backgroundColor: [COLORS.red, COLORS.primary, COLORS.warning, COLORS.green][index % 4] }]} />
          ))}
          <Animated.View style={[styles.celebrationContent, { opacity: celebrationOpacity, transform: [{ scale: celebrationScale }, { translateY: celebrationTranslateY }] }]}>
            <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.celebrationInner}>
              <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.trophyIconContainer}><Ionicons name="trophy" size={40} color={COLORS.surface} /></LinearGradient>
              <Text style={styles.winningTitle}>{winningMessage}</Text>
              <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winnerInfo}>
                <Text style={styles.winnerName}>{winningUser}</Text>
                <Text style={styles.winnerPattern}>{winningPattern}</Text>
              </LinearGradient>
              <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.prizeAmountContainer}>
                <Text style={styles.prizeAmount}>₹{winningAmount}</Text>
                <Text style={styles.prizeLabel}>WINNINGS</Text>
              </LinearGradient>
              <LinearGradient colors={[COLORS.warning + '20', COLORS.warning + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.celebrationMessage}>
                <Ionicons name="sparkles" size={16} color={COLORS.warning} />
                <Text style={styles.celebrationText}>CONGRATULATIONS!</Text>
                <Ionicons name="sparkles" size={16} color={COLORS.warning} />
              </LinearGradient>
            </LinearGradient>
            <TouchableOpacity style={styles.closeCelebrationButton} onPress={stopWinningCelebration}>
              <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.closeCelebrationGradient}>
                <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassEffectOverlay} />
                <Text style={styles.closeCelebrationText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const startAnimations = () => {
    Animated.loop(Animated.sequence([Animated.timing(floatAnim1, { toValue: 1, duration: 4000, useNativeDriver: true }), Animated.timing(floatAnim1, { toValue: 0, duration: 4000, useNativeDriver: true })])).start();
    Animated.loop(Animated.sequence([Animated.timing(floatAnim2, { toValue: 1, duration: 5000, useNativeDriver: true }), Animated.timing(floatAnim2, { toValue: 0, duration: 5000, useNativeDriver: true })])).start();
    Animated.loop(Animated.sequence([Animated.timing(pulseAnim, { toValue: 1.02, duration: 3000, useNativeDriver: true }), Animated.timing(pulseAnim, { toValue: 1, duration: 3000, useNativeDriver: true })])).start();
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 20000, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([Animated.timing(shineAnim, { toValue: 1, duration: 3000, useNativeDriver: true }), Animated.timing(shineAnim, { toValue: 0, duration: 3000, useNativeDriver: true })])).start();
  };

  const startPulseAnimation = (anim, duration = 800) => {
    Animated.loop(Animated.sequence([Animated.timing(anim, { toValue: 1.08, duration: duration, useNativeDriver: true }), Animated.timing(anim, { toValue: 1, duration: duration, useNativeDriver: true })])).start();
  };

  const translateY1 = floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 15] });
  const translateY2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const shineTranslateX = shineAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, SCREEN_WIDTH + 100] });

  const Header = () => {
    const letters = [
      { char: 'G', index: 0 }, { char: 'A', index: 1 }, { char: 'M', index: 2 }, { char: 'E', index: 3 },
      { char: ' ', index: 4, isSpace: true, width: 15 },
      { char: 'R', index: 5 }, { char: 'O', index: 6 }, { char: 'O', index: 7 }, { char: 'M', index: 8, isSpecial: true },
    ];
    return (
      <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <View style={styles.headerPattern}><Animated.View style={[styles.headerShine, { transform: [{ translateX: shineTranslateX }] }]} /></View>
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.surface} /></TouchableOpacity>
            </Animated.View>
            <View style={styles.headerTextContainer}>
              <View style={styles.cartoonTitleRow}>
                {letters.map((item) => {
                  const animValue = letterAnims.current && letterAnims.current[item.index] ? letterAnims.current[item.index] : new Animated.Value(1);
                  return <Animated.Text key={`letter-${item.index}`} style={[styles.cartoonLetter, item.isSpecial && styles.specialCartoonLetter, item.isSpace && { width: item.width || 20 }, { transform: [{ scale: animValue }] }]}>{item.char}</Animated.Text>;
                })}
              </View>
              <View style={styles.gameInfoContainer}><Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" /><Text style={styles.gameName} numberOfLines={1}>{gameName || "Tambola Game"}</Text></View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') handleAppForeground();
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, [appState]);

  useEffect(() => { calledNumbersRef.current = calledNumbers; }, [calledNumbers]);
  useEffect(() => { claimsRef.current = claims; }, [claims]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { 
      isMountedRef.current = false; 
      clearTtsQueue();
      // Save spoken numbers when component unmounts
      saveSpokenNumbers();
      // Save pending markings when component unmounts
      savePendingMarkings();
      saveFailedMarkings();
      // Clear retry timeouts
      Object.values(retryTimeoutsRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    const newLetterAnims = Array(9).fill().map(() => new Animated.Value(1));
    letterAnims.current = newLetterAnims;
    letterAnims.current.forEach(anim => { anim.stopAnimation(); anim.setValue(1); });
    let currentIndex = 0;
    let isAnimating = true;
    const animateNextLetter = () => {
      if (!isAnimating) return;
      if (currentIndex === 4) currentIndex = 5;
      letterAnims.current.forEach(anim => anim.setValue(1));
      Animated.sequence([
        Animated.timing(letterAnims.current[currentIndex], { toValue: 1.5, duration: 200, useNativeDriver: true, easing: Easing.bounce }),
        Animated.timing(letterAnims.current[currentIndex], { toValue: 1, duration: 150, useNativeDriver: true, easing: Easing.bounce }),
        Animated.delay(200),
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
          currentIndex = (currentIndex + 1) % letterAnims.current.length;
          if (currentIndex === 4) currentIndex = 5;
          animateNextLetter();
        }
      });
    };
    animateNextLetter();

    const initializeApp = async () => {
      try {
        // Load previously spoken numbers first
        await loadSpokenNumbers();
        console.log(`[Game ${gameId}] 📊 Loaded spoken numbers:`, Array.from(spokenInSessionRef.current));
        
        // Load pending markings
        await loadPendingMarkings();
        
        await initializeTTS();
        startAnimations();
        startPulseAnimation(backButtonScale, 800);
        startPulseAnimation(chatButtonScale, 1000);
        await loadSounds();
        await initializePusher();
        await fetchInitialData();
        
        if (isMountedRef.current) setLoading(false);
      } catch (error) {
        console.log("Error initializing app:", error);
        showSnackbar("Failed to initialize. Please try again.", 'error');
        if (isMountedRef.current) setLoading(false);
      }
    };
    initializeApp();

    return () => {
      isAnimating = false;
      if (letterAnims.current) letterAnims.current.forEach(anim => anim.stopAnimation());
      cleanupPusher();
      clearTtsQueue();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (fetchGameStatusTimeoutRef.current) clearTimeout(fetchGameStatusTimeoutRef.current);
      if (clickSound) clickSound.release();
      Object.values(blinkingIntervals.current).forEach(interval => { if (interval && interval.animation && interval.animation.stop) interval.animation.stop(); });
      Object.values(blinkingTimeouts.current).forEach(timeout => { if (timeout) clearTimeout(timeout); });
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
      stopConfettiAnimation();
      stopWinningCelebration();
      stopAllBlinking();
    };
  }, [gameId]);

  useEffect(() => {
    if (myTickets.length > 0) {
      claimButtonScales.current = myTickets.map(() => new Animated.Value(1));
      patternsButtonScales.current = myTickets.map(() => new Animated.Value(1));
      claimButtonScales.current.forEach(anim => startPulseAnimation(anim, 800));
      patternsButtonScales.current.forEach(anim => startPulseAnimation(anim, 900));
    }
  }, [myTickets.length]);

  useEffect(() => { checkGameCompletion(); }, [calledNumbers, gameStatus?.status]);

  useEffect(() => {
    console.log(`[Game ${gameId}] calledNumbers changed, forcing re-render`);
    if (calledNumbers.length > 0) lastCalledRef.current = calledNumbers[calledNumbers.length - 1];
    setUpdateTrigger(prev => prev + 1);
    if (calledNumbers.length >= 90) checkGameCompletion();
  }, [calledNumbers]);

  const handleAppForeground = async () => {
    if (!isMountedRef.current) return;
    console.log(`[Game ${gameId}] 📱 App in foreground - checking connections`);
    try {
      const pusher = Pusher.getInstance();
      if (!isPusherConnectedRef.current) await reconnectPusher();
      await fetchGameStatus();
      await fetchCalledNumbers();
      await fetchMyTickets();
      await fetchClaims();
      processMissedEventsQueue();
    } catch (error) {
      console.log(`[Game ${gameId}] Error in handleAppForeground:`, error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loadingIconWrapper}>
              <MaterialIcons name="confirmation-number" size={40} color={COLORS.surface} />
            </LinearGradient>
            <ActivityIndicator size="large" color={COLORS.surface} style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Loading Game Room...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.backgroundPattern}>
        <Animated.View style={[styles.pokerChip1, { transform: [{ translateY: translateY1 }, { translateX: translateY2 }] }]} />
        <Animated.View style={[styles.pokerChip2, { transform: [{ translateY: translateY2 }, { translateX: translateY1 }] }]} />
        <Animated.View style={[styles.pokerChip3, { transform: [{ translateY: translateY1 }, { translateX: translateY2 }] }]} />
        <Animated.View style={[styles.shineEffect, { transform: [{ translateX: shineTranslateX }], opacity: shineAnim }]} />
      </View>
      <CustomSnackbar visible={snackbar.visible} message={snackbar.message} type={snackbar.type} onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))} />
      {renderPatternsModal()}
      {renderWinningCelebration()}
      
      <Modal animationType="fade" transparent={true} visible={showGameEndModal} onRequestClose={handleCloseGameEndModal}>
        <View style={styles.gameEndModalOverlay}>
          <Animated.View style={[styles.confettiContainer, { transform: [{ translateY: confettiAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }] }]}><Ionicons name="confetti" size={150} color={COLORS.primary} style={{ opacity: 0.7 }} /></Animated.View>
          <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gameEndModalContent}>
            <View style={styles.gameEndModalHeader}>
              <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gameEndIconContainer}><Ionicons name="trophy" size={40} color={COLORS.surface} /></LinearGradient>
              <Text style={styles.gameEndModalTitle}>{gameStatus?.status === 'completed' ? "Game Completed!" : "Game Complete! 🎉"}</Text>
            </View>
            <View style={styles.gameEndModalBody}>
              <Text style={styles.gameEndCongratulations}>Congratulations!</Text>
              <Text style={styles.gameEndMessage}>{gameStatus?.status === 'completed' ? "The game has been marked as completed by the host!" : "All 90 numbers have been called! The game has ended."}</Text>
              <LinearGradient colors={COLORS.winnerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gameEndStats}>
                <View style={styles.endStatItem}><Text style={styles.endStatValue}>{calledNumbers.length}</Text><Text style={styles.endStatLabel}>Numbers Called</Text></View>
                <View style={styles.endStatItem}><Text style={styles.endStatValue}>{myTickets.length}</Text><Text style={styles.endStatLabel}>Your Tickets</Text></View>
                <View style={styles.endStatItem}><Text style={styles.endStatValue}>{myTickets.flatMap(t => t.ticket_data.flat().filter(cell => cell.is_marked)).length}</Text><Text style={styles.endStatLabel}>Marked Numbers</Text></View>
              </LinearGradient>
              <Text style={styles.gameEndThanks}>Thank you for playing! Check out the winners and claim your prizes.</Text>
            </View>
            <View style={styles.gameEndModalFooter}>
              <TouchableOpacity style={styles.viewWinnersButton} onPress={handleViewWinners}>
                <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewWinnersButtonGradient}>
                  <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassEffectOverlay} />
                  <Ionicons name="trophy" size={20} color={COLORS.surface} />
                  <Text style={styles.viewWinnersButtonText}>View Winners</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseGameEndModal}>
                <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.closeButtonGradient}>
                  <Text style={styles.closeButtonText}>Exit Game Room</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {renderPatternMenu()}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />} contentContainerStyle={styles.scrollContent}>
        <Header />
        <View style={styles.content}>
          {renderAllCalledNumbersSection()}
          <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card} key={`last-called-${updateTrigger}`}>
            {calledNumbers.length > 0 ? (
              <View style={styles.lastCalledSection}>
                <View style={styles.lastCalledHeader}>
                  <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionIcon}><Ionicons name="megaphone" size={16} color={COLORS.primary} /></LinearGradient>
                  <Text style={styles.sectionTitle}>Last Called Numbers</Text>
                </View>
                <View key={`last-five-${calledNumbers[calledNumbers.length - 1] || 'none'}`} style={styles.circularNumbersGrid}>
                  {calledNumbers.slice(-5).reverse().map((num, index) => {
                    const isLatest = index === 0;
                    return (
                      <TouchableOpacity key={`${num}-${index}`} style={[styles.circularNumberItem, isLatest && styles.latestCircularNumber]} onPress={() => speakNumber(num)} onLongPress={() => speakNumber(num)}>
                        <Text style={[styles.circularNumberText, isLatest && styles.latestCircularNumberText]}>{num}</Text>
                        {isLatest && <View style={styles.latestBadge}><Ionicons name="star" size={8} color={COLORS.surface} /></View>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllCalledNumbers}>
                  <Text style={styles.viewAllButtonText}>View All Called Numbers</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.waitingSection}><Ionicons name="hourglass-outline" size={32} color={COLORS.warning} /><Text style={styles.waitingText}>Waiting for numbers to be called...</Text></View>
            )}
          </LinearGradient>
          <View style={styles.ticketsSection}>
            {myTickets.length === 0 ? (
              <LinearGradient colors={COLORS.winnerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emptyTicketsContainer}>
                <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emptyIconContainer}><Ionicons name="ticket-outline" size={30} color={COLORS.surface} /></LinearGradient>
                <Text style={styles.emptyTitle}>No Tickets Allocated</Text>
                <Text style={styles.emptySubtitle}>You haven't been allocated any tickets for this game yet</Text>
              </LinearGradient>
            ) : (
              <>
                {blinkingPattern && (
                  <LinearGradient colors={[COLORS.warning + '20', COLORS.warning + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.activePatternContainer}>
                    <Ionicons name="star" size={14} color={COLORS.warning} />
                    <Text style={styles.activePatternText}>Showing: <Text style={styles.activePatternName}>{blinkingPattern.display_name}</Text></Text>
                    <TouchableOpacity style={styles.stopBlinkingSmallButton} onPress={stopAllBlinking}><Ionicons name="close" size={12} color={COLORS.red} /></TouchableOpacity>
                  </LinearGradient>
                )}
                <View style={styles.ticketsGridContainer}>{renderTicketsGrid()}</View>
                <Text style={styles.ticketsHint}>Tap numbers to mark/unmark them • Long press to hear number • Tap Patterns to view • Tap Claim to submit</Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>

      <Animated.View style={{ transform: [{ scale: chatButtonScale }] }}>
        <TouchableOpacity style={styles.floatingChatButton} onPress={joinChat} activeOpacity={0.9}>
          <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.chatButtonGradient}>
            <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassEffectOverlay} />
            <View style={styles.chatButtonContent}>
              <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.surface} />
              {participantCount > 0 && <LinearGradient colors={COLORS.redGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.chatBadge}><Text style={styles.chatBadgeText}>{participantCount > 99 ? '99+' : participantCount}</Text></LinearGradient>}
            </View>
            <Text style={styles.chatButtonText}>{isChatJoined ? 'Chat' : 'Join Chat'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const additionalStyles = {
  snackbarAbsoluteContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: 'none' },
  snackbarContainer: { marginHorizontal: 16, marginBottom: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: 'hidden' },
  snackbarGradient: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  snackbarIcon: { marginRight: 12 },
  snackbarText: { color: COLORS.surface, fontSize: 14, fontWeight: '600', flex: 1 },
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  content: { padding: HORIZONTAL_MARGIN, paddingTop: 20, zIndex: 1 },
  backgroundPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' },
  pokerChip1: { position: 'absolute', top: 80, left: SCREEN_WIDTH * 0.1, width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  pokerChip2: { position: 'absolute', top: 120, right: SCREEN_WIDTH * 0.15, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.secondary, shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  pokerChip3: { position: 'absolute', top: 180, left: SCREEN_WIDTH * 0.6, width: 25, height: 25, borderRadius: 12.5, backgroundColor: COLORS.secondary, shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  shineEffect: { position: 'absolute', top: 0, left: 0, width: 100, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', transform: [{ skewX: '-20deg' }] },
  header: { paddingTop: 15, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, position: 'relative', overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  headerShine: { position: 'absolute', top: 0, left: 0, width: 100, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', transform: [{ skewX: '-20deg' }] },
  headerContent: { paddingHorizontal: 20 },
  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: 'center', alignItems: 'center' },
  headerTextContainer: { flex: 1, marginLeft: 12 },
  cartoonTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  cartoonLetter: { fontSize: 28, fontWeight: '900', color: '#FDB800', textTransform: 'uppercase', textShadowColor: 'rgba(255, 193, 7, 0.5)', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 8, includeFontPadding: false, marginHorizontal: 2, ...Platform.select({ android: { elevation: 5, textShadowColor: '#FFB300', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 6 } }) },
  specialCartoonLetter: { fontSize: 32, color: '#FFD700', textShadowColor: '#FF8C00', textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 10, marginHorizontal: 2 },
  gameInfoContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  gameName: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  card: { borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  lastCalledSection: { marginBottom: 0 },
  lastCalledHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 6 },
  sectionIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, flex: 1 },
  circularNumbersGrid: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  circularNumberItem: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  latestCircularNumber: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, borderWidth: 2 },
  circularNumberText: { fontSize: 16, fontWeight: "600", color: COLORS.textDark },
  latestCircularNumberText: { color: COLORS.surface, fontWeight: "700" },
  latestBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: COLORS.surface, borderRadius: 5, padding: 1 },
  viewAllButton: { flexDirection: "row", alignItems: "center", justifyContent: 'center', backgroundColor: COLORS.background, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, gap: 6 },
  viewAllButtonText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },
  waitingSection: { alignItems: "center", paddingVertical: 20 },
  waitingText: { fontSize: 14, color: COLORS.warning, textAlign: "center", marginTop: 12, fontStyle: "italic" },
  allNumbersCard: { borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  allNumbersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  allNumbersTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  allNumbersTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  calledCountBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginLeft: 6 },
  calledCountText: { fontSize: 11, fontWeight: '700', color: COLORS.surface },
  viewAllGridButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: COLORS.background, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  viewAllGridButtonText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  numbersGridCompact: { marginVertical: 6 },
  numberRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5 },
  numberItemCompact: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginHorizontal: 2, position: 'relative' },
  calledNumberItem: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  latestNumberItem: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, borderWidth: 2 },
  numberItemTextCompact: { fontSize: 11, fontWeight: '600', color: COLORS.textDark },
  calledNumberText: { color: COLORS.surface, fontWeight: '700' },
  latestNumberText: { color: COLORS.surface, fontWeight: '900' },
  latestIndicatorCompact: { position: 'absolute', top: -2, right: -2, backgroundColor: COLORS.surface, borderRadius: 5, padding: 1 },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColor: { width: 12, height: 12, borderRadius: 3, borderWidth: 1, borderColor: COLORS.border },
  legendNormal: { backgroundColor: COLORS.surface },
  legendCalled: { backgroundColor: COLORS.green },
  legendLatest: { backgroundColor: COLORS.primary },
  legendText: { fontSize: 10, color: COLORS.textLight },
  ticketsSection: { marginBottom: 12 },
  activePatternContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.primary },
  activePatternText: { fontSize: 13, color: COLORS.textDark, marginLeft: 6, flex: 1 },
  activePatternName: { fontWeight: '700', color: COLORS.primary },
  stopBlinkingSmallButton: { padding: 3 },
  ticketsGridContainer: { gap: 20 },
  ticketRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  ticketGridItem: {},
  ticketItemContainer: { marginBottom: 0 },
  ticketHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingHorizontal: 4 },
  ticketNumberContainer: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  ticketIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  ticketInfo: { flex: 1 },
  ticketLabel: { fontSize: 13, color: COLORS.textDark, fontWeight: "600" },
  ticketActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  viewPatternsButton: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.primary },
  viewPatternsButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, gap: 4 },
  viewPatternsButtonText: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  claimButton: { borderRadius: 12, overflow: 'hidden' },
  claimButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, gap: 4, position: 'relative' },
  glassEffectOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.3)', borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 12 },
  claimButtonText: { fontSize: 11, color: COLORS.surface, fontWeight: "600" },
  ticketCard: { borderRadius: 12, padding: TICKET_PADDING, borderWidth: 1.5, borderColor: COLORS.ticketBorder, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, position: 'relative' },
  ticketCardPattern: { position: 'absolute', bottom: 0, left: 0, width: 50, height: 50, borderBottomLeftRadius: 12, borderTopRightRadius: 20 },
  ticket: { backgroundColor: COLORS.surface, padding: 0, borderWidth: 0, borderRadius: 0, overflow: "hidden", width: CELL_WIDTH * NUM_COLUMNS + CELL_MARGIN * 2 * NUM_COLUMNS, alignSelf: 'center', position: 'relative' },
  ticketPattern: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderBottomLeftRadius: 20 },
  row: { flexDirection: "row", width: '100%' },
  cell: { borderWidth: 1, borderColor: COLORS.primary, alignItems: "center", justifyContent: "center", borderRadius: 2, margin: CELL_MARGIN },
  number: { fontSize: 16, fontWeight: "bold", color: COLORS.surface },
  blinkingCellBorder: { borderWidth: 3, borderColor: COLORS.warning, shadowColor: COLORS.warning, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
  ticketsHint: { fontSize: 11, color: COLORS.textLight, textAlign: "center", marginTop: 16, fontStyle: "italic", lineHeight: 14, paddingHorizontal: 4 },
  emptyTicketsContainer: { alignItems: "center", borderRadius: 14, padding: 32, borderWidth: 1, borderColor: COLORS.border, marginTop: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  emptyIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark, marginBottom: 8, textAlign: "center" },
  emptySubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: "center", lineHeight: 20, marginBottom: 20, paddingHorizontal: 20 },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  menuContainer: { borderRadius: 14, width: '85%', maxHeight: '60%', overflow: 'hidden' },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.background },
  menuTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  menuHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  refreshMenuButton: { padding: 5 },
  patternsMenuScroll: { maxHeight: 300 },
  patternMenuItem: { borderBottomWidth: 1, borderBottomColor: COLORS.border, overflow: 'hidden' },
  patternMenuItemGradient: { padding: 14 },
  disabledPatternItem: { opacity: 0.7 },
  patternMenuItemContent: { flexDirection: 'row', alignItems: 'center' },
  patternMenuItemInfo: { flex: 1, marginLeft: 10 },
  patternMenuItemName: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  patternMenuItemDesc: { fontSize: 12, color: COLORS.textLight },
  patternStatusContainer: { marginLeft: 6 },
  patternLimitText: { color: COLORS.primary, fontWeight: '600' },
  limitReachedText: { color: COLORS.red, fontWeight: '700' },
  claimedBadge: { fontSize: 11, color: COLORS.surface, fontWeight: '600', marginLeft: 4 },
  limitReachedBadge: { fontSize: 11, color: COLORS.surface, fontWeight: '600', marginLeft: 4 },
  disabledPatternName: { color: COLORS.textLight, textDecorationLine: 'none' },
  disabledPatternDesc: { color: COLORS.textLight },
  noPatternsContainer: { alignItems: 'center', padding: 24 },
  noPatternsText: { fontSize: 14, color: COLORS.textLight, marginTop: 12, textAlign: 'center', fontWeight: '600' },
  retryButton: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.background, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary, gap: 6 },
  retryButtonText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  patternsModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  patternsModalContainer: { borderRadius: 16, width: '90%', maxHeight: '75%', overflow: 'hidden' },
  patternsModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.background },
  patternsModalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  patternsModalHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  refreshPatternsButton: { padding: 5 },
  patternsModalCloseButton: { padding: 5 },
  patternsModalSubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.surface },
  currentBlinkingPatternContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary },
  currentBlinkingPatternText: { fontSize: 13, color: COLORS.textDark, marginLeft: 8, flex: 1 },
  currentBlinkingPatternName: { fontWeight: '700', color: COLORS.primary },
  stopBlinkingButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, borderWidth: 1, borderColor: COLORS.red, gap: 4 },
  stopBlinkingText: { fontSize: 12, color: COLORS.red, fontWeight: '600' },
  earlyFiveNoteContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary },
  earlyFiveNoteText: { fontSize: 13, color: COLORS.textLight, marginLeft: 8, flex: 1 },
  earlyFiveNoteBold: { fontWeight: '700', color: COLORS.primary },
  patternsLoadingContainer: { padding: 32, alignItems: 'center' },
  patternsLoadingText: { marginTop: 12, fontSize: 14, color: COLORS.textLight },
  patternsList: { maxHeight: 350 },
  patternListItem: { overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  patternListItemGradient: { padding: 14 },
  selectedPatternListItem: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  patternListItemContent: { flexDirection: 'row', alignItems: 'center' },
  patternListItemInfo: { flex: 1, marginLeft: 10 },
  patternListItemName: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  patternListItemDesc: { fontSize: 12, color: COLORS.textLight },
  patternAmountText: { color: COLORS.green, fontWeight: '600' },
  selectedBadge: { fontSize: 12, color: COLORS.surface, fontWeight: '600', marginLeft: 4 },
  patternActionContainer: { marginLeft: 8 },
  noAvailablePatternsContainer: { alignItems: 'center', padding: 32 },
  noAvailablePatternsText: { fontSize: 14, color: COLORS.textLight, marginTop: 12, textAlign: 'center', fontWeight: '600' },
  patternsModalFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.background },
  clearSelectionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.background, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  clearSelectionButtonText: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },
  closePatternsButton: { borderRadius: 8, overflow: 'hidden' },
  closePatternsGradient: { paddingHorizontal: 16, paddingVertical: 8 },
  closePatternsButtonText: { color: COLORS.surface, fontSize: 13, fontWeight: '600' },
  winningOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
  celebrationContent: { width: '80%', maxWidth: 300, alignItems: 'center' },
  celebrationInner: { borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8, borderWidth: 2, borderColor: COLORS.primary, width: '100%' },
  trophyIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  winningTitle: { fontSize: 18, fontWeight: '900', color: COLORS.red, textAlign: 'center', marginBottom: 10 },
  winnerInfo: { padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.primary, width: '100%' },
  winnerName: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 4, textAlign: 'center' },
  winnerPattern: { fontSize: 13, color: COLORS.red, fontWeight: '600', textAlign: 'center' },
  prizeAmountContainer: { padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: COLORS.red, width: '100%' },
  prizeAmount: { fontSize: 28, fontWeight: '900', color: COLORS.surface, marginBottom: 4 },
  prizeLabel: { fontSize: 11, fontWeight: '700', color: COLORS.surface, letterSpacing: 1 },
  celebrationMessage: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.primary },
  celebrationText: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginHorizontal: 6 },
  closeCelebrationButton: { marginTop: 12, borderRadius: 20, overflow: 'hidden', width: '100%' },
  closeCelebrationGradient: { paddingVertical: 12, alignItems: 'center', position: 'relative' },
  closeCelebrationText: { color: COLORS.surface, fontSize: 14, fontWeight: 'bold' },
  confettiParticle: { width: 6, height: 6, borderRadius: 1, position: 'absolute', top: -50 },
  gameEndModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  confettiContainer: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  gameEndModalContent: { borderRadius: 20, padding: 20, width: '100%', maxWidth: 350, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: COLORS.border },
  gameEndModalHeader: { alignItems: 'center', marginBottom: 20 },
  gameEndIconContainer: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gameEndModalTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primary, textAlign: 'center' },
  gameEndModalBody: { marginBottom: 20 },
  gameEndCongratulations: { fontSize: 20, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginBottom: 10 },
  gameEndMessage: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  gameEndStats: { flexDirection: 'row', justifyContent: 'space-around', borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  endStatItem: { alignItems: 'center', flex: 1 },
  endStatValue: { fontSize: 20, fontWeight: '900', color: COLORS.textDark, marginBottom: 4 },
  endStatLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },
  gameEndThanks: { fontSize: 13, color: COLORS.textLight, textAlign: 'center', fontStyle: 'italic', lineHeight: 18 },
  gameEndModalFooter: { gap: 10 },
  viewWinnersButton: { borderRadius: 10, overflow: 'hidden' },
  viewWinnersButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, position: 'relative' },
  viewWinnersButtonText: { color: COLORS.surface, fontSize: 14, fontWeight: '700' },
  closeButton: { borderRadius: 10, overflow: 'hidden' },
  closeButtonGradient: { paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  closeButtonText: { color: COLORS.textLight, fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 16, padding: 20, width: '90%', maxWidth: 350 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  modalCloseButton: { padding: 4 },
  modalSubtitle: { fontSize: 13, color: COLORS.textLight, marginBottom: 20, lineHeight: 18 },
  voiceOption: { borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  voiceOptionGradient: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  selectedVoiceOption: { borderWidth: 2, borderColor: COLORS.primary },
  voiceOptionIcon: { marginRight: 12 },
  voiceOptionInfo: { flex: 1 },
  voiceOptionName: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, marginBottom: 2 },
  voiceOptionDesc: { fontSize: 12, color: COLORS.textLight },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingContent: { alignItems: 'center' },
  loadingIconWrapper: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  loadingSpinner: { marginTop: 10 },
  loadingText: { fontSize: 16, color: COLORS.surface, fontWeight: "500", marginTop: 20 },
  floatingChatButton: { position: 'absolute', bottom: 16, right: 16, borderRadius: 20, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  chatButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, position: 'relative' },
  chatButtonContent: { position: 'relative', marginRight: 6 },
  chatBadge: { position: 'absolute', top: -4, right: -4, borderRadius: 6, minWidth: 14, height: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.surface },
  chatBadgeText: { color: COLORS.surface, fontSize: 8, fontWeight: 'bold', paddingHorizontal: 2 },
  chatButtonText: { color: COLORS.surface, fontSize: 13, fontWeight: 'bold' },
  bottomSpace: { height: 20 },
  ...additionalStyles,
});

export default UserGameRoom;