import { FlatList, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";
import { doc, getDoc, query, getDocs, collection, where, getAll, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import { useNavigation } from "@react-navigation/native";

const ChangeGroup = () => {
  const [loaded, setLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
  const [preventPress, setPreventPress] = useState(false);

  const navigation = useNavigation();

  async function updateGroups(val) {
    setPreventPress(true);
    let groupsCur = groups;
    groupsCur.unshift(groupsCur.splice(groupsCur.indexOf(val), 1)[0]);
    let groupsCurId = [];
    groupsCur.forEach((group) => {
      groupsCurId.push(group.id);
    });
    await updateDoc(doc(db, "users", auth.currentUser.uid), { groups: groupsCurId }).then(() => navigation.goBack());
  }

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;
    let usersGroups = [];
    let groupsData = [];
    let privatIndex = 0;

    async function getGroup(group) {
      const snap = await getDoc(doc(db, "groups", group));
      usersGroups.push({ ...snap.data(), id: snap.id });
      if (usersGroups.length == groupsData.length) {
        usersGroups.splice(privatIndex, 0, { name: "Privat", id: "Privat" });

        setGroups(usersGroups);
        setLoaded(true);
        console.log(usersGroups);
      }
      //console.log(usersGroups);
    }

    async function getDATA() {
      const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userSnap.data();

      groupsData = userData.groups;

      if (groupsData.includes("Privat")) {
        privatIndex = groupsData.indexOf("Privat");
        groupsData.splice(privatIndex, 1);
      }

      if (groupsData.length > 0) {
        groupsData.forEach((group) => {
          getGroup(group);
        });
      } else {
        setLoaded(true);
      }

      /* const q = query(collection(db, "groups"), where("users", "array-contains-any", [auth.currentUser.uid]));
      const querySnapshot = await getDocs(q);
      let groupsArray = [];
      querySnapshot.forEach((doc) => {
        groupsArray.push({ id: doc.id, name: doc.data().name });
      });
      setGroups(groupsArray) */
    }

    if (!loaded) {
      getDATA();
    }

    return () => {
      // 👇️ when component unmounts, set isMounted to false
      isMounted = false;
    };
  }, []);

  const renderCard = (item) => {
    item = item.item;
    const local = StyleSheet.create({
      card: {
        alignSelf: "stretch",
        backgroundColor: mint,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 15,
        marginTop: 10,
      },
      name: {
        fontSize: 20,
        fontWeight: "500",
      },
    });
    return (
      <TouchableOpacity
        onPress={() => updateGroups(item)}
        style={[local.card, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}
        disabled={preventPress}>
        <Text style={local.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loaded) {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 12, paddingTop: 2, paddingHorizontal: 12 }}
          style={styles.flatList}
          data={groups}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  } else {
    return (
      <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: lime }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
};

export default ChangeGroup;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: lime,
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
});
