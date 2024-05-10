import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import useRevenueCat from "../../hooks/useRevenueCat";
import Purchases from "react-native-purchases";

export default function Paywall({ route, navigation }) {
  // const { editingPalette } = route.params;
  // console.log("editingPalette:", editingPalette);

  const { currentOffering } = useRevenueCat();
  console.log("currentOffering:", currentOffering?.weekly.product.priceString);

  async function getWeeklySubscription() {
    if (!currentOffering?.weekly) return;

    try {
      const purchaserInfo = await Purchases.purchasePackage(
        currentOffering.weekly
      );
      console.log(
        "BOUGHT WEEKLY:",
        purchaserInfo.customerInfo.entitlements.active
      );

      if (
        purchaserInfo.customerInfo.entitlements.active.esign_pro_subscription
      ) {
        console.log("we have info back");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View className="flex-1 bg-[#7875f1]">
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
                Unlock all editing tools: Dates, Initials, Images, Custom Text,
                Checks and more to come.
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
                Try different templates for direct editing with more being added
                on a regular basis.
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
                Get included camera scanning and organizing your documents in a
                safe environment.
              </Text>
            </View>
          </View>
        </View>

        <View className="paywall-buttons mt-6">
          <View className="items-center mb-2">
            <Text className="text-white font-light">Get 3 days for Free</Text>
            <Text className="text-white font-semibold">
              Then {currentOffering?.weekly?.product?.priceString} per week.
              Cancel any time.
            </Text>
          </View>
          <View className="items-center gap-y-2">
            <TouchableOpacity
              onPress={getWeeklySubscription}
              className="bg-white items-center p-3 w-[90%] rounded-full"
            >
              <Text className="text-[#7875f1] text-[20px] font-light">
                Start Free Trial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#7875f1] items-center p-3 w-[90%] border-2 border-white rounded-full">
              <Text className="text-white text-[20px] font-light">
                View Other Plans
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center mt-3">
          <View className="flex-row">
            <TouchableOpacity>
              <Text className="text-white">Privacy Policy</Text>
            </TouchableOpacity>
            <Text className="text-white mx-2">|</Text>

            <TouchableOpacity>
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
  );
}
