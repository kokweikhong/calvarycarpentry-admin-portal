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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Check,
  ChevronsUpDown,
  Paperclip,
  RefreshCw,
  XSquare,
} from "lucide-react";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InventoryProductValues } from "@/types/inventory-products";
import {
  InventoryIncomingValues,
  InventoryIncomingSchema,
} from "@/types/inventory-incoming";

import {
  useCreateIncoming,
  useDeleteIncoming,
  useUpdateIncoming,
} from "@/lib/query/inventory-incoming";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HOST_UPLOADS } from "@/types/environment-variables";

export interface IncomingFormProps {
  formType?: string;
  formData: InventoryIncomingValues;
  dataProducts: InventoryProductValues[];
  productId?: string;
}

export const IncomingForm: React.FC<IncomingFormProps> = ({
  formType = "create",
  formData,
  dataProducts,
  productId,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const { setToastMessage } = useToast();

  const formColor =
    formType === "create" ? "blue" : formType === "update" ? "orange" : "red";

  const statues = ["incoming", "in-stock", "returned", "clearance"];

  const createIncoming = useCreateIncoming();
  const updateIncoming = useUpdateIncoming();
  const deleteIncoming = useDeleteIncoming();

  const [standardUnit, setStandardUnit] = React.useState<string>(
    dataProducts.find((product) => product.id === parseInt(productId ?? ""))
      ?.standardUnit ?? "No Data, Please Select a Product."
  );

  const form = useForm<z.infer<typeof InventoryIncomingSchema>>({
    resolver: zodResolver(InventoryIncomingSchema),
    defaultValues: formData ?? {},
  });

  // handle user input and product id
  React.useEffect(() => {
    if (formType === "update") {
      formData.updatedBy = session?.user?.name ?? "";
    } else if (formType === "create") {
      formData.updatedBy = session?.user?.name ?? "";
      formData.createdBy = session?.user?.name ?? "";
      if (productId) {
        formData.productID = parseInt(productId);
        setStandardUnit(
          dataProducts.find((product) => product.id === parseInt(productId))
            ?.standardUnit ?? "No Data, Please Select a Product."
        );
      }
    }
    console.log(productId);
    form.reset(formData);
  }, [formData, form, formType, session?.user?.name, productId]);

  // handle form errors and success
  React.useEffect(() => {
    if (
      createIncoming.isError ||
      updateIncoming.isError ||
      deleteIncoming.isError
    ) {
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
            ? createIncoming.error
            : formType === "update"
            ? updateIncoming.error
            : deleteIncoming.error
        }`,
        type: "error",
      });
    }
    if (
      createIncoming.isSuccess ||
      updateIncoming.isSuccess ||
      deleteIncoming.isSuccess
    ) {
      setToastMessage({
        title: "Success",
        message: `${
          formType === "create"
            ? "creating"
            : formType === "update"
            ? "updating"
            : "deleting"
        } product ${
          formType === "create"
            ? createIncoming.data?.id
            : formType === "update"
            ? updateIncoming.data?.id
            : deleteIncoming.data?.id
        }`,
        type: "success",
      });
      router.push("/inventory/incoming");
    }
  }, [
    createIncoming.data?.id,
    createIncoming.error,
    createIncoming.isError,
    createIncoming.isSuccess,
    deleteIncoming.data?.id,
    deleteIncoming.error,
    deleteIncoming.isError,
    deleteIncoming.isSuccess,
    formType,
    router,
    setToastMessage,
    updateIncoming.data?.id,
    updateIncoming.error,
    updateIncoming.isError,
    updateIncoming.isSuccess,
  ]);

  // handle form submit
  const onSubmit: SubmitHandler<InventoryIncomingValues> = async (data) => {
    console.log(data);
    // Check if formType is delete
    if (formType === "delete") {
      // Delete product
      deleteIncoming.mutate(data.id);
      return;
    }

    // Create form data
    const formData = new FormData();

    // Use loop to append all data except productThumbnail
    // because it is a file type
    for (const key in data) {
      if (key !== "refDoc") {
        // @ts-ignore
        formData.append(key, data[key]);
      }
    }

    // Check if productThumbnail is not empty
    if (data.refDoc instanceof FileList) {
      formData.append("refDoc", data.refDoc[0]);
    } else if (formType === "update") {
      formData.append("refDoc", String(data.refDoc));
      console.log(String(data.refDoc));
    }

    if (formType === "update") {
      updateIncoming.mutate(formData);
    } else if (formType === "create") {
      createIncoming.mutate(formData);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="flex flex-col w-full space-y-8"
      >
        {/* Product id from inventory_products */}
        <FormField
          control={form.control}
          name="productID"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Product</FormLabel>
              <Popover>
                <PopoverTrigger
                  asChild
                  disabled={formType !== "create" && true}
                >
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {/* combine product name and code if found */}
                      {field.value
                        ? dataProducts.find(
                            (product) => product.id === field.value
                          )?.productName +
                          " (" +
                          dataProducts.find(
                            (product) => product.id === field.value
                          )?.productCode +
                          ")"
                        : "Select product"}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {dataProducts.map((product) => (
                        <CommandItem
                          value={`${product.id}`}
                          key={product.id}
                          onSelect={(value) => {
                            console.log(value);
                            form.setValue("productID", parseInt(value));
                            setStandardUnit(
                              dataProducts.find(
                                (product) => product.id === parseInt(value)
                              )?.standardUnit ??
                                "No Data, Please Select a Product."
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {`${product.productName} (${product.productCode})`}
                        </CommandItem>
                      )) ?? "No data"}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                You have selected product id : {form.watch().productID}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid items-center grid-cols-2 gap-2">
          {/* Status */}
          {/* TODO: Need to finalise the status items */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an incoming status..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statues.map((status) => (
                      <SelectItem
                        className="capitalize"
                        value={status}
                        key={status}
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("quantity", { valueAsNumber: true })}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid items-center grid-cols-4 gap-2">
          {/* Length */}
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("length", { valueAsNumber: true })}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Width */}
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("width", { valueAsNumber: true })}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thickness */}
          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thickness</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("thickness", { valueAsNumber: true })}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Reference No */}
          <FormField
            control={form.control}
            name="refNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ref No</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cost */}
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Per Standard Unit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          {/* Converted quantity */}
          <FormField
            control={form.control}
            name="convertedQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Converted Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...form.register("convertedQuantity", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormDescription>
                  Need to convert the quantity to standard unit
                  <br />
                  <span className="font-semibold text-black uppercase">
                    {standardUnit}
                    {/* {dataProducts.find(
                      (product) => product.id === form.getValues("productID")
                    )?.standardUnit ?? "No data, select a product first"} */}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 
        Reference Document
        Able to switch to input type to change file
      */}
        {typeof form.getValues("refDoc") === "string" &&
        String(form.getValues("refDoc")).length > 0 ? (
          <div className="mt-[32px]">
            <Link
              href={`${HOST_UPLOADS}/${form.getValues("refDoc")}`}
              className="flex items-center gap-2 text-blue-500 underline"
            >
              <Paperclip />
              <span className="font-medium">{form.getValues("refDoc")}</span>
            </Link>
            <Button
              variant={"outline"}
              className="flex items-center gap-2 px-0 border-none outline-none"
              onClick={() => form.setValue("refDoc", "")}
            >
              <XSquare />
              <span>Click To Change File.</span>
            </Button>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="refDoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ref Doc</FormLabel>
                <FormControl>
                  <Input type="file" {...form.register("refDoc")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-2">
          {/* Store Country */}
          <FormField
            control={form.control}
            name="storeCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country where to store inventory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Store Location */}
          <FormField
            control={form.control}
            name="storeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remarks */}
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

        {/* Confirmation with dialog */}
        <AlertDialog>
          <AlertDialogTrigger
            // TODO: Check the loading state to style button
            className={`flex gap-4 items-center justify-between uppercase ml-auto bg-${formColor}-500 text-white rounded-md px-4 py-2 font-medium hover:bg-${formColor}-600`}
            onClick={() => {
              form.clearErrors();
            }}
          >
            {createIncoming.isLoading ||
              updateIncoming.isLoading ||
              (deleteIncoming.isLoading && (
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
                    <span className="font-medium">
                      Please return to form to clear the errors as below
                    </span>
                    <br />
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
                      {JSON.stringify(form.watch(), null, 2)}
                    </code>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
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
