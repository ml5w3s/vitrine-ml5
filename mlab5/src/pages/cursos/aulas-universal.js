document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadComponent('header-placeholder', '/vitrine-ml5/mlab5/src/assets/js/ui/components/header.html');
  loadComponent('footer-placeholder', '/vitrine-ml5/mlab5/src/assets/js/ui/components/footer.html');

  // Get course name from URL
  const courseName = localStorage.getItem('selectedCourse');
  console.log(courseName);

  if (courseName) {
    // Fetch the course index file
    fetch(`../controle/dados/${courseName}-index.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(courseData => renderCoursePage(courseData))
      .catch(e => {
        console.error('Falha ao carregar ou renderizar o curso:', e);
        document.getElementById("course-container").innerHTML = '<h2>Erro ao carregar o curso.</h2>';
      });
  } else {
    document.getElementById("course-container").innerHTML = '<h2>Nenhum curso especificado.</h2>';
  }
});

function renderCoursePage(courseData) {
  const container = document.getElementById("course-container");
  if (!container) {
    console.error("Elemento com id 'course-container' não encontrado.");
    return;
  }
  container.innerHTML = ''; // Clear any previous content

  // 1. Render Banner and Title
  const bannerArticle = document.createElement("article");
  bannerArticle.className = "item";
  bannerArticle.innerHTML = `
    <picture>
      <source media="(min-width: 1024px)" srcset="${courseData.bannerImages.desktop}">
      <source media="(min-width: 600px)" srcset="${courseData.bannerImages.tablet}">
      <img src="${courseData.bannerImages.mobile}">
    </picture>
    <h3>${courseData.courseTitle}</h3>
  `;
  container.appendChild(bannerArticle);

  // 2. Render Lesson List
  courseData.lessons.forEach(lesson => {
    const lessonArticle = document.createElement("article");
    lessonArticle.className = "item";
    lessonArticle.innerHTML = `
      <h2><i class="material-icons">face</i></h2>
      <h5><a href="aula.html?path=${lesson.path}">${lesson.title}</a></h5>
      <p>${lesson.description}</p>
    `;
    container.appendChild(lessonArticle);
  });

  // Adiciona um event listener para lidar com os cliques nas aulas, usando localStorage
  container.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="aula.html"]');
    if (link) {
        event.preventDefault();
        try {
            const url = new URL(link.href, window.location.origin);
            const lessonPath = url.searchParams.get('path');
            if (lessonPath) {
                localStorage.setItem('selectedLesson', lessonPath);
                window.location.href = link.href;
            }
        } catch (e) {
            console.error('Erro ao processar link da aula:', e);
        }
    }
  });
}
