import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [userData, setUserData] = useState({
    username: "admin",
    email: "admin@acolhidocare.com",
    name: "Dr. Administrador",
    phone: "(27) 99999-9999",
    address: "Guarapari, ES",
    role: "Administrador do Sistema",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSave = () => {
    toast({
      title: "Dados atualizados!",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (userData.newPassword !== userData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Senha alterada!",
      description: "Sua senha foi atualizada com sucesso.",
    });
    setUserData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <h1 className="text-2xl font-bold text-medical-blue">Minha Conta</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e de acesso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-medical-blue" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Dados básicos da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={userData.username}
                  onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={userData.address}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="role"
                    value={userData.role}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-primary">
                    Editar Informações
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="bg-gradient-primary">
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-medical-blue" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={userData.currentPassword}
                  onChange={(e) => setUserData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Digite sua senha atual"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={userData.newPassword}
                  onChange={(e) => setUserData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme a nova senha"
                />
              </div>

              <Button 
                onClick={handlePasswordChange} 
                className="w-full bg-gradient-primary"
                disabled={!userData.currentPassword || !userData.newPassword || !userData.confirmPassword}
              >
                Alterar Senha
              </Button>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• A senha deve ter pelo menos 8 caracteres</p>
                <p>• Use letras maiúsculas, minúsculas e números</p>
                <p>• Inclua pelo menos um caractere especial</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Account;