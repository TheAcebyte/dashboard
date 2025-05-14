"use client";

import excuseStudent from "@/actions/session/excuse-student";
import { excuseStudentSchema } from "@/actions/session/validation";
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
import { useContext, useEffect } from "react";

interface Props {
  record: PaginatedSessionStudentRecord;
}

export default function ExcuseStudentDialog({ record }: Props) {
  return (
    <Dialog id={`excuse-student-${record.studentId}`} className="w-full">
      <DialogTrigger className="flex w-full cursor-pointer items-center gap-4 bg-white px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-gray-50 hover:text-zinc-700">
        <Eraser size={20} />
        Excuse
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

  const { close } = contextValue;
  const { refetch } = useSessionRefetchStore();
  const excuseThisStudent = excuseStudent.bind(
    null,
    record.sessionId,
    record.studentId,
  );
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
    <div className="w-[400px] rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Excuse Student</h1>
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
          onClick={close}
        />
      </header>
      <form className="flex flex-col items-center p-8" onSubmit={handleSubmit}>
        <MessageInput
          id="excuse"
          label="Excuse"
          placeholder="Student excuse"
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
            Cancel
          </Button>
          <Button variant="solid" className="flex-1">
            Excuse
          </Button>
        </div>
        {response && !response.success && (
          <div className="mt-4 flex items-center gap-2 font-medium text-red-700">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
