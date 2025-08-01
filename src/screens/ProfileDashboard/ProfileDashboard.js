import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import TextDefault from '../../components/Text/TextDefault/TextDefault';
import { colors, verticalScale, scale } from '../../utils';
import BottomTab from '../../components/BottomTab/BottomTab'; // Make sure this path is correct

const { width } = Dimensions.get('window');

function ProfileContainer() {
  const navigation = useNavigation();
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(60));
  const [cardScale] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 8,
        speed: 5,
        useNativeDriver: true
      })
    ]).start();

    const fetchUserDetails = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem('userPhoneNumber');
        if (phoneNumber) {
          const formattedPhone = phoneNumber.replace(
            /(\d{3})(\d{3})(\d{4})/,
            '$1-$2-$3'
          );
          setUserPhone(formattedPhone);

          const response = await fetch(
            `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${phoneNumber}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setUserName(data[0].pname || 'User');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Do you surely want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              'mpin',
              'isMpinCreated',
              'userPhoneNumber'
            ]);
            navigation.replace('OTP');
          } catch (error) {
            console.error('Error during logout:', error);
          }
        }
      }
    ]);
  };

  const settingsItems = [
    { label: 'My Scheme', icon: 'list', route: 'MyScheme' },
    { label: 'Help Center', icon: 'help-outline', route: 'HelpCenter' },
    { label: 'Privacy Policy', icon: 'security', route: 'PrivacyPolicy' },
    {
      label: 'Terms & Conditions',
      icon: 'lock-outline',
      route: 'TermsandCondition'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={scale(24)} color={colors.black} />
        </TouchableOpacity>
        <TextDefault H4 bold style={styles.headerTitle}>
          My Profile
        </TextDefault>
        <View style={styles.headerRight} />
      </View>

      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            styles.profileHeader,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarShadow}>
              <View style={styles.avatarCircle}>
                <MaterialIcons
                  name='account-circle'
                  size={scale(90)}
                  color={colors.black}
                />
              </View>
            </View>
            <TextDefault H4 bold style={styles.profileName}>
              {userName}
            </TextDefault>
            <View style={styles.phoneContainer}>
              <MaterialIcons
                name='phone'
                size={scale(18)}
                color={colors.white}
                style={styles.phoneIcon}
              />
              <TextDefault H5 style={styles.phoneNumber}>
                {userPhone}
              </TextDefault>
            </View>
          </View>
        </Animated.View>

        {/* Settings Grid */}
        <View style={styles.settingsGrid}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.route)}
              style={styles.gridItem}
            >
              <LinearGradient
                colors={['#ffffff', '#f9f9f9']}
                style={styles.gridCard}
              >
                <MaterialIcons
                  name={item.icon}
                  size={scale(28)}
                  color={colors.primary}
                />
                <TextDefault H6 style={styles.gridLabel}>
                  {item.label}
                </TextDefault>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutWrapper}>
          <LinearGradient
            colors={['#ffcccc', '#ff6666']}
            style={styles.logoutCard}
          >
            <MaterialIcons name='logout' size={scale(20)} color='#fff' />
            <TextDefault H5 style={styles.logoutText}>
              Log Out
            </TextDefault>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <BottomTab screen="PROFILE" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eaf7ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    backgroundColor: '#eaf7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backButton: {
    padding: scale(5)
  },
  headerTitle: {
    color: colors.black,
    fontFamily: 'TrajanPro-Bold'
  },
  headerRight: {
    width: scale(24)
  },
  container: {
    flex: 1,
    backgroundColor: '#eaf7ff'
  },
  profileHeader: {
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
    overflow: 'hidden',
    marginBottom: verticalScale(20)
  },
  profileContent: {
    alignItems: 'center',
    marginTop: verticalScale(40),
    paddingBottom: verticalScale(30)
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6
  },
  avatarCircle: {
    backgroundColor: '#fff',
    borderRadius: scale(55),
    padding: scale(10)
  },
  profileName: {
    marginTop: verticalScale(10),
    color: '#000',
    fontFamily: 'TrajanPro-Bold',
  },
  phoneContainer: {
    marginTop: verticalScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20)
  },
  phoneIcon: {
    marginRight: scale(6)
  },
  phoneNumber: {
    color: '#000',
    fontFamily: 'TrajanPro-Bold'
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20)
  },
  gridItem: {
    width: '48%',
    marginBottom: verticalScale(20)
  },
  gridCard: {
    borderRadius: scale(14),
    padding: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2
  },
  gridLabel: {
    marginTop: scale(8),
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold'
  },
  logoutWrapper: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40)
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(14),
    borderRadius: scale(12)
  },
  logoutText: {
    color: '#fff',
    marginLeft: scale(10),
    fontFamily: 'TrajanPro-Bold'
  }
});

export default ProfileContainer;