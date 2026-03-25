import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { cars, extras } from '../data/cars'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

// ── EmailJS config — replace with your real values from emailjs.com ──
const EMAILJS_SERVICE_ID  = 'service_tk7c47n'
const EMAILJS_TEMPLATE_OWNER = 'template_ow05166'
const EMAILJS_TEMPLATE_CUSTOMER = 'template_pc87v24'
const EMAILJS_PUBLIC_KEY  = 'D-6fVt3pOrVcecoEz'
const OWNER_EMAIL = 'araldb14@gmail.com'

type Step = 'dates' | 'details' | 'confirm' | 'done'

interface BookingForm {
  pickupDate: string
  dropoffDate: string
  pickupLocation: string
  dropoffLocation: string
  selectedExtras: string[]
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

const LOCATIONS = [
  'Tirana Airport (TIA)',
  'Tirana City Center',
  'Durrës',
  'Vlorë',
  'Shkodër',
]

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function getDays(from: string, to: string) {
  if (!from || !to) return 0
  const diff = new Date(to).getTime() - new Date(from).getTime()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function generateRef() {
  return 'KD-' + Math.random().toString(36).toUpperCase().slice(2, 8)
}

export default function BookingPage() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const car = cars.find(c => c.id === carId)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [step, setStep] = useState<Step>('dates')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({})
  const [bookingRef] = useState(generateRef())
  const [form, setForm] = useState<BookingForm>(() => {
    const ss = sessionStorage
    return {
      pickupDate: ss.getItem('kudo_pickup') || today,
      dropoffDate: ss.getItem('kudo_dropoff') || tomorrow,
      pickupLocation: ss.getItem('kudo_location') || LOCATIONS[0],
      dropoffLocation: ss.getItem('kudo_location') || LOCATIONS[0],
      selectedExtras: [],
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
    }
  })

  if (!car) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#888', marginBottom: '16px' }}>Car not found.</p>
          <button onClick={() => navigate('/')} style={backBtnStyle}>← Back to Fleet</button>
        </div>
      </div>
    )
  }

  const days = getDays(form.pickupDate, form.dropoffDate)
  const extrasTotal = form.selectedExtras.reduce((acc, id) => {
    const extra = extras.find(e => e.id === id)
    return acc + (extra ? extra.pricePerDay * days : 0)
  }, 0)
  const total = car.pricePerDay * days + extrasTotal

  const toggleExtra = (id: string) => {
    setForm(f => ({
      ...f,
      selectedExtras: f.selectedExtras.includes(id)
        ? f.selectedExtras.filter(e => e !== id)
        : [...f.selectedExtras, id],
    }))
  }

  const update = (field: keyof BookingForm, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  const validateDetails = () => {
    const newErrors: Partial<Record<keyof BookingForm, string>> = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Required'
    if (!form.lastName.trim()) newErrors.lastName = 'Required'
    if (!form.email.trim()) {
      newErrors.email = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Required'
    } else if (form.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Enter a valid phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const sendEmails = async () => {
    setIsSending(true)
    setSendError('')

    const extrasLabel = form.selectedExtras.length > 0
      ? form.selectedExtras.map(id => extras.find(e => e.id === id)?.label).join(', ')
      : 'None'

    const templateVars = {
      booking_ref: bookingRef,
      car_name: `${car!.name} ${car!.year}`,
      car_category: car!.category,
      car_image: `https://kudo-rental.vercel.app${car!.image}`,
      logo_url: `https://kudo-rental.vercel.app/logo.png`,
      pickup_date: formatDate(form.pickupDate),
      dropoff_date: formatDate(form.dropoffDate),
      pickup_location: form.pickupLocation,
      dropoff_location: form.dropoffLocation,
      duration: `${days} day${days !== 1 ? 's' : ''}`,
      extras: extrasLabel,
      total: `€${total}`,
      customer_name: `${form.firstName} ${form.lastName}`,
      customer_email: form.email,
      customer_phone: form.phone,
      notes: form.notes || 'None',
      owner_email: OWNER_EMAIL,
      reply_to: form.email,
      year: new Date().getFullYear().toString(),
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OWNER, templateVars, { publicKey: EMAILJS_PUBLIC_KEY })
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CUSTOMER, templateVars, { publicKey: EMAILJS_PUBLIC_KEY })
      setStep('done')
    } catch (err) {
      setSendError('Could not send email. Please confirm your booking on WhatsApp below.')
    } finally {
      setIsSending(false)
    }
  }

  const whatsappMsg = encodeURIComponent(
    `Hello! I just booked a ${car.name} ${car.year} via your website.\n\nRef: ${bookingRef}\nPickup: ${formatDate(form.pickupDate)} from ${form.pickupLocation}\nDrop-off: ${formatDate(form.dropoffDate)} at ${form.dropoffLocation}\nDuration: ${days} day${days !== 1 ? 's' : ''}\nTotal: €${total}\n\nName: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}`
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '72px' }}>
      {/* Header bar */}
      <div style={{
        background: '#111',
        borderBottom: '1px solid #2a2a2a',
        padding: '16px clamp(16px, 4vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate('/')} style={backBtnStyle}>
          ← Back
        </button>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '20px',
          color: '#f5f5f5',
        }}>
          Booking — {car.name} {car.year}
        </div>
        <div style={{ width: '60px' }} />
      </div>

      {/* Progress steps */}
      {step !== 'done' && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0',
          padding: '32px 40px',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {[
            { key: 'dates', label: 'Dates & Extras', num: 1 },
            { key: 'details', label: 'Your Details', num: 2 },
            { key: 'confirm', label: 'Review', num: 3 },
          ].map((s, i) => {
            const stepOrder: Step[] = ['dates', 'details', 'confirm']
            const current = stepOrder.indexOf(step)
            const thisStep = stepOrder.indexOf(s.key as Step)
            const done = thisStep < current
            const active = thisStep === current
            return (
              <div key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '50%',
                    left: '-50%',
                    height: '1px',
                    background: done ? '#c0392b' : '#2a2a2a',
                  }} />
                )}
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  border: `1px solid ${active ? '#c0392b' : done ? '#c0392b' : '#2a2a2a'}`,
                  background: done ? '#c0392b' : active ? 'rgba(192,57,43,0.15)' : '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 1,
                  marginBottom: '8px',
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: active || done ? '#f5f5f5' : '#555',
                  }}>
                    {done ? '✓' : s.num}
                  </span>
                </div>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  color: active ? '#f5f5f5' : done ? '#c0392b' : '#555',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px) 80px' }} className="booking-content">

        {/* Step 1: Dates & Extras */}
        {step === 'dates' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: '32px', alignItems: 'start' }}>
            <div>
              <SectionTitle>Rental Dates</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Field label="Pick-up Date">
                  <input
                    type="date"
                    value={form.pickupDate}
                    min={today}
                    onChange={e => update('pickupDate', e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Drop-off Date">
                  <input
                    type="date"
                    value={form.dropoffDate}
                    min={form.pickupDate || today}
                    onChange={e => update('dropoffDate', e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Pick-up Location">
                  <select value={form.pickupLocation} onChange={e => update('pickupLocation', e.target.value)} style={inputStyle}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Drop-off Location">
                  <select value={form.dropoffLocation} onChange={e => update('dropoffLocation', e.target.value)} style={inputStyle}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
              </div>

              {days < 1 && form.dropoffDate && form.pickupDate && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(192,57,43,0.07)',
                  border: '1px solid rgba(192,57,43,0.3)',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px',
                  color: '#e74c3c',
                }}>
                  Return date must be at least 1 day after pick-up date.
                </div>
              )}

              <SectionTitle>Optional Extras</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {extras.map(extra => {
                  const selected = form.selectedExtras.includes(extra.id)
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: selected ? 'rgba(192,57,43,0.08)' : '#161616',
                        border: `1px solid ${selected ? '#c0392b' : '#2a2a2a'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '18px' }}>{extra.icon}</span>
                        <div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#f5f5f5', fontWeight: 500 }}>
                            {extra.label}
                          </div>
                          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888' }}>
                            €{extra.pricePerDay} / day
                          </div>
                        </div>
                      </div>
                      <div style={{
                        width: '20px', height: '20px',
                        border: `1px solid ${selected ? '#c0392b' : '#3a3a3a'}`,
                        borderRadius: '50%',
                        background: selected ? '#c0392b' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {selected && <span style={{ color: '#fff', fontSize: '11px', lineHeight: 1 }}>✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary sidebar */}
            <PriceSidebar car={car} days={days} form={form} total={total}>
              <button
                onClick={() => setStep('details')}
                disabled={days < 1}
                style={{ ...primaryBtnStyle, opacity: days < 1 ? 0.5 : 1 }}
              >
                Continue →
              </button>
            </PriceSidebar>
          </div>
        )}

        {/* Step 2: Customer Details */}
        {step === 'details' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: '32px', alignItems: 'start' }}>
            <div>
              <SectionTitle>Your Information</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Field label="First Name" error={errors.firstName}>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => update('firstName', e.target.value)}
                    placeholder="John"
                    style={{ ...inputStyle, borderColor: errors.firstName ? '#c0392b' : undefined }}
                  />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => update('lastName', e.target.value)}
                    placeholder="Doe"
                    style={{ ...inputStyle, borderColor: errors.lastName ? '#c0392b' : undefined }}
                  />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Field label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="john@example.com"
                    style={{ ...inputStyle, borderColor: errors.email ? '#c0392b' : undefined }}
                  />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+355 ..."
                    style={{ ...inputStyle, borderColor: errors.phone ? '#c0392b' : undefined }}
                  />
                </Field>
              </div>
              <Field label="Notes (optional)">
                <textarea
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder="Any special requests or questions..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '96px' }}
                />
              </Field>

              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: '4px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                color: '#888',
                lineHeight: 1.7,
              }}>
                🔒 Your details are used only for your reservation and will not be shared with third parties.
              </div>
            </div>

            <PriceSidebar car={car} days={days} form={form} total={total}>
              <button
                onClick={() => { if (validateDetails()) setStep('confirm') }}
                style={primaryBtnStyle}
              >
                Review Booking →
              </button>
              <button onClick={() => setStep('dates')} style={secondaryBtnStyle}>
                ← Back
              </button>
            </PriceSidebar>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: '32px', alignItems: 'start' }}>
            <div>
              <SectionTitle>Review Your Booking</SectionTitle>

              {/* Booking details */}
              <div style={{
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '24px',
              }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>Vehicle</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#f5f5f5' }}>{car.name} {car.year}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #222' }}>
                  <ReviewRow label="Pick-up" value={`${formatDate(form.pickupDate)}\n${form.pickupLocation}`} />
                  <ReviewRow label="Drop-off" value={`${formatDate(form.dropoffDate)}\n${form.dropoffLocation}`} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #222' }}>
                  <ReviewRow label="Duration" value={`${days} day${days !== 1 ? 's' : ''}`} />
                  <ReviewRow label="Extras" value={form.selectedExtras.length > 0 ? form.selectedExtras.map(id => extras.find(e => e.id === id)?.label).join(', ') : 'None'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`} />
                  <ReviewRow label="Contact" value={`${form.email}\n${form.phone}`} />
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: 'rgba(192,57,43,0.06)',
                border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: '4px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                color: '#c8c8c8',
                lineHeight: 1.7,
                marginBottom: '8px',
              }}>
                💳 <strong>Pay on pickup</strong> — No payment required now. Full amount (€{total}) due when you collect the vehicle.
              </div>
            </div>

            <PriceSidebar car={car} days={days} form={form} total={total}>
              <button
                onClick={sendEmails}
                disabled={isSending}
                style={{ ...primaryBtnStyle, opacity: isSending ? 0.7 : 1 }}
              >
                {isSending ? 'Sending...' : 'Confirm Booking'}
              </button>
              {sendError && (
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#e74c3c', textAlign: 'center' }}>
                  {sendError}
                </p>
              )}
              <button onClick={() => setStep('details')} disabled={isSending} style={secondaryBtnStyle}>
                ← Back
              </button>
            </PriceSidebar>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto', paddingTop: '40px' }}>
            {/* Success icon */}
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'rgba(192,57,43,0.1)',
              border: '1px solid rgba(192,57,43,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '32px',
            }}>
              ✓
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '42px',
              fontWeight: 400,
              color: '#f5f5f5',
              marginBottom: '12px',
            }}>
              Booking Confirmed!
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', marginBottom: '32px', lineHeight: 1.7 }}>
              Your {car.name} {car.year} is reserved. We'll be in touch to confirm your booking details.
            </p>

            {/* Booking reference */}
            <div style={{
              padding: '20px 32px',
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              marginBottom: '32px',
              display: 'inline-block',
            }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>
                Booking Reference
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '32px',
                fontWeight: 600,
                color: '#c0392b',
                letterSpacing: '4px',
              }}>
                {bookingRef}
              </p>
            </div>

            {/* Summary */}
            <div style={{
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '32px',
              textAlign: 'left',
            }}>
              {[
                { label: 'Vehicle', value: `${car.name} ${car.year}` },
                { label: 'Pick-up', value: `${formatDate(form.pickupDate)} · ${form.pickupLocation}` },
                { label: 'Drop-off', value: `${formatDate(form.dropoffDate)} · ${form.dropoffLocation}` },
                { label: 'Duration', value: `${days} day${days !== 1 ? 's' : ''}` },
                { label: 'Total (due on pickup)', value: `€${total}` },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '8px 0',
                  borderBottom: '1px solid #1e1e1e',
                }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', letterSpacing: '0.5px' }}>{row.label}</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#f5f5f5', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp follow-up */}
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', marginBottom: '16px' }}>
              Send your booking reference on WhatsApp to confirm:
            </p>
            <a
              href={`https://wa.me/355685216312?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 32px',
                border: '1px solid #25D366',
                borderRadius: '2px',
                color: '#25D366',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '32px',
                transition: 'all 0.2s',
              }}
            >
              <WAIcon /> Confirm on WhatsApp
            </a>

            <div style={{ marginTop: '8px' }}>
              <button onClick={() => navigate('/')} style={secondaryBtnStyle}>
                ← Back to Fleet
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Mobile sticky price bar */}
      {step !== 'done' && (
        <div className="mobile-sticky-bar" style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 90,
          background: 'rgba(15,15,15,0.97)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #2a2a2a',
          padding: '12px clamp(16px, 4vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: '#666', marginBottom: '2px',
            }}>Total</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '26px', fontWeight: 600, color: '#f5f5f5', lineHeight: 1,
            }}>€{total}</div>
            <div style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#555', marginTop: '2px',
            }}>
              {days} day{days !== 1 ? 's' : ''} · pay on pickup
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            {step === 'dates' && (
              <button
                onClick={() => { if (days >= 1) setStep('details') }}
                disabled={days < 1}
                style={{ ...mobileStickyBtnStyle, opacity: days < 1 ? 0.45 : 1 }}
              >
                Continue →
              </button>
            )}
            {step === 'details' && (
              <button
                onClick={() => { if (validateDetails()) setStep('confirm') }}
                style={mobileStickyBtnStyle}
              >
                Review →
              </button>
            )}
            {step === 'confirm' && (
              <button
                onClick={sendEmails}
                disabled={isSending}
                style={{ ...mobileStickyBtnStyle, opacity: isSending ? 0.6 : 1 }}
              >
                {isSending ? 'Sending...' : 'Confirm'}
              </button>
            )}
          </div>
        </div>
      )}

      <FloatingWhatsApp />
      <style>{`
        .mobile-sticky-bar { display: none !important; }
        .booking-content { padding-bottom: 80px !important; }
        @media (max-width: 640px) {
          .mobile-sticky-bar { display: flex !important; }
          .booking-content { padding-bottom: 100px !important; }
        }
      `}</style>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '24px',
      fontWeight: 500,
      color: '#f5f5f5',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid #2a2a2a',
    }}>
      {children}
    </h3>
  )
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: error ? '#e74c3c' : '#999',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          color: '#e74c3c',
          marginTop: '2px',
        }}>
          {error}
        </span>
      )}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '16px 24px' }}>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#f5f5f5', fontWeight: 400, whiteSpace: 'pre-line' }}>
        {value}
      </p>
    </div>
  )
}

function PriceSidebar({
  car,
  days,
  form,
  total,
  children,
}: {
  car: ReturnType<typeof cars.find> & object
  days: number
  form: BookingForm
  total: number
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #2a2a2a',
      borderRadius: '4px',
      padding: '24px',
      position: 'sticky',
      top: '100px',
    }}>
      <div style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#888',
        marginBottom: '4px',
      }}>
        Price Summary
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '32px',
        fontWeight: 600,
        color: '#f5f5f5',
        marginBottom: '24px',
      }}>
        €{total}
      </div>

      {/* Line items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <SidebarRow label={`${car!.name} × ${days} day${days !== 1 ? 's' : ''}`} value={`€${car!.pricePerDay * days}`} />
        {form.selectedExtras.map(id => {
          const extra = extras.find(e => e.id === id)!
          return <SidebarRow key={id} label={`${extra.label} × ${days}d`} value={`€${extra.pricePerDay * days}`} />
        })}
        <div style={{ height: '1px', background: '#2a2a2a', margin: '4px 0' }} />
        <SidebarRow label="Total" value={`€${total}`} highlight />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>

      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '11px',
        color: '#555',
        textAlign: 'center',
        marginTop: '16px',
        lineHeight: 1.6,
      }}>
        Pay on pickup · No card required
      </p>
    </div>
  )
}

function SidebarRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '12px',
        color: highlight ? '#c8c8c8' : '#888',
        fontWeight: highlight ? 600 : 300,
      }}>{label}</span>
      <span style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: highlight ? '16px' : '13px',
        color: highlight ? '#f5f5f5' : '#c8c8c8',
        fontWeight: highlight ? 600 : 400,
      }}>{value}</span>
    </div>
  )
}

function WAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ─── Shared styles ─���────────────────────────────────────────────���──

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: '2px',
  color: '#f5f5f5',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '13px',
  fontWeight: 300,
  outline: 'none',
  colorScheme: 'dark',
}

const primaryBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#c0392b',
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
}

const secondaryBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: 'transparent',
  border: '1px solid #2a2a2a',
  borderRadius: '2px',
  color: '#888',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.2s',
}

const mobileStickyBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  background: '#c0392b',
  border: '1px solid #c0392b',
  borderRadius: '2px',
  color: '#f5f5f5',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
}

const backBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid #2a2a2a',
  borderRadius: '2px',
  color: '#888',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  cursor: 'pointer',
}
