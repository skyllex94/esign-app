import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  PanResponder,
  Image,
  TouchableOpacity,
} from "react-native";

export default function ImageSelection({
  imagePath,
  setImageX,
  setImageY,
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  setShowImageSelection,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = useRef();
  const [imageRatio, setImageRatio] = useState();

  useEffect(() => {
    // Figure out the width and height of image
    Image.getSize(imagePath, (width, height) => {
      setImageRatio((height / width).toFixed(2));

      setImageWidth(80);
      setImageHeight(80 * (height / width).toFixed(2));
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {
        // Measure the relative x & y of the signature to the pdf canvas
        elementLocation.current.measure((h, w, px, py, x, y) => {
          console.log("rel_x", h, "rel_y", w, px, py, x, y);

          setImageX(h);
          setImageY(w);
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
        <View className="flex-row justify-start items-start">
          <Image
            className="mr-2"
            style={{
              height: imageHeight,
              width: imageWidth,
            }}
            source={{ uri: imagePath }}
          />
          <View className="justify-between">
            <View className="justify-center items-start">
              <TouchableOpacity
                className="mb-3 bg-red-600 rounded-full"
                onPress={() => setShowImageSelection(false)}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mb-1"
              onPress={() => {
                setImageHeight((curr) => curr + 10 * imageRatio);
                setImageWidth((curr) => curr + 10);
              }}
            >
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImageHeight((curr) => curr - 10 * imageRatio);
                setImageWidth((curr) => curr - 10);
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
