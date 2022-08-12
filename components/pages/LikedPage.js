import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  lime,
  lemon,
  teal,
  mint,
  navy,
} from "../../styles/colors";
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import {
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { getUserdata } from "../../functions/fetchUsers";
import { getRecipes } from "../../functions/fetchRecipes";

const LikedPage = () => {
  const [recipesLoaded, setRecipesLoaded] = useState(false);
  //const [liked, setLiked] = useState([]);
  //const [recipesSnaps, setRecipesSnaps] = useState(null);
  const [likedData, setLikedData] = useState([]);
  const [currentGroupName, setCurrentGroupName] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const isFocused = useIsFocused();

  const navigation = useNavigation();

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

  let recipes = [];

  useEffect(() => {
    if (!isFocused) setRecipesLoaded(false);
    else {
      // 👇️ set isMounted to true
      let isMounted = true;

      async function getDATA() {
        const recipes = await getRecipes();

        const userData = await getUserdata("groups&liked");

        let likedRecipes;

        if (userData.groups[0] != "Privat") {
          const groupData = await getGroupsByIds(
            "name&membersData",
            { groupIds: userData.groups[0] }
          );
          setCurrentGroupName(groupData.name);
          setCurrentGroupId(groupSnap._id);

          likedRecipes = groupData[userData._id].liked;
        } else {
          setCurrentGroupName(userData.groups[0]);
          setCurrentGroupId(userData._id);

          likedRecipes = userData.liked;
        }

        let like = [];
        recipes.forEach((rec) => {
          if (likedRecipes.includes(rec._id)) {
            like.push(rec);
          }
        });
        setLikedData(like);

        setRecipesLoaded(true);
      }

      if (!recipesLoaded) {
        getDATA();
      }

      return () => {
        // 👇️ when component unmounts, set isMounted to false
        isMounted = false;
      };
    }
  }, [isFocused]);

  const renderCard = ({ item }) => {
    /*     let x = 0,
      y = 0,
      height = 90,
      width = 90;
    const onLayout = (event) => {
      ({ x, y, height, width } = event.nativeEvent.layout);
    }; */

    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(item.url)}
        style={[
          styles.card,
          generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
        ]}>
        <Image
          style={[styles.cardImage]}
          source={{ uri: item.image }}
        />
        {/* Could use the same method as in profile page for the profile pic render */}
        <View
          style={{
            alignSelf: "stretch",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 5,
          }}>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            {item.name}
          </Text>
          <View
            style={{ flexDirection: "row", marginBottom: 2 }}>
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
              justifyContent: "space-evenly",
            }}>
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons
                name="clock-time-five-outline"
                size={20}
                color={navy}
              />
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {item.time}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons
                name="food-takeout-box-outline"
                size={20}
                color={navy}
              />
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {item.ingredientAmount}{" "}
                {item.ingredientAmount == 1
                  ? "Ingrediens"
                  : "Ingredienser"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListOrText = () => {
    if (likedData.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 0,
              paddingTop: 0,
            }}
            style={styles.flatList}
            data={likedData}
            renderItem={renderCard}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    } else if (recipesLoaded) {
      return (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
            }}>
            Gruppen {currentGroupName} har inga gillade recept!
          </Text>
        </View>
      );
    }
  };

  if (recipesLoaded) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
          }}>
          <TouchableOpacity
            style={[
              styles.groupContainer,
              generateBoxShadowStyle(
                "#000",
                0,
                2,
                0.23,
                2.62,
                4
              ),
            ]}
            onPress={() => navigation.push("ChangeGroup")}>
            <MaterialCommunityIcons
              name="account-group"
              size={30}
              color="black"
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 17,
                fontWeight: "500",
                textAlign: "center",
                marginHorizontal: 4,
                flexShrink: 1,
              }}>
              {currentGroupName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.groupContainer,
              generateBoxShadowStyle(
                "#000",
                0,
                2,
                0.23,
                2.62,
                4
              ),
            ]}
            onPress={() => {}}>
            <Ionicons name="filter" size={28} color="black" />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 17,
                fontWeight: "500",
                textAlign: "center",
                marginHorizontal: 4,
                flexShrink: 1,
              }}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
        <ListOrText />
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
};

export default LikedPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "95%",
    backgroundColor: mint,
    borderRadius: 30,
    alignItems: "center",
    padding: 12,
    alignSelf: "center",
    marginBottom: 8,
    flexDirection: "row",
  },
  cardImage: {
    height: 90,
    width: undefined,
    aspectRatio: 1,
    borderRadius: 20,
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
  groupContainer: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: mint,
    alignItems: "center",
    marginVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: Dimensions.get("window").width * 0.4,
  },
});
