import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./components/tabs/Home";
import SettingsScreen from "./components/tabs/Settings";
// Icons and other UI
import Ionicons from "@expo/vector-icons/Ionicons";
import AddScreen from "./components/tabs/Add";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Context
import { Context } from "./components/contexts/Global";

const Tab = createBottomTabNavigator();

export default function App() {
  const bottomSheetModalRef = React.useRef();

  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <Context.Provider value={{ bottomSheetModalRef, handlePresentModalPress }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <NavigationContainer>
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
                name="Home"
                options={{
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: "white",
                  },
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={24} color="black" />
                  ),
                }}
                component={HomeScreen}
              />

              <Tab.Screen
                name="Add"
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="add-sharp" size={24} color="black" />
                  ),
                }}
                listeners={{
                  tabPress: (e) => {},
                }}
                component={AddScreen}
              />

              <Tab.Screen
                name="Templates"
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="newspaper" size={24} color="black" />
                  ),
                }}
                component={SettingsScreen}
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
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Context.Provider>
  );
}
