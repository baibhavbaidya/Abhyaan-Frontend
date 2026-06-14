import { NavLink } from 'react-router-dom'

const LayoutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const CampaignIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const ChatIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const navItems = [
  { to: '/dashboard', icon: <LayoutIcon />, label: 'Dashboard' },
  { to: '/campaigns', icon: <CampaignIcon />, label: 'Campaigns' },
  { to: '/chat', icon: <ChatIcon />, label: 'Ask Abhyaan' },
]

export default function Sidebar() {
  return (
    <div style={{
      width: '60px',
      minHeight: '100vh',
      background: '#F5F3EF',
      borderRight: '1px solid #E9E4DC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '16px',
      paddingBottom: '16px',
      gap: '4px',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        background: '#C4602A',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        flexShrink: 0,
      }}>
        <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '14px', letterSpacing: '-0.5px' }}>A</span>
      </div>

      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          title={item.label}
          style={({ isActive }) => ({
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive ? '#C4602A' : '#A8A29E',
            background: isActive ? '#FFFFFF' : 'transparent',
            border: isActive ? '1px solid #E9E4DC' : '1px solid transparent',
            textDecoration: 'none',
            transition: 'all 0.12s ease',
            cursor: 'pointer',
          })}
        >
          {item.icon}
        </NavLink>
      ))}
    </div>
  )
}