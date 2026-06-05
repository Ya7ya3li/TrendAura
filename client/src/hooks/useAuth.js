import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * TrendAura Authentication Connector Hook
 * Exposes identity status, profile metadata, and logout routines.
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('🚨 Technical Fault: useAuth must be executed within an active AuthProvider node.');
  }
  
  return context;
}