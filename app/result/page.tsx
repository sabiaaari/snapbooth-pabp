'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Layers, Share2, ArrowLeft, Sparkles, Check, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FrameTemplate } from '../booth/page';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (!src) return reject(new Error("Image source is empty/undefined"));
    
    // If it's a blob or data URL, we don't need anonymous crossOrigin
    const isLocal = src.startsWith('blob:') || src.startsWith('data:');
    const img = new window.Image();
    
    // WAJIB diletakkan sebelum img.src
    if (!isLocal) img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error(`Failed to load image: ${src}`, err);
      reject(new Error(`Failed to load image at ${src}`));
    };
    img.src = src;
  });
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [template, setTemplate] = useState<FrameTemplate | null>(null);
  const [filter, setFilter] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  
  // Interactive Adjust States
  const [photoTransforms, setPhotoTransforms] = useState<{ x: number, y: number, zoom: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch photos from sessionStorage (Strictly use currentSessionPhotos)
    const sessionPhotos = sessionStorage.getItem('currentSessionPhotos');
    if (sessionPhotos) {
      const parsedPhotos = JSON.parse(sessionPhotos);
      setPhotos(parsedPhotos);
      // Initialize transforms
      setPhotoTransforms(new Array(parsedPhotos.length).fill({ x: 0, y: 0, zoom: 1 }));
    }

    const fetchTemplate = async () => {
      if (!templateId) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase.from('templates').select('*');
        
        if (user) {
          query = query.or(`user_id.eq.${user.id},is_system.eq.true`);
        } else {
          query = query.eq('is_system', true);
        }

        const { data, error } = await query
          .eq('id', templateId)
          .single();

        if (error) {
          // If not in DB, check if it's a system template in localStorage
          const savedTemplate = localStorage.getItem('selectedTemplate');
          if (savedTemplate) {
            const parsed = JSON.parse(savedTemplate);
            if (parsed.id === templateId) {
              setTemplate(parsed);
              return;
            }
          }
          throw error;
        }

        if (data) {
          setTemplate({
            id: data.id,
            name: data.name,
            imageUrl: data.image_url,
            requiredPhotos: data.required_photos,
            thumbColor: 'bg-y2k-bg',
            slots: data.slots || []
          });
        }
      } catch (err) {
        console.error("Error fetching template:", err);
      }
    };

    fetchTemplate();
  }, [templateId]);

  // RENDER ENGINE
  useEffect(() => {
    if (isMounted && template && photos.length > 0) {
      renderCanvas();
    }
  }, [isMounted, template, photos, filter]);

  const [detectedSlots, setDetectedSlots] = useState<any[]>([]);

  const detectFrameSlots = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    const visited = new Uint8Array(width * height);
    const holes = [];

    // Helper: Is pixel a hole? (Transparent or White)
    const isHole = (x: number, y: number) => {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      return a < 10 || (r > 250 && g > 250 && b > 250);
    };

    for (let y = 0; y < height; y += 15) { // Coarse scan for speed
      for (let x = 0; x < width; x += 15) {
        const vIdx = y * width + x;
        if (!visited[vIdx] && isHole(x, y)) {
          let minX = x, maxX = x, minY = y, maxY = y;
          const stack = [[x, y]];
          visited[vIdx] = 1;

          while (stack.length > 0) {
            const [cx, cy] = stack.pop()!;
            
            // Step of 10 for faster flood fill boundaries
            const step = 10;
            const neighbors = [
              [cx + step, cy], [cx - step, cy],
              [cx, cy + step], [cx, cy - step]
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (!visited[nIdx] && isHole(nx, ny)) {
                  visited[nIdx] = 1;
                  minX = Math.min(minX, nx);
                  maxX = Math.max(maxX, nx);
                  minY = Math.min(minY, ny);
                  maxY = Math.max(maxY, ny);
                  stack.push([nx, ny]);
                }
              }
            }
          }

          const w = maxX - minX;
          const h = maxY - minY;
          if (w > width * 0.05 && h > height * 0.05) {
            holes.push({
              left: (minX / width) * 100,
              top: (minY / height) * 100,
              width: (w / width) * 100,
              height: (h / height) * 100
            });
          }
        }
      }
    }
    return holes.sort((a, b) => a.top - b.top);
  };

  const calculateSlotRect = (index: number, canvasWidth: number, canvasHeight: number) => {
    // Priority: 1. Detected Slots, 2. Database Slots
    const slotsData = detectedSlots.length > 0 ? detectedSlots : template?.slots;
    if (!slotsData) return null;
    
    const slotsArray = Array.isArray(slotsData) ? slotsData : [slotsData];
    const slot = slotsArray[index];

    if (!slot) return null;
    
    const parsePercent = (val: any) => {
      if (val === undefined || val === null) return 0;
      const strVal = String(val).replace('%', '');
      return parseFloat(strVal) / 100;
    };

    return {
      x: parsePercent(slot.left) * canvasWidth,
      y: parsePercent(slot.top) * canvasHeight,
      w: parsePercent(slot.width) * canvasWidth,
      h: parsePercent(slot.height) * canvasHeight
    };
  };

  const renderCanvas = async () => {
    if (!canvasRef.current || !template || !template.imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // --- LANGKAH 1: MUAT SEMUA ASET SECARA SINKRON ---
      // Muat bingkai utama untuk menentukan resolusi kanvas
      const frameImg = await loadImage(template.imageUrl);
      canvas.width = frameImg.naturalWidth;
      canvas.height = frameImg.naturalHeight;

      // Tentukan koordinat slot (prioritas: deteksi otomatis -> database)
      let activeSlots = [];
      if (detectedSlots.length > 0) {
        activeSlots = detectedSlots;
      } else if (!template.slots || (Array.isArray(template.slots) && template.slots.length === 0)) {
        console.log("DEBUG CANVAS - Mencari lubang otomatis...");
        const holes = detectFrameSlots(frameImg);
        if (holes.length > 0) {
          setDetectedSlots(holes);
          return; 
        }
      } else {
        // Normalisasi data dari database (array vs single object)
        activeSlots = Array.isArray(template.slots) ? template.slots : [template.slots];
      }

      // Muat semua foto jepretan secara paralel menggunakan Promise.all
      const loadedPhotoImgs = await Promise.all(
        photos.map(src => src ? loadImage(src) : Promise.resolve(null))
      );

      // --- LANGKAH 2: SETUP DASAR & LATAR BELAKANG (LAYER 1) ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- LANGKAH 3: GAMBAR FOTO PENGGUNA (LAYER 2 - DI BAWAH FRAME) ---
      let canvasFilter = 'none';
      if (filter === 'grayscale') canvasFilter = 'grayscale(100%)';
      else if (filter === 'sepia contrast-125') canvasFilter = 'sepia(100%) contrast(125%)';
      else if (filter === 'saturate-150 contrast-110') canvasFilter = 'saturate(150%) contrast(110%)';

      for (let i = 0; i < activeSlots.length; i++) {
        const slot = activeSlots[i];
        const photoImg = loadedPhotoImgs[i];
        if (!slot || !photoImg) continue;

        // Hitung koordinat piksel dari persentase
        const parse = (val: any) => {
          const num = parseFloat(String(val).replace('%', ''));
          return isNaN(num) ? 0 : num / 100;
        };

        const rect = {
          x: parse(slot.left) * canvas.width,
          y: parse(slot.top) * canvas.height,
          w: parse(slot.width) * canvas.width,
          h: parse(slot.height) * canvas.height
        };

        const transform = photoTransforms[i] || { x: 0, y: 0, zoom: 1 };

        ctx.save();
        
        // MASKING: Pastikan foto tetap di dalam area lubang
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.clip();

        ctx.filter = canvasFilter;

        // --- LOGIKA OBJECT-FIT: COVER ---
        const imgRatio = photoImg.width / photoImg.height;
        const slotRatio = rect.w / rect.h;
        
        let sw, sh, sx, sy;

        if (imgRatio > slotRatio) {
          // Foto lebih lebar: ambil tinggi penuh, potong lebar
          sh = photoImg.height;
          sw = photoImg.height * slotRatio;
          sx = (photoImg.width - sw) / 2;
          sy = 0;
        } else {
          // Foto lebih tinggi: ambil lebar penuh, potong tinggi
          sw = photoImg.width;
          sh = photoImg.width / slotRatio;
          sx = 0;
          sy = (photoImg.height - sh) / 2;
        }

        // Terapkan Zoom & Drag (Transform Manual) ke Source Coordinates
        const z = transform.zoom;
        const finalSW = sw / z;
        const finalSH = sh / z;
        
        // Konversi offset geser kanvas ke skala source image
        const offX = (transform.x / rect.w) * sw;
        const offY = (transform.y / rect.h) * sh;

        const finalSX = sx - offX + (sw - finalSW) / 2;
        const finalSY = sy - offY + (sh - finalSH) / 2;

        ctx.drawImage(photoImg, finalSX, finalSY, finalSW, finalSH, rect.x, rect.y, rect.w, rect.h);
        ctx.restore();
      }

      // --- LANGKAH 4: GAMBAR FRAME PNG (LAYER 3 - DI ATAS FOTO) ---
      // Frame digambar terakhir agar menutupi sisa potongan foto di bawahnya
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    } catch (err) {
      console.error("Critical Canvas Render Error:", err);
    }
  };

  // --- INTERACTIVE HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!template || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Cek klik di slot mana
    const slotCount = template.requiredPhotos;
    for (let i = 0; i < slotCount; i++) {
      const coords = calculateSlotRect(i, canvas.width, canvas.height);
      if (coords && x >= coords.x && x <= coords.x + coords.w && y >= coords.y && y <= coords.y + coords.h) {
        setDraggingIndex(i);
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || draggingIndex === null || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const dx = (e.clientX - dragStart.x) * scaleX;
    const dy = (e.clientY - dragStart.y) * scaleY;

    setPhotoTransforms(prev => {
      const newTransforms = [...prev];
      const current = newTransforms[draggingIndex] || { x: 0, y: 0, zoom: 1 };
      newTransforms[draggingIndex] = {
        ...current,
        x: current.x + dx,
        y: current.y + dy
      };
      return newTransforms;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingIndex(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // e.preventDefault(); // Diatur di browser untuk prevent scroll halaman
    if (!canvasRef.current || !template) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.nativeEvent.clientX - rect.left) * scaleX;
    const y = (e.nativeEvent.clientY - rect.top) * scaleY;

    const slotCount = template.requiredPhotos;
    for (let i = 0; i < slotCount; i++) {
      const coords = calculateSlotRect(i, canvas.width, canvas.height);
      if (coords && x >= coords.x && x <= coords.x + coords.w && y >= coords.y && y <= coords.y + coords.h) {
        const zoomSpeed = 0.001;
        const zoomDelta = -e.deltaY * zoomSpeed;
        
        setPhotoTransforms(prev => {
          const newTransforms = [...prev];
          const current = newTransforms[i] || { x: 0, y: 0, zoom: 1 };
          newTransforms[i] = {
            ...current,
            zoom: Math.max(0.1, Math.min(5, current.zoom + zoomDelta))
          };
          return newTransforms;
        });
        break;
      }
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

    const slotCount = template.requiredPhotos;

    for (let i = 0; i < slotCount; i++) {
      const coords = calculateSlotRect(i, canvas.width, canvas.height);
      if (!coords) continue;

      if (x >= coords.x && x <= coords.x + coords.w && y >= coords.y && y <= coords.y + coords.h) {
        setActiveSlotIndex(i);
        fileInputRef.current?.click();
        break;
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && activeSlotIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotos(prev => {
          const newPhotos = [...prev];
          while (newPhotos.length <= activeSlotIndex) newPhotos.push('');
          newPhotos[activeSlotIndex] = base64String;
          return newPhotos;
        });
      };
      reader.readAsDataURL(file);
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
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onWheel={handleWheel}
                      onClick={handleCanvasClick}
                      className="w-full h-full object-contain cursor-move transition-transform duration-500 hover:scale-[1.01]"
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
