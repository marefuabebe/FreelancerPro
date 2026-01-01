import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import PrivateRoute from './PrivateRoute.jsx'
import PublicRoute from './PublicRoute.jsx'
import RoleRoute from './RoleRoute.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import GlobalNavbar from '../components/common/GlobalNavbar.jsx'
import OnboardingNavbar from '../components/common/OnboardingNavbar.jsx'
import HomeNavbar from '../components/home/HomeNavbar.jsx'
import FindWorkNavbar from '../components/common/FindWorkNavbar.jsx'
import ClientNavbar from '../components/common/ClientNavbar.jsx'
import SimpleNavbar from '../components/common/SimpleNavbar.jsx'

const Home = lazy(() => import('../pages/Home.jsx'))
const About = lazy(() => import('../pages/About.jsx'))
const Contact = lazy(() => import('../pages/Contact.jsx'))
const TermsOfService = lazy(() => import('../pages/TermsOfService.jsx'))
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy.jsx'))
const Pricing = lazy(() => import('../pages/Pricing.jsx'))
const Enterprise = lazy(() => import('../pages/Enterprise.jsx'))
const JobDetails = lazy(() => import('../pages/JobDetails.jsx'))
const Proposals = lazy(() => import('../pages/Proposals.jsx'))
const Contracts = lazy(() => import('../pages/Contracts.jsx'))
const Chat = lazy(() => import('../pages/Chat.jsx'))
const SubmitProposal = lazy(() => import('../pages/SubmitProposal.jsx'))
const EditJob = lazy(() => import('../pages/EditJob.jsx'))
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'))
const Profile = lazy(() => import('../pages/Profile.jsx'))
const Payments = lazy(() => import('../pages/Payments.jsx'))
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard.jsx'))
const UserManagement = lazy(() => import('../components/admin/UserManagement.jsx'))
const JobManagement = lazy(() => import('../components/admin/JobManagement.jsx'))
const ContractManagement = lazy(() => import('../components/admin/ContractManagement.jsx'))
const FinancialManagement = lazy(() => import('../components/admin/FinancialManagement.jsx'))
const DisputeManagement = lazy(() => import('../components/admin/DisputeManagement.jsx'))
const ProposalManagement = lazy(() => import('../components/admin/ProposalManagement.jsx'))
const Reports = lazy(() => import('../components/admin/Reports.jsx'))
const Settings = lazy(() => import('../components/admin/Settings.jsx'))
import { Navigate } from 'react-router-dom'
const NotFound = lazy(() => import('../pages/NotFound.jsx'))
const Notifications = lazy(() => import('../pages/Notifications.jsx'))

const Login = lazy(() => import('../components/auth/LoginForm.jsx'))
const Register = lazy(() => import('../components/auth/RegisterForm.jsx'))
const ResetPassword = lazy(() => import('../components/auth/ResetPassword.jsx'))
const VerifyEmail = lazy(() => import('../components/auth/VerifyEmail.jsx'))
const AdminLogin = lazy(() => import('../pages/AdminLogin.jsx'))

