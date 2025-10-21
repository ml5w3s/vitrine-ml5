/**
 * Representa um curso, que é uma coleção de aulas.
 */
class Course {
    /**
     * @param {string} id - O identificador único do curso.
     * @param {string} title - O título do curso.
     * @param {string} description - A descrição do curso.
     * @param {Lesson[]} lessons - Uma lista de objetos da classe Lesson.
     */
    constructor(id, title, description, lessons = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lessons = lessons;
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
    render() {
        const courseElement = document.createElement('article');
        courseElement.className = 'course-overview';
        courseElement.innerHTML = `
            <h2 class="course-title">${this.title}</h2>
            <p class="course-description">${this.description}</p>
            <a href="#/course/${this.id}">Ver Curso</a>
        `;
        return courseElement;
    }
}
