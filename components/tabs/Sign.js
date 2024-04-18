import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
// Bottom Sheet Imports
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// Stack Navigation
import { createStackNavigator } from "@react-navigation/stack";
import DrawSignCapture from "../Sign/SignatureLibrary";
import DocumentEditor from "../Sign/DocumentEditor";
// Other Dependency Import
import { Context } from "../contexts/Global";
import filter from "lodash.filter";
// UI Imports
import { actionButton } from "../../constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import DocumentDetails from "../Sign/DocumentDetails";
import { SearchBar } from "react-native-elements";
import DocumentPreview from "../Sign/DocumentPreview";
import DocumentSuccess from "../Sign/DocumentSuccess";
import {
  deleteStoredData,
  openDocument,
  retrieveStoredData,
  storeData,
} from "../functions/Global";
import { loadStoredInitials, loadStoredSignatures } from "../Sign/functions";
// OAuth imports
import LottieView from "lottie-react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { showMessage } from "react-native-flash-message";
import GoogleDrive from "../Sign/GoogleDrive";
import { GDrive } from "@robinbobin/react-native-google-drive-api-wrapper";
import DropBox from "../Sign/Services/DropBox";
import ImageSelection from "../Sign/PanResponders/ImageSelection";

const Stack = createStackNavigator();

