import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('app/globals.css', 'utf8');

test('all shared cover renderers use proportional fill without a media-wide contain override', () => {
  assert.match(css, /\.story-cover\s*\{[^}]*object-fit:\s*cover;/);
  assert.doesNotMatch(css, /img\[src\^?=[^\]]*news-media[^\]]*\]\s*\{[^}]*object-fit:\s*contain/);
  for (const file of ['components/reference-home.tsx', 'components/story-components.tsx', 'app/(site)/post/[slug]/view.tsx']) {
    const source = readFileSync(file, 'utf8');
    const images = [...source.matchAll(/<img\b[^>]*\/>/g)];
    assert.ok(images.length, `${file}: cover renderer required`);
    for (const [image] of images) assert.ok(image.includes('story-cover'), `${file}: every cover needs the shared fit class`);
  }
});

test('body images keep their complete natural proportions and speaker covers retain a safe focal point', () => {
  assert.match(css, /\.markdown-body img\s*\{[^}]*max-width:\s*100%;[^}]*height:\s*auto;/);
  assert.match(css, /\.story-cover\[src="\/news-media\/2026-10-03\/dario-amodei-techcrunch-2023\.jpg"\]\s*\{[^}]*object-position:\s*50% 35%;/);
  assert.doesNotMatch(readFileSync('components/article-markdown.tsx', 'utf8'), /story-cover/);
});
