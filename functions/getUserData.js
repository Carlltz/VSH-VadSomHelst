export default async function (options = "") {
  const url =
    "http://192.168.68.138:3000/api/users/me/" + options;
  try {
    let userData = await fetch(url, {
      headers: {
        "VSH-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
      },
    });
    userData = await userData.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}
