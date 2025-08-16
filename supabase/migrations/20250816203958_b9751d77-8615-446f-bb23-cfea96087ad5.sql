-- Criar tabela de consultas
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  method_id UUID REFERENCES public.methods(id) ON DELETE SET NULL,
  therapist_id UUID REFERENCES public.therapists(id) ON DELETE SET NULL,
  consultation_date DATE NOT NULL,
  consultation_time TIME,
  observations TEXT,
  status TEXT NOT NULL DEFAULT 'Agendada'
);

-- Enable Row Level Security
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all operations on consultations" 
ON public.consultations 
FOR ALL 
TO public 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();