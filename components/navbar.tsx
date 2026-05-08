'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Plus, User, LogOut } from 'lucide-react';
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
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-7xl h-20 bg-white/90 backdrop-blur-xl rounded-full border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between px-8 md:px-12">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="bg-purple-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-purple-200">
          <Camera size={24} className="text-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic">
          Snap<span className="text-purple-600">Booth</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-400">
        <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
        <Link href="/templates" className="hover:text-purple-600 transition-colors">Templates</Link>
        <Link href="/about" className="hover:text-purple-600 transition-colors">Tentang</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href={user ? "/dashboard" : "/login"}>
          <Button className="hidden sm:flex bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 font-black shadow-lg shadow-purple-200 gap-2 transition-all hover:scale-105 active:scale-95">
            <Plus size={18} strokeWidth={3} />
            BUAT TEMPLATE
          </Button>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-purple-100 flex items-center justify-center text-white font-black text-sm shadow-md overflow-hidden">
                {user.email?.substring(0, 2).toUpperCase()}
              </div>
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="rounded-full w-12 h-12 p-0 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <LogOut size={22} />
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="rounded-full w-12 h-12 p-0 bg-slate-50 text-slate-400 hover:text-purple-600">
              <User size={24} />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
