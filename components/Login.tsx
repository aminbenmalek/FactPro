
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (email: string, pass: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error, onClearError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900/30">
            <i className="fas fa-bolt text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Connexion Société</h2>
          <p className="text-slate-400 mt-2 text-sm">Gérez vos factures STEG & SONEDE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!!error && (
            <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Professionnel</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="email" 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                placeholder="email@entreprise.tn"
                value={email}
                onChange={(e) => {
                  onClearError?.();
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="password" 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  onClearError?.();
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!!isLoading}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-950/40 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Pas encore de compte ? <Link to="/signup" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">Inscrire ma société</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;