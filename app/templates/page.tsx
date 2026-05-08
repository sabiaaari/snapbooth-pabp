'use client';

import React from 'react';
import { Image as ImageIcon, ArrowRight, Star, Sparkles, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const router = useRouter();
  
  const systemTemplates = [
    { id: 'kawaii-01', name: "Kawaii 6-Grid", color: "bg-red-100", requiredPhotos: 6 },
    { id: 'ufo-01', name: "ALIEN UFO", color: "bg-lime-100", requiredPhotos: 6, imageUrl: '/frame-ufo.png' },
    { id: 'blue-classic', name: "BLUE CLASSIC", color: "bg-blue-100", requiredPhotos: 4, imageUrl: '/frame-biru.png' },
    { id: 'maroon-retro', name: "MAROON RETRO", color: "bg-red-50", requiredPhotos: 3, imageUrl: '/frame-merah.png' },
  ];

  const handleSelectTemplate = (templateId: string, requiredPhotos: number) => {
    router.push(`/booth?templateId=${templateId}&slots=${requiredPhotos}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20 py-10 font-serif text-y2k-primary">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-y2k-primary rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
          <Sparkles size={14} />
          <span>Curated by SnapBooth</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-heading font-black lowercase text-y2k-primary">
          Template <span className="underline decoration-8">Sistem</span>
        </h2>
        <p className="text-lg text-y2k-primary/60 font-bold leading-relaxed max-w-xl mx-auto">
          Pilih dari koleksi eksklusif kami yang dirancang untuk segala suasana.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {systemTemplates.map((template) => (
          <div key={template.id} className="group relative">
            <div className="aspect-[3/4] border-4 border-y2k-primary rounded-3xl bg-white shadow-[12px_12px_0_0_#2F020C] overflow-hidden flex flex-col transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-1">
              <div className={`flex-1 ${template.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]"></div>
                <ImageIcon size={80} strokeWidth={1} className="text-y2k-primary/10 group-hover:scale-125 transition-transform duration-700" />
                
                {/* SLOT BADGE */}
                <div className="absolute bottom-6 right-6 bg-white border-2 border-y2k-primary px-4 py-2 rounded-2xl shadow-[4px_4px_0_0_#2F020C] flex items-center gap-2 transform -rotate-3 group-hover:rotate-0 transition-transform">
                  <Camera size={14} className="text-y2k-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter">{template.requiredPhotos} Klip Foto</span>
                </div>

                <div className="absolute top-8 left-8 bg-y2k-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg border-2 border-white">
                  <Star size={10} fill="currentColor" /> OFFICIAL
                </div>
              </div>
              <div className="p-8 bg-white border-t-4 border-y2k-primary flex flex-col gap-6">
                <span className="font-heading font-black text-3xl text-y2k-primary lowercase">{template.name}</span>
                <Button 
                  onClick={() => handleSelectTemplate(template.id, template.requiredPhotos)}
                  className="w-full h-14 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white font-black text-sm tracking-widest uppercase border-2 border-y2k-shadow shadow-[4px_4px_0_0_#2F020C] transition-all active:scale-95"
                >
                  Gunakan Template Ini
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
