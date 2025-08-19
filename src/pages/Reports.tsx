import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, ArrowLeft, User, Search, Download, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  status: string;
  data_nascimento: string | null;
  idade: number | null;
  endereco: string | null;
  estado_civil: string | null;
  profissao: string | null;
  escolaridade: string | null;
  religiao: string | null;
  mae: string | null;
  pai: string | null;
  rg: string | null;
  cor: string | null;
  naturalidade: string | null;
  nacionalidade: string | null;
  quantidade_filhos: number | null;
  prole: string | null;
  renda_pessoal: string | null;
  dependencia_quimica: any;
  substancia_preferencia: string | null;
  motivacao_tratamento: string | null;
  historia_familiar: string | null;
  comorbidades: string | null;
  observacoes: string | null;
  created_at: string;
}

interface Consultation {
  id: string;
  consultation_date: string;
  consultation_time: string | null;
  status: string;
  observations: string | null;
  therapists: { name: string } | null;
  methods: { name: string } | null;
}

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<"history" | "profile" | null>(null);

  const searchPatient = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o nome do acolhido para buscar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Nenhum paciente encontrado",
          description: "Verifique se o nome está correto.",
          variant: "destructive",
        });
        return;
      }

      if (data.length === 1) {
        setSelectedPatient(data[0]);
        if (reportType === "history") {
          await fetchConsultations(data[0].id);
        }
      } else {
        // Se houver múltiplos resultados, pegar o primeiro que corresponder exatamente
        const exactMatch = data.find(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (exactMatch) {
          setSelectedPatient(exactMatch);
          if (reportType === "history") {
            await fetchConsultations(exactMatch.id);
          }
        } else {
          toast({
            title: "Múltiplos pacientes encontrados",
            description: "Digite um nome mais específico.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async (patientId: string) => {
    try {
      const { data: consultationsData, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('consultation_date', { ascending: false });

      if (error) throw error;

      // Buscar dados relacionados separadamente
      const enrichedConsultations = [];
      for (const consultation of consultationsData || []) {
        const [therapistRes, methodRes] = await Promise.all([
          consultation.therapist_id ? supabase.from('therapists').select('name').eq('id', consultation.therapist_id).single() : null,
          consultation.method_id ? supabase.from('methods').select('name').eq('id', consultation.method_id).single() : null
        ]);

        enrichedConsultations.push({
          ...consultation,
          therapists: therapistRes?.data,
          methods: methodRes?.data
        });
      }

      setConsultations(enrichedConsultations as Consultation[]);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Erro ao carregar consultas",
        description: "Não foi possível carregar o histórico de consultas.",
        variant: "destructive",
      });
    }
  };

  const generateReport = (type: "history" | "profile") => {
    setReportType(type);
    setSelectedPatient(null);
    setConsultations([]);
  };

  const printReport = () => {
    window.print();
  };

  const resetReport = () => {
    setReportType(null);
    setSelectedPatient(null);
    setConsultations([]);
    setSearchTerm("");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="outline" className="gap-2" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-medical-blue" />
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">Relatórios</h1>
              <p className="text-muted-foreground">Gere relatórios detalhados dos acolhidos</p>
            </div>
          </div>
        </div>

        {!reportType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={() => generateReport("history")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-medical-blue" />
                  Histórico Completo do Acolhido
                </CardTitle>
                <CardDescription>
                  Relatório detalhado com todas as consultas e observações do paciente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              onClick={() => generateReport("profile")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-medical-blue" />
                  Ficha Cadastral do Acolhido
                </CardTitle>
                <CardDescription>
                  Ficha completa com todos os dados cadastrais do paciente
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {reportType && !selectedPatient && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-medical-blue" />
                  Buscar Acolhido
                </div>
                <Button variant="outline" onClick={resetReport}>
                  Cancelar
                </Button>
              </CardTitle>
              <CardDescription>
                Digite o nome do acolhido para gerar o relatório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Nome do Acolhido</Label>
                  <Input
                    id="search"
                    type="text"
                    placeholder="Digite o nome do acolhido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchPatient()}
                    className="focus:ring-medical-blue focus:border-medical-blue"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    className="bg-gradient-primary" 
                    onClick={searchPatient}
                    disabled={loading}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedPatient && reportType === "profile" && (
          <Card className="shadow-card">
            <CardHeader className="print:border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Ficha Cadastral do Acolhido</CardTitle>
                <div className="flex gap-2 print:hidden">
                  <Button variant="outline" onClick={printReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" onClick={resetReport}>
                    Nova Busca
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="print:p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Dados Pessoais</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nome:</span> {selectedPatient.name}</p>
                    <p><span className="font-medium">CPF:</span> {selectedPatient.cpf}</p>
                    <p><span className="font-medium">RG:</span> {selectedPatient.rg || "Não informado"}</p>
                    <p><span className="font-medium">Data de Nascimento:</span> {formatDate(selectedPatient.data_nascimento)}</p>
                    <p><span className="font-medium">Idade:</span> {selectedPatient.idade || "Não informado"}</p>
                    <p><span className="font-medium">Cor:</span> {selectedPatient.cor || "Não informado"}</p>
                    <p><span className="font-medium">Naturalidade:</span> {selectedPatient.naturalidade || "Não informado"}</p>
                    <p><span className="font-medium">Nacionalidade:</span> {selectedPatient.nacionalidade || "Não informado"}</p>
                    <p><span className="font-medium">Estado Civil:</span> {selectedPatient.estado_civil || "Não informado"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Informações Familiares</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Mãe:</span> {selectedPatient.mae || "Não informado"}</p>
                    <p><span className="font-medium">Pai:</span> {selectedPatient.pai || "Não informado"}</p>
                    <p><span className="font-medium">Quantidade de Filhos:</span> {selectedPatient.quantidade_filhos || "Não informado"}</p>
                    <p><span className="font-medium">Prole:</span> {selectedPatient.prole || "Não informado"}</p>
                  </div>

                  <h3 className="font-semibold text-lg border-b pb-2 mt-6">Dados Socioeconômicos</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Endereço:</span> {selectedPatient.endereco || "Não informado"}</p>
                    <p><span className="font-medium">Profissão:</span> {selectedPatient.profissao || "Não informado"}</p>
                    <p><span className="font-medium">Renda Pessoal:</span> {selectedPatient.renda_pessoal || "Não informado"}</p>
                    <p><span className="font-medium">Escolaridade:</span> {selectedPatient.escolaridade || "Não informado"}</p>
                    <p><span className="font-medium">Religião:</span> {selectedPatient.religiao || "Não informado"}</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Informações Clínicas</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Status:</span> {selectedPatient.status}</p>
                    <p><span className="font-medium">Substância de Preferência:</span> {selectedPatient.substancia_preferencia || "Não informado"}</p>
                    <p><span className="font-medium">Comorbidades:</span> {selectedPatient.comorbidades || "Não informado"}</p>
                    <p><span className="font-medium">Motivação para Tratamento:</span> {selectedPatient.motivacao_tratamento || "Não informado"}</p>
                    <p><span className="font-medium">História Familiar:</span> {selectedPatient.historia_familiar || "Não informado"}</p>
                    <p><span className="font-medium">Observações:</span> {selectedPatient.observacoes || "Não informado"}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Data de Cadastro:</span> {formatDate(selectedPatient.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedPatient && reportType === "history" && (
          <Card className="shadow-card">
            <CardHeader className="print:border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Histórico Completo do Acolhido</CardTitle>
                <div className="flex gap-2 print:hidden">
                  <Button variant="outline" onClick={printReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" onClick={resetReport}>
                    Nova Busca
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="print:p-0">
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2">Dados do Paciente</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p><span className="font-medium">Nome:</span> {selectedPatient.name}</p>
                    <p><span className="font-medium">CPF:</span> {selectedPatient.cpf}</p>
                    <p><span className="font-medium">Status:</span> {selectedPatient.status}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg border-b pb-2">Histórico de Consultas</h3>
                  {consultations.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {consultations.map((consultation, index) => (
                        <div key={consultation.id} className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Consulta #{consultations.length - index}</h4>
                            <span className="text-sm font-medium">
                              {formatDate(consultation.consultation_date)}
                              {consultation.consultation_time && ` - ${consultation.consultation_time}`}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <p><span className="font-medium">Terapeuta:</span> {consultation.therapists?.name || "Não informado"}</p>
                            <p><span className="font-medium">Método:</span> {consultation.methods?.name || "Não informado"}</p>
                            <p><span className="font-medium">Status:</span> {consultation.status}</p>
                          </div>

                          {consultation.observations && (
                            <div>
                              <span className="font-medium">Observações:</span>
                              <p className="mt-1 text-sm bg-background p-2 rounded border">
                                {consultation.observations}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-muted-foreground">Nenhuma consulta encontrada para este paciente.</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Relatório gerado em:</span> {new Date().toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;