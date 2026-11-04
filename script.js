/* =========================================================
   Restauração: Os Que Ficaram
   Jogo narrativo de múltipla escolha — JavaScript Vanilla
   ========================================================= */

"use strict";

/* ---------- SISTEMA DE PROGRESSO DOS FINAIS ---------- */

const STORAGE_KEY = "finaisConcluidos";

function carregarFinaisConcluidos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(salvos) ? salvos : []);
  } catch (error) {
    console.warn("Erro ao carregar finais:", error);
    return new Set();
  }
}

const finaisConcluidos = carregarFinaisConcluidos();

/* ---------- CONFIGURAÇÕES ---------- */

const CONSEQUENCE_DELAY = 3000;
const TYPE_SPEED = 13;

/* ---------- ESTADO GLOBAL ---------- */

const initialState = {
  faith: 70,
  survival: 70,
  witness: 0,
  currentNode: "inicio"
};

let state = { ...initialState };

/* ---------- REFERÊNCIAS DE INTERFACE ---------- */

const screens = {
  menu: document.getElementById("screen-menu"),
  game: document.getElementById("screen-game"),
  ending: document.getElementById("screen-ending"),
  thanks: document.getElementById("screen-thanks")
};

const els = {
  chapter: document.getElementById("chapter-label"),
  location: document.getElementById("location-label"),
  sceneTag: document.getElementById("scene-tag"),
  sceneTitle: document.getElementById("scene-title"),
  storyText: document.getElementById("story-text"),
  consequence: document.getElementById("consequence"),
  choices: document.getElementById("choices"),

  faithValue: document.getElementById("faith-value"),
  survivalValue: document.getElementById("survival-value"),

  faithBar: document.getElementById("faith-bar"),
  survivalBar: document.getElementById("survival-bar"),

  endingEyebrow: document.getElementById("ending-eyebrow"),
  endingTitle: document.getElementById("ending-title"),
  endingText: document.getElementById("ending-text"),

  endingFaith: document.getElementById("ending-faith"),
  endingSurvival: document.getElementById("ending-survival"),
  endingWitness: document.getElementById("ending-witness"),
  thanksTitle: document.getElementById("thanks-title"),
  thanksText: document.getElementById("thanks-text")
};

/* =========================================================
   ÁRVORE DE DECISÃO
   ========================================================= */

