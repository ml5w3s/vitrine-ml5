// mlab5/app.js

// 1. Importar módulos necessários (inicialmente, podem ser stubs ou arquivos vazios)
//    Assumimos que estes arquivos estarão em mlab5/src/js/utils/ e mlab5/src/js/router/
import EventBus from './src/js/utils/EventBus.js';
import Router from './src/js/router/Router.js';
import Debug from './src/js/utils/Debug.js'; // Importar também o Debug para logs

// 2. Inicializar serviços centrais
const eventBus = new EventBus();
// O Router pode precisar do eventBus para publicar mudanças de rota
const router = new Router(eventBus); 

// 3. Obter o elemento raiz da aplicação
const appRoot = document.getElementById('app-root');

// 4. Definir uma função de renderização inicial simples
function renderInitialView() {
    if (appRoot) {
        appRoot.innerHTML = `
            <h1>Bem-vindo ao mlab5!</h1>
            <p>Aplicação carregada com sucesso.</p>
            <p>Navegue para <a href="#/home">Home</a> ou <a href="#/courses">Cursos</a>.</p>
            <p>Verifique o console para logs de depuração.</p>
        `;
        Debug.log('App', 'Initial view rendered.');
    } else {
        console.error('Element with id "app-root" not found!');
    }
}

// 5. Adicionar um log básico para confirmar que app.js está carregando
Debug.log('App', 'mlab5 application starting...');

// 6. Chamar a função de renderização inicial quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    renderInitialView();
    // Inicializar o router após a renderização inicial
    // Assumimos que o router tem um método init para começar a escutar mudanças de hash
    router.init(); 
    Debug.log('App', 'Application initialized and router started.');
});

// Para fins de teste, você pode expor alguns globais temporariamente
window.eventBus = eventBus;
window.router = router;
window.Debug = Debug;
