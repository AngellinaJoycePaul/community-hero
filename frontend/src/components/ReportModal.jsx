import { useState } from 'react'
import { analyzeImage, createIssue } from '../api'
import toast from 'react-hot-toast'
import { X, Upload, Loader } from 'lucide-react'

export default function ReportModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Other',
    severity: 'Medium', lat: '', lng: '', address: '', reportedBy: ''
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState('')

  const categories = ['Pothole', 'Water Leakage', 'Broken Streetlight', 'Garbage/Waste', 'Damaged Road', 'Flooding', 'Graffiti', 'Other']

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))

    setAnalyzing(true)
    toast('🤖 Analyzing image... this may take up to 60 seconds', { duration: 8000 })
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await analyzeImage(fd)
      setForm(f => ({
        ...f,
        title: res.data.title || f.title,
        description: res.data.description || f.description,
        category: res.data.category || f.category,
        severity: res.data.severity || f.severity,
      }))
      setAiAnalysis(res.data.analysis || '')
      toast.success('🤖 AI analyzed your image!')
    } catch {
      toast.error('Image analysis failed')
    }
    setAnalyzing(false)
  }

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(f => ({
        ...f,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6)
      }))
      toast.success('📍 Location detected!')
    }, () => toast.error('Location access denied'))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.lat || !form.lng) {
      toast.error('Please fill title and location')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      if (aiAnalysis) fd.append('aiAnalysis', aiAnalysis)
      await createIssue(fd)
      toast.success('✅ Issue reported!')
      onSuccess()
    } catch {
      toast.error('Failed to submit')
    }
    setSubmitting(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #334155', background: '#0f172a',
    color: '#e2e8f0', fontSize: '14px', outline: 'none'
  }

  const labelStyle = { fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#1e293b', borderRadius: '16px', width: '100%',
        maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
        padding: '28px', border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: '700', fontSize: '20px' }}>🚨 Report an Issue</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Upload Photo (AI will auto-fill details)</label>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', border: '2px dashed #334155',
            borderRadius: '10px', padding: '24px', cursor: 'pointer',
            background: '#0f172a', gap: '8px'
          }}>
            {analyzing ? (
              <><Loader size={24} style={{ animation: 'spin 1s linear infinite' }} /><span style={{ color: '#6366f1' }}>Analyzing with Gemini AI...</span></>
            ) : preview ? (
              <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
              <><Upload size={24} color="#6366f1" /><span style={{ color: '#94a3b8', fontSize: '13px' }}>Click to upload image</span></>
            )}
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>

        {aiAnalysis && (
          <div style={{ background: '#1e3a5f', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#93c5fd', border: '1px solid #1d4ed8' }}>
            🤖 <strong>AI Analysis:</strong> {aiAnalysis}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Large pothole on main road" />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Severity</label>
              <select style={inputStyle} value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Location *</label>
            <button onClick={useMyLocation} style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid #6366f1',
              background: 'transparent', color: '#6366f1', cursor: 'pointer',
              fontSize: '13px', marginBottom: '10px'
            }}>📍 Use My Location</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input style={inputStyle} value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="Latitude" />
              <input style={inputStyle} value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="Longitude" />
            </div>
            <input style={{ ...inputStyle, marginTop: '10px' }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Address (optional)" />
          </div>

          <div>
            <label style={labelStyle}>Your Name (optional)</label>
            <input style={inputStyle} value={form.reportedBy} onChange={e => setForm(f => ({ ...f, reportedBy: e.target.value }))} placeholder="Anonymous" />
          </div>

          <button onClick={handleSubmit} disabled={submitting} style={{
            padding: '12px', borderRadius: '10px', border: 'none',
            background: '#6366f1', color: '#fff', fontWeight: '700',
            fontSize: '15px', cursor: 'pointer', marginTop: '8px',
            opacity: submitting ? 0.7 : 1
          }}>
            {submitting ? 'Submitting...' : '🚀 Submit Report'}
          </button>
        </div>
      </div>
    </div>
  )
}