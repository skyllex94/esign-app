import { Dimensions } from "react-native";

export const signatureCanvasHeight = 344;
export const signatureRatio = (
  Dimensions.get("window").width / signatureCanvasHeight
).toFixed(2);
