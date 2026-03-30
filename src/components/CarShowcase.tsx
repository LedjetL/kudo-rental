import { cars } from '../data/cars'
import { useInView } from '../hooks/useInView'

export default function CarShowcase() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} style={{
      background: '#0a0a0a',
      padding: 'clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{
          marginBottom: '48px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '4px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '10px',
          }}>Our Fleet</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 400, color: '#f5f5f5', lineHeight: 1.1,
          }}>Every Vehicle, in Detail</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(480px, 100%), 1fr))',
          gap: '24px',
        }}>
          {cars.map((car, i) => (
            <div
              key={car.id}
              style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: '4px',
                overflow: 'hidden',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              {/* Car image */}
              <div style={{
                background: 'linear-gradient(135deg, #161616, #1e1e1e)',
                height: '220px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img
                  src={car.image}
                  alt={`${car.name} ${car.year}${car.color ? ` ${car.color}` : ''}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                {car.badge && (
                  <div style={{
                    position: 'absolute', top: '14px', right: '14px',
                    padding: '4px 10px',
                    background: 'rgba(192,57,43,0.9)',
                    borderRadius: '2px',
                    color: '#fff',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>{car.badge}</div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '26px', fontWeight: 600, color: '#f5f5f5', lineHeight: 1, marginBottom: '4px',
                    }}>{car.name}</h3>
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '11px', color: '#666', letterSpacing: '1px',
                    }}>{car.year}{car.color ? ` · ${car.color}` : ''} · {car.category}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '28px', fontWeight: 600, color: '#f5f5f5', lineHeight: 1,
                    }}>€{car.pricePerDayLong ?? car.pricePerDay}</div>
                    <div style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase',
                    }}>{car.pricePerDayLong ? '3+ days' : 'per day'}</div>
                  </div>
                </div>

                {/* Specs row */}
                <div style={{
                  display: 'flex', gap: '18px', flexWrap: 'wrap',
                  paddingBottom: '16px', marginBottom: '16px',
                  borderBottom: '1px solid #1e1e1e',
                }}>
                  {[
                    { icon: '👥', label: `${car.seats} seats` },
                    { icon: '⚙️', label: car.transmission },
                    { icon: '⛽', label: car.fuel },
                    ...(car.minDays ? [{ icon: '📅', label: `${car.minDays} days min` }] : []),
                  ].map(spec => (
                    <div key={spec.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px' }}>{spec.icon}</span>
                      <span style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '11px', color: '#888', fontWeight: 300,
                      }}>{spec.label}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {car.features.map(f => (
                    <span key={f} style={{
                      padding: '3px 9px',
                      background: '#161616', border: '1px solid #2a2a2a', borderRadius: '2px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '10px', color: '#888', fontWeight: 300,
                    }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
