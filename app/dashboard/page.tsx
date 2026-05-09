'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, ShieldCheck, ChevronRight, Lock, X, LogOut, Sparkles, LayoutGrid, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export type FrameTemplate = {
  id: string;
  name: string;
  imageUrl: string;
  requiredPhotos: number;
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
          // Initialize with empty array or some default data
          setUserFrames([]);
          return;
        }
        throw error;
      }
      setUserFrames(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
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
      // Show the metadata form once a file is selected
      setIsUploading(true);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
  };

  const handleSaveFrame = async () => {
    if (!user) return;

    try {
      const frameData = {
        user_id: user.id,
        name: newFrame.name || 'Untitled Frame',
        image_url: previewUrl || '/placeholder-frame.png',
        required_photos: newFrame.requiredPhotos,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('templates')
        .insert([frameData])
        .select();

      if (error) {
        if (error.code === '42P01') {
           // Fallback for demo if table doesn't exist
           const mockFrame: FrameTemplate = {
             id: Math.random().toString(36).substr(2, 9),
             name: frameData.name,
             imageUrl: frameData.image_url,
             requiredPhotos: frameData.required_photos,
             created_at: frameData.created_at,
             color: 'bg-slate-100',
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
        const newFrameFromDb: FrameTemplate = {
          id: data[0].id,
          name: data[0].name,
          imageUrl: data[0].image_url,
          requiredPhotos: data[0].required_photos,
          created_at: data[0].created_at,
          color: 'bg-slate-100',
        };
        setUserFrames([newFrameFromDb, ...userFrames]);
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

  const handleDeleteFrame = async (frameId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', frameId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
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
    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20 py-10 font-serif text-y2k-primary">
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
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border-4 border-y2k-primary shadow-[12px_12px_0_0_#2F020C] space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-y2k-primary/10 pb-4">
                    <LayoutGrid className="text-y2k-primary" size={24} />
                    <h3 className="font-heading font-black text-2xl lowercase text-y2k-primary">Your Stats</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-y2k-bg p-4 rounded-2xl border-2 border-y2k-primary">
                        <span className="text-xs font-black uppercase tracking-widest text-y2k-primary/60">Total Templates</span>
                        <span className="text-3xl font-heading font-black">{userFrames.length}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-y2k-primary p-8 rounded-[3rem] text-white shadow-[12px_12px_0_0_#2F020C] border-4 border-y2k-shadow">
                <h4 className="text-2xl font-heading font-black lowercase mb-4">Pro Tip!</h4>
                <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                    "Use high-quality PNGs for your frames to get the best photostrip results."
                </p>
            </div>
        </div>

        {/* Templates Column */}
        <div className="lg:col-span-8 space-y-12">
            {/* Upload Area */}
            <section className="group space-y-8">
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
                    <img src={previewUrl} alt="Frame Preview" className="absolute inset-0 w-full h-full object-contain p-8 z-10 animate-in fade-in zoom-in duration-500" />
                  ) : (
                    <div className="flex flex-col items-center z-10">
                      <div className="bg-white p-6 rounded-2xl border-4 border-y2k-primary mb-6 text-y2k-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-[4px_4px_0_0_#2F020C]">
                        <Upload size={48} strokeWidth={3} />
                      </div>
                      <h3 className="text-3xl font-heading font-black text-y2k-primary text-center lowercase tracking-tighter">
                        Upload Custom Frame
                      </h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {userFrames.map((frame) => (
                      <div key={frame.id} className="group relative">
                          <div className="aspect-[3/4] border-4 border-y2k-primary rounded-3xl bg-white shadow-[12px_12px_0_0_#2F020C] overflow-hidden flex flex-col transition-all duration-500 group-hover:-translate-y-4">
                              <div className={`flex-1 ${frame.color || 'bg-y2k-bg'} flex items-center justify-center relative overflow-hidden`}>
                                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
                                   <ImageIcon size={60} strokeWidth={1} className="text-y2k-primary/10 group-hover:scale-125 transition-transform duration-700" />
                                   
                                   <div className="absolute bottom-6 left-6 bg-white border-2 border-y2k-primary px-4 py-1.5 rounded-full text-[10px] font-black text-y2k-primary uppercase tracking-widest shadow-[2px_2px_0_0_#2F020C]">
                                      {frame.requiredPhotos} Slots
                                   </div>

                                   <button 
                                      onClick={() => handleDeleteFrame(frame.id)}
                                      className="absolute top-8 right-8 bg-white border-2 border-y2k-primary hover:bg-red-500 hover:text-white text-y2k-primary p-3 rounded-2xl transition-all shadow-[2px_2px_0_0_#2F020C]"
                                   >
                                      <Trash2 size={20} />
                                   </button>
                              </div>
                              <div className="p-8 bg-white flex justify-between items-center border-t-4 border-y2k-primary">
                                  <div>
                                      <p className="font-heading font-black text-2xl text-y2k-primary lowercase tracking-tight">{frame.name}</p>
                                      <p className="text-[10px] font-black text-y2k-primary/40 uppercase tracking-widest mt-1">
                                        {new Date(frame.created_at).toLocaleDateString()}
                                      </p>
                                  </div>
                                  <Link href={`/booth?templateId=${frame.id}`}>
                                      <Button variant="ghost" className="w-14 h-14 rounded-2xl bg-y2k-bg text-y2k-primary/40 hover:text-y2k-primary hover:bg-white border-2 border-y2k-primary/10 hover:border-y2k-primary p-0 transition-all active:scale-90 shadow-[2px_2px_0_0_#2F020C]">
                                          <ChevronRight size={32} strokeWidth={3} />
                                      </Button>
                                  </Link>
                              </div>
                          </div>
                      </div>
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
