const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let fogos = [];
let coracoesFlutuantes = [];
let floresFlutuantes = [];
const musicaFundo = document.getElementById('musicaFundo');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Classe para a partícula (parte do fogo)
class Partícula {
    constructor(x, y, cor) {
        this.x = x;
        this.y = y;
        this.velocidadeX = Math.random() * 6 - 3;
        this.velocidadeY = Math.random() * 6 - 3;
        this.gravidade = 0.05;
        this.tamanho = Math.random() * 2 + 1;
        this.cor = `hsl(${cor}, 100%, 60%)`;
        this.opacidade = 1;
    }
    
    atualizar() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        this.opacidade -= 0.01;
        this.velocidadeY += this.gravidade;
    }
    
    desenhar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = this.cor;
        ctx.globalAlpha = this.opacidade;
        ctx.fill();
    }
}

// Classe para o fogo de artifício completo
class FogoArtificio {
    constructor(x, y, cor) {
        this.x = x;
        this.y = y;
        this.cor = cor;
        this.partículas = [];
        this.explodiu = false;
        this.velocidadeY = Math.random() * -3 - 2;
    }

    atualizar() {
        if (!this.explodiu) {
            this.y += this.velocidadeY;
            this.velocidadeY += 0.02;
            if (this.velocidadeY >= 0) {
                this.explodir();
                this.explodiu = true;
            }
        }
    }
    
    explodir() {
        for (let i = 0; i < 50; i++) {
            this.partículas.push(new Partícula(this.x, this.y, this.cor));
        }
    }
    
    desenhar() {
        if (this.explodiu) {
            this.partículas.forEach(p => {
                p.atualizar();
                p.desenhar();
            });
            this.partículas = this.partículas.filter(p => p.opacidade > 0);
        } else {
            ctx.fillStyle = `hsl(${this.cor}, 100%, 60%)`;
            ctx.globalAlpha = 1;
            ctx.fillRect(this.x, this.y, 2, 5);
        }
    }
}

// Classe para os corações flutuantes
class CoracaoFlutuante {
    constructor(x, y, texto) {
        this.x = x;
        this.y = y;
        // Velocidade aumentada para uma animação mais intensa
        this.velocidadeY = Math.random() * -1.5 - 1; 
        this.tamanho = Math.random() * 40 + 20;
        this.opacidade = 1;
        this.texto = texto;
    }
    
    atualizar() {
        this.y += this.velocidadeY;
        this.opacidade -= 0.005;
    }
    
    desenhar() {
        ctx.font = `${this.tamanho}px Arial`;
        ctx.globalAlpha = this.opacidade;
        ctx.fillStyle = 'red';
        ctx.fillText('❤️', this.x, this.y);

        if (this.texto) {
            ctx.globalAlpha = this.opacidade;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            // Fonte do texto ampliada
            ctx.font = '24px Arial'; 
            ctx.fillText(this.texto, this.x + (this.tamanho/2), this.y + this.tamanho + 10);
        }
    }
}

// Classe para as flores flutuantes
class FlorFlutuante {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidadeY = Math.random() * -1 - 0.5;
        this.tamanho = Math.random() * 15 + 8;
        this.opacidade = 1;
        this.florEmoji = ['🌸', '🌺', '🌼', '🌷'];
        this.emoji = this.florEmoji[Math.floor(Math.random() * this.florEmoji.length)];
    }
    
    atualizar() {
        this.y += this.velocidadeY;
        this.opacidade -= 0.008;
    }
    
    desenhar() {
        ctx.font = `${this.tamanho}px Arial`;
        ctx.globalAlpha = this.opacidade;
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

// Loop de animação principal
function animar() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animação dos fogos
    for (let i = 0; i < fogos.length; i++) {
        fogos[i].atualizar();
        fogos[i].desenhar();
    }
    fogos = fogos.filter(fogo => fogo.partículas.length > 0 || !fogo.explodiu);

    // Animação dos corações
    for (let i = 0; i < coracoesFlutuantes.length; i++) {
        coracoesFlutuantes[i].atualizar();
        coracoesFlutuantes[i].desenhar();
    }
    coracoesFlutuantes = coracoesFlutuantes.filter(coracao => coracao.opacidade > 0);
    
    // Animação das flores
    for (let i = 0; i < floresFlutuantes.length; i++) {
        floresFlutuantes[i].atualizar();
        floresFlutuantes[i].desenhar();
    }
    floresFlutuantes = floresFlutuantes.filter(flor => flor.opacidade > 5);

    requestAnimationFrame(animar);
}

// Inicia o áudio na primeira interação do usuário
let audioIniciado = false;
document.addEventListener('click', () => {
    if (!audioIniciado) {
        musicaFundo.play();
        audioIniciado = true;
    }
});

// Cria um novo fogo de artifício a cada 0.8 segundos
setInterval(() => {
    const corAleatoria = Math.random() * 360;
    const xAleatorio = Math.random() * canvas.width;
    const yAleatorio = canvas.height;
    fogos.push(new FogoArtificio(xAleatorio, yAleatorio, corAleatoria));
}, 800);

// Cria um novo coração flutuante com os nomes a cada 500 milissegundos
const nomes = ["Dudu", "Lucas", "Luana", "Marcelo","Nana"];
let indiceNome = 5;
setInterval(() => {
    const xAleatorio = Math.random() * canvas.width;
    const yInicial = canvas.height;
    coracoesFlutuantes.push(new CoracaoFlutuante(xAleatorio, yInicial, nomes[indiceNome]));
    indiceNome = (indiceNome + 1) % nomes.length;
}, 500);

// Cria uma nova flor flutuante a cada 200 milissegundos
setInterval(() => {
    const xAleatorio = Math.random() * canvas.width;
    const yInicial = canvas.height;
    floresFlutuantes.push(new FlorFlutuante(xAleatorio, yInicial));
}, 200);

animar();