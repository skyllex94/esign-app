import { View, Text, PanResponder } from "react-native";
import React, { useState, useRef, useMemo } from "react";

export default function Mani3() {
  const [originViewHeight, setOriginViewHeight] = useState(200);
  const [viewHeight, setViewHeight] = useState(200);
  const [isPanning, setIsPanning] = useState(false);

  const panResponder = useMemo(
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

  return (
    <View>
      <View style={{ height: viewHeight, backgroundColor: "blue" }} />
      <Text
        style={{ height: 44, backgroundColor: "yellow", textAlign: "center" }}
        {...panResponder.panHandlers}
      >
        handle
      </Text>
    </View>
  );
}
