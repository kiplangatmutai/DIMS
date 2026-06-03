import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { api } from '../config/api';
import { AuthUser, useRole } from '../context/RoleContext';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function Login() {
  const navigate = useNavigate();
  const { setSession } = useRole();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get('username') || '');
    const password = String(formData.get('password') || '');

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password
      });

      setSession(response.token, response.user);
      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 text-white flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-4 mb-12">
            <Logo variant="light" className="!px-3 !py-2" />
            <span className="text-3xl font-bold tracking-tight">DIMS</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Device Inventory
            <br />
            Management System
          </h1>
          <p className="text-brand-100 text-lg max-w-md">
            End-to-end lifecycle management for digital health devices across
            the national healthcare infrastructure.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-brand-200 text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Secured by Digital Health Agency</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden flex items-center space-x-3 mb-8 text-brand-600">
            <Logo variant="default" className="h-8" />
            <span className="text-2xl font-bold tracking-tight">DIMS</span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-8">
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-700">
                
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin"
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700">
                
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="admin123"
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-black">
                {error}
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded" />
                
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-neutral-900">
                  
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-brand-600 hover:text-brand-500">
                  
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);

}
