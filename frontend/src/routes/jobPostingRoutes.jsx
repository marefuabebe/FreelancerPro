// Job Posting Flow Pages
import JobPostChat from '../pages/JobPostChat.jsx'
import JobPostDraft from '../pages/JobPostDraft.jsx'
import JobPostFreelancer from '../pages/JobPostFreelancer.jsx'
import JobPostBudget from '../pages/JobPostBudget.jsx'
import JobPostBilling from '../pages/JobPostBilling.jsx'
import JobPostReview from '../pages/JobPostReview.jsx'
import JobPostSuccess from '../pages/JobPostSuccess.jsx'

/**
 * Job Posting Flow Routes Configuration
 * Multi-step job posting process routes
 */
export const jobPostingRoutes = [
    {
        path: '/nx/job-post/chat',
        element: <JobPostChat />,
        name: 'Job Post Chat',
        description: 'Step 1: Chat-based job description',
        step: 1
    },
    {
        path: '/nx/job-post/draft',
        element: <JobPostDraft />,
        name: 'Job Post Draft',
        description: 'View and manage job drafts',
        step: null
    },
    {
        path: '/nx/job-post/chat/:id/freelancer',
        element: <JobPostFreelancer />,
        name: 'Job Post Freelancer',
        description: 'Step 2: Freelancer requirements',
        step: 2
    },
    {
        path: '/nx/job-post/chat/:id/budget',
        element: <JobPostBudget />,
        name: 'Job Post Budget',
        description: 'Step 3: Budget and pricing',
        step: 3
    },
    {
        path: '/nx/job-post/chat/:id/billing',
        element: <JobPostBilling />,
        name: 'Job Post Billing',
        description: 'Step 4: Billing information',
        step: 4
    },
    {
        path: '/nx/job-post/review/:id',
        element: <JobPostReview />,
        name: 'Job Post Review',
        description: 'Step 5: Review and submit',
        step: 5
    },
    {
        path: '/nx/job-post/success/:id',
        element: <JobPostSuccess />,
        name: 'Job Post Success',
        description: 'Job posting confirmation',
        step: 6
    }
]
