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
  uint8ToBase64Conversion,
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
  // The raw Base 64 data of the pdf file
  const [pdfBase64, setPdfBase64] = useState(null);
  // Signature's array buffer state
  const [signatureArrayBuffer, setSignatureArrayBuffer] = useState(null);
  // Signature's Base64 data state
  const [signatureBase64Data, setSignatureBase64Data] = useState(null);
  // PDF page dimension states
  const [pageHeight, setPageHeight] = useState();
  const [pageWidth, setPageWidth] = useState();
  // Edited PDF file path
  const [editedPdfPath, setEditedPdfPath] = useState();

  // Populate the stored signatures in the app's private storage
  useEffect(() => {
    displayStoredSignatures(setSignatureList);
    editingPalette.current.present();
  }, []);

  useEffect(() => {
    // Reads the raw data from the chosen PDF
    readPdf();

    if (signatureBase64Data) {
      console.log("Triggered useEffect signatureBase64");
      setSignatureArrayBuffer(base64ToArrayBuffer(signatureBase64Data));
    }
  }, [signatureBase64Data]);

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

    setPdfBase64(readDocument);
    setPdfArrayBuffer(base64ToArrayBuffer(readDocument));
  }

  const base64ToArrayBuffer = (base64) => {
    const binary_string = decode(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);

    return bytes;
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
          onLoadComplete={(numberOfPages, filePath, { height, width }) => {
            setPageHeight(height);
            setPageWidth(width);
          }}
          onPageSingleTap={async (page, x, y) => {
            console.log(`tapPage: ${page}`);
            console.log(`x coordinate Peter: ${x}`);
            console.log(`y Don't use 3 fingers: ${y}`);

            const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
            console.log("pdfDoc:", pdfDoc);

            const pages = pdfDoc.getPages();
            const firstPage = pages[page - 1];
            console.log("firstPage:", firstPage);

            // Inputting the signature inside the PDF document
            if (signatureArrayBuffer) {
              const signatureImage = await pdfDoc.embedPng(
                signatureArrayBuffer
              );

              firstPage.drawImage(signatureImage, {
                x: (pageWidth * (x - 12)) / Dimensions.get("window").width,
                y: pageHeight - (pageHeight * (y + 12)) / 540,
                width: 50,
                height: 50,
              });
              console.log("signatureImage:", signatureImage);

              // Saving the new editted document
              const pdfEditedBytes = await pdfDoc.save();
              const pdfBase64 = uint8ToBase64Conversion(pdfEditedBytes);
              // console.log("pdfBase64:", pdfBase64);

              const editedDocPath = `${
                RNFS.DocumentDirectoryPath
              }/SignedDocuments/Document_${Date.now()}`;

              console.log("editedDocPath", editedDocPath);

              try {
                await RNFS.writeFile(editedDocPath, pdfBase64, "base64");

                setEditedPdfPath(editedDocPath);
                setPdfBase64(pdfBase64);
                console.log("Success, you have your newly edited document");
              } catch (error) {
                console.log(error);
              }
            }
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
                            setInputSignature,
                            setSelectedSignaturePath,
                            setSignatureBase64Data
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
