import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex gap-4 items-center">
      <Image src="/logo.svg" alt="" width={32} height={32} />
      <span className="flex text-lg font-medium">
        <h1 className="text-zinc-900">dash</h1>
        <h1 className="text-gray-500">board</h1>
      </span>
    </div>
  );
}
