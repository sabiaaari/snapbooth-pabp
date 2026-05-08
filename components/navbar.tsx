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
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-7xl h-20 bg-white rounded-full border-4 border-[#5D0E11] shadow-[8px_8px_0px_0px_rgba(93,14,17,1)] z-50 flex items-center justify-between px-8 md:px-12">
      <Link href="/" className="flex items-center gap-3 group">
        <span className="text-3xl font-script text-[#5D0E11] lowercase">
          SnapBooth
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10 text-sm font-serif font-bold uppercase tracking-widest text-[#5D0E11]">
        <Link href="/" className="hover:underline decoration-4 transition-all">Home</Link>
        <Link href="/templates" className="hover:underline decoration-4 transition-all">Templates</Link>
        <Link href="/about" className="hover:underline decoration-4 transition-all">Tentang</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href={user ? "/dashboard" : "/login"}>
          <Button className="hidden sm:flex bg-[#5D0E11] hover:bg-[#3d0a0c] text-white rounded-full px-8 h-12 font-serif font-black border-2 border-[#5D0E11] gap-2 transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <Star size={18} fill="currentColor" />
            BUAT TEMPLATE
          </Button>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <div className="w-12 h-12 rounded-full bg-[#5D0E11] border-4 border-[#FDF2F2] flex items-center justify-center text-white font-serif font-black text-sm shadow-md overflow-hidden">
                {user.email?.substring(0, 2).toUpperCase()}
              </div>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="rounded-full w-12 h-12 p-0 bg-[#FDF2F2] text-[#5D0E11] hover:text-red-500 hover:bg-red-50 border-2 border-[#5D0E11]"
            >
              <LogOut size={22} />
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="rounded-full w-12 h-12 p-0 bg-[#FDF2F2] text-[#5D0E11] hover:text-[#5D0E11] border-2 border-[#5D0E11]">
              <User size={24} />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
