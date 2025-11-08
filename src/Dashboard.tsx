import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'done';
  created_at: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('tasks').insert({
      title: newTask,
      priority,
      status: 'pending',
      user_id: user.id,
    });

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setNewTask('');
      setPriority('medium');
      fetchTasks();
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'done') => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      fetchTasks();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 sm:p-12 max-w-4xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
          Your Tasks
        </h1>

        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks yet. Add your first task below!</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value as any)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label htmlFor="newTask" className="block text-sm font-semibold text-gray-700 mb-2">
              New Task
            </label>
            <input
              type="text"
              id="newTask"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
              placeholder="Enter a new task..."
              required
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="block w-full bg-gray-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center focus:outline-none focus:ring-4 focus:ring-gray-300 mt-6"
        >
          Logout
        </button>

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
