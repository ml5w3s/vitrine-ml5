import Router from './router/Router.js';
import { defineRoutes } from './routes.js';
import { Debug } from './helpers/Debug.js';
import { DebugView } from './views/DebugView.js'; // Importar DebugView
import EventBus from './utils/EventBus.js';
import { NotasComponent } from './components/NotasComponent.js';
import { initOverflowManager } from './utils/OverflowManager.js';

// Instancia o NotasComponent globalmente para que seja acessível
const notasComponent = new NotasComponent();

async function loadComponent(placeholderId, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
    const componentHtml = await response.text();
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.innerHTML = componentHtml;

      // Extrair e executar scripts do componente carregado
      const scripts = placeholder.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Anexa o NotasComponent e o DebugView ao body assim que o DOM estiver pronto
  document.body.appendChild(notasComponent.render());
  const debugView = new DebugView(); // Instanciar DebugView

  // Adiciona o atalho Ctrl+M para o painel de debug
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'm') {
      e.preventDefault(); // Prevenir comportamento padrão do navegador
      debugView.toggleVisibility();
    }
  });

  // Carrega componentes estáticos (header/footer)
  loadComponent('header-placeholder', '/vitrine-ml5/mlab5/assets/ui/header.html')
    .then(() => {
      // O script da navbar agora está embutido no header.html e é executado automaticamente por loadComponent.
    });

  loadComponent('footer-placeholder', '/vitrine-ml5/mlab5/assets/ui/footer.html')
    .then(() => {
        // Conecta os botões do rodapé às suas funcionalidades
        const notasButton = document.getElementById('notas-button');
        if (notasButton) {
            notasButton.addEventListener('click', () => {
                notasComponent.toggle();
            });
        }

        const debugButton = document.getElementById('debug-button');
        if (debugButton) {
            debugButton.addEventListener('click', () => {
                debugView.toggleVisibility();
            });
        }
    });

  // Instancia o EventBus e o Roteador
  const eventBus = new EventBus();
  const router = new Router(eventBus);

  // Define as rotas
  defineRoutes(router);
  
  // Inicializa o roteador
  router.init();

  // Inicializa o OverflowManager
  initOverflowManager(eventBus);
});  