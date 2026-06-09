import { useState } from 'react'
import Header from './components/Header'
import TimerCard from './components/TimerCard'
import FooterNav from './components/FooterNav'
import Stats from './components/Stats'
import Tasks from './components/Tasks'

function App() {
  const [activeTab, setActiveTab] = useState('timer')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      {activeTab === 'timer' && <TimerCard />}
      {activeTab === 'tasks' && <Tasks />}
      {activeTab === 'stats' && <Stats />}
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
export default App