import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { env } from "@/constants/env";
import { cn } from "@/lib/utils";

interface Props {
  endpoint: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ endpoint, alt, size, className }: Props) {
  const src = new URL(endpoint, env.APP_URL).toString();
  const imageStyle = !size
    ? {}
    : {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      };

  return (
    <Dialog id={`avatar-${src}`}>
      <DialogTrigger>
        <img
          src={src}
          alt={alt}
          className={cn(
            "cursor-pointer rounded-full border border-default-border bg-placeholder-bg object-cover",
            className,
          )}
          style={imageStyle}
        />
      </DialogTrigger>
      <DialogContent>
        <img src={src} alt={alt} className="rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}
