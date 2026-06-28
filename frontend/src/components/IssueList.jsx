import { useEffect, useState } from 'react'
import { getAllIssues, updateStatus, upvoteIssue, deleteIssue } from '../api'
import toast from 'react-hot-toast'
import { ThumbsUp, Trash2 } from 'lucide-react'

const statusColors = {
  'Reported': '#ef4444',
  'In Progress': '#f59e0b',
  'Resolved': '#22c55e'
}

const severityColors = {
  'Low': '#22c55e', 'Medium': '#f59e0b', 'High': '#f97316', 'Critical': '#ef4444'
}

export default function IssueList() {
  const [issues, setIssues] = useState([])
  const [filter, setFilter] = useState('All')

  const load = () => getAllIssues().then(res => setIssues(res.data)).catch(console.error)

  useEffect(() => { load() }, [])

  const handleStatus = async (id, status) => {
    await updateStatus(id, status)
    toast.success('Status updated!')
    load()
  }

  const handleUpvote = async (id) => {
    await upvoteIssue(id)
    load()
  }

  const handleDelete = async (id) => {
    await deleteIssue(id)
    toast.success('Issue deleted')
    load()
  }

  const statuses = ['All', 'Reported', 'In Progress', 'Resolved']
  const filtered = filter === 'All' ? issues : issues.filter(i => i.status === filter)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>All Issues</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 16px', borderRadius: '20px', border: 'none',
            cursor: 'pointer', fontWeight: '500', fontSize: '13px',
            background: filter === s ? '#6366f1' : '#1e293b',
            color: filter === s ? '#fff' : '#94a3b8'
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(issue => (
          <div key={issue._id} style={{
            background: '#1e293b', borderRadius: '12px',
            padding: '20px', border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '16px' }}>{issue.title}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: severityColors[issue.severity] + '22', color: severityColors[issue.severity] }}>{issue.severity}</span>
                  <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', background: '#334155', color: '#94a3b8' }}>{issue.category}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>{issue.description}</p>
                <p style={{ color: '#64748b', fontSize: '12px' }}>📍 {issue.location.address || `${issue.location.lat}, ${issue.location.lng}`}</p>
              </div>
              {issue.imageUrl && (
                <img src={`http://localhost:5000${issue.imageUrl}`} alt="issue"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginLeft: '16px' }} />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
              <select
                value={issue.status}
                onChange={e => handleStatus(issue._id, e.target.value)}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: '1px solid #334155',
                  background: '#0f172a', color: statusColors[issue.status], fontWeight: '600',
                  cursor: 'pointer', fontSize: '13px'
                }}
              >
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button onClick={() => handleUpvote(issue._id)} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '8px', border: '1px solid #334155',
                background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px'
              }}>
                <ThumbsUp size={14} /> {issue.upvotes}
              </button>

              <button onClick={() => handleDelete(issue._id)} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '8px', border: 'none',
                background: '#ef444422', color: '#ef4444', cursor: 'pointer', fontSize: '13px'
              }}>
                <Trash2 size={14} /> Delete
              </button>

              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '48px' }}>
            No issues found.
          </div>
        )}
      </div>
    </div>
  )
}