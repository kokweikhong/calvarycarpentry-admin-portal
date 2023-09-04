"use client";

import React from "react";
import { UserValues, UserSchema } from "@/types/user";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Paperclip, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import * as zod from "zod";

import { HOST_UPLOADS } from "@/types/environment-variables";

import { useUpdateProfile } from "@/lib/query/users";

// TODO: create the zod type for user
// TODO: get the user data from the server
// TODO: create the form for the user
// TODO: toasts for form submission

const ProfileUpdateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  profileImage: z
    .string()
    .min(2, { message: "Profile image is required." })
    .or(
      z.any().refine((file) => file.length === 1, {
        message: "Profile image is required.",
      })
    ),
});

type ProfileUpdateFormValues = z.infer<typeof ProfileUpdateSchema>;

export default function Page() {
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { data: session } = useSession();
  console.log(session);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      username: session?.user?.name ?? "",
      email: session?.user?.email,
      profileImage: session?.user?.profileImage,
    },
  });

  function onSubmit(data: ProfileUpdateFormValues) {
    console.log(data);

    // generate from form data
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);

    // if the profile image is a string, then it is not changed
    // if the profile image is a file, then it is changed
    if (typeof data.profileImage === "string") {
      formData.append("profileImage", data.profileImage);
    } else {
      formData.append("profileImage", data.profileImage[0]);
    }

    // update the profile
    updateProfile(formData);
    // setDialogOpen(false);
  }

  return (
    <div className="max-w-[450px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <div className="mx-auto">
            <Avatar className="w-[250px] h-[250px]">
              <AvatarImage
                src={`${HOST_UPLOADS}/${session?.user?.profileImage}`}
                alt="profile image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-[500px] flex flex-col gap-4"
            >
              {/* 
            Profile image
            Able to switch to input type to change file
          */}
              {typeof form.getValues("profileImage") === "string" &&
              String(form.getValues("profileImage")).length > 0 ? (
                <div className="mt-[32px]">
                  <Link
                    href={`http://localhost:8000/uploads/inventory/products/${form.getValues(
                      "profileImage"
                    )}`}
                    className="flex items-center gap-2 text-blue-500 underline"
                  >
                    <Paperclip />
                    <span className="font-medium">
                      {form.getValues("profileImage")}
                    </span>
                  </Link>
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-2 px-0 border-none outline-none"
                    onClick={() => form.setValue("profileImage", "")}
                  >
                    <XSquare />
                    <span>Click To Change File.</span>
                  </Button>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <Input type="file" {...form.register("profileImage")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-auto">Update Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    Are you sure you want to update your profile?
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={form.handleSubmit(onSubmit)}
                      className="ml-auto"
                    >
                      Update Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
