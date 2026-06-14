const urgencyConfig = {
  high: { label: 'HIGH', color: '#C0392B', bg: '#FEF2F2' },
  medium: { label: 'MED', color: '#B7791F', bg: '#FFFBEB' },
  low: { label: 'LOW', color: '#2E7D52', bg: '#F0FDF4' },
}

const channelLabel = {
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  email: 'Email',
}

export default function OpportunityCard({ opportunity, onCreateCampaign }) {
  const urgency = urgencyConfig[opportunity.urgency] || urgencyConfig.medium

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E9E4DC',
        borderLeft: '3px solid #C4602A',
        borderRadius: '10px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
        gap: '12px',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1C1917',
          flex: 1,
          lineHeight: '1.4',
        }}>
          {opportunity.title}
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: '4px',
          color: urgency.color,
          background: urgency.bg,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          {urgency.label}
        </span>
      </div>

      {/* Reasoning */}
      <p style={{
        fontSize: '12px',
        color: '#78716C',
        lineHeight: '1.6',
        marginBottom: '16px',
        flex: 1,
      }}>
        {opportunity.reasoning}
      </p>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
        paddingTop: '14px',
        borderTop: '1px solid #F5F3EF',
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            color: '#A8A29E',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '3px',
          }}>
            Customers
          </div>
          <div style={{
            fontSize: '17px',
            fontWeight: '700',
            color: '#1C1917',
            letterSpacing: '-0.5px',
          }}>
            {opportunity.customer_count?.toLocaleString('en-IN')}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '10px',
            color: '#A8A29E',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '3px',
          }}>
            Est. Revenue
          </div>
          <div style={{
            fontSize: '17px',
            fontWeight: '700',
            color: '#2E7D52',
            letterSpacing: '-0.5px',
          }}>
            ₹{(opportunity.estimated_revenue / 100000).toFixed(1)}L
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '10px',
            color: '#A8A29E',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '3px',
          }}>
            Channel
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1C1917',
            whiteSpace: 'nowrap',
          }}>
            {channelLabel[opportunity.suggested_channel] || opportunity.suggested_channel}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onCreateCampaign(opportunity)}
        style={{
          width: '100%',
          padding: '9px',
          background: '#C4602A',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '7px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#A84E22'}
        onMouseLeave={e => e.currentTarget.style.background = '#C4602A'}
      >
        Create Campaign →
      </button>
    </div>
  )
}