import { SafeAreaView, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BuySection from "../Settings/BuySection";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function Settings() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{ headerShown: false }}
      s
    >
      <Stack.Screen name="Settings" component={SettingsTab} />
    </Stack.Navigator>
  );
}

function SettingsTab() {
  return (
    <SafeAreaView className="flex-1">
      <Text className="text-center font-bold text-2xl my-2">Settings</Text>

      <ScrollView showsVerticalScrollIndicator="false">
        <BuySection />
      </ScrollView>
    </SafeAreaView>
  );
}
