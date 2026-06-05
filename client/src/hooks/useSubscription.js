import { useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContext.jsx';

/**
 * TrendAura Subscription Gatekeeper Hook
 * Streams real-time financial tiers and active feature permissions.
 */
export default function useSubscription() {
  const context = useContext(SubscriptionContext);
  
  if (!context) {
    throw new Error('🚨 Technical Fault: useSubscription must be executed within an active SubscriptionProvider node.');
  }
  
  return context;
}