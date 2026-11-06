/* =========================================================
   RESTAURAÇÃO: O DESAFIO FINAL
   Jogo narrativo — JavaScript Vanilla, arquivo único.
   ========================================================= */

"use strict";

/* ---------- PROGRESSO DOS OITO FINAIS ---------- */
const STORAGE_KEY = "finaisConcluidos";
const ENDING_IDS = [
  "cadeia", "lago_fogo", "coroa_vida", "marca",
  "solidao", "martir", "dependente", "a_fuga"
];

function carregarFinaisConcluidos() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(
      Array.isArray(dados)
        ? dados.filter(id => ENDING_IDS.includes(id))
        : []
    );
  } catch (error) {
    console.warn("Não foi possível carregar o progresso:", error);
    return new Set();
  }
}

const finaisConcluidos = carregarFinaisConcluidos();

/* ---------- CONFIGURAÇÕES ---------- */
const CONSEQUENCE_DELAY = 1800;
const TYPE_SPEED = 35;

const THANKS_TEXT =
  "Obrigado por Jogar. Embora pareça um jogo de ficção, tudo que está no jogo ainda está destinado para acontecer, portanto, arrependa-se de seus pecados e volte para Jesus, pois Ele tem um lugar na mesa reservado para você.\n\nFeito por João Henrique";

/* ---------- ESTADO ---------- */
const initialState = {
  faith: 70,
  survival: 70,
  witness: 0,
  currentNode: "inicio",
  flags: {
    desconfiouTestemunhas: false,
    aceitouRegime: false,
    origemRota: null,
    grupoNaFazenda: null
  }
};

let state = criarEstadoInicial();

function criarEstadoInicial() {
  return {
    ...initialState,
    flags: { ...initialState.flags }
  };
}
/* ---------- IDENTIDADE DO PROTAGONISTA ---------- */

/* ---------- IDENTIDADE DO PROTAGONISTA ---------- */

let nomeProtagonista = "";

