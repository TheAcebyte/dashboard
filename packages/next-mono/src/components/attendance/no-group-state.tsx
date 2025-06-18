import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NoGroupState() {
  const t = await getTranslations("attendance-page");
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex aspect-square items-center rounded-full border border-default-border bg-primary-hover-bg px-6 text-primary-fg">
        <UsersRound size={24} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-primary-fg">
        {t("no-group-title")}
      </h1>
      <p className="mt-1 font-medium text-secondary-fg">{t("no-group-subtitle")}</p>
      <Link
        href="/database/groups"
        className={cn(buttonStyles.solid, "mt-8 px-8")}
      >
        {t("move-to-groups")}
      </Link>
    </div>
  );
}
