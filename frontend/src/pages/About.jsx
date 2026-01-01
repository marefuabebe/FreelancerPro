import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award, Globe, Zap } from 'lucide-react';

export default function About() {
    const stats = [
        { label: 'Freelancers', value: '1M+' },
        { label: 'Clients', value: '500k+' },
        { label: 'Countries', value: '180+' },
        { label: 'Projects Done', value: '5M+' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Mission Driven',
            description: 'We are dedicated to creating economic opportunity for people around the world.'
        },
        {
            icon: Heart,
            title: 'People First',
            description: 'We believe that people are the heart of every successful project and business.'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We constantly push boundaries to provide the best tools for the future of work.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-gray-900 z-0"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Building the Future of Work
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            FreelancerPro is the world's largest freelancing and crowdsourcing marketplace by number of users and projects. We connect over 66,723,267 employers and freelancers globally from over 247 countries, regions and territories.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white transform -translate-y-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-4">
                                <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Founded in 2024, FreelancerPro began with a simple idea: talent is universal, but opportunity is not. We saw incredible professionals around the world being held back by geography.
                                </p>
                                <p>
                                    We built a platform to bridge that gap. Today, we're proud to be the place where businesses go to find the best talent, and where professionals go to find their best work.
                                </p>
                                <p>
                                    Through our marketplace, employers can hire freelancers to do work in areas such as software development, writing, data entry and design right through to engineering, the sciences, sales and marketing, accounting and legal services.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-200 rounded-3xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Team collaboration"
                                className="relative rounded-3xl shadow-lg w-full h-auto object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            These principles guide everything we do, from how we build our product to how we support our community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors duration-300">
                                        <Icon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Ready to join our community?
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/jobs"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                        >
                            Find Work
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                        >
                            Hire Talent
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
