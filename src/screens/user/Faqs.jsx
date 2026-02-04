import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Updated Color scheme with #02658D as primary
const PRIMARY_COLOR = "#02658D"; // Main background color
const SECONDARY_COLOR = "#02557A"; // Darker blue
const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
const LIGHT_ACCENT = "#FFECB3"; // Very light amber
const TEXT_LIGHT = "#E3F2FD"; // Light blue text
const DARK_BLUE = "#014560"; // Darker blue for backgrounds
const WHITE = "#FFFFFF";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [helpLinks, setHelpLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchFaqs(), fetchHelpLinks()]);
  };

  const fetchFaqs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/faqs",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status && res.data.data) setFaqs(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpLinks = async () => {
    try {
      setLinksLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/help-links",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status && res.data.data) setHelpLinks(res.data.data);
    } catch (err) {
      console.log("Error fetching help links:", err);
    } finally {
      setLinksLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const toggleFaq = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openYouTubeLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  const renderHelpLinks = () => {
    if (linksLoading) {
      return (
        <View style={styles.helpLinksContainer}>
          <ActivityIndicator size="small" color={ACCENT_COLOR} />
        </View>
      );
    }

    if (helpLinks.length === 0) return null;

    return (
      <View style={styles.helpLinksContainer}>
        <View style={styles.helpLinksHeader}>
          <Icon name="videocam" size={22} color={ACCENT_COLOR} />
          <Text style={styles.helpLinksTitle}>
            Helpful Videos
          </Text>
        </View>
        <Text style={styles.helpLinksSubtitle}>
          Watch tutorials to learn how to play Tambola games
        </Text>
        
        <View style={styles.linksList}>
          {helpLinks.map((link, index) => (
            <TouchableOpacity
              key={link.key || index}
              style={styles.linkItem}
              onPress={() => openYouTubeLink(link.url)}
              activeOpacity={0.7}
            >
              <View style={styles.linkIconContainer}>
                <Icon name="play-circle" size={20} color={ACCENT_COLOR} />
              </View>
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle} numberOfLines={2}>
                  {link.title}
                </Text>
                <Text style={styles.linkDescription} numberOfLines={1}>
                  {link.description}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={LIGHT_ACCENT} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
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
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Help Desk
          </Text>
          <TouchableOpacity>
            <Icon name="settings-outline" size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>

        {/* TOP ILLUSTRATION */}
        <View style={styles.topImageWrapper}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
            }}
            style={{
              width: 120,
              height: 120,
              opacity: 0.9,
            }}
          />
        </View>

        {/* INTRO */}
        <Text style={styles.introText}>
          We're here to help you with anything and everything on Tambola Timez. Use the search below or check our frequently asked questions.
        </Text>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Help"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={LIGHT_ACCENT}
          />
          <Icon name="search" size={20} color={LIGHT_ACCENT} style={styles.searchIcon} />
        </View>

        {/* HELP LINKS SECTION */}
        {renderHelpLinks()}

        {/* FAQ LIST */}
        <Text style={styles.sectionTitle}>
          Frequently Asked Questions
        </Text>

        {loading && <ActivityIndicator size="large" color={ACCENT_COLOR} style={{ marginTop: 20 }} />}

        {!loading &&
          filteredFaqs.map((faq) => (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFaq(faq.id)}
              >
                <View style={styles.faqTitleWrapper}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                    }}
                    style={styles.faqIcon}
                  />
                  <Text style={styles.faqQuestion}>
                    {faq.question}
                  </Text>
                </View>
                <Icon 
                  name={expanded[faq.id] ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={ACCENT_COLOR} 
                />
              </TouchableOpacity>
              {expanded[faq.id] && (
                <View style={styles.faqAnswerWrapper}>
                  <Text style={styles.faqAnswer}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}

        {filteredFaqs.length === 0 && !loading && (
          <Text style={styles.noFaqs}>No FAQs found.</Text>
        )}

        {/* CTA BUTTON */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Still stuck? Help us a mail away</Text>
          <Text style={styles.ctaBtnText}>Send a message</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Faqs;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  headerTitle: { 
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_LIGHT,
    letterSpacing: -0.5,
  },
  topImageWrapper: { 
    alignItems: "center", 
    marginBottom: 15
  },
  introText: {
    fontSize: 15,
    color: TEXT_LIGHT,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.9
  },
  searchBox: {
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 50,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { 
    fontSize: 15, 
    height: "100%",
    color: TEXT_LIGHT,
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  // Help Links Styles
  helpLinksContainer: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 16,
    marginBottom: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  helpLinksHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  helpLinksTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginLeft: 10,
  },
  helpLinksSubtitle: {
    fontSize: 14,
    color: LIGHT_ACCENT,
    marginBottom: 20,
    lineHeight: 20,
    opacity: 0.8,
  },
  linksList: {
    gap: 12,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  linkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255, 213, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.2)",
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_LIGHT,
    marginBottom: 4,
    lineHeight: 20,
  },
  linkDescription: {
    fontSize: 13,
    color: LIGHT_ACCENT,
    lineHeight: 18,
    opacity: 0.8,
  },
  // FAQ Section
  sectionTitle: { 
    fontSize: 18,
    fontWeight: "700", 
    marginBottom: 16,
    color: ACCENT_COLOR,
  },
  faqCard: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  faqTitleWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1,
    gap: 12,
  },
  faqIcon: { 
    width: 24, 
    height: 24,
  },
  faqQuestion: { 
    fontSize: 15,
    fontWeight: "600", 
    color: TEXT_LIGHT, 
    flex: 1,
    lineHeight: 20,
  },
  faqAnswerWrapper: {
    backgroundColor: DARK_BLUE,
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 213, 79, 0.3)",
  },
  faqAnswer: { 
    fontSize: 14,
    color: LIGHT_ACCENT, 
    lineHeight: 22,
    opacity: 0.9,
  },
  noFaqs: { 
    textAlign: "center", 
    marginTop: 20, 
    color: LIGHT_ACCENT,
    fontSize: 15,
    fontStyle: "italic",
    opacity: 0.8,
  },
  ctaButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 30,
    shadowColor: ACCENT_COLOR,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  ctaText: { 
    color: DARK_BLUE, 
    fontWeight: "500", 
    marginBottom: 6,
    fontSize: 14,
    opacity: 0.9,
  },
  ctaBtnText: { 
    color: DARK_BLUE, 
    fontWeight: "700", 
    fontSize: 16 
  },
  bottomSpace: {
    height: 30,
  },
});