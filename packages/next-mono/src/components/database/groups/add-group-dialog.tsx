"use client";

import addGroup from "@/actions/group/add-group";
import { getGroupSchema } from "@/actions/group/validation";
import { buttonStyles } from "@/components/ui/button";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/input";
import useFormAction from "@/hooks/use-form-action";
import { cn } from "@/lib/utils";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { CircleAlert, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";

export default function AddGroupDialog() {
  const t = useTranslations("database-page");

  return (
    <Dialog id="add-group">
      <DialogTrigger
        className={cn(buttonStyles.solid, "flex h-full items-center gap-2")}
      >
        <p className="hidden lg:block">{t("add")}</p>
        <Plus />
      </DialogTrigger>
      <DialogContent>
        <AddGroupDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function AddGroupDialogContent() {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "AddGroupDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("database-page");
  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const groupSchema = getGroupSchema(t);
  const { handleSubmit, fields, setters, response, errors, reset } =
    useFormAction(addGroup, groupSchema);

  useEffect(() => {
    if (response?.success) {
      close();
      reset();
      refetch();
    }
  }, [response]);

  return (
    <div className="w-[400px] rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Add Group</h1>
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
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
        <div className="mt-12 flex gap-4 self-stretch">
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
          <div className="mt-8 flex items-center gap-2 font-medium text-red-700">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
