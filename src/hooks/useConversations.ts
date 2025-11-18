import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  patient_id: string;
  channel_id: string;
  status: 'ativo' | 'pendente' | 'resolvido' | 'encerrado';
  created_at: string;
  updated_at: string;
  assigned_agent_id?: string;
  subject: string;
  priority: number;
  last_message_at: string;
  // Patient info
  patient?: {
    name: string;
    email: string;
    phone?: string;
  };
  // Channel info
  channel?: {
    name: string;
    type: string;
  };
  // Last message info
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  unreadCount?: number;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          patient:patients(name, email, phone),
          channel:channels(name, type),
          messages(content, created_at)
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match our interface
      const transformedConversations: Conversation[] = data?.map(conv => ({
        id: conv.id,
        patient_id: conv.patient_id,
        channel_id: conv.channel_id,
        status: conv.status as 'ativo' | 'pendente' | 'resolvido' | 'encerrado',
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        assigned_agent_id: conv.assigned_agent_id,
        subject: conv.subject,
        priority: conv.priority,
        last_message_at: conv.last_message_at,
        patient: conv.patient ? {
          name: conv.patient.name,
          email: conv.patient.email,
          phone: conv.patient.phone,
        } : undefined,
        channel: conv.channel ? {
          name: conv.channel.name,
          type: conv.channel.type,
        } : undefined,
        lastMessage: conv.messages && conv.messages.length > 0 ? {
          content: conv.messages[0].content,
          timestamp: conv.messages[0].created_at,
        } : undefined,
        unreadCount: 0, // This would need to be calculated based on read status
      })) || [];

      setConversations(transformedConversations);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          assigned_agent_id: user?.id,
          status: 'ativo'
        })
        .eq('id', conversationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Conversa atribuída",
        description: "Você agora está responsável por esta conversa.",
      });

      // Refresh conversations
      fetchConversations();
    } catch (error: any) {
      toast({
        title: "Erro ao atribuir conversa",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const updateConversationStatus = async (conversationId: string, status: 'ativo' | 'pendente' | 'resolvido' | 'encerrado') => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Status atualizado",
        description: `Conversa marcada como ${status === 'resolvido' ? 'resolvida' : status === 'ativo' ? 'ativa' : status === 'pendente' ? 'pendente' : 'encerrada'}.`,
      });

      // Refresh conversations
      fetchConversations();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    fetchConversations,
    assignConversation,
    updateConversationStatus,
  };
};