import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readProjectFile(relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), 'utf8');
}

describe('brand tokens and accessibility smoke checks', () => {
  it('defines the refreshed semantic brand tokens and focus styles', () => {
    const css = readProjectFile('src/style.css');

    expect(css).toContain('--color-primary: var(--color-brand-blue-800);');
    expect(css).toContain('--color-accent: var(--color-brand-orange-500);');
    expect(css).toContain('--color-success: var(--color-brand-green-500);');
    expect(css).toContain('--color-background: var(--color-brand-blue-050);');
    expect(css).toContain('--color-foreground: var(--color-brand-slate-700);');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('outline: 2px solid var(--color-ring);');
    expect(css).toContain('.accordion-indicator.is-open');
  });

  it('keeps accordion markup wired for accessible disclosure behavior', () => {
    const homepage = readProjectFile('src/pages/index.astro');
    const triggerCount = (homepage.match(/data-accordion-trigger/g) ?? []).length;
    const contentCount = (homepage.match(/data-accordion-content/g) ?? []).length;
    const regionCount = (homepage.match(/role="region"/g) ?? []).length;

    expect(triggerCount).toBe(4);
    expect(contentCount).toBe(4);
    expect(regionCount).toBe(4);
    expect(homepage).toContain('aria-expanded="true"');
    expect(homepage).toContain('aria-expanded="false"');
    expect(homepage).toContain('aria-labelledby="servicio-pvqcd-trigger"');
  });
});
