import DatabaseTabSelector from "@/components/database-tab-selector";

export default function Page() {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="groups" />
    </div>
  );
}
