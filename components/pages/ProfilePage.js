import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import Person from "../Person";

const ProfilePage = () => {
  const [loaded, setLoaded] = useState(false);
  const [amountSwiped, setAmountSwiped] = useState(null);
  const [amountLiked, setAmountLiked] = useState(null);
  const [amountDisliked, setAmountDisliked] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);
  const [friends, setFriends] = useState([]);

  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;

    async function getDATA() {
      const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userSnap.data();

      setAmountSwiped(userData.liked.length + userData.disliked.length);
      setAmountLiked(userData.liked.length);
      setAmountDisliked(userData.disliked.length);

      setFriends(userData.friends);

      setLoaded(true);
    }

    if (!loaded) {
      getDATA();
    }

    return () => {
      // 👇️ when component unmounts, set isMounted to false
      isMounted = false;
    };
  }, []);

  const search = async (key) => {
    setSearched(true);

    const usernames = await getDoc(doc(db, "usernamesTaken", "taken"));
    const matches = usernames.data().usernamesTaken.filter((username) => username.includes(key));
    /* if (matches.includes(auth.currentUser.displayName))
      matches.splice(matches.indexOf(auth.currentUser.displayName), 1); */
    setSearchResult(matches);
    setSearchFinished(true);
  };

  const FriendsOrSearch = () => {
    const local = StyleSheet.create({
      friends: {
        alignSelf: "stretch",
        flex: 1,
      },
    });

    /* const person = ({ item }) => {
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

      let friendsIcon = friends.includes(item) ? "check-circle" : "add-circle-outline";

      return (
        <View style={[local.container, generateBoxShadowStyle("#000", 0, 2, 0.23, 2.62, 4)]}>
          <View
            style={{
              aspectRatio: 1,
              alignSelf: "stretch",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            }}>
            <Image style={local.image} source={require("../../assets/profilePic.jpg")} />
          </View>

          <Text style={{ fontWeight: "400", fontSize: 20, paddingHorizontal: 4, paddingVertical: 15 }}>{item}</Text>
          <View style={{ marginLeft: "auto" }}>
            <TouchableOpacity style={local.addBtn}>
              <MaterialIcons name={friendsIcon} size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }; */
    if (!searched) {
      return (
        <View style={local.friends}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 15, paddingTop: 2, paddingHorizontal: 13 }}
            style={{ width: "100%", flex: 1 }}
            data={friends}
            renderItem={(item) => (
              <Person
                name={item.item}
                friend={true}
                addFriend={(val) =>
                  setFriends((prev) => {
                    prev.push(val);
                    return prev;
                  })
                }
                removeFriend={(val) =>
                  setFriends((prev) => {
                    prev.splice(prev.indexOf(val), 1);
                    return prev;
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ); //This should be a list with Vänner
    } else {
      if (searchFinished) {
        return (
          <View style={{ alignSelf: "stretch", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 15, paddingTop: 2, paddingHorizontal: 13 }}
              style={{ width: "100%", flex: 1 }}
              data={searchResult}
              renderItem={(item) => (
                <Person
                  name={item.item}
                  friend={friends.includes(item.item) ? true : false}
                  addFriend={(val) =>
                    setFriends((prev) => {
                      prev.push(val);
                      return prev;
                    })
                  }
                  removeFriend={(val) =>
                    setFriends((prev) => {
                      prev.splice(prev.indexOf(val), 1);
                      return prev;
                    })
                  }
                />
              )}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );
      } else {
        return (
          <View style={{ alignSelf: "stretch", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        );
      }
    }
  };

  useEffect(() => {
    if (searchText.length === 0) {
      setSearched(false);
      setSearchResult([]);
    }
  }, [searchText]);

  const getRatio = () => {
    if (isNaN(amountLiked / amountDisliked)) return (0.0).toFixed(2);
    if (!Number.isFinite(amountLiked / amountDisliked)) return "Oändlig";
    return (amountLiked / amountDisliked).toFixed(2);
  };

  if (loaded) {
    return (
      <View style={styles.container}>
        <View style={styles.profileView}>
          <Image style={styles.image} source={require("../../assets/profilePic.jpg")} />
          <View>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>{auth.currentUser.displayName}</Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>Swipes: {amountSwiped}</Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>Gillade: {amountLiked}</Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>Ogillade: {amountDisliked}</Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>Gillade/Ogillade: {getRatio()}</Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>Vänner: {friends.length}</Text>
          </View>
        </View>
        <View style={[styles.friendsView, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
          <View style={[styles.searchContainer, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>Sök efter användare:</Text>
            <View style={{ flexDirection: "row", marginTop: 2 }}>
              <View style={styles.inputIconCombo}>
                <TextInput
                  placeholder="Användarnamn:"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                />
                {searchText.length > 0 ? (
                  <TouchableOpacity style={styles.crossStyle} onPress={() => setSearchText("")}>
                    <Entypo name="cross" size={34} color="black" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.searchGlass}
                onPress={() => {
                  searchText.length > 0 ? search(searchText) : null;
                }}>
                <FontAwesome name="search" size={30} color={navy} />
              </TouchableOpacity>
            </View>
          </View>
          <FriendsOrSearch />
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  profileView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
    flexDirection: "row",
  },
  image: {
    height: Dimensions.get("window").width * 0.3,
    width: Dimensions.get("window").width * 0.3,
  },
  friendsView: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: mint,
    margin: 10,
    borderRadius: 20,
  },
  searchContainer: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyConten: "center",
    backgroundColor: teal,
    borderRadius: 20,
    paddingTop: 3,
    paddingBottom: 11,
    paddingLeft: 11,
  },
  searchInput: {
    flex: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  inputIconCombo: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  crossStyle: {
    aspectRatio: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  searchGlass: {
    paddingRight: 15,
    paddingLeft: 12,
    alignSelf: "stretch",
    justifyContent: "center",
  },
});
