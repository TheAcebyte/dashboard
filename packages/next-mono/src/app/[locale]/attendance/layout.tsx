import { getTranslations } from "next-intl/server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("attendance-page");
  return (
    <main className="relative flex flex-1 flex-col gap-16 px-8 py-16 sm:px-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary-fg">{t("title")}</h1>
        <p className="font-medium text-secondary-fg">{t("subtitle")}</p>
      </div>
      {children}
    </main>
  );
}
