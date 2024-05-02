import {
  View,
  PanResponder,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export default function ImageSelection({
  imagePath,
  setImageX,
  setImageY,
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  setShowImageSelection,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const elementLocation = useRef();

  let widthGlobal = null;
  let heightGlobal = null;

  const widthRef = useRef(null);
  const heightRef = useRef(null);

  useMemo(() => {
    // Doesn't wait until re-render is completed
    // Figure out the width and height of image
    Image.getSize(imagePath, (width, height) => {
      console.log("height:", height);
      console.log("width:", width);

      heightGlobal = height;
      widthGlobal = width;

      heightRef.current = height;
      widthRef.current = width;

      setImageWidth(80);
      setImageHeight(80 * (height / width).toFixed(2));
    });
  }, []);

  const panResponderResize = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          setImageHeight(
            (imageWidth + gesture.dy) * (heightRef.current / widthRef.current)
          );
          setImageWidth(imageWidth + gesture.dy);
        },
        onPanResponderEnd: (event, gesture) => {
          setImageHeight(
            (imageWidth + gesture.dy) * (heightRef.current / widthRef.current)
          );
          setImageWidth(imageWidth + gesture.dy);
        },
      }),
    [setImageHeight]
  );

  const panResponderMovement = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {
        // Measure the relative x & y of the signature to the pdf canvas
        elementLocation.current.measure((h, w) => {
          setImageX(h);
          setImageY(w);
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
            className="absolute left-[-15] top-[-15] h-[25px] w-[25px] z-10 bg-white rounded-full"
            onPress={() => setShowImageSelection(false)}
          >
            <AntDesign name="closecircle" size={25} color="red" />
          </TouchableOpacity>

          <Image
            source={{ uri: imagePath }}
            style={{
              height: imageHeight,
              width: imageWidth,
            }}
            {...panResponderMovement.panHandlers}
          />

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
