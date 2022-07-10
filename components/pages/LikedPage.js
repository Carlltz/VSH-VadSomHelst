import { FlatList, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Linking } from "react-native";
import React, { useState } from "react";
import { lime, lemon, teal, mint, navy } from "../../styles/colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { generateBoxShadowStyle } from "../../styles/generateShadow";

const DATA = [
  {
    name: "Kyckling med purjolökssås",
    id: 0,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_239046/cf_259/kyckling_med_purjolokssas.jpg",
    time: "Under 30 min",
    description:
      "Den här lättlagade pastarätten med kyckling, purjolök och sockerärter kan säkert bli en ny favorit där hemma i stugorna. Med lite vitlök och basilika sprids smarriga dofter i köket. Lika god är den att äta!",
    amount: "11 Ingredienser",
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/kyckling-med-purjolokssas-714632/",
  },
  {
    name: "Pasta Puttanesca med purjolök och zucchini",
    id: 1,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_193835/cf_259/pasta_puttanesca_med_purjolok_och_zucchini.jpg",
    time: "Under 45 min",
    description:
      "Pasta puttanesca är ursprungligen en riktig man-tager-vad-man-haver rätt där man kan blanda i lite allt möjligt som finns i grönsakslådan. Sedan får sardeller och kapris sätta den rätta knorren på pastasåsen och så i med en burk goda oliver. En spaghetti med mycket smak av Italien.",
    amount: "15 Ingredienser",
    stars: [1, 1, 1, 1, 0.5],
    url: "https://www.ica.se/recept/pasta-puttanesca-med-purjolok-och-zucchini-724896/",
  },
  {
    name: "Supersnabb pasta med bacon och majs",
    id: 2,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_237398/cf_259/supersnabb_pasta_med_bacon_och_majs.jpg",
    time: "Under 30 min",
    description:
      "Hur trollar man fram en snabb lunch eller middag som alla älskar? Svaret är pasta med bacon. Nykokt tagliatelle med majs, bacon, grädde och lite chilisås är nog den enklaste pastarätt du kan göra, men också en av de godaste. Klart på en kvart!",
    amount: "11 Ingredienser",
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/supersnabb-pasta-med-bacon-och-majs-723149/",
  },
  {
    name: "Fläskytterfilé med gräddig sås och pasta",
    id: 3,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_240568/cf_259/flaskytterfilé_med_graddig_sas_och_pasta.jpg",
    time: "Under 45 min",
    description:
      "Sa någon kött och sås? Här steks filéerna gyllenbruna i en varm panna som sedan får sällskap av mjölk, grädde, soja, buljongtärning och timjan. Resultatet blir en god och krämig gräddsås. Servera ihop med pasta och grönsaker. Går hem hos hela familjen!",
    amount: "13 Ingredienser",
    stars: [1, 1, 1, 1, 0.5],
    url: "https://www.ica.se/recept/flaskytterfile-med-graddig-sas-och-pasta-724762/",
  },
  {
    name: "Pasta Bolognese med tomatsallad",
    id: 4,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_71267/cf_259/pasta_bolognese_med_tomatsallad.jpg",
    time: "Under 30 min",
    description:
      "En enkel men färgsprakande och supergod pasta bolognese sitter väl aldrig fel? Tillagningstiden är under 30 minuter och rätten kommer snabbt bli en vardagsfavorit för hela familjen! Servera bolognesen med nykokt pasta och fräsch tomatsallad.",
    amount: "17 Ingredienser",
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/pasta-bolognese-med-tomatsallad-715955/",
  },
  {
    name: "Pasta Bolognese med tomatsallad",
    id: 5,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_71267/cf_259/pasta_bolognese_med_tomatsallad.jpg",
    time: "Under 30 min",
    description:
      "En enkel men färgsprakande och supergod pasta bolognese sitter väl aldrig fel? Tillagningstiden är under 30 minuter och rätten kommer snabbt bli en vardagsfavorit för hela familjen! Servera bolognesen med nykokt pasta och fräsch tomatsallad.",
    amount: "17 Ingredienser",
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/pasta-bolognese-med-tomatsallad-715955/",
  },
  {
    name: "Pasta Bolognese med tomatsallad",
    id: 6,
    image:
      "https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_718,h_718,c_lfill/imagevaultfiles/id_71267/cf_259/pasta_bolognese_med_tomatsallad.jpg",
    time: "Under 30 min",
    description:
      "En enkel men färgsprakande och supergod pasta bolognese sitter väl aldrig fel? Tillagningstiden är under 30 minuter och rätten kommer snabbt bli en vardagsfavorit för hela familjen! Servera bolognesen med nykokt pasta och fräsch tomatsallad.",
    amount: "17 Ingredienser",
    stars: [1, 1, 1, 1, 0],
    url: "https://www.ica.se/recept/pasta-bolognese-med-tomatsallad-715955/",
  },
];

const LikedPage = () => {
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

  const renderCard = ({ item }) => {
    let x = 0,
      y = 0,
      height = 90,
      width = 90;
    const onLayout = (event) => {
      ({ x, y, height, width } = event.nativeEvent.layout);
    };

    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(item.url)}
        style={[styles.card, generateBoxShadowStyle("#000", 0, 4, 0.3, 4.56, 8)]}>
        <Image style={[styles.cardImage]} source={{ uri: item.image }} />
        <View
          onLayout={onLayout}
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 5,
          }}>
          <Text style={{ fontSize: 18, textAlign: "center" }}>{item.name}</Text>
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
              justifyContent: "space-evenly",
            }}>
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons name="clock-time-five-outline" size={20} color={navy} />
              <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.time}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons name="food-takeout-box-outline" size={20} color={navy} />
              <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.amount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 8, paddingTop: 0 }}
        style={styles.flatList}
        data={DATA}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default LikedPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "95%",
    backgroundColor: mint,
    borderRadius: 30,
    alignItems: "center",
    padding: 12,
    alignSelf: "center",
    marginTop: 8,
    flexDirection: "row",
  },
  cardImage: {
    height: 90,
    width: undefined,
    aspectRatio: 1,
    borderRadius: 20,
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
});
