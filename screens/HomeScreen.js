import { StyleSheet, Text, View, Button, StatusBar, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import BotBar from "../components/BotBar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import ProfilePage from "../components/pages/ProfilePage";
import LikedPage from "../components/pages/LikedPage";
import SwipePage from "../components/pages/SwipePage";
import BookmarkedPage from "../components/pages/BookmarkedPage";
import SettingsPage from "../components/pages/SettingsPage";
import SearchPage from "../components/pages/SearchPage";
import DislikedPage from "../components/pages/DislikedPage";
import TopBar from "../components/TopBar";

const HomeScreen = ({ navigation }) => {
  const [page, setPage] = useState("main");
  const [test, setTest] = useState("main");

  const RenderPage = () => {
    switch (page) {
      case "main":
        return <SwipePage />;
      case "profile":
        return <ProfilePage />;
      case "liked":
        return <LikedPage />;
      case "bookmarked":
        return <BookmarkedPage />;
      case "search":
        return <SearchPage />;
      case "disliked":
        return <DislikedPage />;
      default:
        return <SettingsPage />;
    }
  };

  const f = () => {
    let reg = /(?:recipeInformation": )(.*?})/gms;

    fetch("https://www.ica.se/recept/kyckling-med-purjolokssas-714632/")
      .then(function (response) {
        switch (response.status) {
          // status "OK"
          case 200:
            response.text().then(function (text) {
              let res = JSON.stringify(text);
              res = res.match(reg);
              setTest(res[1]);
            });
          // status "Not Found"
          case 404:
            throw response;
        }
      })
      .then(function (template) {
        console.log(template);
      })
      .catch(function (response) {
        // "Not Found"
        console.log(response.statusText);
      });
  };

  return (
    <View style={styles.container}>
      <TopBar setParentPage={setPage} currentParentPage={page} />

      <View style={styles.mainView}>
        <RenderPage />
      </View>

      <BotBar setParentPage={setPage} currentParentPage={page} />
    </View>
  );
};

//VadSomHelst

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: mint,
  },

  botBar: {
    height: 45,
    width: "100%",
    backgroundColor: mint,
    marginTop: "auto",
  },
  mainView: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: lime,
  },
  logOut: {
    position: "absolute",
    left: 25,
  },
});
