import { View, Text, PanResponder, Image, Animated } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function Mani2() {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = useRef();

  const [originViewHeight, setOriginViewHeight] = useState(200);
  const [viewHeight, setViewHeight] = useState(200);

  const [isPanning, setIsPanning] = useState(false);

  const panResponderResize = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          //begin pan
          setIsPanning(true);
        },
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          //panning
          setViewHeight(originViewHeight + gesture.dy);
        },
        onPanResponderEnd: (event, gesture) => {
          // end pan
          setIsPanning(false);
          setOriginViewHeight(originViewHeight + gesture.dy);
        },
      }),
    [originViewHeight]
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

          // setImageX(h);
          // setImageY(w);
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
        className="items-start"
      >
        <View className="flex-row border-dashed border items-end">
          <TouchableOpacity
            className="absolute left-[-15] top-[-15] h-[30px] w-[30px]"
            {...panResponderResize.panHandlers}
          >
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>

          <Image
            source={require("../../assets/snack-icon.png")}
            style={{ height: viewHeight, width: viewHeight }}
            {...panResponderMovement.panHandlers}
          />

          <View
            className="absolute right-[-20] bottom-[-20] h-[30px] w-[30px]"
            {...panResponderResize.panHandlers}
          >
            <MaterialCommunityIcons
              name="move-resize"
              size={24}
              color="black"
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
