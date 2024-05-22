import { View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
// UI Imports
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
// Signature Imports
import ReactNativeBlobUtil from "react-native-blob-util";
import { ScrollView } from "react-native-gesture-handler";
import { Context } from "../../contexts/Global";
import { deleteSignature } from ".././functions";
import Checkbox from "expo-checkbox";
import { actionButton } from "../../../constants/UI";
import * as FileSystem from "expo-file-system";
import { SignatureDetails } from ".././SignatureDetails";
import DrawingCanvas from ".././DrawingCanvas";

export default function InitialsLibrary({ navigation }) {
  // Initials Details Modal
  const [initialsDetailsModal, setInitialsDetailsModal] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState(null);

  const [checked, setChecked] = useState(false);

  const {
    initialsList,
    setInitialsList,
    bottomSheetChooseDocument,
    librarySheet,
  } = useContext(Context);

  useEffect(() => {
    bottomSheetChooseDocument?.current.dismiss();
    librarySheet?.current.dismiss();
  }, []);

  async function previewInitials(path) {
    ReactNativeBlobUtil.ios.openDocument(path);
  }

  async function showInitialsDetails(path) {
    const initialsInfo = await FileSystem.getInfoAsync(path);
    setDetailsInfo(initialsInfo);
    setInitialsDetailsModal((curr) => !curr);
  }

  return (
    <SafeAreaView className="flex-1">
      <DrawingCanvas navigation={navigation} type={"initials"} />

      <View className="flex-1 mx-3 mb-2">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1">
            {initialsList.map((path, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between my-1 w-full bg-slate-50 border-gray-300 rounded-lg"
              >
                <TouchableOpacity>
                  <Checkbox
                    className={`${
                      !checked && "border-gray-400"
                    } ml-4 p-2 rounded-full`}
                    color={actionButton}
                    value={checked}
                    onValueChange={setChecked}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row justify-center items-center p-1 ml-4 w-60"
                  onPress={() => previewInitials(path)}
                >
                  <Image
                    key={path}
                    className="h-12 w-20"
                    source={{ uri: path }}
                  />
                </TouchableOpacity>

                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => showInitialsDetails(path)}>
                    <MaterialIcons name="more-horiz" size={24} color="gray" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="ml-2 mr-3"
                    onPress={() =>
                      deleteSignature(
                        path,
                        initialsList,
                        setInitialsList,
                        "initials"
                      )
                    }
                  >
                    <AntDesign name="close" size={22} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {initialsDetailsModal && (
          <SignatureDetails
            detailsInfo={detailsInfo}
            signatureDetailsModal={initialsDetailsModal}
            setSignatureDetailsModal={setInitialsDetailsModal}
            type={"initials"}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
