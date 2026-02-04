import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import icons from react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const HostGame = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGames();
    
    // Add focus listener to refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HostGame screen focused, refreshing data...');
      fetchGames();
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterGames();
  }, [games, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("hostToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "https://tambolatime.co.in/public/api/host/games",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const gamesData = response.data.games.data || [];
        setGames(gamesData);
        setFilteredGames(gamesData);
        setError(null);
        console.log(`Loaded ${gamesData.length} games`);
      } else {
        throw new Error("Failed to fetch games");
      }
    } catch (error) {
      console.log("Error fetching games:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to load games"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    if (searchQuery.trim() === "") {
      setFilteredGames(games);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = games.filter(
      (game) =>
        game.game_name.toLowerCase().includes(query) ||
        game.game_code.toLowerCase().includes(query)
    );
    
    setFilteredGames(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return "calendar-clock";
      case "active":
        return "play-circle";
      case "completed":
        return "check-circle";
      case "cancelled":
        return "cancel";
      case "live":
        return "broadcast";
      default:
        return "help-circle";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "#FF9800";
      case "active":
        return "#4CAF50";
      case "completed":
        return "#9C27B0";
      case "cancelled":
        return "#F44336";
      case "live":
        return "#FF7675";
      default:
        return "#607D8B";
    }
  };

  const handleGameCardPress = (game) => {
    navigation.navigate("HostGameOptions", {
      gameId: game.id,
      gameName: game.game_name,
      gameStatus: game.status,
    });
  };

  const renderGameCard = (game) => {
    const gameDate = new Date(game.game_date);
    const formattedDate = gameDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const time = game.game_start_time.substring(0, 5);

    return (
      <TouchableOpacity
        key={game.id}
        style={styles.gameCard}
        onPress={() => handleGameCardPress(game)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.gameTitleContainer}>
            <MaterialCommunityIcons
              name={getStatusIcon(game.status)}
              size={22}
              color={getStatusColor(game.status)}
              style={styles.statusIcon}
            />
            <View style={styles.titleWrapper}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.game_name}
              </Text>
              <Text style={styles.gameCode}>#{game.game_code}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(game.status) + "15" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(game.status) },
              ]}
            >
              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{formattedDate}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{game.max_players} players</Text>
            </View>

            <View style={styles.detailItem}>
              {game.ticket_type === "paid" ? (
                <>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>₹{game.ticket_cost}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="gift-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Free</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            <Ionicons name="ticket-outline" size={14} color="#666" />
            <Text style={styles.footerText}>{game.max_tickets} tickets</Text>
            {game.selected_patterns?.length > 0 && (
              <View style={styles.patternsInline}>
                <Ionicons name="layers-outline" size={14} color="#7E57C2" />
                <Text style={styles.patternsInlineText}>
                  {game.selected_patterns.length}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.viewDetails}>
            <Text style={styles.viewDetailsText}>View Options</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF7675" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7675" />
        <Text style={styles.loadingText}>Loading your games...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={80} color="#F44336" />
          <Text style={styles.errorTitle}>Unable to Load Games</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchGames}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FF7675" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tambola Games</Text>
          <Text style={styles.headerSubtitle}>
            {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} shown
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchGames}>
            <Ionicons name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games by name or code..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.fabPrimary}
        onPress={() => navigation.navigate("HostGameCreation")}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF7675"
            colors={["#FF7675"]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {filteredGames.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <Ionicons name="calendar-outline" size={24} color="#FF7675" />
              <Text style={styles.statsCount}>{filteredGames.length}</Text>
              <Text style={styles.statsLabel}>Total Games</Text>
            </View>

            <View style={styles.statsCard}>
              <Ionicons name="play-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.statsCount}>
                {filteredGames.filter((g) => g.status === "active" || g.status === "live").length}
              </Text>
              <Text style={styles.statsLabel}>Active/Live</Text>
            </View>

            <View style={styles.statsCard}>
              <Ionicons name="time-outline" size={24} color="#FF9800" />
              <Text style={styles.statsCount}>
                {filteredGames.filter((g) => g.status === "scheduled").length}
              </Text>
              <Text style={styles.statsLabel}>Scheduled</Text>
            </View>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Your Games</Text>
          <TouchableOpacity
            style={styles.patternsButton}
            onPress={() => navigation.navigate("HostGamePatterns")}
          >
            <Ionicons name="grid-outline" size={16} color="#FF7675" />
            <Text style={styles.patternsButtonText}>Patterns</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gamesContainer}>
          {filteredGames.length > 0 ? (
            <>
              {filteredGames.map(renderGameCard)}
              <View style={styles.listFooter}>
                <Ionicons name="checkmark-done" size={18} color="#9CA3AF" />
                <Text style={styles.listFooterText}>
                  {searchQuery ? `Found ${filteredGames.length} games` : "All games loaded"}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIllustration}>
                <Ionicons
                  name={searchQuery ? "search-outline" : "game-controller-outline"}
                  size={80}
                  color="#D1D5DB"
                />
                <View style={styles.emptyDot} />
                <View style={[styles.emptyDot, styles.emptyDot2]} />
                <View style={[styles.emptyDot, styles.emptyDot3]} />
              </View>
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? "No Games Found" : "No Games Yet"}
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery 
                  ? `No games found matching "${searchQuery}"`
                  : "Create your first tambola game and start hosting exciting matches"
                }
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    navigation.navigate("HostGameCreation");
                  }
                }}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={searchQuery ? "refresh" : "add-circle"} 
                  size={18} 
                  color="#FFF" 
                />
                <Text style={styles.emptyStateButtonText}>
                  {searchQuery ? "Clear Search" : "Create First Game"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "#FF7675",
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  headerActions: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  fabPrimary: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF7675",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsCount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    marginTop: 8,
  },
  statsLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginTop: 4,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  patternsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEDED",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  patternsButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF7675",
  },
  gameCard: {
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  gameTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIcon: {
    marginRight: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  gameCode: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    color: "#666",
  },
  patternsInline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  patternsInlineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7E57C2",
  },
  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF7675",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyIllustration: {
    position: "relative",
    marginBottom: 24,
  },
  emptyDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  emptyDot2: {
    top: 10,
    right: 10,
  },
  emptyDot3: {
    bottom: 10,
    left: 10,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    maxWidth: 300,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7675",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#FF7675",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  listFooterText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 40,
  },
  errorContent: {
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginTop: 24,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 300,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7675",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#FF7675",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  gamesContainer: {
    marginBottom: 40,
  },
});

export default HostGame;