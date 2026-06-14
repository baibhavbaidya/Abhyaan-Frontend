import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api'

function ChatContent({ onCreateCampaign, expanded }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! Tell me who you want to reach and I'll build the campaign.",
    }
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #E9E4DC',
        fontSize: '13px',
        fontWeight: '600',
        color: '#1C1917',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '7px', height: '7px',
          background: '#2E7D52',
          borderRadius: '50%',
          flexShrink: 0,
        }} />
        {expanded ? 'Ask Abhyaan' : ''}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: expanded ? '14px' : '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {expanded && messages.map((msg, i) => (
          <div key={i}>
            <div style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '88%',
                padding: '9px 12px',
                borderRadius: msg.role === 'user'
                  ? '12px 12px 2px 12px'
                  : '12px 12px 12px 2px',
                background: msg.role === 'user' ? '#C4602A' : '#F5F3EF',
                color: msg.role === 'user' ? '#FFFFFF' : '#1C1917',
                fontSize: '13px',
                lineHeight: '1.6',
              }}>
                {msg.text}
              </div>
            </div>

            {msg.campaign && (
              <div style={{
                marginTop: '8px',
                padding: '12px',
                background: '#FAFAF8',
                border: '1px solid #E9E4DC',
                borderLeft: '3px solid #C4602A',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#1C1917', marginBottom: '4px' }}>
                  {msg.campaign.campaign_name}
                </div>
                <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '8px' }}>
                  {msg.campaign.customer_count} customers · {msg.campaign.suggested_channel}
                </div>
                <button
                  onClick={() => onCreateCampaign({
                    title: msg.campaign.campaign_name,
                    reasoning: msg.campaign.reasoning,
                    suggested_message: msg.campaign.suggested_message,
                    suggested_channel: msg.campaign.suggested_channel,
                    criteria: msg.campaign.criteria,
                    customer_count: msg.campaign.customer_count,
                    estimated_revenue: 0,
                    urgency: 'medium',
                  })}
                  style={{
                    width: '100%',
                    padding: '7px',
                    background: '#C4602A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Create Campaign →
                </button>
              </div>
            )}
          </div>
        ))}

        {expanded && loading && (
          <div style={{
            padding: '9px 12px',
            background: '#F5F3EF',
            borderRadius: '12px 12px 12px 2px',
            fontSize: '13px',
            color: '#A8A29E',
            width: 'fit-content',
          }}>
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #E9E4DC',
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
        background: '#FFFFFF',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={expanded ? 'e.g. big spenders in Mumbai...' : '...'}
          style={{
            flex: 1,
            padding: '9px 10px',
            border: '1px solid #E9E4DC',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1C1917',
            background: '#FAFAF8',
            outline: 'none',
            fontFamily: 'inherit',
            minWidth: 0,
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: '9px 12px',
            background: loading ? '#E9E4DC' : '#C4602A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            flexShrink: 0,
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}

export default function ChatPanel({ onCreateCampaign }) {
  const [expanded, setExpanded] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      {/* Desktop expandable panel */}
      <div
        className={`chat-panel-wrapper ${expanded ? 'expanded' : ''}`}
        onClick={() => !expanded && setExpanded(true)}
        style={{ cursor: expanded ? 'default' : 'pointer' }}
      >
        {/* Collapse button when expanded */}
        {expanded && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(false)
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#A8A29E',
              fontSize: '16px',
              lineHeight: 1,
              zIndex: 10,
              padding: '2px 6px',
            }}
          >
            ×
          </button>
        )}

        {/* Collapsed state — just show chat icon */}
        {!expanded && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '16px',
            gap: '8px',
          }}>
            <div style={{
              width: '7px', height: '7px',
              background: '#2E7D52',
              borderRadius: '50%',
            }} />
            <svg width="18" height="18" fill="none" stroke="#A8A29E" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        )}

        {/* Expanded state — full chat */}
        {expanded && (
          <ChatContent
            onCreateCampaign={(opp) => {
              onCreateCampaign(opp)
            }}
            expanded={expanded}
          />
        )}
      </div>

      {/* Mobile FAB */}
      <button
        className="chat-fab"
        onClick={() => setSheetOpen(true)}
      >
        💬
      </button>

      {/* Mobile overlay */}
      <div
        className={`chat-overlay ${sheetOpen ? 'open' : ''}`}
        onClick={() => setSheetOpen(false)}
      />

      {/* Mobile bottom sheet */}
      <div className={`chat-bottom-sheet ${sheetOpen ? 'open' : ''}`}>
        {/* Sheet handle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '12px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '36px', height: '4px',
            background: '#E9E4DC',
            borderRadius: '2px',
          }} />
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChatContent
            onCreateCampaign={(opp) => {
              setSheetOpen(false)
              onCreateCampaign(opp)
            }}
            expanded={true}
          />
        </div>
      </div>
    </>
  )
}