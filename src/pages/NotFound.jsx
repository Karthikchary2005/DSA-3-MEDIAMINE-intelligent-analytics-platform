import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xl">
        <Layers className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-4xl font-extrabold text-white font-mono">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          The requested route does not exist or has been moved within the MediaMine platform.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
}
