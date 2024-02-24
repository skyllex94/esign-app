import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SafeAreaView, Button, Text, View, Image } from "react-native";
import { Context } from "../contexts/Global";
// PDF Imports
import Pdf from "react-native-pdf";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
// BottomSheet
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

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
  // Signature list context
  const { signatureList, setSignatureList } = useContext(Context);

  useEffect(() => {
    displayStoredSignatures();
  }, []);

  // Passed path name for the documents picked
  const { pickedFile } = route.params;
  const source = { uri: pickedFile.assets[0].uri };
  console.log("pickedFile:", pickedFile);

  // Bottomsheet refs and values
  const editingPalette = useRef();
  const snapPoints = useMemo(() => ["22%"], []);

  // Bottomsheet callbacks
  const handlePresentModalPress = useCallback(() => {
    editingPalette.current?.present();
  }, []);

  const print = async () => {
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

  async function displayStoredSignatures() {
    let dir = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "SimpleSign"
    );

    dir.forEach((val) => {
      signatureList.push(FileSystem.documentDirectory + "SimpleSign/" + val);
    });

    setSignatureList(() => [...signatureList]);
  }

  return (
    <SafeAreaView className="flex-1">
      <Button title="Print" onPress={print} />
      <Button title="OpenBottomSheet" onPress={handlePresentModalPress} />
      <View />
      <Button title="Print to PDF file" onPress={printToFile} />

      <View />
      <Button title="Select printer" onPress={selectPrinter} />
      <View />
      {selectedPrinter ? (
        <Text>{`Selected printer: ${selectedPrinter.name}`}</Text>
      ) : undefined}

      <Pdf
        source={source}
        className="flex-1 h-full w-full"
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
      />

      <BottomSheetModal
        ref={editingPalette}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} enableTouchThrough={true} />
        )}
        enableOverDrag={false}
        enablePanDownToClose={false}
      >
        <View className="flex-row items-center justify-between px-3 pb-6 z-[10]">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1"
          >
            {showSignatures ? (
              <View className="flex-1 justify-between">
                <View>
                  <TouchableOpacity
                    onPress={() => setShowSignatures((curr) => !curr)}
                    className="h-10 w-10 items-center justify-center border-2 rounded-full"
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-start">
                  <TouchableOpacity
                    onPress={addNewSignature}
                    className="border-2 p-2 mt-7 mx-2 rounded-full"
                  >
                    <FontAwesome6 name="add" size={24} color="black" />
                  </TouchableOpacity>
                  {signatureList.map((path, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-start mx-1 mt-6 bg-slate-50 border-slate-300 border-2 rounded-lg"
                    >
                      <TouchableOpacity
                        onPress={() => selectSignature(path)}
                        className="flex-row p-1 "
                      >
                        <Image className="h-10 w-20" source={{ uri: path }} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteSignature(path)}>
                        <Ionicons name="close" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View className="items-center justify-center">
                <TouchableOpacity
                  className="bg-gray-200 rounded-full py-3 px-10"
                  onPress={() => setShowSignatures((curr) => !curr)}
                >
                  <FontAwesome6 name="signature" size={24} color="black" />
                  <Text>eSign</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
