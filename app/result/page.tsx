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
      <div className="flex-1 min-h-[60vh] flex flex-col justify-center items-center gap-4 text-purple-600">
        <RefreshCw className="animate-spin" size={48} />
        <p className="font-black uppercase tracking-widest text-sm text-slate-400">Memuat Masterpiece...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center gap-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-6 border border-slate-100 max-w-lg w-full">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <ImageIcon size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Sesi Kosong!</h2>
            <p className="text-slate-500 font-bold leading-relaxed">Sepertinya kamu belum melakukan sesi pemotretan atau datamu telah terhapus.</p>
          </div>
          <Link href="/booth" className="block w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-16 rounded-full font-black text-lg gap-3 shadow-lg shadow-purple-200">
              <Camera size={24} />
              MULAI MENJEPRET
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col items-center gap-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Masterpiece Ready</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Hasil <span className="text-purple-600">Komposisi</span>
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: COMPOSITE AREA (STENCIL TECHNIQUE) */}
        <div className="lg:col-span-8 flex justify-center w-full">
            <div className="relative group">
                <div className="absolute -inset-4 bg-purple-600/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                {/* THE MASTERPIECE WRAPPER - Tanpa Filter */}
                <div 
                    ref={resultRef}
                    className="relative w-[320px] sm:w-[400px] aspect-[4/5] mx-auto bg-transparent overflow-hidden flex-shrink-0 shadow-2xl rounded-[2.5rem]"
                >
                    {/* LAPISAN BAWAH (GRID FOTO) - FILTER DITERAPKAN DI SINI */}
                    <div className={`absolute inset-0 z-10 grid grid-cols-2 grid-rows-3 gap-3 pt-[14%] pb-[16%] px-[6%] transition-all duration-700 ${filter}`}>
                        {photos.map((photo, i) => (
                            <div key={i} className="relative w-full h-full bg-slate-300 overflow-hidden rounded-sm">
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
                <div className="absolute -top-4 -right-4 bg-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-8 border-slate-50 transform rotate-12 z-30">
                    <Check size={32} strokeWidth={4} />
                </div>
            </div>
        </div>

        {/* RIGHT: ACTIONS & FILTERS */}
        <div className="lg:col-span-4 space-y-8 w-full">
            {/* Filter Selector */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <Layers className="text-purple-600" size={24} />
                    <h3 className="font-black text-xl tracking-tight uppercase italic text-slate-900">Style & Filter</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filters.map((f) => (
                        <button 
                            key={f.name}
                            onClick={() => setFilter(f.class)}
                            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${filter === f.class ? 'border-purple-600 bg-purple-50 shadow-lg' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 ${f.class} shadow-md`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${filter === f.class ? 'text-purple-600' : 'text-slate-400'}`}>
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
                    className="w-full h-20 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-2xl font-black shadow-[0_20px_40px_rgba(147,51,234,0.3)] transition-all hover:scale-105 active:scale-95 flex gap-4 shadow-purple-200"
                >
                    <Download size={28} strokeWidth={3} />
                    UNDUH HASIL
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Link href="/booth">
                        <Button variant="outline" className="w-full h-16 rounded-full border-4 border-purple-600 text-purple-600 bg-white hover:bg-purple-50 font-black text-sm tracking-widest gap-2">
                            <RefreshCw size={18} strokeWidth={3} />
                            ULANGI
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-16 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 font-black text-sm tracking-widest gap-2">
                        <Share2 size={18} strokeWidth={3} />
                        BAGIKAN
                    </Button>
                </div>
            </div>
        </div>

      </div>

      <Link href="/">
        <Button variant="ghost" className="text-slate-300 hover:text-purple-600 font-bold flex gap-2">
            <ArrowLeft size={16} strokeWidth={3} />
            KEMBALI KE BERANDA
        </Button>
      </Link>
    </div>
  );
}
