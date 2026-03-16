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
  Animated,
  Easing,
  Platform,
  Linking,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Color scheme matching the Home component
const COLORS = {
  primary: "#4facfe", // Main blue color
  accent: "#FDB800", // Orange accent (changed to match Home)
  background: "#f5f8ff", // Light background
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  
  // Status colors
  live: "#4CAF50",
  scheduled: "#ff9800",
  completed: "#ff9800",
  
  // Quick action colors
  deposit: "#4facfe",
  withdraw: "#FF6B6B",
  refer: "#4ECDC4",
  support: "#9B59B6",
  
  // Additional colors for About section
  purple: "#9B59B6",
  purpleLight: "#F3E5F5",
  orange: "#FF9800",
  orangeLight: "#FFF3E0",
  teal: "#4ECDC4",
  tealLight: "#E0F2F1",
  pink: "#FF6B6B",
  pinkLight: "#FFE5E5",
};

const About = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  // Animation values for header letters
  const letterAnims = useRef([]);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initialize letter animations for header
    letterAnims.current = Array(15).fill().map(() => new Animated.Value(1));
    
    // Animate each letter with a popping effect (same as Home component)
    letterAnims.current.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 80), // Staggered animation
          Animated.timing(anim, {
            toValue: 1.4,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.bounce,
          }),
          Animated.delay(1800),
        ])
      ).start();
    });

    startAnimations();
    fetchNotifications();
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const startAnimations = () => {
    // Floating animations
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
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, []);

  const handleSupportPress = () => {
    Linking.openURL('mailto:support@tambolatimez.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://tambolatimez.com');
  };

  // Cartoon-style header with popping letters in a single line (matching Home component)
  const Header = () => {
    const letters = [
      { char: 'A', index: 0 },
      { char: 'B', index: 1, isSpecial: true },
      { char: 'O', index: 2 },
      { char: 'U', index: 3 },
      { char: 'T', index: 4 },
      { char: ' ', index: 5, isSpace: true, width: 20 }, // Wider space between words
      { char: 'U', index: 6 },
      { char: 'S', index: 7, isSpecial: true },
      { char: ' ', index: 8, isSpace: true, width: 20 }, // Wider space between words
     
    ];

    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.cartoonTitleRow}>
            {letters.map((item) => (
              <Animated.Text
                key={item.index}
                style={[
                  styles.cartoonLetter,
                  item.isSpecial && styles.specialCartoonLetter,
                  item.isSpace && { width: item.width || 20 }, // Dynamic width for space
                  { 
                    transform: [{ scale: letterAnims.current[item.index] || 1 }],
                    marginHorizontal: item.isSpace ? 0 : 2, // Small gap between non-space letters
                  }
                ]}
              >
                {item.char}
              </Animated.Text>
            ))}
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
      </View>
    );
  };

  const StatCard = ({ number, label, icon, color }) => {
    const floatValue = floatAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10]
    });

    return (
      <Animated.View 
        style={[
          styles.statCard,
          {
            transform: [{ translateY: floatValue }]
          }
        ]}
      >
        <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    );
  };

  const FeatureCard = ({ icon, title, description, color, index }) => {
    const scaleValue = floatAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02 + (index * 0.01)]
    });

    return (
      <Animated.View 
        style={[
          styles.featureCard,
          {
            transform: [{ scale: scaleValue }]
          }
        ]}
      >
        <View style={[styles.featureIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </Animated.View>
    );
  };

  const ValueCard = ({ icon, title, description, color }) => (
    <View style={styles.valueCard}>
      <View style={[styles.valueIconContainer, { backgroundColor: color + '15' }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.valueContent}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueDescription}>{description}</Text>
      </View>
    </View>
  );

  const TeamMember = ({ name, role, image, color }) => (
    <View style={styles.teamCard}>
      <View style={[styles.teamAvatar, { backgroundColor: color + '20' }]}>
        <Text style={styles.teamAvatarText}>{name.charAt(0)}</Text>
      </View>
      <Text style={styles.teamName}>{name}</Text>
      <Text style={styles.teamRole}>{role}</Text>
    </View>
  );

  const MilestoneItem = ({ year, title, description }) => (
    <View style={styles.milestoneItem}>
      <View style={styles.milestoneYearContainer}>
        <Text style={styles.milestoneYear}>{year}</Text>
      </View>
      <View style={styles.milestoneContent}>
        <Text style={styles.milestoneTitle}>{title}</Text>
        <Text style={styles.milestoneDescription}>{description}</Text>
      </View>
    </View>
  );

  if (loading) {
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
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.container}>
        {/* Header with cartoon-style popping letters in a single line - matching Home component */}
        <Header />

        {/* Animated Background Elements */}
        <Animated.View 
          style={[
            styles.backgroundCircle1,
            {
              transform: [
                { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
                { scale: pulseAnim }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle2,
            {
              transform: [
                { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle3,
            {
              transform: [
                { scale: pulseAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
              ]
            }
          ]} 
        />

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
          {/* Hero Section */}
          <Animated.View 
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Since 2020</Text>
              </View>
              <Text style={styles.heroTitle}>Houzie Timez</Text>
              <Text style={styles.heroSubtitle}>India's Most Trusted Tambola Platform</Text>
              <Text style={styles.heroDescription}>
                We're on a mission to revolutionize online Tambola gaming with transparency, 
                fairness, and exciting rewards for our players.
              </Text>
              
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>50K+</Text>
                  <Text style={styles.heroStatLabel}>Happy Players</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>100K+</Text>
                  <Text style={styles.heroStatLabel}>Games Played</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>₹2Cr+</Text>
                  <Text style={styles.heroStatLabel}>Winnings</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <StatCard number="24/7" label="Support Available" icon="headset" color={COLORS.primary} />
            <StatCard number="100%" label="Secure Platform" icon="shield-checkmark" color={COLORS.refer} />
            <StatCard number="10+" label="Game Modes" icon="game-controller" color={COLORS.purple} />
          </View>

          {/* Our Mission */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="flag" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>OUR MISSION</Text>
              </View>
            </View>

            <View style={styles.missionCard}>
              <View style={styles.missionPattern} />
              <Text style={styles.missionText}>
                To create a fair, transparent, and exciting Tambola gaming environment where 
                players can enjoy authentic gaming experience with instant withdrawals and 
                responsive support.
              </Text>
              
              <View style={styles.missionPoints}>
                <View style={styles.missionPoint}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.missionPointText}>Fair Play Guaranteed</Text>
                </View>
                <View style={styles.missionPoint}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.missionPointText}>Instant Withdrawals</Text>
                </View>
                <View style={styles.missionPoint}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.missionPointText}>24x7 Customer Support</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Key Features */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="star" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>KEY FEATURES</Text>
              </View>
            </View>

            <View style={styles.featuresGrid}>
              <FeatureCard 
                icon="flash"
                title="Instant Matchmaking"
                description="Join games instantly with players worldwide"
                color={COLORS.primary}
                index={0}
              />
              <FeatureCard 
                icon="layers"
                title="Multiple Modes"
                description="Classic, Speed, and Premium game modes"
                color={COLORS.purple}
                index={1}
              />
              <FeatureCard 
                icon="lock-closed"
                title="Secure Rooms"
                description="Private rooms with end-to-end encryption"
                color={COLORS.orange}
                index={2}
              />
              <FeatureCard 
                icon="trophy"
                title="Daily Rewards"
                description="Win exciting prizes and bonuses daily"
                color={COLORS.teal}
                index={3}
              />
            </View>
          </View>

          {/* Why Choose Us */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>WHY CHOOSE US</Text>
              </View>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyPattern} />
              
              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Licensed & Regulated Platform</Text>
                  <Text style={styles.whyText}>Fully compliant with gaming regulations</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.purple + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.purple} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Instant Payout System</Text>
                  <Text style={styles.whyText}>Withdraw winnings directly to your bank</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.orange + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.orange} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>24/7 Customer Support</Text>
                  <Text style={styles.whyText}>Always here to help you</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.teal + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.teal} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Certified RNG (Fair Play)</Text>
                  <Text style={styles.whyText}>100% unbiased game outcomes</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.pink + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.pink} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Multiple Payment Options</Text>
                  <Text style={styles.whyText}>UPI, Cards, Wallets & NetBanking</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.refer + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.refer} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Regular Tournaments</Text>
                  <Text style={styles.whyText}>Win big in special events</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Our Values */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="heart" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>OUR VALUES</Text>
              </View>
            </View>

            <View style={styles.valuesContainer}>
              <ValueCard 
                icon="security"
                title="Security First"
                description="Your data and transactions are protected with bank-level encryption"
                color={COLORS.primary}
              />
              <ValueCard 
                icon="balance"
                title="Fair Play"
                description="Certified random number generator ensures equal chance for all players"
                color={COLORS.purple}
              />
              <ValueCard 
                icon="support-agent"
                title="Player Support"
                description="Dedicated 24/7 support team to assist with any queries"
                color={COLORS.orange}
              />
              <ValueCard 
                icon="visibility"
                title="Transparency"
                description="Clear rules, open communication, and honest dealings"
                color={COLORS.teal}
              />
            </View>
          </View>

          {/* Milestones */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="trophy" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>OUR JOURNEY</Text>
              </View>
            </View>

            <View style={styles.milestonesCard}>
              <MilestoneItem 
                year="2020"
                title="The Beginning"
                description="Houzie Timez launched with a vision to revolutionize online Tambola"
              />
              <MilestoneItem 
                year="2021"
                title="10,000 Players"
                description="Reached 10,000 happy players milestone"
              />
              <MilestoneItem 
                year="2022"
                title="New Features"
                description="Launched multiple game modes and patterns"
              />
              <MilestoneItem 
                year="2023"
                title="50,000+ Players"
                description="Crossed 50,000 active player base"
              />
              <MilestoneItem 
                year="2024"
                title="₹2 Crore+ Winnings"
                description="Paid out over ₹2 Crore in winnings to players"
              />
            </View>
          </View>

          {/* Team Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="people" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>OUR TEAM</Text>
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.teamContainer}
            >
              <TeamMember name="Rajesh Kumar" role="Founder & CEO" color={COLORS.primary} />
              <TeamMember name="Priya Sharma" role="Head of Operations" color={COLORS.purple} />
              <TeamMember name="Amit Verma" role="Technical Lead" color={COLORS.orange} />
              <TeamMember name="Neha Gupta" role="Customer Support" color={COLORS.teal} />
            </ScrollView>
          </View>

          {/* Contact & Support */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="mail" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>GET IN TOUCH</Text>
              </View>
            </View>

            <View style={styles.contactCard}>
              <TouchableOpacity style={styles.contactItem} onPress={handleSupportPress}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="mail" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>support@tambolatimez.com</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <View style={styles.contactDivider} />

              <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('tel:+919876543210')}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.purple + '15' }]}>
                  <Ionicons name="call" size={20} color={COLORS.purple} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>+91 98765 43210</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <View style={styles.contactDivider} />

              <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.orange + '15' }]}>
                  <Ionicons name="globe" size={20} color={COLORS.orange} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Website</Text>
                  <Text style={styles.contactValue}>www.tambolatimez.com</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <View style={styles.contactDivider} />

              <View style={styles.contactItem}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.teal + '15' }]}>
                  <Ionicons name="time" size={20} color={COLORS.teal} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Support Hours</Text>
                  <Text style={styles.contactValue}>24/7</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.section}>
            <Text style={styles.socialTitle}>Follow Us</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}>
                <Ionicons name="logo-facebook" size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#1DA1F2' }]}>
                <Ionicons name="logo-twitter" size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#E4405F' }]}>
                <Ionicons name="logo-instagram" size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#FF0000' }]}>
                <Ionicons name="logo-youtube" size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#0A66C2' }]}>
                <Ionicons name="logo-linkedin" size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Houzie Timez. All rights reserved.
            </Text>
            <Text style={styles.footerSubtext}>
              Play Responsibly. Must be 18+ to participate.
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkDivider}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkDivider}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Responsible Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Notifications Modal */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              {loadingNotifications ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
              ) : (
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                      <View style={styles.notificationIcon}>
                        <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
                        <Text style={styles.notificationMessage}>
                          {item.message || "Check out the latest updates about Houzie Timez!"}
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
                      <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                  }
                />
              )}

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
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
  // Header styles matching Home component
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
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
    color: '#FDB800', // Changed to match Home's accent color
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    includeFontPadding: false,
    marginHorizontal: 2,
    // For Android
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
  
  // Background Elements
  backgroundCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary + '10',
    zIndex: 0,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: 200,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.purple + '08',
    zIndex: 0,
  },
  backgroundCircle3: {
    position: 'absolute',
    top: '50%',
    right: 20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.orange + '05',
    zIndex: 0,
  },

  // Hero Section
  heroSection: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  heroStatLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  heroStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
    zIndex: 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    zIndex: 2,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },

  // Mission Card
  missionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  missionPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary + '05',
    borderBottomLeftRadius: 50,
  },
  missionText: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  missionPoints: {
    gap: 10,
  },
  missionPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  missionPointText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 44) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 15,
  },

  // Why Card
  whyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  whyPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary + '05',
    borderTopRightRadius: 50,
  },
  whyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whyContent: {
    flex: 1,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  whyText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Values Container
  valuesContainer: {
    gap: 12,
  },
  valueCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  valueDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },

  // Milestones
  milestonesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  milestoneYearContainer: {
    width: 60,
    height: 30,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneYear: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  milestoneDescription: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Team
  teamContainer: {
    gap: 12,
    paddingRight: 16,
  },
  teamCard: {
    width: 110,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Contact Card
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  contactDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // Social Links
  socialTitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: 'center',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Footer
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: COLORS.primary,
  },
  footerLinkDivider: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bottomSpace: {
    height: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
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
    color: COLORS.textDark,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default About;