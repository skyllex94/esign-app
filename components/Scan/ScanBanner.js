import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScanBanner() {
  return (
    <View className="bg-white mx-3 rounded-lg">
      <LinearGradient
        className="flex-row bg-white items-center justify-between py-3 w-full rounded-lg"
        colors={["#614385", "#516395"]}
        start={[0, 0]}
        end={[1, 1]}
        location={[0.25, 0.4, 1]}
      >
        <View className="flex-1 items-start ml-5 gap-y-1">
          <Text className="text-lg text-white font-semibold text-[20px]">
            Camera Scanner
          </Text>
          <Text className="text-slate-300 font-light">
            Scan and edit the document with different options including filters
            and exact point placements for accurately saving only the document.
          </Text>
        </View>

        <Image
          className="h-32 w-24"
          source={require("../../assets/img/1.png")}
        />
      </LinearGradient>
    </View>
  );
}
