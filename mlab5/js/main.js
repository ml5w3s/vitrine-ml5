async function loadComponent(placeholderId, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
    document.getElementById(placeholderId).innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}
