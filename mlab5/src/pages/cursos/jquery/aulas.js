document.addEventListener('DOMContentLoaded', () => {
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
});
