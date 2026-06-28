import { MapPin, List, BarChart2, Plus } from 'lucide-react'

export default function Navbar({ page, setPage, onReport }) {
  const nav = [
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'issues', label: 'Issues', icon: List },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: '#1e293b', borderBottom: '1px solid #334155',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>🏘️</span>
        <span style={{ fontWeight: '700', fontSize: '20px', color: '#6366f1' }}>CommunityHero</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setPage(id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontWeight: '500', fontSize: '14px',
            background: page === id ? '#6366f1' : 'transparent',
            color: page === id ? '#fff' : '#94a3b8',
            transition: 'all 0.2s'
          }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <button onClick={onReport} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '10px 20px', borderRadius: '8px', border: 'none',
        cursor: 'pointer', fontWeight: '600', fontSize: '14px',
        background: '#6366f1', color: '#fff'
      }}>
        <Plus size={16} />
        Report Issue
      </button>
    </nav>
  )
}