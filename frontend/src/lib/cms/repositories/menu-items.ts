import { client } from "../client";

import type { components } from "../types";

type MenuItemType = components["schemas"]["MenuItem"];

async function getMenuItems(): Promise<MenuItemType[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

async function getMenuItemsFromSchool(school: string): Promise<MenuItemType[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error, response } = await client.GET("/menu-items", {
    params: {
      query: {
        filters: {
          school: {
            name: {
              eq: school,
            }
          },
        },
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

export { getMenuItems, getMenuItemsFromSchool, type MenuItemType };
