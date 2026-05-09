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
  const [isDownloading, setIsDownloading] = useState(false);
  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedPhotos = localStorage.getItem('sessionPhotos');
    const savedTemplate = localStorage.getItem('selectedTemplate');
    
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedTemplate) setTemplate(JSON.parse(savedTemplate));

    return () => {
      // Cleanup blob URLs on unmount
      photos.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragActiveIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActiveIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragActiveIndex(null);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => {
        const newPhotos = [...prev];
        // Ensure array is long enough for the slot index
        while (newPhotos.length <= index) newPhotos.push('');
        
        // Revoke old blob URL if it exists at this index
        if (newPhotos[index]?.startsWith('blob:')) {
          URL.revokeObjectURL(newPhotos[index]);
        }
        
        newPhotos[index] = url;
        return newPhotos;
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => {
        const newPhotos = [...prev];
        while (newPhotos.length <= index) newPhotos.push('');
        
        if (newPhotos[index]?.startsWith('blob:')) {
          URL.revokeObjectURL(newPhotos[index]);
        }
        
        newPhotos[index] = url;
        return newPhotos;
      });
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleDownload = async () => {
    if (photos.length === 0 || !template || !template.imageUrl) return;
    
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // 1. Load Frame Image to get dimensions
      const frameImg = new Image();
      frameImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        frameImg.onload = resolve;
        frameImg.onerror = reject;
        frameImg.src = template.imageUrl;
      });

      // Set canvas size to match frame natural dimensions
      canvas.width = frameImg.naturalWidth;
      canvas.height = frameImg.naturalHeight;

      // 2. Draw Photos (Bottom Layer)
      const parsePercent = (val: string) => parseFloat(val) / 100;

      // Apply Filter to photos
      let canvasFilter = 'none';
      if (filter === 'grayscale') canvasFilter = 'grayscale(100%)';
      else if (filter === 'sepia contrast-125') canvasFilter = 'sepia(100%) contrast(125%)';
      else if (filter === 'saturate-150 contrast-110') canvasFilter = 'saturate(150%) contrast(110%)';

      // Load and draw each photo
      for (let i = 0; i < template.slots.length; i++) {
        const slot = template.slots[i];
        const photoSrc = photos[i];
        if (!photoSrc) continue;

        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          photoImg.onload = resolve;
          photoImg.onerror = reject;
          photoImg.src = photoSrc;
        });

        const x = parsePercent(slot.left) * canvas.width;
        const y = parsePercent(slot.top) * canvas.height;
        const w = parsePercent(slot.width) * canvas.width;
        const h = parsePercent(slot.height) * canvas.height;

        ctx.save();
        ctx.filter = canvasFilter;
        
        // Draw image with "object-fit: cover" logic for canvas
        const imgRatio = photoImg.width / photoImg.height;
        const slotRatio = w / h;
        let drawW, drawH, drawX, drawY;

        if (imgRatio > slotRatio) {
          drawH = photoImg.height;
          drawW = photoImg.height * slotRatio;
          drawX = (photoImg.width - drawW) / 2;
          drawY = 0;
        } else {
          drawW = photoImg.width;
          drawH = photoImg.width / slotRatio;
          drawX = 0;
          drawY = (photoImg.height - drawH) / 2;
        }

        ctx.drawImage(photoImg, drawX, drawY, drawW, drawH, x, y, w, h);
        ctx.restore();
      }

      // 3. Draw Frame (Top Layer)
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      // 4. Export and Download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `snapbooth-${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Gagal mengunduh foto. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
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
            Hasil <span className="underline decoration-8">Jepretanmu</span>
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
                                const isDragging = dragActiveIndex === index;
                                
                                return (
                                    <div 
                                        key={index} 
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`absolute overflow-hidden transition-all duration-300 flex items-center justify-center
                                            ${photo ? filter : 'bg-slate-200'} 
                                            ${isDragging ? 'bg-y2k-card ring-4 ring-dashed ring-y2k-primary z-30 scale-95 opacity-80' : 'z-10'}
                                        `}
                                        style={{ 
                                            top: slot.top, 
                                            left: slot.left, 
                                            width: slot.width, 
                                            height: slot.height 
                                        }}
                                    >
                                        <input 
                                          type="file" 
                                          id={`file-upload-${index}`} 
                                          accept="image/*" 
                                          className="hidden" 
                                          onChange={(e) => handleFileInputChange(e, index)} 
                                        />
                                        
                                        {photo ? (
                                            <label htmlFor={`file-upload-${index}`} className="absolute inset-0 w-full h-full cursor-pointer">
                                              <img src={photo} className="w-full h-full object-cover" alt={`Slot ${index}`} />
                                            </label>
                                        ) : (
                                            <label 
                                              htmlFor={`file-upload-${index}`}
                                              className="flex flex-col items-center gap-2 cursor-pointer w-full h-full justify-center"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white border-2 border-y2k-primary flex items-center justify-center text-y2k-primary shadow-[2px_2px_0_0_#2F020C]">
                                                    <ImageIcon size={20} />
                                                </div>
                                                <div className="px-3 py-1 bg-y2k-primary text-white text-[8px] font-black rounded-full uppercase tracking-tighter shadow-[2px_2px_0_0_#2F020C]">
                                                    Pilih File Lokal
                                                </div>
                                            </label>
                                        )}
                                        
                                        {/* Drag Indicator Overlay */}
                                        {isDragging && (
                                            <div className="absolute inset-0 bg-y2k-primary/20 flex items-center justify-center pointer-events-none">
                                                <div className="bg-white p-3 rounded-full shadow-xl animate-bounce">
                                                    <Check className="text-y2k-primary" size={24} strokeWidth={4} />
                                                </div>
                                            </div>
                                        )}
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
                  disabled={isDownloading}
                  className="w-full h-20 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white text-2xl font-serif font-black shadow-[8px_8px_0_0_#2F020C] transition-all hover:scale-105 active:scale-95 flex gap-4 border-2 border-y2k-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                      <RefreshCw size={28} strokeWidth={3} className="animate-spin" />
                    ) : (
                      <Download size={28} strokeWidth={3} />
                    )}
                    {isDownloading ? 'MEMPROSES...' : 'UNDUH HASIL'}
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
