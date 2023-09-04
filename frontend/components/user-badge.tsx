"use client";

import React from "react";
import Link from "next/link";

import { LogOut, Key, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useSession } from "next-auth/react";
import { HOST_UPLOADS } from "@/types/environment-variables";

export function UserBadge() {
  const { data: session } = useSession();

  if (!session)
    return (
      <Button className="bg-blue-500 hover:bg-blue-700">
        <Link href={"/users/auth/signin"}>Sign In</Link>
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:bg-primary-foreground">
        <Button
          variant="outline"
          className="flex items-center h-auto gap-2 px-3 py-1 border-none outline-none focus:outline-none"
        >
          <Avatar>
            <AvatarImage
              src={`${HOST_UPLOADS}/${session?.user?.profileImage}`}
              alt="AA"
              width={40}
              height={40}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h5 className="hidden text-sm font-semibold md:block">{`${session?.user?.name}`}</h5>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href={"/users/auth/profile/update-profile"}
              className="flex gap-2"
            >
              <User size={16} />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href={"/users/auth/profile/change-password"}
              className="flex gap-2"
            >
              <Key size={16} />
              <span>Change Password</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Link href="/users/auth/signout" className="flex gap-2">
            <LogOut size={16} />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
