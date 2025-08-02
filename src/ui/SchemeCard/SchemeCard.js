import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  I18nManager,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextDefault } from '../../components';
import { scale } from '../../utils';

const { width } = Dimensions.get('window');

function SchemeCard({ scheme, onPress, index = 0 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400 + index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  // Extract data with fallbacks
  const schemeName = scheme?.schemeName || scheme?.accountDetails?.schemeSummary?.schemeName || 'Unknown Scheme';
  const accountDetails = scheme?.accountDetails;
  const schemeSummary = accountDetails?.schemeSummary;
  const transBalance = schemeSummary?.schemaSummaryTransBalance;

  // Calculate values
  const totalInstallments = schemeSummary?.instalment || 0;
  const paidInstallments = transBalance?.insPaid || 0;
  const totalAmount = scheme?.totalAmount || scheme?.amountWeight?.Amount || 0;
  const amountReceived = transBalance?.amtrecd || 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹');
  };

  // Determine if it's a Dream Gold plan
  const isDreamGoldPlan = schemeName.toLowerCase().includes('dream gold');

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${schemeName}`}
      >
        <LinearGradient
          colors={['#EAF7FF', '#B8E1FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.schemeInfo}>
              <View style={styles.titleRow}>
                <MaterialCommunityIcons
                  name={isDreamGoldPlan ? "gold" : "diamond-stone"}
                  size={scale(18)}
                  color="#2A5C91"
                />
                <TextDefault style={styles.schemeName} numberOfLines={1}>
                  {schemeName}
                </TextDefault>
              </View>
              <TextDefault style={styles.customerName} numberOfLines={1}>
                {scheme?.pname || 'Customer'}
              </TextDefault>
            </View>
            <View
              style={[
                styles.statusBadge,
                { 
                  backgroundColor: scheme?.status === 'Active' ? '#4CAF50' : '#F44336',
                  borderColor: scheme?.status === 'Active' ? '#388E3C' : '#D32F2F'
                },
              ]}
            >
              <TextDefault style={styles.statusText}>
                {scheme?.status || 'Unknown'}
              </TextDefault>
            </View>
          </View>

          {/* Scheme Code */}
          <View style={styles.codeSection}>
            <TextDefault style={styles.schemeCode}>
              Scheme Code: {scheme?.groupcode}-{scheme?.regno}
            </TextDefault>
          </View>

          {/* Financial Info */}
          <View style={styles.financialSection}>
            <View style={styles.financialItem}>
              <MaterialCommunityIcons name="currency-inr" size={scale(14)} color="#2A5C91" />
              <TextDefault style={styles.financialLabel}>Total Paid:</TextDefault>
              <TextDefault style={styles.financialValue}>{formatCurrency(amountReceived)}</TextDefault>
            </View>
            <View style={styles.financialItem}>
              <MaterialCommunityIcons name="calendar-check" size={scale(14)} color="#2A5C91" />
              <TextDefault style={styles.financialLabel}>Installments:</TextDefault>
              <TextDefault style={styles.financialValue}>
                {paidInstallments}/{totalInstallments}
              </TextDefault>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel="View scheme details"
            >
              <TextDefault style={styles.detailsButtonText}>View Details</TextDefault>
              <Ionicons 
                name={I18nManager.isRTL ? "arrow-back" : "arrow-forward"} 
                size={scale(14)} 
                color="#2A5C91" 
              />
            </TouchableOpacity>
          </View>

          {/* Decorative Element */}
          <View style={styles.decorativeOverlay} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: scale(16),
    borderRadius: scale(16),
    shadowColor: '#2A5C91',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  touchable: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: scale(20),
    position: 'relative',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  schemeInfo: {
    flex: 1,
    marginRight: scale(12),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(6),
  },
  schemeName: {
    fontSize: scale(18),
    color: '#2A5C91',
    fontWeight: '700',
    marginLeft: scale(8),
    flex: 1,
  },
  customerName: {
    fontSize: scale(14),
    color: '#5D8FBE',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  statusText: {
    fontSize: scale(12),
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  codeSection: {
    backgroundColor: 'rgba(42, 92, 145, 0.1)',
    borderRadius: scale(8),
    padding: scale(10),
    marginBottom: scale(16),
  },
  schemeCode: {
    fontSize: scale(13),
    color: '#3E7CB1',
    fontWeight: '600',
    textAlign: 'center',
  },
  financialSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  financialItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
  },
  financialLabel: {
    fontSize: scale(13),
    color: '#5D8FBE',
    fontWeight: '600',
    marginLeft: scale(6),
    marginRight: scale(4),
  },
  financialValue: {
    fontSize: scale(14),
    color: '#2A5C91',
    fontWeight: '700',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 92, 145, 0.1)',
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: '#2A5C91',
  },
  detailsButtonText: {
    fontSize: scale(14),
    color: '#2A5C91',
    fontWeight: '600',
    marginRight: scale(6),
  },
  decorativeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(42, 92, 145, 0.1)',
  },
});

export default React.memo(SchemeCard);