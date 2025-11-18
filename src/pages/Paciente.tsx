import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Phone, 
  Mail,
  Instagram,
  MessageCircle,
  Activity,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Send
} from 'lucide-react';

const Paciente = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'conversas' | 'agendamento' | 'documentos'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'instagram' | 'facebook' | 'email' | 'site'>('whatsapp');
  const { user, signOut } = useAuth();

  // Mock data para demonstração
  const patientInfo = {
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    birthDate: '15/03/1985',
    address: 'Rua das Flores, 123 - São Paulo/SP'
  };

  const conversations = [
    {
      id: 1,
      channel: 'WhatsApp',
      subject: 'Agendamento consulta cardiologista',
      status: 'resolvido',
      lastMessage: 'Consulta confirmada para próxima terça às 14h',
      timestamp: '2 horas atrás',
      agent: 'Dr. Carlos'
    },
    {
      id: 2,
      channel: 'Instagram',
      subject: 'Resultado de exame',
      status: 'ativo',
      lastMessage: 'Seu exame está disponível para retirada',
      timestamp: '5 minutos atrás',
      agent: 'Ana Costa'
    },
    {
      id: 3,
      channel: 'E-mail',
      subject: 'Cancelamento de consulta',
      status: 'resolvido',
      lastMessage: 'Consulta cancelada com sucesso',
      timestamp: '1 dia atrás',
      agent: 'Sistema'
    }
  ];

  const appointments = [
    {
      id: 1,
      specialty: 'Cardiologia',
      doctor: 'Dr. Carlos Mendes',
      date: '15/12/2024',
      time: '14:00',
      status: 'confirmado'
    },
    {
      id: 2,
      specialty: 'Dermatologia',
      doctor: 'Dra. Ana Paula',
      date: '20/12/2024',
      time: '10:30',
      status: 'pendente'
    }
  ];

  const documents = [
    {
      id: 1,
      name: 'Exame de Sangue',
      type: 'PDF',
      date: '10/12/2024',
      status: 'disponível'
    },
    {
      id: 2,
      name: 'Eletrocardiograma',
      type: 'PDF',
      date: '08/12/2024',
      status: 'disponível'
    },
    {
      id: 3,
      name: 'Receita Médica',
      type: 'PDF',
      date: '05/12/2024',
      status: 'disponível'
    }
  ];

  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case 'WhatsApp': return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'Instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'Facebook': return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'E-mail': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'Site': return <MessageSquare className="h-4 w-4 text-gray-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo': return <Badge variant="default" className="bg-success text-success-foreground">Ativo</Badge>;
      case 'pendente': return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pendente</Badge>;
      case 'resolvido': return <Badge variant="outline">Resolvido</Badge>;
      case 'confirmado': return <Badge variant="default" className="bg-success text-success-foreground">Confirmado</Badge>;
      case 'disponível': return <Badge variant="default" className="bg-success text-success-foreground">Disponível</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Enviando mensagem:', newMessage, 'pelo canal:', selectedChannel);
      setNewMessage('');
      // Aqui seria implementado o envio real da mensagem
    }
  };

  const handleScheduleAppointment = () => {
    console.log('Abrindo agendamento de consulta');
    // Aqui seria implementada a lógica de agendamento
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Portal do Paciente</h1>
                <p className="text-sm text-muted-foreground">Clínica São Lucas - Acompanhe seus atendimentos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{patientInfo.name}</p>
                  <p className="text-xs text-muted-foreground">Paciente</p>
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

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="conversas">Conversas</TabsTrigger>
            <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Informações do Paciente */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Seus dados cadastrais na clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                      <p className="font-medium">{patientInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                      <p className="font-medium">{patientInfo.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                      <p className="font-medium">{patientInfo.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CPF</label>
                      <p className="font-medium">{patientInfo.cpf}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                      <p className="font-medium">{patientInfo.birthDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                      <p className="font-medium">{patientInfo.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo de Atividades */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Próximas Consultas */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Próximas Consultas
                  </CardTitle>
                  <CardDescription>
                    Suas consultas agendadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.filter(apt => apt.status === 'confirmado').slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="p-3 rounded-lg bg-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{appointment.specialty}</p>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} às {appointment.time}
                      </p>
                    </div>
                  ))}
                  
                  <Button className="w-full" variant="outline" onClick={handleScheduleAppointment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar Nova Consulta
                  </Button>
                </CardContent>
              </Card>

              {/* Conversas Recentes */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Conversas Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimas interações com a clínica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conversations.slice(0, 3).map((conversation) => (
                    <div key={conversation.id} className="p-3 rounded-lg bg-secondary/20">
                      <div className="flex items-center gap-2 mb-2">
                        {getChannelIcon(conversation.channel)}
                        <p className="font-medium text-sm">{conversation.subject}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.timestamp} • {conversation.agent}
                      </p>
                    </div>
                  ))}
                  
                  <Link to="/paciente?tab=conversas" className="w-full">
                    <Button className="w-full" variant="outline">
                      Ver Todas as Conversas
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Documentos Recentes */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documentos Recentes
                  </CardTitle>
                  <CardDescription>
                    Seus exames e receitas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.slice(0, 3).map((document) => (
                    <div key={document.id} className="p-3 rounded-lg bg-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{document.name}</p>
                        {getStatusBadge(document.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{document.type} • {document.date}</p>
                    </div>
                  ))}
                  
                  <Link to="/paciente?tab=documentos" className="w-full">
                    <Button className="w-full" variant="outline">
                      Ver Todos os Documentos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversas Tab */}
          <TabsContent value="conversas" className="space-y-8">
            {/* Nova Mensagem */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Enviar Nova Mensagem
                </CardTitle>
                <CardDescription>
                  Entre em contato com a clínica pelo canal de sua preferência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {['whatsapp', 'instagram', 'facebook', 'email', 'site'].map((channel) => (
                    <Button
                      key={channel}
                      variant={selectedChannel === channel ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedChannel(channel as any)}
                    >
                      {getChannelIcon(channel)}
                      <span className="ml-2 capitalize">{channel}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Input placeholder="Assunto da mensagem" />
                  <Textarea 
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Conversas */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Histórico de Conversas
                </CardTitle>
                <CardDescription>
                  Todas as suas interações com a clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="p-4 rounded-lg bg-secondary/20 border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getChannelIcon(conversation.channel)}
                          <div>
                            <p className="font-medium">{conversation.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              Atendente: {conversation.agent}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(conversation.status)}
                          <span className="text-sm text-muted-foreground">{conversation.timestamp}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Continuar Conversa
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agendamento Tab */}
          <TabsContent value="agendamento" className="space-y-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Minhas Consultas
                </CardTitle>
                <CardDescription>
                  Gerencie suas consultas agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 rounded-lg bg-secondary/20 border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{appointment.specialty}</p>
                          <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {appointment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {appointment.status === 'pendente' && (
                          <>
                            <Button size="sm" variant="default">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </Button>
                            <Button size="sm" variant="outline">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Reagendar
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full" onClick={handleScheduleAppointment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar Nova Consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Meus Documentos
                </CardTitle>
                <CardDescription>
                  Acesse seus exames, receitas e documentos médicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div key={document.id} className="p-4 rounded-lg bg-secondary/20 border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {document.type} • {document.date}
                          </p>
                        </div>
                        {getStatusBadge(document.status)}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <FileText className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar por Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Paciente;
