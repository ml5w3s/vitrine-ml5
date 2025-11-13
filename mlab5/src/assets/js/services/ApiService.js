
import { Debug } from '../helpers/Debug.js';

/**
 * ApiService - Singleton para gerenciar a comunicação com a fonte de dados (arquivos JSON).
 *
 * Este serviço é responsável APENAS por buscar (fetch) os dados brutos.
 * A transformação e a lógica de negócios são tratadas pelo CourseRepository.
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
     * Busca o índice de cursos do arquivo courses.json.
     * @returns {Promise<object[]>} Uma promessa que resolve para o array de metadados de cursos.
     */
    async fetchCourseIndex() {
        Debug.log('ApiService', 'Buscando índice de cursos (raw)...');
        try {
            const courseIndexData = await this._fetchJson(`${this.baseUrl}/courses.json`);
            Debug.table('ApiService', 'Índice de Cursos Recebido (raw)', courseIndexData);
            return courseIndexData;
        } catch (error) {
            Debug.error('ApiService', 'Falha ao buscar o índice de cursos:', error);
            throw error; // Lança o erro para ser tratado pelo chamador (CourseRepository)
        }
    }

    /**
     * Busca os dados brutos de um curso específico (metadados e aulas).
     * @param {string} courseId O ID do curso a ser buscado.
     * @returns {Promise<{courseMeta: object, lessonsData: object[]}>}
     */
    async fetchCourseData(courseId) {
        Debug.log('ApiService', `Buscando dados brutos para o curso com ID: ${courseId}`);
        Debug.updateView('Curso', courseId);

        try {
            const courseIndexData = await this._fetchJson(`${this.baseUrl}/courses.json`);
            const courseMeta = courseIndexData.find(c => c.id === courseId);

            if (!courseMeta) {
                throw new Error(`Curso com id '${courseId}' não encontrado no índice.`);
            }

            const lessonsData = await this._fetchJson(`${this.baseUrl}/${courseId}/aulas.json`);
            Debug.log('ApiService', `Dados das aulas para o curso '${courseId}' recebidos (raw).`, lessonsData);

            return { courseMeta, lessonsData };

        } catch (error) {
            Debug.error('ApiService', `Falha ao buscar os dados brutos do curso '${courseId}':`, error);
            throw error; // Lança o erro para ser tratado pelo chamador (CourseRepository)
        }
    }

    /**
     * Função auxiliar para buscar e parsear JSON com tratamento de erro.
     * @param {string} url A URL do JSON a ser buscado.
     * @returns {Promise<any>}
     * @private
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
export const apiService = new ApiService();