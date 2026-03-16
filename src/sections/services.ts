export function initServices(): void {
  const accordion = document.querySelector<HTMLElement>('[data-services-accordion]');
  if (!accordion) {
    return;
  }

  const triggers = Array.from(accordion.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'));

  const closeAll = () => {
    triggers.forEach((trigger) => {
      const contentId = trigger.getAttribute('aria-controls');
      const content = contentId ? document.getElementById(contentId) : null;

      trigger.setAttribute('aria-expanded', 'false');
      const icon = trigger.querySelector('span[aria-hidden="true"]');
      if (icon) {
        icon.textContent = '+';
      }

      content?.classList.remove('open');
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = contentId ? document.getElementById(contentId) : null;

      closeAll();

      if (isExpanded || !content) {
        return;
      }

      trigger.setAttribute('aria-expanded', 'true');
      const icon = trigger.querySelector('span[aria-hidden="true"]');
      if (icon) {
        icon.textContent = '−';
      }

      content.classList.add('open');
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      trigger.click();
    });
  });
}
