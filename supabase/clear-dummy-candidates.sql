-- ════════════════════════════════════════════════════════════════════════
--  CVeed — Remove ALL dummy candidates  (run this before launch)
--
--  HOW TO USE:  Supabase Dashboard → SQL Editor → New query → paste → Run.
--
--  Deleting the dummy auth users cascades automatically to their profiles
--  and candidate rows (ON DELETE CASCADE), so this one statement wipes them.
-- ════════════════════════════════════════════════════════════════════════

delete from auth.users where email like 'dummy%@cveed.test';

-- Verify nothing is left:
select count(*) as remaining_dummies
from public.profiles
where email like 'dummy%@cveed.test';
