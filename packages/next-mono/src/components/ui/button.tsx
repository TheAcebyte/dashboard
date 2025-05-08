import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const buttonStyles = {
  solid:
    "bg-zinc-900 text-white font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:bg-zinc-800",
  outline:
    "bg-white border border-gray-300 text-zinc-900 font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:bg-gray-50",
} as const satisfies Record<string, string>;

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
