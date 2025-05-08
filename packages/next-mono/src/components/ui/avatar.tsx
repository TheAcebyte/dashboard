import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

export default function Avatar({ src, alt, className }: Props) {
  return (
    <Dialog id={`avatar-${src}`}>
      <DialogTrigger>
        <img
          src={src}
          alt={alt}
          className={cn(
            "cursor-pointer rounded-full border border-gray-300 object-cover",
            className,
          )}
        />
      </DialogTrigger>
      <DialogContent>
        <img src={src} alt={alt} className="rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}
