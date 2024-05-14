import "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Icons and other UI
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// Context
import { Context } from "./components/contexts/Global";
import ScanScreen from "./components/tabs/Scan";
import TemplatesScreen from "./components/tabs/Templates";
import SignScreen from "./components/tabs/Sign";
import { createStackNavigator } from "@react-navigation/stack";
import { actionButton } from "./constants/UI";
import {
  getPath,
  updateDocuments,
  updateList,
} from "./components/functions/Global";
import FlashMessage from "react-native-flash-message";
import Settings from "./components/tabs/Settings";
import Paywall from "./components/Paywall/Paywall";
import DocumentPreview from "./components/Sign/DocumentPreview";
import DocumentDetails from "./components/Sign/DocumentDetails";
import Terms from "./components/Settings/Terms";
import PrivacyPolicy from "./components/Settings/PrivacyPolicy";

// Stack Nav Wrapper, Tab Nav Secondary
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main} />

        <Stack.Screen
          name="Paywall"
          component={Paywall}
          options={{ presentation: "modal" }}
        />

        <Stack.Screen
          name="DocumentPreview"
          component={DocumentPreview}
          options={{ presentation: "modal" }}
        />

        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ presentation: "modal" }}
        />

        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

function Main() {
  // Ref used to open documents
  const bottomSheetChooseDocument = useRef();
  // Ref for requesting documents
  const requestSheet = useRef();
  // Ref for showing libraries with signature and initials files
  const librarySheet = useRef();

  // Shared state for DrawSign & DocumentEditor
  const [signatureList, setSignatureList] = useState([]);
  const [initialsList, setInitialsList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [filteredDocList, setFilteredDocList] = useState([]);

  // Scan states
  const [scanList, setScanList] = useState([]);
  const [filteredScanList, setFilteredScanList] = useState([]);
  const [scanPath, setScanPath] = useState(getPath("Scanned"));

  // UI States
  const [loadDocuments, setLoadDocuments] = useState(false);
  const [loadScannedDocs, setLoadScannedDocs] = useState(false);

  useEffect(() => {
    // Update UI for documents
    loadStoredDocuments();
  }, []);

  async function loadStoredDocuments() {
    await updateDocuments("Completed", setDocList, setFilteredDocList);
    await updateList(scanPath, setScanPath, setScanList, setFilteredScanList);

    setLoadDocuments(true);
    setLoadScannedDocs(true);
  }

  return (
    <Context.Provider
      value={{
        // Sign states
        signatureList,
        setSignatureList,
        initialsList,
        setInitialsList,
        docList,
        setDocList,
        filteredDocList,
        setFilteredDocList,
        bottomSheetChooseDocument,
        requestSheet,
        librarySheet,
        loadDocuments,
        // Scan states
        scanList,
        setScanList,
        filteredScanList,
        setFilteredScanList,
        loadScannedDocs,
        setLoadScannedDocs,
        scanPath,
        setScanPath,
      }}
    >
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <Tab.Navigator
            screenOptions={() => ({
              lazy: true,
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
                  <MaterialIcons
                    name="document-scanner"
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
              component={Settings}
            />
          </Tab.Navigator>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Context.Provider>
  );
}
