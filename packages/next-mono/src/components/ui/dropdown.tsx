"use client";

import { cn } from "@/lib/utils";
import {
  type ReactNode,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DropdownContext = [boolean, () => void, RefObject<HTMLDivElement | null>];

const dropdownContext = createContext<DropdownContext | null>(null);

interface DropdownProps {
  registerActive?: (state: boolean) => void;
  className?: string;
  children: ReactNode;
}

export function Dropdown({
  registerActive,
  className,
  children,
}: DropdownProps) {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setActive(!active);
    if (registerActive) registerActive(!active);
  };

  return (
    <div className={cn("relative w-fit", className)} ref={dropdownRef}>
      <dropdownContext.Provider value={[active, toggleDropdown, dropdownRef]}>
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

  const [, toggleDropdown] = contextValue;
  return (
    <button className={className} onClick={toggleDropdown}>
      {children}
    </button>
  );
}

interface DropdownContentProps {
  className?: string;
  children?: ReactNode;
}

export function DropdownContent({ className, children }: DropdownContentProps) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "DropdownContent must be placed inside a Dropdown component.",
    );
  }

  const [active, toggleDropdown, dropdownRef] = contextValue;
  const [isTopHalf, setTopHalf] = useState(false);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    const hideDropdown = (e: MouseEvent) => {
      if (
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(e.target as Node)
      ) {
        toggleDropdown();
      }
    };
    const updateDropdownPosition = () => {
      if (!dropdownRef.current) return;
      const { y } = dropdownRef.current.getBoundingClientRect();
      const halfHeight = document.body.offsetHeight / 2;
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
        "transition-dropdown absolute left-1/2 -translate-x-1/2",
        isTopHalf
          ? "bottom-0 origin-top translate-y-full"
          : "top-0 origin-bottom -translate-y-full",
        active
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-80 opacity-0",
        className,
      )}
      ref={dropdownContentRef}
    >
      {children}
    </div>
  );
}
