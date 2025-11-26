import Router from './router/Router.js';
import { defineRoutes } from './routes.js';
import { Debug } from './helpers/Debug.js';
import EventBus from './utils/EventBus.js';


async function loadComponent(placeholderId, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
    document.getElementById(placeholderId).innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  let lousaContainer = null;

  // Carrega componentes estáticos (header/footer)
  loadComponent('header-placeholder', 'src/js/ui/components/header.html')
    .then(() => {
      // Garante que o script da navbar seja carregado após o header
      const script = document.createElement('script');
      script.src = 'src/js/ui/components/navbar.js';
      document.body.appendChild(script);
    });

  loadComponent('footer-placeholder', 'src/js/ui/components/footer.html')
    .then(() => {
        const notasToggleButton = document.getElementById('notas-toggle-button');
        if (notasToggleButton) {
            notasToggleButton.addEventListener('click', toggleLousa);
        }
    });

    // Carrega o componente Lousa
  loadComponent('lousa-container', 'src/js/components/lousa/index.html')
    .then(() => {
      lousaContainer = document.getElementById('lousa-container');
      if (lousaContainer) {
        lousaContainer.style.display = 'none'; // Inicialmente oculta a lousa
      }

      const lousaToggleButton = document.getElementById('lousa-toggle-button');
      if (lousaToggleButton) {
        lousaToggleButton.addEventListener('click', toggleLousa);
      }
    });

  const toggleLousa = () => {
    if (lousaContainer) {
      if (lousaContainer.style.display === 'none') {
        lousaContainer.style.display = 'block';
      } else {
        lousaContainer.style.display = 'none';
      }
    }
  };

  // Instancia o EventBus e o Roteador
  const eventBus = new EventBus();
  const router = new Router(eventBus);

  // Define as rotas
  defineRoutes(router);
  
  // Inicializa o roteador
  router.init();
});
  