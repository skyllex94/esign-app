import { View, Animated, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { Text } from "react-native";

export default function NextButton({
  percentage,
  slideForward,
  currSlide,
  currentOffering,
}) {
  const size = 128;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef();
  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener((value) => {
      const strokeDashoffset =
        circumference - (circumference * value.value) / 100;

      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  return (
    <View className="items-center justify-center">
      <Text
        className={`font-light bottom-12 absolute py-2 ${
          currSlide === 5 ? "text-black" : "hidden"
        }`}
      >
        Try 3 days free, then {currentOffering?.weekly?.product.priceString}
        /week
      </Text>

      <TouchableOpacity
        onPress={slideForward}
        activeOpacity={0.6}
        className="bg-[#695391] rounded-full w-64 p-4"
      >
        <Text className="text-white text-center font-light text-[16px]">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}
