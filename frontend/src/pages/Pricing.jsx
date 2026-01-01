import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            description: 'Perfect for getting started',
            features: [
                { text: 'Browse unlimited jobs', included: true },
                { text: 'Submit up to 10 proposals/month', included: true },
                { text: 'Basic profile', included: true },
                { text: '10% platform fee', included: true },
                { text: 'Email support', included: true },
                { text: 'Priority support', included: false },
                { text: 'Featured profile', included: false },
                { text: 'Advanced analytics', included: false },
            ],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Professional',
            price: '$14.99',
            period: '/month',
            description: 'For serious freelancers',
            features: [
                { text: 'Browse unlimited jobs', included: true },
                { text: 'Unlimited proposals', included: true },
                { text: 'Enhanced profile', included: true },
                { text: '5% platform fee', included: true },
                { text: 'Priority email support', included: true },
                { text: 'Profile badge', included: true },
                { text: 'Basic analytics', included: true },
                { text: 'Featured in search', included: false },
            ],
            cta: 'Start Free Trial',
            popular: true,
        },
        {
            name: 'Business',
            price: '$49.99',
            period: '/month',
            description: 'For agencies and teams',
            features: [
                { text: 'Everything in Professional', included: true },
                { text: 'Team collaboration tools', included: true },
                { text: '0% platform fee', included: true },
                { text: '24/7 priority support', included: true },
                { text: 'Featured profile', included: true },
                { text: 'Advanced analytics', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: 'Custom branding', included: true },
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                        Choose the perfect plan for your freelancing journey. No hidden fees, cancel anytime.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${plan.popular ? 'ring-4 ring-green-500 relative' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 text-sm font-semibold">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="p-8">
                                {/* Plan Header */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-8">
                                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-gray-600 text-lg">{plan.period}</span>}
                                </div>

                                {/* CTA Button */}
                                <Link
                                    to="/signup"
                                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors mb-8 ${plan.popular
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>

                                {/* Features */}
                                <ul className="space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can I change my plan later?
                            </h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and bank transfers for Business plans.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600">
                                Yes! Professional and Business plans come with a 14-day free trial. No credit card required.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What happens when I cancel?
                            </h3>
                            <p className="text-gray-600">
                                You can cancel anytime. You'll have access to your paid features until the end of your billing period.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-xl text-green-100 mb-8">
                        Join thousands of freelancers already growing their business on FreelancerPro
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
                    >
                        Start Your Free Trial
                    </Link>
                </div>
            </div>
        </div>
    );
}
