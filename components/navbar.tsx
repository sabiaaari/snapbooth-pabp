'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Plus, User, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-7xl h-20 bg-white rounded-full border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] z-50 flex items-center justify-between px-8 md:px-12">
      <Link href="/" className="flex items-center gap-3 group">
        <span className="text-3xl font-logo text-y2k-primary lowercase">
          SnapBooth
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10 text-sm font-serif font-bold uppercase tracking-widest text-y2k-primary">
        <Link href="/" className="hover:underline decoration-4 transition-all">Home</Link>
        <Link href="/templates" className="hover:underline decoration-4 transition-all">Templates</Link>
        <Link href="/about" className="hover:underline decoration-4 transition-all">Tentang</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href={user ? "/dashboard" : "/login"}>
          <Button className="hidden sm:flex bg-y2k-primary hover:bg-y2k-accent text-white rounded-full px-8 h-12 font-serif font-black border-2 border-y2k-shadow gap-2 transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#2F020C]">
            <Star size={18} fill="currentColor" />
            BUAT TEMPLATE
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
    </nav>
  );
}
