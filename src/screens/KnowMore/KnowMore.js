import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  Strong
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors, scale } from '../../utils'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

function KnowMore() {
  const route = useRoute()
  const navigation = useNavigation()
  const { schemeId } = route.params || {}

  const DottedCircle = ({ iconName }) => (
    <View style={styles.dottedCircleContainer}>
      <View style={styles.dottedCircle}>
        <Icon name={iconName} size={scale(24)} color={colors.gold} />
      </View>
    </View>
  )

  return (
    <ImageBackground
      source={require('../../assets/otpbg.jpg')}
      style={styles.backgroundImage}
      resizeMode='cover'
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>DIGI GOLD SCHEME</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.card}>
          <Text style={styles.description}>
            Choose Digi Gold because it offers a convenient and flexible way to
            save in gold through a mobile app, providing tiered benefits that
            allow users to earn additional gold weight on their savings.
            DigiGold is an ideal choice for customers seeking a secure and
            accessible investment in gold.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Process to Join</Text>
          <View style={styles.stepsContainer}>
            {[
              {
                icon: 'account-plus',
                text: "Click 'Join Now' On Digi Gold Scheme"
              },
              {
                icon: 'weight-kilogram',
                text: 'Enter Amount/Weight you wish to start with'
              },
              {
                icon: 'credit-card-outline',
                text: 'Make Payment Using Any Mode'
              },
              { icon: 'target', text: 'Set Saving Target (Optional)' },
              { icon: 'check-circle-outline', text: 'Continue Your Savings' }
            ].map((step, index) => (
              <View key={index} style={styles.stepContainerWithCircle}>
                <DottedCircle iconName={step.icon} />
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Process to Redeem</Text>
          <View style={styles.stepsContainer}>
            {[
              { icon: 'storefront-outline', text: 'Visit Jaiguru Jewellers' },
              { icon: 'form-select', text: 'Submit Redemption Request Form' },
              { icon: 'diamond-outline', text: 'Choose Jewel' }
            ].map((step, index) => (
              <View key={index} style={styles.stepContainerWithCircle}>
                <DottedCircle iconName={step.icon} />
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features & Benefits</Text>

          <View style={styles.featureCard}>
            <Text style={styles.subHeading}>Minimum Amount</Text>
            <Text style={styles.featureText}>
              The minimum amount that can be saved in gold is Rs. 100. Users can
              save any amount above Rs. 100 at any time during the first 330
              days from the date of the first payment.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.subHeading}>Scheme Period</Text>
            <Text style={styles.featureText}>
              The scheme period of 330 days will begin on the date of the first
              payment made. During this period, users can save in gold any
              number of times. On the 330th day from the date of enrolment, the
              scheme will mature.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.subHeading}>Benefits</Text>
            <Text style={styles.featureText}>
              Users will be eligible for benefits on the gold weight being saved
              in their account, as per the following slab system:
            </Text>
            <View style={styles.benefitItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.featureText}>First 75 days - 5% benefit</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.featureText}>
                76th to 150th Days - 3.75% benefit
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.featureText}>
                151st to 225th Days - 2% benefit
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.featureText}>
                226th to 300th Days - 0.75% benefit
              </Text>
            </View>
            <Text style={styles.featureText}>
              Please note that no benefits will be offered for payments made
              during the final 30 days of the scheme period (i.e., 301st day to
              330th day). Benefits will only be offered if the user redeems
              their account after maturity.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.subHeading}>Redemption</Text>
            <Text style={styles.featureText}>
              Saved gold weight can be redeemed and purchased as gold jewellery
              at any of Jaiguru Jewellers  located across Tamil Nadu or online by
              sending an email to Jaigurujewellers2023@gmail.com. Users must pay for
              GST and any value-added charges such as wastage charges, marking
              charges, stone charges, and hallmark charges, if applicable.
            </Text>
            <Text style={styles.featureText}>
              There is a minimum lock-in period of 30 days, during which users
              cannot redeem their savings. Only the person whose name was used
              at the time of registration can redeem the scheme, and they must
              submit original identification proof such as Aadhaar, PAN, driving
              license, or voter ID at the time of redemption. Users must redeem
              their scheme within 35 days from the date of maturity.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.subHeading}>Refunds</Text>
            <Text style={styles.featureText}>
              The paid amount will not be refunded under any circumstances. This
              means that if the customer changes their mind after enrolling in
              the scheme and decides not to redeem the gold, they will not be
              able to get a refund of the amount paid.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.joinButton]}
            onPress={() => navigation.navigate('AddNewMember', { schemeId })}
          >
            <Text style={styles.buttonText}>Join Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => navigation.navigate('MainLanding')}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    paddingBottom: scale(40)
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: '#f8f5f0' // fallback color
  },
  header: {
    marginBottom: scale(25),
    alignItems: 'center'
  },
  title: {
    fontSize: scale(24),
    fontFamily: 'TrajanPro-Bold', // Make sure to load this font in your project
    color: '#8b6e4b',
    marginBottom: scale(10),
    letterSpacing: 1
  },
  divider: {
    height: 2,
    width: '40%',
    backgroundColor: '#d4af37',
    marginTop: scale(5)
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: scale(8),
    padding: scale(20),
    marginBottom: scale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  description: {
    fontSize: scale(15),
    lineHeight: scale(22),
    color: '#5d5d5d',
    textAlign: 'center',
    fontFamily: 'TrajanPro-Normal'
  },
  section: {
    marginBottom: scale(25)
  },
  sectionTitle: {
    fontSize: scale(20),
    fontFamily: 'TrajanPro-Bold',
    color: '#8b6e4b',
    marginBottom: scale(15),
    textAlign: 'center',
    letterSpacing: 0.5
  },
  stepsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: scale(8),
    padding: scale(13),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  stepContainerWithCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15)
  },
  dottedCircleContainer: {
    marginRight: scale(15)
  },
  dottedCircle: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    borderWidth: scale(1.5),
    borderColor: '#d4af37',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  stepText: {
    fontSize: scale(14),
    color: '#5d5d5d',
    flex: 1,
    lineHeight: scale(20),
    fontFamily: 'TrajanPro-Normal'
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: scale(8),
    padding: scale(18),
    marginBottom: scale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  subHeading: {
    fontSize: scale(16),
    fontFamily: 'TrajanPro-Bold',
    color: '#8b6e4b',
    marginBottom: scale(10)
  },
  featureText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: '#5d5d5d',
    marginBottom: scale(8),
    fontFamily: 'TrajanPro-Normal'
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(5)
  },
  bullet: {
    color: '#d4af37',
    marginRight: scale(8),
    fontSize: scale(26)
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(20),
    gap: scale(20)
  },
  button: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(25),
    borderRadius: scale(25),
    minWidth: scale(120),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  joinButton: {
    backgroundColor: '#8b6e4b'
  },
  closeButton: {
    backgroundColor: '#b3a38a'
  },
  buttonText: {
    fontSize: scale(14),
    fontFamily: 'TrajanPro-Bold',
    color: '#fff',
    letterSpacing: 0.5
  }
})

export default KnowMore
