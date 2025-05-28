import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Logo() {
  return (
    <Link href="/database/students" className="flex items-center gap-4">
      <Image src="/logo.svg" alt="" width={32} height={32} />
      <span className="flex text-lg font-medium">
        <h1 className="text-zinc-900">dash</h1>
        <h1 className="text-gray-500">board</h1>
      </span>
    </Link>
  );
}
