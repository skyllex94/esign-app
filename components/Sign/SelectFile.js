import * as React from "react";
import { SafeAreaView, Button, Text } from "react-native";
import * as Print from "expo-print";
import Pdf from "react-native-pdf";
// import { shareAsync } from "expo-sharing";

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

export default function SelectFile() {
  const [selectedPrinter, setSelectedPrinter] = React.useState();

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
    // await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  const source = {
    uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    cache: true,
  };

  return (
    <SafeAreaView>
      <Button title="Print" onPress={print} />
      <View />
      <Button title="Print to PDF file" onPress={printToFile} />

      <View />
      <Button title="Select printer" onPress={selectPrinter} />
      <View />
      {selectedPrinter ? (
        <Text>{`Selected printer: ${selectedPrinter.name}`}</Text>
      ) : undefined}

      {/*
      <Pdf
          source={source}
          className="flex-1 items-stretch"
          onLoadComplete={(numOfPages, filePath) =>
            console.log("numOfPages", numOfPages)
          }
          onPageChanged={(pageNumber) => console.log(pageNumber)}
          onError={(error) => console.log("ERROR", error)}
          onPressLink={(uri) => console.log("Link Pressed", uri)}
        />
      */}
    </SafeAreaView>
  );
}
