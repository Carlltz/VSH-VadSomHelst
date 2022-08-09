import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { lime, lemon, teal, mint, navy } from "../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";

import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getDocs,
  setDoc,
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import getToken from "../functions/getToken";

const SignInScreen = ({ navigation }) => {
  const [dispName, setdispName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [token, setToken] = useState("");

  async function saveToken(value) {
    await SecureStore.setItemAsync("token", value);
  }

  useEffect(() => {
    async function checkToken() {
      if (await getToken()) {
        navigation.replace("HomeScreen");
      }
    }
    checkToken();
  }, []);

  const logIn = async () => {
    const body = { email, password };
    console.log(body);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    try {
      const result = await fetch(
        "http://192.168.68.138:3000/api/auth",
        requestOptions
      );
      if (result.status === 200) {
        saveToken(await result.text());
        navigation.replace("HomeScreen");
      } else {
        console.log(result.status);
        console.log(await result.text());
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateUser = async () => {
    console.log("username: " + dispName);
    await updateDoc(doc(db, "usernamesTaken", "taken"), {
      usernamesTaken: arrayUnion(dispName),
    });
    await setDoc(doc(db, "usernames", auth.currentUser.uid), {
      usrname: dispName,
    });
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      liked: [],
      disliked: [],
      saved: [],
      friends: [],
      groups: ["Privat"],
    });
    updateProfile(auth.currentUser, {
      displayName: dispName,
    })
      .then(() => {})
      .catch((error) => {
        alert(error.message);
      });
  };

  const singUp = async () => {
    if (password == repPassword && dispName != "") {
      let taken = false;
      const q = query(
        collection(db, "usernamesTaken"),
        where("usernamesTaken", "array-contains-any", [dispName])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.id == "taken") {
          taken = true;
        }
      });
      if (!taken) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredetials) => {
            updateUser().then(() =>
              navigation.replace("HomeScreen")
            );
          })
          .catch((error) => {
            if (error.code == "auth/email-already-in-use") {
              alert(
                "Denna mail-adress är redan registrerad, testa att logga in istället"
              );
            } else if (error.code == "auth/weak-password") {
              alert("Lösenordet måste innehåll minst 6 tecken");
            } else {
              alert(error.code);
            }
          });
      } else {
        alert(
          "Användarnamnet är upptaget, var vänligen välj ett annat istället."
        );
      }
    } else if (dispName === "") {
      alert("Ogiltigt användarnamn");
    } else {
      alert("Passwords do not match.");
    }
  };

  if (register) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[lemon, lime]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 0.9,
            y: 0.9,
          }}
          style={styles.registerSquare}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: navy,
            }}>
            VadSomHelst
          </Text>
          <View style={styles.inputTexts}>
            <TextInput
              placeholder="Användarnamn:"
              value={dispName}
              onChangeText={setdispName}
              style={styles.input}
            />
            <TextInput
              placeholder="Mail-adress:"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { marginTop: 8 }]}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Lösenord:"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { marginTop: 8 }]}
              secureTextEntry
            />
            <TextInput
              placeholder="Upprepa lösenord:"
              value={repPassword}
              onChangeText={setRepPassword}
              style={[styles.input, { marginTop: 8 }]}
              secureTextEntry
            />
          </View>
          <View style={styles.inputButtons}>
            <TouchableOpacity
              onPress={singUp}
              style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRegister(false)}
              style={[styles.button, styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}>
                Login insted
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[teal, lime]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.signSquare}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: navy,
            }}>
            VadSomHelst
          </Text>
          <View style={styles.inputTexts}>
            <TextInput
              placeholder="Mail-adress:"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Lösenord:"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { marginTop: 8 }]}
              secureTextEntry
            />
          </View>
          <View style={styles.inputButtons}>
            <TouchableOpacity
              onPress={logIn}
              style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRegister(true)}
              style={[styles.button, styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  signSquare: {
    height: 300,
    width: "90%",
    backgroundColor: lime,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputTexts: {
    width: "80%",
  },
  inputButtons: {
    width: "60%",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: navy,
    width: "100%",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: navy,
    borderWidth: 2,
    width: "60%",
    padding: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  buttonOutlineText: {
    color: navy,
    fontWeight: "500",
    fontSize: 16,
  },
  registerSquare: {
    height: 400,
    width: "90%",
    backgroundColor: lime,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
