import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// For React Native CLI, use react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// EXACT SAME parameters from your example
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 8;
const HORIZONTAL_MARGIN = 10;

// EXACT SAME calculation from your example
const CELL_WIDTH = 
  (SCREEN_WIDTH - 
   HORIZONTAL_MARGIN * 2 - 
   TICKET_PADDING * 2 - 
   CELL_MARGIN * 2 * NUM_COLUMNS) / 
  NUM_COLUMNS;

// Updated colors to match new blue/gold scheme
const ROW_COLOR_1 = "#02557A"; // Darker blue for even rows
const ROW_COLOR_2 = "#014560"; // Dark blue for odd rows
const FILLED_CELL_BG = "#FFD54F"; // Amber/Gold for filled cells
const CELL_BORDER_COLOR = "#FFD54F"; // Amber/Gold border
const NUMBER_COLOR = "#014560"; // Dark blue for numbers

// Updated Color scheme matching FAQ and Home
const PRIMARY_COLOR = "#02658D"; // Main background color
const SECONDARY_COLOR = "#02557A"; // Darker blue
const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
const LIGHT_ACCENT = "#FFECB3"; // Very light amber
const TEXT_LIGHT = "#E3F2FD"; // Light blue text
const DARK_BLUE = "#014560"; // Darker blue for backgrounds

