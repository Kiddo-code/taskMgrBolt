import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Please login instead.');
        }
        throw error;
      }

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          throw new Error('This email is already registered. Please login instead.');
        }

        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 sm:p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Thanks for signing up!
            </h1>
            <p className="text-gray-600">
              Redirecting you to your dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 sm:p-12 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-3">
          Create Account
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Enter your details to get started.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="John Doe"
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-sky-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-sky-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-sky-600 font-semibold hover:text-sky-700 focus:outline-none focus:underline"
          >
            Login
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
