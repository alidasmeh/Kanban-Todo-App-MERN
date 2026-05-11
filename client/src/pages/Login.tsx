import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Rocket, ArrowRight } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../features/authSlice';
import type { RootState } from '../store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    
    // Mock login logic
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        dispatch(loginSuccess({
          user: { id: '1', name: 'Demo User', email: 'demo@example.com' },
          token: 'mock-token'
        }));
        navigate('/boards');
      } else {
        dispatch(loginFailure('Invalid email or password. Use demo@example.com / password'));
      }
    }, 1000);
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px] flex flex-col gap-8">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
              <Rocket className="text-white w-7 h-7" />
            </div>
            <h1 className="text-headline-lg text-slate-800 tracking-tight">Kinetic Board</h1>
          </div>
          <h2 className="text-headline-md text-slate-800">Welcome back</h2>
          <p className="text-body-sm text-slate-500">Please enter your details to access your workspace.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-soft-float p-8 border border-slate-200/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-body-sm border border-red-100">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-slate-500 uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-800 text-body-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-label-md text-slate-500 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <a className="text-label-sm text-primary hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50 text-slate-800 text-body-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                id="remember"
                type="checkbox"
              />
              <label className="text-body-sm text-slate-500 select-none" htmlFor="remember">
                Remember this device
              </label>
            </div>

            {/* Action Button */}
            <button
              className="w-full bg-primary text-white text-headline-md py-4 rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <p className="text-center text-body-base text-slate-500">
          Don't have an account?{' '}
          <Link className="text-primary font-bold hover:underline transition-all" to="/signup">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
