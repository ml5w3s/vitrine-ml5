
import { courseRepository } from '../repositories/CourseRepository.js';

function loadCss(filename) {
    const link = document.createElement('link');
    link.href = filename;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return link;
}

/**
 * renderHomeView - Busca e renderiza a lista de cursos.
 * @returns {Promise<HTMLElement>} - O elemento HTML com a lista de cursos.
 */
export async function renderHomeView(router) {
    loadCss('/vitrine-ml5/mlab5/src/views/home-view.css'); // Load view-specific CSS

    const viewElement = document.createElement('div');
    viewElement.className = 'home-view';
    
    const courseListContainer = document.createElement('div');
    courseListContainer.className = 'container';
    viewElement.appendChild(courseListContainer);

    try {
        const courses = await courseRepository.getCourseIndex();
        if (courses.length === 0) {
            courseListContainer.innerHTML = '<p>Nenhum curso disponível no momento.</p>';
        } else {
            const bannerCourse = courses.find(course => course.id === 'banner-cursos');
            if (bannerCourse) {
                const bannerContainer = document.createElement('section');
                bannerContainer.className = 'container';
                const bannerElement = document.createElement('article');
                bannerElement.className = 'item banner-item';
                bannerElement.innerHTML = `
                    <picture>
                        <source media="(min-width: 1024px)" srcset="${bannerCourse.image.desktop}">
                        <source media="(min-width: 600px)" srcset="${bannerCourse.image.tablet}">
                        <img src="${bannerCourse.image.mobile}" alt="${bannerCourse.image.caption}" style="width:100%;">
                    </picture>
                `;
                bannerContainer.appendChild(bannerElement);
                viewElement.prepend(bannerContainer); // Prepend to ensure it's at the very top
            }

            courses.forEach(course => {
                if (course.id !== 'banner-cursos') {
                    courseListContainer.appendChild(course.render(router));
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar e renderizar cursos:', error);
        courseListContainer.innerHTML = '<p>Ocorreu um erro ao carregar os cursos.</p>';
    }

    return viewElement;
}

