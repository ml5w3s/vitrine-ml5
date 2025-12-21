
import { apiService } from '../services/ApiService.js';
import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { Debug } from '../helpers/Debug.js';

/**
 * CourseRepository - Singleton para gerenciar a lógica de negócios e a transformação de dados de cursos.
 *
 * Este repositório é responsável por consumir dados brutos do ApiService e transformá-los
 * em instâncias de modelos (Course, Lesson), aplicando a lógica de negócios necessária.
 */
class CourseRepository {
    constructor() {
        if (CourseRepository.instance) {
            return CourseRepository.instance;
        }
        CourseRepository.instance = this;
    }

    /**
     * Busca o índice de cursos e o transforma em um array de instâncias de Course.
     * @returns {Promise<Course[]>} Uma promessa que resolve para um array de instâncias de Course.
     */
    async getCourseIndex() {
        Debug.log('CourseRepository', 'Buscando e transformando o índice de cursos...');
        try {
            const courseIndexData = await apiService.fetchCourseIndex();
            Debug.table('CourseRepository', 'Índice de Cursos (Raw)', courseIndexData);

            if (courseIndexData && Array.isArray(courseIndexData)) {
                return courseIndexData.map(meta => new Course(meta.id, meta.title, meta.description, [], meta.image));
            }
            return [];

        } catch (error) {
            Debug.error('CourseRepository', 'Falha ao processar o índice de cursos:', error);
            return [];
        }
    }

    /**
     * Busca um curso específico pelo seu ID e o transforma em uma instância de Course com suas aulas.
     * @param {string} courseId O ID do curso a ser buscado.
     * @returns {Promise<Course|null>}
     */
    async getCourseById(courseId) {
        Debug.log('CourseRepository', `Processando dados para o curso com ID: ${courseId}`);
        try {
            const { courseMeta, lessonsData } = await apiService.fetchCourseData(courseId);

            if (!courseMeta) {
                throw new Error(`Metadados do curso com id '${courseId}' não encontrados.`);
            }

            Debug.log('CourseRepository', `Dados das aulas para o curso '${courseId}' (Raw).`, lessonsData);

            const lessons = lessonsData.map((lessonWrapper, index) => {
                const lessonContent = lessonWrapper.course;
                const lessonId = String(index + 1).padStart(2, '0');
                const lessonTitle = lessonContent.name;
                const lessonType = lessonContent.playground ? 'playground' : 'default';

                return new Lesson(lessonId, lessonTitle, lessonWrapper, lessonType);
            });

            const course = new Course(courseMeta.id, courseMeta.title, courseMeta.description, lessons, courseMeta.image);
            Debug.log('CourseRepository', `Curso '${courseId}' montado com sucesso.`, course);
            return course;

        } catch (error) {
            Debug.error('CourseRepository', `Falha ao montar o curso '${courseId}':`, error);
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
        Debug.log('CourseRepository', `Buscando aula ${lessonId} no curso ${courseId}...`);
        try {
            const course = await this.getCourseById(courseId);
            if (course && course.lessons) {
                const lesson = course.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    Debug.log('CourseRepository', `Aula ${lessonId} encontrada.`, lesson);
                } else {
                    throw new Error(`Aula com id '${lessonId}' não encontrada no curso '${courseId}'.`);
                }
                return lesson;
            }
            return null;
        } catch (error) {
            Debug.error('CourseRepository', `Erro ao buscar a aula ${lessonId}:`, error);
            return null;
        }
    }

    /**
     * Pesquisa lições em todos os cursos.
     * @param {string} query O termo de busca.
     * @returns {Promise<Array<{courseId: string, lessonId: string, title: string, courseTitle: string}>>}
     */
    async searchLessons(query) {
        if (!query || query.trim().length < 2) return [];
        
        const normalizedQuery = query.toLowerCase().trim();
        
        if (!this._lessonIndex) {
            await this._buildLessonIndex();
        }

        return this._lessonIndex.filter(lesson => 
            lesson.title.toLowerCase().includes(normalizedQuery) ||
            lesson.courseTitle.toLowerCase().includes(normalizedQuery)
        );
    }

    /**
     * Constrói um índice em memória de todas as lições de todos os cursos.
     * @private
     */
    async _buildLessonIndex() {
        Debug.log('CourseRepository', 'Construindo índice de busca de aulas...');
        const index = [];
        try {
            const coursesMeta = await this.getCourseIndex();
            for (const meta of coursesMeta) {
                if (meta.id === 'banner-cursos') continue;
                const course = await this.getCourseById(meta.id);
                if (course && course.lessons) {
                    course.lessons.forEach(lesson => {
                        index.push({
                            courseId: course.id,
                            lessonId: lesson.id,
                            title: lesson.title,
                            courseTitle: course.title
                        });
                    });
                }
            }
            this._lessonIndex = index;
            Debug.log('CourseRepository', `Índice de busca construído com ${index.length} aulas.`);
        } catch (error) {
            Debug.error('CourseRepository', 'Erro ao construir índice de busca:', error);
        }
    }
}

// Exporta a instância única do repositório.
export const courseRepository = new CourseRepository();
 