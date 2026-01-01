import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Eye, EyeOff, CreditCard, DollarSign, TrendingUp, Plus, X, CheckCircle } from 'lucide-react';
import { usePaymentStore } from '../store/usePaymentStore.js';
import { getStripeConfig } from '../api/paymentApi.js';
import StripePaymentForm from '../components/payments/StripePaymentForm.jsx';
import api from '../api/axiosInstance.js';

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const consultationData = location.state; // Get consultation details from navigation

  const { transactions, paymentMethods, loading, error, fetchTransactions, fetchPaymentMethods, addPaymentMethod, requestPayout } = usePaymentStore();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [visibleCards, setVisibleCards] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchPaymentMethods();

    const loadConfig = async () => {
      try {
        const { data } = await getStripeConfig();
        const key = (data.data || data).publishableKey;
        if (key) {
          setStripePromise(loadStripe(key));
        }
      } catch (err) {
        console.error('Failed to load Stripe config:', err);
      }
    };
    loadConfig();
  }, [fetchTransactions, fetchPaymentMethods]);

  const handlePaymentSuccess = async (paymentMethod) => {
    try {
      await addPaymentMethod({
        paymentMethodId: paymentMethod.id,
        ...paymentMethod.card
      });
      setShowPaymentForm(false);
      // If we have consultation data, auto-select this new payment method
      if (consultationData) {
        setSelectedPaymentMethod(paymentMethod.id);
      }
    } catch (error) {
      console.error('Failed to save payment method:', error);
    }
  };

  const handlePayout = async (e) => {
    e.preventDefault();
    try {
      await requestPayout({ amount: parseFloat(payoutAmount) });
      alert('Payout request submitted successfully!');
      setShowPayoutForm(false);
      setPayoutAmount('');
    } catch (error) {
      console.error('Payout failed:', error);
    }
  };

  const handleConsultationPayment = async () => {
    if (!selectedPaymentMethod || !consultationData) return;

    setProcessingPayment(true);
    try {
      // Make payment API call
      const response = await api.post('/payments', {
        amount: consultationData.amount,
        description: consultationData.description,
        paymentMethodId: selectedPaymentMethod,
        metadata: {
          type: 'consultation',
          freelancerId: consultationData.freelancerId,
          duration: consultationData.duration
        }
      });

      if (response.data.success) {
        setPaymentSuccess(true);
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              message: 'Consultation booked successfully!'
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const toggleCardVisibility = (cardId) => {
    setVisibleCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  if (loading && !transactions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payments</h1>
              <p className="text-blue-100">Manage your payment methods and transactions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Payment
              </button>
              <button
                onClick={() => setShowPayoutForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors border border-blue-400"
              >
                <DollarSign className="w-5 h-5" />
                Request Payout
              </button>
            </div>
          </div>
        </div>

        {/* Consultation Checkout Section - Only show if coming from consultation booking */}
        {consultationData && !paymentSuccess && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>

            {/* Consultation Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Consultation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Freelancer:</span>
                  <span className="font-medium text-gray-900">{consultationData.freelancerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{consultationData.duration} minutes</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-green-200">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-green-600">${consultationData.amount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No payment methods available</p>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Add a payment method to continue →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const cardId = method.id || method._id;
                    const isSelected = selectedPaymentMethod === cardId;

                    return (
                      <label
                        key={cardId}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected
                            ? 'border-green-600 bg-green-50 ring-2 ring-green-600'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={cardId}
                          checked={isSelected}
                          onChange={() => setSelectedPaymentMethod(cardId)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-green-600' : 'border-gray-400'
                            }`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                          </div>
                          <CreditCard className={`w-6 h-6 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <div className="font-semibold capitalize text-gray-900">
                              {method.brand || 'Card'}
                            </div>
                            <div className="text-sm text-gray-600 font-mono">
                              •••• •••• •••• {method.last4 || '••••'}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConsultationPayment}
                disabled={!selectedPaymentMethod || processingPayment}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  `Pay $${consultationData.amount}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment Success Message */}
        {paymentSuccess && (
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your consultation has been booked successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No payment methods added</p>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first payment method →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const cardId = method.id || method._id;
                  const isVisible = visibleCards[cardId];

                  return (
                    <div key={cardId} className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold capitalize text-gray-900 text-lg mb-1">
                              {method.brand || 'Card'}
                            </div>
                            {isVisible ? (
                              <div className="space-y-2 mt-3">
                                <div className="text-sm text-gray-700 font-mono bg-white px-3 py-2 rounded border">
                                  {method.cardNumber || `•••• •••• •••• ${method.last4 || '••••'}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Expires: {method.expiryMonth || method.expMonth || '••'}/{method.expiryYear || method.expYear || '••'}
                                </div>
                                {method.billingAddress && Object.keys(method.billingAddress).length > 0 && (
                                  <div className="text-sm text-gray-600">
                                    📍 {method.billingAddress.street || ''} {method.billingAddress.city || ''} {method.billingAddress.zip || ''}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-600 mt-2 font-mono">
                                •••• •••• •••• {method.last4 || '••••'}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleCardVisibility(cardId)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={isVisible ? "Hide card details" : "Show card details"}
                        >
                          {isVisible ? (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id || transaction._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Add Payment Method</h3>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentForm(false)}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-3">Loading payment system...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Payout Modal */}
      {showPayoutForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Request Payout</h3>
              <button
                onClick={() => setShowPayoutForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handlePayout} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Request Payout
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayoutForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
