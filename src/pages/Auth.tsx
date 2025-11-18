import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">MediConnect</h1>
          </div>
          <p className="text-muted-foreground">
            Sistema Omnichannel para Clínicas Médicas
          </p>
        </div>

        {/* Auth Form */}
        <div className="space-y-6">
          {isLogin ? <LoginForm /> : <SignUpForm />}

          {/* Toggle Form */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary-hover"
            >
              {isLogin ? 'Criar nova conta' : 'Fazer login'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2024 MediConnect. Todos os direitos reservados.</p>
          <p className="mt-1">Sistema seguro e confiável para sua clínica.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;