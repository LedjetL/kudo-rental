import { useEffect, useState, useRef } from 'react'

function useCountUp(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

function StatCounter({ value, prefix = '', suffix = '', label }: {
  value: number
  prefix?: string
  suffix?: string
  label: string
  inView: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  const count = useCountUp(value, inView)

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 600,
        color: '#f5f5f5',
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {prefix}{value <= 1 ? (inView ? value : 0) : count}{suffix}
      </div>
      <div style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#888888',
      }}>{label}</div>
    </div>
  )
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = '/hero.jpg'
    img.onload = () => setLoaded(true)
    img.onerror = () => { setImgError(true); setLoaded(true) }
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      {!imgError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 85%',
          transform: 'scale(1.05)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
          filter: 'brightness(0.35)',
        }} />
      )}

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.85) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.5) 100%)',
      }} />

      {/* Red accent line */}
      <div style={{
        position: 'absolute',
        bottom: '35%',
        left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(192,57,43,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '100px clamp(20px, 5vw, 40px) 0',
        maxWidth: '900px',
        width: '100%',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <img
            src="/logo.png"
            alt="Ku'do Rental"
            style={{
              height: 'clamp(60px, 10vw, 90px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 24px rgba(192,57,43,0.3))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px', fontWeight: 500,
          letterSpacing: '4px', textTransform: 'uppercase',
          color: '#c0392b', marginBottom: '20px',
        }}>
          Premium Car Rentals — Albania
        </p>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(44px, 8vw, 96px)',
          fontWeight: 400,
          lineHeight: 1.05,
          color: '#f5f5f5',
          letterSpacing: '-1px',
          marginBottom: '24px',
          textShadow: '0 2px 40px rgba(0,0,0,0.8)',
        }}>
          Drive in<br />
          <em style={{ color: '#d4d4d4', fontStyle: 'italic' }}>Absolute</em> Comfort
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 300,
          color: '#aaaaaa', letterSpacing: '0.5px',
          maxWidth: '440px', margin: '0 auto 44px', lineHeight: 1.8,
        }}>
          Choose from our handpicked fleet of premium vehicles.
          Simple booking, transparent pricing, exceptional service.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#fleet" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px clamp(24px, 4vw, 36px)',
            background: '#c0392b', color: '#f5f5f5',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase',
            border: '1px solid #c0392b', borderRadius: '2px',
            boxShadow: '0 4px 24px rgba(192,57,43,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#e74c3c'
            e.currentTarget.style.boxShadow = '0 4px 32px rgba(192,57,43,0.55)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#c0392b'
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(192,57,43,0.35)'
          }}
          >
            Browse Fleet →
          </a>
          <a href="#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px clamp(24px, 4vw, 36px)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            color: '#c8c8c8',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', fontWeight: 500,
            letterSpacing: '2px', textTransform: 'uppercase',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
          >
            Contact Us
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: 'clamp(24px, 6vw, 60px)',
          justifyContent: 'center',
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap',
        }}>
          <StatCounter value={4} label="Vehicles" inView={loaded} />
          <StatCounter value={35} prefix="€" label="From / Day" inView={loaded} />
          <StatCounter value={24} suffix="/7" label="Support" inView={loaded} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '36px',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '8px',
        color: '#555', fontSize: '10px',
        letterSpacing: '2px', textTransform: 'uppercase',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 1s ease 1s',
        animation: 'fadeUpDown 2.5s ease-in-out infinite',
      }}>
        <span style={{ color: '#555' }}>Scroll</span>
        <div style={{
          width: '1px', height: '36px',
          background: 'linear-gradient(to bottom, rgba(192,57,43,0.6), transparent)',
        }} />
      </div>

      <style>{`
        @keyframes fadeUpDown {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
