import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Star, Plane, Loader2, Filter } from 'lucide-react';
import { Flight, SearchParams } from '../types';
import { FlightService } from '../services/flightService';

interface FlightResultsProps {
  searchParams: SearchParams;
  onFlightSelect: (flight: Flight) => void;
  onBack: () => void;
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  searchParams,
  onFlightSelect,
  onBack
}) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterAirline, setFilterAirline] = useState('');

  useEffect(() => {
    const searchFlights = async () => {
      setLoading(true);
      try {
        const flightService = FlightService.getInstance();
        const results = await flightService.searchFlights(searchParams);
        setFlights(results);
      } catch (error) {
        console.error('Error searching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    searchFlights();
  }, [searchParams]);

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return parseFloat(a.duration) - parseFloat(b.duration);
      case 'departure':
        return a.departure.time.localeCompare(b.departure.time);
      default:
        return 0;
    }
  });

  const filteredFlights = filterAirline
    ? sortedFlights.filter(flight => flight.airline === filterAirline)
    : sortedFlights;

  const airlines = [...new Set(flights.map(flight => flight.airline))];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching Flights</h3>
            <p className="text-gray-600">Finding the best flights for your journey...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{searchParams.departure}</span>
                <ArrowRight className="inline mx-2 h-4 w-4" />
                <span className="font-medium">{searchParams.destination}</span>
              </div>
              <div className="text-sm text-gray-600">
                {searchParams.departureDate} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''} • {searchParams.class}
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Modify Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration (Shortest)</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airline
                </label>
                <select
                  value={filterAirline}
                  onChange={(e) => setFilterAirline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Airlines</option>
                  {airlines.map((airline) => (
                    <option key={airline} value={airline}>
                      {airline}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {filteredFlights.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
              <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No flights found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {filteredFlights.length} flight{filteredFlights.length > 1 ? 's' : ''} found
              </div>
              
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{flight.airline}</div>
                          <div className="text-sm text-gray-600">{flight.flightNumber} • {flight.aircraft}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{flight.departure.time}</div>
                          <div className="text-sm text-gray-600">{flight.departure.code}</div>
                          <div className="text-xs text-gray-500">{flight.departure.city}</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div className="h-px bg-gray-300 flex-1"></div>
                          </div>
                          <div className="text-sm text-gray-600">{flight.duration}</div>
                          <div className="text-xs text-gray-500">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{flight.arrival.time}</div>
                          <div className="text-sm text-gray-600">{flight.arrival.code}</div>
                          <div className="text-xs text-gray-500">{flight.arrival.city}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">4.5</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {flight.availableSeats} seats left
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {searchParams.class} class
                        </div>
                      </div>
                    </div>

                    <div className="ml-8 text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${flight.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => onFlightSelect(flight)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                      >
                        Select Flight
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};