import React from 'react';
import Link from 'next/link';
import { Camera, LayoutDashboard, Image as ImageIcon, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activePath: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  return (
    <aside className="w-64 bg-purple-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl shadow-purple-950/20 hidden lg:flex">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-purple-600 p-2 rounded-2xl shadow-lg shadow-purple-600/30">
          <Camera className="w-6 h-6" />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase">SnapBooth</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
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
      <div className="p-4 border-t border-purple-800/50">
        <div className="px-4 py-4 mb-2 flex items-center gap-3 bg-purple-800/30 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-lg">A</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate text-white">Admin User</span>
            <span className="text-[10px] text-purple-300 truncate">admin@snapbooth.com</span>
          </div>
        </div>
        <button className="flex items-center gap-3 text-purple-300 hover:text-white hover:bg-white/5 transition-all w-full px-4 py-3 rounded-xl font-medium">
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
      w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
      ${active 
        ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20 font-bold' 
        : 'text-purple-200 hover:bg-purple-800/50 hover:text-white font-medium'}
    `}>
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
