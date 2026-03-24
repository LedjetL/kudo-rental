export interface Car {
  id: string
  name: string
  year: number
  category: 'Sedan' | 'Premium' | 'SUV'
  pricePerDay: number
  seats: number
  transmission: string
  fuel: string
  features: string[]
  image: string
  available: boolean
  bookedUntil?: string // ISO date string e.g. '2026-04-10'
}

export const cars: Car[] = [
  {
    id: 'jetta-1',
    name: 'VW Jetta',
    year: 2013,
    category: 'Sedan',
    pricePerDay: 35,
    seats: 5,
    transmission: 'Manual',
    fuel: 'Diesel',
    features: ['Air Conditioning', 'Panoramic Roof', 'Bluetooth', 'USB Charging', 'Cruise Control'],
    image: '/cars/jetta-brown.jpg',
    available: true,
  },
  {
    id: 'jetta-2',
    name: 'VW Jetta',
    year: 2013,
    category: 'Sedan',
    pricePerDay: 35,
    seats: 5,
    transmission: 'Manual',
    fuel: 'Diesel',
    features: ['Air Conditioning', 'Panoramic Roof', 'Bluetooth', 'USB Charging', 'Cruise Control'],
    image: '/cars/jetta-black.jpg',
    available: true,
  },
  {
    id: 'audi-a7',
    name: 'Audi A7',
    year: 2013,
    category: 'Premium',
    pricePerDay: 70,
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
    year: 2006,
    category: 'SUV',
    pricePerDay: 70,
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
