import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials or sign up if you don\'t have an account.');
        }
        throw error;
      }

      if (data.user) {
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 sm:p-12 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-3">
          Login
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Enter your email and password to login.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-sky-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-sky-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-sky-600 font-semibold hover:text-sky-700 focus:outline-none focus:underline"
          >
            Sign up
          </a>
        </p>

        <p className="text-center text-sm text-gray-600 mt-4">
          <a
            href="/"
            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:underline"
          >
            Back to Home
          </a>
        </p>
      </div>
    </main>
  );
}
