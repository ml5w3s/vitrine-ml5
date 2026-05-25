document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderAvisos();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.line-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Update Active Section
            sections.forEach(s => s.classList.remove('active'));
            const activeSection = document.getElementById(target);
            if (activeSection) {
                activeSection.classList.add('active');
            }

            // Optional: Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function renderAvisos() {
    const list = document.getElementById('avisos-list');
    if (!list) return;

    list.innerHTML = APP_DATA.avisos.map(aviso => `
        <div class="card aviso-${aviso.tipo}">
            <span class="date">${aviso.data}</span>
            <h3>${aviso.titulo}</h3>
            <p>${aviso.descricao}</p>
        </div>
    `).join('');
}

function initAdminForm() {
    const form = document.getElementById('post-form');
    const resultArea = document.getElementById('result-area');
    const output = document.getElementById('json-output');
    const btnCopy = document.getElementById('btn-copy');
    const whatsappLink = document.getElementById('whatsapp-send');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            titulo: document.getElementById('post-titulo').value,
            descricao: document.getElementById('post-desc').value,
            data: document.getElementById('post-data').value,
            tipo: document.getElementById('post-tipo').value
        };

        const jsonString = JSON.stringify(newPost, null, 4);
        output.textContent = jsonString;
        resultArea.style.display = 'block';

        // Update WhatsApp Link
        const text = encodeURIComponent(`Olá! Gostaria de publicar um novo aviso no Portal da Quadra:\n\n${jsonString}`);
        whatsappLink.href = `https://wa.me/?text=${text}`;

        resultArea.scrollIntoView({ behavior: 'smooth' });
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent);
        btnCopy.textContent = 'Copiado!';
        setTimeout(() => btnCopy.textContent = 'Copiar Código', 2000);
    });
}
