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
    { id: '1', name: "Kawaii 6-Grid", imageUrl: "/frames/kawaii.png", requiredPhotos: 6, date: "Hari ini", color: "bg-purple-100" },
    { id: '2', name: "Wisuda 2024", imageUrl: "/frames/grad.png", requiredPhotos: 4, date: "2 hari lalu", color: "bg-blue-100" },
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
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20 py-10">
      {/* Header Profile */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b-4 border-slate-100">
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest">
                <Lock size={14} />
                <span>Private Studio</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Koleksi Template <br />
                <span className="text-purple-600">Pribadi Anda</span>
            </h2>
            <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck size={20} className="text-emerald-500" />
                <p className="font-bold text-sm uppercase tracking-widest italic">Aset Anda aman dan hanya untuk penggunaan pribadi</p>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner">
                JD
            </div>
            <div>
                <p className="font-black text-xl text-slate-900 leading-tight">John Doe</p>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">Snap Pro Member</p>
            </div>
        </div>
      </header>

      {/* Upload Section */}
      <section className="group space-y-8">
        <div 
          onClick={handleSimulateUpload}
          className="relative border-[6px] border-dashed border-purple-200 bg-purple-50/20 rounded-[4rem] p-24 flex flex-col items-center justify-center transition-all hover:bg-purple-50/40 hover:border-purple-400 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-purple-200 mb-8 text-purple-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
            <Upload size={80} strokeWidth={3} />
          </div>
          <h3 className="text-4xl font-black text-slate-900 text-center uppercase italic tracking-tighter">
            Upload Frame Custom Anda
          </h3>
          <p className="text-slate-400 mt-4 font-bold text-lg text-center max-w-lg leading-relaxed italic">
            Seret desain PNG transparan Anda ke sini untuk mulai memotret dengan gaya unik Anda sendiri.
          </p>
        </div>

        {/* Metadata Form (Appears after upload) */}
        {isUploading && (
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-purple-600 animate-in zoom-in duration-300 relative overflow-hidden">
            <button onClick={() => setIsUploading(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={32} />
            </button>
            <div className="max-w-xl mx-auto space-y-8">
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Detail Frame Baru</h4>
                <p className="text-slate-500 font-bold text-sm">Lengkapi informasi berikut sebelum menyimpan frame.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Frame</Label>
                  <Input 
                    placeholder="Contoh: Wedding Party" 
                    className="rounded-full h-14 border-slate-100 bg-slate-50 px-6 font-bold"
                    value={newFrame.name}
                    onChange={(e) => setNewFrame({...newFrame, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Jumlah Lubang Foto</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="12"
                    className="rounded-full h-14 border-slate-100 bg-slate-50 px-6 font-bold"
                    value={newFrame.requiredPhotos}
                    onChange={(e) => setNewFrame({...newFrame, requiredPhotos: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveFrame}
                className="w-full h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-black shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-95"
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
            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                Koleksi <span className="text-purple-600">Terbaru</span>
            </h3>
            <div className="bg-slate-50 px-6 py-2 rounded-full text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                {userFrames.length} Frames Ready
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {userFrames.map((frame) => (
            <div key={frame.id} className="group relative">
                <div className="aspect-[3/4] border-[6px] border-purple-600 rounded-[3rem] bg-white shadow-2xl shadow-purple-200/20 overflow-hidden flex flex-col transition-all duration-500 group-hover:-translate-y-4">
                    <div className={`flex-1 ${frame.color} flex items-center justify-center relative overflow-hidden`}>
                         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
                         <ImageIcon size={60} strokeWidth={1} className="text-white drop-shadow-lg group-hover:scale-125 transition-transform duration-700" />
                         
                         {/* Stats Badge */}
                         <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest border border-white">
                            {frame.requiredPhotos} Slots
                         </div>

                         <button className="absolute top-8 right-8 bg-white/20 hover:bg-red-500 text-white p-3 rounded-2xl backdrop-blur-md transition-all">
                            <Trash2 size={20} />
                         </button>
                    </div>
                    <div className="p-8 bg-white flex justify-between items-center border-t-4 border-slate-50">
                        <div>
                            <p className="font-black text-xl text-slate-900 tracking-tight uppercase">{frame.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{frame.date}</p>
                        </div>
                        <Link href="/booth">
                            <Button variant="ghost" className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 hover:text-purple-600 hover:bg-purple-50 p-0 transition-all active:scale-90">
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
