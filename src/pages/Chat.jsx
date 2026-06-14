import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendChat, launchCampaign } from '../api'
import CampaignModal from '../components/CampaignModal'

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm Abhyaan. Describe who you want to reach — I'll find the right customers, write the message, and set up the campaign for you.",
    }
  ])
  const [loading, setLoading] = useState(false)
  const [launching, setLaunching] = useState(null)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const res = await sendChat(userMessage)
      const data = res.data

      if (!data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.error }])
        return
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.reasoning,
        campaign: data,
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Something went wrong. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleLaunch = async (campaignData) => {
    setLaunching(campaignData.campaign_name)
    try {
      await launchCampaign({
        name: campaignData.campaign_name,
        message: campaignData.suggested_message,
        channel: campaignData.suggested_channel,
        criteria: campaignData.criteria,
        segment_name: campaignData.campaign_name,
      })
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Campaign "${campaignData.campaign_name}" launched to ${campaignData.customer_count} customers. Taking you to campaigns...`,
      }])
      setTimeout(() => navigate('/campaigns'), 1500)
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Failed to launch campaign. Please try again.',
      }])
    } finally {
      setLaunching(null)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#FAFAF8',
    }}>

      {/* Top bar */}
      <div style={{
        padding: '16px 28px',
        borderBottom: '1px solid #E9E4DC',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '8px', height: '8px',
          background: '#2E7D52',
          borderRadius: '50%',
        }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917' }}>
            Ask Abhyaan
          </div>
          <div style={{ fontSize: '12px', color: '#A8A29E' }}>
            Describe your campaign in plain English
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '720px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '8px',
          }}>
            {/* Label */}
            <div style={{
              fontSize: '11px',
              color: '#A8A29E',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {msg.role === 'user' ? 'You' : 'Abhyaan'}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user'
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background: msg.role === 'user' ? '#C4602A' : '#FFFFFF',
              color: msg.role === 'user' ? '#FFFFFF' : '#1C1917',
              fontSize: '14px',
              lineHeight: '1.6',
              border: msg.role === 'ai' ? '1px solid #E9E4DC' : 'none',
              boxShadow: msg.role === 'ai' ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
            }}>
              {msg.text}
            </div>

            {/* Campaign card */}
            {msg.campaign && (
              <div style={{
                width: '100%',
                maxWidth: '80%',
                background: '#FFFFFF',
                border: '1px solid #E9E4DC',
                borderLeft: '3px solid #C4602A',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                {/* Campaign name */}
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1C1917', marginBottom: '4px' }}>
                  {msg.campaign.campaign_name}
                </div>

                {/* Meta */}
                <div style={{ fontSize: '12px', color: '#A8A29E', marginBottom: '14px' }}>
                  {msg.campaign.customer_count} customers · {msg.campaign.suggested_channel}
                </div>

                {/* Message preview */}
                <div style={{
                  background: '#FAFAF8',
                  border: '1px solid #E9E4DC',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '13px',
                  color: '#78716C',
                  lineHeight: '1.6',
                  marginBottom: '14px',
                  fontStyle: 'italic',
                }}>
                  "{msg.campaign.suggested_message}"
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingCampaign(msg.campaign)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: '#FFFFFF',
                      color: '#C4602A',
                      border: '1px solid #C4602A',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Edit & Launch
                  </button>
                  <button
                    onClick={() => handleLaunch(msg.campaign)}
                    disabled={!!launching}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: launching ? '#E9E4DC' : '#C4602A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: launching ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {launching === msg.campaign.campaign_name ? 'Launching...' : 'Launch →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Abhyaan
            </div>
            <div style={{
              padding: '12px 16px',
              background: '#FFFFFF',
              border: '1px solid #E9E4DC',
              borderRadius: '16px 16px 16px 4px',
              fontSize: '14px',
              color: '#A8A29E',
            }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        borderTop: '1px solid #E9E4DC',
        background: '#FFFFFF',
        padding: '16px 28px',
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="e.g. Re-engage customers in Delhi who spent over ₹3000 but haven't bought in 2 months..."
            rows={2}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #E9E4DC',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#1C1917',
              background: '#FAFAF8',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              resize: 'none',
              transition: 'border-color 0.12s ease',
            }}
            onFocus={e => e.target.style.borderColor = '#C4602A'}
            onBlur={e => e.target.style.borderColor = '#E9E4DC'}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px',
              background: loading || !input.trim() ? '#E9E4DC' : '#C4602A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.12s ease',
              flexShrink: 0,
              height: '48px',
            }}
          >
            Send →
          </button>
        </div>
        <div style={{
          maxWidth: '720px',
          margin: '8px auto 0',
          fontSize: '11px',
          color: '#A8A29E',
        }}>
          Press Enter to send · Shift+Enter for new line
        </div>
      </div>

      {/* Edit & Launch modal */}
      {editingCampaign && (
        <CampaignModal
          opportunity={{
            title: editingCampaign.campaign_name,
            suggested_message: editingCampaign.suggested_message,
            suggested_channel: editingCampaign.suggested_channel,
            criteria: editingCampaign.criteria,
            customer_count: editingCampaign.customer_count,
            estimated_revenue: 0,
            urgency: 'medium',
          }}
          onClose={() => setEditingCampaign(null)}
          onLaunched={() => {
            setEditingCampaign(null)
            navigate('/campaigns')
          }}
        />
      )}
    </div>
  )
}