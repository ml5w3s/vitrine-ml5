document.addEventListener('DOMContentLoaded', () => {
    const loadNavbar = async () => {
        try {
            const response = await fetch('js/ui/components/navbar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHtml = await response.text();
            
            const navbarContainer = document.getElementById('navbar-placeholder');
            if (navbarContainer) {
                navbarContainer.innerHTML = navbarHtml;
                
                // Inicializa o Sidenav do Materialize
                // ESSA LINHA É CRUCIAL PARA O HAMBÚRGUER!
                const elems = document.querySelectorAll('.sidenav');
                M.Sidenav.init(elems);
            } else {
                console.error('Elemento com ID "navbar-placeholder" não encontrado no index.html');
            }
        } catch (error) {
            console.error('Erro ao carregar a navbar:', error);
        }
    };

    loadNavbar();
});