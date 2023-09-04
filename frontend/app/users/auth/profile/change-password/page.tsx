"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import { useUpdateUserPassword } from "@/lib/query/users";
import { useToast } from "@/components/ui/use-toast";

import * as z from "zod";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  repeatPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Page() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const {
    mutateAsync: updateUserPassword,
    isSuccess,
    isError,
  } = useUpdateUserPassword();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    if (data.password !== data.repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    // create form data
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    updateUserPassword(formData);

    setDialogOpen(false);
  }

  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Error updating password",
        description: "There was an error updating your password.",
        variant: "destructive",
      });
    } else if (isSuccess) {
      toast({
        title: "Password updated",
        description: "Your password has been updated.",
      });
      signOut();
    }
  }, [isError, isSuccess, toast]);

  React.useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session?.user?.email);
    }
  }, [form, session]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[500px] flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto bg-orange-500 hover:bg-orange-300">
              Update Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Password</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              Are you sure you want to update your password?
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="ml-auto bg-orange-500 hover:bg-orange-300"
              >
                Update Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
