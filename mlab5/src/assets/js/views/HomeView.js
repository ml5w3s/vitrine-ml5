/**
 * renderHomeView - Busca e renderiza a lista de cursos.
 * @returns {Promise<HTMLElement>} - O elemento HTML com a lista de cursos.
 */
async function renderHomeView() {
    const viewElement = document.createElement('div');
    viewElement.className = 'home-view';
    viewElement.innerHTML = '<h1>Cursos</h1>';

    // Hardcoded frontend banner
    const frontendBannerContainer = document.createElement('section');
    frontendBannerContainer.className = 'container';
    const frontendBannerElement = document.createElement('article');
    frontendBannerElement.className = 'item banner-item';
    frontendBannerElement.innerHTML = `
        <picture>
            <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_frontend_desktop.png">
            <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_frontend_tablet.png">
            <img src="/vitrine-ml5/mlab5/src/assets/images/banner_frontend_mobile.png" alt="Banner Frontend" style="width:100%;">
        </picture>
    `;
    frontendBannerContainer.appendChild(frontendBannerElement);
    viewElement.appendChild(frontendBannerContainer);

    const courseListContainer = document.createElement('div');
    courseListContainer.className = 'container';
    viewElement.appendChild(courseListContainer);

    try {
        const courses = await apiService.getCourseIndex();
        if (courses.length === 0) {
            courseListContainer.innerHTML = '<p>Nenhum curso disponível no momento.</p>';
        } else {
            courses.forEach(course => {
                // Only render courses, skip the banner-cursos entry if it exists
                if (course.id !== 'banner-cursos') {
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
