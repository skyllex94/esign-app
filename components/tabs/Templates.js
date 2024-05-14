import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TemplatesLibrary from "../Templates/TemplatesLibrary";
import TemplatePreview from "../Templates/TemplatePreview";
import { LinearGradient } from "expo-linear-gradient";

const Stack = createStackNavigator();

export default function TemplatesScreen() {
  return (
    <Stack.Navigator
      initialRouteName="MainTemplates"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainTemplates" component={Templates} />
      <Stack.Screen
        name="TemplatePreview"
        component={TemplatePreview}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function Templates({ navigation }) {
  return (
    <SafeAreaView className="flex-1 mx-3">
      {/* shadow (in the class) */}
      <LinearGradient
        className="bg-white items-center gap-y-4 justify-between pb-4 w-full my-1 rounded-lg"
        colors={["#fff", "#fff"]}
        start={[0, 0]}
        end={[1, 1]}
        location={[0.25, 0.4, 1]}
      >
        <View className="items-center gap-y-1">
          <Text className="text-lg font-semibold text-[20px] ">
            Review our Templates
          </Text>
          <Text className="text-slate-600 text-center">
            Browse through the 20+ templates available for use.
          </Text>
        </View>

        <Image
          className="h-20 w-[85%]"
          source={require("../../assets/img/templates_banner.png")}
        />
      </LinearGradient>
      <TemplatesLibrary navigation={navigation} />
    </SafeAreaView>
  );
}
