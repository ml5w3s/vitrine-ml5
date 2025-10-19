document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadComponent('header-placeholder', '/vitrine-ml5/mlab5/src/assets/js/ui/components/header.html');
  loadComponent('footer-placeholder', '/vitrine-ml5/mlab5/src/assets/js/ui/components/footer.html');

  // Get lesson path from URL
  const lessonPath = localStorage.getItem('selectedLesson'); // e.g., 'html5/01.json'
console.log(lessonPath);
  if (lessonPath) {
    // Assuming all lesson data is in a 'dados' folder relative to the 'cursos' page
    fetch(`/vitrine-ml5/mlab5/src/pages/controle/dados/${lessonPath}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(aula => renderizarAula(aula))
      .catch(e => {
        console.error('Falha ao carregar ou renderizar a aula:', e);
        document.getElementById("conteudo").innerHTML = '<h2>Erro ao carregar a aula.</h2>';
      });
  } else {
    document.getElementById("conteudo").innerHTML = '<h2>Nenhuma aula especificada.</h2>';
  }
});

function renderizarAula(aula) {
  const container = document.getElementById("conteudo");
  if (!container) {
    console.error("Elemento com id 'conteudo' não encontrado.");
    return;
  }
  container.innerHTML = `<h2>${aula.aula}</h2>`;

  aula.artigos.forEach((artigo) => {
    const article = document.createElement("article");
    article.setAttribute("itemscope", "");
    article.setAttribute("itemtype", "https://schema.org/Article");

    if (artigo.titulo) {
      const h2 = document.createElement("h2");
      h2.textContent = artigo.titulo;
      h2.setAttribute("itemprop", "headline");
      article.appendChild(h2);
    }
    if (artigo.subtitulo) {
      const h3 = document.createElement("h3");
      h3.textContent = artigo.subtitulo;
      h3.setAttribute("itemprop", "alternativeHeadline");
      article.appendChild(h3);
    }
    if (artigo.texto) {
      const p = document.createElement("p");
      p.textContent = artigo.texto;
      p.setAttribute("itemprop", "text");
      article.appendChild(p);
    }
    if (artigo.lista) {
      const ul = document.createElement("ul");
      ul.setAttribute("itemprop", "text");
      artigo.lista.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      article.appendChild(ul);
    }
    if (artigo.codigo) {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = artigo.codigo;
      code.setAttribute("itemprop", "text");
      pre.appendChild(code);
      article.appendChild(pre);
    }
    if (artigo.imagem) {
      const img = document.createElement("img");
      img.src = artigo.imagem;
      img.alt = artigo.titulo || "Imagem ilustrativa";
      img.setAttribute("itemprop", "image");
      article.appendChild(img);
    }
    container.appendChild(article);
  });
}
 