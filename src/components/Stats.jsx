import useLocalStorage from '../hooks/useLocalStorage'

function Stats() {
  const [sessions] = useLocalStorage('sessions', [])

  const todaySessions = sessions.filter(
    s => s.date === new Date().toLocaleDateString()
  )

  const totalFocusTime = todaySessions
    .filter(s => s.mode === 'focus')
    .reduce((acc, s) => acc + s.duration, 0)

  const clearSessions = () => {
    localStorage.removeItem('sessions')
    window.location.reload()
  }

  return (
    <div className="px-6 py-8 pb-24">

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">
            {todaySessions.filter(s => s.mode === 'focus').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Sessions</div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">
            {totalFocusTime}
          </div>
          <div className="text-xs text-gray-500 mt-1">Minutes</div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            🔥 1
          </div>
          <div className="text-xs text-gray-500 mt-1">Streak</div>
        </div>
      </div>

      {/* Session History */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Today's Sessions</h2>
        <button
          onClick={clearSessions}
          className="text-xs text-red-400 border border-red-400 px-3 py-1 rounded-full">
          Clear
        </button>
      </div>

      {todaySessions.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <div className="text-5xl mb-4">⏱</div>
          <p>No sessions yet today!</p>
          <p className="text-sm mt-2">Complete a timer to see stats</p>
        </div>
      ) : (
        todaySessions.map((session) => (
          <div key={session.id}
            className="bg-gray-900 rounded-xl p-4 mb-3 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">
                {session.mode === 'focus' ? '🎯 Focus' : session.mode === 'short' ? '☕ Short Break' : '😴 Long Break'}
              </div>
              <div className="text-xs text-gray-500 mt-1">{session.time}</div>
            </div>
            <div className="text-indigo-400 font-bold">
              {session.duration} min
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Stats