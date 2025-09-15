import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextDefault } from '../../components';
import { alignment, colors, scale } from '../../utils';
import { colors1 } from '../../utils/colors';

function GoldPlan(props) {
  const { schemeId, schemeName, description = 'No description available' } = props;
  const navigation = useNavigation();

  // ✅ Only render schemeId = 5 (Dream Gold Plan)
  // if (schemeId !== 5) {
    // return null;
  // }

  return (
    <TouchableOpacity style={[styles.cardContainer, props.styles]}>
      {/* 🔥 Gradient Background */}
      <LinearGradient
        colors={[colors1.gradientcolor3, colors1.gradientcolor4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.rightTop}>
            <TextDefault style={styles.text} bold>
              {schemeName}
            </TextDefault>
          </View>
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <TextDefault style={styles.description}>
            {description}
          </TextDefault>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate('KnowMore', { schemeId })}
          >
            <TextDefault style={styles.payButtonText}>Know More</TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate('AddNewMember', { schemeId })}
          >
            <TextDefault style={styles.payButtonText}>Join Scheme</TextDefault>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(15),
    overflow: 'hidden',
  },
  gradientBackground: {
    borderRadius: scale(15),
    padding: scale(5),
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
    ...alignment.Psmall,
  },
  rightTop: {
    alignItems: 'flex-end',
  },
  centerSection: {
    marginBottom: scale(5),
    ...alignment.Psmall,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(10),
  },
  payButton: {
    backgroundColor: colors.white,
    paddingVertical: scale(5),
    paddingHorizontal: scale(10),
    borderRadius: scale(5),
  },
  text: {
    color: colors.greenColor,
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  payButtonText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: colors.greenColor,
    fontSize: 14,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  schemeText: {
    color: colors.greenColor,
    fontSize: 14,
    marginTop: 5,
  },
});

export default GoldPlan;
