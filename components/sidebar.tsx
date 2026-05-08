import React from 'react';
import Link from 'next/link';
import { Camera, LayoutDashboard, Image as ImageIcon, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activePath: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  return (
    <aside className="w-64 bg-y2k-primary text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-[4px_0_15px_rgba(47,2,12,0.3)] hidden lg:flex border-r-4 border-white/10 font-serif">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-white p-2 rounded-2xl shadow-[4px_4px_0_0_#2F020C]">
          <Camera className="w-6 h-6 text-y2k-primary" />
        </div>
        <span className="text-2xl font-logo lowercase tracking-tight">SnapBooth</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={activePath === '/dashboard'} 
        />
        <SidebarItem 
          href="/gallery" 
          icon={<ImageIcon size={20} />} 
          label="Live Gallery" 
          active={activePath === '/gallery'} 
        />
        <SidebarItem 
          href="/dashboard/settings" 
          icon={<Settings size={20} />} 
          label="Booth Config" 
          active={activePath === '/dashboard/settings'} 
        />
      </nav>

      {/* User Info / Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-4 mb-2 flex items-center gap-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-white text-y2k-primary flex items-center justify-center font-black text-lg shadow-[2px_2px_0_0_#2F020C]">A</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-heading font-black lowercase truncate text-white">Admin User</span>
            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest truncate">admin@snapbooth.com</span>
          </div>
        </div>
        <button className="flex items-center gap-3 text-white/60 hover:text-white hover:bg-white/5 transition-all w-full px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`
      w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 group
      ${active 
        ? 'bg-white text-y2k-primary shadow-xl shadow-black/20 font-black scale-[1.02]' 
        : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'}
    `}>
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
    </Link>
  );
}
