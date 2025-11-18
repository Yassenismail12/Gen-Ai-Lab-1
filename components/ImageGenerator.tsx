
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { ImageIcon } from './Icon';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    const result = await generateImage(prompt);

    if (result.startsWith('Error:')) {
      setError(result);
    } else {
      setGeneratedImage(result);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleGenerateImage();
    }
  };


  return (
    <div className="flex flex-col h-full gap-6">
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., A futuristic cityscape at sunset, neon lights reflecting on wet streets"
            className="flex-1 bg-gray-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? <LoadingSpinner /> : 'Generate'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-800/50 rounded-lg shadow-xl p-4 min-h-[300px] md:min-h-[512px]">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-gray-400">
            <LoadingSpinner size="lg" />
            <p>Generating your masterpiece... please wait.</p>
          </div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
        
        {!isLoading && !error && generatedImage && (
          <img 
            src={generatedImage} 
            alt={prompt} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        )}
        
        {!isLoading && !error && !generatedImage && (
           <div className="text-center text-gray-500">
            <ImageIcon className="mx-auto h-16 w-16 mb-4"/>
            <h3 className="text-xl font-semibold">Your generated image will appear here</h3>
            <p className="mt-1">Enter a prompt above and click "Generate" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
