// js/storage/supabaseStorage.js
// Provider de armazenamento usando Supabase (Postgres na nuvem).
// Carregado dinamicamente por js/storage/storage.js quando
// CONFIG.STORAGE_PROVIDER === "supabase" e as credenciais estão preenchidas.
//
// Só faz INSERT (para salvar resultados) e chama a função quiz_stats()
// (para ler agregados). Nunca faz SELECT direto na tabela quiz_results:
// as políticas de RLS (veja supabase/schema.sql) não permitem leitura
// pública das respostas individuais, apenas inserção.

// Versão fixada via jsdelivr (+esm converte o pacote npm em módulo ES).
const SUPABASE_JS_URL =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.1/+esm";

export const NOME_PROVIDER = "supabase";

let cliente = null;

export async function init(config) {
  const { createClient } = await import(/* @vite-ignore */ SUPABASE_JS_URL);
  cliente = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
}

export async function saveResult(result) {
  if (!cliente) throw new Error("Cliente Supabase não inicializado.");

  const { error } = await cliente.from("quiz_results").insert({
    name: result.name,
    answers: result.answers,
    score: result.score,
    total: result.total,
    passed: result.passed,
  });

  if (error) {
    // Erro de rede/servidor não deve derrubar a tela de resultado já exibida.
    console.error("[supabaseStorage] Erro ao salvar resultado:", error);
    throw error;
  }
}

export async function getStats() {
  if (!cliente) throw new Error("Cliente Supabase não inicializado.");

  const { data, error } = await cliente.rpc("quiz_stats");
  if (error) {
    console.error("[supabaseStorage] Erro ao buscar estatísticas:", error);
    throw error;
  }

  // quiz_stats() retorna uma linha: { participantes, media_acertos, percentual_aprovados }
  const linha = Array.isArray(data) ? data[0] : data;
  return {
    participantes: linha?.participantes ?? 0,
    mediaAcertos: linha?.media_acertos ?? 0,
    percentualAprovados: linha?.percentual_aprovados ?? 0,
  };
}
