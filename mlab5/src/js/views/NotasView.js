// mlab5/src/js/views/NotasView.js
import { StickyNoteComponent } from '../components/StickyNoteComponent.js';

/**
 * renderNotasView - Configura e renderiza a página de notas adesivas.
 * @returns {HTMLElement} - O elemento HTML com a área de notas.
 */
export function renderNotasView() {
    const viewElement = document.createElement('div');
    viewElement.className = 'notas-view';
    viewElement.innerHTML = `
        <div class="toolbar">
            <button id="add-note-button" class="button-style">Adicionar Nota</button>
        </div>
        <div class="notes-container"></div>
    `;

    const notesContainer = viewElement.querySelector('.notes-container');
    const addNoteButton = viewElement.querySelector('#add-note-button');
    
    const activeNotes = [];

    addNoteButton.addEventListener('click', () => {
        const newNote = new StickyNoteComponent(notesContainer);
        activeNotes.push(newNote);
    });

    // Função de limpeza para quando a view for destruída
    viewElement.destroy = () => {
        activeNotes.forEach(note => note.destroy());
        addNoteButton.removeEventListener('click', () => {});
    };

    return viewElement;
}
