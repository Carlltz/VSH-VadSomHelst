import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Button,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  lime,
  lemon,
  teal,
  mint,
  navy,
} from "../../styles/colors";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { deleteFieldsInUserdata } from "../../functions/fetchUsers";

const SettingsPage = () => {
  const [logOutPopup, setLogOutPopup] = useState(false);

  const smallPop = useRef(new Animated.Value(0)).current;

  const showPop = () => {
    Animated.timing(smallPop, {
      toValue: 0.9,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(smallPop, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, 800);
    });
  };

  async function resetLiked() {
    showPop();
    await deleteFieldsInUserdata("liked");
  }

  async function resetDisliked() {
    showPop();
    await deleteFieldsInUserdata("disliked");
  }

  const navigation = useNavigation();

  const logOut = async () => {
    await SecureStore.deleteItemAsync("token");
    navigation.replace("SignInScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.reset,
          { backgroundColor: teal, marginTop: 10 },
        ]}
        onPress={() => {
          navigation.push("Disliked");
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            color: navy,
          }}>
          Ogillade recept
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.reset, { marginTop: "auto" }]}
        onPress={() => resetDisliked()}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            color: navy,
          }}>
          Återställ ogillade
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.reset}
        onPress={() => resetLiked()}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            color: navy,
          }}>
          Återställ gillade
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loggaUt}
        onPress={() => setLogOutPopup(true)}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            color: navy,
          }}>
          Logga ut
        </Text>
      </TouchableOpacity>
      <Animated.View
        pointerEvents="none"
        style={[styles.pop, { opacity: smallPop }]}>
        <Text style={{ color: "white", fontSize: 17 }}>
          Reseting...
        </Text>
      </Animated.View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={logOutPopup}>
        <View
          style={[
            styles.modalPopup,
            generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8),
          ]}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "600",
              marginVertical: 15,
              color: navy,
            }}>
            Logga ut?
          </Text>
          <View style={styles.options}>
            <TouchableOpacity
              style={[styles.option, { borderRightWidth: 0.8 }]}
              onPress={() => setLogOutPopup(false)}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  textAlign: "center",
                  color: navy,
                }}>
                Avbryt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, { borderLeftWidth: 0.8 }]}
              onPress={logOut}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  textAlign: "center",
                  color: "#DB2432",
                }}>
                Logga ut
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loggaUt: {
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#DB2432",
    padding: 10,
    marginBottom: Dimensions.get("window").width * 0.05,
    borderRadius: 10,
    marginTop: Dimensions.get("window").width * 0.05,
  },
  modalPopup: {
    width: "80%",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 20,
    backgroundColor: mint,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  option: {
    width: "50%",
    padding: 8,
    borderTopWidth: 1,
  },
  reset: {
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: "#DB2432",
    padding: 10,
    marginBottom: Dimensions.get("window").width * 0.05,
    borderRadius: 10,
  },
  pop: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.025,
    backgroundColor: navy,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 100,
  },
});
