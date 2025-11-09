import client from "./strapi";
import type { GlobalType } from "./types/global";

const global = client.collection("global");

export async function getNavbarData() {
  const globalData = await global.find({
    populate: {
      header: { populate: "*" },
    },
  });

  const navData = globalData.data as unknown as GlobalType;

  return navData.header;
}
