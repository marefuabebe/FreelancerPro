// Shared profile completion calculation logic
export const PROFILE_COMPLETION_CRITERIA = [
    {
        id: 'education',
        label: 'Education',
        desc: 'Include degrees and diplomas',
        weight: 20,
        isComplete: (user) => user?.education?.length > 0,
        path: '/nx/create-profile/education'
    },
    {
        id: 'video',
        label: 'Video introduction',
        desc: 'A short 30-60 second intro',
        weight: 10,
        isComplete: (user) => !!user?.videoIntro,
        path: '/profile'
    },
    {
        id: 'certifications',
        label: 'Certifications',
        desc: 'Recognized skills and knowledge',
        weight: 10,
        isComplete: (user) => user?.certifications?.length > 0,
        path: '/nx/create-profile/education'
    },
    {
        id: 'linked_accounts',
        label: 'Linked accounts',
        desc: 'Connect a social media profile',
        weight: 10,
        isComplete: (user) => user?.linkedAccounts?.length > 0,
        path: '/nx/create-profile/upload/linkedin'
    },
    {
        id: 'experience',
        label: 'Other experiences',
        desc: 'Bootcamps, conferences, awards, etc.',
        weight: 5,
        isComplete: (user) => user?.experience?.length > 0,
        path: '/nx/create-profile/experience'
    },
    {
        id: 'photo',
        label: 'Profile Photo',
        desc: 'A professional headshot',
        weight: 10,
        isComplete: (user) => !!(user?.avatar?.url || (typeof user?.avatar === 'string' && user?.avatar)),
        path: '/profile'
    },
    {
        id: 'skills',
        label: 'Skills',
        desc: 'Highlight your expertise',
        weight: 10,
        isComplete: (user) => user?.skills?.length > 0,
        path: '/nx/create-profile/skills'
    },
    {
        id: 'bio',
        label: 'Overview',
        desc: 'Tell clients about yourself',
        weight: 10,
        isComplete: (user) => !!user?.bio,
        path: '/nx/create-profile/overview'
    },
    {
        id: 'title',
        label: 'Professional Title',
        desc: 'What do you do?',
        weight: 15,
        isComplete: (user) => !!user?.professionalTitle,
        path: '/nx/create-profile/title-overview'
    }
];

export function calculateProfileCompletion(user) {
    if (!user) return { percentage: 0, completedItems: [], incompleteItems: PROFILE_COMPLETION_CRITERIA };

    let completed = 0;
    let total = 0;
    const completedItems = [];
    const incompleteItems = [];

    console.log('🔍 Profile Completion Debug:', {
        avatar: user?.avatar,
        professionalTitle: user?.professionalTitle,
        bio: user?.bio,
        skills: user?.skills,
        experience: user?.experience,
        education: user?.education
    });

    PROFILE_COMPLETION_CRITERIA.forEach(criterion => {
        const done = criterion.isComplete(user);
        total += criterion.weight;
        console.log(`✓ ${criterion.id}: ${done ? '✅' : '❌'} (${criterion.weight}%)`);
        if (done) {
            completed += criterion.weight;
            completedItems.push(criterion);
        } else {
            incompleteItems.push(criterion);
        }
    });

    const percentage = Math.min(100, Math.round(completed));
    console.log(`📊 Total Completion: ${percentage}%`);

    return {
        percentage,
        completedItems,
        incompleteItems
    };
}
