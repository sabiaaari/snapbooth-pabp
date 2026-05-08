'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, ShieldCheck, ChevronRight, Lock, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export type FrameTemplate = {
  id: string;
  name: string;
  imageUrl: string;
  requiredPhotos: number;
  date: string;
  color: string;
};

export default function DashboardPage() {
  const [userFrames, setUserFrames] = useState<FrameTemplate[]>([
    { id: '1', name: "Kawaii 6-Grid", imageUrl: "/frames/kawaii.png", requiredPhotos: 6, date: "Hari ini", color: "bg-pink-pastel" },
    { id: '2', name: "Wisuda 2024", imageUrl: "/frames/grad.png", requiredPhotos: 4, date: "2 hari lalu", color: "bg-red-100" },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [newFrame, setNewFrame] = useState({
    name: '',
    requiredPhotos: 4,
  });

  const handleSimulateUpload = () => {
    setIsUploading(true);
  };

  const handleSaveFrame = () => {
    const frame: FrameTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFrame.name || 'Untitled Frame',
      imageUrl: '/placeholder-frame.png',
      requiredPhotos: newFrame.requiredPhotos,
      date: 'Baru saja',
      color: 'bg-slate-100',
    };
    setUserFrames([frame, ...userFrames]);
    setIsUploading(false);
    setNewFrame({ name: '', requiredPhotos: 4 });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20 py-10 font-serif text-y2k-primary">
      {/* Header Profile */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b-4 border-y2k-primary/10">
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-y2k-primary font-black text-xs uppercase tracking-widest border-2 border-y2k-primary px-3 py-1 rounded-full w-fit bg-white shadow-[2px_2px_0_0_#2F020C]">
                <Lock size={14} />
                <span>Private Studio</span>
            </div>
            <h2 className="text-5xl font-heading font-black text-y2k-primary lowercase leading-none">
                Koleksi Template <br />
                <span className="underline decoration-8">Pribadi Anda</span>
            </h2>
            <div className="flex items-center gap-3 text-y2k-primary/40">
                <ShieldCheck size={20} className="text-y2k-primary" />
                <p className="font-bold text-sm uppercase tracking-widest italic">Aset Anda aman dan hanya untuk penggunaan pribadi</p>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] flex items-center gap-4">
            <div className="w-16 h-16 bg-y2k-primary rounded-2xl flex items-center justify-center text-white font-serif font-black text-2xl border-2 border-white shadow-inner">
                JD
            </div>
            <div>
                <p className="font-black text-xl text-y2k-primary leading-tight">John Doe</p>
                <p className="text-[10px] font-black text-y2k-primary uppercase tracking-widest mt-1 opacity-60">Snap Pro Member</p>
            </div>
        </div>
      </header>

      {/* Upload Section */}
      <section className="group space-y-8">
        <div 
          onClick={handleSimulateUpload}
          className="relative border-4 border-dashed border-y2k-primary bg-white rounded-[4rem] p-24 flex flex-col items-center justify-center transition-all hover:bg-y2k-bg cursor-pointer overflow-hidden shadow-[12px_12px_0_0_#2F020C]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#420D19_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
          <div className="bg-white p-10 rounded-3xl border-4 border-y2k-primary mb-8 text-y2k-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-[4px_4px_0_0_#2F020C]">
            <Upload size={80} strokeWidth={3} />
          </div>
          <h3 className="text-4xl font-heading font-black text-y2k-primary text-center lowercase tracking-tighter">
            Upload Frame Custom Anda
          </h3>
          <p className="text-y2k-primary/40 mt-4 font-bold text-lg text-center max-w-lg leading-relaxed italic">
            Seret desain PNG transparan Anda ke sini untuk mulai memotret dengan gaya unik Anda sendiri.
          </p>
        </div>

        {/* Metadata Form (Appears after upload) */}
        {isUploading && (
          <div className="notizblok p-10 rounded-[3rem] shadow-[16px_16px_0_0_#2F020C] border-4 border-y2k-primary animate-in zoom-in duration-300 relative overflow-hidden bg-white">
            <button onClick={() => setIsUploading(false)} className="absolute top-8 right-8 text-y2k-primary/40 hover:text-y2k-primary transition-colors">
              <X size={32} />
            </button>
            <div className="max-w-xl mx-auto space-y-8">
              <div className="space-y-2">
                <h4 className="text-3xl font-heading font-black text-y2k-primary lowercase tracking-tight">Detail Frame Baru</h4>
                <p className="text-y2k-primary/60 font-bold text-sm">Lengkapi informasi berikut sebelum menyimpan frame.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-y2k-primary/40 ml-1">Nama Frame</Label>
                  <Input 
                    placeholder="Contoh: Wedding Party" 
                    className="rounded-full h-14 border-2 border-y2k-primary bg-white px-6 font-bold text-y2k-primary"
                    value={newFrame.name}
                    onChange={(e) => setNewFrame({...newFrame, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-y2k-primary/40 ml-1">Jumlah Lubang Foto</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="12"
                    className="rounded-full h-14 border-2 border-y2k-primary bg-white px-6 font-bold text-y2k-primary"
                    value={newFrame.requiredPhotos}
                    onChange={(e) => setNewFrame({...newFrame, requiredPhotos: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveFrame}
                className="w-full h-16 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white text-xl font-black shadow-[8px_8px_0_0_#2F020C] transition-all hover:scale-[1.02] active:scale-95 border-2 border-y2k-shadow"
              >
                SIMPAN FRAME KE STUDIO
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* My Frames Grid */}
      <section className="space-y-12 pb-20">
        <div className="flex justify-between items-center px-4">
            <h3 className="text-4xl font-heading font-black text-y2k-primary lowercase tracking-tighter">
                Koleksi <span className="underline decoration-8">Terbaru</span>
            </h3>
            <div className="bg-white border-2 border-y2k-primary px-6 py-2 rounded-full text-xs font-black text-y2k-primary uppercase tracking-[0.2em] shadow-[4px_4px_0_0_#2F020C]">
                {userFrames.length} Frames Ready
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {userFrames.map((frame) => (
            <div key={frame.id} className="group relative">
                <div className="aspect-[3/4] border-4 border-y2k-primary rounded-3xl bg-white shadow-[12px_12px_0_0_#2F020C] overflow-hidden flex flex-col transition-all duration-500 group-hover:-translate-y-4">
                    <div className={`flex-1 ${frame.color} flex items-center justify-center relative overflow-hidden`}>
                         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
                         <ImageIcon size={60} strokeWidth={1} className="text-y2k-primary/10 drop-shadow-lg group-hover:scale-125 transition-transform duration-700" />
                         
                         {/* Stats Badge */}
                         <div className="absolute bottom-6 left-6 bg-white border-2 border-y2k-primary px-4 py-1.5 rounded-full text-[10px] font-black text-y2k-primary uppercase tracking-widest shadow-[2px_2px_0_0_#2F020C]">
                            {frame.requiredPhotos} Slots
                         </div>

                         <button className="absolute top-8 right-8 bg-white border-2 border-y2k-primary hover:bg-red-500 hover:text-white text-y2k-primary p-3 rounded-2xl transition-all shadow-[2px_2px_0_0_#2F020C]">
                            <Trash2 size={20} />
                         </button>
                    </div>
                    <div className="p-8 bg-white flex justify-between items-center border-t-4 border-y2k-primary">
                        <div>
                            <p className="font-heading font-black text-3xl text-y2k-primary lowercase tracking-tight">{frame.name}</p>
                            <p className="text-[10px] font-black text-y2k-primary/40 uppercase tracking-widest mt-1">{frame.date}</p>
                        </div>
                        <Link href="/booth">
                            <Button variant="ghost" className="w-14 h-14 rounded-2xl bg-y2k-bg text-y2k-primary/40 hover:text-y2k-primary hover:bg-white border-2 border-y2k-primary/10 hover:border-y2k-primary p-0 transition-all active:scale-90 shadow-[2px_2px_0_0_#2F020C]">
                                <ChevronRight size={32} strokeWidth={3} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
