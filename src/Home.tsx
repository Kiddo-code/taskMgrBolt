export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-12 max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-4">
          Welcome to My Task Manager
        </h1>

        <p className="text-center text-gray-600 mb-8 sm:mb-10">
          Choose an option to continue.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a
            href="/login"
            aria-label="Navigate to login page"
            className="bg-white text-sky-600 font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-sky-300"
          >
            Login
          </a>

          <a
            href="/signup"
            aria-label="Navigate to signup page"
            className="bg-white text-sky-600 font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-sky-300"
          >
            Sign Up
          </a>

          <a
            href="/dashboard"
            aria-label="Navigate to dashboard"
            className="bg-sky-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-sky-300"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
