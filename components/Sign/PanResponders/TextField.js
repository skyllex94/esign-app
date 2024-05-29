import { View, Text, PanResponder, Animated } from "react-native";
import React, { useMemo, useRef } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function TextField({
  textInstance,
  index,
  textList,
  setTextList,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = React.useRef();

  // console.log("textInstance", textInstance);

  function resizeText(size) {
    setTextList((prevTextList) => {
      const updatedTextList = [...prevTextList];
      updatedTextList[index] = {
        ...updatedTextList[index],
        size: updatedTextList[index].size + size,
      };
      return updatedTextList;
    });
  }

  function updatePosition(x, y) {
    setTextList((prevList) => {
      const updatedTextList = [...prevList];
      updatedTextList[index] = {
        ...updatedTextList[index],
        x: x,
        y: y,
      };
      return updatedTextList;
    });
  }

  function removeText() {
    setTextList((prevList) => {
      const updatedTextList = [...prevList];
      updatedTextList[index] = { ...updatedTextList[index], visible: false };
      return updatedTextList;
    });
  }

  const panResponderResize = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          resizeText(gesture.dy);
        },
        onPanResponderEnd: (_, gesture) => {
          resizeText(gesture.dy);
        },
      }),
    [textList]
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

          updatePosition(h, w);
        });

        pan.extractOffset();
      },
    })
  ).current;

  return (
    <View className="items-center justify-center relative">
      {textList[index].visible && (
        <Animated.View
          ref={elementLocation}
          style={{
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          }}
          className="items-start absolute mx-auto top-10"
        >
          <View className="flex-row border-dashed border items-end">
            <TouchableOpacity
              className="absolute left-[-20] top-[-20] h-[30px] w-[30px]"
              onPress={removeText}
              {...panResponderResize.panHandlers}
            >
              <AntDesign name="closecircle" size={24} color="red" />
            </TouchableOpacity>

            <Text
              style={{ fontSize: textInstance.size }}
              {...panResponderMovement.panHandlers}
            >
              {textInstance.text}
            </Text>

            <View
              className="absolute items-center justify-center
          right-[-20] bottom-[-20] h-[25px] w-[25px] bg-purple-500 rounded-full"
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
      )}
    </View>
  );
}
