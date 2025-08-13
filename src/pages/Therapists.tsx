import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCheck, Search, Plus, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Therapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [newTherapist, setNewTherapist] = useState({ name: "", specialization: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTherapist.name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('therapists')
        .insert([newTherapist]);

      if (error) throw error;

      toast({ title: "Responsável cadastrado com sucesso!" });
      setNewTherapist({ name: "", specialization: "" });
      fetchTherapists();
    } catch (error) {
      console.error('Error creating therapist:', error);
      toast({ title: "Erro ao cadastrar responsável", variant: "destructive" });
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
            <UserCheck className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">Responsáveis pela Terapia</h1>
              <p className="text-muted-foreground">Cadastro de responsáveis e terapeutas</p>
            </div>
          </div>
        </div>

        {/* Novo Responsável */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-medical-blue" />
              Novo Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={newTherapist.name}
                    onChange={(e) => setNewTherapist({ ...newTherapist, name: e.target.value })}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Especialização</Label>
                  <Input
                    id="specialization"
                    value={newTherapist.specialization}
                    onChange={(e) => setNewTherapist({ ...newTherapist, specialization: e.target.value })}
                    placeholder="Ex: Psicologia, Fisioterapia"
                  />
                </div>
              </div>
              <Button type="submit" className="bg-gradient-primary">
                Cadastrar Responsável
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Responsáveis */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Responsáveis Cadastrados</CardTitle>
            <CardDescription>{therapists.length} responsável(is) cadastrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Carregando...</div>
            ) : therapists.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {therapists.map((therapist) => (
                  <Card key={therapist.id} className="border-2">
                    <CardContent className="p-4 space-y-2">
                      <div className="font-semibold">{therapist.name}</div>
                      {therapist.specialization && (
                        <div className="text-sm text-muted-foreground">{therapist.specialization}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">Nenhum responsável cadastrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Therapists;