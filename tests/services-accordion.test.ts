// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { initServices } from '../src/sections/services';

function createAccordionFixture(): void {
  document.body.innerHTML = `
    <div data-services-accordion>
      <button type="button" aria-expanded="true" aria-controls="panel-1" id="trigger-1" data-accordion-trigger>
        Servicio 1
        <span class="accordion-indicator is-open" data-accordion-indicator></span>
      </button>
      <div id="panel-1" class="accordion-content open" role="region" aria-labelledby="trigger-1" data-accordion-content></div>

      <button type="button" aria-expanded="false" aria-controls="panel-2" id="trigger-2" data-accordion-trigger>
        Servicio 2
        <span class="accordion-indicator" data-accordion-indicator></span>
      </button>
      <div id="panel-2" class="accordion-content" role="region" aria-labelledby="trigger-2" data-accordion-content></div>

      <button type="button" aria-expanded="false" aria-controls="panel-3" id="trigger-3" data-accordion-trigger>
        Servicio 3
        <span class="accordion-indicator" data-accordion-indicator></span>
      </button>
      <div id="panel-3" class="accordion-content" role="region" aria-labelledby="trigger-3" data-accordion-content></div>

      <button type="button" aria-expanded="false" aria-controls="panel-4" id="trigger-4" data-accordion-trigger>
        Servicio 4
        <span class="accordion-indicator" data-accordion-indicator></span>
      </button>
      <div id="panel-4" class="accordion-content" role="region" aria-labelledby="trigger-4" data-accordion-content></div>
    </div>
  `;

  [120, 160, 200, 240].forEach((height, index) => {
    const content = document.getElementById(`panel-${index + 1}`) as HTMLDivElement;
    Object.defineProperty(content, 'scrollHeight', {
      configurable: true,
      value: height
    });
  });
}

function dispatchKey(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
}

describe('services accordion', () => {
  it('opens the clicked panel and closes the rest', () => {
    createAccordionFixture();
    initServices();

    const firstTrigger = document.getElementById('trigger-1') as HTMLButtonElement;
    const secondTrigger = document.getElementById('trigger-2') as HTMLButtonElement;
    const firstContent = document.getElementById('panel-1') as HTMLDivElement;
    const secondContent = document.getElementById('panel-2') as HTMLDivElement;

    expect(firstContent.hidden).toBe(false);
    expect(firstContent.getAttribute('aria-hidden')).toBe('false');
    expect(firstContent.style.maxHeight).toBe('120px');
    expect(secondContent.hidden).toBe(true);
    expect(secondContent.getAttribute('aria-hidden')).toBe('true');

    secondTrigger.click();

    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(firstContent.hidden).toBe(true);
    expect(firstContent.style.maxHeight).toBe('0px');
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(secondContent.hidden).toBe(false);
    expect(secondContent.getAttribute('aria-hidden')).toBe('false');
    expect(secondContent.style.maxHeight).toBe('160px');
    expect(secondTrigger.querySelector('[data-accordion-indicator]')?.classList.contains('is-open')).toBe(true);
  });

  it('supports keyboard activation and roving focus keys', () => {
    createAccordionFixture();
    initServices();

    const firstTrigger = document.getElementById('trigger-1') as HTMLButtonElement;
    const secondTrigger = document.getElementById('trigger-2') as HTMLButtonElement;
    const thirdTrigger = document.getElementById('trigger-3') as HTMLButtonElement;
    const fourthTrigger = document.getElementById('trigger-4') as HTMLButtonElement;
    const thirdContent = document.getElementById('panel-3') as HTMLDivElement;

    firstTrigger.focus();
    dispatchKey(firstTrigger, 'ArrowDown');
    expect(document.activeElement).toBe(secondTrigger);

    dispatchKey(secondTrigger, 'End');
    expect(document.activeElement).toBe(fourthTrigger);

    dispatchKey(fourthTrigger, 'Home');
    expect(document.activeElement).toBe(firstTrigger);

    dispatchKey(firstTrigger, 'ArrowUp');
    expect(document.activeElement).toBe(fourthTrigger);

    dispatchKey(fourthTrigger, 'ArrowDown');
    expect(document.activeElement).toBe(firstTrigger);

    thirdTrigger.focus();
    dispatchKey(thirdTrigger, 'Enter');

    expect(thirdTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(thirdContent.hidden).toBe(false);
    expect(thirdContent.style.maxHeight).toBe('200px');

    dispatchKey(thirdTrigger, ' ');

    expect(thirdTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(thirdContent.hidden).toBe(true);
    expect(thirdContent.style.maxHeight).toBe('0px');
  });
});
