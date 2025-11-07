/**
 * renderHomeView - Busca e renderiza a lista de cursos.
 * @returns {Promise<HTMLElement>} - O elemento HTML com a lista de cursos.
 */
async function renderHomeView() {
    const viewElement = document.createElement('div');
    viewElement.className = 'home-view';
    viewElement.innerHTML = '<h1>Cursos</h1>';

    const bannerContainer = document.createElement('section');
    bannerContainer.className = 'container';
    viewElement.appendChild(bannerContainer);

    const courseListContainer = document.createElement('div');
    courseListContainer.className = 'container';
    viewElement.appendChild(courseListContainer);

    try {
        const courses = await apiService.getCourseIndex();
        if (courses.length === 0) {
            courseListContainer.innerHTML = '<p>Nenhum curso disponível no momento.</p>';
        } else {
            courses.forEach(course => {
                if (course.id === 'banner-cursos') {
                    const bannerElement = document.createElement('article');
                    bannerElement.className = 'item banner-item'; // The banner is an item in its own container
                    bannerElement.innerHTML = `
                        <picture>
                            <source media="(min-width: 1024px)" srcset="${course.image.desktop}">
                            <source media="(min-width: 600px)" srcset="${course.image.tablet}">
                            <img src="${course.image.mobile}" alt="${course.image.caption}" style="width:100%;">
                        </picture>
                    `;
                    bannerContainer.appendChild(bannerElement);
                } else {
                    courseListContainer.appendChild(course.render());
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar e renderizar cursos:', error);
        courseListContainer.innerHTML = '<p>Ocorreu um erro ao carregar os cursos.</p>';
    }

    return viewElement;
}