const story = {

  inicio: {
    chapter: "Capítulo I",
    location: "São Paulo — 03:17",
    tag: "O Silêncio",
    title: "Aqueles que partiram",

    text: `O despertador ainda tocava quando o mundo mudou.

Carros parados no meio da avenida. Portas abertas. Roupas no chão. Uma criança desapareceu do berço, e o noticiário repetia a mesma palavra, atônito: “desaparecimentos em massa”.

Você está sozinho no apartamento. Seu celular vibra sem parar. Na rua, alguém grita que isto é um sequestro alienígena; outra voz fala sobre teoria da conspiração. Mas você sabe do que se trata: O cumprimento das Escrituras.

Então, batem na sua porta.`,

    choices: [
      {
        label: "Abrir imediatamente: pode ser alguém precisando de ajuda.",
        effects: { faith: +5, survival: -5, witness: +1 },
        consequence: "Você escolheu compaixão antes da própria segurança.",
        next: "encontro_pastor"
      },
      {
        label: "Olhar pelo olho mágico antes de abrir.",
        effects: { faith: 0, survival: +5 },
        consequence: "Prudência preservou sua segurança — por enquanto.",
        next: "encontro_pastor"
      },
      {
        label: "Não abrir. O mundo acabou de provar que ninguém é confiável.",
        effects: { faith: -8, survival: +8 },
        consequence: "O medo sussurrou mais alto que a esperança.",
        next: "encontro_pastor"
      }
    ]
  },

  encontro_pastor: {
    chapter: "Capítulo I",
    location: "Apartamento — Corredor",
    tag: "Aliados",
    title: "Pastor Elias e Mara",

    text: `Do lado de fora estão o Pastor Elias, seu mentor de muitos anos, e Mara, sua amiga de infância.

Ele está pálido, mas firme. Mara chora sem conseguir falar.

"Não era um pesadelo" diz o pastor, trêmulo “Eles partiram. Não consegui viver aquilo que eu pregava. Nós ficamos. Mas não ficamos sem propósito. Sabemos o que temos que fazer”

Ele propõe que os três se refugiem na igreja antiga, no centro da cidade, enquanto o mundo tenta explicar o inexplicável.`,

    choices: [
      {
        label: "Ir com eles à igreja. Vocês precisam uns dos outros.",
        effects: { faith: +10, survival: +5 },
        consequence: "A comunidade se tornou seu primeiro ato de resistência.",
        next: "primeira_noite"
      },
      {
        label: "Propor um plano mais seguro: sair da cidade antes do caos total.",
        effects: { faith: -3, survival: +10 },
        consequence: "Você pensou em sobreviver antes de pensar em permanecer fiel.",
        next: "primeira_noite"
      },
      {
        label: "Dizer que já não sabe se ainda acredita em algo.",
        effects: { faith: -12, survival: +3 },
        consequence: "A dúvida doeu, mas ser honesto também é parte da jornada.",
        next: "primeira_noite"
      }
    ]
  },

  primeira_noite: {
    chapter: "Capítulo II",
    location: "Igreja Antiga — Porão",
    tag: "Refúgio",
    title: "A primeira noite sem eles",

    text: `No porão da igreja, dezenas de pessoas buscam abrigo. Há oração, medo e fome.

Pela rádio, um líder político desconhecido anuncia um “novo pacto global para restaurar a ordem”. Seu nome é Adrián Vael. Ele promete paz, alimentos e segurança.

Mara observa você no escuro:
“Você acha que ele é... aquele de quem o pastor sempre falava?”

Antes de responder, um grupo bate à porta pedindo comida e remédios.`,

    choices: [
      {
        label: "Dividir os suprimentos com todos, mesmo que falte para vocês.",
        effects: { faith: +10, survival: -10, witness: +1 },
        consequence: "Generosidade custosa: sua fé cresceu, sua reserva diminuiu.",
        next: "sinal_duas_testemunhas"
      },
      {
        label: "Racionar tudo. O grupo precisa durar mais do que uma noite.",
        effects: { faith: -4, survival: +10 },
        consequence: "A prudência manteve o grupo vivo, mas endureceu corações.",
        next: "sinal_duas_testemunhas"
      },
      {
        label: "Organizar oração e distribuição guiada pelo pastor.",
        effects: { faith: +7, survival: +3, witness: +1 },
        consequence: "Fé e sabedoria caminharam juntas.",
        next: "sinal_duas_testemunhas"
      }
    ]
  },

  sinal_duas_testemunhas: {
    chapter: "Capítulo II",
    location: "Igreja Antiga — Salão Principal",
    tag: "As Duas Testemunhas",
    title: "Fogo sobre Jerusalém",

    text: `As transmissões globais mostram duas figuras em Jerusalém, vestidas de saco, pregando diante das nações.

Elas advertem sobre julgamento, chamam ao arrependimento e anunciam que o poder humano não salvará o mundo. Governos as chamam de terroristas religiosos. Multidões as odeiam — e, ainda assim, não conseguem ignorá-las.

O Pastor Elias se aproxima:
“Se elas são reais, então também somos chamados a testemunhar. Mas testemunhar terá um preço.”`,

    choices: [
      {
        label: "Registrar e divulgar a mensagem delas pela rede clandestina.",
        effects: { faith: +12, survival: -10, witness: +3 },
        consequence: "Sua voz se juntou ao testemunho público.",
        next: "fuga_da_cidade"
      },
      {
        label: "Ouvir, orar e guardar a mensagem para o grupo.",
        effects: { faith: +6, survival: +2, witness: +1 },
        consequence: "Você escolheu discipulado discreto.",
        next: "fuga_da_cidade"
      },
      {
        label: "Desconfiar: sinais podem enganar, mesmo os mais impressionantes.",
        effects: { faith: -5, survival: +5 },
        consequence: "Discernimento é necessário — mas o ceticismo também pode silenciar a verdade.",
        next: "fuga_da_cidade"
      }
    ]
  },

  fuga_da_cidade: {
    chapter: "Capítulo III",
    location: "Margens do Rio Tietê",
    tag: "Êxodo",
    title: "A cidade que não dorme",

    text: `A igreja não é mais segura. Milícias armadas controlam pontes, postos de gasolina e farmácias. Nas ruas, cartazes prometem “ordem, pão e proteção” a quem se registrar no novo sistema.

O Pastor Elias conhece uma rota pelos bairros ribeirinhos, onde antigos membros da congregação podem oferecer abrigo.

Mara está febril. O grupo precisa decidir antes do amanhecer.`,

    choices: [
      {
        label: "Seguir a rota do pastor, mesmo sendo mais longa.",
        effects: { faith: +8, survival: -5 },
        consequence: "Vocês escolheram confiança e comunhão em vez da rota óbvia.",
        next: "acampamento_refugiados"
      },
      {
        label: "Buscar uma farmácia para tratar Mara antes de seguir viagem.",
        effects: { faith: +5, survival: -10, witness: +1 },
        consequence: "Você arriscou-se por alguém. Mara notou.",
        next: "acampamento_refugiados"
      },
      {
        label: "Seguir sozinho por atalhos mais rápidos e reencontrar o grupo depois.",
        effects: { faith: -8, survival: +8 },
        consequence: "A pressa pode salvar minutos — e custar alianças.",
        next: "acampamento_refugiados"
      }
    ]
  },

  acampamento_refugiados: {
    chapter: "Capítulo IV",
    location: "Galpão abandonado — Zona Leste",
    tag: "Refugiados",
    title: "Os que ainda esperam",

    text: `No galpão, vocês encontram um pequeno acampamento: famílias, idosos, jovens e alguns que perderam tudo na primeira noite.

Uma mulher chamada Helena organiza a distribuição de água. Ela reconhece o Pastor Elias e oferece abrigo — com uma condição.

“Amanhã, um caminhão do sistema passa por aqui. Eles oferecem comida, remédios e transporte. Quem aceitar a marca entra. Quem recusar... precisa ir embora antes do meio-dia.”`,

    choices: [
      {
        label: "Ficar e ajudar Helena a preparar a partida dos que recusarem.",
        effects: { faith: +10, survival: -5, witness: +2 },
        consequence: "Você transformou abrigo em serviço.",
        next: "discurso_vael"
      },
      {
        label: "Convencer o grupo a partir durante a noite, antes da chegada do caminhão.",
        effects: { faith: +3, survival: +8 },
        consequence: "A fuga antecipada evitou um confronto inevitável.",
        next: "discurso_vael"
      },
      {
        label: "Observar o caminhão de perto para descobrir como o sistema funciona.",
        effects: { faith: -6, survival: +5 },
        consequence: "Conhecimento útil — mas você se aproximou demais da sombra.",
        next: "discurso_vael"
      }
    ]
  },

  discurso_vael: {
    chapter: "Capítulo IV",
    location: "Transmissão Global",
    tag: "O Governante",
    title: "O homem que prometeu paz",

    text: `Adrián Vael é aclamado como o homem capaz de unir nações em crise. Ele resolve guerras, estabiliza mercados e fala de uma humanidade finalmente madura.

Depois, em um discurso silencioso, ele anuncia um sistema de identificação universal para acesso a alimentos, transporte e segurança.

“Quem se recusar”, diz ele com um sorriso calmo, “escolherá ficar fora da nova humanidade.”

O Pastor Elias fecha os olhos:
“Chegou a hora de decidir quem somos.”`,

    choices: [
      {
        label: "Recusar publicamente o sistema, mesmo sabendo do custo.",
        effects: { faith: +15, survival: -15, witness: +3 },
        consequence: "Você se tornou visível ao sistema — e fiel à sua consciência.",
        next: "falso_profeta"
      },
      {
        label: "Recusar em silêncio e ajudar outros a escapar do cadastro.",
        effects: { faith: +8, survival: -5, witness: +1 },
        consequence: "Resistência discreta: menos perigo, menos alcance.",
        next: "falso_profeta"
      },
      {
        label: "Aceitar temporariamente para proteger Mara e o grupo.",
        effects: { faith: -18, survival: +15 },
        consequence: "O conforto veio rápido. A paz interior, não.",
        next: "falso_profeta"
      }
    ]
  },

  falso_profeta: {
    chapter: "Capítulo V",
    location: "Praça da Concórdia",
    tag: "O Falso Profeta",
    title: "Um milagre que engana",

    text: `Um líder religioso carismático sobe ao palco ao lado de Vael. Ele fala de amor, unidade e milagres. Fogo desce do céu diante das câmeras, e a multidão cai de joelhos.

“Não há mais divisão”, proclama ele. “Todas as religiões se curvarão ao mesmo altar. Quem amar a humanidade receberá a marca da paz.”

Mara agarra seu braço. O pastor sussurra:
“Nem todo fogo vem do céu de Deus.”`,

    choices: [
      {
        label: "Gritar a verdade diante da multidão.",
        effects: { faith: +15, survival: -20, witness: +4 },
        consequence: "Sua coragem ecoou mais longe do que você imaginava.",
        next: "prisao"
      },
      {
        label: "Puxar Mara e o pastor para longe antes que sejam presos.",
        effects: { faith: +4, survival: +8, witness: +1 },
        consequence: "Você protegeu seus aliados e manteve a missão viva.",
        next: "prisao"
      },
      {
        label: "Fingir adesão para descobrir rotas de fuga e refúgios.",
        effects: { faith: -10, survival: +12 },
        consequence: "Você entrou nas sombras do sistema para sobreviver.",
        next: "prisao"
      }
    ]
  },

  prisao: {
    chapter: "Capítulo VI",
    location: "Centro de Retenção — Setor 7",
    tag: "Prisão",
    title: "A sala das perguntas",

    text: `Vocês são separados.

Em uma sala branca, um agente do sistema coloca à sua frente um tablet. Na tela, aparece a foto de Mara e do Pastor Elias.

“Eles serão liberados”, diz o agente. “Você só precisa confirmar sua lealdade à nova ordem humana.”

A porta atrás de você se tranca. Há uma caneta sobre a mesa.`,

    choices: [
      {
        label: "Recusar. Nenhuma liberdade vale a negação do que você crê.",
        effects: { faith: +18, survival: -15, witness: +3 },
        consequence: "Sua recusa foi registrada — e sua fé, fortalecida.",
        next: "resgate_mara"
      },
      {
        label: "Pedir para falar com Mara antes de decidir.",
        effects: { faith: +5, survival: -5 },
        consequence: "Você buscou discernimento em comunhão, não no medo.",
        next: "resgate_mara"
      },
      {
        label: "Assinar para garantir a liberdade deles.",
        effects: { faith: -22, survival: +18 },
        consequence: "Você os salvou das grades, mas algo em você ficou para trás.",
        next: "resgate_mara"
      }
    ]
  },

  resgate_mara: {
    chapter: "Capítulo VI",
    location: "Complexo do Sistema — Corredores",
    tag: "Resgate",
    title: "As luzes se apagam",

    text: `Um blecaute atinge o complexo. Alarmes cortam o ar. Alguém abriu os bloqueios do setor — Helena e alguns refugiados do galpão arriscaram-se para tirar vocês de lá.

Mara encontra você primeiro. Ela está magra, machucada, mas viva.

“Eu sabia que você voltaria”, diz ela.

O Pastor Elias olha para o corredor escuro:
“Ainda não acabou. O sistema vai nos caçar — mas agora sabemos onde estão os fracos, os famintos e os esquecidos.”`,

    choices: [
      {
        label: "Voltar para resgatar outros detentos antes de fugir.",
        effects: { faith: +14, survival: -15, witness: +3 },
        consequence: "Você escolheu libertar os cativos, mesmo com o perigo aumentando.",
        next: "divisao_do_grupo"
      },
      {
        label: "Fugir imediatamente com Mara, Elias e Helena.",
        effects: { faith: +5, survival: +10 },
        consequence: "Vocês escaparam — e poderão lutar outro dia.",
        next: "divisao_do_grupo"
      },
      {
        label: "Deixar que Helena lidere o resgate enquanto você busca suprimentos.",
        effects: { faith: -4, survival: +8 },
        consequence: "A divisão de tarefas foi sensata, mas você evitou o risco maior.",
        next: "divisao_do_grupo"
      }
    ]
  },

  divisao_do_grupo: {
    chapter: "Capítulo VII",
    location: "Estrada de terra — Interior",
    tag: "Cisma",
    title: "O preço de continuar",

    text: `Dias depois, o grupo alcança uma fazenda abandonada. Há água, uma horta improvisada e silêncio — por enquanto.

Mas o cansaço cria rachaduras. Alguns querem seguir para o encontro secreto dos fiéis. Outros querem se esconder para sempre. Helena defende que voltar às cidades é suicídio.

O Pastor Elias chama você para decidir o rumo.`,

    choices: [
      {
        label: "Propor que cada um escolha seu caminho, sem condenação.",
        effects: { faith: +6, survival: +5 },
        consequence: "Liberdade com compaixão: o grupo permaneceu unido pelo respeito.",
        next: "cerco_final"
      },
      {
        label: "Insistir que todos sigam para o encontro dos fiéis.",
        effects: { faith: +10, survival: -8, witness: +2 },
        consequence: "Você escolheu a unidade em torno do testemunho.",
        next: "cerco_final"
      },
      {
        label: "Concordar em se esconder na fazenda até o pior passar.",
        effects: { faith: -8, survival: +12 },
        consequence: "A segurança parecia razoável — mas o tempo também transforma o coração.",
        next: "cerco_final"
      }
    ]
  },

  cerco_final: {
    chapter: "Capítulo VII",
    location: "Fazenda abandonada",
    tag: "Cerco",
    title: "Eles encontraram vocês",

    text: `Ao amanhecer, drones sobrevoam a fazenda. Caminhões blindados cercam a estrada. O sistema oferece uma última chance: entregar o Pastor Elias e os líderes do grupo em troca de proteção para todos os demais.

Mara segura sua mão. Helena chora em silêncio. Elias sorri, sereno.

“Não me entreguem”, diz ele. “Mas não deixem que o medo decida por vocês.”`,

    choices: [
      {
        label: "Recusar a barganha e preparar a fuga de todos.",
        effects: { faith: +12, survival: -10, witness: +2 },
        consequence: "Você recusou sacrificar um irmão para salvar a si mesmo.",
        next: "grande_tribulacao"
      },
      {
        label: "Entregar-se no lugar do pastor para distrair os soldados.",
        effects: { faith: +16, survival: -18, witness: +4 },
        consequence: "Sua entrega comprou tempo para os outros fugirem.",
        next: "grande_tribulacao"
      },
      {
        label: "Aceitar a proposta e salvar o grupo.",
        effects: { faith: -25, survival: +20 },
        consequence: "O grupo foi poupado — mas a traição ficou gravada em sua consciência.",
        next: "grande_tribulacao"
      }
    ]
  },

  grande_tribulacao: {
    chapter: "Capítulo VII",
    location: "Cidade sitiada",
    tag: "Grande Tribulação",
    title: "A noite mais longa",

    text: `O mundo se parte em julgamentos, fome e perseguição. As Duas Testemunhas são mortas diante do mundo — e, três dias depois, ressuscitam e sobem aos céus diante de todas as câmeras.

O sistema entra em colapso. Vael declara guerra contra tudo o que lembra Deus.

No abrigo, você reúne os remanescentes. Há pouco alimento, pouca esperança e nenhuma garantia — exceto uma promessa antiga.

Então o céu se abre.`,

    choices: [
      {
        label: "Levantar os olhos e proclamar: “Eis que vem com as nuvens.”",
        effects: { faith: +15, witness: +3 },
        consequence: "Sua última palavra na terra foi de esperança.",
        next: "volta_cristo"
      },
      {
        label: "Proteger os mais frágeis até o último instante.",
        effects: { faith: +8, survival: -5, witness: +2 },
        consequence: "O amor ao próximo foi seu culto final.",
        next: "volta_cristo"
      },
      {
        label: "Correr para se esconder do julgamento que desce.",
        effects: { faith: -15, survival: +5 },
        consequence: "O medo falou por você quando o céu respondeu.",
        next: "volta_cristo"
      }
    ]
  },

  volta_cristo: {
    chapter: "Epílogo",
    location: "Céu e terra",
    tag: "A Volta",
    title: "O Rei que retorna",

    text: `A luz não pede licença.

Ela rasga os céus, silencia os exércitos e revela o Rei. O que parecia vitorioso desmorona; o que parecia perdido é restaurado.

Diante da glória, cada escolha que você fez retorna ao seu coração — não como acusação, mas como testemunho do caminho que escolheu.`,

    choices: [],
    ending: "auto"
  },

  /* ---------- FINAIS ---------- */

  final_martir: {
    chapter: "Final",
    location: "Praça diante das Testemunhas",
    tag: "Mártir",
    title: "O Mártir",

    text: `Você permanece ao lado das Duas Testemunhas quando os soldados chegam.

Sua voz falha, mas não se cala. Você fala de perdão, de esperança e de um Reino que não se constrói com medo.

Quando tudo escurece, você não vê a multidão — vê apenas uma luz.

E, no instante seguinte, ouve:
“Bem-vindo ao descanso do teu Senhor.”

Você selou seu testemunho com a própria vida.`,

    ending: "martir"
  },

  final_marca: {
    chapter: "Final",
    location: "Assentamento do Sistema",
    tag: "Apostasia",
    title: "A Marca",

    text: `A marca é indolor. Um breve calor na mão, uma linha de luz, e as portas se abrem.

Você come. Você dorme. Você está seguro.

Mas, nas noites seguintes, o silêncio dentro de você se torna insuportável. Mara olha para você como quem olha para um estranho. O Pastor Elias reza por você à distância.

Quando o Rei retorna, você está protegido pelo sistema — e profundamente sozinho.`,

    ending: "marca"
  },

  final_fuga: {
    chapter: "Final",
    location: "Ruínas além da cidade",
    tag: "Ocultação",
    title: "A Fuga",

    text: `Você sobrevive.

Nas ruínas, entre águas contaminadas e noites sem lua, você aprende a não fazer ruído, não acender fogo e não confiar em ninguém.

A fé não morreu de uma vez. Ela foi apagando-se como uma vela em corrente de ar.

Quando os céus se abrem, você se encolhe nas sombras — vivo, porém exausto, e perguntando se ainda é capaz de reconhecer a luz.`,

    ending: "fuga"
  },

  agradecimentos: {
    chapter: "Créditos",
    tag: "Agradecimento",
    title: "Agradecimentos",

    text: `Obrigado por Jogar. Embora pareça um jogo de ficção, tudo que está no jogo ainda está destinado para acontecer, portanto, arrependa-se de seus pecados e volte para Jesus, pois Ele tem um lugar na mesa reservado para você.

Feito por João Henrique`
  }
};

