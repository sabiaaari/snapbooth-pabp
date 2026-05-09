'use client';

import React from 'react';
import { Camera, Sparkles, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const steps = [
    {
      icon: <LayoutGrid className="text-maroon" size={32} />,
      title: "Choose Template",
      description: "Pick from our aesthetic system template collection or create your own custom designs in the Studio."
    },
    {
      icon: <Camera className="text-maroon" size={32} />,
      title: "Get Ready",
      description: "Grant camera access and position yourself in front of the screen with good lighting."
    },
    {
      icon: <Zap className="text-maroon" size={32} />,
      title: "Snap & Share",
      description: "Hit the shutter button to take photos, apply frames, and download your results instantly."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 py-10 font-serif text-y2k-primary">
      {/* Hero Section */}
      <header className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-y2k-card text-y2k-primary rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-y2k-primary/20 shadow-[4px_4px_0_0_#2F020C]">
          <Info size={14} />
          <span>App Info</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter leading-none uppercase italic">
          About <span className="text-y2k-primary">SnapBooth</span>
        </h1>
        <p className="text-xl text-y2k-primary/60 font-bold leading-relaxed max-w-2xl mx-auto">
          SnapBooth is a modern virtual photobooth platform designed to provide a fun and personal photography experience directly from your browser.
        </p>
      </header>

      {/* How to Use Section */}
      <section className="space-y-16">
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase italic">How to Use</h2>
            <div className="h-1.5 w-24 bg-y2k-primary rounded-full mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
                <div key={index} className="bg-white p-10 rounded-[3rem] retro-outline shadow-[12px_12px_0_0_#2F020C] space-y-6 group hover:-translate-y-2 transition-all border-4 border-y2k-primary">
                    <div className="bg-y2k-bg w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-y2k-primary group-hover:text-white transition-colors border-2 border-y2k-primary">
                        {step.icon}
                    </div>
                    <h3 className="text-3xl font-heading font-black text-y2k-primary tracking-tight lowercase">{step.title}</h3>
                    <p className="text-y2k-primary/70 font-bold leading-relaxed">{step.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Features Detail */}
      <section className="bg-y2k-primary rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[16px_16px_0_0_#2F020C] border-4 border-y2k-shadow">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter uppercase italic leading-none">
                    Security & <br />
                    <span className="text-white/80">Your Privacy</span>
                </h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <ShieldCheck className="text-white/80 shrink-0" size={28} />
                        <p className="text-white/70 font-bold text-lg leading-relaxed font-serif">
                            <span className="text-white font-heading font-black text-xl">Personal Assets:</span> Frames you create are private and only accessible by you in your Personal Frame Studio.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Sparkles className="text-white/80 shrink-0" size={28} />
                        <p className="text-white/70 font-bold text-lg leading-relaxed font-serif">
                            <span className="text-white font-heading font-black text-xl">Available on 2 Platforms:</span> SnapBooth runs on both web and mobile platforms.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border-4 border-white/20 space-y-8 text-center">
                <p className="text-3xl font-heading font-black lowercase">Ready to start snapping?</p>
                <Link href="/templates" className="block">
                    <Button className="w-full bg-white text-y2k-primary hover:bg-y2k-card h-20 rounded-full text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex gap-4 justify-center border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C]">
                        <Camera size={28} strokeWidth={3} />
                        EXPLORE TEMPLATES
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}

// Simple LayoutGrid for use in about page
function LayoutGrid({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}
