import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import institutoAsaLogo from "@/assets/instituto-asa-logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      if (email) {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Por favor, digite um email válido.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
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
            <CardTitle className="text-2xl font-bold text-medical-blue">Recuperar Senha</CardTitle>
            <CardDescription className="text-muted-foreground">
              Digite seu email para receber as instruções
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-medical-blue focus:border-medical-blue"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
          
          <div className="pt-4 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-medical-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;