import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
  Image,
  Animated,
  Platform,
  Alert,
  ToastAndroid,
  SafeAreaView,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { Slider } from '../../components';
import { colors } from '../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomTab from '../../components/BottomTab/BottomTab';
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get('window');

const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  // ✅ Declare this first
  const menuItems = [
    {
      icon: 'account-plus',
      label: 'Join Scheme',
      action: () => navigation.navigate('GoldPlanScreen')
    },
    {
      icon: 'account-multiple',
      label: 'My Schemes',
      action: () => navigation.navigate('MyScheme')
    },
    {
      icon: 'credit-card',
      label: 'Paid Amount',
      action: () => navigation.navigate('PaymentPaidScreen')
    },
    {
      icon: 'cash',
      label: 'Pay Dues',
      action: () => showToast('Coming soon')
    },
    {
      icon: 'wallet',
      label: 'My Wallet',
      action: () => showToast('Coming soon')
    },
    { icon: 'tag', label: 'Offers', action: () => showToast('Coming soon') },
    {
      icon: 'star-circle',
      label: 'New Arrivals',
      action: () => showToast('Coming soon')
    },
    {
      icon: 'scale-balance',
      label: 'Total Weight',
      action: () => showToast('Coming soon')
    },
    {
      icon: 'close-circle',
      label: 'Closed Accounts',
      action: () => showToast('Coming soon')
    }
  ];

  // ✅ Now it will work
  const menuAnimRefs = useRef(menuItems.map(() => new Animated.Value(1)));

  const goldAnimation = useRef(new Animated.Value(0)).current;
  const silverAnimation = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(goldAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start();

    setTimeout(() => {
      Animated.loop(
        Animated.timing(silverAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        })
      ).start();
    }, 1000);

    fetchRates();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(badgeScale, {
        toValue: 1.3,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(badgeScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }, [notificationCount]);

  const fetchRates = async () => {
    try {
      const response = await fetch(
        'https://akj.brightechsoftware.com/v1/api/account/todayrate'
      );
      const data = await response.json();
      setGoldRate(data?.Rate);
      setSilverRate(data?.SILVERRATE);
    } catch (error) {
      showToast('Failed to fetch rates');
    }
  };

  const navigateTo = (url) => {
    Linking.openURL(url).catch(() => showToast('Unable to open link'));
  };

  return (
     
    <SafeAreaView style={styles.container}>
      
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/image/logo1.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Jaiguru Jewellers</Text>
          <View style={{ position: 'relative' }}>
          <Ionicons name='notifications' size={30} color='blue' />
          {notificationCount > 0 && (
            <Animated.View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 1,
                transform: [{ scale: badgeScale }]
              }}>
              <Text style={{ color: 'white', fontSize: 10 }}>{notificationCount}</Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Rate Cards */}
      <View style={styles.rateContainer}>
        <Text style={styles.title}>Today's Precious Metal Rates</Text>
        <View style={[styles.cardRow, { flexWrap: 'wrap' }]}>
          <View style={[styles.card, styles.goldCard, { width: width * 0.44 }]}>
            <Image source={require('../../assets/image/gold2.jpg')} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.metalLabel}>Gold (22K)</Text>
              <Text style={styles.metalPrice}>
                ₹{goldRate || '9,230'} <Text style={styles.unit}>/gm</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.card, styles.silverCard, { width: width * 0.44 }]}>
            <Image source={require('../../assets/image/silver1.jpg')} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.metalLabel}>Silver (22k)</Text>
              <Text style={styles.metalPrice}>
                ₹{silverRate || '120'} <Text style={styles.unit}>/gm</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scroll Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.sliderContainer}>
          <Slider />
        </View>

        {/* Animated Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => {
            const scaleAnim = menuAnimRefs.current[index];

            const handlePressIn = () => {
              Animated.spring(scaleAnim, {
                toValue: 0.9,
                useNativeDriver: true
              }).start();
            };

            const handlePressOut = () => {
              Animated.sequence([
                Animated.spring(scaleAnim, {
                  toValue: 1.1,
                  friction: 3,
                  useNativeDriver: true
                }),
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  useNativeDriver: true
                })
              ]).start(() => item.action && item.action());
            };

            return (
              <TouchableWithoutFeedback
                key={index}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Animated.View
                  style={[
                    styles.menuItem,
                    { transform: [{ scale: scaleAnim }] }
                  ]}
                >
                  <Icon name={item.icon} size={30} color={colors.primary} />
                  <Text style={styles.labeltext} >{item.label}</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© Jaiguru Jewellers 2025</Text>
        </View>
      </ScrollView>

      {/* Floating Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableWithoutFeedback onPress={() => navigateTo('tel:9876543210')}>
          <View style={[styles.floatingIcon, { backgroundColor: '#4CAF50' }]}>
            <Icon name='phone' size={24} color='white' />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigateTo('https://wa.me/917603905056')}>
          <View style={[styles.floatingIcon, { backgroundColor: '#25D366' }]}>
            <Icon name='whatsapp' size={24} color='white' />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Bottom Tab */}
      <BottomTab screen='HOME' />
      
    </SafeAreaView>
    
  );
};

export default HomeScreen;
