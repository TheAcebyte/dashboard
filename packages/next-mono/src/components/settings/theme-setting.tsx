"use client";

import Select from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

export default function ThemeSetting() {
  const t = useTranslations("settings-page");
  const { themes, theme, setTheme } = useTheme();
  const themeOptions = themes.map((theme) => ({
    id: theme,
    label: t(theme as Theme),
  }));

  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="font-semibold text-zinc-900">
          {t("setting-theme-label")}
        </h1>
        <p className="font-medium text-gray-500">
          {t("setting-theme-description")}
        </p>
      </div>
      {theme && (
        <Select
          options={themeOptions}
          value={theme}
          setValue={setTheme}
          className="rounded-full border border-gray-300 px-4"
        />
      )}
    </div>
  );
}
