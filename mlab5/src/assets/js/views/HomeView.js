/**
 * renderHomeView - Busca e renderiza a lista de cursos.
 * @returns {Promise<HTMLElement>} - O elemento HTML com a lista de cursos.
 */
async function renderHomeView() {
    const viewElement = document.createElement('div');
    viewElement.className = 'home-view';
    viewElement.innerHTML = '<h1>Cursos</h1>';

    const courseListContainer = document.createElement('div');
    viewElement.appendChild(courseListContainer);

    try {
        const courses = await apiService.getCourseIndex();
        if (courses.length === 0) {
            courseListContainer.innerHTML = '<p>Nenhum curso disponível no momento.</p>';
        } else {
            courses.forEach(course => {
                courseListContainer.appendChild(course.render());
            });
        }
    } catch (error) {
        console.error('Erro ao carregar e renderizar cursos:', error);
        courseListContainer.innerHTML = '<p>Ocorreu um erro ao carregar os cursos.</p>';
    }

    return viewElement;
}
