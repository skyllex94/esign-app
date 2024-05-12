import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import useRevenueCat from "../../hooks/useRevenueCat";
import Purchases from "react-native-purchases";

import { showMessage } from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay/lib";

export default function Paywall({ route, navigation }) {
  const { currentOffering } = useRevenueCat();

  const [loadedPaywall, setLoadedPaywall] = useState(false);
  const [purchaseSpinner, setPurchaseSpinner] = useState(false);

  const [showOtherPlans, setShowOtherPlans] = useState(false);

  // Fetch all pricing data before displaying paywall
  useEffect(() => {
    if (
      currentOffering?.weekly?.product.priceString &&
      currentOffering?.monthly?.product.priceString &&
      require("../../assets/img/paywall_image.webp")
    )
      setLoadedPaywall(true);
  }, [currentOffering]);

  async function getSubscription(subscription) {
    setPurchaseSpinner(true);

    if (!currentOffering?.[subscription]) {
      setPurchaseSpinner(false);
      return;
    }

    try {
      const purchaserInfo = await Purchases.purchasePackage(
        currentOffering?.[subscription]
      );
      console.log(
        `Bought ${subscription} :`,
        purchaserInfo.customerInfo.entitlements.active
      );

      if (
        purchaserInfo.customerInfo.entitlements.active.esign_pro_subscription
      ) {
        navigation.goBack();
      }
    } catch (err) {
      if (!err.userCancelled) {
        setPurchaseSpinner(false);
      }
    }
    setPurchaseSpinner(false);
  }

  async function handleRestorePurchase() {
    setPurchaseSpinner(true);
    const purchaserInfo = await Purchases.restorePurchases();

    if (purchaserInfo?.activeSubscriptions.length > 0) {
      Alert.alert("Success", "Your purchase has been restored");
      navigation.goBack();
    } else Alert.alert("Failure", "There are no purchases to restore");
    setPurchaseSpinner(false);
  }

  return (
    <React.Fragment>
      {loadedPaywall ? (
        <View className="flex-1 bg-[#7875f1]">
          <Spinner visible={purchaseSpinner} />

          <View className="paywall-image items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className={`z-10 absolute top-4 right-4 rounded-full p-3`}
            >
              <AntDesign name="close" size={20} color="lightgray" />
            </TouchableOpacity>

            <Image
              className="h-52 w-full rounded-bl-full rounded-b-[180px]"
              resizeMode="center"
              source={require("../../assets/img/paywall_image.webp")}
            />

            <View className="w-[80px] absolute shadow top-40 bg-white rounded-full p-4">
              <MaterialIcons name="workspace-premium" size={48} color="black" />
            </View>

            <View className="mb-10" />

            <Text className="text-white font-light text-[20px] mb-3">
              Upgrade to Premium
            </Text>
          </View>

          <ScrollView>
            <View className="premium-features mt-6">
              <View className="flex-row items-center gap-x-5 m-3 ">
                <FontAwesome6 name="toolbox" size={34} color="white" />
                <View className="flex-1 gap-y-1">
                  <Text className="text-white text-[16px] font-semibold">
                    All Editing Tools
                  </Text>
                  <Text className="text-white text-[14px] font-light">
                    Unlock all editing tools: Dates, Initials, Images, Custom
                    Text, Checks and more to come.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-x-5 m-3">
                <MaterialCommunityIcons
                  name="file-document-edit"
                  size={34}
                  color="white"
                />
                <View className="flex-1 gap-y-1">
                  <Text className="text-white text-[16px] font-semibold">
                    15+ Document Templates
                  </Text>
                  <Text className="text-white text-[14px] font-light">
                    Try different templates for direct editing with more being
                    added on a regular basis.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-x-5 m-3">
                <MaterialIcons name="camera-enhance" size={34} color="white" />
                <View className="flex-1 gap-y-1">
                  <Text className="text-white text-[16px] font-semibold">
                    Camera Scanning
                  </Text>
                  <Text className="text-white text-[14px] font-light">
                    Get included camera scanning and organizing your documents
                    in a safe environment.
                  </Text>
                </View>
              </View>
            </View>

            {showOtherPlans ? (
              <View className="items-center gap-y-2">
                <TouchableOpacity
                  onPress={() => getSubscription("weekly")}
                  className="bg-white items-center p-3 w-[90%] rounded-full"
                >
                  <Text className="text-[#7875f1] font-semibold text-[15px]">
                    Weekly Plan
                  </Text>
                  <Text className="text-[#7875f1]">
                    3-day Free Trial, and then{" "}
                    {currentOffering?.weekly?.product?.priceString}/week
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => getSubscription("monthly")}
                  className="bg-white items-center p-3 w-[90%] rounded-full"
                >
                  <Text className="text-[#7875f1] font-semibold text-[15px]">
                    Monthly Plan
                  </Text>
                  <Text className="text-[#7875f1]">
                    3-day Free Trial, and then{" "}
                    {currentOffering?.monthly?.product?.priceString}/month
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => getSubscription("annual")}
                  className="bg-white items-center p-3 w-[90%] rounded-full"
                >
                  <Text className="text-[#7875f1] font-semibold text-[15px]">
                    Yearly Plan
                  </Text>
                  <Text className="text-[#7875f1]">
                    3-day Free Trial, and then{" "}
                    {currentOffering?.annual?.product?.priceString}/year
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="paywall-buttons mt-6">
                <View className="items-center mb-2">
                  <Text className="text-white font-light">
                    Get 3 days for Free
                  </Text>
                  <Text className="text-white font-semibold">
                    Then {currentOffering?.weekly?.product?.priceString} per
                    week. Cancel any time.
                  </Text>
                </View>
                <View className="items-center gap-y-2">
                  <TouchableOpacity
                    onPress={() => getSubscription("weekly")}
                    className="bg-white items-center p-3 w-[90%] rounded-full"
                  >
                    <Text className="text-[#7875f1] text-[20px] font-light">
                      Start Free Trial
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowOtherPlans(true)}
                    className="bg-[#7875f1] items-center p-3 w-[90%] border-2 border-white rounded-full"
                  >
                    <Text className="text-white text-[20px] font-light">
                      View All Plans
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="items-center mt-3">
              <View className="flex-row">
                <TouchableOpacity>
                  <Text className="text-white">Privacy Policy</Text>
                </TouchableOpacity>
                <Text className="text-white mx-2">|</Text>

                <TouchableOpacity onPress={handleRestorePurchase}>
                  <Text className="text-white">Restore Purchase</Text>
                </TouchableOpacity>
                <Text className="text-white mx-2">|</Text>

                <TouchableOpacity>
                  <Text className="text-white">Terms of Use</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <ActivityIndicator className="pt-10" size="large" />
      )}
    </React.Fragment>
  );
}
