// mlab5/src/js/routes.js
import { courseRepository } from './repositories/CourseRepository.js';
import { renderHomeView } from './views/HomeView.js';
import { renderCourseView } from './views/CourseView.js';
import { renderLessonCreatorView } from './views/LessonCreatorView.js';
import { renderPlaygroundView } from './views/PlaygroundView.js';
import { renderNotebookView } from './views/NotebookView.js';
import { renderLousaView } from './views/LousaView.js';
import { renderAdmView } from './views/AdmView.js';
import { renderLivroMestreView } from './views/LivroMestreView.js';
import { renderPhpPlaygroundView } from './views/PhpPlaygroundView.js';
import { NotebookComponent } from './components/NotebookComponent.js';

/**
 * Gerencia o comportamento do botão do playground no rodapé.
 * @param {Lesson|null} lesson - O objeto da lição atual.
 */
function managePlaygroundButton(lesson) {
    const playgroundButton = document.getElementById('playground-button');
    if (!playgroundButton) return;

    playgroundButton.style.display = 'inline-block'; // Sempre visível

    const lessonData = lesson ? lesson.content.course : null;

    if (lessonData && lessonData.playground && lessonData.playground.url) {
        playgroundButton.onclick = () => {
            window.location.hash = lessonData.playground.url;
        };
    } else {
        // Comportamento padrão: se não houver aula específica, vai para um playground genérico
        // ou mantém o comportamento de ir para o último configurado se for o caso.
        // Aqui vamos definir para uma rota genérica se possível.
        playgroundButton.onclick = () => {
             // Tenta ir para o playground da aula atual se estivermos em uma aula
             const hash = window.location.hash;
             if (hash.includes('/course/') && hash.includes('/lesson/')) {
                 const match = hash.match(/\/course\/([^\/]+)\/lesson\/([^\/]+)/);
                 if (match) {
                     window.location.hash = `#/course/${match[1]}/lesson/${match[2]}/playground`;
                     return;
                 }
             }
             // Fallback para o primeiro curso/aula se nada for encontrado (ou apenas alerta)
             window.location.hash = '#/course/algoritmos-essenciais/lesson/01/playground';
        };
    }
}

// Em mlab5/src/js/routes.js
export function defineRoutes(router) {
    // Handler para a Home Page (lista de cursos)
    router.addRoute('home', '/', async () => {
        managePlaygroundButton(null);
        return renderHomeView(router);
    });

    // Handler para a página de detalhes do curso
    router.addRoute('courseDetail', '/course/:courseId', async (params) => {
        const { courseId } = params;
        managePlaygroundButton(null);
        const course = await courseRepository.getCourseById(courseId);
        if (course) {
            return renderCourseView(course, router);
        }
        const notFoundView = document.createElement('div');
        notFoundView.innerHTML = '<h2>Curso não encontrado</h2>';
        return notFoundView;
    });

    // Handler para a página de detalhes da aula
    router.addRoute('lessonDetail', '/course/:courseId/lesson/:lessonId', async (params) => {
        const { courseId, lessonId } = params;
        const lesson = await courseRepository.getLessonById(courseId, lessonId);
        if (lesson) {
            managePlaygroundButton(lesson);
            return lesson.render(); // Usa o método render da classe Lesson
        }
        managePlaygroundButton(null);
        const notFoundView = document.createElement('div');
        notFoundView.innerHTML = '<h2>Aula não encontrada</h2>';
        return notFoundView;
    });

    // Handler para o Criador de Aulas
    router.addRoute('lessonCreator', '/creator', () => {
        managePlaygroundButton(null);
        return renderLessonCreatorView();
    });

    // Handler para o Playground
    router.addRoute('playground', '/course/:courseId/lesson/:lessonId/playground', async (params) => {
        const { courseId, lessonId } = params;
        managePlaygroundButton(null);
        return renderPlaygroundView(courseId, lessonId);
    });

    // Handler para a Lousa
    router.addRoute('lousa', '/lousa', async () => {
        managePlaygroundButton(null);
        return renderLousaView();
    });

    // Handler para o Notebook (com lição específica)
    router.addRoute('lessonNotebook', '/course/:courseId/lesson/:lessonId/notebook', async (params) => {
        const { courseId, lessonId } = params;
        managePlaygroundButton(null);
        return renderNotebookView(courseId, lessonId);
    });

    // Handler para o Notebook genérico
    router.addRoute('notebook', '/notebook', () => {
        managePlaygroundButton(null);
        const viewElement = document.createElement('div');
        new NotebookComponent(viewElement);
        return viewElement;
    });

    // Handler para a área administrativa
    router.addRoute('adm', '/adm', async (params) => {
        managePlaygroundButton(null);
        return await renderAdmView(router);
    });

    router.addRoute('adm-cadastro-aulas', '/adm/cadastro-aulas', async (params) => {
        managePlaygroundButton(null);
        return await renderAdmView(router);
    });

    // Handler para o Livro Mestre (Livro do Professor)
    router.addRoute('livroMestre', '/livro-mestre', () => {
        managePlaygroundButton(null);
        return renderLivroMestreView();
    });

    // Handler para o Playground PHP
    router.addRoute('phpPlayground', '/php-playground', () => {
        managePlaygroundButton(null);
        return renderPhpPlaygroundView();
    });
}
