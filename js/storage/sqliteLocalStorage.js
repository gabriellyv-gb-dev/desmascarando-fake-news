// js/storage/sqliteLocalStorage.js
// Provider de armazenamento alternativo: um banco SQLite rodando inteiramente
// no navegador (via sql.js / WebAssembly), persistido no IndexedDB do
// próprio dispositivo do visitante. Não depende de nenhum servidor.
//
// Limitação importante: os dados ficam gravados apenas no navegador de quem
// respondeu o quiz, não são centralizados. Por isso o Supabase é o provider
// recomendado como padrão; este serve como alternativa/backup e é usado
// automaticamente se o Supabase não estiver configurado.

const SQLJS_CDN_URL = "https://cdn.jsdelivr.net/npm/sql.js@1.14.2/+esm";
const IDB_NAME = "ffn-local-storage";
const IDB_STORE = "sqlite-file";
const IDB_KEY = "database.sqlite";

export const NOME_PROVIDER = "sqlite-local";

let SQL = null;
let db = null;

function abrirIndexedDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB não disponível neste navegador."));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function carregarBytesSalvos() {
  try {
    const idb = await abrirIndexedDB();
    return await new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (erro) {
    console.warn(
      "[sqliteLocalStorage] Não foi possível ler o banco salvo, começando um novo.",
      erro
    );
    return null;
  }
}

async function salvarBytes(bytes) {
  try {
    const idb = await abrirIndexedDB();
    await new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (erro) {
    // Não perder o resultado já calculado/exibido por causa de um erro de gravação.
    console.warn("[sqliteLocalStorage] Não foi possível salvar o banco local:", erro);
  }
}

function garantirTabela(database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      answers TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      passed INTEGER NOT NULL
    );
  `);
}

export async function init() {
  if (db) return;

  console.warn(
    "[sqliteLocalStorage] Usando banco SQLite local (no navegador). " +
      "Os resultados ficam salvos apenas neste dispositivo, no IndexedDB."
  );

  const initSqlJs = (await import(/* @vite-ignore */ SQLJS_CDN_URL)).default;
  // O build "+esm" servido pelo jsDelivr não resolve sozinho o caminho do
  // arquivo .wasm (fica faltando a pasta "dist/"), então apontamos manualmente.
  SQL = await initSqlJs({
    locateFile: (arquivo) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/${arquivo}`,
  });

  const bytesSalvos = await carregarBytesSalvos();
  db = bytesSalvos
    ? new SQL.Database(new Uint8Array(bytesSalvos))
    : new SQL.Database();

  garantirTabela(db);
}

export async function saveResult(result) {
  if (!db) throw new Error("Banco local não inicializado.");

  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO quiz_results (id, created_at, name, answers, score, total, passed)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      createdAt,
      result.name,
      JSON.stringify(result.answers),
      result.score,
      result.total,
      result.passed ? 1 : 0,
    ]
  );

  await salvarBytes(db.export());
}

export async function getStats() {
  if (!db) throw new Error("Banco local não inicializado.");

  const res = db.exec(`
    SELECT
      COUNT(*) AS participantes,
      COALESCE(SUM(passed), 0) AS aprovados,
      COALESCE(SUM(1 - passed), 0) AS reprovados,
      COALESCE(AVG(score), 0) AS media_acertos,
      COALESCE(SUM(passed) * 100.0 / COUNT(*), 0) AS percentual_aprovados
    FROM quiz_results;
  `);

  if (!res.length || !res[0].values.length) {
    return { participantes: 0, aprovados: 0, reprovados: 0, mediaAcertos: 0, percentualAprovados: 0 };
  }

  const [participantes, aprovados, reprovados, mediaAcertos, percentualAprovados] =
    res[0].values[0];
  return { participantes, aprovados, reprovados, mediaAcertos, percentualAprovados };
}

/** Usado só em resultados.html (modo sqlite-local): devolve um Blob do arquivo .sqlite para download. */
export async function exportarBanco() {
  if (!db) throw new Error("Banco local não inicializado.");
  const bytes = db.export();
  return new Blob([bytes], { type: "application/x-sqlite3" });
}
