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
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';

export type FrameSlot = {
  top: string;
  left: string;
  width: string;
  height: string;
};

export type FrameTemplate = {
  id: string;
  name: string;
  imageUrl: string;
  requiredPhotos: number;
  thumbColor: string;
  slots: FrameSlot[];
};

type InputMode = 'camera' | 'upload';

function BoothContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const default6Slots: FrameSlot[] = [
    { top: '12%', left: '8%', width: '39%', height: '24%' },
    { top: '12%', left: '53%', width: '39%', height: '24%' },
    { top: '39%', left: '8%', width: '39%', height: '24%' },
    { top: '39%', left: '53%', width: '39%', height: '24%' },
    { top: '66%', left: '8%', width: '39%', height: '24%' },
    { top: '66%', left: '53%', width: '39%', height: '24%' },
  ];

  const default4Slots: FrameSlot[] = [
    { top: '15%', left: '10%', width: '35%', height: '30%' },
    { top: '15%', left: '55%', width: '35%', height: '30%' },
    { top: '55%', left: '10%', width: '35%', height: '30%' },
    { top: '55%', left: '55%', width: '35%', height: '30%' },
  ];

  const frames: FrameTemplate[] = [
    { 
      id: 'blue-classic', 
      name: 'BLUE CLASSIC', 
      imageUrl: '/frame-biru.png', 
      requiredPhotos: 4, 
      thumbColor: 'bg-blue-100', 
      slots: [
        { top: '3%', left: '6%', width: '88%', height: '18%' },
        { top: '23%', left: '6%', width: '88%', height: '18%' },
        { top: '43%', left: '6%', width: '88%', height: '18%' },
        { top: '63%', left: '6%', width: '88%', height: '18%' }
      ]
    },
    { 
      id: 'maroon-retro', 
      name: 'MAROON RETRO', 
      imageUrl: '/frame-merah.png', 
      requiredPhotos: 3, 
      thumbColor: 'bg-red-50', 
      slots: [
        { top: '3.5%', left: '10%', width: '80%', height: '23.5%' },
        { top: '30%', left: '10%', width: '80%', height: '23.5%' },
        { top: '56.5%', left: '10%', width: '80%', height: '23.5%' }
      ]
    },
  ];

  // SYNC FROM URL
  const templateIdParam = searchParams.get('templateId');
  const slotsParam = searchParams.get('slots');

  const initialTemplate = frames.find(f => f.id === templateIdParam) || {
    id: templateIdParam || 'custom',
    name: templateIdParam ? templateIdParam.replace(/-/g, ' ') : 'Custom Template',
    imageUrl: '',
    requiredPhotos: slotsParam ? parseInt(slotsParam) : 4,
    thumbColor: 'bg-y2k-bg',
    slots: []
  };

  const [inputMode, setInputMode] = useState<InputMode>('camera');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FrameTemplate>(initialTemplate); 
  const [delay, setDelay] = useState(3);
  const [isMirror, setIsMirror] = useState(true);
  const [isFlash, setIsFlash] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Refs to handle timers and avoid stale closures
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch custom template if not found in system templates
  useEffect(() => {
    const fetchCustomTemplate = async () => {
      if (!templateIdParam || frames.find(f => f.id === templateIdParam)) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase.from('templates').select('*');
        
        if (user) {
          query = query.or(`user_id.eq.${user.id},is_system.eq.true`);
        } else {
          query = query.eq('is_system', true);
        }

        const { data, error } = await query
          .eq('id', templateIdParam)
          .single();

        if (error) throw error;

        if (data) {
          setSelectedTemplate({
            id: data.id,
            name: data.name,
            imageUrl: data.image_url,
            requiredPhotos: data.required_photos,
            thumbColor: 'bg-y2k-bg',
            slots: data.slots || default4Slots
          });
        }
      } catch (err) {
        console.error("Error fetching template:", err);
      }
    };

    fetchCustomTemplate();
  }, [templateIdParam]);

  // Update template if URL changes (for system templates)
  useEffect(() => {
    if (templateIdParam) {
      const found = frames.find(f => f.id === templateIdParam);
      if (found) {
        setSelectedTemplate(found);
      }
      setCapturedPhotos([]);
    }
  }, [templateIdParam]);

  // TIMER STATE
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

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
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    };
  }, [inputMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // AUTOMATED SESSION LOGIC
  const startPhotoSession = () => {
    if (isSessionActive) return;
    setCapturedPhotos([]);
    setIsSessionActive(true);
    runSequence(0);
  };

  const runSequence = (index: number) => {
    if (index >= selectedTemplate.requiredPhotos) {
      setIsSessionActive(false);
      return;
    }

    let count = delay;
    setTimeLeft(count);
    setIsActive(true);

    const countdownInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setTimeLeft(count);
      } else {
        clearInterval(countdownInterval);
        setTimeLeft(0);
        setIsActive(false);
        
        // Capture at 0
        capturePhoto();
        
        // Wait for flash/delay before next
        sessionTimeoutRef.current = setTimeout(() => {
          setTimeLeft(null);
          runSequence(index + 1);
        }, 1000);
      }
    }, 1000);
  };

  // REDIRECT LOGIC: Watch for session completion
  useEffect(() => {
    if (capturedPhotos.length > 0 && capturedPhotos.length === selectedTemplate.requiredPhotos) {
      sessionStorage.setItem('currentSessionPhotos', JSON.stringify(capturedPhotos));
      sessionStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      
      const timeout = setTimeout(() => {
        router.push(`/result?templateId=${selectedTemplate.id}`);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [capturedPhotos, selectedTemplate, router]);

  // CAPTURE LOGIC: Raw Video Capture
  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

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
    setIsSessionActive(false);
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    setTimeLeft(null);
    setIsActive(false);
  };

  const handleSelectTemplate = (template: FrameTemplate) => {
    if (isSessionActive) return;
    setSelectedTemplate(template);
    setCapturedPhotos([]); 
  };

  const handleMainUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Hitung berapa sisa slot kosong
    const slotsAvailable = selectedTemplate.requiredPhotos - capturedPhotos.length;
    if (slotsAvailable <= 0) return;
    
    // Ambil file sebanyak sisa slot kosong
    const filesToAdd = files.slice(0, slotsAvailable);
    
    // Konversi ke Base64 dan gabungkan dengan foto yang sudah ada di state
    const base64Photos = await Promise.all(
      filesToAdd.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    );

    setCapturedPhotos(prevPhotos => [...prevPhotos, ...base64Photos]);
    
    // Reset input agar bisa upload file yang sama lagi
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const slotsAvailable = selectedTemplate.requiredPhotos - capturedPhotos.length;
    if (slotsAvailable <= 0) return;

    const filesToAdd = droppedFiles.filter(f => f.type.startsWith('image/')).slice(0, slotsAvailable);
    
    const base64Photos = await Promise.all(
      filesToAdd.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    );

    setCapturedPhotos(prev => [...prev, ...base64Photos]);
  };

  return (
    <div className="min-h-screen bg-y2k-bg font-serif text-y2k-primary">
      {/* Visual Flash Overlay */}
      {isFlash && <div className="fixed inset-0 bg-white z-[100] animate-out fade-out duration-150"></div>}
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* A. SECONDARY HEADER */}
        <header className={`flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] transition-all ${isSessionActive ? 'opacity-50 pointer-events-none grayscale scale-[0.98]' : ''}`}>
          <div className="flex items-center gap-4">
            <Link href="/templates">
              <Button variant="outline" disabled={isSessionActive} className="rounded-full border-2 border-y2k-primary text-y2k-primary font-black px-6 h-12 flex gap-2 hover:bg-y2k-card">
                <ChevronLeft size={18} strokeWidth={3} />
                Back
              </Button>
            </Link>
          </div>

          <div className="bg-y2k-bg p-1.5 rounded-full flex items-center gap-1 border-2 border-y2k-primary">
            <button 
              onClick={() => setInputMode('camera')}
              disabled={isSessionActive}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-black transition-all ${inputMode === 'camera' ? 'bg-y2k-primary text-white' : 'text-y2k-primary/40 hover:text-y2k-primary'}`}
            >
              <CameraIcon size={18} />
              CAMERA
            </button>
            <button 
              onClick={() => setInputMode('upload')}
              disabled={isSessionActive}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-black transition-all ${inputMode === 'upload' ? 'bg-y2k-primary text-white' : 'text-y2k-primary/40 hover:text-y2k-primary'}`}
            >
              <UploadIcon size={18} />
              UPLOAD
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <aside className={`w-full lg:w-[280px] space-y-6 lg:sticky lg:top-36 transition-all ${isSessionActive ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <div className="notizblok p-8 rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] space-y-8">
              <div className="flex items-center gap-3 border-b-2 border-y2k-primary/10 pb-4">
                <div className="bg-y2k-bg p-2 rounded-xl text-y2k-primary border-2 border-y2k-primary">
                  <CameraIcon size={20} />
                </div>
                <h3 className="font-heading font-black text-2xl text-y2k-primary lowercase">Settings</h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-y2k-primary uppercase tracking-widest flex items-center gap-2">
                  <Timer size={14} /> Delay Timer
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((s) => (
                    <button 
                      key={s}
                      disabled={isSessionActive}
                      onClick={() => setDelay(s)}
                      className={`py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${delay === s ? 'bg-y2k-primary border-y2k-primary text-white' : 'bg-white border-y2k-primary text-y2k-primary hover:bg-y2k-bg'}`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-y2k-primary uppercase tracking-widest flex items-center gap-2">
                  <FlipHorizontal size={14} /> Mirror Mode
                </label>
                <button 
                  disabled={isSessionActive}
                  onClick={() => setIsMirror(!isMirror)}
                  className={`w-12 h-6 rounded-full transition-all relative border-2 border-y2k-primary ${isMirror ? 'bg-y2k-primary' : 'bg-white'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${isMirror ? 'left-6 bg-white' : 'left-1 bg-y2k-primary'}`}></div>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-y2k-primary uppercase tracking-widest flex items-center gap-2">
                  <Monitor size={14} /> Camera Source
                </label>
                <div className="space-y-2">
                  <button disabled={isSessionActive} className="w-full py-3 px-4 rounded-2xl bg-y2k-primary text-white text-xs font-black flex items-center justify-between border-2 border-y2k-primary">
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
            <div className="w-full bg-white p-4 rounded-3xl border-4 border-y2k-primary shadow-[12px_12px_0_0_#2F020C] flex justify-center">
              {inputMode === 'camera' ? (
                <div className="relative w-full max-w-[500px] aspect-[3/4] max-h-[70vh] bg-black border-4 border-y2k-primary rounded-2xl overflow-hidden flex items-center justify-center group">
                  {/* CLEAN CAMERA FEED */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover z-0 ${isMirror ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* COUNTDOWN OVERLAY */}
                  {timeLeft !== null && timeLeft > 0 && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <div 
                        key={timeLeft}
                        className="text-[180px] font-heading font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-in zoom-in fade-in duration-300"
                      >
                        {timeLeft}
                      </div>
                    </div>
                  )}

                  {!isSessionActive && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                      <button 
                        onClick={startPhotoSession}
                        className="w-24 h-24 bg-white rounded-full p-1.5 border-4 border-y2k-primary shadow-xl transition-all hover:scale-110 active:scale-95 group"
                      >
                        <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-y2k-primary transition-colors group-hover:bg-y2k-accent">
                          <CameraIcon size={24} className="text-white" fill="currentColor" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full max-w-[500px] aspect-[3/4] max-h-[70vh] w-full">
                  <input 
                    type="file" 
                    id="booth-main-upload" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    onChange={handleMainUploadChange} 
                  />
                  <label 
                    htmlFor="booth-main-upload"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="relative w-full h-full bg-y2k-bg border-4 border-dashed border-y2k-primary rounded-3xl flex flex-col items-center justify-center p-8 transition-all hover:bg-white cursor-pointer group"
                  >
                    <div className="bg-white p-6 rounded-2xl border-4 border-y2k-primary mb-6 text-y2k-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <FolderPlus size={48} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-xl font-serif font-black text-y2k-primary text-center uppercase tracking-tighter">CLICK OR DRAG & DROP PHOTOS</h4>
                    <div className="mt-8 px-8 py-3 bg-y2k-primary text-white rounded-full text-xs font-black tracking-widest uppercase border-2 border-y2k-shadow shadow-[4px_4px_0_0_#2F020C] transition-all hover:scale-105 active:scale-95">
                      CHOOSE LOCAL FILE
                    </div>
                  </label>
                </div>
              )}
            </div>
          </main>

          <aside className={`w-full lg:w-[320px] lg:sticky lg:top-36 transition-all ${isSessionActive ? 'scale-[0.95]' : ''}`}>
            <div className="notizblok p-8 rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] space-y-8">
              <div className="flex justify-between items-center border-b-2 border-y2k-primary/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-y2k-bg p-2 rounded-xl text-y2k-primary border-2 border-y2k-primary">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-y2k-primary lowercase">Photos</h3>
                </div>
                <span className="text-xs font-black px-4 py-1.5 bg-y2k-bg text-y2k-primary rounded-full border-2 border-y2k-primary tracking-widest">
                  {capturedPhotos.length}/{selectedTemplate.requiredPhotos}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: selectedTemplate.requiredPhotos }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`aspect-[3/4] rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 border-4 ${index < capturedPhotos.length ? 'border-y2k-primary bg-white scale-[0.98]' : 'border-dashed border-y2k-primary/20 bg-white/50'}`}
                  >
                    {index < capturedPhotos.length && capturedPhotos[index] ? (
                      <img src={capturedPhotos[index]} alt="Captured" className="w-full h-full object-cover animate-in zoom-in duration-500" />
                    ) : (
                      <span className="text-xl font-black text-y2k-primary/10">{index + 1}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  disabled={capturedPhotos.length < selectedTemplate.requiredPhotos || isSessionActive}
                  onClick={() => router.push('/result')}
                  className="w-full h-16 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white font-black text-lg border-2 border-y2k-shadow gap-3 transition-all active:scale-95 disabled:opacity-50 uppercase shadow-[4px_4px_0_0_#2F020C]"
                >
                  Finish Session
                  <Check size={20} strokeWidth={3} />
                </Button>
                <Button 
                  variant="ghost" 
                  disabled={isSessionActive}
                  onClick={handleReset}
                  className="w-full h-12 rounded-full text-y2k-primary/40 hover:text-red-500 font-bold flex gap-2"
                >
                  <RefreshCw size={16} />
                  Clear Session
                </Button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default function BoothPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-y2k-bg flex items-center justify-center font-serif text-y2k-primary">
        <div className="text-4xl font-heading font-black animate-pulse">Initializing Booth...</div>
      </div>
    }>
      <BoothContent />
    </Suspense>
  );
}