// Multi-step signup components
const RoleSelection = lazy(() => import('../components/auth/RoleSelection.jsx'))
const EmailVerification = lazy(() => import('../components/auth/EmailVerification.jsx'))
const OnboardingWelcome = lazy(() => import('../components/auth/OnboardingWelcome.jsx'))
const ProfileExperience = lazy(() => import('../components/auth/ProfileExperience.jsx'))
const ProfileExperienceLevel = lazy(() => import('../components/auth/ProfileExperienceLevel.jsx'))
const ProfileGoal = lazy(() => import('../components/auth/ProfileGoal.jsx'))
const ProfilePreference = lazy(() => import('../components/auth/ProfilePreference.jsx'))
const OnboardingProfileInfo = lazy(() => import('../components/auth/OnboardingProfileInfo.jsx'))
const LinkedInImport = lazy(() => import('../components/auth/LinkedInImport.jsx'))
const ResumeUpload = lazy(() => import('../components/auth/ResumeUpload.jsx'))
const ManualProfile = lazy(() => import('../components/auth/ManualProfile.jsx'))
const ResumeImport = lazy(() => import('../components/auth/ResumeImport.jsx'))
const ProfileSkills = lazy(() => import('../components/auth/ProfileSkills.jsx'))
const ProfileLanguages = lazy(() => import('../components/auth/ProfileLanguages.jsx'))
const ProfileEducation = lazy(() => import('../components/auth/ProfileEducation.jsx'))
const ProfileHourlyRate = lazy(() => import('../components/auth/ProfileHourlyRate.jsx'))
const ProfileTitleOverview = lazy(() => import('../components/auth/ProfileTitleOverview.jsx'))
const ProfileLocation = lazy(() => import('../components/auth/ProfileLocation.jsx'))
const ProfileReview = lazy(() => import('../components/auth/ProfileReview.jsx'))
const ProfileOverview = lazy(() => import('../components/auth/ProfileOverview.jsx'))
const ProfileCategories = lazy(() => import('../components/auth/ProfileCategories.jsx'))
const ProfileSubmit = lazy(() => import('../components/auth/ProfileSubmit.jsx'))
const ProfileFinish = lazy(() => import('../components/auth/ProfileFinish.jsx'))
const FindWorkBestMatches = lazy(() => import('../pages/FindWorkBestMatches.jsx'))
const JobPostChat = lazy(() => import('../pages/JobPostChat.jsx'))
const JobPostDraft = lazy(() => import('../pages/JobPostDraft.jsx'))
const JobPostFreelancer = lazy(() => import('../pages/JobPostFreelancer.jsx'))
const JobPostBudget = lazy(() => import('../pages/JobPostBudget.jsx'))
const JobPostReview = lazy(() => import('../pages/JobPostReview.jsx'))
const JobPostSuccess = lazy(() => import('../pages/JobPostSuccess.jsx'))
const JobPostBilling = lazy(() => import('../pages/JobPostBilling.jsx'))
const ClientDashboard = lazy(() => import('../pages/ClientDashboard.jsx'))
const DepositMethods = lazy(() => import('../pages/DepositMethods.jsx'))
const SearchTalent = lazy(() => import('../pages/SearchTalent.jsx'))
const ConsultationDetails = lazy(() => import('../pages/ConsultationDetails.jsx'))
const ClientInfo = lazy(() => import('../pages/ClientInfo.jsx'))
const FreelancerProfile = lazy(() => import('../pages/FreelancerProfile.jsx'))
const ProposalDetails = lazy(() => import('../pages/ProposalDetails.jsx'))

