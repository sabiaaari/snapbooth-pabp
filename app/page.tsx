'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 font-serif text-y2k-primary">
      <section className="text-center space-y-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-y2k-card text-y2k-primary rounded-full text-xs font-black uppercase tracking-[0.2em] animate-bounce border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
          <Sparkles size={14} />
          <span>SnapBooth Experience 2026</span>
        </div>

        {/* Hero Title */}
        <h2 className="text-7xl md:text-7xl font-heading font-black lowercase leading-[0.85] text-y2k-primary">
          capture <br />
          your moments with <br />
          <span className="underline decoration-12">SnapBooth</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-y2k-primary/60 font-bold leading-relaxed max-w-2xl mx-auto lowercase italic">
          use aesthetic frames from our system, or create your very own custom frame.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link href="/templates">
            <Button variant="outline" className="border-4 border-y2k-primary text-y2k-primary bg-white hover:bg-y2k-card px-12 h-20 rounded-full text-2xl font-black transition-all hover:scale-105 active:scale-95 flex gap-4 shadow-[8px_8px_0_0_#2F020C]">
              <LayoutGrid size={28} strokeWidth={3} />
              Explore System Templates
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
