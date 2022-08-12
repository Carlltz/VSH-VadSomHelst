import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
  AppState,
  ActivityIndicator,
  ImageBackground,
  Animated,
  Linking,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  lime,
  lemon,
  teal,
  mint,
  navy,
} from "../../styles/colors";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import Swiper from "react-native-deck-swiper";
import {
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import Card from "../Card";
import {
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { getRecipes } from "../../functions/fetchRecipes";
import {
  getUserdata,
  putUserdata,
} from "../../functions/fetchUsers";

//https://github.com/alexbrillant/react-native-deck-swiper
//https://www.npmjs.com/package/@ilterugur/react-native-deck-swiper-renewed

const newDATA = [
  {
    name: "Pasta Puttanesca med purjolök och zucchini",
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_193835/cf_259/pasta_puttanesca_med_purjolok_och_zucchini.jpg",
    time: "Under 45 min",
    description:
      "Pasta puttanesca är ursprungligen en riktig man-tager-vad-man-haver rätt där man kan blanda i lite allt möjligt som finns i grönsakslådan. Sedan får sardeller och kapris sätta den rätta knorren på pastasåsen och så i med en burk goda oliver. En spaghetti med mycket smak av Italien.",
    ingredientAmount: 15,
    stars: [1, 1, 1, 1, 0.5],
    url: "https://www.ica.se/recept/pasta-puttanesca-med-purjolok-och-zucchini-724896/",
  },
  {
    name: "Supersnabb pasta med bacon och majs",
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_237398/cf_259/supersnabb_pasta_med_bacon_och_majs.jpg",
    time: "Under 30 min",
    description:
      "Hur trollar man fram en snabb lunch eller middag som alla älskar? Svaret är pasta med bacon. Nykokt tagliatelle med majs, bacon, grädde och lite chilisås är nog den enklaste pastarätt du kan göra, men också en av de godaste. Klart på en kvart!",
    ingredientAmount: 11,
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/supersnabb-pasta-med-bacon-och-majs-723149/",
  },
  {
    name: "Fläskytterfilé med gräddig sås och pasta",
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_240568/cf_259/flaskytterfilé_med_graddig_sas_och_pasta.jpg",
    time: "Under 45 min",
    description:
      "Sa någon kött och sås? Här steks filéerna gyllenbruna i en varm panna som sedan får sällskap av mjölk, grädde, soja, buljongtärning och timjan. Resultatet blir en god och krämig gräddsås. Servera ihop med pasta och grönsaker. Går hem hos hela familjen!",
    ingredientAmount: 13,
    stars: [1, 1, 1, 1, 0.5],
    url: "https://www.ica.se/recept/flaskytterfile-med-graddig-sas-och-pasta-724762/",
  },
  {
    name: "Pasta Bolognese med tomatsallad",
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_71267/cf_259/pasta_bolognese_med_tomatsallad.jpg",
    time: "Under 30 min",
    description:
      "En enkel men färgsprakande och supergod pasta bolognese sitter väl aldrig fel? Tillagningstiden är under 30 minuter och rätten kommer snabbt bli en vardagsfavorit för hela familjen! Servera bolognesen med nykokt pasta och fräsch tomatsallad.",
    ingredientAmount: 17,
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/pasta-bolognese-med-tomatsallad-715955/",
  },
];

const SwipePage = ({ setParentPage }) => {
  const [recipesLoaded, setRecipesLoaded] = useState(false);
  const [recipesSnaps, setRecipesSnaps] = useState([]);
  const [lastCardIndex, setLastCardIndex] = useState(-1);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [groupPopupVisible, setGroupPopupVisible] =
    useState(false);
  const [currentGroupName, setCurrentGroupName] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  //Saved Text popup
  const [savedText, setSavedText] = useState(null);
  const smallPop = useRef(new Animated.Value(0)).current;
  const popIsMounted = useRef(false);

  const showPop = () => {
    Animated.timing(smallPop, {
      toValue: 0.9,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(smallPop, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, 1200);
    });
  };

  useEffect(() => {
    if (popIsMounted.current) {
      showPop();
    } else {
      popIsMounted.current = true;
    }
  }, [savedText]);

  async function updateLiked(val) {
    await putUserdata({ liked: val });

    /* if (currentGroupId === auth.currentUser.uid) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { liked: arrayUnion(val) });
    } else {
      await updateDoc(doc(db, "groups", currentGroupId), { [`${auth.currentUser.uid}.liked`]: arrayUnion(val) });
    } */
  }

  async function updateDisliked(val) {
    await putUserdata({ disliked: val });

    /* if (currentGroupId === auth.currentUser.uid) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { disliked: arrayUnion(val) });
    } else {
      await updateDoc(doc(db, "groups", currentGroupId), { [`${auth.currentUser.uid}.disliked`]: arrayUnion(val) });
    } */
  }

  //test appState
  /* const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
      }

      if (nextAppState === "background") {
        updateLiked();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []); */

  // getting DATA

  useEffect(() => {
    if (!isFocused) {
      setRecipesLoaded(false);
      setReachedEnd(false);
    } else {
      // 👇️ set isMounted to true
      let isMounted = true;

      async function getDATA() {
        /* const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userSnap.data();

        let swiped;

        if (userData.groups[0] != "Privat") {
          const groupSnap = await getDoc(doc(db, "groups", userData.groups[0]));
          const groupData = groupSnap.data();
          setCurrentGroupName(groupData.name);
          setCurrentGroupId(groupSnap.id);

          const usersData = groupData[auth.currentUser.uid];
          swiped = [...usersData.liked, ...usersData.disliked];
        } else {
          setCurrentGroupName(userData.groups[0]);
          setCurrentGroupId(auth.currentUser.uid);

          swiped = [...userData.liked, ...userData.disliked];
        }

        const recipesSnap = await getDocs(collection(db, "recipes"));
        recipesSnap.forEach((doc) => {
          if (!swiped.includes(doc.id)) {
            const data = doc.data();
            data.id = doc.id;
            data.saved = userData.saved.includes(doc.id);
            recipes.push(data);
          }
        });*/
        let recipes = [];
        let swiped = [];

        const userData = await getUserdata(
          "saved&liked&disliked&groups"
        );

        if (userData.groups[0] === "Privat") {
          setCurrentGroupName(userData.groups[0]);
          setCurrentGroupId("Privat");
          swiped = [...userData.liked, ...userData.disliked];
        }
        const recipesSnap = await getRecipes();
        for (let i = 0; i < recipesSnap.length; i++) {
          if (!swiped.includes(recipesSnap[i]._id)) {
            recipesSnap[i].saved = userData.saved.includes(
              recipesSnap[i]._id
            );
            recipes.push(recipesSnap[i]);
          }
        }
        if (recipes.length == 0) setReachedEnd(true);
        setRecipesSnaps(recipes);

        setRecipesLoaded(true);
      }

      if (!recipesLoaded) {
        getDATA();
      }

      return () => {
        // 👇️ when component unmounts, set isMounted to false
        isMounted = false;
      };
    }
  }, [isFocused]);

  const useSwiper = useRef(null).current;

  const SwiperOrEmtpy = () => {
    if (isFocused) {
      if (!recipesLoaded) {
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
      } else if (!reachedEnd) {
        return (
          <View
            style={{
              width: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <View
              style={{
                width: "100%",
                flex: 1,
                backgroundColor: lemon,
              }}>
              <Swiper
                ref={useSwiper}
                animateCardOpacity
                cards={recipesSnaps}
                renderCard={(card) => <Card item={card} />}
                cardIndex={lastCardIndex + 1}
                backgroundColor={lime}
                stackSize={2}
                animateOverlayLabelsOpacity
                containerStyle={styles.mainScroll}
                style={styles.mainSwipe}
                cardStyle={{
                  top: 8,
                  left: 8,
                  bottom: 8,
                  right: 8,
                  width: "auto",
                  height: "auto",
                }}
                useViewOverflow={false}
                disableTopSwipe={true}
                disableBottomSwipe={true}
                onSwipedRight={(index) =>
                  updateLiked(recipesSnaps[index]._id)
                }
                onSwipedLeft={(index) =>
                  updateDisliked(recipesSnaps[index]._id)
                }
                onSwiped={(index) => {
                  setLastCardIndex(index);
                }}
                verticalSwipe={false}
                horizontalThreshold={40}
                swipeAnimationDuration={200}
                onSwipedAll={() => setReachedEnd(true)}
                onTapCard={(index) =>
                  Linking.openURL(recipesSnaps[index].url)
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-around",
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
                onPress={() => navigation.push("ChangeGroup")}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={30}
                  color="black"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    marginHorizontal: 4,
                    flexShrink: 1,
                  }}>
                  {currentGroupName}
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
                onPress={() => {}}>
                <Ionicons
                  name="filter"
                  size={28}
                  color="black"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    marginHorizontal: 4,
                    flexShrink: 1,
                  }}>
                  Filter
                </Text>
              </TouchableOpacity>
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
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  textAlign: "center",
                }}>
                Slut på recept i gruppen: {"\n"}{" "}
                {currentGroupName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-around",
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
                onPress={() => navigation.push("ChangeGroup")}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={30}
                  color="black"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    marginHorizontal: 4,
                    flexShrink: 1,
                  }}>
                  {currentGroupName}
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
                onPress={() => {}}>
                <Ionicons
                  name="filter"
                  size={28}
                  color="black"
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    marginHorizontal: 4,
                    flexShrink: 1,
                  }}>
                  Filter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    } else {
      return <View style={{ width: "100%", flex: 1 }}></View>;
    }
  };

  return (
    <View
      style={{
        alignSelf: "stretch",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <SwiperOrEmtpy />

      <Animated.View
        pointerEvents="none"
        style={[styles.pop, { opacity: smallPop }]}>
        <Text style={{ color: "white", fontSize: 17 }}>
          {savedText}
        </Text>
      </Animated.View>
    </View>
  );
};

export default SwipePage;

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  mainSwipe: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    alignSelf: "stretch",
    flex: 1, //Dimensions.get("window").height - 85 - 2 * 6
    backgroundColor: mint,
    borderRadius: 30,
    alignItems: "center",
    padding: 15,
  },
  cardImage: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  favoriteBtn: {
    backgroundColor: "rgba(117, 201, 183, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 15,
    margin: 10,
  },
  pop: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.025,
    backgroundColor: navy,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 100,
    alignSelf: "center",
  },
  groupContainer: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: mint,
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: Dimensions.get("window").width * 0.4,
  },
  modalPopup: {
    width: "90%",
    height: "80%",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 20,
    backgroundColor: teal,
  },
});
