import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const getOpportunities = () => api.get('/api/opportunities')
export const getCustomerStats = () => api.get('/api/customers/stats')
export const getCampaigns = () => api.get('/api/campaigns/')
export const sendChat = (message) => api.post('/api/chat', { message })
export const launchCampaign = (data) => api.post('/api/campaigns/', data)
export const getCampaignAnalytics = (id) => api.get(`/api/analytics/campaigns/${id}`)
export const getOverview = () => api.get('/api/analytics/overview')
export const deleteCampaign = (id) => api.delete(`/api/campaigns/${id}`)