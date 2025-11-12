import "server-only";
import { strapi } from "@strapi/client";

export function serverStrapi() {
  return strapi({
    baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api`,
    auth: process.env.STRAPI_WRITE_TOKEN,
  });
}
