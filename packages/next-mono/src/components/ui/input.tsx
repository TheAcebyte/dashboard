"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { dropdownContext } from "@/components/ui/dropdown";
import { OTPInput, OTPInputSlot } from "@/components/ui/otp-input";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Upload, User } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

interface TextInputProps {
  id: string;
  label: string;
  placeholder?: string;
  setValue: (value: string) => void;
  error?: string;
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
  setValue: (value: string) => void;
  error?: string;
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
  const registerDate = (date: string) => {
    const day = date.slice(0, 2);
    const month = date.slice(2, 4);
    const year = date.slice(4);
    const birthDate = `${day}/${month}/${year}`;
    setValue(birthDate);
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
  label: string;
  placeholder?: string;
  setValue: (value: string) => void;
  error?: string;
  options: string[];
}

export function SelectInput({
  label,
  setValue,
  error,
  options,
}: SelectInputProps) {
  const [selected, setSelected] = useState<number>(0);
  const select = (index: number) => {
    setSelected(index);
    setValue(options[index]);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="font-medium text-zinc-600">{label}</label>
      <div
        className={cn(
          "flex items-center gap-4 rounded-full border border-gray-300 px-4 text-zinc-900 focus-within:border-gray-500",
          error && "border-red-700",
        )}
      >
        <p className="flex-1 py-2">{options[selected]}</p>
        <Dropdown className="flex items-center">
          <DropdownTrigger className="cursor-pointer transition-colors hover:text-zinc-800">
            <ChevronsUpDown width={20} height={20} />
          </DropdownTrigger>
          <DropdownContent
            align="right"
            offsetX={18}
            offsetY={20}
            className="rounded-xl border border-gray-300 bg-white"
          >
            <SelectInputDropdownContent options={options} select={select} />
          </DropdownContent>
        </Dropdown>
      </div>
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

interface OptionSelectorProps {
  options: string[];
  select: (index: number) => void;
}

function SelectInputDropdownContent({ options, select }: OptionSelectorProps) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "SelectInputDropdownContent must be placed inside a DropdownContent component.",
    );
  }

  const { close } = contextValue;
  return (
    <ul>
      {options.map((option, index) => {
        const handleClick = () => {
          select(index);
          close();
        };

        return (
          <li
            key={index}
            className="cursor-pointer px-4 py-2 transition-colors hover:bg-gray-50"
            onClick={handleClick}
          >
            {option}
          </li>
        );
      })}
    </ul>
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
