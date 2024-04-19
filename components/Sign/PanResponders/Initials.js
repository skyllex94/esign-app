import { View, PanResponder, Image, Animated } from "react-native";
import React, { useMemo, useRef } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function Initials({
  setShowInitials,
  selectedInitialsPath,
  setInitialsX,
  setInitialsY,
  initialsWidthSize,
  setInitialsWidthSize,
  initialsHeightSize,
  setInitialsHeightSize,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = React.useRef();

  const panResponderResize = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          //panning
          setInitialsHeightSize(initialsHeightSize + gesture.dy);
          setInitialsWidthSize(initialsWidthSize + gesture.dy);
        },
        onPanResponderEnd: (event, gesture) => {
          setInitialsHeightSize(initialsHeightSize + gesture.dy);
          setInitialsWidthSize(initialsWidthSize + gesture.dy);
        },
      }),
    [setInitialsHeightSize]
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

          setInitialsX(h);
          setInitialsY(w);
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
            onPress={() => setShowInitials(false)}
          >
            <AntDesign name="closecircle" size={25} color="red" />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedInitialsPath }}
            style={{ height: initialsHeightSize, width: initialsWidthSize }}
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
