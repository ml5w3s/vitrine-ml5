// 1. Seleciona o elemento do personagem
const personagem = document.getElementById('personagem');

// 2. Define a posição inicial e a velocidade
let x = 0;
let y = 0;
const velocidade = 15;

// 3. Define os caminhos das imagens
const imgParado = 'caminho/para/sprite/aluno_mobile.png';
const imgPasso = 'caminho/para/sprite/aluno_mobile_passo.png';

// 4. Função para atualizar a posição
function atualizarPosicao() {
    personagem.style.left = x + 'px';
    personagem.style.top = y + 'px';
}

// 5. Ouve o evento de TECLA PRESSIONADA
document.addEventListener('keydown', (e) => {
    // Troca para a imagem de "passo" apenas se for uma tecla de movimento
    if (e.key.includes('Arrow')) {
        personagem.src = imgPasso;
    }
    
    // Altera a posição e a orientação
    switch(e.key) {
        case 'ArrowUp':
            y -= velocidade;
            break;
        case 'ArrowDown':
            y += velocidade;
            break;
        case 'ArrowLeft':
            x -= velocidade;
            // Adiciona a classe para "virar" a imagem
            personagem.classList.add('flip-horizontal');
            break;
        case 'ArrowRight':
            x += velocidade;
            // Remove a classe para que a imagem volte ao normal
            personagem.classList.remove('flip-horizontal');
            break;
    }
    
    atualizarPosicao();
});

// 6. Ouve o evento de TECLA SOLTA
document.addEventListener('keyup', (e) => {
    // Troca para a imagem "parada" apenas se a tecla solta for de movimento
    if (e.key.includes('Arrow')) {
        personagem.src = imgParado;
    }
});

// Define a posição inicial
atualizarPosicao();