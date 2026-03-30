import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readProjectFile(relativePath: string): string {
  return readFileSync(path.join(rootDir, relativePath), 'utf8');
}

describe('layout metadata and brand assets', () => {
  it('wires refreshed metadata and identity assets in the shared layout', () => {
    const layout = readProjectFile('src/layouts/Layout.astro');

    expect(layout).toContain('<meta name="theme-color" content="#15558c" />');
    expect(layout).toContain('<meta name="color-scheme" content="light" />');
    expect(layout).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
    expect(layout).toContain('ogImage = "https://fortamuni.com/og-image.webp"');
    expect(layout).toContain('src="/fortamuni-mark.svg"');
    expect(layout).toContain('src="/fortamuni-logo.svg"');
    expect(layout).toContain('href="#contenido-principal"');
  });

  it('keeps the expected public brand files available', () => {
    const assets = [
      'public/favicon.svg',
      'public/fortamuni-mark.svg',
      'public/fortamuni-logo.svg',
      'public/og-image.webp'
    ];

    assets.forEach((asset) => {
      expect(existsSync(path.join(rootDir, asset)), asset).toBe(true);
    });
  });
});
