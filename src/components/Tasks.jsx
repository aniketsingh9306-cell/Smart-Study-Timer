import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

function Tasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (!newTask.trim()) return
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      done: false,
      date: new Date().toLocaleDateString()
    }
    setTasks([...tasks, task])
    setNewTask('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="px-6 py-8 pb-24">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">My Tasks</h2>
        <p className="text-sm text-gray-500 mt-1">
          {tasks.filter(t => t.done).length} of {tasks.length} completed
        </p>
      </div>

      {/* Add Task Input */}
      <div className="flex gap-3 mb-6">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
        />
        <button
          onClick={addTask}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl rounded-xl px-4 transition-all">
          +
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-white">No tasks yet!</p>
          <p className="text-sm mt-2">Add a task above</p>
        </div>
      ) : (
        tasks.map(task => (
          <div key={task.id}
            className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 mb-3 border border-gray-800">

            {/* Checkbox */}
            <div
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all ${
                task.done
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-600'
              }`}>
              {task.done && <span className="text-white text-xs font-bold">✓</span>}
            </div>

            {/* Task Text */}
            <span className={`flex-1 text-sm ${
              task.done
                ? 'line-through text-gray-600'
                : 'text-gray-200'
            }`}>
              {task.text}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-600 hover:text-red-400 transition-all text-lg">
              🗑
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Tasks