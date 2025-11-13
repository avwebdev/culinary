import client from "./strapi";

const pages = client.collection("schools");

export async function getSchoolData() {
  const response = await pages.find({
    populate: ["hero"],
  });

  return response.data;
}
