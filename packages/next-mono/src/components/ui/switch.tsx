import { cn } from "@/lib/utils";

interface Props {
  enabled: boolean;
  toggle: () => void;
  width?: number;
  height?: number;
  padding?: number;
  enabledClassName?: string;
  disabledClassName?: string;
  circleClassName?: string;
}

export default function Switch({
  enabled,
  toggle,
  width = 60,
  height = 30,
  padding = 4,
  enabledClassName = "bg-primary-fg",
  disabledClassName = "bg-disabled-bg",
  circleClassName = "bg-primary-bg",
}: Props) {
  const circleSize = height - 2 * padding;
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-full transition-colors",
        enabled ? enabledClassName : disabledClassName,
      )}
      style={{ width, height }}
      onClick={toggle}
    >
      <div
        className={cn("absolute rounded-full transition-all", circleClassName)}
        style={{
          width: circleSize,
          height: circleSize,
          top: "50%",
          left: enabled ? `calc(100% - ${padding}px` : `${padding}px`,
          translate: enabled ? "-100% -50%" : "0 -50%",
        }}
      />
    </div>
  );
}
