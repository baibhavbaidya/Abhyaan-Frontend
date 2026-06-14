import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCampaignAnalytics } from '../api'

const channelIcon = { whatsapp: '💬', sms: '📱', email: '✉️' }

function FunnelBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#78716C', fontWeight: '500' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1C1917' }}>
          {value?.toLocaleString('en-IN')} <span style={{ color: '#A8A29E', fontWeight: '400' }}>({pct.toFixed(1)}%)</span>
        </span>
      </div>
      <div style={{ height: '6px', background: '#F5F3EF', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: '3px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

export default function Analytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCampaignAnalytics(id)
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ padding: '32px', color: '#A8A29E', fontSize: '14px' }}>
      Loading analytics...
    </div>
  )

  if (!data) return (
    <div style={{ padding: '32px', color: '#C0392B', fontSize: '14px' }}>
      Campaign not found.
    </div>
  )

  const { stats } = data

  return (
    <div style={{ padding: '32px', maxWidth: '720px' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/campaigns')}
        style={{
          background: 'none', border: 'none',
          color: '#A8A29E', fontSize: '13px',
          cursor: 'pointer', marginBottom: '24px',
          padding: 0, display: 'flex', alignItems: 'center', gap: '4px',
        }}
      >
        ← Back to Campaigns
      </button>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A29E', marginBottom: '4px' }}>
          {channelIcon[data.channel]} {data.channel} · {new Date(data.launched_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#1C1917', letterSpacing: '-0.5px' }}>
          {data.campaign_name}
        </div>
      </div>

      {/* Funnel */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E9E4DC',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#A8A29E', marginBottom: '20px' }}>
          Campaign Funnel
        </div>
        <FunnelBar label="Sent" value={stats.total_sent} total={stats.total_sent} color="#1C1917" />
        <FunnelBar label="Delivered" value={stats.delivered} total={stats.total_sent} color="#2E7D52" />
        <FunnelBar label="Failed" value={stats.failed} total={stats.total_sent} color="#C0392B" />
        <FunnelBar label="Opened" value={stats.opened} total={stats.delivered} color="#B7791F" />
        <FunnelBar label="Clicked" value={stats.clicked} total={stats.opened} color="#C4602A" />
      </div>

      {/* Rates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '20px',
      }}>
        {[
          { label: 'Delivery Rate', value: `${stats.delivery_rate}%`, color: '#2E7D52' },
          { label: 'Open Rate', value: `${stats.open_rate}%`, color: '#B7791F' },
          { label: 'Click Rate', value: `${stats.click_rate}%`, color: '#C4602A' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            border: '1px solid #E9E4DC',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: s.color, letterSpacing: '-1px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '11px', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div style={{
        background: '#FAFAF8',
        border: '1px solid #E9E4DC',
        borderLeft: '3px solid #C4602A',
        borderRadius: '10px',
        padding: '20px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#A8A29E', marginBottom: '10px' }}>
          AI Insight
        </div>
        <p style={{ fontSize: '14px', color: '#1C1917', lineHeight: '1.7' }}>
          {data.ai_insight}
        </p>
      </div>
    </div>
  )
}