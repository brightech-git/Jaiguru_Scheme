import { StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import { alignment } from '../../utils';

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.9,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 1,
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: colors.black,
    fontFamily: 'TrajanPro-Bold',
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  titleSpacer: {
    marginTop: 10,
  },
  scrollContainer: {
    paddingVertical: 20,
    padding: 20,
  },
  grayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    // fontWeight: 'bold',
    color: colors.black,
    alignSelf: 'flex-start',
    fontFamily: 'TrajanPro-Bold',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.fontThirdColor,
    marginLeft: 5,
    fontFamily: 'TrajanPro-Normal',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightpink,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tripButtonText: {
    fontSize: 13,
    color: colors.fontMainColor,
    marginRight: 5,
    // fontWeight: 'bold',
    fontFamily: 'TrajanPro-Bold',
  },
  title: {
    ...alignment.PxSmall,
    ...alignment.PLxSmall,
    // fontWeight: 'bold',
    fontSize: 18,
    color: colors.greenColor,
    fontFamily: 'TrajanPro-Bold',
  },
  likeIconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  titleSpacer1:{
    // alignItems:"center",
    textAlign:"center",
    justifyContent:"center",
    paddingTop:300,
     fontFamily: 'TrajanPro-Bold',
  }
});

export default styles;
