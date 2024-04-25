import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import { actionButton } from "../../constants/UI";
import { showMessage } from "react-native-flash-message";
import { getFileName } from "../functions/Global";
import { openShareOptions } from "./functions";

export default function DocumentPreview({ route, navigation }) {
  const { doc, parent } = route.params;
  const source = { uri: doc.path, cache: true };
  const path = doc.path;

  return (
    <View className="my-6">
      <View className="flex-row items-center justify-between mx-4">
        <Text className="text-lg font-semibold">{getFileName(doc.name)}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ScanScreen")}
          className={`bg-gray-200 rounded-full p-2`}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between bg-white w-full mt-4 px-2 py-1">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DocumentEditor", { pickedDocument: path })
          }
          className={`flex-row items-center bg-[${actionButton}] p-2 rounded-lg`}
        >
          <Feather name="edit" size={20} color="white" />
          <Text className="text-white mx-2">Edit Document</Text>
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity
            onPress={() => navigation.navigate("DocumentDetails", { doc })}
            className="p-3"
          >
            <Feather name="info" size={24} color="black" />
          </TouchableOpacity>

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
          source={source}
          minScale={1.0}
          scale={1.0}
          spacing={0}
          fitPolicy={0}
          enablePaging={true}
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
