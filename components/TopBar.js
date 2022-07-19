import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import { generateBoxShadowStyle } from "../styles/generateShadow";

const TopBar = ({ setParentPage, currentParentPage }) => {
  const [page, setPage] = useState("main");

  useEffect(() => {
    switch (page) {
      case "search":
        break;
    }

    setParentPage(page);
  }, [page]);

  useEffect(() => {
    setPage(currentParentPage);
  }, [currentParentPage]);

  return (
    <View style={[styles.topBar, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: navy }}>VadSomHelst</Text>
      <TouchableOpacity style={styles.searchGlass} onPress={() => setPage("search")}>
        <FontAwesome name="search" size={30} color={navy} />
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  topBar: {
    height: 40,
    width: "100%",
    backgroundColor: mint,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  searchGlass: {
    position: "absolute",
    right: 15,
  },
  settings: {
    position: "absolute",
    left: 15,
  },
});
