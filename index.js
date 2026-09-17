// ===========> 01: Preparação <===========
let modo = "robo";
let tamanho = 4;
let lado = 0;
let grade = [];
let celulas = [];
let pontosUm = 0;
let pontosDois = 0;
let jogadorAtual = "um";
let jogoAtivo = false;
let quadradosFeitos = 0;
let totalQuadrados = 0;

const divTabuleiro = document.getElementById("tabuleiro");
const campoModo = document.getElementById("modo");
const campoTamanho = document.getElementById("tamanho");
const botaoNovoJogo = document.getElementById("botaoNovoJogo");
const textoMensagem = document.getElementById("mensagem");
const textoPlacarUm = document.getElementById("placarJogador");
const textoPlacarDois = document.getElementById("placarRobo");

botaoNovoJogo.onclick = iniciarJogo;

// ===========> 02: Início do jogo <===========
function iniciarJogo() {
  modo = campoModo.value;
  tamanho = parseInt(campoTamanho.value);
  lado = tamanho * 2 - 1;
  pontosUm = 0
  pontosDois = 0
  quadradosFeitos = 0;
  totalQuadrados = (tamanho - 1) * (tamanho - 1);
  jogadorAtual = "um";
  jogoAtivo = true;

  botaoNovoJogo.textContent = "Reiniciar";

  criarTabuleiro();
  atualizarPlacar();
  avisarVez();
}

// ===========> 03: Montagem do tabuleiro <==========
function criarTabuleiro() {
  divTabuleiro.style.display = "grid";
  divTabuleiro.innerHTML = "";
  grade = [];
  celulas = [];

  // tamanhos em pixels (diminuem quando o tabuleiro e maior)
  let tamanhoPonto = 8;
  let tamanhoLinha = 30;
  if (tamanho == 8) { tamanhoLinha = 26; }
  if (tamanho == 16) { tamanhoLinha = 22; }
  if (tamanho == 32) { tamanhoLinha = 14; tamanhoPonto = 6; }

  // monta o texto com as medidas das colunas e linhas do grid
  let medidas = "";
  for (let i = 0; i < lado; i++) {
    if (i % 2 == 0) {
      medidas = medidas + tamanhoPonto + "px ";
    } else {
      medidas = medidas + tamanhoLinha + "px ";
    }
  }
  divTabuleiro.style.gridTemplateColumns = medidas;
  divTabuleiro.style.gridTemplateRows = medidas;

  // cria cada celula da grade
  for (let linha = 0; linha < lado; linha++) {
    grade[linha] = [];
    celulas[linha] = [];

    for (let coluna = 0; coluna < lado; coluna++) {
      const celula = document.createElement("div");
      const tipo = tipoDaCelula(linha, coluna);

      if (tipo == "ponto") {
        celula.className = "ponto";
        grade[linha][coluna] = "ponto";
      } else if (tipo == "quadrado") {
        celula.className = "quadrado";
        grade[linha][coluna] = "vazio";
      } else {
        // linha horizontal ou vertical, ainda nao desenhada
        celula.className = "linha";
        grade[linha][coluna] = "livre";
        celula.onclick = criarClique(linha, coluna);
      }

      divTabuleiro.appendChild(celula);
      celulas[linha][coluna] = celula;
    }
  }
}

// descobre o que a celula e, olhando se a posicao e par ou impar
function tipoDaCelula(linha, coluna) {
  if (linha % 2 == 0 && coluna % 2 == 0) { return "ponto"; }
  if (linha % 2 == 1 && coluna % 2 == 1) { return "quadrado"; }
  return "linha";
}

// guarda a posicao certa de cada clique
function criarClique(linha, coluna) {
  return function () {
    clicarNaLinha(linha, coluna);
  };
}


// ===========> 04: Jogada do jogador <==========
function clicarNaLinha(linha, coluna) {
  if (jogoAtivo == false) { return; }
  if (grade[linha][coluna] != "livre") { return; }

  // no modo contra o robo a pessoa so joga na vez dela
  if (modo == "robo" && jogadorAtual == "dois") { return; }

  const quemJogou = jogadorAtual;
  const feitos = desenharLinha(linha, coluna, quemJogou);

  if (verificarFimDeJogo() == true) { return; }

  if (feitos == 0) {
    // nao fechou nada, entao passa a vez
    passarAVez();
  } else {
    textoMensagem.textContent = nomeDoJogador(quemJogou) + " fechou um quadrado e joga de novo.";
  }
}