function personalizarTexto(texto) {
    if (!nomeProtagonista || typeof texto !== "string") {
        return texto;
    }

    return texto
        .split("\n")
        .map(linha => {
            // 1. Substitui a identificação de fala do protagonista.
            // Exemplo: Você: — Estou com medo.
            // Resultado: João: — Estou com medo.
            linha = linha.replace(
                /^(\s*)Você(\s*:\s*—)/,
                `$1${nomeProtagonista}$2`
            );

            // 2. Quando outro personagem começa uma fala dirigindo-se
            // diretamente ao protagonista, acrescenta seu nome.
            // Exemplo: Mara: — Você precisa sair daqui.
            // Resultado: Mara: — João, você precisa sair daqui.
            linha = linha.replace(
                /^(\s*[^:\n]+:\s*—\s*)Você\b/,
                `$1${nomeProtagonista}, você`
            );

            return linha;
        })
        .join("\n");
}
/* ---------- ELEMENTOS DO HTML ---------- */
const screens = {
  menu: document.getElementById("screen-menu"),
  name: document.getElementById("name-screen"),
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

/* ---------- CONSTRUTORES DE CENAS ---------- */
function choice(label, next, effects = {}, consequence = "", action = null) {
  return { label, next, effects, consequence, action };
}

function scene(chapter, location, tag, title, text, choices) {
  return { chapter, location, tag, title, text, choices };
}

/* =========================================================
   HISTÓRIA
   ========================================================= */

const story = {
  inicio: scene(
    "Capítulo I",
    "São Paulo — 03:17",
    "O Silêncio",
    "Aqueles que partiram",
    `O despertador ainda tocava quando o mundo mudou.

Você desperta com o som de uma sirene distante. Ao olhar pela janela, percebe que há algo errado. Carros estão abandonados nas ruas, portas permanecem abertas e objetos pessoais estão espalhados pelas calçadas.

A televisão está ligada, mas os apresentadores parecem desesperados.

Jornalista: — Ainda não temos uma explicação oficial. Milhares de pessoas desapareceram simultaneamente em diferentes partes do mundo.

Você muda de canal. As imagens são semelhantes. Famílias procuram parentes, hospitais estão lotados e autoridades tentam controlar o caos.

De repente, três batidas ecoam na porta.

Toc. Toc. Toc.

Uma voz conhecida chama do corredor:

Mara: — Abra! Por favor, precisamos conversar!

Você reconhece a voz, mas não sabe o que aconteceu com o mundo.

As batidas se repetem.`,
    [
      choice("Abrir imediatamente.", "encontro_elias",
        { faith: 5, survival: -5 },
        "Você decidiu não ignorar quem poderia precisar de ajuda."),

      choice("Olhar pelo olho mágico antes de abrir.", "encontro_elias",
        { survival: 5 },
        "Você agiu com prudência."),

      choice("Não abrir e permanecer em casa.", "nao_abriu_tv",
        { faith: -5, survival: 5 },
        "O medo fez você se afastar dos outros.")
    ]
  ),

  encontro_elias: scene(
    "Capítulo I",
    "Apartamento — Corredor",
    "Aliados",
    "Pastor Elias e Mara",
    `Quando você abre a porta, encontra Mara acompanhada de um homem que conhece muito bem: o Pastor Elias.

Mara: — Graças a Deus! Pensei que você também tivesse desaparecido!

Você observa o corredor. Há apartamentos abertos, mas ninguém responde aos chamados.

Você: — O que aconteceu? Onde estão todos?

Pastor Elias: — Não sabemos ao certo. Pessoas desapareceram em todo lugar. Precisamos encontrar um lugar seguro.

Mara: — A igreja antiga ainda tem água, alimentos e um porão. Podemos reunir algumas pessoas lá.

Você percebe que Elias está diferente. Ele parece assustado e evita olhar diretamente para vocês.

Você: — Pastor, o senhor está bem?

Pastor Elias: — Não vou mentir. Estou com medo. Passei anos ensinando sobre a volta de Cristo, mas nunca imaginei que enfrentaria algo assim.

Mara: — Não temos tempo para ficar aqui. Precisamos decidir o que fazer.

Elias olha para você.

Pastor Elias: — Ainda existe um propósito para aqueles que permaneceram. Mas precisamos agir com sabedoria.`,
    [
      choice("Ir com os dois para a igreja antiga.", "igreja_primeira_noite",
        { faith: 10, survival: 5 },
        "Vocês decidiram permanecer juntos."),

      choice("Propor um plano mais seguro e sair da cidade.", "policia_apartamento",
        { survival: 8 },
        "Sua prioridade passou a ser encontrar uma rota segura."),

      choice("Dizer que não sabe se ainda acredita.", "solidao_rejeita",
        { faith: -12 },
        "Você decidiu afastar aqueles que tentavam ajudá-lo.")
    ]
  ),

  nao_abriu_tv: scene(
    "Capítulo I",
    "Apartamento",
    "Isolamento",
    "O anúncio do governador",
    `Você decide não abrir a porta.

As vozes no corredor desaparecem. Poucos minutos depois, a televisão interrompe sua programação.

Jornalista: — Interrompemos esta transmissão para um pronunciamento extraordinário do governador.

A imagem muda. O governador aparece diante de várias autoridades.

Governador: — Cidadãos, estamos enfrentando uma situação sem precedentes. O desaparecimento simultâneo de milhões de pessoas exige medidas extraordinárias. Nosso compromisso é restaurar a ordem e garantir a segurança de todos.

Uma repórter interrompe:

Repórter: — Governador, existem relatos de que igrejas estão sendo invadidas. Há alguma relação com os desaparecimentos?

Governador: — Não alimentem especulações. Neste momento, precisamos de união e obediência às orientações oficiais.

A transmissão termina.

Você olha para a porta. Talvez Mara ainda esteja por perto. Talvez procurar ajuda seja a melhor decisão.

O telefone toca.`,
    [
      choice("Ligar para Mara.", "ligacao_mara",
        { faith: 2 },
        "Você decidiu procurar alguém conhecido."),

      choice("Ir diretamente à igreja.", "igreja_elias",
        { faith: 3 },
        "Você procurou orientação na igreja."),

      choice("Desligar a televisão e não fazer nada.", "comissao_paz",
        { survival: 3 },
        "Você preferiu esperar, sem tomar posição.")
    ]
  ),

  igreja_primeira_noite: scene(
    "Capítulo II",
    "Igreja Antiga — Porão",
    "Refúgio",
    "A primeira noite",
    `A igreja está cheia. Famílias inteiras procuram abrigo, enquanto voluntários distribuem água e alimentos.

No porão, o Pastor Elias tenta organizar os refugiados.

Pastor Elias: — Precisamos manter a calma. Ninguém sabe exatamente o que aconteceu, mas não podemos abandonar uns aos outros.

Mara: — Trouxemos tudo o que conseguimos encontrar no caminho. Não vai durar muito se não organizarmos a distribuição.

Um rádio antigo começa a transmitir uma mensagem internacional.

Adrián Vael: — Povos do mundo, não permitiremos que o medo destrua nossa civilização. As nações estão trabalhando juntas para estabelecer um pacto global de paz, segurança e reconstrução.

Uma mulher no porão começa a chorar.

Mulher: — Meu marido desapareceu. Eu não sei o que fazer...

Pastor Elias: — Vamos ajudá-la. Neste momento, ninguém deve ficar sozinho.

Alguém bate à porta da igreja.

Refugiado: — Pastor! Há pessoas do lado de fora pedindo água e alimentos!

Mara olha para os suprimentos.

Mara: — Se dividirmos tudo agora, talvez falte para nós amanhã.

Pastor Elias: — E se não dividirmos, o que será daqueles que estão lá fora?

Você precisa decidir como lidar com os recursos.`,
    [
      choice("Dividir os suprimentos com todos.", "duas_testemunhas",
        { faith: 8, survival: -5, witness: 1 },
        "Você aceitou o custo de ajudar outras pessoas."),

      choice("Racionar os recursos.", "duas_testemunhas",
        { survival: 8 },
        "Você priorizou a duração dos recursos."),

      choice("Orar e organizar a distribuição com o pastor.", "duas_testemunhas",
        { faith: 8, survival: 3, witness: 1 },
        "Você uniu oração e responsabilidade.")
    ]
  ),

  policia_apartamento: scene(
    "Capítulo II",
    "Apartamento",
    "Perseguição",
    "Batidas à porta",
    `Você começa a organizar seus pertences para deixar o prédio. Mara verifica a janela enquanto Elias observa o corredor.

Mara: — Acho que podemos sair pela escada dos fundos.

Pastor Elias: — Precisamos ir agora. Quanto mais demorarmos, maior será o risco.

Antes que vocês consigam sair, uma sequência de batidas violentas atinge a porta.

Policial: — Polícia! Abram imediatamente!

Mara: — Eles nos encontraram...

Pastor Elias: — Não sabemos o que querem. Não podemos agir por impulso.

Policial: — Último aviso! Abram a porta!

Você escuta passos no corredor e percebe que o prédio está cercado.

Mara: — Se sairmos agora, talvez consigamos escapar pelas escadas.

Pastor Elias: — A decisão é sua. Mas precisamos escolher imediatamente.`,
    [
      choice("Fugir pelas escadas com Mara e Elias.", "fuga_clandestina",
        { faith: 8, survival: 5 },
        "Vocês conseguiram escapar."),

      choice("Abrir a porta.", "prisao_apartamento",
        { faith: 5, survival: -8 },
        "A polícia encontrou vocês.")
    ]
  ),

  solidao_rejeita: scene(
    "Capítulo II",
    "Apartamento",
    "Ruptura",
    "A porta se fecha",
    `Você encara Mara e o Pastor Elias.

Você: — Eu não sei mais se acredito em nada disso. Tudo o que vocês ensinaram parece não fazer sentido agora.

Mara: — Eu também estou assustada. Mas não podemos simplesmente abandonar nossa fé.

Você: — Vocês não entendem! O mundo acabou de mudar e vocês continuam falando das mesmas coisas!

Pastor Elias: — Não estamos dizendo que será fácil. Estamos dizendo que não precisamos enfrentar isso sem Deus.

Você: — Eu preciso ficar sozinho. Saiam daqui.

Mara: — Não faça isso. Você não precisa passar por tudo sozinho.

Você abre a porta e aponta para o corredor.

Pastor Elias: — Que Deus tenha misericórdia de nós.

Os dois deixam o apartamento.

A porta se fecha. Pela primeira vez desde os desaparecimentos, você está completamente sozinho.`,
    [
      choice("Continuar sozinho.", "contexto_solidao",
        {},
        "Você rompeu os vínculos que ainda tinha.")
    ]
  ),

  ligacao_mara: scene(
    "Capítulo II",
    "Apartamento — Telefone",
    "Contato",
    "A ligação",
    `Você pega o telefone e liga para Mara. Depois de algumas chamadas, ela atende.

Mara: — Alô? Quem é?

Você: — Sou eu. O que está acontecendo? Tentei entender pelas notícias, mas ninguém explica nada.

Mara: — Eu passei no seu apartamento, mas você não abriu.

Você: — Eu estava assustado. Onde você está?

Mara: — Estou indo para uma igreja. Encontrei algumas pessoas que estão tentando ajudar os desaparecidos e os familiares.

Você: — Você está com o Pastor Elias?

Mara: — Não. Estou indo encontrar outro pastor, o Roberto. Ele está organizando uma comunidade.

Você: — E o que ele está dizendo sobre tudo isso?

Mara: — Ele acredita que precisamos aceitar algumas medidas do Fundo da Paz para continuar protegidos. Não concordo com tudo, mas quero que você venha comigo.

Você escuta o barulho de veículos do outro lado da ligação.

Mara: — Não sei quanto tempo ainda teremos para decidir. Você vem?`,
    [
      choice("Aceitar o convite.", "igreja_roberto",
        { faith: 5 },
        "Você decidiu encontrar Mara."),

      choice("Recusar o convite.", "comissao_paz",
        { survival: 2 },
        "Você recusou o convite e permaneceu em casa.")
    ]
  ),

  igreja_roberto: scene(
    "Capítulo II",
    "Igreja",
    "Orientação",
    "Uma igreja dividida",
    `Você chega à igreja e encontra Mara conversando com um homem de aparência serena: o Pastor Roberto.

Pastor Roberto: — Seja bem-vindo. Estamos tentando manter esta comunidade organizada.

Você: — O que exatamente está acontecendo aqui?

Pastor Roberto: — O mundo mudou. O Fundo da Paz está oferecendo proteção, alimentos e assistência. Não podemos ignorar uma oportunidade dessas.

Mara: — Pastor, o senhor está dizendo que devemos aceitar todas as condições?

Pastor Roberto: — Estou dizendo que precisamos ser realistas. Não adianta colocar a vida de todos em risco por uma resistência que talvez não leve a lugar algum.

Você: — E a nossa fé? Como isso se encaixa no que acreditamos?

Pastor Roberto: — A fé pode continuar existindo no coração das pessoas. O que precisamos evitar é o conflito com as autoridades.

Mara: — Eu não estou convencida. Não quero abandonar aquilo em que acredito por causa de benefícios.

Roberto olha diretamente para você.

Pastor Roberto: — A decisão é sua. Você pode seguir um caminho de segurança ou permanecer ao lado de Mara e enfrentar as consequências.`,
    [
      choice("Seguir a orientação do Pastor Roberto.", "seguir_roberto",
        { faith: -15, survival: 12 },
        "Você decidiu aderir à proposta de Roberto."),

      choice("Permanecer com Mara e rejeitar a proposta.", "com_mara",
        { faith: 10 },
        "Você decidiu continuar firme com Mara.")
    ]
  ),

  igreja_elias: scene(
    "Capítulo II",
    "Igreja",
    "Orientação",
    "O conselho do Pastor Elias",
    `Você chega à igreja e encontra o Pastor Elias organizando alguns alimentos.

Pastor Elias: — Fico feliz que tenha vindo. Não sabemos quanto tempo essa situação vai durar.

Você: — O governador falou sobre um Fundo da Paz. O que o senhor pensa disso?

Pastor Elias: — Recebi informações de que estão oferecendo assistência financeira, proteção e acesso a serviços básicos.

Você: — Então devemos aceitar?

Pastor Elias: — Acredito que sim. Precisamos proteger nossas vidas e ajudar aqueles que dependem de nós.

Você: — Mas e se as exigências forem contrárias à nossa fé?

Pastor Elias: — Não podemos antecipar problemas que ainda não aconteceram. Talvez seja possível continuar acreditando em Deus sem entrar em conflito com o governo.

Você percebe que o pastor está tentando justificar a proposta.

Pastor Elias: — Pense com cuidado. Não quero que você coloque sua vida em risco sem necessidade.

Ele coloca uma Bíblia sobre a mesa.

Pastor Elias: — Mas a decisão final pertence a você.`,
    [
      choice("Seguir o conselho de Elias e aceitar o Fundo da Paz.", "perseguicao_oficial",
        { faith: -18, survival: 15 },
        "Você aceitou a proposta e passou a integrar o sistema."),

      choice("Resistir e voltar para casa para ler a Bíblia e orar.", "resiste_elias",
        { faith: 10, survival: -3 },
        "Você decidiu não aceitar a proposta.")
    ]
  ),

  resiste_elias: scene(
    "Capítulo III",
    "Casa",
    "Resistência",
    "A última advertência",
    `Você volta para casa. Coloca a Bíblia sobre a mesa e começa a ler.

Algumas horas depois, uma transmissão interrompe a programação.

Apresentador: — O governo acaba de anunciar um novo decreto. Todas as organizações religiosas deverão se subordinar à Religião da Paz. Reuniões não autorizadas serão consideradas crimes contra a estabilidade pública.

Você desliga a televisão.

Pouco depois, escuta veículos parando diante do prédio.

Policial: — Temos autorização para realizar buscas no edifício!

Você olha para a Bíblia.

Outra batida atinge a porta.

Policial: — Abra! Precisamos verificar sua residência!

Você percebe que não há muito tempo.

A Bíblia está sobre a mesa. Se os policiais entrarem, provavelmente a encontrarão.

Você precisa decidir o que fazer.`,
    [
      choice("Abrir a porta.", "prisao_apartamento",
        { faith: 5, survival: -8 },
        "A Bíblia foi encontrada e você foi preso."),

      choice("Não abrir e escapar com a Bíblia.", "fuga_clandestina",
        { faith: 8, survival: 5 },
        "Você conseguiu escapar e passou a pregar clandestinamente.")
    ]
  ),

  seguir_roberto: scene(
    "Capítulo III",
    "Igreja — Salão",
    "Acomodação",
    "A escolha de Roberto",
    `Você decide acompanhar a orientação do Pastor Roberto.

Mara observa sua decisão com tristeza.

Mara: — Então é isso? Você realmente vai aceitar tudo o que estão oferecendo?

Você: — Precisamos sobreviver. Não podemos enfrentar o mundo inteiro.

Mara: — Sobreviver não significa abandonar aquilo em que acreditamos.

Pastor Roberto: — Mara, não torne isso mais difícil. Cada pessoa precisa tomar suas próprias decisões.

Mara: — Eu já tomei a minha.

Ela pega seus pertences e se afasta.

Você: — Mara, espere!

Mara: — Não vou obrigar você a seguir o mesmo caminho que eu. Mas também não vou fingir que concordo.

Ela deixa a igreja.

Com o passar do tempo, você se afasta da fé. Começa a incentivar outras pessoas a aceitar o Fundo da Paz e, posteriormente, recebe uma função de oficial dentro do sistema.`,
    [
      choice("Continuar servindo ao regime.", "perseguicao_oficial",
        { faith: -20, survival: 15 },
        "Você se integrou ao sistema.")
    ]
  ),

  com_mara: scene(
    "Capítulo III",
    "Casa de reunião",
    "Fidelidade",
    "A decisão de permanecer",
    `Você decide rejeitar a proposta de Roberto.

Mara: — Eu sabia que você ainda não tinha desistido.

Você: — Não quero trocar minha fé por segurança.

Mara: — Então precisamos continuar. Talvez não possamos frequentar uma igreja publicamente, mas ainda podemos estudar a Palavra.

Alguns dias depois, o Pastor Elias aparece.

Pastor Elias: — Soube que vocês decidiram permanecer firmes. Não será fácil, mas não podemos abandonar a verdade por conveniência.

Você: — Pastor, ainda existe esperança?

Pastor Elias: — Enquanto estivermos vivos, podemos testemunhar. E, mesmo diante da morte, nossa esperança continua em Cristo.

Mara abre a Bíblia sobre a mesa.

Mara: — Vamos continuar nos reunindo. Mesmo que sejamos poucos.

As reuniões passam a acontecer em segredo. Vocês sabem que estão sendo observados, mas não abandonam a fé.`,
    [
      choice("Continuar nas reuniões clandestinas.", "contexto_coroa",
        { faith: 10, witness: 2 },
        "Você permaneceu com os que não abandonaram a fé.")
    ]
  ),

  comissao_paz: scene(
    "Capítulo II",
    "Apartamento — Porta",
    "Proposta",
    "A Comissão da Paz",
    `Algumas horas depois, representantes do governo batem à sua porta.

Representante: — Boa tarde. Somos da Comissão da Paz. Estamos visitando os moradores para apresentar o programa de integração.

Você: — Que programa?

Representante: — O Fundo da Paz. Estamos oferecendo benefícios financeiros, acesso facilitado à educação, assistência médica e proteção social.

Você: — E o que precisam em troca?

Representante: — Apenas sua integração ao novo sistema. Queremos garantir que todos contribuam para a reconstrução da sociedade.

Você: — Isso significa que preciso abandonar minha religião?

Representante: — Não estamos exigindo que você deixe de acreditar em algo. Queremos apenas que reconheça a autoridade da nova ordem e siga as diretrizes estabelecidas.

Você olha para o documento que o representante segura.

Representante: — Pense no futuro. Esses benefícios podem fazer diferença na sua vida.

O homem entrega um formulário.

Representante: — Você pode aceitar ou recusar. Mas saiba que a recusa será registrada como oposição às medidas de pacificação.`,
    [
      choice("Aceitar os benefícios e integrar-se ao regime.", "contexto_marca",
        { faith: -20, survival: 20 },
        "Você recebeu os benefícios e foi integrado ao regime, mas não se tornou oficial nem perseguiu cristãos."),

      choice("Recusar a proposta.", "prisao_apartamento",
        { faith: 8, survival: -10 },
        "Sua recusa foi tratada como transgressão da paz. Você foi levado para a prisão.")
    ]
  ),

  duas_testemunhas: scene(
    "Capítulo III",
    "Igreja Antiga",
    "As Duas Testemunhas",
    "Uma mensagem em Jerusalém",
    `Alguns dias depois, as transmissões internacionais começam a mostrar duas figuras em Jerusalém.

Jornalista: — As duas pessoas afirmam estar anunciando uma mensagem divina. Governos de diferentes países classificaram suas declarações como uma ameaça.

Uma das testemunhas aparece na tela.

Primeira Testemunha: — Arrependam-se! O tempo do julgamento se aproxima!

Segunda Testemunha: — Não se deixem enganar pelas promessas dos poderosos. A verdade de Deus não pode ser comprada.

A transmissão é interrompida.

Refugiado: — Quem são essas pessoas? Como conseguem falar assim diante do mundo inteiro?

Pastor Elias: — A Bíblia fala sobre duas testemunhas. Não devemos tratar levianamente aquilo que está acontecendo.

Mara: — Mas precisamos examinar tudo com cuidado. Nem toda transmissão é confiável.

Você: — E se forem realmente as testemunhas anunciadas nas Escrituras?

Pastor Elias: — Então devemos prestar atenção à mensagem e permanecer firmes.

Mara: — Seja qual for nossa conclusão, precisamos orar e agir com discernimento.

Você percebe que todos aguardam sua opinião.`,
    [
      choice("Desconfiar das testemunhas.", "decreto_igrejas",
        { faith: -5, survival: 5 },
        "Você decidiu desconfiar dos sinais.",
        s => { s.flags.desconfiouTestemunhas = true; }),

      choice("Ouvir, orar e guardar a mensagem.", "decreto_igrejas",
        { faith: 8, witness: 1 },
        "Você decidiu examinar a mensagem em oração."),

      choice("Registrar e divulgar a mensagem clandestinamente.", "decreto_igrejas",
        { faith: 10, survival: -5, witness: 3 },
        "Você decidiu divulgar o testemunho.")
    ]
  ),

  decreto_igrejas: scene(
    "Capítulo IV",
    "Cidade",
    "Decreto",
    "A religião da paz",
    `Um ano se passa.

O governo anuncia um novo decreto em rede nacional.

Governador: — A partir de hoje, todas as instituições religiosas deverão estar subordinadas à Religião da Paz. Qualquer organização que se recusar a cumprir as determinações será considerada uma ameaça à ordem pública.

Repórter: — Governador, isso significa que igrejas cristãs serão fechadas?

Governador: — Significa que não permitiremos organizações que promovam divisão entre os cidadãos.

As imagens mostram policiais entrando em igrejas, apreendendo Bíblias e levando pastores.

Mara: — Eles estão fechando tudo...

Pastor Elias: — Precisamos sair da cidade. Não podemos esperar até que cheguem aqui.

Você: — Para onde vamos?

Pastor Elias: — Conheço uma rota até um acampamento de refugiados. Há pessoas tentando ajudar aqueles que ainda resistem.

Mara: — Então vamos. Não podemos ficar esperando a próxima batida na porta.`,
    [
      choice("Fugir da cidade com Mara e Elias.", "fuga_da_cidade",
        { survival: -5, faith: 5 },
        "Vocês decidiram deixar a cidade."),

      choice("Tentar permanecer escondido na igreja.", "fuga_da_cidade",
        { survival: -8 },
        "A permanência tornou-se perigosa.")
    ]
  ),

  fuga_clandestina: scene(
    "Capítulo III",
    "Ruas da cidade",
    "Fuga",
    "Uma vida clandestina",
    `Você consegue escapar do prédio com a Bíblia.

Quando retorna para verificar o apartamento, encontra a porta arrombada e os móveis destruídos.

Mara: — Eles estiveram aqui.

Pastor Elias: — Não podemos voltar. O apartamento foi identificado.

Você: — E agora? Para onde vamos?

Pastor Elias: — Vamos encontrar outros cristãos. Não podemos deixar de testemunhar apenas porque estão nos perseguindo.

Durante os meses seguintes, vocês vivem escondidos. As reuniões acontecem em casas abandonadas e lugares afastados.

Você continua pregando, mesmo sabendo que pode ser preso.

Três anos e meio se passam.

Certa noite, enquanto vocês estão reunidos, uma luz extraordinária aparece no céu.

Mara: — Vocês estão vendo isso?

Pastor Elias: — Chegou a hora...

O céu começa a se abrir.`,
    [
      choice("Permanecer fiel até o fim.", "contexto_coroa",
        { faith: 15, witness: 3 },
        "Você não abandonou sua fé.")
    ]
  ),

  prisao_apartamento: scene(
    "Capítulo III",
    "Delegacia — Cela",
    "Prisão",
    "A Bíblia encontrada",
    `O som das algemas acompanha seus passos pelo corredor da delegacia.

Dois policiais conduzem você até uma sala de interrogatório. Sobre a mesa há uma Bíblia, retirada de seu apartamento.

Agente: — Encontramos isto em sua residência.

Você olha para o livro. Suas páginas estão amassadas, mas permanecem intactas.

Agente: — Ainda acredita nessas coisas?

Você: — Acredito.

O policial se inclina sobre a mesa.

Agente: — O governo já deixou claro que reuniões religiosas não autorizadas são consideradas uma ameaça à estabilidade pública. Você entende isso?

Você: — Não acredito que ler a Bíblia seja um crime.

Agente: — Aqui, quem decide o que é permitido não é você.

O segundo policial pega a Bíblia.

Segundo Agente: — Vamos encerrar o interrogatório. Leve-o para a cela.

Você é conduzido por um corredor frio e mal iluminado. Alguns detentos observam sua chegada.

Detento 1: — Olha só! Mais um religioso.

Detento 2: — Aqui dentro você vai aprender a ficar quieto.

Você se senta em um canto. Um homem se aproxima.

Detento 3: — É verdade que vocês acreditam que esse Jesus vai voltar?

Você: — Sim. Acredito que Ele voltará.

Detento 3: — E você acha que Ele vai tirar você daqui?

Você: — Minha esperança não está apenas em sair daqui.

O homem ri.

Detento 1: — Então aproveite para pregar enquanto pode. Aqui ninguém gosta de sermão.

Você percebe que sua presença já chamou a atenção dos outros presos. Mesmo naquele lugar, existe uma oportunidade de testemunhar. Mas também existe o risco de provocar a hostilidade dos detentos.

Você olha para a Bíblia que conseguiu manter consigo.

O que fará?`,
    [
      choice(
        "Pregar o evangelho aos outros detentos.",
        "contexto_martir",
        { faith: 15, witness: 3 },
        "Você anuncia o evangelho. Sua pregação chega aos ouvidos dos agentes do regime. Considerado uma ameaça, você é retirado da cela e executado."
      ),

      choice(
        "Permanecer quieto e evitar chamar atenção.",
        "contexto_cadeia",
        { survival: -10 },
        "Você decide permanecer em silêncio. Mais tarde, alguns detentos o atacam dentro da cela. Você não resiste aos ferimentos e morre."
      )
    ]
  ),

  fuga_da_cidade: scene(
    "Capítulo IV",
    "Margens do Rio Tietê",
    "Êxodo",
    "A cidade que não dorme",
    `A igreja já não é segura. Milícias controlam pontes, postos de abastecimento e farmácias.

Você caminha com Mara e o Pastor Elias por uma região afastada.

Mara: — Estou me sentindo muito fraca. Não sei se vou conseguir continuar.

Você: — Precisamos encontrar ajuda.

Pastor Elias: — Conheço uma rota que leva até um acampamento de refugiados. Há pessoas escondidas naquela região.

Mara: — Quanto tempo falta?

Pastor Elias: — Se não encontrarmos obstáculos, chegaremos antes do amanhecer.

Um veículo passa ao longe. Todos se escondem.

Você percebe que o grupo está cansado e que qualquer decisão pode colocar alguém em perigo.`,
    [
      choice("Seguir a rota do Pastor Elias.", "acampamento",
        { faith: 6, survival: -3 },
        "Você confiou na rota do pastor.",
        s => { s.flags.origemRota = "pastor"; }),

      choice("Buscar uma farmácia para Mara.", "morte_mara",
        { faith: 3, survival: -8 },
        "Você arriscou tudo para tentar salvar Mara."),

      choice("Ir sozinho por atalhos; depois voltar ao grupo.", "caminhao_visto",
        { faith: -5, survival: 5 },
        "Você se afastou do grupo e encontrou um caminhão do regime.")
    ]
  ),

  morte_mara: scene(
    "Capítulo IV",
    "Farmácia abandonada",
    "Perda",
    "Mara",
    `Você entra em uma farmácia abandonada procurando medicamentos.

Você: — Mara, aguente firme. Vou encontrar alguma coisa.

Mara: — Não demore...

Você procura por vários minutos, mas encontra apenas embalagens vazias e medicamentos vencidos.

Quando retorna, Mara está imóvel.

Você: — Mara? Consegue me ouvir?

Não há resposta.

Você se ajoelha ao lado dela.

Você: — Não... por favor, não...

O silêncio toma conta do lugar.

Mais tarde, você continua caminhando, mas já não consegue pensar com clareza.

Pastor Elias não está ali para ajudá-lo. Você está sozinho com a lembrança de Mara.

A perda destrói seu equilíbrio emocional. Sua esperança desaparece e você passa a depender da lembrança dela para continuar vivendo.`,
    [
      choice("Não suportar a perda.", "contexto_dependente",
        { faith: -20, survival: -10 },
        "A dor tomou conta de você.")
    ]
  ),

  caminhao_visto: scene(
    "Capítulo IV",
    "Estrada",
    "Perigo",
    "O caminhão do regime",
    `Você decide seguir por um caminho diferente para evitar as estradas principais.

Depois de algum tempo, escuta o barulho de um motor.

Um caminhão militar aparece na estrada. Na lateral, há o símbolo do Regime da Paz.

Soldado: — Verifique aquela região! Não podemos permitir que refugiados circulem sem identificação.

Você se esconde atrás de algumas árvores.

Soldado 2: — Não encontrei ninguém por aqui.

O caminhão continua seu caminho.

Você percebe que se afastou demais do grupo.

Você: — Preciso voltar. Não posso deixá-los para trás.

Depois de algum tempo, consegue reencontrar o caminho utilizado por Elias e Mara.`,
    [
      choice("Voltar ao grupo e seguir para o acampamento.", "acampamento",
        { survival: -2 },
        "Você conseguiu reencontrar os outros.")
    ]
  ),

  acampamento: scene(
    "Capítulo V",
    "Galpão abandonado",
    "Refugiados",
    "Os que ainda esperam",
    `Depois de uma longa caminhada, vocês chegam a um galpão abandonado. Dezenas de refugiados estão reunidos no local.

Uma mulher organiza alimentos e distribui água.

Mara: — Quem é ela?

Pastor Elias: — É Helena. Ela está ajudando os refugiados daqui.

Helena percebe a chegada de vocês.

Helena: — Entrem. Vocês parecem exaustos.

Você: — Estamos procurando abrigo. Há quanto tempo estão aqui?

Helena: — Algumas semanas. Mas a situação está ficando perigosa.

Pastor Elias: — O que aconteceu?

Helena: — Um caminhão do sistema chegará amanhã. Eles estão oferecendo integração ao regime. Quem aceitar terá proteção e benefícios. Quem recusar precisará partir.

Um refugiado se aproxima.

Refugiado: — Alguns estão pensando em aceitar. Não querem mais viver escondidos.

Mara: — E quem não aceitar?

Helena: — Terá que sair. Não posso obrigar ninguém a permanecer aqui.

Você olha para as pessoas reunidas. Algumas estão assustadas, outras parecem dispostas a aceitar qualquer proposta para sobreviver.

Helena: — Precisamos decidir o que faremos antes que o caminhão chegue.`,
    [
      choice("Ficar e ajudar Helena a preparar a saída dos que recusam.", "integracao_oficial",
        { faith: 5, survival: 2 },
        "Você decidiu permanecer no acampamento."),

      choice("Convencer o grupo a sair durante a noite.", "discurso_vael",
        { faith: 5, survival: 5 },
        "Você convenceu os refugiados a partir juntos."),

      choice("Observar o caminhão de perto.", "preso_acampamento",
        { survival: -5 },
        "Você foi visto pelos agentes.")
    ]
  ),

  integracao_oficial: scene(
    "Capítulo V",
    "Acampamento",
    "Integração",
    "O preço da segurança",
    `Você decide permanecer no acampamento e ajudar Helena a organizar a saída daqueles que não desejam integrar-se ao regime.

No dia seguinte, o caminhão chega.

Oficial: — Cidadãos, aqueles que aceitarem a integração receberão proteção, moradia e benefícios. Não há necessidade de continuar vivendo escondidos.

Helena: — E aqueles que recusarem?

Oficial: — Poderão deixar o local. Mas deverão compreender que estarão abrindo mão da proteção oferecida pelo governo.

Você observa os refugiados. Alguns entram no caminhão. Outros partem durante a noite.

Com o passar do tempo, você acaba aceitando a integração ao regime e se torna um oficial.

Oficial superior: — Você demonstrou capacidade de liderança. Precisamos de pessoas como você.

Você: — O que esperam que eu faça?

Oficial superior: — Identifique grupos que ainda se reúnem clandestinamente. Precisamos acabar com qualquer resistência.

Você começa a perseguir cristãos e abandona a fé.

Três anos e meio se passam.

Certa noite, enquanto está em uma instalação do regime, o céu começa a se abrir.`,
    [
      choice("Ajoelhar-se diante do poder do regime.", "contexto_lago_fogo",
        { faith: -30 },
        "Você permaneceu do lado do regime."),

      choice("Louvar o sistema que lhe deu segurança.", "contexto_lago_fogo",
        { faith: -30 },
        "Você atribuiu ao regime aquilo que deveria ter discernido."),

      choice("Tentar fugir quando o céu se abre.", "contexto_lago_fogo",
        { faith: -30 },
        "Já não havia fuga possível.")
    ]
  ),

  preso_acampamento: scene(
    "Capítulo V",
    "Centro de Detenção — Cela",
    "Captura",
    "Doze anos",
    `Você se aproxima do caminhão para observar os agentes. Entretanto, um deles percebe sua presença.

Soldado: — Ei! Você aí! Pare!

Você tenta se afastar, mas outros dois soldados bloqueiam a passagem.

Soldado 2: — Identificação!

Você: — Eu só estava passando.

Soldado: — Não minta. Você está ligado aos grupos religiosos que se recusam a cooperar.

Você é levado para um centro de detenção.

Durante o interrogatório, um funcionário apresenta sua sentença.

Funcionário: — Doze anos de prisão. Entretanto, existe uma maneira de evitar tudo isso.

Ele coloca um documento sobre a mesa.

Funcionário: — Você será absolvido se negar publicamente que frequentou uma igreja cristã. Basta reconhecer que aquelas reuniões eram prejudiciais à sociedade e declarar sua lealdade à nova ordem.

Você olha para o documento, mas não responde.

Funcionário: — Pense bem. Ninguém precisa saber o que você acredita em seu coração.

Você: — E se eu me recusar?

Funcionário: — Então cumprirá sua sentença. E, se continuar promovendo ideias contrárias ao sistema, poderá receber uma punição ainda maior.

Algumas horas depois, você é conduzido até uma cela.

Os outros detentos observam você entrar.

Detento 1: — Por que você foi preso?

Você: — Por causa da minha ligação com uma igreja.

Detento 2: — Dizem que prenderam muita gente por causa dessas igrejas.

Detento 1: — E você ainda acredita nessas coisas?

Você percebe que ainda pode testemunhar sobre Cristo, mas também pode tentar permanecer em silêncio. A proposta de absolvição continua sendo uma possibilidade.

Sua decisão determinará o que acontecerá com você.`,
    [
      choice(
        "Negar publicamente que esteve em uma igreja.",
        "contexto_a_fuga",
        { faith: -15, survival: 10 },
        "Você nega publicamente seu vínculo com a igreja e consegue ser libertado. Porém, sua fé se enfraquece e sua vida passa a ser marcada pelo medo."
      ),

      choice(
        "Pregar o evangelho aos outros detentos.",
        "contexto_martir",
        { faith: 15, witness: 3 },
        "Você anuncia o evangelho aos presos. O regime considera sua pregação uma afronta e executa você."
      ),

      choice(
        "Permanecer quieto e não falar sobre sua fé.",
        "contexto_cadeia",
        { survival: -10 },
        "Você evita falar sobre sua fé. Mesmo assim, alguns detentos o atacam dentro da cela. Você morre em consequência dos ferimentos."
      )
    ]
  ),

  discurso_vael: scene(
    "Capítulo VI",
    "Transmissão Global",
    "O Governante",
    "O homem que prometeu paz",
    `Vocês deixam o acampamento durante a noite e chegam a uma região onde há uma grande tela de transmissão pública.

Adrián Vael aparece diante de uma multidão.

Vael: — Cidadãos do mundo! A humanidade não pode continuar dividida. Estamos oferecendo uma solução definitiva para a fome, a violência e a insegurança.

A tela mostra imagens de centros de distribuição e hospitais.

Vael: — A partir de agora, todos terão acesso a alimentos, transporte e segurança por meio de um sistema universal de identificação.

Um refugiado comenta:

Refugiado: — Se isso realmente funcionar, talvez seja nossa única oportunidade de sobreviver.

Mara: — E o que acontecerá com quem não aceitar?

Vael: — Aqueles que rejeitarem a paz estarão escolhendo permanecer no passado. Não permitiremos que pequenos grupos ameacem a estabilidade mundial.

Pastor Elias: — Essa proposta não é apenas sobre segurança. Precisamos compreender o que está sendo exigido de nós.

Vael: — O futuro pertence aos que caminham conosco!

A multidão aplaude.

Você percebe que os refugiados estão divididos. Alguns querem aceitar, outros desejam fugir e há quem esteja disposto a resistir publicamente.`,
    [
      choice("Recusar publicamente o sistema.", "falso_profeta",
        { faith: 10, survival: -8, witness: 2 },
        "Você recusou a proposta diante de todos."),

      choice("Recusar em silêncio e ajudar outros a escapar.", "falso_profeta",
        { faith: 8, survival: -5, witness: 1 },
        "Você escolheu resistir discretamente."),

      choice("Aceitar temporariamente para proteger o grupo.", "contexto_marca",
        { faith: -20, survival: 15 },
        "Você recebeu a marca e não conseguiu mais sair.")
    ]
  ),

  falso_profeta: scene(
    "Capítulo VI",
    "Praça da Concórdia",
    "O Falso Profeta",
    "Um milagre que engana",
    `Vocês chegam a uma praça onde uma cerimônia está sendo transmitida para o mundo inteiro.

Ao lado de Vael está um líder religioso desconhecido.

Líder religioso: — Povos da Terra, chegou o momento de abandonar as antigas divisões. Uma nova era de unidade está diante de nós!

Vael: — Mostre a eles o poder da paz!

O líder ergue as mãos. Diante das câmeras, um fogo impressionante desce sobre o altar.

A multidão começa a gritar.

Multidão: — É um milagre! É um milagre!

Mara: — Isso não está certo...

Pastor Elias: — Não se deixem enganar pelo espetáculo. Precisamos permanecer atentos.

Líder religioso: — Todos os povos terão um único altar, uma única autoridade espiritual e um único sinal de compromisso com a paz.

Você percebe que a multidão está sendo convencida.

Mara: — Precisamos sair daqui antes que percebam quem somos.

Pastor Elias: — A decisão é sua. Podemos denunciar a mentira ou tentar escapar.`,
    [
      choice("Gritar a verdade diante da multidão.", "prisao_regime",
        { faith: 10, survival: -8, witness: 2 },
        "Você foi ouvido — e identificado."),

      choice("Puxar Mara e Elias para longe.", "estrada_terra",
        { faith: 5, survival: 5 },
        "Você protegeu seus companheiros."),

      choice("Fingir adesão para descobrir rotas de fuga.", "prisao_regime",
        { faith: -5, survival: 5 },
        "O regime descobriu sua intenção.")
    ]
  ),

  prisao_regime: scene(
    "Capítulo VII",
    "Centro de Retenção",
    "Prisão",
    "A sala das perguntas",
    `Você é levado para uma instalação de segurança do regime.

Um agente entra na sala com alguns documentos.

Agente: — Sabemos quem você é. Também sabemos que esteve com pessoas procuradas pelo governo.

Você: — Não fiz nada contra ninguém.

Agente: — Não estamos interessados em sua versão. Temos uma proposta.

O homem coloca um documento sobre a mesa.

Agente: — Assine este acordo, declare sua lealdade ao sistema e receberá liberdade.

Você: — E o que mais querem?

Agente: — A localização de Mara e do Pastor Elias.

Você: — Por que precisam deles?

Agente: — Porque continuam organizando reuniões clandestinas e incentivando pessoas a rejeitar a nova ordem.

Você: — E se eu não assinar?

Agente: — Então teremos que descobrir outras maneiras de conseguir essas informações.

Você percebe que o agente está tentando colocá-lo contra seus companheiros.`,
    [
      choice("Assinar o acordo.", "contexto_marca",
        { faith: -25, survival: 15 },
        "Você aceitou a marca e a lealdade ao sistema."),

      choice("Recusar e revelar onde eles estão.", "contexto_solidao",
        { faith: -10, survival: -5 },
        "Mara e Elias foram capturados. O regime dispensou você depois de retirar seus direitos."),

      choice("Recusar e não revelar a localização.", "complexo_sistema",
        { faith: 10, survival: -5 },
        "Você protegeu seus companheiros.")
    ]
  ),

  complexo_sistema: scene(
    "Capítulo VII",
    "Complexo do Sistema",
    "Resgate",
    "As luzes se apagam",
    `Você permanece preso, recusando-se a entregar a localização de Mara e Elias.

Durante a madrugada, as luzes começam a piscar.

Agente: — O que está acontecendo?

Uma explosão é ouvida no corredor.

Agente 2: — Temos uma falha no sistema de segurança!

As portas das celas começam a abrir.

Mara: — Vamos! Não temos muito tempo!

Você reconhece a voz.

Você: — Mara! Como vocês conseguiram entrar?

Mara: — Alguns refugiados nos ajudaram. Conseguimos chegar até o sistema de segurança.

Pastor Elias: — Precisamos sair antes que os agentes retomem o controle!

Ao sair da cela, você vê outros prisioneiros pedindo ajuda.

Detento: — Por favor! Não nos deixem aqui!

Mara: — Precisamos ir agora!

Pastor Elias: — Não podemos colocar todos em risco, mas também não podemos ignorar o sofrimento deles.

Você precisa decidir.`,
    [
      choice("Voltar sozinho para resgatar outros detentos.", "contexto_martir",
        { faith: 12, survival: -15 },
        "Você foi capturado e morto durante o resgate."),

      choice("Fugir imediatamente com Mara e Elias.", "estrada_terra",
        { faith: 5, survival: 8 },
        "Vocês escaparam juntos.")
    ]
  ),

  estrada_terra: scene(
    "Capítulo VIII",
    "Estrada de terra — Interior",
    "Refúgio",
    "O destino dos refugiados",
    `Depois de uma longa fuga, vocês alcançam uma região rural.

O grupo está cansado. Alguns refugiados caminham em silêncio, enquanto outros discutem sobre o próximo destino.

Mara: — Não podemos continuar andando sem um plano.

Pastor Elias: — Existe uma região onde podemos encontrar abrigo. Mas precisamos decidir o que faremos com o grupo.

Refugiado 1: — Eu quero continuar com vocês. Não vou abandonar minha fé.

Refugiado 2: — Eu tenho filhos. Não posso obrigá-los a enfrentar tudo isso. Talvez seja melhor procurar outro lugar.

Refugiado 3: — Se nos separarmos, ficaremos mais vulneráveis.

Mara: — Não podemos obrigar ninguém a seguir um caminho contra a própria vontade.

Pastor Elias: — Precisamos agir com sabedoria. Há uma fazenda abandonada que pode servir de abrigo, mas não sabemos por quanto tempo ficará segura.

Você observa as pessoas. Algumas querem permanecer unidas; outras preferem seguir caminhos diferentes.

A decisão precisa ser tomada.`,
    [
      choice("Deixar cada pessoa escolher seu caminho, sem condenar ninguém.", "fazenda",
        { faith: 5, survival: 5 },
        "Parte do grupo se separou; você permaneceu com os que continuaram unidos na fé.",
        s => { s.flags.grupoNaFazenda = "grupo_unido"; }),

      choice("Insistir que todos sigam juntos ao encontro secreto.", "fazenda",
        { faith: 8, survival: -5 },
        "Todo o grupo decidiu permanecer unido.",
        s => { s.flags.grupoNaFazenda = "todos"; }),

      choice("Concordar em se esconder na fazenda até o pior passar.", "cerco_final",
        { faith: -5, survival: 8 },
        "Vocês se esconderam, mas sabiam que não seria por muito tempo.",
        s => { s.flags.grupoNaFazenda = "esconderijo"; })
    ]
  ),

  fazenda: scene(
    "Capítulo VIII",
    "Fazenda abandonada",
    "Refúgio",
    "A fazenda",
    `Vocês chegam à fazenda ao entardecer.

O lugar está abandonado há anos. Há uma casa antiga, um celeiro e algumas construções que podem servir de abrigo.

Mara: — Não é muito, mas pelo menos temos onde descansar.

Pastor Elias: — Precisamos organizar a vigilância. Não sabemos se o regime já descobriu nossa localização.

Um refugiado se aproxima.

Refugiado: — Quantas pessoas vieram?

Mara: — Depende das decisões que foram tomadas na estrada.

Você percebe que nem todos os refugiados estão presentes.

Se você escolheu deixar cada pessoa seguir seu caminho, somente aqueles que decidiram permanecer unidos vieram com você.

Se insistiu que todos seguissem juntos, o grupo inteiro chegou à fazenda.

Pastor Elias: — Independentemente de quantos somos, precisamos nos preparar. Não podemos ficar aqui para sempre.

Você começa a ajudar na organização do abrigo.`,
    [
      choice("Ajudar a preparar abrigo e vigiar a estrada.", "cerco_final",
        { survival: 3 },
        "Você ajudou a preparar o grupo para o que viria.")
    ]
  ),

  cerco_final: scene(
    "Capítulo IX",
    "Fazenda abandonada",
    "Cerco",
    "Eles encontraram vocês",
    `O amanhecer chega acompanhado de um barulho estranho.

Você sai da casa e olha para o céu.

Mara: — O que é aquilo?

Drones sobrevoam a fazenda. Ao longe, caminhões blindados se aproximam pela estrada.

Pastor Elias: — Eles nos encontraram...

Os veículos cercam a propriedade. Alto-falantes são ligados.

Comandante: — Atenção, refugiados! Vocês estão cercados. O governo oferece proteção e liberdade para aqueles que colaborarem.

Mara: — Não confio neles.

Comandante: — Entreguem a localização de Mara, do Pastor Elias e dos demais líderes. Aqueles que cooperarem receberão cargos e benefícios.

Você: — E o que acontecerá com eles?

Comandante: — Isso não é da sua responsabilidade. Você terá uma oportunidade de continuar vivendo com segurança.

Pastor Elias: — Não entregue seus companheiros por causa de uma promessa de proteção.

Mara: — Nós já chegamos até aqui juntos. Não faça isso.

Os soldados aguardam sua resposta.`,
    [
      choice("Entregar a localização de Mara e Elias.", "contexto_solidao",
        { faith: -20, survival: 15 },
        "Você recebeu cargos e proteção, mas perdeu seus amigos."),

      choice("Recusar a proposta.", "grande_tribulacao",
        { faith: 10, survival: -10, witness: 2 },
        "Você recusou entregar seus companheiros. Todos foram presos e torturados.")
    ]
  ),

  grande_tribulacao: scene(
    "Capítulo X",
    "Cidade sitiada",
    "Grande Tribulação",
    "O último testemunho",
    `Vocês são levados para uma cidade sitiada. O mundo parece estar à beira do colapso.

As transmissões mostram as Duas Testemunhas sendo mortas diante de uma multidão.

Jornalista: — As duas testemunhas foram mortas! Pessoas de diferentes países estão comemorando nas ruas!

Três dias depois, uma nova transmissão começa.

Jornalista: — É impossível explicar o que estamos vendo! As duas testemunhas voltaram à vida!

As imagens mostram as testemunhas se levantando diante de todos.

Pastor Elias: — A Palavra de Deus está se cumprindo...

Mara: — O que vai acontecer agora?

O sistema entra em colapso. Vael aparece em uma transmissão desesperada.

Vael: — Não aceitarei que uma autoridade superior interfira em nosso mundo! Reuniremos nossas forças e enfrentaremos o próprio Deus!

A transmissão termina.

O céu começa a se abrir. Uma luz intensa toma conta da cidade.

Você sente que está diante de algo que nenhuma força humana pode impedir.

Uma voz parece atravessar o mundo inteiro.

Voz: — Você conhece Jesus?

Mara olha para você.

Mara: — Não tenha medo. Permaneça firme.

Pastor Elias: — Esta é a hora de confessar aquilo em que você acredita.

A pergunta permanece diante de você.`,
    [
      choice("Sim. Confessar Cristo e permanecer firme.", "contexto_coroa",
        { faith: 20, witness: 3 },
        "Você confessou sua fé diante de todos."),

      choice("Não. Esconder-se e negar sua fé.", "contexto_lago_fogo",
        { faith: -25, survival: 5 },
        "Você negou a Cristo quando foi confrontado.")
    ]
  ),

  persegicao_oficial: scene(
    "Capítulo III",
    "Regime da Paz",
    "Perseguição",
    "O oficial do sistema",
    `Três anos e meio se passam desde que você aceitou o Fundo da Paz.

Durante esse período, você abandonou sua antiga fé e passou a trabalhar diretamente para o regime.

Seu superior entra em seu escritório.

Superior: — Temos novas informações sobre um grupo de cristãos que está realizando reuniões clandestinas.

Você: — Onde estão?

Superior: — Ainda estamos investigando. Quero que você coordene a operação.

Você olha para os documentos sobre a mesa. Entre eles, há fotografias de pessoas que antes poderiam ter sido seus irmãos na fé.

Superior: — Algum problema?

Você: — Não. Farei o que for necessário.

Os anos de integração transformaram sua vida. Você passou a perseguir cristãos e a incentivar outras pessoas a abandonar suas crenças.

Certa noite, enquanto participa de uma reunião do regime, as luzes se apagam.

Um funcionário entra correndo.

Funcionário: — Olhem para o céu!

Você sai do prédio.

O céu começa a se abrir. Pela primeira vez, percebe que todo o poder do sistema não pode protegê-lo.`,
    [
      choice("Enfrentar o julgamento.", "contexto_lago_fogo",
        { faith: -20 },
        "Você colheu as consequências de sua escolha.")
    ]
  ),// ==========================================
// CENAS DE CONTEXTUALIZAÇÃO DOS FINAIS
// ==========================================

contexto_cadeia: scene(
    "Capítulo Final",
    "Cela da prisão",
    "DESFECHO",
    "O silêncio que custou a vida",
    `O tempo passou, mas a situação dentro da prisão só piorou.

Detento: — Você teve a oportunidade de falar sobre sua fé. Preferiu ficar calado.

Narrador: — Os dias se tornaram noites de medo. Sem esperança de liberdade, você passou a ser alvo constante dos outros presos.

Você: — Senhor, mesmo que ninguém compreenda, Tu sabes que eu não te abandonei.

Narrador: — Naquela noite, os ataques recomeçaram. Ferido e sem forças para resistir, você compreendeu que talvez não saísse daquela cela.

Narrador: — Sua história chegava ao fim. A decisão de permanecer em silêncio não impediu sua morte.`,
    [
        choice("Ver o desfecho.", "final_cadeia")
    ]
),

contexto_lago_fogo: scene(
    "Capítulo Final",
    "O julgamento",
    "DESFECHO",
    "Diante da eternidade",
    `O mundo que você conhecia havia desmoronado. O regime parecia invencível, mas os acontecimentos finais revelaram que nenhum poder humano poderia resistir ao julgamento de Deus.

Narrador: — Você teve oportunidades de permanecer fiel, mas escolheu confiar na segurança oferecida pelo sistema.

Narrador: — Agora, diante da realidade eterna, não havia mais benefícios, influência ou proteção capazes de mudar suas escolhas.

Você: — Se eu pudesse voltar atrás...

Narrador: — Mas o tempo das decisões havia terminado. O julgamento estava diante de você.`,
    [
        choice("Ver o desfecho.", "final_lago_fogo")
    ]
),

contexto_coroa: scene(
    "Capítulo Final",
    "O momento da vitória",
    "DESFECHO",
    "A esperança dos fiéis",
    `O sofrimento parecia interminável. A perseguição, as perdas e o medo marcaram cada etapa de sua caminhada.

Narrador: — Mesmo diante da morte, você decidiu não negar aquele em quem havia depositado sua fé.

Você: — Jesus Cristo é o meu Senhor. Não há outro a quem eu possa entregar minha vida.

Narrador: — O mundo considerava sua resistência uma derrota. Mas aquilo que parecia o fim era, na verdade, o início da eternidade.


Narrador: — As promessas de Deus não haviam falhado. A esperança dos fiéis estava prestes a se cumprir.

Narrador: — De repente, o céu se abre, e você ouve uma voz vinda do céu dizendo: "Venham, benditos do meu Pai! Recebam como herança o reino que foi preparado para vocês desde a criação do mundo.

`,
    [
        choice("Ver o desfecho.", "final_coroa")
    ]
),

contexto_marca: scene(
    "Capítulo Final",
    "Sob o domínio do regime",
    "DESFECHO",
    "O preço da segurança",
    `Você conseguiu aquilo que parecia impossível: proteção, alimento e estabilidade em meio ao caos.

Narrador: — O sistema ofereceu segurança em troca de lealdade. Você aceitou os benefícios e passou a viver integrado à nova ordem.

Narrador: — A princípio, tudo parecia ter valido a pena. As dificuldades diminuíram, e a vida parecia ter voltado ao normal.

Narrador: — Mas havia um preço. Suas escolhas o colocaram do lado de um sistema que exigia submissão e rejeição da antiga fé.

Você: — Eu só queria sobreviver...

Narrador: — Agora, você teria de enfrentar as consequências de sua decisão.`,
    [
        choice("Ver o desfecho.", "final_marca")
    ]
),

contexto_solidao: scene(
    "Capítulo Final",
    "O peso da escolha",
    "DESFECHO",
    "Quando todos se vão",
    `A decisão de entregar os outros ou de rejeitar aqueles que tentaram ajudá-lo deixou marcas irreversíveis.

Narrador: — Mara e Elias já não estavam ao seu lado. As vozes que antes o aconselhavam desapareceram.

Você: — Eu pensei que estava fazendo o necessário...

Narrador: — Mas, no fim, a sobrevivência não trouxe paz. O medo permaneceu, acompanhado pela lembrança daqueles que foram abandonados.

Narrador: — Você estava sozinho. E precisava encarar o resultado de suas próprias escolhas.`,
    [
        choice("Ver o desfecho.", "final_solidao")
    ]
),

contexto_martir: scene(
    "Capítulo Final",
    "O último testemunho",
    "DESFECHO",
    "Uma fé que não se cala",
    `As autoridades decidiram que sua voz não poderia continuar sendo ouvida.

Agente: — Você teve a chance de negar sua fé. Por que insiste em continuar?

Você: — Porque não posso negar aquele que entregou a própria vida por mim.

Narrador: — Mesmo sob ameaça, você não voltou atrás. Seu testemunho alcançou pessoas que talvez nunca tivessem ouvido falar de Cristo.

Detento: — Você realmente acredita que Jesus voltará?

Você: — Sim. E é por isso que não tenho medo de morrer.

Narrador: — O regime poderia tirar sua vida, mas não poderia apagar o testemunho que você deixou.`,
    [
        choice("Ver o desfecho.", "final_martir")
    ]
),

contexto_dependente: scene(
    "Capítulo Final",
    "Depois da perda",
    "DESFECHO",
    "A dor que consumiu tudo",
    `A morte de Mara mudou tudo. A pessoa que caminhava ao seu lado já não estava ali.

Narrador: — Você tentou continuar, mas a dor se tornou insuportável. Cada lembrança parecia trazer de volta o momento da perda.

Você: — Eu deveria ter conseguido salvá-la...

Narrador: — A culpa, o desespero e a tristeza dominaram seus pensamentos. Você deixou de enxergar qualquer razão para continuar.

Narrador: — O caminho que antes parecia uma fuga em busca de esperança terminou em desespero.`,
    [
        choice("Ver o desfecho.", "final_dependente")
    ]
),

contexto_a_fuga: scene(
    "Capítulo Final",
    "A vida sob o novo sistema",
    "DESFECHO",
    "Uma liberdade incompleta",
    `Você fez o que precisava para sobreviver. Diante da ameaça de uma longa condenação, decidiu negar publicamente sua ligação com a antiga comunidade de fé.

Agente: — Sua declaração foi registrada. Você está livre para voltar à sociedade.

Narrador: — As portas se abriram. Você deixou a prisão e recuperou parte da liberdade que havia perdido.

Narrador: — Entretanto, a liberdade tinha um preço: para recuperá-la, você precisou declarar publicamente que não fazia mais parte daquele povo.

Você: — Pelo menos ainda estou vivo...

Narrador: — Mas sobreviver e permanecer fiel nem sempre são a mesma coisa.`,
    [
        choice("Ver o desfecho.", "final_a_fuga")
    ]
),

  /* ---------- FINAIS DE TRANSIÇÃO ---------- */
  /* ---------- FINAIS DE TRANSIÇÃO ---------- */
  final_cadeia: { ending: "cadeia" },
  final_lago_fogo: { ending: "lago_fogo" },
  final_coroa: { ending: "coroa_vida" },
  final_marca: { ending: "marca" },
  final_solidao: { ending: "solidao" },
  final_martir: { ending: "martir" },
  final_dependente: { ending: "dependente" },
  final_a_fuga: { ending: "a_fuga" }
};
/* ---------- TEXTOS DOS OITO FINAIS ---------- */
const endings = {
  cadeia: {
    eyebrow: "Final 1 de 8",
    title: "Cadeia",
    text: `Você foi preso e decidiu permanecer em silêncio dentro da cela.

Acreditou que evitar qualquer manifestação chamaria menos atenção, mas isso não impediu a violência.

Alguns detentos o atacaram. Você não resistiu aos ferimentos e morreu na prisão. Sua história terminou sem que o regime precisasse executar a sentença.`
  },

  lago_fogo: {
    eyebrow: "Final 2 de 8",
    title: "Lago de Fogo",
    text: `Você escolheu negar a Cristo ou permanecer ao lado do sistema que se levantou contra Deus. Quando o Rei retorna, não há cargo, segurança ou poder humano capaz de protegê-lo.

“E irão estes para o tormento eterno, mas os justos para a vida eterna.”

Mateus 25:46`
  },

  coroa_vida: {
    eyebrow: "Final 3 de 8",
    title: "Coroa da Vida",
    text: `Você resistiu ao sistema e permaneceu fiel a Cristo. Quando o céu se abre, você não se esconde: confessa Jesus e contempla o retorno do Rei. A perseguição termina; a esperança se cumpre.

“E, eis que cedo venho, e o meu galardão está comigo, para dar a cada um segundo a sua obra. Eu sou o Alfa e o Ômega, o princípio e o fim, o primeiro e o derradeiro. Bem-aventurados aqueles que guardam os seus mandamentos, para que tenham direito à árvore da vida, e possam entrar na cidade pelas portas. Mas ficarão de fora os cães e os feiticeiros, e os fornicadores, e os homicidas, e os idólatras, e qualquer que ama e comete mentira. Eu, Jesus, enviei o meu anjo, para vos testificar estas coisas nas igrejas. Eu sou a raiz e a geração de Davi, a resplandecente estrela da manhã. E o Espírito e a esposa dizem: Vem. E quem ouve, diga: Vem. E quem tem sede, venha; e quem quiser, tome de graça da água da vida.”

Apocalipse 22:12-17, 20`
  },

  marca: {
    eyebrow: "Final 4 de 8",
    title: "A Marca",
    text: `Você escolheu a segurança oferecida pelo sistema. Por um tempo, recebeu alimento, proteção e benefícios. Mas sua escolha o integrou à ordem que exigia lealdade contrária à sua fé.

“Se alguém adorar a besta e a sua imagem e receber o sinal na testa ou na mão, também o tal beberá do vinho da ira de Deus, que se deitou, não misturado, no cálice da sua ira, e será atormentado com fogo e enxofre diante dos santos anjos e diante do Cordeiro.”

Apocalipse 14:9-10`
  },

  solidao: {
    eyebrow: "Final 5 de 8",
    title: "Solidão",
    text: `Você perdeu aqueles que caminhavam ao seu lado. Em uma decisão, afastou seus amigos, entregou sua localização ou escolheu o poder em troca da segurança. O que restou foi uma vida sem a comunidade que antes o sustentava.`
  },

  martir: {
    eyebrow: "Final 6 de 8",
    title: "Mártir",
    text: `Você escolheu pregar o evangelho mesmo sabendo que o regime não toleraria seu testemunho.

Os agentes o retiraram da cela e executaram a sentença de morte. Você não negou sua fé diante da perseguição.

“Porque aquele que quiser salvar a sua vida, perdê-la-á, e quem perder a sua vida por amor de mim, achá-la-á.”

Mateus 16:25`
  },

  dependente: {
    eyebrow: "Final 7 de 8",
    title: "Dependente",
    text: `A morte de Mara destruiu sua capacidade de continuar. Você ficou preso à perda e não conseguiu encontrar forças para seguir. Sua história termina quando a dor se torna maior do que sua esperança.`
  },

  a_fuga: {
    eyebrow: "Final 8 de 8",
    title: "A Fuga",
    text: `Você sobreviveu, mas sobreviver custou caro. Libertado depois de negar publicamente seu vínculo com a igreja, passou a viver entre ruínas e esconderijos. Quando os céus se abrem, você se esconde. Continua vivo, porém exausto, com a fé enfraquecida.`
  }
};

/* ---------- UTILITÁRIOS ---------- */
const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));


