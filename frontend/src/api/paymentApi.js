import api from './axiosInstance.js'

export const getStripeConfig = async () => {
    const response = await api.get('/config/stripe')
    return response.data
}

export const createPaymentIntent = async (amount, currency = 'usd') => {
    const response = await api.post('/payments/create-intent', { amount, currency })
    return response.data
}

export const addPaymentMethod = async (paymentMethodData) => {
    const response = await api.post('/payments/methods', paymentMethodData)
    return response.data
}

export const getPaymentMethods = async () => {
    const response = await api.get('/payments/methods')
    return response.data
}

export const deletePaymentMethod = async (methodId) => {
    const response = await api.delete(`/payments/methods/${methodId}`)
    return response.data
}

export const getTransactions = async (params) => {
    const response = await api.get('/payments/transactions', { params })
    return response.data
}

export const getBalance = async () => {
    const response = await api.get('/payments/balance')
    return response.data
}

export const withdraw = async (withdrawalData) => {
    const response = await api.post('/payments/withdraw', withdrawalData)
    return response.data
}

export const depositFunds = async (depositData) => {
    const response = await api.post('/payments/deposit', depositData)
    return response.data
}

export const processPayment = async (paymentData) => {
    const response = await api.post('/payments/process', paymentData)
    return response.data
}

export const releasePayment = async (contractId) => {
    const response = await api.post(`/payments/release/${contractId}`)
    return response.data
}
