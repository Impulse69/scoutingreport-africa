-- Seed: reference data that should exist in every environment.
-- Idempotent — safe to re-run.

-- === countries (CAF members) ===================================
insert into public.countries (code, name, flag_emoji) values
  ('DZ', 'Algeria', '🇩🇿'),
  ('AO', 'Angola', '🇦🇴'),
  ('BJ', 'Benin', '🇧🇯'),
  ('BW', 'Botswana', '🇧🇼'),
  ('BF', 'Burkina Faso', '🇧🇫'),
  ('BI', 'Burundi', '🇧🇮'),
  ('CM', 'Cameroon', '🇨🇲'),
  ('CV', 'Cape Verde', '🇨🇻'),
  ('CF', 'Central African Republic', '🇨🇫'),
  ('TD', 'Chad', '🇹🇩'),
  ('KM', 'Comoros', '🇰🇲'),
  ('CG', 'Congo', '🇨🇬'),
  ('CD', 'DR Congo', '🇨🇩'),
  ('DJ', 'Djibouti', '🇩🇯'),
  ('EG', 'Egypt', '🇪🇬'),
  ('GQ', 'Equatorial Guinea', '🇬🇶'),
  ('ER', 'Eritrea', '🇪🇷'),
  ('SZ', 'Eswatini', '🇸🇿'),
  ('ET', 'Ethiopia', '🇪🇹'),
  ('GA', 'Gabon', '🇬🇦'),
  ('GM', 'Gambia', '🇬🇲'),
  ('GH', 'Ghana', '🇬🇭'),
  ('GN', 'Guinea', '🇬🇳'),
  ('GW', 'Guinea-Bissau', '🇬🇼'),
  ('CI', 'Côte d''Ivoire', '🇨🇮'),
  ('KE', 'Kenya', '🇰🇪'),
  ('LS', 'Lesotho', '🇱🇸'),
  ('LR', 'Liberia', '🇱🇷'),
  ('LY', 'Libya', '🇱🇾'),
  ('MG', 'Madagascar', '🇲🇬'),
  ('MW', 'Malawi', '🇲🇼'),
  ('ML', 'Mali', '🇲🇱'),
  ('MR', 'Mauritania', '🇲🇷'),
  ('MU', 'Mauritius', '🇲🇺'),
  ('MA', 'Morocco', '🇲🇦'),
  ('MZ', 'Mozambique', '🇲🇿'),
  ('NA', 'Namibia', '🇳🇦'),
  ('NE', 'Niger', '🇳🇪'),
  ('NG', 'Nigeria', '🇳🇬'),
  ('RW', 'Rwanda', '🇷🇼'),
  ('ST', 'São Tomé & Príncipe', '🇸🇹'),
  ('SN', 'Senegal', '🇸🇳'),
  ('SC', 'Seychelles', '🇸🇨'),
  ('SL', 'Sierra Leone', '🇸🇱'),
  ('SO', 'Somalia', '🇸🇴'),
  ('ZA', 'South Africa', '🇿🇦'),
  ('SS', 'South Sudan', '🇸🇸'),
  ('SD', 'Sudan', '🇸🇩'),
  ('TZ', 'Tanzania', '🇹🇿'),
  ('TG', 'Togo', '🇹🇬'),
  ('TN', 'Tunisia', '🇹🇳'),
  ('UG', 'Uganda', '🇺🇬'),
  ('ZM', 'Zambia', '🇿🇲'),
  ('ZW', 'Zimbabwe', '🇿🇼')
on conflict (code) do update set name = excluded.name, flag_emoji = excluded.flag_emoji;

-- === positions =================================================
insert into public.positions (code, name, "group") values
  ('GK',  'Goalkeeper',             'GK'),
  ('CB',  'Centre-back',            'DEF'),
  ('LB',  'Left-back',              'DEF'),
  ('RB',  'Right-back',             'DEF'),
  ('LWB', 'Left wing-back',         'DEF'),
  ('RWB', 'Right wing-back',        'DEF'),
  ('DM',  'Defensive midfielder',   'MID'),
  ('CM',  'Central midfielder',     'MID'),
  ('AM',  'Attacking midfielder',   'MID'),
  ('LM',  'Left midfielder',        'MID'),
  ('RM',  'Right midfielder',       'MID'),
  ('LW',  'Left winger',            'FWD'),
  ('RW',  'Right winger',           'FWD'),
  ('SS',  'Second striker',         'FWD'),
  ('ST',  'Striker',                'FWD')
on conflict (code) do update set name = excluded.name, "group" = excluded."group";

-- === competitions ==============================================
-- Continental and national team tournaments come first; domestic leagues
-- are curated top-flight starting set.
insert into public.competitions (name, type, country_code) values
  -- Continental (club)
  ('CAF Champions League',        'continental_club', null),
  ('CAF Confederation Cup',       'continental_club', null),
  ('CAF Super Cup',               'continental_club', null),

  -- National team
  ('Africa Cup of Nations (AFCON)',    'national_team', null),
  ('African Nations Championship (CHAN)', 'national_team', null),
  ('U-20 Africa Cup of Nations',       'national_team', null),
  ('U-17 Africa Cup of Nations',       'national_team', null),
  ('Women''s Africa Cup of Nations',   'national_team', null),

  -- Domestic top-flight (curated seed set — easy to expand later)
  ('Egyptian Premier League',      'domestic', 'EG'),
  ('Botola Pro',                   'domestic', 'MA'),
  ('Tunisian Ligue 1',             'domestic', 'TN'),
  ('South African Premiership',    'domestic', 'ZA'),
  ('Nigerian Premier Football League', 'domestic', 'NG'),
  ('Ghana Premier League',         'domestic', 'GH'),
  ('Algerian Ligue Professionnelle 1', 'domestic', 'DZ'),
  ('Ivorian Ligue 1',              'domestic', 'CI'),
  ('Kenyan Premier League',        'domestic', 'KE'),
  ('Senegalese Ligue 1',           'domestic', 'SN')
on conflict do nothing;
