// js/questions.js
// Banco de perguntas do quiz. Todas as manchetes e mensagens são FICTÍCIAS,
// criadas apenas para fins didáticos — nenhuma cita pessoas reais.
//
// Estrutura de cada pergunta:
// {
//   id: identificador único (string),
//   enunciado: texto da pergunta,
//   opcoes: array de strings (as alternativas),
//   correta: índice (0-based) da alternativa correta,
//   explicacao: texto mostrado depois de responder, explicando o porquê,
// }

export const QUESTIONS = [
  {
    id: "q1",
    enunciado:
      'Você recebe esta mensagem no WhatsApp: "URGENTE! Vacina contra gripe obriga quarentena de 10 dias, diz nota do Ministério. Compartilhe antes que apaguem!" Sem link, sem nome de quem assina. Isso é:',
    opcoes: [
      "Verdadeiro, porque veio de um grupo de família",
      "Provavelmente falso ou enganoso",
      "Verdadeiro, mas só em alguns estados",
      "Impossível saber, então é melhor compartilhar por precaução",
    ],
    correta: 1,
    explicacao:
      'Comunicados oficiais de saúde não pedem para "compartilhar antes que apaguem" nem chegam sem fonte. O tom alarmista e a ausência de uma fonte oficial (como o site do Ministério da Saúde) são sinais claros de desinformação.',
  },
  {
    id: "q2",
    enunciado:
      'Você recebe um SMS: "Aqui é a Central do seu Banco. Detectamos uma compra suspeita de R$ 1.200. Clique no link para cancelar agora." O que você deve fazer?',
    opcoes: [
      "Clicar no link rapidamente para cancelar a compra",
      "Ligar para o número oficial que está no cartão ou no site do banco",
      "Responder o SMS pedindo mais detalhes",
      "Encaminhar a mensagem para a família avisar",
    ],
    correta: 1,
    explicacao:
      "Bancos de verdade não pedem para você clicar em links de SMS para 'cancelar compras'. O caminho seguro é sempre usar o telefone oficial (impresso no cartão) ou o aplicativo oficial do banco, nunca um link recebido por mensagem.",
  },
  {
    id: "q3",
    enunciado:
      "Qual destes é um sinal de alerta de que uma mensagem pode ser golpe ou fake news?",
    opcoes: [
      "Ela foi enviada por um contato que você conhece",
      'Ela pede para você "compartilhar antes que apaguem" com urgência',
      "Ela tem poucas palavras",
      "Ela foi enviada pela manhã",
    ],
    correta: 1,
    explicacao:
      "Pedir compartilhamento urgente é uma tática clássica: quanto mais rápido a mensagem se espalha, menos tempo as pessoas têm para checar se é verdade. Desconfie sempre desse tipo de pressão, mesmo vindo de alguém conhecido.",
  },
  {
    id: "q4",
    enunciado:
      'Uma manchete diz: "Cientistas descobrem que água com limão em jejum cura qualquer tipo de câncer, revela estudo". Essa notícia é:',
    opcoes: [
      "Verdadeira, pois fala em 'estudo'",
      "Provavelmente falsa ou enganosa",
      "Verdadeira, mas apenas para alguns tipos de câncer",
      "Não importa, pois não faz mal divulgar",
    ],
    correta: 1,
    explicacao:
      'Promessas de "cura milagrosa" para qualquer doença, sem citar o nome do estudo, da universidade ou dos pesquisadores, são um sinal clássico de desinformação em saúde. Notícias científicas reais citam a fonte e a instituição.',
  },
  {
    id: "q5",
    enunciado:
      'Um número desconhecido manda mensagem dizendo ser seu neto: "Vovó, troquei de número, perdi o celular, preciso que você faça um Pix urgente". O que fazer?',
    opcoes: [
      "Fazer o Pix imediatamente, pois é uma emergência de família",
      "Ligar para o neto no número que você já tinha salvo antes de fazer qualquer coisa",
      "Pedir o CPF da pessoa para confirmar quem é",
      "Pedir para a pessoa mandar uma foto pelo WhatsApp",
    ],
    correta: 1,
    explicacao:
      "Esse é o chamado 'golpe do falso parente'. Antes de qualquer transferência, ligue para a pessoa usando um número que você já conhecia (o antigo, salvo na sua agenda), nunca o número novo que mandou a mensagem.",
  },
  {
    id: "q6",
    enunciado:
      "Qual destes é um sinal de alerta em uma notícia que você recebeu?",
    opcoes: [
      "O texto tem muitos erros de português e o link não é do site que ele diz ser",
      "A foto tem data e fonte creditada",
      "A matéria é assinada por um jornalista identificado",
      "O texto é calmo e explica os dois lados",
    ],
    correta: 0,
    explicacao:
      "Erros de português, endereços de link estranhos (que não batem com o nome do site verdadeiro) e a ausência de autor são sinais fortes de que o conteúdo pode ser falso.",
  },
  {
    id: "q7",
    enunciado:
      'Uma mensagem anuncia: "Prefeitura vai distribuir vale-gás de R$ 500 para todos os moradores. Clique no link e cadastre seus dados bancários para receber." Essa mensagem é:',
    opcoes: [
      "Uma notícia real de um benefício do governo",
      "Provavelmente um golpe (phishing) para roubar dados bancários",
      "Verdadeira, mas só para quem já recebe outros benefícios",
      "Inofensiva, mesmo que seja falsa",
    ],
    correta: 1,
    explicacao:
      "Programas sociais reais não pedem para você cadastrar dados bancários clicando em um link recebido por mensagem. Esse é um golpe clássico de phishing (roubo de dados) disfarçado de notícia.",
  },
  {
    id: "q8",
    enunciado:
      "Antes de compartilhar uma notícia chocante em um grupo de família ou de vizinhos, o que é mais importante fazer primeiro?",
    opcoes: [
      "Compartilhar rápido para avisar todo mundo",
      "Checar a fonte e procurar em sites de checagem de fatos",
      "Perguntar no próprio grupo se é verdade",
      "Ignorar sempre, sem checar nada",
    ],
    correta: 1,
    explicacao:
      "Checar a fonte original e consultar agências de checagem de fatos (como as indicadas neste site) evita espalhar informações falsas, mesmo com boa intenção.",
  },
  {
    id: "q9",
    enunciado:
      'Uma foto antiga de uma multidão, sem nenhuma data, é usada para dizer que "isso aconteceu ontem" em uma cidade. Isso é um exemplo de:',
    opcoes: [
      "Uma notícia verdadeira e bem documentada",
      "Imagem fora de contexto, uma tática comum de desinformação",
      "Prova definitiva de que o fato aconteceu",
      "Uma charge de humor, sem problema em compartilhar",
    ],
    correta: 1,
    explicacao:
      "Reaproveitar fotos ou vídeos antigos (ou de outro lugar) fora do contexto original é uma das táticas mais comuns de desinformação. Uma busca reversa de imagem ajuda a descobrir a origem real da foto.",
  },
  {
    id: "q10",
    enunciado:
      "Por que compartilhar uma notícia falsa sem checar pode prejudicar outras pessoas?",
    opcoes: [
      "Não prejudica ninguém, é só uma mensagem",
      "Pode causar pânico, golpes financeiros e prejudicar a reputação de pessoas e instituições",
      "É proibido por lei compartilhar qualquer notícia",
      "Só prejudica quem escreveu a mensagem original",
    ],
    correta: 1,
    explicacao:
      "Fake news podem causar pânico coletivo, induzir pessoas a golpes financeiros e manchar injustamente a reputação de pessoas, empresas e instituições. Por isso, checar antes de compartilhar é também uma questão de responsabilidade social e ética.",
  },
];
