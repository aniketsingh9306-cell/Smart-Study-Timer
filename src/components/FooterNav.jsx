function FooterNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-0 w-full flex justify-around bg-gray-900 py-4 border-t border-gray-800">
      <button
        onClick={() => setActiveTab('timer')}
        className={activeTab === 'timer'
          ? 'text-indigo-400 font-bold text-sm px-5 py-2 rounded-full bg-indigo-500 bg-opacity-10'
          : 'text-gray-500 text-sm px-5 py-2'}>
        ⏱ Timer
      </button>
      <button
        onClick={() => setActiveTab('tasks')}
        className={activeTab === 'tasks'
          ? 'text-indigo-400 font-bold text-sm px-5 py-2 rounded-full bg-indigo-500 bg-opacity-10'
          : 'text-gray-500 text-sm px-5 py-2'}>
        ✅ Tasks
      </button>
      <button
        onClick={() => setActiveTab('stats')}
        className={activeTab === 'stats'
          ? 'text-indigo-400 font-bold text-sm px-5 py-2 rounded-full bg-indigo-500 bg-opacity-10'
          : 'text-gray-500 text-sm px-5 py-2'}>
        📊 Stats
      </button>
    </div>
  )
}
export default FooterNav