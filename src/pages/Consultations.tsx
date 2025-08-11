import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Search, User, Calendar, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock data para pacientes
  const patients = [
    {
      id: 1,
      name: "João Silva",
      cpf: "123.456.789-00",
      lastConsultation: "2024-01-15",
      totalConsultations: 8,
      status: "Ativo",
      therapy: "Terapia Cognitivo-Comportamental"
    },
    {
      id: 2,
      name: "Maria Santos",
      cpf: "987.654.321-00",
      lastConsultation: "2024-01-10",
      totalConsultations: 12,
      status: "Ativo",
      therapy: "Terapia de Grupo"
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      cpf: "456.789.123-00",
      lastConsultation: "2024-01-08",
      totalConsultations: 5,
      status: "Em Pausa",
      therapy: "Terapia Individual"
    },
    {
      id: 4,
      name: "Ana Costa",
      cpf: "321.654.987-00",
      lastConsultation: "2024-01-12",
      totalConsultations: 15,
      status: "Ativo",
      therapy: "Terapia Familiar"
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const handleSelectPatient = (patientId: number) => {
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
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-medical-blue" />
              Buscar Paciente
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
                <Button className="bg-gradient-primary">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchTerm && (
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
                              {new Date(patient.lastConsultation).toLocaleDateString('pt-BR')}
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
              {[
                {
                  patient: "João Silva",
                  date: "2024-01-15",
                  time: "14:30",
                  therapist: "Dr. Carlos Mendes",
                  type: "Terapia Individual"
                },
                {
                  patient: "Maria Santos",
                  date: "2024-01-14",
                  time: "10:00",
                  therapist: "Dra. Ana Paula",
                  type: "Terapia de Grupo"
                },
                {
                  patient: "Ana Costa",
                  date: "2024-01-12",
                  time: "16:00",
                  therapist: "Dr. Roberto Silva",
                  type: "Terapia Familiar"
                }
              ].map((consultation, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-medical-blue-light rounded-full">
                      <Stethoscope className="h-4 w-4 text-medical-blue" />
                    </div>
                    <div>
                      <p className="font-medium">{consultation.patient}</p>
                      <p className="text-sm text-muted-foreground">
                        {consultation.type} - {consultation.therapist}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(consultation.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">{consultation.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Consultations;