//rnfes

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import DislikedPage from "./components/pages/DislikedPage";
import { lime, lemon, teal, mint, navy } from "./styles/colors";
import ChangeGroup from "./components/pages/ChangeGroup";
import GroupInvites from "./components/pages/GroupInvites";
import YourGroups from "./components/pages/YourGroups";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Disliked"
            component={DislikedPage}
            /* Could set a custom header in options to specify the height if wanted */
            options={{
              title: "Ogillade",
              headerStyle: {
                backgroundColor: mint,
              },
            }}
          />
          <Stack.Screen
            name="ChangeGroup"
            component={ChangeGroup}
            /* Could set a custom header in options to specify the height if wanted */
            options={{
              title: "Ändra grupp",
              headerStyle: {
                backgroundColor: mint,
              },
            }}
          />
          <Stack.Screen
            name="GroupInvites"
            component={GroupInvites}
            options={{
              title: "Grupp inbjudningar",
              headerStyle: {
                backgroundColor: mint,
              },
            }}
          />
          <Stack.Screen
            name="YourGroups"
            component={YourGroups}
            options={{
              title: "Dina Grupper",
              headerStyle: {
                backgroundColor: mint,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
