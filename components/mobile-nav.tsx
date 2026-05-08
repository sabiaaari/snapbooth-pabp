'use client';

import React, { useState } from 'react';
import { Menu, X, Camera, LayoutDashboard, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  activePath: string;
}

export function MobileNav({ activePath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Mobile Top Bar */}
      <div className="bg-purple-900 text-white px-6 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-[60] shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <Camera className="w-5 h-5" />
          </div>
          <span className="font-black tracking-tight uppercase">SnapBooth</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[55] bg-purple-900 text-white animate-in fade-in duration-300">
          <div className="flex flex-col h-full pt-24 px-6 pb-8">
            <nav className="flex-1 space-y-2">
              <MobileItem 
                href="/dashboard" 
                icon={<LayoutDashboard size={24} />} 
                label="Dashboard" 
                active={activePath === '/dashboard'} 
                onClick={() => setIsOpen(false)}
              />
              <MobileItem 
                href="/gallery" 
                icon={<ImageIcon size={24} />} 
                label="Live Gallery" 
                active={activePath === '/gallery'} 
                onClick={() => setIsOpen(false)}
              />
              <MobileItem 
                href="/dashboard/settings" 
                icon={<Settings size={24} />} 
                label="Booth Config" 
                active={activePath === '/dashboard/settings'} 
                onClick={() => setIsOpen(false)}
              />
            </nav>

            <div className="pt-8 border-t border-purple-800 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-bold text-xl shadow-lg">A</div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">Admin User</span>
                  <span className="text-sm text-purple-300">admin@snapbooth.com</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-purple-700 text-purple-200 hover:bg-white/5 py-8 rounded-2xl text-lg font-bold flex gap-3"
              >
                <LogOut size={24} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileItem({ href, icon, label, active = false, onClick }: { href: string; icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        flex items-center gap-4 p-5 rounded-3xl transition-all
        ${active 
          ? 'bg-purple-600 text-white shadow-xl shadow-purple-950/40 font-bold scale-[1.02]' 
          : 'text-purple-200 hover:bg-white/5'}
      `}
    >
      {icon}
      <span className="text-xl">{label}</span>
    </Link>
  );
}
