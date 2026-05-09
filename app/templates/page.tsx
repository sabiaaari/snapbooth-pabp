'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, ArrowRight, Star, Sparkles, Camera, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export type Template = {
  id: string;
  name: string;
  image_url: string;
  required_photos: number;
  is_system: boolean;
  user_id?: string;
  category?: string;
  color?: string;
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase.from('templates').select('*');
        
        if (user) {
          query = query.or(`user_id.eq.${user.id},is_system.eq.true`);
        } else {
          query = query.eq('is_system', true);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelectTemplate = (templateId: string, requiredPhotos: number) => {
    router.push(`/booth?templateId=${templateId}&slots=${requiredPhotos}`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-8 md:px-12 lg:px-16 space-y-20 py-10 font-serif text-y2k-primary">
      <header className="text-center space-y-6 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white text-y2k-primary rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
          <Sparkles size={14} />
          <span>Curated by SnapBooth</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-heading font-black lowercase text-y2k-primary">
          all <span className="underline decoration-8">templates</span>
        </h2>
        <p className="text-lg text-y2k-primary/60 font-bold leading-relaxed max-w-xl mx-auto">
          Explore our system collection or your own custom designs.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <RefreshCw className="animate-spin text-y2k-primary/20" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border-4 border-y2k-primary bg-white transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#2F020C] cursor-pointer"
              onClick={() => handleSelectTemplate(template.id, template.required_photos)}
            >
              {/* THUMBNAIL AREA */}
              <div className={`relative aspect-[3/4] ${template.color || (template.is_system ? 'bg-blue-50' : 'bg-pink-50')} flex items-center justify-center overflow-hidden p-8 border-b-4 border-y2k-primary`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
                
                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                  <Image 
                    src={template.image_url}
                    alt={template.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* SYSTEM/USER BADGE */}
                <div className="absolute top-6 left-6 bg-y2k-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border-2 border-white shadow-md">
                  {template.is_system ? <Zap size={8} fill="currentColor" /> : <Star size={8} fill="currentColor" />} 
                  {template.is_system ? (template.category || 'System') : 'Custom'}
                </div>

                {/* SLOT BADGE */}
                <div className="absolute bottom-6 right-6 bg-white border-2 border-y2k-primary px-3 py-1 rounded-xl shadow-[2px_2px_0_0_#2F020C] flex items-center gap-1.5 transform -rotate-2">
                  <Camera size={10} className="text-y2k-primary" />
                  <span className="text-[10px] font-black uppercase tracking-tight">{template.required_photos} Slots</span>
                </div>
              </div>

              {/* INFO AREA */}
              <div className="p-6 flex flex-col gap-4 bg-white flex-1 justify-between">
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-2xl text-y2k-primary lowercase tracking-tight">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[8px] font-black text-y2k-primary/40 uppercase tracking-widest">
                    {template.is_system ? <Star size={8} fill="currentColor" /> : <RefreshCw size={8} />} 
                    {template.is_system ? 'Official SnapBooth Asset' : 'Private User Asset'}
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white font-black text-xs tracking-widest uppercase border-2 border-y2k-shadow shadow-[4px_4px_0_0_#2F020C] transition-all active:scale-95 group-hover:bg-y2k-accent"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
