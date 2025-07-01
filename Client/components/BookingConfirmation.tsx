import React from 'react';
import { CheckCircle, Download, Mail, Calendar, MapPin, Clock } from 'lucide-react';
import { Flight, BookingData } from '../types';

interface BookingConfirmationProps {
  flight: Flight;
  bookingData: BookingData;
  selectedSeats: string[];
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  flight,
  bookingData,
  selectedSeats
}) => {
  const bookingReference = `FF${Date.now().toString().slice(-6)}`;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your flight has been successfully booked. A confirmation email has been sent to {bookingData.email}
        </p>
        <div className="mt-6">
          <div className="text-sm text-gray-600">Booking Reference</div>
          <div className="text-2xl font-bold text-blue-600">{bookingReference}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Flight Details
          </h3>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="font-semibold text-gray-900 text-lg">{flight.airline}</div>
              <div className="text-gray-600">{flight.flightNumber} • {flight.aircraft}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Departure</div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-semibold">{flight.departure.code}</div>
                    <div className="text-sm text-gray-600">{flight.departure.city}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-semibold">{flight.departure.time}</div>
                    <div className="text-sm text-gray-600">{flight.departure.date}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Arrival</div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-semibold">{flight.arrival.code}</div>
                    <div className="text-sm text-gray-600">{flight.arrival.city}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-semibold">{flight.arrival.time}</div>
                    <div className="text-sm text-gray-600">{flight.arrival.date}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{flight.duration}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stops:</span>
                  <span className="ml-2 font-medium">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Class:</span>
                  <span className="ml-2 font-medium capitalize">{flight.class}</span>
                </div>
                <div>
                  <span className="text-gray-600">Seat:</span>
                  <span className="ml-2 font-medium">{selectedSeats.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Passenger Information</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Passenger</div>
              <div className="font-semibold text-gray-900">
                {bookingData.firstName} {bookingData.lastName}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <div className="text-gray-900">{bookingData.email}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Phone</div>
                <div className="text-gray-900">{bookingData.phone}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Date of Birth</div>
                <div className="text-gray-900">{bookingData.dateOfBirth}</div>
              </div>

              {bookingData.passportNumber && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Passport Number</div>
                  <div className="text-gray-900">{bookingData.passportNumber}</div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-2">Total Amount Paid</div>
              <div className="text-2xl font-bold text-green-600">
                ${(flight.price + Math.round(flight.price * 0.15)).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Important Information</h4>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Please arrive at the airport at least 3 hours before international flights</li>
            <li>• Check-in opens 24 hours before departure</li>
            <li>• Bring a valid passport for international travel</li>
            <li>• Your e-ticket has been sent to your email address</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-5 w-5" />
            <span>Download E-Ticket</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <Mail className="h-5 w-5" />
            <span>Email E-Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};