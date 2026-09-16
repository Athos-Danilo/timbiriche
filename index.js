let modo = "robo";
let tamanho = 4;
let lado = 0;
let grade = [];
let celulas = [];
let pontosUm = 0;
let pontosDois = 0;
let jogadorAtual = "um";
let jogoAtivo = false;

const divTaboleiro = document.getElementById("tabuleiro");
const campoModo = document.getElementById("modo");
const campoTamanho = document.getElementById("tamanho");
const botaoNovoJogo = document.getElementById("botaoNovoJogo");
const textoMensagem = document.getElementById("mensagem");
const textoPlacarUm = document.getElementById("placarJogador");
const textoPlacarDois = document.getElementById("placarRobo");

botaoNovoJogo.onclick = iniciarJogo; 
