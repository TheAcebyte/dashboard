"use client";

import startSession from "@/actions/session/start-session";
import { getSessionSchema } from "@/actions/session/validation";
import { buttonStyles } from "@/components/ui/button";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import { OptionalUnitInput, TextInput } from "@/components/ui/input";
import useFormAction from "@/hooks/use-form-action";
import { cn } from "@/lib/utils";
import useAttendanceGroupStore from "@/stores/attendance-group-store";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import { CircleAlert, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";

export default function StartSessionDialog() {
  const t = useTranslations("attendance-page");
  return (
    <Dialog id="start-session">
      <DialogTrigger className={cn(buttonStyles.solid, "px-8")}>
        {t("session-dialog-start-title")}
      </DialogTrigger>
      <DialogContent>
        <StartSessionDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function StartSessionDialogContent() {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "StartSessionDialogContent must be placed inside a DialogContent component.",
    );
  }

  const t = useTranslations("attendance-page");
  const { close } = contextValue;
  const { group } = useAttendanceGroupStore();
  const { refetch } = useSessionRefetchStore();
  const sessionSchema = getSessionSchema(t);
  const { handleSubmit, fields, setters, response, errors, reset } =
    useFormAction(startSession, sessionSchema, {
      duration: null,
      lateThreshold: null,
    });

  useEffect(() => {
    setters.group(group);
  }, [group]);

  useEffect(() => {
    if (response?.success) {
      close();
      reset();
      refetch();
    }
  }, [response]);

  return (
    <div className="w-[450px] rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">
          {t("session-dialog-start-title")}
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
        <TextInput
          id="name"
          label={t("session-dialog-name-label")}
          placeholder={t("session-dialog-name-placeholder")}
          value={fields.name}
          setValue={setters.name}
          error={errors.name}
        />
        <OptionalUnitInput
          id="duration"
          label={t("session-dialog-duration-label")}
          unit="min"
          placeholder={t("session-dialog-duration-placeholder")}
          value={fields.duration}
          setValue={setters.duration}
          error={errors.duration}
        />
        <OptionalUnitInput
          id="late-threshold"
          label={t("session-dialog-late-threshold-label")}
          unit="min"
          placeholder={t("session-dialog-late-threshold-placeholder")}
          value={fields.lateThreshold}
          setValue={setters.lateThreshold}
          error={errors.lateThreshold}
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
            {t("start")}
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