export function AppRoutes() {
    const location = useLocation()
    const isHome = location.pathname === '/'
    const onboardingRoutes = [
        '/nx/create-profile',
        '/nx/create-profile/upload',
        '/nx/create-profile/experience',
        '/nx/create-profile/goal',
        '/nx/create-profile/preference',
        '/nx/create-profile/work-preference',
        '/nx/create-profile/categories',
        '/nx/create-profile/skills',
        '/nx/create-profile/languages',
        '/nx/create-profile/education',
        '/nx/create-profile/hourly-rate',
        '/nx/create-profile/title-overview',
        '/nx/create-profile/overview',
        '/nx/create-profile/location',
        '/nx/create-profile/review',
        '/nx/create-profile/finish',
    ];
    const isOnboarding = onboardingRoutes.includes(location.pathname);

    const isFindWorkPage = location.pathname === '/nx/find-work/best-matches';
    const isClientPage = location.pathname.startsWith('/nx/job-post');

    const isAuthPage = ['/login', '/register', '/signup', '/reset-password', '/verify-email'].some(path => location.pathname.startsWith(path));

    const { user } = useAuth();
    const isClient = user?.role === 'client';

    const isMarketingPage = ['/', '/about', '/contact', '/pricing', '/enterprise', '/terms-of-service', '/privacy-policy'].includes(location.pathname);

    return (
        <div className="min-h-screen w-full transition-colors duration-200">
            {isAuthPage ? <SimpleNavbar /> :
                (isOnboarding ? <OnboardingNavbar /> :
                    (isFindWorkPage ? <FindWorkNavbar /> :
                        (isClientPage || isClient ? <ClientNavbar /> :
                            (isMarketingPage ? <HomeNavbar /> : <GlobalNavbar />))))}
            <Suspense fallback={<div className="p-6">Loading...</div>}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route element={<PublicRoute />}>
                            <Route index element={<Home />} />
                        </Route>
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="terms" element={<TermsOfService />} />
                        <Route path="privacy" element={<PrivacyPolicy />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="enterprise" element={<Enterprise />} />
                        <Route path="jobs/:id" element={<JobDetails />} />
                    </Route>

                    <Route element={<PublicRoute />}>
                        <Route element={<AuthLayout />}>
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="signup" element={<RoleSelection />} />
                            <Route path="reset-password" element={<ResetPassword />} />
                            <Route path="verify-email" element={<VerifyEmail />} />
                            <Route path="signup/verify" element={<EmailVerification />} />
                        </Route>
                    </Route>

                    {/* Admin Login - Separate Route */}
                    <Route path="admin/login" element={<AdminLogin />} />

                    <Route element={<PrivateRoute />}>
                        {/* Freelancer-only routes */}
                        <Route element={<RoleRoute allowedRoles={['freelancer']} />}>
                            {/* Onboarding flow - freelancer only */}
                            <Route path="nx/create-profile" element={<OnboardingWelcome />} />
                            <Route path="nx/create-profile/experience-level" element={<ProfileExperienceLevel />} />
                            <Route path="nx/create-profile/experience" element={<ProfileExperience />} />
                            <Route path="nx/create-profile/goal" element={<ProfileGoal />} />
                            <Route path="nx/create-profile/preference" element={<ProfilePreference />} />
                            <Route path="nx/create-profile/work-preference" element={<ProfilePreference />} />
                            <Route path="nx/create-profile/upload" element={<OnboardingProfileInfo />} />
                            <Route path="nx/create-profile/upload/linkedin" element={<LinkedInImport />} />
                            <Route path="nx/create-profile/upload/resume" element={<ResumeUpload />} />
                            <Route path="nx/create-profile/upload/manual" element={<ManualProfile />} />
                            <Route path="nx/create-profile/categories" element={<ProfileCategories />} />
                            {/* New canonical resume import route */}
                            <Route path="nx/create-profile/resume-import" element={<ResumeImport />} />
                            {/* Additional profile building steps */}
                            <Route path="nx/create-profile/skills" element={<ProfileSkills />} />
                            <Route path="nx/create-profile/languages" element={<ProfileLanguages />} />
                            <Route path="nx/create-profile/education" element={<ProfileEducation />} />
                            <Route path="nx/create-profile/hourly-rate" element={<ProfileHourlyRate />} />
                            <Route path="nx/create-profile/title-overview" element={<ProfileTitleOverview />} />
                            <Route path="nx/create-profile/overview" element={<ProfileOverview />} />
                            <Route path="nx/create-profile/location" element={<ProfileLocation />} />
                            <Route path="nx/create-profile/review" element={<ProfileSubmit />} />
                            <Route path="nx/create-profile/finish" element={<ProfileFinish />} />
                            <Route path="nx/find-work/best-matches" element={<FindWorkBestMatches />} />
                        </Route>

                        {/* Client-only routes */}
                        <Route element={<RoleRoute allowedRoles={['client']} />}>
                            <Route path="nx/create-profile/preference" element={<ProfilePreference />} />
                            <Route path="nx/job-post/chat" element={<JobPostChat />} />
                            <Route path="nx/job-post/draft" element={<JobPostDraft />} />
                            <Route path="nx/job-post/chat/:jobId/freelancer" element={<JobPostFreelancer />} />
                            <Route path="nx/job-post/chat/:jobId/budget" element={<JobPostBudget />} />
                            <Route path="nx/job-post/chat/:jobId/review" element={<JobPostReview />} />
                            <Route path="nx/job-post/chat/:jobId/success" element={<JobPostSuccess />} />
                            <Route path="nx/job-post/onboarding/billing/:jobId" element={<JobPostBilling />} />
                            <Route path="nx/payments/deposit-methods" element={<DepositMethods />} />
                            <Route path="nx/client/dashboard" element={<ClientDashboard />} />
                            <Route path="/nx/search/talent" element={<SearchTalent />} />
                            <Route path="/consultation/:freelancerId" element={<ConsultationDetails />} />
                            <Route path="/nx/client-info" element={<ClientInfo />} />
                        </Route>

                        {/* Shared dashboard routes */}
                        <Route element={<DashboardLayout />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="proposals" element={<Proposals />} />
                            <Route path="contracts" element={<Contracts />} />
                            <Route path="chat" element={<Chat />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="freelancers/:id" element={<FreelancerProfile />} />
                            <Route path="proposals/:id" element={<ProposalDetails />} />
                        </Route>

                        {/* Freelancer-only routes */}
                        <Route element={<RoleRoute allowedRoles={['freelancer']} />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="proposals/submit/:jobId" element={<SubmitProposal />} />
                            </Route>
                        </Route>

                        {/* Client-only routes */}
                        <Route element={<RoleRoute allowedRoles={['client']} />}>
                            <Route element={<MainLayout />}>
                                <Route path="jobs/:id/edit" element={<EditJob />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* Admin-only routes */}
                    <Route element={<RoleRoute allowedRoles={['admin', 'superadmin']} />}>
                        <Route path="admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="jobs" element={<JobManagement />} />
                            <Route path="contracts" element={<ContractManagement />} />
                            <Route path="financials" element={<FinancialManagement />} />
                            <Route path="disputes" element={<DisputeManagement />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="proposals" element={<ProposalManagement />} />
                        </Route>
                    </Route>



                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default AppRoutes
