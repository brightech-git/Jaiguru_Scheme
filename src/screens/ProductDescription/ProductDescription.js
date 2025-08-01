import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing
} from 'react-native';
import { BackHeader } from '../../components';
import { alignment, colors, scale } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';

const SchemePassbook = ({ navigation, route }) => {
  const { productData, status, accountDetails } = route.params || {};
  console.log(accountDetails);
  console.log(productData)

  // Animation values
  const [scaleValue] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));

  // Extract user name and scheme name from accountDetails
  const userName = accountDetails?.personalInfo?.pName || 'User Name';
  const schemeName = accountDetails?.schemeSummary?.schemeName?.trim() || 'Scheme Name';
  const isDreamGoldPlan = schemeName === 'DREAM GOLD PLAN';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  };

  // Get payment history from accountDetails
  const paymentHistory = accountDetails?.paymentHistoryList || [];
  const totalAmountPaid = accountDetails?.schemeSummary?.schemaSummaryTransBalance?.amtrecd || '0';

  // Calculate progress for installments
  const insPaid = accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0;
  const totalIns = accountDetails?.schemeSummary?.instalment || 11;
  const progress = totalIns ? (insPaid / totalIns) * 100 : 0;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderPaymentHistory = ({ item, index }) => {
    return (
      <Animated.View 
        style={[
          styles.transactionItem,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleValue }] 
          }
        ]}
      >
        <View style={styles.statusContainer}>
          <Icon name="check-circle" size={scale(14)} color="#4CAF50" style={styles.statusIcon} />
          <Text style={styles.statusText}>PAID</Text>
        </View>
        <Text style={styles.transactionText}>{formatDateTime(item.updateTime)}</Text>
        <Text style={styles.transactionWText}>INST. {item.installment || '1'}</Text>
        <Text style={styles.transactioninrText}>₹ {item.amount || '0'}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        title="SCHEME PASSBOOK"
        backPressed={() => navigation.goBack()}
        titleStyle={styles.headerTitle}
      />

      <View style={styles.content}>
        {/* Gold Header Box with subtle animation */}
        <Animated.View 
          style={[
            styles.goldBox,
            { 
              transform: [{ 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                }) 
              }] 
            }
          ]}
        >
          <Text style={styles.userName}>{userName}</Text>
        </Animated.View>

        {/* Info Section */}
        <Animated.View 
          style={[
            styles.infoContainer,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleValue }] 
            }
          ]}
        >
          <View style={styles.schemeHeaderRow}>
            <Image
              source={require('../../assets/image/gold2.jpg')}
              style={styles.schemeIcon}
              resizeMode='contain'
            />
            <Text style={styles.schemeTitle}>
              {schemeName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumnLeft}>
              <Text style={styles.infoLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.infoValue}>₹ {totalAmountPaid}</Text>
            </View>
            <View style={styles.infoColumnRight}>
              <Text style={styles.infoLabel}>AVERAGE RATE /G</Text>
              <Text style={styles.infoValue}>
                ₹ {totalAmountPaid}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumnLeft}>
              <Text style={styles.infoLabel}>INSTALLMENTS PAID</Text>
              <Text style={styles.infoValue}>
                {insPaid} / {totalIns}
              </Text>
              
              {/* Progress Bar with animation */}
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressFill, 
                    { 
                      width: progress + '%',
                      opacity: fadeAnim 
                    }
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumnLeft}>
              <Text style={styles.infoLabel}>DATE OF JOIN</Text>
              <Text style={styles.infoValue}>
                {formatDate(productData?.joindate) || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoColumnRight}>
              <Text style={styles.infoLabel}>DATE OF MATURITY</Text>
              <Text style={styles.infoValue}>
                {formatDate(productData?.maturityDate) || 'N/A'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Transaction History */}
        <Animated.View 
          style={[
            styles.transactionContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.transactionHeaderRow}>
            <Text style={styles.transactionHeader}>TRANSACTION HISTORY</Text>
            {paymentHistory.length > 0 && (
              <TouchableOpacity
                style={styles.viewFullHistoryButton}
                onPress={() => navigation.navigate('PaymentHistory', {
                  accountDetails: accountDetails,
                  schemeName: schemeName
                })}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.7}
              >
                <FeatherIcon name="eye" size={scale(14)} color="#FFF" />
                <Text style={styles.viewFullHistoryText}> VIEW ALL</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Payment History List Headers */}
          <View style={styles.transactionColumnHeaderRow}>
            <Text style={styles.headerText}>STATUS</Text>
            <Text style={styles.headerText}>DATE</Text>
            <Text style={styles.headerText}>TOTAL</Text>
            <Text style={styles.headerText}>AMOUNT INR</Text>
          </View>

          {/* FlatList for Payment History */}
          {paymentHistory.length > 0 ? (
            <FlatList
              data={paymentHistory.slice(0, 3)}
              renderItem={renderPaymentHistory}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No payment history available</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF', // Base theme color
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#004E89', // Dark blue accent
    textTransform: 'uppercase',
    fontFamily: 'TrajanPro-Bold',
    letterSpacing: 1
  },
  content: {
    flex: 1,
    padding: scale(12),
  },
  goldBox: {
    height: scale(40),
    backgroundColor: '#B6E3FF', // Light blue header
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(10),
    shadowColor: '#A8CBE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  userName: {
    fontSize: scale(16),
    color: '#003B73',
    textTransform: 'uppercase',
    fontFamily: 'TrajanPro-Bold',
    letterSpacing: 1
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    padding: scale(20),
    shadowColor: '#D0E4F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#C2E2F2',
    marginBottom: scale(20),
  },
  schemeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#D9F0FB',
    paddingBottom: scale(10),
  },
  schemeIcon: {
    width: scale(32),
    height: scale(32),
    marginRight: scale(12),
    borderRadius: scale(16),
  },
  schemeTitle: {
    fontSize: scale(18),
    color: '#004E89',
    fontFamily: 'TrajanPro-Bold',
    letterSpacing: 0.5
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  infoLabel: {
    fontSize: scale(12),
    color: '#0077B6',
    marginBottom: scale(6),
    textTransform: 'uppercase',
    fontFamily: 'TrajanPro-Bold',
    letterSpacing: 0.5
  },
  infoValue: {
    fontSize: scale(16),
    color: '#002B5B',
    fontFamily: 'TrajanPro-Bold',
  },
  infoColumnLeft: {
    flex: 1,
  },
  infoColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressBackground: {
    width: '100%',
    height: scale(6),
    backgroundColor: '#D6EEFF',
    borderRadius: scale(4),
    marginTop: scale(8),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0077B6',
    borderRadius: scale(4),
  },
  transactionContainer: {
    flex: 1,
  },
  transactionHeader: {
    fontSize: scale(14),
    color: '#003B73',
    marginBottom: scale(12),
    textTransform: 'uppercase',
    fontFamily: 'TrajanPro-Bold',
    letterSpacing: 1
  },
  transactionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  transactionColumnHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderColor: '#B6E3FF',
    backgroundColor: '#E6F6FF',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    marginBottom: scale(8),
  },
  headerText: {
    fontSize: scale(12),
    color: '#004E89',
    flex: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'TrajanPro-Bold',
    letterSpacing: 0.5
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#D6EEFF',
    paddingHorizontal: scale(12),
    alignItems: 'center',
    backgroundColor: '#F7FBFF',
    borderRadius: scale(6),
    marginVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: scale(12),
    color: '#00B894',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold',
    textTransform: 'uppercase'
  },
  statusIcon: {
    marginRight: scale(6),
  },
  transactionText: {
    fontSize: scale(12),
    color: '#004E89',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold',
  },
  transactionWText: {
    fontSize: scale(12),
    color: '#004E89',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold',
    textTransform: 'uppercase'
  },
  transactioninrText: {
    fontSize: scale(12),
    color: '#0089C0',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(20),
  },
  noDataText: {
    color: '#004E89',
    fontSize: scale(12),
    opacity: 0.5,
    fontFamily: 'TrajanPro-Bold'
  },
  viewFullHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(7),
    backgroundColor: '#0077B6',
    borderRadius: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  viewFullHistoryText: {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    marginLeft: scale(4),
    textTransform: 'uppercase'
  },
});

export default SchemePassbook;