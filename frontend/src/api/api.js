import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://request-for-proposal-42ah.vercel.app/api' 
    : 'http://localhost:4000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Client for RFP Manager
 */

// RFP endpoints
export const createRFP = async (data) => {
  const response = await api.post('/rfps', data);
  return response.data;
};

export const getAllRFPs = async () => {
  const response = await api.get('/rfps');
  return response.data;
};

export const getRFPById = async (id) => {
  const response = await api.get(`/rfps/${id}`);
  return response.data;
};

export const sendRFPToVendors = async (rfpId, vendorIds) => {
  const response = await api.post(`/rfps/${rfpId}/send`, { vendorIds });
  return response.data;
};

export const compareProposals = async (rfpId) => {
  const response = await api.get(`/rfps/${rfpId}/compare`);
  return response.data;
};

export const simulateVendorReply = async (rfpId, vendorId, rawEmail) => {
  const response = await api.post('/rfps/email/webhook', {
    rfpId,
    vendorId,
    rawEmail,
  });
  return response.data;
};

// Vendor endpoints
export const getAllVendors = async () => {
  const response = await api.get('/vendors');
  return response.data;
};

export const createVendor = async (data) => {
  const response = await api.post('/vendors', data);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};

// Proposal endpoints
export const getAllProposals = async () => {
  const response = await api.get('/proposals');
  return response.data;
};

export default api;
