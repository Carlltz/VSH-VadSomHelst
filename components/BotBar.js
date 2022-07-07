import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const HomeScreen = ({ setParentPage }) => {
  const [page, setPage] = useState("main");
  const [apple, setApple] = useState("food-apple");
  const [likedIcon, setLikedIcon] = useState("favorite-outline");
  const [userIcon, setUserIcon] = useState("user");

  const hwAnim = useRef(new Animated.Value(45)).current;
  const leftAnim = useRef(new Animated.Value(-45 / 2)).current;
  const bottomAnim = useRef(new Animated.Value(8)).current;
  const appleAnim = useRef(new Animated.Value(34)).current;

  const deSelectAll = () => {
    setApple("food-apple-outline");
    setLikedIcon("favorite-outline");
    setUserIcon("user");

    Animated.timing(hwAnim, {
      toValue: 45,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
    Animated.timing(leftAnim, {
      toValue: -45 / 2,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
    Animated.timing(bottomAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
    Animated.timing(appleAnim, {
      toValue: 30,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
  };

  useEffect(() => {
    deSelectAll();
    switch (page) {
      case "profile":
        setUserIcon("user-alt");
        break;
      case "main":
        setApple("food-apple");
        Animated.timing(hwAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.elastic(1),
        }).start();
        Animated.timing(leftAnim, {
          toValue: -50 / 2,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.elastic(1),
        }).start();
        Animated.timing(bottomAnim, {
          toValue: 8,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.elastic(1),
        }).start();
        Animated.timing(appleAnim, {
          toValue: 34,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.elastic(1),
        }).start();
        break;
      case "liked":
        setLikedIcon("favorite");
        break;
    }
    setParentPage(page);
  }, [page]);

  const Blob = () => {
    return (
      <View style={{ position: "absolute", left: Dimensions.get("window").width / 2, bottom: 0 }}>
        <Animated.View
          style={[
            styles.blobStyle,
            {
              height: hwAnim,
              width: hwAnim,
              left: leftAnim,
              bottom: bottomAnim,
            },
          ]}>
          <TouchableOpacity onPress={() => setPage("main")}>
            <AnimatedIcon name={apple} style={{ fontSize: appleAnim }} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.flexIcons}>
        <TouchableOpacity style={styles.blobPlace} onPress={() => setPage("profile")}>
          <FontAwesome5 name={userIcon} size={optionsSize - 4} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.blobPlace} onPress={() => setPage("liked")}>
          <MaterialIcons name={likedIcon} size={optionsSize + 4} color={navy} />
        </TouchableOpacity>
        <View style={styles.blobPlace} />
        <TouchableOpacity style={styles.blobPlace} onPress={() => setPage("favorites")}>
          <Fontisto name="favorite" size={optionsSize - 5} color={navy} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.blobPlace} onPress={() => setPage("settings")}>
          <MaterialIcons name="settings" size={optionsSize} color={navy} />
        </TouchableOpacity>
      </View>
      <Blob />
    </View>
  );
};

export default HomeScreen;

let optionsSize = 34;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    alignItems: "center",
    backgroundColor: mint,
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
  },

  flexIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "95%",
    height: 45,
  },
  blobPlace: {
    width: 50,
    alignItems: "center",
  },
  blobStyle: {
    borderRadius: 30,
    backgroundColor: navy,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
