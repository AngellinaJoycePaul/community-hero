import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import MapView from './components/MapView'
import IssueList from './components/IssueList'
import ReportModal from './components/ReportModal'
import Dashboard from './components/Dashboard'
import ChatBot from './components/ChatBot'

export default function App() {
  const [page, setPage] = useState('map')
  const [showReport, setShowReport] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const onIssueReported = () => {
    setRefresh(r => r + 1)
    setShowReport(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Toaster position="top-right" />
      <Navbar page={page} setPage={setPage} onReport={() => setShowReport(true)} />

      <div style={{ paddingTop: '70px' }}>
        {page === 'map' && <MapView key={refresh} />}
        {page === 'issues' && <IssueList key={refresh} />}
        {page === 'dashboard' && <Dashboard key={refresh} />}
      </div>

      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} onSuccess={onIssueReported} />
      )}

      <ChatBot />
    </div>
  )
}