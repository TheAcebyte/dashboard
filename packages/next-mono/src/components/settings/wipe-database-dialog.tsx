"use client";

import wipeDatabase from "@/actions/database/wipe-database";
import Button, { buttonStyles } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import useFormAction from "@/hooks/use-form-action";
import { cn } from "@/lib/utils";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { AlertTriangle, CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";
import { z } from "zod";

export default function WipeDatabaseDialog() {
  const t = useTranslations("settings-page");
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="font-semibold text-primary-fg">
          {t("wipe-database-label")}
        </h1>
        <p className="font-medium text-secondary-fg">
          {t("wipe-database-description")}
        </p>
      </div>
      <Dialog id="wipe-database">
        <DialogTrigger
          className={cn(buttonStyles.destructive, "flex items-center")}
        >
          {t("wipe-database-button")}
        </DialogTrigger>
        <DialogContent>
          <WipeDatabaseDialogContent />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WipeDatabaseDialogContent() {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "WipeDatabaseDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("settings-page");
  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();
  const { handleSubmit, response } = useFormAction(wipeDatabase, z.object({}));

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  return (
    <div className="flex w-[400px] flex-col items-center rounded-2xl border border-default-border bg-primary-bg p-8">
      <div className="flex aspect-square items-center rounded-full border border-destructive-border bg-destructive-bg px-6 text-destructive-fg">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-primary-fg">
        {t("wipe-database-dialog-title")}
      </h1>
      <p className="mt-1 text-center font-medium text-secondary-fg">
        {t("wipe-database-dialog-confirm")}
      </p>
      <form className="mt-8 flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={close}
          >
            {t("cancel")}
          </Button>
          <Button variant="destructive" className="flex-1">
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
