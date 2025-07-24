-- First check existing foreign key constraints on contest_participants
DO $$
DECLARE
    fk_name text;
BEGIN
    -- Find and drop any foreign key constraint that references contests table
    SELECT constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu USING (constraint_name, table_schema)
    JOIN information_schema.constraint_column_usage ccu USING (constraint_name, table_schema)
    WHERE tc.table_name = 'contest_participants' 
    AND tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'contests'
    AND ccu.column_name = 'id'
    AND kcu.column_name = 'contest_id';
    
    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.contest_participants DROP CONSTRAINT ' || fk_name;
        RAISE NOTICE 'Dropped foreign key constraint: %', fk_name;
    END IF;
END $$;

-- Recreate the foreign key constraint WITHOUT CASCADE DELETE
-- This will prevent participant data from being deleted when contest is deleted
ALTER TABLE public.contest_participants 
ADD CONSTRAINT fk_contest_participants_contest_id 
FOREIGN KEY (contest_id) REFERENCES public.contests(id) 
ON DELETE RESTRICT;