import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { BackHeader } from '../../components';
import { alignment, colors, scale } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' • ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return 'N/A';
  }
};

const PaymentItem = React.memo(({ item, index, animDelay }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay: animDelay + (index * 100),
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        delay: animDelay + (index * 100),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay: animDelay + (index * 100),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.paymentItem,
        {
          opacity,
          transform: [
            { translateY },
            { scale }
          ],
        },
      ]}
    >
      <View style={styles.paymentContainer}>
        <View style={styles.paymentHeader}>
          <View style={styles.receiptContainer}>
            <View style={styles.receiptIcon}>
              <Feather name="credit-card" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.receiptText}>
              RECEIPT #{item.receiptNo}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.statusText}>PAID</Text>
          </View>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Installment:</Text>
            <Text style={styles.detailValue}>INST. {item.installment}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={[styles.detailValue, styles.amountText]}>
              ₹{item.amount}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(item.updateTime)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

const PaymentHistory = ({ navigation, route }) => {
  const { accountDetails = { paymentHistoryList: [] }, schemeName = 'Payment Scheme' } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [paymentHistory, setPaymentHistory] = useState([]);
  const headerScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (Array.isArray(accountDetails?.paymentHistoryList)) {
      const formatted = accountDetails.paymentHistoryList.map(payment => ({
        receiptNo: payment?.receiptNo || `N/A-${Math.random().toString(36).substr(2, 5)}`,
        installment: payment?.installment || 'N/A',
        amount: payment?.amount || '0',
        updateTime: payment?.updateTime || new Date().toISOString(),
      }));
      setPaymentHistory(formatted);
    }

    // Header animation
    Animated.spring(headerScale, {
      toValue: 1,
      delay: 100,
      useNativeDriver: true,
    }).start();

    // Content animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [accountDetails]);

  const totalAmountPaid = paymentHistory.reduce((total, payment) => {
    const amt = parseFloat(payment.amount) || 0;
    return total + amt;
  }, 0);

  const renderPaymentHistory = ({ item, index }) => (
    <PaymentItem item={item} index={index} animDelay={400} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ transform: [{ scale: headerScale }] }}>
        <View style={styles.headerContainer}>
          <BackHeader
            title="PAYMENT HISTORY"
            backPressed={() => navigation.goBack()}
            titleStyle={styles.headerTitle}
            backColor="#FFFFFF"
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Summary Card */}
        <Animated.View 
          style={[
            styles.summaryCard,
            {
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }]
            }
          ]}
        >
          <View style={styles.summaryContainer}>
            <Text style={styles.schemeTitle}>{schemeName}</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>TOTAL PAID</Text>
                <Animated.Text 
                  style={[
                    styles.summaryValue,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }]
                    }
                  ]}
                >
                  ₹{totalAmountPaid.toFixed(2)}
                </Animated.Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>PAYMENTS</Text>
                <Animated.Text 
                  style={[
                    styles.summaryValue,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }]
                    }
                  ]}
                >
                  {paymentHistory.length}
                </Animated.Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Payment History List */}
        <View style={styles.historyContainer}>
          <Animated.View 
            style={[
              styles.historyHeader,
              {
                opacity: fadeAnim,
                transform: [{
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.historyTitle}>TRANSACTION DETAILS</Text>
            {/* <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Feather name="filter" size={16} color="#FFFFFF" />
              <Text style={styles.filterText}>FILTER</Text>
            </TouchableOpacity> */}
          </Animated.View>

          {paymentHistory.length > 0 ? (
            <FlatList
              data={paymentHistory}
              renderItem={renderPaymentHistory}
              keyExtractor={(item) => item.receiptNo}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <Animated.View
              style={[
                styles.noDataContainer, 
                { 
                  opacity: fadeAnim,
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1]
                    })
                  }]
                }
              ]}
            >
              <Feather name="inbox" size={48} color="#D4AF37" />
              <Text style={styles.noDataText}>No Payment History</Text>
              <Text style={styles.noDataSubtext}>
                Your completed payments will appear here
              </Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF', // Soft blue background
  },
  headerContainer: {
    backgroundColor: '#DCEEFF', // Light blue header
    paddingTop: scale(10),
    paddingBottom: scale(15),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    shadowColor: '#A0C4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerTitle: {
    fontSize: scale(18),
    fontFamily: 'TrajanPro-Bold',
    color: '#1E2A38', // Deep navy
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: scale(16),
  },
  summaryCard: {
    borderRadius: 20,
    marginBottom: scale(20),
    backgroundColor: '#FFFFFF',
    shadowColor: '#C0DAF7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContainer: {
    borderRadius: 20,
    padding: scale(20),
    borderWidth: 1,
    borderColor: '#CBE5FF',
    backgroundColor: '#F6FAFD', // Subtle light background
  },
  schemeTitle: {
    color: '#1E2A38',
    fontSize: scale(20),
    fontFamily: 'TrajanPro-Bold',
    marginBottom: scale(16),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#CBE5FF',
    marginHorizontal: scale(10),
  },
  summaryLabel: {
    color: '#4A6A85',
    fontSize: scale(12),
    marginBottom: scale(6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'TrajanPro-Bold',
  },
  summaryValue: {
    color: '#1E2A38',
    fontSize: scale(20),
    fontFamily: 'TrajanPro-Bold',
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
    paddingHorizontal: scale(5),
  },
  historyTitle: {
    fontSize: scale(16),
    fontFamily: 'TrajanPro-Bold',
    color: '#1E2A38',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    shadowColor: '#A0C4FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    marginLeft: scale(4),
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  paymentItem: {
    marginBottom: scale(12),
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#A0C4FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentContainer: {
    padding: scale(16),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBE5FF',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
    paddingBottom: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#DCEEFF',
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptIcon: {
    backgroundColor: '#D4AF37',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  receiptText: {
    fontSize: scale(14),
    color: '#1E2A38',
    fontFamily: 'TrajanPro-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: 12,
  },
  statusText: {
    fontSize: scale(12),
    color: '#4CAF50',
    fontFamily: 'TrajanPro-Bold',
    marginLeft: scale(4),
    textTransform: 'uppercase',
  },
  paymentDetails: {
    gap: scale(10),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: scale(13),
    color: '#4A6A85',
    fontFamily: 'TrajanPro-Bold',
  },
  detailValue: {
    fontSize: scale(13),
    color: '#1E2A38',
    fontFamily: 'TrajanPro-Bold',
  },
  amountText: {
    color: '#D4AF37',
    fontFamily: 'TrajanPro-Bold',
    fontSize: scale(15),
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(40),
  },
  noDataText: {
    color: '#4A6A85',
    fontSize: scale(18),
    fontFamily: 'TrajanPro-Bold',
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  noDataSubtext: {
    color: '#6C87A5',
    fontSize: scale(14),
    textAlign: 'center',
    paddingHorizontal: scale(40),
    lineHeight: scale(20),
    fontFamily: 'TrajanPro-Bold',
  },
});

export default PaymentHistory;