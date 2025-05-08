"use client";

import { OTPInput, OTPInputSlot } from "@/components/ui/otp-input";
import Select, { type SelectOption } from "@/components/ui/select";
import { cn, range } from "@/lib/utils";
import { Upload, User } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

interface TextInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  error?: string;
  className?: string;
}

export function TextInput({
  id,
  label,
  placeholder,
  value,
  setValue,
  error,
  className,
}: TextInputProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label htmlFor={id} className="font-medium text-zinc-600">
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className={cn(
          "rounded-full border border-gray-300 px-4 py-2 text-zinc-900 outline-none placeholder:text-gray-400 focus-visible:border-gray-500",
          error && "border-red-700",
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

interface OTPInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  error?: string;
  className?: string;
}

export function CNEInput({
  label,
  value,
  setValue,
  error,
  className,
}: OTPInputProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label className="font-medium text-zinc-600">{label}</label>
      <OTPInput
        slots={10}
        value={value}
        setValue={setValue}
        className={cn(
          "rounded-full border border-gray-300 px-4 py-2 text-zinc-900 outline-none placeholder:text-gray-400 focus-within:border-gray-500",
          error && "border-red-700",
        )}
      >
        <OTPInputSlot index={0} pattern={/^[A-Z]$/} placeholder="J" />
        <span className="mx-2 text-gray-300">-</span>
        {range(1, 10).map((i) => (
          <OTPInputSlot key={i} index={i} pattern={/^[0-9]$/} placeholder="0" />
        ))}
      </OTPInput>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

export function DateInput({
  label,
  value,
  setValue,
  error,
  className,
}: OTPInputProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label className="font-medium text-zinc-600">{label}</label>
      <OTPInput
        slots={8}
        value={value}
        setValue={setValue}
        className={cn(
          "rounded-full border border-gray-300 px-4 py-2 text-zinc-900 outline-none placeholder:text-gray-400 focus-within:border-gray-500",
          error && "border-red-700",
        )}
      >
        <OTPInputSlot index={0} pattern={/^[0-9]$/} placeholder="d" />
        <OTPInputSlot index={1} pattern={/^[0-9]$/} placeholder="d" />
        <span className="mx-2 text-gray-300">/</span>
        <OTPInputSlot index={2} pattern={/^[0-9]$/} placeholder="M" />
        <OTPInputSlot index={3} pattern={/^[0-9]$/} placeholder="M" />
        <span className="mx-2 text-gray-300">/</span>
        <OTPInputSlot index={4} pattern={/^[0-9]$/} placeholder="y" />
        <OTPInputSlot index={5} pattern={/^[0-9]$/} placeholder="y" />
        <OTPInputSlot index={6} pattern={/^[0-9]$/} placeholder="y" />
        <OTPInputSlot index={7} pattern={/^[0-9]$/} placeholder="y" />
      </OTPInput>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

interface SelectInputProps<T extends SelectOption[]> {
  options: T;
  label: string;
  placeholder?: string;
  value: T[number]["id"];
  setValue: (value: T[number]["id"]) => void;
  error?: string;
  className?: string;
}

export function SelectInput<T extends SelectOption[]>({
  options,
  label,
  value,
  setValue,
  error,
  className,
}: SelectInputProps<T>) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label className="font-medium text-zinc-600">{label}</label>
      <Select
        options={options}
        value={value}
        setValue={setValue}
        className={cn(
          "w-full rounded-full border border-gray-300 px-4 focus-within:border-gray-500",
          error && "border-red-700",
        )}
      />
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

interface ImageInputProps {
  value: File;
  setValue: (value: File) => void;
  error?: string;
}

export function ImageInput({ value, setValue, error }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (!image) return;
    const newImageUrl = URL.createObjectURL(image);
    setImageUrl(newImageUrl);
    return () => URL.revokeObjectURL(newImageUrl);
  }, [image]);

  useEffect(() => {
    if (!inputRef.current) return;
    setImage(value);
    if (value) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(value);
      inputRef.current.files = dataTransfer.files;
    } else {
      // This clears the file input from any file
      inputRef.current.value = "";
      setImageUrl("");
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImage(e.target.files[0]);
    setValue(e.target.files[0]);
  };

  return (
    <div
      className={cn(
        "relative size-[100px] rounded-full border border-gray-300 bg-gray-100 p-8",
        error && "border-red-700",
      )}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!imageUrl && <User width={32} height={32} className="text-gray-500" />}
      <div
        className={cn(
          "absolute right-0 bottom-0 overflow-hidden rounded-full border border-gray-300 bg-white p-2",
          error && "border-red-700",
        )}
      >
        <Upload width={18} height={18} className="text-gray-500" />
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 size-full cursor-pointer text-[0px] opacity-0"
          ref={inputRef}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
