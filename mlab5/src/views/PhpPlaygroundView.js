import { PhpPlayground } from '../components/PhpPlayground.js';

export function renderPhpPlaygroundView() {
    const viewElement = document.createElement('div');
    viewElement.style.padding = '20px';
    viewElement.style.maxWidth = '1000px';
    viewElement.style.margin = '0 auto';

    const title = document.createElement('h2');
    title.textContent = 'Interpretador PHP (Experimental)';
    title.style.marginBottom = '20px';
    viewElement.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = 'Este playground roda PHP diretamente no seu navegador usando WebAssembly. Nenhuma informação é enviada para servidores.';
    desc.style.marginBottom = '20px';
    viewElement.appendChild(desc);

    const container = document.createElement('div');
    viewElement.appendChild(container);

    // Instancia o playground
    new PhpPlayground(container);

    return viewElement;
}
