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
      <div className="flex-1 min-h-[60vh] flex flex-col justify-center items-center gap-4 text-y2k-primary">
        <RefreshCw className="animate-spin" size={48} />
        <p className="font-serif font-black uppercase tracking-widest text-sm text-y2k-primary/40">Memuat Masterpiece...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center gap-8 font-serif">
        <div className="bg-white p-12 rounded-3xl border-4 border-y2k-primary shadow-[12px_12px_0_0_#2F020C] text-center space-y-6 max-w-lg w-full">
          <div className="bg-y2k-bg w-24 h-24 rounded-full flex items-center justify-center mx-auto text-y2k-primary/20 border-2 border-y2k-primary">
            <ImageIcon size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-black text-y2k-primary lowercase tracking-tighter">Sesi Kosong!</h2>
            <p className="text-y2k-primary/60 font-bold leading-relaxed">Sepertinya kamu belum melakukan sesi pemotretan atau datamu telah terhapus.</p>
          </div>
          <Link href="/booth" className="block w-full">
            <Button className="w-full bg-y2k-primary hover:bg-y2k-accent text-white h-16 rounded-full font-serif font-black text-lg gap-3 shadow-[4px_4px_0_0_#2F020C] border-2 border-y2k-shadow">
              <Camera size={24} />
              MULAI MENJEPRET
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-10 flex flex-col items-center gap-12 font-serif text-y2k-primary">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-y2k-primary rounded-full text-xs font-black uppercase tracking-widest border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
            <Sparkles size={14} />
            <span>Masterpiece Ready</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-black lowercase leading-none text-y2k-primary">
            Hasil <span className="underline decoration-8">Komposisi</span>
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: COMPOSITE AREA (STENCIL TECHNIQUE) */}
        <div className="lg:col-span-8 flex flex-col items-center w-full">
            <div className="relative group">
                <div className="absolute -inset-4 bg-y2k-primary/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                {/* THE MASTERPIECE WRAPPER - Tanpa Filter */}
                <div 
                    ref={resultRef}
                    className="relative h-[65vh] md:h-[75vh] w-auto aspect-[1/3] mx-auto bg-white overflow-hidden shadow-[4px_4px_0_0_#2F020C] rounded-md flex-shrink-0"
                >
                    {/* LAPISAN BAWAH (FOTO DENGAN KOORDINAT ABSOLUT) */}
                    <div className="absolute inset-0 z-10 overflow-hidden">
                        {template && template.slots && template.slots.length > 0 ? (
                            template.slots.map((slot, index) => {
                                const photo = photos[index];
                                if (!photo) return null;
                                return (
                                    <div 
                                        key={index} 
                                        className={`absolute overflow-hidden bg-slate-100 transition-all duration-700 ${filter}`}
                                        style={{ 
                                            top: slot.top, 
                                            left: slot.left, 
                                            width: slot.width, 
                                            height: slot.height 
                                        }}
                                    >
                                        <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt={`Slot ${index}`} />
                                    </div>
                                );
                            })
                        ) : (
                            // Fallback jika slots belum didefinisikan (Grid Statis)
                            <div className={`grid grid-cols-2 grid-rows-3 gap-3 pt-[14%] pb-[16%] px-[6%] w-full h-full transition-all duration-700 ${filter}`}>
                                {photos.map((photo, i) => (
                                    <div key={i} className="relative w-full h-full bg-slate-100 overflow-hidden rounded-sm">
                                        {photo && <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt={`Foto ${i}`} />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LAPISAN ATAS (FRAME OVERLAY) - Memberikan Dimensi ke Container */}
                    {template && template.imageUrl && (
                        <img 
                            src={template.imageUrl} 
                            className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" 
                            alt="Frame" 
                        />
                    )}
                </div>

                {/* Floating Success Badge */}
                <div className="absolute -top-4 -right-4 bg-y2k-primary text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transform rotate-12 z-30 shadow-[4px_4px_0_0_#2F020C]">
                    <Check size={32} strokeWidth={4} />
                </div>
            </div>

            {/* Studio Info Label */}
            <div className="mt-8 text-center">
                <p className="text-sm font-black tracking-[0.3em] text-y2k-primary uppercase">SNAPBOOTH STUDIO 2026</p>
            </div>
        </div>

        {/* RIGHT: ACTIONS & FILTERS */}
        <div className="lg:col-span-4 space-y-8 w-full">
            {/* Filter Selector */}
            <div className="notizblok p-10 rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] space-y-8">
                <div className="flex items-center gap-3 border-b-2 border-y2k-primary/10 pb-4">
                    <Layers className="text-y2k-primary" size={24} />
                    <h3 className="font-heading font-black text-2xl lowercase text-y2k-primary">Style & Filter</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filters.map((f) => (
                        <button 
                            key={f.name}
                            onClick={() => setFilter(f.class)}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${filter === f.class ? 'border-y2k-primary bg-y2k-bg shadow-[4px_4px_0_0_#2F020C]' : 'border-y2k-primary/10 bg-white hover:border-y2k-primary'}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-y2k-primary to-y2k-accent ${f.class} border-2 border-y2k-primary`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${filter === f.class ? 'text-y2k-primary' : 'text-y2k-primary/40'}`}>
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
                  className="w-full h-20 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white text-2xl font-serif font-black shadow-[8px_8px_0_0_#2F020C] transition-all hover:scale-105 active:scale-95 flex gap-4 border-2 border-y2k-shadow"
                >
                    <Download size={28} strokeWidth={3} />
                    UNDUH HASIL
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Link href="/booth">
                        <Button variant="outline" className="w-full h-16 rounded-full border-4 border-y2k-primary text-y2k-primary bg-white hover:bg-y2k-card font-black text-sm tracking-widest gap-2 shadow-[4px_4px_0_0_#2F020C]">
                            <RefreshCw size={18} strokeWidth={3} />
                            ULANGI
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-16 rounded-full bg-y2k-bg text-y2k-primary/40 hover:text-y2k-primary font-black text-sm tracking-widest gap-2 border-2 border-y2k-primary shadow-[2px_2px_0_0_#2F020C]">
                        <Share2 size={18} strokeWidth={3} />
                        BAGIKAN
                    </Button>
                </div>
            </div>
        </div>

      </div>

      <Link href="/">
        <Button variant="ghost" className="text-y2k-primary/40 hover:text-y2k-primary font-bold flex gap-2">
            <ArrowLeft size={16} strokeWidth={3} />
            KEMBALI KE BERANDA
        </Button>
      </Link>
    </div>
  );
}
