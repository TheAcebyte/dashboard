"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

export default function Avatar({ src, alt, className }: Props) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    setWidth(imageRef.current.naturalWidth);
    setHeight(imageRef.current.naturalHeight);
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <img
          src={src}
          alt={alt}
          className={cn(
            "cursor-pointer rounded-full border border-gray-300 object-cover",
            className,
          )}
          ref={imageRef}
        />
      </DialogTrigger>
      <DialogContent>
        <img src={src} alt={alt} className="rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}
