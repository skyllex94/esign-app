import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import { actionButton } from "../../constants/UI";
import { showMessage } from "react-native-flash-message";
import { openShareOptions } from "../Sign/functions";

export default function TemplatePreview({ route, navigation }) {
  const { template } = route.params;

  return (
    <View className="my-6">
      <View className="flex-row items-center justify-between mx-4">
        <Text className="text-lg font-semibold">{template.name}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`bg-gray-200 rounded-full p-2`}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between bg-white w-full mt-4 px-2 py-1">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            navigation.navigate("DocumentEditor", {
              pickedDocument: template.path,
            });
          }}
          className={`flex-row items-center bg-[${actionButton}] p-2 rounded-lg`}
        >
          <Feather name="edit" size={20} color="white" />
          <Text className="text-white mx-2">Use Template</Text>
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity
            className="p-3"
            onPress={() => openShareOptions(path)}
          >
            <Feather name="share" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-10">
        <Pdf
          source={template.file}
          minScale={1.0}
          scale={1.0}
          fitPolicy={0}
          style={{ width: Dimensions.get("window").width, height: 540 }}
          onError={(error) => {
            showMessage({
              message: "Error while displaying document",
              description: error.toString(),
              duration: 3000,
              type: "danger",
            });
          }}
        />
      </View>
    </View>
  );
}
