import { client } from "../client";

import type { components } from "../types";

type GlobalType = components["schemas"]["Global"];
type HeaderType = GlobalType["header"];
type FooterType = GlobalType["footer"];

async function getGlobal(): Promise<GlobalType | null> {
  const { data, error, response } = await client.GET("/global", {
    params: {
      query: {
        // @ts-expect-error pLevel added by plugin
        pLevel: 5,
      },
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch menu items", response);
    return null;
  }

  return data?.data || null;
}

async function getHeader(): Promise<HeaderType | null> {
  const global = await getGlobal();

  return global?.header || null;
}

async function getFooter(): Promise<FooterType | null> {
  const global = await getGlobal();
  return global?.footer || null;
}

export {
  getGlobal,
  getHeader,
  getFooter,
  type GlobalType,
  type HeaderType,
  type FooterType,
};
