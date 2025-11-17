import "server-only";

import qs from "qs";
import createClient from "openapi-fetch";

import type { paths } from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const client = createClient<paths>({
  baseUrl: `${STRAPI_URL}/api`,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  },
  querySerializer(params) {
    // console.log("querySerializer", params, qs.stringify(params));
    return qs.stringify(params, {
      encodeValuesOnly: true, // prettify URL
    });
  },
  fetch: (request) => {
    return fetch(request, {
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 40 },
    });
  },
});

export { client };
