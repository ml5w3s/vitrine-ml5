// mlab5/app.js

import EventBus from './src/js/utils/EventBus.js';
import Router from './src/js/router/Router.js';
import Debug from './src/js/utils/Debug.js';

// 1. Inicializar serviços centrais
const eventBus = new EventBus();
const router = new Router(eventBus); 

// 2. Obter o elemento raiz da aplicação
const appRoot = document.getElementById('app-root');

// 3. Definir funções de renderização para cada rota
const renderHome = () => {
    appRoot.innerHTML = `
        <h1>Página Inicial</h1>
        <p>Bem-vindo à plataforma mlab5!</p>
        <p>Navegue para <a href="#/courses">ver os cursos</a>.</p>
    `;
    Debug.log('App', 'Home view rendered.');
};

const renderCourses = async () => {
    appRoot.innerHTML = `<h1>Cursos</h1><p>Carregando cursos...</p>`;
    Debug.log('App', 'Fetching courses data...');

    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const courses = await response.json();
        Debug.log('App', 'Courses data fetched successfully.');

        let coursesHtml = `
            <h1>Cursos Disponíveis</h1>
            <p>Explore nossa variedade de cursos:</p>
            <div class="course-list">
        `;

        // Filter out the banner and iterate through actual courses
        courses.filter(course => course.id !== 'banner-cursos').forEach(course => {
            coursesHtml += `
                <div class="course-card">
                    <h2>${course.title}</h2>
                    <img src="${course.image.desktop}" alt="${course.image.caption}" style="max-width: 100%; height: auto;">
                    <p>${course.description}</p>
                    <a href="#/course/${course.id}">Ver Detalhes</a>
                </div>
            `;
        });

        coursesHtml += `
            </div>
            <p><a href="#/home">Voltar para a Home</a>.</p>
        `;
        appRoot.innerHTML = coursesHtml;
        Debug.log('App', 'Courses view rendered with dynamic data.');

    } catch (error) {
        Debug.error('App', `Failed to fetch courses: ${error}`);
        appRoot.innerHTML = `
            <h1>Erro ao Carregar Cursos</h1>
            <p>Não foi possível carregar a lista de cursos. Por favor, tente novamente mais tarde.</p>
            <p><a href="#/home">Voltar para a Home</a>.</p>
        `;
    }
};

const renderLessonDetails = async (params) => {
    const { courseId, lessonId } = params;
    appRoot.innerHTML = `<h1>Aula</h1><p>Carregando conteúdo da aula...</p>`;
    Debug.log('App', `Fetching lesson ${lessonId} for course: ${courseId}`);

    try {
        const response = await fetch(`data/${courseId}/aulas.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const lessons = await response.json();
        
        // Find the specific lesson (lessonId is 1-based index)
        const lesson = lessons[lessonId - 1];

        if (!lesson) {
            throw new Error(`Lesson with id ${lessonId} not found in course ${courseId}`);
        }

        Debug.log('App', `Lesson data fetched successfully for ${courseId}/${lessonId}.`);

        let lessonHtml = `
            <h1>${lesson.course.name}</h1>
            <div class="lesson-content">
        `;

        // Render each article within the lesson, excluding hidden ones
        lesson.course.articles.filter(article => !article.hidden).forEach(article => {
            lessonHtml += `<div class="lesson-article">`;
            if (article.headline) {
                lessonHtml += `<h2>${article.headline}</h2>`;
            }
            if (article.alternativeHeadline) {
                lessonHtml += `<h3>${article.alternativeHeadline}</h3>`;
            }
            if (article.text) {
                lessonHtml += `<p>${article.text}</p>`;
            }
            if (article.list) {
                lessonHtml += '<ul>';
                article.list.forEach(item => {
                    lessonHtml += `<li>${item}</li>`;
                });
                lessonHtml += '</ul>';
            }
            if (article.code) {
                lessonHtml += '<pre><code>';
                article.code.forEach(line => {
                    lessonHtml += `${line}\n`;
                });
                lessonHtml += '</code></pre>';
            }
            // Note: Image rendering is skipped for simplicity for now
            lessonHtml += `</div>`;
        });

        lessonHtml += `
            </div>`;

        // Add Playground button if a playground is defined for this lesson
        if (lesson.course.playground) {
            const playgroundUrl = `#/course/${courseId}/lesson/${lessonId}/playground`;
            lessonHtml += `
                <div class="playground-link" style="margin-top: 20px;">
                    <a href="${playgroundUrl}" class="button-style">Ir para o Playground</a>
                </div>
            `;
        }

        lessonHtml += `
            <p><a href="#/course/${courseId}">Voltar para a lista de aulas</a>.</p>
        `;
        appRoot.innerHTML = lessonHtml;
        Debug.log('App', `Lesson view rendered for ${courseId}/${lessonId}.`);

    } catch (error) {
        Debug.error('App', `Failed to fetch or render lesson: ${error}`);
        appRoot.innerHTML = `
            <h1>Erro ao Carregar Aula</h1>
            <p>Não foi possível carregar o conteúdo desta aula. Por favor, tente novamente mais tarde.</p>
            <p><a href="#/course/${courseId}">Voltar para a lista de aulas</a>.</p>
        `;
    }
};

