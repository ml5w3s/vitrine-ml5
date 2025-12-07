
import { courseRepository } from '../repositories/CourseRepository.js';
import { PlaygroundComponent } from '../components/PlaygroundComponent.js';

/**
 * renderPlaygroundView - Renderiza a página do Playground para uma aula específica.
 * @param {string} courseId - O ID do curso.
 * @param {string} lessonId - O ID da aula.
 * @returns {Promise<HTMLElement>} - O elemento HTML com o Playground.
 */
export async function renderPlaygroundView(courseId, lessonId) {
    const viewElement = document.createElement('div');
    viewElement.className = 'playground-view item';
    viewElement.innerHTML = `<h2>Carregando Playground...</h2>`;

    try {
        const lesson = await courseRepository.getLessonById(courseId, lessonId);
        if (lesson && typeof PlaygroundComponent !== 'undefined') {
            viewElement.innerHTML = ''; // Limpa o "Carregando..."
            new PlaygroundComponent(viewElement, lesson);
        } else {
            viewElement.innerHTML = '<h2>Playground não disponível ou aula não encontrada.</h2>';
            if (typeof PlaygroundComponent === 'undefined') {
                console.error("PlaygroundComponent não está disponível.");
            }
        }
    } catch (error) {
        console.error('Erro ao carregar Playground:', error);
        viewElement.innerHTML = '<p>Ocorreu um erro ao carregar o Playground.</p>';
    }

    return viewElement;
}

