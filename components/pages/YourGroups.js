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
  AntDesign,
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
import RenderYourGroups from "../RenderYourGroups";
import { getUserdata } from "../../functions/fetchUsers";

const YourGroups = () => {
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
      const userData = await getUserdata("groups");
      let yourGroups = [
        {
          name: "Privat",
          id: "Privat",
          numMem: 1,
          members: {
            [auth.currentUser.uid]: {
              memberId: auth.currentUser.uid,
              memberName: auth.currentUser.displayName,
              isMember: true,
            },
          },
        },
      ];

      groups.forEach((group) => {
        if (userData.groups.includes(group.id)) {
          let groupData = group.data();
          yourGroups.push({
            name: groupData.name,
            id: group.id,
            numMem: Object.keys(groupData.usernames).length,
            members: groupData.usernames,
          });
        }
      });
      setGroups(yourGroups);

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

  async function leaveGroup(group) {
    setGroups((prev) => {
      prev.splice(prev.indexOf(group), 1);
      return prev;
    });
    setReloadFlatList((val) => !val);
  }

  const ListOrText = () => {
    if (groups.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 25 }}
            style={{ alignSelf: "stretch", flex: 1 }}
            data={groups}
            renderItem={(item) => (
              <RenderYourGroups
                item={item.item}
                removeGroup={leaveGroup}
              />
            )}
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
            Du är inte med i några grupper!
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

export default YourGroups;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    backgroundColor: lime,
  },
});
