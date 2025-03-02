import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Footprints, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default shoe image path
const DEFAULT_IMAGE = "/default-shoe.jpg";

// Default analysis for the shoe
const DEFAULT_ANALYSIS = `1. Shoe Identification:
- Brand: Nike
- Model: Air Jordan 1 High "University Blue"
- Year Released: 2021
- Category: Basketball/Lifestyle
- Type: High-top sneaker
- Primary Colors: University Blue, White, Black

2. Design & Materials:
- Upper: Premium leather and synthetic materials
- Sole: Rubber outsole with Air cushioning
- Distinctive Features: Iconic wing logo, Nike swoosh, perforated toe box
- Lacing System: Traditional flat laces
- Silhouette: Classic Air Jordan 1 high-top design
- Colorway: Primarily University Blue with White and Black accents

3. Performance & Comfort:
- Intended Use: Casual wear, lifestyle, basketball-inspired
- Cushioning: Air-Sole unit in heel
- Support Level: High (ankle support from high-top design)
- Fit: True to size, slightly narrow
- Breathability: Moderate (perforated toe box)
- Weight: Approximately 14.0 oz (397g) per shoe

4. Purchasing Information:
- Retail Price: $170 USD
- Current Market Value: $300-$450 USD (varies by size)
- Availability: Limited release, sold out at retail
- Where to Buy: StockX, GOAT, Flight Club, Stadium Goods, eBay
- Authenticity Verification: Available through StockX and GOAT platforms
- Size Range: US Men's 7-15

5. Cultural Significance:
- Popularity Rating: Very High (9/10)
- Celebrity Endorsements: Numerous athletes and celebrities
- Cultural Impact: Highly coveted colorway of an iconic silhouette
- Collectible Value: High investment potential
- Special Notes: Pays homage to Michael Jordan's UNC alma mater
- Similar Alternatives: Air Jordan 1 "University Blue" Low, Nike Dunk High "University Blue"`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const shoePrompt = "Analyze this shoe/sneaker image and provide the following information:\n1. Shoe identification (brand, model, year released, category, type, primary colors)\n2. Design and materials (upper, sole, distinctive features, lacing system, silhouette, colorway)\n3. Performance and comfort (intended use, cushioning, support level, fit, breathability, weight)\n4. Purchasing information (retail price, current market value, availability, where to buy, authenticity verification, size range)\n5. Cultural significance (popularity rating, celebrity endorsements, cultural impact, collectible value, special notes, similar alternatives)\n\nThis is for informational purposes only.";
    try {
      const result = await analyzeImage(imageData, shoePrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Free Shoe Identifier</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload a footwear photo for sneaker identification and shopping information</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Shoe Photo
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Shoe preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Footprints className="-ml-1 mr-2 h-5 w-5" />
                      Identify Shoe
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Photo
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Shoe Analysis Results</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Free Shoe Identifier: Your Ultimate Sneaker Recognition Tool</h2>
          
          <p>Welcome to our free shoe identifier tool, powered by advanced artificial intelligence technology.
             This tool helps you identify sneakers and footwear, providing essential information about models,
             materials, pricing, and where to purchase them.</p>

          <h3>How Our Shoe Identifier Works</h3>
          <p>Our tool uses AI to analyze footwear photos and provide detailed information about the shoes.
             Simply upload a clear photo of a shoe or sneaker, and our AI will help you identify its brand,
             model, and key details to help with purchasing decisions.</p>

          <h3>Key Features of Our Shoe Identifier</h3>
          <ul>
            <li>Comprehensive brand and model recognition</li>
            <li>Detailed material and design analysis</li>
            <li>Performance and comfort information</li>
            <li>Current market value and pricing details</li>
            <li>Shopping links and availability</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For:</h3>
          <ul>
            <li>Sneaker enthusiasts and collectors</li>
            <li>Fashion-conscious shoppers</li>
            <li>Finding information about shoes you like</li>
            <li>Discovering where to purchase specific models</li>
            <li>Checking authenticity factors before buying</li>
          </ul>

          <p>Try our free shoe identifier today and discover everything about your favorite footwear!
             No registration required - just upload a photo and start learning about shoes from around the world.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}