import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WHATSAPP = 'https://wa.me/355685216312'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 40px)',
        height: '68px',
        background: scrolled || menuOpen ? 'rgba(10,10,10,0.97)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid #2a2a2a' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 101 }}>
          <img
            src="/logo.png"
            alt="Ku'do Rental"
            style={{ height: '34px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px',
            fontWeight: 600,
            color: '#f5f5f5',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Ku'do <span style={{ color: '#c0392b' }}>Rental</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <a href="/#fleet" style={navLinkStyle}>Fleet</a>
          <a href="/#about" style={navLinkStyle}>About</a>
          <a href="/#faq" style={navLinkStyle}>FAQ</a>
          <a href="/#contact" style={navLinkStyle}>Contact</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={whatsappBtnStyle}>
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="hamburger"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 101,
          }}
          aria-label="Toggle menu"
        >
          <span style={{ ...barStyle, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...barStyle, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...barStyle, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div style={{
        position: 'fixed',
        top: '68px', left: 0, right: 0, bottom: 0,
        zIndex: 99,
        background: 'rgba(10,10,10,0.98)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '36px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {[
          { label: 'Fleet', href: '/#fleet' },
          { label: 'About', href: '/#about' },
          { label: 'FAQ', href: '/#faq' },
          { label: 'Contact', href: '/#contact' },
        ].map(link => (
          <a key={link.label} href={link.href} onClick={closeMenu} style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '36px',
            fontWeight: 400,
            color: '#f5f5f5',
            letterSpacing: '2px',
            transition: 'color 0.2s',
          }}>
            {link.label}
          </a>
        ))}
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 28px',
            border: '1px solid #25D366',
            borderRadius: '2px',
            color: '#25D366',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: '8px',
          }}
        >
          <WhatsAppIcon /> WhatsApp
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#c8c8c8',
}

const whatsappBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '8px 18px',
  border: '1px solid #25D366',
  borderRadius: '2px',
  color: '#25D366',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
}

const barStyle: React.CSSProperties = {
  display: 'block',
  width: '24px',
  height: '1.5px',
  background: '#f5f5f5',
  transition: 'all 0.3s ease',
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
