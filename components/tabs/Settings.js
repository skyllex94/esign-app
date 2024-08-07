import { SafeAreaView, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SubscriptionSection from "../Settings/SubscriptionSection";
import { createStackNavigator } from "@react-navigation/stack";
import GeneralSection from "../Settings/GeneralSection";
import OurAppsSection from "../Settings/OurAppsSection";
import AboutSection from "../Settings/AboutSection";
import PrivacyPolicy from "../Settings/PrivacyPolicy";
import Terms from "../Settings/Terms";
import { bgColor } from "../../constants/UI";

const Stack = createStackNavigator();

export default function Settings() {
  return (
    <Stack.Navigator
      initialRouteName="SettingsTab"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SettingsTab" component={SettingsTab} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  );
}

function SettingsTab({ navigation }) {
  return (
    <SafeAreaView className={`flex-1 bg-[${bgColor}]`}>
      <Text className="text-center font-bold text-2xl my-2">Settings</Text>

      <ScrollView showsVerticalScrollIndicator="false">
        <SubscriptionSection navigation={navigation} />
        <GeneralSection navigation={navigation} />
        <OurAppsSection />
        <AboutSection navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}
