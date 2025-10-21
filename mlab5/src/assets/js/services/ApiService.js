/**
 * ApiService - Singleton para gerenciar a comunicação com a fonte de dados (API, arquivos JSON).
 *
 * Este serviço será responsável por buscar dados de cursos, aulas, etc.,
 * e transformá-los em instâncias das classes do nosso modelo (Course, Lesson).
 */
class ApiService {
    constructor() {
        if (ApiService.instance) {
            return ApiService.instance;
        }
        ApiService.instance = this;
        // A URL base aponta para a pasta de dados na raiz do projeto mlab5.
        this.baseUrl = './data';
    }

    /**
     * Busca o índice de cursos.
     * Assume que existe um arquivo 'courses.json' na baseUrl.
     * @returns {Promise<Course[]>} Uma promessa que resolve para uma lista de instâncias de Course.
     */
    async getCourseIndex() {
        try {
            const response = await fetch(`${this.baseUrl}/courses.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const coursesData = await response.json();

            // Mapeia os dados brutos para instâncias da classe Course
            // É importante que as classes Lesson e Course já estejam carregadas no escopo global
            // ou importadas caso esteja usando módulos JS.
            return coursesData.map(courseData => {
                const lessons = courseData.lessons.map(lessonData => new Lesson(lessonData.id, lessonData.title, lessonData.content, lessonData.type));
                return new Course(courseData.id, courseData.title, courseData.description, lessons);
            });
        } catch (error) {
            console.error("Falha ao buscar o índice de cursos:", error);
            return []; // Retorna uma lista vazia em caso de erro
        }
    }

    /**
     * Busca um curso específico pelo seu ID.
     * @param {string} courseId O ID do curso a ser buscado.
     * @returns {Promise<Course|null>}
     */
    async getCourseById(courseId) {
        console.log(`Buscando curso com ID: ${courseId}`);
        const allCourses = await this.getCourseIndex();
        return allCourses.find(course => course.id === courseId) || null;
    }

    /**
     * Busca uma aula específica pelo ID do curso e ID da aula. 
     * @param {string} courseId O ID do curso ao qual a aula pertence.
     * @param {string} lessonId O ID da aula a ser buscada.
     * @returns {Promise<Lesson|null>} Uma promessa que resolve para uma instância de Lesson ou null.
     */
    async getLessonById(courseId, lessonId) {
        console.log(`Buscando aula ${lessonId} no curso ${courseId}...`);
        const course = await this.getCourseById(courseId);
        if (course && course.lessons) {
            return course.lessons.find(lesson => lesson.id === lessonId) || null;
        }
        return null;
    }
}

// Exporta a instância única do serviço para ser usada em toda a aplicação.
const apiService = new ApiService();
