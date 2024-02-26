import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
// import Constants from "expo-constants";
import { PanGestureHandler, State } from "react-native-gesture-handler";

// You can import from local files
import AssetExample from "../../components/Sign/AssetExample";

// or any pure javascript modules available in npm
import { Card } from "react-native-paper";

let dropzoneHeight = 200;
let itemHeight = 100;

let FlatItem = ({ item }) => {
  let translateX = new Animated.Value(0);
  let translateY = new Animated.Value(0);
  let height = new Animated.Value(20);
  let onGestureEvent = Animated.event([
    {
      nativeEvent: {
        translationX: translateX,
        translationY: translateY,
      },
    },
  ]);
  let onGestureTopEvent = Animated.event([
    {
      nativeEvent: {
        translationY: height,
      },
    },
  ]);
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
  return (
    <View>
      <PanGestureHandler onGestureEvent={onGestureTopEvent}>
        <Animated.View
          style={{
            height,
            backgroundColor: "blue",
            transform: [{ translateX }, { translateY }],
          }}
        />
      </PanGestureHandler>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[styles.item, { transform: [{ translateX }, { translateY }] }]}
        >
          <Text>{item.id}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

let data = [
  { key: 1, id: 1 },
  { key: 2, id: 2 },
  { key: 3, id: 3 },
  { key: 4, id: 4 },
];
export default class DragSignature extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatItem item={data[0]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    width: itemHeight,
    height: itemHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
});
