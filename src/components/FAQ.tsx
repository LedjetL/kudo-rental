import { useState } from 'react'
import { useInView } from '../hooks/useInView'

const FAQS = [
  {
    q: 'Do I need to pay a deposit?',
    a: 'No deposit required. You pay the full amount in cash when you pick up the vehicle — nothing upfront.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Cash only, paid on pickup. No credit card, no online payment, no hidden fees.',
  },
  {
    q: 'Can I pick up the car at Tirana Airport?',
    a: 'Yes. Tirana Airport (TIA) is one of our main pickup locations. We meet you directly at the airport.',
  },
  {
    q: 'Do I need an international driver\'s license?',
    a: 'A valid EU or national driver\'s license is accepted. For non-EU visitors, an International Driving Permit (IDP) is recommended.',
  },
  {
    q: 'How is my booking confirmed?',
    a: 'After you submit your booking online, we confirm it personally via WhatsApp — usually within a few hours.',
  },
  {
    q: 'Can I take the car outside Albania?',
    a: 'Cross-border travel must be agreed in advance. Please mention it when booking or ask us on WhatsApp before your trip.',
  },
  {
    q: 'What if I need to cancel or change my booking?',
    a: 'Since there\'s no deposit, there\'s no penalty for cancelling. Just let us know on WhatsApp as soon as possible.',
  },
  {
    q: 'Is fuel included in the price?',
    a: 'No. The car is provided with a full tank and should be returned full. Fuel is not included in the daily rate.',
  },
]

export default function FAQ() {
  const { ref, inView } = useInView()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section ref={ref} id="faq" style={{
      background: '#0d0d0d',
      padding: 'clamp(64px, 10vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '52px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '4px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '14px',
          }}>Got Questions</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 400, color: '#f5f5f5', lineHeight: 1.1,
          }}>Frequently Asked</h2>
        </div>

        {/* Accordion */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '1px',
          background: '#1e1e1e',
          border: '1px solid #1e1e1e',
          borderRadius: '6px',
          overflow: 'hidden',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.7s ease 0.15s',
        }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ background: '#111' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'clamp(16px, 2.5vw, 22px) clamp(20px, 3vw, 28px)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                >
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 'clamp(13px, 1.8vw, 15px)',
                    fontWeight: 500,
                    color: isOpen ? '#f5f5f5' : '#c8c8c8',
                    lineHeight: 1.4,
                    transition: 'color 0.2s',
                  }}>{faq.q}</span>
                  <span style={{
                    flexShrink: 0,
                    width: '22px', height: '22px',
                    border: `1px solid ${isOpen ? '#c0392b' : '#333'}`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isOpen ? '#c0392b' : '#666',
                    fontSize: '14px',
                    transition: 'all 0.25s',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                  }}>+</span>
                </button>

                <div style={{
                  maxHeight: isOpen ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px', fontWeight: 300,
                    color: '#999', lineHeight: 1.8,
                    padding: '0 clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 22px)',
                  }}>{faq.a}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Still have questions CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.7s ease 0.3s',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px', color: '#666', marginBottom: '16px',
          }}>Still have a question?</p>
          <a
            href="https://wa.me/355685216312?text=Hi%2C%20I%20have%20a%20question%20about%20renting%20a%20car."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px',
              border: '1px solid rgba(37,211,102,0.35)',
              borderRadius: '2px',
              color: '#25D366',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px', fontWeight: 500,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#25D366')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.35)')}
          >
            <WAIcon /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function WAIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
