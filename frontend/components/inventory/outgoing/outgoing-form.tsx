"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  Paperclip,
  RefreshCw,
  XSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  InventoryOutgoingSchema,
  InventoryOutgoingValues,
} from "@/types/inventory-outgoing";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetIncomingSummary } from "@/lib/query/inventory-incoming";
import { InventoryIncomingSummaryValues } from "@/types/inventory-incoming";
import Link from "next/link";
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
  useCreateOutgoing,
  useDeleteOutgoing,
  useUpdateOutgoing,
} from "@/lib/query/inventory-outgoing";

import { useToast } from "@/context/toast";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { DataNotFound } from "@/components/data-not-found";
import { HOST_UPLOADS } from "@/types/environment-variables";

export interface OutgoingFormProps {
  formType: string;
  formData: InventoryOutgoingValues;
  incomingIdParam: string | undefined;
}

export const OutgoingForm: React.FC<OutgoingFormProps> = ({
  formType,
  formData,
  incomingIdParam,
}) => {
  const formColor =
    formType === "create" ? "blue" : formType === "update" ? "orange" : "red";

  const statues: string[] = ["collected", "reserved"];

  const createOutgoing = useCreateOutgoing();
  const updateOutgoing = useUpdateOutgoing();
  const deleteOutgoing = useDeleteOutgoing();
  const getIncomingSummary = useGetIncomingSummary(
    formType === "create" ? "1" : "-9999"
  );

  const { data: session } = useSession();

  const { setToastMessage } = useToast();

  const router = useRouter();

  const [openProductPopover, setOpenProductPopover] =
    React.useState<boolean>(false);

  const [productId, setProductId] = React.useState<number>(-1);

  const [availableProducts, setAvailableProducts] = React.useState<
    InventoryIncomingSummaryValues[]
  >([]);

  const [incomingId, setIncomingId] = React.useState<string>("");

  const [incomingSummaryData, setIncomingSummaryData] =
    React.useState<InventoryIncomingSummaryValues | null>(null);

  const form = useForm<z.infer<typeof InventoryOutgoingSchema>>({
    resolver: zodResolver(InventoryOutgoingSchema),
    defaultValues: formData,
  });

  const onSubmit: SubmitHandler<InventoryOutgoingValues> = async (data) => {
    console.log(data);
    if (formType === "delete") {
      deleteOutgoing.mutate(String(data.id));
      return;
    }

    // Create form data
    const formData = new FormData();

    // Use loop to append all data except refDoc
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
    }

    if (formType === "update") {
      updateOutgoing.mutate(formData);
      return;
    } else {
      createOutgoing.mutate(formData);
      return;
    }
  };

  React.useEffect(() => {
    if (formType === "update") {
      formData.updatedBy = session?.user?.name ?? "";
    } else if (formType === "create") {
      formData.updatedBy = session?.user?.name ?? "";
      formData.createdBy = session?.user?.name ?? "";
    }
    form.reset(formData);
  }, [formData, form, formType, session?.user?.name, productId]);

  // handle incoming id change and outgoing data change
  React.useEffect(() => {
    if (formType === "update" || formType === "delete") {
      setIncomingId(String(formData.incomingID));
    } else if (incomingIdParam) {
      setIncomingId(incomingIdParam ?? "");
      console.log(incomingIdParam);
      form.setValue("incomingID", parseInt(incomingIdParam ?? ""));
    }
    if (getIncomingSummary.data) {
      console.log(form.watch().incomingID, incomingId);
      if (getIncomingSummary.data) {
        const incomingSummaryData = getIncomingSummary.data?.find(
          (incoming) =>
            incoming.id === parseInt(incomingId as string) ??
            form.watch("incomingID")
        );
        setIncomingSummaryData(incomingSummaryData ?? null);
        console.log(incomingSummaryData);
        setProductId(incomingSummaryData?.productID ?? -1);
      }

      const products = Array.from(
        getIncomingSummary.data
          .reduce(
            (
              uniqueMap: Map<string, InventoryIncomingSummaryValues>,
              product: InventoryIncomingSummaryValues
            ) => {
              uniqueMap.set(String(product.productID), product);
              return uniqueMap;
            },
            new Map<string, InventoryIncomingSummaryValues>()
          )
          .values()
      );
      setAvailableProducts(products);
    }
  }, [
    getIncomingSummary.data,
    formType,
    form,
    incomingSummaryData,
    incomingId,
    formData,
  ]);

  React.useEffect(() => {
    if (
      createOutgoing.isError ||
      updateOutgoing.isError ||
      deleteOutgoing.isError
    ) {
      setToastMessage({
        title: "Error",
        message: `error ${formType === "create"
          ? "creating"
          : formType === "update"
            ? "updating"
            : "deleting"
          } outgoing: ${createOutgoing.error ?? updateOutgoing.error ?? deleteOutgoing.error
          }`,
        type: "error",
      });
    }
    if (
      createOutgoing.isSuccess ||
      updateOutgoing.isSuccess ||
      deleteOutgoing.isSuccess
    ) {
      setToastMessage({
        title: "Success",
        message: `${formType === "create"
          ? "Creating"
          : formType === "update"
            ? "Updating"
            : "Deleting"
          } outgoing successfully`,
        type: "success",
      });
      router.push("/inventory/outgoing");
    }
  }, [
    createOutgoing.isError,
    updateOutgoing.isError,
    deleteOutgoing.isError,
    createOutgoing.error,
    updateOutgoing.error,
    deleteOutgoing.error,
    createOutgoing.isSuccess,
    updateOutgoing.isSuccess,
    deleteOutgoing.isSuccess,
    formType,
    setToastMessage,
    router,
  ]);

  if (!getIncomingSummary.data) return <DataNotFound />;

  return (
    <React.Fragment>
      {formType === "create" ? (
        <div className="flex flex-col gap-1">
          <Label>Product</Label>
          <Popover
            open={openProductPopover}
            onOpenChange={setOpenProductPopover}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProductPopover}
                className="justify-between w-full"
              >
                {productId > -1
                  ? availableProducts.find(
                    (item) => item.productID === productId
                  )?.productName
                  : "Select product..."}
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {availableProducts.map((product) => (
                    <CommandItem
                      key={product.productID}
                      value={`${product.productID}`}
                      onSelect={(value) => {
                        setProductId(
                          (parseInt(value) as number) === (productId as number)
                            ? -1
                            : parseInt(value)
                        );
                        setOpenProductPopover(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          productId === product.productID
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {`${product.productCode} - ${product.productName}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div>
          <Label>Product</Label>
          <Input
            disabled
            value={
              incomingSummaryData?.productCode +
              " - " +
              incomingSummaryData?.productName
            }
          />
        </div>
      )}

      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="flex flex-col space-y-8"
        >
          {/* Incoming id */}
          <FormField
            control={form.control}
            name="incomingID"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Available Stock From Incoming Record</FormLabel>
                <FormControl>
                  {formType === "create" ? (
                    <RadioGroup
                      onValueChange={(e) => {
                        setIncomingId(e);
                        field.onChange(parseInt(e));
                      }}
                      defaultValue={String(field.value)}
                      value={String(field.value)}
                      className="flex flex-col space-y-1"
                    >
                      {getIncomingSummary.data?.map(
                        (incoming) =>
                          // incoming.availableQuantity > 0 &&
                          incoming.productID === productId && (
                            <FormItem
                              key={incoming.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={`${incoming.id}`} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {incoming.productName} ({incoming.productCode})
                                - {incoming.quantity} {incoming.unit} -{" "}
                                {incoming.availableQuantity}{" "}
                                {incoming.standardUnit}
                              </FormLabel>
                            </FormItem>
                          )
                      )}
                    </RadioGroup>
                  ) : (
                    <RadioGroup className="flex flex-col space-y-1">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value={`${incomingSummaryData?.id}`}
                            disabled
                            checked
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {incomingSummaryData?.productName} (
                          {incomingSummaryData?.productCode}) -{" "}
                          {incomingSummaryData?.quantity}{" "}
                          {incomingSummaryData?.unit} -{" "}
                          {incomingSummaryData?.availableQuantity}{" "}
                          {incomingSummaryData?.standardUnit}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  )}
                </FormControl>
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
                    type="number"
                    step={0.01}
                    max={incomingSummaryData?.availableQuantity}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  Quantity is based on incoming records.
                  <br />
                  {incomingSummaryData &&
                    `L: ${incomingSummaryData?.length} ${incomingSummaryData?.unit} x 
                    W: ${incomingSummaryData?.width} ${incomingSummaryData?.unit} 
                    x T: ${incomingSummaryData?.thickness} ${incomingSummaryData?.unit}`}
                  <br />
                  <span className="font-semibold text-blue-900">
                    {`Availabel Qty: ${incomingSummaryData?.availableQuantity
                      }` ?? "Not Available"}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Converted Quantity */}
          <FormField
            control={form.control}
            name="convertedQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Converted Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    max={incomingSummaryData?.availableConvertedQuantity}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value))
                      form.setValue(
                        "cost",
                        parseFloat(e.target.value) * parseFloat(incomingSummaryData?.cost.toString() ?? "0")
                      )
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription>
                  {`Converted quantity is based on product's unit.`}
                  <br />
                  <span className="font-medium text-blue-900">
                    {
                      `Available Converted Qty: ${incomingSummaryData?.availableConvertedQuantity
                      } ${incomingSummaryData?.standardUnit
                      }` ?? "Not Available Data"}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            {/* Status */}
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
                        <SelectValue placeholder="Select a status for outgoing..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statues.map((status) => (
                        <SelectItem key={status} value={status} className="capitalize">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      value={field.value}
                    />
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
                  <span>Ref Doc</span>
                  {/* <span className="font-medium whitespace-normal">
                    {form.getValues("refDoc")}
                  </span> */}
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
            >
              {createOutgoing.isLoading ||
                updateOutgoing.isLoading ||
                (deleteOutgoing.isLoading && (
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
};
