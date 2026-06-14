import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCampaigns, deleteCampaign } from '../api'

const channelIcon = {
  whatsapp: '💬',
  sms: '📱',
  email: '✉️',
}

const statusConfig = {
  running: { label: 'Running', color: '#B7791F', bg: '#FFFBEB' },
  completed: { label: 'Completed', color: '#2E7D52', bg: '#F0FDF4' },
  draft: { label: 'Draft', color: '#78716C', bg: '#F5F3EF' },
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '15px', fontWeight: '700', color: color || '#1C1917', letterSpacing: '-0.5px' }}>
        {value}
      </div>
      <div style={{ fontSize: '10px', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  )
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCampaigns()
      .then(res => setCampaigns(res.data.campaigns))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this campaign and all its data?')) return
    await deleteCampaign(id)
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const deliveryRate = (c) =>
    c.total_sent > 0 ? Math.round((c.delivered / c.total_sent) * 100) : 0

  const openRate = (c) =>
    c.delivered > 0 ? Math.round((c.opened / c.delivered) * 100) : 0

  return (
    <div style={{ padding: '32px', flex: 1 }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A29E', marginBottom: '4px' }}>
          Campaigns
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#1C1917', letterSpacing: '-0.5px' }}>
          All Campaigns
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#A8A29E', fontSize: '14px' }}>Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px',
          color: '#A8A29E', fontSize: '14px',
          border: '1px dashed #E9E4DC', borderRadius: '12px',
        }}>
          No campaigns yet. Go to Dashboard to launch one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {campaigns.map(c => {
            const status = statusConfig[c.status] || statusConfig.draft
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/analytics/${c.id}`)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E9E4DC',
                  borderLeft: '3px solid #C4602A',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917', marginBottom: '4px' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#A8A29E' }}>
                    {channelIcon[c.channel]} {c.channel} · {new Date(c.launched_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="campaign-stats">
                  <StatPill label="Sent" value={c.total_sent?.toLocaleString('en-IN')} />
                  <StatPill label="Delivered" value={`${deliveryRate(c)}%`} color="#2E7D52" />
                  <StatPill label="Opened" value={`${openRate(c)}%`} color="#B7791F" />
                  <StatPill label="Clicked" value={c.clicked?.toLocaleString('en-IN')} color="#C4602A" />
                </div>

                <span style={{
                  fontSize: '11px', fontWeight: '600',
                  padding: '4px 10px', borderRadius: '5px',
                  color: status.color, background: status.bg,
                  letterSpacing: '0.05em',
                }}>
                  {status.label}
                </span>

                <span style={{ color: '#A8A29E', fontSize: '16px' }}>→</span>

                <button
                  onClick={(e) => handleDelete(e, c.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #E9E4DC',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    color: '#C0392B',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}