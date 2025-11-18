import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { queueManager } from '@/services/queueManager';
import { notificationService } from '@/services/notificationService';
import { omnichannelManager } from '@/integrations/omnichannel';
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
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Bell,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const Gerente = () => {
  const [searchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<'dashboard' | 'equipe' | 'relatorios' | 'configuracoes'>('dashboard');
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [agentPerformance, setAgentPerformance] = useState<any[]>([]);
  const [channelStatus, setChannelStatus] = useState<any>({});
  const [interventionDialog, setInterventionDialog] = useState<{ open: boolean; conversa: any | null }>({ open: false, conversa: null });
  const [selectedAction, setSelectedAction] = useState<'escalar' | 'reatribuir'>('escalar');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [agentConfigDialog, setAgentConfigDialog] = useState<{ open: boolean; agent: any | null }>({ open: false, agent: null });
  const [agentConfig, setAgentConfig] = useState({
    maxCapacity: 5,
    role: 'atendente',
    isOnline: true
  });
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Ler o parâmetro 'tab' da URL e definir a aba ativa
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'equipe', 'relatorios', 'configuracoes'].includes(tabParam)) {
      setActiveView(tabParam as any);
    }
  }, [searchParams]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    // Carregar status da fila
    setQueueStatus(queueManager.getQueueStatus());
    
    // Usar dados mockados para agentes
    setAgentPerformance(mockAgents);
    
    // Carregar status dos canais
    setChannelStatus(omnichannelManager.getIntegrationStatus());
  };

  // Mock data para demonstração
  const kpis = {
    totalConversas: 156,
    conversasAtivas: 23,
    tempoMedioResposta: '2:15',
    taxaResolucao: 94.2,
    satisfacaoMedia: 4.7,
    agentesOnline: 8,
    filaEspera: 5,
    slaCumprido: 89.5
  };

  const conversasCriticas = [
    { id: 1, paciente: 'Maria Silva', canal: 'WhatsApp', tempoEspera: '15 min', prioridade: 'Alta', assunto: 'Dor no peito' },
    { id: 2, paciente: 'João Santos', canal: 'Instagram', tempoEspera: '12 min', prioridade: 'Média', assunto: 'Agendamento urgente' },
    { id: 3, paciente: 'Ana Costa', canal: 'E-mail', tempoEspera: '8 min', prioridade: 'Alta', assunto: 'Resultado de exame crítico' },
  ];

  const tendencias = [
    { periodo: 'Hoje', conversas: 45, resolucao: 92, satisfacao: 4.6 },
    { periodo: 'Ontem', conversas: 38, resolucao: 89, satisfacao: 4.4 },
    { periodo: 'Semana', conversas: 267, resolucao: 91, satisfacao: 4.7 },
    { periodo: 'Mês', conversas: 1156, resolucao: 94, satisfacao: 4.8 },
  ];

  // Mock data para agentes da equipe
  const mockAgents = [
    {
      id: '1',
      name: 'Carla Ribeiro',
      role: 'atendente',
      currentLoad: 3,
      maxCapacity: 5,
      utilization: 60,
      rating: 4.8,
      isOnline: true
    },
    {
      id: '2',
      name: 'Pedro Lima',
      role: 'atendente',
      currentLoad: 2,
      maxCapacity: 5,
      utilization: 40,
      rating: 4.6,
      isOnline: true
    },
    {
      id: '3',
      name: 'Sofia Martins',
      role: 'gerente',
      currentLoad: 4,
      maxCapacity: 8,
      utilization: 50,
      rating: 4.9,
      isOnline: true
    },
    {
      id: '4',
      name: 'João Silva',
      role: 'atendente',
      currentLoad: 5,
      maxCapacity: 5,
      utilization: 100,
      rating: 4.3,
      isOnline: true
    },
    {
      id: '5',
      name: 'Ana Costa',
      role: 'atendente',
      currentLoad: 1,
      maxCapacity: 5,
      utilization: 20,
      rating: 4.7,
      isOnline: false
    }
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

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return <Badge variant="destructive">Alta</Badge>;
      case 'Média': return <Badge variant="secondary">Média</Badge>;
      case 'Baixa': return <Badge variant="outline">Baixa</Badge>;
      default: return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  const handleEscalarConversa = (conversa: any) => {
    setInterventionDialog({ open: true, conversa });
    setSelectedAction('escalar');
    setSelectedAgent('');
  };

  const handleIntervention = async () => {
    if (!interventionDialog.conversa) return;

    try {
      if (selectedAction === 'escalar') {
        // Implementar escalação
        console.log('Escalando conversa:', interventionDialog.conversa.id);
        // Aqui você implementaria a lógica real de escalação
        alert(`Conversa ${interventionDialog.conversa.id} escalada com sucesso!`);
      } else if (selectedAction === 'reatribuir' && selectedAgent) {
        // Implementar reatribuição
        console.log('Reatribuindo conversa:', interventionDialog.conversa.id, 'para agente:', selectedAgent);
        // Aqui você implementaria a lógica real de reatribuição
        alert(`Conversa ${interventionDialog.conversa.id} reatribuída para ${selectedAgent}!`);
      }
      
      setInterventionDialog({ open: false, conversa: null });
      setSelectedAction('escalar');
      setSelectedAgent('');
    } catch (error) {
      console.error('Erro na intervenção:', error);
      alert('Erro ao realizar intervenção. Tente novamente.');
    }
  };

  const handleReatribuirConversa = (conversaId: string, agenteId: string) => {
    // Implementar reatribuição
    console.log('Reatribuindo conversa:', conversaId, 'para agente:', agenteId);
  };

  const handleConfigurarAgente = (agent: any) => {
    setAgentConfig({
      maxCapacity: agent.maxCapacity,
      role: agent.role,
      isOnline: agent.isOnline
    });
    setAgentConfigDialog({ open: true, agent });
  };

  const handleSaveAgentConfig = async () => {
    if (!agentConfigDialog.agent) return;

    try {
      // Aqui você implementaria a lógica real de salvamento
      console.log('Salvando configurações do agente:', agentConfigDialog.agent.id, agentConfig);
      
      // Simular atualização dos dados
      const updatedAgents = agentPerformance.map(agent => 
        agent.id === agentConfigDialog.agent.id 
          ? { ...agent, ...agentConfig }
          : agent
      );
      setAgentPerformance(updatedAgents);

      // Fechar modal
      setAgentConfigDialog({ open: false, agent: null });
      
      // Mostrar feedback
      alert(`Configurações do agente ${agentConfigDialog.agent.name} salvas com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
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
                <h1 className="text-2xl font-bold text-foreground">Painel Gerencial</h1>
                <p className="text-sm text-muted-foreground">Sistema Omnichannel - Clínica São Lucas</p>
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
                <Link to="/atendimento">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Atendimento
                  </Button>
                </Link>
                <Button variant="default" size="sm">
                  <UserCog className="h-4 w-4 mr-2" />
                  Gerente
                </Button>
              </div>
              
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Gerente</p>
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
            <TabsTrigger value="equipe">Gestão de Equipe</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{kpis.conversasAtivas}</span>
                    <MessageSquare className="h-8 w-8 text-primary/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {queueStatus?.queueLength || 0} na fila
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-success">{kpis.tempoMedioResposta}</span>
                    <Clock className="h-8 w-8 text-success/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    SLA: {kpis.slaCumprido}% cumprido
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Resolução</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-warning">{kpis.taxaResolucao}%</span>
                    <Target className="h-8 w-8 text-warning/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Meta: 90%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Satisfação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{kpis.satisfacaoMedia}/5</span>
                    <TrendingUp className="h-8 w-8 text-primary/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +0.3 vs mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Status dos Canais */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Status dos Canais
                  </CardTitle>
                  <CardDescription>
                    Monitoramento em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(channelStatus).map(([channel, status]: [string, any]) => (
                    <div key={channel} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${status.online ? 'bg-success' : 'bg-destructive'}`} />
                        <span className="capitalize font-medium">{channel}</span>
                      </div>
                      <Badge variant={status.online ? "default" : "secondary"}>
                        {status.online ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Conversas Críticas */}
              <Card className="lg:col-span-2 border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Conversas Críticas
                  </CardTitle>
                  <CardDescription>
                    Requerem atenção imediata
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conversasCriticas.map((conversa) => (
                    <div key={conversa.id} className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-4">
                        {getChannelIcon(conversa.canal)}
                        <div>
                          <p className="font-medium">{conversa.paciente}</p>
                          <p className="text-sm text-muted-foreground">{conversa.assunto}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{conversa.tempoEspera}</span>
                        {getPriorityBadge(conversa.prioridade)}
                        <Button size="sm" variant="outline" onClick={() => handleEscalarConversa(conversa)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Intervir
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Tendências */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tendências de Desempenho
                </CardTitle>
                <CardDescription>
                  Comparativo com períodos anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {tendencias.map((tendencia, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-secondary/20">
                      <p className="text-sm font-medium text-muted-foreground">{tendencia.periodo}</p>
                      <p className="text-2xl font-bold text-primary">{tendencia.conversas}</p>
                      <p className="text-sm text-muted-foreground">
                        Resolução: {tendencia.resolucao}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Satisfação: {tendencia.satisfacao}/5
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipe Tab */}
          <TabsContent value="equipe" className="space-y-8">
            {/* Estatísticas Gerais da Equipe */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Agentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{agentPerformance.length}</span>
                    <Users className="h-8 w-8 text-primary/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {agentPerformance.filter(a => a.isOnline).length} online
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Utilização Média</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-warning">
                      {(agentPerformance.reduce((sum, a) => sum + a.utilization, 0) / agentPerformance.length).toFixed(1)}%
                    </span>
                    <Target className="h-8 w-8 text-warning/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Meta: 70%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rating Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-success">
                      {(agentPerformance.reduce((sum, a) => sum + a.rating, 0) / agentPerformance.length).toFixed(1)}/5
                    </span>
                    <TrendingUp className="h-8 w-8 text-success/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +0.2 vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Agentes Críticos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-destructive">
                      {agentPerformance.filter(a => a.utilization >= 80).length}
                    </span>
                    <AlertCircle className="h-8 w-8 text-destructive/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {'>'}80% de utilização
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Performance Individual
                </CardTitle>
                <CardDescription>
                  Monitoramento individual e gestão de carga de trabalho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentPerformance.map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                            {agent.name.substring(0, 2).toUpperCase()}
                          </div>
                          {/* Indicador de status online/offline */}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                            agent.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{agent.name}</p>
                            <Badge variant={agent.role === 'gerente' ? 'default' : 'secondary'} className="text-xs">
                              {agent.role === 'gerente' ? 'Gerente' : 'Atendente'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {agent.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Carga</p>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{agent.currentLoad}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium">{agent.maxCapacity}</span>
                          </div>
                          {/* Barra de progresso da carga */}
                          <div className="w-16 h-2 bg-secondary rounded-full mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                agent.utilization >= 80 ? 'bg-destructive' : 
                                agent.utilization >= 60 ? 'bg-warning' : 'bg-success'
                              }`}
                              style={{ width: `${agent.utilization}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Utilização</p>
                          <p className={`font-medium ${
                            agent.utilization >= 80 ? 'text-destructive' : 
                            agent.utilization >= 60 ? 'text-warning' : 'text-success'
                          }`}>
                            {agent.utilization.toFixed(1)}%
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{agent.rating}</span>
                            <span className="text-muted-foreground">/5</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`w-3 h-3 rounded-full ${
                                    star <= agent.rating ? 'bg-yellow-400' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline" onClick={() => handleConfigurarAgente(agent)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Relatórios de Desempenho
                </CardTitle>
                <CardDescription>
                  Análise detalhada de métricas e indicadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Relatórios Disponíveis</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Relatório Diário
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Relatório Semanal
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Relatório Mensal
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Exportar Dados</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Exportar CSV
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Enviar por Email
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="configuracoes" className="space-y-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Personalize parâmetros e comportamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Configurações de SLA</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Tempo de Resposta (min)</label>
                        <input 
                          type="number" 
                          defaultValue="5"
                          className="w-full mt-1 p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tempo de Resolução (min)</label>
                        <input 
                          type="number" 
                          defaultValue="60"
                          className="w-full mt-1 p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tempo de Escalação (min)</label>
                        <input 
                          type="number" 
                          defaultValue="15"
                          className="w-full mt-1 p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Notificações</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        Ativar notificações em tempo real
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        Enviar alertas de SLA
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        Respostas automáticas
                      </label>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Intervenção */}
      <Dialog open={interventionDialog.open} onOpenChange={(open) => setInterventionDialog({ open, conversa: interventionDialog.conversa })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Intervenção na Conversa</DialogTitle>
            <DialogDescription>
              Escolha uma ação para intervir na conversa crítica
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Seleção da Ação */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Intervenção</label>
              <Select value={selectedAction} onValueChange={(value: 'escalar' | 'reatribuir') => setSelectedAction(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="escalar">Escalar Conversa</SelectItem>
                  <SelectItem value="reatribuir">Reatribuir Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seleção do Agente (se for reatribuição) */}
            {selectedAction === 'reatribuir' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecionar Agente</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um agente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carla">Carla Ribeiro</SelectItem>
                    <SelectItem value="pedro">Pedro Lima</SelectItem>
                    <SelectItem value="sofia">Sofia Martins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Informações da Conversa */}
            {interventionDialog.conversa && (
              <div className="p-3 bg-secondary/20 rounded-lg">
                <p className="text-sm font-medium">Paciente: {interventionDialog.conversa.paciente}</p>
                <p className="text-sm text-muted-foreground">Canal: {interventionDialog.conversa.canal}</p>
                <p className="text-sm text-muted-foreground">Assunto: {interventionDialog.conversa.assunto}</p>
                <p className="text-sm text-muted-foreground">Tempo de espera: {interventionDialog.conversa.tempoEspera}</p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setInterventionDialog({ open: false, conversa: null })}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleIntervention}
                disabled={selectedAction === 'reatribuir' && !selectedAgent}
                className="flex-1"
              >
                Confirmar Intervenção
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Configuração do Agente */}
      <Dialog open={agentConfigDialog.open} onOpenChange={(open) => setAgentConfigDialog({ open, agent: agentConfigDialog.agent })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Agente</DialogTitle>
            <DialogDescription>
              Ajuste as configurações do agente {agentConfigDialog.agent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Capacidade Máxima */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacidade Máxima</label>
              <input
                type="number"
                min="1"
                max="10"
                value={agentConfig.maxCapacity}
                onChange={(e) => setAgentConfig({...agentConfig, maxCapacity: parseInt(e.target.value) || 1})}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                Número máximo de conversas simultâneas
              </p>
            </div>

            {/* Função */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Função</label>
              <Select value={agentConfig.role} onValueChange={(value: 'atendente' | 'gerente') => setAgentConfig({...agentConfig, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atendente">Atendente</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Online/Offline */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={agentConfig.isOnline}
                  onChange={(e) => setAgentConfig({...agentConfig, isOnline: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm font-medium">Agente Online</span>
              </label>
              <p className="text-xs text-muted-foreground">
                Marque se o agente está disponível para atendimento
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setAgentConfigDialog({ open: false, agent: null })}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveAgentConfig}
                className="flex-1"
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gerente;
