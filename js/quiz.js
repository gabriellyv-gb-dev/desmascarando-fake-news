// js/quiz.js
// Lógica do quiz (quiz.html). Módulo ES, sem dependências externas.
//
// Segurança: todo texto vindo de dados (perguntas, nome digitado pela pessoa
// etc.) é inserido no DOM sempre via `textContent`, nunca via `innerHTML`,
// para evitar qualquer risco de injeção de HTML/script.

import { CONFIG } from "./config.js";
import { QUESTIONS } from "./questions.js";
import { saveResult } from "./storage/storage.js";

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------
const estado = {
  nome: "",
  indiceAtual: 0,
  opcaoSelecionada: null, // índice da opção marcada na pergunta atual (antes de confirmar)
  respostas: [], // { id, enunciado, opcaoEscolhidaTexto, opcaoEscolhidaIndice, corretaTexto, corretaIndice, acertou, explicacao }
};

// ---------------------------------------------------------------------------
// Elementos do DOM
// ---------------------------------------------------------------------------
const telaIntro = document.getElementById("tela-intro");
const telaPergunta = document.getElementById("tela-pergunta");
const telaResultado = document.getElementById("tela-resultado");

const formIntro = document.getElementById("form-intro");
const inputNome = document.getElementById("input-nome");
const checkboxConsentimento = document.getElementById("checkbox-consentimento");
const erroIntro = document.getElementById("erro-intro");

const textoProgresso = document.getElementById("texto-progresso");
const barraProgressoPreenchimento = document.getElementById(
  "barra-progresso-preenchimento"
);
const barraProgressoTrilha = document.getElementById("barra-progresso-trilha");

const perguntaEnunciado = document.getElementById("pergunta-enunciado");
const listaOpcoes = document.getElementById("lista-opcoes");
const btnProxima = document.getElementById("btn-proxima");

const notaFinal = document.getElementById("nota-final");
const resultadoMensagem = document.getElementById("resultado-mensagem");
const secaoErros = document.getElementById("secao-erros");
const listaErros = document.getElementById("lista-erros");
const blocoAcertouTudo = document.getElementById("bloco-acertou-tudo");
const avisoSalvamento = document.getElementById("aviso-salvamento");

const btnRefazer = document.getElementById("btn-refazer");
const btnCompartilhar = document.getElementById("btn-compartilhar");

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------
function sanitizarNome(valor) {
  return valor
    .replace(/[\u0000-\u001F\u007F]/g, "") // remove caracteres de controle
    .trim()
    .slice(0, 60);
}

function limparElemento(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function mostrarTela(tela) {
  for (const t of [telaIntro, telaPergunta, telaResultado]) {
    t.hidden = t !== tela;
  }
  tela.scrollIntoView({ behavior: "smooth", block: "start" });
  const foco = tela.querySelector("h1, h2, [tabindex='-1']");
  if (foco) foco.focus({ preventScroll: true });
}

// ---------------------------------------------------------------------------
// Tela 1: intro (nome + consentimento)
// ---------------------------------------------------------------------------
formIntro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  erroIntro.textContent = "";

  const nome = sanitizarNome(inputNome.value);

  if (nome.length === 0) {
    erroIntro.textContent = "Por favor, digite seu nome ou apelido.";
    inputNome.focus();
    return;
  }
  if (!checkboxConsentimento.checked) {
    erroIntro.textContent =
      "É preciso marcar a caixinha de consentimento para continuar.";
    checkboxConsentimento.focus();
    return;
  }

  estado.nome = nome;
  estado.indiceAtual = 0;
  estado.respostas = [];

  mostrarTela(telaPergunta);
  renderizarPergunta();
});

// ---------------------------------------------------------------------------
// Tela 2: perguntas
// ---------------------------------------------------------------------------
function renderizarPergunta() {
  const total = QUESTIONS.length;
  const indice = estado.indiceAtual;
  const pergunta = QUESTIONS[indice];

  estado.opcaoSelecionada = null;
  btnProxima.disabled = true;
  btnProxima.textContent =
    indice === total - 1 ? "Ver meu resultado" : "Próxima pergunta";

  // Barra de progresso
  const percentual = Math.round((indice / total) * 100);
  barraProgressoPreenchimento.style.width = `${percentual}%`;
  barraProgressoTrilha.setAttribute("aria-valuenow", String(indice + 1));
  textoProgresso.textContent = `Pergunta ${indice + 1} de ${total}`;

  // Enunciado
  perguntaEnunciado.textContent = pergunta.enunciado;

  // Opções
  limparElemento(listaOpcoes);
  pergunta.opcoes.forEach((opcao, i) => {
    const item = document.createElement("li");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao-quiz";
    botao.setAttribute("role", "radio");
    botao.setAttribute("aria-checked", "false");
    botao.textContent = opcao;
    botao.addEventListener("click", () => selecionarOpcao(i, botao));
    item.appendChild(botao);
    listaOpcoes.appendChild(item);
  });
}

function selecionarOpcao(indiceOpcao, botaoClicado) {
  estado.opcaoSelecionada = indiceOpcao;
  btnProxima.disabled = false;

  for (const botao of listaOpcoes.querySelectorAll(".opcao-quiz")) {
    const selecionado = botao === botaoClicado;
    botao.classList.toggle("opcao-quiz--selecionada", selecionado);
    botao.setAttribute("aria-checked", selecionado ? "true" : "false");
  }
}

btnProxima.addEventListener("click", () => {
  if (estado.opcaoSelecionada === null) return;

  const pergunta = QUESTIONS[estado.indiceAtual];
  const acertou = estado.opcaoSelecionada === pergunta.correta;

  estado.respostas.push({
    id: pergunta.id,
    enunciado: pergunta.enunciado,
    opcaoEscolhidaTexto: pergunta.opcoes[estado.opcaoSelecionada],
    opcaoEscolhidaIndice: estado.opcaoSelecionada,
    corretaTexto: pergunta.opcoes[pergunta.correta],
    corretaIndice: pergunta.correta,
    acertou,
    explicacao: pergunta.explicacao,
  });

  if (estado.indiceAtual < QUESTIONS.length - 1) {
    estado.indiceAtual += 1;
    renderizarPergunta();
  } else {
    finalizarQuiz();
  }
});

