-- The few pieces of Supabase the migrations rely on, so they can run on a
-- plain local Postgres: the API roles, auth.users and auth.uid().
-- Never apply this to a real Supabase project.

create role anon nologin;
create role authenticated nologin;
grant usage on schema public to anon, authenticated;

create schema auth;
grant usage on schema auth to anon, authenticated;

create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);

create function auth.uid() returns uuid language sql stable as $$
  select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid;
$$;

-- Supabase grants execute on new public functions to the API roles by
-- default; copy that so the tests prove the migrations take it away again.
alter default privileges in schema public grant execute on functions to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;

-- Test helpers.
create schema t;
grant usage on schema t to anon, authenticated;

create function t.ok(p_condition boolean, p_message text) returns void language plpgsql as $$
begin
  if p_condition is not true then
    raise exception 'FAILED: %', p_message;
  end if;
  raise notice 'ok   %', p_message;
end;
$$;

-- Runs a statement that must fail, optionally with a message matching p_like.
create function t.fails(p_sql text, p_message text, p_like text default '%') returns void
language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    if sqlerrm not like p_like then
      raise exception 'FAILED: % (wrong error: %)', p_message, sqlerrm;
    end if;
    raise notice 'ok   %', p_message;
    return;
  end;
  raise exception 'FAILED: % (statement succeeded)', p_message;
end;
$$;

-- Become a signed-in user, or the public.
create function t.as_user(p_user uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p_user)::text, false),
         set_config('role', 'authenticated', false);
$$;
create function t.as_public() returns void language sql as $$
  select set_config('request.jwt.claims', '', false), set_config('role', 'anon', false);
$$;
