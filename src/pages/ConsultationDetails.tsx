import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  User, 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Save,
  ArrowLeft,
  FileText
} from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ConsultationDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const [newObservation, setNewObservation] = useState({
    procedure: "",
    responsible: "",
    observation: ""
  });

  // Mock data para o paciente
  const patient = {
    id: patientId,
    name: "João Silva",
    cpf: "123.456.789-00",
    status: "Ativo",
    therapy: "Terapia Cognitivo-Comportamental",
    responsible: "Dr. Carlos Mendes",
    startDate: "2023-06-15",
    totalConsultations: 8
  };

  // Mock data para consultas/observações
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      date: "2024-01-15",
      procedure: "Terapia Cognitivo-Comportamental",
      responsible: "Dr. Carlos Mendes",
      observation: "Paciente demonstrou boa receptividade ao tratamento. Relatou diminuição da ansiedade e melhora no padrão de sono. Continuar com o plano terapêutico atual.",
      time: "14:30"
    },
    {
      id: 2,
      date: "2024-01-08",
      procedure: "Terapia Individual",
      responsible: "Dr. Carlos Mendes",
      observation: "Sessão focada em técnicas de respiração e mindfulness. Paciente conseguiu aplicar as técnicas durante episódio de ansiedade relatado na semana anterior.",
      time: "14:30"
    },
    {
      id: 3,
      date: "2024-01-01",
      procedure: "Avaliação Psicológica",
      responsible: "Dra. Ana Paula",
      observation: "Primeira sessão após recaída. Paciente motivado para retomar o tratamento. Estabelecidos novos objetivos terapêuticos e cronograma de acompanhamento semanal.",
      time: "10:00"
    }
  ]);

  const handleSaveObservation = () => {
    if (!newObservation.procedure || !newObservation.responsible || !newObservation.observation) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const newConsultation = {
      id: consultations.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ...newObservation
    };

    setConsultations(prev => [newConsultation, ...prev]);
    setNewObservation({ procedure: "", responsible: "", observation: "" });
    setIsAddingObservation(false);
    
    toast({
      title: "Observação salva!",
      description: "Nova observação adicionada com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/consultations")}
                className="hover:bg-medical-blue-light"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <Stethoscope className="h-8 w-8 text-medical-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-medical-blue">Consultas - {patient.name}</h1>
                  <p className="text-muted-foreground">Histórico de sessões e observações</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success">
              {patient.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-medical-blue" />
                  Informações do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-foreground">{patient.name}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">CPF</Label>
                  <p className="text-foreground">{patient.cpf}</p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Terapia Atual</Label>
                  <p className="text-foreground">{patient.therapy}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Responsável</Label>
                  <p className="text-foreground">{patient.responsible}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Início do Tratamento</Label>
                  <p className="text-foreground">
                    {new Date(patient.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Total de Consultas</Label>
                  <p className="text-foreground font-semibold text-medical-blue">
                    {patient.totalConsultations}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consultations Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Observation */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-medical-blue" />
                    Nova Observação
                  </div>
                  {!isAddingObservation && (
                    <Button 
                      onClick={() => setIsAddingObservation(true)}
                      className="bg-gradient-primary"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              
              {isAddingObservation && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="procedure">Procedimento/Terapia</Label>
                      <Input
                        id="procedure"
                        value={newObservation.procedure}
                        onChange={(e) => setNewObservation(prev => ({ ...prev, procedure: e.target.value }))}
                        placeholder="Ex: Terapia Individual"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responsible">Responsável</Label>
                      <Input
                        id="responsible"
                        value={newObservation.responsible}
                        onChange={(e) => setNewObservation(prev => ({ ...prev, responsible: e.target.value }))}
                        placeholder="Ex: Dr. Carlos Mendes"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observation">Observação da Consulta</Label>
                    <Textarea
                      id="observation"
                      value={newObservation.observation}
                      onChange={(e) => setNewObservation(prev => ({ ...prev, observation: e.target.value }))}
                      placeholder="Descreva os detalhes da sessão, evolução do paciente, próximos passos..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveObservation} className="bg-gradient-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Observação
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingObservation(false);
                        setNewObservation({ procedure: "", responsible: "", observation: "" });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Consultation History */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-medical-blue" />
                  Histórico de Consultas
                </CardTitle>
                <CardDescription>
                  {consultations.length} consulta(s) registrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {consultations.map((consultation, index) => (
                    <div key={consultation.id} className="relative">
                      {index !== consultations.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-px bg-border"></div>
                      )}
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-medical-blue-light rounded-full">
                            <Stethoscope className="h-4 w-4 text-medical-blue" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(consultation.date).toLocaleDateString('pt-BR')}
                                  <Clock className="h-4 w-4 ml-2" />
                                  {consultation.time}
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div>
                                <h4 className="font-semibold text-medical-blue">
                                  {consultation.procedure}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Responsável: {consultation.responsible}
                                </p>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-foreground leading-relaxed">
                                {consultation.observation}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {consultations.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhuma consulta registrada</h3>
                    <p className="text-muted-foreground">
                      Adicione a primeira observação para este paciente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultationDetails;