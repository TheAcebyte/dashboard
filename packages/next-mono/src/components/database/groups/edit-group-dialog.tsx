"use client";

import editGroup from "@/actions/group/edit-group";
import { getGroupSchema } from "@/actions/group/validation";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/input";
import type { PaginatedGroupRecord } from "@/db/queries/groups";
import useFormAction from "@/hooks/use-form-action";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { CircleAlert, Pencil, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";

interface Props {
  record: PaginatedGroupRecord;
}

export default function EditGroupDialog({ record }: Props) {
  const t = useTranslations("database-page");
  return (
    <Dialog id={`edit-group-${record.groupId}`} className="w-full">
      <DialogTrigger className="flex w-full cursor-pointer items-center gap-4 bg-primary-bg px-4 py-2 font-medium text-primary-fg transition-colors hover:bg-primary-hover-bg hover:text-primary-hover-fg">
        <Pencil size={20} />
        {t("edit")}
      </DialogTrigger>
      <DialogContent>
        <EditGroupDialogContent record={record} />
      </DialogContent>
    </Dialog>
  );
}

function EditGroupDialogContent({ record }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "EditGroupDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("database-page");
  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const editThisGroup = editGroup.bind(null, record.groupId);
  const groupSchema = getGroupSchema(t);
  const { handleSubmit, fields, setters, response, errors } = useFormAction(
    editThisGroup,
    groupSchema,
    { name: record.name },
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
          {t("group-dialog-edit-title")}
        </h1>
        <X
          className="cursor-pointer text-primary-fg hover:text-primary-hover-fg"
          onClick={close}
        />
      </header>
      <form className="flex flex-col items-center p-8" onSubmit={handleSubmit}>
        <TextInput
          id="name"
          label={t("group-dialog-name-label")}
          placeholder={t("group-dialog-name-placeholder")}
          value={fields.name}
          setValue={setters.name}
          error={errors.name}
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
            {t("apply")}
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
