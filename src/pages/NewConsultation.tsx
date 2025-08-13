import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import InputMask from "react-input-mask";

const NewConsultation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    patientName: "",
    patientCpf: "",
    procedure: "",
    responsible: "",
    date: "",
    time: "",
    observations: "",
  });

  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [methods, setMethods] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientList, setShowPatientList] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, therapistsRes, methodsRes] = await Promise.all([
        supabase.from('patients').select('*').order('name'),
        supabase.from('therapists').select('*').order('name'),
        supabase.from('methods').select('*').order('name')
      ]);

      if (patientsRes.data) setPatients(patientsRes.data);
      if (therapistsRes.data) setTherapists(therapistsRes.data);
      if (methodsRes.data) setMethods(methodsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'patientName') {
      const filtered = patients.filter(p => 
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowPatientList(value.length > 0 && filtered.length > 0);
    }
  };

  const selectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientName: patient.name,
      patientCpf: patient.cpf
    }));
    setShowPatientList(false);
  };

  const handleSave = () => {
    if (!formData.patientName || !formData.procedure || !formData.responsible || !formData.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Consulta agendada!",
      description: "A nova consulta foi criada com sucesso.",
    });
    
    navigate("/consultations");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/consultations")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-medical-blue">Nova Consulta</h1>
            <p className="text-muted-foreground">Agendar nova sessão de terapia</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Informações do Paciente</CardTitle>
              <CardDescription>Dados do acolhido para a consulta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="patientName">Nome do Acolhido *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  placeholder="Digite o nome completo"
                />
                {showPatientList && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => selectPatient(patient)}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.cpf}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientCpf">CPF</Label>
                <InputMask
                  mask="999.999.999-99"
                  value={formData.patientCpf}
                  onChange={(e) => handleInputChange("patientCpf", e.target.value)}
                >
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      id="patientCpf"
                      placeholder="000.000.000-00"
                    />
                  )}
                </InputMask>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Detalhes da Consulta</CardTitle>
              <CardDescription>Informações sobre o procedimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="procedure">Procedimento *</Label>
                <Select value={formData.procedure} onValueChange={(value) => handleInputChange("procedure", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de terapia" />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável *</Label>
                <Select value={formData.responsible} onValueChange={(value) => handleInputChange("responsible", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapists.map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.name} {therapist.specialization && `- ${therapist.specialization}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Observations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Observações Iniciais</CardTitle>
            <CardDescription>Anotações e objetivos para a sessão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Digite as observações iniciais, objetivos da sessão ou informações relevantes..."
                className="min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/consultations")}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="gap-2 bg-gradient-primary hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            Agendar Consulta
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewConsultation;