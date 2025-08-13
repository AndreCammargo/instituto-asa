-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapists table
CREATE TABLE public.therapists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create methods table
CREATE TABLE public.methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.methods ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on authentication needs)
CREATE POLICY "Allow all operations on patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on therapists" ON public.therapists FOR ALL USING (true);
CREATE POLICY "Allow all operations on methods" ON public.methods FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_methods_updated_at
  BEFORE UPDATE ON public.methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.patients (name, cpf, status) VALUES 
  ('João Silva', '123.456.789-00', 'Ativo'),
  ('Maria Santos', '987.654.321-00', 'Ativo'),
  ('Pedro Oliveira', '456.789.123-00', 'Em Pausa');

INSERT INTO public.therapists (name, specialization) VALUES 
  ('Dr. Ana Costa', 'Psicologia'),
  ('Dr. Carlos Lima', 'Fisioterapia'),
  ('Dra. Lucia Rocha', 'Terapia Ocupacional');

INSERT INTO public.methods (name, description) VALUES 
  ('Terapia Individual', 'Sessão de terapia individual'),
  ('Terapia em Grupo', 'Sessão de terapia em grupo'),
  ('Fisioterapia', 'Sessão de fisioterapia');