import client from "./strapi";

const pages = client.collection("pages");

export async function getPageData(path: string) {
  const response = await pages.find({
    filters: { path: path },
    populate: "*",
  });

  return response.data;
}