let transitionTimer = null;
let inputLocked = false;

function showScreen(name) {
  Object.values(screens).forEach(screen =>
    screen?.classList.remove("active")
  );

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
  const parts = [message];

  if (effects.faith) {
    parts.push(`Fé: ${effects.faith > 0 ? "+" : ""}${effects.faith}`);
  }

  if (effects.survival) {
    parts.push(`Sobrevivência: ${effects.survival > 0 ? "+" : ""}${effects.survival}`);
  }

  if (effects.witness) {
    parts.push(`Testemunho: +${effects.witness}`);
  }

  const tone =
    effects.faith < 0 || effects.survival < 0
      ? "negative"
      : effects.faith > 0 || effects.survival > 0 || effects.witness > 0
        ? "positive"
        : "neutral";

  els.consequence.textContent = parts.join(" • ");
  els.consequence.className = `consequence ${tone}`;
}

/* ---------- SISTEMA DE DIGITAÇÃO ---------- */

let typingInterval = null;
let typingTarget = null;
let typingFullText = "";
let typingIndex = 0;
let typingOnComplete = null;

const skipDialogueButton = document.getElementById("btn-skip-dialogue");

function cancelarDigitacao() {
    if (typingInterval !== null) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    typingTarget = null;
    typingFullText = "";
    typingIndex = 0;
    typingOnComplete = null;

    if (skipDialogueButton) {
        skipDialogueButton.hidden = true;
    }
}