/* =========================================================
   FINAIS PRINCIPAIS
   ========================================================= */

const endings = {

  coroa: {
    eyebrow: "Final da Coroa da Vida",
    title: "Coroa da Vida",

    text: `Você resistiu ao sistema, manteve a fé e não negou a esperança — nem quando o mundo exigiu que a trocasse por segurança.

Quando Cristo retorna, você não se esconde. Você levanta os olhos. E você ouve Ele falar: "Vinde, benditos de meu Pai, possuí por herança o reino que vos está preparado desde a fundação do mundo;

A coroa não é prêmio por ser forte; é promessa cumprida para quem permaneceu fiel até o fim.

Agora, você pode descansar, pois a perseguição acabou.

"E, eis que cedo venho, e o meu galardão está comigo, para dar a cada um segundo a sua obra.
Eu sou o Alfa e o Ômega, o princípio e o fim, o primeiro e o derradeiro.
Bem-aventurados aqueles que guardam os seus mandamentos, para que tenham direito à árvore da vida, e possam entrar na cidade pelas portas.
Mas, ficarão de fora os cães e os feiticeiros, e os fornicadores, e os homicidas, e os idólatras, e qualquer que ama e comete mentira.
Eu, Jesus, enviei o meu anjo, para vos testificar estas coisas nas igrejas. Eu sou a raiz e a geração de Davi, a resplandecente estrela da manhã.
E o Espírito e a esposa dizem: Vem. E quem ouve, diga: Vem. E quem tem sede, venha; e quem quiser, tome de graça da água da vida." Apocalipse 22:12-20`
  },

  martir: {
    eyebrow: "Final do Mártir",
    title: "O Mártir",

    text: `Você escolheu testemunhar quando o silêncio era mais seguro.

Sua vida terminou diante do mundo, mas seu testemunho permaneceu. Aqueles que viram sua coragem encontraram coragem para crer.

"Porque aquele que quiser salvar a sua vida, perdê-la-á, e quem perder a sua vida por amor de mim, achá-la-á." Mateus 16:25`
  },

  marca: {
    eyebrow: "Final da Marca",
    title: "A Marca da Apostasia",

    text: `Você escolheu o conforto do sistema em vez da fidelidade ao Rei.

Por um tempo, houve segurança. Depois veio o vazio — e, por fim, a separação da luz.

A porta que você abriu por medo se tornou a prisão que você não conseguiu deixar.

“E os seguiu o terceiro anjo, dizendo com grande voz: Se alguém adorar a besta e a sua imagem e receber o sinal na testa ou na mão,
também o tal beberá do vinho da ira de Deus, que se deitou, não misturado,
no cálice da sua ira, e será atormentado com fogo e enxofre diante dos santos anjos e diante do Cordeiro.” Apocalipse 14:9-10`
  },

  fuga: {
    eyebrow: "Final da Fuga",
    title: "Oculto nas Sombras",

    text: `Você sobreviveu, mas sobreviver custou caro.

Escondido das perseguições, você também se escondeu da esperança. Quando a luz finalmente desceu, você estava vivo — mas com o coração enfraquecido e a fé reduzida a uma brasa tremendo.`
  }
};

