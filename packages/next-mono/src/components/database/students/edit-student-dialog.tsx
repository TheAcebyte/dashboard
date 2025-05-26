"use client";

import editStudent from "@/actions/student/edit-student";
import { getStudentSchema } from "@/actions/student/validation";
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
import { formatDateToddMMyyyy } from "@/lib/date";
import { fetchGroupOptions, fetchPicture } from "@/lib/fetch";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { CircleAlert, Pencil, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";

interface Props {
  record: PaginatedStudentRecord;
}

export default function EditStudentDialog({ record }: Props) {
  const t = useTranslations("database-page");
  return (
    <Dialog id={`edit-student-${record.studentId}`} className="w-full">
      <DialogTrigger className="flex w-full cursor-pointer items-center gap-4 bg-white px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-gray-50 hover:text-zinc-700">
        <Pencil size={20} />
        {t("edit")}
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

  const t = useTranslations("database-page");
  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const { data: groupOptions } = useFetch(fetchGroupOptions);

  const editThisStudent = editStudent.bind(null, record.studentId);
  const date = new Date(record.birthDate);
  const dateField = formatDateToddMMyyyy(date, "");
  const studentSchema = getStudentSchema(t);
  const { handleSubmit, fields, setters, response, errors } = useFormAction(
    editThisStudent,
    studentSchema,
    {
      firstName: record.firstName,
      lastName: record.lastName,
      cne: record.cne,
      birthDate: dateField,
      groupId: record.groupId,
    },
  );

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
        <h1 className="text-xl font-semibold text-zinc-900">
          {t("student-dialog-edit-title")}
        </h1>
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
            label={t("student-dialog-first-name-label")}
            placeholder={t("student-dialog-first-name-placeholder")}
            value={fields.firstName}
            setValue={setters.firstName}
            error={errors.firstName}
          />
          <TextInput
            id="last-name"
            label={t("student-dialog-last-name-label")}
            placeholder={t("student-dialog-last-name-placeholder")}
            value={fields.lastName}
            setValue={setters.lastName}
            error={errors.lastName}
          />
        </div>
        <CNEInput
          label={t("student-dialog-cne-label")}
          value={fields.cne}
          setValue={setters.cne}
          error={errors.cne}
        />
        <DateInput
          label={t("student-dialog-birthdate-label")}
          value={fields.birthDate}
          setValue={setters.birthDate}
          error={errors.birthDate}
        />
        <SelectInput
          options={groupOptions}
          label={t("student-dialog-group-label")}
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
            {t("cancel")}
          </Button>
          <Button variant="solid" className="flex-1">
            {t("apply")}
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
