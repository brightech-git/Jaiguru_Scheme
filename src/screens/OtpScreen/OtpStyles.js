// OTPStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale } from '../../utils/scaling';
import { colors } from '../../utils/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width,
    height,
    resizeMode: 'cover',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
  },

  welcomeText: {
    fontSize: scale(18),
    fontWeight: '500',
    color: colors.gray,
    textAlign: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    fontFamily: 'TrajanPro-Bold',
    lineHeight: scale(24),
  },

  logoImage: {
    width: scale(180),
    height: scale(180),
    resizeMode: 'contain',
    marginBottom: verticalScale(10),
  },

  title: {
    fontSize: scale(22),
    color: colors.black,
    marginBottom: verticalScale(10),
    fontFamily: 'TrajanPro-Bold',
  },

  subtitle: {
    fontSize: scale(14),
    color: colors.gray,
    marginBottom: verticalScale(20),
    fontFamily: 'TrajanPro-Bold',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    backgroundColor: colors.white,
    marginBottom: verticalScale(10),
  },

  inputError: {
    borderColor: colors.red,
  },

  errorText: {
    color: colors.red,
    fontSize: scale(12),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(10),
    fontFamily: 'TrajanPro-Bold',
  },

  prefix: {
    fontSize: scale(16),
    color: colors.black,
    marginRight: scale(10),
    fontFamily: 'TrajanPro-Bold',
  },

  input: {
    flex: 1,
    height: scale(45),
    fontSize: scale(16),
    color: colors.black,
    fontFamily: 'TrajanPro-Bold',
  },

  continueButton: {
    width: '100%',
    height: scale(45),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(30),
    backgroundColor: colors.ButtonColor,
  },

  continueText: {
    color: colors.white,
    fontSize: scale(16),
    fontFamily: 'TrajanPro-Bold',
  },

  otpLabel: {
    fontSize: scale(16),
    marginBottom: verticalScale(10),
    color: colors.black,
    fontFamily: 'TrajanPro-Bold',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: verticalScale(20),
  },

  otpInput: {
    width: scale(45),
    height: scale(50),
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: scale(8),
    textAlign: 'center',
    fontSize: scale(18),
    backgroundColor: colors.white,
    fontFamily: 'TrajanPro-Bold',
  },

  otpFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '80%',
    marginBottom: verticalScale(20),
  },

  resendText: {
    color: colors.errorColor,
    fontSize: scale(14),
    textDecorationLine: 'underline',
    fontFamily: 'TrajanPro-Bold',
  },

  timerText: {
    color: colors.gray,
    fontSize: scale(14),
    fontFamily: 'TrajanPro-Bold',
  },

  signupWrapper: {
    marginTop: verticalScale(10),
  },

  signupText: {
    color: colors.gray,
    fontSize: scale(14),
    fontFamily: 'TrajanPro-Bold',
  },

  signupLink: {
    color: 'red',
    fontFamily: 'TrajanPro-Bold',
  },
  container: {
  flex: 1,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

overlay: {
  flex: 1,
  width: '100%',
  paddingHorizontal: scale(20),
  // backgroundColor: 'rgba(255,255,255,0.85)', 
  justifyContent: 'center',
  alignItems: 'center',
},

});
