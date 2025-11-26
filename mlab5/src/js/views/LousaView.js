// mlab5/src/js/views/LousaView.js

/**
 * renderLousaView - Configura e renderiza a lousa digital.
 * @returns {HTMLElement} - O elemento HTML com a lousa e a barra de ferramentas.
 */
export async function renderLousaView() {
    const viewElement = document.createElement('div');
    viewElement.className = 'lousa-view';

    // Carrega o template HTML da lousa
    const response = await fetch('src/js/components/lousa/index.html');
    if (!response.ok) {
        throw new Error('Não foi possível carregar o template da lousa.');
    }
    viewElement.innerHTML = await response.text();

    // Pequeno atraso para garantir que o DOM seja atualizado antes de acessarmos o canvas
    setTimeout(() => {
        const canvas = viewElement.querySelector('#whiteboard');
        const ctx = canvas.getContext('2d');
        
        canvas.width = viewElement.offsetWidth * 0.9;
        canvas.height = viewElement.offsetHeight * 0.7;

        let painting = false;
        let brushSize = 5;
        let brushColor = 'black';
        
        function startPosition(e) {
            painting = true;
            draw(e);
        }

        function endPosition() {
            painting = false;
            ctx.beginPath();
        }

        function draw(e) {
            if (!painting) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = brushColor;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        canvas.addEventListener('mousedown', startPosition);
        canvas.addEventListener('mouseup', endPosition);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseleave', endPosition);

        const clearButton = viewElement.querySelector('#clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
        
        const colorPicker = viewElement.querySelector('#colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('change', (e) => {
                brushColor = e.target.value;
            });
            brushColor = colorPicker.value;
        }

        const brushSizeInput = viewElement.querySelector('#brushSize');
        if (brushSizeInput) {
            brushSizeInput.addEventListener('change', (e) => {
                brushSize = e.target.value;
            });
            brushSize = brushSizeInput.value;
        }

        // Métodos de limpeza para evitar vazamentos de memória
        viewElement.destroy = () => {
            canvas.removeEventListener('mousedown', startPosition);
            canvas.removeEventListener('mouseup', endPosition);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseleave', endPosition);
        };

    }, 0);

    return viewElement;
}
