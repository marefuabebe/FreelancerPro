// Protected Pages
import Profile from '../pages/Profile.jsx'
import EditJob from '../pages/EditJob.jsx'
import SubmitProposal from '../pages/SubmitProposal.jsx'
import Proposals from '../pages/Proposals.jsx'
import ProposalDetails from '../pages/ProposalDetails.jsx'
import Payments from '../pages/Payments.jsx'
import DepositMethods from '../pages/DepositMethods.jsx'
import Notifications from '../pages/Notifications.jsx'

/**
 * Protected Routes Configuration
 * These routes require user authentication
 */
export const protectedRoutes = [
    {
        path: '/profile',
        element: <Profile />,
        name: 'Profile',
        description: 'User profile and settings'
    },
    {
        path: '/notifications',
        element: <Notifications />,
        name: 'Notifications',
        description: 'User notifications center'
    },
    {
        path: '/proposals',
        element: <Proposals />,
        name: 'Proposals',
        description: 'View all proposals'
    },
    {
        path: '/proposal/:id',
        element: <ProposalDetails />,
        name: 'Proposal Details',
        description: 'View specific proposal details'
    },
    {
        path: '/submit-proposal/:jobId',
        element: <SubmitProposal />,
        name: 'Submit Proposal',
        description: 'Submit a proposal for a job'
    },
    {
        path: '/payments',
        element: <Payments />,
        name: 'Payments',
        description: 'Payment history and management'
    },
    {
        path: '/deposit-methods',
        element: <DepositMethods />,
        name: 'Deposit Methods',
        description: 'Manage payment methods'
    },
    {
        path: '/edit-job/:id',
        element: <EditJob />,
        name: 'Edit Job',
        description: 'Edit job posting'
    }
]
