/**
 * renderLessonCreatorView - Renderiza a página para criação de novas aulas e cursos.
 */
function renderLessonCreatorView() {
    const viewElement = document.createElement('div');
    viewElement.className = 'lesson-creator-view';
    viewElement.innerHTML = `
        <h2>Criador de Aulas e Cursos</h2>
        <form id="lesson-creator-form">
            <h3>Dados do Curso</h3>
            <label for="course-id">ID do Curso:</label>
            <input type="text" id="course-id" required><br>
            <label for="course-title">Título do Curso:</label>
            <input type="text" id="course-title" required><br>
            <label for="course-description">Descrição do Curso:</label>
            <textarea id="course-description" rows="3" required></textarea><br>

            <h3>Dados da Aula</h3>
            <label for="lesson-id">ID da Aula:</label>
            <input type="text" id="lesson-id" required><br>
            <label for="lesson-title">Título da Aula:</label>
            <input type="text" id="lesson-title" required><br>
            <label for="lesson-type">Tipo da Aula:</label>
            <select id="lesson-type">
                <option value="default">Padrão</option>
                <option value="lousa">Lousa</option>
                <option value="playground">Playground</option>
            </select><br>
            <label for="lesson-content">Conteúdo da Aula (JSON para Playground):</label>
            <textarea id="lesson-content" rows="10"></textarea><br>

            <button type="submit">Salvar Curso/Aula</button>
        </form>
        <div id="creator-messages" style="color: green; margin-top: 10px;"></div>
    `;

    // Adiciona o event listener para o formulário
    viewElement.querySelector('#lesson-creator-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o recarregamento da página

        const courseId = document.getElementById('course-id').value;
        const courseTitle = document.getElementById('course-title').value;
        const courseDescription = document.getElementById('course-description').value;

        const lessonId = document.getElementById('lesson-id').value;
        const lessonTitle = document.getElementById('lesson-title').value;
        const lessonType = document.getElementById('lesson-type').value;
        let lessonContent = document.getElementById('lesson-content').value;

        // Tenta parsear o conteúdo da aula se for JSON (para playground)
        if (lessonType === 'playground') {
            try {
                lessonContent = JSON.parse(lessonContent);
            } catch (e) {
                document.getElementById('creator-messages').innerText = 'Erro: Conteúdo da aula Playground deve ser um JSON válido.';
                document.getElementById('creator-messages').style.color = 'red';
                return;
            }
        }

        const newLesson = new Lesson(lessonId, lessonTitle, lessonContent, lessonType);
        const newCourse = new Course(courseId, courseTitle, courseDescription, [newLesson]);

        // Aqui chamaremos o método do ApiService para salvar
        const success = await apiService.saveCourse(newCourse);

        const messagesDiv = document.getElementById('creator-messages');
        if (success) {
            messagesDiv.innerText = 'Curso/Aula salvo com sucesso! Recarregue a página para ver as alterações.';
            messagesDiv.style.color = 'green';
            // Limpar formulário
            event.target.reset();
        } else {
            messagesDiv.innerText = 'Erro ao salvar Curso/Aula.';
            messagesDiv.style.color = 'red';
        }
    });

    return viewElement;
}
