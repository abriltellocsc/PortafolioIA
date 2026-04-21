import { useState, useEffect } from 'react';
import { fetchUserPortfolio } from '../services/api';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | null;

/**
 * useUserExperienceLevel Hook
 * 
 * Fetches the user's experience level (beginner, intermediate, advanced) from their portfolio.
 * This hook is used throughout the app to adapt chart explanations and educational content
 * based on the user's investment experience.
 * 
 * @returns The user's experience level or 'intermediate' as fallback
 */
export const useUserExperienceLevel = (): ExperienceLevel => {
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExperienceLevel = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setExperienceLevel(null);
          setIsLoading(false);
          return;
        }

        const portfolio = await fetchUserPortfolio(userId);
        const level = portfolio?.data?.metrics?.experience_level || 'intermediate';
        
        if (level === 'beginner' || level === 'intermediate' || level === 'advanced') {
          setExperienceLevel(level);
        } else {
          setExperienceLevel('intermediate');
        }
      } catch (error) {
        console.warn('Failed to load experience level, using default', error);
        setExperienceLevel('intermediate');
      } finally {
        setIsLoading(false);
      }
    };

    loadExperienceLevel();
  }, []);

  return experienceLevel;
};

/**
 * Variant: useUserExperienceLevelWithLoading
 * 
 * If you need to know when the level is still loading, use this variant.
 */
export const useUserExperienceLevelWithLoading = () => {
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExperienceLevel = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setExperienceLevel(null);
          setIsLoading(false);
          return;
        }

        const portfolio = await fetchUserPortfolio(userId);
        const level = portfolio?.data?.metrics?.experience_level || 'intermediate';
        
        if (level === 'beginner' || level === 'intermediate' || level === 'advanced') {
          setExperienceLevel(level);
        } else {
          setExperienceLevel('intermediate');
        }
      } catch (error) {
        console.warn('Failed to load experience level, using default', error);
        setExperienceLevel('intermediate');
      } finally {
        setIsLoading(false);
      }
    };

    loadExperienceLevel();
  }, []);

  return { experienceLevel, isLoading };
};
