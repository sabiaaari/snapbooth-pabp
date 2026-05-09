'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    return {
      isValid: minLength && hasUpper && hasLower && hasSymbol,
      requirements: { minLength, hasUpper, hasLower, hasSymbol }
    };
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    const { isValid } = validatePassword(password);
    if (!isValid) {
      setMessage({
        type: 'error',
        text: 'Password is too weak! Please follow all requirements below.'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
      if (data.user) {

        const { error: profileError } =
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username,
              email: email,
              provider: 'email',
            });

        if (profileError) {
          throw profileError;
        }
      }

      setMessage({ type: 'success', text: 'Registration successful! Please check your email for verification.' });
    } catch (error: any) {
      console.error('Registration error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to register.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login failed:', error);
      setMessage({ type: 'error', text: 'Google login failed.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-y2k-bg flex items-center justify-center p-4 font-serif text-y2k-primary py-20">
      {/* Back Button - Outside Card */}
      <div className="fixed top-28 left-8 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-y2k-primary/60 hover:text-y2k-primary font-black transition-colors bg-white px-4 py-2 rounded-full border-2 border-y2k-primary shadow-[4px_4px_0_0_#2F020C]">
          <ChevronLeft size={20} strokeWidth={3} />
          BACK
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border-4 border-y2k-primary rounded-3xl shadow-[16px_16px_0_0_#2F020C] p-10 space-y-10 relative overflow-hidden">
        {/* Decorative Notepad Background Element */}
        <div className="absolute inset-0 notizblok opacity-5 pointer-events-none"></div>

        <div className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-y2k-bg text-y2k-primary rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-y2k-primary mb-2">
            <Sparkles size={12} />
            <span>Join the Studio</span>
          </div>
          <h1 className="text-6xl font-heading font-black text-y2k-primary lowercase leading-none">
            SnapBooth
          </h1>
          <p className="text-xl text-y2k-primary font-bold italic leading-tight">
            Create your account <br /> to start snapping!
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-2 flex items-center gap-2">
                <User size={12} /> Username
              </label>
              <input
                type="text"
                required
                placeholder="snaplover2026"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-14 px-6 rounded-2xl border-2 border-y2k-primary bg-white font-bold text-y2k-primary placeholder:text-y2k-primary/20 focus:outline-none focus:ring-4 focus:ring-y2k-primary/10 transition-all shadow-[4px_4px_0_0_#2F020C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-2 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-6 rounded-2xl border-2 border-y2k-primary bg-white font-bold text-y2k-primary placeholder:text-y2k-primary/20 focus:outline-none focus:ring-4 focus:ring-y2k-primary/10 transition-all shadow-[4px_4px_0_0_#2F020C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-2 flex items-center gap-2">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-6 rounded-2xl border-2 border-y2k-primary bg-white font-bold text-y2k-primary placeholder:text-y2k-primary/20 focus:outline-none focus:ring-4 focus:ring-y2k-primary/10 transition-all shadow-[4px_4px_0_0_#2F020C]"
              />

              {/* Password Requirements Checklist */}
              <div className="grid grid-cols-2 gap-2 px-2 pt-1">
                {[
                  { label: '8+ Characters', met: password.length >= 8 },
                  { label: 'Uppercase', met: /[A-Z]/.test(password) },
                  { label: 'Lowercase', met: /[a-z]/.test(password) },
                  { label: 'Symbol', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full border border-y2k-primary ${req.met ? 'bg-green-400' : 'bg-white'}`}></div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${req.met ? 'text-y2k-primary' : 'text-y2k-primary/30'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl bg-y2k-primary hover:bg-y2k-accent text-white font-black text-lg border-2 border-y2k-shadow shadow-[4px_4px_0_0_#2F020C] transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'REGISTERING...' : 'REGISTER NOW'}
            </Button>
          </form>

          {message && (
            <div className={`p-4 rounded-xl border-2 font-bold text-sm text-center ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-y2k-primary/10"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-y2k-primary/40">OR</span>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-16 rounded-2xl border-2 border-y2k-primary bg-white text-y2k-primary hover:bg-y2k-card font-black text-sm flex items-center justify-center gap-4 transition-all active:scale-95 shadow-[4px_4px_0_0_#2F020C] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-[11px] font-black uppercase tracking-wider text-y2k-primary/60 hover:text-y2k-primary transition-colors underline decoration-2">
              Already have an account? Login here
            </Link>
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -bottom-6 -right-6 text-y2k-primary/5 rotate-12">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
}