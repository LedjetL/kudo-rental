import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cars } from '../data/cars'

const ADMIN_PASSWORD = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_ADMIN_PASSWORD || 'kudo-admin'

const STORAGE_KEY = 'kudo_availability'

function loadOverrides(): Record<string, { available: boolean; bookedUntil: string }> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function saveOverrides(overrides: Record<string, { available: boolean; bookedUntil: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function getAvailabilityOverrides() {
  return loadOverrides()
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [overrides, setOverrides] = useState(loadOverrides)
  const [saved, setSaved] = useState(false)

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setWrongPassword(true)
      setTimeout(() => setWrongPassword(false), 2000)
    }
  }

  const setAvailable = (carId: string, available: boolean) => {
    const updated = {
      ...overrides,
      [carId]: { available, bookedUntil: overrides[carId]?.bookedUntil || '' },
    }
    setOverrides(updated)
    saveOverrides(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const setBookedUntil = (carId: string, date: string) => {
    const updated = {
      ...overrides,
      [carId]: { ...overrides[carId], available: false, bookedUntil: date },
    }
    setOverrides(updated)
    saveOverrides(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const clearOverride = (carId: string) => {
    const updated = { ...overrides }
    delete updated[carId]
    setOverrides(updated)
    saveOverrides(updated)
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%', maxWidth: '360px',
          background: '#111', border: '1px solid #2a2a2a',
          borderRadius: '6px', padding: '40px 32px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '12px',
          }}>Ku'do Rental</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '28px', fontWeight: 400,
            color: '#f5f5f5', marginBottom: '32px',
          }}>Admin Panel</h1>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            style={{
              width: '100%', padding: '12px 16px',
              background: '#161616',
              border: `1px solid ${wrongPassword ? '#c0392b' : '#2a2a2a'}`,
              borderRadius: '2px', color: '#f5f5f5',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px', marginBottom: '12px',
              outline: 'none', transition: 'border-color 0.2s',
            }}
          />

          {wrongPassword && (
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', color: '#e74c3c', marginBottom: '12px',
            }}>Incorrect password</p>
          )}

          <button
            onClick={login}
            style={{
              width: '100%', padding: '12px',
              background: '#c0392b', border: 'none', borderRadius: '2px',
              color: '#fff', fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '16px', background: 'none', border: 'none',
              color: '#555', fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', cursor: 'pointer', letterSpacing: '1px',
            }}
          >
            ← Back to site
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '0' }}>
      {/* Header */}
      <div style={{
        background: '#111', borderBottom: '1px solid #2a2a2a',
        padding: '20px clamp(20px, 4vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: '#c0392b', marginBottom: '4px',
          }}>Ku'do Rental</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '26px', fontWeight: 400, color: '#f5f5f5',
          }}>Fleet Availability</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saved && (
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', color: '#27ae60', letterSpacing: '1px',
            }}>✓ Saved</span>
          )}
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 18px',
              background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '2px',
              color: '#888', fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            ← Site
          </button>
          <button
            onClick={() => setAuthed(false)}
            style={{
              padding: '8px 18px',
              background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '2px',
              color: '#888', fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Notice */}
      <div style={{
        background: 'rgba(192,57,43,0.06)', borderBottom: '1px solid rgba(192,57,43,0.15)',
        padding: '12px clamp(20px, 4vw, 40px)',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '11px', color: '#c8c8c8', lineHeight: 1.6,
      }}>
        ⚠️ Changes are saved on <strong>this device only</strong>. To update availability for all customers, edit{' '}
        <code style={{ color: '#c0392b', background: 'rgba(192,57,43,0.1)', padding: '1px 6px', borderRadius: '2px' }}>
          src/data/cars.ts
        </code>{' '}and deploy.
      </div>

      {/* Cars */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px clamp(20px, 4vw, 40px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cars.map(car => {
            const override = overrides[car.id]
            const isAvailable = override ? override.available : car.available
            const bookedUntil = override?.bookedUntil || car.bookedUntil || ''
            const hasOverride = !!override

            return (
              <div key={car.id} style={{
                background: '#111', border: '1px solid #2a2a2a', borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr',
                  gap: '0',
                }}>
                  {/* Car image */}
                  <div style={{
                    background: '#161616',
                    borderRight: '1px solid #222',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: '100px',
                  }}>
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100px', objectFit: 'contain',
                        filter: isAvailable ? 'none' : 'grayscale(60%) brightness(0.6)',
                      }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '20px', fontWeight: 600, color: '#f5f5f5', marginBottom: '2px',
                        }}>
                          {car.name} {car.year}{car.color ? ` · ${car.color}` : ''}
                        </h3>
                        <p style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '11px', color: '#666', letterSpacing: '1px',
                        }}>
                          {car.category} · €{car.pricePerDay}/day
                        </p>
                      </div>

                      {/* Toggle */}
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => setAvailable(car.id, true)}
                          style={{
                            padding: '7px 16px', borderRadius: '2px',
                            border: `1px solid ${isAvailable ? '#27ae60' : '#2a2a2a'}`,
                            background: isAvailable ? 'rgba(39,174,96,0.15)' : 'transparent',
                            color: isAvailable ? '#27ae60' : '#555',
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '10px', fontWeight: 600,
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          Available
                        </button>
                        <button
                          onClick={() => setAvailable(car.id, false)}
                          style={{
                            padding: '7px 16px', borderRadius: '2px',
                            border: `1px solid ${!isAvailable ? '#c0392b' : '#2a2a2a'}`,
                            background: !isAvailable ? 'rgba(192,57,43,0.15)' : 'transparent',
                            color: !isAvailable ? '#c0392b' : '#555',
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '10px', fontWeight: 600,
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          Booked
                        </button>
                      </div>
                    </div>

                    {/* Booked until date */}
                    {!isAvailable && (
                      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <label style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '10px', fontWeight: 600,
                          letterSpacing: '1.5px', textTransform: 'uppercase', color: '#888',
                          whiteSpace: 'nowrap',
                        }}>
                          Available from
                        </label>
                        <input
                          type="date"
                          value={bookedUntil}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setBookedUntil(car.id, e.target.value)}
                          style={{
                            padding: '7px 12px',
                            background: '#161616', border: '1px solid #2a2a2a', borderRadius: '2px',
                            color: '#f5f5f5', fontFamily: "'Montserrat', sans-serif",
                            fontSize: '12px', colorScheme: 'dark', outline: 'none',
                          }}
                        />
                        {bookedUntil && (
                          <span style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '11px', color: '#c0392b',
                          }}>
                            Booked until {new Date(bookedUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Override indicator */}
                    {hasOverride && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '10px', color: '#555', letterSpacing: '0.5px',
                        }}>
                          Overriding default value
                        </span>
                        <button
                          onClick={() => clearOverride(car.id)}
                          style={{
                            background: 'none', border: 'none',
                            color: '#555', fontFamily: "'Montserrat', sans-serif",
                            fontSize: '10px', cursor: 'pointer', textDecoration: 'underline',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Reset to default
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
