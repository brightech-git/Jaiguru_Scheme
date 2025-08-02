import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  RefreshControl,
  Animated,
  Share,
} from "react-native";
import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale } from "../../utils/scaling";
import { colors } from "../../utils/colors";

const { width, height } = Dimensions.get("window");

// Constants for better maintainability
const CONTACT_DATA = {
  showrooms: [
    {
      id: 'tiruvallur',
      name: 'Tiruvallur Showroom',
      address: '712, TNHB, Kakkalur Bypass Road, Tiruvallur - 602001',
      coordinates: { lat: 13.2183, lng: 79.9067 }, // Example coordinates
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
      primaryContact: '+919600972227',
    },
    {
      id: 'tiruttani',
      name: 'Tiruttani Showroom', 
      address: '321/322 Ma Po Si Salai, Tiruttani',
      coordinates: { lat: 13.1667, lng: 79.6167 }, // Example coordinates
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
      primaryContact: '+919884808428',
    }
  ],
  phones: [
    { number: '+919600972227', label: 'Main Office', type: 'primary' },
    { number: '+919884808428', label: 'Customer Service', type: 'secondary' },
    { number: '+919169161469', label: 'Support', type: 'secondary' }
  ],
  email: {
    address: 'Jaigurujewellers2023@gmail.com',
    subject: 'Inquiry from Mobile App'
  },
  socialMedia: [
    { 
      name: 'facebook', 
      displayName: 'Facebook',
      color: '#3b5998', 
      url: 'https://www.facebook.com',
      icon: 'facebook'
    },
    { 
      name: 'instagram', 
      displayName: 'Instagram',
      color: '#e1306c', 
      url: 'https://www.instagram.com',
      icon: 'instagram'
    },
    { 
      name: 'whatsapp', 
      displayName: 'WhatsApp',
      color: '#25D366', 
      url: 'https://wa.me/919600972227?text=Hello%20Jai%20Guru%20Jewellers',
      icon: 'whatsapp'
    },
    { 
      name: 'youtube', 
      displayName: 'YouTube',
      color: '#FF0000', 
      url: 'https://www.youtube.com',
      icon: 'youtube'
    }
  ]
};

