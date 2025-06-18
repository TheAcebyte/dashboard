"use client";

import Switch from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/settings-store";
import { useTranslations } from "next-intl";

export default function NotificationsSetting() {
  const t = useTranslations("settings-page");
  const { enabledNotifications, toggleNotifications } = useSettingsStore();

  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="font-semibold text-primary-fg">
          {t("setting-notifications-label")}
        </h1>
        <p className="font-medium text-secondary-fg">
          {t("setting-notifications-description")}
        </p>
      </div>
      <Switch enabled={enabledNotifications} toggle={toggleNotifications} />
    </div>
  );
}
