"use client";

import { formatDateToHHmm } from "@/lib/date";
import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "use-intl";

import { useLongDate } from "./use-long-date";

export function useRelativeDate(date: Date, now: Date | number = Date.now()) {
  const t = useTranslations("date");
  const format = useFormatter();
  const [formattedDate, setFormattedDate] = useState("");
  const formattedLongDate = useLongDate(date);

  useEffect(() => {
    const nowCopy = new Date(now);
    const dateCopy = new Date(date);
    const differenceInMins =
      (nowCopy.getTime() - dateCopy.getTime()) / (1000 * 60);

    nowCopy.setHours(0, 0, 0, 0);
    dateCopy.setHours(0, 0, 0, 0);
    const differenceInDays = Math.floor(
      (nowCopy.getTime() - dateCopy.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (Math.abs(differenceInMins) <= 5) {
      setFormattedDate(format.relativeTime(date, Date.now()));
    } else if (Math.abs(differenceInDays) <= 1) {
      let relativeDay: string;
      if (differenceInDays == 1) {
        relativeDay = t("yesterday");
      } else if (differenceInDays == 0) {
        relativeDay = t("today");
      } else {
        relativeDay = t("tomorrow");
      }
      setFormattedDate(`${relativeDay}, ${formatDateToHHmm(date)}`);
    } else {
      setFormattedDate(formattedLongDate);
    }
  }, [date, now, t, format]);

  return formattedDate;
}
