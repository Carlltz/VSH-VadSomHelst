import getToken from "../functions/getToken";

async function getRecipes() {
  const url = "http://81.229.44.166:3000/api/recipes";
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

export { getRecipes };
