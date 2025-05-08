import { robotoMono } from "@/lib/fonts";
import { cn, padRightArray } from "@/lib/utils";
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type OTPSlotArray = (HTMLInputElement | null)[];

type OTPContext = {
  otpSlotArray: RefObject<OTPSlotArray>;
  focus: (index: number) => void;
  focusAndClear: (index: number) => void;
  input: string[];
  setSlot: (index: number, value: string) => void;
};

const otpContext = createContext<OTPContext | null>(null);

interface OTPInputProps {
  slots: number;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

export function OTPInput({
  slots,
  value,
  setValue,
  className,
  children,
}: OTPInputProps) {
  if (slots <= 0) {
    throw new Error("Number of slots must be strictly positive.");
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const otpSlotArray = useRef<OTPSlotArray>(new Array(slots).fill(null));
  const [input, setInput] = useState<string[]>(new Array(slots).fill(""));

  useEffect(() => {
    const splitValue = value.slice(0, slots).split("");
    padRightArray(splitValue, "", slots);
    setInput(splitValue);
  }, [value]);

  const focus = (index: number) => {
    if (index < 0) index = 0;
    else if (index > slots) index = slots - 1;
    otpSlotArray.current[index]?.focus();
  };

  const focusAndClear = (index: number) => {
    if (index < 0 || index >= slots - 1 || !otpSlotArray.current[index]) return;
    otpSlotArray.current[index].value = "";
    otpSlotArray.current[index].focus();
  };

  const focusLastFilledSlot = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target != containerRef.current) return;
    let foundFilledSlot = false;
    for (let i = slots - 1; i >= 0; i--) {
      if (otpSlotArray.current[i]?.value != "") {
        if (i < slots - 1) focus(i + 1);
        else focus(i);
        foundFilledSlot = true;
        break;
      }
    }
    if (!foundFilledSlot) focus(0);
  };

  const setSlot = (index: number, key: string) => {
    const leftSlots = value.slice(0, index);
    const rightSlots = value.slice(index + 1);
    const newInput = [...leftSlots, key, ...rightSlots];
    setInput(newInput);
    setValue(newInput.join(""));
  };

  const contextValue = {
    otpSlotArray,
    focus,
    focusAndClear,
    input,
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
  value?: string;
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

  const { otpSlotArray, focus, focusAndClear, input, setSlot } = contextValue;
  const handleEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (target.value == "") {
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
        otpSlotArray.current[index] = el;
      }}
      value={input[index] ?? ""}
      onKeyDown={handleEvent}
      onChange={(e) => setSlot(index, e.target.value)}
    />
  );
}
