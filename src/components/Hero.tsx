export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
    }}>
      {/* Background gradient orb */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(192,57,43,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Thin horizontal line accents */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(192,57,43,0.3), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', padding: '80px 24px 0', maxWidth: '900px', width: '100%' }}>
        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#c0392b',
          marginBottom: '24px',
        }}>
          Premium Car Rentals — Albania
        </p>

        {/* Main heading */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 400,
          lineHeight: 1.05,
          color: '#f5f5f5',
          letterSpacing: '-1px',
          marginBottom: '28px',
        }}>
          Drive in<br />
          <em style={{ color: '#c8c8c8', fontStyle: 'italic' }}>Absolute</em> Comfort
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '15px',
          fontWeight: 300,
          color: '#888888',
          letterSpacing: '0.5px',
          maxWidth: '480px',
          margin: '0 auto 48px',
          lineHeight: 1.8,
        }}>
          Choose from our handpicked fleet of premium vehicles.
          Simple booking, transparent pricing, exceptional service.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#fleet" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 36px',
            background: '#c0392b',
            color: '#f5f5f5',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '1px solid #c0392b',
            borderRadius: '2px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e74c3c')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c0392b')}
          >
            Browse Fleet
            <span>→</span>
          </a>
          <a href="#contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 36px',
            background: 'transparent',
            color: '#c8c8c8',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '1px solid #2a2a2a',
            borderRadius: '2px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#c8c8c8')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
          >
            Contact Us
          </a>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          gap: 'clamp(24px, 6vw, 60px)',
          justifyContent: 'center',
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid #2a2a2a',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '4', label: 'Vehicles' },
            { value: '€35', label: 'From / Day' },
            { value: '24/7', label: 'Support' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '36px',
                fontWeight: 600,
                color: '#f5f5f5',
                lineHeight: 1,
                marginBottom: '6px',
              }}>{stat.value}</div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#888888',
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        color: '#444',
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        <span>Scroll</span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, #444, transparent)',
        }} />
      </div>
    </section>
  )
}
