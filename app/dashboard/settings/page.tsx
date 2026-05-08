'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  Palette, 
  Grid as GridIcon, 
  Type, 
  Save, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-8 relative">
      {/* Floating Save Toast */}
      {showSavedToast && (
        <div className="fixed top-8 right-8 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in zoom-in-95">
          <Check size={20} />
          <span className="font-bold">Settings saved successfully!</span>
        </div>
      )}

      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Booth Configuration</h1>
          <p className="text-slate-500 mt-1">Customize your photostrip design and booth behavior.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-2xl font-bold gap-2 shadow-lg shadow-purple-600/20"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save size={20} />
          )}
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <SettingsTab active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Monitor size={18} />} label="Booth Settings" />
          <SettingsTab active={activeTab === 'design'} onClick={() => setActiveTab('design')} icon={<Palette size={18} />} label="Photostrip Design" />
          <SettingsTab active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} icon={<GridIcon size={18} />} label="Layout & Frames" />
          <SettingsTab active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={<Type size={18} />} label="Branding & Text" />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900">General Configuration</CardTitle>
              <CardDescription>Configure how the booth behaves during the event.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Countdown Timer (sec)</label>
                  <input type="number" defaultValue={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Flash Intensity</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-900">
                    <option>Low</option>
                    <option selected>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-purple-900">Auto-Upload to Gallery</p>
                  <p className="text-xs text-purple-600">Instantly share photos to the public link.</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 cursor-pointer">
                  <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition"></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900">Design & Branding</CardTitle>
              <CardDescription>Setup the look and feel of the final photostrip.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex justify-center bg-slate-100 py-12 rounded-3xl border-2 border-dashed border-slate-200 relative group">
                <div className="bg-white p-3 shadow-2xl rounded-sm w-32 flex flex-col gap-1.5 transform rotate-3 hover:rotate-0 transition-all">
                  <div className="aspect-square bg-slate-200 rounded-sm"></div>
                  <div className="aspect-square bg-slate-200 rounded-sm"></div>
                  <div className="aspect-square bg-slate-200 rounded-sm"></div>
                  <div className="h-4 bg-purple-100 rounded-sm mt-2"></div>
                </div>
                <span className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Preview</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${active ? 'bg-white text-purple-600 shadow-xl shadow-slate-200 font-bold border-l-4 border-purple-600' : 'text-slate-500 hover:bg-white/60 font-medium'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className={`${active ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
    </button>
  );
}
