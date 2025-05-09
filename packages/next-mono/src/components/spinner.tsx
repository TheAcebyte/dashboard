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
        "aspect-square rounded-full border border-gray-300 bg-white p-2 text-zinc-700",
        className,
      )}
      ref={ref}
    >
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
