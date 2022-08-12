import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../styles/generateShadow";
import { leaveGroupFetch } from "../functions/fetchGroups";

const AnimatedAntDesign =
  Animated.createAnimatedComponent(AntDesign);
const AnimatedFlatList =
  Animated.createAnimatedComponent(FlatList);

const RenderYourGroups = ({ item, removeGroup }) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const rotateCaret = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateCaret, {
      toValue: moreInfo ? 180 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
  }, [moreInfo]);

  async function leaveGroup() {
    await leaveGroupFetch(item._id);
    removeGroup(item);
  }

  const renderMembers = ({ item }) => {
    const isMember = item.isMember
      ? "account-check"
      : "arrow-left-bold-box";
    return (
      <View
        style={{
          width: "100%",
          paddingVertical: 5,
          backgroundColor: lime,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6,
          flexDirection: "row",
          paddingHorizontal: 10,
        }}>
        <Text numberOfLines={1} style={{ flexShrink: 1 }}>
          {item.memberName}
        </Text>
        <MaterialCommunityIcons
          name={isMember}
          size={21}
          color="black"
          style={{
            transform: [
              { rotate: item.isMember ? "0deg" : "180deg" },
            ],
          }}
        />
      </View>
    );
  };

  const ListOrNot = () => {
    if (moreInfo) {
      return (
        <AnimatedFlatList
          contentContainerStyle={{}}
          style={{
            paddingTop: 4,
            paddingHorizontal: 10,
            alignSelf: "stretch",
            height: "100%",
          }}
          data={Object.values(item.members)}
          renderItem={renderMembers}
        />
      );
    } else {
      return <View></View>;
    }
  };

  const ButtonsOrNot = () => {
    if (moreInfo) {
      if (item.name === "Privat") {
        return (
          <View style={{ padding: 10, height: "100%" }}></View>
        );
      }
      return (
        <View style={{ padding: 10, height: "100%" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#DB2432",
              paddingVertical: 8,
              alignItems: "center",
              borderRadius: 10,
              marginTop: "auto",
            }}
            onPress={() => leaveGroup()}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Lämna
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={[local.container]}
        onPress={() => setMoreInfo((val) => !val)}>
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}>
          <Text
            numberOfLines={1}
            style={[local.name, { marginRight: 6 }]}>
            {item.name}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            numberOfLines={1}
            style={[
              local.name,
              { marginLeft: 6, marginRight: 8 },
            ]}>
            {item.numMem} St
          </Text>
          <AnimatedAntDesign
            name="caretup"
            size={26}
            color="black"
            style={{
              transform: [
                {
                  rotate: rotateCaret.interpolate({
                    inputRange: [0, 180],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            }}
          />
        </View>
      </TouchableOpacity>
      <Animated.View
        style={{
          width: "93%",
          height: rotateCaret.interpolate({
            inputRange: [0, 180],
            outputRange: [0, 180],
          }),
          backgroundColor: mint,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
        }}>
        <Animated.View
          style={{
            height: rotateCaret.interpolate({
              inputRange: [0, 180],
              outputRange: [0, 165],
            }),
            width: "45%",
            backgroundColor: teal,
            borderRadius: 15,
          }}>
          <ListOrNot />
        </Animated.View>
        <Animated.View
          style={{
            height: rotateCaret.interpolate({
              inputRange: [0, 180],
              outputRange: [0, 165],
            }),
            width: "48%",
            backgroundColor: teal,
            borderRadius: 15,
          }}>
          <ButtonsOrNot />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default RenderYourGroups;

const local = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    backgroundColor: teal,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    alignSelf: "center",
    textAlignVertical: "center",
  },
});
