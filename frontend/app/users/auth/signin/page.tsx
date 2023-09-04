"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

const AuthUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthUserValues = z.infer<typeof AuthUserSchema>;

// get search params from url

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session } = useSession();
  const callbackUrl = searchParams.callbackUrl;

  console.log(callbackUrl);

  console.log(session);
  const form = useForm<AuthUserValues>({
    resolver: zodResolver(AuthUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<AuthUserValues> = async (data) => {
    console.log(data);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: (callbackUrl as string) ?? "/",
    });
  };

  if (session) {
    return (
      <div className="flex flex-col gap-4 mx-auto items-center justify-center">
        <h1 className="text-2xl font-bold">You are already signed in.</h1>
        {callbackUrl?.includes("users/form") && (
          <p>
            Only
            <strong className="uppercase text-red-500"> Super admin </strong>
            allowed to access to{" "}
            <span className="text-blue-500 underline">{callbackUrl}</span>.
          </p>
        )}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="max-w-[450px] space-y-8 flex flex-col"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Button to toggle confirmation modal */}
        <Button type="submit" className={`uppercase ml-auto bg-blue-500`}>
          Sign In
        </Button>
      </form>
    </Form>
  );
}
