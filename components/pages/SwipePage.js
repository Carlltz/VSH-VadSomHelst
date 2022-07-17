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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";
import { generateBoxShadowStyle } from "../../styles/generateShadow";
import Swiper from "react-native-deck-swiper";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
  query,
} from "firebase/firestore";

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
  const [currentSaved, setCurrentSaved] = useState(false);

  const [lastSwipe, setLastSwipe] = useState("");
  const [recipesLoaded, setRecipesLoaded] = useState(false);
  const [recipesSnaps, setRecipesSnaps] = useState([]);
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [swipedCards, setSwipedCards] = useState([]);
  const [bookmarkIcon, setBookmarkIcon] = useState("bookmark-o");
  const [lastCardIndex, setLastCardIndex] = useState(-1);
  const [reloadCards, setReloadCards] = useState(0);

  //test appState
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  async function updateLiked(val) {
    setLiked((prev) => [...prev, val]);
    await updateDoc(doc(db, "users", auth.currentUser.uid), { liked: arrayUnion(val) });
  }

  async function updateDisliked(val) {
    setDisliked((prev) => [...prev, val]);
    await updateDoc(doc(db, "users", auth.currentUser.uid), { disliked: arrayUnion(val) });
  }

  async function updateSaved() {
    const curSaved = await getDoc(doc(db, "users", auth.currentUser.uid));
    const curSavedData = curSaved.data();
    if (curSavedData.saved.includes(recipesSnaps[lastCardIndex + 1].id)) {
      setBookmarkIcon("bookmark-o");
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        saved: arrayRemove(recipesSnaps[lastCardIndex + 1].id),
      });
    } else {
      setBookmarkIcon("bookmark");
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        saved: arrayUnion(recipesSnaps[lastCardIndex + 1].id),
      });
    }

    if (currentSaved) {
      console.log("Removing");
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        saved: arrayRemove(recipesSnaps[lastCardIndex + 1].id),
      });
    } else {
      console.log("Adding");
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        saved: arrayUnion(recipesSnaps[lastCardIndex + 1].id),
      });
    }
    setCurrentSaved((val) => !val);
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      //console.log("clLiked: ", liked);
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
  }, []);

  // getting DATA

  let recipes = [];

  useEffect(() => {
    // 👇️ set isMounted to true
    let isMounted = true;

    async function addRecipe(recipe) {
      const toAdd = await addDoc(collection(db, "recipes"), recipe);
    }

    async function getDATA() {
      const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userSnap.data();
      setLiked(userData.liked);
      setDisliked(userData.disliked);
      const swiped = [...userData.liked, ...userData.disliked];

      const recipesSnap = await getDocs(collection(db, "recipes"));
      recipesSnap.forEach((doc) => {
        if (!swiped.includes(doc.id)) {
          const data = doc.data();
          data.id = doc.id;
          recipes.push(data);
        }
      });
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
  }, []);

  const useSwiper = useRef(null).current;

  function getStar(val) {
    switch (val) {
      case 0:
        return "star-o";
      case 1:
        return "star";
      case 0.5:
        return "star-half-empty";
    }
  }

  /* useEffect(() => {
    console.log("Yupp");
    setReloadCards(1);
  }, [currentSaved]); */

  /* const handleOnSwipedLeft = () => useSwiper.swipeLeft();
  const handleOnSwipedTop = () => useSwiper.swipeTop();
  const handleOnSwipedRight = () => useSwiper.swipeRight(); */
  const Card = ({ item }) => (
    <View style={[styles.card, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
      <ImageBackground style={[styles.cardImage]} imageStyle={{ borderRadius: 15 }} source={{ uri: item.image }}>
        <TouchableOpacity onPress={() => updateSaved()}>
          <View style={[styles.favoriteBtn]}>
            <FontAwesome name={bookmarkIcon} size={34} color="black" />
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <Text style={{ fontSize: 28, textAlign: "center" }}>{item.name}</Text>
      <View style={{ flexDirection: "row", marginBottom: 2 }}>
        <FontAwesome name={getStar(item.stars[0])} size={24} color="black" />
        <FontAwesome name={getStar(item.stars[1])} size={24} color="black" />
        <FontAwesome name={getStar(item.stars[2])} size={24} color="black" />
        <FontAwesome name={getStar(item.stars[3])} size={24} color="black" />
        <FontAwesome name={getStar(item.stars[4])} size={24} color="black" />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: 4,
          justifyContent: "space-evenly",
        }}>
        <View style={{ alignItems: "center" }}>
          <MaterialCommunityIcons name="clock-time-five-outline" size={26} color={navy} />
          <Text style={{ fontSize: 20, fontWeight: "500" }}>{item.time}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <MaterialCommunityIcons name="food-takeout-box-outline" size={26} color={navy} />
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            {item.ingredientAmount} {item.ingredientAmount == 1 ? "Ingrediens" : "Ingredienser"}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 16, fontWeight: "400", textAlign: "center" }}>{item.description}</Text>
    </View>
  );

  if (recipesLoaded && recipesSnaps.length > 0) {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Swiper
          ref={useSwiper}
          animateCardOpacity
          cards={recipesSnaps}
          renderCard={(card) => <Card item={card} />}
          cardIndex={reloadCards}
          backgroundColor={lime}
          cardVerticalMargin={6}
          cardHorizontalMargin={6}
          stackSize={2}
          infinite
          animateOverlayLabelsOpacity
          containerStyle={styles.mainScroll}
          useViewOverflow={false}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          onSwipedRight={(index) => updateLiked(recipesSnaps[index].id)}
          onSwipedLeft={(index) => updateDisliked(recipesSnaps[index].id)}
          onSwiped={(index) => {
            setLastCardIndex(index);
            setCurrentSaved(false);
          }}
          verticalSwipe={false}
          horizontalThreshold={40}
          swipeAnimationDuration={200}></Swiper>
      </View>
    );
  } else if (recipesLoaded) {
    return (
      <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Slut på recept!</Text>
      </View>
    );
  } else {
    return (
      <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
};

export default SwipePage;

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: Dimensions.get("window").height - 85 - 2 * 6,
    backgroundColor: mint,
    borderRadius: 30,
    alignItems: "center",
    padding: 15,
    alignSelf: "center",
  },
  cardImage: {
    width: "100%",
    flex: 1,
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
});
