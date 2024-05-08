import { SafeAreaView, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SubscriptionSection from "../Settings/SubscriptionSection";
import { createStackNavigator } from "@react-navigation/stack";
import GeneralSection from "../Settings/GeneralSection";
import OurAppsSection from "../Settings/OurAppsSection";
import AboutSection from "../Settings/AboutSection";

const Stack = createStackNavigator();

export default function Settings() {
  return (
    <Stack.Navigator
      initialRouteName="SettingsTab"
      screenOptions={{ headerShown: false }}
      s
    >
      <Stack.Screen name="SettingsTab" component={SettingsTab} />
    </Stack.Navigator>
  );
}

function SettingsTab({ navigation }) {
  return (
    <SafeAreaView className="flex-1">
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
