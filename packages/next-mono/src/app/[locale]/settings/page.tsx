import LanguageSetting from "@/components/settings/language-setting";
import NotificationsSetting from "@/components/settings/notifications-setting";
import ThemeSetting from "@/components/settings/theme-setting";
import WipeDatabaseDialog from "@/components/settings/wipe-database-dialog";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("settings-page");

  return (
    <main className="relative flex-1 px-8 py-16 sm:px-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">{t("title")}</h1>
        <p className="font-medium text-gray-500">{t("subtitle")}</p>
      </div>
      <div className="mt-16 flex flex-col gap-8">
        <h1 className="w-full border-b border-gray-300 py-4 text-xl font-semibold text-zinc-900">
          {t("preferences")}
        </h1>
        <div className="flex flex-col gap-8">
          <NotificationsSetting />
          <LanguageSetting />
          <ThemeSetting />
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-8">
        <h1 className="w-full border-b border-red-100 py-4 text-xl font-semibold text-red-700">
          {t("danger-zone")}
        </h1>
        <div>
          <WipeDatabaseDialog />
        </div>
      </div>
    </main>
  );
}
