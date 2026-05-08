'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera as CameraIcon, 
  Upload as UploadIcon, 
  ChevronLeft, 
  RefreshCw, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Monitor, 
  Smartphone, 
  Timer, 
  FlipHorizontal,
  FolderPlus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type FrameTemplate = {
  id: string;
  name: string;
  imageUrl: string;
  requiredPhotos: number;
  thumbColor: string;
};

type InputMode = 'camera' | 'upload';

export default function BoothPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const frames: FrameTemplate[] = [
    { id: 'kawaii-01', name: 'Kawaii 6-Grid', imageUrl: '/frame-kawaii.png', requiredPhotos: 6, thumbColor: 'bg-red-100' },
    { id: 'std-04', name: 'Standard 4', imageUrl: '/frames/std4.png', requiredPhotos: 4, thumbColor: 'bg-slate-100' },
    { id: 'party-08', name: 'Party 8', imageUrl: '/frames/party8.png', requiredPhotos: 8, thumbColor: 'bg-pink-100' },
    { id: 'ocean-03', name: 'Ocean 3', imageUrl: '/frames/ocean3.png', requiredPhotos: 3, thumbColor: 'bg-blue-100' },
    { id: 'min-01', name: 'Minimal 1', imageUrl: '/frames/min1.png', requiredPhotos: 1, thumbColor: 'bg-amber-100' },
  ];

  const [inputMode, setInputMode] = useState<InputMode>('camera');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FrameTemplate>(frames[0]); 
  const [delay, setDelay] = useState(3);
  const [isMirror, setIsMirror] = useState(true);
  const [isFlash, setIsFlash] = useState(false);

  // WEBRTC: Camera Activation & Cleanup
  useEffect(() => {
    if (inputMode === 'camera') {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };

      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [inputMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // REDIRECT LOGIC: Watch for session completion
  useEffect(() => {
    if (capturedPhotos.length === selectedTemplate.requiredPhotos) {
      localStorage.setItem('sessionPhotos', JSON.stringify(capturedPhotos));
      localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      
      // Delay slightly for visual satisfaction before redirect
      const timeout = setTimeout(() => {
        router.push('/result');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [capturedPhotos, selectedTemplate, router]);

  // CAPTURE LOGIC: Raw Video Capture (No Frame Overlay here)
  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    if (capturedPhotos.length >= selectedTemplate.requiredPhotos) return;

    // Trigger Visual Flash
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 150);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle Mirroring
      if (isMirror) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
      }

      // Draw pure video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhotos(prev => [...prev, imageData]);
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  const handleReset = () => {
    setCapturedPhotos([]);
  };

  const handleSelectTemplate = (template: FrameTemplate) => {
    setSelectedTemplate(template);
    setCapturedPhotos([]); 
  };

  return (
    <div className="min-h-screen bg-[#FDF2F2] font-serif text-[#5D0E11]">
      {/* Visual Flash Overlay */}
      {isFlash && <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-150"></div>}
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* A. SECONDARY HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border-4 border-[#5D0E11] shadow-[8px_8px_0px_0px_rgba(93,14,17,1)]">
          <div className="flex items-center gap-4">
            <Link href="/templates">
              <Button variant="outline" className="rounded-full border-2 border-[#5D0E11] text-[#5D0E11] font-black px-6 h-12 flex gap-2 hover:bg-[#FDF2F2]">
                <ChevronLeft size={18} strokeWidth={3} />
                Kembali
              </Button>
            </Link>
          </div>

          <div className="bg-[#FDF2F2] p-1.5 rounded-full flex items-center gap-1 border-2 border-[#5D0E11]">
            <button 
              onClick={() => setInputMode('camera')}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-black transition-all ${inputMode === 'camera' ? 'bg-[#5D0E11] text-white' : 'text-[#5D0E11]/40 hover:text-[#5D0E11]'}`}
            >
              <CameraIcon size={18} />
              KAMERA
            </button>
            <button 
              onClick={() => setInputMode('upload')}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-black transition-all ${inputMode === 'upload' ? 'bg-[#5D0E11] text-white' : 'text-[#5D0E11]/40 hover:text-[#5D0E11]'}`}
            >
              <UploadIcon size={18} />
              UPLOAD
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8 pr-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5D0E11] text-white flex items-center justify-center text-xs font-black border-2 border-[#5D0E11]">1</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5D0E11]">Capture</span>
            </div>
            <div className="w-12 h-1 bg-[#5D0E11]/10 rounded-full"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#5D0E11]/20 flex items-center justify-center text-xs font-black border-2 border-[#5D0E11]/20">2</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5D0E11]/20">Edit</span>
            </div>
            <div className="w-12 h-1 bg-[#5D0E11]/10 rounded-full"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#5D0E11]/20 flex items-center justify-center text-xs font-black border-2 border-[#5D0E11]/20">3</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5D0E11]/20">Download</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <aside className="w-full lg:w-[280px] space-y-6 lg:sticky lg:top-36">
            <div className="notizblok p-8 rounded-3xl border-4 border-[#5D0E11] shadow-[8px_8px_0px_0px_rgba(93,14,17,1)] space-y-8">
              <div className="flex items-center gap-3 border-b-2 border-[#5D0E11]/10 pb-4">
                <div className="bg-[#FDF2F2] p-2 rounded-xl text-[#5D0E11] border-2 border-[#5D0E11]">
                  <CameraIcon size={20} />
                </div>
                <h3 className="font-script text-2xl text-[#5D0E11] lowercase">Settings</h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#5D0E11] uppercase tracking-widest flex items-center gap-2">
                  <Timer size={14} /> Delay Timer
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setDelay(s)}
                      className={`py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${delay === s ? 'bg-[#5D0E11] border-[#5D0E11] text-white' : 'bg-white border-[#5D0E11] text-[#5D0E11] hover:bg-[#FDF2F2]'}`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-[#5D0E11] uppercase tracking-widest flex items-center gap-2">
                  <FlipHorizontal size={14} /> Mirror Mode
                </label>
                <button 
                  onClick={() => setIsMirror(!isMirror)}
                  className={`w-12 h-6 rounded-full transition-all relative border-2 border-[#5D0E11] ${isMirror ? 'bg-[#5D0E11]' : 'bg-white'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${isMirror ? 'left-6 bg-white' : 'left-1 bg-[#5D0E11]'}`}></div>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#5D0E11] uppercase tracking-widest flex items-center gap-2">
                  <Monitor size={14} /> Camera Source
                </label>
                <div className="space-y-2">
                  <button className="w-full py-3 px-4 rounded-2xl bg-[#5D0E11] text-white text-xs font-black flex items-center justify-between border-2 border-[#5D0E11]">
                    <div className="flex items-center gap-3">
                      <Monitor size={16} />
                      <span>FaceTime HD</span>
                    </div>
                    <Check size={16} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 w-full flex flex-col items-center gap-8">
            <div className="w-full bg-white p-4 rounded-3xl border-4 border-[#5D0E11] shadow-[12px_12px_0px_0px_rgba(93,14,17,1)] flex justify-center">
              {inputMode === 'camera' ? (
                <div className="relative w-full max-w-[500px] aspect-[3/4] max-h-[70vh] bg-black border-4 border-[#5D0E11] rounded-2xl overflow-hidden flex items-center justify-center group">
                  {/* CLEAN CAMERA FEED */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover z-0 ${isMirror ? 'scale-x-[-1]' : ''}`}
                  />

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                    <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 bg-white rounded-full p-1.5 border-4 border-[#5D0E11] shadow-xl transition-all hover:scale-110 active:scale-95 group"
                    >
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-[#5D0E11] transition-colors group-hover:bg-[#3d0a0c]">
                        <CameraIcon size={28} className="text-white" fill="currentColor" />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-[500px] aspect-[3/4] max-h-[70vh] bg-[#FDF2F2] border-4 border-dashed border-[#5D0E11] rounded-3xl flex flex-col items-center justify-center p-8 transition-all hover:bg-white cursor-pointer group">
                  <div className="bg-white p-6 rounded-2xl border-4 border-[#5D0E11] mb-6 text-[#5D0E11] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FolderPlus size={48} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-xl font-serif font-black text-[#5D0E11] text-center uppercase tracking-tighter">Klik atau Drag & Drop foto</h4>
                  <div className="mt-8 px-8 py-3 bg-[#5D0E11] text-white rounded-full text-xs font-black tracking-widest uppercase border-2 border-[#5D0E11] transition-all hover:scale-105 active:scale-95">
                    Pilih File Lokal
                  </div>
                </div>
              )}
            </div>

            <div className="w-full bg-white p-6 rounded-3xl border-4 border-[#5D0E11] shadow-[8px_8px_0px_0px_rgba(93,14,17,1)] space-y-6">
              <div className="flex justify-between items-center px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5D0E11]/40">Pilih Template</span>
                <div className="bg-[#FDF2F2] px-3 py-1 rounded-full text-[10px] font-black text-[#5D0E11] uppercase tracking-widest border-2 border-[#5D0E11]">
                  {selectedTemplate.name}
                </div>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {frames.map((template) => (
                  <div 
                    key={template.id} 
                    onClick={() => handleSelectTemplate(template)}
                    className={`snap-center flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group transition-all ${selectedTemplate.id === template.id ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <div className={`w-16 h-24 rounded-xl ${template.thumbColor} flex items-center justify-center border-4 ${selectedTemplate.id === template.id ? 'border-[#5D0E11] shadow-[4px_4px_0px_0px_rgba(93,14,17,1)]' : 'border-transparent'}`}>
                      <ImageIcon size={20} className="text-[#5D0E11]/10" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTemplate.id === template.id ? 'text-[#5D0E11]' : 'text-[#5D0E11]/40'}`}>
                      {template.requiredPhotos} Slots
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="w-full lg:w-[320px] lg:sticky lg:top-36">
            <div className="notizblok p-8 rounded-3xl border-4 border-[#5D0E11] shadow-[8px_8px_0px_0px_rgba(93,14,17,1)] space-y-8">
              <div className="flex justify-between items-center border-b-2 border-[#5D0E11]/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FDF2F2] p-2 rounded-xl text-[#5D0E11] border-2 border-[#5D0E11]">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-script text-2xl text-[#5D0E11] lowercase">Photos</h3>
                </div>
                <span className="text-xs font-black px-4 py-1.5 bg-[#FDF2F2] text-[#5D0E11] rounded-full border-2 border-[#5D0E11] tracking-widest">
                  {capturedPhotos.length}/{selectedTemplate.requiredPhotos}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: selectedTemplate.requiredPhotos }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`aspect-[3/4] rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 border-4 ${index < capturedPhotos.length ? 'border-[#5D0E11] bg-white scale-[0.98]' : 'border-dashed border-[#5D0E11]/20 bg-white/50'}`}
                  >
                    {index < capturedPhotos.length ? (
                      <img src={capturedPhotos[index]} alt="Captured" className="w-full h-full object-cover animate-in zoom-in duration-500" />
                    ) : (
                      <span className="text-xl font-black text-[#5D0E11]/10">{index + 1}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  disabled={capturedPhotos.length < selectedTemplate.requiredPhotos}
                  className="w-full h-16 rounded-full bg-[#5D0E11] hover:bg-[#3d0a0c] text-white font-black text-lg border-2 border-[#5D0E11] gap-3 transition-all active:scale-95 disabled:opacity-50 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                >
                  Selesaikan Sesi
                  <Check size={20} strokeWidth={3} />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleReset}
                  className="w-full h-12 rounded-full text-[#5D0E11]/40 hover:text-red-500 font-bold flex gap-2"
                >
                  <RefreshCw size={16} />
                  Bersihkan Sesi
                </Button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
