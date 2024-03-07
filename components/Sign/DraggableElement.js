import { scale } from "pdf-lib";
import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  PanResponder,
  Image,
  TouchableOpacity,
} from "react-native";

export default function DraggableElement({
  selectedSignaturePath,
  setWidthElement,
  setHeightElement,
}) {
  const [originViewHeight, setOriginViewHeight] = useState(200);
  console.log("originViewHeight:", originViewHeight);
  const [viewHeight, setViewHeight] = useState(100);
  const [isPanning, setIsPanning] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (event) => {
        // console.log("event:", event.nativeEvent);
        setWidthElement(event.nativeEvent.pageX + 60);
        setHeightElement(event.nativeEvent.pageY - 130);

        pan.extractOffset();
      },
    })
  ).current;

  const panResize = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        console.log("gesture:", gesture);
        setViewHeight(originViewHeight + gesture.dy);
      },
      onPanResponderRelease: () => {
        setOriginViewHeight(viewHeight);
      },
    }).current
  );

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}
      >
        <View className="flex-row justify-end items-end border-2">
          <Image
            style={{ height: viewHeight, width: viewHeight }}
            source={{ uri: selectedSignaturePath }}
          />
          <TouchableOpacity
            className="w-5 h-5 bg-red-400"
            onPress={() => setViewHeight((curr) => curr - 10)}
          />
          <TouchableOpacity
            className="w-5 h-5 bg-blue-400"
            onPress={() => setViewHeight((curr) => curr + 10)}
          />
        </View>
      </Animated.View>
    </View>
  );
}
