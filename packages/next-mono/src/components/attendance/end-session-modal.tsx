"use client";

import endSession from "@/actions/session/end-session";
import Button, { buttonStyles } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import useFormAction from "@/hooks/use-form-action";
import { cn } from "@/lib/utils";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import { AlertTriangle, CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";
import { z } from "zod";

interface Props {
  sessionId: string;
}

export default function EndSessionDialog({ sessionId }: Props) {
  const t = useTranslations("attendance-page");
  return (
    <Dialog id="end-session" className="mt-8 w-full">
      <DialogTrigger className={cn(buttonStyles.solid, "w-full px-8")}>
        {t("session-dialog-end-title")}
      </DialogTrigger>
      <DialogContent>
        <EndSessionDialogContent sessionId={sessionId} />
      </DialogContent>
    </Dialog>
  );
}

function EndSessionDialogContent({ sessionId }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "EndSessionDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("attendance-page");
  const { close } = contextValue;
  const { refetch } = useSessionRefetchStore();
  const endThisSession = endSession.bind(null, sessionId, true);
  const { handleSubmit, response } = useFormAction(
    endThisSession,
    z.object({}),
  );

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  return (
    <div className="flex w-[375px] flex-col items-center rounded-2xl border border-default-border bg-primary-bg p-8">
      <div className="flex aspect-square items-center rounded-full border border-default-border bg-primary-hover-bg px-6 text-primary-fg">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-primary-fg">
        {t("session-dialog-end-title")}
      </h1>
      <p className="mt-1 text-center font-medium text-secondary-fg">
        {t("session-dialog-end-confirm")}
      </p>
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
          <Button variant="solid" className="flex-1">
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
