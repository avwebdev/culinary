import client from "./strapi-client";

const pages = client.collection("pages");

export async function getPageData(path: string) {
  const response = await pages.find({
    filters: { path },
    populate: "*",
  });

  return response.data;
}
