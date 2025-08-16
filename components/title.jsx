import { cn } from "@/lib/utils";
import React from "react";

export default function Title({ children, className, ...props }) {
  return (
    <h1
      className={cn("text-5xl text-secondary font-semibold capitalize", className)}
      {...props}
    >
      {children}
    </h1>
  );
}
