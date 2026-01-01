// Job categories and specialties
export const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'design', label: 'Design & Creative' },
    { value: 'writing', label: 'Writing & Translation' },
    { value: 'marketing', label: 'Marketing & Sales' },
    { value: 'data', label: 'Data & Analytics' },
    { value: 'video', label: 'Video & Animation' },
    { value: 'admin', label: 'Admin & Customer Support' },
    { value: 'engineering', label: 'Engineering & Architecture' },
    { value: 'accounting', label: 'Accounting & Finance' },
];

export const specialties = {
    'web-development': [
        { value: 'frontend', label: 'Frontend Development' },
        { value: 'backend', label: 'Backend Development' },
        { value: 'fullstack', label: 'Full Stack Development' },
        { value: 'wordpress', label: 'WordPress' },
        { value: 'ecommerce', label: 'E-commerce Development' },
        { value: 'web-design', label: 'Web Design' },
    ],
    'mobile-development': [
        { value: 'ios', label: 'iOS Development' },
        { value: 'android', label: 'Android Development' },
        { value: 'react-native', label: 'React Native' },
        { value: 'flutter', label: 'Flutter' },
        { value: 'mobile-design', label: 'Mobile App Design' },
    ],
    'design': [
        { value: 'graphic-design', label: 'Graphic Design' },
        { value: 'ui-ux', label: 'UI/UX Design' },
        { value: 'logo-design', label: 'Logo Design' },
        { value: 'illustration', label: 'Illustration' },
        { value: 'branding', label: 'Branding' },
    ],
    'writing': [
        { value: 'content-writing', label: 'Content Writing' },
        { value: 'copywriting', label: 'Copywriting' },
        { value: 'technical-writing', label: 'Technical Writing' },
        { value: 'translation', label: 'Translation' },
        { value: 'proofreading', label: 'Proofreading & Editing' },
    ],
    'marketing': [
        { value: 'digital-marketing', label: 'Digital Marketing' },
        { value: 'seo', label: 'SEO' },
        { value: 'social-media', label: 'Social Media Marketing' },
        { value: 'email-marketing', label: 'Email Marketing' },
        { value: 'content-marketing', label: 'Content Marketing' },
    ],
    'data': [
        { value: 'data-analysis', label: 'Data Analysis' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'machine-learning', label: 'Machine Learning' },
        { value: 'data-visualization', label: 'Data Visualization' },
        { value: 'business-intelligence', label: 'Business Intelligence' },
    ],
    'video': [
        { value: 'video-editing', label: 'Video Editing' },
        { value: 'animation', label: 'Animation' },
        { value: 'motion-graphics', label: 'Motion Graphics' },
        { value: '3d-modeling', label: '3D Modeling' },
        { value: 'video-production', label: 'Video Production' },
    ],
    'admin': [
        { value: 'virtual-assistant', label: 'Virtual Assistant' },
        { value: 'customer-support', label: 'Customer Support' },
        { value: 'data-entry', label: 'Data Entry' },
        { value: 'project-management', label: 'Project Management' },
    ],
    'engineering': [
        { value: 'cad', label: 'CAD Design' },
        { value: 'civil-engineering', label: 'Civil Engineering' },
        { value: 'mechanical-engineering', label: 'Mechanical Engineering' },
        { value: 'electrical-engineering', label: 'Electrical Engineering' },
    ],
    'accounting': [
        { value: 'bookkeeping', label: 'Bookkeeping' },
        { value: 'financial-analysis', label: 'Financial Analysis' },
        { value: 'tax-preparation', label: 'Tax Preparation' },
        { value: 'accounting', label: 'Accounting' },
    ],
};

export const getAllSpecialties = () => {
    return Object.values(specialties).flat();
};

export const getSpecialtiesByCategory = (category) => {
    return specialties[category] || [];
};
