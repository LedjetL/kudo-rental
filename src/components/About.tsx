import { useInView } from '../hooks/useInView'

const VALUES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Local & Personal',
    desc: "We're a family-run business based in Albania. When you book with us, you deal directly with the owner — not a call center.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Fully Maintained Fleet',
    desc: 'Every car is cleaned, inspected, and serviced before each rental. What you see on the website is exactly what you get.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'No Hidden Fees',
    desc: 'The price you see is the price you pay. No surprise charges, no credit card deposits, no fine print.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'WhatsApp-First Support',
    desc: "Have a question before, during, or after your rental? We're always reachable on WhatsApp — quick, direct, no hold music.",
  },
]

export default function About() {
  const { ref, inView } = useInView()

  return (
    <section id="about" ref={ref} style={{
      background: '#0a0a0a',
      padding: 'clamp(64px, 10vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header + intro */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          marginBottom: 'clamp(48px, 8vw, 72px)',
          alignItems: 'center',
        }}>
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', fontWeight: 500,
              letterSpacing: '4px', textTransform: 'uppercase',
              color: '#c0392b', marginBottom: '16px',
            }}>Who We Are</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px, 5vw, 48px)',
              fontWeight: 400, color: '#f5f5f5',
              lineHeight: 1.1, marginBottom: '20px',
            }}>
              Built on Trust,<br />
              <em style={{ fontStyle: 'italic', color: '#d0d0d0' }}>Driven by Service</em>
            </h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px', fontWeight: 300,
              color: '#999', lineHeight: 1.85,
              maxWidth: '420px',
            }}>
              Ku'do Rental is a premium car rental service based in Albania. We started with a simple idea —
              make renting a car as easy and trustworthy as borrowing one from a friend.
            </p>
          </div>

          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
          }}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px', fontWeight: 300,
              color: '#999', lineHeight: 1.85,
              marginBottom: '20px',
            }}>
              Whether you're visiting Albania for the first time, heading on a road trip along the Riviera,
              or just need reliable wheels for a few days — we have the right car for you.
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px', fontWeight: 300,
              color: '#999', lineHeight: 1.85,
            }}>
              All rentals are confirmed personally via WhatsApp. You pay in cash on pickup — no online
              payment, no credit card required, no surprises.
            </p>
          </div>
        </div>

        {/* Values grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
          gap: '1px',
          background: '#1e1e1e',
          border: '1px solid #1e1e1e',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          {VALUES.map((v, i) => (
            <div key={v.title} style={{
              background: '#111',
              padding: 'clamp(24px, 3vw, 36px)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ease ${i * 0.1 + 0.2}s, transform 0.6s ease ${i * 0.1 + 0.2}s`,
            }}>
              <div style={{ marginBottom: '16px' }}>{v.icon}</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '20px', fontWeight: 500,
                color: '#f0f0f0', marginBottom: '10px',
              }}>{v.title}</h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px', fontWeight: 300,
                color: '#999', lineHeight: 1.8,
              }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