function finishTyping() {
    if (typingInterval !== null) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    if (typingTarget) {
        typingTarget.textContent = typingFullText;
    }

    const callback = typingOnComplete;

    typingTarget = null;
    typingFullText = "";
    typingIndex = 0;
    typingOnComplete = null;

    if (skipDialogueButton) {
        skipDialogueButton.hidden = true;
    }

    if (typeof callback === "function") {
        callback();
    }
}

function typeText(target, text, speed = TYPE_SPEED, onComplete = null) {
    cancelarDigitacao();

    typingTarget = target;
   typingFullText = personalizarTexto(text);
    typingIndex = 0;
    typingOnComplete = onComplete;

    target.textContent = "";

    if (skipDialogueButton) {
        skipDialogueButton.hidden = false;
    }

    if (!text) {
        finishTyping();
        return;
    }

    typingInterval = setInterval(() => {
        if (typingIndex < typingFullText.length) {
            target.textContent += typingFullText.charAt(typingIndex);
            typingIndex++;
        } else {
            finishTyping();
        }
    }, speed);
}

/* Botão para pular a digitação */
if (skipDialogueButton) {
    skipDialogueButton.addEventListener("click", finishTyping);
}

/* ---------- RENDERIZAÇÃO E ESCOLHAS ---------- */
function renderNode(nodeId) {
    clearTimeout(transitionTimer);
    cancelarDigitacao();

    inputLocked = false;

    const node = story[nodeId];

    if (!node) {
        console.error(`Cena não encontrada: ${nodeId}`);
        return;
    }

    if (node.ending) {
        resolveEnding(node.ending);
        return;
    }

    state.currentNode = nodeId;

    els.chapter.textContent = node.chapter || "";
    els.location.textContent = node.location || "";
    els.sceneTag.textContent = node.tag || "Cena";
    els.sceneTitle.textContent = node.title || "";

    els.consequence.className = "consequence hidden";
    els.consequence.textContent = "";

    els.choices.innerHTML = "";

    typeText(els.storyText, node.text || "");

    (node.choices || []).forEach(option => {
        const button = document.createElement("button");

        button.type = "button";

        button.className =
            `choice ${
                option.effects?.faith < 0 || option.effects?.survival < 0
                    ? "danger"
                    : ""
            }`;

        button.textContent = option.label;

        button.addEventListener("click", () => chooseOption(option));

        els.choices.appendChild(button);
    });
}

