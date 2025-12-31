import { LivroMestre } from '../components/LivroMestre.js';

export function renderLivroMestreView() {
    const viewElement = document.createElement('div');
    viewElement.classList.add('livro-mestre-view');
    viewElement.style.maxWidth = '1200px';
    viewElement.style.margin = '0 auto';
    viewElement.style.padding = '20px';

    const livroMestre = new LivroMestre(viewElement);
    // LivroMestre logic is self-contained in its init() and subsequent methods.

    return viewElement;
}
