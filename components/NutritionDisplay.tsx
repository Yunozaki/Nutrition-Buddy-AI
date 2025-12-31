import React from 'react';
import { FoodItem, NutritionResponse } from '../types';

interface NutritionDisplayProps {
  nutritionData: NutritionResponse | null;
}

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-100 text-green-700';
  if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ nutritionData }) => {
  if (!nutritionData || nutritionData.foods.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-gray-600 text-center italic border-2 border-dashed border-gray-200">
        <p>No nutrition data to display yet. Describe or upload your meal above!</p>
      </div>
    );
  }

  const totalCalories = nutritionData.foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = nutritionData.foods.reduce((sum, food) => sum + food.macros.protein, 0);
  const totalCarbs = nutritionData.foods.reduce((sum, food) => sum + food.macros.carbs, 0);
  const totalFat = nutritionData.foods.reduce((sum, food) => sum + food.macros.fat, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border-2 border-solid border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Meal's Nutrition</h2>

      {/* Total Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-pink-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-pink-700 font-medium">Total Calories</p>
          <p className="text-2xl font-bold text-pink-800">{totalCalories} kcal</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-blue-700 font-medium">Total Protein</p>
          <p className="text-2xl font-bold text-blue-800">{totalProtein} g</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-green-700 font-medium">Total Carbs</p>
          <p className="text-2xl font-bold text-green-800">{totalCarbs} g</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-yellow-700 font-medium">Total Fat</p>
          <p className="text-2xl font-bold text-yellow-800">{totalFat} g</p>
        </div>
      </div>

      {/* Individual Food Items */}
      <div className="space-y-6">
        {nutritionData.foods.map((food, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{food.name}</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(food.confidence)}`}>
                Confidence: {(food.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Quantity:</span> {food.quantity}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="bg-pink-50 p-3 rounded-md">
                <p className="text-pink-600 font-medium">Calories</p>
                <p className="text-pink-800 font-semibold">{food.calories} kcal</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-blue-600 font-medium">Protein</p>
                <p className="text-blue-800 font-semibold">{food.macros.protein} g</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-green-600 font-medium">Carbs</p>
                <p className="text-green-800 font-semibold">{food.macros.carbs} g</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-yellow-600 font-medium">Fat</p>
                <p className="text-yellow-800 font-semibold">{food.macros.fat} g</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionDisplay;
