"use client";
import Layout from "@/components/layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-green-900 pt-3">
        {" "}
        Witaj, <b>{session?.user?.email}!</b>{" "}
      </div>
    </Layout>
  );
}
