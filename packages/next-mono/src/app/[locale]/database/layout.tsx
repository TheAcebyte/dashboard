import { getTranslations } from "next-intl/server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("database-page");

  return (
    <main className="relative flex-1 px-8 py-16 sm:px-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">{t("title")}</h1>
        <p className="font-medium text-gray-500">{t("subtitle")}</p>
      </div>
      {children}
    </main>
  );
}