function chooseOption(option) {
  if (inputLocked) return;

  inputLocked = true;

  [...els.choices.querySelectorAll("button")].forEach(button => {
    button.disabled = true;
  });

  applyEffects(option.effects);

  if (typeof option.action === "function") {
    option.action(state);
  }

  showConsequence(option.consequence || "Sua escolha foi registrada.", option.effects);

  transitionTimer = setTimeout(() => {
    renderNode(option.next);
  }, CONSEQUENCE_DELAY);
}

/* ---------- FINAIS E AGRADECIMENTOS ---------- */
function salvarProgresso() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...finaisConcluidos])
    );
  } catch (error) {
    console.warn("Não foi possível salvar o progresso:", error);
  }
}

function resolveEnding(endingId) {
    const ending = endings[endingId];

    if (!ending) {
        console.error(`Final não encontrado: ${endingId}`);
        return;
    }

    clearTimeout(transitionTimer);
    cancelarDigitacao();

    finaisConcluidos.add(endingId);
    salvarProgresso();

    els.endingEyebrow.textContent = ending.eyebrow;
    els.endingTitle.textContent = ending.title;

    els.endingFaith.textContent = state.faith;
    els.endingSurvival.textContent = state.survival;
    els.endingWitness.textContent = state.witness;

    showScreen("ending");

    const todosConcluidos = ENDING_IDS.every(
        id => finaisConcluidos.has(id)
    );

    const botao = document.getElementById("btn-play-again");

    if (botao) {
        botao.textContent = todosConcluidos
            ? "Ver agradecimentos"
            : "Jogar novamente";
    }

    typeText(els.endingText, ending.text, TYPE_SPEED, () => {

        if (todosConcluidos) {
            transitionTimer = setTimeout(
                showAcknowledgements,
                2500
            );
        }

    });
}