/* =========================================================
   UTILIDADES
   ========================================================= */

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.remove("active");
  });

  if (!screens[name]) {
    console.error(`Tela não encontrada: ${name}`);
    return;
  }

  screens[name].classList.add("active");
}

function updateMeters() {
  els.faithValue.textContent = state.faith;
  els.survivalValue.textContent = state.survival;

  els.faithBar.style.width = `${state.faith}%`;
  els.survivalBar.style.width = `${state.survival}%`;
}

function applyEffects(effects = {}) {
  state.faith = clamp(state.faith + (effects.faith || 0));
  state.survival = clamp(state.survival + (effects.survival || 0));
  state.witness += effects.witness || 0;

  updateMeters();
}

function showConsequence(message, effects = {}) {
  const faithChange = effects.faith || 0;
  const survivalChange = effects.survival || 0;

  let tone = "neutral";

  if (faithChange > 0 || survivalChange > 0) {
    tone = "positive";
  }

  if (faithChange < 0 || survivalChange < 0) {
    tone = "negative";
  }

  const parts = [message];

  if (faithChange !== 0) {
    parts.push(
      `Fé: ${faithChange > 0 ? "+" : ""}${faithChange} pontos`
    );
  }

  if (survivalChange !== 0) {
    parts.push(
      `Sobrevivência: ${survivalChange > 0 ? "+" : ""}${survivalChange} pontos`
    );
  }

  if (effects.witness) {
    parts.push(
      `Testemunho: +${effects.witness} ponto${effects.witness > 1 ? "s" : ""}`
    );
  }

  els.consequence.textContent = parts.join("  •  ");
  els.consequence.className = `consequence ${tone}`;
}

