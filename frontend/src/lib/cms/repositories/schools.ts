import { client } from "../client";

import type { components } from "../types";

type SchoolType = components["schemas"]["School"];

async function getSchools(): Promise<SchoolType[] | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error, response } = await client.GET("/schools", {
    params: {
      query: {
        populate: "*",
      },
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch schools", response);
    return null;
  }

  return data?.data || null;
}

export { getSchools, type SchoolType };
