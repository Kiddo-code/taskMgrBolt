import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Sparkles } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'done';
  created_at: string;
}

interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Record<string, Subtask[]>>({});
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [generatingSubtasks, setGeneratingSubtasks] = useState<string | null>(null);
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<Record<string, string[]>>({});
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTasks();
    fetchAllSubtasks();
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

  const fetchAllSubtasks = async () => {
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching subtasks:', error);
    } else {
      const grouped = (data || []).reduce((acc, subtask) => {
        if (!acc[subtask.task_id]) {
          acc[subtask.task_id] = [];
        }
        acc[subtask.task_id].push(subtask);
        return acc;
      }, {} as Record<string, Subtask[]>);
      setSubtasks(grouped);
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
      fetchAllSubtasks();
    }
  };

  const handleGenerateSubtasks = async (taskId: string, taskTitle: string) => {
    setGeneratingSubtasks(taskId);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.error('No session found');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-subtasks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskTitle }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate subtasks');
      }

      const data = await response.json();
      setSuggestedSubtasks(prev => ({
        ...prev,
        [taskId]: data.subtasks,
      }));
    } catch (error) {
      console.error('Error generating subtasks:', error);
    } finally {
      setGeneratingSubtasks(null);
    }
  };

  const handleSaveSubtask = async (taskId: string, subtaskTitle: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('subtasks').insert({
      task_id: taskId,
      user_id: user.id,
      title: subtaskTitle,
      completed: false,
    });

    if (error) {
      console.error('Error saving subtask:', error);
    } else {
      fetchAllSubtasks();
      setSuggestedSubtasks(prev => ({
        ...prev,
        [taskId]: prev[taskId].filter(st => st !== subtaskTitle),
      }));
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    const { error } = await supabase
      .from('subtasks')
      .update({ completed: !completed })
      .eq('id', subtaskId);

    if (error) {
      console.error('Error toggling subtask:', error);
    } else {
      fetchAllSubtasks();
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', subtaskId);

    if (error) {
      console.error('Error deleting subtask:', error);
    } else {
      fetchAllSubtasks();
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
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
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleGenerateSubtasks(task.id, task.title)}
                        disabled={generatingSubtasks === task.id}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles size={16} />
                        {generatingSubtasks === task.id ? 'Generating...' : 'Generate Subtasks with AI'}
                      </button>

                      {suggestedSubtasks[task.id] && suggestedSubtasks[task.id].length > 0 && (
                        <div className="mt-3 bg-sky-50 rounded-lg p-3 border border-sky-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Suggested Subtasks:</p>
                          <ul className="space-y-2">
                            {suggestedSubtasks[task.id].map((subtask, idx) => (
                              <li key={idx} className="flex items-center justify-between gap-2 text-sm">
                                <span className="text-gray-700">{subtask}</span>
                                <button
                                  onClick={() => handleSaveSubtask(task.id, subtask)}
                                  className="px-2 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
                                >
                                  Save
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {subtasks[task.id] && subtasks[task.id].length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleTaskExpansion(task.id)}
                            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                          >
                            {expandedTasks.has(task.id) ? '▼' : '▶'} Subtasks ({subtasks[task.id].length})
                          </button>

                          {expandedTasks.has(task.id) && (
                            <ul className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
                              {subtasks[task.id].map((subtask) => (
                                <li key={subtask.id} className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <input
                                      type="checkbox"
                                      checked={subtask.completed}
                                      onChange={() => handleToggleSubtask(subtask.id, subtask.completed)}
                                      className="w-4 h-4 text-sky-600 rounded focus:ring-2 focus:ring-sky-300"
                                    />
                                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                      {subtask.title}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSubtask(subtask.id)}
                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
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
