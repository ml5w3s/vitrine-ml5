import { LousaComponent } from "../components/LousaComponent.js";

// Função auxiliar para carregar CSS dinamicamente
function loadCss(filename) {
    const link = document.createElement('link');
    link.href = filename;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
    return link; // Retorna o elemento link para que possa ser removido depois
}

// Função auxiliar para descarregar CSS dinamicamente
function unloadCss(linkElement) {
    if (linkElement && linkElement.parentNode) {
        linkElement.parentNode.removeChild(linkElement);
    }
}

export async function renderLousaView() {
    const root = document.createElement("div");
    root.style.width = "100%";
    // root.style.height = "100vh"; // Removida a altura fixa

    // Carrega o CSS do componente da Lousa
    const cssLink = loadCss('/vitrine-ml5/mlab5/src/js/components/lousa-component.css');

    const lousaHtml = await fetch("/vitrine-ml5/mlab5/src/js/components/lousa-component.html").then(r => r.text());
    root.innerHTML = lousaHtml;

    // Adiciona o banner ao root element antes do conteúdo da lousa
    const bannerHtml = `
        <section class="container">
            <article class="item banner-item">
                <picture>
                    <source media="(min-width: 1024px)" srcset="src/images/banner_lousa_desktop.png">
                    <source media="(min-width: 600px)" srcset="src/images/banner_lousa_tablet.png">
                    <img src="src/images/banner_lousa_mobile.png" alt="Banner Lousa" style="width:100%;">
                </picture>
            </article>
        </section>
    `;
    root.insertAdjacentHTML('afterbegin', bannerHtml); // Insere o banner no início do root

    const canvas = root.querySelector("#whiteboard");
    if (!canvas) {
        console.error("Canvas element #whiteboard not found in lousa-component.html");
        return root; // Or handle error appropriately
    }

    const component = new LousaComponent(canvas);

    // Adia o redimensionamento para garantir que o elemento esteja no DOM e tenha dimensões
    setTimeout(() => component.handleResize(), 0);

    // Get UI elements
    const toolbar = root.querySelector(".toolbar");
    const colorPicker = root.querySelector("#colorPicker");
    const brushSizeSlider = root.querySelector("#brushSize");

    // Add event listeners
    if (toolbar) {
        toolbar.addEventListener("click", (e) => {
            const target = e.target.closest(".tool-btn");
            if (target) {
                const tool = target.dataset.tool;
                component.setTool(tool);

                // Update active class
                toolbar.querySelector(".tool-btn.active").classList.remove("active");
                target.classList.add("active");
            }
        });
    }

    if (colorPicker) {
        colorPicker.addEventListener("input", (e) => component.setBrushColor(e.target.value));
    }
    if (brushSizeSlider) {
        brushSizeSlider.addEventListener("input", (e) => component.setBrushSize(e.target.value));
    }

    // opcional: destruição quando sair da rota
    root.destroy = () => {
        component.destroy();
        unloadCss(cssLink); // Descarrega o CSS ao destruir o componente
    };

    return root;
}
