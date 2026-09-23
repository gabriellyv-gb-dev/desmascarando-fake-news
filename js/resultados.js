// js/resultados.js
// Lógica da página pública resultados.html: mostra só números agregados
// (participantes, aprovados, não aprovados) e, se o provider ativo for
// sqlite-local, oferece exportar o banco local.

import { getStats, exportarBancoLocal, nomeProviderAtivo } from "./storage/storage.js";

const status = document.getElementById("admin-status");
const bloco = document.getElementById("admin-resultados");
const statParticipantes = document.getElementById("stat-participantes");
const statAprovados = document.getElementById("stat-aprovados");
const statReprovados = document.getElementById("stat-reprovados");
const statMedia = document.getElementById("stat-media");
const barra = document.getElementById("admin-barra");
const barraAprovados = document.getElementById("barra-aprovados");
const barraReprovados = document.getElementById("barra-reprovados");
const legendaAprovados = document.getElementById("legenda-aprovados");
const legendaReprovados = document.getElementById("legenda-reprovados");
const avisoLocal = document.getElementById("aviso-local");
const btnAtualizar = document.getElementById("btn-atualizar");
const btnExportar = document.getElementById("btn-exportar");

const formatoInteiro = new Intl.NumberFormat("pt-BR");
const formatoDecimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

function mostrarEstatisticas(stats) {
  const participantes = Number(stats.participantes ?? 0);
  const aprovados = Number(stats.aprovados ?? 0);
  const reprovados = Number(stats.reprovados ?? 0);

  statParticipantes.textContent = formatoInteiro.format(participantes);
  statAprovados.textContent = formatoInteiro.format(aprovados);
  statReprovados.textContent = formatoInteiro.format(reprovados);
  statMedia.textContent = formatoDecimal.format(Number(stats.mediaAcertos ?? 0));

  const pctAprovados = participantes > 0 ? (aprovados / participantes) * 100 : 0;
  const pctReprovados = participantes > 0 ? 100 - pctAprovados : 0;

  barraAprovados.style.width = `${pctAprovados}%`;
  barraReprovados.style.width = `${pctReprovados}%`;
  legendaAprovados.textContent = `${formatoDecimal.format(pctAprovados)}%`;
  legendaReprovados.textContent = `${formatoDecimal.format(pctReprovados)}%`;
  barra.setAttribute(
    "aria-label",
    participantes === 0
      ? "Nenhum participante ainda"
      : `${formatoDecimal.format(pctAprovados)}% passaram e ${formatoDecimal.format(pctReprovados)}% não passaram`
  );
}

async function carregar() {
  status.textContent = "Carregando resultados…";
  bloco.hidden = true;

  try {
    const [stats, provider] = await Promise.all([getStats(), nomeProviderAtivo()]);

    mostrarEstatisticas(stats);

    bloco.hidden = false;
    status.textContent = "";

    // No modo local cada aparelho guarda só os próprios resultados: avisa e libera a exportação.
    const modoLocal = provider === "sqlite-local";
    avisoLocal.hidden = !modoLocal;
    btnExportar.hidden = !modoLocal;
  } catch (erro) {
    console.error("[resultados] Erro ao carregar estatísticas:", erro);
    status.textContent =
      "Não foi possível carregar os resultados agora. Verifique a conexão ou a configuração em js/config.js.";
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
    console.error("[resultados] Erro ao exportar banco local:", erro);
    alert("Não foi possível exportar o banco local. Veja o console para detalhes.");
  }
});

carregar();

const spanAno = document.getElementById("ano-atual");
if (spanAno) spanAno.textContent = String(new Date().getFullYear());
