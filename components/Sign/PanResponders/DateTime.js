import { View, Text, PanResponder, Animated } from "react-native";
import React, { useMemo, useRef } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function DateTime({
  date,
  setShowDatePanResponder,
  setDate_x,
  setDate_y,
  dateSize,
  setDateSize,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = React.useRef();

  const panResponderResize = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          // If value is below -10 (5px text), ignore it since it will flip the date
          if (gesture.dy > -10) setDateSize(dateSize + gesture.dy);
        },
        onPanResponderEnd: (_, gesture) => {
          if (gesture.dy > -10) setDateSize(dateSize + gesture.dy);
        },
      }),
    [setDateSize]
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

          setDate_x(h);
          setDate_y(w);
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
            className="absolute left-[-15] top-[-15] h-[30px] w-[30px]"
            onPress={() => setShowDatePanResponder(false)}
            {...panResponderResize.panHandlers}
          >
            <AntDesign name="closecircle" size={24} color="red" />
          </TouchableOpacity>

          <Text
            style={{ fontSize: dateSize }}
            {...panResponderMovement.panHandlers}
          >
            {date}
          </Text>

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
