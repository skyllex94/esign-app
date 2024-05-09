import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
  google: "",
};

const typesOfMembership = {
  weekly: "esign_pro_weekly",
  monthly: "esign_pro_monthly",
  yearly: "esign_pro_yearly",
};

export default function useRevenueCat() {
  const [currentOffering, setCurrentOffering] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  const isProMember = customerInfo?.entitlements.active.pro;

  useEffect(() => {
    const fetchData = async () => {
      await Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
      });

      const offerings = await Purchases.getOfferings();
      const customerInfo = await Purchases.getCustomerInfo();

      setCurrentOffering(offerings.current);
      setCustomerInfo(customerInfo);
    };

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (purchaserInfo) => {
      setCustomerInfo(purchaserInfo);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
  }, []);

  return { currentOffering, customerInfo, isProMember };
}
