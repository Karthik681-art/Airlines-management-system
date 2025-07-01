import React, { useState, useEffect } from 'react';
import { Plane, Plus, Edit, Trash2, Users, Calendar, TrendingUp } from 'lucide-react';
import { User, Flight, Booking } from '../../types';
import { FlightService } from '../../services/flightService';
import { BookingService } from '../../services/bookingService';
import { airlines, cities } from '../../services/mockData';

interface OperatorDashboardProps {
  user: User;
  onLogout: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ user, onLogout }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFlight, setShowAddFlight] = useState(false);

  const [newFlight, setNewFlight] = useState({
    airline: 'American Airlines', // Default to first airline
    flightNumber: '',
    departure: {
      airport: '',
      city: '',
      code: '',
      time: '',
      date: ''
    },
    arrival: {
      airport: '',
      city: '',
      code: '',
      time: '',
      date: ''
    },
    duration: '',
    stops: 0,
    price: 0,
    aircraft: '',
    class: 'business',
    availableSeats: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const flightService = FlightService.getInstance();
        const bookingService = BookingService.getInstance();
        
        const [allFlights, allBookings] = await Promise.all([
          flightService.getAllFlights(),
          bookingService.getAllBookings()
        ]);
        
        // Filter flights by operator (in real app, this would be by operator ID)
        const operatorFlights = allFlights.filter(flight => 
          flight.airline === 'American Airlines' || 
          flight.airline === 'Delta Air Lines'
        );
        
        setFlights(operatorFlights);
        
        // Filter bookings for operator's flights
        const operatorBookings = allBookings.filter(booking =>
          operatorFlights.some(flight => flight.id === booking.flightId)
        );
        
        setBookings(operatorBookings);
      } catch (error) {
        console.error('Error loading operator data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const flightService = FlightService.getInstance();
      const addedFlight = await flightService.addFlight(newFlight);
      setFlights([...flights, addedFlight]);
      setShowAddFlight(false);
      setNewFlight({
        airline: 'American Airlines',
        flightNumber: '',
        departure: { airport: '', city: '', code: '', time: '', date: '' },
        arrival: { airport: '', city: '', code: '', time: '', date: '' },
        duration: '',
        stops: 0,
        price: 0,
        aircraft: '',
        class: 'business',
        availableSeats: 0
      });
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flight operator dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Flight Operator Dashboard</h1>
                <p className="text-gray-600">Welcome, {user.firstName}</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Flights</p>
                <p className="text-3xl font-bold text-orange-600">{flights.length}</p>
              </div>
              <Plane className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-3xl font-bold text-green-600">{activeBookings}</p>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Flight Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">My Flights</h2>
              <button
                onClick={() => setShowAddFlight(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Flight</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Seats</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flights.map((flight) => {
                  const flightBookings = bookings.filter(b => b.flightId === flight.id && b.status === 'confirmed');
                  return (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{flight.airline}</div>
                          <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flight.departure.code} → {flight.arrival.code}</div>
                        <div className="text-sm text-gray-500">{flight.departure.city} to {flight.arrival.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flight.departure.date}</div>
                        <div className="text-sm text-gray-500">{flight.departure.time} - {flight.arrival.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${flight.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flightBookings.length} confirmed</div>
                        <div className="text-sm text-gray-500">
                          ${flightBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()} revenue
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          flight.availableSeats > 10 
                            ? 'bg-green-100 text-green-800' 
                            : flight.availableSeats > 5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {flight.availableSeats} seats
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 10).map((booking) => {
                  const flight = flights.find(f => f.id === booking.flightId);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.passengers[0]?.firstName} {booking.passengers[0]?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{booking.passengers[0]?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flight?.flightNumber}</div>
                        <div className="text-sm text-gray-500">Seat: {booking.selectedSeats.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.bookingDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Flight Modal */}
      {showAddFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add New Flight</h3>
            </div>
            <form onSubmit={handleAddFlight} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                  <select
                    value={newFlight.airline}
                    onChange={(e) => setNewFlight({...newFlight, airline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    {airlines.slice(0, 3).map(airline => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
                  <input
                    type="text"
                    value={newFlight.flightNumber}
                    onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="AA 123"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Departure</h4>
                  <div className="space-y-3">
                    <select
                      value={newFlight.departure.city}
                      onChange={(e) => {
                        const city = cities.find(c => c.name === e.target.value);
                        setNewFlight({
                          ...newFlight,
                          departure: {
                            ...newFlight.departure,
                            city: e.target.value,
                            code: city?.code || '',
                            airport: `${e.target.value} International Airport`
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select departure city</option>
                      {cities.map(city => (
                        <option key={city.code} value={city.name}>{city.name} ({city.code})</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={newFlight.departure.time}
                        onChange={(e) => setNewFlight({
                          ...newFlight,
                          departure: {...newFlight.departure, time: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <input
                        type="date"
                        value={newFlight.departure.date}
                        onChange={(e) => setNewFlight({
                          ...newFlight,
                          departure: {...newFlight.departure, date: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Arrival</h4>
                  <div className="space-y-3">
                    <select
                      value={newFlight.arrival.city}
                      onChange={(e) => {
                        const city = cities.find(c => c.name === e.target.value);
                        setNewFlight({
                          ...newFlight,
                          arrival: {
                            ...newFlight.arrival,
                            city: e.target.value,
                            code: city?.code || '',
                            airport: `${e.target.value} International Airport`
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select arrival city</option>
                      {cities.map(city => (
                        <option key={city.code} value={city.name}>{city.name} ({city.code})</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={newFlight.arrival.time}
                        onChange={(e) => setNewFlight({
                          ...newFlight,
                          arrival: {...newFlight.arrival, time: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <input
                        type="date"
                        value={newFlight.arrival.date}
                        onChange={(e) => setNewFlight({
                          ...newFlight,
                          arrival: {...newFlight.arrival, date: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newFlight.duration}
                    onChange={(e) => setNewFlight({...newFlight, duration: e.target.value})}
                    placeholder="7h 15m"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
                  <input
                    type="number"
                    value={newFlight.stops}
                    onChange={(e) => setNewFlight({...newFlight, stops: Number(e.target.value)})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={newFlight.price}
                    onChange={(e) => setNewFlight({...newFlight, price: Number(e.target.value)})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Seats</label>
                  <input
                    type="number"
                    value={newFlight.availableSeats}
                    onChange={(e) => setNewFlight({...newFlight, availableSeats: Number(e.target.value)})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
                  <input
                    type="text"
                    value={newFlight.aircraft}
                    onChange={(e) => setNewFlight({...newFlight, aircraft: e.target.value})}
                    placeholder="Boeing 777-300ER"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={newFlight.class}
                    onChange={(e) => setNewFlight({...newFlight, class: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddFlight(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Add Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};