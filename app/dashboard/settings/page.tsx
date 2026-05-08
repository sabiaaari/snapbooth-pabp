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
    <div className="p-8 relative font-serif text-y2k-primary">
      {/* Floating Save Toast */}
      {showSavedToast && (
        <div className="fixed top-8 right-8 z-[100] bg-y2k-primary text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in zoom-in-95 border-2 border-white shadow-[4px_4px_0_0_#2F020C]">
          <Check size={20} />
          <span className="font-bold">Settings saved successfully!</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-y2k-primary lowercase">Booth Configuration</h1>
          <p className="text-y2k-primary/60 mt-1 font-bold">Customize your photostrip design and booth behavior.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-y2k-primary hover:bg-y2k-accent text-white px-8 py-6 rounded-full font-black gap-2 shadow-[8px_8px_0_0_#2F020C] border-2 border-y2k-shadow"
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
        <div className="lg:col-span-1 space-y-4">
          <SettingsTab active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Monitor size={18} />} label="Booth Settings" />
          <SettingsTab active={activeTab === 'design'} onClick={() => setActiveTab('design')} icon={<Palette size={18} />} label="Photostrip Design" />
          <SettingsTab active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} icon={<GridIcon size={18} />} label="Layout & Frames" />
          <SettingsTab active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={<Type size={18} />} label="Branding & Text" />
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Card className="rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b-2 border-y2k-primary/10 bg-y2k-bg/30">
              <CardTitle className="text-2xl font-heading font-black text-y2k-primary lowercase">General Configuration</CardTitle>
              <CardDescription className="text-y2k-primary/60 font-bold">Configure how the booth behaves during the event.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-y2k-primary ml-1 uppercase tracking-widest">Countdown Timer (sec)</label>
                  <input type="number" defaultValue={3} className="w-full px-4 py-3 bg-y2k-bg/30 border-2 border-y2k-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-y2k-primary/10 transition-all text-y2k-primary font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-y2k-primary ml-1 uppercase tracking-widest">Flash Intensity</label>
                  <select className="w-full px-4 py-3 bg-y2k-bg/30 border-2 border-y2k-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-y2k-primary/10 transition-all appearance-none text-y2k-primary font-bold">
                    <option>Low</option>
                    <option selected>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-y2k-bg rounded-2xl border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-y2k-primary uppercase tracking-tighter">Auto-Upload to Gallery</p>
                  <p className="text-xs text-y2k-primary/60 font-bold italic">Instantly share photos to the public link.</p>
                </div>
                <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-y2k-primary cursor-pointer border-2 border-y2k-shadow">
                  <span className="inline-block h-5 w-5 translate-x-6 transform rounded-full bg-white transition shadow-sm"></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b-2 border-y2k-primary/10 bg-y2k-bg/30">
              <CardTitle className="text-2xl font-heading font-black text-y2k-primary lowercase">Design & Branding</CardTitle>
              <CardDescription className="text-y2k-primary/60 font-bold">Setup the look and feel of the final photostrip.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex justify-center bg-y2k-bg/50 py-12 rounded-3xl border-4 border-dashed border-y2k-primary/20 relative group overflow-hidden">
                <div className="absolute inset-0 notizblok opacity-20"></div>
                <div className="bg-white p-4 shadow-[12px_12px_0_0_#2F020C] border-4 border-y2k-primary rounded-sm w-36 flex flex-col gap-2 transform rotate-3 hover:rotate-0 transition-all relative z-10">
                  <div className="aspect-square bg-y2k-bg rounded-sm border-2 border-y2k-primary/10"></div>
                  <div className="aspect-square bg-y2k-bg rounded-sm border-2 border-y2k-primary/10"></div>
                  <div className="aspect-square bg-y2k-bg rounded-sm border-2 border-y2k-primary/10"></div>
                  <div className="h-4 bg-y2k-primary rounded-sm mt-2"></div>
                </div>
                <span className="absolute top-4 right-4 text-[10px] font-black text-y2k-primary/40 uppercase tracking-widest z-10">Live Preview</span>
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
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all border-4 ${active ? 'bg-y2k-primary text-white border-y2k-primary shadow-[4px_4px_0_0_#2F020C] font-black' : 'text-y2k-primary/40 border-transparent hover:bg-white/60 font-bold'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="uppercase text-xs tracking-widest">{label}</span>
      </div>
      <ChevronRight size={16} className={`${active ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
    </button>
  );
}
