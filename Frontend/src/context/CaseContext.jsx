
// src/context/CaseContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { caseService } from '../services/caseService';
import { useAuth } from './AuthContext';

const CaseContext = createContext();

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};

export const CaseProvider = ({ children }) => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCases = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await caseService.getCases();
      setCases(data.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseById = async (id) => {
    setLoading(true);
    try {
      const data = await caseService.getCaseById(id);
      setSelectedCase(data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching case:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData) => {
    const data = await caseService.createCase(caseData);
    setCases([data.data, ...cases]);
    return data;
  };

  const updateCase = async (id, caseData) => {
    const data = await caseService.updateCase(id, caseData);
    setCases(cases.map(c => c._id === id ? data.data : c));
    return data;
  };

  const deleteCase = async (id) => {
    await caseService.deleteCase(id);
    setCases(cases.filter(c => c._id !== id));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCases();
    }
  }, [isAuthenticated]);

  const value = {
    cases,
    selectedCase,
    loading,
    fetchCases,
    fetchCaseById,
    createCase,
    updateCase,
    deleteCase,
    setSelectedCase
  };

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
};