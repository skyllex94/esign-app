import { Dimensions } from "react-native";

export const DrawingCanvasHeight = 344;
export const signatureRatio = (
  Dimensions.get("window").width / DrawingCanvasHeight
).toFixed(2);
