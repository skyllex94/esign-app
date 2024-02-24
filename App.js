import "react-native-gesture-handler";
import { useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "./components/tabs/Settings";
// Icons and other UI
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Context
import { Context } from "./components/contexts/Global";
import ScanScreen from "./components/tabs/Scan";
import TemplatesScreen from "./components/tabs/Templates";
import SignScreen from "./components/tabs/Sign";
import { createStackNavigator } from "@react-navigation/stack";

// Stack Nav Wrapper, Tab Nav Secondary
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Main() {
  // Ref used in Sign & DrawSign
  const bottomSheetChooseDocument = useRef();
  // Shared state for DrawSign & DocumentEditor
  const [signatureList, setSignatureList] = useState([]);

  return (
    <Context.Provider
      value={{ signatureList, setSignatureList, bottomSheetChooseDocument }}
    >
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <Tab.Navigator
            options={{
              tabBarOptions: {
                style: {
                  backgroundColor: "white",
                },
              },
            }}
          >
            <Tab.Screen
              name="eSign"
              options={{
                headerShown: false,
                tabBarIcon: ({}) => (
                  <MaterialCommunityIcons
                    name="draw-pen"
                    size={24}
                    color="black"
                  />
                ),
              }}
              component={SignScreen}
            />

            <Tab.Screen
              name="Scan"
              options={{
                headerShown: false,
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="credit-card-scan"
                    size={24}
                    color="black"
                  />
                ),
              }}
              component={ScanScreen}
            />

            <Tab.Screen
              name="Templates"
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="newspaper" size={24} color="black" />
                ),
              }}
              component={TemplatesScreen}
            />

            <Tab.Screen
              name="Settings"
              options={{
                headerShown: false,
                tabBarIcon: () => (
                  <Ionicons name="settings" color="black" size={24} />
                ),
              }}
              component={SettingsScreen}
            />
          </Tab.Navigator>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Context.Provider>
  );
}
