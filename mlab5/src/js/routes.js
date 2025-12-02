//js/routers.js
import { courseRepository } from './repositories/CourseRepository.js';
import { renderHomeView } from './views/HomeView.js';
import { renderCourseView } from './views/CourseView.js';
import { renderLessonCreatorView } from './views/LessonCreatorView.js';
import { renderPlaygroundView } from './views/PlaygroundView.js';
import { renderLousaView } from './views/LousaView.js';
import { renderNotasView } from './views/NotasView.js';

/**
 * Gerencia a visibilidade e o comportamento do botão do playground no rodapé.
 * @param {Lesson|null} lesson - O objeto da lição atual, ou null para ocultar o botão.
 */
function managePlaygroundButton(lesson) {
    const playgroundButton = document.getElementById('playground-button');
    if (!playgroundButton) return;

    const lessonData = lesson ? lesson.content.course : null;

    if (lessonData && lessonData.playground && lessonData.playground.url) {
        playgroundButton.style.display = 'block';
        playgroundButton.onclick = () => {
            window.location.hash = lessonData.playground.url;
        };
    } else {
        playgroundButton.style.display = 'none';
        playgroundButton.onclick = null;
    }
}


// Em mlab5/src//js/routes.js
export function defineRoutes(router) {
    const appRoot = document.getElementById('app-root');
    // Define a rota para a Home Page (lista de cursos)
    router.addRoute('home', '/', async () => {
        appRoot.innerHTML = 'Carregando cursos...';
        managePlaygroundButton(null);
        const homeView = await renderHomeView(router);
        appRoot.innerHTML = ''; // Limpa o 'Carregando'
        appRoot.appendChild(homeView);
    });

    // Define a rota para a página de detalhes do curso
    router.addRoute('courseDetail', '/course/:courseId', async (params) => {
        const { courseId } = params;
        appRoot.innerHTML = `Carregando curso ${courseId}...`;
        managePlaygroundButton(null);
        const course = await courseRepository.getCourseById(courseId);
        if (course) {
            const courseView = renderCourseView(course, router);
            appRoot.innerHTML = ''; // Limpa o 'Carregando'
            appRoot.appendChild(courseView);
        } else {
            appRoot.innerHTML = '<h2>Curso não encontrado</h2>';
        }
    });

    // Define a rota para a página de detalhes da aula
    router.addRoute('lessonDetail', '/course/:courseId/lesson/:lessonId', async (params) => {
        const { courseId, lessonId } = params;
        appRoot.innerHTML = `Carregando aula ${lessonId} do curso ${courseId}...`;
        const lesson = await courseRepository.getLessonById(courseId, lessonId);
        if (lesson) {
            managePlaygroundButton(lesson);
            const lessonView = lesson.render(); // Usa o método render da classe Lesson
            appRoot.innerHTML = ''; // Limpa o 'Carregando'
            appRoot.appendChild(lessonView);
        } else {
            appRoot.innerHTML = '<h2>Aula não encontrada</h2>';
            managePlaygroundButton(null);
        }
    });

    // Define a rota para o Criador de Aulas
    router.addRoute('lessonCreator', '/creator', async () => {
        appRoot.innerHTML = 'Carregando criador de aulas...'; 
        managePlaygroundButton(null);
        const creatorView = renderLessonCreatorView();
        appRoot.innerHTML = ''; // Limpa o 'Carregando'
        appRoot.appendChild(creatorView);
    });

    // Define a rota para o Playground
    router.addRoute('playground', '/course/:courseId/lesson/:lessonId/playground', async (params) => {
        const { courseId, lessonId } = params;
        appRoot.innerHTML = `Carregando Playground para aula ${lessonId} do curso ${courseId}...`;
        managePlaygroundButton(null);
        const playgroundView = await renderPlaygroundView(courseId, lessonId);
        appRoot.innerHTML = ''; // Limpa o 'Carregando'
        appRoot.appendChild(playgroundView);
    });

    router.addRoute('lousa', '/lousa', async () => {
        appRoot.innerHTML = 'Carregando Lousa...';
        managePlaygroundButton(null); // Oculta o botão do playground na página da lousa
        const lousaView = await renderLousaView();
        appRoot.innerHTML = '';
        appRoot.appendChild(lousaView);
    });

    // Define a rota para as Notas
    router.addRoute('notas', '/notas', async () => {
        appRoot.innerHTML = 'Carregando Notas...';
        managePlaygroundButton(null);
        const notasView = renderNotasView();
        appRoot.innerHTML = '';
        appRoot.appendChild(notasView);
    });
}
