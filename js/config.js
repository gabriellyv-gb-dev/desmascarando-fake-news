// js/config.js
// Configuração central do site. Edite os valores abaixo para publicar o projeto.
//
// STORAGE_PROVIDER:
//   "supabase"     -> usa o Supabase (recomendado, dados centralizados na nuvem).
//   "sqlite-local"  -> usa um banco SQLite gravado no navegador de cada visitante
//                      (IndexedDB), sem servidor. Útil como alternativa/backup.
//
// Se STORAGE_PROVIDER for "supabase" mas SUPABASE_URL/SUPABASE_ANON_KEY estiverem
// vazios, o sistema cai automaticamente para "sqlite-local" e avisa no console.

export const CONFIG = {
  STORAGE_PROVIDER: "supabase", // "supabase" | "sqlite-local"

  // Preencha depois de criar o projeto em https://supabase.com
  // Veja o passo a passo no README.md ("Como configurar o Supabase").
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",

  // Informações gerais do projeto (usadas em meta tags e textos).
  SITE_NAME: "Desmascarando Fake News",
  SITE_DESCRICAO:
    "Site educativo sobre fake news e desinformação, com quiz interativo. Projeto de Extensão UNISA.",
  // Substitua pela URL final do GitHub Pages depois de publicar, por exemplo:
  // "https://SEU-USUARIO.github.io/desmascarando-fake-news/"
  SITE_URL: "https://SEU-USUARIO.github.io/desmascarando-fake-news/",

  AUTORES:
    "Gabrielly Vitoria Xavier dos Santos e Andreas Yuji Gabriel Cunha Pinheiro",
  INSTITUICAO: "UNISA – Universidade Santo Amaro",
  TEMA_DISCIPLINA:
    "Ética na comunicação e responsabilidade social na era da informação",

  // Regras do quiz
  TOTAL_PERGUNTAS: 10,
  NOTA_APROVACAO: 7, // acertos mínimos (de 10) para ser considerado "aprovado"
};
