export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative flex-1 px-8 py-16 gap-16 sm:px-16 flex flex-col">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Attendance</h1>
        <p className="font-medium text-gray-500">
          Track attendance and view history.
        </p>
      </div>
      {children}
    </section>
  );
}
