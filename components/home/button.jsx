import { cva } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils"; // optional helper for merging classes

// Define button variants with cva
const buttonVariants = cva(
  "inline-flex items-center text-white justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
        destructive:
          "bg-destructive hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary hover:bg-secondary/80",
      },
      size: {
        default: "h-10 py-2 px-4 text-base",
        sm: "py-4 px-3 rounded-md text-sm",
        lg: "py-4 px-8 rounded-md text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = ({
  variant,
  size,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};
