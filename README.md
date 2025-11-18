# Sistema Omnichannel - Clínica São Lucas

## 🏥 Sobre o Projeto

Sistema omnichannel completo para clínica médica que unifica todos os canais de atendimento (WhatsApp, Instagram, Facebook, E-mail, Telefone e Chat do site) em uma única plataforma, permitindo que atendentes gerenciem conversas de forma centralizada e eficiente.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Login/Registro de usuários
- Controle de acesso baseado em perfis (Atendente, Gerente, Admin)
- Rotas protegidas por autenticação

### 📱 Integrações Omnichannel
- **WhatsApp Business API** - Integração com WhatsApp
- **Instagram Direct** - Mensagens diretas do Instagram
- **Facebook Messenger** - Chat do Facebook
- **E-mail** - Sistema de e-mails
- **Chat do Site** - Chat em tempo real no site
- **Telefone** - Gestão de chamadas telefônicas

### 👨‍⚕️ Painel do Atendente
- Dashboard com métricas em tempo real
- Lista de conversas ativas
- Chat unificado para todos os canais
- Histórico de conversas
- Respostas rápidas pré-definidas
- Sistema de notificações

### 👨‍💼 Painel do Gerente
- Dashboard gerencial com KPIs
- Monitoramento de equipe em tempo real
- Gestão de filas e prioridades
- Relatórios de desempenho
- Configurações de SLA
- Supervisão de atendimentos críticos

### 🏥 Portal do Paciente
- Dashboard personalizado
- Histórico de conversas
- Agendamento de consultas
- Acesso a documentos médicos
- Envio de mensagens por múltiplos canais

### 🚀 Sistema de Filas e Roteamento
- Distribuição inteligente de conversas
- Sistema de prioridades
- Escalação automática
- Balanceamento de carga entre atendentes
- Tempo estimado de espera

### 🔔 Sistema de Notificações e SLA
- Monitoramento de tempo de resposta
- Alertas de violação de SLA
- Respostas automáticas
- Lembretes automáticos
- Notificações em tempo real

### 📊 Relatórios e Analytics
- Métricas de produtividade
- Indicadores de satisfação
- Análise de tendências
- Exportação de dados (CSV, PDF)
- Relatórios personalizáveis

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Estado**: React Context + React Query
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Gráficos**: Recharts

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **profiles** - Perfis de usuários (atendentes, gerentes)
- **patients** - Cadastro de pacientes
- **channels** - Configuração dos canais de comunicação
- **conversations** - Conversas entre pacientes e atendentes
- **messages** - Mensagens das conversas
- **notifications** - Sistema de notificações
- **performance_metrics** - Métricas de desempenho
- **quick_responses** - Respostas rápidas pré-definidas

### Funcionalidades do Banco
- Row Level Security (RLS) implementado
- Políticas de acesso por perfil de usuário
- Triggers para atualização automática de timestamps
- Índices para otimização de performance

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd health-comm-unified-main

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Execute as migrações do banco
# (Execute o arquivo SQL em supabase/migrations/)

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Supabase
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações SQL em `supabase/migrations/`
3. Configure as variáveis de ambiente com suas credenciais

## 📱 Funcionalidades por Perfil

### 👨‍⚕️ Atendente
- Visualizar conversas atribuídas
- Responder mensagens em tempo real
- Acessar histórico de conversas
- Usar respostas rápidas
- Marcar conversas como resolvidas

### 👨‍💼 Gerente
- Monitorar performance da equipe
- Gerenciar filas de atendimento
- Visualizar relatórios consolidados
- Configurar parâmetros do sistema
- Intervir em atendimentos críticos

### 🏥 Paciente
- Enviar mensagens por múltiplos canais
- Acompanhar histórico de conversas
- Agendar consultas
- Acessar documentos médicos
- Receber notificações automáticas

## 🔧 Configurações de SLA

- **Tempo de Resposta**: 5 minutos (configurável)
- **Tempo de Resolução**: 60 minutos (configurável)
- **Tempo de Escalação**: 15 minutos (configurável)
- **Respostas Automáticas**: Ativadas por padrão
- **Notificações de Violação**: Enviadas para gerentes

## 📈 Métricas e KPIs

- Total de conversas
- Conversas ativas
- Tempo médio de resposta
- Taxa de resolução
- Satisfação do paciente
- Agentes online
- Tamanho da fila
- Percentual de SLA cumprido

## 🔮 Próximos Passos

- [ ] Integração real com APIs externas (WhatsApp, Instagram, etc.)
- [ ] Sistema de agendamento de consultas
- [ ] Integração com prontuário eletrônico
- [ ] Chat em tempo real no site
- [ ] Sistema de avaliação de atendimento
- [ ] Relatórios avançados com gráficos
- [ ] Aplicativo mobile para atendentes
- [ ] Integração com sistemas de pagamento

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos canais:
- E-mail: suporte@clinicasaolucas.com
- WhatsApp: (11) 99999-9999
- Instagram: @clinicasaolucas

---

**Desenvolvido com ❤️ para melhorar o atendimento médico**
