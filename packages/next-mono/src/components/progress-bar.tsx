import { cn } from "@/lib/utils";

const breakpointColors = [
  [0, "bg-red-700"],
  [25, "bg-orange-500"],
  [50, "bg-amber-400"],
  [70, "bg-emerald-500"],
  [90, "bg-cyan-500"],
] as const satisfies [number, string][];

function getPercentageColor(percentage: number) {
  for (let i = breakpointColors.length - 1; i >= 0; i--) {
    const [breakpoint, color] = breakpointColors[i];
    if (percentage >= breakpoint) return color;
  }

  return "bg-zinc-900";
}

interface Props {
  percentage: number;
  width?: number;
}

export default function ProgressBar({ percentage, width }: Props) {
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100.");
  }

  const style = width ? { width } : {};
  return (
    <div
      className="relative h-[8px] w-full overflow-hidden rounded-full bg-gray-200"
      style={style}
    >
      <div
        className={cn(
          "absolute left-0 h-full rounded-full",
          getPercentageColor(percentage),
        )}
        style={{
          width: `calc(100% * ${percentage} / 100)`,
        }}
      />
    </div>
  );
}
