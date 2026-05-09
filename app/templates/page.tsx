'use client';

import React from 'react';
import { Image as ImageIcon, ArrowRight, Star, Sparkles, Camera, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TemplatesPage() {
  const router = useRouter();
  
  const systemTemplates = [
    { id: 'blue-classic', name: "BLUE CLASSIC", color: "bg-blue-50", requiredPhotos: 4, imageUrl: '/frame-biru.png', category: 'Popular' },
    { id: 'maroon-retro', name: "MAROON RETRO", color: "bg-red-50", requiredPhotos: 3, imageUrl: '/frame-merah.png', category: 'Classic' },
    { id: 'kawaii-01', name: "KAWAII GRID", color: "bg-pink-50", requiredPhotos: 6, imageUrl: '/frame-kawaii.png', category: 'New' },
    { id: 'ufo-01', name: "ALIEN UFO", color: "bg-lime-50", requiredPhotos: 6, imageUrl: '/frame-ufo.png', category: 'Hot' },
  ];

  const handleSelectTemplate = (templateId: string, requiredPhotos: number) => {
    router.push(`/booth?templateId=${templateId}&slots=${requiredPhotos}`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-8 md:px-12 lg:px-16 space-y-20 py-10 font-serif text-y2k-primary">
      <header className="text-center space-y-6 max-w-3xl mx-auto pt-20">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-y2k-primary rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
          <Sparkles size={14} />
          <span>Curated by SnapBooth</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-heading font-black lowercase text-y2k-primary">
          system <span className="underline decoration-8">templates</span>
        </h2>
        <p className="text-lg text-y2k-primary/60 font-bold leading-relaxed max-w-xl mx-auto">
          Choose from our exclusive collection designed for every mood.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {systemTemplates.map((template) => (
          <div 
            key={template.id} 
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border-4 border-y2k-primary bg-white transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#2F020C] cursor-pointer"
            onClick={() => handleSelectTemplate(template.id, template.requiredPhotos)}
          >
            {/* THUMBNAIL AREA */}
            <div className={`relative aspect-[3/4] ${template.color} flex items-center justify-center overflow-hidden p-8 border-b-4 border-y2k-primary`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
              
              <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                <Image 
                  src={template.imageUrl}
                  alt={template.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* CATEGORY BADGE */}
              <div className="absolute top-6 left-6 bg-y2k-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border-2 border-white shadow-md">
                <Zap size={8} fill="currentColor" /> {template.category}
              </div>

              {/* SLOT BADGE */}
              <div className="absolute bottom-6 right-6 bg-white border-2 border-y2k-primary px-3 py-1 rounded-xl shadow-[2px_2px_0_0_#2F020C] flex items-center gap-1.5 transform -rotate-2">
                <Camera size={10} className="text-y2k-primary" />
                <span className="text-[10px] font-black uppercase tracking-tight">{template.requiredPhotos} Slots</span>
              </div>
            </div>

            {/* INFO AREA */}
            <div className="p-6 flex flex-col gap-4 bg-white flex-1 justify-between">
              <div className="space-y-1">
                <h3 className="font-heading font-black text-2xl text-y2k-primary lowercase tracking-tight">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1 text-[8px] font-black text-y2k-primary/40 uppercase tracking-widest">
                  <Star size={8} fill="currentColor" /> Official SnapBooth Asset
                </div>
              </div>
              
              <Button 
                className="w-full h-12 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white font-black text-xs tracking-widest uppercase border-2 border-y2k-shadow shadow-[4px_4px_0_0_#2F020C] transition-all active:scale-95 group-hover:bg-y2k-accent"
              >
                Use This Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
