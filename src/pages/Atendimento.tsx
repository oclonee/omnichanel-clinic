import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList } from '@/components/conversations/ConversationList';
import { ChatWindow } from '@/components/conversations/ChatWindow';
import { 
  Activity,
  BarChart3,
  Users,
  ArrowLeft,
  LogOut,
  MessageSquare,
  MessageCircle,
  Instagram,
  Mail,
  Phone
} from 'lucide-react';

const Atendimento = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user, signOut } = useAuth();

  // Mock data para conversas
  const conversations = [
    {
      id: 1,
      paciente: 'Maria Silva',
      canal: 'WhatsApp',
      status: 'ativo',
      lastMessage: 'Gostaria de remarcar minha consulta',
      timestamp: '14:30',
      unread: 2,
      avatar: 'MS'
    },
    {
      id: 2,
      paciente: 'João Santos',
      canal: 'Instagram',
      status: 'aguardando',
      lastMessage: 'Quando sai o resultado do meu exame?',
      timestamp: '14:15',
      unread: 1,
      avatar: 'JS'
    },
    {
      id: 3,
      paciente: 'Ana Costa',
      canal: 'E-mail',
      status: 'resolvido',
      lastMessage: 'Obrigada pelo atendimento!',
      timestamp: '13:45',
      unread: 0,
      avatar: 'AC'
    },
    {
      id: 4,
      paciente: 'Pedro Lima',
      canal: 'Telefone',
      status: 'ativo',
      lastMessage: 'Preciso cancelar urgente',
      timestamp: '13:20',
      unread: 3,
      avatar: 'PL'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'patient',
      content: 'Olá, boa tarde! Gostaria de remarcar minha consulta com o Dr. Carlos que estava marcada para amanhã.',
      timestamp: '14:25',
      status: 'delivered'
    },
    {
      id: 2,
      sender: 'agent',
      content: 'Boa tarde, Maria! Claro, posso te ajudar com isso. Qual seria a melhor data para você?',
      timestamp: '14:27',
      status: 'delivered'
    },
    {
      id: 3,
      sender: 'patient',
      content: 'Seria possível na próxima semana? Terça ou quarta-feira de manhã?',
      timestamp: '14:30',
      status: 'delivered'
    }
  ];

  const quickReplies = [
    'Consulta agendada com sucesso',
    'Exame disponível para retirada',
    'Documentos necessários: RG, CPF, carteirinha',
    'Horário disponível confirmado',
    'Aguarde, vou verificar para você'
  ];

  // useEffect para scroll automático das mensagens
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const getChannelIcon = (canal: string) => {
    const iconClass = "h-4 w-4";
    switch (canal) {
      case 'WhatsApp': return <MessageCircle className={`${iconClass} text-green-600`} />;
      case 'Instagram': return <Instagram className={`${iconClass} text-pink-600`} />;
      case 'E-mail': return <Mail className={`${iconClass} text-blue-600`} />;
      case 'Telefone': return <Phone className={`${iconClass} text-gray-600`} />;
      default: return <MessageCircle className={iconClass} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success';
      case 'aguardando': return 'bg-warning';
      case 'resolvido': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aqui seria enviada a mensagem para o backend
      console.log('Enviando mensagem:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Voltar ao Dashboard</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-4">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Atendimento Omnichannel</h1>
                  <p className="text-sm text-muted-foreground">Gerencie todas as conversas em tempo real</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="default" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Atendimento
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
              </div>
              
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Atendente</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="h-[calc(100vh-80px)] flex">
        {/* Conversation List */}
        <ConversationList 
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />

        {/* Chat Window */}
        <ChatWindow conversationId={selectedConversation} />

        {/* Patient Info Sidebar - placeholder for future implementation */}
        {selectedConversation && (
          <div className="w-80 border-l border-border bg-card p-4">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium mx-auto mb-3">
                  PA
                </div>
                <h3 className="font-semibold">Informações do Paciente</h3>
                <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atendimento;