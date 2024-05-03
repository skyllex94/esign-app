import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
// Bottom Sheet Imports
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Stack Navigation
import { createStackNavigator } from "@react-navigation/stack";
import DrawSignCapture from "../Sign/SignatureLibrary";
import DocumentEditor from "../Sign/DocumentEditor";
// Other Dependency Import
import { Context } from "../contexts/Global";
// UI Imports
import { actionButton } from "../../constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import DocumentDetails from "../Sign/DocumentDetails";
import { SearchBar } from "react-native-elements";
import DocumentPreview from "../Sign/DocumentPreview";
import DocumentSuccess from "../Sign/DocumentSuccess";
import {
  clearSearch,
  deleteStoredData,
  handleSearch,
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

import ImageSelection from "../Sign/PanResponders/ImageSelection";
import BottomSheetModal from "../Sign/BottomSheetModal";
import RequestSheet from "../Sign/RequestSheet";

// Image(s) to pdf converter
import * as ImagePicker from "expo-image-picker";
import { createPdf } from "react-native-images-to-pdf";
import ReactNativeBlobUtil from "react-native-blob-util";
import LoadingModal from "../Sign/LoadingModal";
import ChooseScanFile from "../Sign/ChooseScanFile";
import { deleteResidualFiles } from "../Scan/functions";
import LibrarySheet from "../Sign/LibrarySheet";
import InitialsLibrary from "../Sign/Initials/InitialsLibrary";

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
        name="Initials"
        component={InitialsLibrary}
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="DocumentEditor"
        component={DocumentEditor}
        options={{ presentation: "card", gestureEnabled: false }}
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
        options={{ presentation: "card" }} //  gestureEnabled: false
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
      <Stack.Screen
        name="ChooseScanFile"
        component={ChooseScanFile}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function Main({ navigation }) {
  const {
    docList,
    setSignatureList,
    setInitialsList,
    filteredDocList,
    setFilteredDocList,
    bottomSheetChooseDocument,
    requestSheet,
    librarySheet,
    loadDocuments,
  } = useContext(Context);

  const [search, setSearch] = useState(null);
  const [googleUserInfo, setGoogleUserInfo] = useState();

  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const lottieAstronautRef = useRef();

  // Load stored signatures, initials from app's data
  useEffect(() => {
    loadStoredSignatures(setSignatureList);
    loadStoredInitials(setInitialsList);
    configureGoogleSignIn();
  }, []);

  // Callbacks
  const showOpenDocumentSheet = useCallback(() => {
    bottomSheetChooseDocument.current?.present();
  }, []);

  const showRequestSheet = useCallback(() => {
    requestSheet.current?.present();
  }, []);

  const showLibrarySheet = useCallback(() => {
    librarySheet.current?.present();
  });

  function previewDocument(doc) {
    navigation.navigate("DocumentPreview", { doc });
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
    const fetchedStoredData = await retrieveStoredData("gdrive_tkn");

    try {
      const res = await GoogleSignin.revokeAccess();
      console.log("res:", res);
      GoogleSignin.signOut();
      await deleteStoredData("gdrive_tkn");

      if (fetchedStoredData)
        showMessage({
          duration: 4000,
          title: "Signout",
          message: "You are signed out from your Google Drive Account",
          type: "success",
        });
    } catch (err) {}
  }

  // Retrieve data from the AsyncStorage if any
  async function preopeningGoogleDriveCheckups() {
    const fetchedStoredData = await retrieveStoredData("gdrive_tkn");

    // if (fetchedStoredData === null) openGoogleDriveOAuth();

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

      return openGoogleDriveOAuth();
    }

    console.log("Fetched Tkn From Storage");
    navigation.navigate("GoogleDrive", { token: fetchedStoredData });
  }

  const pickImageAsync = async () => {
    try {
      let pickedDocument = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 1,
      });

      setShowLoadingModal(true);

      const uri = pickedDocument.assets[0].uri;
      console.log("uri:", uri);

      const dirs = ReactNativeBlobUtil.fs.dirs;
      const outputPath = `file://${
        dirs.DocumentDir
      }/doc${new Date().getMilliseconds()}.pdf`;

      console.log("outputPath:", outputPath);
      const width = parseInt(Dimensions.get("window").width);

      const options = {
        pages: [{ imagePath: uri, imageFit: "contain", width, height: 540 }],
        outputPath,
      };

      try {
        const imageToPdf = await createPdf(options);
        console.log("imageToPdf:", imageToPdf);

        deleteResidualFiles([uri]);

        navigation.navigate("DocumentEditor", {
          pickedDocument: imageToPdf,
        });
      } catch (err) {
        showMessage({
          message: "Error while opening image.",
          description: err.toString(),
          duration: 4000,
          type: "danger",
        });
      }
    } catch (err) {
      if (err.canceled)
        showMessage({
          duration: 4000,
          type: "danger",
          title: "Cancelled",
          message: "No image was chosen from the selection",
        });
    }
    setShowLoadingModal(false);
  };

  async function openGoogleDriveOAuth() {
    console.log("GoogleSignIn");

    // Try-catch clause creating issues with cancelation
    try {
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

    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();
    // console.log("userInfo:", userInfo);
    const token = await GoogleSignin.getTokens();

    setGoogleUserInfo(userInfo);
    await storeData(token);

    // Open Google Drive Documents Modal
    navigation.navigate("GoogleDrive", { token });
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-150">
      <StatusBar style="auto" />
      <Text className="text-center font-bold text-2xl my-2">SimpleSign</Text>

      <View className="search-bar mx-1">
        <SearchBar
          value={search}
          onChangeText={(text) =>
            handleSearch(text, docList, setFilteredDocList, setSearch)
          }
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
              onPress={() =>
                clearSearch(setSearch, setFilteredDocList, docList)
              }
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

        {showLoadingModal && (
          <LoadingModal
            showModal={showLoadingModal}
            setShowModal={setShowLoadingModal}
          />
        )}

        <View className="flex-row items-center justify-center gap-y-1 mb-2 rounded-lg ">
          <TouchableOpacity
            onPress={showLibrarySheet}
            className={`absolute left-0 items-center justify-center z-2 bg-white p-3
            rounded-full w-[33%] h-[55px]`}
          >
            <View className="pr-4 items-center justify-center">
              <FontAwesome6 name="signature" size={24} color="black" />
              <Text>Library</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showOpenDocumentSheet}
            className={`flex-row items-center justify-center bg-[${actionButton}]
            z-20 w-[50%] h-[75px] rounded-full`}
          >
            <AntDesign name="plus" size={30} color="white" />
            <Text className="pl-2 text-white">Open Document</Text>
          </TouchableOpacity>

          <View
            className={`absolute items-center justify-center top-[-8] z-10 bg-[#f2f2f2] 
              rounded-full w-[55%] h-[91px]`}
          />

          <TouchableOpacity
            onPress={showRequestSheet}
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

      {
        <BottomSheetModal
          navigation={navigation}
          openDocument={openDocument}
          bottomSheetChooseDocument={bottomSheetChooseDocument}
          preopeningGoogleDriveCheckups={preopeningGoogleDriveCheckups}
          signOut={signOut}
          pickImageAsync={pickImageAsync}
        />
      }

      {
        <RequestSheet
          requestSheet={requestSheet}
          preopeningGoogleDriveCheckups={preopeningGoogleDriveCheckups}
          signOut={signOut}
        />
      }

      {<LibrarySheet navigation={navigation} />}
    </SafeAreaView>
  );
}
