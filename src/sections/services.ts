export function initServices(): void {
  const accordion = document.querySelector<HTMLElement>('[data-services-accordion]');
  if (!accordion) {
    return;
  }

  const triggers = Array.from(accordion.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'));

  const setContentState = (content: HTMLElement | null, isOpen: boolean) => {
    if (!content) {
      return;
    }

    if (isOpen) {
      content.hidden = false;
      content.setAttribute('aria-hidden', 'false');
      content.classList.add('open');
      content.style.maxHeight = `${content.scrollHeight}px`;
      return;
    }

    content.style.maxHeight = '0px';
    content.classList.remove('open');
    content.hidden = true;
    content.setAttribute('aria-hidden', 'true');
  };

  const closeAll = () => {
    triggers.forEach((trigger) => {
      const contentId = trigger.getAttribute('aria-controls');
      const content = contentId ? document.getElementById(contentId) : null;

      trigger.setAttribute('aria-expanded', 'false');
      const icon = trigger.querySelector<HTMLElement>('[data-accordion-indicator]');
      if (icon) {
        icon.classList.remove('is-open');
      }

      setContentState(content, false);
    });
  };

  const focusTriggerByIndex = (index: number) => {
    const safeIndex = (index + triggers.length) % triggers.length;
    triggers[safeIndex]?.focus();
  };

  triggers.forEach((trigger) => {
    const initialContentId = trigger.getAttribute('aria-controls');
    const initialContent = initialContentId ? document.getElementById(initialContentId) : null;
    const isInitiallyExpanded = trigger.getAttribute('aria-expanded') === 'true';
    setContentState(initialContent, isInitiallyExpanded);

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const contentId = trigger.getAttribute('aria-controls');
      const content = contentId ? document.getElementById(contentId) : null;

      closeAll();

      if (isExpanded || !content) {
        return;
      }

      trigger.setAttribute('aria-expanded', 'true');
      const icon = trigger.querySelector<HTMLElement>('[data-accordion-indicator]');
      if (icon) {
        icon.classList.add('is-open');
      }

      setContentState(content, true);
    });

    trigger.addEventListener('keydown', (event) => {
      const currentIndex = triggers.indexOf(trigger);

      switch (event.key) {
        case 'Enter':
        case ' ': {
          event.preventDefault();
          trigger.click();
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          focusTriggerByIndex(currentIndex + 1);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          focusTriggerByIndex(currentIndex - 1);
          break;
        }
        case 'Home': {
          event.preventDefault();
          focusTriggerByIndex(0);
          break;
        }
        case 'End': {
          event.preventDefault();
          focusTriggerByIndex(triggers.length - 1);
          break;
        }
        default:
          break;
      }
    });
  });

  window.addEventListener('resize', () => {
    triggers.forEach((trigger) => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        return;
      }

      const contentId = trigger.getAttribute('aria-controls');
      const content = contentId ? document.getElementById(contentId) : null;
      if (content) {
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}
