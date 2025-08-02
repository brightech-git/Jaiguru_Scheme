import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Platform,
  ImageBackground
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SchemeContext } from "../../services/SchemeContext/SchemeContext";
import SchemeCard from "../../ui/SchemeCard/SchemeCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllSchemesScreen = ({ navigation }) => {
  const {
    productData = [],
    getActiveSchemes,
  } = useContext(SchemeContext);

  useEffect(() => {
    const fetchNumber = async () => {
      const storedNumber = await AsyncStorage.getItem("userPhoneNumber");
      console.log("Fetched phone number from storage:", storedNumber);
    };

    fetchNumber();
  }, []);

  const activeSchemes = getActiveSchemes();
  const totalCount = productData.length;
  const activeCount = activeSchemes.length;
  const inactiveCount = totalCount - activeCount;

  const handleSchemePress = (scheme) => {
    if (scheme?.accountDetails) {
      navigation.navigate("PaymentHistory", {
        accountDetails: scheme.accountDetails,
        schemeName: scheme.schemeName?.trim() || "Scheme",
      });
    }
  };

return (
  <ImageBackground
    source={require("../../assets/image/otpbg.jpg")} // or your actual image path
    resizeMode="cover"
    style={styles.backgroundImage}
  >
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5C91" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Schemes</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="folder-multiple" size={28} color="#FFFFFF" />
          <Text style={styles.statLabel}>Total Schemes</Text>
          <Text style={styles.statValue}>{totalCount}</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="check-circle" size={28} color="#4CAF50" />
          <Text style={styles.statLabel}>Active Schemes</Text>
          <Text style={styles.statValue}>{activeCount}</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="pause-circle" size={28} color="#FFC107" />
          <Text style={styles.statLabel}>Inactive Schemes</Text>
          <Text style={styles.statValue}>{inactiveCount}</Text>
        </View>
      </View>

      {/* Scheme List */}
      <FlatList
        data={productData}
        keyExtractor={(item, index) =>
          `${item.regno}-${item.groupcode}-${index}`
        }
        renderItem={({ item, index }) => (
          <SchemeCard
            scheme={item}
            index={index}
            onPress={() => handleSchemePress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  </ImageBackground>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},

 header: {
  backgroundColor: '#EAF7FF',
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  // justifyContent: '',
  borderRadius: 12,
  elevation: 4,
  shadowColor: '#2A5C91',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  width: '90%',
  alignSelf: 'center',
  // marginVertical: 16,
  borderWidth: 1,
  borderColor: 'rgba(42, 92, 145, 0.1)',
  
  // Optional gradient background instead of solid color
 
  // backgroundGradient: {
  //   colors: ['#EAF7FF', '#D8EFFF'],
  //   start: { x: 0, y: 0 },
  //   end: { x: 1, y: 1 }
  // }
 
},
  backButton: {
    paddingRight: 42,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000ff',
    alignSelf: 'center',
    paddingLeft: 52,
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#5D8FBE',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
});

export default AllSchemesScreen;
