"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { SubmitHandler, set, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Paperclip, RefreshCw, XSquare, ArrowLeft } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { UserSchema, UserValues } from "@/types/user";
import { UserEmptyData } from "@/lib/empty-data";

import {
  useGetUserById,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/lib/query/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { LoadingSkeleton } from "@/components/loading-skeleton";
import { HOST_UPLOADS } from "@/types/environment-variables";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const formType = params.slug;

  const formColor =
    formType === "create" ? "blue" : formType === "update" ? "orange" : "red";

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const {
    data: dataUser,
    isError: isErrorUser,
    error: errorUser,
    isLoading: isLoadingUser,
  } = useGetUserById(searchParams.id as string);

  const [isCreateSecret, setIsCreateSecret] = React.useState(true);
  const [createSecret, setCreateSecret] = React.useState("");

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: dataUser ?? UserEmptyData,
  });

  React.useEffect(() => {
    if (formType === "create") {
      setIsCreateSecret(false);
    }
  }, [formType]);

  React.useEffect(() => {
    if (dataUser) {
      form.reset(dataUser);
      console.log(dataUser.updatedAt, dataUser.createdAt);
      console.log(dataUser.role);
    }
  }, [dataUser, form]);

  React.useEffect(() => {
    if (createUser.isSuccess || updateUser.isSuccess || deleteUser.isSuccess) {
      router.push("/users");
    }
  }, [
    createUser.isSuccess,
    updateUser.isSuccess,
    deleteUser.isSuccess,
    router,
  ]);

  // roles and departments
  const roles = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
    { label: "Super Admin", value: "superadmin" },
  ];
  const departments = [
    { label: "HQ", value: "hq" },
    { label: "Sales", value: "sales" },
    { label: "Operation", value: "operation" },
  ];

  // handle create secret
  async function handleCreateSecret() {
    const res = await fetch("/api/user-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secret: createSecret }),
    });
    const data = await res.json();
    if (data) setCreateSecret("");
    setIsCreateSecret(data);
  }

  // handle user form submit
  const onSubmit: SubmitHandler<UserValues> = async (data) => {
    if (formType === "delete") {
      deleteUser.mutate(String(data.id));
      return;
    }

    if (formType === "create") {
      data.createdAt = new Date();
    }

    // Create form data
    const formData = new FormData();

    // Use loop to append all data except profileImage
    // because it is a file type
    for (const key in data) {
      if (key !== "profileImage") {
        // @ts-ignore
        formData.append(key, data[key]);
      }
    }

    // Check if profileImage is not empty
    // then append it to formData
    if (data.profileImage instanceof FileList) {
      formData.append("profileImage", data.profileImage[0]);
    } else if (formType === "update") {
      formData.append("profileImage", String(data.profileImage));
      console.log(String(data.profileImage));
    }

    if (formType === "update") {
      updateUser.mutate(formData);
    } else {
      createUser.mutate(formData);
    }
  };

  if (
    isLoadingUser ||
    createUser.isLoading ||
    updateUser.isLoading ||
    deleteUser.isLoading
  )
    return <LoadingSkeleton />;

  if (
    (!searchParams.id && isErrorUser) ||
    createUser.isError ||
    updateUser.isError ||
    deleteUser.isError
  )
    return <div>{`${createUser.error}`}</div>;

  if (
    (formType === "delete" && !dataUser) ||
    (formType === "update" && !dataUser)
  )
    return <div>{`Data not found`}</div>;

  return (
    <React.Fragment>
      <h2 className="tracking-wide">
        User{" "}
        <span className={`uppercase text-${formColor}-500`}>{formType}</span>{" "}
        Form
      </h2>
      <Separator className="my-4" />

      {/* user secret for create user, easy to control for initial state */}
      <Dialog open={!isCreateSecret}>
        <DialogContent className="sm:max-w-[425px]">
          <Link href={"/"} className="absolute top-4 left-4">
            <ArrowLeft size={24} />
          </Link>
          <DialogHeader className="pt-7">
            <DialogTitle className="pt-4">Create User Secret</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <span>{`Need to input secret to continue create user.`}</span>
              <span className="italic text-red-700">
                {!isCreateSecret && "Please enter a valid secret."}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start justify-center gap-4">
            <Label htmlFor="name" className="text-right">
              Secret
            </Label>
            <Input
              id="name"
              value={createSecret}
              onChange={(e) => setCreateSecret(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCreateSecret}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="max-w-[450px] space-y-8 flex flex-col"
        >
          {/* Name */}
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
          {formType === "create" && (
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
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role for user..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage email addresses in your{" "}
                    <Link href="/examples/forms">email settings</Link>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department for user..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem
                          key={department.value}
                          value={department.value}
                        >
                          {department.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage email addresses in your{" "}
                    <Link href="/examples/forms">email settings</Link>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 
            Profile image
            Able to switch to input type to change file
          */}
          {typeof form.getValues("profileImage") === "string" &&
          String(form.getValues("profileImage")).length > 0 ? (
            <div className="mt-[32px]">
              <Link
                href={`${HOST_UPLOADS}/${form.getValues("profileImage")}`}
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
                  <FormLabel>Ref Doc</FormLabel>
                  <FormControl>
                    <Input type="file" {...form.register("profileImage")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* User still exists or not */}
          <FormField
            control={form.control}
            name="isExist"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Is User Exists?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  This is the identify the user still using by company or not.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirmation with dialog */}
          <AlertDialog>
            <AlertDialogTrigger
              // TODO: Check the loading state to style button
              className={`flex gap-4 items-center justify-between uppercase ml-auto bg-${formColor}-500 text-white rounded-md px-4 py-2 font-medium hover:bg-${formColor}-600`}
            >
              {createUser.isLoading ||
                updateUser.isLoading ||
                (deleteUser.isLoading && (
                  <RefreshCw className="animate-spin" />
                ))}
              <span>{formType}</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {/* Show form erros if exists */}
                  {Object.keys(form.formState.errors).length > 0 ? (
                    <div className="w-full px-4 py-3 font-mono text-sm border rounded-md">
                      <p className="font-medium">
                        Please return to form to clear the errors as below
                      </p>
                      {Object.keys(form.formState.errors).map((key) => (
                        <span
                          key={key}
                          className="font-medium text-red-500 whitespace-pre-line"
                        >
                          {/* @ts-ignore */}
                          {key}: {form.formState.errors[key]?.message}
                          <br />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <pre className="w-full px-4 py-3 font-mono text-sm border rounded-md">
                      <code className="w-[350px] whitespace-pre-line">
                        {JSON.stringify(form.getValues(), null, 2)}
                      </code>
                    </pre>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    form.handleSubmit(onSubmit)();
                  }}
                  className={`uppercase bg-${formColor}-500 text-white rounded-md px-4 py-2 font-medium hover:bg-${formColor}-600`}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </React.Fragment>
  );
}
