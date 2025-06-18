"use client";

import { cn } from "@/lib/utils";
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface DropdownContext {
  active: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  ref: RefObject<HTMLDivElement | null>;
}

export const dropdownContext = createContext<DropdownContext | null>(null);

interface DropdownProps {
  className?: string;
  children?: ReactNode;
}

export function Dropdown({ className, children }: DropdownProps) {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contextValue = {
    active: active,
    open: () => setActive(true),
    close: () => setActive(false),
    toggle: () => setActive(!active),
    ref: dropdownRef,
  };

  return (
    <div className={cn("relative w-fit", className)} ref={dropdownRef}>
      <dropdownContext.Provider value={contextValue}>
        {children}
      </dropdownContext.Provider>
    </div>
  );
}

interface DropdownTriggerProps {
  className?: string;
  children?: ReactNode;
}

export function DropdownTrigger({ className, children }: DropdownTriggerProps) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "DropdownTrigger must be placed inside a Dropdown component.",
    );
  }

  const { toggle } = contextValue;
  const handleClick = (e: ReactMouseEvent) => {
    toggle();
    e.stopPropagation();
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}

interface DropdownContentProps {
  align?: "left" | "center" | "right";
  offsetX?: number;
  offsetY?: number;
  className?: string;
  children?: ReactNode;
}

export function DropdownContent({
  align = "left",
  offsetX = 0,
  offsetY = 0,
  className,
  children,
}: DropdownContentProps) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "DropdownContent must be placed inside a Dropdown component.",
    );
  }

  const { active, close, ref } = contextValue;
  const [isTopHalf, setTopHalf] = useState(false);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const hideDropdown = (e: MouseEvent) => {
      if (
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const updateDropdownPosition = () => {
      if (!ref.current) return;
      const { y } = ref.current.getBoundingClientRect();
      const halfHeight = window.innerHeight / 2;
      setTopHalf(y < halfHeight);
    };

    document.addEventListener("click", hideDropdown);
    window.addEventListener("resize", updateDropdownPosition);
    updateDropdownPosition();

    return () => {
      document.removeEventListener("click", hideDropdown);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [active]);

  return (
    <div
      className={cn(
        "transition-dropdown absolute z-10 w-max overflow-hidden",
        active
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0",
        className,
      )}
      style={{
        left: align == "left" ? "0" : align == "center" ? "50%" : "",
        right: align == "right" ? "0" : "",
        translate: `calc(${offsetX}px - ${align == "center" ? "50%" : "0px"}) calc(${isTopHalf ? "+" : "-"}${offsetY}px ${isTopHalf ? "+" : "-"} 100%)`,
        bottom: isTopHalf ? "0" : "",
        top: isTopHalf ? "" : "0",
        transformOrigin: isTopHalf ? "top" : "bottom",
      }}
      ref={dropdownContentRef}
    >
      {children}
    </div>
  );
}
