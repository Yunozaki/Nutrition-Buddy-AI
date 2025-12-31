export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  macros: MacroNutrients;
  confidence: number; // 0-1
}

export interface NutritionResponse {
  foods: FoodItem[];
}

export interface HistoricalEntry {
  id: number; // Unique identifier for the entry
  timestamp: number; // Unix timestamp
  mealDescription: string;
  nutritionData: NutritionResponse;
}
