// OTP.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../utils/toast';
import { colors } from '../../utils/colors';
import { styles } from './OtpStyles';

function OTP({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    let countdown;
    if (isOtpVisible && timer > 0) {
      countdown = setTimeout(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setShowResend(true);
    }
    return () => clearTimeout(countdown);
  }, [timer, isOtpVisible]);

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/\D/g, '');
    setPhoneNumber(cleanedText);
    setIsPhoneValid(/^[6-9]\d{9}$/.test(cleanedText));
  };

  const sendOtp = async () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtp(['', '', '', '']);

    try {
      await axios.post('https://sms.krispal.in/api/smsapi', null, {
        params: {
          key: 'f22fc7c406cfd9b0f2767d436a1c7c69',
          route: '2',
          sender: 'VIMJEW',
          number: phoneNumber,
          sms: `Dear Customer, This is your OTP: ${otp} for Login. Thank you for Shopping - Vimala Jewellers - Manali`,
          templateid: '1707172725674467368',
        },
      });
      showToast('OTP sent successfully!');
      await AsyncStorage.setItem('userPhoneNumber', phoneNumber);
      setIsOtpVisible(true);
      setTimer(30);
      setShowResend(false);
    } catch (error) {
      showToast('Failed to send OTP. Please try again.');
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.join('') === generatedOtp) {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
        const response = await fetch(`https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`);
        if (response.ok) {
          const data = await response.json();
          if (data?.length > 0) await AsyncStorage.setItem('userName', data[0].pname || 'User');
        }
        await AsyncStorage.setItem('isOtpVerified', 'true');
        await AsyncStorage.removeItem('mpin');
        await AsyncStorage.removeItem('isMpinCreated');
        navigation.navigate('MpinScreen', { step: 3 });
      } catch (error) {
        showToast('Failed to verify OTP. Please try again.');
      }
    } else {
      showToast('Invalid OTP. Please try again.');
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
    else if (!value && index > 0) inputRefs.current[index - 1]?.focus();
  };

  return (
    <ImageBackground
      source={require('../../assets/image/otpbg.jpg')} // Replace with your background image path
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.welcomeText}>Welcome to Jaiguru Jewellers </Text>
        <Image source={require('../../assets/image/logo1.png')} style={styles.logoImage} />
        <Text style={styles.title}>Sign in / Sign up</Text>
        <Text style={styles.subtitle}>to continue to your account</Text>

        {!isOtpVisible && (
          <>
            <View style={[styles.inputWrapper, !isPhoneValid && phoneNumber.length === 10 && styles.inputError]}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="Mobile number"
                placeholderTextColor={colors.gray}
              />
            </View>
            {!isPhoneValid && phoneNumber.length === 10 && (
              <Text style={styles.errorText}>Enter a valid 10-digit Indian number starting with 6-9</Text>
            )}

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: isPhoneValid ? 'rgba(228, 157, 90, 0.9)' : '#ccc' }]}
              onPress={sendOtp}
              disabled={!isPhoneValid}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {isOtpVisible && (
          <>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                />
              ))}
            </View>

            <View style={styles.otpFooter}>
              {showResend ? (
                <TouchableOpacity onPress={sendOtp}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
              )}
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleVerifyOtp}>
              <Text style={styles.continueText}>Verify</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

export default OTP;
