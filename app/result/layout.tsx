import { Navbar } from "@/components/navbar";

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-slate [background-size:24px_24px] font-sans text-slate-900">
      <Navbar />
      <main className="pt-0 pb-0">{children}</main>
    </div>
  );
}
