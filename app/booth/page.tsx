import Link from "next/link";

export default function BoothPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200 gap-4">
      <h1 className="text-2xl font-bold">Halaman Booth</h1>
      <Link href="/" className="text-blue-600 underline">Kembali ke Home</Link>
    </div>
  );
}
