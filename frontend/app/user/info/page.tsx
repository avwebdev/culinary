import { auth } from "@/lib/auth/auth";
import { Session } from "next-auth";

export default async function UserInfoPage() {
  // Guaranteed not null because middleware protects /user routes
  const session = await auth() as Session;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Information</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-2">
          <span className="font-semibold">Name:</span> {session.user?.name}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {session.user?.email}
        </p>
      </div>
    </div>
  );
}
