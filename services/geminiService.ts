import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { NutritionResponse } from '../types';

/**
 * Converts a File object to a base64 encoded string.
 * @param file The File object to convert.
 * @returns A Promise that resolves with the base64 string.
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1]; // Remove data URL prefix
        resolve(base64String);
      } else {
        reject(new Error("Failed to read file as base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Analyzes a meal description and/or image using the Gemini API to extract nutrition information.
 * @param mealDescription The text description of the meal.
 * @param mealImage An optional image file of the meal.
 * @returns A Promise that resolves with the structured NutritionResponse.
 */
export async function analyzeMeal(mealDescription: string, mealImage?: File): Promise<NutritionResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: (
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  )[] = [];

  if (mealImage) {
    const base64Image = await fileToBase64(mealImage);
    parts.push({
      inlineData: {
        mimeType: mealImage.type,
        data: base64Image,
      },
    });
  }

  const prompt = `Convert the following meal description${mealImage ? ' and image' : ''} into structured nutritional results.
  For each food, include:
  - name
  - quantity (in grams, cups, slices, or standard units)
  - calories (integer, kcal)
  - macros (protein, carbs, fat; in grams)
  - confidence (0-1, estimate how certain you are)

  Rules:
  - Be precise, conservative, and clear.
  - If quantity is missing in the input, estimate based on standard serving sizes.
  - Handle multi-food sentences, mixed dishes, and cultural dishes.
  - Normalize names to standard food terms (e.g., “white rice” not “rice”).
  - Avoid calorie hallucinations — prefer conservative estimates.
  - For food images, visually inspect the image to infer food type, cooking method, and portion size. Mention uncertainty if lighting, angle, or portion size is unclear. Assume standard household serving sizes unless otherwise stated. Avoid hallucinating ingredients that are not visually identifiable.
  - Return "foods" as the key, containing an array of food objects.

  Meal: "${mealDescription}"
  `;

  parts.push({ text: prompt });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using a capable model for complex reasoning and structured output
      contents: { parts: parts },
      config: {
        systemInstruction: `You are a nutrition assistant AI. Your job is to convert a user’s meal description into structured easy to understand results.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foods: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  macros: {
                    type: Type.OBJECT,
                    properties: {
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER },
                    },
                    required: ["protein", "carbs", "fat"],
                  },
                  confidence: { type: Type.NUMBER },
                },
                required: ["name", "quantity", "calories", "macros", "confidence"],
              },
            },
          },
          required: ["foods"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("No text response received from Gemini API.");
    }

    const nutritionData: NutritionResponse = JSON.parse(jsonStr.trim());
    return nutritionData;

  } catch (error) {
    console.error("Error analyzing meal with Gemini API:", error);
    // You might want to implement more robust error handling and retry logic here
    throw new Error(`Failed to analyze meal: ${error instanceof Error ? error.message : String(error)}`);
  }
}
