begin;
insert into auth.users(id) values ('8d3d8c77-9763-4f89-8001-100000000001'),('8d3d8c77-9763-4f89-8001-100000000002');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"8d3d8c77-9763-4f89-8001-100000000001","role":"authenticated"}',true);
insert into public.la_projects(id,user_id,title,profile) values ('8d3d8c77-9763-4f89-8001-200000000001','8d3d8c77-9763-4f89-8001-100000000001','RLS test','{}');
insert into public.la_progress(user_id,course_id) values ('8d3d8c77-9763-4f89-8001-100000000001','engineering');
do $$ begin
 if (select count(*) from public.la_projects)<>1 then raise exception 'Own project invisible'; end if;
 begin
  update public.la_projects set user_id='8d3d8c77-9763-4f89-8001-100000000002';
  raise exception 'Ownership reassignment allowed';
 exception when insufficient_privilege then null; end;
 for i in 1..10 loop perform public.la_reserve_ai_request(); end loop;
 begin perform public.la_reserve_ai_request();
 exception when sqlstate 'P0001' then return; end;
 raise exception 'Daily limit not enforced';
end $$;
do $$ begin
 begin update public.la_ai_requests set created_at=now()-interval '2 days';
  raise exception 'Quota rewrite allowed';
 exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claims','{"sub":"8d3d8c77-9763-4f89-8001-100000000002","role":"authenticated"}',true);
do $$ begin
 if (select count(*) from public.la_projects)<>0 then raise exception 'Cross-user project leak';end if;
 if (select count(*) from public.la_progress)<>0 then raise exception 'Cross-user progress leak';end if;
 if (select count(*) from public.la_ai_requests)<>0 then raise exception 'Cross-user quota leak';end if;
 begin
 insert into public.la_runs(user_id,project_id,method,summary) values('8d3d8c77-9763-4f89-8001-100000000002','8d3d8c77-9763-4f89-8001-200000000001','ACP','{}');
 raise exception 'Cross-user project reference allowed';
 exception when foreign_key_violation then null;end;
 begin insert into public.la_progress(user_id,course_id) values('8d3d8c77-9763-4f89-8001-100000000001','semantic');
 raise exception 'Cross-user write allowed';
 exception when insufficient_privilege then null;end;
end $$;
set local role anon;
do $$ begin
 begin perform count(*) from public.la_projects;
 raise exception 'Anonymous read allowed';
 exception when insufficient_privilege then null;end;
end $$;
rollback;
select 'PASS: isolation, ownership, composite FK, anonymous denial, daily quota; fixtures rolled back' as verification;