-- Insert admin profile directly (if user already exists in auth.users)
INSERT INTO public.profiles (user_id, username, name, role)
SELECT 
  u.id,
  'admin',
  'Administrador',
  'admin'
FROM auth.users u 
WHERE u.email = 'admin@example.com'
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  role = EXCLUDED.role;