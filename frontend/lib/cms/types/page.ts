import { FileResponse } from "@strapi/client";
import { LinkType } from "./primitives";

export type HeaderType = {
  logo: FileResponse;
  logoText: LinkType;
  navItems: LinkType[];
};
