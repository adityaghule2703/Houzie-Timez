import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

// Updated Color scheme matching FAQ and Home
const PRIMARY_COLOR = "#02658D"; // Main background color
const SECONDARY_COLOR = "#02557A"; // Darker blue
const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
const LIGHT_ACCENT = "#FFECB3"; // Very light amber
const TEXT_LIGHT = "#E3F2FD"; // Light blue text
const DARK_BLUE = "#014560"; // Darker blue for backgrounds
const WHITE = "#FFFFFF";

const About = () => {
  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start background animations
    startAnimations();
  }, []);

  const startAnimations = () => {
    // First floating animation
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

    // Second floating animation (different timing)
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

    // Pulse animation for subtle effect
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

    // Slow rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Shine animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Interpolations for animations
  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15]
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const shineTranslateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100]
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
      {/* BACKGROUND PATTERNS WITH ANIMATIONS */}
      <View style={styles.backgroundPatterns}>
        {/* Animated shine effect */}
        <Animated.View 
          style={[
            styles.shineEffect,
            { 
              transform: [{ translateX: shineTranslateX }],
              opacity: shineAnim
            }
          ]} 
        />
        
        {/* Animated poker chips */}
        <Animated.View 
          style={[
            styles.pokerChip1, 
            { 
              transform: [
                { translateY: translateY1 },
                { translateX: translateY2 }
              ] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.pokerChip2, 
            { 
              transform: [
                { translateY: translateY2 },
                { translateX: translateY1 }
              ] 
            }
          ]} 
        />
        
        {/* Gold gradient overlay */}
        <View style={styles.goldGradient} />
        
        {/* Blue gradient overlay */}
        <View style={styles.blueGradient} />
      </View>

      {/* HEADER */}
      <Animated.View 
        style={[
          styles.header,
          { 
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <View style={styles.headerPattern}>
          <Animated.View 
            style={[
              styles.headerShine,
              { transform: [{ translateX: shineTranslateX }] }
            ]} 
          />
        </View>
        <Text style={styles.title}>About Tambola Timez</Text>
        <Text style={styles.tagline}>Professional Gaming Platform</Text>
      </Animated.View>

      {/* BANNER CARD */}
      <View style={styles.section}>
        <View style={styles.bannerCard}>
          <View style={styles.bannerPattern} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconContainer}>
              <Ionicons name="game-controller" size={48} color={ACCENT_COLOR} />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Welcome to Tambola Timez</Text>
              <Text style={styles.bannerText}>
                A premium online Tambola platform designed for professional gaming 
                with fair play, instant payouts, and seamless user experience.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* OUR MISSION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <View style={styles.missionCard}>
          <View style={styles.missionPattern} />
          {[
            { icon: 'target', text: 'Deliver fast & fair Tambola games' },
            { icon: 'users', text: 'Connect real players globally' },
            { icon: 'gift', text: 'Provide exciting rewards daily' },
            { icon: 'shield-alt', text: 'Ensure safe & secure gaming' },
          ].map((item, index) => (
            <View key={index} style={styles.missionItem}>
              <View style={styles.missionIcon}>
                <FontAwesome5 name={item.icon} size={20} color={ACCENT_COLOR} />
              </View>
              <Text style={styles.missionText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresGrid}>
          {[
            {
              icon: 'flash',
              title: 'Instant Matchmaking',
              description: 'Join games instantly with players worldwide',
              color: ACCENT_COLOR,
            },
            {
              icon: 'layers',
              title: 'Multiple Modes',
              description: 'Classic, Speed, and Premium game modes',
              color: LIGHT_ACCENT,
            },
            {
              icon: 'lock-closed',
              title: 'Secure Rooms',
              description: 'Private rooms with end-to-end encryption',
              color: ACCENT_COLOR,
            },
            {
              icon: 'trophy',
              title: 'Daily Rewards',
              description: 'Win exciting prizes and bonuses daily',
              color: LIGHT_ACCENT,
            },
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featurePattern} />
              <View style={[styles.featureIconContainer, { borderColor: `${feature.color}20` }]}>
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
          <View style={styles.whyPattern} />
          {[
            { icon: 'checkmark-circle', text: 'Licensed & Regulated Platform' },
            { icon: 'checkmark-circle', text: 'Instant Payout System' },
            { icon: 'checkmark-circle', text: '24/7 Customer Support' },
            { icon: 'checkmark-circle', text: 'Certified RNG (Fair Play)' },
            { icon: 'checkmark-circle', text: 'Multiple Payment Options' },
            { icon: 'checkmark-circle', text: 'Regular Tournaments & Events' },
          ].map((item, index) => (
            <View key={index} style={styles.whyItem}>
              <Ionicons name={item.icon} size={20} color={ACCENT_COLOR} />
              <Text style={styles.whyText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* OUR VALUES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Values</Text>
        <View style={styles.valuesContainer}>
          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="security" size={32} color={ACCENT_COLOR} />
            </View>
            <Text style={styles.valueTitle}>Security First</Text>
            <Text style={styles.valueDescription}>
              Your data and transactions are protected with bank-level encryption
            </Text>
          </View>

          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="balance" size={32} color={ACCENT_COLOR} />
            </View>
            <Text style={styles.valueTitle}>Fair Play</Text>
            <Text style={styles.valueDescription}>
              Certified random number generator ensures equal chance for all players
            </Text>
          </View>

          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="support-agent" size={32} color={ACCENT_COLOR} />
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
          <View style={styles.contactPattern} />
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={24} color={ACCENT_COLOR} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@tambolatimez.com</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactItem}>
            <Ionicons name="time" size={24} color={ACCENT_COLOR} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Support Hours</Text>
              <Text style={styles.contactValue}>24/7</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactItem}>
            <MaterialIcons name="verified-user" size={24} color={ACCENT_COLOR} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Licensed By</Text>
              <Text style={styles.contactValue}>International Gaming Commission</Text>
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
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  backgroundPatterns: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  // Poker chip animations
  pokerChip1: {
    position: 'absolute',
    top: 100,
    left: width * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  pokerChip2: {
    position: 'absolute',
    top: 200,
    right: width * 0.15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  // Shine effect
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 213, 79, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  goldGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'rgba(255, 213, 79, 0.05)',
  },
  blueGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(1, 69, 96, 0.3)',
  },
  header: {
    backgroundColor: SECONDARY_COLOR,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  headerShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 213, 79, 0.15)',
    transform: [{ skewX: '-20deg' }],
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_LIGHT,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    marginTop: 4,
    fontWeight: "500",
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: ACCENT_COLOR,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 50,
    backgroundColor: 'rgba(255, 213, 79, 0.05)',
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    lineHeight: 20,
    opacity: 0.9,
  },
  missionCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  missionPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 80,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 40,
    backgroundColor: 'rgba(255, 213, 79, 0.03)',
  },
  missionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  missionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  missionText: {
    fontSize: 15,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  featurePattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 20,
    backgroundColor: 'rgba(255, 213, 79, 0.02)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    lineHeight: 16,
    opacity: 0.8,
  },
  whyCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  whyPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderTopRightRadius: 16,
    backgroundColor: 'rgba(255, 213, 79, 0.02)',
  },
  whyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  whyText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginLeft: 12,
    fontWeight: "500",
  },
  valuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  valueCard: {
    width: (width - 52) / 2,
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    alignItems: "center",
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  valueIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_LIGHT,
    marginBottom: 4,
    textAlign: "center",
  },
  valueDescription: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    textAlign: "center",
    lineHeight: 16,
    opacity: 0.8,
  },
  contactCard: {
    backgroundColor: DARK_BLUE,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  contactPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 80,
    borderBottomLeftRadius: 16,
    backgroundColor: 'rgba(255, 213, 79, 0.03)',
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  contactTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    marginBottom: 2,
    opacity: 0.7,
  },
  contactValue: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  contactDivider: {
    height: 1,
    backgroundColor: "rgba(255, 213, 79, 0.2)",
    marginVertical: 4,
  },
  footer: {
    backgroundColor: SECONDARY_COLOR,
    padding: 24,
    marginTop: 24,
    borderTopWidth: 2,
    borderTopColor: ACCENT_COLOR,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: "center",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: LIGHT_ACCENT,
    textAlign: "center",
    opacity: 0.8,
  },
});