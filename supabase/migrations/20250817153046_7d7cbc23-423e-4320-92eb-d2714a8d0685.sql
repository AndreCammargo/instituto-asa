-- Add foreign key constraints to consultations table
ALTER TABLE public.consultations 
ADD CONSTRAINT fk_consultations_patient 
FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;

ALTER TABLE public.consultations 
ADD CONSTRAINT fk_consultations_method 
FOREIGN KEY (method_id) REFERENCES public.methods(id) ON DELETE SET NULL;

ALTER TABLE public.consultations 
ADD CONSTRAINT fk_consultations_therapist 
FOREIGN KEY (therapist_id) REFERENCES public.therapists(id) ON DELETE SET NULL;

-- Add trigger for automatic timestamp updates on consultations
CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for automatic timestamp updates on patients
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for automatic timestamp updates on therapists
CREATE TRIGGER update_therapists_updated_at
BEFORE UPDATE ON public.therapists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for automatic timestamp updates on methods
CREATE TRIGGER update_methods_updated_at
BEFORE UPDATE ON public.methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();