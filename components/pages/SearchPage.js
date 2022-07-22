import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";

const SearchPage = () => {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={{ backgroundColor: lemon, height: 200, width: "100%" }}></View>
      <View style={{ backgroundColor: teal, height: 500, width: "100%" }}></View>
    </View>
  );
};

export default SearchPage;

const styles = StyleSheet.create({});
