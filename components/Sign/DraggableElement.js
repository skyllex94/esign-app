import { useState } from "react";
import { View, Dimensions, Animated, Button, StyleSheet } from "react-native";
// import Constants from "expo-constants";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

let data = [
  { key: 1, id: 1 },
  { key: 2, id: 2 },
  { key: 3, id: 3 },
  { key: 4, id: 4 },
];

export default function DraggableElement({
  item,
  selectedSignaturePath,
  setHeightElement,
  setWidthElement,
}) {
  let translateX = new Animated.Value(0);
  let translateY = new Animated.Value(0);
  let height = new Animated.Value(40);
  let width = new Animated.Value(100);
  let onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: false }
  );
  let onGestureTopEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: width,
          translationY: height,
        },
      },
    ],
    { useNativeDriver: false }
  );
  let _lastOffset = { x: 0, y: 0 };
  let onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastOffset.x += event.nativeEvent.translationX;
      _lastOffset.y += event.nativeEvent.translationY;
      translateX.setOffset(_lastOffset.x);
      translateX.setValue(0);
      translateY.setOffset(_lastOffset.y);
      translateY.setValue(0);
    }
  };

  const onRelease = (event) => {
    console.log("Event", event.nativeEvent);
    setWidthElement(event.nativeEvent.x);
    setHeightElement(event.nativeEvent.y);
  };

  return (
    <View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        onEnded={onRelease}
      >
        <View>
          <Animated.Image
            // className={`border-2 min-h-[${signHeight}] max-w-[${signWidth}]`}
            style={[
              {
                transform: [{ translateX }, { translateY }],
              },
              { minHeight: 80, maxWidth: 100 },
            ]}
            source={{ uri: selectedSignaturePath }}
          />
        </View>
      </PanGestureHandler>

      {/*
        <PanGestureHandler onGestureEvent={onGestureTopEvent}>
            <Animated.View className="h-5 w-5 border-2 bg-blue"></Animated.View>
            
                <Animated.View
                style={{
                    height,
                    backgroundColor: "blue",
                    transform: [{ translateX }, { translateY }],
                }}
                />
            
        </PanGestureHandler>
        */}
    </View>
  );
}