// ---------------------------------------------------------------------------
// Tela 3: resultado
// ---------------------------------------------------------------------------
async function finalizarQuiz() {
  const total = QUESTIONS.length;
  const score = estado.respostas.filter((r) => r.acertou).length;
  const passou = score >= CONFIG.NOTA_APROVACAO;
  const erradas = estado.respostas.filter((r) => !r.acertou);

  // Progresso 100%
  barraProgressoPreenchimento.style.width = "100%";

  mostrarTela(telaResultado);

  notaFinal.textContent = `${score} de ${total}`;

  resultadoMensagem.textContent = passou
    ? `Parabéns, ${estado.nome}! Você mostrou que você sabe mesmo identificar uma fake news e ajuda a proteger seus vizinhos da desinformação. Continue de olho aberto e compartilhando o que aprendeu!`
    : `Valeu por participar, ${estado.nome}! Ainda dá pra afiar o olhar contra fake news — veja abaixo as explicações de cada questão e, se quiser, releia o conteúdo e tente de novo. O importante é aprender juntos!`;

  limparElemento(listaErros);
  if (erradas.length === 0) {
    blocoAcertouTudo.hidden = false;
    secaoErros.hidden = true;
  } else {
    blocoAcertouTudo.hidden = true;
    secaoErros.hidden = false;
    erradas.forEach((r) => {
      const item = document.createElement("li");
      item.className = "item-erro";

      const pergunta = document.createElement("p");
      pergunta.className = "item-erro__pergunta";
      pergunta.textContent = r.enunciado;

      const respostaDada = document.createElement("p");
      respostaDada.className = "item-erro__resposta-dada";
      const rotuloDada = document.createElement("strong");
      rotuloDada.textContent = "Sua resposta: ";
      respostaDada.appendChild(rotuloDada);
      respostaDada.appendChild(document.createTextNode(r.opcaoEscolhidaTexto));

      const respostaCerta = document.createElement("p");
      respostaCerta.className = "item-erro__resposta-certa";
      const rotuloCerta = document.createElement("strong");
      rotuloCerta.textContent = "Resposta certa: ";
      respostaCerta.appendChild(rotuloCerta);
      respostaCerta.appendChild(document.createTextNode(r.corretaTexto));

      const explicacao = document.createElement("p");
      explicacao.className = "item-erro__explicacao";
      const rotuloExplicacao = document.createElement("strong");
      rotuloExplicacao.textContent = "Por quê: ";
      explicacao.appendChild(rotuloExplicacao);
      explicacao.appendChild(document.createTextNode(r.explicacao));

      item.append(pergunta, respostaDada, respostaCerta, explicacao);
      listaErros.appendChild(item);
    });
  }

  // Salvar resultado (não deve derrubar a tela já exibida se falhar)
  avisoSalvamento.hidden = true;
  try {
    await saveResult({
      name: estado.nome,
      answers: estado.respostas.map((r) => ({
        id: r.id,
        opcaoEscolhida: r.opcaoEscolhidaIndice,
        acertou: r.acertou,
      })),
      score,
      total,
      passed: passou,
    });
  } catch (erro) {
    console.error("[quiz] Não foi possível salvar o resultado:", erro);
    avisoSalvamento.hidden = false;
    avisoSalvamento.textContent =
      "Seu resultado acima é válido, mas não conseguimos registrá-lo no momento (sem conexão com a internet). Não é preciso fazer nada.";
  }
}

// ---------------------------------------------------------------------------
// Ações finais
// ---------------------------------------------------------------------------
btnRefazer.addEventListener("click", () => {
  estado.nome = "";
  estado.indiceAtual = 0;
  estado.respostas = [];
  estado.opcaoSelecionada = null;
  formIntro.reset();
  erroIntro.textContent = "";
  mostrarTela(telaIntro);
});

btnCompartilhar.addEventListener("click", async () => {
  const url = CONFIG.SITE_URL;
  const texto =
    "Fiz o quiz \"Desmascarando Fake News\" do projeto de extensão da UNISA. " +
    "Vale a pena conferir e testar seus conhecimentos também:";

  if (navigator.share) {
    try {
      await navigator.share({ title: CONFIG.SITE_NAME, text: texto, url });
      return;
    } catch (erro) {
      // Pessoa cancelou o compartilhamento ou o navegador falhou; cai no fallback abaixo.
      if (erro && erro.name === "AbortError") return;
    }
  }

  // Fallback 1: abrir o WhatsApp com o texto pronto
  const linkWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`;
  const janela = window.open(linkWhatsApp, "_blank", "noopener,noreferrer");

  // Fallback 2: se o pop-up foi bloqueado, copia o link para a área de transferência
  if (!janela && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      avisoCompartilhar("Link copiado! Cole no grupo de vizinhos.");
    } catch {
      avisoCompartilhar(`Copie e compartilhe este link: ${url}`);
    }
  }
});

function avisoCompartilhar(mensagem) {
  const aviso = document.getElementById("aviso-compartilhar");
  if (!aviso) return;
  aviso.textContent = mensagem;
  aviso.hidden = false;
}

// ---------------------------------------------------------------------------
// Ano no rodapé
// ---------------------------------------------------------------------------
const spanAno = document.getElementById("ano-atual");
if (spanAno) spanAno.textContent = String(new Date().getFullYear());
