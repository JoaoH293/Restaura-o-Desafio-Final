# 📖 Restauração: O Desafio Final

> **Ficção narrativa interativa baseada em escolhas com temática profética e escatológica.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📝 Sobre o Jogo

**Restauração: O Desafio Final** é um jogo interativo de ficção textual estilo *Choose Your Own Adventure* (Escolha sua Própria Aventura). 

Em um instante, milhões de pessoas desaparecem do planeta. O jogador assume o papel de um sobrevivente deixado para trás que precisa navegar pelas transformações políticas, sociais e espirituais da nova ordem mundial sob o governo do Regime da Paz. 

Cada decisão tomada altera os atributos do personagem, afeta as relações com aliados (como a amiga Mara e o Pastor Elias) e conduz a narrativa a um dos **8 finais possíveis**.

---

## 🎮 Mecânicas do Jogo

- **Módulos de Atributos (HUD):**
  - **Fé / Esperança (0 - 100):** Mede a firmeza espiritual do protagonista em relação às suas crenças diante da perseguição.
  - **Sobrevivência (0 - 100):** Mede a capacidade de se manter seguro e evitar os perigos físicos e militares do regime.
  - **Testemunho Público:** Contador interno de ações públicas em defesa da fé.
- **Personalização de Nome:** O jogo adapta os diálogos dinamicamente com base no nome inserido pelo jogador.
- **Sistema Typewriter (Efeito de Digitação):** Os textos das cenas são exibidos gradualmente para maior imersão, com a opção de pular a digitação a qualquer momento.
- **Persistência de Progresso:** Utiliza o `localStorage` do navegador para registrar os finais desbloqueados pelo jogador.
- **Tela Secreta de Agradecimentos:** Desbloqueada exclusivamente após o jogador concluir todos os 8 finais do jogo.

---

## 🏆 Os 8 Finais

| # | Final | Descrição Resumida |
|---|---|---|
| 1 | **Cadeia** | O jogador permanece quieto na prisão, morrendo em decorrência de agressões na cela. |
| 2 | **Lago de Fogo** | O jogador aceita e apoia o regime ou nega a fé no momento do julgamento final. |
| 3 | **Coroa da Vida** | Permanecendo fiel até o fim, o jogador confessa Jesus no retorno glorioso do Rei. |
| 4 | **A Marca** | Aceitou o conforto e os benefícios do Fundo da Paz, tornando-se parte do sistema. |
| 5 | **Solidão** | O jogador traiu seus amigos ou os afastou para tentar salvar a própria pele. |
| 6 | **Mártir** | O jogador optou por pregar e testemunhar publicamente, sendo executado pelo regime. |
| 7 | **Dependente** | Após a perda traumática de Mara, o desespero e a dor consomem a vontade de viver. |
| 8 | **A Fuga** | Negou publicamente a igreja para ser libertado; sobreviveu fisicamente, mas com a fé enfraquecida. |

---

## 📂 Estrutura do Projeto

```text
├── index.html        # Interface de usuário (Menu, HUD, Cenas, Finais e Agradecimentos)
├── style.css         # Estilização visual (Tema escuro, partículas, responsividade e iluminação)
├── script.js        # Engine do jogo em JavaScript Vanilla (Lógica de cenas, estado e persistência)
└── fluxograma.txt    # Documentação completa da árvore de cenários, escolhas e arcos narrativos
```

---

## 🚀 Como Executar

Por ser uma aplicação baseada em **JavaScript Vanilla**, **HTML5** e **CSS3**, não é necessário instalar dependências ou executar comandos de build.

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/restauracao-o-desafio-final.git
   ```

2. **Executar o jogo:**
   - Basta abrir o arquivo `index.html` em qualquer navegador moderno.
   - Ou utilizar a extensão **Live Server** no VS Code.

---

## 👤 Autor

Criado por **João Henrique**.