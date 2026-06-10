-- ════════════════════════════════════════════════════════════════════════
--  CVeed — Seed 10,000 DUMMY candidates  (TEST DATA ONLY)
--
--  HOW TO USE:  Supabase Dashboard → SQL Editor → New query → paste ALL → Run.
--  (Takes a few seconds.)
--
--  Every dummy user has a "@cveed.test" email so it can be removed in ONE line
--  before launch — see supabase/clear-dummy-candidates.sql.
--
--  Safe to run once. Running again creates another 10,000 (clear first if so).
-- ════════════════════════════════════════════════════════════════════════

-- 1) Create 10,000 dummy auth users. The handle_new_user() trigger
--    automatically creates each one's matching public.profiles row.
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at,
   raw_app_meta_data, raw_user_meta_data)
select
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'dummy' || g || '@cveed.test',
  '',
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'full_name',
      (array['Ahmed','Sara','Omar','Layla','Khalid','Fatima','Yousef','Noor','Hassan',
             'Mariam','Ali','Huda','Saeed','Aisha','Tariq','Reem','Bilal','Salma'])[1+floor(random()*18)]
      || ' ' ||
      (array['Al Thani','Khan','Ahmed','Hussein','Rashid','Mansour','Karim','Saleh',
             'Aziz','Nasser','Haddad','Farouk','Sultan','Yousif','Iqbal','Mahmoud'])[1+floor(random()*16)],
    'role', 'candidate'
  )
from generate_series(1, 10000) g;

-- 2) Give each dummy profile a location (display + realism).
update public.profiles
set location = (array['Doha','Al Rayyan','Al Wakrah','Lusail','Al Khor'])[1+floor(random()*5)]
where email like 'dummy%@cveed.test' and location is null;

-- 3) Build a living candidate profile for each, from realistic role templates.
with templates(tid, title, skills, industries, langs, certs) as (
  values
    (1,'Sales Manager',     array['B2B Sales','Negotiation','CRM','Account Management','Team Leadership'], array['Automotive','Retail'],    array['Arabic','English'], array['Certified Sales Professional']),
    (2,'Accountant',        array['Accounting','QuickBooks','Microsoft Excel','Auditing','Taxation'],      array['Finance'],               array['English','Arabic'], array['CPA']),
    (3,'Chef',              array['Italian Cuisine','Menu Planning','Food Safety','Kitchen Management'],    array['Hospitality'],           array['English'],          array['HACCP']),
    (4,'Mechanical Engineer',array['AutoCAD','Maintenance','Project Management','HVAC','Troubleshooting'],  array['Oil & Gas','Construction'],array['English'],         array['PMP']),
    (5,'Marketing Manager', array['Digital Marketing','SEO','Social Media','Branding','Google Ads'],       array['Retail','Technology'],   array['English','Arabic'], array[]::text[]),
    (6,'HR Officer',        array['Recruitment','Payroll','Onboarding','Employee Relations'],              array['Services'],              array['English','Arabic'], array['CIPD']),
    (7,'Software Developer',array['JavaScript','React','Node.js','SQL','Python'],                          array['Technology'],            array['English'],          array[]::text[]),
    (8,'Receptionist',      array['Customer Service','Scheduling','Microsoft Office','Front Desk'],         array['Hospitality'],           array['English','Arabic'], array[]::text[]),
    (9,'Electrician',       array['Wiring','Maintenance','Troubleshooting','Safety'],                      array['Construction'],          array['English','Hindi'],  array['Electrical License']),
    (10,'Nurse',            array['Patient Care','First Aid','Medication','Record Keeping'],               array['Healthcare'],            array['English','Arabic'], array['BLS']),
    (11,'Sales Executive',  array['B2B Sales','Lead Generation','CRM','Cold Calling'],                     array['Retail','Automotive'],   array['Arabic','English'], array[]::text[]),
    (12,'Driver',           array['Safe Driving','Navigation','Vehicle Maintenance','Logistics'],          array['Logistics'],             array['Arabic','Urdu'],    array['Driving License']),
    (13,'Civil Engineer',   array['AutoCAD','Structural Design','Site Supervision','Estimation'],          array['Construction'],          array['English','Arabic'], array['PMP']),
    (14,'Graphic Designer', array['Photoshop','Illustrator','Branding','UI Design'],                       array['Technology','Retail'],   array['English'],          array[]::text[])
)
insert into public.candidates
  (id, current_title, years_experience, summary, skills, industries, languages,
   certifications, expected_salary_min, expected_salary_max, currency,
   notice_period, availability, noc_status, preferred_job_type,
   preferred_locations, open_to_opportunities, completeness, updated_at)
select
  p.id,
  t.title,
  (1 + floor(random()*18))::numeric,
  t.title || ' with hands-on experience in ' || t.industries[1] || '.',
  t.skills,
  t.industries,
  t.langs,
  case when random() < 0.6 then t.certs else array[]::text[] end,
  (3000 + floor(random()*5000))::numeric,
  (8000 + floor(random()*17000))::numeric,
  'QAR',
  (array['Immediate','1 month','2 months','3 months'])[1+floor(random()*4)],
  (array['Immediately','Within 1 month','Within 2 months'])[1+floor(random()*3)],
  (array['yes','no','unknown'])[1+floor(random()*3)]::noc_status,
  (array['full_time','full_time','contract','part_time'])[1+floor(random()*4)],
  array[(array['Doha','Al Rayyan','Lusail','Al Wakrah'])[1+floor(random()*4)]],
  (array['slightly_open','open_to_discussions','actively_exploring','available_immediately'])[1+floor(random()*4)]::open_to_opportunities,
  (55 + floor(random()*45))::int,
  now()
from public.profiles p
cross join lateral (select * from templates order by random() limit 1) t
where p.email like 'dummy%@cveed.test'
  and not exists (select 1 from public.candidates c where c.id = p.id);

-- Done. Check the count:
select count(*) as dummy_candidates
from public.candidates c
join public.profiles p on p.id = c.id
where p.email like 'dummy%@cveed.test';
