-- Check if trigger exists for handle_new_user function
SELECT EXISTS(
  SELECT 1 FROM information_schema.triggers 
  WHERE trigger_name = 'on_auth_user_created'
);