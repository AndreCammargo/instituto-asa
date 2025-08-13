import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InputMask from "react-input-mask";

const PatientDetails = () => {
  const [patient, setPatient] = useState({
    name: "",
    cpf: "",
    status: "Ativo"
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPatient();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setPatient(data);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast({ title: "Erro ao carregar dados do acolhido", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient.name.trim() || !patient.cpf.trim()) {
      toast({ title: "Nome e CPF são obrigatórios", variant: "destructive" });
      return;
    }

    try {
      if (id) {
        // Update existing patient
        const { error } = await supabase
          .from('patients')
          .update(patient)
          .eq('id', id);

        if (error) throw error;
        toast({ title: "Dados atualizados com sucesso!" });
      } else {
        // Create new patient
        const { error } = await supabase
          .from('patients')
          .insert([patient]);

        if (error) throw error;
        toast({ title: "Acolhido cadastrado com sucesso!" });
        navigate('/acolhidos');
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({ title: "Erro ao salvar dados", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Carregando...</div>
      </Layout>
    );
  }

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
            <User className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">
                {id ? "Editar Acolhido" : "Novo Acolhido"}
              </h1>
              <p className="text-muted-foreground">
                {id ? "Edite as informações do acolhido" : "Cadastre um novo acolhido"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados do Acolhido</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    placeholder="Nome completo do acolhido"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <InputMask
                    mask="999.999.999-99"
                    value={patient.cpf}
                    onChange={(e) => setPatient({ ...patient, cpf: e.target.value })}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        id="cpf"
                        placeholder="000.000.000-00"
                        required
                      />
                    )}
                  </InputMask>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={patient.status} onValueChange={(value) => setPatient({ ...patient, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Em Pausa">Em Pausa</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  <Save className="h-4 w-4 mr-2" />
                  {id ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientDetails;