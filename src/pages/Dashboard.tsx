import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Calendar, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardStats {
  activePatients: number;
  todayConsultations: number;
  totalObservations: number;
}

interface RecentActivity {
  id: string;
  action: string;
  patient_name: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    activePatients: 0,
    todayConsultations: 0,
    totalObservations: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar pacientes ativos
      const { count: activePatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Ativo');

      // Buscar consultas de hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: todayConsultations } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('consultation_date', today);

      // Buscar total de observações (consultas com observações)
      const { count: totalObservations } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .not('observations', 'is', null)
        .neq('observations', '');

      // Buscar atividades recentes (últimos pacientes cadastrados e consultas)
      const { data: recentPatients } = await supabase
        .from('patients')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      const { data: recentConsultations } = await supabase
        .from('consultations')
        .select(`
          id, 
          created_at, 
          status,
          patients (name)
        `)
        .order('created_at', { ascending: false })
        .limit(2);

      const activities: RecentActivity[] = [];

      // Adicionar pacientes recentes
      recentPatients?.forEach(patient => {
        activities.push({
          id: patient.id,
          action: 'Novo acolhido cadastrado',
          patient_name: patient.name,
          created_at: patient.created_at
        });
      });

      // Adicionar consultas recentes
      recentConsultations?.forEach(consultation => {
        activities.push({
          id: consultation.id,
          action: consultation.status === 'Realizada' ? 'Consulta realizada' : 'Consulta agendada',
          patient_name: (consultation.patients as any)?.name || 'N/A',
          created_at: consultation.created_at
        });
      });

      // Ordenar por data mais recente
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setStats({
        activePatients: activePatients || 0,
        todayConsultations: todayConsultations || 0,
        totalObservations: totalObservations || 0
      });

      setRecentActivities(activities.slice(0, 3));
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours === 1) return '1 hora atrás';
    if (diffInHours < 24) return `${diffInHours} horas atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 dia atrás';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const dashboardStats = [
    {
      title: "Acolhidos Ativos",
      value: stats.activePatients.toString(),
      description: "Pacientes em acompanhamento",
      icon: Users,
      color: "text-medical-blue"
    },
    {
      title: "Consultas Hoje",
      value: stats.todayConsultations.toString(),
      description: "Sessões agendadas",
      icon: Calendar,
      color: "text-medical-accent"
    },
    {
      title: "Observações",
      value: stats.totalObservations.toString(),
      description: "Registros médicos",
      icon: FileText,
      color: "text-success"
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
                Instituto Asa
              </h1>
              <p className="text-muted-foreground">
                Sistema de gestão e acompanhamento de pacientes
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardStats.map((stat, index) => {
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
          <Card 
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => navigate('/register-patient')}
          >
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

          <Card 
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => navigate('/new-consultation')}
          >
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

          <Card 
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => navigate('/reports')}
          >
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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">Paciente: {activity.patient_name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.created_at)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma atividade recente encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;