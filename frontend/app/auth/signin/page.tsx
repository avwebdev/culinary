import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth-card";
import { GoogleSignInButton } from "@/app/auth/signin/google-sign-in-button";

export const metadata: Metadata = { title: "Sign in - PUSD Culinary Department" };

function SignInInner({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  return (
    <AuthCard
      title="Sign In"
      description="Sign in with your Google account to continue."
      footer={
        <p className="text-sm text-muted-foreground">
          Having trouble?{" "}
          <Link className="underline" href="/auth/error">
            Get help
          </Link>
        </p>
      }
    >
      <div className="space-y-4 flex flex-col">
        {searchParams?.error ? (
          <div className="text-sm rounded-md border p-3 bg-destructive/10 border-destructive text-center">
            <p className="font-medium">
              We couldn&lsquo;t sign you in. Please try again.
            </p>
            <p className="text-muted-foreground">
              Reason: {String(searchParams?.error)}
            </p>
          </div>
        ) : null}
        <GoogleSignInButton />
      </div>
    </AuthCard>
  );
}

export default function SignInPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  return (
    <Suspense>
      <SignInInner searchParams={searchParams} />
    </Suspense>
  );
}
