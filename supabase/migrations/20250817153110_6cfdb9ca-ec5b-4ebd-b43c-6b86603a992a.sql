-- Add foreign key constraints to consultations table (if they don't exist yet)
DO $$ 
BEGIN
    -- Add patient foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_consultations_patient'
    ) THEN
        ALTER TABLE public.consultations 
        ADD CONSTRAINT fk_consultations_patient 
        FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;
    END IF;

    -- Add method foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_consultations_method'
    ) THEN
        ALTER TABLE public.consultations 
        ADD CONSTRAINT fk_consultations_method 
        FOREIGN KEY (method_id) REFERENCES public.methods(id) ON DELETE SET NULL;
    END IF;

    -- Add therapist foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_consultations_therapist'
    ) THEN
        ALTER TABLE public.consultations 
        ADD CONSTRAINT fk_consultations_therapist 
        FOREIGN KEY (therapist_id) REFERENCES public.therapists(id) ON DELETE SET NULL;
    END IF;
END $$;