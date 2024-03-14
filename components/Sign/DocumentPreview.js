import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import { actionButton } from "../../constants/UI";

export default function DocumentPreview({ route, navigation }) {
  const { doc } = route.params;
  const source = { uri: doc.path, cache: true };
  const path = doc.path;

  console.log("doc:", doc);

  return (
    <View className="my-6">
      <View className="flex-row items-center justify-between mx-4">
        <Text className="text-lg font-semibold">{doc.name.split(".")[0]}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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

          <TouchableOpacity className="p-3">
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
          onLoadComplete={(pages, path, { height, width }) => {
            // setPageHeight(height);
            // console.log("pdf_height:", height);
            // setPageWidth(width);
            // console.log("pdf_width:", width);
            // console.log("pdf_ratio:", (height / width).toFixed(2));
            // setPageRatio((height / width).toFixed(2));
          }}
          onPageChanged={(page, numOfPages) => {
            console.log("Current Page", page);
            // setCurrPage(page);
          }}
          onPageSingleTap={(page, x, y) => {
            console.log("x", x);
            console.log("y", y);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
        />
      </View>
    </View>
  );
}
