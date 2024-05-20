import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { bgColor } from "../../constants/UI";

export default function SplashScreen() {
  return (
    <View className={`flex-1 items-center justify-center bg-[${bgColor}]`}>
      <LottieView
        autoPlay
        style={{ width: 300, height: 250 }}
        source={require("../../assets/lottie/splash.json")}
      />
      <Text className={`font-bold text-3xl`}>SimpleSign</Text>
    </View>
  );
}
