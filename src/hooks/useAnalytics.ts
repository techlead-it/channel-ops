import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

interface AnalyticsEventData {
  event_type: string;
  event_data?: Record<string, unknown>;
  device_id?: string;
  site_id?: string;
  tenant_id?: string;
}

export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = useCallback(async (eventData: AnalyticsEventData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: eventData.event_type,
          event_data: (eventData.event_data || {}) as Json,
          device_id: eventData.device_id || null,
          site_id: eventData.site_id || null,
          tenant_id: eventData.tenant_id || null,
          user_id: user.id,
        }]);

      if (error) {
        console.error('Error tracking analytics event:', error);
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }, [user]);

  const trackPageView = useCallback((pageName: string, additionalData?: Record<string, unknown>) => {
    trackEvent({
      event_type: 'page_view',
      event_data: {
        page: pageName,
        url: window.location.pathname,
        ...additionalData,
      },
    });
  }, [trackEvent]);

  const trackAction = useCallback((action: string, category: string, additionalData?: Record<string, unknown>) => {
    trackEvent({
      event_type: 'user_action',
      event_data: {
        action,
        category,
        ...additionalData,
      },
    });
  }, [trackEvent]);

  const trackError = useCallback((error: string, context?: Record<string, unknown>) => {
    trackEvent({
      event_type: 'error',
      event_data: {
        error,
        ...context,
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackAction,
    trackError,
  };
}
