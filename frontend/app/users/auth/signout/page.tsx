"use client";

import React from "react";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>You are not signed in.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">You are already signed in.</h1>
      <Button
        className="bg-red-500 hover:bg-red-700"
        onClick={() =>
          signOut({
            redirect: true,
            callbackUrl: "/users/auth/signin",
          })
        }
      >
        Sign out
      </Button>
    </div>
  );
}
