"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "use-intl";

export function useRelativeDate(date: Date) {
  const t = useTranslations("date");
  const format = useFormatter();
  const nowRef = useRef(Date.now());
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date(nowRef.current);
    const input = new Date(date);
    now.setHours(0, 0, 0, 0);
    input.setHours(0, 0, 0, 0);
    const differenceInMs = now.getTime() - input.getTime();
    const differenceInMins = differenceInMs / (1000 * 60);
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    if (Math.abs(differenceInMins) <= 5) {
    } else if (Math.abs(differenceInDays) <= 1) {
    } else {
    }
  }, [date, t, format]);

  return formattedDate;
}
