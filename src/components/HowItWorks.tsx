import { useInView } from '../hooks/useInView'

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Choose a Vehicle',
    desc: 'Browse our fleet and pick the vehicle that fits your trip — from just €35/day. Filter by type: Sedan, Premium, or SUV.',
  },
  {
    num: '02',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
      </svg>
    ),
    title: 'Book in Minutes',
    desc: 'Pick your dates, choose add-ons like insurance or a GPS, and enter your info. The whole process takes under 2 minutes. No payment online.',
  },
  {
    num: '03',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Confirm & Drive',
    desc: "We'll confirm your booking on WhatsApp. Meet us at your pickup location, pay in cash, and you're ready to go.",
  },
]

const TRUST_BADGES = [
  { icon: '💳', label: 'No Deposit' },
  { icon: '✅', label: 'Pay on Pickup' },
  { icon: '📱', label: 'WhatsApp Confirmed' },
  { icon: '🔒', label: 'Your Info is Safe' },
]

export default function HowItWorks() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} id="how-it-works" style={{
      background: '#0d0d0d',
      padding: 'clamp(64px, 10vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '56px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '4px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '14px',
          }}>Simple Process</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 400, color: '#f5f5f5', lineHeight: 1.1,
          }}>
            Reserve in 3 Easy Steps
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px', fontWeight: 300,
            color: '#999', marginTop: '14px', lineHeight: 1.7,
          }}>
            No complicated forms, no hidden fees, no waiting.
          </p>
        </div>

        {/* Steps grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '1px',
          background: '#222',
          border: '1px solid #222',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              background: '#111',
              padding: 'clamp(28px, 4vw, 44px) clamp(24px, 3vw, 36px)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.65s ease ${i * 0.12}s, transform 0.65s ease ${i * 0.12}s`,
            }}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', fontWeight: 600,
                letterSpacing: '3px', textTransform: 'uppercase',
                color: '#c0392b', marginBottom: '20px', opacity: 0.8,
              }}>
                Step {step.num}
              </div>
              <div style={{ marginBottom: '18px' }}>{step.icon}</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px', fontWeight: 500,
                color: '#f0f0f0', marginBottom: '10px', lineHeight: 1.2,
              }}>{step.title}</h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px', fontWeight: 300,
                color: '#999', lineHeight: 1.85,
              }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(20px, 4vw, 48px)',
          marginTop: '48px',
          paddingTop: '40px',
          borderTop: '1px solid #1a1a1a',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.7s ease 0.4s',
        }}>
          {TRUST_BADGES.map(badge => (
            <div key={badge.label} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
            }}>
              <span style={{ fontSize: '15px' }}>{badge.icon}</span>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', fontWeight: 500,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#aaa',
              }}>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
