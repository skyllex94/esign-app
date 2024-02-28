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

export default function DraggableElement({ item, selectedSignaturePath }) {
  const [signHeight, setSignHeight] = useState("60%");
  const [signWidth, setSignWidth] = useState("30%");

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

  function changeSignatureScale() {
    setSignHeight(() => "60%");
    setSignWidth(() => "40px");
  }

  return (
    <View>
      <Button title="Resize" onPress={changeSignatureScale} />

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <View>
          <Animated.Image
            className={`items-center justify-center h-[${signHeight}] w-[${signWidth}] border-2`}
            style={[{ transform: [{ translateX }, { translateY }] }]}
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

const styles = StyleSheet.create({
  item: {},
});
