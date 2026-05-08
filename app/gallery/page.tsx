import React from 'react';
import { Camera, Download, Share2, Heart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PublicGalleryPage() {
  // Dummy data for gallery
  const photos = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    url: `/photo-${i}.jpg`,
    likes: Math.floor(Math.random() * 50),
  }));

  return (
    <div className="min-h-screen bg-y2k-bg font-serif text-y2k-primary">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-y2k-primary px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-y2k-primary p-1.5 rounded-lg shadow-[2px_2px_0_0_#2F020C]">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-logo lowercase tracking-tight text-y2k-primary leading-none">SnapBooth</h1>
              <p className="text-[10px] text-y2k-primary/60 font-black uppercase mt-1 tracking-widest">Guest Gallery</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-y2k-primary">
            <Filter size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-12 pb-32">
        {/* Event Banner */}
        <section className="text-center space-y-4 py-8 bg-white rounded-[2rem] border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C]">
          <h2 className="text-4xl font-heading font-black text-y2k-primary tracking-tight lowercase">Andi & Budi Wedding</h2>
          <p className="text-y2k-primary/60 font-bold italic">Capture the love, share the joy! ✨</p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="text-[10px] font-black px-4 py-1.5 bg-y2k-bg text-y2k-primary rounded-full border-2 border-y2k-primary shadow-[2px_2px_0_0_#2F020C]">
              Live Event
            </span>
            <span className="text-[10px] font-black px-4 py-1.5 bg-y2k-primary text-white rounded-full border-2 border-y2k-primary shadow-[2px_2px_0_0_#2F020C]">
              1,284 Photos
            </span>
          </div>
        </section>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-[3/4] bg-white rounded-2xl border-4 border-y2k-primary shadow-[4px_4px_0_0_#2F020C] overflow-hidden transform active:scale-95 transition-all hover:-translate-y-1">
              {/* Photo Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-y2k-primary/10 bg-y2k-bg">
                <Camera size={48} strokeWidth={1} />
              </div>
              
              {/* Overlay with Quick Actions */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-y2k-primary/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 text-white">
                  <Heart size={14} className="fill-red-500 text-red-500" />
                  <span className="text-[10px] font-black">{photo.likes}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors border border-white/30">
                    <Download size={14} />
                  </button>
                  <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors border border-white/30">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button for Booth (UX Shortcut) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <Link href="/booth">
            <Button className="w-full bg-y2k-primary hover:bg-y2k-accent text-white py-8 rounded-2xl shadow-[0_20px_50px_rgba(47,2,12,0.3)] font-black text-xl gap-3 border-4 border-white active:scale-95 transition-all shadow-[4px_4px_0_0_#2F020C]">
              <Camera size={24} />
              Open Camera Booth
            </Button>
          </Link>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-y2k-primary/20 mb-4">
          <Camera size={16} />
          <span className="text-xs font-black tracking-widest uppercase">SnapBooth</span>
        </div>
        <p className="text-y2k-primary/40 text-xs font-bold italic">Photos are automatically deleted after 30 days.</p>
      </footer>
    </div>
  );
}
