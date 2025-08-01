import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize } from "../../utils/Global_Styles";
import { scale, verticalScale } from "../../utils/scaling";
import { colors } from "../../utils/colors";
import { Feather } from "@expo/vector-icons";
import { Color } from "../../utils/Global_Styles";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: scale(20) }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Your privacy is extremely important to us. This policy outlines how we collect, use, and safeguard your information.
        </Text>

        <Text style={styles.sectionTitle}>2. Data Collected</Text>
        <Text style={styles.text}>We collect the following personal information:</Text>
        <Text style={styles.text}>• Name</Text>
        <Text style={styles.text}>• Email address</Text>
        <Text style={styles.text}>• Phone number</Text>
        <Text style={styles.text}>• Shipping and billing address</Text>
        <Text style={styles.text}>• Payment details (processed securely through third-party gateways)</Text>
        <Text style={styles.text}>• Device and browser information (via cookies)</Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
        <Text style={styles.text}>• To process orders and payments</Text>
        <Text style={styles.text}>• To communicate updates, offers, and support</Text>
        <Text style={styles.text}>• To improve our website and customer experience</Text>
        <Text style={styles.text}>• For internal analytics and reporting</Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>• We do not sell or rent your personal data to anyone.</Text>
        <Text style={styles.text}>
          • Data may be shared only with trusted third parties like courier services or payment gateways to fulfil your order.
        </Text>

        <Text style={styles.sectionTitle}>5. Security Measures</Text>
        <Text style={styles.text}>• All transactions are encrypted using SSL (Secure Socket Layer).</Text>
        <Text style={styles.text}>
          • Data is stored on secure servers with regular monitoring and protection.
        </Text>

        <Text style={styles.sectionTitle}>6. Cookies</Text>
        <Text style={styles.text}>
          Our website uses cookies for performance, analytics, and personalization. You can choose to disable cookies in your browser settings.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: '#eaf7ff',
  },
  header: {
    backgroundColor: Color.footer,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  backBtn: {
    color: colors.white,
    fontSize: scale(20),
    fontFamily: FontFamily.bold,
  },
  headerTitle: {
    fontSize:scale(16),
    color: colors.black,
    fontFamily: FontFamily.medium,
    // fontWeight: "bold",
    fontFamily:"TrajanPro-Bold"
  },
  content: {
    padding: scale(16),
    paddingBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize:scale (14),
    fontFamily: FontFamily.semiBold,
    color: colors.black,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(6),
    //  fontWeight: "bold",
     fontFamily:"TrajanPro-Bold"
  },
  text: {
    fontSize: scale (12),
    fontFamily: FontFamily.regular,
    color: colors.textDark,
    marginBottom: verticalScale(6),
    lineHeight: verticalScale(20),
     fontFamily:"TrajanPro-Normal",
  },
});
