'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center" suppressHydrationWarning>
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#DC143C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A52A2A] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-[#8B0000] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* LOGO - TOP LEFT */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 group z-10">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-red-500/30 border border-[#DC143C]/30">
          <img src="/vinci-symbol.jpg" alt="Vinci-Arena" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-[#DC143C] transition">VINCI-ARENA</h1>
          <p className="text-xs text-[#DC143C] font-medium">Track. Calculate. Win.</p>
        </div>
      </Link>

      {/* LOGIN FORM */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-black/70 backdrop-blur-xl border border-[#DC143C]/50 rounded-2xl p-8 shadow-2xl shadow-[#DC143C]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Welcome Back</h2>
            <p className="text-gray-300 font-light">Sign in to your Vinci-Arena account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                suppressHydrationWarning
                className="w-full bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                suppressHydrationWarning
                className="w-full bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-700 bg-gray-900 text-[#DC143C] focus:ring-[#DC143C]" suppressHydrationWarning />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#DC143C] hover:text-[#FF4500] transition">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full bg-gradient-to-r from-[#DC143C] to-[#A52A2A] hover:from-[#DC143C]/80 hover:to-[#A52A2A]/80 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-[#DC143C]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#DC143C] hover:text-[#FF4500] font-semibold transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* reCAPTCHA Notice */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Protected by reCAPTCHA. Privacy Policy and Terms apply.
        </p>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
