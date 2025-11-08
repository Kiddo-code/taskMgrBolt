export default function Dashboard() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 sm:p-12 max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
          Your Tasks
        </h1>

        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <ul className="space-y-3">
            <li className="text-gray-800 text-lg">1. Finish homework</li>
            <li className="text-gray-800 text-lg">2. Call John</li>
            <li className="text-gray-800 text-lg">3. Buy groceries</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="newTask" className="block text-sm font-semibold text-gray-700 mb-2">
              New Task
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="newTask"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
                placeholder="Enter a new task..."
              />
              <button
                type="button"
                className="bg-sky-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-sky-300 whitespace-nowrap"
              >
                Add Task
              </button>
            </div>
          </div>

          <a
            href="/"
            className="block w-full bg-gray-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-gray-300 mt-6"
          >
            Logout
          </a>
        </div>
      </div>
    </main>
  );
}
