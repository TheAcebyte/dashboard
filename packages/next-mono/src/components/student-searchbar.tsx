"use client";

import Select, { selectContext } from "@/components/ui/select";
import { studentFilterOptions } from "@/constants/filters";
import { cn } from "@/lib/utils";
import { useStudentSearchStore } from "@/stores/student-search-store";
import { Search, X } from "lucide-react";
import { type ChangeEvent, useContext } from "react";

interface Props {
  className?: string;
}

export default function StudentSearchbar({ className }: Props) {
  const { setSearchField, searchTerm, setSearchTerm } = useStudentSearchStore();
  const clearSearchTerm = () => setSearchTerm("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-full border border-gray-300 px-4",
        className,
      )}
    >
      {searchTerm == "" ? (
        <Search className="text-zinc-900" />
      ) : (
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
          onClick={clearSearchTerm}
        />
      )}
      <input
        type="text"
        placeholder="Search for students"
        className="min-w-0 flex-1 text-zinc-900 outline-none placeholder:text-gray-400"
        value={searchTerm}
        onChange={handleChange}
      />
      <Select
        options={studentFilterOptions}
        offsetX={16}
        setValue={setSearchField}
        className="gap-2"
      >
        <SelectLabel />
      </Select>
    </div>
  );
}

function SelectLabel() {
  const option = useContext(selectContext);
  if (!option) {
    throw new Error(
      "SelectInputLabel must be placed inside a Select component.",
    );
  }

  return <p className="py-2 font-medium">By {option}</p>;
}
