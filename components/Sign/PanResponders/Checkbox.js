import { AntDesign } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  View,
  PanResponder,
  Text,
  TouchableOpacity,
} from "react-native";

export default function Checkbox({
  setShowCheckbox,
  setCheckboxPositionX,
  setCheckboxPositionY,
  checkboxSize,
  setCheckboxSize,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = React.useRef();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (event) => {
        // Measure the relative x & y of the signature to the pdf canvas
        elementLocation.current.measure((h, w) => {
          setCheckboxPositionX(h);
          setCheckboxPositionY(w);
        });

        pan.extractOffset();
      },
    })
  ).current;

  return (
    <View className="items-center justify-center relative">
      <Animated.View
        ref={elementLocation}
        className="absolute mx-auto top-10"
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      >
        <View className="flex-row justify-start items-start ">
          <View className="my-0">
            <Text style={{ fontSize: checkboxSize }}>☑</Text>
          </View>

          <View className="flex-row justify-end mt-2">
            <View className="flex-row justify-end items-end">
              <TouchableOpacity
                className="bg-red-600 rounded-full mx-1"
                onPress={() => setShowCheckbox(false)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-1 justify-between mx-1">
              <TouchableOpacity
                onPress={() => setCheckboxSize((curr) => curr + 1)}
              >
                <AntDesign name="pluscircleo" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCheckboxSize((curr) => curr - 1)}
              >
                <AntDesign name="minuscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
