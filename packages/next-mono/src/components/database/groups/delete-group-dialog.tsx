"use client";

import deleteGroup from "@/actions/group/delete-group";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import type { PaginatedGroupRecord } from "@/db/queries/groups";
import useFormAction from "@/hooks/use-form-action";
import { cn } from "@/lib/utils";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { AlertTriangle, CircleAlert, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";
import { z } from "zod";

interface Props {
  record: PaginatedGroupRecord;
}

export default function DeleteGroupDialog({ record }: Props) {
  const t = useTranslations("database-page");
  return (
    <Dialog id={`delete-group-${record.groupId}`} className="w-full">
      <DialogTrigger className="flex w-full cursor-pointer items-center gap-4 bg-primary-bg px-4 py-2 font-medium text-destructive-fg transition-colors hover:bg-primary-hover-bg hover:text-destructive-hover-fg-500">
        <Trash2 size={20} />
        {t("delete")}
      </DialogTrigger>
      <DialogContent>
        <DeleteGroupDialogContent record={record} />
      </DialogContent>
    </Dialog>
  );
}

function DeleteGroupDialogContent({ record }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "DeleteGroupDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("database-page");
  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const deleteThisGroup = deleteGroup.bind(null, record.groupId);
  const { handleSubmit, response } = useFormAction(
    deleteThisGroup,
    z.object({}),
  );

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  const isEmptyGroup = record.studentCount == 0;
  const message = isEmptyGroup
    ? t("group-dialog-delete-confirm")
    : t("group-dialog-delete-nonempty");

  return (
    <div className="flex w-[375px] flex-col items-center rounded-2xl border border-default-border bg-primary-bg p-8">
      <div className="flex aspect-square items-center rounded-full border border-default-border bg-primary-hover-bg px-6 text-primary-fg">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-primary-fg">
        {t("group-dialog-delete-title")}
      </h1>
      <p className="mt-1 text-center font-medium text-secondary-fg">{message}</p>
      <form className="mt-8 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4 self-stretch">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={close}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="solid"
            className={cn(
              "flex-1",
              !isEmptyGroup && "pointer-events-none bg-emphasis-fg",
            )}
          >
            {t("confirm")}
          </Button>
        </div>
        {response && !response.success && (
          <div className="mx-auto flex items-center gap-2 font-medium text-destructive-fg">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
