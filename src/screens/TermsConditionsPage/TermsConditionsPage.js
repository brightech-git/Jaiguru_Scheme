import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize } from "../../utils/Global_Styles";
import { scale, verticalScale } from "../../utils/scaling";
import { colors } from "../../utils/colors";
import { Feather } from "@expo/vector-icons";
import { Color } from "../../utils/Global_Styles";

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: scale(20) }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Product Representation</Text>
        <Text style={styles.text}>
          • Images are for reference only. Minor variations in color or finish
          may occur due to lighting or screen settings.
        </Text>
        <Text style={styles.text}>
          • All products are handcrafted, so slight irregularities are natural.
        </Text>

        <Text style={styles.sectionTitle}>2. Pricing</Text>
        <Text style={styles.text}>
          • All prices are in INR and inclusive of GST unless otherwise
          specified.
        </Text>
        <Text style={styles.text}>
          • Prices and offers may change without prior notice.
        </Text>

        <Text style={styles.sectionTitle}>3. Payments</Text>
        <Text style={styles.text}>
          We accept the following modes of payment:
        </Text>
        <Text style={styles.text}>• UPI, Debit/Credit Cards, Net Banking</Text>
        <Text style={styles.text}>
          • Cash on Delivery (COD) for select pin codes
        </Text>

        <Text style={styles.sectionTitle}>4. Product Use & Care</Text>
        <Text style={styles.text}>
          • Gold-polished silver jewellery requires gentle handling. Avoid
          water, perfumes, and chemicals. Store in a dry, soft pouch.
        </Text>
        <Text style={styles.text}>
          • No guarantee is given for the durability of polish, as it depends on
          usage and care.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.text}>
          • We are not liable for delays, loss, or damages caused during
          shipping, force majeure events, or customer misuse.
        </Text>

        <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
        <Text style={styles.text}>
          • All content including images, logos, text, and product designs are
          the property of our showroom and cannot be copied or used without
          written consent.
        </Text>

        <Text style={styles.sectionTitle}>7. Governing Law</Text>
        <Text style={styles.text}>
          • These terms are governed by the laws of India, and any disputes
          shall be subject to the jurisdiction of courts in Madurai, Tamil Nadu.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditionsScreen;

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
    fontFamily:"TrajanPro-Bold",
  },
  headerTitle: {
    fontSize: scale(16),
    color: colors.black,
    fontFamily: FontFamily.medium,
    // fontWeight: "bold",
    fontFamily:"TrajanPro-Bold",
  },
  content: {
    padding: scale(16),
    paddingBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: FontSize.size_md,
    fontFamily: FontFamily.semiBold,
    color: colors.black,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    // fontWeight: "bold",
    fontFamily:"TrajanPro-Bold",
  },
  text: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.regular,
    color: colors.textDark,
    marginBottom: verticalScale(6),
    lineHeight: verticalScale(20),
    fontFamily:"TrajanPro-Normal",
  },
});
