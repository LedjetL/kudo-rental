import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cars as staticCars, type Car, type Booking } from '../data/cars'
import { useInView } from '../hooks/useInView'

const AVAILABILITY_URL =
  'https://raw.githubusercontent.com/LedjetL/kudo-rental/main/public/availability.json'

function applyOverrides(overrides: Record<string, { bookings?: Booking[] }>): Car[] {
  return staticCars.map(car => {
    const o = overrides[car.id]
    if (!o) return car
    return { ...car, bookings: o.bookings || [] }
  })
}

function getActiveBooking(car: Car, pickup: string, dropoff: string): Booking | null {
  const bookings = car.bookings || []
  if (bookings.length === 0) return null
  const today = new Date().toISOString().split('T')[0]
  const from = pickup || today
  const until = dropoff || today
  return bookings.find(b => b.from <= until && b.until >= from) || null
}

type Category = 'All' | 'Sedan' | 'Premium' | 'SUV'

const CATEGORY_COLORS: Record<string, string> = {
  Sedan: '#4a90d9',
  Premium: '#c0392b',
  SUV: '#27ae60',
}

function formatBookedUntil(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function WAIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function Fleet() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [cars, setCars] = useState<Car[]>(staticCars)
  const navigate = useNavigate()
  const { ref: sectionRef, inView } = useInView()

  useEffect(() => {
    fetch(`${AVAILABILITY_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then(overrides => {
        if (Object.keys(overrides).length > 0) setCars(applyOverrides(overrides))
      })
      .catch(() => {})
  }, [])

  const filtered = activeCategory === 'All' ? cars : cars.filter((c: Car) => c.category === activeCategory)

  const pickup = sessionStorage.getItem('kudo_pickup') || ''
  const dropoff = sessionStorage.getItem('kudo_dropoff') || ''

  return (
    <section id="fleet" ref={sectionRef} style={{
      background: '#0c0c0c',
      padding: 'clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div>
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
            }}>Choose Your Vehicle</h2>
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['All', 'Sedan', 'Premium', 'SUV'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 18px',
                  border: `1px solid ${activeCategory === cat ? '#c0392b' : '#2a2a2a'}`,
                  borderRadius: '2px',
                  background: activeCategory === cat ? '#c0392b' : 'transparent',
                  color: activeCategory === cat ? '#f5f5f5' : '#888888',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px', fontWeight: 500,
                  letterSpacing: '2px', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Cars list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              inView={inView}
              onBook={() => navigate(`/book/${car.id}`)}
              pickup={pickup}
              dropoff={dropoff}
            />
          ))}
        </div>
      </div>

      <style>{`
        .car-card { display: grid; grid-template-columns: 320px 1fr 220px; }
        .car-card-image { height: 100%; min-height: 240px; }
        .car-card-divider { border-left: 1px solid #222; }
        @media (max-width: 900px) {
          .car-card { grid-template-columns: 260px 1fr; }
          .car-card-price-panel { display: none !important; }
          .car-card-details { border-right: none !important; }
          .car-card-mobile-cta { display: flex !important; }
        }
        @media (max-width: 620px) {
          .car-card { grid-template-columns: 1fr; }
          .car-card-image { min-height: 220px; height: 220px; }
        }
      `}</style>
    </section>
  )
}

function CarCard({ car, index, inView, onBook, pickup, dropoff }: {
  car: Car; index: number; inView: boolean; onBook: () => unknown
  pickup: string; dropoff: string
}) {
  const [hovered, setHovered] = useState(false)
  const activeBooking = getActiveBooking(car, pickup, dropoff)
  const isUnavailable = !car.available || !!activeBooking
  const catColor = CATEGORY_COLORS[car.category]

  const waMsg = encodeURIComponent(`Hi! I'm interested in the ${car.name} (${car.year}). Is it available?`)

  return (
    <div
      className="car-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#161616',
        border: `1px solid ${hovered && !isUnavailable ? '#333' : '#222'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: hovered && !isUnavailable ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: inView ? `${index * 0.08}s` : '0s',
      }}
    >
      {/* Image */}
      <div className="car-card-image" style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1a1a1a, #222)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={car.image}
          alt={`${car.name} ${car.year}${car.color ? ` ${car.color}` : ''}`}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center',
            transition: 'transform 0.4s ease',
            transform: hovered && !isUnavailable ? 'scale(1.05)' : 'scale(1)',
            filter: isUnavailable ? 'grayscale(60%) brightness(0.55)' : 'none',
            cursor: 'default',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          padding: '4px 10px',
          background: catColor + '22',
          border: `1px solid ${catColor}66`,
          borderRadius: '2px',
          color: catColor,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
        }}>{car.category}</div>


        {/* Badge */}
        {car.badge && !isUnavailable && (
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

        {/* Unavailable overlay */}
        {isUnavailable && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.55)', gap: '6px',
          }}>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
              color: '#f5f5f5', background: 'rgba(0,0,0,0.75)', padding: '6px 16px', borderRadius: '2px',
            }}>Currently Booked</div>
            {activeBooking && (
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', color: '#c8c8c8', background: 'rgba(0,0,0,0.75)',
                padding: '4px 12px', borderRadius: '2px',
              }}>
                Available {formatBookedUntil(activeBooking.until)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="car-card-details" style={{
        padding: 'clamp(20px, 3vw, 28px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0',
        borderRight: '1px solid #222',
      }}>
        {/* Name + year */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600,
          color: '#f5f5f5', lineHeight: 1, marginBottom: '4px',
        }}>{car.name}</h3>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px', color: '#666', letterSpacing: '1px', marginBottom: '18px',
        }}>
          {car.year}{car.color ? ` · ${car.color}` : ''}
        </p>

        {/* Specs */}
        <div style={{
          display: 'flex', gap: '18px', flexWrap: 'wrap',
          paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #1e1e1e',
        }}>
          {[
            { icon: '👥', label: `${car.seats} seats` },
            { icon: '⚙️', label: car.transmission },
            { icon: '⛽', label: car.fuel },
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
          {car.features.slice(0, 4).map(f => (
            <span key={f} style={{
              padding: '3px 9px',
              background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#888', fontWeight: 300,
            }}>{f}</span>
          ))}
          {car.features.length > 4 && (
            <span style={{
              padding: '3px 9px',
              background: '#1c1c1c', border: '1px solid #222', borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#555', fontWeight: 300,
            }}>+{car.features.length - 4} more</span>
          )}
        </div>

        {/* Mobile CTA (hidden on desktop, shown on tablet/mobile when price panel is hidden) */}
        <div className="car-card-mobile-cta" style={{
          display: 'none', flexDirection: 'column', gap: '8px', marginTop: '20px',
          paddingTop: '20px', borderTop: '1px solid #1e1e1e',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '32px', fontWeight: 600, color: '#f5f5f5', lineHeight: 1,
            }}>€{car.pricePerDay}</span>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px',
            }}>/day</span>
          </div>
          {!isUnavailable ? (
            <>
              <button onClick={onBook} style={bookBtnStyle}>Book Now</button>
              <a
                href={`https://wa.me/355685216312?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                style={waBtnStyle}
              ><WAIcon /> Ask on WhatsApp</a>
            </>
          ) : (
            <div style={unavailableStyle}>
              {activeBooking ? `Available ${formatBookedUntil(activeBooking.until)}` : 'Unavailable'}
            </div>
          )}
        </div>
      </div>

      {/* Price panel (desktop only) */}
      <div className="car-card-price-panel" style={{
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '12px',
        background: hovered && !isUnavailable ? '#181818' : '#161616',
        transition: 'background 0.3s',
        minWidth: 0,
      }}>
        {!isUnavailable ? (
          <>
            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                color: '#666', marginBottom: '6px',
              }}>From</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '44px', fontWeight: 600, color: '#f5f5f5',
                lineHeight: 1,
              }}>€{car.pricePerDay}</div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#888', marginTop: '4px',
              }}>per day</div>
            </div>

            <div style={{ width: '100%', height: '1px', background: '#222', margin: '4px 0' }} />

            {/* Book Now */}
            <button onClick={onBook} style={{ ...bookBtnStyle, width: '100%' }}>
              Book Now
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/355685216312?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              style={{ ...waBtnStyle, width: '100%', justifyContent: 'center' }}
            >
              <WAIcon /> Ask on WhatsApp
            </a>

            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#555', textAlign: 'center',
              lineHeight: 1.6,
            }}>No deposit · Pay on pickup</p>
          </>
        ) : (
          <div style={unavailableStyle}>
            {activeBooking ? `Available\n${formatBookedUntil(activeBooking.until)}` : 'Unavailable'}
          </div>
        )}
      </div>
    </div>
  )
}

const bookBtnStyle: React.CSSProperties = {
  padding: '12px 16px',
  background: '#c0392b',
  border: '1px solid #c0392b',
  borderRadius: '2px',
  color: '#f5f5f5',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '11px', fontWeight: 600,
  letterSpacing: '2px', textTransform: 'uppercase',
  cursor: 'pointer', transition: 'background 0.2s',
  textAlign: 'center' as const,
}

const waBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '7px',
  padding: '10px 16px',
  background: 'transparent',
  border: '1px solid rgba(37,211,102,0.3)',
  borderRadius: '2px',
  color: '#25D366',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '11px', fontWeight: 500,
  letterSpacing: '1px', textTransform: 'uppercase',
  transition: 'border-color 0.2s',
  textDecoration: 'none',
}

const unavailableStyle: React.CSSProperties = {
  width: '100%', padding: '12px',
  background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px',
  color: '#555',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '11px', fontWeight: 500,
  letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center',
  whiteSpace: 'pre-line',
}
