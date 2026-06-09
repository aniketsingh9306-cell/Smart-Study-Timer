import useLocalStorage from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'

function TimerCard() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [sessions, setSessions] = useLocalStorage('sessions', [])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(interval)
          setIsRunning(false)
          const newSession = {
            id: Date.now(),
            mode: mode,
            duration: mode === 'focus' ? 25 : mode === 'short' ? 5 : 15,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
          }
          setSessions(prev => [...prev, newSession])
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        setIsRunning(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    if (newMode === 'focus') setTimeLeft(25 * 60)
    if (newMode === 'short') setTimeLeft(5 * 60)
    if (newMode === 'long') setTimeLeft(15 * 60)
  }

  const reset = () => {
    setIsRunning(false)
    if (mode === 'focus') setTimeLeft(25 * 60)
    if (mode === 'short') setTimeLeft(5 * 60)
    if (mode === 'long') setTimeLeft(15 * 60)
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 px-6 pb-24">
      <div className="flex gap-2 bg-gray-900 p-1.5 rounded-full mb-12">
        <button
          onClick={() => switchMode('focus')}
          className={mode === 'focus'
            ? 'px-5 py-2 rounded-full bg-indigo-600 text-white font-bold text-sm'
            : 'px-5 py-2 rounded-full text-gray-500 text-sm'}>
          Focus
        </button>
        <button
          onClick={() => switchMode('short')}
          className={mode === 'short'
            ? 'px-5 py-2 rounded-full bg-indigo-600 text-white font-bold text-sm'
            : 'px-5 py-2 rounded-full text-gray-500 text-sm'}>
          Short Break
        </button>
        <button
          onClick={() => switchMode('long')}
          className={mode === 'long'
            ? 'px-5 py-2 rounded-full bg-indigo-600 text-white font-bold text-sm'
            : 'px-5 py-2 rounded-full text-gray-500 text-sm'}>
          Long Break
        </button>
      </div>

      <div className="w-56 h-56 rounded-full border-8 border-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-indigo-500/30 bg-gray-900">
        <span className="text-6xl font-extrabold text-white tracking-tighter">
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          {mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short Break' : 'Long Break'}
        </span>
      </div>

      <div className="flex gap-4 mt-12">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-14 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-full shadow-lg shadow-indigo-500/40 transition-all duration-200 hover:scale-105">
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={reset}
          className="px-8 py-4 bg-transparent border-2 border-gray-700 hover:border-indigo-500 text-gray-500 hover:text-white font-bold text-lg rounded-full transition-all duration-200">
          ↺
        </button>
      </div>

      <div className="flex gap-3 mt-10">
        {[1,2,3,4].map((dot) => (
          <div key={dot} className="w-3 h-3 rounded-full bg-indigo-600 opacity-30" />
        ))}
      </div>
    </div>
  )
}

export default TimerCard