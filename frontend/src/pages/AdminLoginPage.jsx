import React, { useState } from 'react';
import { Shield, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage({ onNavigate, showToast }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(identifier.trim(), password.trim());
      showToast({ type: 'success', title: 'Welcome Back!', message: 'Logged in successfully.' });
      onNavigate('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#0A0A0C] text-[#F5F0E7]">
      <div className="bg-[#17171C] rounded-2xl border border-[#302E31] midnight-card-shadow max-w-md w-full p-8 space-y-6">
        {/* Back link */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              onNavigate('home');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#817C77] hover:text-[#D2AC68] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#202027] border border-[#302E31] text-[#D2AC68] flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F5F0E7]">Store Owner Login</h1>
          <p className="text-xs text-[#817C77]">
            Sign in to manage products, daily rates, and store settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#202027] text-[#F08A83] border border-[#F08A83]/30 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#F08A83] shrink-0 mt-0.5" />
            <div className="flex-1 font-bold">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#B0AAA1] block">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817C77]" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] focus:bg-[#101014] rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#B0AAA1] block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817C77]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#101014] text-[#F5F0E7] placeholder-[#817C77] focus:bg-[#101014] rounded-xl border border-[#302E31] focus:border-[#D2AC68] outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 btn-gold-primary disabled:opacity-50 text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer mt-3"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Helpful guidance for the owner */}
        <div className="p-3.5 bg-[#101014] rounded-xl border border-[#302E31] text-xs text-[#817C77] space-y-1">
          <p className="font-bold text-[#D2AC68]">Need Help?</p>
          <p>
            Forgot your password? Reset it using the server terminal or contact admin support.
          </p>
        </div>
      </div>
    </div>
  );
}
