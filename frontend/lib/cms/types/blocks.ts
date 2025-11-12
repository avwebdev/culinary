import { FileListResponse } from "@strapi/client";
import { ButtonType } from "./primitives";

export type BaseBlockType = {
  __component: string;
  id: number;
};

export type Block404Type = {
  title: string;
  message: string;
} & BaseBlockType;

export type BlockHeroType = {
  size: "small" | "large";
  title: string;
  subtitle?: string;
  buttons: ButtonType[];
  background: FileListResponse;
} & BaseBlockType;

export type BlockContactType = {
  title: string;
  subtitle?: string;
  schools: Array<{
    name: string;
    teacher?: string;
    email?: string;
    phone?: string;
    instagram?: string;
  }>;
} & BaseBlockType;
