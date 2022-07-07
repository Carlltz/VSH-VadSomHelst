import { Platform } from "react-native";

const generateBoxShadowStyle = (shadowColor, xOffset, yOffset, shadowOpacity, shadowRadius, elevation) => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: shadowColor,
      shadowOffset: { width: xOffset, height: yOffset },
      shadowOpacity: shadowOpacity,
      shadowRadius: shadowRadius,
    };
  } else if (Platform.OS === "android") {
    return {
      elevation: elevation,
      shadowColor: shadowColor,
    };
  }
};

export { generateBoxShadowStyle };
