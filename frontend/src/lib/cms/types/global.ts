import { HeaderType } from "./page";

export type FooterColumnLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links?: FooterColumnLink[];
  content?: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type FooterType = {
  companyName?: string;
  description?: string;
  columns?: FooterColumn[];
  copyright?: string;
  socialLinks?: SocialLink[];
};

export type GlobalType = {
  header: HeaderType;
  footer?: FooterType;
};
