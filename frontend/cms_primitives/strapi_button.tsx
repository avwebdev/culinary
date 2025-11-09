import { Button } from "@/components/ui/button";
import { ButtonType } from "@/lib/cms/types/primitives";

export default function StrapiButton({ theme, size, link }: ButtonType) {
  return (
    <Button
      size={size == "md" ? "default" : size}
      variant={theme == "primary" ? "default" : theme}
      asChild
    >
      <a href={link.href}>{link.label}</a>
    </Button>
  );
}