/* =========================================================
   EFEITO MÁQUINA DE ESCREVER
   ========================================================= */

let typingTimer = null;

function typeText(target, text, speed = TYPE_SPEED) {
  clearInterval(typingTimer);

  target.textContent = "";

  let index = 0;

  typingTimer = setInterval(() => {
    target.textContent += text[index++];

    if (index >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, speed);
}

/* =========================================================
   RENDERIZAÇÃO DE CENAS
   ========================================================= */

function renderNode(nodeId) {
  const node = story[nodeId];

  if (!node) {
    console.error(`Cena não encontrada: ${nodeId}`);
    return;
  }

  state.currentNode = nodeId;

  els.chapter.textContent = node.chapter;
  els.location.textContent = node.location;
  els.sceneTag.textContent = node.tag;
  els.sceneTitle.textContent = node.title;

  els.consequence.className = "consequence hidden";
  els.consequence.textContent = "";

  els.choices.innerHTML = "";

  typeText(els.storyText, node.text);

  /* Verifica se a cena leva diretamente a um final */

  if (node.ending) {
    setTimeout(() => resolveEnding(node.ending), 2500);
    return;
  }

  node.choices.forEach(choice => {

    const button = document.createElement("button");

    button.className =
      `choice ${
        choice.effects?.faith < 0 ||
        choice.effects?.survival < 0
          ? "danger"
          : ""
      }`;

    button.textContent = choice.label;

    button.addEventListener("click", () => {

      applyEffects(choice.effects);

      showConsequence(choice.consequence, choice.effects);

      setTimeout(() => {
        renderNode(choice.next);
      }, CONSEQUENCE_DELAY);

    });

    els.choices.appendChild(button);

  });
}

/* =========================================================
   LÓGICA DOS FINAIS
   ========================================================= */

function resolveEnding(type) {

  let endingKey;

  if (type === "martir") {

    endingKey = "martir";

  } else if (type === "marca") {

    endingKey = "marca";

  } else if (type === "fuga") {

    endingKey = "fuga";

  } else {

    /* Final calculado após a Volta de Cristo */

    if (state.faith >= 80 && state.witness >= 10) {

      endingKey = "coroa";

    } else if (state.faith <= 25) {

      endingKey = "marca";

    } else if (state.survival >= 85 && state.faith < 55) {

      endingKey = "fuga";

    } else {

      endingKey = "coroa";

    }
  }

  const ending = endings[endingKey];

  if (!ending) {
    console.error(`Final não encontrado: ${endingKey}`);
    return;
  }

  /* Registra o final sem duplicar */

  finaisConcluidos.add(endingKey);

  /* Salva o progresso no navegador */

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...finaisConcluidos])
    );

  } catch (error) {

    console.error("Erro ao salvar os finais:", error);

  }

  /* Preenche a tela de final */

  els.endingEyebrow.textContent = ending.eyebrow;
  els.endingTitle.textContent = ending.title;

  typeText(els.endingText, ending.text, 12);

  els.endingFaith.textContent = state.faith;
  els.endingSurvival.textContent = state.survival;
  els.endingWitness.textContent = state.witness;

  showScreen("ending");

  /* Verifica se todos os quatro finais foram concluídos */

  const totalFinais = Object.keys(endings).length;

  if (finaisConcluidos.size >= totalFinais) {

    /* Aguarda oito segundos para permitir a leitura do último final */

    setTimeout(() => {

    // Interrompe qualquer animação de texto anterior
    clearInterval(typingTimer);
    typingTimer = null;

    // Recupera os dados da tela de agradecimentos
    const thanks = story.agradecimentos;

    // Insere o título e o texto no HTML
    els.thanksTitle.textContent = thanks.title;
    els.thanksText.textContent = thanks.text;

    // Exibe a tela
    showScreen("thanks");

}, 8000);

  }

}

/* =========================================================
   CONTROLES
   ========================================================= */

function startGame() {

  state = { ...initialState };

  updateMeters();

  showScreen("game");

  renderNode("inicio");

}

document
  .getElementById("btn-start")
  .addEventListener("click", startGame);

document
  .getElementById("btn-play-again")
  .addEventListener("click", startGame);

document
  .getElementById("btn-restart")
  .addEventListener("click", startGame);

document
  .getElementById("btn-about")
  .addEventListener("click", () => {

    document
      .getElementById("about-box")
      .classList.toggle("hidden");

  });

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

updateMeters();