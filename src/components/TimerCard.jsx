import useLocalStorage from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'

function TimerCard() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [sessions, setSessions] = useLocalStorage('sessions', [])
  const [focusTime, setFocusTime] = useState(25)
  const [shortTime, setShortTime] = useState(5)
  const [longTime, setLongTime] = useState(15)
  const [showSettings, setShowSettings] = useState(false)

  const modeConfig = {
    focus: {
      color: 'bg-indigo-600',
      border: 'border-indigo-600',
      shadow: 'shadow-indigo-500/40',
      text: 'text-indigo-400',
      stroke: '#6366f1',
    },
    short: {
      color: 'bg-green-600',
      border: 'border-green-600',
      shadow: 'shadow-green-500/40',
      text: 'text-green-400',
      stroke: '#22c55e',
    },
    long: {
      color: 'bg-yellow-500',
      border: 'border-yellow-500',
      shadow: 'shadow-yellow-500/40',
      text: 'text-yellow-400',
      stroke: '#eab308',
    },
  }

  const current = modeConfig[mode]

  const total = mode === 'focus' ? focusTime * 60 : mode === 'short' ? shortTime * 60 : longTime * 60
  const progress = ((total - timeLeft) / total) * 100
  const radius = 108
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

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
            duration: mode === 'focus' ? focusTime : mode === 'short' ? shortTime : longTime,
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
    return (
      <div className="flex flex-col items-center">
        <span className="text-6xl font-extrabold text-white tracking-tighter">
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </span>
        <div className="flex gap-4 mt-1">
          <span className="text-xs text-gray-600 tracking-widest">MIN</span>
          <span className="text-xs text-gray-800">:</span>
          <span className="text-xs text-gray-600 tracking-widest">SEC</span>
        </div>
      </div>
    )
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    if (newMode === 'focus') setTimeLeft(focusTime * 60)
    if (newMode === 'short') setTimeLeft(shortTime * 60)
    if (newMode === 'long') setTimeLeft(longTime * 60)
  }

  const reset = () => {
    setIsRunning(false)
    if (mode === 'focus') setTimeLeft(focusTime * 60)
    if (mode === 'short') setTimeLeft(shortTime * 60)
    if (mode === 'long') setTimeLeft(longTime * 60)
  }

  return (
    <div className="flex flex-col items-center justify-center mt-6 px-6 pb-24">

      {/* Mode Buttons */}
      <div className="flex gap-2 bg-gray-900 p-1.5 rounded-full mb-6">
        <button
          onClick={() => switchMode('focus')}
          className={mode === 'focus'
            ? 'px-5 py-2 rounded-full bg-indigo-600 text-white font-bold text-sm transition-all'
            : 'px-5 py-2 rounded-full text-gray-500 text-sm transition-all'}>
          Focus
        </button>
        <button
          onClick={() => switchMode('short')}
          className={mode === 'short'
            ? 'px-5 py-2 rounded-full bg-green-600 text-white font-bold text-sm transition-all'
            : 'px-5 py-2 rounded-full text-gray-500 text-sm transition-all'}>
          Short Break
        </button>
        <button
          onClick={() => switchMode('long')}
          className={mode === 'long'
            ? 'px-5 py-2 rounded-full bg-yellow-500 text-white font-bold text-sm transition-all'
            : 'px-5 py-2 rounded-full text-gray-500 text-sm transition-all'}>
          Long Break
        </button>
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`text-xs mb-4 transition-all ${showSettings ? current.text : 'text-gray-500 hover:text-indigo-400'}`}>
        ⚙️ Customize Timer
      </button>

      {/* Custom Time Settings */}
      {showSettings && (
        <div className={`rounded-2xl p-5 mb-6 w-full border bg-gray-900 ${current.border} transition-all`}>
          <p className="text-gray-400 text-sm mb-4 text-center">Set your own times (minutes)</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-indigo-400 mb-2">🎯 Focus</p>
              <input
                type="number" min="1"
                value={focusTime}
                onChange={e => {
                  setFocusTime(Number(e.target.value))
                  if (mode === 'focus') setTimeLeft(Number(e.target.value) * 60)
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-2 py-2 text-white text-center font-bold outline-none focus:border-indigo-500"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-green-400 mb-2">☕ Short</p>
              <input
                type="number" min="1"
                value={shortTime}
                onChange={e => {
                  setShortTime(Number(e.target.value))
                  if (mode === 'short') setTimeLeft(Number(e.target.value) * 60)
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-2 py-2 text-white text-center font-bold outline-none focus:border-green-500"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-yellow-400 mb-2">😴 Long</p>
              <input
                type="number" min="1"
                value={longTime}
                onChange={e => {
                  setLongTime(Number(e.target.value))
                  if (mode === 'long') setTimeLeft(Number(e.target.value) * 60)
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-2 py-2 text-white text-center font-bold outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SVG Progress Ring */}
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        <svg width="260" height="260" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          {/* Background track ring */}
          <circle
            cx="130" cy="130" r={radius}
            fill="#111827"
            stroke={current.stroke}
            strokeWidth="10"
            opacity="0.3"
          />
          {/* Progress ring */}
          <circle
            cx="130" cy="130" r={radius}
            fill="none"
            stroke={current.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s',
              filter: `drop-shadow(0 0 10px ${current.stroke})`
            }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {formatTime(timeLeft)}
          <span className={`text-xs ${current.text} uppercase tracking-widest mt-2 transition-all`}>
            {mode === 'focus' ? '🎯 Focus' : mode === 'short' ? '☕ Short Break' : '😴 Long Break'}
          </span>
          <span className="text-xs text-gray-600 mt-1">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-14 py-4 ${current.color} hover:opacity-90 text-white font-bold text-lg rounded-full shadow-lg ${current.shadow} transition-all duration-200 hover:scale-105`}>
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={reset}
          className="px-8 py-4 bg-transparent border-2 border-gray-700 text-gray-500 hover:text-white font-bold text-lg rounded-full transition-all duration-200">
          ↺
        </button>
      </div>

      {/* Session Dots */}
      <div className="flex gap-3 mt-8">
        {[1, 2, 3].map((dot) => (
          <div key={dot}
            className={`h-3 rounded-full transition-all duration-300 ${
              mode === 'focus' && dot === 1
                ? 'w-6 bg-indigo-600 opacity-100'
                : mode === 'short' && dot === 2
                ? 'w-6 bg-green-600 opacity-100'
                : mode === 'long' && dot === 3
                ? 'w-6 bg-yellow-500 opacity-100'
                : 'w-3 bg-gray-700 opacity-40'
            }`}
          />
        ))}
      </div>

    </div>
  )
}

export default TimerCard