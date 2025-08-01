import { StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import { scale } from '../../utils/scaling';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: colors.baseBackground,
  },
  mainContainer: {
    flex: 1,
    padding: scale(15),
    backgroundColor: colors.baseBackground,
  },
  productInfoContainer: {
    marginBottom: scale(20),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(15),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: colors.fontMainColor,
    marginBottom: scale(10),
  },
  amountText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  savedWeightText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  benefitWeightText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  dateOfJoinText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  dateOfMaturityText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(20),
  },
  transactionHistoryContainer: {
    marginTop: scale(10),
  },
  transactionHistoryTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: colors.fontMainColor,
    marginBottom: scale(10),
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10),
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
    paddingBottom: scale(10),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
  },
  transactionStatus: {
    fontSize: scale(14),
    color: colors.fontMainColor,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: scale(14),
    color: colors.fontSecondColor,
  },
  transactionWeight: {
    fontSize: scale(14),
    color: colors.fontMainColor,
  },
  transactionIns: {
    fontSize: scale(14),
    color: colors.fontMainColor,
  },
});

export default styles;
