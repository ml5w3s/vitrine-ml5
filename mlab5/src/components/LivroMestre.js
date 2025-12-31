export class LivroMestre {
    constructor(container) {
        this.container = container;
        this.currentCourseId = null;
        this.courses = [];
        this.courseData = null;
        this.activeLanguage = 'javascript'; // Linguagem padrão
        
        this.init();
    }

    async init() {
        this.injectStyles();
        await this.loadCourses();
        this.renderCourseList();
    }

    injectStyles() {
        if (!document.getElementById('livro-mestre-styles')) {
            const style = document.createElement('style');
            style.id = 'livro-mestre-styles';
            style.textContent = `
                @keyframes neon-border {
                    0% { border-color: #8e44ad; }   /* Roxo */
                    50% { border-color: #9b59b6; }  /* Púrpura */
                    100% { border-color: #ff69b4; } /* Rosa */
                }
                @keyframes code-bg-pulse {
                    0% { background-color: #1a1a1a; }
                    50% { background-color: #242424; }
                    100% { background-color: #2d2d2d; }
                }
                .code-container-animated {
                    border: 2px solid #8e44ad;
                    border-radius: 0 0 8px 8px;
                    padding: 15px;
                    color: #abb2bf;
                    overflow-x: auto;
                    animation: 
                        neon-border 3s infinite alternate,
                        code-bg-pulse 6s infinite alternate;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async loadCourses() {
        try {
            // Assume que estamos rodando a partir de mlab5/
            const response = await fetch('data/courses.json');
            if (!response.ok) throw new Error('Erro ao carregar lista de cursos');
            this.courses = await response.json();
        } catch (e) {
            console.error("Erro ao carregar cursos", e);
            this.container.innerHTML = '<p class="error">Erro ao carregar lista de cursos. Verifique se o arquivo data/courses.json existe.</p>';
        }
    }

    renderCourseList() {
        this.container.innerHTML = '';
        
        const header = document.createElement('div');
        header.className = 'livro-mestre-header';
        header.innerHTML = '<h2>Livro Mestre - Gabaritos</h2><p>Selecione um curso para ver os gabaritos dos exercícios.</p>';
        this.container.appendChild(header);

        const list = document.createElement('div');
        list.className = 'course-list-grid';
        // Adiciona um estilo básico de grid se não existir no CSS global
        list.style.display = 'grid';
        list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        list.style.gap = '20px';
        list.style.padding = '20px 0';
        
        this.courses.forEach(course => {
            // Filtra apenas cursos que possam ter gabarito (opcional, por enquanto mostra todos)
            const card = document.createElement('div');
            card.className = 'course-card';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '8px';
            card.style.padding = '15px';
            card.style.backgroundColor = '#fff';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

            const imgUrl = course.image && course.image.mobile ? course.image.mobile : '';
            
            card.innerHTML = `
                ${imgUrl ? `<img src="${imgUrl}" alt="${course.title}" style="width:100%; height:150px; object-fit:cover; border-radius:4px;">` : ''}
                <h3 style="margin: 10px 0;">${course.title}</h3>
                <p style="font-size: 0.9em; color: #666;">${course.description}</p>
                <button class="btn-acessar button-style" style="margin-top: 10px;">Acessar Gabaritos</button>
            `;
            
            card.querySelector('.btn-acessar').addEventListener('click', () => this.loadCourseData(course.id));
            list.appendChild(card);
        });
        this.container.appendChild(list);
    }

    async loadCourseData(courseId) {
        this.currentCourseId = courseId;
        this.container.innerHTML = '<p>Carregando gabaritos...</p>';
        try {
            const response = await fetch(`data/${courseId}/livro-mestre.json`);
            if (!response.ok) {
                 if (response.status === 404) {
                     throw new Error('Gabarito não encontrado para este curso.');
                 }
                 throw new Error('Erro ao buscar gabarito.');
            }
            this.courseData = await response.json();
            this.renderCourseView();
        } catch (e) {
            console.error(e);
            this.container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Ops!</h3>
                    <p>${e.message}</p>
                    <button id="back-btn" style="padding: 8px 16px; cursor: pointer;">Voltar para Lista</button>
                </div>
            `;
            this.container.querySelector('#back-btn').addEventListener('click', () => this.renderCourseList());
        }
    }

    renderCourseView() {
        this.container.innerHTML = '';
        
        // Header com botão voltar
        const header = document.createElement('header');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '15px';
        header.style.marginBottom = '20px';
        header.style.borderBottom = '1px solid #eee';
        header.style.paddingBottom = '10px';

        const btnVoltar = document.createElement('button');
        btnVoltar.textContent = '← Voltar';
        btnVoltar.className = 'button-style';
        btnVoltar.style.marginRight = '15px'; // Adicionado margem para separar do título
        btnVoltar.addEventListener('click', () => this.renderCourseList());

        const title = document.createElement('h2');
        title.textContent = this.courseData.curso || 'Gabaritos do Curso';
        title.style.margin = '0';

        header.appendChild(btnVoltar);
        header.appendChild(title);
        this.container.appendChild(header);

        // Renderiza o Banner se existir
        if (this.courseData.banner) {
            const bannerDiv = document.createElement('div');
            bannerDiv.className = 'course-banner';
            bannerDiv.style.width = '100%';
            bannerDiv.style.marginBottom = '30px';
            
            const img = document.createElement('img');
            // Seleciona a imagem baseada na largura da tela (simplificado)
            const width = window.innerWidth;
            let src = this.courseData.banner.desktop;
            if (width <= 480) src = this.courseData.banner.mobile || src;
            else if (width <= 768) src = this.courseData.banner.tablet || src;
            
            img.src = src;
            img.style.width = '100%';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            img.style.display = 'block';
            
            bannerDiv.appendChild(img);
            this.container.appendChild(bannerDiv);
        }

        // Renderiza as aulas
        if (!this.courseData.aulas || this.courseData.aulas.length === 0) {
            this.container.appendChild(document.createElement('p')).textContent = 'Nenhuma aula com gabarito encontrada.';
            return;
        }

        this.courseData.aulas.forEach(aula => {
            const aulaSection = document.createElement('section');
            aulaSection.className = 'aula-section';
            aulaSection.style.marginBottom = '30px';
            
            aulaSection.innerHTML = `<h3 style="color: #444; border-left: 4px solid #007bff; padding-left: 10px;">${aula.titulo}</h3>`;
            
            const algoList = document.createElement('div');
            algoList.className = 'algo-list';
            algoList.style.display = 'flex';
            algoList.style.flexDirection = 'column';
            algoList.style.gap = '20px';
            algoList.style.marginTop = '15px';

            aula.algoritmos.forEach(algo => {
                algoList.appendChild(this.createAlgorithmCard(algo));
            });

            aulaSection.appendChild(algoList);
            this.container.appendChild(aulaSection);
        });
    }

    createAlgorithmCard(algo) {
        const card = document.createElement('div');
        card.className = 'algo-card';
        card.style.border = '1px solid #e0e0e0';
        card.style.borderRadius = '8px';
        card.style.backgroundColor = '#f9f9f9';
        card.style.overflow = 'hidden';
        
        const header = document.createElement('div');
        header.style.padding = '15px';
        header.style.backgroundColor = '#fff';
        header.style.borderBottom = '1px solid #e0e0e0';

        const title = document.createElement('h4');
        title.textContent = algo.titulo;
        title.style.margin = '0 0 5px 0';
        header.appendChild(title);

        if (algo.descricao) {
            const desc = document.createElement('p');
            desc.textContent = algo.descricao;
            desc.style.margin = '0';
            desc.style.fontSize = '0.9em';
            desc.style.color = '#666';
            header.appendChild(desc);
        }
        card.appendChild(header);

        // Language Tabs
        const languages = ['javascript', 'python', 'php', 'java'];
        const tabs = document.createElement('div');
        tabs.className = 'lang-tabs';
        tabs.style.display = 'flex';
        tabs.style.backgroundColor = '#eee';
        tabs.style.borderBottom = '1px solid #ccc';
        
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container-animated';
        
        const pre = document.createElement('pre');
        pre.style.margin = '0';
        const codeBlock = document.createElement('code');
        codeBlock.style.fontFamily = 'monospace';
        pre.appendChild(codeBlock);
        codeContainer.appendChild(pre);

        // State for this card
        let currentLang = this.activeLanguage;

        const updateCode = (lang) => {
            currentLang = lang;
            // Update tab active state
            Array.from(tabs.children).forEach(btn => {
                const isSelected = btn.dataset.lang === lang;
                btn.style.backgroundColor = isSelected ? '#09c' : 'transparent';
                btn.style.color = isSelected ? '#fff' : '#333';
                btn.style.fontWeight = isSelected ? 'bold' : 'normal';
            });

            const code = algo.codigos[lang];
            if (code) {
                codeBlock.textContent = code;
                codeBlock.className = `language-${lang}`;
                // If hljs exists, highlight
                if (window.hljs) window.hljs.highlightElement(codeBlock);
            } else {
                codeBlock.textContent = '// Implementação não disponível para esta linguagem.';
            }
        };

        languages.forEach(lang => {
            const btn = document.createElement('button');
            btn.textContent = lang.toUpperCase();
            btn.dataset.lang = lang;
            btn.style.flex = '1';
            btn.style.border = 'none';
            btn.style.padding = '10px';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'background 0.3s';
            
            btn.addEventListener('click', () => {
                updateCode(lang);
                // Optionally update global preference?
                this.activeLanguage = lang; 
            });
            tabs.appendChild(btn);
        });

        card.appendChild(tabs);
        card.appendChild(codeContainer);

        // Initialize
        updateCode(this.activeLanguage);

        return card;
    }
}