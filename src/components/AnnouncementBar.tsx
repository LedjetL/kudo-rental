const ITEMS = [
  { icon: '✓', text: 'No Deposit Required' },
  { icon: '✓', text: 'Pay on Pickup' },
  { icon: '✓', text: 'WhatsApp Confirmed' },
  { icon: '✓', text: 'Airport Pickup Available' },
]

export default function AnnouncementBar() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 102,
      background: '#c0392b',
      height: '36px',
      padding: '0 clamp(16px, 4vw, 40px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'clamp(16px, 4vw, 40px)',
      overflow: 'hidden',
    }}>
      {ITEMS.map(item => (
        <span key={item.text} style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ opacity: 0.8 }}>{item.icon}</span>
          {item.text}
        </span>
      ))}
    </div>
  )
}
