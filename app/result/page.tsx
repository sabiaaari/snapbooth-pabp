'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Layers, Share2, ArrowLeft, Sparkles, Check, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FrameTemplate } from '../booth/page';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

export default function ResultPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [template, setTemplate] = useState<FrameTemplate | null>(null);
  const [filter, setFilter] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedPhotos = localStorage.getItem('sessionPhotos');
    const savedTemplate = localStorage.getItem('selectedTemplate');
    
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedTemplate) setTemplate(JSON.parse(savedTemplate));

    return () => {
      photos.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, []);

  // RENDER ENGINE
  useEffect(() => {
    if (isMounted && template && photos.length > 0) {
      renderCanvas();
    }
  }, [isMounted, template, photos, filter]);

  const renderCanvas = async () => {
    if (!template || !template.imageUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // 1. TUNGGU FRAME
      const frameImg = await loadImage(template.imageUrl);
      
      // 2. Set ukuran kanvas mengikuti dimensi asli frame
      canvas.width = frameImg.naturalWidth;
      canvas.height = frameImg.naturalHeight;

      // 3. Bersihkan kanvas & beri background dasar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Filter Logic
      let canvasFilter = 'none';
      if (filter === 'grayscale') canvasFilter = 'grayscale(100%)';
      else if (filter === 'sepia contrast-125') canvasFilter = 'sepia(100%) contrast(125%)';
      else if (filter === 'saturate-150 contrast-110') canvasFilter = 'saturate(150%) contrast(110%)';

      const parsePercent = (val: string) => parseFloat(val) / 100;

      // 4. Gambar Foto-Foto (Lapisan Bawah)
      for (let i = 0; i < template.slots.length; i++) {
        const slot = template.slots[i];
        const photoSrc = photos[i];
        
        const x = parsePercent(slot.left) * canvas.width;
        const y = parsePercent(slot.top) * canvas.height;
        const w = parsePercent(slot.width) * canvas.width;
        const h = parsePercent(slot.height) * canvas.height;

        if (photoSrc) {
          const photoImg = await loadImage(photoSrc);

          ctx.save();
          ctx.filter = canvasFilter;
          
          // object-fit: cover logic
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
        } else {
          // Placeholder jika slot kosong
          ctx.fillStyle = '#F1F5F9';
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = '#420D19';
          ctx.font = `bold ${Math.floor(w * 0.2)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', x + w/2, y + h/2);
        }
      }

      // 5. Gambar Frame (Lapisan Atas)
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.error('Canvas re-render failed:', err);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!template || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const parsePercent = (val: string) => parseFloat(val) / 100;

    for (let i = 0; i < template.slots.length; i++) {
      const slot = template.slots[i];
      const sX = parsePercent(slot.left) * canvas.width;
      const sY = parsePercent(slot.top) * canvas.height;
      const sW = parsePercent(slot.width) * canvas.width;
      const sH = parsePercent(slot.height) * canvas.height;

      if (x >= sX && x <= sX + sW && y >= sY && y <= sY + sH) {
        setActiveSlotIndex(i);
        fileInputRef.current?.click();
        break;
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && activeSlotIndex !== null) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => {
        const newPhotos = [...prev];
        while (newPhotos.length <= activeSlotIndex) newPhotos.push('');
        if (newPhotos[activeSlotIndex]?.startsWith('blob:')) {
          URL.revokeObjectURL(newPhotos[activeSlotIndex]);
        }
        newPhotos[activeSlotIndex] = url;
        return newPhotos;
      });
      e.target.value = '';
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !template) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `snapbooth-${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download photo. Please try again.');
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
        <p className="font-serif font-black uppercase tracking-widest text-sm text-y2k-primary/40">Loading Masterpiece...</p>
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
            <h2 className="text-4xl font-heading font-black text-y2k-primary lowercase tracking-tighter">Empty Session!</h2>
            <p className="text-y2k-primary/60 font-bold leading-relaxed">Looks like you haven't taken any photos yet or your data was cleared.</p>
          </div>
          <Link href="/booth" className="block w-full">
            <Button className="w-full bg-y2k-primary hover:bg-y2k-accent text-white h-16 rounded-full font-serif font-black text-lg gap-3 shadow-[4px_4px_0_0_#2F020C] border-2 border-y2k-shadow">
              <Camera size={24} />
              START SNAPPING
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-10 flex flex-col items-center gap-12 font-serif text-y2k-primary">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-y2k-primary rounded-full text-xs font-black uppercase tracking-widest border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
            <Sparkles size={14} />
            <span>Masterpiece Ready</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-black lowercase leading-none text-y2k-primary">
            your <span className="underline decoration-8">snaps</span>
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 flex flex-col items-center w-full">
            <div className="relative group">
                <div className="absolute -inset-4 bg-y2k-primary/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-[65vh] md:h-[75vh] w-auto aspect-[1/3] mx-auto bg-white overflow-hidden shadow-[12px_12px_0_0_#2F020C] rounded-md flex-shrink-0 border-4 border-y2k-primary">
                    <canvas 
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="w-full h-full object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                </div>
                <div className="absolute -top-4 -right-4 bg-y2k-primary text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transform rotate-12 z-30 shadow-[4px_4px_0_0_#2F020C]">
                    <Check size={32} strokeWidth={4} />
                </div>
            </div>
            <div className="mt-8 text-center">
                <p className="text-sm font-black tracking-[0.3em] text-y2k-primary uppercase">SNAPBOOTH STUDIO 2026</p>
                <p className="text-[10px] font-bold text-y2k-primary/40 uppercase mt-2 italic">Tip: Click a photo in the strip to replace it!</p>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8 w-full">
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
                    {isDownloading ? 'PROCESSING...' : 'DOWNLOAD STRIP'}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Link href="/booth">
                        <Button variant="outline" className="w-full h-16 rounded-full border-4 border-y2k-primary text-y2k-primary bg-white hover:bg-y2k-card font-black text-sm tracking-widest gap-2 shadow-[4px_4px_0_0_#2F020C]">
                            <RefreshCw size={18} strokeWidth={3} />
                            RETAKE
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-16 rounded-full bg-y2k-bg text-y2k-primary/40 hover:text-y2k-primary font-black text-sm tracking-widest gap-2 border-2 border-y2k-primary shadow-[2px_2px_0_0_#2F020C]">
                        <Share2 size={18} strokeWidth={3} />
                        SHARE
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <Link href="/">
        <Button variant="ghost" className="text-y2k-primary/40 hover:text-y2k-primary font-bold flex gap-2">
            <ArrowLeft size={16} strokeWidth={3} />
            BACK TO HOME
        </Button>
      </Link>
    </div>
  );
}
