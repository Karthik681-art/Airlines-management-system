import { Booking, BookingData, Flight } from '../types';
import { mockBookings } from './mockData';
import { AuthService } from './authService';

export class BookingService {
  private static instance: BookingService;

  private constructor() {}

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async createBooking(
    flight: Flight,
    bookingData: BookingData,
    selectedSeats: string[],
    totalAmount: number
  ): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const currentUser = AuthService.getInstance().getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const newBooking: Booking = {
      id: `BK${Date.now()}`,
      userId: currentUser.id,
      flightId: flight.id,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      passengers: [bookingData],
      selectedSeats,
      totalAmount,
      paymentStatus: 'completed'
    };

    mockBookings.push(newBooking);
    return newBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings.filter(booking => booking.userId === userId);
  }

  async getAllBookings(): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockBookings];
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return false;
    
    mockBookings[bookingIndex].status = 'cancelled';
    return true;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings.find(booking => booking.id === id) || null;
  }
}