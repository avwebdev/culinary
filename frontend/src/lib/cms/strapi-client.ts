import { strapi } from "@strapi/client";

const client = strapi({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api`,
  auth: process.env.NEXT_PUBLIC_STRAPI_TOKEN,
});

export function getMediaUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${path}`;
}

export default client;
