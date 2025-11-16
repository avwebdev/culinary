import { client } from "../client";

import type { components } from "../types";

type MenuItemType = components["schemas"]["MenuItem"];

async function getMenuItems(): Promise<MenuItemType[] | null> {
  const { data, error, response } = await client.GET("/menu-items", {
    params: {
      query: {
        populate: "*",
      },
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch menu items", response);
    return null;
  }

  return data?.data || null;
}

export { getMenuItems, type MenuItemType };
