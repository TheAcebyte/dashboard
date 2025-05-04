"use client";

import { OTPInput, OTPInputSlot } from "@/components/ui/otp-input";
import Select, {
  type SelectOption,
  selectContext,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Upload, User } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

interface TextInputProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  setValue: (value: string) => void;
}

export function TextInput({
  id,
  label,
  placeholder,
  setValue,
  error,
}: TextInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
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
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

interface OTPInputProps {
  label: string;
  error?: string;
  setValue: (value: string) => void;
}

export function CNEInput({ label, setValue, error }: OTPInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="font-medium text-zinc-600">{label}</label>
      <OTPInput
        slots={10}
        register={setValue}
        className={cn(
          "rounded-full border border-gray-300 px-4 py-2 text-zinc-900 outline-none placeholder:text-gray-400 focus-within:border-gray-500",
          error && "border-red-700",
        )}
      >
        <OTPInputSlot index={0} pattern={/^[A-Z]$/} placeholder="J" />
        <span className="mx-2 text-gray-300">-</span>
        <OTPInputSlot index={1} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={2} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={3} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={4} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={5} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={6} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={7} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={8} pattern={/^[0-9]$/} placeholder="0" />
        <OTPInputSlot index={9} pattern={/^[0-9]$/} placeholder="0" />
      </OTPInput>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

export function DateInput({ label, setValue, error }: OTPInputProps) {
  const registerDate = (euLocaleDate: string) => {
    const day = euLocaleDate.slice(0, 2);
    const month = euLocaleDate.slice(2, 4);
    const year = euLocaleDate.slice(4);
    const usLocaleDate = `${month}/${day}/${year}`;
    setValue(usLocaleDate);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="font-medium text-zinc-600">{label}</label>
      <OTPInput
        slots={8}
        register={registerDate}
        className={cn(
          "rounded-full border border-gray-300 px-4 py-2 text-zinc-900 outline-none placeholder:text-gray-400 focus-within:border-gray-500",
          error && "border-red-700",
        )}
      >
        <OTPInputSlot index={0} pattern={/[0-9]/} placeholder="d" />
        <OTPInputSlot index={1} pattern={/[0-9]/} placeholder="d" />
        <span className="mx-2 text-gray-300">/</span>
        <OTPInputSlot index={2} pattern={/[0-9]/} placeholder="M" />
        <OTPInputSlot index={3} pattern={/[0-9]/} placeholder="M" />
        <span className="mx-2 text-gray-300">/</span>
        <OTPInputSlot index={4} pattern={/[0-9]/} placeholder="y" />
        <OTPInputSlot index={5} pattern={/[0-9]/} placeholder="y" />
        <OTPInputSlot index={6} pattern={/[0-9]/} placeholder="y" />
        <OTPInputSlot index={7} pattern={/[0-9]/} placeholder="y" />
      </OTPInput>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

interface SelectInputProps {
  options: SelectOption[];
  label: string;
  placeholder?: string;
  error?: string;
  setValue: (value: string) => void;
}

export function SelectInput({
  options,
  label,
  error,
  setValue,
}: SelectInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="font-medium text-zinc-600">{label}</label>
      <Select
        options={options}
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
  setValue: (value: File) => void;
}

export function ImageInput({ setValue }: ImageInputProps) {
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImage(e.target.files[0]);
    setValue(e.target.files[0]);
  };

  useEffect(() => {
    if (!image) return;
    const newImageUrl = URL.createObjectURL(image);
    setImageUrl(newImageUrl);
    return () => URL.revokeObjectURL(newImageUrl);
  }, [image]);

  return (
    <div
      className="relative size-[100px] rounded-full border border-gray-300 bg-gray-100 p-8"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!imageUrl && <User width={32} height={32} className="text-gray-500" />}
      <div className="absolute right-0 bottom-0 overflow-hidden rounded-full border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50">
        <Upload width={18} height={18} />
        <input
          type="file"
          className="absolute inset-0 size-full cursor-pointer text-[0px] opacity-0"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
