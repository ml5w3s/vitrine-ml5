// Em src/assets/js/components/NotasComponent.js

class NotasComponent {
    constructor() {
        this.isVisible = false;
        this.notasElement = document.createElement('div');
        this.notasElement.className = 'notas-container';
        this.notasElement.style.display = 'none'; // Começa oculto

        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'notas-toggle-button';
        this.toggleButton.textContent = 'Notas';
        this.toggleButton.addEventListener('click', () => this.toggle());

        this.notasContent = document.createElement('div');
        this.notasContent.className = 'notas-content';
        this.notasContent.innerHTML = `
            <h4>Notas</h4>
            <p>Anote aqui seus pensamentos...</p>
            <textarea style="width: 90%; height: 60%;"></textarea>
        `;

        this.notasElement.appendChild(this.toggleButton);
        this.notasElement.appendChild(this.notasContent);
    }


    toggle() {
        this.isVisible = !this.isVisible;
        this.notasElement.style.display = this.isVisible ? 'flex' : 'none';
        this.toggleButton.textContent = this.isVisible ? 'Fechar Notas' : 'Notas';
    }

    render() {
        return this.notasElement;
    }
}