"use client";

import { cn } from "@/lib/utils";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DialogContext = {
  active: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const dialogContext = createContext<DialogContext | null>(null);

interface DialogProps {
  className?: string;
  children?: ReactNode;
}

export function Dialog({ className, children }: DialogProps) {
  const [active, setActive] = useState(false);
  const contextValue = {
    active,
    open: () => setActive(true),
    close: () => setActive(false),
    toggle: () => setActive(!active),
  };

  return (
    <div className={cn("relative w-fit", className)}>
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

  const { active, toggle } = contextValue;
  const dialogContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    const hideDialog = (e: MouseEvent) => {
      if (
        dialogContentRef.current &&
        !dialogContentRef.current.contains(e.target as Node)
      ) {
        toggle();
      }
    };
    document.addEventListener("click", hideDialog);
    return () => document.removeEventListener("click", hideDialog);
  }, [active]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-10 h-screen w-screen bg-black/50 transition-opacity",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform",
          active ? "scale-100" : "scale-95",
          className,
        )}
        ref={dialogContentRef}
      >
        {children}
      </div>
    </div>
  );
}
