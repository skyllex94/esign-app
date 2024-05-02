import { useEffect, useRef, useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { emailRequest } from "../Scan/functions";
import { actionButton } from "../../constants/UI";

export default function EmailRequestModal({
  showEmailRequestModal,
  setShowEmailRequestModal,
}) {
  const recipientRef = useRef();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    recipientRef.current.focus();
  }, []);

  async function openEmailRequest() {
    if (recipientEmail === "" || recipientName === "" || documentName === "")
      return;

    emailRequest({ recipientEmail, documentName, recipientName });
    setShowEmailRequestModal(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEmailRequestModal}
      onRequestClose={() => setShowEmailRequestModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowEmailRequestModal(false)}
      />

      <View className="m-8 bg-white rounded-lg p-5 shadow">
        <View className="flex-row flex-wrap gap-3 items-center justify-between my-2 w-full">
          <TextInput
            ref={recipientRef}
            placeholder="Recipient's Email"
            onChangeText={(text) => setRecipientEmail(text)}
            className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
          />

          <TextInput
            placeholder="Recipient's Name"
            onChangeText={(text) => setRecipientName(text)}
            className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
          />

          <TextInput
            placeholder="Document's Name"
            onChangeText={(text) => setDocumentName(text)}
            className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
          />
        </View>

        <View className="flex-row items-center justify-between my-2 w-full">
          <TouchableOpacity
            onPress={openEmailRequest}
            className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
          >
            <Text className="text-[16px] text-white">Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEmailRequestModal(false)}
            className={`rounded-lg bg-slate-200 py-3 px-6`}
          >
            <Text className="text-[16px]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowEmailRequestModal(false)}
      />
    </Modal>
  );
}
