
// src/services/caseService.js
import api from './api';

export const caseService = {
  getCases: async () => {
    const response = await api.get('/cases');
    return response.data;
  },

  getCaseById: async (id) => {
    const response = await api.get(`/cases/${id}`);
    return response.data;
  },

  createCase: async (formData) => {
    const response = await api.post('/cases', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateCase: async (id, data) => {
    const response = await api.put(`/cases/${id}`, data);
    return response.data;
  },

  deleteCase: async (id) => {
    const response = await api.delete(`/cases/${id}`);
    return response.data;
  },

  uploadDocument: async (caseId, formData) => {
    const response = await api.post(`/cases/${caseId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  scheduleHearing: async (caseId, hearingData) => {
    const response = await api.post(`/cases/${caseId}/hearings`, hearingData);
    return response.data;
  }
};
