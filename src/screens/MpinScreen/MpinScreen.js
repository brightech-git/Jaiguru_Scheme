import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Dimensions,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
  AppState
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
// import { Theme } from '../../utils/GlobalStyles';
import styles from './MpinStyles';

const { width, height } = Dimensions.get('window');
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// Toast utility
const showToast = (message) => {
  Platform.OS === 'android'
    ? ToastAndroid.show(message, ToastAndroid.SHORT)
    : Alert.alert('', message);
};

// Background image (replace with your actual image path)
const BACKGROUND_IMAGE = require('../../assets/image/otpbg.jpg');

// ─────────────── Create MPIN Screen ───────────────
function MpinScreen({ navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showMpin, setShowMpin] = useState(false); // Toggle MPIN visibility
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const bgScrollAnimation = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Background scroll animation
    Animated.loop(
      Animated.timing(bgScrollAnimation, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    checkIfMpinCreated();
  }, []);

  const checkIfMpinCreated = async () => {
    const isCreated = await AsyncStorage.getItem('isMpinCreated');
    if (isCreated === 'true') navigation.replace('VerifyMpin');
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleMpinChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    const updated = [...mpin];
    updated[index] = value;
    setMpin(updated);
    value && index < 3 && inputRefs.current[index + 1]?.focus();
    !value && index > 0 && inputRefs.current[index - 1]?.focus();
  };

  const handleKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && !mpin[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleCreateMpin = async () => {
    if (mpin.join('').length !== 4) {
      triggerShake();
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    // Simple MPIN validation
    if (/^(\d)\1{3}$/.test(mpin.join(''))) { // All same digits
      triggerShake();
      showToast('Weak MPIN. Avoid using repeating digits.');
      return;
    }

    if (mpin.join('') === '1234' || mpin.join('') === '0000') { // Common patterns
      triggerShake();
      showToast('Please choose a more secure MPIN.');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('mpin', mpin.join(''));
      await AsyncStorage.setItem('isMpinCreated', 'true');
      showToast('MPIN created successfully!');
      
      // Success animation
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => navigation.replace('Drawer'));
    } catch (error) {
      showToast('Failed to save MPIN. Please try again.');
      setIsLoading(false);
    }
  };

  const toggleMpinVisibility = () => {
    setShowMpin(!showMpin);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View 
          style={[
            styles.backgroundOverlay,
            {
              transform: [{
                translateX: bgScrollAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -width * 0.3]
                })
              }]
            }
          ]}
        />

        <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <LottieView 
                  source={require('../../assets/animations/lock.json')} 
                  autoPlay 
                  loop 
                  style={styles.lockAnimation} 
                />
                <Text style={styles.title}>Secure Your Account</Text>
                <Text style={styles.subtitle}>Create a 4-digit MPIN for quick and secure access</Text>
              </View>

              <Animated.View style={[styles.mpinContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                <View style={styles.mpinHeader}>
                  <Text style={styles.mpinLabel}>Enter your MPIN</Text>
                  <TouchableOpacity onPress={toggleMpinVisibility} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                      {showMpin ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.mpinInputsContainer}>
                  {mpin.map((digit, i) => (
                    <AnimatedTextInput
                      key={i}
                      ref={(ref) => (inputRefs.current[i] = ref)}
                      style={[
                        styles.mpinInput, 
                        digit ? styles.mpinInputFilled : {},
                        i === 0 && styles.leftRadius, 
                        i === 3 && styles.rightRadius
                      ]}
                      maxLength={1}
                      keyboardType="numeric"
                      secureTextEntry={!showMpin}
                      value={digit}
                      onChangeText={(val) => handleMpinChange(val, i)}
                      onKeyPress={(e) => handleKeyPress(e, i)}
                      textAlign="center"
                      autoFocus={i === 0}
                    />
                  ))}
                </View>

                <View style={styles.dotContainer}>
                  {mpin.map((digit, i) => (
                    <View 
                      key={`dot-${i}`} 
                      style={[
                        styles.dot, 
                        digit && styles.dotFilled,
                        showMpin && digit && styles.dotVisible
                      ]} 
                    />
                  ))}
                </View>
              </Animated.View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCreateMpin}
                  disabled={mpin.join('').length !== 4 || isLoading}
                  style={[
                    styles.primaryButton, 
                    mpin.join('').length === 4 && styles.primaryButtonActive, 
                    isLoading && styles.primaryButtonDisabled
                  ]}
                  activeOpacity={0.7}
                >
                  {isLoading ? (
                    <LottieView 
                      source={require('../../assets/animations/loading.json')} 
                      autoPlay 
                      loop 
                      style={styles.loadingAnimation} 
                    />
                  ) : (
                    <Text style={styles.primaryButtonText}>Create MPIN</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  style={styles.secondaryButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

// ─────────────── Verify MPIN Screen ───────────────
function VerifyMpinScreen({ navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const bgScrollAnimation = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  // Cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Animation effects
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(bgScrollAnimation, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // App state listener
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setMpin(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleMpinChange = (value, index) => {
    if (cooldown > 0) return;
    if (value && !/^\d$/.test(value)) return;
    const updated = [...mpin];
    updated[index] = value;
    setMpin(updated);
    value && index < 3 && inputRefs.current[index + 1]?.focus();
    !value && index > 0 && inputRefs.current[index - 1]?.focus();
  };

  const handleKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && !mpin[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerifyMpin = async () => {
    if (cooldown > 0) return;
    if (mpin.join('').length !== 4) {
      triggerShake();
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    setIsLoading(true);
    try {
      const savedMpin = await AsyncStorage.getItem('mpin');
      if (mpin.join('') === savedMpin) {
        showToast('MPIN verified successfully!');
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => navigation.replace('Drawer'));
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setLastAttemptTime(Date.now());
        setMpin(['', '', '', '']);
        inputRefs.current[0]?.focus();
        triggerShake();

        if (newAttempts >= 3) {
          // Apply cooldown after 3 attempts
          const newCooldown = Math.min(30, 5 * Math.pow(2, Math.floor(newAttempts / 3) - 5));
          setCooldown(newCooldown);
          
          Alert.alert(
            'Too Many Attempts',
            `Please wait ${newCooldown} seconds before trying again.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Reset MPIN', 
                onPress: () => navigation.replace('OTP') 
              }
            ]
          );
        } else {
          showToast(`Incorrect MPIN. ${3 - newAttempts} attempts remaining.`);
        }
      }
    } catch (e) {
      showToast('Failed to verify MPIN. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMpinVisibility = () => {
    setShowMpin(!showMpin);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View 
          style={[
            styles.backgroundOverlay,
            {
              transform: [{
                translateX: bgScrollAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -width * 0.3]
                })
              }]
            }
          ]}
        />

        <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <LottieView
                  source={require('../../assets/animations/lock.json')}
                  autoPlay
                  loop
                  style={styles.lockAnimation}
                />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Enter your MPIN to access your account</Text>
              </View>

              <Animated.View style={[styles.mpinContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                <View style={styles.mpinHeader}>
                  <Text style={styles.mpinLabel}>Enter your MPIN</Text>
                  <TouchableOpacity onPress={toggleMpinVisibility} style={styles.toggleButton}>
                    <Text style={styles.toggleButtonText}>
                      {showMpin ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.mpinInputsContainer}>
                  {mpin.map((digit, i) => (
                    <AnimatedTextInput
                      key={i}
                      ref={(ref) => (inputRefs.current[i] = ref)}
                      style={[
                        styles.mpinInput,
                        i === 0 && styles.leftRadius,
                        i === 3 && styles.rightRadius
                      ]}
                      maxLength={1}
                      keyboardType="numeric"
                      secureTextEntry={!showMpin}
                      value={digit}
                      onChangeText={(val) => handleMpinChange(val, i)}
                      onKeyPress={(e) => handleKeyPress(e, i)}
                      textAlign="center"
                      editable={cooldown === 0}
                      autoFocus={i === 0}
                    />
                  ))}
                </View>

                {cooldown > 0 && (
                  <Text style={styles.cooldownText}>
                    Try again in {cooldown} seconds
                  </Text>
                )}
              </Animated.View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleVerifyMpin}
                  disabled={mpin.join('').length !== 4 || isLoading || cooldown > 0}
                  style={[
                    styles.primaryButton,
                    mpin.join('').length === 4 && cooldown === 0 && styles.primaryButtonActive,
                    (isLoading || cooldown > 0) && styles.primaryButtonDisabled
                  ]}
                  activeOpacity={0.7}
                >
                  {isLoading ? (
                    <LottieView
                      source={require('../../assets/animations/loading.json')}
                      autoPlay
                      loop
                      style={styles.loadingAnimation}
                    />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {cooldown > 0 ? `Wait ${cooldown}s` : 'Verify MPIN'}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigation.replace('OTP')} 
                  style={styles.secondaryButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryButtonText}>Forgot MPIN?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

export { MpinScreen, VerifyMpinScreen };