"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "@icons-pack/react-simple-icons";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={async () => {
        setLoading(true);
        try {
          await signIn("google", { callbackUrl: "/" });
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      <SiGoogle className="mr-2" />
      {loading ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
