import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ConsultationDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const [isEditingConsultation, setIsEditingConsultation] = useState(null);
  const [methods, setMethods] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [newObservation, setNewObservation] = useState({
    procedure: "",
    responsible: "",
    observation: ""
  });
  const [editingObservation, setEditingObservation] = useState({
    id: 0,
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

  useEffect(() => {
    fetchMethodsAndTherapists();
  }, []);

  const fetchMethodsAndTherapists = async () => {
    try {
      const [methodsResponse, therapistsResponse] = await Promise.all([
        supabase.from('methods').select('*').order('name'),
        supabase.from('therapists').select('*').order('name')
      ]);

      if (methodsResponse.error) throw methodsResponse.error;
      if (therapistsResponse.error) throw therapistsResponse.error;

      setMethods(methodsResponse.data || []);
      setTherapists(therapistsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar métodos e responsáveis.",
        variant: "destructive",
      });
    }
  };

  const handleSaveObservation = async () => {
    if (!newObservation.procedure || !newObservation.responsible || !newObservation.observation) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Salvar observação no banco de dados
      const { error } = await supabase
        .from('consultations')
        .insert({
          patient_id: patientId,
          method_id: newObservation.procedure,
          therapist_id: newObservation.responsible,
          consultation_date: new Date().toISOString().split('T')[0],
          consultation_time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          observations: newObservation.observation
        });

      if (error) throw error;

      // Buscar nome do método e responsável para exibição
      const selectedMethod = methods.find(m => m.id === newObservation.procedure);
      const selectedTherapist = therapists.find(t => t.id === newObservation.responsible);

      const newConsultation = {
        id: consultations.length + 1,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        procedure: selectedMethod?.name || '',
        responsible: selectedTherapist?.name || '',
        observation: newObservation.observation
      };

      setConsultations(prev => [newConsultation, ...prev]);
      setNewObservation({ procedure: "", responsible: "", observation: "" });
      setIsAddingObservation(false);
      
      toast({
        title: "Observação salva!",
        description: "Nova observação adicionada com sucesso.",
      });
    } catch (error) {
      console.error('Error saving observation:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a observação.",
        variant: "destructive",
      });
    }
  };

  const startEditingConsultation = (consultation) => {
    setIsEditingConsultation(consultation.id);
    setEditingObservation({
      id: consultation.id,
      procedure: consultation.procedure,
      responsible: consultation.responsible,
      observation: consultation.observation
    });
  };

  const handleUpdateObservation = async () => {
    if (!editingObservation.procedure || !editingObservation.responsible || !editingObservation.observation) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Aqui você implementaria a atualização no banco de dados
      // Por enquanto vamos atualizar localmente
      setConsultations(prev => prev.map(consultation =>
        consultation.id === editingObservation.id
          ? {
              ...consultation,
              procedure: editingObservation.procedure,
              responsible: editingObservation.responsible,
              observation: editingObservation.observation
            }
          : consultation
      ));

      setIsEditingConsultation(null);
      setEditingObservation({ id: 0, procedure: "", responsible: "", observation: "" });
      
      toast({
        title: "Consulta atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating observation:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a consulta.",
        variant: "destructive",
      });
    }
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
                      <Select value={newObservation.procedure} onValueChange={(value) => setNewObservation(prev => ({ ...prev, procedure: value }))}>
                        <SelectTrigger className="bg-background border-input hover:bg-accent hover:text-accent-foreground focus:bg-background z-50">
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border shadow-lg z-[100]">
                          {methods.map((method) => (
                            <SelectItem key={method.id} value={method.id} className="hover:bg-accent hover:text-accent-foreground">
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responsible">Responsável</Label>
                      <Select value={newObservation.responsible} onValueChange={(value) => setNewObservation(prev => ({ ...prev, responsible: value }))}>
                        <SelectTrigger className="bg-background border-input hover:bg-accent hover:text-accent-foreground focus:bg-background z-50">
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border shadow-lg z-[100]">
                          {therapists.map((therapist) => (
                            <SelectItem key={therapist.id} value={therapist.id} className="hover:bg-accent hover:text-accent-foreground">
                              {therapist.name} {therapist.specialization && `- ${therapist.specialization}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                           <Card 
                             className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                             onClick={() => startEditingConsultation(consultation)}
                           >
                             {isEditingConsultation === consultation.id ? (
                               <div className="p-4 space-y-4">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                     <Label>Procedimento/Terapia</Label>
                                     <Select 
                                       value={editingObservation.procedure} 
                                       onValueChange={(value) => setEditingObservation(prev => ({ ...prev, procedure: value }))}
                                     >
                                       <SelectTrigger className="bg-background border-input hover:bg-accent hover:text-accent-foreground focus:bg-background z-50">
                                         <SelectValue placeholder="Selecione o método" />
                                       </SelectTrigger>
                                       <SelectContent className="bg-background border-border shadow-lg z-[100]">
                                         {methods.map((method) => (
                                           <SelectItem key={method.id} value={method.name} className="hover:bg-accent hover:text-accent-foreground">
                                             {method.name}
                                           </SelectItem>
                                         ))}
                                       </SelectContent>
                                     </Select>
                                   </div>
                                   
                                   <div className="space-y-2">
                                     <Label>Responsável</Label>
                                     <Select 
                                       value={editingObservation.responsible} 
                                       onValueChange={(value) => setEditingObservation(prev => ({ ...prev, responsible: value }))}
                                     >
                                       <SelectTrigger className="bg-background border-input hover:bg-accent hover:text-accent-foreground focus:bg-background z-50">
                                         <SelectValue placeholder="Selecione o responsável" />
                                       </SelectTrigger>
                                       <SelectContent className="bg-background border-border shadow-lg z-[100]">
                                         {therapists.map((therapist) => (
                                           <SelectItem key={therapist.id} value={therapist.name} className="hover:bg-accent hover:text-accent-foreground">
                                             {therapist.name} {therapist.specialization && `- ${therapist.specialization}`}
                                           </SelectItem>
                                         ))}
                                       </SelectContent>
                                     </Select>
                                   </div>
                                 </div>
                                 
                                 <div className="space-y-2">
                                   <Label>Observação da Consulta</Label>
                                   <Textarea
                                     value={editingObservation.observation}
                                     onChange={(e) => setEditingObservation(prev => ({ ...prev, observation: e.target.value }))}
                                     placeholder="Descreva os detalhes da sessão, evolução do paciente, próximos passos..."
                                     rows={4}
                                   />
                                 </div>
                                 
                                 <div className="flex gap-2">
                                   <Button onClick={handleUpdateObservation} className="bg-gradient-primary">
                                     <Save className="h-4 w-4 mr-2" />
                                     Salvar Alterações
                                   </Button>
                                   <Button 
                                     variant="outline" 
                                     onClick={() => {
                                       setIsEditingConsultation(null);
                                       setEditingObservation({ id: 0, procedure: "", responsible: "", observation: "" });
                                     }}
                                   >
                                     Cancelar
                                   </Button>
                                 </div>
                               </div>
                             ) : (
                               <>
                                 <CardHeader className="pb-3">
                                   <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                       <Calendar className="h-4 w-4" />
                                       {new Date(consultation.date).toLocaleDateString('pt-BR')}
                                       <Clock className="h-4 w-4 ml-2" />
                                       {consultation.time}
                                     </div>
                                     <Button 
                                       variant="ghost" 
                                       size="sm"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         startEditingConsultation(consultation);
                                       }}
                                     >
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
                               </>
                             )}
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