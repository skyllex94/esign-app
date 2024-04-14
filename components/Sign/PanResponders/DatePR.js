import { AntDesign } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  PanResponder,
  Text,
  TouchableOpacity,
} from "react-native";

export default function DatePR({
  date,
  setShowDatePanResponder,
  setDate_x,
  setDate_y,
  dateSize,
  setDateSize,
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
        elementLocation.current.measure((h, w, px, py, x, y) => {
          console.log("rel_x", h, "rel_y", w, px, py, x, y);

          setDate_x(h);
          setDate_y(w);
        });

        pan.extractOffset();
      },
    })
  ).current;

  console.log(dateSize);

  return (
    <View className="items-center justify-center">
      <Animated.View
        ref={elementLocation}
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      >
        <View className="flex-row justify-center items-start">
          <Text style={{ fontSize: dateSize }}>{date}</Text>

          <View className="flex-row justify-center items-center">
            <TouchableOpacity
              className="bg-red-600 rounded-full mx-1"
              onPress={() => setShowDatePanResponder(false)}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-1 justify-between mx-1">
            <TouchableOpacity onPress={() => setDateSize((curr) => curr + 1)}>
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDateSize((curr) => curr - 1)}>
              <AntDesign name="minuscircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
