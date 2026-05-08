'use client';

import React from 'react';
import { Image as ImageIcon, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TemplatesPage() {
  const systemTemplates = [
    { id: 1, name: "Classic White", color: "bg-white" },
    { id: 2, name: "Retro Film", color: "bg-amber-50" },
    { id: 3, name: "Neon Party", color: "bg-indigo-900" },
    { id: 4, name: "Soft Pastel", color: "bg-pink-50" },
    { id: 5, name: "Tech Noir", color: "bg-slate-900" },
    { id: 6, name: "Nature Green", color: "bg-emerald-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20 py-10 font-serif text-[#5D0E11]">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-[#5D0E11] rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border-2 border-[#5D0E11]">
          <Sparkles size={14} />
          <span>Curated by SnapBooth</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-script lowercase text-[#5D0E11]">
          Template <span className="underline decoration-8">Sistem</span>
        </h1>
        <p className="text-lg text-[#5D0E11]/60 font-bold leading-relaxed max-w-xl mx-auto">
          Pilih dari koleksi eksklusif kami yang dirancang untuk segala suasana.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {systemTemplates.map((template) => (
          <div key={template.id} className="group relative">
            <div className="aspect-[3/4] border-4 border-[#5D0E11] rounded-3xl bg-white shadow-[12px_12px_0px_0px_rgba(93,14,17,1)] overflow-hidden flex flex-col transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-1">
              <div className={`flex-1 ${template.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]"></div>
                <ImageIcon size={80} strokeWidth={1} className="text-[#5D0E11]/10 group-hover:scale-125 transition-transform duration-700" />
                
                <div className="absolute top-8 left-8 bg-[#5D0E11] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg border-2 border-white">
                  <Star size={10} fill="currentColor" /> OFFICIAL
                </div>
              </div>
              <div className="p-8 bg-white border-t-4 border-[#5D0E11] flex flex-col gap-6">
                <span className="font-script text-3xl text-[#5D0E11] lowercase">{template.name}</span>
                <Link href="/booth">
                  <Button className="w-full h-14 rounded-full bg-[#5D0E11] hover:bg-[#3d0a0c] text-white font-black text-sm tracking-widest uppercase border-2 border-[#5D0E11] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all active:scale-95">
                    Gunakan Template Ini
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
