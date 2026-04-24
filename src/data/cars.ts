export interface Booking {
  from: string  // ISO date e.g. '2026-04-20'
  until: string // ISO date e.g. '2026-04-30'
}

export interface Car {
  id: string
  name: string
  year: number
  color?: string
  badge?: string
  category: 'Sedan' | 'Premium' | 'SUV'
  pricePerDay: number        // base rate (1-2 days)
  pricePerDayLong?: number   // rate for 5+ days
  minDays?: number           // minimum rental period
  seats: number
  transmission: string
  fuel: string
  features: string[]
  image: string
  available: boolean
  bookings?: Booking[]
}

export function getEffectiveRate(car: Car, days: number): number {
  if (days >= 5 && car.pricePerDayLong) return car.pricePerDayLong
  return car.pricePerDay
}

export const cars: Car[] = [
  {
    id: 'jetta-1',
    name: 'VW Jetta',
    year: 2014,
    color: 'Brown',
    badge: 'Best Value',
    category: 'Sedan',
    pricePerDay: 40,
    pricePerDayLong: 35,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['Air Conditioning', 'Panoramic Roof', 'Bluetooth', 'USB Charging', 'Cruise Control'],
    image: '/cars/jetta-brown.jpg',
    available: true,
  },
  {
    id: 'jetta-2',
    name: 'VW Jetta',
    year: 2013,
    color: 'Black',
    category: 'Sedan',
    pricePerDay: 40,
    pricePerDayLong: 35,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['Air Conditioning', 'Panoramic Roof', 'Bluetooth', 'USB Charging', 'Cruise Control'],
    image: '/cars/jetta-black.jpg',
    available: true,
  },
  {
    id: 'passat-cc',
    name: 'VW Passat CC',
    year: 2010,
    color: 'Silver',
    category: 'Sedan',
    pricePerDay: 45,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['Air Conditioning', 'Bluetooth', 'USB Charging', 'Cruise Control'],
    image: '/cars/passat-cc.jpg',
    available: true,
  },
  {
    id: 'audi-a7',
    name: 'Audi A7',
    year: 2013,
    badge: 'Most Popular',
    category: 'Premium',
    pricePerDay: 100,
    pricePerDayLong: 70,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['Leather Seats', 'Panoramic Roof', 'Navigation', 'Premium Sound', 'Heated Seats'],
    image: '/cars/audi-a7.jpg',
    available: true,
  },
  {
    id: 'volvo-xc90',
    name: 'Volvo XC90',
    year: 2004,
    badge: 'Family Choice',
    category: 'SUV',
    pricePerDay: 90,
    pricePerDayLong: 70,
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    features: ['7 Seats', 'All-Wheel Drive', 'Air Conditioning', 'Panoramic Roof', 'Navigation', 'Roof Rails'],
    image: '/cars/volvo-xc90.jpg',
    available: true,
  },
]

export const extras = [
  { id: 'insurance', label: 'Full Insurance', pricePerDay: 10, icon: '🛡️' },
  { id: 'gps', label: 'GPS Navigation', pricePerDay: 5, icon: '🗺️' },
  { id: 'child-seat', label: 'Child Seat', pricePerDay: 5, icon: '👶' },
  { id: 'driver', label: 'Professional Driver', pricePerDay: 40, icon: '🧑‍✈️' },
]