import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cars } from '../data/cars'

const ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'kudo-admin'
const AVAILABILITY_URL = 'https://raw.githubusercontent.com/LedjetL/kudo-rental/main/public/availability.json'

type Overrides = Record<string, { available: boolean; bookedUntil?: string }>

export default function AdminPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  // Load current availability from GitHub when admin logs in
  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch(`${AVAILABILITY_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => setOverrides(data || {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [authed])

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setWrongPassword(true)
      setTimeout(() => setWrongPassword(false), 2000)
    }
  }

  const save = async (updated: Overrides) => {
    setStatus('saving')
    try {
      const res = await fetch('/api/update-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: updated, password }),
      })
      if (!res.ok) throw new Error()
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const setAvailable = (carId: string, available: boolean) => {
    const updated = {
      ...overrides,
      [carId]: { available, bookedUntil: overrides[carId]?.bookedUntil || '' },
    }
    setOverrides(updated)
    save(updated)
  }

  const setBookedUntil = (carId: string, date: string) => {
    const updated = {
      ...overrides,
      [carId]: { available: false, bookedUntil: date },
    }
    setOverrides(updated)
    save(updated)
  }

  const clearOverride = (carId: string) => {
    const updated = { ...overrides }
    delete updated[carId]
    setOverrides(updated)
    save(updated)
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}>
        <div style={{
          width: '100%', maxWidth: '360px',
          background: '#111', border: '1px solid #2a2a2a',
          borderRadius: '6px', padding: '40px 32px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c0392b', marginBottom: '12px',
          }}>Ku'do Rental</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '28px', fontWeight: 400, color: '#f5f5f5', marginBottom: '32px',
          }}>Admin Panel</h1>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%', padding: '12px 16px',
              background: '#161616',
              border: `1px solid ${wrongPassword ? '#c0392b' : '#2a2a2a'}`,
              borderRadius: '2px', color: '#f5f5f5',
              fontFamily: "'Montserrat', sans-serif", fontSize: '13px',
              marginBottom: '12px', outline: 'none', transition: 'border-color 0.2s',
            }}
          />

          {wrongPassword && (
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#e74c3c', marginBottom: '12px' }}>
              Incorrect password
            </p>
          )}

          <button onClick={login} style={{
            width: '100%', padding: '12px', background: '#c0392b',
            border: 'none', borderRadius: '2px', color: '#fff',
            fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            Sign In
          </button>

          <button onClick={() => navigate('/')} style={{
            marginTop: '16px', background: 'none', border: 'none',
            color: '#555', fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', cursor: 'pointer', letterSpacing: '1px',
          }}>
            ← Back to site
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Header */}
      <div style={{
        background: '#111', borderBottom: '1px solid #2a2a2a',
        padding: '20px clamp(20px, 4vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c0392b', marginBottom: '4px',
          }}>Ku'do Rental</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 400, color: '#f5f5f5' }}>
            Fleet Availability
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {status === 'saving' && (
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888' }}>Saving...</span>
          )}
          {status === 'saved' && (
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#27ae60' }}>✓ Saved — deploying in ~2 min</span>
          )}
          {status === 'error' && (
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#e74c3c' }}>✗ Save failed — check GITHUB_TOKEN</span>
          )}
          <button onClick={() => navigate('/')} style={{
            padding: '8px 18px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '2px',
            color: '#888', fontFamily: "'Montserrat', sans-serif", fontSize: '11px',
            letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
          }}>← Site</button>
          <button onClick={() => setAuthed(false)} style={{
            padding: '8px 18px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '2px',
            color: '#888', fontFamily: "'Montserrat', sans-serif", fontSize: '11px',
            letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
          }}>Log Out</button>
        </div>
      </div>

      {/* Cars */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px clamp(20px, 4vw, 40px)' }}>
        {loading ? (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#555', textAlign: 'center', marginTop: '60px' }}>
            Loading current availability...
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cars.map(car => {
              const override = overrides[car.id]
              const isAvailable = override !== undefined ? override.available : car.available
              const bookedUntil = override?.bookedUntil || car.bookedUntil || ''

              return (
                <div key={car.id} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                    {/* Image */}
                    <div style={{
                      background: '#161616', borderRight: '1px solid #222',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px',
                    }}>
                      <img
                        src={car.image} alt={car.name} loading="lazy"
                        style={{
                          width: '100%', height: '100px', objectFit: 'contain',
                          filter: isAvailable ? 'none' : 'grayscale(60%) brightness(0.6)',
                        }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <h3 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '20px', fontWeight: 600, color: '#f5f5f5', marginBottom: '2px',
                          }}>
                            {car.name} {car.year}{car.color ? ` · ${car.color}` : ''}
                          </h3>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#666', letterSpacing: '1px' }}>
                            {car.category} · €{car.pricePerDay}/day
                          </p>
                        </div>

                        {/* Toggles */}
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={() => setAvailable(car.id, true)}
                            disabled={status === 'saving'}
                            style={{
                              padding: '7px 16px', borderRadius: '2px',
                              border: `1px solid ${isAvailable ? '#27ae60' : '#2a2a2a'}`,
                              background: isAvailable ? 'rgba(39,174,96,0.15)' : 'transparent',
                              color: isAvailable ? '#27ae60' : '#555',
                              fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
                              letterSpacing: '1.5px', textTransform: 'uppercase',
                              cursor: status === 'saving' ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                            }}
                          >Available</button>
                          <button
                            onClick={() => setAvailable(car.id, false)}
                            disabled={status === 'saving'}
                            style={{
                              padding: '7px 16px', borderRadius: '2px',
                              border: `1px solid ${!isAvailable ? '#c0392b' : '#2a2a2a'}`,
                              background: !isAvailable ? 'rgba(192,57,43,0.15)' : 'transparent',
                              color: !isAvailable ? '#c0392b' : '#555',
                              fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
                              letterSpacing: '1.5px', textTransform: 'uppercase',
                              cursor: status === 'saving' ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                            }}
                          >Booked</button>
                        </div>
                      </div>

                      {/* Booked until */}
                      {!isAvailable && (
                        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <label style={{
                            fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
                            letterSpacing: '1.5px', textTransform: 'uppercase', color: '#888', whiteSpace: 'nowrap',
                          }}>Available from</label>
                          <input
                            type="date"
                            value={bookedUntil}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setBookedUntil(car.id, e.target.value)}
                            style={{
                              padding: '7px 12px', background: '#161616',
                              border: '1px solid #2a2a2a', borderRadius: '2px',
                              color: '#f5f5f5', fontFamily: "'Montserrat', sans-serif",
                              fontSize: '12px', colorScheme: 'dark', outline: 'none',
                            }}
                          />
                          {bookedUntil && (
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#c0392b' }}>
                              Until {new Date(bookedUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Clear override */}
                      {override !== undefined && (
                        <button
                          onClick={() => clearOverride(car.id)}
                          style={{
                            marginTop: '10px', background: 'none', border: 'none',
                            color: '#555', fontFamily: "'Montserrat', sans-serif",
                            fontSize: '10px', cursor: 'pointer', textDecoration: 'underline',
                          }}
                        >Reset to default</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
