import { supabase } from '@/integrations/supabase/client';
import { omnichannelManager } from '@/integrations/omnichannel';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  recipientId: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: any;
}

export interface SLAConfig {
  responseTime: number; // em minutos
  resolutionTime: number; // em minutos
  escalationTime: number; // em minutos
  autoResponse: boolean;
  autoResponseMessage: string;
}

export class NotificationService {
  private slaConfig: SLAConfig = {
    responseTime: 5, // 5 minutos para primeira resposta
    resolutionTime: 60, // 1 hora para resolução
    escalationTime: 15, // 15 minutos para escalação
    autoResponse: true,
    autoResponseMessage: 'Obrigado por entrar em contato! Um de nossos atendentes irá respondê-lo em breve.'
  };

  constructor() {
    this.startSLAMonitoring();
  }

  // Criar notificação
  async createNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          recipient_id: notification.recipientId,
          is_read: false,
          metadata: notification.metadata
        });

      if (error) throw error;

      // Enviar notificação em tempo real
      this.sendRealTimeNotification(notification);

      return { success: true };
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return { success: false, error };
    }
  }

  // Notificar agente sobre nova conversa
  async notifyNewConversation(agentId: string, conversationId: string, patientName: string) {
    await this.createNotification({
      type: 'info',
      title: 'Nova Conversa Atribuída',
      message: `Você recebeu uma nova conversa com ${patientName}`,
      recipientId: agentId,
      metadata: { conversationId, patientName }
    });
  }

  // Notificar sobre SLA violado
  async notifySLAViolation(conversationId: string, violationType: 'response' | 'resolution' | 'escalation') {
    const messages = {
      response: 'Tempo de resposta SLA violado',
      resolution: 'Tempo de resolução SLA violado',
      escalation: 'Conversa precisa ser escalada'
    };

    // Notificar gerentes
    const { data: managers } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['gerente', 'admin']);

    if (managers) {
      for (const manager of managers) {
        await this.createNotification({
          type: 'warning',
          title: 'SLA Violado',
          message: `${messages[violationType]} - Conversa ${conversationId}`,
          recipientId: manager.id,
          metadata: { conversationId, violationType }
        });
      }
    }
  }

  // Enviar resposta automática
  async sendAutoResponse(conversationId: string, channel: string, patientContact: string) {
    try {
      const response = await omnichannelManager.sendMessage(
        channel,
        patientContact,
        this.slaConfig.autoResponseMessage
      );

      if (response.success) {
        console.log(`Resposta automática enviada para conversa ${conversationId}`);
      }
    } catch (error) {
      console.error('Erro ao enviar resposta automática:', error);
    }
  }

  // Sistema de lembretes automáticos
  async scheduleReminder(conversationId: string, reminderType: 'followup' | 'appointment' | 'exam') {
    const reminderTimes = {
      followup: 24 * 60, // 24 horas
      appointment: 2 * 60, // 2 horas
      exam: 48 * 60 // 48 horas
    };

    const reminderTime = reminderTimes[reminderType];
    const scheduledTime = new Date(Date.now() + reminderTime * 60 * 1000);

    // Aqui seria implementado um sistema de agendamento de tarefas
    // Por enquanto, vamos simular com setTimeout
    setTimeout(async () => {
      await this.sendReminder(conversationId, reminderType);
    }, reminderTime * 60 * 1000);

    console.log(`Lembrete ${reminderType} agendado para conversa ${conversationId} em ${reminderTime} minutos`);
  }

  private async sendReminder(conversationId: string, reminderType: string) {
    const messages = {
      followup: 'Lembrete: Verificar se o paciente precisa de acompanhamento',
      appointment: 'Lembrete: Consulta em 2 horas',
      exam: 'Lembrete: Resultado de exame disponível'
    };

    // Buscar conversa e agente
    const { data: conversation } = await supabase
      .from('conversations')
      .select('assigned_agent_id, patient_id')
      .eq('id', conversationId)
      .single();

    if (conversation?.assigned_agent_id) {
      await this.createNotification({
        type: 'info',
        title: 'Lembrete',
        message: messages[reminderType as keyof typeof messages],
        recipientId: conversation.assigned_agent_id,
        metadata: { conversationId, reminderType }
      });
    }
  }

  // Monitoramento de SLA
  private startSLAMonitoring() {
    setInterval(async () => {
      await this.checkSLAViolations();
    }, 60000); // Verificar a cada minuto
  }

  private async checkSLAViolations() {
    try {
      // Buscar conversas ativas
      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('status', 'ativo');

      if (!conversations) return;

      const now = new Date();

      for (const conversation of conversations) {
        const lastMessage = await this.getLastMessage(conversation.id);
        if (!lastMessage) continue;

        const timeSinceLastMessage = (now.getTime() - new Date(lastMessage.created_at).getTime()) / (1000 * 60);
        const timeSinceCreation = (now.getTime() - new Date(conversation.created_at).getTime()) / (1000 * 60);

        // Verificar violação de tempo de resposta
        if (timeSinceLastMessage > this.slaConfig.responseTime && !conversation.assigned_agent_id) {
          await this.notifySLAViolation(conversation.id, 'response');
        }

        // Verificar violação de tempo de resolução
        if (timeSinceCreation > this.slaConfig.resolutionTime) {
          await this.notifySLAViolation(conversation.id, 'resolution');
        }

        // Verificar necessidade de escalação
        if (timeSinceLastMessage > this.slaConfig.escalationTime && conversation.assigned_agent_id) {
          await this.notifySLAViolation(conversation.id, 'escalation');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar violações de SLA:', error);
    }
  }

  private async getLastMessage(conversationId: string) {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1);

    return messages?.[0];
  }

  // Enviar notificação em tempo real
  private sendRealTimeNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) {
    // Aqui seria implementada a notificação em tempo real via Supabase
    console.log('Enviando notificação em tempo real:', notification);
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return { success: false, error };
    }
  }

  // Buscar notificações do usuário
  async getUserNotifications(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return { success: false, error };
    }
  }

  // Configurar SLA
  updateSLAConfig(config: Partial<SLAConfig>) {
    this.slaConfig = { ...this.slaConfig, ...config };
    console.log('Configuração de SLA atualizada:', this.slaConfig);
  }

  getSLAConfig() {
    return { ...this.slaConfig };
  }
}

// Singleton instance
export const notificationService = new NotificationService();
