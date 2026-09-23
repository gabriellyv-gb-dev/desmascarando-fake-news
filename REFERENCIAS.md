# Referências e URLs usadas no site

Este arquivo lista **todas** as URLs externas usadas no site (`index.html`,
`quiz.html`, `README.md`), para conferência manual antes da divulgação.
Nenhuma URL foi inventada — todas apontam para domínios oficiais conhecidos —
mas algumas foram marcadas como **VERIFICAR** porque não há certeza absoluta
sobre o caminho exato da página (ex.: a editoria pode ter mudado de endereço
desde o treinamento do modelo). Nesses casos, o link aponta para o domínio
principal do site, que é seguro, e o caminho específico deve ser conferido e
ajustado manualmente se necessário.

## Alta confiança (URL específica conferida por padrão de uso conhecido)

| Onde é usada | URL | Observação |
|---|---|---|
| index.html — Onde checar / Referências | https://www.aosfatos.org/ | Site oficial da agência Aos Fatos |
| index.html — Onde checar / Referências | https://g1.globo.com/fato-ou-fake/ | Editoria "Fato ou Fake" do G1 |
| index.html — Onde checar / Referências | https://www.boatos.org/ | Site oficial do Boatos.org |
| index.html — Onde checar / Referências | https://www.e-farsas.com/ | Site oficial do E-farsas |
| index.html — Onde checar / Referências | https://cartilha.cert.br/ | Cartilha de Segurança para Internet (CERT.br / NIC.br) |
| index.html — Referências | https://www.science.org/doi/10.1126/science.aap9559 | DOI do artigo de Vosoughi, Roy e Aral (Science, 2018) |
| index.html — Ética / Referências | http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | Lei 13.709/2018 (LGPD), no site do Planalto |

## VERIFICAR MANUALMENTE (domínio confiável, caminho/URL exata incerta)

| Onde é usada | URL usada no site | O que conferir |
|---|---|---|
| index.html — Onde checar / Referências | https://lupa.uol.com.br/ | Confirmar se este é o endereço atual da Agência Lupa (passou a operar integrada ao UOL) |
| index.html — Onde checar / Referências | https://projetocomprova.com.br/ | Confirmar se o domínio do Projeto Comprova segue ativo e atualizado |
| index.html — Onde checar / Referências | https://www.estadao.com.br/estadao-verifica/ | Confirmar o caminho exato da editoria "Estadão Verifica" |
| index.html — Onde checar / Referências | https://www.tse.jus.br/ | Foi usada a página inicial do TSE por segurança; localizar e linkar diretamente a seção "Fato ou Boato" se ainda existir com esse nome |

## Outras URLs do projeto (não são fontes de conteúdo, mas aparecem no código)

| Onde é usada | URL | Observação |
|---|---|---|
| js/storage/supabaseStorage.js | https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.1/+esm | Biblioteca cliente do Supabase, versão fixada, via jsDelivr |
| js/storage/sqliteLocalStorage.js | https://cdn.jsdelivr.net/npm/sql.js@1.14.2/+esm | Biblioteca sql.js (SQLite via WebAssembly), versão fixada, via jsDelivr |
| index.html / quiz.html (meta og:url) | https://SEU-USUARIO.github.io/desmascarando-fake-news/ | **Placeholder** — trocar pela URL real após publicar no GitHub Pages (ver README.md) |

## Ação recomendada antes de divulgar

1. Clicar em cada link da seção "Onde checar" do `index.html` e confirmar que abre a
   página certa (agência de checagem correspondente).
2. Se algum link "VERIFICAR" estiver desatualizado, corrigir o `href` diretamente no
   `index.html` (e remover o comentário `<!-- VERIFICAR -->` correspondente) e atualizar
   este arquivo.
3. Substituir `https://SEU-USUARIO.github.io/desmascarando-fake-news/` pela URL real do
   GitHub Pages em `index.html`, `quiz.html` e `js/config.js` (campo `SITE_URL`).
