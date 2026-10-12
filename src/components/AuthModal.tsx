import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Eye, EyeOff, Shield, X, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, signup, startDemoMode } = useGame();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      if (isSignUp) {
        signup(name, email, role);
      } else {
        login(email, role, name);
      }
      setIsLoading(false);
      onSuccess();
      onClose();
    }, 450);
  };

  const handleAdminQuickFill = () => {
    setEmail('admin@lifecraft.ai');
    setPassword('AdminSecure2026!');
    setRole('admin');
    setName('Administrator');
    setIsSignUp(false);
  };

  const handleStudentQuickFill = () => {
    setEmail('student.12th@lifecraft.ai');
    setPassword('Explorer2026!');
    setRole('student');
    setName('Student Explorer');
    setIsSignUp(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            {isSignUp ? 'Create LIFECRAFT Account' : 'Welcome Back, Explorer'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isSignUp
              ? 'Begin your personalized life and career journey simulation.'
              : 'Sign in to access your missions, XP stats, and Skill Passport.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {forgotSent && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300">
            Password reset instructions have been dispatched to your email address.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Krishnan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.edu"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
              />
            </div>
          )}

          {/* Role selector */}
          <div className="pt-1">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Account Role
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'student'
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'admin'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-cyan-500/25 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {isLoading ? 'Authenticating...' : isSignUp ? 'Create Student Account' : 'Sign In to LIFECRAFT'}
          </button>
        </form>

        {/* Quick demo presets for expo reviewers */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick Expo Review Presets:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleStudentQuickFill}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={handleAdminQuickFill}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline px-2.5 py-1 rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 cursor-pointer"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => {
                startDemoMode();
                onSuccess();
                onClose();
              }}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50 dark:bg-cyan-950/30 cursor-pointer"
            >
              Instant 3-Min Demo
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isSignUp ? 'Already registered? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
