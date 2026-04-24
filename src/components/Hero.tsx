import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

const LOCATIONS = [
  'Tirana Airport (TIA)',
  'Kudo Rental Office',
  'Durrës',
  'Vlorë',
]


function StatCounter({ value, prefix = '', suffix = '', label }: {
  value: number; prefix?: string; suffix?: string; label: string; inView?: boolean
}) {
  const { ref, inView } = useInView(0.5)
  const count = useCountUp(value, inView)
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 600,
        color: '#f5f5f5', lineHeight: 1, marginBottom: '6px',
      }}>
        {prefix}{value <= 1 ? (inView ? value : 0) : count}{suffix}
      </div>
      <div style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888888',
      }}>{label}</div>
    </div>
  )
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const [wPickupLocation, setWPickupLocation] = useState(LOCATIONS[0])
  const [wDropoffLocation, setWDropoffLocation] = useState(LOCATIONS[0])
  const [differentDropoff, setDifferentDropoff] = useState(false)
  const [wPickup, setWPickup] = useState(today)
  const [wDropoff, setWDropoff] = useState(tomorrow)

  useEffect(() => {
    const img = new Image()
    img.src = '/hero.jpg'
    img.onload = () => setLoaded(true)
    img.onerror = () => { setImgError(true); setLoaded(true) }
  }, [])

  const handleSearch = () => {
    sessionStorage.setItem('kudo_pickup', wPickup)
    sessionStorage.setItem('kudo_dropoff', wDropoff)
    sessionStorage.setItem('kudo_pickup_location', wPickupLocation)
    sessionStorage.setItem('kudo_dropoff_location', differentDropoff ? wDropoffLocation : wPickupLocation)
    window.dispatchEvent(new CustomEvent('kudoDatesChanged'))
    document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      {!imgError && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 85%',
          transform: 'scale(1.05)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
          filter: 'brightness(0.45)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.1) 45%, rgba(10,10,10,0.92) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.45) 100%)',
      }} />

      {/* Main content — flex 1 to push widget to bottom */}
      <div style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(100px, 14vw, 140px) clamp(20px, 5vw, 40px) 40px',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="Ku'do Rental"
            style={{
              height: 'clamp(56px, 9vw, 84px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 24px rgba(192,57,43,0.3))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px', fontWeight: 500,
          letterSpacing: '4px', textTransform: 'uppercase',
          color: '#c0392b', marginBottom: '18px',
        }}>
          Premium Car Rentals — Albania
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(44px, 8vw, 96px)',
          fontWeight: 400, lineHeight: 1.05,
          color: '#f5f5f5', letterSpacing: '-1px',
          marginBottom: '20px',
          textShadow: '0 2px 40px rgba(0,0,0,0.8)',
        }}>
          Drive in<br />
          <em style={{ color: '#d4d4d4', fontStyle: 'italic' }}>Absolute</em> Comfort
        </h1>

        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 300,
          color: '#aaaaaa', letterSpacing: '0.5px',
          maxWidth: '420px', margin: '0 auto 40px', lineHeight: 1.8,
        }}>
          Handpicked fleet, transparent pricing, no deposit.
          Confirmed personally via WhatsApp.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: 'clamp(24px, 6vw, 60px)',
          justifyContent: 'center',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap',
        }}>
          <StatCounter value={5} label="Vehicles" inView={loaded} />
          <StatCounter value={35} prefix="€" label="From / Day" inView={loaded} />
          <StatCounter value={24} suffix="/7" label="Support" inView={loaded} />
        </div>
      </div>

      {/* ── Booking Search Widget ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '0 clamp(16px, 4vw, 40px)',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 1s ease 0.6s',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(10,10,10,0.94)',
            backdropFilter: 'blur(24px)',
            borderTop: '2px solid #c0392b',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '4px 4px 0 0',
            padding: 'clamp(16px, 3vw, 24px) clamp(16px, 3vw, 28px)',
          }}>
            {/* Widget label */}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', fontWeight: 600,
              letterSpacing: '2.5px', textTransform: 'uppercase',
              color: '#c0392b', marginBottom: '14px',
            }}>Quick Reservation</p>

            {/* Different drop-off toggle */}
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer', marginBottom: '12px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', color: '#888', userSelect: 'none',
            }}>
              <span style={{
                width: '16px', height: '16px', flexShrink: 0,
                border: `1px solid ${differentDropoff ? '#c0392b' : '#3a3a3a'}`,
                borderRadius: '2px',
                background: differentDropoff ? '#c0392b' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {differentDropoff && <span style={{ color: '#fff', fontSize: '10px', lineHeight: 1 }}>✓</span>}
              </span>
              <input
                type="checkbox"
                checked={differentDropoff}
                onChange={e => setDifferentDropoff(e.target.checked)}
                style={{ display: 'none' }}
              />
              Return to a different location
            </label>

            <div className="hero-widget-grid" style={{ display: 'grid', gap: '10px', alignItems: 'end' }}>
              {/* Pickup Location */}
              <div>
                <label style={widgetLabelStyle}>Pick-up Location</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '13px', pointerEvents: 'none',
                  }}>📍</span>
                  <select
                    value={wPickupLocation}
                    onChange={e => setWPickupLocation(e.target.value)}
                    style={{ ...widgetInputStyle, paddingLeft: '34px' }}
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Drop-off Location — only shown when different drop-off is checked */}
              {differentDropoff && (
                <div>
                  <label style={widgetLabelStyle}>Drop-off Location</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '13px', pointerEvents: 'none',
                    }}>🏁</span>
                    <select
                      value={wDropoffLocation}
                      onChange={e => setWDropoffLocation(e.target.value)}
                      style={{ ...widgetInputStyle, paddingLeft: '34px' }}
                    >
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Pickup Date */}
              <div>
                <label style={widgetLabelStyle}>Pick-up Date</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '13px', pointerEvents: 'none',
                  }}>📅</span>
                  <input
                    type="date"
                    value={wPickup}
                    min={today}
                    onChange={e => {
                      setWPickup(e.target.value)
                      if (e.target.value >= wDropoff) {
                        const next = new Date(new Date(e.target.value).getTime() + 86400000).toISOString().split('T')[0]
                        setWDropoff(next)
                      }
                    }}
                    style={{ ...widgetInputStyle, paddingLeft: '34px', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Return Date */}
              <div>
                <label style={widgetLabelStyle}>Return Date</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '13px', pointerEvents: 'none',
                  }}>📅</span>
                  <input
                    type="date"
                    value={wDropoff}
                    min={new Date(new Date(wPickup).getTime() + 86400000).toISOString().split('T')[0]}
                    onChange={e => setWDropoff(e.target.value)}
                    style={{ ...widgetInputStyle, paddingLeft: '34px', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSearch}
                style={{
                  padding: '12px 20px',
                  background: '#c0392b',
                  border: '1px solid #c0392b',
                  borderRadius: '2px',
                  color: '#f5f5f5',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px', fontWeight: 600,
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                  height: '44px',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e74c3c')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c0392b')}
              >
                Show Cars →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-widget-grid {
          grid-template-columns: 1.4fr 1fr 1fr auto;
        }
        @media (max-width: 700px) {
          .hero-widget-grid {
            grid-template-columns: 1fr 1fr;
          }
          .hero-widget-grid > *:first-child {
            grid-column: 1 / -1;
          }
          .hero-widget-grid > button {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 420px) {
          .hero-widget-grid {
            grid-template-columns: 1fr;
          }
          .hero-widget-grid > * {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </section>
  )
}

const widgetLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '9px', fontWeight: 600,
  letterSpacing: '1.5px', textTransform: 'uppercase',
  color: '#888', marginBottom: '6px',
}

const widgetInputStyle: React.CSSProperties = {
  width: '100%',
  height: '44px',
  padding: '0 12px',
  background: '#181818',
  border: '1px solid #2e2e2e',
  borderRadius: '2px',
  color: '#f5f5f5',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '13px', fontWeight: 300,
  outline: 'none',
}
