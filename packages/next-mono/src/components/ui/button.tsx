import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const buttonStyles = {
  solid:
    "bg-zinc-900 text-white font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:zinc-800",
  outline:
    "border border-gray-200 text-zinc-900 font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:bg-gray-50",
};

type ButtonVariant = keyof typeof buttonStyles;

type Props = {
  variant: ButtonVariant;
} & ComponentProps<"button">;

export default function Button({
  variant,
  className,
  children,
  ...props
}: Props) {
  return (
    <button className={cn(buttonStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}
