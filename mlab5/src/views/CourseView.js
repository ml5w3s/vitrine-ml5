import { FloatingVideo } from '../components/FloatingVideo.js';

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
export function renderCourseView(course, router) {
    const viewElement = document.createElement('div');
    viewElement.className = 'course-detail-view';

    let lessonsHtml = '<h2>Aulas</h2><ul class="lesson-list">';
    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach(lesson => {
            const lessonUrl = router.generateUrl('lessonDetail', { courseId: course.id, lessonId: lesson.id });
            lessonsHtml += `<li><a href="${lessonUrl}">${lesson.title}</a></li>`;
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
                    <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/assets/images/banner_${config.type}_desktop.png">
                    <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/assets/images/banner_${config.type}_tablet.png">
                    <img src="/vitrine-ml5/mlab5/assets/images/banner_${config.type}_mobile.png" alt="${config.alt}" style="width:100%;">
                </picture>
            </article>
        </section>
    `;

    viewElement.innerHTML = `
        ${bannerHtml}
        <div class="card">
            <header>
                <div class="card-body">
                    <h2>${course.title}</h2>
                    <p>${course.description}</p>
                    ${(course.live && course.live.active) ? `
                        <button id="btn-live-enter" class="button-style" style="background-color: #e74c3c; border-color: #c0392b; animation: pulse 2s infinite;">
                            🔴 AO VIVO: ${course.live.title || 'Entrar na Sala'}
                        </button>
                        <style>
                            @keyframes pulse {
                                0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
                                70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
                            }
                        </style>
                    ` : ''}
                </div>
            </header>
            <section>
                <div class="card-body">
                    ${lessonsHtml}
                </div>
            </section>
        </div>
    `;

    // Attach event listener for the live button if it exists
    const liveBtn = viewElement.querySelector('#btn-live-enter');
    if (liveBtn) {
        liveBtn.addEventListener('click', () => {
            new FloatingVideo(course.live.videoId, course.live.title);
        });
    }

    return viewElement;
}
 