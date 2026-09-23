# Desmascarando Fake News

Site educativo sobre fake news e desinformação, com um quiz interativo,
desenvolvido como **Projeto de Extensão da UNISA (Universidade Santo Amaro)**.

- **Tema da disciplina:** Ética na comunicação e responsabilidade social na era da informação.
- **Autores:** Gabrielly Vitoria Xavier dos Santos e Andreas Yuji Gabriel Cunha Pinheiro.
- **Público-alvo:** moradores de um condomínio residencial em São Paulo (todas as idades,
  incluindo idosos, majoritariamente acessando pelo celular).

O site é 100% estático (HTML, CSS e JavaScript puros, sem build step) e feito para rodar
apenas no **GitHub Pages**. Ele explica o que são fake news, por que se espalham, como
identificá-las e onde checar, e termina com um quiz de 10 perguntas cujo resultado
(participação e desempenho) alimenta os indicadores do relatório do projeto (participantes,
abrangência, ODS 4 — Educação de Qualidade e ODS 16 — Paz, Justiça e Instituições Eficazes).

## Estrutura do projeto

```
index.html              Página informativa (conteúdo educativo)
quiz.html                Quiz de 10 perguntas
resultados.html           Página pública com quantos fizeram o quiz, passaram e não passaram
css/style.css              Estilo único do site (mobile-first, acessível)
js/config.js                 Configurações (Supabase, textos gerais, regras do quiz)
js/questions.js                Banco de perguntas do quiz
js/quiz.js                       Lógica do quiz
js/main.js                         Pequenos scripts da página inicial
js/resultados.js                      Lógica da página resultados.html
js/storage/storage.js                  Interface de armazenamento (troca de provider)
js/storage/supabaseStorage.js            Provider: Supabase (padrão)
js/storage/sqliteLocalStorage.js           Provider: SQLite local no navegador (alternativa)
supabase/schema.sql                          Schema SQL para criar no Supabase
assets/                                        Favicon (SVG) e imagem para redes sociais
REFERENCIAS.md                                   Lista de URLs usadas, para conferência manual
```

## Como rodar localmente

Como o site usa ES Modules (`import`/`export`), não é possível simplesmente abrir os
arquivos `.html` direto no navegador (`file://`) — é preciso servir os arquivos por
`http://`. Qualquer servidor estático simples resolve. Na pasta do projeto, rode um dos
comandos abaixo e depois acesse `http://localhost:8000` (ou a porta indicada):

```bash
# Opção 1: Python (já vem instalado na maioria dos sistemas)
python3 -m http.server 8000

# Opção 2: Node (se tiver o Node instalado)
npx serve .
```

Nenhuma dessas opções é necessária para publicar o site — servem só para testar no seu
computador antes de colocar no ar.

## Como configurar o Supabase (provider padrão de armazenamento)

O site salva os resultados do quiz (nome, respostas, pontuação) em um banco de dados para
gerar as estatísticas do projeto. O provider padrão é o **Supabase** (Postgres gratuito na
nuvem). Passo a passo:

1. **Criar uma conta e um projeto.** Acesse [supabase.com](https://supabase.com), crie uma
   conta gratuita e clique em "New Project". Escolha um nome (ex.: `desmascarando-fake-news`),
   uma senha para o banco (guarde-a, mas ela não será usada no site) e a região mais próxima
   (ex.: South America - São Paulo, se disponível).
2. **Rodar o schema.** Espere o projeto terminar de ser criado, depois vá no menu lateral em
   **SQL Editor** → **New query**. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql)
   deste repositório, copie todo o conteúdo, cole no editor e clique em **Run**. Isso cria a
   tabela `quiz_results`, ativa a segurança por linha (RLS) permitindo apenas inserção
   pública, e cria a função `quiz_stats()` que devolve só os números agregados.
3. **Copiar a URL e a chave pública (anon key).** No menu lateral, vá em
   **Project Settings** → **API**. Copie o valor de **Project URL** e de **anon public**
   (a chave `anon`/`public`; **nunca** use a chave `service_role` no site, pois ela é secreta).
