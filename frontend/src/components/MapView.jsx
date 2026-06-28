import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { getAllIssues } from '../api'

const severityColors = { Low: '🟢', Medium: '🟡', High: '🟠', Critical: '🔴' }
const categoryIcons = {
  'Pothole': '🕳️', 'Water Leakage': '💧', 'Broken Streetlight': '💡',
  'Garbage/Waste': '🗑️', 'Damaged Road': '🛣️', 'Flooding': '🌊',
  'Graffiti': '🎨', 'Other': '⚠️'
}

const createIcon = (emoji) => L.divIcon({
  className: '',
  html: `<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

export default function MapView() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    getAllIssues().then(res => setIssues(res.data)).catch(console.error)
  }, [])

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        {issues.map(issue => (
          <Marker
            key={issue._id}
            position={[issue.location.lat, issue.location.lng]}
            icon={createIcon(categoryIcons[issue.category] || '⚠️')}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>{issue.title}</strong>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{issue.description}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{issue.category}</span>
                  <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{severityColors[issue.severity]} {issue.severity}</span>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{issue.status}</span>
                </div>
                {issue.imageUrl && (
                  <img
                    src={`http://localhost:5000${issue.imageUrl}`}
                    alt="issue"
                    style={{ width: '100%', borderRadius: '6px', marginTop: '8px' }}
                  />
                )}
                <p style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>👍 {issue.upvotes} upvotes</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}