"use client"

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function Page() {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  return (
    <div className="w-[400px] mx-auto">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
      <Link
        href={"/users/auth/signin"}
        className="underline inline-block w-full text-center mt-4 text-primary hover:text-primary/70"
      >
        <h4>
          Return to sign in
        </h4>
      </Link>
    </div>
  )
}
