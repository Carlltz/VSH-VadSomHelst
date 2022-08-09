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
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import getUserData from "../../functions/getUserData";
import putUserData from "../../functions/putUserData";

const GroupInvites = () => {
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [reloadFlatList, setReloadFlatList] = useState(false);

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;

    async function getDATA() {
      const q = query(
        collection(db, "groups"),
        where(
          `usernames.${auth.currentUser.uid}.memberId`,
          "==",
          auth.currentUser.uid
        )
      );
      const groups = await getDocs(q);
      const userData = await getUserData("groups");
      let invitedGroups = [];

      groups.forEach((group) => {
        const groupData = group.data();
        if (!userData.groups.includes(group.id)) {
          invitedGroups.push({
            name: groupData.name,
            id: group.id,
            numMem: Object.keys(groupData.usernames).length,
          });
        }
      });
      setGroups(invitedGroups);

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

  async function acceptGroup(group) {
    setGroups((prev) => {
      prev.splice(prev.indexOf(group), 1);
      return prev;
    });
    setReloadFlatList((val) => !val);
    await setDoc(
      doc(db, "groups", group.id),
      { [auth.currentUser.uid]: { disliked: [], liked: [] } },
      { merge: true }
    );
    await updateDoc(doc(db, "groups", group.id), {
      [`usernames.${auth.currentUser.uid}.isMember`]: true,
    });
    await putUserData({ groups: arrayUnion(group.id) });
  }

  async function declineGroup(group) {
    setGroups((prev) => {
      prev.splice(prev.indexOf(group), 1);
      return prev;
    });
    setReloadFlatList((val) => !val);
    await updateDoc(doc(db, "groups", group.id), {
      userIds: arrayRemove(group.id),
    });
  }

  const renderGroups = ({ item }) => {
    const local = StyleSheet.create({
      container: {
        alignSelf: "stretch",
        backgroundColor: mint,
        alignItems: "center",
        justifyContent: "space-between",

        borderRadius: 15,
        marginTop: 10,
        flexDirection: "row",
      },
      name: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        alignSelf: "center",
        textAlignVertical: "center",
      },
    });
    return (
      <View style={local.container}>
        <TouchableOpacity
          style={{ paddingHorizontal: 13, paddingVertical: 10 }}
          onPress={() => declineGroup(item)}>
          <Entypo
            name="minus"
            size={30}
            color="black"
            style={{}}
          />
        </TouchableOpacity>
        <TouchableOpacity
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
          <Text
            numberOfLines={1}
            style={[local.name, { marginLeft: 6 }]}>
            {item.numMem} St
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 13, paddingVertical: 10 }}
          onPress={() => acceptGroup(item)}>
          <Entypo
            name="plus"
            size={30}
            color="black"
            style={{}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const ListOrText = () => {
    if (groups.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 10,
              paddingTop: 0,
            }}
            style={{ alignSelf: "stretch", flex: 1 }}
            data={groups}
            renderItem={renderGroups}
            extraData={reloadFlatList}
            /* keyExtractor={(item) => item.id} */
          />
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.container,
            { justifyContent: "center" },
          ]}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
            }}>
            Du har inga obesvarade inbjudningar!
          </Text>
        </View>
      );
    }
  };

  if (loaded) {
    return (
      <View style={styles.container}>
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
          backgroundColor: lime,
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
};

export default GroupInvites;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    paddingTop: 0,
    backgroundColor: lime,
  },
});
