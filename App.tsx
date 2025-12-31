import React, { useState, useCallback, useEffect } from 'react';
import MealInput from './components/MealInput';
import NutritionDisplay from './components/NutritionDisplay';
import HistoryDisplay from './components/HistoryDisplay'; // Import the new component
import { NutritionResponse, HistoricalEntry } from './types';
import { analyzeMeal } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'nutritionHistory';

const App: React.FC = () => {
  const [nutritionData, setNutritionData] = useState<NutritionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoricalEntry[]>([]);

  // Load history from local storage on initial mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from local storage", e);
      // Optionally clear corrupted history
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleAnalyzeMeal = useCallback(async (description: string, image?: File) => {
    setIsLoading(true);
    setError(null);
    setNutritionData(null); // Clear previous results

    try {
      const result = await analyzeMeal(description, image);
      setNutritionData(result);

      // Save to history
      const newEntry: HistoricalEntry = {
        id: Date.now(), // Simple unique ID
        timestamp: Date.now(),
        mealDescription: description || (image ? 'Meal from image' : 'Unknown meal'),
        nutritionData: result,
      };
      setHistory((prevHistory) => [...prevHistory, newEntry]);

    } catch (err) {
      console.error('Failed to fetch nutrition data:', err);
      setError('Failed to analyze meal. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [setHistory]);

  const handleClearResults = useCallback(() => {
    setNutritionData(null);
    setError(null);
  }, []);

  const handleSelectHistoryEntry = useCallback((entry: HistoricalEntry) => {
    setNutritionData(entry.nutritionData);
    setError(null);
    // You might want to scroll to the nutrition display here
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteHistoryEntry = useCallback((id: number) => {
    setHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== id));
    // If the currently displayed data is from the deleted entry, clear it
    if (nutritionData && history.find(entry => entry.id === id && entry.nutritionData === nutritionData)) {
      setNutritionData(null);
    }
  }, [history, nutritionData]);


  return (
    <div className="font-sans container mx-auto p-4 max-w-4xl bg-white rounded-xl shadow-lg">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Nutrition Assistant AI
        </h1>
        <p className="text-lg text-gray-600">
          Turn your meal descriptions or images into structured nutrition insights!
        </p>
      </header>

      <main className="space-y-8">
        <MealInput
          onAnalyze={handleAnalyzeMeal}
          onClear={handleClearResults}
          isLoading={isLoading}
          hasError={!!error}
        />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        <NutritionDisplay nutritionData={nutritionData} />
        <HistoryDisplay
          history={history}
          onSelectEntry={handleSelectHistoryEntry}
          onDeleteEntry={handleDeleteHistoryEntry}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
