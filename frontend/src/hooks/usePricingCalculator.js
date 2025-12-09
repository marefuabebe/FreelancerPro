import { useState } from "react";

export function usePricingCalculator() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);

  const calculatePricing = async (description) => {
    if (!description?.trim()) {
      setError("Please provide a description");
      return;
    }

    setIsCalculating(true);
    setError(null);
    setEstimate(null);

    try {
      // Simulate API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock calculation based on description keywords
      const keywords = description.toLowerCase();
      let baseRate = 25;

      if (keywords.includes("ai") || keywords.includes("machine learning"))
        baseRate += 20;
      if (keywords.includes("blockchain") || keywords.includes("crypto"))
        baseRate += 15;
      if (keywords.includes("mobile") || keywords.includes("app"))
        baseRate += 10;
      if (keywords.includes("design") || keywords.includes("ui")) baseRate += 5;

      const mockEstimate = {
        affordable: Math.floor(baseRate * 0.8),
        typical: Math.floor(baseRate * 1.2),
        expert: Math.floor(baseRate * 1.8),
        description: description.trim(),
      };

      setEstimate(mockEstimate);
    } catch (err) {
      setError("Failed to calculate pricing. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const reset = () => {
    setEstimate(null);
    setError(null);
    setIsCalculating(false);
  };

  return {
    calculatePricing,
    isCalculating,
    estimate,
    error,
    reset,
  };
}
