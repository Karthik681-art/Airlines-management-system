export interface SearchParams {
  departure: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'premium' | 'business' | 'first';
  tripType: 'oneWay' | 'roundTrip';
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    code: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    code: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: number;
  aircraft: string;
  class: string;
  availableSeats: number;
}

export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber?: string;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'operator';
  phone: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  passengers: BookingData[];
  selectedSeats: string[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface City {
  code: string;
  name: string;
  country: string;
}