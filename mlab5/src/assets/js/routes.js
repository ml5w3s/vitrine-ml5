// Em mlab5/src/assets/js/routes.js

function defineRoutes(router) {
    const appRoot = document.getElementById('app-root');

    // Define a rota para a Home Page (lista de cursos)
    router.addRoute('/', async () => {
        appRoot.innerHTML = 'Carregando cursos...';
        const homeView = await renderHomeView();
        appRoot.innerHTML = ''; // Limpa o 'Carregando'
        appRoot.appendChild(homeView);
    });

    // Define a rota para a página de detalhes do curso
    router.addRoute('/course/:courseId', async (params) => {
        const { courseId } = params;
        appRoot.innerHTML = `Carregando curso ${courseId}...`;
        const course = await apiService.getCourseById(courseId);
        if (course) {
            const courseView = renderCourseView(course);
            appRoot.innerHTML = ''; // Limpa o 'Carregando'
            appRoot.appendChild(courseView);
        } else {
            appRoot.innerHTML = '<h2>Curso não encontrado</h2>';
        }
    });

    // Define a rota para a página de detalhes da aula
    router.addRoute('/course/:courseId/lesson/:lessonId', async (params) => {
        const { courseId, lessonId } = params;
        appRoot.innerHTML = `Carregando aula ${lessonId} do curso ${courseId}...`;
        const lesson = await apiService.getLessonById(courseId, lessonId);
        if (lesson) {
            const lessonView = lesson.render(); // Usa o método render da classe Lesson
            appRoot.innerHTML = ''; // Limpa o 'Carregando'
            appRoot.appendChild(lessonView);
        } else {
            appRoot.innerHTML = '<h2>Aula não encontrada</h2>';
        }
    });

    // Define a rota para o Criador de Aulas
    router.addRoute('/creator', async () => {
        appRoot.innerHTML = 'Carregando criador de aulas...';
        const creatorView = renderLessonCreatorView();
        appRoot.innerHTML = ''; // Limpa o 'Carregando'
        appRoot.appendChild(creatorView);
    });

    // Define a rota para o Playground
    router.addRoute('/course/:courseId/lesson/:lessonId/playground', async (params) => {
        const { courseId, lessonId } = params;
        appRoot.innerHTML = `Carregando Playground para aula ${lessonId} do curso ${courseId}...`;
        const playgroundView = await renderPlaygroundView(courseId, lessonId);
        appRoot.innerHTML = ''; // Limpa o 'Carregando'
        appRoot.appendChild(playgroundView);
    });
}