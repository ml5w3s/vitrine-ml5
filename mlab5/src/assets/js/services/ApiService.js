/**
 * ApiService - Singleton para gerenciar a comunicação com a fonte de dados (arquivos JSON).
 *
 * Este serviço é responsável por buscar dados de cursos e aulas.
 */
class ApiService {
    constructor() {
        if (ApiService.instance) {
            return ApiService.instance;
        }
        ApiService.instance = this;
        this.baseUrl = './data';
    }

    /**
     * Busca o índice de cursos do arquivo courses.json gerado automaticamente.
     * @returns {Promise<Course[]>} Uma promessa que resolve para um array de instâncias de Course.
     */
    async getCourseIndex() {
        Debug.log('ApiService', 'Buscando índice de cursos...');
        try {
            const response = await fetch(`${this.baseUrl}/courses.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const courseIndexData = await response.json();
            Debug.table('ApiService', 'Índice de Cursos Recebido', courseIndexData);

            if (courseIndexData && Array.isArray(courseIndexData)) {
                return courseIndexData.map(meta => new Course(meta.id, meta.title, meta.description, [], meta.image));
            }
            return [];

        } catch (error) {
            Debug.error('ApiService', 'Falha ao buscar o índice de cursos:', error);
            return [];
        }
    }

    /**
     * Busca um curso específico pelo seu ID, incluindo todas as suas aulas.
     * @param {string} courseId O ID do curso a ser buscado.
     * @returns {Promise<Course|null>}
     */
    async getCourseById(courseId) {
        Debug.log('ApiService', `Buscando curso completo com ID: ${courseId}`);
        Debug.updateView('Curso', courseId);

        try {
            const courseIndexData = await this._fetchJson(`${this.baseUrl}/courses.json`);
            const courseMeta = courseIndexData.find(c => c.id === courseId);

            if (!courseMeta) {
                throw new Error(`Curso com id '${courseId}' não encontrado no índice.`);
            }

            const lessonsData = await this._fetchJson(`${this.baseUrl}/${courseId}/aulas.json`);
            Debug.log('ApiService', `Dados das aulas para o curso '${courseId}' recebidos.`, lessonsData);

            const lessons = lessonsData.map((lessonWrapper, index) => {
                const lessonContent = lessonWrapper.course; // O conteúdo real está dentro da chave "course"
                const lessonId = String(index + 1).padStart(2, '0'); // Gera IDs como '01', '02', etc.
                const lessonTitle = lessonContent.name;
                
                // Determina o tipo da aula (ex: 'playground')
                const lessonType = lessonContent.playground ? 'playground' : 'default';

                // O `content` da aula deve ser o objeto que contém a chave "course",
                // para ser consistente com o que PlaygroundComponent e Lesson.render() esperam.
                return new Lesson(lessonId, lessonTitle, lessonWrapper, lessonType);
            });

            const course = new Course(courseMeta.id, courseMeta.title, courseMeta.description, lessons);
            Debug.log('ApiService', `Curso '${courseId}' montado com sucesso.`, course);
            return course;

        } catch (error) {
            Debug.error('ApiService', `Falha ao buscar ou processar o curso '${courseId}':`, error);
            return null;
        }
    }

    /**
     * Busca uma aula específica pelo ID do curso e ID da aula.
     * @param {string} courseId O ID do curso ao qual a aula pertence.
     * @param {string} lessonId O ID da aula a ser buscada.
     * @returns {Promise<Lesson|null>}
     */
    async getLessonById(courseId, lessonId) {
        Debug.log('ApiService', `Buscando aula ${lessonId} no curso ${courseId}...`);
        Debug.updateView('Aula', lessonId);

        try {
            const course = await this.getCourseById(courseId);
            if (course && course.lessons) {
                const lesson = course.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    Debug.log('ApiService', `Aula ${lessonId} encontrada.`, lesson);
                } else {
                    throw new Error(`Aula com id '${lessonId}' não encontrada no curso '${courseId}'.`);
                }
                return lesson;
            }
            return null;
        } catch (error) {
            Debug.error('ApiService', `Erro ao buscar a aula ${lessonId}:`, error);
            return null;
        }
    }

    /**
     * Função auxiliar para buscar e parsear JSON com tratamento de erro.
     * @param {string} url A URL do JSON a ser buscado.
     * @returns {Promise<any>}
     */
    async _fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha na requisição para ${url} - Status: ${response.status}`);
        }
        return response.json();
    }
}

// Exporta a instância única do serviço para ser usada em toda a aplicação.
const apiService = new ApiService();