"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { UserValues } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table/data-table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useGetUsers } from "@/lib/query/users";
import { DataNotFound } from "@/components/data-not-found";
import { HOST_UPLOADS } from "@/types/environment-variables";
import { useSession } from "next-auth/react";

export default function Page() {
  const {
    data: dataUsers,
    error: errorUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();

  const { data: session } = useSession();

  const columns = React.useMemo<ColumnDef<UserValues>[]>(
    () => [
      {
        id: "editUser",
        header: () => null,
        cell: ({ cell }) => (
          <Link href={`/users/form/update?id=${cell?.row?.original?.id}`}>
            <Edit size={20} className="cursor-pointer hover:text-blue-500" />
          </Link>
        ),
      },
      {
        id: "deleteUser",
        header: () => null,
        cell: ({ cell }) => (
          <Link href={`/users/form/delete?id=${cell?.row?.original?.id}`}>
            <Trash2 size={20} className="cursor-pointer hover:text-red-500" />
          </Link>
          // <ProductFormDialog formType="delete" data={cell?.row?.original} />
        ),
      },
      {
        header: "Profile Image",
        accessorKey: "profileImage",
        cell: ({ cell }) => (
          <div>
            <Image
              src={`${HOST_UPLOADS}/${cell?.row?.original?.profileImage}`}
              alt="profile image"
              width={50}
              height={50}
              className="rounded-full max-h-[50px] max-w-[50px] object-cover"
            />
          </div>
        ),
        footer: "Profile Image",
      },
      {
        header: "Name",
        accessorKey: "username",
        footer: "Name",
      },
      {
        header: "Department",
        accessorKey: "department",
        footer: "Department",
      },
      {
        header: "Role",
        accessorKey: "role",
        footer: "Role",
      },
      {
        header: "Email",
        accessorKey: "email",
        footer: "Email",
      },
      {
        header: "IsExist",
        accessorKey: "isExist",
        footer: "IsExist",
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ cell }) => (
          <span>{`${new Date(String(cell.getValue())).toDateString()}`}</span>
        ),
        footer: "Created At",
      },
    ],
    []
  );

  if (isLoadingUsers) return <div>Loading...</div>;
  if (errorUsers) return <div>{`${errorUsers}`}</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="tracking-wider">Users Page</h1>
        <Link
          href={"users/form/create"}
          className="px-4 py-2 font-medium text-center uppercase rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
        >
          Create New User
        </Link>
      </div>
      <Separator className="my-4" />
      {session?.user?.role === "superadmin" ? (
        <div>
          {!dataUsers ? (
            <DataNotFound />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Users Table</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={dataUsers} />
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div>This is Proctected Page.</div>
      )}
    </div>
  );
}
