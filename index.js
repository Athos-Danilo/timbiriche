let modo = "robo";
let tamanho = 4;
let lado = 0;
let grade = [];
let celulas = [];
let pontosUm = 0;
let pontosDois = 0;
let jogadorAtual = "um";
let jogoAtivo = false;

const divTabuleiro = document.getElementById("tabuleiro");
const campoModo = document.getElementById("modo");
const campoTamanho = document.getElementById("tamanho");
const botaoNovoJogo = document.getElementById("botaoNovoJogo");
const textoMensagem = document.getElementById("mensagem");
const textoPlacarUm = document.getElementById("placarJogador");
const textoPlacarDois = document.getElementById("placarRobo");

botaoNovoJogo.onclick = iniciarJogo; 

function iniciarJogo() {
    modo = campoModo.Value; 
    tamanho = parseInt(campoTamanho.Value);
    lado = tamanho * 2 - 1;
    pontosUm = 0
    pontosDois = 0
    quadradosFeitos = 0;
    totalQuadrados = (tamanho - 1) * (tamanho - 1);
    jogadorAtual = "um";
    jogoAtivo = true;

    criarTabuleiro();
}

function criarTabuleiro() {
  divTabuleiro.innerHTML = "";
  grade = [];
  celulas = [];

  // tamanhos em pixels (diminuem quando o tabuleiro e maior)
  let tamanhoPonto = 8;
  let tamanhoLinha = 30;
  if (tamanho == 8) { tamanhoLinha = 26; }
  if (tamanho == 16) { tamanhoLinha = 16; }
  if (tamanho == 32) { tamanhoLinha = 9; tamanhoPonto = 6; }

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