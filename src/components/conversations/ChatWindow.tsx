import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages } from '@/hooks/useMessages';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Send,
  Paperclip,
  Smile,
  User,
  Clock,
  MoreVertical,
  MessageCircle,
  Mail,
  Instagram,
  Phone,
  MessageSquare
} from 'lucide-react';

interface ChatWindowProps {
  conversationId: string | null;
}

export const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useMessages(conversationId);
  const { conversations } = useConversations();
  const { user } = useAuth();

  const selectedConversation = conversations.find(c => c.id === conversationId);

  const quickReplies = [
    'Consulta agendada com sucesso',
    'Exame disponível para retirada',
    'Documentos necessários: RG, CPF, carteirinha',
    'Horário disponível confirmado',
    'Aguarde, vou verificar para você'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageText.trim() && conversationId) {
      await sendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  const isAgentMessage = (message: any) => {
    return message.sender_id === user?.id;
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Selecione uma conversa para iniciar
          </p>
          <p className="text-sm text-muted-foreground">
            Escolha uma das conversas ativas na barra lateral
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              {selectedConversation?.patient?.name?.substring(0, 2).toUpperCase() || 'PA'}
            </div>
            <div>
              <p className="font-medium">{selectedConversation?.patient?.name || 'Paciente Anônimo'}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getChannelIcon(selectedConversation?.channel?.type || 'whatsapp')}
                <span>{selectedConversation?.channel?.name || 'WhatsApp'}</span>
                <span>•</span>
                <span>
                  {selectedConversation?.status === 'ativo' ? 'Online agora' : 
                   selectedConversation?.status === 'pendente' ? 'Aguardando' :
                   selectedConversation?.status === 'resolvido' ? 'Resolvido' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {loading ? (
            <div className="text-center">
              <p className="text-muted-foreground">Carregando mensagens...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${isAgentMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isAgentMessage(message)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isAgentMessage(message) ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Replies */}
      <div className="p-4 border-t bg-secondary/20">
        <div className="mb-3">
          <p className="text-sm font-medium mb-2">Respostas Rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setMessageText(reply)}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="min-h-[60px] resize-none"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-primary hover:bg-primary-hover"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};