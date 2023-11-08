"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { InventoryProduct } from "@/types/inventory";

import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const ProductForm = () => {
  const form = useForm<InventoryProduct>({});
  // id: z.number(),
  // productCode: z.string(),
  // productName: z.string(),
  // brand: z.string(),
  // standardUnit: z.string(),
  // productThumbnail: z.string(),
  // supplier: z.string(),
  // remarks: z.string(),
  // isExist: z.boolean(),
  // createdBy: z.string(),
  // createdAt: z.string(),
  // updatedBy: z.string(),
  // updatedAt: z.string(),

  const onSubmit: SubmitHandler<InventoryProduct> = (data) => {
    console.log(data);
    data.createdAt = new Date().toISOString();
  };
  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Inventory Product
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <Controller
                control={form.control}
                name="productCode"
                render={({ field }) => (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="productCode"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Product Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="productCode"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="productName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Product Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="productName"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Brand
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="brand"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="standardUnit"
                render={({ field }) => (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Country
                    </label>
                    <div className="mt-2">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="supplier"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Supplier
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="supplier"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="remarks"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Brand
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="remarks"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
