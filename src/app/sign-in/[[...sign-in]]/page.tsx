import { SignIn } from "@clerk/nextjs";

export const instant = false;

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn />
    </div>
  );
}
