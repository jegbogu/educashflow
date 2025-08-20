import { cn } from "@/lib/utils";
import React from "react";

export default function Title({ children, className, ...props }) {
  return (
    <h1
      className={cn(
        "text-2xl py-2 md:text-4xl text-secondary font-semibold capitalize leading-normal break-words",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
