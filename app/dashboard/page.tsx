'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  X, 
  LogOut, 
  Sparkles, 
  LayoutGrid, 
  RefreshCw, 
  Star, 
  Zap, 
  Camera,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export type FrameTemplate = {
  id: string;
  name: string;
  image_url: string;
  required_photos: number;
  is_system: boolean;
  user_id?: string;
  category?: string;
  created_at: string;
  color?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userFrames, setUserFrames] = useState<FrameTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState('');
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newFrame, setNewFrame] = useState({
    name: '',
    requiredPhotos: 4,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      setProfileName(session.user.user_metadata?.username || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
      
      // Fetch user's templates
      fetchTemplates(session.user.id);
    };

    checkUser();
  }, [router]);

  const fetchTemplates = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or(`user_id.eq.${userId},is_system.eq.true`)
        .order('created_at', { ascending: false });

      if (error) {
        // Check for "relation does not exist" error (code 42P01)
        if (error.code === '42P01') {
          console.warn('The "templates" table does not exist in your Supabase database. Falling back to local state.');
          setUserFrames([]);
          return;
        }
        throw error;
      }
      setUserFrames(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrameSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      alert('Mohon unggah file dengan format PNG!');
      return;
    }

    setSelectedFrame(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setIsUploading(true);
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSaveFrame = async () => {
    if (!user) return;

    try {
      const frameData = {
        user_id: user.id,
        name: newFrame.name || 'Untitled Frame',
        image_url: previewUrl || '/placeholder-frame.png',
        required_photos: newFrame.requiredPhotos,
        is_system: false,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('templates')
        .insert([frameData])
        .select();

      if (error) {
        if (error.code === '42P01') {
           const mockFrame: FrameTemplate = {
             id: Math.random().toString(36).substr(2, 9),
             name: frameData.name,
             image_url: frameData.image_url,
             required_photos: frameData.required_photos,
             is_system: false,
             created_at: frameData.created_at,
             color: 'bg-pink-50',
           };
           setUserFrames([mockFrame, ...userFrames]);
           setIsUploading(false);
           setNewFrame({ name: '', requiredPhotos: 4 });
           setPreviewUrl(null);
           setSelectedFrame(null);
           return;
        }
        throw error;
      }

      if (data) {
        setUserFrames([data[0], ...userFrames]);
      }
      
      setIsUploading(false);
      setNewFrame({ name: '', requiredPhotos: 4 });
      setPreviewUrl(null);
      setSelectedFrame(null);
    } catch (error: any) {
      console.error('Error saving frame:', error);
      alert('Failed to save frame: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteFrame = async (e: React.MouseEvent, frameId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', frameId)
        .eq('user_id', user.id);

      if (error) throw error;

      setUserFrames(userFrames.filter(f => f.id !== frameId));
    } catch (error: any) {
      console.error('Error deleting frame:', error);
      alert('Failed to delete frame: ' + (error.message || 'Unknown error'));
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4 text-y2k-primary">
        <Sparkles className="animate-spin" size={48} />
        <p className="font-serif font-black uppercase tracking-widest text-sm">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-20 py-10 font-serif text-y2k-primary">
      {/* Header Profile */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b-4 border-y2k-primary/10 pt-20">
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-y2k-primary font-black text-xs uppercase tracking-widest border-2 border-y2k-primary px-3 py-1 rounded-full w-fit bg-white shadow-[2px_2px_0_0_#2F020C]">
                <Lock size={14} />
                <span>Private Studio</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-y2k-primary lowercase leading-none">
                Welcome back, <br />
                <span className="underline decoration-8">{profileName}!</span>
            </h2>
            <div className="flex items-center gap-3 text-y2k-primary/40">
                <ShieldCheck size={20} className="text-y2k-primary" />
                <p className="font-bold text-sm uppercase tracking-widest italic">Your custom frames are safe in your personal vault</p>
            </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl border-4 border-y2k-primary shadow-[8px_8px_0_0_#2F020C] flex items-center gap-4">
              <div className="w-16 h-16 bg-y2k-primary rounded-2xl flex items-center justify-center text-white font-serif font-black text-2xl border-2 border-white shadow-inner">
                  {profileName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                  <p className="font-black text-xl text-y2k-primary leading-tight">{profileName}</p>
                  <p className="text-[10px] font-black text-y2k-primary uppercase tracking-widest mt-1 opacity-60">Snap Pro Member</p>
              </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="self-end text-y2k-primary/40 hover:text-red-500 font-black text-xs uppercase tracking-widest flex gap-2 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Stats Column */}
        <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border-4 border-y2k-primary shadow-[12px_12px_0_0_#2F020C] space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-y2k-primary/10 pb-4">
                    <LayoutGrid className="text-y2k-primary" size={24} />
                    <h3 className="font-heading font-black text-2xl lowercase text-y2k-primary">Your Stats</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-y2k-bg p-4 rounded-2xl border-2 border-y2k-primary">
                        <span className="text-xs font-black uppercase tracking-widest text-y2k-primary/60">Templates</span>
                        <span className="text-3xl font-heading font-black">{userFrames.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-y2k-primary p-8 rounded-[3rem] text-white shadow-[12px_12px_0_0_#2F020C] border-4 border-y2k-shadow">
                <h4 className="text-2xl font-heading font-black lowercase mb-4">Pro Tip!</h4>
                <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                    "Use high-quality PNGs for your frames to get the best photostrip results."
                </p>
            </div>
        </div>

        {/* Templates Column */}
        <div className="lg:col-span-9 space-y-12">
            {/* Creator Fallback (Mobile) */}
            <div className="flex md:hidden flex-col items-center justify-center text-center p-6 bg-white border-4 border-dashed border-y2k-primary rounded-[2rem] shadow-[4px_4px_0_0_#2F020C] gap-4">
                <div className="bg-y2k-bg p-4 rounded-full border-2 border-y2k-primary text-y2k-primary">
                    <Info size={32} />
                </div>
                <p className="text-sm font-bold text-y2k-primary leading-relaxed">
                    Fitur Snapbooth Studio membutuhkan layar yang lebih besar. Silakan buka melalui Desktop/Laptop untuk mendesain template, atau gunakan Aplikasi Mobile Snapbooth di HP Anda untuk langsung berfoto!
                </p>
            </div>

            {/* Upload Area (Desktop) */}
            <section className="hidden md:flex flex-col group space-y-8">
                <input 
                  type="file" 
                  id="custom-frame-upload" 
                  accept="image/png" 
                  className="hidden" 
                  onChange={handleFrameSelection} 
                />
                <label 
                  htmlFor="custom-frame-upload"
                  className="relative border-4 border-dashed border-y2k-primary bg-white rounded-[4rem] p-16 flex flex-col items-center justify-center transition-all hover:bg-y2k-bg cursor-pointer overflow-hidden shadow-[8px_8px_0_0_#2F020C] min-h-[300px]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#420D19_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
                  
                  {previewUrl ? (
                    <div className="relative w-full h-full aspect-[3/4] max-h-[400px]">
                      <Image src={previewUrl} alt="Frame Preview" fill className="object-contain p-8 z-10 animate-in fade-in zoom-in duration-500" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center z-10">
                      <div className="bg-white p-6 rounded-2xl border-4 border-y2k-primary mb-6 text-y2k-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-[4px_4px_0_0_#2F020C]">
                        <Upload size={48} strokeWidth={3} />
                      </div>
                      <h3 className="text-3xl font-heading font-black text-y2k-primary text-center lowercase tracking-tighter">
                        Upload Custom Frame
                      </h3>
                      <p className="text-y2k-primary/40 font-bold text-xs uppercase tracking-widest mt-2">PNG Format Only</p>
                    </div>
                  )}
                </label>

                {/* Metadata Form */}
                {isUploading && (
                  <div className="notizblok p-10 rounded-[3rem] shadow-[16px_16px_0_0_#2F020C] border-4 border-y2k-primary animate-in zoom-in duration-300 relative overflow-hidden bg-white">
                    <button onClick={() => setIsUploading(false)} className="absolute top-8 right-8 text-y2k-primary/40 hover:text-y2k-primary transition-colors">
                      <X size={32} />
                    </button>
                    <div className="max-w-xl mx-auto space-y-8">
                      <div className="space-y-2">
                        <h4 className="text-3xl font-heading font-black text-y2k-primary lowercase tracking-tight">New Frame Details</h4>
                        <p className="text-y2k-primary/60 font-bold text-sm">Complete the information below before saving.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-y2k-primary/40 ml-1">Frame Name</Label>
                          <Input 
                            placeholder="e.g.: Summer Bash" 
                            className="rounded-full h-14 border-2 border-y2k-primary bg-white px-6 font-bold text-y2k-primary"
                            value={newFrame.name}
                            onChange={(e) => setNewFrame({...newFrame, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-y2k-primary/40 ml-1">Slot Count</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            max="12"
                            className="rounded-full h-14 border-2 border-y2k-primary bg-white px-6 font-bold text-y2k-primary"
                            value={newFrame.requiredPhotos}
                            onChange={(e) => setNewFrame({...newFrame, requiredPhotos: parseInt(e.target.value) || 1})}
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleSaveFrame}
                        className="w-full h-16 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white font-black text-xl font-serif shadow-[8px_8px_0_0_#2F020C] transition-all hover:scale-[1.02] active:scale-95 border-2 border-y2k-shadow"
                      >
                        SAVE TO STUDIO
                      </Button>
                    </div>
                  </div>
                )}
            </section>

            {/* My Frames Grid */}
            <section className="space-y-12 pb-20">
                <div className="flex justify-between items-center">
                    <h3 className="text-4xl font-heading font-black text-y2k-primary lowercase tracking-tighter">
                        Your <span className="underline decoration-8">Collection</span>
                    </h3>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <RefreshCw className="animate-spin text-y2k-primary/20" size={48} />
                  </div>
                ) : userFrames.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userFrames.map((frame) => (
                      <Link 
                        key={frame.id} 
                        href={`/booth?templateId=${frame.id}`}
                        className="group relative flex flex-col overflow-hidden rounded-[2rem] border-4 border-y2k-primary bg-white transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#2F020C] cursor-pointer"
                      >
                        {/* THUMBNAIL AREA */}
                        <div className={`relative aspect-[3/4] ${frame.color || (frame.is_system ? 'bg-blue-50' : 'bg-pink-50')} flex items-center justify-center overflow-hidden p-6 border-b-4 border-y2k-primary`}>
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
                          
                          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                            <Image 
                              src={frame.image_url}
                              alt={frame.name}
                              fill
                              className="object-contain"
                            />
                          </div>

                          {/* SYSTEM/USER BADGE */}
                          <div className="absolute top-4 left-4 bg-y2k-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border-2 border-white shadow-md z-20">
                            {frame.is_system ? <Zap size={8} fill="currentColor" /> : <Star size={8} fill="currentColor" />} 
                            {frame.is_system ? (frame.category || 'Official') : 'Custom'}
                          </div>

                          {/* DELETE BUTTON (Only for custom frames) */}
                          {!frame.is_system && (
                            <button 
                              onClick={(e) => handleDeleteFrame(e, frame.id)}
                              className="absolute top-4 right-4 bg-white border-2 border-y2k-primary hover:bg-red-500 hover:text-white text-y2k-primary p-2 rounded-xl transition-all shadow-[2px_2px_0_0_#2F020C] z-30 opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}

                          {/* SLOT BADGE */}
                          <div className="absolute bottom-4 right-4 bg-white border-2 border-y2k-primary px-3 py-1 rounded-xl shadow-[2px_2px_0_0_#2F020C] flex items-center gap-1.5 transform -rotate-2 z-20">
                            <Camera size={10} className="text-y2k-primary" />
                            <span className="text-[10px] font-black uppercase tracking-tight">{frame.required_photos} Slots</span>
                          </div>
                        </div>

                        {/* INFO AREA */}
                        <div className="p-5 flex flex-col gap-3 bg-white flex-1 justify-between">
                          <div className="space-y-1">
                            <h3 className="font-heading font-black text-xl text-y2k-primary lowercase tracking-tight line-clamp-1">
                              {frame.name}
                            </h3>
                            <div className="flex items-center gap-1 text-[8px] font-black text-y2k-primary/40 uppercase tracking-widest">
                              {frame.is_system ? <Star size={8} fill="currentColor" /> : <RefreshCw size={8} />} 
                              {frame.is_system ? 'Official Asset' : 'Private Studio Asset'}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full h-10 rounded-full bg-y2k-primary hover:bg-y2k-accent text-white font-black text-[10px] tracking-widest uppercase border-2 border-y2k-shadow shadow-[4px_4px_0_0_#2F020C] transition-all active:scale-95"
                          >
                            USE FRAME
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border-4 border-dashed border-y2k-primary/20 rounded-[3rem] p-20 text-center space-y-6">
                    <LayoutGrid className="mx-auto text-y2k-primary/10" size={64} />
                    <p className="text-xl font-bold text-y2k-primary/40 italic">You haven't created any templates yet.</p>
                  </div>
                )}
            </section>
        </div>
      </div>
    </div>
  );
}
