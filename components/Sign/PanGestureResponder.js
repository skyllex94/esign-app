import { View, Dimensions, Animated } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

let data = [
  { key: 1, id: 1 },
  { key: 2, id: 2 },
  { key: 3, id: 3 },
  { key: 4, id: 4 },
];

export default function PanGestureResponder({
  item,
  selectedSignaturePath,
  setHeightElement,
  setWidthElement,
}) {
  let translateX = new Animated.Value(Dimensions.get("screen").width / 3);
  let translateY = new Animated.Value(Dimensions.get("screen").height / 4);
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

  let _lastOffset = { x: 0, y: 0 };

  const onHandlerStateChange = (event) => {
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

  console.log("_lastOffset", _lastOffset);
  console.log("translateX", translateX);

  let onGestureTopEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: width,
          translationY: height,
        },
      },
    ],
    { useNativeDriver: true }
  );

  return (
    <View>
      <GestureHandlerRootView
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          onEnded={onRelease}
        >
          <Animated.Image
            style={[
              {
                transform: [{ translateX }, { translateY }],
              },
              { minHeight: 80, maxWidth: 100 },
            ]}
            source={{ uri: selectedSignaturePath }}
          />
        </PanGestureHandler>
      </GestureHandlerRootView>

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
