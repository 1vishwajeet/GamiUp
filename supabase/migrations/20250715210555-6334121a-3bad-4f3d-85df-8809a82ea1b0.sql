-- Insert admin role for the existing user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('5f629370-670d-49c8-96f6-3b93d35dd297', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;