import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, alt, size, className }: Props) {
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
            "cursor-pointer rounded-full border border-gray-300 bg-gray-100 object-cover",
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
