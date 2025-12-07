/**
 * Representa um curso, que é uma coleção de aulas.
 */
export class Course {
    /**
     * @param {string} id - O identificador único do curso.
     * @param {string} title - O título do curso.
     * @param {string} description - A descrição do curso.
     * @param {Lesson[]} lessons - Uma lista de objetos da classe Lesson.
     */
    constructor(id, title, description, lessons = [], image = null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lessons = lessons;
        this.image = image;
    }

    /**
     * Adiciona uma aula à lista de aulas do curso.
     * @param {Lesson} lesson - O objeto da aula a ser adicionado.
     */
    addLesson(lesson) {
        if (lesson instanceof Lesson) {
            this.lessons.push(lesson);
        } else {
            console.error("O objeto fornecido não é uma instância da classe Lesson.");
        }
    }

    /**
     * Renderiza a visualização geral do curso.
     * @returns {HTMLElement} - O elemento HTML que representa o curso.
     */
    render(router) {
        const courseElement = document.createElement('article');
        courseElement.className = 'course-overview item';

        let imageHtml = '';
        if (this.image) {
            imageHtml = `
                <picture>
                    <source media="(min-width: 1024px)" srcset="${this.image.desktop}">
                    <source media="(min-width: 600px)" srcset="${this.image.tablet}">
                    <img src="${this.image.mobile}" alt="${this.image.caption}" style="width:100%;">
                </picture>
            `;
        }

        const courseUrl = router.generateUrl('courseDetail', { courseId: this.id });
        courseElement.innerHTML = `
            ${imageHtml}
            <h2 class="course-title">${this.title}</h2>
            <p class="course-description">${this.description}</p>
            <a href="${courseUrl}">Ver Curso</a>
        `;
        return courseElement;
    }
}
 