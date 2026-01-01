import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StripePaymentForm({ amount, onSuccess, onError }) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const isSetupMode = !amount

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setLoading(true)

        try {
            const cardElement = elements.getElement(CardElement)

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            })

            if (error) {
                toast.error(error.message)
                onError?.(error)
            } else {
                toast.success(isSetupMode ? 'Card added successfully!' : 'Payment successful!')
                onSuccess?.(paymentMethod)
            }
        } catch (error) {
            toast.error(isSetupMode ? 'Failed to add card' : 'Payment failed')
            onError?.(error)
        } finally {
            setLoading(false)
        }
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                        <CreditCard size={20} />
                        <span>Card Information</span>
                    </div>
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {!isSetupMode && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total Amount:</span>
                        <span className="text-2xl font-bold text-green-600">
                            ${(amount / 100).toFixed(2)}
                        </span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading
                    ? 'Processing...'
                    : isSetupMode
                        ? 'Save Payment Method'
                        : `Pay $${(amount / 100).toFixed(2)}`
                }
            </button>

            <p className="text-xs text-gray-500 text-center">
                Your payment information is secure and encrypted
            </p>
        </form>
    )
}
