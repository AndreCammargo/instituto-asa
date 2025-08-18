import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import institutoAsaLogo from "@/assets/instituto-asa-logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
    createAdminUser();
  }, [user, loading, navigate]);

  const createAdminUser = async () => {
    // Check if admin user already exists
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', 'admin');

    if (existingProfiles && existingProfiles.length === 0) {
      // Create admin user if it doesn't exist
      try {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signUp({
          email: 'admin@institutoasa.com',
          password: 'AdminInstitutoAsa2024!',
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: 'admin',
              name: 'Administrador'
            }
          }
        });
        if (!error) {
          console.log('Admin user created successfully');
        }
      } catch (error) {
        console.log('Admin user might already exist');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // First check if user exists in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (!profile) {
        toast({
          title: "Erro no login",
          description: "Usuário não encontrado.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Use proper email for login based on username
      let loginEmail = '';
      if (username === 'admin') {
        loginEmail = 'admin@institutoasa.com';
      } else {
        // For regular users, get email from auth.users via profile
        const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
        if (userData.user?.email) {
          loginEmail = userData.user.email;
        } else {
          toast({
            title: "Erro no login",
            description: "Email do usuário não encontrado.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema Instituto Asa.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue-light to-background p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={institutoAsaLogo} 
              alt="Instituto Asa Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-medical-blue">Instituto Asa</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sistema de Gestão de Acolhimento
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus:ring-medical-blue focus:border-medical-blue"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-medical-blue focus:border-medical-blue pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-medical-blue hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Não tem conta? </span>
              <Link 
                to="/register" 
                className="text-sm text-medical-blue hover:underline"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;