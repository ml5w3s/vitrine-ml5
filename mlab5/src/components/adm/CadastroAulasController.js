export class CadastroAulasController {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.aula = null;
        this.initElements();
        this.addEventListeners();
    }

    initElements() {
        this.criarAulaBtn = this.rootElement.querySelector('#criar-aula-btn');
        this.formArtigo = this.rootElement.querySelector('#form-artigo');
        this.tituloInput = this.rootElement.querySelector('#titulo');
        this.subtituloInput = this.rootElement.querySelector('#subtitulo');
        this.textoTextarea = this.rootElement.querySelector('#texto');
        this.listaTextarea = this.rootElement.querySelector('#lista');
        this.codigoTextarea = this.rootElement.querySelector('#codigo');
        this.imagemInput = this.rootElement.querySelector('#imagem');
        this.adicionarArtigoBtn = this.rootElement.querySelector('#adicionar-artigo-btn');
        this.finalizarAulaBtn = this.rootElement.querySelector('#finalizar-aula-btn');
        this.saidaDiv = this.rootElement.querySelector('#saida');
    }

    addEventListeners() {
        if (this.criarAulaBtn) this.criarAulaBtn.addEventListener('click', () => this.criarAula());
        if (this.adicionarArtigoBtn) this.adicionarArtigoBtn.addEventListener('click', () => this.adicionarArtigo());
        if (this.finalizarAulaBtn) this.finalizarAulaBtn.addEventListener('click', () => this.finalizarAula());
    }

    criarAula() {
        const nome = prompt("Digite o nome da aula:");
        if (!nome) return;

        this.aula = {
            aula: nome,
            artigos: []
        };

        if (this.formArtigo) this.formArtigo.style.display = "block";
        this.atualizarSaida();
    }

    adicionarArtigo() {
        if (!this.aula) return alert("Crie uma aula primeiro!");

        const artigo = {
            titulo: this.getValue(this.tituloInput),
            subtitulo: this.getValue(this.subtituloInput),
            texto: this.getValue(this.textoTextarea),
            lista: this.getLista(this.listaTextarea),
            codigo: this.getValue(this.codigoTextarea),
            imagem: this.getValue(this.imagemInput)
        };

        this.aula.artigos.push(artigo);
        this.limparFormulario();
        this.atualizarSaida();
    }

    finalizarAula() {
        if (!this.aula) return alert("Nenhuma aula criada!");

        const blob = new Blob([JSON.stringify(this.aula, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = this.aula.aula.replace(/\s+/g, "_") + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    getValue(element) {
        const val = element.value.trim();
        return val === "" ? null : val;
    }

    getLista(element) {
        const val = element.value.trim();
        if (val === "") return null;
        return val.split("\n").map(item => item.trim()).filter(i => i.length > 0);
    }

    limparFormulario() {
        if (this.formArtigo) {
            this.formArtigo.querySelectorAll("input, textarea")
                .forEach(el => el.value = "");
        }
    }

    atualizarSaida() {
        if (this.saidaDiv) {
            this.saidaDiv.textContent = JSON.stringify(this.aula, null, 2);
        }
    }

    destroy() {
        // Remove event listeners if necessary to prevent memory leaks
        // This is a simplified example; in a real app, you'd store the bound functions
        // and remove them explicitly.
        if (this.criarAulaBtn) this.criarAulaBtn.removeEventListener('click', () => this.criarAula());
        if (this.adicionarArtigoBtn) this.adicionarArtigoBtn.removeEventListener('click', () => this.adicionarArtigo());
        if (this.finalizarAulaBtn) this.finalizarAulaBtn.removeEventListener('click', () => this.finalizarAula());
    }
}
