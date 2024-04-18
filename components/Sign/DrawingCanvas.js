import { View, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DrawingCanvasHeight } from "../../constants/Utils";
import SignatureCapture from "react-native-signature-capture";
import ReactNativeBlobUtil from "react-native-blob-util";
import { Context } from "../contexts/Global";
import { Button, Text } from "react-native";
import { loadStoredInitials, loadStoredSignatures } from "./functions";
import { captureRef } from "react-native-view-shot";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function DrawingCanvas({
  navigation,
  isModal,
  setShowSignatureModal,
  type,
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
  const { signatureList, setSignatureList, initialsList, setInitialsList } =
    useContext(Context);

  // Needed to update when signature color is changed
  useEffect(() => {
    setUpdateSignatureCapture(true);
  }, [signatureColor]);

  async function createSignatureFile(signatureBase64) {
    const dirs = ReactNativeBlobUtil.fs.dirs;

    let filePath = null;

    if (type && type === "initials") {
      filePath =
        dirs.DocumentDir +
        "/Initials" +
        "/initials-" +
        new Date().getMilliseconds() +
        ".png";
    } else {
      filePath =
        dirs.DocumentDir +
        "/Signatures" +
        "/signature" +
        new Date().getMilliseconds() +
        ".png";
    }

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

    if (type === "initials") {
      setInitialsList([...initialsList, filePath]);
      loadStoredInitials(setInitialsList);
    } else {
      // Include filePath into the signature array
      setSignatureList([...signatureList, filePath]);
      loadStoredSignatures(setSignatureList);
    }

    // Close Modal after completion
    if (isModal) setShowSignatureModal(false);
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
      if (text === "") return;
      writtenSignatureRef.current.blur();

      // Capturing the signature textInput through the ref
      const writtenSignatureBase64 = await captureRef(writtenSignatureRef, {
        format: "png",
        result: "base64",
      });

      createSignatureFile(writtenSignatureBase64);
      onChangeText("");
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

        <View
          className={`flex-row gap-4 ${isModal ? "my-1 pb-4" : "my-3 mx-5"} `}
        >
          <TouchableOpacity
            className={`${
              signatureInputOption === "draw" && "border-b-2"
            } border-b-[#7851A9] pb-1 ml-2`}
            onPress={() => setSignatureInputOption("draw")}
          >
            <Text className="text-[16px]">Draw</Text>
          </TouchableOpacity>

          {(!type === "initials" || !isModal) && (
            <TouchableOpacity
              className={`${
                signatureInputOption === "write" && "border-b-2"
              } border-b-[#7851A9] pb-1`}
              onPress={switchToWriting}
            >
              <Text className="text-[16px]">Write</Text>
            </TouchableOpacity>
          )}
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
              style={{ width: "100%", height: DrawingCanvasHeight }}
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
          <View className="items-center bg-white justify-center h-[344px] border-0.5 border-dashed">
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

        <View
          className={`flex-row items-center ${
            isModal ? "justify-end my-4" : "justify-between m-4"
          } `}
        >
          {!isModal && <Text className="text-[18px]">My Signatures</Text>}

          <View className="flex-row ">
            <Button onPress={saveSignature} title="Save" />
            <Button onPress={clearSignature} title="Clear" />
          </View>
        </View>
      </View>
    </React.Fragment>
  );
}
