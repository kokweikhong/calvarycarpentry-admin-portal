"use client";

import React from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  InventoryProductSchema,
  InventoryProductValues,
} from "@/types/inventory-products";
import { InventoryProductEmptyData } from "@/lib/empty-data";

import {
  useDeleteProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/lib/query/inventory-products";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { Paperclip, XSquare, RefreshCw } from "lucide-react";

import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast";
import { useSession } from "next-auth/react";
import { HOST_UPLOADS } from "@/types/environment-variables";

// TODO: Need to finalize the standard units
const standardUnits = [
  { value: "sqft", label: "Square Feet" },
  { value: "sqm", label: "Square Meter" },
  { value: "kg", label: "Kilogram" },
  { value: "g", label: "Gram" },
  { value: "l", label: "Liter" },
  { value: "pcs", label: "Pieces" },
];

export type ProductFormProps = {
  formType: string;
  formData: InventoryProductValues | undefined;
};

export const ProductForm: React.FC<ProductFormProps> = ({
  formType,
  formData = InventoryProductEmptyData,
}) => {
  const { data: session } = useSession();

  // TODO: Need to add loading and error state
  const {
    mutate: createProduct,
    isError: isErrorCreate,
    isSuccess: successCreate,
    isLoading: loadingCreate,
    error: errorCreate,
  } = useCreateProduct();
  const {
    mutate: updateProduct,
    isError: isErrorUpdate,
    isSuccess: successUpdate,
    isLoading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateProduct();
  const {
    mutate: deleteProduct,
    isError: isErrorDelete,
    isSuccess: successDelete,
    isLoading: loadingDelete,
    error: errorDelete,
  } = useDeleteProduct();
  const router = useRouter();
  const formColor =
    formType === "create" ? "blue" : formType === "update" ? "orange" : "red";

  const { setToastMessage } = useToast();

  const form = useForm<z.infer<typeof InventoryProductSchema>>({
    resolver: zodResolver(InventoryProductSchema),
    defaultValues: formData,
  });

  // Handle error and success state
  React.useEffect(() => {
    if (isErrorCreate || isErrorUpdate || isErrorDelete) {
      setToastMessage({
        title: "Error",
        message: `error ${
          formType === "create"
            ? "creating"
            : formType === "update"
            ? "updating"
            : "deleting"
        } product: ${
          formType === "create"
            ? errorCreate
            : formType === "update"
            ? errorUpdate
            : errorDelete
        }`,
        type: "error",
      });
    }
    if (successCreate || successUpdate || successDelete) {
      setToastMessage({
        title: "Success",
        message: `Successfully ${
          formType === "create"
            ? "created"
            : formType === "update"
            ? "updated"
            : "deleted"
        } product: ${form.getValues("productName")}`,
        type: "success",
      });
      router.push("/inventory/products");
    }
  }, [
    errorCreate,
    errorDelete,
    errorUpdate,
    form,
    formType,
    isErrorCreate,
    isErrorDelete,
    isErrorUpdate,
    router,
    setToastMessage,
    successCreate,
    successDelete,
    successUpdate,
  ]);

  React.useEffect(() => {
    if (formType === "update") {
      formData.updatedBy = session?.user?.name ?? "";
    } else if (formType === "create") {
      formData.updatedBy = session?.user?.name ?? "";
      formData.createdBy = session?.user?.name ?? "";
    }
    form.reset(formData);
  }, [formData, form, formType, session?.user?.name]);

  const onSubmit: SubmitHandler<InventoryProductValues> = async (data) => {
    if (formType === "delete") {
      deleteProduct(data.id);
    }

    // Create form data
    const formData = new FormData();

    // Use loop to append all data except productThumbnail
    // because it is a file type
    for (const key in data) {
      if (key !== "productThumbnail") {
        // @ts-ignore
        formData.append(key, data[key]);
      }
    }

    // Check if productThumbnail is not empty
    // Check productThumbnail type is array or not
    if (data.productThumbnail instanceof FileList) {
      formData.append("productThumbnail", data.productThumbnail[0]);
    } else if (formType === "update") {
      formData.append("productThumbnail", String(data.productThumbnail));
    }

    if (formType === "update") {
      updateProduct(formData);
    } else {
      createProduct(formData);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="flex flex-col w-full space-y-8"
      >
        <div className="flex gap-2">
          {/* Product code */}
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product name */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          {/* Product brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product supplier */}
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product standard unit */}
        <FormField
          control={form.control}
          name="standardUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard Unit</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a standard unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {standardUnits.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                This is to initialize the unit of product to fix the incoming
                and outgoing converted quantity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 
        Product Thumbnail
        Able to switch to input type to change file
      */}
        {typeof form.getValues("productThumbnail") === "string" &&
        String(form.getValues("productThumbnail")).length > 0 ? (
          <div className="mt-[32px]">
            <Link
              href={`${HOST_UPLOADS}/${form.getValues("productThumbnail")}`}
              className="flex items-center gap-2 text-blue-500 underline"
            >
              <Paperclip />
              <span className="font-medium">
                {form.getValues("productThumbnail")}
              </span>
            </Link>
            <Button
              variant={"outline"}
              className="flex items-center gap-2 px-0 border-none outline-none"
              onClick={() => form.setValue("productThumbnail", "")}
            >
              <XSquare />
              <span>Click To Change File.</span>
            </Button>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="productThumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input type="file" {...form.register("productThumbnail")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Product remarks */}
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product still exists or not */}
        <FormField
          control={form.control}
          name="isExist"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Is Product Exists?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                This is the identify the product still using by company or not.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <AlertDialog>
          <AlertDialogTrigger
            // TODO: Check the loading state to style button
            className={`flex gap-4 items-center justify-between uppercase ml-auto bg-${formColor}-500 text-white rounded-md px-4 py-2 font-medium hover:bg-${formColor}-600`}
          >
            {loadingCreate ||
              loadingUpdate ||
              (loadingDelete && <RefreshCw className="animate-spin" />)}
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
                  <div className="w-full px-4 py-3 font-mono text-sm border rounded-md">
                    <code className="w-[350px] whitespace-pre-line">
                      {JSON.stringify(form.getValues(), null, 2)}
                    </code>
                  </div>
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
  );
};
