import { Navbar } from "@/components/navbar";

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] font-sans text-slate-900">
      <Navbar />
      <main className="pt-32 pb-20">{children}</main>
    </div>
  );
}
