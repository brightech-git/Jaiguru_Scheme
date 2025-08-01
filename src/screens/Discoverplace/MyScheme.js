import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './styles';
import React, { useEffect, useState } from 'react';
import BottomTab from '../../components/BottomTab/BottomTab';
import { colors } from '../../utils';
import { TextDefault } from '../../components';
import ProductCard from '../../ui/ProductCard/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCardSkeleton from '../../components/SkeletonLoader/ProductCardSkeleton';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

function DiscoverPlace({ navigation }) {
  const [phoneSearchData, setPhoneSearchData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const fetchPhoneSearchData = async () => {
      const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      console.log('Phone Number:', storedPhoneNumber);

      try {
        const phoneResponse = await fetch(
          `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!phoneResponse.ok) {
          throw new Error(`Phone Search HTTP error! status: ${phoneResponse.status}`);
        }

        const phoneJson = await phoneResponse.json();
        console.log('Phone JSON:', phoneJson);

        if (phoneJson && phoneJson.length > 0) {
          setPhoneSearchData(phoneJson);

          const productPromises = phoneJson.map(async (item) => {
            if (!item.regno || !item.groupcode) {
              console.warn('Skipping item with missing regno or groupcode:', item);
              return null;
            }

            try {
              const accountRes = await fetch(
                `https://akj.brightechsoftware.com/v1/api/account?regno=${item.regno}&groupcode=${item.groupcode}`,
                {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (!accountRes.ok) {
                console.warn(
                  `Account fetch failed for REGNO: ${item.regno}, GROUPCODE: ${item.groupcode}, Status: ${accountRes.status}`
                );
                return null;
              }

              const accountData = await accountRes.json();

              const weightRes = await fetch(
                `https://akj.brightechsoftware.com/v1/api/getAmountWeight?REGNO=${item.regno}&GROUPCODE=${item.groupcode}`,
                {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (!weightRes.ok) {
                console.warn(
                  `AmountWeight fetch failed for REGNO: ${item.regno}, GROUPCODE: ${item.groupcode}`
                );
                return null;
              }

              const weightJson = await weightRes.json();

              const isActive = !item.maturitydate;
              const itemStatus = isActive ? 'Active' : 'Deactive';
              setStatus(itemStatus);

              return {
                ...item,
                amountWeight: weightJson[0] || null,
                status: itemStatus,
                accountDetails: accountData,
              };
            } catch (err) {
              console.error('Error fetching data for item:', item, err);
              return null;
            }
          });

          const resolvedData = await Promise.all(productPromises);
          const validProducts = resolvedData.filter((item) => item && item.amountWeight);
          setProductData(validProducts);

          if (validProducts.length === 0) {
            setError('No valid product data found');
          }
        } else {
          setError('No phone search data available');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load data: ${err.message}`);
        Alert.alert('Fetch Error', `Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneSearchData();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/otpbg.jpg')}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.greenColor} />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Schemes</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollViewContentContainer}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSpacer}>
              {loading ? (
                <>
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </>
              ) : productData && productData.length > 0 ? (
                productData.map((item, index) => (
                  <ProductCard
                    key={index}
                    productData={item}
                    loading={loading}
                    error={error}
                    navigation={navigation}
                    status={status}
                    accountDetails={item.accountDetails}
                  />
                ))
              ) : (
                <TextDefault style={styles.titleSpacer1}>
                  No Schemes available for Your Account
                </TextDefault>
              )}
            </View>
          </ScrollView>

          <BottomTab screen="SCHEMES" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

export default DiscoverPlace;
