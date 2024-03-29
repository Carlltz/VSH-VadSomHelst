import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
  AppState,
  ActivityIndicator,
  ImageBackground,
  Animated,
  Linking,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import { generateBoxShadowStyle } from "../styles/generateShadow";
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const Card = ({ item }) => {
  const [bookmarkIcon, setBookmarkIcon] = useState(
    item.saved ? "bookmark" : "bookmark-o"
  );

  function getStar(val) {
    switch (val) {
      case 0:
        return "star-o";
      case 2:
        return "star";
      case 1:
        return "star-half-empty";
    }
  }

  async function updateSaved() {
    if (bookmarkIcon === "bookmark") {
      setBookmarkIcon("bookmark-o");
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "VSH-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
        },
        body: JSON.stringify({
          saved: item._id,
        }),
      };
      try {
        const result = await fetch(
          "http://81.229.44.166:3000/api/users/me",
          requestOptions
        );
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setBookmarkIcon("bookmark");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "VSH-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
        },
        body: JSON.stringify({
          saved: item._id,
        }),
      };
      try {
        const result = await fetch(
          "http://81.229.44.166:3000/api/users/me",
          requestOptions
        );
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  /* let imgWidth = 300;
  let imgHeight = 300;
  Image.getSize(item.image, (width, height) => {
    // calculate image width and height
    const screenWidth = Dimensions.get("window").width - 6 * 2 - 15 * 2;
    const scaleFactor = width / screenWidth;
    const imageHeight = height / scaleFactor;
    return { width: imageWidth, height: imageHeight };
  }); */
  return (
    <View
      style={[
        styles.card,
        generateBoxShadowStyle("#000", 0, 2, 0.23, 2.62, 4),
      ]}>
      <ImageBackground
        style={[styles.cardImage]}
        imageStyle={[{ borderRadius: 15 }]}
        source={{ uri: item.image }}>
        <TouchableOpacity onPress={() => updateSaved()}>
          <View style={[styles.favoriteBtn]}>
            <FontAwesome
              name={bookmarkIcon}
              size={34}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <Text style={{ fontSize: 28, textAlign: "center" }}>
        {item.name}
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 2 }}>
        <FontAwesome
          name={getStar(item.stars[0])}
          size={24}
          color="black"
        />
        <FontAwesome
          name={getStar(item.stars[1])}
          size={24}
          color="black"
        />
        <FontAwesome
          name={getStar(item.stars[2])}
          size={24}
          color="black"
        />
        <FontAwesome
          name={getStar(item.stars[3])}
          size={24}
          color="black"
        />
        <FontAwesome
          name={getStar(item.stars[4])}
          size={24}
          color="black"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: 4,
          justifyContent: "space-evenly",
        }}>
        <View style={{ alignItems: "center" }}>
          <MaterialCommunityIcons
            name="clock-time-five-outline"
            size={26}
            color="black"
          />
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            {item.time}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <MaterialCommunityIcons
            name="food-takeout-box-outline"
            size={26}
            color="black"
          />
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            {item.ingredientAmount}{" "}
            {item.ingredientAmount == 1
              ? "Ingrediens"
              : "Ingredienser"}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "400",
          textAlign: "center",
        }}>
        {item.description}
      </Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    flex: 1, //Dimensions.get("window").height - 85 - 2 * 6
    backgroundColor: mint,
    borderRadius: 30,
    alignItems: "center",
    padding: 15,
  },
  cardImage: {
    alignSelf: "stretch",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  favoriteBtn: {
    backgroundColor: "rgba(117, 201, 183, 0.7)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 15,
    margin: 10,
  },
});
