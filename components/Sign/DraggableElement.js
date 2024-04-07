import { AntDesign } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  View,
  PanResponder,
  Image,
  TouchableOpacity,
} from "react-native";

export default function DraggableElement({
  pageRatio,
  setInputSignature,
  selectedSignaturePath,
  setCoordinateX,
  setCoordinateY,
  elementSizeWidth,
  setElementSizeWidth,
  pdfWidth,
  pdfHeight,
}) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (event) => {
        console.log("event_not_changed:", event.nativeEvent);

        console.log("event_x_changed:", event.nativeEvent.pageX - 60);
        console.log("event_y_changed:", event.nativeEvent.pageY - 130);

        console.log("pdfWidth:", pdfWidth);
        console.log("pdfHeight:", pdfHeight);

        setCoordinateX(event.nativeEvent.pageX + 60);
        setCoordinateY(event.nativeEvent.pageY - 130);

        pan.extractOffset();
      },
    })
  ).current;

  return (
    <View className="items-center justify-center mt-96">
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      >
        <View className="flex-row justify-start items-start">
          <Image
            className="border-2"
            style={{
              height: elementSizeWidth,
              width: elementSizeWidth, // * pageRatio
            }}
            source={{ uri: selectedSignaturePath }}
          />
          <View className="justify-between">
            <View className="justify-center items-start">
              <TouchableOpacity
                className=" bg-red-600 rounded-full"
                onPress={() => setInputSignature(false)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setElementSizeWidth((curr) => curr + 10)}
            >
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setElementSizeWidth((curr) => curr - 10)}
            >
              <AntDesign name="minuscircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
