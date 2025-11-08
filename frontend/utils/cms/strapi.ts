import { strapi } from "@strapi/client";

const client = strapi({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api"}`,
  auth: process.env.NEXT_PUBLIC_API_TOKEN,
});

export default client;
