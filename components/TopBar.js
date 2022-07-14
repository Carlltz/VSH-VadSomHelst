import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { lime, lemon, teal, mint, navy } from "../styles/colors";

const TopBar = ({ setParentPage, currentParentPage }) => {
  const [page, setPage] = useState("main");
  const [settingsIcon, setSettingsIcon] = useState("settings-outline");

  useEffect(() => {
    setSettingsIcon("settings-outline");
    switch (page) {
      case "settings":
        setSettingsIcon("settings-sharp");
        break;
      case "search":
        break;
    }

    setParentPage(page);
  }, [page]);

  useEffect(() => {
    setPage(currentParentPage);
  }, [currentParentPage]);

  return (
    <View style={styles.topBar}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: navy }}>VadSomHelst</Text>
      <TouchableOpacity style={styles.searchGlass} onPress={() => setPage("search")}>
        <FontAwesome name="search" size={30} color={navy} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settings} onPress={() => setPage("settings")}>
        <Ionicons name={settingsIcon} size={30} color={navy} />
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
