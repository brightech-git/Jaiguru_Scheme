import React, { createContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SchemeContext = createContext();

export const SchemeProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhoneSearchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      console.log('Stored phone number:', storedPhoneNumber);

      if (!storedPhoneNumber) {
        throw new Error('No phone number found in storage');
      }

      // Fetch account list for this phone number
      const phoneResponse = await fetch(
        `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!phoneResponse.ok) {
        throw new Error(`Phone Search failed with status: ${phoneResponse.status}`);
      }

      const phoneJson = await phoneResponse.json();
      console.log('Phone search results:', phoneJson);

      if (!phoneJson || phoneJson.length === 0) {
        throw new Error('No accounts found for this phone number');
      }

      // Process each account in parallel
      const productPromises = phoneJson.map(async (item) => {
        if (!item.regno || !item.groupcode) {
          console.warn('Skipping item - missing regno or groupcode:', item);
          return null;
        }

        try {
          // Fetch account details in parallel
          const [accountRes, weightRes] = await Promise.all([
            fetch(`https://akj.brightechsoftware.com/v1/api/account?regno=${item.regno}&groupcode=${item.groupcode}`),
            fetch(`https://akj.brightechsoftware.com/v1/api/getAmountWeight?REGNO=${item.regno}&GROUPCODE=${item.groupcode}`)
          ]);

          if (!accountRes.ok || !weightRes.ok) {
            console.warn(`Failed to fetch details for ${item.regno}-${item.groupcode}`);
            return null;
          }

          const [accountData, weightData] = await Promise.all([
            accountRes.json(),
            weightRes.json()
          ]);

          // Process maturity date
          let maturityDate = item.maturitydate || item.maturityDate || accountData?.schemeSummary?.maturityDate;
          if (maturityDate) {
            try {
              // Try parsing different date formats
              const parsedDate = new Date(maturityDate);
              if (isNaN(parsedDate.getTime())) {
                // Try alternative formats if standard parsing fails
                const parts = maturityDate.split(/[-/]/);
                if (parts.length === 3) {
                  // Try DD-MM-YYYY or DD/MM/YYYY
                  const alternativeDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                  if (!isNaN(alternativeDate.getTime())) {
                    maturityDate = alternativeDate.toISOString();
                  } else {
                    maturityDate = null;
                  }
                } else {
                  maturityDate = null;
                }
              } else {
                maturityDate = parsedDate.toISOString();
              }
            } catch (e) {
              console.warn('Date parsing error:', e);
              maturityDate = null;
            }
          }

          // Determine status
          const status = (!maturityDate || new Date(maturityDate) > new Date()) ? 'Active' : 'Inactive';

          // Calculate progress
          const totalInstallments = accountData?.schemeSummary?.instalment || 0;
          const paidInstallments = accountData?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0;
          const progressPercentage = totalInstallments > 0 
            ? Math.round((paidInstallments / totalInstallments) * 100)
            : 0;

          // Get weight data (handle both array and object responses)
          const weightInfo = Array.isArray(weightData) ? weightData[0] : weightData;

          return {
            ...item,
            accountDetails: accountData,
            amountWeight: weightInfo,
            status,
            progressPercentage,
            schemeName: accountData?.schemeSummary?.schemeName || item?.schemeName || 'Unknown Scheme',
            totalAmount: weightInfo?.Amount || 0,
            savedWeight: weightInfo?.Weight || 0,
            maturityDate,
          };
        } catch (err) {
          console.error(`Error processing account ${item.regno}-${item.groupcode}:`, err);
          return null;
        }
      });

      const resolvedData = await Promise.all(productPromises);
      const validProducts = resolvedData.filter(item => item !== null);

      if (validProducts.length === 0) {
        throw new Error('No valid products found after processing');
      }

      setProductData(validProducts);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setProductData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhoneSearchData();
  }, [fetchPhoneSearchData]);

  const value = {
    productData,
    loading,
    error,
    refetch: fetchPhoneSearchData,
    getActiveSchemes: () => productData.filter(item => item.status === 'Active'),
    getInactiveSchemes: () => productData.filter(item => item.status === 'Inactive'),
    getTotalAmount: () => productData.reduce((sum, item) => sum + (item.totalAmount || 0), 0),
  };

  return (
    <SchemeContext.Provider value={value}>
      {children}
    </SchemeContext.Provider>
  );
};