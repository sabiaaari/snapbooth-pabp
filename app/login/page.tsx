'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      {/* Mobile Container Mockup */}
      <div className="w-full max-w-md bg-white min-h-[80vh] rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
        
        {/* Navigation / Header */}
        <div className="p-8 pb-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 font-black transition-colors">
            <ChevronLeft size={20} strokeWidth={3} />
            KEMBALI
          </Link>
        </div>

        <div className="flex-1 p-10 flex flex-col justify-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Halo lagi! 👋</h2>
            <p className="text-slate-500 font-bold text-lg leading-tight">Masuk buat akses Studio Frame kamu.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-800 font-black ml-1 uppercase text-[10px] tracking-widest">Alamat Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nama@keren.com" 
                className="rounded-full h-14 border-slate-100 bg-slate-50 px-6 focus:ring-purple-500 font-bold text-slate-900" 
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" name="password" className="text-slate-800 font-black ml-1 uppercase text-[10px] tracking-widest">Kata Sandi</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                className="rounded-full h-14 border-slate-100 bg-slate-50 px-6 focus:ring-purple-500 font-bold text-slate-900" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-16 rounded-full text-xl font-black shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-95">
              MASUK SEKARANG
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-slate-400 font-bold text-sm">
                Belum punya akun? <Link href="#" className="text-purple-600 font-black hover:underline underline-offset-4">Daftar Akun</Link>
              </p>
              <button className="text-[10px] text-slate-300 font-black uppercase tracking-widest hover:text-slate-400 transition-colors">Lupa Password?</button>
            </div>
          </div>
        </div>

        {/* Logo Footer */}
        <div className="p-8 flex justify-center items-center gap-2 opacity-20">
            <div className="bg-slate-900 p-1 rounded-lg">
                <Camera size={14} className="text-white" />
            </div>
            <span className="text-xs font-black tracking-tighter uppercase">SnapBooth</span>
        </div>
      </div>
    </div>
  );
}
