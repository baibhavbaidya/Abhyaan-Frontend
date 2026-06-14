import { useState } from 'react'
import { launchCampaign } from '../api'

const channelOptions = ['whatsapp', 'sms', 'email']

export default function CampaignModal({ opportunity, onClose, onLaunched }) {
  const [name, setName] = useState(opportunity?.title || '')
  const [message, setMessage] = useState(opportunity?.suggested_message || '')
  const [channel, setChannel] = useState(opportunity?.suggested_channel || 'whatsapp')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLaunch = async () => {
    if (!name || !message) return
    setLoading(true)
    setError(null)
    try {
      const res = await launchCampaign({
        name,
        message,
        channel,
        criteria: opportunity.criteria,
        segment_name: opportunity.title,
      })
      onLaunched(res.data)
    } catch (err) {
      setError('Failed to launch campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E9E4DC',
        borderRadius: '14px',
        width: '480px',
        padding: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917' }}>
              New Campaign
            </div>
            <div style={{ fontSize: '12px', color: '#A8A29E', marginTop: '2px' }}>
              {opportunity.customer_count} customers · {opportunity.suggested_channel}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              fontSize: '20px', cursor: 'pointer',
              color: '#A8A29E', lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Campaign name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
            Campaign Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px',
              border: '1px solid #E9E4DC', borderRadius: '8px',
              fontSize: '14px', color: '#1C1917',
              background: '#FAFAF8', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Message */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
            Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '10px 12px',
              border: '1px solid #E9E4DC', borderRadius: '8px',
              fontSize: '14px', color: '#1C1917',
              background: '#FAFAF8', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit',
              boxSizing: 'border-box', lineHeight: '1.5',
            }}
          />
          <div style={{ fontSize: '11px', color: '#A8A29E', marginTop: '4px' }}>
            Use {'{name}'} to personalise with customer name
          </div>
        </div>

        {/* Channel */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Channel
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {channelOptions.map(ch => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                style={{
                  flex: 1, padding: '8px',
                  border: channel === ch ? '1.5px solid #C4602A' : '1px solid #E9E4DC',
                  borderRadius: '8px',
                  background: channel === ch ? '#FEF6F2' : '#FAFAF8',
                  color: channel === ch ? '#C4602A' : '#78716C',
                  fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}
              >
                {ch === 'whatsapp' ? '💬' : ch === 'sms' ? '📱' : '✉️'} {ch}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ fontSize: '13px', color: '#C0392B', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px',
              background: 'none',
              border: '1px solid #E9E4DC',
              borderRadius: '8px',
              fontSize: '14px', fontWeight: '500',
              color: '#78716C', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            disabled={loading}
            style={{
              flex: 2, padding: '11px',
              background: loading ? '#E9E4DC' : '#C4602A',
              border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600',
              color: '#FFFFFF', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.12s ease',
            }}
          >
            {loading ? 'Launching...' : 'Launch Campaign →'}
          </button>
        </div>
      </div>
    </div>
  )
}