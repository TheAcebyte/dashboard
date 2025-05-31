import { BellOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoNotificationState() {
  const t = useTranslations("notifications");
  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex aspect-square items-center rounded-full border border-default-border bg-primary-hover-bg px-6 text-primary-fg">
        <BellOff size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-primary-fg">
        {t("no-notification-title")}
      </h1>
      <p className="mt-1 font-medium text-secondary-fg">
        {t("no-notification-subtitle")}
      </p>
    </div>
  );
}
