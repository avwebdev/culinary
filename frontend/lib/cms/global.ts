import client from "./strapi";
import type { GlobalType, FooterType, HeaderType } from "./types/global";

const global = client.collection("global");

export async function getNavbarData(): Promise<HeaderType> {
  const response = await global.find({
    populate: {
      header: {
        populate: "*",
      },
    },
  });
  
  const globalData = response.data as unknown as GlobalType;
  
  if (!globalData?.header) {
    throw new Error("Header data not found in CMS");
  }
  
  return globalData.header;
}

export async function getFooterData(): Promise<FooterType | null> {
  const response = await global.find({
    populate: {
      footer: {
        populate: "*",
      },
    },
  });
  
  const globalData = response.data as unknown as GlobalType;
  
  return globalData?.footer || null;
}
