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
  elementSizeHeight,
  setElementSizeHeight,
  pdfWidth,
  pdfHeight,
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
        // console.log("pdfWidth:", pdfWidth, "pdfHeight:", pdfHeight);

        // Measure the relative x & y of the signature to the pdf canvas
        elementLocation.current.measure((h, w, px, py, x, y) => {
          console.log("rel_x", h, "rel_y", w, px, py, x, y);

          setCoordinateX(h);
          setCoordinateY(w);
        });

        pan.extractOffset();
      },
    })
  ).current;

  return (
    <View className="items-center justify-center">
      <Animated.View
        ref={elementLocation}
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      >
        <View className="flex-row justify-start items-start">
          <Image
            className="mr-2"
            style={{
              height: elementSizeHeight,
              width: elementSizeWidth,
            }}
            source={{ uri: selectedSignaturePath }}
          />
          <View className="justify-between">
            <View className="justify-center items-start">
              <TouchableOpacity
                className="mb-3 bg-red-600 rounded-full"
                onPress={() => setInputSignature(false)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mb-1"
              onPress={() => {
                setElementSizeWidth((curr) => curr + 10);
                setElementSizeHeight((curr) => curr + 10);
              }}
            >
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setElementSizeWidth((curr) => curr - 10);
                setElementSizeHeight((curr) => curr - 10);
              }}
            >
              <AntDesign name="minuscircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
