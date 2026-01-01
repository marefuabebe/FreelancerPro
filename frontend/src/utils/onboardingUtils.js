// Onboarding data utilities
const ONBOARDING_KEY = 'onboarding_data';

export const getOnboardingData = () => {
    try {
        const data = localStorage.getItem(ONBOARDING_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting onboarding data:', error);
        return null;
    }
};

export const setOnboardingData = (data) => {
    try {
        localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error setting onboarding data:', error);
    }
};

export const clearOnboardingData = () => {
    try {
        localStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
        console.error('Error clearing onboarding data:', error);
    }
};

export const updateOnboardingStep = (step, data) => {
    try {
        const currentData = getOnboardingData() || {};
        const updatedData = {
            ...currentData,
            [step]: data,
            lastStep: step,
            updatedAt: new Date().toISOString(),
        };
        setOnboardingData(updatedData);
        return updatedData;
    } catch (error) {
        console.error('Error updating onboarding step:', error);
        return null;
    }
};
