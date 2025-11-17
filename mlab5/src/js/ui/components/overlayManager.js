// ...new file...
(function () {
  const overlaysRootId = 'app-overlays-root';
  let root = document.getElementById(overlaysRootId);
  if (!root) {
    root = document.createElement('div');
    root.id = overlaysRootId;
    document.body.appendChild(root);
  }

  const state = {
    lousa: { loaded: false, visible: false, instance: null, container: null },
    notes: { loaded: false, visible: false, instance: null, container: null }
  };

  function createOverlayContainer(name) {
    const c = document.createElement('div');
    c.className = `ui-overlay ui-overlay--${name}`;
    c.setAttribute('data-overlay', name);
    c.innerHTML = `<div class="ui-overlay-header"><button class="ui-overlay-close" data-close="${name}" aria-label="Fechar">✕</button></div><div class="ui-overlay-body" data-body="${name}"></div>`;
    root.appendChild(c);
    return c;
  }

  async function loadAndInit(name) {
    if (name === 'lousa') {
      if (!state.lousa.container) state.lousa.container = createOverlayContainer('lousa').querySelector('[data-body="lousa"]');
      if (!state.lousa.loaded) {
        try {
          const mod = await import('/src/assets/js/components/LousaComponent.js');
          const ctor = mod.default || mod.LousaComponent || mod;
          if (typeof ctor === 'function') {
            state.lousa.instance = new ctor(state.lousa.container);
            state.lousa.loaded = true;
          } else if (typeof mod.init === 'function') {
            await mod.init(state.lousa.container);
            state.lousa.loaded = true;
          } else {
            console.error('Lousa component não expõe constructor/init corretamente:', mod);
            state.lousa.container.innerHTML = '<p>Erro: componente lousa não inicializado.</p>';
            state.lousa.loaded = true;
          }
        } catch (err) {
          console.error('Falha ao importar LousaComponent:', err);
        }
      }
    } else if (name === 'notes') {
      if (!state.notes.container) state.notes.container = createOverlayContainer('notes').querySelector('[data-body="notes"]');
      if (!state.notes.loaded) {
        try {
          const mod = await import('/src/assets/js/components/NotesComponent.js');
          const ctor = mod.default || mod.NotesComponent || mod;
          if (typeof ctor === 'function') {
            state.notes.instance = new ctor(state.notes.container);
            state.notes.loaded = true;
          } else if (typeof mod.init === 'function') {
            await mod.init(state.notes.container);
            state.notes.loaded = true;
          } else {
            console.error('Notes component não expõe constructor/init corretamente:', mod);
            state.notes.container.innerHTML = '<p>Erro: componente notas não inicializado.</p>';
            state.notes.loaded = true;
          }
        } catch (err) {
          console.error('Falha ao importar NotesComponent:', err);
        }
      }
    }
  }

  function showOverlay(name) {
    const overlay = root.querySelector(`.ui-overlay--${name}`);
    if (!overlay) return;
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    if (name === 'lousa') state.lousa.visible = true;
    if (name === 'notes') state.notes.visible = true;
  }
  function hideOverlay(name) {
    const overlay = root.querySelector(`.ui-overlay--${name}`);
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.display = 'none';
    overlay.style.pointerEvents = 'none';
    if (name === 'lousa') state.lousa.visible = false;
    if (name === 'notes') state.notes.visible = false;
  }

  async function toggle(name) {
    if (name === 'lousa') {
      if (!state.lousa.loaded) await loadAndInit('lousa');
      if (state.lousa.visible) hideOverlay('lousa'); else showOverlay('lousa');
    } else if (name === 'notes') {
      if (!state.notes.loaded) await loadAndInit('notes');
      if (state.notes.visible) hideOverlay('notes'); else showOverlay('notes');
    }
  }

  // global event listeners from header/footer
  window.addEventListener('ui:toggle', (ev) => {
    const name = ev.detail && ev.detail.name;
    if (!name) return;
    toggle(name).catch(console.error);
  });

  // click handler for close buttons
  root.addEventListener('click', (e) => {
    const close = e.target.closest('.ui-overlay-close');
    if (!close) return;
    const name = close.getAttribute('data-close');
    if (name) hideOverlay(name);
  });

  // basic styles (append to head)
  const style = document.createElement('style');
  style.textContent = `
    #${overlaysRootId} { position: fixed; right: 12px; bottom: 12px; pointer-events: none; z-index: 9999; }
    .ui-overlay { position: absolute; right: 0; bottom: 48px; width: 25vw; height: 25vh; max-width:480px; max-height:360px; background:#fff; border:1px solid #ddd; box-shadow:0 8px 30px rgba(0,0,0,.25); display:none; opacity:0; transition:opacity .18s; pointer-events:auto; overflow:hidden; border-radius:6px;}
    .ui-overlay-header{display:flex;justify-content:flex-end;padding:6px;background:#f6f6f6;border-bottom:1px solid #eee}
    .ui-overlay-body{width:100%;height:calc(100% - 42px);overflow:auto}
    .ui-overlay-close{background:transparent;border:none;font-size:14px;cursor:pointer;padding:4px}
  `;
  document.head.appendChild(style);

})();