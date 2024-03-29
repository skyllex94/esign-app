import "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
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
import { actionButton } from "./constants/UI";
import { updateDocuments } from "./components/functions/Global";
import FlashMessage from "react-native-flash-message";

// Stack Nav Wrapper, Tab Nav Secondary
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

function Main() {
  // Ref used in Sign & DrawSign
  const bottomSheetChooseDocument = useRef();
  // Shared state for DrawSign & DocumentEditor
  const [signatureList, setSignatureList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [filteredDocList, setFilteredDocList] = useState([]);

  // UI States
  const [loadDocuments, setLoadDocuments] = useState(false);

  useEffect(() => {
    // Update UI for documents
    loadStoredDocuments();
  }, []);

  async function loadStoredDocuments() {
    await updateDocuments(setDocList, setFilteredDocList);
    setLoadDocuments(true);
  }

  return (
    <Context.Provider
      value={{
        signatureList,
        setSignatureList,
        docList,
        setDocList,
        filteredDocList,
        setFilteredDocList,
        bottomSheetChooseDocument,
        loadDocuments,
      }}
    >
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <Tab.Navigator
            screenOptions={() => ({
              tabBarActiveTintColor: actionButton,
              tabBarInactiveTintColor: "black",
              tabBarStyle: {
                height: 85,
                paddingHorizontal: 5,
                paddingTop: 10,
              },
            })}
          >
            <Tab.Screen
              name="eSign"
              options={{
                headerShown: false,
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="draw-pen"
                    color={color}
                    size={24}
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
                    color={color}
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
                  <Ionicons name="newspaper" size={24} color={color} />
                ),
              }}
              component={TemplatesScreen}
            />

            <Tab.Screen
              name="Settings"
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings" color={color} size={24} />
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
