import { client } from "../client";

import type { components } from "../types";

type PageType = components["schemas"]["Page"];

async function getPages(): Promise<PageType[] | null> {
  const { data, error, response } = await client.GET("/pages", {
    params: {
      query: {
        // @ts-expect-error pLevel added by plugin
        pLevel: 10,
      },
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch pages", response);
    return null;
  }

  return data?.data || null;
}

async function getPageByPath(path: string): Promise<PageType | null> {
  const { data, error, response } = await client.GET("/pages", {
    params: {
      query: {
        filters: {
          path: path,
        },
        pLevel: 4,
      },
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch page by path", response);
    return null;
  }
  return data?.data?.[0] || null;
}

export { getPages, getPageByPath, type PageType };
