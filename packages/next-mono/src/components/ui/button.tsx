import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export const buttonStyles = {
  solid:
    "bg-primary-fg text-primary-bg font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:bg-primary-hover-fg",
  outline:
    "bg-primary-bg border border-default-border text-primary-fg font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:bg-primary-hover-bg",
  destructive:
    "bg-destructive-fg text-white font-medium px-4 py-2 rounded-full transition-colors cursor-pointer hover:bg-destructive-hover-fg",
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
