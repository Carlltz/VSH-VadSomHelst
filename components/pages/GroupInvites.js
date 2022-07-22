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
import { lime, lemon, teal, mint, navy } from "../../styles/colors";
import { MaterialCommunityIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import { collection, doc, getDoc, addDoc, getDocs, setDoc, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";

const GroupInvites = () => {
  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;

    async function getDATA() {
      const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const q = query(collection(db, "groups"), where("users", "array-contains", auth.currentUser.uid));
      const groups = await getDocs(q);
      const userData = userSnap.data();
      let invitedGroups = [];

      groups.forEach((group) => {
        const groupData = group.data();
        if (groupData.users.includes(auth.currentUser.uid) && !userData.groups.includes(group.id)) {
          invitedGroups.push({ name: groupData.name, id: group.id });
        }
        setGroups(invitedGroups);
      });

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

  const renderGroups = ({ item }) => {
    const local = StyleSheet.create({
      container: {
        alignSelf: "stretch",
        height: 100,
        backgroundColor: mint,
      },
    });
    return (
      <View style={local.container}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const ListOrText = () => {
    if (groups.length > 0) {
      return (
        <TouchableOpacity style={styles.container}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 8, paddingTop: 0 }}
            style={{ alignSelf: "stretch", flex: 1 }}
            data={groups}
            renderItem={renderGroups}
            /* keyExtractor={(item) => item.id} */
          />
        </TouchableOpacity>
      );
    } else if (recipesLoaded) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "600", textAlign: "center" }}>Du har inga nya inbjudningar</Text>
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
      <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: lime }}>
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
    backgroundColor: lime,
  },
});
