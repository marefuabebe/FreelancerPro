import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard, Lock, HelpCircle, Loader2 } from 'lucide-react';
import FreelancerProFooter from '../components/common/UpworkFooter.jsx';
import { addPaymentMethod } from '../api/paymentApi.js';

export default function DepositMethods() {
    const [showModal, setShowModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        firstName: '',
        lastName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        country: 'United States',
        address1: '',
        address2: '',
        city: '',
        postalCode: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.cardNumber || formData.cardNumber.length < 16) newErrors.cardNumber = 'Valid card number is required';
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.expiryMonth || formData.expiryMonth < 1 || formData.expiryMonth > 12) newErrors.expiryMonth = 'Invalid month';
        if (!formData.expiryYear || formData.expiryYear.length < 2) newErrors.expiryYear = 'Invalid year';
        if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.address1) newErrors.address1 = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await addPaymentMethod({
                cardNumber: formData.cardNumber,
                cardName: `${formData.firstName} ${formData.lastName}`,
                expiryMonth: formData.expiryMonth,
                expiryYear: formData.expiryYear,
                cvv: formData.cvv,
                billingAddress: {
                    country: formData.country,
                    line1: formData.address1,
                    line2: formData.address2,
                    city: formData.city,
                    postal_code: formData.postalCode
                }
            });
            setShowModal(false);
            // Reset form
            setFormData({
                cardNumber: '',
                firstName: '',
                lastName: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                country: 'United States',
                address1: '',
                address2: '',
                city: '',
                postalCode: ''
            });
            alert('Payment method saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save payment method');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    const sidebarLinks = [
        { name: 'My info', href: '#' },
        { name: 'Billing & Payments', href: '/nx/payments/deposit-methods', active: true },
        { name: 'Password & Security', href: '#' },
        { name: 'Teams & Members', href: '#' },
        { name: 'Membership', href: '#' },
        { name: 'Notification Settings', href: '#' },
        { name: 'Tax Information', href: '#' },
        { name: 'Connected Services', href: '#' },
        { name: 'Appeals Tracker', href: '#' },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
                <h1 className="text-3xl font-medium text-gray-900 mb-8">Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {sidebarLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`block px-3 py-2 text-sm font-medium rounded-md ${link.active
                                        ? 'bg-gray-100 text-gray-900 border-l-4 border-black'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        <h2 className="text-2xl font-medium text-gray-900">Billing & payments</h2>

                        {/* Billing Cycle */}
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">Company billing cycle</h3>
                            <p className="text-gray-600 mb-6">Weekly</p>
                            <div className="text-sm text-gray-500">
                                Terms: <span className="text-gray-900">Standard</span>
                            </div>
                        </div>

                        {/* Outstanding Balance */}
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Outstanding balance</h3>
                            <p className="text-2xl font-medium text-gray-900 mb-6">$0.00</p>
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-100 text-gray-400 font-medium rounded-md cursor-not-allowed"
                            >
                                Pay now
                            </button>
                        </div>

                        {/* Billing Methods */}
                        <div className="border border-gray-200 rounded-xl p-6">
                            {!showModal ? (
                                <>
                                    <h3 className="text-xl font-medium text-gray-900 mb-4">Billing methods</h3>
                                    <p className="text-gray-600 mb-6">
                                        You haven't set up any billing methods yet. Add a method so you can hire when you're ready.
                                    </p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center text-green-600 font-medium hover:underline"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Add a billing method
                                    </button>
                                </>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-medium text-gray-900">Add a billing method</h2>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-full text-green-600 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Payment Card Option */}
                                        <div>
                                            <label className="flex items-start gap-4 cursor-pointer group mb-4">
                                                <div className="mt-1">
                                                    <input
                                                        type="radio"
                                                        name="billingMethod"
                                                        className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                                        checked={selectedMethod === 'card'}
                                                        onChange={() => setSelectedMethod('card')}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-lg font-medium text-gray-900 block mb-1">Payment card</span>
                                                    <span className="text-sm text-gray-500">Visa, Mastercard, American Express, Discover, Diners</span>
                                                </div>
                                            </label>

                                            {/* Card Details Form */}
                                            {selectedMethod === 'card' && (
                                                <div className="ml-9 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {/* Card Number */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="block text-sm font-medium text-gray-700">Card number</label>
                                                            <div className="flex gap-1">
                                                                {/* Card Icons Placeholder */}
                                                                <div className="h-5 w-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-500">VISA</div>
                                                                <div className="h-5 w-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-500">MC</div>
                                                                <div className="h-5 w-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-500">AMEX</div>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <CreditCard className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                name="cardNumber"
                                                                value={formData.cardNumber}
                                                                onChange={handleChange}
                                                                className={`block w-full pl-10 pr-32 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                                                                placeholder="1234 5678 9012 3456"
                                                            />
                                                            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                                                <Lock size={14} className="mr-1" />
                                                                <span className="text-xs">Securely stored</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Name Fields */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                value={formData.firstName}
                                                                onChange={handleChange}
                                                                className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                                            />
                                                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                                                            <input
                                                                type="text"
                                                                name="lastName"
                                                                value={formData.lastName}
                                                                onChange={handleChange}
                                                                className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                                            />
                                                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                                        </div>
                                                    </div>

                                                    {/* Expiry & CVV */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration month</label>
                                                                <input
                                                                    type="text"
                                                                    name="expiryMonth"
                                                                    value={formData.expiryMonth}
                                                                    onChange={handleChange}
                                                                    placeholder="MM"
                                                                    className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.expiryMonth ? 'border-red-500' : 'border-gray-300'}`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration year</label>
                                                                <input
                                                                    type="text"
                                                                    name="expiryYear"
                                                                    value={formData.expiryYear}
                                                                    onChange={handleChange}
                                                                    placeholder="YY"
                                                                    className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.expiryYear ? 'border-red-500' : 'border-gray-300'}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                                Security code
                                                                <HelpCircle size={14} className="ml-1 text-gray-400" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cvv"
                                                                value={formData.cvv}
                                                                onChange={handleChange}
                                                                placeholder="3 digits"
                                                                className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Billing Address Section */}
                                                    <div className="pt-4">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing address</h3>

                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                                <select
                                                                    name="country"
                                                                    value={formData.country}
                                                                    onChange={handleChange}
                                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                                                                >
                                                                    <option value="Ethiopia">Ethiopia</option>
                                                                    <option value="United States">United States</option>
                                                                    <option value="United Kingdom">United Kingdom</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
                                                                <input
                                                                    type="text"
                                                                    name="address1"
                                                                    value={formData.address1}
                                                                    onChange={handleChange}
                                                                    className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.address1 ? 'border-red-500' : 'border-gray-300'}`}
                                                                />
                                                                {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2 (optional)</label>
                                                                <input
                                                                    type="text"
                                                                    name="address2"
                                                                    value={formData.address2}
                                                                    onChange={handleChange}
                                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                                    <input
                                                                        type="text"
                                                                        name="city"
                                                                        value={formData.city}
                                                                        onChange={handleChange}
                                                                        className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                                                    />
                                                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal code (optional)</label>
                                                                    <input
                                                                        type="text"
                                                                        name="postalCode"
                                                                        value={formData.postalCode}
                                                                        onChange={handleChange}
                                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Save Button */}
                                                    <div className="pt-4">
                                                        <button
                                                            onClick={handleSave}
                                                            disabled={loading}
                                                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* PayPal Option */}
                                        <div>
                                            <label className="flex items-center gap-4 cursor-pointer group mb-4">
                                                <div className="mt-1">
                                                    <input
                                                        type="radio"
                                                        name="billingMethod"
                                                        className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                                        checked={selectedMethod === 'paypal'}
                                                        onChange={() => setSelectedMethod('paypal')}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* PayPal Logo Representation */}
                                                    <span className="text-2xl font-bold italic text-[#003087]">Pay</span>
                                                    <span className="text-2xl font-bold italic text-[#009cde]">Pal</span>
                                                </div>
                                            </label>

                                            {/* PayPal Redirection UI */}
                                            {selectedMethod === 'paypal' && (
                                                <div className="ml-9 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col items-center text-center py-6">
                                                    {/* Illustration Placeholder */}
                                                    <div className="w-48 h-32 bg-gray-100 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                                            <svg viewBox="0 0 100 60" className="w-full h-full">
                                                                <rect x="10" y="10" width="80" height="40" rx="4" fill="#e5e7eb" />
                                                                <rect x="10" y="10" width="80" height="10" rx="4" fill="#d1d5db" />
                                                                <circle cx="50" cy="30" r="8" fill="#10b981" />
                                                                <path d="M40 30 Q30 30 30 40" stroke="#ec4899" strokeWidth="2" fill="none" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                                        You are about to leave Freelancer
                                                    </h3>
                                                    <p className="text-gray-600 mb-8 max-w-md">
                                                        You will be redirected to PayPal so you can connect your PayPal account to Freelancer.
                                                    </p>

                                                    <button
                                                        onClick={() => window.location.href = 'https://www.paypal.com'}
                                                        className="px-8 py-2.5 bg-[#0070ba] text-white font-medium rounded-full hover:bg-[#003087] transition-colors flex items-center"
                                                    >
                                                        Pay with <span className="font-bold italic ml-1">PayPal</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <FreelancerProFooter className="mx-4 md:mx-8 mb-4 rounded-2xl" />
        </div>
    );
}
