export class NotasComponent {
    static localStorageKey = 'mlab5_notas_content';

    constructor() {
        // Propriedades
        this.isVisible = false;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.textarea = null; // Para ter acesso fácil ao textarea

        // Criar elementos
        this.notasElement = document.createElement('div');
        this.notasElement.className = 'notas-container';
        // Configurações de estilo para o "slide-up"
        this.notasElement.style.position = 'fixed'; // Fixa na tela
        this.notasElement.style.bottom = '-300px'; // Escondido inicialmente (assumindo altura máx de 300px)
        this.notasElement.style.right = '20px'; // Posição padrão na direita
        this.notasElement.style.zIndex = '1000'; // Garante que fique sobre outros elementos
        this.notasElement.style.transition = 'bottom 0.3s ease-out, opacity 0.3s ease-out'; // Transição suave
        this.notasElement.style.opacity = '0'; // Escondido visualmente
        this.notasElement.style.display = 'none'; // Completamente invisível quando escondido

        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'notas-toggle-button';
        this.toggleButton.textContent = 'Notas';

        this.notasContent = document.createElement('div');
        this.notasContent.className = 'notas-content';
        this.notasContent.innerHTML = `
            <h4>Notas</h4>
            <p>Anote aqui seus pensamentos...</p>
            <textarea style="width: 90%; height: 60%;"></textarea>
        `;
        this.textarea = this.notasContent.querySelector('textarea'); // Obtém referência ao textarea

        // Montar o componente
        this.notasElement.appendChild(this.toggleButton);
        this.notasElement.appendChild(this.notasContent);

        // Carregar conteúdo salvo
        this._loadContent();

        // Vincular métodos para os event listeners para permitir a remoção correta
        this.boundToggle = this.toggle.bind(this);
        this.boundOnMouseDown = this._onMouseDown.bind(this);
        this.boundOnMouseMove = this._onMouseMove.bind(this);
        this.boundOnMouseUp = this._onMouseUp.bind(this);
        this.boundSaveContent = this._saveContent.bind(this); // Bound para salvar no input
        this.boundStopPropagation = (e) => e.stopPropagation();

        // Configurar listeners
        this._setupEventListeners();
    }

    _setupEventListeners() {
        this.toggleButton.addEventListener('click', this.boundToggle);
        
        // Listeners para arrastar
        this.notasElement.addEventListener('mousedown', this.boundOnMouseDown);
        document.addEventListener('mousemove', this.boundOnMouseMove);
        document.addEventListener('mouseup', this.boundOnMouseUp);

        // Impedir que cliques dentro do conteúdo iniciem o arraste
        this.notasContent.addEventListener('mousedown', this.boundStopPropagation);

        // Salvar conteúdo do textarea
        if (this.textarea) {
            this.textarea.addEventListener('input', this.boundSaveContent);
        }
    }

    // --- Lógica de Persistência ---
    _saveContent() {
        if (this.textarea) {
            localStorage.setItem(NotasComponent.localStorageKey, this.textarea.value);
        }
    }

    _loadContent() {
        if (this.textarea) {
            this.textarea.value = localStorage.getItem(NotasComponent.localStorageKey) || '';
        }
    }

    // --- Lógica do Componente ---
    toggle() {
        this.isVisible = !this.isVisible;
        this.toggleButton.textContent = this.isVisible ? 'Fechar Notas' : 'Notas';
        this._saveContent(); // Salva o conteúdo ao fechar/abrir

        if (this.isVisible) {
            this.notasElement.style.display = 'block'; // Torna visível para transição
            // Força reflow para garantir a transição
            this.notasElement.offsetHeight; 
            this.notasElement.style.bottom = '20px';
            this.notasElement.style.opacity = '1';
        } else {
            this.notasElement.style.bottom = '-300px'; // Esconde
            this.notasElement.style.opacity = '0';
            // Oculta completamente após a transição
            setTimeout(() => {
                if (!this.isVisible) { // Garante que não foi reaberto durante o timeout
                    this.notasElement.style.display = 'none';
                }
            }, 300); // 300ms = duração da transição
        }
    }

    render() {
        return this.notasElement;
    }

    _onMouseDown(e) {
        // Permite arrastar apenas se o alvo não for a área de texto
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'P' || e.target.tagName === 'H4') {
            return;
        }
        e.preventDefault();
        this.isDragging = true;
        this.offsetX = e.clientX - this.notasElement.offsetLeft;
        this.offsetY = e.clientY - this.notasElement.offsetTop;
        this.notasElement.style.cursor = 'grabbing';
    }

    _onMouseMove(e) {
        if (this.isDragging) {
            const x = e.clientX - this.offsetX;
            const y = e.clientY - this.offsetY;
            // Garante que a nota não saia muito da tela (opcional)
            this.notasElement.style.left = `${Math.max(0, Math.min(window.innerWidth - this.notasElement.offsetWidth, x))}px`;
            this.notasElement.style.top = `${Math.max(0, Math.min(window.innerHeight - this.notasElement.offsetHeight, y))}px`;
        }
    }

    _onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.notasElement.style.cursor = 'grab';
        }
    }

    destroy() {
        this._saveContent(); // Salva antes de destruir

        // Remove todos os event listeners
        document.removeEventListener('mousemove', this.boundOnMouseMove);
        document.removeEventListener('mouseup', this.boundOnMouseUp);
        this.toggleButton.removeEventListener('click', this.boundToggle);
        this.notasElement.removeEventListener('mousedown', this.boundOnMouseDown);
        this.notasContent.removeEventListener('mousedown', this.boundStopPropagation);
        if (this.textarea) {
            this.textarea.removeEventListener('input', this.boundSaveContent);
        }

        // Remove o elemento do DOM
        if (this.notasElement.parentNode) {
            this.notasElement.parentNode.removeChild(this.notasElement);
        }
    }
}