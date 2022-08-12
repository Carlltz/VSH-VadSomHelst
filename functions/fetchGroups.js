import getToken from "../functions/getToken";

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

async function getGroupsByIds(selections, body) {
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
      "http://192.168.68.138:3000/api/groups/groupIds/" +
        selections,
      requestOptions
    );
    data = await data.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function createGroup(body) {
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
      "http://192.168.68.138:3000/api/groups",
      requestOptions
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function leaveGroupFetch(groupId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "VSH-auth-token": await getToken(),
    },
  };
  try {
    let data = await fetch(
      "http://192.168.68.138:3000/api/groups/leaveGroup/" +
        groupId,
      requestOptions
    );
  } catch (error) {
    throw new Error(error);
  }
}

export {
  getMembersGroups,
  getGroupsByIds,
  leaveGroupFetch,
  createGroup,
};