export default function SignScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen
        name="DrawSign"
        component={DrawSignCapture}
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="DocumentEditor"
        component={DocumentEditor}
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="DocumentDetails"
        component={DocumentDetails}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="DocumentPreview"
        component={DocumentPreview}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="DocumentSuccess"
        component={DocumentSuccess}
        options={{ presentation: "card" }} // gestureEnabled: false
      />
      <Stack.Screen
        name="GoogleDrive"
        component={GoogleDrive}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="ImageSelection"
        component={ImageSelection}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function Main({ navigation }) {
  const {
    docList,
    signatureList,
    setSignatureList,
    setInitialsList,
    filteredDocList,
    setFilteredDocList,
    bottomSheetChooseDocument,
    loadDocuments,
  } = useContext(Context);
  const snapPoints = useMemo(() => ["50%"], []);
  const [search, setSearch] = useState(null);
  const [googleUserInfo, setGoogleUserInfo] = useState();

  const lottieAstronautRef = useRef();

  // Load stored signatures, initials from app's data
  useEffect(() => {
    loadStoredSignatures(setSignatureList);
    loadStoredInitials(setInitialsList);
    configureGoogleSignIn();
  }, []);

  // Callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetChooseDocument.current?.present();
  }, []);

  function openDrawSign() {
    bottomSheetChooseDocument.current.close();
    navigation.navigate("DrawSign");
  }

  function previewDocument(doc) {
    navigation.navigate("DocumentPreview", { doc });
  }

  function handleSearch(query) {
    setSearch(query);
    const formattedQuery = query.toLowerCase();

    const filteredData = filter(docList, (doc) => {
      return contains(doc, formattedQuery);
    });

    setFilteredDocList(filteredData);
  }

  const contains = ({ name }, query) => {
    if (name.toString().toLowerCase().includes(query)) return true;
    return false;
  };

  function clearSearch() {
    setSearch("");
    setFilteredDocList(docList);
  }

  function configureGoogleSignIn() {
    // Google Drive Configurations for proper scopes and connection
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive"],
      offlineAccess: true,
      iosClientId: process.env.EXPO_PUBLIC_GDRIVE_IOS_CLIENTID,
      webClientId: process.env.EXPO_PUBLIC_GDRIVE_WEB_CLIENTID,
    });
  }

  async function signOut() {
    setGoogleUserInfo(null);
    console.log("googleUserInfo:", googleUserInfo);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    await deleteStoredData("gdrive_tkn");
  }

  // Retrieve data from the AsyncStorage if any
  async function preopeningGoogleDriveCheckups() {
    const fetchedStoredData = await retrieveStoredData("gdrive_tkn");

    if (fetchedStoredData === null) openGoogleDriveOath();

    try {
      const gdrive = new GDrive();
      gdrive.accessToken = fetchedStoredData.accessToken;
      gdrive.fetchCoercesTypes = true;

      // List of documents in Google Drive
      await gdrive.files.list();
    } catch (err) {
      if (err.toString().includes("UNAUTHENTICATED")) {
        await signOut();
      }

      return openGoogleDriveOath();
    }

    console.log("Fetched Tkn From Storage");
    navigation.navigate("GoogleDrive", { token: fetchedStoredData });
  }

  async function openGoogleDriveOath() {
    console.log("GoogleSignIn");

    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();

      setGoogleUserInfo(userInfo);
      await storeData(token);

      // Open Google Drive Documents Modal
      navigation.navigate("GoogleDrive", { token });
    } catch (err) {
      console.log("err:", err);
      if (err.code === statusCodes.SIGN_IN_CANCELLED)
        showMessage({
          duration: 4000,
          title: "Cancelation",
          message: "User cancelled access to files from Google Drive.",
          type: "danger",
        });
      signOut();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-150">
      <StatusBar style="auto" />
      <Text className="text-center font-bold text-2xl my-2">SimpleSign</Text>

      <View className="search-bar mx-1">
        <SearchBar
          value={search}
          onChangeText={(text) => handleSearch(text)}
          platform="ios"
          containerStyle={{
            backgroundColor: "transparent",
            alignContent: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
            alignContent: "stretch",
            gap: 0,
            rowGap: 0,
            justifyContent: "space-between",
            margin: 0,
          }}
          placeholder="Search..."
          clearIcon={() => (
            <Ionicons
              onPress={clearSearch}
              name="close"
              size={24}
              color="#7b7d7b"
            />
          )}
          searchIcon={() => (
            <TouchableOpacity>
              <Ionicons name="search" size={24} color="#7b7d7b" />
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="flex-1 gap-y-2 mx-3">
        <View className="flex-1 items-start">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="bg-white w-full rounded-lg"
          >
            {loadDocuments ? (
              filteredDocList.length > 0 ? (
                filteredDocList.map((doc, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center py-2 border-b-[0.5px] border-slate-300"
                  >
                    <View className="m-3">
                      <AntDesign name="checkcircle" size={24} color="#99cc33" />
                    </View>

                    <TouchableOpacity
                      onPress={() => previewDocument(doc)}
                      className="flex-1 items-start gap-1 my-1"
                    >
                      <Text className="text-gray-800">{doc.name}</Text>

                      <View>
                        <Text className="text-gray-400">Signed by you</Text>

                        <Text className="text-gray-400">
                          {new Date(doc.created * 1000).toLocaleDateString(
                            "en-us",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DocumentDetails", { doc })
                      }
                      className="mx-4"
                    >
                      <Feather
                        name="more-horizontal"
                        size={24}
                        color="#b7b7b7"
                      />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View className="flex-1 mt-10 items-center justify-center">
                  <LottieView
                    autoPlay
                    speed={0.5}
                    ref={lottieAstronautRef}
                    style={{ width: 200, height: 200 }}
                    source={require("../../assets/lottie/space.json")}
                  />
                  <Text className="text-gray-500 mt-3">
                    No Documents {docList.length > 0 ? "Found" : "Yet"}
                  </Text>
                </View>
              )
            ) : (
              <View className="flex-1 mt-6 items-center justify-center">
                <ActivityIndicator size={"small"} />
              </View>
            )}
          </ScrollView>
        </View>

        <View className="flex-row items-center justify-center gap-y-1 mb-2 rounded-lg ">
          <TouchableOpacity
            onPress={() => navigation.navigate("DrawSign")}
            className={`absolute left-0 items-center justify-center z-2 bg-white p-3
            rounded-full w-[33%] h-[55px]`}
          >
            <View className="pr-4 items-center justify-center">
              <FontAwesome6 name="signature" size={24} color="black" />
              <Text>Library</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`flex-row items-center justify-center bg-[${actionButton}]
            z-20 w-[50%] h-[75px] rounded-full `}
          >
            <AntDesign name="plus" size={30} color="white" />
            <Text className="pl-2 text-white">Open Document</Text>
          </TouchableOpacity>

          <View
            className={`absolute items-center justify-center z-10 bg-[#f2f2f2] 
              rounded-full w-[55%] h-[80px]`}
          />

          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`absolute right-0 items-center justify-center z-4 bg-white p-3 
            rounded-full w-[33%] h-[55px]`}
          >
            <View className="pl-4 items-center justify-center">
              <FontAwesome name="mail-forward" size={24} color="black" />
              <Text className="pl-2">Request</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetChooseDocument}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={2}
            disappearsOnIndex={-1}
            enableTouchThrough={true}
          />
        )}
        enableOverDrag={true}
        enablePanDownToClose={true}
        animateOnMount={true}
      >
        <View className="bottomSheet flex-row items-center justify-between px-3 pb-6 z-[10]">
          <Text className="text-lg font-semibold">E-Sign Document</Text>
          <TouchableOpacity
            className="bg-gray-200 rounded-full p-2"
            onPress={() => bottomSheetChooseDocument.current.close()}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row px-3 gap-x-2 h-16">
          <TouchableOpacity
            onPress={openDrawSign}
            className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2"
          >
            <View className="flex-row items-center">
              <FontAwesome name="pencil-square-o" size={24} color="black" />
              <Text className="mx-2 font-semibold">Draw</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDrawSign}
            className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2"
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="keyboard-settings-outline"
                size={24}
                color="black"
              />
              <Text className="mx-2 font-semibold">Type</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDrawSign}
            className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2"
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="upload-outline"
                size={24}
                color="black"
              />
              <Text className="mx-2 font-semibold">Upload</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between px-3 py-6 z-[10]">
          <Text className="text-lg font-semibold">Open a Document</Text>
        </View>

        <View className="flex-row px-3 h-16 gap-x-2 mb-2">
          <TouchableOpacity
            onPress={() => openDocument(navigation, bottomSheetChooseDocument)}
            className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2"
          >
            <View className="flex-row items-center gap-x-2">
              <FontAwesome6 name="folder-open" size={24} color="black" />
              <Text className="font-semibold">Files</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={preopeningGoogleDriveCheckups}
            className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2"
          >
            <View className="flex-row items-center gap-x-2">
              <Entypo name="google-drive" size={24} color="black" />
              <Text className="font-semibold">Drive</Text>
            </View>
          </TouchableOpacity>

          <DropBox />
        </View>

        <View className="flex-row px-3 h-16 gap-x-2">
          <TouchableOpacity
            onPress={signOut}
            className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2"
          >
            <View className="flex-row items-center gap-x-2">
              <Entypo name="google-drive" size={24} color="black" />
              <Text className="font-semibold">SignOut</Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
