"use client";

import excuseStudent from "@/actions/session/excuse-student";
import { getExcuseStudentSchema } from "@/actions/session/validation";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import { MessageInput } from "@/components/ui/input";
import type { PaginatedSessionStudentRecord } from "@/db/queries/sessions";
import useFormAction from "@/hooks/use-form-action";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import { CircleAlert, Eraser, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";

interface Props {
  record: PaginatedSessionStudentRecord;
}

export default function ExcuseStudentDialog({ record }: Props) {
  const t = useTranslations("attendance-page");
  return (
    <Dialog id={`excuse-student-${record.studentId}`} className="w-full">
      <DialogTrigger className="flex w-full cursor-pointer items-center gap-4 bg-primary-bg px-4 py-2 font-medium text-primary-fg transition-colors hover:bg-primary-hover-bg hover:text-primary-hover-fg">
        <Eraser size={20} />
        {t("excuse")}
      </DialogTrigger>
      <DialogContent>
        <ExcuseStudentDialogContent record={record} />
      </DialogContent>
    </Dialog>
  );
}

function ExcuseStudentDialogContent({ record }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "ExcuseStudentDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("attendance-page");
  const { close } = contextValue;
  const { refetch } = useSessionRefetchStore();
  const excuseThisStudent = excuseStudent.bind(
    null,
    record.sessionId,
    record.studentId,
  );
  const excuseStudentSchema = getExcuseStudentSchema(t);
  const { handleSubmit, fields, setters, response, errors } = useFormAction(
    excuseThisStudent,
    excuseStudentSchema,
    {
      excuse: record.excuse ?? "",
    },
  );

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  return (
    <div className="w-[400px] rounded-2xl border border-default-border bg-primary-bg">
      <header className="flex items-center justify-between border-b border-default-border px-8 py-4">
        <h1 className="text-xl font-semibold text-primary-fg">
          {t("student-dialog-excuse-title")}
        </h1>
        <X
          className="cursor-pointer text-primary-fg hover:text-primary-hover-fg"
          onClick={close}
        />
      </header>
      <form className="flex flex-col items-center p-8" onSubmit={handleSubmit}>
        <MessageInput
          id="excuse"
          label={t("student-dialog-excuse-label")}
          placeholder={t("student-dialog-excuse-placeholder")}
          value={fields.excuse}
          setValue={setters.excuse}
          error={errors.excuse}
        />
        <div className="mt-12 flex w-full gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={close}
          >
            {t("cancel")}
          </Button>
          <Button variant="solid" className="flex-1">
            {t("excuse")}
          </Button>
        </div>
        {response && !response.success && (
          <div className="mt-4 flex items-center gap-2 font-medium text-destructive-fg">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
