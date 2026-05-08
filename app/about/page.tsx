'use client';

import React from 'react';
import { Camera, Sparkles, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const steps = [
    {
      icon: <LayoutGrid className="text-purple-600" size={32} />,
      title: "Pilih Template",
      description: "Pilih dari koleksi template sistem kami yang estetik atau buat desain kustom Anda sendiri di Studio."
    },
    {
      icon: <Camera className="text-purple-600" size={32} />,
      title: "Siapkan Kamera",
      description: "Berikan izin akses kamera dan posisikan diri Anda di depan layar dengan pencahayaan yang baik."
    },
    {
      icon: <Zap className="text-purple-600" size={32} />,
      title: "Jepret & Bagikan",
      description: "Tekan tombol shutter untuk mengambil foto, terapkan bingkai, dan unduh hasilnya secara instan."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 py-10">
      {/* Hero Section */}
      <header className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
          <Info size={14} />
          <span>Informasi Aplikasi</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
          Tentang <span className="text-purple-600">SnapBooth</span>
        </h1>
        <p className="text-xl text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto">
          SnapBooth adalah platform photobooth virtual modern yang dirancang untuk memberikan pengalaman fotografi yang seru dan personal langsung dari browser Anda.
        </p>
      </header>

      {/* How to Use Section */}
      <section className="space-y-16">
        <div className="text-center">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Cara Penggunaan</h2>
            <div className="h-1.5 w-24 bg-purple-600 rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
                <div key={index} className="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 group hover:border-purple-600 transition-all">
                    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                        {step.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">{step.title}</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">{step.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Features Detail */}
      <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                    Keamanan & <br />
                    <span className="text-purple-400">Privasi Anda</span>
                </h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <ShieldCheck className="text-purple-400 shrink-0" size={28} />
                        <p className="text-slate-400 font-bold text-lg leading-relaxed">
                            <span className="text-white">Aset Pribadi:</span> Frame yang Anda buat bersifat privat dan hanya dapat diakses oleh Anda di Studio Frame Pribadi.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Sparkles className="text-purple-400 shrink-0" size={28} />
                        <p className="text-slate-400 font-bold text-lg leading-relaxed">
                            <span className="text-white">Tanpa Instalasi:</span> SnapBooth berjalan sepenuhnya di browser tanpa perlu menginstal aplikasi tambahan.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 space-y-8 text-center">
                <p className="text-2xl font-black italic">Siap untuk mulai menjepret?</p>
                <Link href="/booth" className="block">
                    <Button className="w-full bg-white text-slate-900 hover:bg-purple-100 h-20 rounded-full text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex gap-4 justify-center">
                        <Camera size={28} strokeWidth={3} />
                        BUKA KAMERA
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}

// Simple LayoutGrid for use in about page
function LayoutGrid({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}
