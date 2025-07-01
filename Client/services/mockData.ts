import { Flight, User, Booking } from '../types';

export const mockFlights: Flight[] = [
  {
    id: 'AA101',
    airline: 'American Airlines',
    flightNumber: 'AA 101',
    departure: {
      airport: 'John F. Kennedy International Airport',
      city: 'New York',
      code: 'JFK',
      time: '08:30',
      date: '2024-04-10'
    },
    arrival: {
      airport: 'Charles de Gaulle Airport',
      city: 'Paris',
      code: 'CDG',
      time: '21:45',
      date: '2024-04-10'
    },
    duration: '7h 15m',
    stops: 0,
    price: 2450,
    aircraft: 'Boeing 777-300ER',
    class: 'Business',
    availableSeats: 12
  },
  {
    id: 'BA207',
    airline: 'British Airways',
    flightNumber: 'BA 207',
    departure: {
      airport: 'John F. Kennedy International Airport',
      city: 'New York',
      code: 'JFK',
      time: '10:15',
      date: '2024-04-10'
    },
    arrival: {
      airport: 'Heathrow Airport',
      city: 'London',
      code: 'LHR',
      time: '21:30',
      date: '2024-04-10'
    },
    duration: '6h 45m',
    stops: 0,
    price: 1899,
    aircraft: 'Airbus A350-1000',
    class: 'Business',
    availableSeats: 8
  },
  {
    id: 'DL456',
    airline: 'Delta Air Lines',
    flightNumber: 'DL 456',
    departure: {
      airport: 'John F. Kennedy International Airport',
      city: 'New York',
      code: 'JFK',
      time: '14:20',
      date: '2024-04-10'
    },
    arrival: {
      airport: 'Charles de Gaulle Airport',
      city: 'Paris',
      code: 'CDG',
      time: '03:45',
      date: '2024-04-11'
    },
    duration: '7h 25m',
    stops: 0,
    price: 2199,
    aircraft: 'Airbus A330-900',
    class: 'Business',
    availableSeats: 15
  },
  {
    id: 'LH440',
    airline: 'Lufthansa',
    flightNumber: 'LH 440',
    departure: {
      airport: 'Newark Liberty International Airport',
      city: 'New York',
      code: 'EWR',
      time: '16:45',
      date: '2024-04-10'
    },
    arrival: {
      airport: 'Frankfurt Airport',
      city: 'Frankfurt',
      code: 'FRA',
      time: '06:30',
      date: '2024-04-11'
    },
    duration: '7h 45m',
    stops: 0,
    price: 2650,
    aircraft: 'Boeing 747-8',
    class: 'Business',
    availableSeats: 6
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john.doe',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    phone: '+1-555-0123',
    dateOfBirth: '1985-06-15',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@flightfinder.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1-555-0001',
    dateOfBirth: '1980-01-01',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    username: 'operator',
    email: 'operator@airline.com',
    firstName: 'Flight',
    lastName: 'Operator',
    role: 'operator',
    phone: '+1-555-0002',
    dateOfBirth: '1982-03-20',
    createdAt: '2024-01-10'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    userId: '1',
    flightId: 'AA101',
    bookingDate: '2024-03-15',
    status: 'confirmed',
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        dateOfBirth: '1985-06-15'
      }
    ],
    selectedSeats: ['1A'],
    totalAmount: 2450,
    paymentStatus: 'completed'
  }
];

export const cities = [
  { code: 'NYC', name: 'New York City', country: 'USA' },
  { code: 'PAR', name: 'Paris', country: 'France' },
  { code: 'LON', name: 'London', country: 'UK' },
  { code: 'TOK', name: 'Tokyo', country: 'Japan' },
  { code: 'SYD', name: 'Sydney', country: 'Australia' },
  { code: 'DXB', name: 'Dubai', country: 'UAE' },
  { code: 'LAX', name: 'Los Angeles', country: 'USA' },
  { code: 'BER', name: 'Berlin', country: 'Germany' },
  { code: 'ROM', name: 'Rome', country: 'Italy' },
  { code: 'BCN', name: 'Barcelona', country: 'Spain' }
];

export const airlines = [
  'American Airlines',
  'British Airways',
  'Delta Air Lines',
  'Lufthansa',
  'Emirates',
  'Qatar Airways',
  'Singapore Airlines',
  'Air France',
  'KLM',
  'United Airlines'
];