4. **Preencher `js/config.js`.** Abra o arquivo [`js/config.js`](js/config.js) e preencha:

   ```js
   SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
   SUPABASE_ANON_KEY: "sua-chave-anon-aqui",
   ```

   Com `STORAGE_PROVIDER: "supabase"` (já é o padrão). Pronto — o quiz já vai salvar os
   resultados no Supabase.

### E se eu não quiser usar o Supabase?

Troque `STORAGE_PROVIDER` para `"sqlite-local"` em `js/config.js`. Nesse modo, cada
visitante tem um bancozinho SQLite salvo apenas no próprio navegador (via IndexedDB, usando
a biblioteca [sql.js](https://sql.js.org/)). É útil como alternativa/backup, mas os dados
**não ficam centralizados** — cada celular guarda só os próprios resultados. A página
[`resultados.html`](resultados.html) tem um botão para exportar esse banco local como um arquivo
`.sqlite`. Se o Supabase estiver configurado como padrão mas as credenciais não forem
preenchidas, o site cai automaticamente para o modo `sqlite-local` (e avisa isso no console
do navegador).

## Como publicar no GitHub Pages

1. Suba este repositório para o GitHub (repositório `desmascarando-fake-news`).
2. No GitHub, vá em **Settings** → **Pages**.
3. Em **Build and deployment** → **Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
5. Aguarde alguns minutos. O GitHub mostrará a URL final, algo como
   `https://SEU-USUARIO.github.io/desmascarando-fake-news/`.
6. **Importante:** depois de saber a URL final, atualize:
   - `SITE_URL` em [`js/config.js`](js/config.js);
   - as tags `og:url` e `og:image` em [`index.html`](index.html) e [`quiz.html`](quiz.html)
     (troque `https://SEU-USUARIO.github.io/desmascarando-fake-news/` pela URL real), para
     que o link fique bonito ao ser compartilhado no WhatsApp.

O arquivo [`.nojekyll`](.nojekyll) já está incluído na raiz do projeto para evitar que o
GitHub Pages tente processar o site com Jekyll (o que poderia ignorar pastas/arquivos
começando com `_`).

## Como ver os resultados para o relatório

### Usando Supabase

No painel do Supabase, vá em **SQL Editor** e rode consultas como estas (usando sua própria
conta, que tem acesso total — diferente do site público, que só consegue inserir dados):

```sql
-- Total de participantes
select count(*) from public.quiz_results;

-- Média de acertos e % de aprovados (mesma função usada pelo resultados.html)
select * from public.quiz_stats();

-- Participantes por dia (para medir abrangência ao longo da divulgação)
select date_trunc('day', created_at) as dia, count(*) as participantes
from public.quiz_results
group by 1
order by 1;
```

Essas consultas também estão comentadas no final do arquivo
[`supabase/schema.sql`](supabase/schema.sql).

### Usando sqlite-local

Abra [`resultados.html`](resultados.html) no navegador para ver quantas pessoas fizeram o
quiz, quantas passaram e quantas não passaram, ou clique em **"Exportar banco (.sqlite)"**
para baixar o arquivo e abrir em qualquer visualizador de SQLite. Como os dados ficam por
navegador/dispositivo, essa opção reflete apenas os resultados registrados naquele aparelho
específico.

## Acessibilidade e visual

- Mobile-first, responsivo, com botões grandes (mínimo 48px de altura) e fonte base de 18px.
- Contraste de cores pensado para o padrão AA, navegação por teclado com foco visível, link
  para pular direto ao conteúdo, `label` em todos os campos de formulário.
- HTML semântico (`header`, `nav`, `main`, `section`, `footer`), com títulos organizados em
  hierarquia.
- Ícones em SVG inline (sem imagens remotas), linguagem simples e direta — pensado para um
  público de todas as idades, incluindo pessoas idosas.

## Privacidade e ética

O quiz explica, antes de começar, quais dados são coletados (nome/apelido, respostas e
resultado), para que são usados (estatística de participação do projeto acadêmico) e exige
consentimento explícito (checkbox obrigatório) antes de salvar qualquer coisa — em linha com
a LGPD (Lei nº 13.709/2018) e com o próprio tema do projeto.

## Licença / uso

Projeto acadêmico sem fins comerciais, desenvolvido para a disciplina de extensão da UNISA.
