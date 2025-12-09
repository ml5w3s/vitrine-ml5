import { Debug } from '../helpers/Debug.js';
import { CadastroAulasController } from './adm/CadastroAulasController.js';

export class AdmComponent {
    constructor(router) {
        this.router = router;
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add('adm-component');
        this.subContentElement = document.createElement('div');
        this.subContentElement.id = 'adm-sub-content'; // Where sub-pages will be loaded
        this.containerElement.appendChild(this.subContentElement);
        Debug.log('AdmComponent', 'AdmComponent instantiated.');
    }

    async render() {
        const hash = window.location.hash;
        if (hash.startsWith('#/adm/cadastro-aulas')) {
            await this.renderSubContent('cadastro-aulas');
        } else {
            // Load the main admin menu content
            try {
                const response = await fetch('/vitrine-ml5/mlab5/src/components/adm/adm-cursos-content.html');
                if (!response.ok) throw new Error(`Error loading adm-cursos-content.html: ${response.statusText}`);
                this.containerElement.innerHTML = await response.text();
                // Re-append subContentElement after innerHTML overwrite
                const mainContentSection = this.containerElement.querySelector('.content-section');
                if (mainContentSection) {
                    mainContentSection.insertAdjacentElement('afterend', this.subContentElement);
                } else {
                    this.containerElement.appendChild(this.subContentElement);
                }
            } catch (error) {
                console.error("Error in AdmComponent rendering:", error);
                this.containerElement.innerHTML = `<p>Error loading admin menu: ${error.message}</p>`;
            }
        }

        this.addEventListeners();
        return this.containerElement;
    }

    async renderSubContent(subPath) {
        this.subContentElement.innerHTML = ''; // Clear previous content
        let htmlContent = '';
        let Controller = null;

        switch (subPath) {
            case 'cadastro-aulas':
                htmlContent = await this.fetchHtml('/vitrine-ml5/mlab5/src/components/adm/cadastro-aulas-content.html');
                Controller = CadastroAulasController;
                break;
            // Add other admin tools here
            default:
                this.subContentElement.innerHTML = '<p>Ferramenta administrativa não encontrada.</p>';
                return;
        }

        this.subContentElement.innerHTML = htmlContent;
        if (Controller) {
            this.currentSubController = new Controller(this.subContentElement);
        }
    }

    async fetchHtml(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error loading ${url}: ${response.statusText}`);
        return await response.text();
    }

    addEventListeners() {
        const cadastroAulasLink = this.containerElement.querySelector('#cadastro-aulas-link');
        if (cadastroAulasLink) {
            cadastroAulasLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.router.navigateTo('/adm/cadastro-aulas');
            });
        }
    }

    destroy() {
        if (this.currentSubController && typeof this.currentSubController.destroy === 'function') {
            this.currentSubController.destroy();
        }
        Debug.log('AdmComponent', 'AdmComponent destroyed.');
    }
}
