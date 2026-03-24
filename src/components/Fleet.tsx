import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cars, type Car } from '../data/cars'

type Category = 'All' | 'Sedan' | 'Premium' | 'SUV'

const CATEGORY_COLORS: Record<string, string> = {
  Sedan: '#4a90d9',
  Premium: '#c0392b',
  SUV: '#27ae60',
}

export default function Fleet() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const navigate = useNavigate()

  const filtered = activeCategory === 'All'
    ? cars
    : cars.filter(c => c.category === activeCategory)

  return (
    <section id="fleet" style={{
      background: '#0f0f0f',
      padding: '120px 40px',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#c0392b',
            marginBottom: '16px',
          }}>Our Fleet</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 400,
            color: '#f5f5f5',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}>
            Choose Your Ride
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            fontWeight: 300,
            color: '#888888',
            maxWidth: '400px',
            margin: '0 auto',
          }}>
            Every vehicle is maintained to the highest standard.
            Flexible daily rates, transparent pricing.
          </p>
        </div>

        {/* Category filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '48px',
        }}>
          {(['All', 'Sedan', 'Premium', 'SUV'] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 24px',
                border: `1px solid ${activeCategory === cat ? '#c0392b' : '#2a2a2a'}`,
                borderRadius: '2px',
                background: activeCategory === cat ? '#c0392b' : 'transparent',
                color: activeCategory === cat ? '#f5f5f5' : '#888888',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cars grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {filtered.map(car => (
            <CarCard key={car.id} car={car} onBook={() => navigate(`/book/${car.id}`)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CarCard({ car, onBook }: { car: Car; onBook: () => unknown }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#161616',
        border: `1px solid ${hovered ? '#3a3a3a' : '#2a2a2a'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image placeholder / car image */}
      <div style={{
        position: 'relative',
        height: '220px',
        background: 'linear-gradient(135deg, #1a1a1a, #222)',
        overflow: 'hidden',
      }}>
        <img
          src={car.image}
          alt={`${car.name} ${car.year}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
        {/* Fallback car silhouette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px',
          opacity: 0.15,
        }}>
          🚗
        </div>

        {/* Category badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '4px 10px',
          background: CATEGORY_COLORS[car.category] + '22',
          border: `1px solid ${CATEGORY_COLORS[car.category]}66`,
          borderRadius: '2px',
          color: CATEGORY_COLORS[car.category],
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          {car.category}
        </div>

        {/* Price badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #2a2a2a',
          borderRadius: '2px',
          padding: '6px 12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: 600,
            color: '#f5f5f5',
            lineHeight: 1,
          }}>€{car.pricePerDay}</div>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '9px',
            color: '#888888',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>/ day</div>
        </div>
      </div>

      {/* Card content */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '26px',
          fontWeight: 600,
          color: '#f5f5f5',
          marginBottom: '4px',
        }}>
          {car.name}
        </h3>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px',
          color: '#888888',
          letterSpacing: '1px',
          marginBottom: '20px',
        }}>
          {car.year}
        </p>

        {/* Specs row */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid #222',
        }}>
          {[
            { icon: '👥', label: `${car.seats} seats` },
            { icon: '⚙️', label: car.transmission },
            { icon: '⛽', label: car.fuel },
          ].map(spec => (
            <div key={spec.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px' }}>{spec.icon}</span>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px',
                color: '#888888',
                fontWeight: 300,
              }}>{spec.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '24px',
          flex: 1,
        }}>
          {car.features.slice(0, 3).map(feature => (
            <span key={feature} style={{
              padding: '3px 10px',
              background: '#1e1e1e',
              border: '1px solid #2a2a2a',
              borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px',
              color: '#888888',
              fontWeight: 300,
              letterSpacing: '0.5px',
            }}>
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span style={{
              padding: '3px 10px',
              background: '#1e1e1e',
              border: '1px solid #2a2a2a',
              borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px',
              color: '#555',
              fontWeight: 300,
            }}>
              +{car.features.length - 3} more
            </span>
          )}
        </div>

        {/* Book button */}
        {car.available ? (
          <button
            onClick={onBook}
            style={{
              width: '100%',
              padding: '13px',
              background: hovered ? '#c0392b' : 'transparent',
              border: '1px solid #c0392b',
              borderRadius: '2px',
              color: '#f5f5f5',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Book Now
          </button>
        ) : (
          <div style={{
            width: '100%',
            padding: '13px',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '2px',
            color: '#555',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            Unavailable
          </div>
        )}
      </div>
    </div>
  )
}
