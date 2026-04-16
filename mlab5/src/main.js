import Router from './router/Router.js';
import { defineRoutes } from './routes.js';
import { Debug } from './helpers/Debug.js';
import { DebugView } from './views/DebugView.js'; // Importar DebugView
import EventBus from './utils/EventBus.js';
import { NotasComponent } from './components/NotasComponent.js';
import { initOverflowManager } from './utils/OverflowManager.js';
import { AuthService } from './services/AuthService.js';

// Instancia o NotasComponent globalmente para que seja acessível
const notasComponent = new NotasComponent();
let authService; // Variável global (neste escopo) para o serviço de autenticação

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
        newScript.type = 'module'; // Permite o uso de imports nos scripts dos componentes
        Array.from(oldScript.attributes).forEach(attr => {
          if (attr.name !== 'type') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        // Injetar o authService no escopo global do script se necessário, 
        // ou despachar um evento customizado para avisar que o componente carregou
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
      
      // Notificar que o componente foi carregado (útil para inicializar UI dependente)
      if (authService) {
          // Pequeno hack para re-bindar eventos de UI se necessário
          // Idealmente a UI ouviria o EventBus, mas como o HTML é injetado, 
          // precisamos garantir que os listeners sejam anexados.
          // Vamos emitir um evento global de DOM
          const event = new CustomEvent('component:loaded', { detail: { id: placeholderId } });
          document.dispatchEvent(event);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DEBUG ORIGIN: ", window.location.origin);
  // Instancia o EventBus
  const eventBus = new EventBus();
  
  // Inicializa o AuthService
  authService = new AuthService(eventBus);
  authService.init();

  // Disponibiliza o authService globalmente para ser acessado por componentes injetados via loadComponent (ex: header)
  window.mlab5Auth = authService; 

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
  loadComponent('header-placeholder', 'assets/ui/header.html')
    .then(() => {
      // O script da navbar agora está embutido no header.html e é executado automaticamente por loadComponent.
      // No entanto, precisamos garantir que a UI de login atualize se o usuário já estiver logado
      if (authService.isAuthenticated()) {
          eventBus.publish('auth:login', authService.getUser());
      }
    });

  loadComponent('footer-placeholder', 'assets/ui/footer.html')
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

  // Instancia o Roteador
  const router = new Router(eventBus);

  // Define as rotas
  defineRoutes(router);
  
  // Inicializa o roteador
  router.init();

  // Inicializa o OverflowManager
  initOverflowManager(eventBus);
});  