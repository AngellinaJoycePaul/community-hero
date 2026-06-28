import { useEffect, useState } from 'react'
import { getAllIssues } from '../api'

export default function Dashboard() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    getAllIssues().then(res => setIssues(res.data)).catch(console.error)
  }, [])

  const total = issues.length
  const resolved = issues.filter(i => i.status === 'Resolved').length
  const inProgress = issues.filter(i => i.status === 'In Progress').length
  const critical = issues.filter(i => i.severity === 'Critical').length

  const categories = {}
  issues.forEach(i => { categories[i.category] = (categories[i.category] || 0) + 1 })

  const stats = [
    { label: 'Total Issues', value: total, color: '#6366f1', icon: '📋' },
    { label: 'Resolved', value: resolved, color: '#22c55e', icon: '✅' },
    { label: 'In Progress', value: inProgress, color: '#f59e0b', icon: '🔧' },
    { label: 'Critical', value: critical, color: '#ef4444', icon: '🚨' },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>📊 Impact Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#1e293b', borderRadius: '12px', padding: '24px',
            border: `1px solid ${s.color}44`, textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '16px' }}>Issues by Category</h3>
        {Object.entries(categories).map(([cat, count]) => (
          <div key={cat} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>{cat}</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{count}</span>
            </div>
            <div style={{ background: '#334155', borderRadius: '4px', height: '8px' }}>
              <div style={{
                background: '#6366f1', borderRadius: '4px', height: '8px',
                width: `${(count / total) * 100}%`, transition: 'width 0.5s'
              }} />
            </div>
          </div>
        ))}
        {Object.keys(categories).length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center' }}>No data yet. Report some issues!</p>
        )}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155', marginTop: '16px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>Resolution Rate</h3>
        <div style={{ fontSize: '48px', fontWeight: '800', color: '#22c55e' }}>
          {total > 0 ? Math.round((resolved / total) * 100) : 0}%
        </div>
        <p style={{ color: '#64748b', fontSize: '13px' }}>{resolved} out of {total} issues resolved</p>
      </div>
    </div>
  )
}