const COLORS = {
  primary: '#2A5C91',
  primaryLight: '#EAF7FF',
  secondary: '#D8EFFF',
  white: '#FFFFFF',
  cardBackground: '#F5FAFF',
  border: 'rgba(42, 92, 145, 0.1)',
  shadow: '#2A5C91',
  text: '#2A5C91',
  link: '#0066CC',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

const HelpCenter = ({ navigation, testID }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animation on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Enhanced error handling for external links
  const handleLinkError = useCallback((error, action, fallback = null) => {
    console.error(`HelpCenter: Error ${action}:`, error);
    
    Alert.alert(
      'Unable to Open',
      `Sorry, we couldn't ${action}. Please try again or contact us directly.`,
      [
        { text: 'Cancel', style: 'cancel' },
        ...(fallback ? [{ text: 'Try Alternative', onPress: fallback }] : []),
        { text: 'OK' }
      ]
    );
  }, []);

  // Enhanced map opening with error handling and coordinates
  const openMap = useCallback(async (showroom) => {
    try {
      const { address, coordinates } = showroom;
      
      // Try different map apps based on platform
      const mapUrls = Platform.select({
        ios: [
          `maps://app?q=${encodeURIComponent(address)}`,
          `http://maps.apple.com/?q=${encodeURIComponent(address)}`,
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        ],
        android: [
          `geo:${coordinates.lat},${coordinates.lng}?q=${encodeURIComponent(address)}`,
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        ]
      });

      for (const url of mapUrls) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          return;
        }
      }
      
      throw new Error('No map application available');
    } catch (error) {
      handleLinkError(error, 'open map', () => {
        // Fallback to sharing the address
        Share.share({
          message: `${showroom.name}\n${showroom.address}`,
          title: 'Showroom Address',
        });
      });
    }
  }, [handleLinkError]);

  // Enhanced phone calling with validation
  const handleCall = useCallback(async (phoneData) => {
    try {
      const { number, label } = phoneData;
      const phoneUrl = `tel:${number}`;
      
      const supported = await Linking.canOpenURL(phoneUrl);
      if (!supported) {
        throw new Error('Phone calling not supported');
      }

      // Add haptic feedback
      if (Platform.OS === 'ios') {
        const { HapticFeedback } = require('expo-haptics');
        HapticFeedback?.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
      }

      await Linking.openURL(phoneUrl);
    } catch (error) {
      handleLinkError(error, 'make call', () => {
        // Fallback to copying number
        Share.share({
          message: `${phoneData.label}: ${phoneData.number}`,
          title: 'Contact Number',
        });
      });
    }
  }, [handleLinkError]);

  // Enhanced email handling with pre-filled subject
  const handleMail = useCallback(async (emailData = CONTACT_DATA.email) => {
    try {
      const { address, subject } = emailData;
      const emailUrl = `mailto:${address}?subject=${encodeURIComponent(subject)}`;
      
      const supported = await Linking.canOpenURL(emailUrl);
      if (!supported) {
        throw new Error('Email client not available');
      }

      await Linking.openURL(emailUrl);
    } catch (error) {
      handleLinkError(error, 'open email', () => {
        // Fallback to sharing email address
        Share.share({
          message: `Email us at: ${CONTACT_DATA.email.address}`,
          title: 'Contact Email',
        });
      });
    }
  }, [handleLinkError]);

  // Enhanced social media handling
  const handleSocialMedia = useCallback(async (social) => {
    try {
      const supported = await Linking.canOpenURL(social.url);
      if (!supported) {
        throw new Error(`${social.displayName} not available`);
      }

      await Linking.openURL(social.url);
    } catch (error) {
      handleLinkError(error, `open ${social.displayName}`);
    }
  }, [handleLinkError]);

  // Pull to refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Enhanced back navigation with confirmation
  const handleBack = useCallback(() => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      Alert.alert('Navigation Error', 'Unable to go back');
    }
  }, [navigation]);

  // Card expansion toggle
  const toggleCardExpansion = useCallback((cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  }, [expandedCard]);

  // Memoized showroom cards
  const ShowroomCard = useMemo(() => ({ showroom, index }) => (
    <Animated.View
      key={showroom.id}
      style={[
        styles.card,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50],
            })
          }],
          opacity: fadeAnim,
        }
      ]}
    >
      <LinearGradient
        colors={[COLORS.white, COLORS.cardBackground]}
        style={styles.cardGradient}
      >
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleCardExpansion(showroom.id)}
          accessibilityRole="button"
          accessibilityLabel={`${showroom.name} details`}
          accessibilityHint="Tap to expand or collapse showroom details"
        >
          <MaterialIcons name="store" size={scale(22)} color={COLORS.primary} />
          <Text style={styles.cardTitle}>{showroom.name}</Text>
          <Ionicons 
            name={expandedCard === showroom.id ? "chevron-up" : "chevron-down"} 
            size={scale(20)} 
            color={COLORS.primary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => openMap(showroom)}
          accessibilityRole="button"
          accessibilityLabel={`Open map for ${showroom.address}`}
        >
          <MaterialIcons name="location-on" size={scale(20)} color={COLORS.primary} />
          <Text style={styles.cardText}>{showroom.address}</Text>
        </TouchableOpacity>

        {expandedCard === showroom.id && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedItem}>
              <MaterialIcons name="access-time" size={scale(18)} color={COLORS.primary} />
              <Text style={styles.expandedText}>{showroom.hours}</Text>
            </View>
            <TouchableOpacity
              style={styles.expandedItem}
              onPress={() => handleCall({ number: showroom.primaryContact, label: 'Showroom' })}
            >
              <Feather name="phone" size={scale(18)} color={COLORS.primary} />
              <Text style={[styles.expandedText, styles.linkText]}>
                {showroom.primaryContact}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  ), [expandedCard, toggleCardExpansion, openMap, handleCall, fadeAnim, slideAnim]);

  return (
    <View style={styles.container} testID={testID}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primaryLight} />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.secondary]}
        style={styles.headerContainer}
      >
        <TouchableOpacity 
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigate to previous screen"
        >
          <Ionicons name="arrow-back" size={scale(24)} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
       <View style={styles.headerRight}>
         <TouchableOpacity
           onPress={() => Share.share({
             message: 'Contact Jai Guru Jewellers',
             title: 'Share Contact Info'
           })}
           accessibilityRole="button"
           accessibilityLabel="Share contact information"
         >
           {/* <Ionicons name="share-outline" size={scale(20)} color={COLORS.primary} /> */}
         </TouchableOpacity>
       </View>
      </LinearGradient>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        testID="help-center-scroll"
      >
        {/* Showroom Cards */}
        <View style={styles.cardContainer}>
          {CONTACT_DATA.showrooms.map((showroom, index) => (
            <ShowroomCard key={showroom.id} showroom={showroom} index={index} />
          ))}

          {/* Enhanced Contact Numbers */}
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[COLORS.white, COLORS.cardBackground]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <Feather name="phone" size={scale(22)} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Contact Numbers</Text>
              </View>
              {CONTACT_DATA.phones.map((phone, idx) => (
                <TouchableOpacity 
                  key={idx}
                  style={styles.cardContent}
                  onPress={() => handleCall(phone)}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${phone.label} at ${phone.number}`}
                >
                  <Feather 
                    name="phone" 
                    size={scale(20)} 
                    color={phone.type === 'primary' ? COLORS.primary : COLORS.text} 
                  />
                  <View style={styles.phoneInfo}>
                    <Text style={[styles.cardText, styles.linkText]}>{phone.number}</Text>
                    <Text style={styles.phoneLabel}>{phone.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </LinearGradient>
          </Animated.View>

          {/* Enhanced Email */}
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[COLORS.white, COLORS.cardBackground]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <MaterialIcons name="email" size={scale(22)} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Email Support</Text>
              </View>
              <TouchableOpacity 
                style={styles.cardContent}
                onPress={() => handleMail()}
                accessibilityRole="button"
                accessibilityLabel={`Send email to ${CONTACT_DATA.email.address}`}
              >
                <MaterialIcons name="email" size={scale(20)} color={COLORS.primary} />
                <View>
                  <Text style={[styles.cardText, styles.linkText]}>
                    {CONTACT_DATA.email.address}
                  </Text>
                  <Text style={styles.emailHint}>Tap to compose email</Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Enhanced Social Media */}
        <Animated.View style={[styles.socialContainer, { opacity: fadeAnim }]}>
          <Text style={styles.socialTitle}>Connect With Us</Text>
          <Text style={styles.socialSubtitle}>Follow us for latest updates and offers</Text>
          <View style={styles.socialRow}>
            {CONTACT_DATA.socialMedia.map((social, index) => (
              <TouchableOpacity
                key={social.name}
                style={[styles.socialIcon, { backgroundColor: social.color }]}
                onPress={() => handleSocialMedia(social)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${social.displayName}`}
                accessibilityHint={`Navigate to our ${social.displayName} page`}
              >
                <FontAwesome name={social.icon} size={scale(20)} color={COLORS.white} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Business Hours */}
        <Animated.View style={[styles.hoursContainer, { opacity: fadeAnim }]}>
          <Text style={styles.hoursTitle}>Business Hours</Text>
          <View style={styles.hoursContent}>
            <MaterialIcons name="access-time" size={scale(20)} color={COLORS.primary} />
            <Text style={styles.hoursText}>Monday - Saturday: 9:00 AM - 8:00 PM</Text>
          </View>
          <View style={styles.hoursContent}>
            <MaterialIcons name="event-busy" size={scale(20)} color={COLORS.warning} />
            <Text style={styles.hoursText}>Sunday: Closed</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    paddingTop: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  backButton: {
    padding: scale(5),
    borderRadius: scale(20),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'TrajanPro-Bold'
  },
  headerRight: {
    padding: scale(5),
  },
  scrollContainer: {
    paddingBottom: verticalScale(30)
  },
  cardContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20)
  },
  card: {
    borderRadius: scale(16),
    marginBottom: verticalScale(16),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: scale(16),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: verticalScale(12)
  },
  cardTitle: {
    fontSize: scale(17),
    fontWeight: '600',
    marginLeft: scale(12),
    color: COLORS.primary,
    fontFamily: 'TrajanPro-Bold',
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: verticalScale(8),
    paddingVertical: verticalScale(8),
  },
  cardText: {
    fontSize: scale(14),
    marginLeft: scale(12),
    color: COLORS.text,
    lineHeight: verticalScale(22),
    fontFamily: 'TrajanPro-Regular',
    flex: 1,
  },
  linkText: {
    color: COLORS.link,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  expandedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  expandedText: {
    fontSize: scale(13),
    marginLeft: scale(10),
    color: COLORS.text,
    fontFamily: 'TrajanPro-Regular',
  },
  phoneInfo: {
    marginLeft: scale(12),
    flex: 1,
  },
  phoneLabel: {
    fontSize: scale(12),
    color: COLORS.text,
    opacity: 0.7,
    marginTop: verticalScale(2),
  },
  emailHint: {
    fontSize: scale(12),
    color: COLORS.text,
    opacity: 0.6,
    marginTop: verticalScale(2),
    fontStyle: 'italic',
  },
  socialContainer: {
    marginTop: verticalScale(15),
    alignItems: 'center',
    padding: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: scale(16),
    marginHorizontal: scale(20),
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  socialTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    marginBottom: verticalScale(6),
    color: COLORS.primary,
    fontFamily: 'TrajanPro-Bold'
  },
  socialSubtitle: {
    fontSize: scale(13),
    color: COLORS.text,
    opacity: 0.8,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  socialIcon: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    alignItems: 'center',
    justifyContent: 'center',
    margin: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  hoursContainer: {
    marginTop: verticalScale(15),
    marginHorizontal: scale(20),
    padding: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hoursTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: verticalScale(15),
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold',
  },
  hoursContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  hoursText: {
    fontSize: scale(14),
    marginLeft: scale(10),
    color: COLORS.text,
    fontFamily: 'TrajanPro-Regular',
  },
});

export default React.memo(HelpCenter);