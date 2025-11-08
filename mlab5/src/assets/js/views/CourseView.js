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
            lessonsHtml += `<li><img src="/vitrine-ml5/mlab5/src/assets/images/cursos/${course.id}_mobile.jpg"><a href="#/course/${course.id}/lesson/${lesson.id}">${lesson.title}</a></li>`;
        });
    } else {
        lessonsHtml += '<li>Nenhuma aula disponível para este curso.</li>';
    }
    lessonsHtml += '</ul>';

    let bannerHtml;
    if (course.id === 'jquery') {
        bannerHtml = `
            <section class="container">
                <article class="item banner-item">
                    <picture>
                        <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_legado_desktop.png">
                        <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_legado_tablet.png">
                        <img src="/vitrine-ml5/mlab5/src/assets/images/banner_legado_mobile.png" alt="Banner Legado" style="width:100%;">
                    </picture>
                </article>
            </section>
        `;
    } else {
        bannerHtml = `
            <section class="container">
                <article class="item banner-item">
                    <picture>
                        <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_frontend_desktop.png">
                        <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_frontend_tablet.png">
                        <img src="/vitrine-ml5/mlab5/src/assets/images/banner_frontend_mobile.png" alt="Banner Frontend" style="width:100%;">
                    </picture>
                </article>
            </section>
        `;
    }

    viewElement.innerHTML = `
        ${bannerHtml}
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
