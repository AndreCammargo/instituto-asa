import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus, Calendar, ArrowLeft, Plus, Settings, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Acolhidos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm)
  );

  const statusCls = (s: string) => (s === "Ativo" ? "bg-success/10 text-success border-success" : "bg-warning/10 text-warning border-warning");

  return (
    <Layout>
      <div className="space-y-6">
        {/* Voltar */}
        <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        {/* Header */}
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-medical-blue" />
              <div>
                <h1 className="text-2xl font-bold text-medical-blue">Acolhidos</h1>
                <p className="text-muted-foreground">Listagem de acolhidos cadastrados</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="gap-2 bg-gradient-primary" onClick={() => navigate("/register-patient")}> 
                <Plus className="h-4 w-4" /> Novo Acolhido
              </Button>
            </div>
          </div>
        </div>

        {/* Busca */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-medical-blue" />Buscar Acolhido</CardTitle>
            <CardDescription>Digite o nome ou CPF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xl">
              <Label htmlFor="s">Nome ou CPF</Label>
              <Input id="s" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Ex: João ou 123.456..." />
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Registros</CardTitle>
            <CardDescription>{filtered.length} registro(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Carregando...</div>
            ) : filtered.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <Card key={p.id} className="border-2 hover:border-medical-blue transition-colors cursor-pointer" onClick={() => navigate(`/patient/${p.id}`)}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{p.name}</div>
                        <Badge variant="outline" className={statusCls(p.status)}>{p.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                        <div>CPF: {p.cpf}</div>
                        {p.rg && <div>RG: {p.rg}</div>}
                        {p.data_nascimento && <div>Nascimento: {new Date(p.data_nascimento).toLocaleDateString('pt-BR')}</div>}
                        {p.idade && <div>Idade: {p.idade} anos</div>}
                        {p.naturalidade && <div>Naturalidade: {p.naturalidade}</div>}
                        {p.profissao && <div>Profissão: {p.profissao}</div>}
                        {p.escolaridade && <div>Escolaridade: {p.escolaridade}</div>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" /> Desde {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">Nenhum acolhido encontrado.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Acolhidos;
