// js/ui/components/loader.js
function loadComponent(elementId, url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      document.getElementById(elementId).innerHTML = html;
    })
    .catch(error => {
      console.error(`Não foi possível carregar o componente ${url}:`, error);
    });
}