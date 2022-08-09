async function getMembersGroups(memberId) {
  const url =
    "http://192.168.68.138:3000/api/groups/" + memberId;
  try {
    let data = await fetch(url, {
      headers: {
        "VSH-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwMjJjYWExYzI2YWI0ODY2MGY2MzEiLCJpYXQiOjE2NTk5MDQ3MTh9.oYgA4ljVojBQ4O2TV5hFX6guKLEpWfzUTeneOvhS-B0",
      },
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

export { getMembersGroups };
