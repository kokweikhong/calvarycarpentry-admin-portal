import React from "react";
import Image from "next/image";

export interface IconProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Icon: React.FC<IconProps> = ({
  src,
  alt,
  width = 24,
  height = 24,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      <Image
        src={src}
        alt={alt}
        height={height}
        width={width}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

export default Icon;
