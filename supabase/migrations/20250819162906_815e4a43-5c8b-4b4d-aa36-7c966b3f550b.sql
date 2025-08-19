-- Check the current trigger and function
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM information_schema.triggers t
JOIN pg_proc p ON p.proname = replace(t.action_statement, 'EXECUTE FUNCTION ', '')
WHERE t.trigger_name = 'on_auth_user_created';