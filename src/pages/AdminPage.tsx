import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cars } from '../data/cars'

const ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'kudo-admin'
const AVAILABILITY_URL = 'https://raw.githubusercontent.com/LedjetL/kudo-rental/main/public/availability.json'

type Booking = { from: string; until: string }
type Overrides = Record<string, { bookings: Booking[] }>

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading] = useState(false)
  const [newBooking, setNewBooking] = useState<Record<string, { from: string; until: string }>>({})

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

  const addBooking = (carId: string) => {
    const nb = newBooking[carId]
    if (!nb?.from || !nb?.until || nb.from >= nb.until) return
    const current = overrides[carId]?.bookings || []
    const updated = { ...overrides, [carId]: { bookings: [...current, { from: nb.from, until: nb.until }] } }
    setOverrides(updated)
    save(updated)
    setNewBooking(prev => ({ ...prev, [carId]: { from: '', until: '' } }))
  }

  const removeBooking = (carId: string, idx: number) => {
    const current = overrides[carId]?.bookings || []
    const bookings = current.filter((_, i) => i !== idx)
    const updated = { ...overrides }
    if (bookings.length === 0) {
      delete updated[carId]
    } else {
      updated[carId] = { bookings }
    }
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
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#27ae60' }}>✓ Saved — live in ~2 min</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cars.map(car => {
              const bookings = overrides[car.id]?.bookings || []
              const nb = newBooking[car.id] || { from: '', until: '' }

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
                        style={{ width: '100%', height: '100px', objectFit: 'contain' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ padding: '20px 24px' }}>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '20px', fontWeight: 600, color: '#f5f5f5', marginBottom: '2px',
                      }}>
                        {car.name} {car.year}{car.color ? ` · ${car.color}` : ''}
                      </h3>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>
                        {car.category} · €{car.pricePerDay}/day
                      </p>

                      {/* Existing bookings */}
                      {bookings.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                          {bookings.map((b, i) => (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '7px 12px',
                              background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)',
                              borderRadius: '2px',
                            }}>
                              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#c8c8c8' }}>
                                {fmt(b.from)} → {fmt(b.until)}
                              </span>
                              <button
                                onClick={() => removeBooking(car.id, i)}
                                disabled={status === 'saving'}
                                style={{
                                  background: 'none', border: 'none', color: '#c0392b',
                                  cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: '0 4px',
                                }}
                              >×</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#444', marginBottom: '14px' }}>
                          No bookings — available
                        </p>
                      )}

                      {/* Add booking */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#666' }}>Add booking</span>
                        <input
                          type="date"
                          value={nb.from}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setNewBooking(prev => ({ ...prev, [car.id]: { ...nb, from: e.target.value } }))}
                          style={dateInputStyle}
                        />
                        <span style={{ color: '#555', fontSize: '12px' }}>→</span>
                        <input
                          type="date"
                          value={nb.until}
                          min={nb.from || new Date().toISOString().split('T')[0]}
                          onChange={e => setNewBooking(prev => ({ ...prev, [car.id]: { ...nb, until: e.target.value } }))}
                          style={dateInputStyle}
                        />
                        <button
                          onClick={() => addBooking(car.id)}
                          disabled={!nb.from || !nb.until || nb.from >= nb.until || status === 'saving'}
                          style={{
                            padding: '7px 16px', background: nb.from && nb.until && nb.from < nb.until ? '#c0392b' : '#1e1e1e',
                            border: '1px solid #2a2a2a', borderRadius: '2px',
                            color: nb.from && nb.until && nb.from < nb.until ? '#fff' : '#444',
                            fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            cursor: nb.from && nb.until && nb.from < nb.until ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                          }}
                        >Add</button>
                      </div>
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

const dateInputStyle: React.CSSProperties = {
  padding: '7px 10px', background: '#161616',
  border: '1px solid #2a2a2a', borderRadius: '2px',
  color: '#f5f5f5', fontFamily: "'Montserrat', sans-serif",
  fontSize: '12px', colorScheme: 'dark', outline: 'none',
}
