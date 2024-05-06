import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TemplatesLibrary from "../Templates/TemplatesLibrary";
import TemplatePreview from "../Templates/TemplatePreview";

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
    <SafeAreaView className="mx-3">
      <Text className="text-center font-bold text-2xl my-2">Templates</Text>

      <TemplatesLibrary navigation={navigation} />
    </SafeAreaView>
  );
}
