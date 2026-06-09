-- ════════════════════════════════════════════════════════════════════════
--  CVeed — Seed data (optional)
--
--  The MVP needs no seed data to run: taxonomies (skills/industries/certs) and
--  role-weight tables are a Phase-5 enhancement (see docs/09 & docs/12). Matching
--  weights currently live in code (src/lib/matching.ts).
--
--  When you add the taxonomy tables later, insert their canonical values here so
--  `supabase db reset` repopulates them. Example shape:
--
--  insert into public.skills (name, synonyms) values
--    ('JavaScript', array['js','java script']),
--    ('Microsoft Excel', array['excel','ms excel'])
--  on conflict (name) do nothing;
-- ════════════════════════════════════════════════════════════════════════

-- (no-op for the MVP)
select 1;
