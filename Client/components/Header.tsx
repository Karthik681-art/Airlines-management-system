import React from 'react';
import { Plane, ArrowLeft } from 'lucide-react';
import { AppStep } from '../App';

interface HeaderProps {
  onBackToSearch: () => void;
  currentStep: AppStep;
}

export const Header: React.FC<HeaderProps> = ({ onBackToSearch, currentStep }) => {
  const getStepTitle = () => {
    switch (currentStep) {
      case 'search': return 'Find Your Perfect Flight';
      case 'results': return 'Available Flights';
      case 'seats': return 'Select Your Seats';
      case 'booking': return 'Passenger Details';
      case 'payment': return 'Payment Information';
      case 'confirmation': return 'Booking Confirmed';
      default: return 'FlightFinder';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FlightFinder</h1>
            </div>
            {currentStep !== 'search' && (
              <div className="hidden sm:flex items-center space-x-2 ml-8">
                <span className="text-gray-500">|</span>
                <span className="text-lg font-medium text-gray-700">{getStepTitle()}</span>
              </div>
            )}
          </div>
          
          {currentStep !== 'search' && currentStep !== 'confirmation' && (
            <button
              onClick={onBackToSearch}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">New Search</span>
            </button>
          )}
        </div>
        
        {currentStep !== 'search' && (
          <div className="mt-4 sm:hidden">
            <h2 className="text-lg font-medium text-gray-700">{getStepTitle()}</h2>
          </div>
        )}
      </div>
    </header>
  );
};