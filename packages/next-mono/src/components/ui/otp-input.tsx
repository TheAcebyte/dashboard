import { robotoMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type InputArray = (HTMLInputElement | null)[];

type OTPContext = {
  inputArray: RefObject<InputArray>;
  focus: (index: number) => void;
  focusAndClear: (index: number) => void;
  setSlot: (index: number, value: string) => void;
};

const otpContext = createContext<OTPContext | null>(null);

interface OTPInputProps {
  slots: number;
  className?: string;
  children?: ReactNode;
  register?: (value: string) => void;
}

export function OTPInput({
  slots,
  register,
  className,
  children,
}: OTPInputProps) {
  if (slots <= 0) {
    throw new Error("Number of slots must be greater than zero.");
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string[]>(new Array(slots).fill(""));
  const inputArray = useRef<InputArray>(new Array(slots).fill(null));

  const focus = (index: number) => inputArray.current[index]?.focus();
  const focusAndClear = (index: number) => {
    if (!inputArray.current[index]) return;
    inputArray.current[index].value = "";
    inputArray.current[index].focus();
  };

  const setSlot = (index: number, key: string) => {
    const leftSlots = value.slice(0, index);
    const rightSlots = value.slice(index + 1);
    const newValue = [...leftSlots, key, ...rightSlots];
    setValue(newValue);
    if (register) register(newValue.join(""));
  };

  const focusLastFilledSlot = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target != containerRef.current) return;
    let foundFilledSlot = false;
    for (let i = slots - 1; i >= 0; i--) {
      if (inputArray.current[i]?.value != "") {
        if (i < slots - 1) {
          inputArray.current[i + 1]?.focus();
        } else {
          inputArray.current[i]?.focus();
        }
        foundFilledSlot = true;
        break;
      }
    }

    if (!foundFilledSlot) inputArray.current[0]?.focus();
  };

  const contextValue = {
    inputArray,
    focus,
    focusAndClear,
    setSlot,
  };

  return (
    <div
      className={cn("cursor-text", className)}
      ref={containerRef}
      onClick={focusLastFilledSlot}
    >
      <otpContext.Provider value={contextValue}>{children}</otpContext.Provider>
    </div>
  );
}

interface OTPInputSlotProps {
  index: number;
  pattern: RegExp;
  placeholder?: string;
  className?: string;
}

export function OTPInputSlot({
  index,
  pattern,
  placeholder,
  className,
}: OTPInputSlotProps) {
  const contextValue = useContext(otpContext);
  if (!contextValue) {
    throw new Error(
      "OTPInputSlot must be placed inside an OTPInput component.",
    );
  }

  const { inputArray, focus, focusAndClear, setSlot } = contextValue;
  const handleEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (value == "") {
      switch (e.key) {
        case "ArrowLeft":
          focus(index - 1);
          break;

        case "ArrowRight":
          break;

        case "Backspace":
          focusAndClear(index - 1);
          break;

        default:
          if (!pattern.test(e.key)) return;
          target.value = e.key;
          focus(index + 1);
      }
    } else {
      switch (e.key) {
        case "ArrowLeft":
          focus(index - 1);
          break;

        case "ArrowRight":
          focus(index + 1);
          break;

        case "Backspace":
          target.value = "";
          focus(index - 1);
          break;

        default:
          if (!pattern.test(e.key)) return;
          target.value = e.key;
          focus(index + 1);
      }
    }

    setSlot(index, target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      className={cn(
        "w-[1ch] outline-none placeholder:text-gray-400",
        robotoMono.className,
        className,
      )}
      ref={(el) => {
        inputArray.current[index] = el;
      }}
      onKeyDown={handleEvent}
    />
  );
}
