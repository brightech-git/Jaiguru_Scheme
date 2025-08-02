import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const OffersPage = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const offers = [
    {
      id: 1,
      title: "Festival Special",
      description: "Get 2% extra gold on all schemes during this festival season",
      category: "festival",
      expiry: "31 Dec 2023",
      image: require('../../assets/image/offer1.jpg'),
      code: "FEST23"
    },
    {
      id: 2,
      title: "New Customer Bonus",
      description: "First-time customers get ₹500 cashback on their first scheme",
      category: "new",
      expiry: "30 Nov 2023",
      image: require('../../assets/image/offer2.jpg'),
      code: "WELCOME500"
    },
    {
      id: 3,
      title: "Referral Reward",
      description: "Refer a friend and both get 1% extra gold on next installment",
      category: "referral",
      expiry: "15 Jan 2024",
      image: require('../../assets/image/offer3.webp'),
      code: "REFER24"
    },
    {
      id: 4,
      title: "Anniversary Special",
      description: "Celebrate our anniversary with 3% discount on making charges",
      category: "anniversary",
      expiry: "20 Dec 2023",
      image: require('../../assets/image/offer3.webp'),
      code: "ANNIV3"
    },
    {
      id: 5,
      title: "Loyalty Bonus",
      description: "Long-term customers get exclusive gold rate discounts",
      category: "loyalty",
      expiry: "Ongoing",
      image: require('../../assets/image/offer5.jpg'),
      code: "LOYALGOLD"
    },
  ];

  const filteredOffers = activeCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === activeCategory);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const categories = [
    { id: 'all', name: 'All Offers', icon: 'local-offer' },
    { id: 'festival', name: 'Festival', icon: 'festival' },
    { id: 'new', name: 'New Customer', icon: 'person-add' },
    { id: 'referral', name: 'Referral', icon: 'share' },
    { id: 'loyalty', name: 'Loyalty', icon: 'star' },
  ];

  const renderOfferItem = ({ item }) => (
    <LinearGradient
      colors={['#FFFFFF', '#F5FAFF']}
      style={styles.offerCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image source={item.image} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription}>{item.description}</Text>
        
        <View style={styles.offerMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="local-offer" size={16} color="#5D8FBE" />
            <Text style={styles.metaText}>Code: {item.code}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="event" size={16} color="#5D8FBE" />
            <Text style={styles.metaText}>Expires: {item.expiry}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.claimButton}
          onPress={() => handleClaimOffer(item.id)}
        >
          <Text style={styles.claimButtonText}>Claim Offer</Text>
          <FontAwesome name="angle-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const handleClaimOffer = (offerId) => {
    // Add your offer claiming logic here
    console.log(`Claiming offer ${offerId}`);
    // You might want to navigate to a claim screen or show a modal
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity
        }
      ]}>
        <LinearGradient
          colors={['#EAF7FF', '#D8EFFF']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#2A5C91" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exclusive Offers</Text>
          <View style={styles.headerRight} />
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.activeCategoryButton
              ]}
              onPress={() => {
                setActiveCategory(category.id);
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={category.icon}
                size={20}
                color={activeCategory === category.id ? '#FFFFFF' : '#2A5C91'}
              />
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeCategoryText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Offers List */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {filteredOffers.length > 0 ? (
            <FlatList
              data={filteredOffers}
              renderItem={renderOfferItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.offersListContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="sentiment-dissatisfied" size={48} color="#5D8FBE" />
              <Text style={styles.emptyText}>No offers available in this category</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setActiveCategory('all')}
              >
                <Text style={styles.viewAllButtonText}>View All Offers</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF7FF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1E5FF',
    shadowColor: '#2A5C91',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(42, 92, 145, 0.1)'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A5C91',
  },
  headerRight: {
    width: 24
  },
  scrollContainer: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: 20,
  },
  offersListContainer: {
    paddingHorizontal: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(42, 92, 145, 0.2)'
  },
  activeCategoryButton: {
    backgroundColor: '#2A5C91',
    borderColor: '#5D8FBE'
  },
  categoryText: {
    marginLeft: 6,
    color: '#2A5C91',
    fontSize: 14,
    fontWeight: '500'
  },
  activeCategoryText: {
    color: '#FFFFFF'
  },
  offerCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#2A5C91',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(42, 92, 145, 0.1)'
  },
  offerImage: {
    width: 120,
    height: 150,
    resizeMode: 'cover'
  },
  offerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between'
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A5C91',
    marginBottom: 8
  },
  offerDescription: {
    fontSize: 14,
    color: '#5D8FBE',
    marginBottom: 12,
    lineHeight: 20
  },
  offerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaText: {
    fontSize: 12,
    color: '#5D8FBE',
    marginLeft: 4
  },
  claimButton: {
    backgroundColor: '#2A5C91',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(42, 92, 145, 0.1)'
  },
  emptyText: {
    fontSize: 16,
    color: '#5D8FBE',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center'
  },
  viewAllButton: {
    backgroundColor: '#2A5C91',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default OffersPage;