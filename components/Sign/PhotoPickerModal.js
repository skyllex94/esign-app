import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import LoadingModal from "./LoadingModal";
import { actionButton } from "../../constants/UI";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native";

export default function PhotoPickerModal({
  showPhotoPickerOptionsModal,
  setShowPhotoPickerOptionsModal,
}) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const pickImageAsync = async () => {
    try {
      let pickedDocument = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        selectionLimit: 1,
      });

      setShowPhotoPickerOptionsModal(true);
      setShowLoadingModal(true);

      const uri = pickedDocument.assets[0].uri;
      console.log("uri:", uri);

      const dirs = ReactNativeBlobUtil.fs.dirs;
      const outputPath = `file://${
        dirs.DocumentDir
      }/doc${new Date().getMilliseconds()}.pdf`;

      console.log("outputPath:", outputPath);
      const width = parseInt(Dimensions.get("window").width);

      const options = {
        pages: [{ imagePath: uri, imageFit: "contain", width, height: 540 }],
        outputPath,
      };

      try {
        const imageToPdf = await createPdf(options);
        console.log("imageToPdf:", imageToPdf);

        navigation.navigate("DocumentEditor", {
          pickedDocument: imageToPdf,
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log("err:", err);
      if (err.canceled)
        showMessage({
          duration: 4000,
          type: "danger",
          title: "Cancelled",
          message: "No image was chosen from the selection",
        });
    }
    setShowLoadingModal(false);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPhotoPickerOptionsModal}
        onRequestClose={() => setShowPhotoPickerOptionsModal((curr) => !curr)}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={() => setShowPhotoPickerOptionsModal(false)}
        />

        <View className="flex-1 justify-center items-center">
          <View className="m-8 bg-white rounded-lg p-5 shadow">
            <View className="flex-row items-center justify-between my-2 w-full">
              <TextInput
                placeholder="Text to be added..."
                // onChangeText={(text) => setText(text)}
                className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
              />
            </View>

            <View className="flex-row items-center justify-between my-3 w-full">
              <TouchableOpacity
                // onPress={loadTextPanResponder}
                className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
              >
                <Text className="text-[16px] text-white">Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowPhotoPickerOptionsModal(false)}
                className={`rounded-lg bg-slate-200 py-3 px-6`}
              >
                <Text className="text-[16px]">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="flex-1"
          onPress={() => setShowPhotoPickerOptionsModal(false)}
        />
      </Modal>

      {showLoadingModal && (
        <LoadingModal
          showModal={showLoadingModal}
          setShowModal={setShowLoadingModal}
        />
      )}
    </View>
  );
}
