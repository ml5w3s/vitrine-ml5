/**
 * renderCourseView - Renderiza a página de detalhes de um curso.
 * @param {Course} course - O objeto do curso a ser renderizado.
 * @returns {HTMLElement} - O elemento HTML com os detalhes do curso e suas aulas.
 */
const bannerConfig = {
    'default': {
        type: 'cursos',
        alt: 'Banner Cursos'
    },
    'jquery': {
        type: 'legado',
        alt: 'Banner Legado'
    },
    'frontend': {
        type: 'frontend',
        alt: 'Banner Frontend'
    }
};
function renderCourseView(course) {
    const viewElement = document.createElement('div');
    viewElement.className = 'course-detail-view';

    let lessonsHtml = '<h2>Aulas</h2><ul class="lesson-list">';
    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach(lesson => {
            lessonsHtml += `<li><a href="#/course/${course.id}/lesson/${lesson.id}">${lesson.title}</a></li>`;
        });
    } else {
        lessonsHtml += '<li>Nenhuma aula disponível para este curso.</li>';
    }
    lessonsHtml += '</ul>';

    const config = bannerConfig[course.id] || bannerConfig['default'];
    let bannerHtml = `
        <section class="container">
            <article class="item banner-item">
                <picture>
                    <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_${config.type}_desktop.png">
                    <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_${config.type}_tablet.png">
                    <img src="/vitrine-ml5/mlab5/src/assets/images/banner_${config.type}_mobile.png" alt="${config.alt}" style="width:100%;">
                </picture>
            </article>
        </section>
    `;

    viewElement.innerHTML = `
        ${bannerHtml}
        <a href="#/">&larr; Voltar para a lista de cursos</a>
        <div class="card">
            <header>
                <div class="card-body">
                    <h2>${course.title}</h2>
                    <p>${course.description}</p>
                </div>
            </header>
            <section>
                <div class="card-body">
                    ${lessonsHtml}
                </div>
            </section>
        </div>
    `;

    return viewElement;
}
