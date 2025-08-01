import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert, 
  BackHandler,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { alignment, colors } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { showToast } from '../../utils/toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Constants
const API_BASE_URL = 'https://akj.brightechsoftware.com';
const POLLING_INTERVAL = 5000;
const POLLING_TIMEOUT = 300000;

function Buy() {
  // State variables
  const [amount, setAmount] = useState('');
  const [weight, setWeight] = useState('');
  const [goldRate, setGoldRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [goldRateError, setGoldRateError] = useState(false);

  // Animation refs
  const cardAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Refs for cleanup
  const verifyIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const navigation = useNavigation();
  const route = useRoute();
  
  // Route params
  const passedGoldRate = route.params?.goldRate;
  const isDreamGoldPlan = route.params?.isDreamGoldPlan;
  const accountDetails = route.params?.accountDetails;
  const productData = route.params?.productData;

  // Animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        friction: 5,
        tension: 30,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Handle back button when WebView is open
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showWebView) {
          Alert.alert(
            'Cancel Payment',
            'Are you sure you want to cancel the payment?',
            [
              { text: 'No', style: 'cancel' },
              { 
                text: 'Yes', 
                onPress: () => {
                  clearPaymentPolling();
                  setShowWebView(false);
                }
              },
            ]
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [showWebView])
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearPaymentPolling();
    };
  }, []);

  // Get user details from AsyncStorage
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const [storedPhoneNumber, storedUserName] = await Promise.all([
          AsyncStorage.getItem('userPhoneNumber'),
          AsyncStorage.getItem('userName')
        ]);
        
        if (isMountedRef.current) {
          if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
          if (storedUserName) setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Error getting user details:', error);
        if (isMountedRef.current) {
          Alert.alert('Error', 'Failed to load user details. Please login again.');
        }
      }
    };
    getUserDetails();
  }, []);

  // Set initial amount for dream gold plan
  useEffect(() => {
    if (isDreamGoldPlan && accountDetails?.amount) {
      const initialAmount = accountDetails.amount.toString();
      setAmount(initialAmount);
      convertAmountToWeight(initialAmount);
    }
  }, [isDreamGoldPlan, accountDetails, goldRate]);

  // Fetch gold rate from API
  const fetchGoldRate = async () => {
    try {
      setGoldRateError(false);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/v1/api/account/todayrate`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch gold rate`);
      }

      const data = await response.json();
      
      if (!data.Rate || isNaN(data.Rate)) {
        throw new Error('Invalid gold rate received from server');
      }

      if (isMountedRef.current) {
        setGoldRate(data.Rate);
      }
    } catch (error) {
      console.error('Error fetching gold rate:', error);
      if (isMountedRef.current) {
        setGoldRateError(true);
        setGoldRate(null);
        
        if (error.name !== 'AbortError') {
          Alert.alert(
            'Error',
            'Failed to fetch current gold rate. Please check your internet connection and try again.',
            [
              { text: 'Retry', onPress: fetchGoldRate },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initialize gold rate
  useEffect(() => {
    if (passedGoldRate && !isNaN(passedGoldRate)) {
      setGoldRate(passedGoldRate);
      setLoading(false);
    } else {
      fetchGoldRate();
    }
  }, [passedGoldRate]);

  // Convert amount to weight
  const convertAmountToWeight = useCallback((amount) => {
    if (goldRate && amount && !isNaN(amount) && amount > 0) {
      const weightInGrams = (parseFloat(amount) / goldRate).toFixed(3);
      setWeight(weightInGrams);
    } else {
      setWeight('');
    }
  }, [goldRate]);

  // Handle amount input change
  const handleAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9.]/g, '');
    const parts = sanitizedText.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setAmount(sanitizedText);
    convertAmountToWeight(sanitizedText);
  };

  // Clear payment polling intervals
  const clearPaymentPolling = () => {
    if (verifyIntervalRef.current) {
      clearInterval(verifyIntervalRef.current);
      verifyIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Validate payment inputs
  const validatePaymentInputs = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount greater than 0');
      return false;
    }

    if (parseFloat(amount) < 1) {
      showToast('Minimum payment amount is ₹1');
      return false;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Valid phone number not found. Please login again.');
      return false;
    }

    if (!userName || userName.trim().length === 0) {
      showToast('User name not found. Please login again.');
      return false;
    }

    if (!productData || !productData.regno || !productData.groupcode) {
      showToast('Product details are missing. Please try again.');
      return false;
    }

    if (!goldRate) {
      showToast('Gold rate not available. Please refresh and try again.');
      return false;
    }

    return true;
  };

  // Create payment link
  const createPaymentLink = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          customer: {
            name: userName.trim(),
            contact: phoneNumber,
            REGNO: productData.regno,
            GROUPCODE: productData.groupcode,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to generate payment link'}`);
      }

      const responseText = await response.text();
      console.log('Payment Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!data || !data.payment_link || !data.order_id) {
        console.error('Invalid response data:', data);
        throw new Error('Payment link or order ID not received from server');
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  // Start payment verification polling
  const startPaymentVerification = (orderId) => {
    clearPaymentPolling();

    verifyIntervalRef.current = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const verifyResponse = await fetch(
          `${API_BASE_URL}/api/payment/verify?orderId=${orderId}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        clearTimeout(timeoutId);

        if (!verifyResponse.ok) {
          console.warn('Verification request failed:', verifyResponse.status);
          return;
        }

        const verifyData = await verifyResponse.json();
        console.log('Verification response:', verifyData);
        
        if (verifyData.razorpay_status === 'paid' && verifyData.success) {
          clearPaymentPolling();
          
          if (isMountedRef.current) {
            setShowWebView(false);
            Alert.alert(
              'Payment Successful! 🎉',
              `Payment of ₹${amount} completed successfully. Your gold purchase has been processed.`,
              [
                {
                  text: 'Continue',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'MainLanding' }],
                    });
                  },
                },
              ]
            );
          }
        } else if (verifyData.razorpay_status === 'failed' || verifyData.razorpay_status === 'cancelled') {
          clearPaymentPolling();
          
          if (isMountedRef.current) {
            setShowWebView(false);
            Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    }, POLLING_INTERVAL);

    timeoutRef.current = setTimeout(() => {
      clearPaymentPolling();
      if (isMountedRef.current && showWebView) {
        Alert.alert(
          'Payment Timeout',
          'Payment verification timed out. Please check your payment status manually or contact support.',
          [
            {
              text: 'OK',
              onPress: () => setShowWebView(false),
            },
          ]
        );
      }
    }, POLLING_TIMEOUT);
  };

  // Handle payment process
  const handlePay = async () => {
    if (!validatePaymentInputs()) return;

    try {
      setPaymentLoading(true);
      
      // Button press animation
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(buttonAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();

      const paymentData = await createPaymentLink();
      
      if (isMountedRef.current) {
        setOrderId(paymentData.order_id);
        setPaymentUrl(paymentData.payment_link);
        setShowWebView(true);
        startPaymentVerification(paymentData.order_id);
      }

    } catch (error) {
      console.error('Payment error:', error);
      if (isMountedRef.current) {
        Alert.alert(
          'Payment Error',
          error.message || 'Failed to process payment. Please try again.',
          [
            { text: 'OK' }
          ]
        );
      }
    } finally {
      if (isMountedRef.current) {
        setPaymentLoading(false);
      }
    }
  };

  // Handle WebView navigation changes
  const handleWebViewNavigationStateChange = (navState) => {
    const url = navState.url.toLowerCase();
    if (url.includes('success') || url.includes('payment-success') || url.includes('completed')) {
      console.log('Success URL detected, waiting for verification...');
    } else if (url.includes('failure') || url.includes('payment-failed') || url.includes('cancelled')) {
      clearPaymentPolling();
      setShowWebView(false);
      showToast('Payment was not successful. Please try again.');
    }
  };

  // Handle WebView errors
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    showToast('Failed to load payment page. Please check your internet connection and try again.');
  };

  // WebView component
  if (showWebView) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Alert.alert(
                'Cancel Payment',
                'Are you sure you want to cancel the payment?',
                [
                  { text: 'No', style: 'cancel' },
                  { 
                    text: 'Yes', 
                    onPress: () => {
                      clearPaymentPolling();
                      setShowWebView(false);
                    }
                  },
                ]
              );
            }}
          >
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>Complete Payment</Text>
          <View style={{ width: 40 }} />
        </View>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading payment page...</Text>
            </View>
          )}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Gold Rate Card */}
        {!isDreamGoldPlan && (
          <Animated.View style={[
            styles.card,
            {
              transform: [{
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }],
              opacity: cardAnim
            }
          ]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Current Buying Rate</Text>
              <Text style={styles.cardSubtitle}>Value added and GST will be applicable</Text>
            </View>
            <View style={styles.rateCard}>
              <Image 
                source={require('../../assets/gold.png')} 
                style={styles.goldImage} 
              />
              <View style={styles.rateTextContainer}>
                <Text style={styles.goldText}>Gold 22K (916)</Text>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : goldRateError ? (
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={fetchGoldRate}
                  >
                    <Icon name="refresh" size={16} color={colors.danger} />
                    <Text style={styles.retryText}>Tap to retry</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.rateText}>₹{goldRate} / gm</Text>
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Main Payment Card */}
        <Animated.View style={[
          styles.card,
          styles.mainCard,
          {
            transform: [{
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }],
            opacity: cardAnim
          }
        ]}>
          {isDreamGoldPlan ? (
            <>
              <Text style={styles.cardTitle}>DREAM GOLD PLAN</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Group Code</Text>
                  <Text style={styles.detailValue}>{productData?.groupcode || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Membership No</Text>
                  <Text style={styles.detailValue}>{productData?.regno || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Scheme Amount</Text>
                  <Text style={styles.detailValue}>{productData?.amountWeight?.Amount || '-'}</Text>
                </View>
              </View>
              <Text style={styles.paymentOptionsLabel}>Payment Options</Text>
              <View style={styles.paymentMethods}>
                <Image 
                  source={require('../../assets/images/gpay.jpeg')} 
                  style={styles.paymentMethodIcon} 
                />
                {/* <Image 
                  source={require('../../assets/images/gpay.jpeg')} 
                  style={styles.paymentMethodIcon} 
                />
                <Image 
                  source={require('../../assets/images/gpay.jpeg')} 
                  style={styles.paymentMethodIcon} 
                /> */}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Quick Pay</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Amount (₹)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={amount}           
                    onChangeText={handleAmountChange}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.gray}
                  />
                </View>
                
                <View style={styles.swapIconContainer}>
                  <Icon name="swap-horiz" size={28} color={colors.primary} />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Weight (grams)</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={weight}
                    editable={false}
                    placeholder="Auto calculated"
                    placeholderTextColor={colors.gray}
                  />
                </View>
              </View>
              
              {amount && goldRate && (
                <Text style={styles.infoText}>
                  You will purchase {weight}g of 22K gold
                </Text>
              )}
            </>
          )}

          <Animated.View style={{
            transform: [{ scale: buttonAnim }]
          }}>
            <TouchableOpacity 
              style={[
                styles.payButton,
                (paymentLoading || loading || !goldRate || !amount || parseFloat(amount) <= 0) && styles.disabledButton
              ]} 
              onPress={handlePay}
              disabled={paymentLoading || loading || !goldRate || !amount || parseFloat(amount) <= 0}
              activeOpacity={0.8}
            >
              {paymentLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.payButtonText}>
                    {amount && goldRate ? `Pay ₹${amount}` : 'Proceed to pay'}
                  </Text>
                  <Icon name="arrow-forward" size={20} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F3',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  mainCard: {
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 12,
  },
  goldImage: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  rateTextContainer: {
    flex: 1,
  },
  goldText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  rateText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryText: {
    fontSize: 14,
    color: colors.danger,
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  paymentOptionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#dfe6e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: colors.white,
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
    color: '#7f8c8d',
  },
  swapIconContainer: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#FDF9F3",
    borderWidth:1
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    shadowColor: '#7f8c8d',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  webViewLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default Buy;