"use client";

import addStudent from "@/actions/add-student";
import { studentSchema } from "@/actions/add-student/validation";
import { buttonStyles } from "@/components/ui/button";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import {
  CNEInput,
  DateInput,
  ImageInput,
  SelectInput,
  TextInput,
} from "@/components/ui/input";
import useFormAction from "@/hooks/use-form-action";
import { cn } from "@/lib/utils";
import { CircleAlert, Plus, X } from "lucide-react";
import { useContext, useEffect } from "react";

export default function AddStudentDialog() {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonStyles.solid, "flex h-full items-center gap-2")}
      >
        Add
        <Plus />
      </DialogTrigger>
      <DialogContent>
        <AddStudentDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function AddStudentDialogContent() {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "AddStudentDialogContent must be placed inside a DialogContent component.",
    );
  }

  const { close } = contextValue;
  const { handleSubmit, register, response, errors } = useFormAction(
    addStudent,
    studentSchema,
  );
  useEffect(() => {
    if (response?.success) close();
  }, [response]);

  return (
    <div className="rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Add Student</h1>
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
          onClick={close}
        />
      </header>
      <form
        className="flex flex-col items-center gap-8 p-8"
        onSubmit={handleSubmit}
      >
        <ImageInput setValue={register("file")} />
        <div className="flex gap-8">
          <TextInput
            id="first-name"
            label="First Name"
            placeholder="Your first name"
            setValue={register("firstName")}
            error={errors?.firstName?.[0]}
          />
          <TextInput
            id="last-name"
            label="Last Name"
            placeholder="Your last name"
            setValue={register("lastName")}
            error={errors?.lastName?.[0]}
          />
        </div>
        <CNEInput
          label="CNE"
          setValue={register("cne")}
          error={errors?.cne?.[0]}
        />
        <DateInput
          label="Date of Birth"
          setValue={register("birthDate")}
          error={errors?.birthDate?.[0]}
        />
        <SelectInput
          label="Group"
          setValue={register("group")}
          error={errors?.group?.[0]}
          options={[
            { id: "API-1", label: "API-1" },
            { id: "API-2", label: "API-2" },
          ]}
        />
        <div className="mt-8 flex gap-4 self-stretch">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={close}
          >
            Cancel
          </Button>
          <Button variant="solid" className="flex-1">
            Add
          </Button>
        </div>
        {response && !response.success && (
          <div className="flex items-center gap-2 font-medium text-red-700">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
