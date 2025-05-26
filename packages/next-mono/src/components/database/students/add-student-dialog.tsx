"use client";

import addStudent from "@/actions/student/add-student";
import { getStudentSchema } from "@/actions/student/validation";
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
import useFetch from "@/hooks/use-fetch";
import useFormAction from "@/hooks/use-form-action";
import { fetchGroupOptions } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { CircleAlert, Plus, UsersRound, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useContext, useEffect } from "react";

export default function AddStudentDialog() {
  const t = useTranslations("database-page");
  return (
    <Dialog id="add-student">
      <DialogTrigger
        className={cn(buttonStyles.solid, "flex h-full items-center gap-2")}
      >
        {t("add")}
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

  const t = useTranslations("database-page");
  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const { data: groupOptions } = useFetch(fetchGroupOptions);
  const studentSchema = getStudentSchema(t);
  const { handleSubmit, fields, setters, response, errors, reset } =
    useFormAction(addStudent, studentSchema);

  useEffect(() => {
    if (response?.success) {
      close();
      reset();
      refetch();
    }
  }, [response]);

  if (!groupOptions) return null;
  if (groupOptions.length == 0) return <NoGroupState />;
  return (
    <div className="rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">
          {t("student-dialog-add-title")}
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
            {t("add")}
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

function NoGroupState() {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "AddStudentDialogContent must be placed inside a DialogContent component.",
    );
  }

  const { close } = contextValue;
  return (
    <div className="flex w-[400px] flex-col items-center rounded-2xl border border-gray-300 bg-white p-8">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <UsersRound size={24} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">
        No Groups Found
      </h1>
      <p className="mt-1 font-medium text-gray-500">
        Create your first group to continue.
      </p>
      <div className="mt-8 flex w-full gap-4">
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
        <Link
          href="/database/groups"
          className={cn(buttonStyles.solid, "flex-1")}
        >
          Move to Groups
        </Link>
      </div>
    </div>
  );
}
