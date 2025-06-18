import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/database/students" className="flex items-center gap-4">
      <Image src="/logo.svg" alt="" width={32} height={32} />
      <span className="flex text-lg font-medium">
        <h1 className="text-primary-fg">dash</h1>
        <h1 className="text-secondary-fg">board</h1>
      </span>
    </Link>
  );
}
