-- Add role column to profiles table and update RLS policies
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- Update existing admin profile to have admin role
UPDATE public.profiles SET role = 'admin' WHERE username = 'admin';

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all operations on patients" ON public.patients;
DROP POLICY IF EXISTS "Allow all operations on therapists" ON public.therapists;
DROP POLICY IF EXISTS "Allow all operations on consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow all operations on methods" ON public.methods;

-- Create secure RLS policies for patients (only authenticated users can access)
CREATE POLICY "Authenticated users can view patients" 
ON public.patients 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert patients" 
ON public.patients 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients" 
ON public.patients 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete patients" 
ON public.patients 
FOR DELETE 
TO authenticated
USING (true);

-- Create secure RLS policies for therapists (only authenticated users can access)
CREATE POLICY "Authenticated users can view therapists" 
ON public.therapists 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert therapists" 
ON public.therapists 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update therapists" 
ON public.therapists 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete therapists" 
ON public.therapists 
FOR DELETE 
TO authenticated
USING (true);

-- Create secure RLS policies for consultations (only authenticated users can access)
CREATE POLICY "Authenticated users can view consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update consultations" 
ON public.consultations 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete consultations" 
ON public.consultations 
FOR DELETE 
TO authenticated
USING (true);

-- Create secure RLS policies for methods (only authenticated users can access)
CREATE POLICY "Authenticated users can view methods" 
ON public.methods 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert methods" 
ON public.methods 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update methods" 
ON public.methods 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete methods" 
ON public.methods 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to get current user role for role-based access
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;