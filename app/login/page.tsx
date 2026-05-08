'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/templates`,
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-y2k-bg flex items-center justify-center p-4 font-serif text-y2k-primary">
      {/* Back Button - Outside Card */}
      <div className="fixed top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-y2k-primary/60 hover:text-y2k-primary font-black transition-colors bg-white px-4 py-2 rounded-full border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
          <ChevronLeft size={20} strokeWidth={3} />
          KEMBALI
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border-4 border-y2k-primary rounded-3xl shadow-[16px_16px_0_0_#2F020C] p-10 space-y-12 relative overflow-hidden">
        {/* Decorative Notepad Background Element */}
        <div className="absolute inset-0 notizblok opacity-5 pointer-events-none"></div>

        <div className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-y2k-bg text-y2k-primary rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-y2k-primary mb-2">
            <Sparkles size={12} />
            <span>Studio Access</span>
          </div>
          <h1 className="text-7xl font-heading font-black text-y2k-primary lowercase leading-none">
            SnapBooth
          </h1>
          <p className="text-xl text-y2k-primary font-bold italic leading-tight">
            Masuk untuk menyimpan <br /> photostrip-mu!
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <Button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full h-20 rounded-full border-4 border-y2k-primary bg-white text-y2k-primary hover:bg-y2k-card font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-[8px_8px_0_0_#2F020C] disabled:opacity-50"
          >
            {isAuthenticating ? (
              <span className="animate-pulse">Membuka portal...</span>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12.16-4.53z"
                  />
                </svg>
                Lanjutkan dengan Google
              </>
            )}
          </Button>

          <p className="text-[10px] text-center text-y2k-primary/40 font-black uppercase tracking-widest px-8 leading-relaxed">
            Dengan masuk, kamu menyetujui syarat penggunaan & kebijakan privasi kami.
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -bottom-6 -right-6 text-y2k-primary/5 rotate-12">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
