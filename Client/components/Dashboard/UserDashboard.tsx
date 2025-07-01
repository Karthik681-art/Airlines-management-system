import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Clock, Star, X, AlertTriangle } from 'lucide-react';
import { Booking, User, Flight } from '../../types';
import { BookingService } from '../../services/bookingService';
import { FlightService } from '../../services/flightService';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [flights, setFlights] = useState<{ [key: string]: Flight }>({});
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const bookingService = BookingService.getInstance();
        const flightService = FlightService.getInstance();
        
        const userBookings = await bookingService.getUserBookings(user.id);
        setBookings(userBookings);

        // Load flight details for each booking
        const flightDetails: { [key: string]: Flight } = {};
        for (const booking of userBookings) {
          const flight = await flightService.getFlightById(booking.flightId);
          if (flight) {
            flightDetails[booking.flightId] = flight;
          }
        }
        setFlights(flightDetails);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user.id]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      const bookingService = BookingService.getInstance();
      const success = await bookingService.cancelBooking(bookingId);
      
      if (success) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status !== 'confirmed');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
                <p className="text-gray-600">Manage your flights and bookings</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                  <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Active Bookings</div>
                  <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Member Since</div>
                  <div className="text-sm font-medium text-gray-900">{user.createdAt}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Active Bookings */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Active Bookings</h2>
                  {confirmedBookings.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center shadow-sm border">
                      <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No active bookings</h3>
                      <p className="text-gray-600">Book your next flight to see it here!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {confirmedBookings.map((booking) => {
                        const flight = flights[booking.flightId];
                        if (!flight) return null;

                        return (
                          <div key={booking.id} className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <Plane className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">{flight.airline}</div>
                                  <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={cancelling === booking.id}
                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                  >
                                    {cancelling === booking.id ? (
                                      <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">Departure</span>
                                </div>
                                <div className="font-semibold">{flight.departure.code}</div>
                                <div className="text-sm text-gray-600">{flight.departure.city}</div>
                                <div className="text-sm text-gray-600">{flight.departure.time}</div>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">Duration</span>
                                </div>
                                <div className="font-semibold">{flight.duration}</div>
                                <div className="text-sm text-gray-600">
                                  {flight.stops === 0 ? 'Direct' : `${flight.stops} stops`}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">Arrival</span>
                                </div>
                                <div className="font-semibold">{flight.arrival.code}</div>
                                <div className="text-sm text-gray-600">{flight.arrival.city}</div>
                                <div className="text-sm text-gray-600">{flight.arrival.time}</div>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between text-sm">
                                <div className="space-x-4">
                                  <span className="text-gray-600">Booking: <span className="font-medium">{booking.id}</span></span>
                                  <span className="text-gray-600">Seats: <span className="font-medium">{booking.selectedSeats.join(', ')}</span></span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  ${booking.totalAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Past Bookings */}
                {pastBookings.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Past Bookings</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {pastBookings.map((booking) => {
                        const flight = flights[booking.flightId];
                        if (!flight) return null;

                        return (
                          <div key={booking.id} className="bg-white rounded-lg p-4 shadow-sm border opacity-75">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                  <Plane className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{flight.airline} {flight.flightNumber}</div>
                                  <div className="text-sm text-gray-600">
                                    {flight.departure.city} → {flight.arrival.city}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <div className="text-sm text-gray-600 mt-1">{booking.bookingDate}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};