import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Context } from "../contexts/Global";
// PDF Imports
import Pdf from "react-native-pdf";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import RNFS from "react-native-fs";
import { decode, encode } from "base-64";
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

import DraggableElement from "../Sign/DraggableElement";
import { PDFDocument } from "pdf-lib";

export default function DocumentEditor({ navigation, route }) {
  const [selectedPrinter, setSelectedPrinter] = useState();
  // Show current signatures
  const [showSignatures, setShowSignatures] = useState(false);
  // Input chosen signature into the pdf
  const [inputSignature, setInputSignature] = useState(false);
  // Selected signature path
  const [selectedSignaturePath, setSelectedSignaturePath] = useState(null);
  // Signature list context
  const { signatureList, setSignatureList } = useContext(Context);

  // PDF Editing states and variables
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null);
  // The raw data of the pdf file
  const [pdfRawData, setPdfRawData] = useState(null);

  // Populate the stored signatures in the app's private storage
  useEffect(() => {
    displayStoredSignatures(setSignatureList);
    editingPalette.current.present();
  }, []);

  // Passed path name for the documents picked
  const { pickedDocument } = route.params;
  const source = { uri: pickedDocument.assets[0].uri, cache: true };

  // Bottomsheet refs and values
  const editingPalette = useRef();
  const snapPoints = useMemo(() => ["16%"], []);

  const printDocument = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const saveEditedDocument = async () => {
    // Sharing navigation once complete
    // await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });

    readPdf();
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
    setShowSignatures((curr) => !curr);
  }

  async function readPdf() {
    const readDocument = await RNFS.readFile(
      pickedDocument.assets[0].uri,
      "base64"
    );

    setPdfRawData(readDocument);
    setPdfArrayBuffer(_base64ToArrayBuffer(readDocument));
  }

  console.log(pdfArrayBuffer);

  function _base64ToArrayBuffer(base64) {
    const binary_string = decode(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);

    console.log(bytes.buffer);
    return bytes.buffer;
  }

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

        <View className="flex-row">
          <TouchableOpacity className="mx-1" onPress={saveEditedDocument}>
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

      <View style={styles.container}>
        <Pdf
          source={source}
          minScale={1.0}
          maxScale={1.0}
          scale={1.0}
          spacing={0}
          fitPolicy={0}
          enablePaging={true}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageSingleTap={async (page, x, y) => {
            console.log(`tapPage: ${page}`);
            console.log(`x: ${x}`);
            console.log(`y: ${y}`);

            const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
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
              <DraggableElement
                className="flex-1"
                selectedSignaturePath={selectedSignaturePath}
              />
            )}
          </View>
        </Pdf>
      </View>

      <BottomSheetModal
        ref={editingPalette}
        index={0}
        snapPoints={snapPoints}
        enableHandlePanningGesture={false}
        enableDynamicSizing={false}
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
                          selectSignature(
                            path,
                            navigation,
                            setInputSignature,
                            setSelectedSignaturePath
                          )
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#f4f4f4",
  },
  pdf: {
    width: Dimensions.get("window").width,
    height: 540,
  },
});
