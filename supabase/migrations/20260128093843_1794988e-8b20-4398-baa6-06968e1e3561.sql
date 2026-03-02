-- Drop the overly permissive policy
DROP POLICY "System can insert notifications" ON public.notifications;

-- Create more restrictive policy - only authenticated users can insert, and must insert for themselves
CREATE POLICY "Users can insert their own notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert notifications (for system/background jobs)
CREATE POLICY "Service role can insert any notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.role() = 'service_role');