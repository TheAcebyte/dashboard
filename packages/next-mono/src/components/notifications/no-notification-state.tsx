import { BellOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoNotificationState() {
  const t = useTranslations("notifications");
  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <BellOff size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-zinc-900">
        {t("no-notification-title")}
      </h1>
      <p className="mt-1 font-medium text-gray-500">
        {t("no-notification-subtitle")}
      </p>
    </div>
  );
}
