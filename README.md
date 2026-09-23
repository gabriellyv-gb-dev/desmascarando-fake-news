# Desmascarando Fake News

Site educativo sobre fake news e desinformação, com um quiz de 10 perguntas. Desenvolvido para o **Projeto de Extensão da UNISA** (Universidade Santo Amaro), disciplina sobre *Ética na comunicação e responsabilidade social na era da informação*.

🔗 **Site:** https://gabriellyv-gb-dev.github.io/desmascarando-fake-news/

**Autores:** Gabrielly Vitoria Xavier dos Santos e Andreas Yuji Gabriel Cunha Pinheiro.

## Sobre o projeto

A ação é voltada aos moradores de um condomínio residencial em São Paulo (todas as idades, principalmente pelo celular). O site explica como identificar fake news e golpes de WhatsApp e Pix, e o quiz mede a participação: quantas pessoas responderam e qual foi o desempenho. Esses números alimentam os indicadores do relatório (participantes, abrangência, ODS 4 e ODS 16).

O quiz pede consentimento antes de coletar qualquer dado e guarda apenas nome/apelido, respostas e resultado (LGPD).

## Feito com Claude

O código deste site foi desenvolvido com o apoio do **Claude** (Claude Code, da Anthropic), a partir das especificações dos autores. A lista de fontes e links usados está em [REFERENCIAS.md](REFERENCIAS.md), para conferência.

## Tecnologias

HTML, CSS e JavaScript puros (sem framework e sem build), hospedados no **GitHub Pages**. Os resultados ficam no **Supabase** (Postgres). Como alternativa, há um modo SQLite local no navegador (`sql.js`), usado automaticamente se o Supabase não estiver configurado.

| Página | O que faz |
|---|---|
| `index.html` | Conteúdo educativo |
| `quiz.html` | Quiz com resultado e explicação das respostas |
| `resultados.html` | Quantos fizeram o quiz, quantos passaram e quantos não passaram |

## Rodar localmente

O site usa módulos ES, então precisa de um servidor local (não funciona abrindo o arquivo direto):

```bash
python3 -m http.server 8000   # depois abra http://localhost:8000
```

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Ele cria a tabela `quiz_results` (o site só consegue **inserir**, nunca ler as respostas) e a função `quiz_stats()` (só totais).
3. Copie a **Project URL** e a **Publishable key** (Project Settings → API Keys) para [`js/config.js`](js/config.js), nos campos `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Nunca use a *secret key* no site.

## Publicar no GitHub Pages

**Settings → Pages → Deploy from a branch →** `main` / `/ (root)`.

## Dados para o relatório

No SQL Editor do Supabase:

```sql
select * from public.quiz_stats();   -- participantes, aprovados, não aprovados, média e % de aprovação

select date_trunc('day', created_at) as dia, count(*) as participantes
from public.quiz_results group by 1 order by 1;   -- participação por dia
```

Antes de divulgar, apague os dados de teste: `truncate table public.quiz_results;`
