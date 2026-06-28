import { useState } from 'react'
import { chatWithAI, getAllIssues } from '../api'
import { MessageCircle, X, Send } from 'lucide-react'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m CommunityBot 🤖 Ask me anything about local issues!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const issuesRes = await getAllIssues()
      const summary = issuesRes.data.map(i =>
        `${i.title} (${i.category}, ${i.severity}, ${i.status}) at ${i.location.address || i.location.lat + ',' + i.location.lng}`
      ).join('; ')

      const res = await chatWithAI(userMsg, summary)
      setMessages(m => [...m, { role: 'bot', text: res.data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'bot', text: 'Sorry, I had trouble responding. Try again!' }])
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 1500,
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#6366f1', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
      }}>
        {open ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 1500,
          width: '320px', background: '#1e293b', borderRadius: '16px',
          border: '1px solid #334155', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', background: '#6366f1', fontWeight: '700' }}>
            🤖 CommunityBot
          </div>

          <div style={{ padding: '16px', height: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#6366f1' : '#334155',
                padding: '10px 14px', borderRadius: '12px',
                fontSize: '13px', maxWidth: '85%', lineHeight: '1.5'
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#334155', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', color: '#94a3b8' }}>
                Thinking...
              </div>
            )}
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about issues..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '8px',
                border: '1px solid #334155', background: '#0f172a',
                color: '#e2e8f0', fontSize: '13px', outline: 'none'
              }}
            />
            <button onClick={send} style={{
              padding: '8px 12px', borderRadius: '8px', border: 'none',
              background: '#6366f1', color: '#fff', cursor: 'pointer'
            }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}