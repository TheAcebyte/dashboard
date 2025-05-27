"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useFormatter } from "use-intl";
import type { Locale } from "use-intl";

export function useLongDate(date: Date) {
  const locale = useLocale();
  const format = useFormatter();
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const getOrdinalSuffix = (value: number, locale: Locale) => {
      if (locale == "en") {
        if (value != 11 && value % 10 == 1) return "st";
        if (value != 12 && value % 10 == 2) return "nd";
        if (value != 13 && value % 10 == 3) return "rd";
        return "th";
      } else if (locale == "fr") {
        return "";
      }
    };

    const day = date.getDate();
    const month = format.dateTime(date, { month: "short" });
    const year = date.getFullYear();
    if (locale == "en") {
      const ordinalSuffix = getOrdinalSuffix(day, locale);
      setFormattedDate(`${month} ${day}${ordinalSuffix}, ${year}`);
    } else if (locale == "fr") {
      setFormattedDate(`${day} ${month} ${year}`);
    }
  }, [date, locale, format]);

  return formattedDate;
}
