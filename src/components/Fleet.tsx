import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { cars, type Car } from '../data/cars'

type Category = 'All' | 'Sedan' | 'Premium' | 'SUV'

const CATEGORY_COLORS: Record<string, string> = {
  Sedan: '#4a90d9',
  Premium: '#c0392b',
  SUV: '#27ae60',
}

function formatBookedUntil(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

export default function Fleet() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const navigate = useNavigate()
  const { ref: sectionRef, inView } = useInView()

  const filtered = activeCategory === 'All'
    ? cars
    : cars.filter(c => c.category === activeCategory)

  return (
    <section id="fleet" ref={sectionRef} style={{
      background: '#0f0f0f',
      padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '4px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '16px',
          }}>Our Fleet</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 400, color: '#f5f5f5', lineHeight: 1.1, marginBottom: '16px',
          }}>Choose Your Ride</h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px', fontWeight: 300, color: '#888888',
            maxWidth: '400px', margin: '0 auto',
          }}>
            Every vehicle is maintained to the highest standard.
            Flexible daily rates, transparent pricing.
          </p>
        </div>

        {/* Category filters */}
        <div style={{
          display: 'flex', gap: '8px', justifyContent: 'center',
          marginBottom: '40px', flexWrap: 'wrap',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.7s ease 0.15s',
        }}>
          {(['All', 'Sedan', 'Premium', 'SUV'] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 22px',
                border: `1px solid ${activeCategory === cat ? '#c0392b' : '#2a2a2a'}`,
                borderRadius: '2px',
                background: activeCategory === cat ? '#c0392b' : 'transparent',
                color: activeCategory === cat ? '#f5f5f5' : '#888888',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', fontWeight: 500,
                letterSpacing: '2px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cars grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
          gap: '24px',
        }}>
          {filtered.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              inView={inView}
              onBook={() => navigate(`/book/${car.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CarCard({ car, index, inView, onBook }: {
  car: Car
  index: number
  inView: boolean
  onBook: () => unknown
}) {
  const [hovered, setHovered] = useState(false)
  const isUnavailable = !car.available || (car.bookedUntil && new Date(car.bookedUntil) > new Date())

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#161616',
        border: `1px solid ${hovered && !isUnavailable ? '#3a3a3a' : '#2a2a2a'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        transform: inView
          ? (hovered && !isUnavailable ? 'translateY(-4px)' : 'translateY(0)')
          : 'translateY(40px)',
        opacity: inView ? 1 : 0,
        boxShadow: hovered && !isUnavailable ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
        display: 'flex', flexDirection: 'column',
        transitionDelay: inView ? `${index * 0.1}s` : '0s',
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative', height: '260px',
        background: 'linear-gradient(135deg, #1a1a1a, #222)',
        overflow: 'hidden',
      }}>
        <img
          src={car.image}
          alt={`${car.name} ${car.year}`}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center',
            transition: 'transform 0.4s ease',
            transform: hovered && !isUnavailable ? 'scale(1.04)' : 'scale(1)',
            filter: isUnavailable ? 'grayscale(60%) brightness(0.6)' : 'none',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {/* Fallback */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '80px', opacity: 0.1,
        }}>🚗</div>

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          padding: '4px 10px',
          background: CATEGORY_COLORS[car.category] + '22',
          border: `1px solid ${CATEGORY_COLORS[car.category]}66`,
          borderRadius: '2px',
          color: CATEGORY_COLORS[car.category],
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '10px', fontWeight: 600,
          letterSpacing: '2px', textTransform: 'uppercase',
        }}>
          {car.category}
        </div>

        {/* Price badge */}
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #2a2a2a',
          borderRadius: '2px', padding: '6px 12px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px', fontWeight: 600, color: '#f5f5f5', lineHeight: 1,
          }}>€{car.pricePerDay}</div>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '9px', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase',
          }}>/ day</div>
        </div>

        {/* Unavailable overlay */}
        {isUnavailable && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            gap: '6px',
          }}>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase',
              color: '#f5f5f5', background: 'rgba(0,0,0,0.7)',
              padding: '6px 16px', borderRadius: '2px',
            }}>Currently Booked</div>
            {car.bookedUntil && new Date(car.bookedUntil) > new Date() && (
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', fontWeight: 400,
                color: '#c8c8c8', background: 'rgba(0,0,0,0.7)',
                padding: '4px 12px', borderRadius: '2px',
              }}>
                Available from {formatBookedUntil(car.bookedUntil)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card content */}
      <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '26px', fontWeight: 600, color: '#f5f5f5', marginBottom: '2px',
        }}>{car.name}</h3>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px', color: '#888888', letterSpacing: '1px', marginBottom: '18px',
        }}>{car.year}</p>

        {/* Specs */}
        <div style={{
          display: 'flex', gap: '16px', flexWrap: 'wrap',
          marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #222',
        }}>
          {[
            { icon: '👥', label: `${car.seats} seats` },
            { icon: '⚙️', label: car.transmission },
            { icon: '⛽', label: car.fuel },
          ].map(spec => (
            <div key={spec.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px' }}>{spec.icon}</span>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', color: '#888888', fontWeight: 300,
              }}>{spec.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px',
          marginBottom: '20px', flex: 1,
        }}>
          {car.features.slice(0, 3).map(f => (
            <span key={f} style={{
              padding: '3px 9px',
              background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#888888', fontWeight: 300,
            }}>{f}</span>
          ))}
          {car.features.length > 3 && (
            <span style={{
              padding: '3px 9px',
              background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#555', fontWeight: 300,
            }}>+{car.features.length - 3} more</span>
          )}
        </div>

        {/* CTA */}
        {!isUnavailable ? (
          <button onClick={onBook} style={{
            width: '100%', padding: '13px',
            background: hovered ? '#c0392b' : 'transparent',
            border: '1px solid #c0392b', borderRadius: '2px',
            color: '#f5f5f5',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Book Now
          </button>
        ) : (
          <div style={{
            width: '100%', padding: '13px',
            background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px',
            color: '#555',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center',
          }}>
            {car.bookedUntil && new Date(car.bookedUntil) > new Date()
              ? `Available ${formatBookedUntil(car.bookedUntil)}`
              : 'Unavailable'}
          </div>
        )}
      </div>
    </div>
  )
}
