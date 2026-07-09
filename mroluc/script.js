/* ==========================================================================
   MR. OLUC AMBIENTAL - SCRIPT DE INTERATIVIDADE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================
     1. TEMA CLARO / ESCURO (PERSISTENTE)
     ========================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  
  // Verifica se há preferência salva no localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
  
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  });
  
  function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector("i");
    if (isDark) {
      icon.className = "fa-solid fa-sun";
    } else {
      icon.className = "fa-solid fa-moon";
    }
  }

  /* ==========================================
     2. EXPEDIENTE COMERCIAL EM TEMPO REAL
     ========================================== */
  function updateBusinessStatus() {
    const statusText = document.getElementById("business-status");
    const statusDot = document.querySelector(".status-dot");
    
    if (!statusText || !statusDot) return;
    
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // Tempo atual em minutos desde a meia-noite
    
    // Horários em minutos
    const openTime = 8 * 60; // 08h = 470 min
    const closeTimeWeek = 18 * 60; // 18h00 = 1020 min
    const closeTimeSat = 12 * 60; // 12h00 = 780 min
    
    let isOpen = false;
    let nextState = "";
    
    if (day >= 1 && day <= 5) {
      // Segunda a Sexta
      if (currentTime >= openTime && currentTime < closeTimeWeek) {
        isOpen = true;
        nextState = "Aberto agora (Fecha às 18h00)";
      } else if (currentTime < openTime) {
        isOpen = false;
        nextState = "Fechado (Abre hoje às 08h00)";
      } else {
        isOpen = false;
        // Se for sexta depois das 18h, o próximo é sábado
        if (day === 5) {
          nextState = "Fechado (Abre amanhã às 08h00)";
        } else {
          nextState = "Fechado (Abre amanhã às 08h00)";
        }
      }
    } else if (day === 6) {
      // Sábado
      if (currentTime >= openTime && currentTime < closeTimeSat) {
        isOpen = true;
        nextState = "Aberto agora (Fecha às 12h00)";
      } else if (currentTime < openTime) {
        isOpen = false;
        nextState = "Fechado (Abre hoje às 08h00)";
      } else {
        isOpen = false;
        nextState = "Fechado (Abre segunda às 08h00)";
      }
    } else {
      // Domingo
      isOpen = false;
      nextState = "Fechado (Abre segunda às 08h00)";
    }
    
    // Atualiza a interface
    statusText.innerText = nextState;
    if (isOpen) {
      statusDot.className = "status-dot green";
    } else {
      statusDot.className = "status-dot yellow"; // Usa amarelo para fora do expediente comercial
    }
  }
  
  // Roda uma vez de início e atualiza a cada minuto
  updateBusinessStatus();
  setInterval(updateBusinessStatus, 60000);

  /* ==========================================
     3. MENU MOBILE DRAWER
     ========================================== */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });
  
  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
  
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  });

  /* ==========================================
     4. SIMULADOR DE COLETA & WHATSAPP DYNAMIC PREVIEW
     ========================================== */
  const rangeInput = document.getElementById("waste-volume-range");
  const numberInput = document.getElementById("waste-volume");
  const companyInput = document.getElementById("company-name");
  const addressInput = document.getElementById("collection-address");
  const wasteTypeSelect = document.getElementById("waste-type");
  const chatPreviewText = document.getElementById("chat-preview-text");
  const volumeAlert = document.getElementById("volume-alert");
  const simulatorForm = document.getElementById("waste-simulator-form");
  const chatTime = document.getElementById("chat-time");

  // Ajusta a hora da mensagem de simulação com a hora real
  if (chatTime) {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    chatTime.innerText = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  // Sincroniza Slider -> Número
  rangeInput.addEventListener("input", (e) => {
    numberInput.value = e.target.value;
    updateSimulatorPreview();
  });

  // Sincroniza Número -> Slider
  numberInput.addEventListener("input", (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 100;
    if (value < 100) value = 100;
    if (value > 50000) value = 50000;
    
    rangeInput.value = Math.min(value, 10000); // Slider trava em 10.000, mas número aceita mais
    updateSimulatorPreview();
  });

  // Escuta mudanças nos inputs de texto e selects
  companyInput.addEventListener("input", updateSimulatorPreview);
  addressInput.addEventListener("input", updateSimulatorPreview);
  wasteTypeSelect.addEventListener("change", updateSimulatorPreview);

  function updateSimulatorPreview() {
    const company = companyInput.value.trim() || "[Informe o nome da empresa]";
    const address = addressInput.value.trim() || "[Informe o endereço de coleta]";
    const waste = wasteTypeSelect.value;
    const volume = numberInput.value;
    
    // Alerta de volume alto (> 1000 Litros)
    if (parseInt(volume) >= 1000) {
      volumeAlert.classList.remove("hidden");
    } else {
      volumeAlert.classList.add("hidden");
    }

    // Atualiza texto no chat simulado
    chatPreviewText.innerHTML = `
      Olá! Gostaria de agendar uma coleta.<br>
      1️⃣ <strong>Empresa:</strong> ${company}<br>
      2️⃣ <strong>Endereço:</strong> ${address}<br>
      3️⃣ <strong>Resíduo:</strong> ${waste}<br>
      4️⃣ <strong>Volume aproximado:</strong> ${volume} Litros
    `;
  }

  // Envio do formulário do simulador
  simulatorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const company = companyInput.value.trim();
    const address = addressInput.value.trim();
    const waste = wasteTypeSelect.value;
    const volume = numberInput.value;
    
    // Formata o texto final para envio ao WhatsApp
    const message = `Olá! 👋

Seja bem-vindo à MR. OLUC Ambiental.

Atuamos na coleta e destinação ambientalmente correta de resíduos.

Para agilizar meu atendimento, informo os dados da coleta:

1️⃣ Nome da empresa: ${company}
2️⃣ Endereço da coleta: ${address}
3️⃣ Tipo de resíduo: ${waste}
4️⃣ Volume aproximado: ${volume} L

Aguardando retorno com orçamento e agendamento da frota.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "556195235000";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abre em nova janela
    window.open(whatsappURL, "_blank");
  });

  /* ==========================================
     5. FILTRO DE NOTÍCIAS
     ========================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const newsCards = document.querySelectorAll(".news-card");
  
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove classe ativa de todos os botões e adiciona no clicado
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      const category = button.getAttribute("data-category");
      
      newsCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        
        if (category === "all" || cardCategory === category) {
          card.style.display = "flex";
          // Adiciona leve animação de fade in
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transition = "opacity 0.4s ease";
          }, 50);
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ==========================================
     6. FAQ ACCORDION
     ========================================== */
  const faqQuestions = document.querySelectorAll(".faq-question");
  
  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const parentItem = question.parentElement;
      const isActive = parentItem.classList.contains("active");
      
      // Fecha todos os itens abertos
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
      });
      
      // Abre o clicado apenas se não estava ativo antes
      if (!isActive) {
        parentItem.classList.add("active");
      }
    });
  });
});
