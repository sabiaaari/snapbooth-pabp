'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Layers, Share2, ArrowLeft, Sparkles, Check, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FrameTemplate } from '../booth/page';

export default function ResultPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [template, setTemplate] = useState<FrameTemplate | null>(null);
  const [filter, setFilter] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedPhotos = localStorage.getItem('sessionPhotos');
    const savedTemplate = localStorage.getItem('selectedTemplate');
    
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedTemplate) setTemplate(JSON.parse(savedTemplate));
  }, []);

  const handleDownload = () => {
    if (photos.length === 0) return;
    // Basic download for now - in a real app we'd use html2canvas or merge on canvas
    const link = document.createElement('a');
    link.href = photos[0]; 
    link.download = `SnapBooth-Result-${Date.now()}.png`;
    link.click();
  };

  const filters = [
    { name: 'Original', class: '' },
    { name: 'B&W', class: 'grayscale' },
    { name: 'Retro', class: 'sepia contrast-125' },
    { name: 'Vivid', class: 'saturate-150 contrast-110' },
  ];

  if (!isMounted) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col justify-center items-center gap-4 text-[#5D0E11]">
        <RefreshCw className="animate-spin" size={48} />
        <p className="font-serif font-black uppercase tracking-widest text-sm text-[#5D0E11]/40">Memuat Masterpiece...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center gap-8 font-serif">
        <div className="bg-white p-12 rounded-3xl border-4 border-[#5D0E11] shadow-[12px_12px_0px_0px_rgba(93,14,17,1)] text-center space-y-6 max-w-lg w-full">
          <div className="bg-[#FDF2F2] w-24 h-24 rounded-full flex items-center justify-center mx-auto text-[#5D0E11]/20 border-2 border-[#5D0E11]">
            <ImageIcon size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-script text-[#5D0E11] lowercase tracking-tighter">Sesi Kosong!</h2>
            <p className="text-[#5D0E11]/60 font-bold leading-relaxed">Sepertinya kamu belum melakukan sesi pemotretan atau datamu telah terhapus.</p>
          </div>
          <Link href="/booth" className="block w-full">
            <Button className="w-full bg-[#5D0E11] hover:bg-[#3d0a0c] text-white h-16 rounded-full font-serif font-black text-lg gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-[#5D0E11]">
              <Camera size={24} />
              MULAI MENJEPRET
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col items-center gap-12 font-serif text-[#5D0E11]">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-[#5D0E11] rounded-full text-xs font-black uppercase tracking-widest border-2 border-[#5D0E11]">
            <Sparkles size={14} />
            <span>Masterpiece Ready</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-script lowercase leading-none text-[#5D0E11]">
            Hasil <span className="underline decoration-8">Komposisi</span>
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: COMPOSITE AREA (STENCIL TECHNIQUE) */}
        <div className="lg:col-span-8 flex flex-col items-center w-full">
            <div className="relative group">
                <div className="absolute -inset-4 bg-[#5D0E11]/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                {/* THE MASTERPIECE WRAPPER - Tanpa Filter */}
                <div 
                    ref={resultRef}
                    className="relative w-[320px] sm:w-[400px] aspect-[4/5] mx-auto bg-white overflow-hidden flex-shrink-0 shadow-[16px_16px_0px_0px_rgba(93,14,17,1)] border-4 border-[#5D0E11] rounded-2xl"
                >
                    {/* LAPISAN BAWAH (GRID FOTO) - FILTER DITERAPKAN DI SINI */}
                    <div className={`absolute inset-0 z-10 grid grid-cols-2 grid-rows-3 gap-3 pt-[14%] pb-[16%] px-[6%] transition-all duration-700 ${filter}`}>
                        {photos.map((photo, i) => (
                            <div key={i} className="relative w-full h-full bg-slate-100 overflow-hidden rounded-sm">
                                <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt={`Foto ${i}`} />
                            </div>
                        ))}
                    </div>

                    {/* LAPISAN ATAS (FRAME OVERLAY) - BEBAS FILTER */}
                    {template && (
                        <img 
                            src={template.imageUrl} 
                            className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" 
                            alt="Frame" 
                        />
                    )}
                </div>

                {/* Floating Success Badge */}
                <div className="absolute -top-4 -right-4 bg-[#5D0E11] text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transform rotate-12 z-30">
                    <Check size={32} strokeWidth={4} />
                </div>
            </div>

            {/* Studio Info Label */}
            <div className="mt-8 text-center">
                <p className="text-sm font-black tracking-[0.3em] text-[#5D0E11] uppercase">SNAPBOOTH STUDIO 2026</p>
            </div>
        </div>

        {/* RIGHT: ACTIONS & FILTERS */}
        <div className="lg:col-span-4 space-y-8 w-full">
            {/* Filter Selector */}
            <div className="notizblok p-10 rounded-3xl border-4 border-[#5D0E11] shadow-[8px_8px_0px_0px_rgba(93,14,17,1)] space-y-8">
                <div className="flex items-center gap-3 border-b-2 border-[#5D0E11]/10 pb-4">
                    <Layers className="text-[#5D0E11]" size={24} />
                    <h3 className="font-script text-2xl lowercase text-[#5D0E11]">Style & Filter</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filters.map((f) => (
                        <button 
                            key={f.name}
                            onClick={() => setFilter(f.class)}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${filter === f.class ? 'border-[#5D0E11] bg-[#FDF2F2] shadow-[4px_4px_0px_0px_rgba(93,14,17,1)]' : 'border-[#5D0E11]/10 bg-white hover:border-[#5D0E11]'}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#5D0E11] to-[#8a1a1e] ${f.class} border-2 border-[#5D0E11]`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${filter === f.class ? 'text-[#5D0E11]' : 'text-[#5D0E11]/40'}`}>
                                {f.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <Button 
                    onClick={handleDownload}
                    className="w-full h-20 rounded-full bg-[#5D0E11] hover:bg-[#3d0a0c] text-white text-2xl font-serif font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 flex gap-4 border-2 border-[#5D0E11]"
                >
                    <Download size={28} strokeWidth={3} />
                    UNDUH HASIL
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Link href="/booth">
                        <Button variant="outline" className="w-full h-16 rounded-full border-4 border-[#5D0E11] text-[#5D0E11] bg-white hover:bg-[#FDF2F2] font-black text-sm tracking-widest gap-2">
                            <RefreshCw size={18} strokeWidth={3} />
                            ULANGI
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-16 rounded-full bg-[#FDF2F2] text-[#5D0E11]/40 hover:text-[#5D0E11] font-black text-sm tracking-widest gap-2 border-2 border-[#5D0E11]">
                        <Share2 size={18} strokeWidth={3} />
                        BAGIKAN
                    </Button>
                </div>
            </div>
        </div>

      </div>

      <Link href="/">
        <Button variant="ghost" className="text-[#5D0E11]/40 hover:text-[#5D0E11] font-bold flex gap-2">
            <ArrowLeft size={16} strokeWidth={3} />
            KEMBALI KE BERANDA
        </Button>
      </Link>
    </div>
  );
}
