'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <section className="text-center space-y-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-bounce">
          <Sparkles size={14} />
          <span>SnapBooth Experience 2026</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic text-slate-900">
          Abadikan <br />
          Momenmu dengan <br />
          <span className="text-purple-600 drop-shadow-[0_10px_10px_rgba(147,51,234,0.1)]">SnapBooth</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto italic">
          Gunakan bingkai estetik dari sistem, atau buat bingkai kustom khusus untuk dirimu sendiri.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link href="/booth">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-12 h-20 rounded-full text-2xl font-black shadow-[0_20px_40px_rgba(147,51,234,0.3)] transition-all hover:scale-110 active:scale-95 flex gap-4">
              <Camera size={28} strokeWidth={3} />
              Buka Kamera Sekarang
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" className="border-4 border-purple-600 text-purple-600 bg-white hover:bg-purple-50 px-12 h-20 rounded-full text-2xl font-black transition-all hover:scale-105 active:scale-95 flex gap-4">
              <LayoutGrid size={28} strokeWidth={3} />
              Lihat Template Sistem
            </Button>
          </Link>
        </div>
      </section>

      {/* Decorative Floating Icon */}
      <div className="mt-32 flex justify-center opacity-10">
        <Camera size={200} strokeWidth={0.5} className="text-slate-900 rotate-12" />
      </div>
    </div>
  );
}
