export default function Signup() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 sm:p-12 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-3">
          Create Account
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Enter your details to get started.
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <a
            href="/dashboard"
            aria-label="Sign up and navigate to dashboard"
            className="block w-full bg-sky-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-sky-300 mt-6"
          >
            Sign Up
          </a>
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
