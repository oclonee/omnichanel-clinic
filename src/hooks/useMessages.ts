import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  patient_id: string;
  content: string;
  message_type: 'texto' | 'imagem' | 'audio' | 'video' | 'documento';
  created_at: string;
  is_read: boolean;
  external_id: string;
  metadata?: any;
}

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async (convId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversationId || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          patient_id: '', // This would need to be determined based on the conversation
          content,
          message_type: 'texto' as const,
          external_id: crypto.randomUUID(),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      });

      // Refresh messages
      fetchMessages(conversationId);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    fetchMessages,
  };
};