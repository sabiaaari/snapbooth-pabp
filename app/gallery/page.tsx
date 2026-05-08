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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">SnapBooth</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Guest Gallery</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400">
            <Filter size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-8 pb-32">
        {/* Event Banner */}
        <section className="text-center space-y-2 py-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Andi & Budi Wedding</h2>
          <p className="text-slate-500 font-medium">Capture the love, share the joy! ✨</p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="text-[10px] font-bold px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100 uppercase tracking-widest">
              Live Event
            </span>
            <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase tracking-widest">
              1,284 Photos
            </span>
          </div>
        </section>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-[3/4] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transform active:scale-95 transition-all">
              {/* Photo Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-100 bg-slate-50">
                <Camera size={48} strokeWidth={1} />
              </div>
              
              {/* Overlay with Quick Actions */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 text-white">
                  <Heart size={14} className="fill-red-500 text-red-500" />
                  <span className="text-[10px] font-bold">{photo.likes}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors">
                    <Download size={14} />
                  </button>
                  <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors">
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
            <Button className="w-full bg-slate-900 hover:bg-black text-white py-8 rounded-2xl shadow-2xl shadow-black/20 font-bold text-lg gap-3">
              <Camera size={24} />
              Open Camera Booth
            </Button>
          </Link>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 grayscale opacity-30 mb-4">
          <Camera size={16} />
          <span className="text-xs font-bold tracking-tighter uppercase">SnapBooth</span>
        </div>
        <p className="text-slate-400 text-xs font-medium italic">Photos are automatically deleted after 30 days.</p>
      </footer>
    </div>
  );
}
