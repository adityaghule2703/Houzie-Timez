import React, { useState, useEffect, useMemo } from 'react';
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
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const TICKET_WIDTH = Math.min(width, height) - 100;
const CELL_SIZE = (TICKET_WIDTH - 60) / 9;

// Updated Color scheme matching Home page
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";
const SUCCESS_COLOR = "#4CAF50";
const WARNING_COLOR = "#ff9800";
const ERROR_COLOR = "#f44336";

const UserGamePatterns = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patterns, setPatterns] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredPatterns, setFilteredPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);

  const filters = [
    { id: 'all', label: 'All Patterns' },
    { id: 'position_based', label: 'Position Based' },
    { id: 'count_based', label: 'Count Based' },
    { id: 'all_numbers', label: 'All Numbers' },
    { id: 'row_complete', label: 'Row Complete' },
    { id: 'number_based', label: 'Number Based' },
    { id: 'number_range', label: 'Number Range' },
    { id: 'unknown', label: 'Other Patterns' },
  ];

  useEffect(() => {
    fetchPatterns();
  }, []);

  useEffect(() => {
    // Filter patterns whenever patterns or filter changes
    const filterPatterns = () => {
      let filtered = [...patterns];
      
      if (selectedFilter !== 'all') {
        filtered = filtered.filter(pattern => {
          if (!pattern) return false;
          
          if (selectedFilter === 'unknown') {
            const logicType = getPatternLogicType(pattern);
            return logicType === 'unknown' || !logicType;
          }
          
          const logicType = getPatternLogicType(pattern);
          return logicType === selectedFilter;
        });
      }
      
      setFilteredPatterns(filtered);
    };

    filterPatterns();
  }, [patterns, selectedFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPatterns();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken') || await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        'https://tambolatime.co.in/public/api/user/patterns/available',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data && response.data.status) {
        const patternsData = response.data.data?.patterns || [];
        // Sort patterns by sequence
        const sortedPatterns = sortPatternsBySequence(patternsData);
        setPatterns(sortedPatterns);
        setError(null);
      } else {
        throw new Error('Failed to fetch patterns');
      }
    } catch (error) {
      console.log('Error fetching patterns:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load patterns');
    } finally {
      setLoading(false);
    }
  };

  // Sort patterns by specific sequence
  const sortPatternsBySequence = (patternsData) => {
    const patternSequence = [
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

    const getPatternIndex = (pattern) => {
      const patternName = (pattern.display_name || pattern.pattern_name || '').toLowerCase();
      
      for (let i = 0; i < patternSequence.length; i++) {
        if (patternSequence[i].keywords.some(keyword => patternName.includes(keyword))) {
          return i;
        }
      }
      return patternSequence.length; // Put unknown patterns at the end
    };

    return [...patternsData].sort((a, b) => {
      const aIndex = getPatternIndex(a);
      const bIndex = getPatternIndex(b);
      return aIndex - bIndex;
    });
  };

  // Generate valid tambola ticket with exactly 5 numbers per row
  const generateValidTicketNumbers = useMemo(() => {
    return () => {
      const ticket = Array(3).fill().map(() => Array(9).fill(null));
      const numbersUsed = new Set();
      const numbersByColumn = Array(9).fill().map(() => []);
      
      // Generate numbers for each column (1-3 numbers per column)
      for (let col = 0; col < 9; col++) {
        const min = col === 0 ? 1 : col * 10 + 1;
        const max = col === 8 ? 90 : (col + 1) * 10;
        const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 numbers per column
        
        while (numbersByColumn[col].length < count) {
          const num = Math.floor(Math.random() * (max - min + 1)) + min;
          if (!numbersUsed.has(num)) {
            numbersByColumn[col].push(num);
            numbersUsed.add(num);
          }
        }
        numbersByColumn[col].sort((a, b) => a - b);
      }
      
      // Adjust to ensure exactly 15 numbers total
      let totalNumbers = numbersByColumn.reduce((sum, col) => sum + col.length, 0);
      
      // Add numbers if less than 15
      while (totalNumbers < 15) {
        const col = Math.floor(Math.random() * 9);
        if (numbersByColumn[col].length < 3) {
          const min = col === 0 ? 1 : col * 10 + 1;
          const max = col === 8 ? 90 : (col + 1) * 10;
          const num = Math.floor(Math.random() * (max - min + 1)) + min;
          if (!numbersUsed.has(num)) {
            numbersByColumn[col].push(num);
            numbersUsed.add(num);
            numbersByColumn[col].sort((a, b) => a - b);
            totalNumbers++;
          }
        }
      }
      
      // Remove numbers if more than 15
      while (totalNumbers > 15) {
        const col = Math.floor(Math.random() * 9);
        if (numbersByColumn[col].length > 1) {
          const removed = numbersByColumn[col].pop();
          numbersUsed.delete(removed);
          totalNumbers--;
        }
      }
      
      // Place numbers in rows ensuring exactly 5 numbers per row
      const rowCounts = [0, 0, 0];
      
      // First, distribute numbers randomly
      for (let col = 0; col < 9; col++) {
        for (let num of numbersByColumn[col]) {
          // Find available rows for this column
          const availableRows = [];
          for (let row = 0; row < 3; row++) {
            if (ticket[row][col] === null && rowCounts[row] < 5) {
              availableRows.push(row);
            }
          }
          
          if (availableRows.length > 0) {
            const randomRow = availableRows[Math.floor(Math.random() * availableRows.length)];
            ticket[randomRow][col] = num;
            rowCounts[randomRow]++;
          }
        }
      }
      
      // Adjust to ensure exactly 5 numbers per row
      for (let row = 0; row < 3; row++) {
        while (rowCounts[row] < 5) {
          // Find a column with less than 3 numbers and this row is empty
          for (let col = 0; col < 9; col++) {
            if (ticket[row][col] === null) {
              const columnCount = ticket.reduce((sum, r) => sum + (r[col] !== null ? 1 : 0), 0);
              if (columnCount < 3) {
                // Add a new number
                const min = col === 0 ? 1 : col * 10 + 1;
                const max = col === 8 ? 90 : (col + 1) * 10;
                let newNum;
                do {
                  newNum = Math.floor(Math.random() * (max - min + 1)) + min;
                } while (numbersUsed.has(newNum));
                
                ticket[row][col] = newNum;
                numbersUsed.add(newNum);
                rowCounts[row]++;
                break;
              }
            }
          }
        }
        
        while (rowCounts[row] > 5) {
          // Move a number to another row
          for (let col = 0; col < 9; col++) {
            if (ticket[row][col] !== null) {
              // Find another row that needs this number
              for (let otherRow = 0; otherRow < 3; otherRow++) {
                if (otherRow !== row && rowCounts[otherRow] < 5 && ticket[otherRow][col] === null) {
                  ticket[otherRow][col] = ticket[row][col];
                  ticket[row][col] = null;
                  rowCounts[row]--;
                  rowCounts[otherRow]++;
                  break;
                }
              }
              if (rowCounts[row] <= 5) break;
            }
          }
        }
      }
      
      return ticket;
    };
  }, []);

  // Generate or retrieve ticket for a specific pattern
  const generateTicketForPattern = useMemo(() => {
    const ticketCache = new Map();
    
    return (pattern) => {
      const cacheKey = pattern.id;
      
      if (ticketCache.has(cacheKey)) {
        return ticketCache.get(cacheKey);
      }
      
      let ticket = generateValidTicketNumbers();
      ticketCache.set(cacheKey, ticket);
      return ticket;
    };
  }, [generateValidTicketNumbers]);

  // Get pattern positions relative to actual numbers in each row
  const getPatternPositionsForTicket = (ticket, pattern) => {
    const positions = pattern.positions || pattern.pattern_logic?.rules?.positions || [];
    if (!positions || positions.length === 0) {
      return null;
    }
    
    const patternGrid = Array(3).fill().map(() => Array(9).fill(false));
    
    positions.forEach(pos => {
      const row = pos.row - 1;
      const patternPosition = pos.position;
      
      if (row >= 0 && row < 3) {
        let numberCount = 0;
        for (let col = 0; col < 9; col++) {
          if (ticket[row][col] !== null) {
            numberCount++;
            if (numberCount === patternPosition) {
              patternGrid[row][col] = true;
              break;
            }
          }
        }
      }
    });
    
    return patternGrid;
  };

  const getPatternLogicType = (pattern) => {
    return pattern.pattern_logic?.logic_type || pattern.logic_type || 'unknown';
  };

  const getPatternPositions = (pattern) => {
    return pattern.positions || pattern.pattern_logic?.rules?.positions || [];
  };

  const isPositionBasedPattern = (pattern) => {
    const logicType = getPatternLogicType(pattern);
    return logicType === 'position_based' || pattern.is_position_based;
  };

  // Updated function with all 11 specific Tambola patterns
  const getPatternIcon = (pattern) => {
    const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
    // Bamboo pattern
    if (patternName.includes('bamboo')) {
      return 'leaf'; // Changed to match Home page
    }
    
    // Bottom Line pattern
    if (patternName.includes('bottom line')) {
      return 'arrow-down'; // Changed to match Home page
    }
    
    // Breakfast pattern
    if (patternName.includes('breakfast')) {
      return 'cafe'; // Changed to match Home page
    }
    
    // Dinner pattern
    if (patternName.includes('dinner')) {
      return 'restaurant'; // Changed to match Home page
    }
    
    // Early Five pattern
    if (patternName.includes('early five') || patternName.includes('early 5')) {
      return 'numeric-5-circle'; // Changed to match Home page style
    }
    
    // Four Corners pattern
    if (patternName.includes('four corners') || patternName.includes('4 corners')) {
      return 'apps'; // Changed to match Home page
    }
    
    // Full House pattern
    if (patternName.includes('full house')) {
      return 'home'; // Matches Home page
    }
    
    // Lunch pattern
    if (patternName.includes('lunch')) {
      return 'food'; // Changed to match Home page style
    }
    
    // Middle Line pattern
    if (patternName.includes('middle line')) {
      return 'arrow-left-right'; // Changed to match Home page style
    }
    
    // Non Claimer pattern
    if (patternName.includes('non claimer')) {
      return 'close-circle'; // Changed to match Home page style
    }
    
    // Top Line pattern
    if (patternName.includes('top line')) {
      return 'arrow-up'; // Changed to match Home page
    }
    
    // Default based on logic type
    const logicType = getPatternLogicType(pattern);
    switch (logicType) {
      case 'position_based':
        return 'grid';
      case 'count_based':
        return 'counter';
      case 'all_numbers':
        return 'check-all';
      case 'row_complete':
        return 'format-line-weight';
      case 'number_based':
        return 'calculator';
      case 'number_range':
        return 'filter';
      default:
        return 'ticket-confirmation';
    }
  };

  const getPatternColor = () => {
    return ACCENT_COLOR; // Use accent color for consistency
  };

  const formatPatternName = (name) => {
    if (!name) return 'Unknown Pattern';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatLogicType = (type) => {
    if (!type || type === 'unknown') return 'Pattern';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderPatternCard = (pattern) => {
    if (!pattern) return null;
    
    const isPositionBased = isPositionBasedPattern(pattern);
    const icon = getPatternIcon(pattern);
    const color = getPatternColor();
    const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
    return (
      <TouchableOpacity
        key={pattern.id}
        style={[
          styles.patternCard,
          selectedPattern?.id === pattern.id && styles.selectedPatternCard,
        ]}
        onPress={() => {
          setSelectedPattern(pattern);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.patternHeader}>
          <View style={[styles.patternIcon, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon} size={26} color={color} />
          </View>
          <View style={styles.patternInfo}>
            <View style={styles.patternNameRow}>
              <Text style={styles.patternName} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
            <View style={styles.patternMeta}>
              <View style={[
                styles.typeBadge,
                { backgroundColor: color + '20' }
              ]}>
                <Text style={[
                  styles.typeText,
                  { color: color }
                ]}>
                  {formatLogicType(getPatternLogicType(pattern))}
                </Text>
              </View>
              {isPositionBased && getPatternPositions(pattern).length > 0 && (
                <View style={styles.positionsBadge}>
                  <MaterialCommunityIcons name="grid" size={12} color={TEXT_LIGHT} />
                  <Text style={styles.positionsText}>
                    {getPatternPositions(pattern).length} positions
                  </Text>
                </View>
              )}
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={TEXT_LIGHT} />
        </View>
        
        <Text style={styles.patternDescription} numberOfLines={2}>
          {pattern.description}
        </Text>
        
        {isPositionBased && getPatternPositions(pattern).length > 0 && (
          <View style={styles.miniTicketContainer}>
            <MiniTicketGrid pattern={pattern} />
            <View style={styles.positionExplanation}>
              <Text style={styles.positionExplanationText}>
                Positions are relative to actual numbers in each row
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const MiniTicketGrid = ({ pattern }) => {
    const ticketNumbers = useMemo(() => generateTicketForPattern(pattern), [pattern, generateTicketForPattern]);
    const patternGrid = useMemo(() => 
      isPositionBasedPattern(pattern) ? getPatternPositionsForTicket(ticketNumbers, pattern) : null, 
      [pattern, ticketNumbers]
    );
    
    return (
      <View style={styles.miniTicket}>
        {ticketNumbers.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.miniRow}>
            {row.map((cell, colIndex) => (
              <View 
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.miniCell,
                  cell !== null && styles.miniCellWithNumber,
                  patternGrid && patternGrid[rowIndex] && patternGrid[rowIndex][colIndex] && styles.miniCellPattern,
                ]}
              >
                {cell !== null && (
                  <Text style={[
                    styles.miniCellNumber,
                    patternGrid && patternGrid[rowIndex] && patternGrid[rowIndex][colIndex] && styles.miniCellNumberPattern,
                  ]}>
                    {cell}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const FullTicketGrid = ({ pattern }) => {
    const ticketNumbers = useMemo(() => generateTicketForPattern(pattern), [pattern, generateTicketForPattern]);
    const patternGrid = useMemo(() => 
      isPositionBasedPattern(pattern) ? getPatternPositionsForTicket(ticketNumbers, pattern) : null, 
      [pattern, ticketNumbers]
    );
    
    return (
      <View style={styles.fullTicketContainer}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>
            Pattern Visualization
          </Text>
        </View>
        
        <Text style={styles.ticketSubtitle}>
          Positions are highlighted relative to actual numbers in each row
        </Text>
        
        <View style={styles.fullTicket}>
          {ticketNumbers.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.fullRow}>
              {row.map((cell, colIndex) => (
                <View 
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.fullCell,
                    cell !== null && styles.fullCellWithNumber,
                    patternGrid && patternGrid[rowIndex] && patternGrid[rowIndex][colIndex] && styles.fullCellPattern,
                  ]}
                >
                  {cell !== null && (
                    <>
                      <Text style={[
                        styles.fullCellNumber,
                        patternGrid && patternGrid[rowIndex] && patternGrid[rowIndex][colIndex] && styles.fullCellNumberPattern,
                      ]}>
                        {cell}
                      </Text>
                      {patternGrid && patternGrid[rowIndex] && patternGrid[rowIndex][colIndex] && (
                        <View style={styles.positionIndicator}>
                          <Text style={styles.positionIndicatorText}>
                            {getPositionNumber(ticketNumbers[rowIndex], colIndex)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.positionExplanation}>
          <Text style={styles.positionExplanationText}>
            Example: "Position 3" in Row 2 means the 3rd actual number from left in that row
          </Text>
        </View>
        
        <View style={styles.ticketLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendColorPattern]} />
            <Text style={styles.legendText}>Pattern Position</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendColorNormal]} />
            <Text style={styles.legendText}>Normal Number</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendColorEmpty]} />
            <Text style={styles.legendText}>Empty Cell</Text>
          </View>
        </View>
      </View>
    );
  };

  // Helper to get position number (1-5) for a column in a row
  const getPositionNumber = (row, column) => {
    let position = 0;
    for (let col = 0; col <= column; col++) {
      if (row[col] !== null) {
        position++;
      }
    }
    return position;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading patterns...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <MaterialCommunityIcons name="alert-circle-outline" size={60} color={ERROR_COLOR} />
          <Text style={styles.errorTitle}>Patterns Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPatterns}>
            <MaterialCommunityIcons name="refresh" size={16} color={WHITE} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={WHITE} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tambola Patterns</Text>
          <Text style={styles.headerSubtitle}>Explore all available patterns</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY_COLOR} />
        }
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredPatterns.length} {filteredPatterns.length === 1 ? 'pattern' : 'patterns'} found
          </Text>
          {selectedFilter !== 'all' && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSelectedFilter('all')}
            >
              <MaterialCommunityIcons name="close-circle" size={16} color={ACCENT_COLOR} />
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.patternsContainer}>
          {filteredPatterns.length > 0 ? (
            filteredPatterns.map(renderPatternCard)
          ) : patterns.length > 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="search-outline" size={60} color={TEXT_LIGHT} />
              <Text style={styles.emptyStateTitle}>No Patterns Found</Text>
              <Text style={styles.emptyStateText}>
                Try changing the filter
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="grid-outline" size={60} color={TEXT_LIGHT} />
              <Text style={styles.emptyStateTitle}>No Patterns Available</Text>
              <Text style={styles.emptyStateText}>
                Patterns will be available when games start
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            {selectedPattern && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View style={styles.modalTitleRow}>
                      <View style={[
                        styles.modalIcon,
                        { backgroundColor: ACCENT_COLOR + '20' }
                      ]}>
                        <MaterialCommunityIcons 
                          name={getPatternIcon(selectedPattern)} 
                          size={24} 
                          color={ACCENT_COLOR} 
                        />
                      </View>
                      <Text style={styles.modalTitle} numberOfLines={2}>
                        {selectedPattern.display_name || formatPatternName(selectedPattern.pattern_name)}
                      </Text>
                    </View>
                    <View style={styles.modalMetaRow}>
                      <View style={[
                        styles.modalTypeBadge,
                        { backgroundColor: ACCENT_COLOR + '20' }
                      ]}>
                        <Text style={[
                          styles.modalTypeText,
                          { color: ACCENT_COLOR }
                        ]}>
                          {formatLogicType(getPatternLogicType(selectedPattern))}
                        </Text>
                      </View>
                      {selectedPattern.popular_rank && (
                        <View style={styles.popularityBadge}>
                          <FontAwesome name="star" size={12} color={ACCENT_COLOR} />
                          <Text style={styles.popularityText}>
                            {selectedPattern.popular_rank}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color={TEXT_LIGHT} />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  <View style={styles.descriptionSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {selectedPattern.description}
                    </Text>
                  </View>

                  {selectedPattern.example && (
                    <View style={styles.exampleSection}>
                      <Text style={styles.sectionTitle}>Example</Text>
                      <Text style={styles.exampleText}>
                        {selectedPattern.example}
                      </Text>
                    </View>
                  )}

                  {selectedPattern.how_to_win && (
                    <View style={styles.winSection}>
                      <Text style={styles.sectionTitle}>How to Win</Text>
                      <Text style={styles.winText}>
                        {selectedPattern.how_to_win}
                      </Text>
                    </View>
                  )}

                  {isPositionBasedPattern(selectedPattern) && getPatternPositions(selectedPattern).length > 0 && (
                    <>
                      <View style={styles.positionsSection}>
                        <FullTicketGrid pattern={selectedPattern} />
                      </View>
                      
                      <View style={styles.positionsList}>
                        <Text style={styles.sectionTitle}>Pattern Positions</Text>
                        {getPatternPositions(selectedPattern).map((pos, index) => (
                          <View key={index} style={styles.positionItem}>
                            <View style={[styles.positionBadge, { backgroundColor: ACCENT_COLOR }]}>
                              <Text style={styles.positionBadgeText}>
                                {pos.row}-{pos.position}
                              </Text>
                            </View>
                            <Text style={styles.positionText}>
                              Row {pos.row}, Position {pos.position} (from left)
                            </Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                  {!isPositionBasedPattern(selectedPattern) && (
                    <View style={styles.infoCard}>
                      <View style={styles.infoHeader}>
                        <MaterialCommunityIcons name="information" size={20} color={ACCENT_COLOR} />
                        <Text style={styles.infoTitle}>How it works</Text>
                      </View>
                      <Text style={styles.infoText}>
                        This pattern is based on {formatLogicType(getPatternLogicType(selectedPattern)).toLowerCase()} logic.
                        {getPatternLogicType(selectedPattern) === 'number_range' && selectedPattern.pattern_logic?.rules && (
                          <Text>
                            {' '}Numbers from {selectedPattern.pattern_logic.rules.min} to {selectedPattern.pattern_logic.rules.max}.
                          </Text>
                        )}
                        {getPatternLogicType(selectedPattern) === 'row_complete' && selectedPattern.pattern_logic?.rules && (
                          <Text>
                            {' '}Complete row {selectedPattern.pattern_logic.rules.row_number}.
                          </Text>
                        )}
                        {getPatternLogicType(selectedPattern) === 'count_based' && selectedPattern.pattern_logic?.rules && (
                          <Text>
                            {' '}First {selectedPattern.pattern_logic.rules.count} numbers.
                          </Text>
                        )}
                        {getPatternLogicType(selectedPattern) === 'all_numbers' && (
                          <Text> All 15 numbers on your ticket.</Text>
                        )}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.modalBottomSpace} />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.closeModalButton}
                    onPress={() => setModalVisible(false)}
                  >
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
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: TEXT_LIGHT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    padding: 30,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  retryButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: WHITE,
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  filtersContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginRight: 0,
  },
  filterButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  filterButtonTextActive: {
    color: WHITE,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_LIGHT,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  patternsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  patternCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPatternCard: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    backgroundColor: WHITE,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patternIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  patternInfo: {
    flex: 1,
  },
  patternNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
    marginRight: 10,
  },
  patternMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  positionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  positionsText: {
    fontSize: 10,
    color: TEXT_LIGHT,
  },
  patternDescription: {
    fontSize: 14,
    color: TEXT_LIGHT,
    lineHeight: 20,
    marginBottom: 12,
  },
  miniTicketContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  miniTicket: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: BACKGROUND_COLOR,
    width: '100%',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  miniRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'center',
  },
  miniCell: {
    width: 28,
    height: 28,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  miniCellWithNumber: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  miniCellPattern: {
    backgroundColor: ACCENT_COLOR + '20',
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  miniCellNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  miniCellNumberPattern: {
    color: ACCENT_COLOR,
    fontWeight: '800',
  },
  positionExplanation: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  positionExplanationText: {
    fontSize: 11,
    color: TEXT_LIGHT,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: WHITE,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    minHeight: '50%',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    flex: 1,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  modalTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  modalTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  popularityBadge: {
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
  popularityText: {
    fontSize: 11,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 15,
    color: TEXT_LIGHT,
    lineHeight: 22,
  },
  exampleSection: {
    marginBottom: 20,
    backgroundColor: BACKGROUND_COLOR,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  exampleText: {
    fontSize: 14,
    color: TEXT_DARK,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  winSection: {
    marginBottom: 20,
    backgroundColor: BACKGROUND_COLOR,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: SUCCESS_COLOR,
  },
  winText: {
    fontSize: 14,
    color: TEXT_DARK,
    fontWeight: '500',
    lineHeight: 20,
  },
  positionsSection: {
    marginBottom: 20,
  },
  fullTicketContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
  },
  ticketSubtitle: {
    fontSize: 13,
    color: TEXT_LIGHT,
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
  fullTicket: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: WHITE,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    width: TICKET_WIDTH,
    alignSelf: 'center',
  },
  fullRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  fullCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: BACKGROUND_COLOR,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  fullCellWithNumber: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  fullCellPattern: {
    backgroundColor: ACCENT_COLOR + '20',
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  fullCellNumber: {
    fontSize: CELL_SIZE * 0.3,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  fullCellNumberPattern: {
    color: ACCENT_COLOR,
    fontWeight: '800',
  },
  positionIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 6,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionIndicatorText: {
    fontSize: 8,
    fontWeight: '800',
    color: WHITE,
  },
  positionsList: {
    marginBottom: 20,
  },
  positionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  positionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  positionBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  positionText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    flex: 1,
  },
  ticketLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 8,
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  legendColorPattern: {
    backgroundColor: ACCENT_COLOR + '20',
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  legendColorNormal: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  legendColorEmpty: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  legendText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    lineHeight: 20,
    marginBottom: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    padding: 16,
    gap: 12,
  },
  closeModalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
  },
  modalBottomSpace: {
    height: 20,
  },
});

export default UserGamePatterns;