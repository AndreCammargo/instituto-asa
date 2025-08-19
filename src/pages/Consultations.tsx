import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Search, User, Calendar, Clock, Plus, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentConsultations();
    
    // Verificar se precisa recarregar dados
    const shouldRefresh = localStorage.getItem('refreshConsultations');
    if (shouldRefresh) {
      localStorage.removeItem('refreshConsultations');
      fetchRecentConsultations();
    }
    
    // Escutar mudanças na URL para atualizar quando voltar de nova consulta
    const handleFocus = () => {
      fetchRecentConsultations();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchRecentConsultations = async () => {
    try {
      setLoading(true);
      const { data: consultationsData, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Buscar dados relacionados separadamente
      const enrichedConsultations = [];
      for (const consultation of consultationsData || []) {
        const [patientRes, therapistRes, methodRes] = await Promise.all([
          supabase.from('patients').select('name, cpf').eq('id', consultation.patient_id).single(),
          consultation.therapist_id ? supabase.from('therapists').select('name').eq('id', consultation.therapist_id).single() : null,
          consultation.method_id ? supabase.from('methods').select('name').eq('id', consultation.method_id).single() : null
        ]);

        enrichedConsultations.push({
          ...consultation,
          patients: patientRes.data,
          therapists: therapistRes?.data,
          methods: methodRes?.data
        });
      }

      setRecentConsultations(enrichedConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Erro ao carregar consultas",
        description: "Não foi possível carregar as consultas recentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    if (!searchTerm.trim()) {
      setFilteredPatients([]);
      return;
    }

    try {
      setLoading(true);
      const { data: patientsData, error } = await supabase
        .from('patients')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`);

      if (error) throw error;

      // Buscar consultas para cada paciente
      const processedPatients = [];
      for (const patient of patientsData || []) {
        const { data: consultations } = await supabase
          .from('consultations')
          .select('consultation_date, method_id')
          .eq('patient_id', patient.id)
          .order('consultation_date', { ascending: false });

        const totalConsultations = consultations?.length || 0;
        const lastConsultation = consultations?.[0]?.consultation_date || null;
        
        // Buscar nome do método da última consulta
        let therapy = "Não informado";
        if (consultations?.[0]?.method_id) {
          const { data: methodData } = await supabase
            .from('methods')
            .select('name')
            .eq('id', consultations[0].method_id)
            .single();
          therapy = methodData?.name || "Não informado";
        }
        
        processedPatients.push({
          ...patient,
          totalConsultations,
          lastConsultation,
          therapy
        });
      }

      setFilteredPatients(processedPatients);
    } catch (error) {
      console.error('Error searching patients:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchPatients();
  };

  const handleSelectPatient = (patientId: string) => {
    navigate(`/consultation-details/${patientId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-success/10 text-success border-success";
      case "Em Pausa":
        return "bg-warning/10 text-warning border-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">Consultas</h1>
              <p className="text-muted-foreground">Busque e gerencie consultas dos acolhidos</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-medical-blue" />
                Buscar Paciente
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate("/new-consultation")}
              >
                <Plus className="h-4 w-4" />
                Nova Consulta
              </Button>
            </CardTitle>
            <CardDescription>
              Digite o nome ou CPF do acolhido para encontrar suas consultas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Nome ou CPF</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Digite o nome ou CPF do paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-medical-blue focus:border-medical-blue"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  className="bg-gradient-primary" 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {filteredPatients.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Resultados da Busca</CardTitle>
              <CardDescription>
                {filteredPatients.length} paciente(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPatients.map((patient) => (
                    <Card 
                      key={patient.id} 
                      className="cursor-pointer hover:shadow-elevated transition-shadow border-2 hover:border-medical-blue"
                      onClick={() => handleSelectPatient(patient.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-medical-blue-light rounded-full">
                              <User className="h-5 w-5 text-medical-blue" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">CPF: {patient.cpf}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-medical-blue" />
                            <span className="text-muted-foreground">Última consulta:</span>
                            <span className="font-medium">
                              {patient.lastConsultation ? 
                                new Date(patient.lastConsultation).toLocaleDateString('pt-BR') 
                                : "Nenhuma consulta"
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-medical-blue" />
                            <span className="text-muted-foreground">Total de consultas:</span>
                            <span className="font-medium">{patient.totalConsultations}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-medical-blue" />
                            <span className="text-muted-foreground">Terapia:</span>
                            <span className="font-medium text-xs">{patient.therapy}</span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full mt-4 bg-gradient-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPatient(patient.id);
                          }}
                        >
                          Ver Consultas
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Nenhum paciente encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente buscar com um termo diferente ou verifique se o paciente está cadastrado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Consultations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Consultas Recentes</CardTitle>
            <CardDescription>
              Últimas consultas realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Carregando consultas...</p>
                </div>
              ) : recentConsultations.length > 0 ? (
                recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-medical-blue-light rounded-full">
                        <Stethoscope className="h-4 w-4 text-medical-blue" />
                      </div>
                      <div>
                        <p className="font-medium">{consultation.patients?.name || "Paciente não informado"}</p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.methods?.name || "Método não informado"} - {consultation.therapists?.name || "Terapeuta não informado"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Status: {consultation.status || "Agendada"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(consultation.consultation_date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {consultation.consultation_time || "Horário não informado"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Nenhuma consulta encontrada</h3>
                  <p className="text-muted-foreground">
                    As consultas criadas aparecerão aqui automaticamente.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Consultations;