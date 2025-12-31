import React from 'react';
import { HistoricalEntry } from '../types';

interface HistoryDisplayProps {
  history: HistoricalEntry[];
  onSelectEntry: (entry: HistoricalEntry) => void;
  onDeleteEntry: (id: number) => void;
  isLoading: boolean;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelectEntry, onDeleteEntry, isLoading }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-gray-600 text-center italic border-2 border-dashed border-gray-200">
        <p>Your meal history is empty. Analyze a meal to start building it!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border-2 border-solid border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Meal History</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* Added max-h and overflow for scrollability */}
        {history
          .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent first
          .map((entry) => (
            <div key={entry.id} className="bg-purple-50 rounded-lg p-4 shadow-sm border border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-1 mb-3 md:mb-0">
                <p className="text-lg font-semibold text-purple-800 break-words">
                  {entry.mealDescription.length > 80
                    ? `${entry.mealDescription.substring(0, 80)}...`
                    : entry.mealDescription}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-purple-700 font-medium mt-1">
                  Total: {entry.nutritionData.foods.reduce((sum, food) => sum + food.calories, 0)} kcal
                </p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => onSelectEntry(entry)}
                  className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300
                    ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300'}`}
                  disabled={isLoading}
                  aria-label={`View details for ${entry.mealDescription}`}
                >
                  View
                </button>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300
                    ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300'}`}
                  disabled={isLoading}
                  aria-label={`Delete ${entry.mealDescription} from history`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HistoryDisplay;
