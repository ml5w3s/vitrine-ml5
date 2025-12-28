
import { courseRepository } from '../repositories/CourseRepository.js';
import { NotebookComponent } from '../components/NotebookComponent.js';

/**
 * renderNotebookView - Renderiza a página do Notebook para uma aula específica.
 * @param {string} courseId - O ID do curso.
 * @param {string} lessonId - O ID da aula.
 * @returns {Promise<HTMLElement>} - O elemento HTML com o Notebook.
 */
export async function renderNotebookView(courseId, lessonId) {
    const viewElement = document.createElement('div');
    viewElement.className = 'notebook-view item';
    viewElement.innerHTML = `<h2>Carregando Notebook...</h2>`;

    try {
        const lesson = await courseRepository.getLessonById(courseId, lessonId);
        if (lesson) {
            viewElement.innerHTML = ''; // Limpa o "Carregando..."
            new NotebookComponent(viewElement, lesson);
        } else {
            viewElement.innerHTML = '<h2>Notebook não disponível ou aula não encontrada.</h2>';
        }
    } catch (error) {
        console.error('Erro ao carregar Notebook:', error);
        viewElement.innerHTML = '<p>Ocorreu um erro ao carregar o Notebook.</p>';
    }

    return viewElement;
}
