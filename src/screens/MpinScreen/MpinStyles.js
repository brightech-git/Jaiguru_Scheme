import { StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale } from '../../utils/scaling';
import { colors } from '../../utils/colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    // backgroundColor: colors.primaryDark, 
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  lockAnimation: {
    width: scale(100),
    height: scale(100),
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: colors.black,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: scale(16),
    color: colors.darkGray,
    marginTop: verticalScale(5),
    textAlign: 'center',
    lineHeight: scale(22),
  },
  mpinContainer: {
    marginBottom: verticalScale(30),
  },
  mpinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
    alignItems: 'center',
  },
  mpinLabel: {
    fontSize: scale(16),
    color: colors.darkGray,
    fontWeight: '600',
  },
  toggleButton: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
  },
  toggleButtonText: {
    fontSize: scale(14),
    color: colors.accentBlue,
    fontWeight: '500',
  },
  mpinInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(10),
  },
  mpinInput: {
    width: scale(60),
    height: scale(60),
    backgroundColor: colors.white,
    color: colors.black,
    marginHorizontal: scale(5),
    borderRadius: scale(12),
    fontSize: scale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  mpinInputFocused: {
    borderColor: colors.accentBlue,
    backgroundColor: colors.inputFocused,
  },
  mpinInputFilled: {
    borderColor: colors.accentGreen,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(20),
  },
  dot: {
    width: scale(12),
    height: scale(12),
    backgroundColor: colors.lightGray,
    borderRadius: scale(6),
    marginHorizontal: scale(6),
  },
  dotFilled: {
    backgroundColor: colors.accentBlue,
  },
  cooldownText: {
    marginTop: verticalScale(15),
    color: colors.errorRed,
    textAlign: 'center',
    fontSize: scale(14),
  },
  buttonContainer: {
    marginTop: verticalScale(30),
  },
  primaryButton: {
    backgroundColor: colors.accentBlue,
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: verticalScale(15),
    elevation: 3,
    shadowColor: colors.accentBlueShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  primaryButtonActive: {
    backgroundColor: colors.accentBlueDark,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.disabledGray,
  },
  primaryButtonText: {
    fontSize: scale(18),
    color: colors.white,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  secondaryButtonText: {
    fontSize: scale(16),
    color: colors.accentBlue,
    fontWeight: '500',
  },
  footerText: {
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontSize: scale(12),
  },
});