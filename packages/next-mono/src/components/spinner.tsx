import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { RefObject } from "react";

interface Props {
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
}

export default function Spinner({ className, ref }: Props) {
  return (
    <div
      className={cn(
        "aspect-square rounded-full border border-default-border bg-primary-bg p-2 text-primary-hover-fg",
        className,
      )}
      ref={ref}
    >
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
