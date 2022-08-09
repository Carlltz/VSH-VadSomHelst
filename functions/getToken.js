import * as SecureStore from "expo-secure-store";

export default async function () {
  return await SecureStore.getItemAsync("token");
}