function showAcknowledgements() {
    clearTimeout(transitionTimer);
    cancelarDigitacao();

    els.thanksTitle.textContent = "Obrigado por jogar!";
    els.thanksText.textContent = THANKS_TEXT;

    showScreen("thanks");
}

/* ---------- CONTROLES ---------- */
function startGame() {
    clearTimeout(transitionTimer);
    cancelarDigitacao();

    state = criarEstadoInicial();
    inputLocked = false;

    updateMeters();
    showScreen("game");
    renderNode("inicio");
}

/* ---------- IDENTIFICAÇÃO E INÍCIO ---------- */

document.getElementById("btn-start")?.addEventListener("click", () => {
    showScreen("name");
    document.getElementById("player-name")?.focus();
});

document.getElementById("btn-confirm-name")?.addEventListener("click", () => {
    const input = document.getElementById("player-name");
    const error = document.getElementById("name-error");

    const nome = input.value.trim();

    if (!nome || nome.length < 2) {
        error.hidden = false;
        input.focus();
        return;
    }

    nomeProtagonista = nome;
    error.hidden = true;

    startGame();
});

document.getElementById("btn-restart")?.addEventListener("click", startGame);

document.getElementById("btn-play-again")?.addEventListener("click", () => {
  if (ENDING_IDS.every(id => finaisConcluidos.has(id))) {
    showAcknowledgements();
  } else {
    startGame();
  }
});

document.getElementById("btn-about")?.addEventListener("click", () => {
  document.getElementById("about-box")?.classList.toggle("hidden");
});

/* ---------- INICIALIZAÇÃO ---------- */
updateMeters();