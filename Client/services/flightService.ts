import { Flight, SearchParams } from '../types';
import { mockFlights } from './mockData';

export class FlightService {
  private static instance: FlightService;

  private constructor() {}

  static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  async searchFlights(params: SearchParams): Promise<Flight[]> {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter flights based on search parameters
    let filteredFlights = mockFlights.filter(flight => {
      const matchesDeparture = flight.departure.city.toLowerCase().includes(params.departure.toLowerCase()) ||
                              flight.departure.code.toLowerCase().includes(params.departure.toLowerCase());
      const matchesDestination = flight.arrival.city.toLowerCase().includes(params.destination.toLowerCase()) ||
                                 flight.arrival.code.toLowerCase().includes(params.destination.toLowerCase());
      const matchesClass = flight.class.toLowerCase() === params.class.toLowerCase();
      const matchesDate = flight.departure.date === params.departureDate;

      return matchesDeparture && matchesDestination && matchesClass && matchesDate;
    });

    // Sort by price (default)
    filteredFlights.sort((a, b) => a.price - b.price);

    return filteredFlights;
  }

  async getFlightById(id: string): Promise<Flight | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFlights.find(flight => flight.id === id) || null;
  }

  async getAllFlights(): Promise<Flight[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFlights];
  }

  async addFlight(flight: Omit<Flight, 'id'>): Promise<Flight> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFlight: Flight = {
      ...flight,
      id: `NEW${Date.now()}`
    };
    
    mockFlights.push(newFlight);
    return newFlight;
  }

  async updateFlight(id: string, updates: Partial<Flight>): Promise<Flight | null> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const flightIndex = mockFlights.findIndex(f => f.id === id);
    if (flightIndex === -1) return null;
    
    mockFlights[flightIndex] = { ...mockFlights[flightIndex], ...updates };
    return mockFlights[flightIndex];
  }

  async deleteFlight(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const flightIndex = mockFlights.findIndex(f => f.id === id);
    if (flightIndex === -1) return false;
    
    mockFlights.splice(flightIndex, 1);
    return true;
  }
}