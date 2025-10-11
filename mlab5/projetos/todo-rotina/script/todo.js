class TodoList {
    constructor() {
        this.listElement = document.getElementById("myUL");
        this.inputElement = document.getElementById("myInput");

        this.dayKey = this.getDayKey(); // Define a chave do LocalStorage com base no dia
        this.loadTasks(); // Carrega as tarefas salvas
        this.addCloseButtonEvents();
        this.addListClickEvent();
    }

    /**
     * Obtém a chave do LocalStorage com base no nome da página.
     */
    getDayKey() {
        const path = window.location.pathname; // Ex: "/dias/seg.html"
        const file = path.substring(path.lastIndexOf('/') + 1); // Ex: "seg.html"
        const day = file.split('.')[0]; // Remove ".html", ficando apenas "seg"
        return `tasks_${day}`; // Ex: "tasks_seg"
    }

    /**
     * Adiciona uma nova tarefa à lista e salva no LocalStorage.
     */
    newElement() {
        const inputValue = this.inputElement.value.trim();
        if (inputValue === '') {
            alert("Você precisa escrever algo!");
            return;
        }

        const li = this.createTaskElement(inputValue);
        this.listElement.appendChild(li);
        this.inputElement.value = "";

        this.saveTasks(); // Salva a lista após adicionar um item
    }

    /**
     * Cria um elemento de tarefa (li) com botão de remover.
     */
    createTaskElement(text) {
        const li = document.createElement("li");
        li.textContent = text;

        const span = document.createElement("SPAN");
        span.className = "close";
        span.textContent = "\u00D7";
        span.onclick = () => {
            li.remove();
            this.saveTasks(); // Atualiza a lista no LocalStorage
        };

        li.appendChild(span);
        return li;
    }

    /**
     * Adiciona eventos para marcar/desmarcar tarefas como concluídas.
     */
    addListClickEvent() {
        this.listElement.addEventListener('click', (ev) => {
            if (ev.target.tagName === 'LI') {
                ev.target.classList.toggle('checked');
                this.saveTasks(); // Atualiza o estado da tarefa
            }
        });
    }

    /**
     * Adiciona eventos aos botões de fechar já existentes.
     */
    addCloseButtonEvents() {
        const closeButtons = document.getElementsByClassName("close");
        for (let btn of closeButtons) {
            btn.onclick = () => {
                btn.parentElement.remove();
                this.saveTasks();
            };
        }
    }

    /**
     * Salva a lista de tarefas no LocalStorage para o dia específico.
     */
    saveTasks() {
        const tasks = [];
        for (let item of this.listElement.children) {
            tasks.push({
                text: item.firstChild.textContent,
                checked: item.classList.contains('checked')
            });
        }
        localStorage.setItem(this.dayKey, JSON.stringify(tasks)); // Usa a chave do dia
    }

    /**
     * Carrega as tarefas salvas no LocalStorage para o dia específico.
     */
    loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem(this.dayKey)) || [];
        for (let task of savedTasks) {
            const li = this.createTaskElement(task.text);
            if (task.checked) li.classList.add('checked');
            this.listElement.appendChild(li);
        }
    }
}

// Inicia a lista de tarefas
const todoList = new TodoList();

// Adiciona evento ao botão "Adicionar"
document.querySelector(".addBtn").onclick = () => todoList.newElement();
