-- Create admin user using the signup function
SELECT auth.signup(
  'admin@example.com'::text,
  'AdminInstitutoAsa2024!'::text,
  '{"username": "admin", "name": "Administrador"}'::jsonb
);