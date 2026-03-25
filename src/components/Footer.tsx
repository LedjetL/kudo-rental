const WHATSAPP = 'https://wa.me/355685216312'

export default function Footer() {
  return (
    <footer id="contact" style={{
      background: '#0a0a0a',
      borderTop: '1px solid #2a2a2a',
      padding: '80px 40px 40px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(32px, 5vw, 60px)',
          marginBottom: '60px',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              fontWeight: 600,
              color: '#f5f5f5',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Ku'do <span style={{ color: '#c0392b' }}>Rental</span>
            </div>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              fontWeight: 300,
              color: '#888888',
              lineHeight: 1.8,
              maxWidth: '260px',
            }}>
              Premium car rentals in Albania. Drive in comfort and style with our handpicked fleet.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#c8c8c8',
              marginBottom: '20px',
            }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Browse Fleet', href: '#fleet' },
                { label: 'Book Now', href: '#fleet' },
                { label: 'Contact', href: '#contact' },
              ].map(link => (
                <a key={link.label} href={link.href} style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px',
                  fontWeight: 300,
                  color: '#888888',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888888')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#c8c8c8',
              marginBottom: '20px',
            }}>Get In Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px',
                  border: '1px solid #25D366',
                  borderRadius: '2px',
                  color: '#25D366',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  width: 'fit-content',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(37,211,102,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
              <a
                href="tel:+355685216312"
                style={{ fontSize: '13px', fontWeight: 300, color: '#888888', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888888')}
              >
                +355 68 521 6312
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #2a2a2a',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{ fontSize: '12px', color: '#555', fontWeight: 300 }}>
            © {new Date().getFullYear()} Ku'do Rental. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: '#555', fontWeight: 300 }}>
            Albania
          </p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
