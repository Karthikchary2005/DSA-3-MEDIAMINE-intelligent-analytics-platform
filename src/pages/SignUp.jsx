import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register(name, email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Registration failed.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col md:flex-row text-slate-100">
      {/* Left Column */}
      <div className="md:w-1/2 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-850 to-indigo-950 border-r border-indigo-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">MediaMine</span>
            <p className="text-xs text-indigo-400 font-medium">Intelligent Media Analytics</p>
          </div>
        </div>

        <div className="my-12 space-y-6 max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Join the Next Era of In-Browser Algorithmic Intelligence.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Create an account to search media corpora, bookmark research documents, compare structural similarity, and run graph algorithms.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Full access to 52+ built-in AI, ML, and Engineering records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Interactive Suffix Automaton and Kasai LCP Document Similarity</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Dinic's Maximum Network Flow and Min-Cut visualizers</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Client-side evaluation platform. Security and roles simulated locally.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="md:w-1/2 p-8 lg:p-14 flex items-center justify-center bg-navy-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Enter your details to register as a MediaMine researcher.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full bg-navy-900 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
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
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-navy-900 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  required
                />
              </div>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-400 font-medium hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
