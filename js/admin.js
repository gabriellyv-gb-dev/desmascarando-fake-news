// js/admin.js
// Lógica da página admin.html: mostra estatísticas agregadas e permite
// exportar o banco local (quando o provider ativo é sqlite-local).

import { getStats, exportarBancoLocal, nomeProviderAtivo } from "./storage/storage.js";

const status = document.getElementById("admin-status");
const bloco = document.getElementById("admin-estatisticas");
const statParticipantes = document.getElementById("stat-participantes");
const statMedia = document.getElementById("stat-media");
const statAprovados = document.getElementById("stat-aprovados");
const spanProvider = document.getElementById("admin-provider");
const btnAtualizar = document.getElementById("btn-atualizar");
const btnExportar = document.getElementById("btn-exportar");

async function carregar() {
  status.textContent = "Carregando estatísticas…";
  bloco.hidden = true;

  try {
    const [stats, provider] = await Promise.all([getStats(), nomeProviderAtivo()]);

    statParticipantes.textContent = String(stats.participantes ?? 0);
    statMedia.textContent = Number(stats.mediaAcertos ?? 0).toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    });
    statAprovados.textContent = `${Number(stats.percentualAprovados ?? 0).toLocaleString(
      "pt-BR",
      { maximumFractionDigits: 1 }
    )}%`;
    spanProvider.textContent = provider;

    bloco.hidden = false;
    status.textContent = "";

    btnExportar.hidden = provider !== "sqlite-local";
  } catch (erro) {
    console.error("[admin] Erro ao carregar estatísticas:", erro);
    status.textContent =
      "Não foi possível carregar as estatísticas agora. Verifique a conexão ou a configuração em js/config.js.";
  }
}

btnAtualizar.addEventListener("click", carregar);

btnExportar.addEventListener("click", async () => {
  try {
    const blob = await exportarBancoLocal();
    if (!blob) {
      alert("Exportação disponível apenas quando o provider ativo é sqlite-local.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "desmascarando-fake-news.sqlite";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (erro) {
    console.error("[admin] Erro ao exportar banco local:", erro);
    alert("Não foi possível exportar o banco local. Veja o console para detalhes.");
  }
});

carregar();
