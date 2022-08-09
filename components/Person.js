import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import { generateBoxShadowStyle } from "../styles/generateShadow";
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const Person = ({
  name,
  friend,
  addFriend,
  removeFriend,
  addToGroup,
}) => {
  const [friendsIcon, setFriendsIcon] = useState(
    friend ? "check-circle" : "add-circle-outline"
  );
  const [friends, setFriends] = useState(friend);

  const handleAddFriend = async () => {
    setFriendsIcon("check-circle");
    setFriends(true);
    addFriend(name);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "VSH-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
      },
      body: JSON.stringify({
        friends: name,
      }),
    };
    try {
      const result = await fetch(
        "http://192.168.68.138:3000/api/users/me",
        requestOptions
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemoveFriend = async () => {
    setFriendsIcon("add-circle-outline");
    setFriends(false);
    removeFriend(name);

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "VSH-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
      },
      body: JSON.stringify({
        friends: name,
      }),
    };
    try {
      const result = await fetch(
        "http://192.168.68.138:3000/api/users/me",
        requestOptions
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View
      style={[
        local.container,
        generateBoxShadowStyle("#000", 0, 2, 0.23, 2.62, 4),
      ]}>
      <View
        style={{
          aspectRatio: 1,
          alignSelf: "stretch",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}>
        <Image
          style={local.image}
          source={require("../assets/profilePic.jpg")}
        />
      </View>

      <Text
        style={{
          fontWeight: "400",
          fontSize: 20,
          paddingHorizontal: 4,
          paddingVertical: 15,
        }}>
        {name}
      </Text>
      <View style={{ marginLeft: "auto" }}>
        <TouchableOpacity
          style={local.addBtn}
          onPress={() => {
            addToGroup(name);
          }}>
          <MaterialIcons
            name={"group-add"}
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: 0 }}>
        <TouchableOpacity
          style={local.addBtn}
          onPress={() =>
            friends ? handleRemoveFriend() : handleAddFriend()
          }>
          <MaterialIcons
            name={friendsIcon}
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Person;

const local = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    backgroundColor: lime,
    marginTop: 8,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  addBtn: {
    aspectRatio: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
