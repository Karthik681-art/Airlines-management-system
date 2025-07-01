import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Plane } from 'lucide-react';
import { SearchParams } from '../types';
import { cities } from '../services/mockData';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('roundTrip');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState<'economy' | 'premium' | 'business' | 'first'>('business');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams: SearchParams = {
      departure,
      destination,
      departureDate,
      returnDate: tripType === 'roundTrip' ? returnDate : undefined,
      passengers,
      class: travelClass,
      tripType
    };
    
    onSearch(searchParams);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Find Your Perfect Flight
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Search from thousands of destinations worldwide. Book with confidence and travel with ease.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setTripType('roundTrip')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              tripType === 'roundTrip'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plane className="h-5 w-5" />
            <span>Round Trip</span>
          </button>
          <button
            onClick={() => setTripType('oneWay')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              tripType === 'oneWay'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plane className="h-5 w-5" />
            <span>One Way</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                From
              </label>
              <select
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name} ({city.code}) - {city.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                To
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name} ({city.code}) - {city.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {tripType === 'roundTrip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Class
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'economy', label: 'Economy' },
                { value: 'premium', label: 'Premium Economy' },
                { value: 'business', label: 'Business' },
                { value: 'first', label: 'First Class' }
              ].map((classOption) => (
                <button
                  key={classOption.value}
                  type="button"
                  onClick={() => setTravelClass(classOption.value as any)}
                  className={`px-4 py-3 rounded-lg border font-medium transition-colors ${
                    travelClass === classOption.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {classOption.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-lg flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search Flights</span>
          </button>
        </form>
      </div>
    </div>
  );
};