// Desenha a linha e confere os quadrados vizinhos
function desenharLinha(linha, coluna, quem) {
  grade[linha][coluna] = quem;

  if (quem == "um") {
    celulas[linha][coluna].className = "linha-jogador";
  } else {
    celulas[linha][coluna].className = "linha-robo";
  }

  let feitos = 0;

  // linha horizontal: confere o quadrado de cima e o de baixo
  if (linha % 2 == 0) {
    if (fecharQuadrado(linha - 1, coluna, quem) == true) { feitos++; }
    if (fecharQuadrado(linha + 1, coluna, quem) == true) { feitos++; }
  } else {
    // linha vertical: confere o quadrado da esquerda e o da direita
    if (fecharQuadrado(linha, coluna - 1, quem) == true) { feitos++; }
    if (fecharQuadrado(linha, coluna + 1, quem) == true) { feitos++; }
  }

  atualizarPlacar();
  return feitos;
}

// confere se os 4 lados do quadrado ja foram desenhados
function fecharQuadrado(linha, coluna, quem) {
  if (linha < 0 || coluna < 0 || linha >= lado || coluna >= lado) { return false; }
  if (grade[linha][coluna] != "vazio") { return false; }

  if (grade[linha - 1][coluna] == "livre") { return false; }
  if (grade[linha + 1][coluna] == "livre") { return false; }
  if (grade[linha][coluna - 1] == "livre") { return false; }
  if (grade[linha][coluna + 1] == "livre") { return false; }

  // esta completo, entao marca o dono
  grade[linha][coluna] = quem;
  quadradosFeitos++;

  if (quem == "um") {
    celulas[linha][coluna].className = "quadrado quadrado-jogador";
    pontosUm++;
  } else {
    celulas[linha][coluna].className = "quadrado quadrado-robo";
    pontosDois++;
  }
  celulas[linha][coluna].textContent = letraDoJogador(quem);

  return true;
}

// Placar e fim de jogo
function atualizarPlacar() {
  textoPlacarUm.textContent = nomeDoJogador("um") + ": " + pontosUm;
  textoPlacarDois.textContent = nomeDoJogador("dois") + ": " + pontosDois;
}

function verificarFimDeJogo() {
  if (quadradosFeitos < totalQuadrados) { return false; }

  jogoAtivo = false;

  if (pontosUm > pontosDois) {
    textoMensagem.textContent = "Fim de jogo. " + nomeDoJogador("um") + " venceu!";
  } else if (pontosDois > pontosUm) {
    textoMensagem.textContent = "Fim de jogo. " + nomeDoJogador("dois") + " venceu!";
  } else {
    textoMensagem.textContent = "Fim de jogo. Empate.";
  }

  return true;
}


// ===========> 05: Controle de turno <===========
// troca de jogador e, se for o caso, chama o robo
function passarAVez() {
  if (jogadorAtual == "um") {
    jogadorAtual = "dois";
  } else {
    jogadorAtual = "um";
  }

  avisarVez();

  if (modo == "robo" && jogadorAtual == "dois") {
    setTimeout(jogadaDoRobo, 500);
  }
}

function avisarVez() {
  if (modo == "robo" && jogadorAtual == "dois") {
    textoMensagem.textContent = "Vez do robô...";
  } else if (modo == "robo" && jogadorAtual == "um") {
    textoMensagem.textContent = "Sua vez. Clique em uma linha.";
  } else {
    textoMensagem.textContent = "Vez de " + nomeDoJogador(jogadorAtual) + ". Clique em uma linha.";
  }
}


// ===========> 06: Jogada do Robô <===========
// Jogada do robo (escolha aleatoria, sem estrategia)
function jogadaDoRobo() {
  if (jogoAtivo == false) { return; }
  if (modo != "robo") { return; }

  // 1) procura todas as linhas que ainda estao livres
  const disponiveis = [];
  for (let linha = 0; linha < lado; linha++) {
    for (let coluna = 0; coluna < lado; coluna++) {
      if (grade[linha][coluna] == "livre") {
        disponiveis.push([linha, coluna]);
      }
    }
  }

  if (disponiveis.length == 0) { return; }

  // 2) sorteia uma posicao e marca
  const sorteio = Math.floor(Math.random() * disponiveis.length);
  const escolhida = disponiveis[sorteio];
  const feitos = desenharLinha(escolhida[0], escolhida[1], "dois");

  if (verificarFimDeJogo() == true) { return; }

  // 3) se fechou um quadrado, joga outra vez
  if (feitos > 0) {
    textoMensagem.textContent = "O robô fechou um quadrado e joga de novo.";
    setTimeout(jogadaDoRobo, 500);
  } else {
    passarAVez();
  }
}


// ===========> 07: Funções auxiliares <===========
// nome que aparece nas mensagens e no placar
function nomeDoJogador(quem) {
  if (quem == "um") {
    if (modo == "robo") { return "Você"; }
    return "Jogador 1";
  } else {
    if (modo == "robo") { return "Robô"; }
    return "Jogador 2";
  }
}

// letra que fica dentro do quadrado conquistado
function letraDoJogador(quem) {
  if (quem == "um") {
    if (modo == "robo") { return "V"; }
    return "1";
  } else {
    if (modo == "robo") { return "R"; }
    return "2";
  }
}
