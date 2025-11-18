import { supabase } from '@/integrations/supabase/client';

export interface QueueItem {
  id: string;
  conversationId: string;
  patientId: string;
  channel: string;
  priority: number;
  waitingSince: Date;
  estimatedWaitTime: number; // em minutos
  assignedAgentId?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: 'atendente' | 'gerente' | 'admin';
  isOnline: boolean;
  currentConversations: number;
  maxConversations: number;
  specialties: string[];
  rating: number;
  lastActivity: Date;
}

export class QueueManager {
  private queue: QueueItem[] = [];
  private agents: Map<string, Agent> = new Map();
  private isProcessing = false;

  constructor() {
    this.loadAgents();
    this.startQueueProcessor();
  }

  private async loadAgents() {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_online', true);

      if (profiles) {
        profiles.forEach(profile => {
          this.agents.set(profile.id, {
            id: profile.id,
            name: profile.name,
            role: profile.role,
            isOnline: profile.is_online || false,
            currentConversations: 0,
            maxConversations: profile.role === 'gerente' ? 8 : 5,
            specialties: [],
            rating: 4.5,
            lastActivity: new Date(profile.last_activity || Date.now())
          });
        });
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    }
  }

  async addToQueue(conversationId: string, patientId: string, channel: string, priority: number = 1) {
    const queueItem: QueueItem = {
      id: crypto.randomUUID(),
      conversationId,
      patientId,
      channel,
      priority,
      waitingSince: new Date(),
      estimatedWaitTime: this.calculateEstimatedWaitTime(),
    };

    this.queue.push(queueItem);
    this.queue.sort((a, b) => b.priority - a.priority); // Prioridade mais alta primeiro

    console.log(`Conversa ${conversationId} adicionada à fila com prioridade ${priority}`);
    
    // Tentar atribuir imediatamente
    this.tryAssignConversation(queueItem);
  }

  private calculateEstimatedWaitTime(): number {
    const activeAgents = Array.from(this.agents.values()).filter(a => a.isOnline);
    const totalCapacity = activeAgents.reduce((sum, agent) => sum + (agent.maxConversations - agent.currentConversations), 0);
    
    if (totalCapacity === 0) return 30; // 30 minutos se não há agentes disponíveis
    
    const queueLength = this.queue.length;
    return Math.ceil(queueLength / totalCapacity) * 5; // 5 minutos por conversa
  }

  private async tryAssignConversation(queueItem: QueueItem) {
    const availableAgent = this.findBestAvailableAgent(queueItem);
    
    if (availableAgent) {
      await this.assignConversation(queueItem, availableAgent);
    }
  }

  private findBestAvailableAgent(queueItem: QueueItem): Agent | null {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => 
        agent.isOnline && 
        agent.currentConversations < agent.maxConversations
      )
      .sort((a, b) => {
        // Priorizar agentes com menos conversas ativas
        if (a.currentConversations !== b.currentConversations) {
          return a.currentConversations - b.currentConversations;
        }
        // Em caso de empate, priorizar por rating
        return b.rating - a.rating;
      });

    return availableAgents[0] || null;
  }

  private async assignConversation(queueItem: QueueItem, agent: Agent) {
    try {
      // Atualizar conversa no banco
      const { error } = await supabase
        .from('conversations')
        .update({ 
          assigned_agent_id: agent.id,
          status: 'ativo'
        })
        .eq('id', queueItem.conversationId);

      if (error) throw error;

      // Atualizar agente local
      agent.currentConversations++;
      
      // Remover da fila
      this.queue = this.queue.filter(item => item.id !== queueItem.id);

      console.log(`Conversa ${queueItem.conversationId} atribuída ao agente ${agent.name}`);

      // Notificar agente (aqui seria implementada a notificação em tempo real)
      this.notifyAgent(agent.id, queueItem);

    } catch (error) {
      console.error('Erro ao atribuir conversa:', error);
    }
  }

  private notifyAgent(agentId: string, queueItem: QueueItem) {
    // Implementar notificação em tempo real via Supabase
    console.log(`Notificando agente ${agentId} sobre nova conversa ${queueItem.conversationId}`);
  }

  async removeFromQueue(conversationId: string) {
    this.queue = this.queue.filter(item => item.conversationId !== conversationId);
  }

  async updateAgentStatus(agentId: string, isOnline: boolean, currentConversations: number) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.isOnline = isOnline;
      agent.currentConversations = currentConversations;
      agent.lastActivity = new Date();
    }
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      waitingTime: this.calculateEstimatedWaitTime(),
      activeAgents: Array.from(this.agents.values()).filter(a => a.isOnline).length,
      totalAgents: this.agents.size
    };
  }

  getQueueItems() {
    return this.queue.map(item => ({
      ...item,
      waitingTime: Math.floor((Date.now() - item.waitingSince.getTime()) / 60000) // em minutos
    }));
  }

  private startQueueProcessor() {
    // Processar fila a cada 30 segundos
    setInterval(() => {
      this.processQueue();
    }, 30000);
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    // Tentar atribuir conversas em espera
    for (const queueItem of this.queue) {
      const availableAgent = this.findBestAvailableAgent(queueItem);
      if (availableAgent) {
        await this.assignConversation(queueItem, availableAgent);
      }
    }

    this.isProcessing = false;
  }

  // Métodos para gestão de prioridades
  async updatePriority(conversationId: string, newPriority: number) {
    const queueItem = this.queue.find(item => item.conversationId === conversationId);
    if (queueItem) {
      queueItem.priority = newPriority;
      this.queue.sort((a, b) => b.priority - a.priority);
    }
  }

  async escalateConversation(conversationId: string) {
    await this.updatePriority(conversationId, 10); // Prioridade máxima
    console.log(`Conversa ${conversationId} escalada para prioridade máxima`);
  }

  // Métodos para relatórios
  getAgentPerformance(agentId: string) {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    return {
      name: agent.name,
      role: agent.role,
      currentLoad: agent.currentConversations,
      maxCapacity: agent.maxConversations,
      utilization: (agent.currentConversations / agent.maxConversations) * 100,
      rating: agent.rating,
      lastActivity: agent.lastActivity
    };
  }

  getAllAgentsPerformance() {
    return Array.from(this.agents.values()).map(agent => this.getAgentPerformance(agent.id));
  }
}

// Singleton instance
export const queueManager = new QueueManager();
