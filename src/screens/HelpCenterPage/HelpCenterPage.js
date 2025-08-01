import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet
} from "react-native";
import { Feather, Entypo, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale } from "../../utils/scaling";
import { colors } from "../../utils/colors";

const { width } = Dimensions.get("window");

const HelpCenter = ({ navigation }) => {
  const openMap = (query) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  const handleCall = (number) => Linking.openURL(`tel:${number}`);
  const handleMail = (email) => Linking.openURL(`mailto:${email}`);


  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#f8f8f8', '#ffffff']}
        style={styles.headerContainer}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={scale(24)} color={colors.primaryGold1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Cards */}
        <View style={styles.cardContainer}>
          {/* Main Branch */}
          <LinearGradient
            colors={['#ffffff', '#f9f9f9']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="store" size={scale(22)} color={colors.primaryGold1} />
              <Text style={styles.cardTitle}>Main Branch</Text>
            </View>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => openMap("68 Ellis Road, Mount Road, Chennai")}
            >
              <MaterialIcons name="location-on" size={scale(20)} color={colors.primaryGold1} />
              <Text style={styles.cardText}>
                Old # 52, New # 68, Ellis Road,{"\n"}
                Mount Road, Chennai 600002,{"\n"}
                Tamilnadu, India.
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Contact Us */}
          <LinearGradient
            colors={['#ffffff', '#f9f9f9']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Feather name="phone" size={scale(22)} color={colors.primaryGold1} />
              <Text style={styles.cardTitle}>Contact Us</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardContent}
              onPress={() => handleMail("Jaigurujewellers2023@gmail.com")}
            >
              <MaterialIcons name="email" size={scale(20)} color={colors.primaryGold1} />
              <Text style={[styles.cardText, styles.linkText]}>
                Jaigurujewellers2023@gmail.com
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cardContent}
              onPress={() => handleCall("04442157157")}
            >
              <Feather name="phone-call" size={scale(20)} color={colors.primaryGold1} />
              <Text style={[styles.cardText, styles.linkText]}>04442157157</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Additional Numbers */}
          <LinearGradient
            colors={['#ffffff', '#f9f9f9']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Feather name="smartphone" size={scale(22)} color={colors.primaryGold1} />
              <Text style={styles.cardTitle}>Additional Contacts</Text>
            </View>
            {["04428588888", "04428580506"].map((num, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.cardContent}
                onPress={() => handleCall(num)}
              >
                <Feather name="phone" size={scale(20)} color={colors.primaryGold1} />
                <Text style={[styles.cardText, styles.linkText]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </LinearGradient>

          {/* Business Hours */}
          <LinearGradient
            colors={['#ffffff', '#f9f9f9']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="access-time" size={scale(22)} color={colors.primaryGold1} />
              <Text style={styles.cardTitle}>Business Hours</Text>
            </View>
            <View style={styles.cardContent}>
              <MaterialIcons name="schedule" size={scale(20)} color={colors.primaryGold1} />
              <Text style={styles.cardText}>
                Monday - Saturday: 10AM - 8PM{"\n"}
                Sunday: 11AM - 6PM
              </Text>
            </View>
          </LinearGradient>

          {/* Showroom Address */}
          <LinearGradient
            colors={['#ffffff', '#f9f9f9']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="storefront" size={scale(22)} color={colors.primaryGold1} />
              <Text style={styles.cardTitle}>Showroom Address</Text>
            </View>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => openMap("160 Melamasi Street, Madurai")}
            >
              <MaterialIcons name="place" size={scale(20)} color={colors.primaryGold1} />
              <Text style={styles.cardText}>160, Melamasi Street, Madurai - 625001</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Registered Office */}
          <LinearGradient
            colors={['#ffffff', '#f9f9f9']}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <MaterialIcons name="business" size={scale(22)} color={colors.primaryGold1} />
              <Text style={styles.cardTitle}>Registered Office</Text>
            </View>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => openMap("54 Vaithyanathapuram, Thathaneri, Madurai")}
            >
              <MaterialIcons name="location-city" size={scale(20)} color={colors.primaryGold1} />
              <Text style={styles.cardText}>
                No. 54, Vaithyanathapuram, Thathaneri,{"\n"}Madurai - 625018
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Social Media */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Connect With Us</Text>
          <View style={styles.socialRow}>
            {[
              { name: 'facebook', color: '#3b5998', iconColor: '#ffffff', url: 'https://www.facebook.com/Jaigurujewellersmadurai' },
              { name: 'instagram', color: '#e1306c', iconColor: '#ffffff', url: 'https://www.instagram.com/Jaigurujewellers_madurai/' },
              { name: 'whatsapp', color: '#25D366', iconColor: '#ffffff', url: 'https://wa.me/919123456789' },
              { name: 'youtube', color: '#FF0000', iconColor: '#ffffff', url: 'https://www.youtube.com/@JaigurujewellersMadurai' },
              { name: 'twitter', color: '#1DA1F2', iconColor: '#ffffff', url: 'https://x.com/Jaigurujewellers24' }
            ].map((social, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.socialIcon, { backgroundColor: social.color }]}
                onPress={() => Linking.openURL(social.url)}
              >
                <FontAwesome name={social.name} size={scale(20)} color={social.iconColor} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: '#eaf7ff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  backButton: {
    padding: scale(5)
  },
  headerTitle: {
    fontSize: scale(20),
    // fontWeight: 'bold',
    color: colors.black,
    fontFamily: 'TrajanPro-Bold'
  },
  headerRight: {
    width: scale(24)
  },
  scrollContainer: {
    paddingBottom: verticalScale(30)
  },
  cardContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20)
  },
  card: {
    borderRadius: scale(12),
    padding: scale(15),
    marginBottom: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: verticalScale(10)
  },
  cardTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    marginLeft: scale(10),
    color: colors.black,
    fontFamily: 'TrajanPro-Bold'
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: verticalScale(8)
  },
  cardText: {
    fontSize: scale(12),
    marginLeft: scale(10),
    color: colors.textPrimary,
    lineHeight: verticalScale(20),
     fontFamily: 'TrajanPro-Normal'
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline'
  },
  socialContainer: {
    marginTop: verticalScale(20),
    alignItems: 'center'
  },
  socialTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    marginBottom: verticalScale(15),
    color: colors.black,
    fontFamily: 'TrajanPro-Bold'
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  socialIcon: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryGoldLight,
    paddingBottom: verticalScale(10)
  },
  linkText: {
    color: colors.primaryGold1,
    textDecorationLine: 'underline'
  },
  socialIcon: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(8),
    shadowColor: colors.primaryGold1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  }
});

export default HelpCenter;