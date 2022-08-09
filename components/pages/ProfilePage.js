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
import {
  lime,
  lemon,
  teal,
  mint,
  navy,
} from "../../styles/colors";
import {
  collection,
  doc,
  getDoc,
  query,
  getDocs,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import Person from "../Person";
import { useNavigation } from "@react-navigation/native";
import getUserData from "../../functions/getUserData";
import putUserData from "../../functions/putUserData";

const ProfilePage = () => {
  const navigation = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [amountSwiped, setAmountSwiped] = useState(null);
  const [amountLiked, setAmountLiked] = useState(null);
  const [amountDisliked, setAmountDisliked] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);
  const [friends, setFriends] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [uploadRecipes, setuploadRecipes] = useState(false);
  const [createGroupName, setCreateGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [reloadFlatList, setReloadFlatList] = useState(false);

  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    console.log(groupMembers);
    if (groupMembers.length === 0) setCreatingGroup(false);
    else setCreatingGroup(true);
  }, [reloadFlatList]);

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;

    async function getDATA() {
      const userData = await getUserData(
        "liked&disliked&friends"
      );

      setAmountSwiped(
        userData.liked.length + userData.disliked.length
      );
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

    const usernames = await getDoc(
      doc(db, "usernamesTaken", "taken")
    );
    const matches = usernames
      .data()
      .usernamesTaken.filter((username) =>
        username.includes(key)
      );
    if (matches.includes(auth.currentUser.displayName))
      matches.splice(
        matches.indexOf(auth.currentUser.displayName),
        1
      );
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

    if (!searched) {
      return (
        <View style={local.friends}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 15,
              paddingTop: 2,
              paddingHorizontal: 13,
            }}
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
                addToGroup={(val) => {
                  if (!groupMembers.includes(val)) {
                    setGroupMembers((prev) => {
                      prev.push(val);
                      return prev;
                    });
                    setReloadFlatList((val) => !val);
                  }
                }}
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
          <View
            style={{
              alignSelf: "stretch",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <FlatList
              contentContainerStyle={{
                paddingBottom: 15,
                paddingTop: 2,
                paddingHorizontal: 13,
              }}
              style={{ width: "100%", flex: 1 }}
              data={searchResult}
              renderItem={(item) => (
                <Person
                  name={item.item}
                  friend={
                    friends.includes(item.item) ? true : false
                  }
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
          <View
            style={{
              alignSelf: "stretch",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
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
    if (isNaN(amountLiked / amountDisliked))
      return (0.0).toFixed(2);
    if (!Number.isFinite(amountLiked / amountDisliked))
      return "Oändlig";
    return (amountLiked / amountDisliked).toFixed(2);
  };

  const local = StyleSheet.create({
    groupContainer: {
      marginTop: Dimensions.get("window").width * 0.02,
      width: "96%",
      backgroundColor: mint,
      height: 200,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
    },
    groupView: {
      alignSelf: "stretch",
      backgroundColor: teal,
      flex: 1,
      borderRadius: 12,
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      justifyContent: "space-evenly",
    },
    nameInput: {
      borderRadius: 15,
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor: "white",
      width: "100%",
      fontSize: 14,
    },
    previousRecipes: {
      flexDirection: "row",
      alignItems: "center",
    },
    confirmBtn: {
      backgroundColor: lime,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    container: {
      alignSelf: "stretch",
      backgroundColor: lime,
      marginTop: 6,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    flatList: {
      alignSelf: "stretch",
      height: "100%",
    },
  });

  const groupPerson = (item) => {
    item = item.item;
    return (
      <TouchableOpacity
        style={[
          local.container,
          generateBoxShadowStyle("#000", 0, 2, 0.23, 2.62, 4),
        ]}
        onPress={() => {
          setGroupMembers((prev) => {
            prev.splice(prev.indexOf(item), 1);
            return prev;
          });
          setReloadFlatList((val) => !val);
        }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, flexShrink: 1 }}>
          {item}
        </Text>
        <Entypo
          name="minus"
          size={26}
          color="black"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
    );
  };

  let memberIds = [];
  async function getMemeberIds(memberName) {
    const q = query(
      collection(db, "usernames"),
      where("usrname", "in", [memberName])
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((val) => {
      memberIds.push(val.id);
    });
    if (memberIds.length === groupMembers.length) {
      let finishedMembers = [];

      // This adds all members to the group
      /* memberIds.forEach((member) => {
        finishedMembers.push({ [member]: { disliked: [], liked: [] } });
      });
      let finishedObject = {};
      finishedMembers.forEach((member) => {
        finishedObject = { ...finishedObject, ...member };
      }); */
      let i;
      memberIds.unshift(auth.currentUser.uid);
      memberIds.forEach((memberId) => {
        i = 0;
        memberNames(memberId);
      });

      let usernames = {};

      async function memberNames(memberId) {
        let memberName = await getDoc(
          doc(db, "usernames", memberId)
        );
        memberName = memberName.data().usrname;
        usernames = {
          ...usernames,
          ...{
            [memberId]: {
              memberId: memberId,
              memberName: memberName,
              isMember:
                memberId == auth.currentUser.uid ? true : false,
            },
          },
        };
        i++;
        if (memberIds.length === i) {
          const finishedObject = {
            ...{
              [auth.currentUser.uid]: {
                disliked: [],
                liked: [],
              },
            },
            name: createGroupName,
            usernames: usernames,
          };
          console.log(finishedObject);
          const created = await addDoc(
            collection(db, "groups"),
            finishedObject
          );
          await putUserData({ groups: arrayUnion(created.id) });
          setCreatingGroup(false);
          setGroupMembers([]);
          setCreateGroupName("");
        }
      }
    }
  }

  async function createGroup() {
    if (createGroupName === "")
      alert("Vänligen ange ett gruppnamn först");
    else {
      groupMembers.forEach((name) => {
        getMemeberIds(name);
      });
    }
  }

  if (loaded && creatingGroup) {
    return (
      <View style={styles.container}>
        <View style={local.groupContainer}>
          <View style={[local.groupView, { marginRight: 10 }]}>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                justifyContent: "flex-start",
                alignItems: "center",
              }}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: -6,
                  left: -4,
                }}
                onPress={() => {
                  setGroupMembers([]);
                  setCreateGroupName("");
                  setCreatingGroup(false);
                }}>
                <Entypo name="cross" size={34} color="black" />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                Ny Grupp:
              </Text>
            </View>
            <TextInput
              placeholder="Gruppnamn:"
              value={createGroupName}
              onChangeText={setCreateGroupName}
              style={local.nameInput}
            />
            <TouchableOpacity
              style={local.previousRecipes}
              onPress={() => setuploadRecipes((val) => !val)}>
              <MaterialIcons
                name={
                  uploadRecipes
                    ? "check-box"
                    : "check-box-outline-blank"
                }
                size={24}
                color="black"
              />
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  marginLeft: 5,
                  textAlign: "center",
                }}>
                Ladda upp recept
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                local.confirmBtn,
                generateBoxShadowStyle(
                  "#000",
                  0,
                  4,
                  0.3,
                  4.56,
                  8
                ),
              ]}
              onPress={() => createGroup()}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 15,
                }}>
                Skapa Grupp
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              local.groupView,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <FlatList
              contentContainerStyle={{
                paddingBottom: 6,
                paddingHorizontal: 8,
              }}
              style={local.flatList}
              data={groupMembers}
              extraData={reloadFlatList}
              renderItem={groupPerson}
              /* keyExtractor={(item) => item.id} */
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View
          style={[
            styles.friendsView,
            generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
          ]}>
          <View
            style={[
              styles.searchContainer,
              generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
            ]}>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>
              Sök efter användare:
            </Text>
            <View style={{ flexDirection: "row", marginTop: 2 }}>
              <View style={styles.inputIconCombo}>
                <TextInput
                  placeholder="Användarnamn:"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                />
                {searchText.length > 0 ? (
                  <TouchableOpacity
                    style={styles.crossStyle}
                    onPress={() => setSearchText("")}>
                    <Entypo
                      name="cross"
                      size={34}
                      color="black"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.searchGlass}
                onPress={() => {
                  searchText.length > 0
                    ? search(searchText)
                    : null;
                }}>
                <FontAwesome
                  name="search"
                  size={30}
                  color={navy}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FriendsOrSearch />
        </View>
      </View>
    );
  } else if (loaded) {
    return (
      <View style={styles.container}>
        <View style={styles.profileView}>
          <Image
            style={styles.image}
            source={require("../../assets/profilePic.jpg")}
          />
          <View>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>
              {auth.currentUser.displayName}
            </Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>
              Swipes: {amountSwiped}
            </Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>
              Gillade: {amountLiked}
            </Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>
              Ogillade: {amountDisliked}
            </Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>
              Gillade/Ogillade: {getRatio()}
            </Text>
            <Text style={{ fontWeight: "400", fontSize: 16 }}>
              Vänner: {friends.length}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "stretch",
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
            onPress={() => navigation.push("GroupInvites")}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={30}
              color="black"
            />
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                marginLeft: 4,
                flexShrink: 1,
              }}>
              Grupp Inbjudningar
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
            onPress={() => navigation.push("YourGroups")}>
            <MaterialCommunityIcons
              name="account-group"
              size={30}
              color="black"
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                marginLeft: 4,
                flexShrink: 1,
              }}>
              Dina Grupper
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.friendsView,
            generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
          ]}>
          <View
            style={[
              styles.searchContainer,
              generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
            ]}>
            <Text style={{ fontWeight: "500", fontSize: 24 }}>
              Sök efter användare:
            </Text>
            <View style={{ flexDirection: "row", marginTop: 2 }}>
              <View style={styles.inputIconCombo}>
                <TextInput
                  placeholder="Användarnamn:"
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                />
                {searchText.length > 0 ? (
                  <TouchableOpacity
                    style={styles.crossStyle}
                    onPress={() => setSearchText("")}>
                    <Entypo
                      name="cross"
                      size={34}
                      color="black"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.searchGlass}
                onPress={() => {
                  searchText.length > 0
                    ? search(searchText)
                    : null;
                }}>
                <FontAwesome
                  name="search"
                  size={30}
                  color={navy}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FriendsOrSearch />
        </View>
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

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
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
  groupContainer: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: lemon,
    alignItems: "center",
    marginTop: 4,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: Dimensions.get("window").width * 0.465,
  },
});
