create table if not exists public.la_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id text not null check (course_id in ('engineering','semantic','context','agent','artifacts','ml')),
 completed boolean not null default true,
 updated_at timestamptz not null default now(),
 primary key (user_id,course_id)
);
create table if not exists public.la_projects (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 180),
 profile jsonb not null default '{}'::jsonb check (jsonb_typeof(profile)='object' and octet_length(profile::text)<=50000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(id,user_id)
);
create index if not exists la_projects_user_created on public.la_projects(user_id,created_at desc);
create table if not exists public.la_runs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 project_id uuid,
 method text not null check (method in ('ACP','K-means','agent-local','agent-generatif')),
 summary jsonb not null check (jsonb_typeof(summary)='object' and octet_length(summary::text)<=150000),
 created_at timestamptz not null default now(),
 foreign key(project_id,user_id) references public.la_projects(id,user_id) on delete cascade
);
create index if not exists la_runs_user_created on public.la_runs(user_id,created_at desc);
create index if not exists la_runs_project_owner on public.la_runs(project_id,user_id);
alter table public.la_progress enable row level security;
alter table public.la_projects enable row level security;
alter table public.la_runs enable row level security;
revoke all on public.la_progress,public.la_projects,public.la_runs from anon,authenticated;
grant select,insert,update,delete on public.la_progress,public.la_projects,public.la_runs to authenticated;
do $policy$ begin
 create policy progress_select on public.la_progress for select to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy progress_insert on public.la_progress for insert to authenticated with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy progress_update on public.la_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy progress_delete on public.la_progress for delete to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy projects_select on public.la_projects for select to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy projects_insert on public.la_projects for insert to authenticated with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy projects_update on public.la_projects for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy projects_delete on public.la_projects for delete to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy runs_select on public.la_runs for select to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy runs_insert on public.la_runs for insert to authenticated with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy runs_update on public.la_runs for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy runs_delete on public.la_runs for delete to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
create table if not exists public.la_ai_requests (
 user_id uuid not null references auth.users(id) on delete cascade,
 request_id uuid not null default gen_random_uuid(),
 created_at timestamptz not null default transaction_timestamp(),
 primary key(user_id,request_id)
);
create index if not exists la_ai_requests_user_date on public.la_ai_requests(user_id,created_at);
alter table public.la_ai_requests enable row level security;
revoke all on public.la_ai_requests from anon,authenticated;
grant select on public.la_ai_requests to authenticated;
grant insert(user_id,request_id) on public.la_ai_requests to authenticated;
do $policy$ begin
 create policy ai_requests_select on public.la_ai_requests for select to authenticated using ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
do $policy$ begin
 create policy ai_requests_insert on public.la_ai_requests for insert to authenticated with check ((select auth.uid())=user_id);
 exception when duplicate_object then null;
end $policy$;
create or replace function public.la_reserve_ai_request() returns uuid
language plpgsql security invoker set search_path='' as $$
declare uid uuid := auth.uid(); request_uuid uuid;
begin
 if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text,0));
 if (select count(*) from public.la_ai_requests where user_id=uid and created_at >= pg_catalog.date_trunc('day',pg_catalog.now() at time zone 'UTC') at time zone 'UTC') >= 10 then
  raise exception 'Daily request limit reached' using errcode='P0001';
 end if;
 insert into public.la_ai_requests(user_id) values(uid) returning request_id into request_uuid;
 return request_uuid;
end;
$$;
revoke all on function public.la_reserve_ai_request() from public,anon;
grant execute on function public.la_reserve_ai_request() to authenticated;
