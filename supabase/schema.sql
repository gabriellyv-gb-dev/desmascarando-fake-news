-- supabase/schema.sql
-- Schema do banco de dados para o projeto "Desmascarando Fake News".
--
-- Como usar: no painel do Supabase, vá em "SQL Editor" -> "New query",
-- cole todo o conteúdo deste arquivo e clique em "Run".
-- Veja o passo a passo completo no README.md.

-- Extensão necessária para gen_random_uuid()
create extension if not exists "pgcrypto";

-- =========================================================
-- Tabela principal: um registro por participante do quiz
-- =========================================================
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 60),
  answers jsonb not null,
  score int not null check (score >= 0),
  total int not null check (total >= 0),
  passed boolean not null
);

comment on table public.quiz_results is
  'Resultados do quiz de fake news. Usado apenas para estatísticas agregadas do projeto de extensão (participantes, abrangência, ODS 4 e ODS 16). Não expor via SELECT público.';

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================
-- Habilita RLS: por padrão, ninguém consegue ler, alterar ou apagar nada.
alter table public.quiz_results enable row level security;

-- Permite APENAS inserção (INSERT) para o papel anônimo (usuários do site).
-- Não existe policy de SELECT, UPDATE ou DELETE para "anon": ou seja,
-- o próprio site não consegue listar/editar/apagar respostas de outras pessoas.
drop policy if exists "anon pode inserir resultados" on public.quiz_results;
create policy "anon pode inserir resultados"
  on public.quiz_results
  for insert
  to anon
  with check (true);

-- =========================================================
-- Função de estatísticas agregadas (para o admin.html e o relatório)
-- =========================================================
-- SECURITY DEFINER: roda com os privilégios de quem criou a função,
-- então consegue ler a tabela mesmo com RLS ativo -- mas só devolve
-- números agregados, nunca linhas individuais (nome, respostas etc.).
create or replace function public.quiz_stats()
returns table (
  participantes bigint,
  media_acertos numeric,
  percentual_aprovados numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)::bigint as participantes,
    coalesce(round(avg(score)::numeric, 2), 0) as media_acertos,
    coalesce(round(sum(case when passed then 1 else 0 end)::numeric * 100.0 / nullif(count(*), 0), 1), 0) as percentual_aprovados
  from public.quiz_results;
$$;

comment on function public.quiz_stats() is
  'Retorna apenas agregados (total de participantes, média de acertos, % de aprovados). Não expõe dados individuais.';

-- Libera a execução da função para o papel anônimo (site público).
grant execute on function public.quiz_stats() to anon;

-- =========================================================
-- Consultas úteis para o relatório final (rode manualmente no SQL Editor
-- com sua própria conta, que tem acesso de leitura completo)
-- =========================================================
-- Total de participantes:
--   select count(*) from public.quiz_results;
--
-- Média de acertos e % de aprovados:
--   select * from public.quiz_stats();
--
-- Participantes por dia (para medir abrangência ao longo da divulgação):
--   select date_trunc('day', created_at) as dia, count(*) as participantes
--   from public.quiz_results
--   group by 1
--   order by 1;
