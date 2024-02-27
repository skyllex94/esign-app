import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  Animated,
  StyleSheet,
} from "react-native";
import { Context } from "../contexts/Global";
// PDF Imports
import Pdf from "react-native-pdf";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import {
  PanGestureHandler,
  ScrollView,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
// BottomSheet
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  deleteSignature,
  displayStoredSignatures,
  selectSignature,
} from "./functions";
import { Button } from "react-native-paper";

const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body style="text-align: center;">
        <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
          Hello Expo!
        </h1>
        <img
          src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
          style="width: 90vw;" />
      </body>
    </html>
  `;

export default function DocumentEditor({ navigation, route }) {
  const [selectedPrinter, setSelectedPrinter] = useState();
  // Show current signatures
  const [showSignatures, setShowSignatures] = useState(false);
  // Input chosen signature into the pdf
  const [inputSignature, setInputSignature] = useState(false);
  // Signature list context
  const { signatureList, setSignatureList } = useContext(Context);

  useEffect(() => {
    displayStoredSignatures(setSignatureList);
  }, []);

  // Passed path name for the documents picked
  const { pickedFile } = route.params;
  const source = { uri: pickedFile.assets[0].uri };
  console.log("pickedFile:", pickedFile);

  // Bottomsheet refs and values
  const editingPalette = useRef();
  const snapPoints = useMemo(() => ["16%", "26%"], []);

  // Bottomsheet callbacks
  const handlePresentModalPress = useCallback(() => {
    editingPalette.current?.present();
  }, []);

  const printDocument = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  useEffect(() => {
    editingPalette.current.present();
  }, []);

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  function addNewSignature() {
    editingPalette.current.close();
    navigation.navigate("DrawSign");
  }

  function toggleSignatureList() {
    // if (showSignatures) editingPalette.current.collapse();
    // else editingPalette.current.expand();

    setShowSignatures((curr) => !curr);
  }

  let data = [
    { key: 1, id: 1 },
    { key: 2, id: 2 },
    { key: 3, id: 3 },
    { key: 4, id: 4 },
  ];

  let FlatItem = ({ item }) => {
    let translateX = new Animated.Value(0);
    let translateY = new Animated.Value(0);
    let height = new Animated.Value(20);
    let width = new Animated.Value(100);
    let onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: translateX,
            translationY: translateY,
          },
        },
      ],
      { useNativeDriver: false }
    );
    let onGestureTopEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: height,
            translationX: width,
          },
        },
      ],
      { useNativeDriver: false }
    );
    let _lastOffset = { x: 0, y: 0 };
    let onHandlerStateChange = (event) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        _lastOffset.x += event.nativeEvent.translationX;
        _lastOffset.y += event.nativeEvent.translationY;
        translateX.setOffset(_lastOffset.x);
        translateX.setValue(0);
        translateY.setOffset(_lastOffset.y);
        translateY.setValue(0);
      }
    };
    return (
      <View>
        <PanGestureHandler onGestureEvent={onGestureTopEvent}>
          <Animated.Image
            style={[
              styles.item,
              { transform: [{ translateX }, { translateY }] },
            ]}
            source={require("../../assets/snack-icon.png")}
          />
        </PanGestureHandler>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={{
              height,
              backgroundColor: "blue",
              transform: [{ translateX }, { translateY }],
            }}
          />
        </PanGestureHandler>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between m-2">
        <TouchableOpacity
          className="flex-row items-center mx-1"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg mx-1">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mx-1">
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg mx-1">Resize</Text>
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity className="mx-1" onPress={printToFile}>
            <MaterialIcons name="save-alt" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="mx-1" onPress={selectPrinter}>
            <MaterialCommunityIcons
              name="printer-eye"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity className="mx-1" onPress={printDocument}>
            <FontAwesome name="print" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {selectedPrinter ? (
        <Text>{`Selected printer: ${selectedPrinter.name}`}</Text>
      ) : undefined}

      <Pdf
        source={source}
        className="flex-1 pb-10 w-full"
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
      >
        <View>
          {inputSignature && (
            <FlatItem className="flex-1 z-100" item={data[0]}>
              <View style={styles.container}>
                <Image
                  source={
                    "https://s3.amazonaws.com/static.abstractapi.com/test-images/dog.jpg"
                  }
                />
              </View>
            </FlatItem>
          )}
        </View>
      </Pdf>

      <BottomSheetModal
        ref={editingPalette}
        index={0}
        snapPoints={snapPoints}
        enableHandlePanningGesture={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} enableTouchThrough={true} />
        )}
        enableOverDrag={false}
        enablePanDownToClose={false}
      >
        <View className="flex-row items-center justify-between px-3 pb-6">
          {showSignatures ? (
            <View className="flex-1">
              <View className="flex-row justify-between">
                <Text className="text-lg">My Signatures</Text>

                <TouchableOpacity
                  onPress={() => setShowSignatures((curr) => !curr)}
                  className="bg-gray-200 rounded-full p-1"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row items-start mt-2">
                  <TouchableOpacity
                    onPress={addNewSignature}
                    className="bg-slate-50 border-slate-400 border-solid border-2 rounded-lg p-3 mx-1"
                  >
                    <FontAwesome6 name="add" size={24} color="black" />
                  </TouchableOpacity>

                  {signatureList.map((path, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-start mx-1 bg-slate-50 border-slate-300 border-dashed border-2 rounded-lg"
                    >
                      <TouchableOpacity
                        onPress={() =>
                          selectSignature(path, navigation, setInputSignature)
                        }
                        className="flex-row p-1"
                      >
                        <Image className="h-10 w-20" source={{ uri: path }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          deleteSignature(path, signatureList, setSignatureList)
                        }
                      >
                        <Ionicons name="close" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                className="bg-gray-200 rounded-full mt-3 py-3 px-10"
                onPress={toggleSignatureList}
              >
                <FontAwesome6 name="signature" size={24} color="black" />
                <Text>eSign</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

let dropzoneHeight = 200;
let itemHeight = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    width: itemHeight,
    height: itemHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
