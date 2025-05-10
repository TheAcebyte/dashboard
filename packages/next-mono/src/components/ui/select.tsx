import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  dropdownContext,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface SelectOption {
  id: string;
  label: string;
}

export const selectContext = createContext<string | null>(null);

interface SelectProps<T extends SelectOption[]> {
  options: T;
  offsetX?: number;
  offsetY?: number;
  value: T[number]["id"];
  setValue: (value: T[number]["id"]) => void;
  className?: string;
  children?: ReactNode;
}

export default function Select<T extends SelectOption[]>({
  options,
  offsetX,
  offsetY,
  value,
  setValue,
  className,
  children,
}: SelectProps<T>) {
  if (options.length == 0) {
    throw new Error("List of options cannot be empty.");
  }

  const [selected, setSelected] = useState(0);
  const select = (index: number) => {
    setSelected(index);
    setValue(options[index].id);
  };

  useEffect(() => {
    const valueIndex = options.findIndex((option) => option.id == value);
    const newSelected = valueIndex == -1 ? 0 : valueIndex;
    select(newSelected);
  }, [value]);

  return (
    <Dropdown className={className}>
      <DropdownTrigger className="flex w-full cursor-pointer items-center gap-2 transition-colors hover:text-zinc-700">
        <SelectDropdownTrigger option={options[selected].label}>
          {children}
        </SelectDropdownTrigger>
      </DropdownTrigger>
      <DropdownContent
        align="right"
        offsetX={offsetX}
        offsetY={offsetY ?? 8}
        className="rounded-xl border border-gray-300 bg-white"
      >
        <SelectDropdownContent options={options} select={select} />
      </DropdownContent>
    </Dropdown>
  );
}

interface SelectDropdownTrigger {
  option: string;
  children?: ReactNode;
}

function SelectDropdownTrigger({ option, children }: SelectDropdownTrigger) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "SelectDropdownTrigger must be placed inside a DropdownTrigger component.",
    );
  }

  const { active } = contextValue;
  return (
    <selectContext.Provider value={option}>
      {children || <p className="flex-1 py-2 text-left">{option}</p>}
      <ChevronUp
        width={20}
        height={20}
        className={cn("-rotate-180 transition-transform", active && "rotate-0")}
      />
    </selectContext.Provider>
  );
}

interface SelectDropdownContent {
  options: SelectOption[];
  select: (index: number) => void;
}

function SelectDropdownContent({ options, select }: SelectDropdownContent) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "SelectDropdownContent must be placed inside a DropdownContent component.",
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
            className="cursor-pointer px-4 py-2 text-zinc-900 transition-colors hover:bg-gray-50 hover:text-zinc-700"
            onClick={handleClick}
          >
            {option.label}
          </li>
        );
      })}
    </ul>
  );
}
