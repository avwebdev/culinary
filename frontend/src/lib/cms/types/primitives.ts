export type LinkType = {
  href: string;
  label: string;
};

export type ButtonType = {
  theme: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size: "sm" | "md" | "lg" | "xl";
  link: LinkType;
};
