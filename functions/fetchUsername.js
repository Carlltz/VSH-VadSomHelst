import getToken from "../functions/getToken";

async function getSearchResult(username, uid = "") {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "VSH-auth-token": await getToken(),
    },
    body: JSON.stringify({ username, uid }),
  };
  try {
    let data = await fetch(
      "http://192.168.68.138:3000/api/usernames/search",
      requestOptions
    );
    data = await data.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getAllUserData(body) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "VSH-auth-token": await getToken(),
    },
    body: JSON.stringify(body),
  };
  try {
    let data = await fetch(
      "http://192.168.68.138:3000/api/usernames/data",
      requestOptions
    );
    data = await data.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export { getSearchResult, getAllUserData };
