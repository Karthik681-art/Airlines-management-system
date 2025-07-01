import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Flight } from '../types';

interface SeatSelectionProps {
  flight: Flight;
  passengers: number;
  onSeatSelect: (seats: string[]) => void;
  onBack: () => void;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({
  flight,
  passengers,
  onSeatSelect,
  onBack
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate seat map for business class
  const generateSeatMap = () => {
    const rows = 8;
    const seatsPerRow = ['A', 'B', 'C', 'D'];
    const occupiedSeats = ['1B', '2A', '3C', '5D', '6A', '7B']; // Mock occupied seats
    
    const seatMap = [];
    for (let row = 1; row <= rows; row++) {
      const rowSeats = seatsPerRow.map(letter => {
        const seatId = `${row}${letter}`;
        return {
          id: seatId,
          row,
          letter,
          isOccupied: occupiedSeats.includes(seatId),
          isSelected: selectedSeats.includes(seatId),
          isWindow: letter === 'A' || letter === 'D',
          isAisle: letter === 'B' || letter === 'C'
        };
      });
      seatMap.push(rowSeats);
    }
    return seatMap;
  };

  const seatMap = generateSeatMap();

  const handleSeatClick = (seatId: string, isOccupied: boolean) => {
    if (isOccupied) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === passengers) {
      onSeatSelect(selectedSeats);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Flight Selection</span>
        </button>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Seats</h2>
          <div className="text-gray-600">
            {flight.airline} {flight.flightNumber} • {flight.departure.city} → {flight.arrival.city}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aircraft: {flight.aircraft}</h3>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded border"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded border"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-400 rounded border"></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="text-center mb-6">
                <div className="bg-gray-100 rounded-t-full px-6 py-2 inline-block">
                  <span className="text-sm font-medium text-gray-600">Front of Aircraft</span>
                </div>
              </div>

              <div className="space-y-3">
                {seatMap.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center justify-center space-x-4">
                    <div className="w-8 text-center text-sm font-medium text-gray-600">
                      {row[0].row}
                    </div>
                    
                    <div className="flex space-x-2">
                      {row.slice(0, 2).map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id, seat.isOccupied)}
                          disabled={seat.isOccupied}
                          className={`w-8 h-8 rounded text-xs font-medium border-2 transition-colors ${
                            seat.isOccupied
                              ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed'
                              : seat.isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {seat.letter}
                        </button>
                      ))}
                    </div>

                    <div className="w-8"></div>

                    <div className="flex space-x-2">
                      {row.slice(2, 4).map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id, seat.isOccupied)}
                          disabled={seat.isOccupied}
                          className={`w-8 h-8 rounded text-xs font-medium border-2 transition-colors ${
                            seat.isOccupied
                              ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed'
                              : seat.isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {seat.letter}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Selection</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">
                  Selected: {selectedSeats.length} of {passengers}
                </div>
                <div className="space-y-2">
                  {selectedSeats.map((seatId, index) => (
                    <div
                      key={seatId}
                      className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                    >
                      <span className="font-medium">Passenger {index + 1}</span>
                      <span className="text-blue-600 font-semibold">Seat {seatId}</span>
                    </div>
                  ))}
                  {Array.from({ length: passengers - selectedSeats.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-gray-500">Passenger {selectedSeats.length + index + 1}</span>
                      <span className="text-gray-400">Select seat</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-4">
                  Seat Features:
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Extra legroom</li>
                  <li>• Priority boarding</li>
                  <li>• Complimentary meals</li>
                  <li>• Personal entertainment</li>
                </ul>
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length !== passengers}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Passenger Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};