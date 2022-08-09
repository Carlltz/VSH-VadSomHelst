export default async function (body) {
  console.log(body);
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
