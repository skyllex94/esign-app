import { useCallback, useMemo, useRef, useState } from "react";
import { SafeAreaView, Button, Text, View } from "react-native";
// PDF Imports
import Pdf from "react-native-pdf";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { TouchableOpacity } from "react-native-gesture-handler";
// BottomSheet
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

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
  const { pickedFile } = route.params;
  const source = { uri: pickedFile.assets[0].uri };
  console.log("pickedFile:", pickedFile);

  const editingPalette = useRef();
  const snapPoints = useMemo(() => ["12%"], []);

  // callbacks
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

  function openSignaturesModal() {
    navigation.navigate("DrawSign");
    editingPalette.current.close();
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
          <View className="items-center justify-center">
            <TouchableOpacity
              className="bg-gray-200 rounded-full py-3 px-5"
              onPress={openSignaturesModal}
            >
              <FontAwesome6 name="signature" size={24} color="black" />
            </TouchableOpacity>
            <Text>Sign</Text>
          </View>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
