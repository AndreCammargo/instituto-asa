import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Calendar, FileText } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Acolhidos Ativos",
      value: "42",
      description: "Pacientes em acompanhamento",
      icon: Users,
      color: "text-medical-blue"
    },
    {
      title: "Consultas Hoje",
      value: "8",
      description: "Sessões agendadas",
      icon: Calendar,
      color: "text-medical-accent"
    },
    {
      title: "Observações",
      value: "156",
      description: "Registros médicos",
      icon: FileText,
      color: "text-success"
    },
    {
      title: "Taxa de Adesão",
      value: "87%",
      description: "Participação no programa",
      icon: Activity,
      color: "text-warning"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-card rounded-lg p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-medical-blue">
                Bem-vindo ao Acolhido Care
              </h1>
              <p className="text-muted-foreground">
                Sistema de gestão e acompanhamento de pacientes
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-medical-blue" />
                Cadastrar Acolhido
              </CardTitle>
              <CardDescription>
                Adicionar novo paciente ao sistema
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-medical-accent" />
                Agendar Consulta
              </CardTitle>
              <CardDescription>
                Marcar nova sessão de acompanhamento
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-success" />
                Relatórios
              </CardTitle>
              <CardDescription>
                Visualizar estatísticas e relatórios
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Novo acolhido cadastrado", patient: "João Silva", time: "2 horas atrás" },
                { action: "Consulta realizada", patient: "Maria Santos", time: "4 horas atrás" },
                { action: "Observação adicionada", patient: "Pedro Oliveira", time: "6 horas atrás" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">Paciente: {activity.patient}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;