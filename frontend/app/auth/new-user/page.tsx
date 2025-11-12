import { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Welcome - PUSD Culinary Departments",
};

export default function NewUserPage() {
  return (
    <AuthCard
      title="You're all set!"
      description="Your account has been created. Take a quick tour or jump right in."
      footer={
        <Link className="underline text-sm" href="/">
          Skip tour
        </Link>
      }
    >
      <div className="flex items-center gap-3">
        <Link href="/onboarding">
          <Button>Start onboarding</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary">Go to app</Button>
        </Link>
      </div>
    </AuthCard>
  );
}
