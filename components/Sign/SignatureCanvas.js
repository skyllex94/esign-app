import { View, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { signatureCanvasHeight } from "../../constants/Utils";
import SignatureCapture from "react-native-signature-capture";
import ReactNativeBlobUtil from "react-native-blob-util";
import { Context } from "../contexts/Global";
import { Button, Text } from "react-native";
import { loadStoredSignatures } from "./functions";
import { captureRef } from "react-native-view-shot";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function SignatureCanvas({
  navigation,
  isModal,
  setShowSignatureModal,
}) {
  // Drawn signature states
  const signature = useRef();
  const [updateSignatureCapture, setUpdateSignatureCapture] = useState(true);

  // Written signature states
  const writtenSignatureRef = useRef();
  const [text, onChangeText] = useState("");

  // Shares states for the options
  const [signatureColor, setSignatureColor] = useState("black");
  const [signatureInputOption, setSignatureInputOption] = useState("draw");
  const { signatureList, setSignatureList } = useContext(Context);

  // Needed to update when signature color is changed
  useEffect(() => {
    setUpdateSignatureCapture(true);
  }, [signatureColor]);

  async function createSignatureFile(signatureBase64) {
    const dirs = ReactNativeBlobUtil.fs.dirs;

    const filePath =
      dirs.DocumentDir +
      "/Signatures" +
      "/signature" +
      new Date().getMilliseconds() +
      ".png";

    console.log("filePath:", filePath);

    ReactNativeBlobUtil.fs
      .writeStream(filePath, "base64")
      .then((data) => data.write(signatureBase64))
      .then(() => {
        // ReactNativeBlobUtil.ios.previewDocument("file://" + filePath);
        console.log("Successfully saved to: " + filePath);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });

    // Include filePath into the signature array
    setSignatureList([...signatureList, filePath]);
    loadStoredSignatures(setSignatureList);

    // Close Modal after completion
    setShowSignatureModal(false);
  }

  function changeSignatureColor(color) {
    if (color === signatureColor) return;

    if (signatureInputOption === "draw") {
      setSignatureColor(color);
      setUpdateSignatureCapture(false);
    }

    if (signatureInputOption === "write") {
      writtenSignatureRef.current.setNativeProps({ color: color });
    }
  }

  async function saveSignature() {
    if (signatureInputOption === "write") {
      writtenSignatureRef.current.blur();

      // Capturing the signature textInput through the ref
      const writtenSignatureBase64 = await captureRef(writtenSignatureRef, {
        format: "png",
        result: "base64",
      });

      createSignatureFile(writtenSignatureBase64);
    }

    if (signatureInputOption === "draw") {
      // Method that will trigger the onSaveEvent()
      signature.current.saveImage();
    }
  }

  function switchToWriting() {
    setSignatureInputOption("write");
    writtenSignatureRef?.current?.focus();
  }

  useEffect(() => {
    // Auto focus on the rename field
    writtenSignatureRef?.current?.focus();
  }, [writtenSignatureRef]);

  function clearSignature() {
    if (signatureInputOption === "draw") signature.current.resetImage();

    onChangeText("");
  }

  return (
    <React.Fragment>
      <View className="flex-row items-center justify-between">
        {!isModal && (
          <TouchableOpacity
            className="flex-row items-center m-3"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text className="text-lg mx-1">Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setSignatureInputOption("draw")}>
          <Text>Draw</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchToWriting}>
          <Text>Write</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between py-4">
          <Button onPress={saveSignature} title="Save Signature" />
          <Button onPress={clearSignature} title="Clear" />
        </View>

        {isModal && (
          <TouchableOpacity
            className={`bg-[#e6867a] rounded-full p-2`}
            onPress={() => setShowSignatureModal((curr) => !curr)}
          >
            <AntDesign name="close" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        {signatureInputOption === "draw" &&
          (updateSignatureCapture ? (
            <SignatureCapture
              style={{ width: "100%", height: signatureCanvasHeight }}
              ref={signature}
              saveImageFileInExtStorage={true}
              viewMode={"portrait"}
              showTitleLabel={false}
              showNativeButtons={false}
              onSaveEvent={(signature) =>
                createSignatureFile(signature.encoded)
              }
              strokeColor={signatureColor}
            />
          ) : (
            <View className="h-[344px]" />
          ))}

        {signatureInputOption === "write" && (
          <View className="items-center justify-center h-[344px] border-0.5 border-dashed">
            <TextInput
              ref={writtenSignatureRef}
              style={{
                fontFamily: "Cedarville-Cursive",
                color: "black",
                fontSize: 72,
                height: 344,
              }}
              onChangeText={onChangeText}
              placeholder="Sign"
              value={text}
            />
          </View>
        )}

        <View className="flex-row absolute left-5 top-5 justify-end">
          <TouchableOpacity
            className="h-8 w-8 bg-black rounded-full mx-1"
            onPress={() => changeSignatureColor("#000")}
          />
          <TouchableOpacity
            className="h-8 w-8 bg-[#0047ab] rounded-full mx-1"
            onPress={() => changeSignatureColor("#0047ab")}
          />
          <TouchableOpacity
            className="h-8 w-8 bg-[#4F7942] rounded-full mx-1"
            onPress={() => changeSignatureColor("#4F7942")}
          />
        </View>

        <View className="line justify-center absolute w-[90%] left-5 top-64">
          <View className="border-[0.5px] border-dashed border-gray-500"></View>
        </View>
      </View>
    </React.Fragment>
  );
}
