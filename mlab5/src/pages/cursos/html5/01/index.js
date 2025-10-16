document.addEventListener('DOMContentLoaded', () => {
  // Load header and footer
  loadComponent('header-placeholder', '/src/assets/js/ui/components/header.html')
    .then(() => {
      const script = document.createElement('script');
      script.src = '/src/assets/js/ui/components/navbar.js';
      document.body.appendChild(script);
    })
    .catch(error => {
      console.error("Erro ao carregar o header:", error);
    });

  loadComponent('footer-placeholder', '/src/assets/js/ui/components/footer.html');

  // Playground link logic
  const exercicio = document.getElementById('exercicio')?.innerText || "";
  const playgroundLink = document.querySelector('a[href="/src/pages/playground"]'); 

  if (playgroundLink) {
    playgroundLink.addEventListener('click', (event) => {
      event.preventDefault();

      // Salva o texto das instruções
      localStorage.setItem('instrucoes', exercicio);

      // Salva o HTML do formulário inteiro
      const controles = document.getElementById('controles');
      localStorage.setItem('ajustes', controles.outerHTML);

      // Redireciona para o playground
      window.location.href = playgroundLink.href;
    });
  }
});
