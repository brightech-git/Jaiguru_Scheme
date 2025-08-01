// ProductCard.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { TextDefault } from '../../components';
import { alignment, colors, scale } from '../../utils';

function ProductCard({
  productData,
  loading,
  error,
  navigation,
  status,
  accountDetails,
}) {
  const isDreamGoldPlan =
    accountDetails?.schemeSummary?.schemeName?.trim() === 'DREAM GOLD PLAN';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.shimmerWrapper}>
        <ShimmerPlaceHolder
          style={styles.shimmerBox}
          autoRun={true}
          visible={false}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorWrapper}>
        <TextDefault style={{ color: colors.redColor }}>{error}</TextDefault>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() =>
        navigation.navigate('ProductDescription', {
          productData,
          status,
          accountDetails,
        })
      }
      style={styles.cardContainer}
    >
     <LinearGradient
  colors={['#ffffffff', '#ffffffff']}
  style={styles.gradientBackground}
>

        {/* Top Section */}
        <View style={styles.topRow}>
          <View style={styles.planLeft}>
            <TextDefault style={styles.titleText} numberOfLines={1}>
              {productData.groupcode} - {productData.regno}
            </TextDefault>
            <TextDefault style={styles.nameText} numberOfLines={1}>
              {productData.pname}
            </TextDefault>
          </View>
          <TextDefault style={styles.planName} numberOfLines={1}>
            {accountDetails?.schemeSummary?.schemeName?.trim()}
          </TextDefault>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <TextDefault style={styles.statusText}>{status}</TextDefault>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: status === 'Active' ? '#4CAF50' : '#F44336' },
            ]}
          />
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View>
            <TextDefault style={styles.infoLabel}>
              {isDreamGoldPlan ? 'Ins Paid' : 'Weight Saved*'}
            </TextDefault>
            <TextDefault style={styles.infoValue}>
              {isDreamGoldPlan
                ? `${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0} / ${accountDetails?.schemeSummary?.instalment || 0}`
                : `${productData.amountWeight?.Weight || 0}g`}
            </TextDefault>
          </View>
          <View>
            <TextDefault style={styles.infoLabel}>Total Amount*</TextDefault>
            <TextDefault style={styles.infoValue}>
              ₹{productData.amountWeight?.Amount || 0}
            </TextDefault>
          </View>
        </View>

        <View style={styles.yellowLine} />

        {/* Bottom Section */}
        <View style={styles.bottomRow}>
          <View style={styles.circle}>
            <TextDefault style={styles.circleText}>
              {isDreamGoldPlan ? 'Amount Saved' : 'Weight Saved'}
            </TextDefault>
            <TextDefault style={styles.circleValue}>
              {isDreamGoldPlan
                ? `₹${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.amtrecd || 0}`
                : `${productData.amountWeight?.Weight || 0}g`}
            </TextDefault>
          </View>

          <View style={styles.dateContainer}>
            <TextDefault style={styles.dateLabel}>Date of Maturity</TextDefault>
            <TextDefault style={styles.dateText}>
              {formatDate(productData.maturityDate)}
            </TextDefault>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ProductDescription', {
                  productData,
                  status,
                  accountDetails,
                })
              }
            >
              <TextDefault style={styles.buttonText}>View</TextDefault>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('Buy', {
                  productData,
                  status,
                  accountDetails,
                  isDreamGoldPlan,
                })
              }
            >
              <TextDefault style={styles.buttonText}>Pay</TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: scale(10),
    marginBottom: scale(12),
    borderRadius: scale(12),
    backgroundColor: '#ffffffff', // light card color from base
    padding: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  shimmerWrapper: {
    marginHorizontal: scale(10),
    marginVertical: scale(20),
  },
  shimmerBox: {
    width: '100%',
    height: scale(150),
    borderRadius: scale(12),
    backgroundColor: '#EAF7FF',
  },
  errorWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  gradientBackground: {
    borderRadius: scale(12),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(4),
  },
  planLeft: {
    flex: 1,
  },
  titleText: {
    fontSize: scale(14),
    color: '#00334D', // deep navy text
    fontFamily: 'TrajanPro-Bold',
  },
  nameText: {
    fontSize: scale(13),
    color: '#33667A', // softer secondary color
    marginTop: scale(2),
    marginBottom: scale(4),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: 'TrajanPro-Bold',
  },
  planName: {
    fontSize: scale(14),
    color: '#00334D',
    textAlign: 'right',
    fontFamily: 'TrajanPro-Bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: scale(6),
  },
  statusText: {
    fontSize: scale(13),
    color: '#4CAF50', // green success
    marginRight: scale(4),
    fontFamily: 'TrajanPro-Normal',
  },
  statusDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(4),
    backgroundColor: '#4CAF50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(5),
  },
  infoLabel: {
    fontSize: scale(10),
    color: '#33667A',
    marginBottom: scale(2),
    fontFamily: 'TrajanPro-Bold',
  },
  infoValue: {
    fontSize: scale(12),
    color: '#00334D',
    fontFamily: 'TrajanPro-Bold',
  },
  yellowLine: {
    height: 2,
    backgroundColor: '#FFC107', // accent yellow
    borderRadius: 1,
    marginVertical: scale(8),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(8),
  },
  circle: {
    backgroundColor: '#FFFFFF',
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  circleText: {
    fontSize: scale(10),
    color: '#00334D',
    textAlign: 'center',
    marginBottom: scale(4),
    fontFamily: 'TrajanPro-Bold',
  },
  circleValue: {
    fontSize: scale(12),
    color: '#E63946', // Red for emphasis
    fontFamily: 'TrajanPro-Bold',
  },
  dateContainer: {
    flex: 1,
    marginHorizontal: scale(6),
  },
  dateLabel: {
    fontSize: scale(10),
    color: '#33667A',
    marginBottom: scale(2),
    fontFamily: 'TrajanPro-Bold',
  },
  dateText: {
    fontSize: scale(12),
    color: '#00334D',
    fontFamily: 'TrajanPro-Bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: scale(6),
  },
  button: {
    borderWidth: 1,
    borderColor: '#00334D',
    paddingVertical: scale(4),
    paddingHorizontal: scale(10),
    borderRadius: scale(6),
    backgroundColor: '#EAF7FF',
  },
  buttonText: {
    fontSize: scale(11),
    color: '#00334D',
    fontFamily: 'TrajanPro-Bold',
  },
});





export default ProductCard;
