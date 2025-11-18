import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversations, Conversation } from '@/hooks/useConversations';
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Instagram, 
  MessageCircle,
  Loader2 
} from 'lucide-react';

interface ConversationListProps {
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationList = ({ selectedConversation, onSelectConversation }: ConversationListProps) => {
  const { conversations, loading } = useConversations();
  const [searchTerm, setSearchTerm] = useState('');

  const getChannelIcon = (channelType: string) => {
    const iconClass = "h-4 w-4";
    switch (channelType?.toLowerCase()) {
      case 'whatsapp': return <MessageCircle className={`${iconClass} text-green-600`} />;
      case 'instagram': return <Instagram className={`${iconClass} text-pink-600`} />;
      case 'email': return <Mail className={`${iconClass} text-blue-600`} />;
      case 'phone': return <Phone className={`${iconClass} text-gray-600`} />;
      default: return <MessageCircle className={iconClass} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success';
      case 'pendente': return 'bg-warning';
      case 'resolvido': return 'bg-muted-foreground';
      case 'encerrado': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'pendente': return 'Pendente';
      case 'resolvido': return 'Resolvido';
      case 'encerrado': return 'Encerrado';
      default: return status;
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-80 border-r border-border bg-card flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversas Ativas</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input 
            placeholder="Buscar paciente..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${
                  selectedConversation === conversation.id ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {conversation.patient?.name?.substring(0, 2).toUpperCase() || 'PA'}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(conversation.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">
                        {conversation.patient?.name || 'Paciente Anônimo'}
                      </p>
                      <div className="flex items-center gap-2">
                        {getChannelIcon(conversation.channel?.type || 'whatsapp')}
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.last_message_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {conversation.subject || conversation.lastMessage?.content || 'Sem mensagens'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {conversation.channel?.name || 'WhatsApp'}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${conversation.status === 'ativo' ? 'border-success text-success' : ''}`}
                      >
                        {getStatusText(conversation.status)}
                      </Badge>
                      {conversation.unreadCount && conversation.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};