const TicketsScreen = ({ route, navigation }) => {
  const { game } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sets: 0,
  });

  const GAME_IMAGES = {
    ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
    diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
    empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
    pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
    users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
    megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
    trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const onRefresh = React.useCallback(() => {
    console.log("Refreshing tickets...");
    setRefreshing(true);
    fetchMyTickets().finally(() => {
      setRefreshing(false);
      console.log("Refresh complete");
    });
  }, []);

  const fetchMyTickets = async () => {
    console.log("fetchMyTickets called");
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );

      console.log("Tickets API Response:", res.data);
      
      if (res.data.success) {
        // Filter tickets for the current game if game prop exists
        const tickets = game
          ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
          : res.data.tickets.data;
        
        console.log("Filtered tickets:", tickets.length);
        setMyTickets(tickets);
        
        // Calculate stats (keeping for potential future use)
        const activeCount = tickets.filter(t => t.is_active).length;
        const setsCount = getTicketSetCount(tickets);
        
        setStats({
          total: tickets.length,
          active: activeCount,
          sets: setsCount,
        });
      }
    } catch (error) {
      console.log("Error fetching tickets:", error);
      console.log("Error response:", error.response?.data);
      Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert ticket_data to the format needed for rendering
  const processTicketData = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
    // Check if the data is in the new format (array of objects)
    if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
      // New format: array of objects with number property
      const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
      ticketData.forEach((row) => {
        row.forEach((cell) => {
          if (cell && cell.number !== null && cell.row !== undefined && cell.column !== undefined) {
            processedGrid[cell.row][cell.column] = cell.number;
          }
        });
      });
      
      return processedGrid;
    } else if (ticketData[0] && Array.isArray(ticketData[0])) {
      // Old format: simple 2D array
      return ticketData.map(row => row.map(cell => cell));
    }
    
    return Array(3).fill(Array(9).fill(null));
  };

  const renderTicketGrid = (ticketData, isModal = false) => {
    const processedData = processTicketData(ticketData);
    
    return (
      <View style={[
        styles.ticket,
        { 
          width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
          backgroundColor: DARK_BLUE,
          borderColor: ACCENT_COLOR,
        }
      ]}>
        {/* Ticket rows without column headers */}
        {processedData.map((row, rowIndex) => (
          <View 
            key={`row-${rowIndex}`} 
            style={[
              styles.row,
              { 
                backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
              }
            ]}
          >
            {row.map((cell, colIndex) => {
              const isEmpty = cell === null;
              
              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    { 
                      width: CELL_WIDTH,
                      height: CELL_WIDTH,
                      margin: CELL_MARGIN,
                      backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
                      borderColor: ACCENT_COLOR,
                    },
                  ]}
                >
                  {!isEmpty && (
                    <Text style={styles.number}>
                      {cell}
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

  const renderTicketItem = ({ item }) => (
    <View style={styles.ticketItemContainer}>
      {/* Ticket number and status outside the card */}
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
        ]}>
          <Ionicons
            name={item.is_active ? "checkmark-circle" : "close-circle"}
            size={12}
            color={item.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
          />
          <Text style={[styles.statusText, { color: item.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
            {item.is_active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Ticket Card with grid */}
      <TouchableOpacity
        onPress={() => {
          setSelectedTicket(item);
          setModalVisible(true);
        }}
        activeOpacity={0.9}
      >
        {/* Ticket grid directly on the white card */}
        {renderTicketGrid(item.ticket_data)}
      </TouchableOpacity>
    </View>
  );

  // Calculate ticket set count
  const getTicketSetCount = (tickets) => {
    const sets = new Set(tickets.map(t => t.ticket_set_id));
    return sets.size;
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
          <Text style={styles.loadingText}>Loading your tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        {/* Header with blue background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
              </TouchableOpacity>

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>My Tickets</Text>
                {game && (
                  <View style={styles.gameInfoContainer}>
                    <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
                    <Text style={styles.gameName} numberOfLines={1}>
                      {game.game_name || "Game"}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={fetchMyTickets}
              >
                <Ionicons name="refresh" size={22} color={ACCENT_COLOR} />
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="ticket-outline" size={20} color={ACCENT_COLOR} />
                <Text style={styles.statValue}>{myTickets.length}</Text>
                <Text style={styles.statLabel}>Total Tickets</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle-outline" size={20} color={ACCENT_COLOR} />
                <Text style={styles.statValue}>
                  {myTickets.filter(t => t.is_active).length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="grid-outline" size={20} color={ACCENT_COLOR} />
                <Text style={styles.statValue}>
                  {getTicketSetCount(myTickets)}
                </Text>
                <Text style={styles.statLabel}>Sets</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Tickets Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎟 My Tickets Collection</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{myTickets.length}</Text>
              </View>
            </View>

            {myTickets.length === 0 ? (
              <View style={styles.emptyState}>
                <Image
                  source={{ uri: GAME_IMAGES.empty }}
                  style={styles.emptyIcon}
                  tintColor={ACCENT_COLOR}
                />
                <Text style={styles.emptyTitle}>No Tickets Found</Text>
                <Text style={styles.emptySubtitle}>
                  {game
                    ? "You don't have any tickets for this game yet"
                    : "You haven't been allocated any tickets yet"}
                </Text>
                <TouchableOpacity
                  style={styles.refreshButtonLarge}
                  onPress={fetchMyTickets}
                >
                  <View style={styles.glassEffectOverlay} />
                  <Ionicons name="refresh" size={18} color={SECONDARY_COLOR} />
                  <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.ticketsList}>
                {myTickets.map((ticket) => (
                  <View key={ticket.id} style={styles.ticketWrapper}>
                    {renderTicketItem({ item: ticket })}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Bottom Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={18} color={ACCENT_COLOR} />
            <Text style={styles.infoCardText}>
              • Active tickets are eligible for game participation{'\n'}
              • Each ticket has a unique number and belongs to a set{'\n'}
              • Tickets are automatically allocated for approved requests
            </Text>
          </View>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>

      {/* Ticket Detail Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedTicket && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View style={styles.ticketNumberBadge}>
                      <Ionicons name="ticket-outline" size={16} color={SECONDARY_COLOR} />
                      <Text style={styles.ticketNumberBadgeText}>
                        Ticket No: #{selectedTicket.ticket_number}
                      </Text>
                    </View>
                    <View style={[
                      styles.modalStatusBadge,
                      { backgroundColor: selectedTicket.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
                    ]}>
                      <Ionicons
                        name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
                        size={12}
                        color={selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
                      />
                      <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
                        {selectedTicket.is_active ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={22} color={ACCENT_COLOR} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalContent}>
                  {selectedTicket.game && (
                    <View style={styles.gameCard}>
                      <View style={styles.gameCardHeader}>
                        <Ionicons name="game-controller" size={16} color={ACCENT_COLOR} />
                        <Text style={styles.gameCardTitle}>Game Details</Text>
                      </View>
                      <View style={styles.gameCardContent}>
                        <Text style={styles.gameNameText} numberOfLines={2}>
                          {selectedTicket.game.game_name}
                        </Text>
                        <View style={styles.gameDetailsRow}>
                          <View style={styles.gameDetailItem}>
                            <Feather name="hash" size={12} color={LIGHT_ACCENT} />
                            <Text style={styles.gameCodeText}>
                              {selectedTicket.game.game_code}
                            </Text>
                          </View>
                          <View style={styles.gameDetailItem}>
                            <Feather name="calendar" size={12} color={LIGHT_ACCENT} />
                            <Text style={styles.gameTimeText}>
                              {new Date(selectedTicket.game.game_date).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.fullTicketContainerModal}>
                    <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
                    <View style={styles.modalTicketGrid}>
                      {renderTicketGrid(selectedTicket.ticket_data, true)}
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <View style={styles.glassEffectOverlay} />
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: SECONDARY_COLOR,
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
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_LIGHT,
    letterSpacing: -0.5,
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: ACCENT_COLOR,
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    fontWeight: "600",
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    padding: HORIZONTAL_MARGIN,
    paddingTop: 20,
    zIndex: 1,
    marginTop: 0,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: ACCENT_COLOR,
  },
  countBadge: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: SECONDARY_COLOR,
  },
  ticketsList: {
    gap: 20,
  },
  ticketWrapper: {

  },
  ticketItemContainer: {
    // No margin needed since wrapper handles it
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  ticketNo: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_LIGHT,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  // Ticket grid styles
  ticket: {
    backgroundColor: DARK_BLUE,
    padding: TICKET_PADDING,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    color: DARK_BLUE,
  },
  emptyState: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 213, 79, 0.2)",
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: ACCENT_COLOR,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  refreshButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  glassEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },
  refreshButtonText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.2)",
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: LIGHT_ACCENT,
    lineHeight: 20,
    opacity: 0.9,
  },
  bottomSpace: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: DARK_BLUE,
    borderRadius: 20,
    padding: 0,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    backgroundColor: SECONDARY_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 213, 79, 0.3)',
  },
  modalTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: 'wrap',
  },
  ticketNumberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 213, 79, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.3)',
  },
  ticketNumberBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_LIGHT,
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.2)',
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  modalContent: {
    padding: 20,
  },
  gameCard: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.2)",
  },
  gameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: ACCENT_COLOR,
  },
  gameCardContent: {
    gap: 8,
  },
  gameNameText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_LIGHT,
    lineHeight: 20,
  },
  gameDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: 'wrap',
  },
  gameDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gameCodeText: {
    fontSize: 13,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    opacity: 0.9,
  },
  gameTimeText: {
    fontSize: 13,
    color: LIGHT_ACCENT,
    fontWeight: "500",
    opacity: 0.9,
  },
  fullTicketContainerModal: {
    marginBottom: 20,
  },
  ticketGridTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: ACCENT_COLOR,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTicketGrid: {
    marginBottom: 16,
  },
  modalActions: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 213, 79, 0.2)",
  },
  closeModalButton: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeModalButtonText: {
    color: SECONDARY_COLOR,
    fontSize: 15,
    fontWeight: "600",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default TicketsScreen;