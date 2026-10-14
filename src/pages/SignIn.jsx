import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        if (res.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col md:flex-row text-slate-100">
      {/* Left Column: Visual & Branding */}
      <div className="md:w-1/2 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-850 to-indigo-950 border-r border-indigo-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                MediaMine
              </span>
              <p className="text-xs text-indigo-400 font-medium">Intelligent Media Analytics</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>In-Browser DSA Computational Engine</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            High-Performance Media Intelligence Powered by Real Algorithms.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Execute KMP, Aho-Corasick, Suffix Arrays, Dinic's network flows, and Damerau-Levenshtein spelling correction directly within your web browser with zero backend latency.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-900/40">
              <p className="text-xs text-slate-400">Total Media Indexed</p>
              <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">52+ Items</p>
            </div>
            <div className="p-3 rounded-xl bg-navy-900/60 border border-indigo-900/40">
              <p className="text-xs text-slate-400">Active DSA Modules</p>
              <p className="text-xl font-bold text-indigo-400 font-mono mt-0.5">6 Modules</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          Frontend-only implementation. Data persists via local browser storage.
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="md:w-1/2 p-8 lg:p-14 flex items-center justify-center bg-navy-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Enter your credentials to access the intelligence hub or use one-click demo credentials below.
            </p>
          </div>

          {/* Quick Demo Login Cards */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Demo Access:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('user@mediamine.demo', 'User123!')}
                className="text-left p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 hover:border-indigo-500 hover:bg-indigo-900/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">Demo User</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">user@mediamine.demo</p>
                <p className="text-[10px] text-slate-400 font-mono">User123!</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin@mediamine.demo', 'Admin123!')}
                className="text-left p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 hover:border-amber-500 hover:bg-amber-900/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Demo Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">admin@mediamine.demo</p>
                <p className="text-[10px] text-slate-400 font-mono">Admin123!</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-navy-900 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-900 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-11 py-2.5 rounded-xl border border-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-navy-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this session</span>
              </label>
              <span className="text-indigo-400 hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 font-medium hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
