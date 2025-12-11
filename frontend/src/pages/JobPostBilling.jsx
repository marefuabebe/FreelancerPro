import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Lock, HelpCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { getStripeConfig } from '../api/paymentApi.js';
import { usePaymentStore } from '../store/usePaymentStore.js';
import FreelancerProFooter from '../components/common/UpworkFooter.jsx';
import toast from 'react-hot-toast';

// SVG Icons for Cards
const VisaIcon = () => (
  <svg viewBox="0 0 48 48" width="24" height="24" className="inline-block">
    <path fill="#1A1F71" d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z" opacity=".05" />
    <path fill="#1A1F71" d="M18.5 28.5L16.2 14h-2.6l-4.3 10.8h2.7l.8-2.3h3.4l.3 2.3h1.9zm-2.6-4.1l1.5-4.2.9 4.2h-2.4zM33.8 28.5l2.2-10.8H33l-1.5 7.6c-.2.8-.7 1.1-1.4 1.1h-2.3l-.3 2.1h4.3c.8 0 1.5-.3 1.7-1.1l.3-1.1.3 1.1c.1.5.5 1.1 1.4 1.1h2.6l-2.3-10.8h-2.2l1.4 7.6c.1.5.5.8 1.1.8h.9l.3 1.4h-2.9c-1.3 0-2.2-.9-2.5-2.1zM26.8 14h-1.8c-.6 0-1.1.2-1.3.8l-4.6 11.1h2.4l.9-2.5h3.1c.3 0 .6-.3.7-.6l.3-1.6c.1-.4-.2-.7-.6-.7h-2.6l1.6-4.8 2.6-.1c.4 0 .8-.3.9-.7l.4-1.9z" />
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 48" width="24" height="24" className="inline-block">
    <path fill="#EB001B" d="M18.8 24c0-3.4 1.4-6.5 3.7-8.7-2.5-2.1-5.7-3.3-9.2-3.3C6 12 0 17.4 0 24s6 12 13.3 12c3.5 0 6.7-1.2 9.2-3.3-2.3-2.2-3.7-5.3-3.7-8.7z" />
    <path fill="#F79E1B" d="M29.2 24c0 3.4-1.4 6.5-3.7 8.7 2.5 2.1 5.7 3.3 9.2 3.3 7.3 0 13.3-5.4 13.3-12s-6-12-13.3-12c-3.5 0-6.7 1.2-9.2 3.3 2.3 2.2 3.7 5.3 3.7 8.7z" />
    <path fill="#FF5F00" d="M25.5 15.3c-2.3 2.2-3.7 5.3-3.7 8.7s1.4 6.5 3.7 8.7c2.3-2.2 3.7-5.3 3.7-8.7s-1.4-6.5-3.7-8.7z" />
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 48" width="24" height="24" className="inline-block">
    <path fill="#006FCF" d="M4 0h40c2.2 0 4 1.8 4 4v40c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4z" />
    <path fill="#FFF" d="M16.4 18.6L13.7 30h-3l-1-6.4-1.2 6.4H5.6l2.7-11.4h3.8l1.1 6.6 1.3-6.6h1.9zm8.7 0l-1.8 11.4h-3.3l.9-5.2-2.6 5.2h-2.9l3.6-6.9-2.4-4.5h3.4l1.1 2.9 1.7-2.9h2.3zm5.7 0l-1.8 11.4h-3.4l1.8-11.4h3.4zm8.3 0l-1.4 8.7h-2.6l.3-1.9h-2.7l-.3 1.9h-3.3l1.8-11.4h8.2zm-3.6 4.3l.4-2.3h-2.6l-.4 2.3h2.6z" />
  </svg>
);

const BillingForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addPaymentMethod, loading } = usePaymentStore();
  const [billingMethod, setBillingMethod] = useState('card');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: `${firstName} ${lastName}`,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else {
        await addPaymentMethod({ paymentMethodId: paymentMethod.id });
        toast.success('Billing method added successfully');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Error adding billing method:', err);
      setError(err.message || 'Failed to add billing method');
      setProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#111827', // gray-900
        '::placeholder': {
          color: '#9CA3AF', // gray-400
        },
      },
      invalid: {
        color: '#EF4444', // red-500
      },
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Add a billing method</h2>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        {/* Payment Card Option */}
        <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${billingMethod === 'card' ? 'border-green-600 bg-green-50/10' : 'border-gray-200 hover:border-green-500'}`}>
          <input
            type="radio"
            name="billingMethod"
            value="card"
            checked={billingMethod === 'card'}
            onChange={(e) => setBillingMethod(e.target.value)}
            className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">Payment card</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Visa, Mastercard, American Express, Discover, Diners</p>
            <div className="flex gap-2">
              <VisaIcon />
              <MastercardIcon />
              <AmexIcon />
            </div>
          </div>
        </label>

        {/* PayPal Option */}
        <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${billingMethod === 'paypal' ? 'border-green-600 bg-green-50/10' : 'border-gray-200 hover:border-green-500'}`}>
          <input
            type="radio"
            name="billingMethod"
            value="paypal"
            checked={billingMethod === 'paypal'}
            onChange={(e) => setBillingMethod(e.target.value)}
            className="mt-1 w-5 h-5 text-green-600 focus:ring-green-500"
          />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#003087] rounded flex items-center justify-center">
              <span className="text-white font-bold italic text-lg">P</span>
            </div>
            <span className="text-[#003087] font-bold text-lg">PayPal</span>
          </div>
        </label>
      </div>

      {/* Payment Card Form */}
      {billingMethod === 'card' && (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Card Number */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">Card number</label>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Lock size={12} />
                <span>Securely stored</span>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              {/* Small icons above input */}
              <div className="flex gap-1">
                <VisaIcon />
                <MastercardIcon />
                <AmexIcon />
              </div>
            </div>
            <div className="relative">
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white">
                <CardNumberElement options={elementOptions} />
              </div>
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                required
              />
            </div>
          </div>

          {/* Expiration and Security Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiration date</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Security code
                <HelpCircle size={16} className="text-gray-400 cursor-help" />
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="text-green-600 hover:text-green-700 font-semibold text-lg px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || processing || loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {processing || loading ? 'Saving...' : 'Save Billing Method'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Initialize Stripe outside component to prevent prop changes
let stripePromiseCache = null;

const getStripePromise = async () => {
  if (!stripePromiseCache) {
    try {
      const { data } = await getStripeConfig();
      const key = (data.data || data).publishableKey;
      if (key) {
        stripePromiseCache = loadStripe(key);
      }
    } catch (err) {
      console.error('Failed to load Stripe config:', err);
    }
  }
  return stripePromiseCache;
};

export default function JobPostBilling() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStripePromise().then(promise => {
      setStripePromise(promise);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load Stripe:', err);
      toast.error('Failed to load payment configuration');
      setLoading(false);
    });
  }, []);

  const handleSuccess = () => {
    // Navigate to client dashboard after billing setup
    navigate('/nx/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Alert banners */}
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <span className="font-medium">Action required:</span> Verify your identity to build trust and connect with freelancers.
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Panel */}
          <div className="space-y-8">
            <div className="text-sm font-medium text-gray-600">1/3</div>
            <h1 className="text-4xl font-bold text-gray-900">
              Choose a billing method to start hiring the best
            </h1>
            <p className="text-lg text-gray-700">
              Adding a billing method has increased client hiring speed by up to 3X faster. There's no cost until you hire.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-base text-gray-700">
                  More than 57,694 new clients have added a billing method since Jan 31, 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div>
            {!loading && stripePromise ? (
              <Elements stripe={stripePromise}>
                <BillingForm onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FreelancerProFooter />
    </div>
  );
}
