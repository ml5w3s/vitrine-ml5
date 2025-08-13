const personagemContainer = document.querySelector('.container-personagem');
const personagemParado = document.getElementById('personagem');
const personagemAndando = document.getElementById('personagem_passo');

const menuEsquerda = document.getElementById('menu-esquerda');
const menuDireita = document.getElementById('menu-direita');
const menuTopo = document.getElementById('menu-topo');

const velocidade = 20;
let posicaoX = window.innerWidth / 2 - personagemContainer.offsetWidth / 2;
let posicaoY = window.innerHeight - personagemContainer.offsetHeight;

let limiteVerticalSuperior;
let limiteVerticalInferior;

function atualizarLimites() {
  limiteVerticalSuperior = window.innerHeight * 0.35;
  limiteVerticalInferior = window.innerHeight - personagemContainer.offsetHeight;
}

atualizarLimites();
personagemContainer.style.left = `${posicaoX}px`;
personagemContainer.style.top = `${posicaoY}px`;

function alternarImagens() {
  if (personagemParado.style.display !== 'none') {
    personagemParado.style.display = 'none';
    personagemAndando.style.display = 'block';
  } else {
    personagemParado.style.display = 'block';
    personagemAndando.style.display = 'none';
  }
}

let movimentoAtivo = false;
let animacaoIntervalo;
let imagemIntervalo;
let ultimoLimiteTocado = null;

function abrirMenu(menu) {
  fecharTodosMenus();
  menu.classList.add('ativo');
}

function fecharTodosMenus() {
  menuEsquerda.classList.remove('ativo');
  menuDireita.classList.remove('ativo');
  menuTopo.classList.remove('ativo');
}

function iniciarMovimento(direcao) {
  if (movimentoAtivo) return;
  movimentoAtivo = true;

  imagemIntervalo = setInterval(alternarImagens, 500);

  animacaoIntervalo = setInterval(() => {
    let novaPosicaoX = posicaoX;
    let novaPosicaoY = posicaoY;

    switch (direcao) {
      case 'ArrowUp': novaPosicaoY -= velocidade; break;
      case 'ArrowDown': novaPosicaoY += velocidade; break;
      case 'ArrowLeft': novaPosicaoX -= velocidade; break;
      case 'ArrowRight': novaPosicaoX += velocidade; break;
    }

    const maxX = window.innerWidth - personagemContainer.offsetWidth;
    posicaoX = Math.max(0, Math.min(novaPosicaoX, maxX));
    posicaoY = Math.max(limiteVerticalSuperior, Math.min(novaPosicaoY, limiteVerticalInferior));

    personagemContainer.style.left = `${posicaoX}px`;
    personagemContainer.style.top = `${posicaoY}px`;

    // Detecção dos limites para abrir menus
    if (posicaoX <= 0 && ultimoLimiteTocado !== 'esquerda') {
      abrirMenu(menuEsquerda);
      ultimoLimiteTocado = 'esquerda';
    }
    else if (posicaoX >= maxX && ultimoLimiteTocado !== 'direita') {
      abrirMenu(menuDireita);
      ultimoLimiteTocado = 'direita';
    }
    else if (posicaoY <= limiteVerticalSuperior && ultimoLimiteTocado !== 'topo') {
      abrirMenu(menuTopo);
      ultimoLimiteTocado = 'topo';
    }

    // Fecha menus se afastar dos limites
    if (posicaoX > 0 && posicaoX < maxX && posicaoY > limiteVerticalSuperior) {
      fecharTodosMenus();
      ultimoLimiteTocado = null;
    }

  }, 50);
}

function pararMovimento() {
  movimentoAtivo = false;
  clearInterval(animacaoIntervalo);
  clearInterval(imagemIntervalo);
  personagemParado.style.display = 'block';
  personagemAndando.style.display = 'none';
}

// Teclado
document.addEventListener('keydown', (event) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
    event.preventDefault();
    iniciarMovimento(event.key);
  }
});
document.addEventListener('keyup', (event) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
    pararMovimento();
  }
});

// Mobile
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

upBtn.addEventListener('mousedown', () => iniciarMovimento('ArrowUp'));
upBtn.addEventListener('mouseup', pararMovimento);
upBtn.addEventListener('touchstart', e => { e.preventDefault(); iniciarMovimento('ArrowUp'); });
upBtn.addEventListener('touchend', pararMovimento);

downBtn.addEventListener('mousedown', () => iniciarMovimento('ArrowDown'));
downBtn.addEventListener('mouseup', pararMovimento);
downBtn.addEventListener('touchstart', e => { e.preventDefault(); iniciarMovimento('ArrowDown'); });
downBtn.addEventListener('touchend', pararMovimento);

leftBtn.addEventListener('mousedown', () => iniciarMovimento('ArrowLeft'));
leftBtn.addEventListener('mouseup', pararMovimento);
leftBtn.addEventListener('touchstart', e => { e.preventDefault(); iniciarMovimento('ArrowLeft'); });
leftBtn.addEventListener('touchend', pararMovimento);

rightBtn.addEventListener('mousedown', () => iniciarMovimento('ArrowRight'));
rightBtn.addEventListener('mouseup', pararMovimento);
rightBtn.addEventListener('touchstart', e => { e.preventDefault(); iniciarMovimento('ArrowRight'); });
rightBtn.addEventListener('touchend', pararMovimento);

window.addEventListener('resize', () => {
  atualizarLimites();
  const maxX = window.innerWidth - personagemContainer.offsetWidth;
  posicaoX = Math.min(posicaoX, maxX);
  posicaoY = Math.max(limiteVerticalSuperior, Math.min(posicaoY, limiteVerticalInferior));
  personagemContainer.style.left = `${posicaoX}px`;
  personagemContainer.style.top = `${posicaoY}px`;
});