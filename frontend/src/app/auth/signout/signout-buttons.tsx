"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { Button as Button2 } from "@/components/ui/button";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Button2
        variant="destructive"
        onClick={async () => {
          setLoading(true);
          try {
            await signOut({ callbackUrl: "/" });
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        {loading ? "Signing out…" : "Sign out"}
      </Button2>
    </div>
  );
}

export function CancelGoBack() {
  return (
    <p className="text-sm text-muted-foreground">
      Changed your mind?{" "}
      <Link className="underline" href="/">
        Go back
      </Link>
    </p>
  );
}
