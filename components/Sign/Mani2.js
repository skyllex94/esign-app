import { View, Text, PanResponder, Image, Animated } from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Mani2() {
  const [originViewHeight, setOriginViewHeight] = useState(200);
  console.log("originViewHeight:", originViewHeight);
  const [viewHeight, setViewHeight] = useState(200);
  console.log("viewHeight:", viewHeight);
  const [isPanning, setIsPanning] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = useRef();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        // console.log("eCHILD:", e.type);
        // const pans = panResponderTotal.panHandlers;
        // pans.onMoveShouldSetResponder(() => false);
        // console.log("pans:", pans);
        //begin pan
        // setIsPanning(true);
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // panning
        setViewHeight(originViewHeight + gesture.dy);
        pan.extractOffset();
      },
      onPanResponderEnd: () => {
        // end pan
        setIsPanning(false);
        setOriginViewHeight(viewHeight);
      },
    })
  ).current;

  const panResponderTotal = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {
        // Measure the relative x & y of the signature to the pdf canvas
        // elementLocation.current.measure((h, w, px, py, x, y) => {
        //   console.log("rel_x", h, "rel_y", w, px, py, x, y);

        //   // setImageX(h);
        //   // setImageY(w);
        // });

        pan.extractOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
      className="items-start"
    >
      <View className="flex-row border-dashed border items-end">
        <Image
          source={require("../../assets/snack-icon.png")}
          style={{ height: viewHeight, width: viewHeight }}
          {...panResponderTotal.panHandlers}
        />

        <View
          className="absolute right-[-20] bottom-[-20]"
          style={{
            height: 30,
            width: 30,

            textAlign: "center",
          }}
          {...panResponder.panHandlers}
        >
          <MaterialCommunityIcons name="move-resize" size={24} color="black" />
        </View>
      </View>
    </Animated.View>
  );
}
