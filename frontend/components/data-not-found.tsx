import React from "react";
import Image from "next/image";
import notFoundImage from "../public/images/data_not_found.jpg";

export const DataNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <div className="relative w-[350px] h-[250px]">
        <Image
          src={notFoundImage}
          alt="Data not found"
          fill
          className="object-cover w-full h-full"
        />
      </div>
      <span className="text-[24px] text-center font-medium text-primary p-0">
        No data has been added yet.
      </span>
      <small className="p-0 text-sm text-accent">
        Add a new data to continue.
      </small>
    </div>
  );
};
