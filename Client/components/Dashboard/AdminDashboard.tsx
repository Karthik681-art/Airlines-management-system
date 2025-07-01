import React, { useState, useEffect } from 'react';
import { Users, Plane, Calendar, Settings, Plus, Edit, Trash2, Search } from 'lucide-react';
import { User, Flight, Booking } from '../../types';
import { FlightService } from '../../services/flightService';
import { BookingService } from '../../services/bookingService';
import { mockUsers, airlines, cities } from '../../services/mockData';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'bookings' | 'users'>('overview');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(true);
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const [newFlight, setNewFlight] = useState({
    airline: '',
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
        
        const [flightData, bookingData] = await Promise.all([
          flightService.getAllFlights(),
          bookingService.getAllBookings()
        ]);
        
        setFlights(flightData);
        setBookings(bookingData);
      } catch (error) {
        console.error('Error loading admin data:', error);
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
        airline: '',
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

  const handleUpdateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlight) return;

    try {
      const flightService = FlightService.getInstance();
      const updatedFlight = await flightService.updateFlight(editingFlight.id, editingFlight);
      
      if (updatedFlight) {
        setFlights(flights.map(f => f.id === editingFlight.id ? updatedFlight : f));
        setEditingFlight(null);
      }
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  };

  const handleDeleteFlight = async (flightId: string) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    try {
      const flightService = FlightService.getInstance();
      const success = await flightService.deleteFlight(flightId);
      
      if (success) {
        setFlights(flights.filter(f => f.id !== flightId));
      }
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Flights</p>
            <p className="text-3xl font-bold text-blue-600">{flights.length}</p>
          </div>
          <Plane className="h-12 w-12 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-3xl font-bold text-green-600">{bookings.length}</p>
          </div>
          <Calendar className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Bookings</p>
            <p className="text-3xl font-bold text-orange-600">{activeBookings}</p>
          </div>
          <Settings className="h-12 w-12 text-orange-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</p>
          </div>
          <Users className="h-12 w-12 text-purple-600" />
        </div>
      </div>
    </div>
  );

  const renderFlights = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Flight Management</h2>
        <button
          onClick={() => setShowAddFlight(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Flight</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flights.map((flight) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.departure.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${flight.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.availableSeats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingFlight(flight)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFlight(flight.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Management</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.passengers[0]?.firstName} {booking.passengers[0]?.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.flightId}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const userBookingCount = bookings.filter(b => b.userId === user.id).length;
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'operator' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userBookingCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <div className="bg-purple-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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

          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'flights', label: 'Flights', icon: Plane },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'users', label: 'Users', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'flights' && renderFlights()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'users' && renderUsers()}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select airline</option>
                    {airlines.map(airline => (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="date"
                        value={newFlight.departure.date}
                        onChange={(e) => setNewFlight({
                          ...newFlight,
                          departure: {...newFlight.departure, date: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="date"
                        value={newFlight.arrival.date}
                        onChange={(e) => setNewFlight({
                          ...newFlight,
                          arrival: {...newFlight.arrival, date: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={newFlight.class}
                    onChange={(e) => setNewFlight({...newFlight, class: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {editingFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Flight</h3>
            </div>
            <form onSubmit={handleUpdateFlight} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                  <select
                    value={editingFlight.airline}
                    onChange={(e) => setEditingFlight({...editingFlight, airline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {airlines.map(airline => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
                  <input
                    type="text"
                    value={editingFlight.flightNumber}
                    onChange={(e) => setEditingFlight({...editingFlight, flightNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={editingFlight.price}
                    onChange={(e) => setEditingFlight({...editingFlight, price: Number(e.target.value)})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Seats</label>
                  <input
                    type="number"
                    value={editingFlight.availableSeats}
                    onChange={(e) => setEditingFlight({...editingFlight, availableSeats: Number(e.target.value)})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                  <input
                    type="time"
                    value={editingFlight.departure.time}
                    onChange={(e) => setEditingFlight({
                      ...editingFlight,
                      departure: {...editingFlight.departure, time: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                  <input
                    type="time"
                    value={editingFlight.arrival.time}
                    onChange={(e) => setEditingFlight({
                      ...editingFlight,
                      arrival: {...editingFlight.arrival, time: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setEditingFlight(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};