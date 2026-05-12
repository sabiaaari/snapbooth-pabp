'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Plus, User, LogOut, Star, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center justify-between px-6 md:px-12 h-20
      ${isScrolled || isMenuOpen
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b-4 border-y2k-primary/20' 
        : 'bg-white border-b-2 border-y2k-primary/5'
      }`}
    >
      {/* Thematic Y2K Separator Line (Only visible on scroll or when menu open) */}
      {(isScrolled || isMenuOpen) && (
        <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden pointer-events-none">
          <div className="w-[200%] h-full bg-[repeating-linear-gradient(90deg,#420D19,420D19_10px,transparent_10px,transparent_20px)] opacity-20 animate-marquee"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-3 group z-50" onClick={() => setIsMenuOpen(false)}>
          <span className="text-3xl font-logo text-y2k-primary lowercase">
            SnapBooth
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm font-serif font-bold uppercase tracking-widest text-y2k-primary">
          <Link href="/" className="hover:underline decoration-4 transition-all">Home</Link>
          <Link href="/templates" className="hover:underline decoration-4 transition-all">Templates</Link>
          <Link href="/about" className="hover:underline decoration-4 transition-all">About</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button className="bg-y2k-primary hover:bg-y2k-accent text-white rounded-full px-8 h-12 font-serif font-black border-2 border-y2k-shadow gap-2 transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#2F020C]">
                <Star size={18} fill="currentColor" />
                CREATE TEMPLATE
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <div className="w-12 h-12 rounded-full bg-y2k-primary border-4 border-y2k-bg flex items-center justify-center text-white font-serif font-black text-sm shadow-[4px_4px_0_0_#2F020C] overflow-hidden">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="rounded-full w-12 h-12 p-0 bg-y2k-bg text-y2k-primary hover:text-white hover:bg-y2k-accent border-2 border-y2k-primary shadow-[2px_2px_0_0_#2F020C]"
                >
                  <LogOut size={22} />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="rounded-full w-12 h-12 p-0 bg-y2k-bg text-y2k-primary hover:text-white hover:bg-y2k-accent border-2 border-y2k-primary shadow-[2px_2px_0_0_#2F020C]">
                  <User size={24} />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="md:hidden z-50 p-2 text-y2k-primary hover:bg-y2k-bg rounded-xl border-2 border-transparent active:border-y2k-primary transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
          </button>
        </div>

        {/* Mobile Menu Backdrop (Fade-in) */}
        <div 
          className={`md:hidden fixed inset-0 bg-black/60 z-[90] transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu Side Panel (Slide-in from Right) */}
        <div className={`md:hidden fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-white z-[100] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header inside Menu */}
          <div className="flex items-center justify-between px-6 h-20 border-b-4 border-y2k-primary/10">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <span className="text-3xl font-logo text-y2k-primary lowercase">
                SnapBooth
              </span>
            </Link>
            <button 
              className="p-2 text-y2k-primary hover:bg-y2k-bg rounded-xl border-2 border-y2k-primary/10 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={28} strokeWidth={3} />
            </button>
          </div>

          <div className="flex flex-col p-8 space-y-10 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 text-3xl font-heading font-black lowercase text-y2k-primary">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-y2k-primary/5 pb-4 hover:pl-2 transition-all">Home</Link>
              <Link href="/templates" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-y2k-primary/5 pb-4 hover:pl-2 transition-all">Templates</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="border-b-4 border-y2k-primary/5 pb-4 hover:pl-2 transition-all">About</Link>
            </div>

            <div className="space-y-6 pt-4">
              <Link href={user ? "/dashboard" : "/login"} onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-y2k-primary hover:bg-y2k-accent text-white rounded-[2rem] h-20 font-serif font-black text-xl border-4 border-y2k-shadow gap-3 shadow-[8px_8px_0_0_#2F020C] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                  <Star size={24} fill="currentColor" />
                  CREATE TEMPLATE
                </Button>
              </Link>

              {user ? (
                <div className="flex flex-col gap-4">
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 bg-y2k-bg p-6 rounded-[2rem] border-4 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
                    <div className="w-14 h-14 rounded-full bg-y2k-primary flex items-center justify-center text-white font-serif font-black text-lg border-2 border-white">
                      {user.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-y2k-primary uppercase tracking-widest text-sm">Dashboard</span>
                      <span className="text-[10px] text-y2k-primary/60 font-bold uppercase truncate max-w-[150px]">{user.email}</span>
                    </div>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full h-16 rounded-full border-4 border-red-500 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} /> SIGN OUT
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-20 rounded-[2rem] border-4 border-y2k-primary text-y2k-primary font-black text-lg shadow-[8px_8px_0_0_#2F020C] hover:bg-y2k-bg transition-all">
                    <User size={24} className="mr-2" /> SIGN IN / REGISTER
                  </Button>
                </Link>
              )}
            </div>

            {/* Decorative Y2K Element */}
            <div className="mt-auto pt-10 flex justify-center opacity-20">
               <div className="w-24 h-1 bg-y2k-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
