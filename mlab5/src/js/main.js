import { Router } from './routing/Router.js';
import { defineRoutes } from './routes.js';
import { DebugView } from './components/DebugView.js';
import { Debug } from './helpers/Debug.js';


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
  // Inicializa o painel de depuração
  new DebugView();

  let lousaContainer = null;

  const toggleLousa = () => {
    if (lousaContainer) {
      if (lousaContainer.style.display === 'none') {
        lousaContainer.style.display = 'block';
      } else {
        lousaContainer.style.display = 'none';
      }
    }
  };

  // Carrega componentes estáticos (header/footer)
  loadComponent('header-placeholder', 'src/js/ui/components/header.html')
    .then(() => {
      // Garante que o script da navbar seja carregado após o header
      const script = document.createElement('script');
      script.src = 'src/js/ui/components/navbar.js';
      document.body.appendChild(script);

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
    });
  loadComponent('footer-placeholder', 'src/js/ui/components/footer.html')
    .then(() => {
        const notasToggleButton = document.getElementById('notas-toggle-button');
        if (notasToggleButton) {
            notasToggleButton.addEventListener('click', toggleLousa);
        }
    });

  // Elemento raiz da aplicação
  const appRoot = document.getElementById('app-root');

  // Instancia o roteador
  const router = new Router(appRoot);

  // Define as rotas
  defineRoutes(router);
  
  // O router já tem listeners para 'load' e 'hashchange', 
  // mas chamamos aqui para garantir que a rota inicial seja processada após a definição das rotas.
  router.handleRouteChange();
});
