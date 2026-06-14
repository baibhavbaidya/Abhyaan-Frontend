import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatsBar from '../components/StatsBar'
import OpportunityCard from '../components/OpportunityCard'
import CampaignModal from '../components/CampaignModal'
import { getOpportunities } from '../api'

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getOpportunities()
      .then(res => setOpportunities(res.data.opportunities))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StatsBar />

      <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

        {/* Header row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <div style={{
              fontSize: '11px', fontWeight: '600',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#A8A29E', marginBottom: '4px',
            }}>
              AI Opportunities
            </div>
            <div style={{
              fontSize: '22px', fontWeight: '700',
              color: '#1C1917', letterSpacing: '-0.5px',
            }}>
              Where to focus today
            </div>
          </div>

          {/* Chat CTA */}
          <button
            onClick={() => navigate('/chat')}
            style={{
              padding: '10px 18px',
              background: '#FFFFFF',
              border: '1px solid #E9E4DC',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#78716C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#C4602A'
              e.currentTarget.style.color = '#C4602A'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E9E4DC'
              e.currentTarget.style.color = '#78716C'
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Ask Abhyaan
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ color: '#A8A29E', fontSize: '14px' }}>
            Scanning your customer base...
          </div>
        ) : (
          <div className="opp-grid">
            {opportunities.map((opp, i) => (
              <OpportunityCard
                key={i}
                opportunity={opp}
                onCreateCampaign={setSelectedOpportunity}
              />
            ))}
          </div>
        )}
      </div>

      {selectedOpportunity && (
        <CampaignModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onLaunched={() => {
            setSelectedOpportunity(null)
            navigate('/campaigns')
          }}
        />
      )}
    </div>
  )
}