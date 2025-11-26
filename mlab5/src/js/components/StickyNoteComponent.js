// mlab5/src/js/components/StickyNoteComponent.js

export class StickyNoteComponent {
    constructor(container) {
        this.container = container; // O elemento onde a nota será adicionada
        this.noteElement = null;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this._createNote();
        this._setupEventListeners();
    }

    _createNote() {
        this.noteElement = document.createElement('div');
        this.noteElement.classList.add('sticky-note');
        this.noteElement.innerHTML = '<textarea placeholder="Escreva sua nota..."></textarea>';
        
        // Posiciona a nota inicialmente no centro do container visível
        const rect = this.container.getBoundingClientRect();
        this.noteElement.style.left = `${rect.width / 2 - 100}px`;
        this.noteElement.style.top = `${rect.height / 2 - 100}px`;

        this.container.appendChild(this.noteElement);
    }

    _setupEventListeners() {
        this.noteElement.addEventListener('mousedown', this._onMouseDown.bind(this));
        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
        
        // Impede que o mousedown na nota inicie o desenho no canvas
        this.noteElement.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    _onMouseDown(e) {
        this.isDragging = true;
        this.offsetX = e.clientX - this.noteElement.offsetLeft;
        this.offsetY = e.clientY - this.noteElement.offsetTop;
        this.noteElement.style.cursor = 'grabbing';
    }

    _onMouseMove(e) {
        if (this.isDragging) {
            // Garante que a nota não saia dos limites do container principal
            const x = e.clientX - this.offsetX;
            const y = e.clientY - this.offsetY;

            this.noteElement.style.left = `${x}px`;
            this.noteElement.style.top = `${y}px`;
        }
    }

    _onMouseUp() {
        this.isDragging = false;
        this.noteElement.style.cursor = 'grab';
    }

    // Método para destruir a nota e remover os listeners
    destroy() {
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
        if (this.noteElement.parentNode) {
            this.noteElement.parentNode.removeChild(this.noteElement);
        }
    }
}
