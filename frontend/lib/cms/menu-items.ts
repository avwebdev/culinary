import client from "./strapi";

const pages = client.collection("menu-items");

export async function getMenuData(school: string) {
  const response = await pages.find({
    filters: { school: school },
    populate: "*",
  });

  return response.data;
}
