import { useEffect, useState } from 'react'
import { getCustomerStats } from '../api'

const statItems = (data) => [
  {
    label: 'Total Customers',
    value: data.total_customers?.toLocaleString('en-IN'),
    sub: 'in your base',
  },
  {
    label: 'Total Revenue',
    value: `₹${(data.total_revenue / 100000).toFixed(1)}L`,
    sub: 'lifetime',
  },
  {
    label: 'Active This Month',
    value: data.active_customers?.toLocaleString('en-IN'),
    sub: 'purchased in 30 days',
  },
  {
    label: 'Avg Order Value',
    value: `₹${data.avg_order_value?.toLocaleString('en-IN')}`,
    sub: 'per transaction',
  },
]

export default function StatsBar() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getCustomerStats().then(res => setStats(res.data))
  }, [])

  if (!stats) return (
    <div style={{
      borderBottom: '1px solid #E9E4DC',
      padding: '16px 28px',
      background: '#FFFFFF',
      color: '#A8A29E',
      fontSize: '13px',
    }}>
      Loading stats...
    </div>
  )

  return (
    <div className="stats-bar" style={{
      borderBottom: '1px solid #E9E4DC',
      background: '#FFFFFF',
    }}>
      {statItems(stats).map((item, i) => (
        <div
          key={i}
          style={{
            padding: '16px 24px',
            borderRight: i < 3 ? '1px solid #E9E4DC' : 'none',
            flex: '1 0 140px',
            minWidth: '140px',
          }}
        >
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#A8A29E',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
          }}>
            {item.label}
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1C1917',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#A8A29E',
            marginTop: '2px',
            whiteSpace: 'nowrap',
          }}>
            {item.sub}
          </div>
        </div>
      ))}
    </div>
  )
}