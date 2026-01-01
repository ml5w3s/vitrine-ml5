export class FloatingVideo {
    constructor(videoId, title = "Aula ao Vivo") {
        this.videoId = videoId;
        this.title = title;
        this.element = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.render();
        this.initDrag();
    }

    render() {
        // Remove instância anterior se existir
        const existing = document.querySelector('.floating-video-container');
        if (existing) existing.remove();

        // Cria o container principal
        this.element = document.createElement('div');
        this.element.className = 'floating-video-container';
        
        // Estilos Injetados (para garantir isolamento)
        const style = document.createElement('style');
        style.textContent = `
            .floating-video-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 400px;
                background-color: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: opacity 0.3s;
                resize: both; /* Permite redimensionar */
            }
            
            .fv-header {
                padding: 10px 15px;
                background-color: #09c; /* Cor Primária do Projeto */
                color: white;
                font-family: 'Segoe UI', sans-serif;
                font-size: 0.9rem;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: grab;
                user-select: none;
            }
            
            .fv-header:active {
                cursor: grabbing;
            }

            .fv-controls button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
                line-height: 1;
                padding: 0 5px;
            }

            .fv-controls button:hover {
                color: #ffcccc;
            }

            .fv-content {
                position: relative;
                padding-bottom: 56.25%; /* Aspect Ratio 16:9 */
                height: 0;
                background: black;
            }

            .fv-content iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            @media (max-width: 600px) {
                .floating-video-container {
                    width: 90%;
                    right: 5%;
                    bottom: 10px;
                }
            }
        `;
        this.element.appendChild(style);

        // Estrutura HTML
        this.element.innerHTML += `
            <div class="fv-header">
                <span class="fv-title">🔴 ${this.title}</span>
                <div class="fv-controls">
                    <button id="fv-minimize">_</button>
                    <button id="fv-close">×</button>
                </div>
            </div>
            <div class="fv-content" id="fv-content-area">
                <iframe 
                    src="https://www.youtube.com/embed/${this.videoId}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;

        document.body.appendChild(this.element);

        // Event Listeners dos botões
        this.element.querySelector('#fv-close').addEventListener('click', () => this.destroy());
        this.element.querySelector('#fv-minimize').addEventListener('click', () => this.toggleMinimize());
    }

    initDrag() {
        const header = this.element.querySelector('.fv-header');

        const startDrag = (e) => {
            // Suporte para Mouse e Touch
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            this.isDragging = true;
            const rect = this.element.getBoundingClientRect();
            this.dragOffset.x = clientX - rect.left;
            this.dragOffset.y = clientY - rect.top;
            
            // Remove a transição de bottom/right para usar top/left absoluto durante o arraste
            this.element.style.bottom = 'auto';
            this.element.style.right = 'auto';
            this.element.style.width = `${rect.width}px`; // Fixa a largura atual
            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        };

        const onDrag = (e) => {
            if (!this.isDragging) return;
            e.preventDefault(); // Evita scroll em touch

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            let x = clientX - this.dragOffset.x;
            let y = clientY - this.dragOffset.y;

            // Limites da tela
            const maxX = window.innerWidth - this.element.offsetWidth;
            const maxY = window.innerHeight - this.element.offsetHeight;

            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
        };

        const stopDrag = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', stopDrag);
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag, { passive: false });
    }

    toggleMinimize() {
        const content = this.element.querySelector('#fv-content-area');
        const btn = this.element.querySelector('#fv-minimize');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            this.element.style.width = '400px'; // Restaura largura
            btn.textContent = '_';
        } else {
            content.style.display = 'none';
            this.element.style.width = '200px'; // Fica pequenininho
            this.element.style.height = 'auto';
            btn.textContent = '□';
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}
