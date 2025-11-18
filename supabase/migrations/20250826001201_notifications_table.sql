-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Create trigger for timestamp updates
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
