import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const homepage = readFileSync(path.join(rootDir, 'src/pages/index.astro'), 'utf8');

describe('homepage brand surfaces', () => {
  it('renders the refreshed hero, trust, and services surfaces', () => {
    expect(homepage).toContain('Fortamuni | Gestión vial municipal con respaldo técnico');
    expect(homepage).toContain('class="brand-hero-glow relative overflow-hidden');
    expect(homepage).toContain('Confianza y respaldo');
    expect(homepage).toContain('Diagnóstico técnico inicial');
    expect(homepage).toContain('data-services-accordion');
    expect(homepage).toContain('/fortamuni-mark.svg');
    expect(homepage).toContain('brand-chip rounded-full');
  });

  it('publishes homepage structured data with the refreshed brand identity', () => {
    expect(homepage).toContain('"@type": "ProfessionalService"');
    expect(homepage).toContain('"name": "Fortamuni"');
    expect(homepage).toContain('const logoImage = \'https://fortamuni.cr/fortamuni-logo.svg\';');
    expect(homepage).toContain('"image": "https://fortamuni.cr/og-image.jpg"');
  });
});
