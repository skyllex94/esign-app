import { View, PanResponder, Image, Animated } from "react-native";
import React, { useMemo, useRef } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function Signature({
  setShowSignaturePanResponder,
  selectedSignaturePath,
  setCoordinateX,
  setCoordinateY,
  elementSizeWidth,
  setElementSizeWidth,
  elementSizeHeight,
  setElementSizeHeight,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = useRef();

  const panResponderResize = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          setElementSizeHeight(elementSizeHeight + gesture.dy);
          setElementSizeWidth(elementSizeWidth + gesture.dy);
        },
        onPanResponderEnd: (event, gesture) => {
          setElementSizeHeight(elementSizeHeight + gesture.dy);
          setElementSizeWidth(elementSizeWidth + gesture.dy);
        },
      }),
    [setElementSizeHeight]
  );

  const panResponderMovement = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {
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
    <View className="items-center justify-center relative">
      <Animated.View
        ref={elementLocation}
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        className="items-start absolute mx-auto top-10"
      >
        <View className="flex-row border-dashed border items-end">
          <TouchableOpacity
            className="absolute left-[-15] top-[-15] h-[25px] w-[25px] bg-white rounded-full"
            onPress={() => setShowSignaturePanResponder(false)}
          >
            <AntDesign name="closecircle" size={25} color="red" />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedSignaturePath }}
            style={{ height: elementSizeHeight, width: elementSizeWidth }}
            {...panResponderMovement.panHandlers}
          />

          <View
            className="absolute items-center justify-center
            right-[-15] bottom-[-15] h-[25px] w-[25px] bg-purple-500 rounded-full"
            {...panResponderResize.panHandlers}
          >
            <FontAwesome
              name="expand"
              style={{ transform: [{ rotateY: "180deg" }] }}
              size={15}
              color="white"
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
