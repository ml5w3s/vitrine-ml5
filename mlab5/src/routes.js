// mlab5/src/js/routes.js
import { courseRepository } from './repositories/CourseRepository.js';
import { renderHomeView } from './views/HomeView.js';
import { renderCourseView } from './views/CourseView.js';
import { renderLessonCreatorView } from './views/LessonCreatorView.js';
import { renderPlaygroundView } from './views/PlaygroundView.js';
import { renderLousaView } from './views/LousaView.js';
import { renderAdmView } from './views/AdmView.js';

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

    // Handler para a área administrativa
    router.addRoute('adm', '/adm', async (params) => {
        managePlaygroundButton(null);
        return await renderAdmView(router);
    });

    router.addRoute('adm-cadastro-aulas', '/adm/cadastro-aulas', async (params) => {
        managePlaygroundButton(null);
        return await renderAdmView(router);
    });
}
