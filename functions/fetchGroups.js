import getToken from "../functions/getToken";

async function getMembersGroups() {
  const url = "http://81.229.44.166:3000/api/groups/me";
  try {
    let data = await fetch(url, {
      headers: {
        "VSH-auth-token": await getToken(),
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
      "http://81.229.44.166:3000/api/groups/groupIds/" +
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
      "http://81.229.44.166:3000/api/groups",
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
      "http://81.229.44.166:3000/api/groups/leaveGroup/" +
        groupId,
      requestOptions
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function initMemberData(body) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "VSH-auth-token": await getToken(),
    },
    body: JSON.stringify(body),
  };
  try {
    let data = await fetch(
      "http://81.229.44.166:3000/api/groups/initMemberData",
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
  initMemberData,
};
