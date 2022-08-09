import getToken from "../functions/getToken";

async function getUserdata(options = "") {
  const url =
    "http://192.168.68.138:3000/api/users/me/" + options;
  try {
    let userData = await fetch(url, {
      headers: {
        "VSH-auth-token": await getToken(),
      },
    });
    userData = await userData.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}

async function putUserdata(body) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "VSH-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
    },
    body: JSON.stringify(body),
  };
  try {
    const result = await fetch(
      "http://192.168.68.138:3000/api/users/me",
      requestOptions
    );
  } catch (error) {
    console.log("error", error);
  }
}

async function deleteFieldsInUserdata(body) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "VSH-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
    },
  };
  try {
    const result = await fetch(
      "http://192.168.68.138:3000/api/users/me/all/" + body,
      requestOptions
    );
  } catch (error) {
    console.log("error", error);
  }
}

export { getUserdata, deleteFieldsInUserdata, putUserdata };
