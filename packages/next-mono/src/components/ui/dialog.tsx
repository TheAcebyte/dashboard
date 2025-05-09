"use client";

import useMounted from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DialogContext = {
  key: string;
  active: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const dialogContext = createContext<DialogContext | null>(null);

interface DialogProps {
  id: string;
  className?: string;
  children?: ReactNode;
}

export function Dialog({ id, className, children }: DialogProps) {
  const [active, setActive] = useState(false);
  const contextValue = {
    key: id,
    active,
    open: () => setActive(true),
    close: () => setActive(false),
    toggle: () => setActive(!active),
  };

  return (
    <div className={cn("relative h-full w-fit", className)}>
      <dialogContext.Provider value={contextValue}>
        {children}
      </dialogContext.Provider>
    </div>
  );
}

interface DialogTriggerProps {
  className?: string;
  children?: ReactNode;
}

export function DialogTrigger({ className, children }: DialogTriggerProps) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error("DialogTrigger must be placed inside a Dialog component.");
  }

  const { toggle } = contextValue;
  return (
    <button className={className} onClick={toggle}>
      {children}
    </button>
  );
}

interface DialogContentProps {
  className?: string;
  children?: ReactNode;
}

export function DialogContent({ className, children }: DialogContentProps) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error("DialogContent must be placed inside a Dialog component.");
  }

  const { key, active, close } = contextValue;
  const dialogContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    const hideDialog = (e: MouseEvent) => {
      if (
        dialogContentRef.current &&
        !dialogContentRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("click", hideDialog);
    return () => document.removeEventListener("click", hideDialog);
  }, [active]);

  const mounted = useMounted();
  return (
    mounted &&
    createPortal(
      <dialogContext.Provider value={contextValue}>
        <div
          className={cn(
            "fixed inset-0 z-10 h-screen w-screen bg-black/50 transition-opacity",
            active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div
            className={cn(
              "absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform",
              active ? "scale-100" : "scale-95",
              className,
            )}
            ref={dialogContentRef}
          >
            {children}
          </div>
        </div>
      </dialogContext.Provider>,
      document.body,
      key,
    )
  );
}
