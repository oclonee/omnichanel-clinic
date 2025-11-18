-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('atendente', 'gerente', 'admin');
CREATE TYPE public.conversation_status AS ENUM ('ativo', 'pendente', 'resolvido', 'encerrado');
CREATE TYPE public.message_type AS ENUM ('texto', 'audio', 'imagem', 'documento', 'video');
CREATE TYPE public.channel_type AS ENUM ('whatsapp', 'instagram', 'facebook', 'email', 'telefone', 'site');
CREATE TYPE public.patient_status AS ENUM ('ativo', 'inativo', 'bloqueado');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'atendente',
    phone TEXT,
    avatar_url TEXT,
    is_online BOOLEAN DEFAULT false,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Create patients table
CREATE TABLE public.patients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    cpf TEXT,
    birth_date DATE,
    address TEXT,
    status patient_status DEFAULT 'ativo',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create channels table
CREATE TABLE public.channels (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type channel_type NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    status conversation_status DEFAULT 'pendente',
    priority INTEGER DEFAULT 1,
    subject TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'texto',
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    external_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT check_sender_or_patient CHECK (
        (sender_id IS NOT NULL AND patient_id IS NULL) OR 
        (sender_id IS NULL AND patient_id IS NOT NULL)
    )
);

-- Create performance_metrics table
CREATE TABLE public.performance_metrics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_conversations INTEGER DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    average_response_time INTERVAL,
    total_messages INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    UNIQUE(agent_id, date)
);

-- Create quick_responses table
CREATE TABLE public.quick_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_global BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_responses ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Authenticated users can view patients" ON public.patients
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Atendentes and gerentes can create patients" ON public.patients
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('atendente', 'gerente', 'admin')
    );

CREATE POLICY "Atendentes and gerentes can update patients" ON public.patients
    FOR UPDATE USING (
        public.get_user_role(auth.uid()) IN ('atendente', 'gerente', 'admin')
    );

-- RLS Policies for channels
CREATE POLICY "Authenticated users can view channels" ON public.channels
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only gerentes and admins can manage channels" ON public.channels
    FOR ALL USING (
        public.get_user_role(auth.uid()) IN ('gerente', 'admin')
    );

-- RLS Policies for conversations
CREATE POLICY "Users can view relevant conversations" ON public.conversations
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            assigned_agent_id = auth.uid() OR
            public.get_user_role(auth.uid()) IN ('gerente', 'admin')
        )
    );

CREATE POLICY "Atendentes can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('atendente', 'gerente', 'admin')
    );

CREATE POLICY "Users can update assigned conversations" ON public.conversations
    FOR UPDATE USING (
        assigned_agent_id = auth.uid() OR
        public.get_user_role(auth.uid()) IN ('gerente', 'admin')
    );

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their conversations" ON public.messages
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id AND (
                c.assigned_agent_id = auth.uid() OR
                public.get_user_role(auth.uid()) IN ('gerente', 'admin')
            )
        )
    );

CREATE POLICY "Atendentes can create messages" ON public.messages
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('atendente', 'gerente', 'admin') AND
        sender_id = auth.uid()
    );

-- RLS Policies for performance_metrics
CREATE POLICY "Users can view own metrics" ON public.performance_metrics
    FOR SELECT USING (
        agent_id = auth.uid() OR
        public.get_user_role(auth.uid()) IN ('gerente', 'admin')
    );

-- RLS Policies for quick_responses
CREATE POLICY "Users can view quick responses" ON public.quick_responses
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            is_global = true OR 
            created_by = auth.uid() OR
            public.get_user_role(auth.uid()) IN ('gerente', 'admin')
        )
    );

CREATE POLICY "Users can create quick responses" ON public.quick_responses
    FOR INSERT WITH CHECK (
        public.get_user_role(auth.uid()) IN ('atendente', 'gerente', 'admin') AND
        created_by = auth.uid()
    );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_channels_updated_at
    BEFORE UPDATE ON public.channels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at
    BEFORE UPDATE ON public.performance_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_responses_updated_at
    BEFORE UPDATE ON public.quick_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        'atendente'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert default channels
INSERT INTO public.channels (name, type, is_active) VALUES
    ('WhatsApp Business', 'whatsapp', true),
    ('Instagram Direct', 'instagram', true),
    ('Facebook Messenger', 'facebook', true),
    ('E-mail', 'email', true),
    ('Telefone', 'telefone', true),
    ('Chat do Site', 'site', true);

-- Insert some quick responses
INSERT INTO public.quick_responses (title, content, is_global, created_by) VALUES
    ('Bom dia', 'Bom dia! Como posso ajudá-lo hoje?', true, NULL),
    ('Agendamento', 'Para agendar uma consulta, preciso de algumas informações. Qual especialidade você precisa?', true, NULL),
    ('Documentos', 'Por favor, envie os documentos necessários: RG, CPF e carteirinha do convênio.', true, NULL),
    ('Aguarde', 'Por favor, aguarde um momento enquanto verifico essas informações para você.', true, NULL),
    ('Encerramento', 'Foi um prazer ajudá-lo! Se precisar de mais alguma coisa, estarei aqui. Tenha um ótimo dia!', true, NULL);