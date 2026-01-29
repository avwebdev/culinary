import { Button } from "@/components/ui/button";
import { components } from "@/lib/cms/types";

type ButtonType = components["schemas"]["PrimitivesButtonComponent"];

export default function StrapiButton({ theme, size, link }: ButtonType) {
  return (
    <Button
      size={size == "md" ? "default" : size}
      variant={theme == "primary" ? "default" : theme}
      asChild
    >
      <a href={link?.href || ""}>{link?.label || ""}</a>
    </Button>
  );
}
