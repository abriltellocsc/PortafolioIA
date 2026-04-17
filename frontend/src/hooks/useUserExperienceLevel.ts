import { useEffect, useState } from 'react';
import { ExperienceLevel } from '../utils/chartContext';

const isValidExperienceLevel = (value: any): value is ExperienceLevel => {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
};

const DEFAULT_EXPERIENCE_LEVEL: ExperienceLevel = 'beginner';

const useUserExperienceLevel = (portfolio?: any): ExperienceLevel => {
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(DEFAULT_EXPERIENCE_LEVEL);

  useEffect(() => {
    const candidate = portfolio?.profile?.experience_level ?? portfolio?.experience_level ?? localStorage.getItem('experience_level');
    if (isValidExperienceLevel(candidate)) {
      setExperienceLevel(candidate);
    } else {
      setExperienceLevel(DEFAULT_EXPERIENCE_LEVEL);
    }
  }, [portfolio]);

  return experienceLevel;
};

export default useUserExperienceLevel;
