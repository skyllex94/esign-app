import { View, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { signatureCanvasHeight } from "../../constants/Utils";
import SignatureCapture from "react-native-signature-capture";
import ReactNativeBlobUtil from "react-native-blob-util";
import { Context } from "../contexts/Global";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "react-native";
import { loadStoredSignatures } from "./functions";
import { AntDesign } from "@expo/vector-icons";

import { useFonts } from "expo-font";

export default function SignatureCanvas({
  navigation,
  isModal,
  setShowSignatureModal,
}) {
  const signature = useRef();
  const [signatureColor, setSignatureColor] = useState("black");
  const [updateSignatureCapture, setUpdateSignatureCapture] = useState(true);

  const { signatureList, setSignatureList } = useContext(Context);

  // Needed to update when signature color is changed
  useEffect(() => {
    setUpdateSignatureCapture(true);
  }, [signatureColor]);

  async function saveSignature(signature, type) {
    console.log("type:", type);
    console.log("signature:", signature);
    // signature.encoded - for the base64 encoded png
    // signature.pathName - for the file path name

    if (type === "draw") {
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
        .then((data) => data.write(signature.encoded))
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
    }
  }

  function changeSignatureColor(color) {
    if (color === signatureColor) return;
    setSignatureColor(color);
    setUpdateSignatureCapture(false);
  }

  async function saveAndUse() {
    signature.current.saveImage();

    setTimeout(() => {
      setShowSignatureModal(false);
    }, 1000);
  }

  function switchToWriting() {
    setSignatureInputOption("write");
    writeSignature?.current?.focus();
  }

  useEffect(() => {
    // Auto focus on the rename field
    writeSignature?.current?.focus();
  }, [writeSignature]);

  const writeSignature = useRef();
  const [text, onChangeText] = useState("");

  const [signatureInputOption, setSignatureInputOption] = useState("draw");

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
          <Button onPress={saveAndUse} title="Save Signature" />
          <Button
            onPress={() => signature.current.resetImage()}
            title="Clear"
          />
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
              onSaveEvent={(signature) => saveSignature(signature, "draw")}
              strokeColor={signatureColor}
            />
          ) : (
            <View className="h-[344px]" />
          ))}

        {signatureInputOption === "write" && (
          <View className="items-center justify-center h-[344px] border-0.5 border-dashed">
            <TextInput
              ref={writeSignature}
              style={{
                fontFamily: "Cedarville-Cursive",
                color: "black",
                fontSize: 72,
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
            onPress={() => changeSignatureColor("black")}
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
