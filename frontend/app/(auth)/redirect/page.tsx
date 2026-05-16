"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkGmail, login } from "@/app/api/auth";
import { setCookie } from "@/app/lib/cookie";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      if (!session?.user?.email) return;

      const result = await checkGmail(session.user.email);

      if (result.exists) {
        const data = await login(session.user.email);
        setCookie(data.accessToken);
        router.push("/chatbot");
      } else {
        router.push("/register");
      }
    };

    if (status === "authenticated") {
      run();
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Checking account...
    </div>
  );
}
