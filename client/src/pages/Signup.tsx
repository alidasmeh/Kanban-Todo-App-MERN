import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Zap } from 'lucide-react';
import { loginStart, loginSuccess } from '../features/authSlice';
import type { RootState } from '../store';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    dispatch(loginStart());
    
    // Mock signup logic
    setTimeout(() => {
      dispatch(loginSuccess({
        user: { id: '1', name, email },
        token: 'mock-token'
      }));
      navigate('/boards');
    }, 1000);
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-slate-400/5 blur-[100px] rounded-full"></div>

      <main className="w-full max-w-[440px] z-10">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-soft-float">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-headline-md text-slate-800 tracking-tight">Kinetic Board</span>
          </div>
          <h1 className="text-headline-lg text-slate-800 mb-2">Create your account</h1>
          <p className="text-slate-500 text-body-sm">Join the workspace for high-performance product teams.</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white shadow-soft-float rounded-xl p-10 border border-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-label-md text-slate-500 uppercase tracking-widest" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-12 pr-4 text-body-base text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 outline-none"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address Field */}
            <div className="space-y-2">
              <label className="block text-label-md text-slate-500 uppercase tracking-widest" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-12 pr-4 text-body-base text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 outline-none"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-label-md text-slate-500 uppercase tracking-widest" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-12 pr-12 text-body-base text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 outline-none"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-label-md text-slate-500 uppercase tracking-widest" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 pl-12 pr-4 text-body-base text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 outline-none"
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-primary text-white text-body-base font-bold py-4 rounded-lg shadow-soft-float hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-body-sm text-slate-500">
            Already have an account?{' '}
            <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
