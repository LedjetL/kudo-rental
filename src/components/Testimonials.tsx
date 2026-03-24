import { useEffect, useRef, useState } from 'react'

const reviews = [
  {
    name: 'Arjan Hoxha',
    location: 'Tirana, Albania',
    rating: 5,
    text: 'Exceptional service from start to finish. The Audi A7 was immaculate — drove it for a week and it was a pleasure every single day. Will definitely be coming back.',
    car: 'Audi A7 2013',
  },
  {
    name: 'Melissa K.',
    location: 'Durrës, Albania',
    rating: 5,
    text: 'Booked the Volvo XC90 for a family road trip. Spacious, comfortable, and the team was super responsive on WhatsApp. Highly recommended for families!',
    car: 'Volvo XC90',
  },
  {
    name: 'Erion Dema',
    location: 'Vlorë, Albania',
    rating: 5,
    text: 'Got the Jetta for a week. Great value for money, clean car, smooth process. Ku\'do Rental is my go-to from now on.',
    car: 'VW Jetta 2013',
  },
  {
    name: 'Sofia M.',
    location: 'Shkodër, Albania',
    rating: 5,
    text: 'The booking process was incredibly simple. Everything was transparent — no hidden fees, exactly as advertised. The car was in perfect condition.',
    car: 'VW Jetta 2013',
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
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

export default function Testimonials() {
  const { ref, inView } = useInView()

  return (
    <section
      id="reviews"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        background: '#0a0a0a',
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '4px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '16px',
          }}>Reviews</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 400, color: '#f5f5f5', lineHeight: 1.1,
          }}>
            What Our Clients Say
          </h2>
        </div>

        {/* Reviews grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '20px',
        }}>
          {reviews.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} inView={inView} />
          ))}
        </div>

        {/* Overall rating */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.7s ease 0.5s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
            {[1,2,3,4,5].map(s => (
              <StarIcon key={s} filled />
            ))}
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px', color: '#c8c8c8', fontStyle: 'italic',
          }}>
            5.0 — Rated excellent by all our customers
          </p>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review, index, inView }: {
  review: typeof reviews[0]
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#181818' : '#141414',
        border: `1px solid ${hovered ? '#333' : '#222'}`,
        borderRadius: '4px',
        padding: '28px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, background 0.2s, border 0.2s`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <StarIcon key={i} filled />
        ))}
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '17px',
        fontWeight: 400,
        color: '#c8c8c8',
        lineHeight: 1.7,
        fontStyle: 'italic',
        flex: 1,
      }}>
        "{review.text}"
      </p>

      {/* Car */}
      <div style={{
        padding: '6px 12px',
        background: 'rgba(192,57,43,0.08)',
        border: '1px solid rgba(192,57,43,0.2)',
        borderRadius: '2px',
        width: 'fit-content',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: '#c0392b',
      }}>
        {review.car}
      </div>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px', borderTop: '1px solid #222' }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2a2a2a, #333)',
          border: '1px solid #333',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '16px', color: '#888', flexShrink: 0,
        }}>
          {review.name.charAt(0)}
        </div>
        <div>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px', fontWeight: 500, color: '#f5f5f5',
          }}>{review.name}</div>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 300, color: '#888',
          }}>{review.location}</div>
        </div>
      </div>
    </div>
  )
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#c0392b' : 'none'} stroke={filled ? 'none' : '#555'} strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}
