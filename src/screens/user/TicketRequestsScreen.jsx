import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  AppState,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// For React Native CLI, use react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

// Updated Color scheme matching FAQ and Home
const PRIMARY_COLOR = "#02658D"; // Main background color
const SECONDARY_COLOR = "#02557A"; // Darker blue
const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
const LIGHT_ACCENT = "#FFECB3"; // Very light amber
const TEXT_LIGHT = "#E3F2FD"; // Light blue text
const DARK_BLUE = "#014560"; // Darker blue for backgrounds
const WHITE = "#FFFFFF";

const TicketRequestsScreen = ({ route, navigation }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });
  
  // Polling state
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  
  // Polling configuration
  const POLLING_INTERVAL = 3000; // 10 seconds
  const POLLING_INTERVAL_BACKGROUND = 30000; // 30 seconds when app is in background
  const MAX_POLLING_DURATION = 300000; // Stop after 5 minutes to save battery

  useEffect(() => {
    console.log("Screen mounted, fetching requests for game:", gameId);
    fetchTicketRequests();
    
    // Start polling when component mounts
    startPolling();
    
    // Setup app state listener for background/foreground
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    
    // Cleanup on unmount
    return () => {
      console.log("Component unmounting, cleaning up...");
      stopPolling();
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Auto-stop polling after MAX_POLLING_DURATION to save battery
    const autoStopTimer = setTimeout(() => {
      if (isPolling) {
        console.log("Auto-stopping polling after maximum duration");
        stopPolling();
      }
    }, MAX_POLLING_DURATION);

    return () => clearTimeout(autoStopTimer);
  }, [isPolling]);

  const handleAppStateChange = (nextAppState) => {
    console.log("App state changed:", nextAppState);
    
    if (nextAppState.match(/inactive|background/) && appState.current === "active") {
      // App going to background
      console.log("App going to background, adjusting polling interval");
      adjustPollingForBackground();
    } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      // App coming to foreground
      console.log("App coming to foreground, resuming normal polling");
      adjustPollingForForeground();
    }
    
    appState.current = nextAppState;
  };

  const startPolling = () => {
    console.log("Starting polling...");
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    setIsPolling(true);
    
    // Initial fetch
    fetchTicketRequestsSilently();
    
    // Set up interval for polling
    pollingIntervalRef.current = setInterval(() => {
      console.log("Polling interval triggered");
      fetchTicketRequestsSilently();
    }, POLLING_INTERVAL);
  };

  const stopPolling = () => {
    console.log("Stopping polling...");
    setIsPolling(false);
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const adjustPollingForBackground = () => {
    if (!pollingIntervalRef.current) return;
    
    console.log("Adjusting to background polling interval");
    clearInterval(pollingIntervalRef.current);
    
    pollingIntervalRef.current = setInterval(() => {
      console.log("Background polling interval triggered");
      fetchTicketRequestsSilently();
    }, POLLING_INTERVAL_BACKGROUND);
  };

  const adjustPollingForForeground = () => {
    if (!pollingIntervalRef.current) return;
    
    console.log("Adjusting to foreground polling interval");
    clearInterval(pollingIntervalRef.current);
    
    pollingIntervalRef.current = setInterval(() => {
      console.log("Foreground polling interval triggered");
      fetchTicketRequestsSilently();
    }, POLLING_INTERVAL);
  };

  const fetchTicketRequestsSilently = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        const allRequests = response.data.ticket_requests?.data || [];
        const gameRequests = allRequests.filter(
          (request) => request.game_id == gameId || request.game_id === gameId
        );
        
        // Check if there are any status changes
        const hasChanges = checkForStatusChanges(gameRequests);
        
        if (hasChanges) {
          console.log("Status changes detected, updating UI");
          updateRequestsAndStats(gameRequests);
        }
      }
    } catch (error) {
      console.log("Silent fetch error:", error.message);
      // Don't show alerts for silent fetches
    }
  };

  const checkForStatusChanges = (newRequests) => {
    if (requests.length !== newRequests.length) {
      return true;
    }
    
    for (let i = 0; i < newRequests.length; i++) {
      const newRequest = newRequests[i];
      const oldRequest = requests.find(r => r.id === newRequest.id);
      
      if (!oldRequest) return true;
      
      if (oldRequest.status !== newRequest.status ||
          oldRequest.payment_status !== newRequest.payment_status ||
          oldRequest.rejection_reason !== newRequest.rejection_reason) {
        return true;
      }
    }
    
    return false;
  };

  const updateRequestsAndStats = (gameRequests) => {
    setRequests(gameRequests);
    
    const pendingCount = gameRequests.filter(r => r.status === "pending").length;
    const approvedCount = gameRequests.filter(r => r.status === "approved").length;
    const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
    const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
    setStats({
      total: gameRequests.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      cancelled: cancelledCount,
    });
  };

  const onRefresh = React.useCallback(() => {
    console.log("Manual refresh triggered");
    setRefreshing(true);
    fetchTicketRequests().finally(() => {
      setRefreshing(false);
      console.log("Manual refresh complete");
    });
  }, []);

  const fetchTicketRequests = async () => {
    console.log("fetchTicketRequests called");
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );

      console.log("API Response:", response.data);
      
      if (response.data.success) {
        console.log("Data success, processing...");
        const allRequests = response.data.ticket_requests?.data || [];
        console.log("Total requests:", allRequests.length);
        
        const gameRequests = allRequests.filter(
          (request) => request.game_id == gameId || request.game_id === gameId
        );
        console.log("Filtered requests for game:", gameRequests.length);
        
        updateRequestsAndStats(gameRequests);
      } else {
        console.log("API returned success: false", response.data);
        Alert.alert("Error", response.data.message || "Failed to fetch requests");
      }
    } catch (error) {
      console.log("Error fetching ticket requests:", error);
      console.log("Error response:", error.response?.data);
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  const cancelTicketRequest = async (requestId) => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this ticket request?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
                {},
                { 
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  } 
                }
              );

              if (response.data.success) {
                Alert.alert("Success", "Ticket request cancelled successfully!");
                fetchTicketRequests();
              } else {
                Alert.alert("Error", response.data.message || "Failed to cancel request");
              }
            } catch (error) {
              console.log("Cancel error:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to cancel ticket request"
              );
            }
          }
        }
      ]
    );
  };

  const togglePolling = () => {
    if (isPolling) {
      stopPolling();
    } else {
      startPolling();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return ACCENT_COLOR;
      case "pending": return "#F39C12";
      case "rejected": return "#E74C3C";
      case "cancelled": return LIGHT_ACCENT;
      default: return LIGHT_ACCENT;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "approved": return "rgba(255, 213, 79, 0.1)";
      case "pending": return "rgba(243, 156, 18, 0.1)";
      case "rejected": return "rgba(231, 76, 60, 0.1)";
      case "cancelled": return "rgba(255, 236, 179, 0.1)";
      default: return "rgba(255, 236, 179, 0.1)";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return "checkmark-circle";
      case "pending": return "time";
      case "rejected": return "close-circle";
      case "cancelled": return "close-circle-outline";
      default: return "help-circle";
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.log("Date formatting error:", error);
      return dateString || "N/A";
    }
  };

  if (loading) {
    console.log("Showing loading screen");
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconWrapper}>
            <MaterialIcons name="confirmation-number" size={40} color={ACCENT_COLOR} />
          </View>
          <ActivityIndicator size="large" color={ACCENT_COLOR} style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading ticket requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log("Rendering main screen with", requests.length, "requests");

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={SECONDARY_COLOR} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT_COLOR}
            colors={[ACCENT_COLOR]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={TEXT_LIGHT} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>My Ticket Requests</Text>
              <View style={styles.gameInfoContainer}>
                <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
                <Text style={styles.gameName} numberOfLines={1}>
                  {gameName || "Game"}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={fetchTicketRequests}
            >
              <Ionicons name="refresh" size={22} color={SECONDARY_COLOR} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <StatCard 
              icon="receipt" 
              value={stats.total} 
              label="Total" 
              color={ACCENT_COLOR} 
            />
            <StatCard 
              icon="time" 
              value={stats.pending} 
              label="Pending" 
              color="#F39C12" 
            />
            <StatCard 
              icon="checkmark-circle" 
              value={stats.approved} 
              label="Approved" 
              color={ACCENT_COLOR} 
            />
          </View>

          {/* Requests Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Ticket Requests</Text>
              <Text style={styles.sectionCount}>{requests.length} Request{requests.length !== 1 ? 's' : ''}</Text>
            </View>

            {requests.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrapper}>
                  <MaterialIcons name="confirmation-number" size={50} color={ACCENT_COLOR} />
                </View>
                <Text style={styles.emptyTitle}>No Requests Found</Text>
                <Text style={styles.emptySubtitle}>
                  You haven't made any ticket requests for this game yet
                </Text>
                <TouchableOpacity
                  style={styles.newRequestButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={18} color={SECONDARY_COLOR} />
                  <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.requestsList}>
                {requests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, 
                      { backgroundColor: getStatusBgColor(request.status) }
                    ]}>
                      <Ionicons 
                        name={getStatusIcon(request.status)} 
                        size={12} 
                        color={getStatusColor(request.status)} 
                      />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(request.status) }
                      ]}>
                        {request.status?.toUpperCase() || "UNKNOWN"}
                      </Text>
                    </View>

                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.requestId}>Request #{request.id}</Text>
                        <Text style={styles.requestDateTime}>
                          {formatDateTime(request.requested_at || request.created_at)}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.paymentStatusBadge,
                        request.payment_status === "paid" ? styles.paidStatus : styles.pendingStatus
                      ]}>
                        <Text style={styles.paymentStatusText}>
                          {(request.payment_status || "pending").toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requestDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
                          </View>
                          <View>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <Text style={styles.detailText}>
                              {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <MaterialIcons name="account-balance-wallet" size={14} color={ACCENT_COLOR} />
                          </View>
                          <View>
                            <Text style={styles.detailLabel}>Amount</Text>
                            <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {request.notes && (
                      <View style={styles.notesContainer}>
                        <View style={styles.notesIcon}>
                          <Feather name="message-square" size={14} color={ACCENT_COLOR} />
                        </View>
                        <View style={styles.notesContent}>
                          <Text style={styles.notesLabel}>Your Note</Text>
                          <Text style={styles.notesText}>{request.notes}</Text>
                        </View>
                      </View>
                    )}

                    {request.rejection_reason && (
                      <View style={styles.rejectionContainer}>
                        <View style={styles.rejectionIcon}>
                          <Ionicons name="alert-circle" size={14} color="#E74C3C" />
                        </View>
                        <View style={styles.rejectionContent}>
                          <Text style={styles.rejectionLabel}>Rejection Reason</Text>
                          <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
                        </View>
                      </View>
                    )}

                    <View style={styles.actionContainer}>
                      {request.status === "pending" ? (
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => cancelTicketRequest(request.id)}
                        >
                          <Ionicons name="close-circle" size={16} color={SECONDARY_COLOR} />
                          <Text style={styles.cancelButtonText}>Cancel Request</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.cancelButton, styles.disabledButton]}
                          disabled={true}
                        >
                          <Ionicons 
                            name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
                            size={16} 
                            color="rgba(2, 85, 122, 0.7)" 
                          />
                          <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
                            {request.status === "approved" ? "Request Approved" : 
                             request.status === "rejected" ? "Request Rejected" : 
                             request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 213, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 213, 79, 0.2)',
  },
  loadingSpinner: {
    marginTop: 10,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginTop: 20,
  },
  header: {
    backgroundColor: SECONDARY_COLOR,
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DARK_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  gameInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gameName: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    opacity: 0.9,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  statsOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: DARK_BLUE,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: LIGHT_ACCENT,
    fontWeight: "600",
    opacity: 0.9,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_LIGHT,
  },
  sectionCount: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    opacity: 0.9,
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.3)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 25,
    marginBottom: 16,
  },
  requestId: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  requestDateTime: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    opacity: 0.9,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  paidStatus: {
    backgroundColor: "rgba(255, 213, 79, 0.1)",
  },
  pendingStatus: {
    backgroundColor: "rgba(243, 156, 18, 0.1)",
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: "700",
    color: TEXT_LIGHT,
  },
  requestDetails: {
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
    backgroundColor: SECONDARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  detailLabel: {
    fontSize: 10,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    marginBottom: 2,
    opacity: 0.9,
  },
  detailText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "600",
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 213, 79, 0.05)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.1)",
  },
  notesIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.2)",
  },
  notesContent: {
    flex: 1,
  },
  notesLabel: {
    fontSize: 11,
    color: ACCENT_COLOR,
    fontWeight: "600",
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
  },
  rejectionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(231, 76, 60, 0.05)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.1)",
  },
  rejectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.2)",
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionLabel: {
    fontSize: 11,
    color: "#E74C3C",
    fontWeight: "600",
    marginBottom: 2,
  },
  rejectionText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
    fontStyle: "italic",
  },
  actionContainer: {
    marginTop: 8,
  },
  cancelButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButtonText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: DARK_BLUE,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  disabledButtonText: {
    color: LIGHT_ACCENT,
    opacity: 0.9,
  },
  emptyState: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 213, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 213, 79, 0.2)',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: ACCENT_COLOR,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  newRequestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newRequestButtonText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpace: {
    height: 20,
  },
});

export default TicketRequestsScreen;