import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  lime,
  lemon,
  teal,
  mint,
  navy,
} from "../../styles/colors";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import { useNavigation } from "@react-navigation/native";
import { getUserdata } from "../../functions/fetchUsers";
import { getGroupsByIds } from "../../functions/fetchGroups";

const ChangeGroup = () => {
  const [loaded, setLoaded] = useState(false);
  const [groups, setGroups] = useState([]);
  const [preventPress, setPreventPress] = useState(false);

  const navigation = useNavigation();

  async function updateGroups(val) {
    setPreventPress(true);
    let groupsCur = groups;

    groupsCur.unshift(
      groupsCur.splice(groupsCur.indexOf(val), 1)[0]
    );

    let groupsCurId = [];
    groupsCur.forEach((group) => {
      groupsCurId.push(group._id);
    });

    const groupsOnly_Id = [];
    groupsCur.forEach((group) => {
      groupsOnly_Id.push(group._id);
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "VSH-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
      },
      body: JSON.stringify({
        groups: groupsOnly_Id,
      }),
    };
    try {
      const result = await fetch(
        "http://81.229.44.166:3000/api/users/me",
        requestOptions
      );
    } catch (error) {
      console.log("error", error);
    }
    navigation.goBack();
  }

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;
    let usersGroups = [];
    let groupsData = [];
    let privatIndex = 0;

    async function getDATA() {
      const userData = await getUserdata("groups");
      groupsData = userData.groups;

      if (groupsData.includes("Privat")) {
        privatIndex = groupsData.indexOf("Privat");
        groupsData.splice(privatIndex, 1);
      }
      if (groupsData.length > 0) {
        usersGroups = await getGroupsByIds({
          groupIds: groupsData,
        });
      }
      usersGroups.splice(privatIndex, 0, {
        name: "Privat",
        _id: "Privat",
      });
      setGroups(usersGroups);
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
        style={[
          local.card,
          generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
        ]}
        disabled={preventPress}>
        <Text style={local.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loaded) {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{
            paddingBottom: 12,
            paddingTop: 2,
            paddingHorizontal: 12,
          }}
          style={styles.flatList}
          data={groups}
          renderItem={renderCard}
          keyExtractor={(item) => item._id}
        />
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
