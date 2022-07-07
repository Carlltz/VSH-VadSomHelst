import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal, Button } from "react-native";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import { useNavigation } from "@react-navigation/native";

const SettingsPage = () => {
  const [logOutPopup, setLogOutPopup] = useState(false);

  const navigation = useNavigation();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("SignInScreen");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loggaUt} onPress={() => setLogOutPopup(true)}>
        <Text style={{ fontSize: 20, fontWeight: "600", textAlign: "center", color: navy }}>Logga ut</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={logOutPopup}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.modalPopup, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
          <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginVertical: 15, color: navy }}>
            Logga ut?
          </Text>
          <View style={styles.options}>
            <TouchableOpacity style={[styles.option, { borderRightWidth: 0.8 }]} onPress={() => setLogOutPopup(false)}>
              <Text style={{ fontSize: 22, fontWeight: "600", textAlign: "center", color: navy }}>Avbryt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option, { borderLeftWidth: 0.8 }]} onPress={logOut}>
              <Text style={{ fontSize: 22, fontWeight: "600", textAlign: "center", color: "#DB2432" }}>Logga ut</Text>
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
    marginTop: "auto",
    marginBottom: Dimensions.get("window").width * 0.05,
    borderRadius: 10,
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
});
