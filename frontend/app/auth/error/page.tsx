import { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import Link from "next/link";

export const metadata: Metadata = { title: "Authentication error - PUSD Culinary Department" };

const ERROR_MAP: Record<string, string> = {
  Configuration: "The authentication system isn't configured correctly.",
  AccessDenied: "You don't have access to sign in.",
  Verification: "The link is invalid or has expired.",
  OAuthSignin: "There was a problem starting Google sign-in.",
  OAuthCallback: "Google sign-in was canceled or failed.",
  OAuthCreateAccount: "We couldn't create your account.",
  EmailCreateAccount: "We couldn't create your account.",
  Callback: "A callback handler failed.",
  OAuthAccountNotLinked: "This email is linked to a different provider.",
  AccountNotLinked: "This email is linked to a different provider.",
  SessionRequired: "Please sign in to view this page.",
  Default: "Something went wrong.",
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const code = String(searchParams?.error ?? "Default");
  const message = ERROR_MAP[code] ?? ERROR_MAP.Default;

  return (
    <AuthCard
      title="Authentication error"
      description={message}
      footer={
        <Link className="underline text-sm" href="/auth/signin">
          Back to sign in
        </Link>
      }
    >
      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          Error code:{" "}
          <span className="font-mono text-foreground/90">{code}</span>
        </p>
      </div>
    </AuthCard>
  );
}
