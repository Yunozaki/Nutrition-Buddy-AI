import React, { useState, useRef } from 'react';

interface MealInputProps {
  onAnalyze: (description: string, image?: File) => void;
  onClear: () => void;
  isLoading: boolean;
  hasError: boolean;
}

const MealInput: React.FC<MealInputProps> = ({ onAnalyze, onClear, isLoading, hasError }) => {
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    } else {
      setImage(undefined);
    }
  };

  const handleAnalyze = () => {
    onAnalyze(description, image);
  };

  const handleClear = () => {
    setDescription('');
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
    onClear();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border-2 border-dashed border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">What did you eat?</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 min-h-[100px]"
        placeholder="Describe your meal (e.g., 'a plate of spaghetti with meatballs, a side salad')."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <div className="mt-4">
        <label htmlFor="file-upload" className="block text-gray-700 text-sm font-medium mb-2">
          Or upload an image:
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-pink-100 file:text-pink-700
            hover:file:bg-pink-200"
          disabled={isLoading}
        />
        {image && (
          <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-semibold">{image.name}</span></p>
        )}
      </div>
      {hasError && (
        <p className="text-red-500 text-sm mt-4">An error occurred. Please try again or simplify your request.</p>
      )}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 sticky bottom-4">
        <button
          onClick={handleAnalyze}
          className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300
            ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Meal'
          )}
        </button>
        <button
          onClick={handleClear}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300
            ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300'}`}
          disabled={isLoading}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default MealInput;
