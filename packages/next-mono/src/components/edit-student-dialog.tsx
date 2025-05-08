"use client";

import editStudent from "@/actions/student/edit";
import { studentSchema } from "@/actions/student/validation";
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
import { PaginatedStudentRecord } from "@/db/queries/students";
import useFetch from "@/hooks/use-fetch";
import useFormAction from "@/hooks/use-form-action";
import { fetchGroupOptions, fetchPicture } from "@/lib/fetch";
import { useTableRefetchStore } from "@/stores/table-refetch-store";
import { CircleAlert, Pencil, X } from "lucide-react";
import { useContext, useEffect } from "react";

interface Props {
  record: PaginatedStudentRecord;
}

export default function EditStudentDialog({ record }: Props) {
  return (
    <Dialog id={`edit-student-${record.studentId}`}>
      <DialogTrigger className="flex cursor-pointer items-center gap-4 px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-gray-50 hover:text-zinc-700">
        <Pencil size={20} />
        Edit
      </DialogTrigger>
      <DialogContent>
        <EditStudentDialogContent record={record} />
      </DialogContent>
    </Dialog>
  );
}

function EditStudentDialogContent({ record }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "EditStudentDialogContent must be placed inside a DialogContent component.",
    );
  }

  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const { data: groupOptions } = useFetch(fetchGroupOptions);

  const editThisStudent = editStudent.bind(null, record.studentId);
  const date = new Date(record.birthDate);
  const day = date.getDate();
  // JavaScript just had to mess it up at 0-indexed months
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateField = `${day}${month}${year}`;
  const { handleSubmit, fields, setters, response, errors, reset } =
    useFormAction(editThisStudent, studentSchema, {
      firstName: record.firstName,
      lastName: record.lastName,
      cne: record.cne,
      birthDate: dateField,
      groupId: record.groupId,
    });

  useEffect(() => {
    fetchPicture(record.pictureUrl).then((file) => setters.file(file));
  }, []);

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  if (!groupOptions) return null;
  return (
    <div className="rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Edit Student</h1>
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
          onClick={close}
        />
      </header>
      <form
        className="flex flex-col items-center gap-8 p-8"
        onSubmit={handleSubmit}
      >
        <ImageInput
          value={fields.file}
          setValue={setters.file}
          error={errors.file}
        />
        <div className="flex gap-8">
          <TextInput
            id="first-name"
            label="First Name"
            placeholder="Your first name"
            value={fields.firstName}
            setValue={setters.firstName}
            error={errors.firstName}
          />
          <TextInput
            id="last-name"
            label="Last Name"
            placeholder="Your last name"
            value={fields.lastName}
            setValue={setters.lastName}
            error={errors.lastName}
          />
        </div>
        <CNEInput
          label="CNE"
          value={fields.cne}
          setValue={setters.cne}
          error={errors.cne}
        />
        <DateInput
          label="Date of Birth"
          value={fields.birthDate}
          setValue={setters.birthDate}
          error={errors.birthDate}
        />
        <SelectInput
          options={groupOptions}
          label="Group"
          value={fields.groupId}
          setValue={setters.groupId}
          error={errors.groupId}
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
            Apply
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
