/**
 * Toca da Tilápia - Script Principal
 * Funcionalidades:
 * - Verificação de status aberto/fechado em tempo real
 * - Menu mobile responsivo (abrir/fechar/backdrop)
 * - Scroll spy para navegação ativa
 * - Efeito de cabeçalho na rolagem
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatus();
  initMobileMenu();
  initMenuTabs();
  initScrollSpy();
  initHeaderScroll();
});

/**
 * 1. Verificador de Horário de Funcionamento em Tempo Real
 * Horários:
 * - Qua a Sex: 17h às 23h (dias 3, 4, 5)
 * - Sábado: 11h às 23h (dia 6)
 * - Domingo: 11h às 15h (dia 0)
 * - Seg e Ter: Fechado (dias 1 e 2)
 */
function initLiveStatus() {
  const statusBox = document.getElementById('restaurant-status');
  const statusText = document.getElementById('status-text');

  if (!statusBox || !statusText) return;

  function checkStatus() {
    const now = new Date();
    // Obter dia da semana e hora no fuso horário do Brasil
    const options = { timeZone: 'America/Sao_Paulo', hour12: false };
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { ...options, weekday: 'short' }).format(now).toLowerCase();
    const hour = parseInt(new Intl.DateTimeFormat('pt-BR', { ...options, hour: 'numeric' }).format(now), 10);
    const minute = parseInt(new Intl.DateTimeFormat('pt-BR', { ...options, minute: 'numeric' }).format(now), 10);
    const currentDecimalTime = hour + minute / 60;

    let isOpen = false;
    let nextOpening = '';

    // Dia nativo da semana (0: Dom, 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex, 6: Sáb)
    const dayNumber = now.getDay();

    if (dayNumber >= 3 && dayNumber <= 5) {
      // Quarta a Sexta: 17h às 23h
      if (currentDecimalTime >= 17 && currentDecimalTime < 23) {
        isOpen = true;
      } else if (currentDecimalTime < 17) {
        nextOpening = 'Hoje às 17h';
      } else {
        nextOpening = dayNumber === 5 ? 'Amanhã (Sábado) às 11h' : 'Amanhã às 17h';
      }
    } else if (dayNumber === 6) {
      // Sábado: 11h às 23h
      if (currentDecimalTime >= 11 && currentDecimalTime < 23) {
        isOpen = true;
      } else if (currentDecimalTime < 11) {
        nextOpening = 'Hoje às 11h';
      } else {
        nextOpening = 'Amanhã (Domingo) às 11h';
      }
    } else if (dayNumber === 0) {
      // Domingo: 11h às 15h
      if (currentDecimalTime >= 11 && currentDecimalTime < 15) {
        isOpen = true;
      } else if (currentDecimalTime < 11) {
        nextOpening = 'Hoje às 11h';
      } else {
        nextOpening = 'Quarta-feira às 17h';
      }
    } else {
      // Segunda e Terça: Fechado
      nextOpening = 'Quarta-feira às 17h';
    }

    if (isOpen) {
      statusBox.classList.remove('closed');
      statusBox.classList.add('open');
      statusText.textContent = 'Aberto Agora! Venha nos visitar ou faça seu pedido';
    } else {
      statusBox.classList.remove('open');
      statusBox.classList.add('closed');
      statusText.textContent = `Fechado no momento • Abre ${nextOpening}`;
    }
  }

  checkStatus();
  // Atualiza a cada 60 segundos
  setInterval(checkStatus, 60000);
}

/**
 * 2. Menu Mobile Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('menu-close');
  const mobileNav = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fechar com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Scroll Spy para Navegação Ativa
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

/**
 * 4. Efeito de Sombra e Redução no Cabeçalho
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 6px 24px rgba(7, 53, 91, 0.14)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = '0 4px 20px rgba(7, 53, 91, 0.08)';
    }
  }, { passive: true });
}

/**
 * 5. Gerenciamento das Abas do Cardápio (Destaque e PDF A4)
 */
function initMenuTabs() {
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const tabPanes = document.querySelectorAll('.menu-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Botões e links que trocam para a aba específica diretamente
  document.querySelectorAll('[data-switch-tab]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = trigger.getAttribute('data-switch-tab');
      const targetBtn = document.querySelector(`.menu-tab-btn[data-tab="${targetTab}"]`);
      if (targetBtn) {
        targetBtn.click();
        const section = document.getElementById('cardapio');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
