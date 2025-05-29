"use client";

import Select from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const { locales } = routing;

export default function LanguageSetting() {
  const t = useTranslations("settings-page");
  const router = useRouter();
  const pathname = usePathname();
  const query = useParams();

  const languageOptions = locales.map((locale) => ({
    id: locale,
    label: t("language", { locale }),
  }));
  const locale = useLocale();
  const setLocale = (locale: Locale) => {
    router.replace({ pathname, query }, { locale });
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="font-semibold text-zinc-900">
          {t("setting-language-label")}
        </h1>
        <p className="font-medium text-gray-500">
          {t("setting-language-description")}
        </p>
      </div>
      <Select
        options={languageOptions}
        value={locale}
        setValue={setLocale}
        className="rounded-full border border-gray-300 px-4"
      />
    </div>
  );
}
