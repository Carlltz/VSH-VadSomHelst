import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import { generateBoxShadowStyle } from "../styles/generateShadow";

const Card = ({ name }) => (
  <View style={[styles.card, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
    <Text>HEJ! {name}</Text>
  </View>
);

export default Card;

const styles = StyleSheet.create({
  card: {
    width: 0.95 * Dimensions.get("window").width,
    height: 0.95 * Dimensions.get("window").width,
    backgroundColor: mint,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 6,
  },
});
