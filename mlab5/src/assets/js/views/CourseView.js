/**
 * renderCourseView - Renderiza a página de detalhes de um curso.
 * @param {Course} course - O objeto do curso a ser renderizado.
 * @returns {HTMLElement} - O elemento HTML com os detalhes do curso e suas aulas.
 */
function renderCourseView(course) {
    const viewElement = document.createElement('div');
    viewElement.className = 'course-detail-view';

    let lessonsHtml = '<h3>Aulas</h3><ul class="lesson-list">';
    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach(lesson => {
            lessonsHtml += `<li><a href="#/course/${course.id}/lesson/${lesson.id}">${lesson.title}</a></li>`;
        });
    } else {
        lessonsHtml += '<li>Nenhuma aula disponível para este curso.</li>';
    }
    lessonsHtml += '</ul>';

    viewElement.innerHTML = `
        <a href="#/">&larr; Voltar para a lista de cursos</a>
        <header>
            <h2>${course.title}</h2>
            <p>${course.description}</p>
        </header>
        <section>
            ${lessonsHtml}
        </section>
    `;

    return viewElement;
}
