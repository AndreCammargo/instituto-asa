import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Plus, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Methods = () => {
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('methods')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMethods(data || []);
    } catch (error) {
      console.error('Error fetching methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMethod.name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('methods')
        .insert([newMethod]);

      if (error) throw error;

      toast({ title: "Método cadastrado com sucesso!" });
      setNewMethod({ name: "", description: "" });
      fetchMethods();
    } catch (error) {
      console.error('Error creating method:', error);
      toast({ title: "Erro ao cadastrar método", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Voltar */}
        <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        {/* Header */}
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">Métodos Aplicados</h1>
              <p className="text-muted-foreground">Cadastro de métodos e procedimentos terapêuticos</p>
            </div>
          </div>
        </div>

        {/* Novo Método */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-medical-blue" />
              Novo Método
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Método *</Label>
                <Input
                  id="name"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                  placeholder="Ex: Terapia Individual, Fisioterapia"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newMethod.description}
                  onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                  placeholder="Descreva o método ou procedimento"
                  rows={3}
                />
              </div>
              <Button type="submit" className="bg-gradient-primary">
                Cadastrar Método
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Métodos */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Métodos Cadastrados</CardTitle>
            <CardDescription>{methods.length} método(s) cadastrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Carregando...</div>
            ) : methods.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {methods.map((method) => (
                  <Card key={method.id} className="border-2">
                    <CardContent className="p-4 space-y-2">
                      <div className="font-semibold">{method.name}</div>
                      {method.description && (
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">Nenhum método cadastrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Methods;