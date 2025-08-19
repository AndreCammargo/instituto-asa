
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hashFragment = window.location.hash.substring(1);
      
      if (hashFragment) {
        const params = new URLSearchParams(hashFragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log('Confirmation parameters:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        // Check if this is a signup confirmation
        if (type === 'signup' && accessToken && refreshToken) {
          try {
            console.log('Setting session with tokens...');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('Error setting session:', error);
              toast({
                title: "Erro na confirmação",
                description: "Não foi possível confirmar o cadastro.",
                variant: "destructive",
              });
              navigate('/');
              return;
            }

            if (data.user) {
              console.log('User confirmed successfully:', data.user.email);
              toast({
                title: "Cadastro confirmado!",
                description: "Sua conta foi confirmada com sucesso.",
              });
              navigate('/dashboard');
            } else {
              console.log('No user data returned');
              navigate('/');
            }
          } catch (error) {
            console.error('Error during confirmation:', error);
            toast({
              title: "Erro na confirmação",
              description: "Ocorreu um erro durante a confirmação.",
              variant: "destructive",
            });
            navigate('/');
          }
        } else {
          console.log('Invalid confirmation parameters or not a signup type');
          navigate('/');
        }
      } else {
        console.log('No hash fragment found');
        navigate('/');
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue-light to-background">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Processando confirmação...</p>
      </div>
    </div>
  );
};

export default EmailConfirmation;
