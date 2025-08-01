import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../components';
import { alignment, colors, scale } from '../../utils';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function GoldPlan(props) {
  const { schemeId, schemeName, description = 'No description available' } = props;
  const navigation = useNavigation();
  const [detailsPressed, setDetailsPressed] = useState(false);
  const [joinPressed, setJoinPressed] = useState(false);

  return (
    <View style={styles.container}>
      {/* Fixed Gradient Border */}
      <View style={styles.borderContainer}>
        <LinearGradient
        colors={['#a2c4db', '#eaf7ff', '#a2c4db']}

          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        />
      </View>

      {/* Main Card */}
      <View style={styles.cardContainer}>
        <LinearGradient
         colors={['#eaf7ff', '#d6efff']}

          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Top Premium Ribbon */}
          <View style={styles.premiumRibbon}>
            <MaterialCommunityIcons name="crown" size={scale(14)} color="#D4AF37" />
            <TextDefault style={styles.premiumText}>PREMIUM</TextDefault>
          </View>

          {/* Top Section with Icon and Scheme Name */}
          <View style={styles.topSection}>
            <View style={styles.schemeIcon}>
              <MaterialCommunityIcons name="gold" size={scale(20)} color="#D4AF37" />
            </View>
            <View style={styles.rightTop}>
              <TextDefault style={styles.schemeName}>{schemeName}</TextDefault>
            </View>
          </View>

          {/* Description */}
          <View style={styles.centerSection}>
            <TextDefault style={styles.description}>{description}</TextDefault>
          </View>

          {/* Action Buttons */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.detailsButton]}
              onPress={() => navigation.navigate('KnowMore', { schemeId })}
              activeOpacity={0.8}
            >
              <TextDefault style={styles.detailsButtonText}>DETAILS</TextDefault>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.joinButton]}
              onPress={() => navigation.navigate('AddNewMember', { schemeId })}
              activeOpacity={0.8}
            >
              <TextDefault style={styles.joinButtonText}>JOIN NOW</TextDefault>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(20),
    position: 'relative',
  },
  borderContainer: {
    position: 'absolute',
    width: scale(295),
    height: scale(200),
    borderRadius: scale(12),
    padding: scale(1.5),
    backgroundColor: '#a2b0bdff',
    overflow: 'hidden',
  },
  gradientBorder: {
    flex: 1,
    borderRadius: scale(10.5),
  },
  cardContainer: {
    width: scale(292),
    height: scale(197),
    borderRadius: scale(10.5),
    overflow: 'hidden',
    zIndex: 2,
  },
  gradientBackground: {
    borderRadius: scale(10.5),
    padding: scale(16),
    flex: 1,
    backgroundColor: '#eaf7ff',
  },
  premiumRibbon: {
    position: 'absolute',
    top: scale(20),
    right: scale(-26),
    backgroundColor: 'rgba(0, 51, 77, 0.1)',
    paddingVertical: scale(4),
    paddingHorizontal: scale(24),
    transform: [{ rotate: '45deg' }],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  premiumText: {
    marginLeft: scale(4),
    fontSize: scale(10),
    fontFamily: 'TrajanPro-Bold',
    color: '#00334d',
    letterSpacing: 1,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    marginTop: scale(8),
  },
  schemeIcon: {
    backgroundColor: 'rgba(0, 51, 77, 0.08)',
    borderRadius: scale(8),
    padding: scale(8),
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(0, 51, 77, 0.2)',
  },
  rightTop: {
    flex: 1,
  },
  schemeName: {
    fontSize: scale(16),
    fontFamily: 'TrajanPro-Bold',
    color: '#00334d',
    letterSpacing: 0.5,
  },
  centerSection: {
    marginBottom: scale(14),
  },
  description: {
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    color: '#4f6b7a',
    lineHeight: scale(18),
    letterSpacing: 0.2,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
  },
  actionButton: {
    flex: 1,
    paddingVertical: scale(10),
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(4),
  },
  detailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00334d',
  },
  joinButton: {
    backgroundColor: '#D4AF37',
  },
  detailsButtonText: {
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    color: '#00334d',
    letterSpacing: 0.5,
  },
  joinButtonText: {
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});


export default GoldPlan;