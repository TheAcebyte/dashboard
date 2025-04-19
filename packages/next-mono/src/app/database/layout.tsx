export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="mt-16 flex-1 px-8 sm:px-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Database</h1>
        <p className="font-medium text-gray-500">
          View and manage the system database.
        </p>
      </div>
      {children}
    </section>
  );
}
