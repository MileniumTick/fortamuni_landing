function getHeaderOffset(): number {
  const header = document.getElementById('header');
  return header ? header.offsetHeight + 12 : 96;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initSmoothScroll(): void {
  const anchorLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector<HTMLElement>(href);
      if (!target) {
        return;
      }

      event.preventDefault();

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }

      window.scrollTo({
        top: offsetTop,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });

      window.history.replaceState(null, '', href);
      window.setTimeout(
        () => {
          target.focus({ preventScroll: true });
        },
        prefersReducedMotion() ? 0 : 250,
      );
    });
  });
}
