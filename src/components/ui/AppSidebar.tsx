import { Home, UserPlus, Stethoscope, LogOut, UserCheck, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import institutoAsaLogo from "@/assets/instituto-asa-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Tela Principal", url: "/dashboard", icon: Home },
  { title: "Acolhidos", url: "/acolhidos", icon: UserPlus },
  { title: "Consultas", url: "/consultations", icon: Stethoscope },
  { title: "Responsáveis", url: "/therapists", icon: UserCheck },
  { title: "Métodos", url: "/methods", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-medical-blue-light text-medical-blue font-medium border-r-2 border-medical-blue" 
      : "hover:bg-medical-blue-light/50 hover:text-medical-blue transition-colors";

  const handleLogout = async () => {
    try {
      console.log('Sidebar logout clicked...');
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Sidebar logout error:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
    >
      <SidebarContent className="bg-card">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src={institutoAsaLogo} 
              alt="Instituto Asa Logo" 
              className="h-8 w-8 object-contain"
            />
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-medical-blue">Instituto Asa</h2>
                <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {!collapsed && "Menu Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span>Sair</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}