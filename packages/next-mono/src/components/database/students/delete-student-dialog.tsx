"use client";

import deleteStudent from "@/actions/student/delete-student";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import { PaginatedStudentRecord } from "@/db/queries/students";
import useFormAction from "@/hooks/use-form-action";
import { useDataRefetchStore } from "@/stores/data-refetch-store";
import { AlertTriangle, CircleAlert, Trash2, X } from "lucide-react";
import { useContext, useEffect } from "react";
import { z } from "zod";

interface Props {
  record: PaginatedStudentRecord;
}

export default function DeleteStudentDialog({ record }: Props) {
  return (
    <Dialog id={`delete-student-${record.studentId}`} className="w-full">
      <DialogTrigger className="flex w-full cursor-pointer items-center gap-4 bg-white px-4 py-2 font-medium text-red-700 transition-colors hover:bg-gray-50 hover:text-red-500">
        <Trash2 size={20} />
        Delete
      </DialogTrigger>
      <DialogContent>
        <DeleteStudentDialogContent record={record} />
      </DialogContent>
    </Dialog>
  );
}

function DeleteStudentDialogContent({ record }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "DeleteStudentDialogContent must be placed inside a DialogContent component.",
    );
  }

  const { close } = contextValue;
  const { refetch } = useDataRefetchStore();
  const deleteThisStudent = deleteStudent.bind(null, record.studentId);
  const { handleSubmit, response } = useFormAction(
    deleteThisStudent,
    z.object({}),
  );

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  return (
    <div className="flex w-[400px] flex-col items-center rounded-2xl border border-gray-300 bg-white p-8">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">
        Delete Student
      </h1>
      <p className="mt-1 text-center font-medium text-gray-500">
        Are you sure you want to delete this student?
      </p>
      <form className="mt-8 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={close}
          >
            Cancel
          </Button>
          <Button variant="solid" className="flex-1">
            Confirm
          </Button>
        </div>
        {response && !response.success && (
          <div className="mx-auto flex items-center gap-2 font-medium text-red-700">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
