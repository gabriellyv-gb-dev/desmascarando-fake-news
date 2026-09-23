// js/storage/storage.js
// Camada de armazenamento abstrata. O resto do site chama apenas as funções
// deste arquivo (saveResult / getStats) e não precisa saber se os dados
// estão indo para o Supabase ou para um banco SQLite local no navegador.
//
// Troca de provedor: edite CONFIG.STORAGE_PROVIDER em js/config.js.
// Se o Supabase estiver configurado mas indisponível (ex.: sem internet),
// cada provider trata seus próprios erros de rede sem derrubar o quiz.

import { CONFIG } from "../config.js";

let providerPromise = null;

function supabaseConfigurado() {
  return Boolean(
    CONFIG.SUPABASE_URL &&
      CONFIG.SUPABASE_ANON_KEY &&
      CONFIG.SUPABASE_URL.trim() !== "" &&
      CONFIG.SUPABASE_ANON_KEY.trim() !== ""
  );
}

/**
 * Resolve (uma única vez) qual provedor de armazenamento usar e o
 * inicializa. Retorna uma Promise que resolve para um objeto com
 * { saveResult, getStats, exportar? }.
 */
async function getProvider() {
  if (providerPromise) return providerPromise;

  providerPromise = (async () => {
    const quiserSupabase = CONFIG.STORAGE_PROVIDER === "supabase";

    if (quiserSupabase && supabaseConfigurado()) {
      try {
        const mod = await import("./supabaseStorage.js");
        await mod.init(CONFIG);
        return mod;
      } catch (erro) {
        console.warn(
          "[storage] Falha ao iniciar o Supabase, usando sqlite-local como alternativa.",
          erro
        );
        const fallback = await import("./sqliteLocalStorage.js");
        await fallback.init(CONFIG);
        return fallback;
      }
    }

    if (quiserSupabase && !supabaseConfigurado()) {
      console.warn(
        "[storage] STORAGE_PROVIDER está como 'supabase', mas SUPABASE_URL/SUPABASE_ANON_KEY " +
          "não foram preenchidos em js/config.js. Usando sqlite-local (banco local no navegador) automaticamente."
      );
    }

    const local = await import("./sqliteLocalStorage.js");
    await local.init(CONFIG);
    return local;
  })();

  return providerPromise;
}

/**
 * Salva o resultado de um participante do quiz.
 * @param {{name: string, answers: Array<object>, score: number, total: number, passed: boolean}} result
 */
export async function saveResult(result) {
  const provider = await getProvider();
  return provider.saveResult(result);
}

/**
 * Retorna estatísticas agregadas: { participantes, aprovados, reprovados, mediaAcertos, percentualAprovados }
 */
export async function getStats() {
  const provider = await getProvider();
  return provider.getStats();
}

/**
 * Exporta o banco local (só existe no provider sqlite-local; usado no resultados.html).
 * Retorna null se o provider atual não suportar exportação.
 */
export async function exportarBancoLocal() {
  const provider = await getProvider();
  if (typeof provider.exportarBanco === "function") {
    return provider.exportarBanco();
  }
  return null;
}

/** Nome do provider atualmente em uso, para o resultados.html saber o modo em uso */
export async function nomeProviderAtivo() {
  const provider = await getProvider();
  return provider.NOME_PROVIDER || "desconhecido";
}
