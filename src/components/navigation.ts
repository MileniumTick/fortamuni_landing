const SCROLLED_CLASS = 'nav-scrolled';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function initNavigation(): void {
  const header = document.getElementById('header');
  const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
  let previousFocusedElement: HTMLElement | null = null;

  if (!header) {
    return;
  }

  const handleScroll = () => {
    if (window.scrollY > 16) {
      header.classList.add(SCROLLED_CLASS);
      return;
    }

    header.classList.remove(SCROLLED_CLASS);
  };

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) {
      return;
    }

    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    previousFocusedElement?.focus();
  };

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) {
      return;
    }

    previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : menuToggle;
    mobileMenu.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');

    const focusableElements = getFocusableElements(mobileMenu);
    focusableElements[0]?.focus();
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
        return;
      }

      openMenu();
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!mobileMenu.contains(target) && !menuToggle.contains(target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!mobileMenu.classList.contains('open')) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(mobileMenu);
      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const activeId = visibleEntry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${activeId}`;
          link.classList.toggle('text-accent', isActive);
          link.classList.toggle('font-bold', isActive);
          if (!isActive) {
            link.classList.remove('text-primary');
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-80px 0px -45% 0px',
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}
