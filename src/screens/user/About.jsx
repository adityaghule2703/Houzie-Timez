import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

// Color palette matching Game component
const COLORS = {
  background: '#F0F7FF',
  surface: '#FFFFFF',
  primary: '#2E5BFF', // Vibrant blue
  primaryLight: '#E1EBFF',
  primaryDark: '#1A3A9E',
  accent: '#3B82F6', // Medium blue for accents
  secondary: '#60A5FA', // Light blue
  tertiary: '#2563EB', // Darker blue for contrast
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  
  // Card background variants
  cardBlue1: '#E8F0FE',
  cardBlue2: '#D4E4FF',
  cardBlue3: '#C2D6FF',
  cardBlue4: '#E3F2FD',
  cardBlue5: '#E6F0FA',
  
  // Accent colors
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  orange: '#F97316',
  orangeLight: '#FFF3E6',
  pink: '#EC4899',
  pinkLight: '#FCE8F0',
  teal: '#14B8A6',
  tealLight: '#D5F5F0',
  
  // Block colors - Blue shades
  blockLightBlue: '#E1EBFF',
  blockMediumBlue: '#C2D6FF',
  blockDarkBlue: '#A3C1FF',
};

const About = () => {
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Animated background that moves with scroll
  const AnimatedBackground = () => {
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

  // Card Background with only circles (no patterns)
  const CardBackground = ({ accentColor = COLORS.primary }) => (
    <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
      {/* Decorative circles only */}
      <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
      <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
      <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
      {/* Floating particles - subtle dots */}
      <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
      <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
      <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
      <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
    </View>
  );

  // Enhanced Header with UK pattern (keeping header pattern)
  const Header = () => (
    <View style={styles.headerWrapper}>
      {/* Semicircle Background */}
      <View style={styles.semicircleBackground}>
        <View style={styles.semicircle} />
      </View>
      
      {/* UK-style Rounded Lines Pattern (only in header) */}
      <View style={styles.ukPatternContainer}>
        <View style={styles.curvedLine1} />
        <View style={styles.curvedLine2} />
        <View style={styles.curvedLine3} />
        
        <View style={styles.parallelLines}>
          <View style={styles.parallelLine} />
          <View style={styles.parallelLine} />
          <View style={styles.parallelLine} />
        </View>
        
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
        
        <View style={styles.decorativeDot1} />
        <View style={styles.decorativeDot2} />
        <View style={styles.decorativeLine1} />
        <View style={styles.decorativeLine2} />
      </View>

      {/* Header Content */}
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>
            Tambola <Text style={styles.titleBold}>Timez</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.headerBadgeText}>Premium</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Different accent colors for cards
  const accentColors = [COLORS.primary, COLORS.purple, COLORS.orange, COLORS.pink, COLORS.teal];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Animated Color Blocks */}
      <AnimatedBackground />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header */}
        <Header />

        {/* BANNER CARD */}
        <View style={styles.section}>
          <View style={styles.bannerCard}>
            <CardBackground accentColor={COLORS.primary} />
            
            <View style={styles.bannerContent}>
              <View style={[styles.bannerIconContainer, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="game-controller" size={48} color={COLORS.primary} />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Premium Tambola Platform</Text>
                <Text style={styles.bannerText}>
                  Experience professional gaming with fair play, instant payouts, and seamless user experience.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* OUR MISSION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.missionCard}>
            <CardBackground accentColor={COLORS.purple} />
            
            {[
              { icon: 'target', text: 'Deliver fast & fair Tambola games', color: COLORS.primary },
              { icon: 'users', text: 'Connect real players globally', color: COLORS.purple },
              { icon: 'gift', text: 'Provide exciting rewards daily', color: COLORS.orange },
              { icon: 'shield-alt', text: 'Ensure safe & secure gaming', color: COLORS.teal },
            ].map((item, index) => (
              <View key={index} style={styles.missionItem}>
                <View style={[styles.missionIcon, { backgroundColor: `${item.color}15` }]}>
                  <FontAwesome5 name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={styles.missionText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* KEY FEATURES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {[
              {
                icon: 'flash',
                title: 'Instant Matchmaking',
                description: 'Join games instantly with players worldwide',
                color: COLORS.primary,
              },
              {
                icon: 'layers',
                title: 'Multiple Modes',
                description: 'Classic, Speed, and Premium game modes',
                color: COLORS.purple,
              },
              {
                icon: 'lock-closed',
                title: 'Secure Rooms',
                description: 'Private rooms with end-to-end encryption',
                color: COLORS.orange,
              },
              {
                icon: 'trophy',
                title: 'Daily Rewards',
                description: 'Win exciting prizes and bonuses daily',
                color: COLORS.teal,
              },
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <CardBackground accentColor={feature.color} />
                
                <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon} size={28} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* WHY CHOOSE US */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.whyCard}>
            <CardBackground accentColor={COLORS.primary} />
            
            <View style={styles.whyGrid}>
              {[
                { icon: 'checkmark-circle', text: 'Licensed & Regulated Platform', color: COLORS.primary },
                { icon: 'checkmark-circle', text: 'Instant Payout System', color: COLORS.purple },
                { icon: 'checkmark-circle', text: '24/7 Customer Support', color: COLORS.orange },
                { icon: 'checkmark-circle', text: 'Certified RNG (Fair Play)', color: COLORS.teal },
                { icon: 'checkmark-circle', text: 'Multiple Payment Options', color: COLORS.pink },
                { icon: 'checkmark-circle', text: 'Regular Tournaments & Events', color: COLORS.secondary },
              ].map((item, index) => (
                <View key={index} style={styles.whyItem}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                  <Text style={styles.whyText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* OUR VALUES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesContainer}>
            {/* First row: Security and Fair Play side by side */}
            <View style={styles.valuesRow}>
              <View style={[styles.valueCard, styles.valueCardHalf]}>
                <CardBackground accentColor={COLORS.primary} />
                
                <View style={[styles.valueIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                  <MaterialIcons name="security" size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.valueTitle}>Security First</Text>
                <Text style={styles.valueDescription}>
                  Your data and transactions are protected with bank-level encryption
                </Text>
              </View>

              <View style={[styles.valueCard, styles.valueCardHalf]}>
                <CardBackground accentColor={COLORS.purple} />
                
                <View style={[styles.valueIcon, { backgroundColor: `${COLORS.purple}15` }]}>
                  <MaterialIcons name="balance" size={28} color={COLORS.purple} />
                </View>
                <Text style={styles.valueTitle}>Fair Play</Text>
                <Text style={styles.valueDescription}>
                  Certified random number generator ensures equal chance for all players
                </Text>
              </View>
            </View>

            {/* Second row: Player Support full width */}
            <View style={[styles.valueCard, styles.valueCardFull]}>
              <CardBackground accentColor={COLORS.orange} />
              
              <View style={[styles.valueIcon, { backgroundColor: `${COLORS.orange}15` }]}>
                <MaterialIcons name="support-agent" size={28} color={COLORS.orange} />
              </View>
              <Text style={styles.valueTitle}>Player Support</Text>
              <Text style={styles.valueDescription}>
                Dedicated 24/7 support team to assist with any queries
              </Text>
            </View>
          </View>
        </View>

        {/* GET IN TOUCH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <View style={styles.contactCard}>
            <CardBackground accentColor={COLORS.teal} />
            
            <View style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
                <Ionicons name="mail" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@tambolatimez.com</Text>
              </View>
            </View>
            
            <View style={styles.contactDivider} />
            
            <View style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${COLORS.purple}15` }]}>
                <Ionicons name="time" size={20} color={COLORS.purple} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Support Hours</Text>
                <Text style={styles.contactValue}>24/7</Text>
              </View>
            </View>
            
            <View style={styles.contactDivider} />
            
            <View style={styles.contactItem}>
              <View style={[styles.contactIconContainer, { backgroundColor: `${COLORS.orange}15` }]}>
                <MaterialIcons name="verified-user" size={20} color={COLORS.orange} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Licensed By</Text>
                <Text style={styles.contactValue}>International Gaming Commission</Text>
              </View>
            </View>
          </View>
        </View>

        {/* STATS SECTION */}
        <View style={styles.section}>
          <View style={styles.statsCard}>
            <CardBackground accentColor={COLORS.primary} />
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Active Players</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>100K+</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₹2Cr+</Text>
                <Text style={styles.statLabel}>Winnings Paid</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Tambola Timez. All rights reserved.
          </Text>
          <Text style={styles.footerSubtext}>
            Play Responsibly. Must be 18+ to participate.
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  /* COLOR BLOCKS - Animated */
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
  
  /* Enhanced Header */
  headerWrapper: {
    position: 'relative',
    marginTop: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  
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
  
  /* UK Pattern */
  ukPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
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
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    lineHeight: 36,
  },
  titleBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  /* Section */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  
  /* Card Background */
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  
  /* Decorative circles */
  cardDecorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.08,
  },
  circle1: {
    top: -30,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  circle2: {
    bottom: -20,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.06,
  },
  circle3: {
    top: '40%',
    left: '30%',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.05,
  },
  
  /* Floating particles */
  floatingParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.12,
  },
  particle1: {
    top: 20,
    right: 40,
    width: 6,
    height: 6,
  },
  particle2: {
    bottom: 30,
    left: 50,
    width: 5,
    height: 5,
  },
  particle3: {
    top: '60%',
    right: 60,
    width: 7,
    height: 7,
  },
  particle4: {
    bottom: '20%',
    left: 80,
    width: 4,
    height: 4,
  },
  
  /* Banner Card */
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  bannerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  /* Mission Card */
  missionCard: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    zIndex: 2,
  },
  missionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  missionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  
  /* Features Grid */
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 44) / 2,
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    zIndex: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    zIndex: 2,
  },
  
  /* Why Card */
  whyCard: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: 2,
  },
  whyItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingRight: 8,
  },
  whyText: {
    fontSize: 13,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  
  /* Values Container */
  valuesContainer: {
    gap: 12,
  },
  valuesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  valueCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  valueCardHalf: {
    width: (width - 44) / 2,
  },
  valueCardFull: {
    width: '100%',
  },
  valueIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 2,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
    zIndex: 2,
  },
  valueDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    zIndex: 2,
  },
  
  /* Contact Card */
  contactCard: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    zIndex: 2,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  contactDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  
  /* Stats Card */
  statsCard: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  
  /* Footer */
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default About;