const renderPlayground = async (params) => {
    const { courseId, lessonId } = params;
    appRoot.innerHTML = `<h1>Playground</h1><p>Carregando playground...</p>`;
    Debug.log('App', `Fetching playground for lesson ${lessonId} of course: ${courseId}`);

    try {
        const response = await fetch(`data/${courseId}/aulas.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const lessons = await response.json();
        const lesson = lessons[lessonId - 1];

        if (!lesson || !lesson.course || !lesson.course.articles) {
            throw new Error('Invalid lesson structure');
        }

        const playgroundArticle = lesson.course.articles.find(a => a.forPlayground === true);

        if (!playgroundArticle) {
            throw new Error('Playground article not found for this lesson.');
        }

        let instructionsHtml = '';
        if (playgroundArticle.headline) {
            instructionsHtml += `<h2>${playgroundArticle.headline}</h2>`;
        }
        if (playgroundArticle.text) {
            instructionsHtml += `<p>${playgroundArticle.text}</p>`;
        }
        if (playgroundArticle.steps) {
            instructionsHtml += '<ul>';
            playgroundArticle.steps.forEach(step => {
                instructionsHtml += `<li>${step}</li>`;
            });
            instructionsHtml += '</ul>';
        }

        const playgroundHtml = `
            <h1>Playground: ${lesson.course.name}</h1>
            <div class="playground-container">
                <div class="playground-instructions">
                    <h3>Instruções</h3>
                    ${instructionsHtml}
                </div>
                <div class="playground-editor">
                    <h3>Editor</h3>
                    <textarea placeholder="Escreva seu código aqui..."></textarea>
                </div>
            </div>
            <p><a href="#/course/${courseId}/lesson/${lessonId}">Voltar para a Aula</a></p>
        `;

        appRoot.innerHTML = playgroundHtml;
        Debug.log('App', `Playground rendered for ${courseId}/${lessonId}.`);

    } catch (error) {
        Debug.error('App', `Failed to render playground: ${error}`);
        appRoot.innerHTML = `
            <h1>Erro ao Carregar o Playground</h1>
            <p>${error.message}</p>
            <p><a href="#/course/${courseId}/lesson/${lessonId}">Voltar para a Aula</a></p>
        `;
    }
};

const renderNotFound = (hash) => {
    appRoot.innerHTML = `
        <h1>Erro 404 - Página Não Encontrada</h1>
        <p>A rota "<strong>${hash}</strong>" não foi encontrada.</p>
        <p><a href="#/home">Voltar para a Home</a>.</p>
    `;
    Debug.log('App', `404 Not Found view rendered for hash: ${hash}`);
};

const renderCourseDetails = async (params) => {
    const { courseId } = params;
    appRoot.innerHTML = `<h1>${courseId.toUpperCase()}</h1><p>Carregando aulas...</p>`;
    Debug.log('App', `Fetching lessons for course: ${courseId}`);

    try {
        const response = await fetch(`data/${courseId}/aulas.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const lessons = await response.json();
        Debug.log('App', `Lessons data fetched successfully for ${courseId}.`);

        let lessonsHtml = `
            <h1>Aulas de ${courseId.toUpperCase()}</h1>
            <p>Lista de aulas disponíveis para este curso:</p>
            <div class="lesson-list">
        `;

        lessons.forEach((lesson, index) => {
            // Correctly access the nested properties from aulas.json
            const lessonTitle = lesson.course.name;
            const lessonId = index + 1; // Use index as a temporary ID

            lessonsHtml += `
                <div class="lesson-card">
                    <h2>${lessonTitle}</h2>
                    <p>Um módulo focado nos fundamentos e práticas essenciais.</p>
                    <a href="#/course/${courseId}/lesson/${lessonId}">Ver Aula</a>
                </div>
            `;
        });

        lessonsHtml += `
            </div>
            <p><a href="#/courses">Voltar para Cursos</a>.</p>
        `;
        appRoot.innerHTML = lessonsHtml;
        Debug.log('App', `Course details view rendered for ${courseId} with dynamic data.`);

    } catch (error) {
        Debug.error('App', `Failed to fetch lessons for ${courseId}: ${error}`);
        appRoot.innerHTML = `
            <h1>Erro ao Carregar Aulas</h1>
            <p>Não foi possível carregar as aulas para o curso "${courseId}". Por favor, verifique se o curso existe ou tente novamente mais tarde.</p>
            <p><a href="#/courses">Voltar para Cursos</a>.</p>
        `;
    }
};


// 4. Adicionar as rotas ao router
router.addRoute('#/', renderHome);
router.addRoute('#/home', renderHome);
router.addRoute('#/courses', renderCourses);
router.addRoute('#/course/:courseId', renderCourseDetails); // Nova rota para detalhes do curso
router.addRoute('#/course/:courseId/lesson/:lessonId', renderLessonDetails); // Nova rota para a aula
router.addRoute('#/course/:courseId/lesson/:lessonId/playground', renderPlayground); // Nova rota para o playground

// 5. Escutar por eventos de rota não encontrada
eventBus.subscribe('routeNotFound', renderNotFound);

// 6. Adicionar um log básico para confirmar que app.js está carregando
Debug.log('App', 'mlab5 application starting...');

// 7. Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar componentes HTML dinamicamente
    const loadComponent = async (placeholderId, filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch component: ${filePath}`);
            }
            const componentHtml = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = componentHtml;

                // Extrair e executar scripts do componente carregado
                const scripts = placeholder.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    // Copia atributos como 'type', 'src', etc.
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    // Copia o conteúdo do script inline
                    newScript.textContent = oldScript.textContent;
                    // Substitui o script antigo pelo novo para forçar a execução
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }
            Debug.log('App', `Component '${filePath}' loaded into '${placeholderId}'.`);
        } catch (error) {
            Debug.error('App', error.message);
        }
    };

    // Carregar header e footer
    loadComponent('header-placeholder', 'src/js/ui/components/header.html');
    loadComponent('footer-placeholder', 'src/js/ui/components/footer.html');

    // Inicializa o router para que ele possa lidar com a rota inicial na carga da página
    router.init(); 
    Debug.log('App', 'Application initialized and router started.');
});

// Para fins de teste, você pode expor alguns globais temporariamente
window.eventBus = eventBus;
window.router = router;
window.Debug = Debug;