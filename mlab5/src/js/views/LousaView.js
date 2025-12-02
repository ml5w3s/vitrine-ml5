import { LousaComponent } from "../components/LousaComponent.js";

export async function renderLousaView() {
    const root = document.createElement("div");
    root.style.width = "100%";
    root.style.height = "calc(100vh - 120px)"; // Adjust as needed
    const lousaHtml = await fetch("/vitrine-ml5/mlab5/src/js/components/lousa-component.html").then(r => r.text());
    root.innerHTML = lousaHtml;

    const canvas = root.querySelector("#whiteboard");
    if (!canvas) {
        console.error("Canvas element #whiteboard not found in lousa-component.html");
        return root; // Or handle error appropriately
    }

    const component = new LousaComponent(canvas);

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
    root.destroy = () => component.destroy();

    return root;
}
