import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import BottomTab from "../../components/BottomTab/BottomTab";
import { colors } from "../../utils";
import GoldPlan from "../../ui/ProductCard/GoldPlans";
import GoldPlansSkeleton from "../../components/SkeletonLoader/GoldPlansSkeleton";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

function GoldPlanScreen({ navigation }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://akj.brightechsoftware.com/v1/api/member/scheme"
        );
        const data = await response.json();
        const formattedSchemes = data.map((s) => ({
          schemeId: s.SchemeId,
          schemeName: s.schemeName,
          description: s.SchemeSName,
        }));
        setSchemes(formattedSchemes);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <GoldPlansSkeleton />
          <GoldPlansSkeleton />
        </View>
      );
    }

    if (!schemes || schemes.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons
            name="error-outline"
            size={48}
            color={colors.lightGold}
          />
          <Text style={styles.noDataText}>No Gold Plans available</Text>
        </View>
      );
    }

    return (
      <View style={styles.cardsContainer}>
        {schemes.map((scheme, index) => (
          <GoldPlan
            key={index}
            schemeId={scheme.schemeId}
            schemeName={scheme.schemeName}
            description={scheme.description}
            styles={styles.itemCardContainer}
          />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#eaf7ff", "#d6eaff"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.darkBlue}
            />
          </TouchableOpacity>

          <Text style={styles.titleText}>GOLD INVESTMENT PLANS</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentHeader}>
            <Text style={styles.subtitle}>Exclusive Gold Schemes</Text>
            <Text style={styles.description}>
              Select from our prestigious collection of gold investment
              opportunities
            </Text>
          </View>

          {renderContent()}
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomTab screen="GOLDPLANS" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: '#eaf7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#cce5f6',
    shadowColor: '#00334d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    height: 80,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#d6eaff',
    borderWidth: 1,
    borderColor: '#b0d0e8',
  },
  headerRightPlaceholder: {
    width: 24,
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'TrajanPro-Bold',
    color: '#00334d',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingLeft: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentHeader: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'TrajanPro-Bold',
    color: '#00334d',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: 'TrajanPro-Bold',
    color: '#33667a',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  skeletonContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  itemCardContainer: {
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    shadowColor: '#00334d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#d6eaff',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: '#b0d0e8',
  },
  noDataText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'TrajanPro-Bold',
    color: '#5f7d8a',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});


export default GoldPlanScreen;
