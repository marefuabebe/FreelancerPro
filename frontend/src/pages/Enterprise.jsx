import { Check, Users, Shield, Zap, TrendingUp, Globe, Award, HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Enterprise() {
    const features = [
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Manage multiple team members, assign roles, and collaborate seamlessly on projects.',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Advanced security features including SSO, 2FA, and compliance with industry standards.',
        },
        {
            icon: Zap,
            title: 'Priority Support',
            description: 'Dedicated account manager and 24/7 priority support for your team.',
        },
        {
            icon: TrendingUp,
            title: 'Advanced Analytics',
            description: 'Comprehensive insights into team performance, spending, and project outcomes.',
        },
        {
            icon: Globe,
            title: 'Global Talent Pool',
            description: 'Access to vetted freelancers worldwide with specialized skills for your industry.',
        },
        {
            icon: Award,
            title: 'Custom Solutions',
            description: 'Tailored workflows, integrations, and features designed for your business needs.',
        },
    ];

    const benefits = [
        'Dedicated account manager',
        'Custom contract templates',
        'Bulk hiring capabilities',
        'Advanced reporting & analytics',
        'API access for integrations',
        'White-label options',
        'Volume discounts',
        'Training & onboarding support',
        'SLA guarantees',
        'Custom payment terms',
    ];

    const stats = [
        { number: '500+', label: 'Enterprise Clients' },
        { number: '95%', label: 'Client Satisfaction' },
        { number: '50K+', label: 'Projects Completed' },
        { number: '24/7', label: 'Support Available' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl font-bold mb-6 leading-tight">
                                Enterprise Solutions for Growing Teams
                            </h1>
                            <p className="text-xl text-gray-300 mb-8">
                                Scale your business with FreelancerPro's enterprise platform. Get access to top talent,
                                advanced tools, and dedicated support.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/signup"
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                >
                                    Request Demo
                                </Link>
                                <Link
                                    to="/contact"
                                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-white/20"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Trusted by Industry Leaders</div>
                                            <div className="text-sm text-gray-300">500+ enterprise clients worldwide</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Enterprise-Grade Security</div>
                                            <div className="text-sm text-gray-300">SOC 2 Type II certified</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <HeadphonesIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">24/7 Priority Support</div>
                                            <div className="text-sm text-gray-300">Dedicated account manager</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything Your Enterprise Needs
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Powerful features designed to help large teams manage freelance talent at scale
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Enterprise Benefits
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Get access to exclusive features and benefits designed for enterprise teams
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to get started?</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Your company"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Work Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="you@company.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team Size
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>1-10 employees</option>
                                        <option>11-50 employees</option>
                                        <option>51-200 employees</option>
                                        <option>201-1000 employees</option>
                                        <option>1000+ employees</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Request Demo
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">Join Leading Companies</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Trusted by Fortune 500 companies and fast-growing startups worldwide
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/contact"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                        >
                            Talk to Sales
                        </Link>
                        <Link
                            to="/pricing"
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-white/20"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
