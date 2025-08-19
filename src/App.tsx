
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmailConfirmation from "@/components/EmailConfirmation";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Acolhidos from "./pages/Acolhidos";
import RegisterPatient from "./pages/RegisterPatient";
import PatientDetails from "./pages/PatientDetails";
import Therapists from "./pages/Therapists";
import Methods from "./pages/Methods";
import Consultations from "./pages/Consultations";
import NewConsultation from "./pages/NewConsultation";
import ConsultationDetails from "./pages/ConsultationDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if we're on the confirmation path
  const isConfirmationPath = window.location.hash.includes('access_token');

  if (isConfirmationPath) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <EmailConfirmation />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/acolhidos" element={<ProtectedRoute><Acolhidos /></ProtectedRoute>} />
              <Route path="/register-patient" element={<ProtectedRoute><RegisterPatient /></ProtectedRoute>} />
              <Route path="/patient/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
              <Route path="/patient/new" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
              <Route path="/therapists" element={<ProtectedRoute><Therapists /></ProtectedRoute>} />
              <Route path="/methods" element={<ProtectedRoute><Methods /></ProtectedRoute>} />
              <Route path="/consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
              <Route path="/new-consultation" element={<ProtectedRoute><NewConsultation /></ProtectedRoute>} />
              <Route path="/consultation-details/:patientId" element={<ProtectedRoute><ConsultationDetails /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
