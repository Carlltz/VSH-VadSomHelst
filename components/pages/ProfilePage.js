import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { auth } from "../../firebase";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileView}>
        <Image style={styles.image} source={require("../../assets/profilePic.jpg")} />
        <Text style={{ fontWeight: "500", fontSize: 24 }}>{auth.currentUser.displayName}</Text>
        <Text style={{ fontWeight: "400", fontSize: 16 }}>Swipes: 100</Text>
      </View>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  profileView: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: Dimensions.get("window").width * 0.3,
    width: Dimensions.get("window").width * 0.3,
  },
});
