import { StyleSheet, Dimensions } from 'react-native'
import {
  verticalScale as Vs,
  scale as Sc,
  moderateScale as Ms
} from '../../utils/scaling'
import { colors } from '../../utils/colors'
import { textStyles } from '../../utils/textStyles'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#eaf7ff',
    paddingBottom: Vs(0)
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#d6eaff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    backgroundColor: '#ffffff'
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    color: '#00334d',
    fontFamily: 'TrajanPro-Bold'
  },

  // Metal Rate Section
  rateContainer: {
    backgroundColor: '#f0faff',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#00334d',
    fontFamily: 'TrajanPro-Bold'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    rowGap: 12
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  goldCard: {
    borderLeftColor: '#FFD700',
    borderLeftWidth: 4
  },
  silverCard: {
    borderLeftColor: '#c0c0c0',
    borderLeftWidth: 2
  },
  icon: {
    width: 50,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
    borderRadius: 20
  },
  textContainer: {
    flex: 1
  },
  metalLabel: {
    fontSize: 14,
    color: '#33667a',
    fontFamily: 'TrajanPro-Normal'
  },
  metalPrice: {
    fontSize: 16,
    color: '#00334d',
    fontFamily: 'TrajanPro-Bold'
  },
  unit: {
    fontSize: 12,
    color: '#5f7d8a',
    fontFamily: 'TrajanPro-Normal'
  },

  // Slider section
  sliderContainer: {
    margin: 0,
    height: 200,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden'
  },

  // Menu Grid
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Sc(20),
    paddingTop: Vs(25),
    paddingBottom: Vs(10),
    backgroundColor: '#e0f2fc'
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: Vs(24),
    backgroundColor: '#ffffff',
    paddingVertical: Vs(16),
    borderRadius: Sc(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  menuText: {
    ...textStyles.Normal,
    color: '#33667a',
    marginTop: Vs(8),
    textAlign: 'center',
    fontFamily: 'TrajanPro-Normal'
  },
  labeltext: {
    ...textStyles.Normal,
    color: '#00334d',
    marginTop: Vs(8),
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold'
  },

  // Floating contact buttons
  floatingButtons: {
    position: 'absolute',
    bottom: Sc(70),
    right: Sc(7),
    flexDirection: 'column',
    gap: Vs(10)
  },
  floatingIcon: {
    width: Sc(34),
    height: Sc(34),
    borderRadius: Sc(27),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0096c7',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 7
  },

  // Footer
  footer: {
    padding: Vs(12),
    backgroundColor: '#d6eaff',
    alignItems: 'center',
    marginBottom: Vs(10)
  },
  footerText: {
    ...textStyles.Small,
    color: '#00334d',
    textAlign: 'center',
    lineHeight: Vs(18),
    fontSize: Sc(12),
    fontFamily: 'TrajanPro-Bold'
  },

  // Notification Badge
  notificationWrapper: {
    position: 'relative',
    padding: 4
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#e63946',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'TrajanPro-Bold'
  }
})
