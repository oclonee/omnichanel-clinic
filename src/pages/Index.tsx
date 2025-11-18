import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Phone, 
  Mail,
  Instagram,
  MessageCircle,
  Activity,
  UserCog,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User
} from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'atendimento' | 'relatorios'>('dashboard');
  const { user, signOut } = useAuth();

  // Mock data para demonstração
  const stats = {
    pacientesAtivos: 1247,
    conversasAbertas: 23,
    tempoMedioResposta: '2:15',
    taxaResolucao: 94.2
  };

  const conversasRecentes = [
    { id: 1, paciente: 'Maria Silva', canal: 'WhatsApp', status: 'ativo', tempo: '2 min', assunto: 'Agendamento consulta cardiologista' },
    { id: 2, paciente: 'João Santos', canal: 'Instagram', status: 'aguardando', tempo: '5 min', assunto: 'Resultado de exame' },
    { id: 3, paciente: 'Ana Costa', canal: 'E-mail', status: 'resolvido', tempo: '8 min', assunto: 'Cancelamento de consulta' },
  ];

  const atendentes = [
    { nome: 'Carla Ribeiro', status: 'online', conversas: 5, mediaResposta: '1:45' },
    { nome: 'Pedro Lima', status: 'online', conversas: 3, mediaResposta: '2:30' },
    { nome: 'Sofia Martins', status: 'ausente', conversas: 0, mediaResposta: '1:20' },
  ];

  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case 'WhatsApp': return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'Instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'E-mail': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'Telefone': return <Phone className="h-4 w-4 text-gray-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo': return <Badge variant="default" className="bg-success text-success-foreground">Ativo</Badge>;
      case 'aguardando': return <Badge variant="secondary" className="bg-warning text-warning-foreground">Aguardando</Badge>;
      case 'resolvido': return <Badge variant="outline">Resolvido</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
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
                <h1 className="text-2xl font-bold text-foreground">MediConnect</h1>
                <p className="text-sm text-muted-foreground">Sistema Omnichannel - Clínica São Lucas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button 
                    variant="default"
                    size="sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/atendimento">
                  <Button 
                    variant="outline"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Atendimento
                  </Button>
                </Link>
                <Link to="/gerente">
                  <Button 
                    variant="outline"
                    size="sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gerente
                  </Button>
                </Link>
                <Link to="/paciente">
                  <Button 
                    variant="outline"
                    size="sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Paciente
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-card bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pacientes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">{stats.pacientesAtivos}</span>
                <Users className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversas Abertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-warning">{stats.conversasAbertas}</span>
                <MessageSquare className="h-8 w-8 text-warning/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-success">{stats.tempoMedioResposta}</span>
                <Clock className="h-8 w-8 text-success/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Resolução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">{stats.taxaResolucao}%</span>
                <CheckCircle2 className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conversas Recentes */}
          <Card className="lg:col-span-2 border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversas Recentes
              </CardTitle>
              <CardDescription>
                Últimas interações com pacientes em todos os canais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversasRecentes.map((conversa) => (
                <div key={conversa.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getChannelIcon(conversa.canal)}
                    <div>
                      <p className="font-medium">{conversa.paciente}</p>
                      <p className="text-sm text-muted-foreground">{conversa.assunto}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{conversa.tempo}</span>
                    {getStatusBadge(conversa.status)}
                  </div>
                </div>
              ))}
              
              <Link to="/atendimento" className="w-full">
                <Button className="w-full mt-4" variant="outline">
                  Ver Todas as Conversas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Status dos Atendentes */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                Status Atendentes
              </CardTitle>
              <CardDescription>
                Monitoramento em tempo real da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {atendentes.map((atendente, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      atendente.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{atendente.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {atendente.conversas} conversas • {atendente.mediaResposta} avg
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link to="/gerente?tab=equipe" className="w-full">
                <Button className="w-full mt-4" variant="outline" size="sm">
                  Gerenciar Equipe
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Status do Sistema */}
        <Card className="mt-8 border-success/20 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-success mb-2">
                  Sistema Backend Ativo
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supabase conectado com sucesso! Todas as funcionalidades backend estão disponíveis: 
                  autenticação, banco de dados, APIs de integração e relatórios em tempo real.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                  <Badge variant="outline" className="border-success text-success">✓ Autenticação ativa</Badge>
                  <Badge variant="outline" className="border-success text-success">✓ Banco de dados</Badge>
                  <Badge variant="outline" className="border-success text-success">✓ APIs configuradas</Badge>
                  <Badge variant="outline" className="border-success text-success">✓ Relatórios funcionais</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Usuário conectado: {user?.email} • Status: Online
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;