import { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import { CancelGoBack, SignOutButton } from "./signout-buttons";

export const metadata: Metadata = { title: "Sign out - PUSD Culinary Department" };

export default function SignOutPage() {
  return (
    <AuthCard
      title="Sign out"
      description="You're about to sign out of your account."
      footer={<CancelGoBack />}
    >
      <SignOutButton />
    </AuthCard>
  );
}
